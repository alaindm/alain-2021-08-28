/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "../../config";
import { Level, OrderType } from "../../types";
import { RowWithBar } from "./RowWithBar";
import { TableBody } from "./TableBody";
import { Row } from "./Row";

interface Props {
  type: OrderType;
  items: Level[];
  highestTotal: number;
}

export const OrderTable = ({ type, items, highestTotal }: Props) => (
  <>
    <Row type={type} style={{ borderBottom: `1px solid ${Colors.DARK_GRAY}` }}>
      <div>PRICE</div>
      <div>SIZE</div>
      <div>TOTAL</div>
    </Row>
    <TableBody type={type}>
      {items.map((level) => (
        <RowWithBar
          key={level.price}
          type={type}
          total={level.total}
          highestTotal={highestTotal}
        >
          <div
            css={css`
              color: ${type === OrderType.BID
                ? Colors.LIGHT_GREEN
                : Colors.LIGHT_RED};
            `}
          >
            {level.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div>{level.size.toLocaleString()}</div>
          <div>{level.total.toLocaleString()}</div>
        </RowWithBar>
      ))}
    </TableBody>
  </>
);
