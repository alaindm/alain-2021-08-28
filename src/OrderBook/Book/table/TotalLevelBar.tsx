/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors, ROW_HEIGHT_REM } from "../../config";
import { useIsMobile } from "../../isMobile";
import { OrderType } from "../../types";

interface Props {
  orderType: OrderType;
  total: number;
  highestTotal: number;
}

export const TotalLevelBar = ({ orderType, total, highestTotal }: Props) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${isMobile || orderType === OrderType.ASK
          ? "row"
          : "row-reverse"};
      `}
    >
      <div
        css={css`
          height: ${ROW_HEIGHT_REM}rem;
          width: ${(total / highestTotal) * 100}%;
          background-color: ${orderType === OrderType.BID
            ? Colors.DARK_GREEN
            : Colors.DARK_RED};
        `}
      />
    </div>
  );
};
