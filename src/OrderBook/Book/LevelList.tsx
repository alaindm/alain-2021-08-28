/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "../config";
import { Level, OrderType } from "../types";

export enum TotalBarSide {
  LEFT,
  RIGHT,
}

interface Props {
  orderType: OrderType;
  totalBarSide: TotalBarSide;
  levels: Level[];
  highestTotal: number;
}

export const LevelList = ({
  orderType,
  totalBarSide,
  levels = [],
  highestTotal,
}: Props) => {
  return (
    <div>
      <div
        css={css`
          color: ${Colors.LIGHT_GRAY};
          display: flex;
          align-items: center;
          height: 1.7rem;
          width: 100%;
          flex-direction: ${totalBarSide === TotalBarSide.LEFT
            ? "row"
            : "row-reverse"};
          border-bottom: 1px solid ${Colors.DARK_GRAY};
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
        <div
          css={css`
            margin-right: ${totalBarSide === TotalBarSide.RIGHT ? "4rem" : 0};
            @media only screen and (max-width: 688px) {
              margin-right: 4rem;
            }
          `}
        >
          TOTAL
        </div>
        <div css={css``}>SIZE</div>
        <div
          css={css`
            margin-right: ${totalBarSide === TotalBarSide.LEFT ? "4rem" : 0};
            @media only screen and (max-width: 688px) {
              margin-right: 0;
            }
          `}
        >
          PRICE
        </div>
      </div>
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
        {levels.map((level) => (
          <div
            css={css`
              height: 1.7rem;
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
                height: 1.7rem;
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
              <div
                css={css`
                  margin-right: ${totalBarSide === TotalBarSide.RIGHT
                    ? "4rem"
                    : 0};
                  @media only screen and (max-width: 688px) {
                    margin-right: 4rem;
                  }
                `}
              >
                {level.total.toLocaleString()}
              </div>
              <div>{level.size.toLocaleString()}</div>
              <div
                css={css`
                  margin-right: ${totalBarSide === TotalBarSide.LEFT
                    ? "4rem"
                    : 0};
                  @media only screen and (max-width: 688px) {
                    margin-right: 0;
                  }
                  color: ${orderType === OrderType.BID
                    ? Colors.LIGHT_GREEN
                    : Colors.LIGHT_RED};
                `}
              >
                {level.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-direction: ${orderType === OrderType.BID
                  ? "row-reverse"
                  : "row"};
                @media only screen and (max-width: 688px) {
                  flex-direction: row;
                }
              `}
            >
              <div
                css={css`
                  height: 1.7rem;
                  width: ${(level.total / highestTotal) * 100}%;
                  background-color: ${orderType === OrderType.BID
                    ? Colors.DARK_GREEN
                    : Colors.DARK_RED};
                `}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
