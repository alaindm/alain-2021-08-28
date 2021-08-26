export const RoundTo4Decimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 10000) / 10000;
