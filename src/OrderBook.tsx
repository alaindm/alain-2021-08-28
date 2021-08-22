/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OrdersContainer } from "./components/Book/OrdersContainer";
import { Colors } from "./components/Colors";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

// [price, size]
type Order = [number, number];

type ProductTypes = "PI_XBTUSD" | "PI_ETHUSD";

type FeedMessage = Book & {
  asks: Order[];
  bids: Order[];
  feed: string;
  product_id: string;
};

export type Book = {
  bids: Order[];
  asks: Order[];
};

// enum ConnectionState  {
//   CONNECTING, CONNECTED, ERROR
// }

const XBT_GROUPING_OPTIONS = [0.5, 1, 2.5];
const ETH_GROUPING_OPTIONS = [0.05, 0.1, 0.25];

export const OrderBook = () => {
  const [productId, setProductId] = useState<ProductTypes>("PI_XBTUSD");

  const webSocketConnectionRef = useRef<WebSocket>();

  const bookStateRef = useRef<Book>({ bids: [], asks: [] });
  const [bookViewState, setBookViewState] = useState<Book>({
    bids: [],
    asks: [],
  });

  const [priceLevelGrouping, setPriceLevelGrouping] = useState(0.5);

  const [spread, setSpread] = useState<number>(0);
  const [spreadPercentage, setSpreadPercentage] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const arrageBookViewState = () => {
    setBookViewState(bookStateRef.current);

    const bestBid = Math.max(
      ...bookStateRef.current.bids.map((order) => order[0])
    );
    const bestAsk = Math.min(
      ...bookStateRef.current.asks.map((order) => order[0])
    );

    const spread = bestAsk - bestBid;

    const spreadRelative = RoundTo4Decimals(spread / ((bestBid + bestAsk) / 2));

    setSpread(spread);
    setSpreadPercentage(spreadRelative * 100);
  };

  const toggleProduct = useCallback(
    () =>
      setProductId((currentProductId) =>
        currentProductId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD"
      ),
    []
  );

  const handleGroupingChange = useCallback((selectedGrouping: number) => {
    setPriceLevelGrouping(selectedGrouping);
  }, []);

  const throwFeedError = useCallback(() => {
    const ws = webSocketConnectionRef.current;
    if (ws && ws.readyState === ws.OPEN) {
      // send some message that triggers and error?
      ws.send(
        JSON.stringify({
          event: "unsubscribe",
          feed: "book_ui_1",
          product_ids: [productId],
        })
      );
      ws.close();
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    webSocketConnectionRef.current = ws;

    let timerId: NodeJS.Timeout;

    ws.onopen = () => {
      setError(null);
      ws.send(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: [productId],
        })
      );

      timerId = setInterval(() => arrageBookViewState(), 1000);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.feed === "book_ui_1_snapshot") {
        const { bids, asks } = message as FeedMessage;
        bookStateRef.current = { bids, asks };
      }

      if (message.feed === "book_ui_1" && message.bids && message.asks) {
        const { bids, asks } = message as FeedMessage;
        bookStateRef.current = applyDeltasToOrderBookState({
          snapshot: bookStateRef.current,
          deltaBids: bids,
          deltaAsks: asks,
        });
      }
    };

    ws.onerror = (e) => {
      console.error(e);
      setError("Connection error");
    };

    ws.onclose = (e) => {
      console.log(e);
      clearInterval(timerId);
      setError("Closed connection");
    };

    return () => {
      ws.send(
        JSON.stringify({
          event: "unsubscribe",
          feed: "book_ui_1",
          product_ids: [productId],
        })
      );
      // ws.close();
    };
  }, [productId]);

  useEffect(() => {
    return () => {
      const ws = webSocketConnectionRef.current;
      if (ws && ws.readyState === ws.OPEN) {
        ws.close();
      }
    };
  }, []);

  const currentGroupingOptions = useMemo(
    () =>
      productId === "PI_XBTUSD" ? XBT_GROUPING_OPTIONS : ETH_GROUPING_OPTIONS,
    [productId]
  );

  return (
    <div
      css={css`
        background-color: ${Colors.DARK_GRAY};
        color: ${Colors.WHITE};
        height: 100vh;
        width: 100vw;
      `}
    >
      <Header
        onGroupingChange={handleGroupingChange}
        selectedGrouping={priceLevelGrouping}
        groupingOptions={currentGroupingOptions}
        spread={spread}
        spreadPercentage={spreadPercentage}
      />
      <OrdersContainer
        bookState={bookViewState}
        priceLevelGrouping={priceLevelGrouping}
        error={error}
        spread={spread}
        spreadPercentage={spreadPercentage}
      />
      <Footer onToggleFeed={toggleProduct} onKillFeed={throwFeedError} />
    </div>
  );
};

type ProcessOrdersDeltaParams = {
  snapshot: Book;
  deltaBids: Order[];
  deltaAsks: Order[];
};

function applyDeltasToOrderBookState({
  snapshot,
  deltaBids,
  deltaAsks,
}: ProcessOrdersDeltaParams): Book {
  return {
    bids: applyDeltasToOrders(snapshot.bids, deltaBids),
    asks: applyDeltasToOrders(snapshot.asks, deltaAsks),
  };
}

function applyDeltasToOrders(snapshot: Order[], deltas: Order[]) {
  deltas.forEach((orderDelta) => {
    const indexInSnapshot = snapshot.findIndex(
      (snapshopOrder) => snapshopOrder[0] === orderDelta[0]
    );
    if (indexInSnapshot === -1) {
      // new order level
      snapshot.push(orderDelta);
    } else {
      // update the size
      snapshot[indexInSnapshot][1] = orderDelta[1];
    }
  });

  // removes orders with size zero
  const updatedSnapshot = snapshot.filter((order) => order[1]);

  return updatedSnapshot;
}

const RoundTo4Decimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 10000) / 10000;
