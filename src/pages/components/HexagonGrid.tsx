import React, { useEffect, useRef, ReactNode } from "react";

interface HexagonGridProps {
  children: ReactNode;
}

const HexagonGrid: React.FC<HexagonGridProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const hexagonSideLength = 50; // The length of one side of the hexagon
    const hexagonHeight = Math.sqrt(3) * hexagonSideLength;
    const hexagonWidth = 2 * hexagonSideLength;

    let offsetX = 0;
    let offsetY = 0;

    while (offsetY <= containerHeight) {
      const hexagon = document.createElement("div");
      hexagon.className = "hexagon-grid";
      hexagon.style.left = `${offsetX}px`;
      hexagon.style.top = `${offsetY}px`;
      container.appendChild(hexagon);
      console.log("created hexagon");
      offsetX += hexagonSideLength * 1.5;
      offsetY += hexagonHeight / 2;

      if (offsetX > containerWidth) {
        offsetY += hexagonHeight - hexagonHeight / 2;
        offsetX = 0;
      }
    }
  }, []);

  return (
    <div className="relative h-full min-h-screen w-full" ref={containerRef}>
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
};

export default HexagonGrid;
