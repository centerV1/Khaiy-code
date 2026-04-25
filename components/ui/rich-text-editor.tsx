"use client";

import {
  Bold,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const allowedTags = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h2",
  "h3",
  "h4",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "u",
  "ul",
]);

type RichTextEditorProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
};

type RichTextContentProps = {
  html: string | null | undefined;
  className?: string;
};

export function RichTextEditor({
  label,
  name,
  defaultValue = "",
}: RichTextEditorProps) {
  const initialHtml = sanitizeRichTextHtml(defaultValue ?? "");
  const [html, setHtml] = useState(initialHtml);
  const editorRef = useRef<HTMLDivElement>(null);
  const lastInitialHtmlRef = useRef<string | null>(null);

  const setEditorNode = useCallback(
    (node: HTMLDivElement | null) => {
      editorRef.current = node;

      if (!node || lastInitialHtmlRef.current === initialHtml) {
        return;
      }

      node.innerHTML = initialHtml;
      lastInitialHtmlRef.current = initialHtml;
    },
    [initialHtml],
  );

  useEffect(() => {
    const editor = editorRef.current;
    const form = editor?.closest("form");

    if (!editor || !form) {
      return;
    }

    const currentEditor = editor;

    function handleReset() {
      window.requestAnimationFrame(() => {
        setHtml(initialHtml);
        currentEditor.innerHTML = initialHtml;
      });
    }

    form.addEventListener("reset", handleReset);
    return () => {
      form.removeEventListener("reset", handleReset);
    };
  }, [initialHtml]);

  function syncHtml() {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const text = editor.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    setHtml(text ? editor.innerHTML : "");
  }

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncHtml();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    document.execCommand(
      "insertText",
      false,
      event.clipboardData.getData("text/plain"),
    );
    syncHtml();
  }

  return (
    <div className="block space-y-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 transition focus-within:border-sky-400 focus-within:bg-white">
        <div className="flex flex-wrap gap-1 border-b border-sky-100 bg-white/70 p-2">
          <EditorButton
            label="Heading"
            onClick={() => runCommand("formatBlock", "h3")}
          >
            <Heading3 className="size-4" />
          </EditorButton>
          <EditorButton label="Bold" onClick={() => runCommand("bold")}>
            <Bold className="size-4" />
          </EditorButton>
          <EditorButton label="Italic" onClick={() => runCommand("italic")}>
            <Italic className="size-4" />
          </EditorButton>
          <EditorButton
            label="Underline"
            onClick={() => runCommand("underline")}
          >
            <Underline className="size-4" />
          </EditorButton>
          <EditorButton
            label="Bulleted list"
            onClick={() => runCommand("insertUnorderedList")}
          >
            <List className="size-4" />
          </EditorButton>
          <EditorButton
            label="Numbered list"
            onClick={() => runCommand("insertOrderedList")}
          >
            <ListOrdered className="size-4" />
          </EditorButton>
        </div>
        <div
          aria-label={label}
          aria-multiline
          className="min-h-52 w-full px-4 py-3 text-sm leading-7 text-slate-950 outline-none [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          contentEditable
          onInput={syncHtml}
          onPaste={handlePaste}
          ref={setEditorNode}
          role="textbox"
          suppressContentEditableWarning
        />
      </div>
      <input name={name} readOnly type="hidden" value={html} />
    </div>
  );
}

export function RichTextContent({ html, className }: RichTextContentProps) {
  const sanitizedHtml = sanitizeRichTextHtml(html ?? "");

  if (!sanitizedHtml) {
    return null;
  }

  return (
    <div
      className={cn(
        "rich-text-content space-y-4 text-base leading-7 text-slate-700",
        "[&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:decoration-sky-300 [&_a]:underline-offset-4",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-sky-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600",
        "[&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
        "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-950",
        "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-slate-950",
        "[&_h4]:mt-5 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-slate-950",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-slate-50",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

function EditorButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-300"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function sanitizeRichTextHtml(value: string) {
  const withoutBlockedContent = value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<\s*(script|style|iframe|object|embed|svg|math|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      "",
    )
    .replace(
      /<\s*(script|style|iframe|object|embed|svg|math|link|meta)[^>]*\/?\s*>/gi,
      "",
    );

  return withoutBlockedContent
    .replace(/<\/?([a-z][a-z0-9-]*)([^>]*)>/gi, (match, tagName, attrs) => {
      const tag = String(tagName).toLowerCase();
      const isClosingTag = match.startsWith("</");

      if (!allowedTags.has(tag)) {
        return "";
      }

      if (isClosingTag) {
        return `</${tag}>`;
      }

      if (tag === "br") {
        return "<br>";
      }

      if (tag !== "a") {
        return `<${tag}>`;
      }

      const href = getSafeHref(String(attrs));
      return href
        ? `<a href="${href}" target="_blank" rel="noreferrer">`
        : "<a>";
    })
    .trim();
}

function getSafeHref(attrs: string) {
  const hrefMatch = attrs.match(/\shref\s*=\s*(["'])(.*?)\1/i);

  if (!hrefMatch) {
    return "";
  }

  const href = hrefMatch[2].trim();

  if (/^(https?:|mailto:)/i.test(href)) {
    return href.replace(/"/g, "&quot;");
  }

  return "";
}
