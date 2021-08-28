import { Level } from "../types";
import { getHighestTotal } from "./get-highest-total";

test("gets correct highest total", () => {
  const mockedBidLevels = [
    {
      price: 990,
      size: 150,
      total: 150,
    },
    {
      price: 950,
      size: 50,
      total: 410,
    },
    {
      price: 980,
      size: 210,
      total: 360,
    },
  ];

  const mockedAskLevels = [
    {
      price: 1000,
      size: 100,
      total: 100,
    },
    {
      price: 1020,
      size: 50,
      total: 350,
    },
    {
      price: 1010,
      size: 200,
      total: 300,
    },
  ];

  const highestTotal = getHighestTotal(mockedBidLevels, mockedAskLevels);

  expect(highestTotal).toEqual(410);
});

test("gets zero when there no orders placed", () => {
  const mockedBidLevels: Level[] = [];

  const mockedAskLevels: Level[] = [];

  const highestTotal = getHighestTotal(mockedBidLevels, mockedAskLevels);

  expect(highestTotal).toEqual(0);
});

test("gets correct highest total when one side has no orders", () => {
  const mockedBidLevels: Level[] = [];

  const mockedAskLevels = [
    {
      price: 1000,
      size: 100,
      total: 100,
    },
    {
      price: 1020,
      size: 50,
      total: 350,
    },
    {
      price: 1010,
      size: 200,
      total: 300,
    },
  ];

  const highestTotal = getHighestTotal(mockedBidLevels, mockedAskLevels);

  expect(highestTotal).toEqual(350);
});
