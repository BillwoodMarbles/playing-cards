import { FC } from "react";

const suits = ["♠", "♥", "♦", "♣"];
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
}

const Card: FC<CardProps> = ({ card, hidden, children, disabled, onClick }) => {
  const getBackgroundClass = () => {
    if (!card) {
      console.log("no card");
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

  return (
    <div className={`basis-1/6 h-20 relative`} onClick={onCardClick}>
      <div
        className={`absolute w-24 h-32 border border-gray-400 rounded-lg flex items-center justify-center ${getCardColorClass(
          card
        )} ${getBackgroundClass()} ${disabledClass}`}
      >
        {children && children}

        {!children && !hidden && card && (
          <div>
            <div className="flex items-center">
              <div className="text-4xl">{suits[card.suit]}</div>
            </div>

            <div className="absolute left-1 top-1 flex justify-center flex-col">
              <div className="text-xs">{values[card.value]}</div>{" "}
              <div className="text-xs">{suits[card.suit]}</div>
            </div>

            <div className="absolute right-1 bottom-1 flex justify-center flex-col">
              <div className="text-xs">{suits[card.suit]}</div>
              <div className="text-xs">{values[card.value]}</div>{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
