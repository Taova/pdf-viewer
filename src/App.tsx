import React, { Suspense, useRef } from "react";
import SideBar from "./components/SideBar";
import { references } from "./constants";
import { ReferenceItem, PdfViewerHandle } from "./types";
import "./App.css";

const PdfViewer = React.lazy(() => import("./components/PdfViewer"));

function App() {
  const pdfRef = useRef<PdfViewerHandle>(null);

  /**
   * For small reference lists (under ~30–40 items—check with React Profiler whether rendering is a bottleneck),
   * avoid premature optimization.
   *
   * Otherwise, wrap handleSideBarClick in useCallback
   * and wrap the SideBar component in React.memo to prevent unnecessary re-renders.
   */
  const handleSideBarClick = (text: ReferenceItem) => {
    pdfRef.current?.findText(text);
  };

  return (
    <div className="root">
      <SideBar list={references} onSelect={handleSideBarClick} />
      <Suspense fallback={<p>Loading PDF viewer...</p>}>
        <PdfViewer ref={pdfRef} />
      </Suspense>
    </div>
  );
}

export default App;
