/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { BookInfo, OrderType } from "../types";
import { Spread } from "../Spread";
import { Table, TotalBarSide } from "./table";
import { useIsMobile } from "../isMobile";

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
  const isMobile = useIsMobile();

  if (error) {
    return (
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        `}
      >
        <div>Lost connection</div>
      </div>
    );
  }
  return (
    <div
      className="monospace"
      css={css`
        font-size: 0.875rem;
        display: flex;
        width: 100%;
        flex-direction: ${isMobile && "column-reverse"};
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
            padding: 0.6rem;
          }
          display: ${!isMobile && "none"};
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
