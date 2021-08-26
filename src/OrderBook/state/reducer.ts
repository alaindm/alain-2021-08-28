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
  grouping: number;
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
  grouping: 0.5,
};

type Action =
  | { type: "RECONNECT" }
  | { type: "TOGGLE_FEED" }
  | { type: "CHANGE_GROUPING"; payload: number }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "UPDATE_BOOK"; snapshot: AppSnapshot }
  | { type: "SET_MAX_ROWS"; payload: number };

export const reducer = (state: State, action: Action) => {
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
        OrderType.BID,
        state.maxRowsToRender
      );

      const asks = getLevels(
        action.snapshot.asks,
        state.grouping,
        OrderType.ASK,
        state.maxRowsToRender
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
    default:
      return state;
  }
};
