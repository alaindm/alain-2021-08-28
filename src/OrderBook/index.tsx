/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { BookComponent } from "./book";
import {
  XBT_GROUPING_OPTIONS,
  ETH_GROUPING_OPTIONS,
  Colors,
  ROW_HEIGHT_REM,
  WS_FEED,
  VIEW_UPDATE_INTERVAL,
} from "./config";
import { AppSnapshot, FeedMessage } from "./types";
import { initialState, reducer } from "./state/reducer";
import { useIsMobile } from "./isMobile";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const OrderBook = () => {
  const [{ productId, connectionTrigger, book, error, grouping }, dispatch] =
    useReducer(reducer, initialState);

  const snapshot = useRef<AppSnapshot>({ bids: new Map(), asks: new Map() });
  const webSocketConnectionRef = useRef<WebSocket>();
  const headerElementRef = useRef<HTMLDivElement>(null);
  const footerElementRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch({ type: "SET_IS_MOBILE", payload: isMobile });
  }, [isMobile]);

  useLayoutEffect(() => {
    const bookAreaHeight =
      window.innerHeight -
      (headerElementRef.current?.clientHeight || 0) -
      (footerElementRef.current?.offsetHeight || 0);

    // root font-size is 16px
    const rowHeight = 16 * ROW_HEIGHT_REM;

    dispatch({
      type: "SET_MAX_ROWS",
      payload: Math.floor(bookAreaHeight / rowHeight) - 1, // substract one for the TableHeader row
    });
  }, []);

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
      // This is the same that the 'onerror' method would do to handle the websocket error event
      clearSnapshot();
      dispatch({ type: "SET_ERROR", error: "Simulated WebSocket error" });
    } else {
      dispatch({ type: "RECONNECT" });
    }
  }, [error]);

  useEffect(() => {
    const ws = new WebSocket(WS_FEED);
    webSocketConnectionRef.current = ws;

    let timerId: NodeJS.Timeout;

    ws.onopen = () => {
      dispatch({ type: "SET_ERROR", error: null });

      timerId = setInterval(
        () => dispatch({ type: "UPDATE_BOOK", snapshot: snapshot.current }),
        VIEW_UPDATE_INTERVAL
      );

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
      clearSnapshot();
      dispatch({ type: "SET_ERROR", error: "WebSocket error" });
    };

    ws.onclose = () => {
      clearInterval(timerId);
      clearSnapshot();
      dispatch({ type: "UPDATE_BOOK", snapshot: snapshot.current });
    };

    return () => {
      if (ws.readyState === ws.OPEN) ws.close();
    };
    // productId is omitted from the dependencies to prevent closing and re-opening a connection when changin the productId
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

    return () => {
      ws &&
        ws.send(
          JSON.stringify({
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: [productId],
          })
        );
    };
    // connectionTrigger dependency is necessary here to get the current ws reference
  }, [productId, connectionTrigger]);

  const currentGroupingOptions = useMemo(
    () =>
      productId === "PI_XBTUSD" ? XBT_GROUPING_OPTIONS : ETH_GROUPING_OPTIONS,
    [productId]
  );

  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          "header"
          "book"
          "footer";
        height: 100vh;
        background-color: ${Colors.BLACK};
        color: ${Colors.WHITE};
        .monospace {
          font-family: "Roboto Mono", monospace;
        }
      `}
    >
      <div
        ref={headerElementRef}
        css={css`
          grid-area: header;
        `}
      >
        <Header
          onGroupingChange={handleGroupingChange}
          selectedGrouping={grouping}
          groupingOptions={currentGroupingOptions}
          spread={book.spread}
          spreadPercentage={book.spreadPercentage}
        />
      </div>
      <div
        css={css`
          grid-area: book;
          overflow: auto;
        `}
      >
        <BookComponent
          bookState={book}
          error={error}
          spread={book.spread}
          spreadPercentage={book.spreadPercentage}
        />
      </div>
      <div
        ref={footerElementRef}
        css={css`
          grid-area: footer;
        `}
      >
        <Footer
          hasError={!!error}
          onToggleFeed={toggleProduct}
          onKillFeed={throwFeedError}
        />
      </div>
    </div>
  );
};
