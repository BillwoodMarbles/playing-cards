import { FC } from "react";
import { Card, CardAnimation } from "../types";
import CardComponent from "./Card";
import MiniGameCard from "./MiniGameCard";

interface CardFactoryProps {
  card?: Card;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  size?: "small" | "medium" | "large" | "full";
  hidden?: boolean;
  animation?: CardAnimation;
}

const CardFactory: FC<CardFactoryProps> = ({
  card,
  size,
  hidden,
  disabled,
  animation,
  onClick,
}) => {
  switch (card?.type) {
    case "standard":
      return (
        <CardComponent
          card={card}
          size={size}
          hidden={hidden}
          disabled={disabled}
          animation={animation}
          onClick={onClick}
        />
      );
    case "non-standard":
      return (
        <MiniGameCard
          card={card}
          onClick={onClick}
          animation={animation}
          hidden={hidden}
          disabled={disabled}
        />
      );
    default:
      return (
        <div
          className={`bg-gray-100 border border-gray-300 relative rounded-lg transition ease-in-out duration-75 flex items-center justify-center  
`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="420"
            width="340"
            className="w-full h-auto"
          />
        </div>
      );
  }

  return <div></div>;
};

export default CardFactory;
