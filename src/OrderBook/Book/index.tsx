/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { BookInfo, OrderType } from "../types";
import { Spread } from "../Spread";
import { Table, TotalBarSide } from "./table";

interface Props {
  bookState: BookInfo;
  error: string | null;
  spread: number;
  spreadPercentage: number;
}

export const BookComponent = ({
  error,
  bookState,
  spread,
  spreadPercentage,
}: Props) => {
  if (error) {
    return (
      <div>
        <div>Lost connection</div>
      </div>
    );
  }
  return (
    <div
      className="monospace"
      css={css`
        font-size: 14px;
        display: flex;
        width: 100%;
        @media only screen and (max-width: 688px) {
          flex-direction: column-reverse;
        }
      `}
    >
      <div
        css={css`
          flex: 1;
        `}
      >
        <Table
          orderType={OrderType.BID}
          totalBarSide={TotalBarSide.LEFT}
          levels={bookState.bids}
          highestTotal={bookState.highestTotal}
        />
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          > * {
            padding: 10px;
          }
          @media only screen and (min-width: 688px) {
            display: none;
          }
        `}
      >
        <Spread spread={spread} spreadPercentage={spreadPercentage} />
      </div>
      <div
        css={css`
          flex: 1;
        `}
      >
        <Table
          orderType={OrderType.ASK}
          totalBarSide={TotalBarSide.RIGHT}
          levels={bookState.asks}
          highestTotal={bookState.highestTotal}
        />
      </div>
    </div>
  );
};
