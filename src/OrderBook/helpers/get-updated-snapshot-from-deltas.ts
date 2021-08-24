import { Snapshot, Order } from "../types";

type ProcessOrdersDeltaParams = {
  snapshot: Snapshot;
  deltaBids: Order[];
  deltaAsks: Order[];
};

export function getUpdatedSnapshotFromDeltas({
  snapshot,
  deltaBids,
  deltaAsks,
}: ProcessOrdersDeltaParams): Snapshot {
  return {
    bids: getUpdatedOrdersFromDeltas(snapshot.bids, deltaBids),
    asks: getUpdatedOrdersFromDeltas(snapshot.asks, deltaAsks),
  };
}

function getUpdatedOrdersFromDeltas(snapshot: Order[], deltas: Order[]) {
  // gets a new copy of the snapshot, so the original is not mutated
  const snapshotClone = snapshot.map(([price, size]) => [price, size] as Order);

  deltas.forEach(([price, size]) => {
    const indexInSnapshot = snapshotClone.findIndex(
      ([snapshotPrice]) => snapshotPrice === price
    );
    if (indexInSnapshot === -1) {
      // new order level
      snapshotClone.push([price, size]);
    } else {
      // update the size
      snapshotClone[indexInSnapshot][1] = size;
    }
  });

  const updatedSnapshotWithoutRemovedOrders = snapshotClone.filter(
    // removes orders with size zero
    ([, size]) => size !== 0
  );

  return updatedSnapshotWithoutRemovedOrders;
}
