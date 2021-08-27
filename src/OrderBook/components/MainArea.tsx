/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Spread } from "./Spread";
import { OrderTable } from "./OrderTable";
import { ROW_HEIGHT_REM } from "../config";
import { useIsMobile } from "../helpers/isMobile";
import { BookInfo, OrderType } from "../types";

interface Props {
  bookState: BookInfo;
  error: string | null;
  spread: number;
  spreadPercentage: number;
}

export const MainArea = ({
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
        <OrderTable
          type={OrderType.BID}
          items={bookState.bids}
          highestTotal={bookState.highestTotal}
        />
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          height: ${ROW_HEIGHT_REM}rem;
          display: ${!isMobile && "none"};
          font-size: 0.8rem;
        `}
      >
        <Spread spread={spread} spreadPercentage={spreadPercentage} />
      </div>
      <div
        css={css`
          flex: 1;
        `}
      >
        <OrderTable
          type={OrderType.ASK}
          items={bookState.asks}
          highestTotal={bookState.highestTotal}
        />
      </div>
    </div>
  );
};
