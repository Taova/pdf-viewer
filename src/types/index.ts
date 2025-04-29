export interface ReferenceItem {
  content: string;
}

export interface HighlightStyles {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
}

export interface PdfViewerHandle {
  findText: (query: ReferenceItem) => void;
}

export interface PDFItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: Array<number>;
  fontName: string;
  hasEOL: boolean;
}

export type PDFItems = Array<PDFItem>;
