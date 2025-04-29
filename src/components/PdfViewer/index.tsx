import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import HighlightBox from "../HighlightBox";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import { usePdfPages, useFindBoxStyles, usePdfDocument } from "../../hooks";
import { PDF_URL, PDF_SCALE } from "../../constants";
import { ReferenceItem, PdfViewerHandle } from "../../types";

const PdfViewer = forwardRef<PdfViewerHandle>((_, ref) => {
  const { pdf, error: docError } = usePdfDocument(PDF_URL);
  const {
    canvases,
    pagesText,
    error: pagesError,
    loading,
  } = usePdfPages(PDF_SCALE);

  const error = docError || pagesError;

  const [searchText, setSearchText] = useState<string>("");

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<HTMLDivElement[]>([]);

  const boxStyle = useFindBoxStyles({
    searchText,
    pdf,
    pageRefs,
    pagesText,
  });

  useImperativeHandle(ref, () => ({
    findText: ({ content }: ReferenceItem) => {
      setSearchText(content);
    },
  }));

  useEffect(() => {
    const container = pdfContainerRef.current;

    if (container) {
      const { top, height } = boxStyle;
      const targetScrollTop = top + height / 2 - container.clientHeight / 2;
      const scrollTo = Math.max(targetScrollTop, 0);

      container.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    }
  }, [boxStyle]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Next steps for Performance optimizations:
  // 1. Debounce the text‐search logic in useFindBoxStyles
  // 2. Don’t render all pages at once:
  //    • Virtualize the list of pages with react-window / react-virtualized, or
  //    • Lazy-load pages using IntersectionObserver.
  // 3. Cache rendered canvases :
  //    ```ts
  // const canvasCache = new Map<number, HTMLCanvasElement>();
  //    ```

  return (
    <div ref={pdfContainerRef} className="main">
      <HighlightBox {...boxStyle} />
      {loading && <Loading />}
      {canvases.map((canvas, idx) => (
        <div
          key={idx}
          ref={(el) => {
            if (el) {
              pageRefs.current[idx] = el;
              if (el.childElementCount === 0) {
                el.appendChild(canvas);
              }
            }
          }}
        />
      ))}
    </div>
  );
});

export default React.memo(PdfViewer);
