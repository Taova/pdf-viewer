import type { PDFDocumentProxy } from "pdfjs-dist";

export async function loadPdfPageAsync(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale: number
): Promise<{ canvas: HTMLCanvasElement; text: string }> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  // extract text
  const content = await page.getTextContent();
  const text = content.items
    .map((i: any) => i.str.trim())
    .filter((s: string) => s.length > 0)
    .join(" ");

  // render canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;

  return { canvas, text };
}
