import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
}

function ToolBtn({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            title={title}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                active
                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/30'
                    : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
            {children}
        </button>
    );
}

function Separator() {
    return <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 250 }: Props) {
    const { t } = useTranslation();
    const editorRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);
    const [linkModal, setLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const linkInputRef = useRef<HTMLInputElement>(null);
    const savedSelection = useRef<Range | null>(null);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const [focused, setFocused] = useState(false);

    // Set initial content ONCE on mount
    useEffect(() => {
        if (editorRef.current && !initialized.current) {
            editorRef.current.innerHTML = value || '';
            initialized.current = true;
        }
    }, []);

    // Sync from external prop changes ONLY when editor is not focused
    useEffect(() => {
        if (!initialized.current || !editorRef.current) return;
        const el = editorRef.current;
        if (el === document.activeElement || el.contains(document.activeElement)) return;
        if (el.innerHTML !== value) {
            el.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveFormats();
    }, [onChange]);

    // Track which formats are active at cursor position
    const updateActiveFormats = useCallback(() => {
        const formats = new Set<string>();
        if (document.queryCommandState('bold')) formats.add('bold');
        if (document.queryCommandState('italic')) formats.add('italic');
        if (document.queryCommandState('underline')) formats.add('underline');
        if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
        if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
        if (document.queryCommandState('insertOrderedList')) formats.add('ol');
        const block = document.queryCommandValue('formatBlock');
        if (block) formats.add(block.toLowerCase());
        setActiveFormats(formats);
    }, []);

    // Paste as clean text — strip external styles/backgrounds.
    // If the pasted content is raw HTML source code, insert as HTML so tags render.
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const looksLikeHtml = /^\s*<\/?[a-z][\s\S]*>\s*$/i.test(text) && /<\/?[a-z]+[^>]*>/i.test(text);
        if (looksLikeHtml) {
            document.execCommand('insertHTML', false, text);
        } else {
            document.execCommand('insertText', false, text);
        }
    }, []);

    const exec = useCallback((command: string, val?: string) => {
        document.execCommand(command, false, val);
        editorRef.current?.focus();
        handleInput();
    }, [handleInput]);

    const isEmpty = !value || value === '<br>' || value === '<div><br></div>' || value.replace(/<[^>]*>/g, '').trim() === '';

    return (
        <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${
            focused
                ? 'border-teal-400 dark:border-teal-500 ring-2 ring-teal-400/20 dark:ring-teal-500/20 bg-white dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-1.5 bg-gray-50/80 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700/50">
                {/* Text style */}
                <ToolBtn onClick={() => exec('bold')} active={activeFormats.has('bold')} title={t('Gras')}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('italic')} active={activeFormats.has('italic')} title={t('Italique')}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('underline')} active={activeFormats.has('underline')} title={t('Souligné')}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('strikeThrough')} active={activeFormats.has('strikeThrough')} title={t('Barré')}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
                </ToolBtn>

                <Separator />

                {/* Link */}
                <ToolBtn onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                        savedSelection.current = sel.getRangeAt(0).cloneRange();
                        setLinkText(sel.toString().trim());
                    } else {
                        setLinkText('');
                    }
                    setLinkUrl('https://');
                    setLinkModal(true);
                    setTimeout(() => linkInputRef.current?.select(), 50);
                }} title={t('Insérer un lien')}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.56a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.19 8.688" /></svg>
                </ToolBtn>
            </div>

            {/* Editable area */}
            <div className="relative">
                {isEmpty && !focused && placeholder && (
                    <div className="absolute inset-0 px-5 py-4 text-sm text-gray-400 dark:text-gray-600 pointer-events-none select-none">
                        {placeholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onPaste={handlePaste}
                    onFocus={() => { setFocused(true); updateActiveFormats(); }}
                    onBlur={() => setFocused(false)}
                    onKeyUp={updateActiveFormats}
                    onMouseUp={updateActiveFormats}
                    className="px-5 py-4 outline-none text-sm text-gray-900 dark:text-white leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                    style={{ minHeight }}
                />
            </div>

            {/* Link modal */}
            {linkModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-backdrop" onClick={() => setLinkModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 overflow-hidden animate-modal" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.56a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.19 8.688" /></svg>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Insérer un lien')}</h3>
                            </div>
                            <button onClick={() => setLinkModal(false)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Selected text preview */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t('Texte sélectionné')}</label>
                                {linkText ? (
                                    <div className="px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                                        <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">"{linkText}"</span>
                                    </div>
                                ) : (
                                    <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                        <span className="text-xs text-amber-600 dark:text-amber-400">{t('Aucun texte sélectionné — le lien sera inséré à la position du curseur')}</span>
                                    </div>
                                )}
                            </div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label>
                            <input
                                ref={linkInputRef}
                                type="url"
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); insertLink(); } if (e.key === 'Escape') setLinkModal(false); }}
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="https://example.com"
                            />
                            <div className="flex justify-end gap-2 mt-5">
                                <button onClick={() => setLinkModal(false)} className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    {t('Annuler')}
                                </button>
                                <button
                                    onClick={insertLink}
                                    disabled={!linkUrl || linkUrl === 'https://'}
                                    className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {t('Insérer')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );

    function insertLink() {
        if (!linkUrl || linkUrl === 'https://') return;
        setLinkModal(false);

        if (savedSelection.current && editorRef.current) {
            editorRef.current.focus();
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedSelection.current);
            }
        }

        document.execCommand('createLink', false, linkUrl);
        handleInput();
        setLinkUrl('');
        savedSelection.current = null;
    }
}
