export type ProductTypes = "PI_XBTUSD" | "PI_ETHUSD";

export enum OrderType {
  BID,
  ASK,
}

export type Order = [number, number]; // [price, size]

export type Level = {
  price: number;
  size: number;
  total: number;
};

export type AppSnapshot = {
  bids: Map<number, number>;
  asks: Map<number, number>;
};

export type FeedSnapshot = {
  bids: Order[];
  asks: Order[];
};

export type FeedMessage = FeedSnapshot & {
  feed: string;
  product_id: string;
};

export type BookInfo = {
  bids: Level[];
  asks: Level[];
  spread: number;
  spreadPercentage: number;
  highestTotal: number;
};
