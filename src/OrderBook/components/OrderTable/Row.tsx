/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors, ROW_HEIGHT_REM } from "../../config";
import { useIsMobile } from "../../helpers/isMobile";
import { OrderType } from "../../types";

interface Props {
  type: OrderType;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Row = ({ type, children, style = {} }: Props) => {
  const isMobile = useIsMobile();

  return (
    <div
      css={css`
        width: 100%;
        color: ${Colors.LIGHT_GRAY};
        display: ${isMobile && type === OrderType.BID ? "none" : "flex"};
        flex-direction: ${isMobile || type === OrderType.ASK
          ? "row"
          : "row-reverse"};
        height: ${ROW_HEIGHT_REM}rem;
        align-items: center;
        > * {
          width: 28%;
          text-align: end;
        }
        > div:first-of-type {
          margin-right: ${!isMobile && type === OrderType.BID && "16%"};
        }
      `}
      style={style}
    >
      {children}
    </div>
  );
};
