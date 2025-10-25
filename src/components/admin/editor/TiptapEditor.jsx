"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

export default function TiptapEditor({
  title = "",
  initialContent = "",
  onChange,
  onSubmit,
  placeholders = { title: "Başlıq", editor: "Məzmunu yazın..." },
  minHeight = 500,
}) {
  const [pageTitle, setPageTitle] = useState(title);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Highlight,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base max-w-none focus:outline-none`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.({ html: editor.getHTML(), json: editor.getJSON() });
    },
  });

  const handlePasteImage = useCallback((e) => {
    if (!editor) return;
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = () => {
          editor.chain().focus().setImage({ src: reader.result }).run();
        };
        reader.readAsDataURL(file);
        e.preventDefault();
      }
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const el = editor.view.dom;
    el.addEventListener("paste", handlePasteImage);
    return () => el.removeEventListener("paste", handlePasteImage);
  }, [editor, handlePasteImage]);

  return (
    <div className="admin-wrapper">
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          placeholder={placeholders.title}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => onSubmit?.({ title: pageTitle, html: editor?.getHTML(), json: editor?.getJSON() })}
          className="shrink-0 ml-3 px-4 py-2 rounded-md bg-primary text-white hover:opacity-90"
        >
          Yadda saxla
        </button>
      </div>

      <div className="rounded-md border bg-white">
        {/* Toolbar (minimal) */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-2 py-1 text-sm rounded ${editor?.isActive('bold') ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>B</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-sm rounded ${editor?.isActive('italic') ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}><i>I</i></button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`px-2 py-1 text-sm rounded ${editor?.isActive('underline') ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>U</button>
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="px-2 py-1 text-sm rounded hover:bg-gray-100">Sol</button>
          <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="px-2 py-1 text-sm rounded hover:bg-gray-100">Orta</button>
          <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className="px-2 py-1 text-sm rounded hover:bg-gray-100">Sağ</button>
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-sm rounded ${editor?.isActive('bulletList') ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>• List</button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 text-sm rounded ${editor?.isActive('orderedList') ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>1. List</button>
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <button onClick={() => editor?.chain().focus().undo().run()} className="px-2 py-1 text-sm rounded hover:bg-gray-100">↶</button>
          <button onClick={() => editor?.chain().focus().redo().run()} className="px-2 py-1 text-sm rounded hover:bg-gray-100">↷</button>
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <button onClick={() => {
            const url = window.prompt('Şəkil URL-si:');
            if (url) editor?.chain().focus().setImage({ src: url }).run();
          }} className="px-2 py-1 text-sm rounded hover:bg-gray-100">Şəkil</button>
        </div>
        <div className="p-3">
          <div className="border rounded-md p-3 min-h-[300px] tiptap-editor" style={{ minHeight }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
