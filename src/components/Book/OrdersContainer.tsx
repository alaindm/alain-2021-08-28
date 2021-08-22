import { Book } from "../../OrderBook";
import { SpreadInfo } from "../SpreadInfo";
import { OrderList } from "./OrderList";

interface Props {
  bookState: Book;
  priceLevelGrouping: number;
  error: string | null;
  spread: number;
  spreadPercentage: number;
}

export const OrdersContainer = ({
  error,
  bookState,
  priceLevelGrouping,
  spread,
  spreadPercentage,
}: Props) => {
  console.log("bids", bookState.bids);
  console.log("asks", bookState.asks);
  console.log(spread);
  return (
    <div>
      {/* <BuySide /> */}
      <OrderList
        orders={[
          { price: 123, size: 10 },
          { price: 789, size: 99 },
        ]}
      />
      <SpreadInfo spread={spread} spreadPercentage={spreadPercentage} />
      {/* <SellSide /> */}
      <OrderList
        orders={[
          { price: 123, size: 10 },
          { price: 789, size: 99 },
        ]}
      />
    </div>
  );
};
