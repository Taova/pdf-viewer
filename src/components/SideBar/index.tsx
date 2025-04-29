import { useState } from "react";
import clsx from "clsx";
import type { ReferenceItem } from "../../types";
import "./styles.css";

interface SideBarProps {
  list: Array<ReferenceItem>;
  onSelect: (refItem: ReferenceItem) => void;
}

const SideBar: React.FC<SideBarProps> = ({ list, onSelect }: SideBarProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const li = target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    setActiveIndex(id);

    if (list[id]) {
      onSelect(list[id]);
    }
  };

  return (
    <ul onClick={handleClick} className="sidebar">
      {list.map(({ content }, index) => (
        <li
          key={index}
          className={clsx("sidebar-item", { active: index === activeIndex })}
          data-id={index}
        >
          {content}
        </li>
      ))}
    </ul>
  );
};

export default SideBar;
