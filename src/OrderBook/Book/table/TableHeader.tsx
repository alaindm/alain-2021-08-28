/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TotalBarSide } from ".";
import { Colors, ROW_HEIGHT_REM } from "../../config";
import { useIsMobile } from "../../isMobile";
import { OrderType } from "../../types";

interface ListHeaderProps {
  orderType: OrderType;
  totalBarSide: TotalBarSide;
  children: React.ReactNode;
}

export const TableHeader = ({
  totalBarSide,
  orderType,
  children,
}: ListHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        height: ${ROW_HEIGHT_REM}rem;
        width: 100%;
        color: ${Colors.LIGHT_GRAY};
        border-bottom: 1px solid ${Colors.DARK_GRAY};
        display: ${isMobile && orderType === OrderType.BID ? "none" : "flex"};
        align-items: center;
        flex-direction: ${isMobile || totalBarSide === TotalBarSide.RIGHT
          ? "row-reverse"
          : "row"};
        > * {
          width: 33.333%;
          text-align: end;
        }
      `}
    >
      {children}
    </div>
  );
};
