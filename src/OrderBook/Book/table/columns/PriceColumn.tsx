/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TotalBarSide } from "..";

interface Props {
  totalBarSide: TotalBarSide;
  children: React.ReactNode;
}

export const PriceColumn = ({ totalBarSide, children }: Props) => (
  <div
    css={css`
      margin-right: ${totalBarSide === TotalBarSide.LEFT ? "4rem" : 0};
      @media only screen and (max-width: 688px) {
        margin-right: 0;
      }
    `}
  >
    {children}
  </div>
);
