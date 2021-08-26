import { Level, OrderType } from "../types";

enum SortOrder {
  ASCENDING = 1,
  DESCENDING = -1,
}

const getCompareFunction = (sortOrder: SortOrder) => (a: number, b: number) =>
  (a - b) * sortOrder;

export const getLevels = (
  orders: Map<number, number>,
  grouping: number,
  orderType: OrderType
) => {
  const groupedOrdersMap = new Map<number, number>();

  Array.from(orders).forEach(([price, size]) => {
    const priceLevel = price - (price % grouping);
    const currentPriceLevelSize = groupedOrdersMap.get(priceLevel) || 0;
    groupedOrdersMap.set(priceLevel, currentPriceLevelSize + size);
  });

  const sortedLevelList = Array.from(groupedOrdersMap.keys()).sort(
    getCompareFunction(
      orderType === OrderType.BID ? SortOrder.DESCENDING : SortOrder.ASCENDING
    )
  );

  const levelInfoList: Level[] = [];

  sortedLevelList.forEach((level, index) => {
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
