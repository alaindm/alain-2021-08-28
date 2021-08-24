import { Level, Order, OrderType } from "../types";

enum SortOrder {
  ASCENDING = 1,
  DESCENDING = -1,
}

const getCompareFunction = (sortOrder: SortOrder) => (a: Order, b: Order) =>
  (a === b ? 0 : a[0] > b[0] ? 1 : -1) * sortOrder;

export function getLevelsFromOrders(
  orders: Order[],
  grouping: number,
  type: OrderType
): Level[] {
  const ordersSorted = [...orders].sort(
    getCompareFunction(
      type === OrderType.BID ? SortOrder.DESCENDING : SortOrder.ASCENDING
    )
  );

  const levels: Level[] = [];
  let currentLevel: Level;

  ordersSorted.forEach(([orderPrice, orderSize]) => {
    if (!currentLevel) {
      currentLevel = {
        price: orderPrice,
        size: orderSize,
        total: orderSize,
      };
    } else {
      if (
        type === OrderType.BID
          ? orderPrice < currentLevel.price - grouping
          : orderPrice > currentLevel.price + grouping
      ) {
        // Place the currentLevel in the groupedOrders
        levels.push(currentLevel);

        // Place the current order as the currentLevel
        currentLevel = {
          price: orderPrice,
          size: orderSize,
          total: orderSize + currentLevel.total,
        };
      } else {
        currentLevel = {
          price: currentLevel.price,
          size: currentLevel.size + orderSize,
          total: currentLevel.total + orderSize,
        };
      }
    }
  });

  return levels;
}
