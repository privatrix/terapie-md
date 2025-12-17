"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered, Heading2, Heading3, Code } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const [showHtml, setShowHtml] = useState(false);

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if not focused to avoid cursor jumping, 
            // or if we are coming back from HTML mode
            if (!editor.isFocused || showHtml === false) {
                // Actually we only strictly need to sync if we edited properly externally
                // But for this simple implementation:
                // If we match exactly, do nothing.
                // If we don't match, set content.
                editor.commands.setContent(value);
            }
        }
    }, [value, editor, showHtml]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="space-y-2 border rounded-md p-2 bg-white">
            <div className="flex flex-wrap gap-1 border-b pb-2 mb-2 justify-between">
                <div className="flex flex-wrap gap-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        disabled={showHtml}
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        disabled={showHtml}
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        disabled={showHtml}
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        disabled={showHtml}
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 3 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        disabled={showHtml}
                    >
                        <Heading3 className="h-4 w-4" />
                    </Toggle>
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={showHtml}
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={showHtml}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('link')}
                        onPressedChange={setLink}
                        disabled={showHtml}
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <Toggle
                        size="sm"
                        pressed={showHtml}
                        onPressedChange={() => setShowHtml(!showHtml)}
                        className="gap-2"
                    >
                        <Code className="h-4 w-4" />
                        <span className="text-xs">{showHtml ? "Visual" : "HTML"}</span>
                    </Toggle>
                </div>
            </div>

            {showHtml ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-[300px] min-h-[300px] p-4 font-mono text-sm bg-slate-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter HTML here..."
                />
            ) : (
                <EditorContent editor={editor} />
            )}
        </div>
    );
}
