/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { BookComponent } from "./book";
import { XBT_GROUPING_OPTIONS, ETH_GROUPING_OPTIONS, Colors } from "./config";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { AppSnapshot, BookInfo, FeedMessage, OrderType } from "./types";
import { getSpreads } from "./helpers/get-spreads";
import { getLevels } from "./helpers/get-levels";
import { getHighestTotal } from "./helpers/get-highest-total";

type State = {
  productId: string;
  connectionTrigger: boolean;
  book: BookInfo;
  error: string | null;
  grouping: number;
};

type Action =
  | { type: "RECONNECT" }
  | { type: "TOGGLE_FEED" }
  | { type: "CHANGE_GROUPING"; payload: number }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "UPDATE_BOOK"; snapshot: AppSnapshot };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "RECONNECT":
      return {
        ...state,
        connectionTrigger: !state.connectionTrigger,
      };
    case "TOGGLE_FEED":
      return {
        ...state,
        productId: state.productId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD",
      };
    case "CHANGE_GROUPING":
      return {
        ...state,
        grouping: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "UPDATE_BOOK":
      const { spread, spreadPercentage } = getSpreads(action.snapshot);

      const bids = getLevels(
        action.snapshot.bids,
        state.grouping,
        OrderType.BID
      );

      const asks = getLevels(
        action.snapshot.asks,
        state.grouping,
        OrderType.ASK
      );

      return {
        ...state,
        book: {
          bids,
          asks,
          spread,
          spreadPercentage,
          highestTotal: getHighestTotal(bids, asks),
        },
      };
    default:
      return state;
  }
};

const initialState: State = {
  productId: "PI_XBTUSD",
  connectionTrigger: false,
  book: {
    bids: [],
    asks: [],
    spread: 0,
    spreadPercentage: 0,
    highestTotal: 0,
  },
  error: null,
  grouping: 0.5,
};

export const OrderBook = () => {
  const [{ productId, connectionTrigger, book, error, grouping }, dispatch] =
    useReducer(reducer, initialState);

  const webSocketConnectionRef = useRef<WebSocket>();
  const snapshot = useRef<AppSnapshot>({ bids: new Map(), asks: new Map() });

  const clearSnapshot = () => {
    snapshot.current = {
      bids: new Map(),
      asks: new Map(),
    };
  };

  const toggleProduct = useCallback(
    () => dispatch({ type: "TOGGLE_FEED" }),
    []
  );

  const handleGroupingChange = useCallback((selectedGrouping: number) => {
    dispatch({ type: "CHANGE_GROUPING", payload: selectedGrouping });
  }, []);

  const throwFeedError = useCallback(() => {
    const ws = webSocketConnectionRef.current;
    if (!error) {
      ws && ws.close();
      clearSnapshot();
      dispatch({ type: "SET_ERROR", error: "Simulated WebSocket error" });
    } else {
      dispatch({ type: "RECONNECT" });
    }
  }, [error]);

  useEffect(() => {
    const ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    webSocketConnectionRef.current = ws;

    let timerId: NodeJS.Timeout;

    ws.onopen = () => {
      dispatch({ type: "SET_ERROR", error: null });

      timerId = setInterval(
        () => dispatch({ type: "UPDATE_BOOK", snapshot: snapshot.current }),
        1000
      );

      console.log("subscribing to", productId);
      ws.send(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: [productId],
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.feed === "book_ui_1_snapshot") {
        const { bids, asks } = message as FeedMessage;

        clearSnapshot();
        bids.forEach(([price, size]) => snapshot.current.bids.set(price, size));
        asks.forEach(([price, size]) => snapshot.current.asks.set(price, size));

        dispatch({ type: "UPDATE_BOOK", snapshot: snapshot.current });
      }

      if (message.feed === "book_ui_1" && message.bids && message.asks) {
        const { bids, asks } = message as FeedMessage;

        bids.forEach(([price, size]) =>
          size === 0
            ? snapshot.current.bids.delete(price)
            : snapshot.current.bids.set(price, size)
        );

        asks.forEach(([price, size]) =>
          size === 0
            ? snapshot.current.asks.delete(price)
            : snapshot.current.asks.set(price, size)
        );
      }
    };

    ws.onerror = () => {
      dispatch({ type: "SET_ERROR", error: "WebSocket error" });
    };

    ws.onclose = () => {
      console.log("closing WS");
      clearInterval(timerId);
      clearSnapshot();
      dispatch({ type: "UPDATE_BOOK", snapshot: snapshot.current });
    };

    return () => {
      if (ws.readyState === ws.OPEN) ws.close();
    };
  }, [connectionTrigger]);

  useEffect(() => {
    const ws = webSocketConnectionRef.current;

    ws &&
      ws.readyState === ws.OPEN &&
      ws.send(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: [productId],
        })
      );

    console.log("subscribing to", productId);

    return () => {
      console.log("UNsubscribing to", productId);
      ws &&
        ws.send(
          JSON.stringify({
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: [productId],
          })
        );
    };
  }, [productId]);

  const currentGroupingOptions = useMemo(
    () =>
      productId === "PI_XBTUSD" ? XBT_GROUPING_OPTIONS : ETH_GROUPING_OPTIONS,
    [productId]
  );

  return (
    <div
      css={css`
        background-color: ${Colors.BLACK};
        color: ${Colors.WHITE};
        .monospace {
          font-family: "Roboto Mono", monospace;
        }
      `}
    >
      <Header
        onGroupingChange={handleGroupingChange}
        selectedGrouping={grouping}
        groupingOptions={currentGroupingOptions}
        spread={book.spread}
        spreadPercentage={book.spreadPercentage}
      />
      <BookComponent
        bookState={book}
        error={error}
        spread={book.spread}
        spreadPercentage={book.spreadPercentage}
      />
      <Footer
        hasError={!!error}
        onToggleFeed={toggleProduct}
        onKillFeed={throwFeedError}
      />
    </div>
  );
};
