import { useState, useRef, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface Message {
    id: string;
    role: 'bot' | 'user';
    content: string;
    typed?: boolean; // true once typing animation is complete
}

const SESSION_KEY = 'na_chatbot_messages';
const REMAINING_KEY = 'na_chatbot_remaining';

/** Linkify URLs and paths like /contact into clickable links */
function linkify(text: string): (string | JSX.Element)[] {
    const parts = text.split(/(https?:\/\/[^\s]+|\/[a-z][a-z0-9\-\/]*)/gi);
    return parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-teal-400 underline underline-offset-2 hover:text-teal-300 transition-colors">{part}</a>;
        }
        if (/^\/[a-z]/.test(part)) {
            return <a key={i} href={part} className="text-teal-400 underline underline-offset-2 hover:text-teal-300 transition-colors">{part}</a>;
        }
        return part;
    });
}

/** Typing animation for bot messages */
function TypedBotMessage({ content, onComplete }: { content: string; onComplete: () => void }) {
    const [displayed, setDisplayed] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayed('');
        const interval = setInterval(() => {
            indexRef.current++;
            if (indexRef.current >= content.length) {
                setDisplayed(content);
                clearInterval(interval);
                onComplete();
            } else {
                setDisplayed(content.slice(0, indexRef.current));
            }
        }, 18); // 18ms per character — fast but visible
        return () => clearInterval(interval);
    }, [content]);

    return <>{linkify(displayed)}<span className="inline-block w-0.5 h-4 bg-teal-400 ml-0.5 animate-pulse align-middle" style={{ display: displayed.length < content.length ? 'inline-block' : 'none' }} /></>;
}

function getStoredMessages(): Message[] {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        const msgs: Message[] = raw ? JSON.parse(raw) : [];
        // Mark all restored messages as already typed
        return msgs.map(m => ({ ...m, typed: true }));
    } catch {
        return [];
    }
}

function storeMessages(messages: Message[]) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {
        // sessionStorage full or unavailable
    }
}

function getStoredRemaining(): number | null {
    try {
        const raw = sessionStorage.getItem(REMAINING_KEY);
        return raw !== null ? parseInt(raw, 10) : null;
    } catch {
        return null;
    }
}

function storeRemaining(remaining: number) {
    try {
        sessionStorage.setItem(REMAINING_KEY, String(remaining));
    } catch {
        // ignore
    }
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [remaining, setRemaining] = useState<number>(3);
    const [rateLimited, setRateLimited] = useState(false);
    const [closing, setClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => { setClosing(false); onClose(); }, 300);
    };

    // Load stored messages on mount
    useEffect(() => {
        const stored = getStoredMessages();
        if (stored.length > 0) {
            setMessages(stored);
        } else {
            const welcome: Message = {
                id: 'welcome',
                role: 'bot',
                content: t('Bonjour ! Je peux répondre à vos questions sur nos services, nos tarifs et nos projets. Que souhaitez-vous savoir ?'),
                typed: true, // Welcome message doesn't animate
            };
            setMessages([welcome]);
            storeMessages([welcome]);
        }
        const storedRemaining = getStoredRemaining();
        if (storedRemaining !== null) {
            setRemaining(storedRemaining);
            if (storedRemaining <= 0) {
                setRateLimited(true);
            }
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !rateLimited) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, rateLimited]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || isLoading || rateLimited) return;

        const userMsg: Message = {
            id: 'user-' + Date.now(),
            role: 'user',
            content: text,
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        storeMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') || '' : '';

            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ message: text }),
            });

            if (response.status === 429) {
                const data = await response.json();
                setRateLimited(true);
                setRemaining(0);
                storeRemaining(0);
                const limitMsg: Message = {
                    id: 'limit-' + Date.now(),
                    role: 'bot',
                    content: data.error || t('Vous avez atteint la limite de messages. Réessayez demain.'),
                };
                const updatedMessages = [...newMessages, limitMsg];
                setMessages(updatedMessages);
                storeMessages(updatedMessages);
            } else if (response.ok) {
                const data = await response.json();
                if (data.available === false) {
                    const botMsg: Message = {
                        id: 'bot-' + Date.now(),
                        role: 'bot',
                        content: t('L\'assistant est temporairement indisponible. Contactez-nous directement.'),
                    };
                    const updatedMessages = [...newMessages, botMsg];
                    setMessages(updatedMessages);
                    storeMessages(updatedMessages);
                } else {
                    const botMsg: Message = {
                        id: 'bot-' + Date.now(),
                        role: 'bot',
                        content: data.reply || t('Désolé, une erreur est survenue.'),
                    };
                    const updatedMessages = [...newMessages, botMsg];
                    setMessages(updatedMessages);
                    storeMessages(updatedMessages);
                    if (data.remaining !== undefined) {
                        setRemaining(data.remaining);
                        storeRemaining(data.remaining);
                        if (data.remaining <= 0) {
                            setRateLimited(true);
                        }
                    }
                }
            } else {
                const botMsg: Message = {
                    id: 'bot-' + Date.now(),
                    role: 'bot',
                    content: t('L\'assistant est temporairement indisponible. Réessayez plus tard.'),
                };
                const updatedMessages = [...newMessages, botMsg];
                setMessages(updatedMessages);
                storeMessages(updatedMessages);
            }
        } catch {
            const botMsg: Message = {
                id: 'bot-' + Date.now(),
                role: 'bot',
                content: t('Erreur de connexion. Vérifiez votre connexion internet.'),
            };
            const updatedMessages = [...newMessages, botMsg];
            setMessages(updatedMessages);
            storeMessages(updatedMessages);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <style>{`
                @keyframes chatModalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes chatOverlayIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes chatOverlayOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes chatModalOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.95) translateY(20px); } }
                @keyframes typingDot {
                    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
                    30% { opacity: 1; transform: translateY(-4px); }
                }
            `}</style>

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                style={{ animation: `${closing ? 'chatOverlayOut' : 'chatOverlayIn'} 0.3s ease-out forwards` }}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
                style={{ maxHeight: '80vh', animation: `${closing ? 'chatModalOut' : 'chatModalIn'} 0.3s ease-out forwards` }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">NA Innovations</h3>
                            <p className="text-teal-400 text-xs">{t('Assistant IA')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{remaining}/3 {t('restants')}</span>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '50vh' }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'bot' && (
                                <div className="w-8 h-8 bg-teal-400/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                    msg.role === 'user'
                                        ? 'bg-teal-500 text-white rounded-br-md'
                                        : 'bg-white/5 text-gray-300 rounded-tl-none'
                                }`}
                            >
                                {msg.role === 'bot' && !msg.typed ? (
                                    <TypedBotMessage content={msg.content} onComplete={() => {
                                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, typed: true } : m));
                                    }} />
                                ) : msg.role === 'bot' ? (
                                    <>{linkify(msg.content)}</>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 bg-teal-400/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                            </div>
                            <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'typingDot 1.4s infinite ease-in-out 0s' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'typingDot 1.4s infinite ease-in-out 0.2s' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'typingDot 1.4s infinite ease-in-out 0.4s' }} />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-white/10 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={rateLimited ? t('Limite atteinte') : t('Tapez votre question...')}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none transition-colors"
                            disabled={rateLimited || isLoading}
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading || rateLimited}
                            className="px-4 py-3 bg-teal-400 text-gray-900 rounded-xl font-bold text-sm hover:bg-teal-300 disabled:opacity-30 transition-all flex-shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                    {rateLimited && (
                        <p className="text-xs text-red-400 mt-2 text-center">{t('Limite quotidienne atteinte. Contactez-nous directement pour plus d\'aide.')}</p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

/**
 * Small floating "Ask AI" button for non-landing pages (Services, About, Projects, etc.)
 * Checks /api/chatbot/status on mount and hides if unavailable.
 */
export default function ChatWidget() {
    const { t } = useTranslation();
    const [chatAvailable, setChatAvailable] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        fetch('/api/chatbot/status')
            .then(r => r.json())
            .then(data => setChatAvailable(data.available))
            .catch(() => setChatAvailable(false));
    }, []);

    if (!chatAvailable) return null;

    return (
        <>
            {/* Small subtle floating button */}
            <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-gray-900/90 backdrop-blur-sm border border-white/10 rounded-full text-white/70 hover:text-teal-300 hover:border-teal-400/30 transition-all duration-300 group shadow-lg"
                title={t('Assistant IA')}
            >
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-xs font-medium">{t('Ask AI')}</span>
            </button>

            <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </>
    );
}
