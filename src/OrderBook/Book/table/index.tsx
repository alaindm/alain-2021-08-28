/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "../../config";
import { Level, OrderType } from "../../types";
import { PriceColumn } from "./columns/PriceColumn";
import { SizeColumn } from "./columns/SizeColumn";
import { TotalColumn } from "./columns/TotalColumn";
import { Row } from "./Row";
import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";

export enum TotalBarSide {
  LEFT,
  RIGHT,
}

interface Props {
  orderType: OrderType;
  totalBarSide: TotalBarSide;
  highestTotal: number;
  levels: Level[];
}

export const Table = ({
  orderType,
  totalBarSide,
  levels,
  highestTotal,
}: Props) => {
  return (
    <>
      <TableHeader orderType={orderType} totalBarSide={totalBarSide}>
        <TotalColumn totalBarSide={totalBarSide}>TOTAL</TotalColumn>
        <SizeColumn>SIZE</SizeColumn>
        <PriceColumn totalBarSide={totalBarSide}>PRICE</PriceColumn>
      </TableHeader>
      <TableBody orderType={orderType}>
        {levels.map((level) => (
          <Row
            key={level.price}
            orderType={orderType}
            levelTotal={level.total}
            highestTotal={highestTotal}
            totalBarSide={totalBarSide}
          >
            <TotalColumn totalBarSide={totalBarSide}>
              {level.total.toLocaleString()}
            </TotalColumn>
            <SizeColumn>{level.size.toLocaleString()}</SizeColumn>
            <PriceColumn totalBarSide={totalBarSide}>
              <div
                css={css`
                  color: ${orderType === OrderType.BID
                    ? Colors.LIGHT_GREEN
                    : Colors.LIGHT_RED};
                `}
              >
                {level.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </PriceColumn>
          </Row>
        ))}
      </TableBody>
    </>
  );
};
