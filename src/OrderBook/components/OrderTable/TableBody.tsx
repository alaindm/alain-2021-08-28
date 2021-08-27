/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useIsMobile } from "../../helpers/isMobile";
import { OrderType } from "../../types";

interface Props {
  type: OrderType;
  children: React.ReactNode;
}

export const TableBody = ({ children, type }: Props) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex-direction: ${isMobile && type === OrderType.ASK
          ? "column-reverse"
          : "column"};
      `}
    >
      {children}
    </div>
  );
};
