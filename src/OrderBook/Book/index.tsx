/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Snapshot, OrderType } from "../types";
import { Spread } from "../Spread";
import { LevelList, TotalBarSide } from "./LevelList";
import { getLevelsFromOrders } from "../helpers/get-levels-from-orders";

interface Props {
  bookState: Snapshot;
  priceLevelGrouping: number;
  error: string | null;
  spread: number;
  spreadPercentage: number;
}

export const BookComponent = ({
  error,
  bookState,
  priceLevelGrouping,
  spread,
  spreadPercentage,
}: Props) => {
  const bidsGroupedByPriceLevel = getLevelsFromOrders(
    bookState.bids,
    priceLevelGrouping,
    OrderType.BID
  );

  const asksGroupedByPriceLevel = getLevelsFromOrders(
    bookState.asks,
    priceLevelGrouping,
    OrderType.ASK
  );

  const highestTotal =
    bookState.bids.length || bookState.asks.length
      ? Math.max(
          ...bidsGroupedByPriceLevel.map((levelInfo) => levelInfo.total),
          ...asksGroupedByPriceLevel.map((levelInfo) => levelInfo.total)
        )
      : 0;

  if (error) {
    return (
      <div>
        <div>Lost connection</div>
        <div>Reconnecting...</div>
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
        <LevelList
          orderType={OrderType.BID}
          totalBarSide={TotalBarSide.LEFT}
          levels={bidsGroupedByPriceLevel}
          highestTotal={highestTotal}
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
        <LevelList
          orderType={OrderType.ASK}
          totalBarSide={TotalBarSide.RIGHT}
          levels={asksGroupedByPriceLevel}
          highestTotal={highestTotal}
        />
      </div>
    </div>
  );
};
