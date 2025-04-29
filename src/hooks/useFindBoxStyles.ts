import { useState, useEffect, RefObject } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { getPageNumber, getPDFItems, getHighlightStyles } from "../utils";
import type { HighlightStyles, PDFItems } from "../types";
import { PDF_SCALE } from "../constants";

interface UsePDFBoxStyles {
  searchText: string;
  pdf: PDFDocumentProxy | null;
  pageRefs: RefObject<HTMLDivElement[]>;
  pagesText: Array<string> | [];
}

export const useFindBoxStyles = ({
  searchText,
  pdf,
  pageRefs,
  pagesText,
}: UsePDFBoxStyles): HighlightStyles => {
  const [boxStyle, setBoxStyle] = useState<HighlightStyles>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    if (!searchText || !pdf) return;

    const pageNumber = getPageNumber(searchText, pagesText);

    if (!pageNumber) {
      alert(`Text not found`);
      return;
    }

    async function searchInPage() {
      try {
        const page = await pdf!.getPage(pageNumber!);
        const content = await page.getTextContent();
        const items = getPDFItems(searchText, content.items as PDFItems);

        if (items.length > 0) {
          const pageDiv = pageRefs.current[pageNumber! - 1];
          const pageHeight = pageDiv.offsetHeight;

          const newStyles = getHighlightStyles({
            items,
            scale: PDF_SCALE,
            pageTop: pageDiv.offsetTop,
            pageHeight,
          });
          setBoxStyle(newStyles);
        }
      } catch {
        alert("Error searching elements");
      }
    }

    searchInPage();
  }, [searchText, pdf, pagesText, pageRefs]);

  return boxStyle;
};
