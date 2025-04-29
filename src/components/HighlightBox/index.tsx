import { HighlightStyles } from "../../types";

const PADDING = 7;

const HighlightBox: React.FC<HighlightStyles> = ({
  top,
  left,
  width,
  height,
  opacity,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${top - PADDING}px`,
        left: `${left - PADDING}px`,
        width: `${width + 2 * PADDING}px`,
        height: `${height + PADDING}px`,
        opacity,
        backgroundColor: "#f5e020",
        pointerEvents: "none",
      }}
    />
  );
};

export default HighlightBox;
