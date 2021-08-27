import { OrderType, Level } from "../types";

enum SortOrder {
  ASCENDING = 1,
  DESCENDING = -1,
}

const getCompareFunction = (sortOrder: SortOrder) => (a: number, b: number) =>
  (a - b) * sortOrder;

export const getLevels = (
  orders: Map<number, number>,
  grouping: number,
  orderType: OrderType,
  maxRows: number,
  isMobile: boolean
) => {
  const groupedOrdersMap = new Map<number, number>();

  Array.from(orders).forEach(([price, size]) => {
    const priceLevel = price - (price % grouping);
    const currentPriceLevelSize = groupedOrdersMap.get(priceLevel) || 0;
    groupedOrdersMap.set(priceLevel, currentPriceLevelSize + size);
  });

  const maxRowsPerLevel = isMobile ? Math.ceil(maxRows / 2) - 1 : maxRows;

  const sortedLevelList = Array.from(groupedOrdersMap.keys()).sort(
    getCompareFunction(
      orderType === OrderType.BID ? SortOrder.DESCENDING : SortOrder.ASCENDING
    )
  );

  const sortedLevelListCapped = sortedLevelList.slice(0, maxRowsPerLevel);

  const levelInfoList: Level[] = [];

  sortedLevelListCapped.forEach((level, index) => {
    const groupSize = groupedOrdersMap.get(level) as number;
    const previousTotal = levelInfoList[index - 1]?.total || 0;

    levelInfoList.push({
      price: level,
      size: groupSize,
      total: groupSize + previousTotal,
    });
  });

  return levelInfoList;
};
