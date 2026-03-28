import { useRef, useCallback, useEffect } from 'react';
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
            className={`p-1.5 rounded-lg transition-colors ${
                active
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
            {children}
        </button>
    );
}

function Separator() {
    return <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 250 }: Props) {
    const { t } = useTranslation();
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);

    // Sync external value changes
    useEffect(() => {
        if (editorRef.current && !isInternalChange.current) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value;
            }
        }
        isInternalChange.current = false;
    }, [value]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            isInternalChange.current = true;
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const exec = useCallback((command: string, val?: string) => {
        document.execCommand(command, false, val);
        editorRef.current?.focus();
        handleInput();
    }, [handleInput]);

    const insertVariable = useCallback((variable: string) => {
        exec('insertText', `{{ ${variable} }}`);
    }, [exec]);

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                {/* Text style */}
                <ToolBtn onClick={() => exec('bold')} title="Bold">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('italic')} title="Italic">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('underline')} title="Underline">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>
                </ToolBtn>

                <Separator />

                {/* Colors */}
                <div className="relative">
                    <input
                        type="color"
                        className="w-7 h-7 rounded cursor-pointer border border-gray-200 dark:border-gray-600"
                        title={t('Text color')}
                        onChange={e => exec('foreColor', e.target.value)}
                        defaultValue="#111827"
                    />
                </div>
                <div className="relative">
                    <input
                        type="color"
                        className="w-7 h-7 rounded cursor-pointer border border-gray-200 dark:border-gray-600"
                        title={t('Background color')}
                        onChange={e => exec('hiliteColor', e.target.value)}
                        defaultValue="#fef3c7"
                    />
                </div>

                <Separator />

                {/* Headings */}
                <ToolBtn onClick={() => exec('formatBlock', 'h2')} title="Heading">
                    <span className="text-xs font-black">H</span>
                </ToolBtn>
                <ToolBtn onClick={() => exec('formatBlock', 'h3')} title="Subheading">
                    <span className="text-[10px] font-bold">H2</span>
                </ToolBtn>
                <ToolBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph">
                    <span className="text-xs font-medium">P</span>
                </ToolBtn>

                <Separator />

                {/* Alignment */}
                <ToolBtn onClick={() => exec('justifyLeft')} title="Align left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M3 6h18M3 12h12M3 18h18" /></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('justifyCenter')} title="Align center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M3 6h18M6 12h12M3 18h18" /></svg>
                </ToolBtn>

                <Separator />

                {/* Lists */}
                <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet list">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                </ToolBtn>
                <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered list">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                </ToolBtn>

                <Separator />

                {/* Link */}
                <ToolBtn onClick={() => { const url = prompt('URL:'); if (url) exec('createLink', url); }} title="Insert link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.56a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.19 8.688" /></svg>
                </ToolBtn>

                {/* Clear formatting */}
                <ToolBtn onClick={() => exec('removeFormat')} title={t('Clear formatting')}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83a1.125 1.125 0 011.59 0l6.375 6.375a1.125 1.125 0 010 1.59L11.01 19.17a1.125 1.125 0 01-1.59 0z" /></svg>
                </ToolBtn>
            </div>

            {/* Editable area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="px-5 py-4 outline-none text-sm text-gray-900 dark:text-white leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                style={{ minHeight }}
                data-placeholder={placeholder}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        </div>
    );
}
