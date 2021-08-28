import { OrderType } from "./../types";
import { getLevels } from "./get-levels";

const mockedOrders = new Map([
  [104, 10],
  [101, 6],
  [103, 22],
  [102, 3],
  [105, 10],
  [106, 15],
  [107, 2],
  [108, 9],
  [109, 5],
]);

test("gets correct levels - grouping", () => {
  expect(getLevels(mockedOrders, 2.5, OrderType.ASK, 10, false)).toStrictEqual([
    { price: 100, size: 9, total: 9 },
    { price: 102.5, size: 32, total: 41 },
    { price: 105, size: 27, total: 68 },
    { price: 107.5, size: 14, total: 82 },
  ]);
});

test("gets correct levels - order type", () => {
  expect(getLevels(mockedOrders, 2.5, OrderType.BID, 10, false)).toStrictEqual([
    { price: 107.5, size: 14, total: 14 },
    { price: 105, size: 27, total: 41 },
    { price: 102.5, size: 32, total: 73 },
    { price: 100, size: 9, total: 82 },
  ]);
});

test("gets correct levels - max rows", () => {
  expect(getLevels(mockedOrders, 2.5, OrderType.BID, 3, false)).toStrictEqual([
    { price: 107.5, size: 14, total: 14 },
    { price: 105, size: 27, total: 41 },
    { price: 102.5, size: 32, total: 73 },
  ]);
});

test("gets correct levels - max rows - mobile", () => {
  expect(getLevels(mockedOrders, 2.5, OrderType.BID, 5, true)).toStrictEqual([
    { price: 107.5, size: 14, total: 14 },
    { price: 105, size: 27, total: 41 },
  ]);
});
