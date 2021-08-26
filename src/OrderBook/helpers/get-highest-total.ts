import { Level } from "../types";

export const getHighestTotal = (bids: Level[], asks: Level[]) => {
  const bidTotals = Object.values(bids).map((level) => level.total);
  const askTotals = Object.values(asks).map((level) => level.total);

  return bidTotals.length || askTotals.length
    ? Math.max(...bidTotals, ...askTotals)
    : 0;
};
