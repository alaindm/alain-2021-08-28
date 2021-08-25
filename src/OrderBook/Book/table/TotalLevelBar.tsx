/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "../../config";
import { OrderType } from "../../types";

interface Props {
  orderType: OrderType;
  total: number;
  highestTotal: number;
}

export const TotalLevelBar = ({ orderType, total, highestTotal }: Props) => (
  <div
    css={css`
      display: flex;
      flex-direction: ${orderType === OrderType.BID ? "row-reverse" : "row"};
      @media only screen and (max-width: 688px) {
        flex-direction: row;
      }
    `}
  >
    <div
      css={css`
        height: 1.7rem;
        width: ${(total / highestTotal) * 100}%;
        background-color: ${orderType === OrderType.BID
          ? Colors.DARK_GREEN
          : Colors.DARK_RED};
      `}
    />
  </div>
);
