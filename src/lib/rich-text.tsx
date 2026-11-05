import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Server-side renderer for Payload's Lexical rich text.
 * Covers the nodes editors actually use (paragraphs, headings, lists,
 * quotes, links, inline formats); unknown nodes fall back to their children.
 */

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: string[] | number;
  url?: string;
  fields?: { url?: string; newTab?: boolean };
  listType?: string;
  children?: LexicalNode[];
};

const BITMAP = [
  ["bold", 1],
  ["italic", 2],
  ["underline", 4],
  ["strikethrough", 8],
  ["code", 16],
] as const;

function formatSet(format: LexicalNode["format"]): Set<string> {
  if (Array.isArray(format)) return new Set(format);
  if (typeof format === "number") {
    const set = new Set<string>();
    for (const [name, bit] of BITMAP) if (format & bit) set.add(name);
    return set;
  }
  return new Set();
}

function renderInline(node: LexicalNode, key: number): ReactNode {
  if (node.type === "link" || (node.type === "autolink" && node.url)) {
    const href = node.fields?.url || node.url;
    if (!href) return renderChildren(node);
    const external = href.startsWith("http");
    return (
      <Link
        key={key}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-accent underline underline-offset-4 hover:text-foreground"
      >
        {renderChildren(node)}
      </Link>
    );
  }

  if (typeof node.text === "string") {
    const formats = formatSet(node.format);
    let content: ReactNode = node.text;
    if (formats.has("code")) {
      content = (
        <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em]">{content}</code>
      );
    }
    if (formats.has("bold")) content = <strong>{content}</strong>;
    if (formats.has("italic")) content = <em>{content}</em>;
    if (formats.has("underline")) content = <u>{content}</u>;
    if (formats.has("strikethrough")) content = <s>{content}</s>;
    return <span key={key}>{content}</span>;
  }

  return renderChildren(node);
}

function renderChildren(node: LexicalNode): ReactNode {
  return node.children?.map((child, index) => renderInline(child, index)) ?? null;
}

function renderBlock(node: LexicalNode, key: number): ReactNode {
  switch (node.type) {
    case "heading": {
      const Tag = (node.tag || "h2") as "h2" | "h3" | "h4";
      return (
        <Tag key={key} className="mt-8 font-display text-h3 first:mt-0">
          {renderChildren(node)}
        </Tag>
      );
    }
    case "list": {
      const items = (node.children ?? []).map((item, index) => (
        <li key={index}>{renderChildren(item)}</li>
      ));
      return node.listType === "number" ? (
        <ol key={key} className="mt-5 list-decimal space-y-2 pl-6 text-muted">
          {items}
        </ol>
      ) : (
        <ul key={key} className="mt-5 list-disc space-y-2 pl-6 text-muted">
          {items}
        </ul>
      );
    }
    case "quote":
      return (
        <blockquote
          key={key}
          className="mt-6 border-l-2 border-accent py-1 pl-5 font-display text-lg italic text-foreground"
        >
          {renderChildren(node)}
        </blockquote>
      );
    case "paragraph":
    default:
      return (
        <p key={key} className="mt-4 leading-relaxed text-muted first:mt-0">
          {renderChildren(node)}
        </p>
      );
  }
}

export function RichText({ content, className = "" }: { content: unknown; className?: string }) {
  if (!content || typeof content !== "object") return null;
  const root = (content as { root?: { children?: LexicalNode[] } }).root;
  if (!root?.children?.length) return null;
  return (
    <div className={className}>
      {root.children.map((node, index) => renderBlock(node, index))}
    </div>
  );
}
