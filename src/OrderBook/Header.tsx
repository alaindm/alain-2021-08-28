/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./config";
import { Spread } from "./Spread";
import { darken } from "polished";
import { useState } from "react";

interface Props {
  onGroupingChange: (selectedGrouping: number) => void;
  selectedGrouping: number;
  groupingOptions: number[];
  spread: number;
  spreadPercentage: number;
}

export const Header = ({
  onGroupingChange,
  groupingOptions,
  spread,
  spreadPercentage,
}: Props) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        border-bottom: 1px solid ${Colors.GRAY};
        padding: 5px 8px;
        > * {
          display: flex;
          flex: 1;
        }
      `}
    >
      <div>Order Book</div>
      <div
        css={css`
          justify-content: center;
          @media only screen and (max-width: 688px) {
            display: none;
          }
        `}
      >
        <Spread spread={spread} spreadPercentage={spreadPercentage} />
      </div>
      <div
        css={css`
          justify-content: flex-end;
        `}
      >
        <GroupingSelect
          options={groupingOptions}
          onGroupingChange={onGroupingChange}
        />
      </div>
    </div>
  );
};

interface GroupingSelectProps {
  options: number[];
  onGroupingChange: (selectedGrouping: number) => void;
}

const GroupingSelect = ({ options, onGroupingChange }: GroupingSelectProps) => {
  const [selected, setSelected] = useState(options[0]);
  const handleGroupingChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const selectedValue = Number(event.currentTarget.value);
    setSelected(selectedValue);
    onGroupingChange(selectedValue);
  };

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
      value={selected}
      onChange={handleGroupingChange}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {`Group ${option.toFixed(2)}`}{" "}
        </option>
      ))}
    </select>
  );
};
