import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useLocalStorage } from "usehooks-ts";

// Custom preview renderer to make links open in new tabs and ensure proper list rendering
const previewOptions = {
  components: {
    a: ({ ...props }: { node: any; [key: string]: any }) => (
      <a {...props} target="_blank" rel="noopener noreferrer" />
    ),
  },
  rehypePlugins: [rehypeSlug],
  remarkPlugins: [remarkGfm],
};
export type MarkdownEditorMode = "preview" | "edit" | "live";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  height?: number;
  label?: string;
  labelClassName?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  onBlur,
  height = 350,
  label = "Content",
  labelClassName = "text-sm leading-4 mb-3 font-medium",
}: MarkdownEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [MDEditor, setMDEditor] = useState<any>(null);
  const [contentValue, setContentValue] = useState<string>(value || "");

  const [viewMarkdownMode, setViewMarkdownMode] =
    useLocalStorage<MarkdownEditorMode>("markdown-editor-view-mode", "live");

  // Load the MDEditor component dynamically
  useEffect(() => {
    import("@uiw/react-md-editor").then((module) => {
      setMDEditor(() => module.default);
    });
  }, []);

  // Update contentValue when value prop changes
  useEffect(() => {
    setContentValue(value || "");
  }, [value]);

  useEffect(() => {
    if (!MDEditor) return;

    const handleViewButtonClick = () => {
      const buttonLive = document.querySelector("button[data-name='live']");
      const buttonEdit = document.querySelector("button[data-name='edit']");
      const buttonPreview = document.querySelector(
        "button[data-name='preview']",
      );

      const liveLi = buttonLive?.closest("li");
      const editLi = buttonEdit?.closest("li");
      const previewLi = buttonPreview?.closest("li");

      if (previewLi && previewLi.classList.contains("active")) {
        setViewMarkdownMode("preview");
      }
      if (editLi && editLi.classList.contains("active")) {
        setViewMarkdownMode("edit");
      }
      if (liveLi && liveLi.classList.contains("active")) {
        setViewMarkdownMode("live");
      }
    };

    document.addEventListener("click", handleViewButtonClick, true);
    return () => {
      document.removeEventListener("click", handleViewButtonClick, true);
    };
  }, [MDEditor, setViewMarkdownMode]);

  // Handle content changes
  const handleContentChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setContentValue(newValue);
      onChange(newValue);
    }
  };

  // Handle content blur
  const handleContentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  return (
    <div className="w-full">
      <style>
        {`
          .w-md-editor-preview ul {
            list-style-type: disc !important;
            padding-left: 2em !important;
          }

          .w-md-editor-preview ol {
            list-style-type: decimal !important;
            padding-left: 2em !important;
          }

          /* Ensure proper table styling */
          .w-md-editor-preview table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }

          .w-md-editor-preview th,
          .w-md-editor-preview td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          .w-md-editor-preview th {
            background-color: #f5f5f5;
          }
         
        .w-md-editor-text-pre code, .w-md-editor-text-pre div {
            font-size: 16px !important;
            line-height: 24px !important;
          }
          .w-md-editor-text-input {
            font-size: 16px !important;
            line-height: 24px !important;
          }
            
        `}
      </style>

      {label && <p className={labelClassName}>{label}</p>}
      {MDEditor && (
        <div data-color-mode="light" className="w-full">
          <MDEditor
            height={height}
            value={contentValue}
            onChange={handleContentChange}
            onBlur={handleContentBlur}
            previewOptions={previewOptions}
            enableScroll={true}
            preview={viewMarkdownMode}
            textareaProps={{
              placeholder: "Write your content here...",
            }}
          />
        </div>
      )}
    </div>
  );
}