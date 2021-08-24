/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookComponent } from "./Book";
import { Colors, ETH_GROUPING_OPTIONS, XBT_GROUPING_OPTIONS } from "./config";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { getUpdatedSnapshotFromDeltas } from "./helpers/get-updated-snapshot-from-deltas";
import { RoundTo4Decimals } from "./helpers/utils";
import { Snapshot, ProductTypes, FeedMessage } from "./types";

export const OrderBook = () => {
  const [connectionTrigger, setConnectionTrigger] = useState(true);
  const triggerRecconection = useCallback(
    () => setConnectionTrigger((state) => !state),
    []
  );

  const [productId, setProductId] = useState<ProductTypes>("PI_XBTUSD");
  const webSocketConnectionRef = useRef<WebSocket>();
  const bookStateRef = useRef<Snapshot>({ bids: [], asks: [] });
  const [bookViewState, setBookViewState] = useState<Snapshot>({
    bids: [],
    asks: [],
  });
  const [priceLevelGrouping, setPriceLevelGrouping] = useState(0.5);
  const [spread, setSpread] = useState<number>(0);
  const [spreadPercentage, setSpreadPercentage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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

  const arrageBookViewState = () => {
    setBookViewState(bookStateRef.current);

    // TODO : Put spread calcs in a helper func
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

  const throwFeedError = useCallback(() => {
    const ws = webSocketConnectionRef.current;
    if (!error) {
      ws && ws.close();
      setError("Simulated WebSocket error");
    } else {
      triggerRecconection();
    }
  }, [triggerRecconection, error]);

  useEffect(() => {
    const ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    webSocketConnectionRef.current = ws;

    let timerId: NodeJS.Timeout;

    ws.onopen = () => {
      setError(null);

      timerId = setInterval(() => arrageBookViewState(), 3000);
      // remove later
      setTimeout(() => clearInterval(timerId), 5000);
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
        bookStateRef.current = { bids, asks };
        arrageBookViewState();
      }

      if (message.feed === "book_ui_1" && message.bids && message.asks) {
        const { bids, asks } = message as FeedMessage;
        bookStateRef.current = getUpdatedSnapshotFromDeltas({
          snapshot: bookStateRef.current,
          deltaBids: bids,
          deltaAsks: asks,
        });
      }
    };

    ws.onerror = () => {
      setError("WebSocket error");
    };

    ws.onclose = () => {
      console.log("closing WS");
      clearInterval(timerId);
      bookStateRef.current = { bids: [], asks: [] };
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
        selectedGrouping={priceLevelGrouping}
        groupingOptions={currentGroupingOptions}
        spread={spread}
        spreadPercentage={spreadPercentage}
      />
      <BookComponent
        bookState={bookViewState}
        priceLevelGrouping={priceLevelGrouping}
        error={error}
        spread={spread}
        spreadPercentage={spreadPercentage}
      />
      <Footer
        hasError={!!error}
        onToggleFeed={toggleProduct}
        onKillFeed={throwFeedError}
      />
    </div>
  );
};
