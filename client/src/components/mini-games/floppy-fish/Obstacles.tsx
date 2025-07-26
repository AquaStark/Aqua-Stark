import { Fragment } from "react";

interface ObstaclesProps {
  columns: { x: number; gapY: number; scored?: boolean }[];
  scale: number;
  COLUMN_WIDTH: number;
  GAP_HEIGHT: number;
  GAME_HEIGHT: number;
}

export function Obstacles({ columns, scale, COLUMN_WIDTH, GAP_HEIGHT, GAME_HEIGHT }: ObstaclesProps) {
  return (
    <>
      {columns.map((col, idx) => (
        <Fragment key={idx}>
          {/* Top column */}
          <img
            src="/mini-games/element-up.webp"
            alt="Column Top"
            className="absolute"
            style={{
              left: col.x * scale,
              top: 0,
              width: COLUMN_WIDTH * scale,
              height: col.gapY * scale,
              objectFit: "fill",
              zIndex: 5,
            }}
          />
          {/* Bottom column */}
          <img
            src="/mini-games/element-down.webp"
            alt="Column Bottom"
            className="absolute"
            style={{
              left: col.x * scale,
              top: (col.gapY + GAP_HEIGHT) * scale,
              width: COLUMN_WIDTH * scale,
              height: (GAME_HEIGHT - col.gapY - GAP_HEIGHT) * scale,
              objectFit: "fill",
              zIndex: 5,
            }}
          />
        </Fragment>
      ))}
    </>
  );
} 