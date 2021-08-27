/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors, ROW_HEIGHT_REM } from "../../config";
import { useIsMobile } from "../../helpers/isMobile";
import { OrderType } from "../../types";
import { Row } from "./Row";

interface RowWithBarProps {
  type: OrderType;
  total: number;
  highestTotal: number;
  children: React.ReactNode;
}

export const RowWithBar = ({
  type,
  total,
  highestTotal,
  children,
}: RowWithBarProps) => (
  <div
    css={css`
      height: ${ROW_HEIGHT_REM}rem;
      width: 100%;
      position: relative;
    `}
  >
    <Row
      type={type}
      style={{
        display: "flex",
        backgroundColor: "transparent",
        position: "absolute",
      }}
    >
      {children}
    </Row>
    <TotalBar type={type} size={total} maxSize={highestTotal} />
  </div>
);

interface TotalBarProps {
  type: OrderType;
  size: number;
  maxSize: number;
}

const TotalBar = ({ type, size, maxSize }: TotalBarProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${isMobile || type === OrderType.ASK
          ? "row"
          : "row-reverse"};
      `}
    >
      <div
        css={css`
          height: ${ROW_HEIGHT_REM}rem;
          width: ${(size / maxSize) * 100}%;
          background-color: ${type === OrderType.BID
            ? Colors.DARK_GREEN
            : Colors.DARK_RED};
        `}
      />
    </div>
  );
};
