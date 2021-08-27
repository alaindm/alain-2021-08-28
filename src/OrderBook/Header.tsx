/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Colors } from "./config";
import { Spread } from "./Spread";
import { darken } from "polished";
import { useIsMobile } from "./isMobile";

interface Props {
  onGroupingChange: (selectedGrouping: number) => void;
  selectedGrouping: number;
  groupingOptions: number[];
  spread: number;
  spreadPercentage: number;
}

export const Header = ({
  groupingOptions,
  selectedGrouping,
  onGroupingChange,
  spread,
  spreadPercentage,
}: Props) => {
  const isMobile = useIsMobile();

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
          display: ${isMobile && "none"};
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
          value={selectedGrouping}
          onChange={onGroupingChange}
        />
      </div>
    </div>
  );
};

interface GroupingSelectProps {
  options: number[];
  value: number;
  onChange: (selected: number) => void;
}

const GroupingSelect = ({ options, value, onChange }: GroupingSelectProps) => {
  const handleGroupingChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const selectedValue = Number(event.currentTarget.value);
    onChange(selectedValue);
  };

  return (
    <select
      css={css`
        color: ${Colors.WHITE};
        font-size: 0.8rem;
        cursor: pointer;
        height: 1.5rem;
        width: 6.5rem;
        border: none;
        border-radius: 0.3rem;
        padding-left: 0.5rem;
        appearance: none;
        :hover {
          background-color: ${darken(0.08, Colors.GRAY)};
        }
        background: ${Colors.GRAY}
          url("data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='16' height='16' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='white'/></g></svg>")
          no-repeat;
        background-position: right 5px top 60%;
      `}
      value={value}
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
