/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useIsMobile } from "../../isMobile";
import { OrderType } from "../../types";

export const TableBody: React.FC<{ orderType: OrderType }> = ({
  children,
  orderType,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex-direction: ${isMobile
          ? orderType === OrderType.BID
            ? "column"
            : "column-reverse"
          : "column"};
      `}
    >
      {children}
    </div>
  );
};
