/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./Colors";

interface Props {
  spread: number;
  spreadPercentage: number;
}

export const SpreadInfo = ({ spread, spreadPercentage }: Props) => (
  <div
    css={css`
      color: ${Colors.LIGHT_GRAY};
    `}
  >
    {spread
      ? `Spread: ${spread.toFixed(2)}   (${spreadPercentage})%`
      : `Spread: -`}
  </div>
);
