import { AppSnapshot } from "../../types";
import { RoundTo4Decimals } from "./utils";

export const getSpreads = (snapshot: AppSnapshot) => {
  const hasOrders = !!(snapshot.bids.size && snapshot.asks.size);

  if (hasOrders) {
    const bestBid = Math.max(...Array.from(snapshot.bids.keys()));
    const bestAsk = Math.min(...Array.from(snapshot.asks.keys()));

    const spread = bestAsk - bestBid;

    return {
      spread,
      spreadPercentage: RoundTo4Decimals(spread / ((bestBid + bestAsk) / 2)),
    };
  } else {
    return {
      spread: 0,
      spreadPercentage: 0,
    };
  }
};
