/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TotalBarSide } from "..";
import { useIsMobile } from "../../../isMobile";

interface Props {
  totalBarSide: TotalBarSide;
  children: React.ReactNode;
}

export const TotalColumn = ({ totalBarSide, children }: Props) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        margin-right: ${isMobile || totalBarSide === TotalBarSide.RIGHT
          ? "4rem"
          : 0};
      `}
    >
      {children}
    </div>
  );
};
