/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./Colors";
import { darken } from "polished";

interface Props {
  onToggleFeed: () => void;
  onKillFeed: () => void;
}

export const Footer = ({ onToggleFeed, onKillFeed }: Props) => (
  <div>
    <Button
      text="Toggle Feed"
      color={Colors.VIOLET}
      onClick={() => onToggleFeed()}
    />
    <Button text="Kill Feed" color={Colors.RED} onClick={() => onKillFeed()} />
  </div>
);

interface ButtonProps {
  color: string;
  text: string;
  onClick: () => void;
}

const Button = ({ color, text, ...props }: ButtonProps) => (
  <button
    css={css`
      background-color: ${color};
      color: ${Colors.WHITE};
      width: 8rem;
      height: 2rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
      :hover {
        background-color: ${darken(0.08, color)};
      }
    `}
    {...props}
  >
    {text}
  </button>
);
