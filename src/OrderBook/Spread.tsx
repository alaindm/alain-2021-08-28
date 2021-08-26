/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./config";

interface Props {
  spread: number;
  spreadPercentage: number;
}

export const Spread = ({ spread, spreadPercentage }: Props) => {
  return (
    <div
      css={css`
        font-size: 0.8rem;
        color: ${Colors.LIGHT_GRAY};
      `}
    >
      <span style={{ marginRight: "10px" }}>Spread:</span>
      <span className="monospace">
        {spread ? `${spread.toFixed(2)}   (${spreadPercentage * 100})%` : `-`}
      </span>
    </div>
  );
};
