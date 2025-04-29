import { useState, useEffect, useRef } from "react";
import { usePdfDocument } from "./usePdfDocument";
import { loadPdfPageAsync } from "../utils";

interface UsePdfPagesResult {
  canvases: HTMLCanvasElement[];
  pagesText: string[];
  error: string | null;
  loading: boolean;
}

// Next steps of optimizations:
// Don’t render all pages at once:
//    • Virtualize the list of pages with react-window / react-virtualized, or
//    • Lazy-load pages using IntersectionObserver.
export function usePdfPages(scale: number): UsePdfPagesResult {
  const { pdf, error: docError } = usePdfDocument();
  const [loading, setLoading] = useState<boolean>(false);
  const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);
  const pagesTextRef = useRef<string[]>([]);
  const [error, setError] = useState<string | null>(docError);

  useEffect(() => {
    if (!pdf) return;
    let canceled = false;

    async function loadAllPages() {
      setLoading(true);

      try {
        const results = await Promise.all(
          Array.from({ length: pdf!.numPages }, (_, i) =>
            loadPdfPageAsync(pdf!, i + 1, scale)
          )
        );

        if (!canceled) {
          pagesTextRef.current = results.map((r) => r.text);
          setCanvases(results.map((r) => r.canvas));
          setError(null);
        }
      } catch {
        if (!canceled) {
          setError("Error loading PDF pages");
        }
      } finally {
        setLoading(false);
      }
    }

    loadAllPages();
    return () => {
      canceled = true;
    };
  }, [pdf, scale]);

  return { canvases, pagesText: pagesTextRef.current, error, loading };
}
