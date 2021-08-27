import { ETH_GROUPING_OPTIONS, XBT_GROUPING_OPTIONS } from "../config";
import { BookInfo, AppSnapshot, OrderType } from "../types";
import { getHighestTotal } from "./helpers/get-highest-total";
import { getLevels } from "./helpers/get-levels";
import { getSpreads } from "./helpers/get-spreads";

type State = {
  productId: string;
  connectionTrigger: boolean;
  book: BookInfo;
  maxRowsToRender: number;
  error: string | null;
  groupingOptions: number[];
  selectedGrouping: number;
  isMobile: boolean;
};

export const initialState: State = {
  productId: "PI_XBTUSD",
  connectionTrigger: false,
  book: {
    bids: [],
    asks: [],
    spread: 0,
    spreadPercentage: 0,
    highestTotal: 0,
  },
  maxRowsToRender: 0,
  error: null,
  groupingOptions: XBT_GROUPING_OPTIONS,
  selectedGrouping: XBT_GROUPING_OPTIONS[0],
  isMobile: true,
};

type Action =
  | { type: "RECONNECT" }
  | { type: "TOGGLE_FEED" }
  | { type: "CHANGE_GROUPING"; payload: number }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "UPDATE_BOOK"; snapshot: AppSnapshot }
  | { type: "SET_MAX_ROWS"; payload: number }
  | { type: "SET_IS_MOBILE"; payload: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "RECONNECT":
      return {
        ...state,
        connectionTrigger: !state.connectionTrigger,
      };
    case "TOGGLE_FEED":
      const nextProductId =
        state.productId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";

      const nextProductIdOptions =
        nextProductId === "PI_XBTUSD"
          ? XBT_GROUPING_OPTIONS
          : ETH_GROUPING_OPTIONS;

      return {
        ...state,
        productId: nextProductId,
        groupingOptions: nextProductIdOptions,
        selectedGrouping: nextProductIdOptions[0],
      };
    case "CHANGE_GROUPING":
      return {
        ...state,
        selectedGrouping: action.payload,
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
        state.selectedGrouping,
        OrderType.BID,
        state.maxRowsToRender,
        state.isMobile
      );

      const asks = getLevels(
        action.snapshot.asks,
        state.selectedGrouping,
        OrderType.ASK,
        state.maxRowsToRender,
        state.isMobile
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
    case "SET_MAX_ROWS":
      return {
        ...state,
        maxRowsToRender: action.payload,
      };
    case "SET_IS_MOBILE":
      return {
        ...state,
        isMobile: action.payload,
      };
    default:
      return state;
  }
};
