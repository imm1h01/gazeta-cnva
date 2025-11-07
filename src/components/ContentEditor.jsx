import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function ContentEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      const toolbarOptions = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ];

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
        formats: [
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "script",
          "list",
          "bullet",
          "indent",
          "align",
          "blockquote",
          "code-block",
          "link",
          "image",
        ],
        placeholder: placeholder || "Scrie conținutul articolului...",
      });

      if (value) {
        quill.root.innerHTML = value;
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        onChange(html);
      });

      quillInstanceRef.current = quill;
    }
  }, []);

  useEffect(() => {
    if (quillInstanceRef.current && value !== quillInstanceRef.current.root.innerHTML) {
      const selection = quillInstanceRef.current.getSelection();
      quillInstanceRef.current.root.innerHTML = value || "";
      if (selection) {
        quillInstanceRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return (
    <div className="content-editor-container border border-gray-300 rounded-lg bg-white overflow-hidden" style={{ height: "400px" }}>
      <div ref={editorRef} className="h-full" />
      <style>{`
        .content-editor-container .ql-container {
          height: calc(100% - 42px);
          overflow-y: auto;
          font-size: 14px;
        }
        .content-editor-container .ql-toolbar {
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-bottom: 1px solid #e2e8f0;
          padding: 4px;
        }
        .content-editor-container .ql-editor {
          min-height: 300px;
          font-size: 14px;
          line-height: 1.5;
          padding: 12px;
        }
        .content-editor-container .ql-toolbar.ql-snow {
          border: none;
        }
        .content-editor-container .ql-container.ql-snow {
          border: none;
        }
        @media (min-width: 640px) {
          .content-editor-container {
            height: 500px;
          }
          .content-editor-container .ql-editor {
            font-size: 16px;
            min-height: 400px;
          }
        }
        @media (min-width: 1024px) {
          .content-editor-container {
            height: 600px;
          }
          .content-editor-container .ql-editor {
            min-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}