/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./config";
import { darken, transparentize } from "polished";

interface Props {
  hasError: boolean;
  onToggleFeed: () => void;
  onKillFeed: () => void;
}

export const Footer = ({ hasError, onToggleFeed, onKillFeed }: Props) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      justify-content: center;
      > * {
        margin: 1rem 0.5rem;
      }
    `}
  >
    <Button
      text="Toggle Feed"
      color={Colors.VIOLET}
      onClick={() => onToggleFeed()}
      disabled={hasError}
    />
    <Button text="Kill Feed" color={Colors.RED} onClick={() => onKillFeed()} />
  </div>
);

interface ButtonProps {
  color: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ color, text, disabled, ...props }: ButtonProps) => (
  <button
    css={css`
      background-color: ${color};
      color: ${Colors.WHITE};
      width: 8rem;
      height: 2rem;
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
      font-weight: 700;
      :hover {
        background-color: ${darken(0.08, color)};
      }
      :disabled {
        background-color: ${transparentize(0.8, color)};
        color: ${Colors.GRAY};
        cursor: not-allowed;
      }
    `}
    disabled={disabled}
    {...props}
  >
    {text}
  </button>
);
