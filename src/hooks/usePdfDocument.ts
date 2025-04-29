import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import PdfWorker from "pdfjs-dist/build/pdf.worker?worker";
import { PDF_URL } from "../constants";

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

export function usePdfDocument(url: string = PDF_URL) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function loadDocument() {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const doc = await loadingTask.promise;
        if (!canceled) {
          setPdf(doc);
        }
      } catch {
        if (!canceled) {
          setError("PDF load error");
        }
      }
    }

    loadDocument();

    return () => {
      canceled = true;
    };
  }, [url]);

  return { pdf, error };
}
