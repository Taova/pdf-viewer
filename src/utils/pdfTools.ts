import { HighlightStyles, PDFItems } from "../types";

export const getPageNumber = (
  query: string,
  textByPages: string[]
): number | null => {
  const searchTerm = query.toLowerCase();

  for (let i = 0; i < textByPages.length; i++) {
    const text = textByPages[i].toLowerCase();
    if (text.includes(searchTerm)) {
      return i + 1; // pages start from 1
    }
  }

  return null;
};

const normalize = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, "...")
    .trim()
    .toLowerCase();

type Boundary = { index: number; start: number; end: number };

export const getPDFItems = (searchText: string, items: PDFItems): PDFItems => {
  const target = normalize(searchText);
  if (!target) return [];

  const boundaries: Boundary[] = [];
  let accumulated = "";

  for (const [index, item] of items.entries()) {
    const fragment = normalize(item.str);
    if (!fragment) continue;

    const separator = boundaries.length > 0 ? " " : "";
    const start = accumulated.length;
    accumulated += separator + fragment;

    const end = accumulated.length;

    boundaries.push({ index, start, end });
  }

  const startPos = accumulated.indexOf(target);
  if (startPos === -1) return [];
  const endPos = startPos + target.length;

  let firstIndex = -1;
  let lastIndex = -1;

  for (const { index, end } of boundaries) {
    if (firstIndex === -1 && end > startPos) {
      firstIndex = index;
    }
    if (firstIndex !== -1 && end >= endPos) {
      lastIndex = index;
      break;
    }
  }

  if (firstIndex === -1 || lastIndex === -1) {
    return [];
  }

  return items.slice(firstIndex, lastIndex + 1);
};

export const getHighlightStyles = ({
  items,
  scale,
  pageTop,
  pageHeight,
}: {
  items: PDFItems;
  scale: number;
  pageTop: number;
  pageHeight: number;
}): HighlightStyles => {
  if (items.length === 0) {
    return { top: 0, left: 0, width: 0, height: 0, opacity: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  items.forEach(({ transform, width, height }) => {
    const [, , , , x, y] = transform;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  const left = minX * scale;
  const top = pageTop + (pageHeight - maxY * scale);
  const widthScaled = (maxX - minX) * scale;
  const heightScaled = (maxY - minY) * scale;

  return {
    top,
    left,
    width: widthScaled,
    height: heightScaled,
    opacity: 0.4,
  };
};
