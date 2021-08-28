import { getSpreads } from "./get-spreads";

test("gets correct spread given a snapshot", () => {
  const mockedSnapshot = {
    bids: new Map([
      [940.5, 10],
      [980.5, 6],
      [800, 22],
    ]),
    asks: new Map([
      [1009, 3],
      [1110, 4],
      [1013.5, 60],
    ]),
  };

  const { spread, spreadPercentage } = getSpreads(mockedSnapshot);

  expect(spread).toEqual(28.5);
  expect(spreadPercentage).toEqual(0.0287);
});

test("gets zero when there are no market", () => {
  const mockedNoOrdersSnapshot = {
    bids: new Map<number, number>([]),
    asks: new Map([[1009, 3]]),
  };

  const { spread, spreadPercentage } = getSpreads(mockedNoOrdersSnapshot);

  expect(spread).toEqual(0);
  expect(spreadPercentage).toEqual(0);
});
