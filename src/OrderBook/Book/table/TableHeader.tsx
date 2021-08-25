/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TotalBarSide } from ".";
import { Colors } from "../../config";
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
}: ListHeaderProps) => (
  <div
    css={css`
      height: 1.7rem;
      width: 100%;
      color: ${Colors.LIGHT_GRAY};
      border-bottom: 1px solid ${Colors.DARK_GRAY};
      display: flex;
      align-items: center;
      flex-direction: ${totalBarSide === TotalBarSide.LEFT
        ? "row"
        : "row-reverse"};
      > * {
        width: 33.333%;
        text-align: end;
      }
      @media only screen and (max-width: 688px) {
        display: ${orderType === OrderType.BID ? "none" : "flex"};
        flex-direction: row-reverse;
      }
    `}
  >
    {children}
  </div>
);
