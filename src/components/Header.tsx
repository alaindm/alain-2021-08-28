/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./Colors";
import { SpreadInfo } from "./SpreadInfo";
import { darken } from "polished";

interface Props {
  onGroupingChange: (selectedGrouping: number) => void;
  selectedGrouping: number;
  groupingOptions: number[];
  spread: number;
  spreadPercentage: number;
}

export const Header = ({
  onGroupingChange,
  selectedGrouping,
  groupingOptions,
  spread,
  spreadPercentage,
}: Props) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        border-bottom: 1px solid ${Colors.LIGHT_GRAY};
        > * {
          display: flex;
          flex: 1;
        }
      `}
    >
      <div
        css={css`
          justify-self: flex-start;
        `}
      >
        Order Book
      </div>
      <div
        css={css`
          justify-self: center;
        `}
      >
        <SpreadInfo spread={spread} spreadPercentage={spreadPercentage} />
      </div>
      <div
        css={css`
          justify-self: flex-end;
        `}
      >
        <GroupingSelect options={groupingOptions} />
      </div>
    </div>
  );
};

interface GroupingSelectProps {
  options: number[];
}

const GroupingSelect = ({ options }: GroupingSelectProps) => {
  return (
    <select
      css={css`
        background-color: ${Colors.GRAY};
        color: ${Colors.WHITE};
        font-size: 0.8rem;
        cursor: pointer;
        height: 1.5rem;
        width: 5.8rem;
        border: none;
        border-radius: 0.3rem;
        :hover {
          background-color: ${darken(0.08, Colors.GRAY)};
        }
      `}
    >
      {options.map((option) => (
        <option value={option}>{`Group ${option.toFixed(2)}`} </option>
      ))}
    </select>
  );
};
