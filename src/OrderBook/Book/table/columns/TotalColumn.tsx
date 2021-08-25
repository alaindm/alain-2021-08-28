/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TotalBarSide } from "..";

interface Props {
  totalBarSide: TotalBarSide;
  children: React.ReactNode;
}

export const TotalColumn = ({ totalBarSide, children }: Props) => (
  <div
    css={css`
      margin-right: ${totalBarSide === TotalBarSide.RIGHT ? "4rem" : 0};
      @media only screen and (max-width: 688px) {
        margin-right: 4rem;
      }
    `}
  >
    {children}
  </div>
);
