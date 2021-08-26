/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TotalBarSide } from ".";
import { ROW_HEIGHT_REM } from "../../config";
import { OrderType } from "../../types";
import { TotalLevelBar } from "./TotalLevelBar";

interface Props {
  orderType: OrderType;
  highestTotal: number;
  levelTotal: number;
  totalBarSide: TotalBarSide;
  children: React.ReactNode;
}

export const Row = ({
  orderType,
  levelTotal,
  highestTotal,
  totalBarSide,
  children,
}: Props) => (
  <div
    css={css`
      height: ${ROW_HEIGHT_REM}rem;
      width: 100%;
      position: relative;
    `}
  >
    <div
      css={css`
        width: 100%;
        display: flex;
        background-color: transparent;
        position: absolute;
        flex-direction: ${totalBarSide === TotalBarSide.LEFT
          ? "row"
          : "row-reverse"};
        height: ${ROW_HEIGHT_REM}rem;
        align-items: center;
        > * {
          width: 33.333%;
          text-align: end;
        }
        @media only screen and (max-width: 688px) {
          flex-direction: row-reverse;
        }
      `}
    >
      {children}
    </div>
    <TotalLevelBar
      orderType={orderType}
      total={levelTotal}
      highestTotal={highestTotal}
    />
  </div>
);
