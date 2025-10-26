import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImage from "./ResizableImage";
import "./resizable-image.scss";

const ResizableImageExtension = Image.extend({
  // Register under the standard node name so other plugins that insert 'image'
  // will use this NodeView automatically.
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-align") || null,
        renderHTML: (attrs) => (attrs.align ? { "data-align": attrs.align } : {}),
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const styleWidth = element.style?.width;
          if (styleWidth && styleWidth.endsWith("px")) {
            return parseInt(styleWidth, 10);
          }
          const attrWidth = element.getAttribute("data-width");
          return attrWidth ? parseInt(attrWidth, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            style: `width: ${attributes.width}px;`,
            "data-width": String(attributes.width),
          };
        },
      },
      preserveAspectRatio: {
        default: true,
        parseHTML: (el) => el.getAttribute("data-preserve-aspect") !== "false",
        renderHTML: (attrs) => ({ "data-preserve-aspect": String(!!attrs.preserveAspectRatio) }),
      },
      alt: { default: null },
      title: { default: null },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },
});

export default ResizableImageExtension;
