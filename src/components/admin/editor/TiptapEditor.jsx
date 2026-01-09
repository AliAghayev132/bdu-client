"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, Heading4, List, ListOrdered, Quote,
  Undo, Redo, Link as LinkIcon, Unlink, ImageIcon, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Highlighter, Eye, Edit3,
  Type, ChevronDown, Minus, RotateCcw, Maximize2, Minimize2,
  Copy, Check, FileText, Hash
} from "lucide-react";

export default function TiptapEditor({
  content = "",
  onChange,
  onImageUpload,
  minHeight = 500,
  placeholder = "Məzmununuzu buraya yazın...",
  maxCharacters = null,
}) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const editorContainerRef = useRef(null);
  const headingMenuRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { class: "text-blue-600 underline hover:text-blue-800 cursor-pointer" },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg shadow-sm my-4" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({ placeholder }),
      ...(maxCharacters ? [CharacterCount.configure({ limit: maxCharacters })] : [CharacterCount]),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px] px-6 py-4",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(e.target)) {
        setShowHeadingMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);

  const handleImageUpload = async (file) => {
    if (!file || !onImageUpload) return;
    try {
      const imageUrl = await onImageUpload(file);
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = "";
    }
  };

  const addLink = () => {
    if (linkUrl) {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const copyContent = async () => {
    const html = editor.getHTML();
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearContent = () => {
    if (window.confirm("Bütün məzmunu silmək istədiyinizə əminsiniz?")) {
      editor.commands.clearContent();
    }
  };

  const ToolbarButton = ({ onClick, isActive, disabled, children, title, className = "" }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
        isActive
          ? "bg-secondary text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${className}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

  const headingOptions = [
    { level: 1, label: "Başlıq 1", icon: Heading1, desc: "Ən böyük başlıq" },
    { level: 2, label: "Başlıq 2", icon: Heading2, desc: "Bölmə başlığı" },
    { level: 3, label: "Başlıq 3", icon: Heading3, desc: "Alt bölmə" },
    { level: 4, label: "Başlıq 4", icon: Heading4, desc: "Kiçik başlıq" },
    { level: 0, label: "Normal mətn", icon: Type, desc: "Paraqraf mətni" },
  ];

  const getCurrentHeading = () => {
    for (let i = 1; i <= 4; i++) {
      if (editor?.isActive("heading", { level: i })) {
        return headingOptions.find((h) => h.level === i);
      }
    }
    return headingOptions.find((h) => h.level === 0);
  };

  if (!editor) return null;

  const characterCount = editor.storage.characterCount?.characters() || 0;
  const wordCount = editor.storage.characterCount?.words() || 0;

  return (
    <div
      ref={editorContainerRef}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-4 z-50 flex flex-col" : ""
      }`}
    >
      {/* Toolbar */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        {/* Main Toolbar */}
        <div className="flex items-center gap-1 p-2 flex-wrap">
          {/* Heading Dropdown */}
          <div className="relative" ref={headingMenuRef}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-w-[130px]"
            >
              {React.createElement(getCurrentHeading()?.icon || Type, { size: 16 })}
              <span className="truncate">{getCurrentHeading()?.label || "Normal"}</span>
              <ChevronDown size={14} className={`transition-transform ${showHeadingMenu ? "rotate-180" : ""}`} />
            </button>

            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[180px]">
                {headingOptions.map(({ level, label, icon: Icon, desc }) => (
                  <button
                    key={level}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (level === 0) {
                        editor.chain().focus().setParagraph().run();
                      } else {
                        editor.chain().focus().setHeading({ level }).run();
                      }
                      setShowHeadingMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      (level === 0 && !editor.isActive("heading")) ||
                      editor.isActive("heading", { level })
                        ? "bg-secondary/5 text-secondary"
                        : "text-gray-700"
                    }`}
                  >
                    <Icon size={18} />
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-gray-400">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Divider />

          {/* Text Formatting */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Qalın (Ctrl+B)"
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Maili (Ctrl+I)"
            >
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Altdan xətt (Ctrl+U)"
            >
              <UnderlineIcon size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Üstündən xətt"
            >
              <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              title="Vurğula"
            >
              <Highlighter size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Kod"
            >
              <Code size={16} />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Sola düzlə"
            >
              <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              title="Mərkəzə düzlə"
            >
              <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Sağa düzlə"
            >
              <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={editor.isActive({ textAlign: "justify" })}
              title="Hər iki tərəfə düzlə"
            >
              <AlignJustify size={16} />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Lists & Quote */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Nöqtəli siyahı"
            >
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Nömrəli siyahı"
            >
              <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Sitat"
            >
              <Quote size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Xətt əlavə et"
            >
              <Minus size={16} />
            </ToolbarButton>
          </div>

          <Divider />

          {/* Link & Image */}
          <div className="flex items-center gap-0.5">
            {showLinkInput ? (
              <div className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLink()}
                  placeholder="URL daxil edin..."
                  className="w-40 px-2 py-1 text-sm bg-transparent border-none focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={addLink}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowLinkInput(false);
                    setLinkUrl("");
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Unlink size={14} />
                </button>
              </div>
            ) : (
              <>
                <ToolbarButton
                  onClick={() => setShowLinkInput(true)}
                  isActive={editor.isActive("link")}
                  title="Link əlavə et"
                >
                  <LinkIcon size={16} />
                </ToolbarButton>
                {editor.isActive("link") && (
                  <ToolbarButton onClick={removeLink} title="Linki sil">
                    <Unlink size={16} />
                  </ToolbarButton>
                )}
              </>
            )}
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              title="Şəkil yüklə"
            >
              <ImageIcon size={16} />
            </ToolbarButton>
          </div>

          <Divider />

          {/* History */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Geri al (Ctrl+Z)"
            >
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="İrəli al (Ctrl+Y)"
            >
              <Redo size={16} />
            </ToolbarButton>
          </div>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-1">
            <ToolbarButton onClick={copyContent} title="Kopyala">
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </ToolbarButton>
            <ToolbarButton onClick={clearContent} title="Təmizlə">
              <RotateCcw size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Kiçilt" : "Tam ekran"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </ToolbarButton>

            <Divider />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isPreview
                  ? "bg-secondary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
              <span>{isPreview ? "Redaktə" : "Önizləmə"}</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileText size={12} />
              {wordCount} söz
            </span>
            <span className="flex items-center gap-1">
              <Hash size={12} />
              {characterCount} simvol
            </span>
          </div>
          {maxCharacters && (
            <span className={characterCount > maxCharacters * 0.9 ? "text-orange-500 font-medium" : ""}>
              {characterCount}/{maxCharacters}
            </span>
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className={`${isFullscreen ? "flex-1 overflow-auto" : ""}`} style={isFullscreen ? {} : { minHeight }}>
        {isPreview ? (
          <div
            className="p-6"
            style={{ minHeight: isFullscreen ? "100%" : minHeight }}
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="min-h-full"
            style={{ minHeight: isFullscreen ? "100%" : minHeight }}
          />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}
