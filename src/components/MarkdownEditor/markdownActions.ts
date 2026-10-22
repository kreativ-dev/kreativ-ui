export interface TextEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

function lineBounds(value: string, index: number) {
  const start = value.lastIndexOf("\n", index - 1) + 1;
  const nextBreak = value.indexOf("\n", index);
  const end = nextBreak === -1 ? value.length : nextBreak;
  return { start, end };
}

function selectedLineRange(value: string, start: number, end: number) {
  const first = lineBounds(value, start);
  const last = lineBounds(value, Math.max(end - 1, start));
  return { from: first.start, to: last.end };
}

/** Wrap the selection in a marker pair (bold/italic). Toggles off if already wrapped. */
export function toggleWrap(
  value: string,
  start: number,
  end: number,
  marker: string,
): TextEdit {
  const before = value.slice(Math.max(0, start - marker.length), start);
  const after = value.slice(end, end + marker.length);

  if (before === marker && after === marker) {
    const next =
      value.slice(0, start - marker.length) +
      value.slice(start, end) +
      value.slice(end + marker.length);
    return {
      value: next,
      selectionStart: start - marker.length,
      selectionEnd: end - marker.length,
    };
  }

  const selected = value.slice(start, end);
  const next =
    value.slice(0, start) + marker + selected + marker + value.slice(end);

  return selected.length === 0
    ? {
        value: next,
        selectionStart: start + marker.length,
        selectionEnd: start + marker.length,
      }
    : {
        value: next,
        selectionStart: start,
        selectionEnd: end + marker.length * 2,
      };
}

/** Toggle a line prefix (heading, quote) on the line containing the cursor. */
export function toggleLinePrefix(
  value: string,
  start: number,
  end: number,
  prefix: string,
): TextEdit {
  const { from, to } = selectedLineRange(value, start, end);
  const line = value.slice(from, to);

  const next = line.startsWith(prefix)
    ? value.slice(0, from) + line.slice(prefix.length) + value.slice(to)
    : value.slice(0, from) + prefix + line + value.slice(to);

  const delta = (line.startsWith(prefix) ? -1 : 1) * prefix.length;
  return {
    value: next,
    selectionStart: start + delta,
    selectionEnd: end + delta,
  };
}

/** Prefix every selected line (list, checklist). `ordered` numbers them sequentially. */
export function toggleListPrefix(
  value: string,
  start: number,
  end: number,
  makePrefix: (lineIndex: number) => string,
): TextEdit {
  const { from, to } = selectedLineRange(value, start, end);
  const block = value.slice(from, to);
  const lines = block.split("\n");

  const alreadyListed = lines.every(
    (l) => l.startsWith(makePrefix(0)) || /^\d+\.\s/.test(l),
  );

  const nextLines = lines.map((l, i) =>
    alreadyListed
      ? l.replace(/^(\d+\.\s|-\s\[ \]\s|-\s)/, "")
      : makePrefix(i) + l,
  );

  const next = value.slice(0, from) + nextLines.join("\n") + value.slice(to);
  const delta = nextLines.join("\n").length - block.length;

  return { value: next, selectionStart: from, selectionEnd: to + delta };
}

/** Wrap selection as inline code, or a fenced block if it spans multiple lines. */
export function toggleCode(
  value: string,
  start: number,
  end: number,
): TextEdit {
  const selected = value.slice(start, end);
  if (selected.includes("\n")) {
    const next =
      value.slice(0, start) + "```\n" + selected + "\n```" + value.slice(end);
    return { value: next, selectionStart: start + 4, selectionEnd: end + 4 };
  }
  return toggleWrap(value, start, end, "`");
}

/** Insert a markdown link. If text is selected, it becomes the link text; url is left as a placeholder to fill in. */
export function insertLink(
  value: string,
  start: number,
  end: number,
): TextEdit {
  const selected = value.slice(start, end);
  const label = selected || "text";
  const snippet = `[${label}](url)`;
  const next = value.slice(0, start) + snippet + value.slice(end);

  const urlStart = start + label.length + 3;
  return { value: next, selectionStart: urlStart, selectionEnd: urlStart + 3 };
}
