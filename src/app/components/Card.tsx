import { FC } from "react";

const suits = ["♠", "♥", "♦", "♣", "🃏"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  " ",
];

interface Card {
  id: number;
  suit: number;
  value: number;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card;
  hidden?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  wild?: boolean;
  selected?: boolean;
  size?: "small" | "medium" | "large";
  index?: number;
}

const CardComponent: FC<CardProps> = ({
  card,
  hidden,
  children,
  disabled,
  wild,
  onClick,
  selected,
  size,
  index,
}) => {
  const selectedClass = selected ? "ring-2 ring-blue-300 -translate-y-2" : "";
  const wildClass = wild ? "bg-yellow-300" : "";
  const getBackgroundClass = () => {
    if (!card) {
      return "bg-gray-100";
    } else if (hidden) {
      return "bg-red-300";
    } else {
      return "bg-white";
    }
  };
  const disabledClass = disabled ? "cursure-default" : "cursor-pointer";

  const getCardColorClass = (card?: Card) => {
    if (hidden || card?.suit === 0 || card?.suit === 3) {
      return "text-black";
    } else {
      return "text-red-600";
    }
  };

  const onCardClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-24 h-28 rounded-md";
      case "medium":
        return "w-32";
      case "large":
        return "w-44";
      default:
        return "w-32 h-40 rounded-lg";
    }
  };

  return (
    <div
      onClick={onCardClick}
      className={`relative shadow-md transition ease-in-out duration-75 flex items-center h- justify-center ${getSizeClasses()} ${getCardColorClass(
        card
      )} ${getBackgroundClass()} ${disabledClass} ${wildClass} ${selectedClass}`}
      style={{ zIndex: index }}
    >
      {children && children}

      {!children && !hidden && card && (
        <>
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-6xl">{suits[card.suit]}</div>
          </div>

          <div className="absolute left-1 top-1 flex justify-center items-center flex-col">
            <div className="text-sm leading-none">{values[card.value]}</div>
            <div className="text-sm">{suits[card.suit]}</div>
          </div>

          <div className="absolute right-1 bottom-1 flex justify-center items-center flex-col">
            <div className="text-sm leading-none">{suits[card.suit]}</div>
            <div className="text-sm leading-none">{values[card.value]}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardComponent;
