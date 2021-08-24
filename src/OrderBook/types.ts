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

export type Snapshot = {
  bids: Order[];
  asks: Order[];
};

export type FeedMessage = Snapshot & {
  feed: string;
  product_id: string;
};
