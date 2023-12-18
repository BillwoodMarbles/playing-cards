import { FC, useEffect } from "react";
import CardComponent from "./Card";
import { Card, CardAnimation, Game } from "../types";

interface DeckProps {
  cards: Card[];
  enabled: boolean;
  animation?: CardAnimation;
  size?: "small" | "medium" | "large" | "full";
  onClick: (card: Card) => void;
  onEmpty?: () => void;
}

const Deck: FC<DeckProps> = ({
  cards,
  enabled,
  animation,
  onClick,
  onEmpty,
  size,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "rounded-md";
      case "medium":
        return "rounded-md";
      case "large":
        return "rounded-lg";
      case "full":
        return "rounded-xl";
      default:
        return "rounded-lg";
    }
  };

  useEffect(() => {
    if (cards.length === 0 && onEmpty) {
      onEmpty();
    }
  }, [cards]);

  return (
    <>
      {cards.length > 0 ? (
        (() => {
          const card = cards[cards.length - 1];
          return (
            <div className="relative">
              {/* <span>{game.deck.length}</span> */}
              {enabled && (
                <div className="w-full h-full flex items-center justify-center absolute left-0 top-0 z-0">
                  <div
                    className={`animate-ping bg-blue-500 w-3/5 h-3/5 ${getSizeClasses()}`}
                  ></div>
                </div>
              )}

              <div className="absolute left-0 top-0">
                <CardComponent size={size} card={card} hidden disabled />
              </div>

              <div className="relative z-10">
                <CardComponent
                  key={card.id}
                  card={card}
                  onClick={() => onClick(card)}
                  hidden={card.status !== "visible"}
                  disabled={!enabled}
                  animation={animation}
                  size={size}
                ></CardComponent>
              </div>
            </div>
          );
        })()
      ) : (
        <CardComponent size={size} disabled />
      )}
    </>
  );
};

export default Deck;
