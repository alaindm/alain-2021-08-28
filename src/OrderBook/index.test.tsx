import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WS from "jest-websocket-mock";
import { OrderBook } from "./index";
import { WS_FEED } from "./config";

describe("WebSockets, app state and UI", () => {
  let server: WS;

  beforeEach(() => {
    server = new WS(WS_FEED, { jsonProtocol: true });

    render(<OrderBook />);
  });

  afterEach(() => {
    WS.clean();
  });

  test("renders the title", () => {
    const title = screen.getByText("Order Book");
    expect(title).toBeInTheDocument();
  });

  test("subscribes to a feed", async () => {
    await server.connected;

    await waitFor(() => {
      expect(server).toReceiveMessage({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      });
    });
  });

  test("renders the received snapshot", async () => {
    server.send(mockedXBTUSDFeedSubscriptionMessage);

    const bestBid = await screen.findByText("48,715.50");
    expect(bestBid).toBeInTheDocument();

    const bestBidSize = await screen.findAllByText("31,500");
    expect(bestBidSize[0]).toBeInTheDocument();

    const bestAsk = await screen.findByText("48,728.50");
    expect(bestAsk).toBeInTheDocument();

    const bestAskSize = await screen.findAllByText("2,500");
    expect(bestAskSize[0]).toBeInTheDocument();

    const worstBid = await screen.findByText("48,672.50");
    expect(worstBid).toBeInTheDocument();
  });

  test("renders the correct spread", async () => {
    server.send(mockedXBTUSDFeedSubscriptionMessage);

    const spread = await screen.findAllByTestId("spread");
    expect(spread[0].textContent).toContain("13.00");
    expect(spread[0].textContent).toContain("(0.03)%");
  });

  test("reflects the correct grouping", async () => {
    server.send(mockedXBTUSDFeedSubscriptionMessage);

    const bestBidNotGrouped = screen.getByText("48,715.50");
    expect(bestBidNotGrouped).toBeInTheDocument();

    const groupingSelect = screen.getByTestId("grouping-select");

    userEvent.selectOptions(groupingSelect, [screen.getByText("Group 1.00")]);
    const bestBidXBTGroup1 = await screen.findByText("48,715.00");

    expect(bestBidXBTGroup1).toBeInTheDocument();

    expect(bestBidNotGrouped).not.toBeInTheDocument();
  });

  test("toggling the feed updates grouping and the orders", async () => {
    await server.connected;

    await waitFor(() => {
      expect(server).toReceiveMessage({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      });
    });

    server.send(mockedXBTUSDFeedSubscriptionMessage);

    const bestBidXBT = await screen.findByText("48,715.50");
    expect(bestBidXBT).toBeInTheDocument();

    const toggleFeedButton = screen.getByTestId("toggle-feed-button");
    fireEvent.click(toggleFeedButton, "click");

    await waitFor(() => {
      expect(server).toReceiveMessage({
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      });
    });

    server.send(mockedETHUSDFeedSubscriptionMessage);

    const groupingSelectETH = await screen.findByText("Group 0.05");
    expect(groupingSelectETH).toBeInTheDocument();

    const bestBidETH = await screen.findByText("3,247.55");
    expect(bestBidETH).toBeInTheDocument();

    expect(bestBidXBT).not.toBeInTheDocument();
  });

  test("kill feed", async () => {
    server.send(mockedXBTUSDFeedSubscriptionMessage);

    const bestBid = await screen.findByText("48,715.50");
    expect(bestBid).toBeInTheDocument();

    const killFeedButton = screen.getByTestId("kill-feed-button");
    fireEvent.click(killFeedButton, "click");

    const lostConnectionMessage = await screen.findByText("Lost connection");
    expect(lostConnectionMessage).toBeInTheDocument();
    expect(bestBid).not.toBeInTheDocument();
  });

  test("websocket error", async () => {
    server.send(mockedXBTUSDFeedSubscriptionMessage);

    const bestBid = await screen.findByText("48,715.50");
    expect(bestBid).toBeInTheDocument();

    server.error();

    const lostConnectionMessage = await screen.findByText("Lost connection");

    expect(lostConnectionMessage).toBeInTheDocument();

    expect(bestBid).not.toBeInTheDocument();
  });

  //   TODO
  //   test("delta zero removes the order", async () => {
  //   });
  //   test("delta non-zero updates order size", () => {});
});

const mockedXBTUSDFeedSubscriptionMessage = {
  numLevels: 25,
  feed: "book_ui_1_snapshot",
  bids: [
    [48715.5, 31500],
    [48715, 6514],
    [48710, 4258],
    [48709, 2594],
    [48708.5, 1000],
    [48708, 9148],
    [48702, 31500],
    [48698.5, 2500],
    [48696, 4529],
    [48695.5, 4739],
    [48695, 31500],
    [48694, 9533],
    [48691.5, 13032],
    [48690, 5000],
    [48689.5, 25000],
    [48687.5, 20000],
    [48686, 20000],
    [48685.5, 5970],
    [48684, 211430],
    [48682, 65680],
    [48679, 3766],
    [48678.5, 62549],
    [48678, 20000],
    [48673.5, 10832],
    [48672.5, 9733],
  ],
  asks: [
    [48728.5, 2500],
    [48732, 20000],
    [48735, 450],
    [48736, 1000],
    [48737, 20000],
    [48737.5, 67234],
    [48738.5, 2500],
    [48740, 5000],
    [48740.5, 4519],
    [48742.5, 154027],
    [48745.5, 24638],
    [48746, 20000],
    [48750.5, 2500],
    [48751, 60319],
    [48751.5, 24921],
    [48752.5, 10000],
    [48753, 10000],
    [48755, 25632],
    [48756.5, 450],
    [48758, 190],
    [48759, 7500],
    [48759.5, 22003],
    [48762, 2500],
    [48765, 10626],
    [48766.5, 5970],
  ],
  product_id: "PI_XBTUSD",
};

const mockedETHUSDFeedSubscriptionMessage = {
  numLevels: 25,
  feed: "book_ui_1_snapshot",
  bids: [
    [3247.55, 250],
    [3247.4, 3732],
    [3247.25, 1656],
  ],
  asks: [
    [3248.55, 720],
    [3248.6, 1697],
    [3249.1, 10398],
  ],
  product_id: "PI_ETHUSD",
};
