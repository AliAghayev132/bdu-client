"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

// Tiptap React NodeView component API props
// props: node, selected, editor, getPos, updateAttributes, deleteNode
export default function ResizableImage(props) {
  const { node, selected, editor, getPos, updateAttributes } = props;
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const startRef = useRef({ x: 0, width: 0, height: 0, aspect: 1, dragging: false });
  const [hovered, setHovered] = useState(false);

  const width = node?.attrs?.width ?? null;
  const textAlign = node?.attrs?.textAlign || node?.attrs?.align || null;
  const preserve = node?.attrs?.preserveAspectRatio !== false;

  const setWidth = useCallback((nextWidth) => {
    if (!Number.isFinite(nextWidth)) return;
    const min = 60; // px
    const editorWidth = editor?.view?.dom?.clientWidth || window.innerWidth || 1200;
    const max = Math.min(1600, Math.max(300, editorWidth - 32));
    const clamped = Math.max(min, Math.min(max, Math.round(nextWidth)));
    updateAttributes({ width: clamped });
  }, [updateAttributes]);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    startRef.current = {
      x: e.clientX,
      width: rect.width,
      height: rect.height,
      aspect: rect.width / (rect.height || 1),
      dragging: true,
    };

    const onMove = (ev) => {
      if (!startRef.current.dragging) return;
      const dx = ev.clientX - startRef.current.x;
      const nextW = startRef.current.width + dx; // right handle
      if (preserve) {
        // height auto via CSS; we only store width
        setWidth(nextW);
      } else {
        setWidth(nextW);
      }
    };

    const onUp = () => {
      startRef.current.dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  }, [preserve, setWidth]);


  useEffect(() => {
    const pmView = editor?.view;
    if (!pmView) return;
    // prevent ProseMirror from handling drag selection while resizing
    const handler = (e) => {
      if (startRef.current.dragging) {
        e.preventDefault();
      }
    };
    pmView.dom.addEventListener("mousedown", handler, { capture: true });
    return () => pmView.dom.removeEventListener("mousedown", handler, { capture: true });
  }, [editor]);

  // Reflect alignment onto the parent NodeView container (.react-renderer.node-image)
  useEffect(() => {
    const spanEl = containerRef.current;
    const parent = spanEl?.parentElement; // should be div.react-renderer.node-image
    if (!parent) return;
    if (textAlign) {
      parent.setAttribute('data-text-align', textAlign);
      parent.setAttribute('data-align', textAlign);
    } else {
      parent.removeAttribute('data-text-align');
      parent.removeAttribute('data-align');
    }
  }, [textAlign]);

  return (
    <NodeViewWrapper
      as="span"
      ref={containerRef}
      className={`tt-resize-image tiptap-image ${selected ? "is-selected" : ""}`}
      data-align={textAlign || undefined}
      data-text-align={textAlign || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        ref={imgRef}
        src={node?.attrs?.src}
        alt={node?.attrs?.alt || ""}
        title={node?.attrs?.title || ""}
        style={{ width: width ? `${width}px` : undefined, height: "auto" }}
        className="tt-resize-image-el mx-auto"
        draggable={false}
      />

      {(hovered || selected) && (
        <>
          <span className="tt-resize-handle right" onPointerDown={onPointerDown} />
          {/* You can add more handles (left, corners) if needed */}
        </>
      )}
    </NodeViewWrapper>
  );
}
