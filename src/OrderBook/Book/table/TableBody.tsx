/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { OrderType } from "../../types";

export const TableBody: React.FC<{ orderType: OrderType }> = ({
  children,
  orderType,
}) => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      @media only screen and (max-width: 688px) {
        flex-direction: ${orderType === OrderType.BID
          ? "column"
          : "column-reverse"};
      }
    `}
  >
    {children}
  </div>
);
