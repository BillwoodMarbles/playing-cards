import { FC, useEffect } from "react";
import CardComponent from "./Card";
import { Card, CardAnimation, Game } from "../types";

interface DeckProps {
  cards: Card[];
  enabled: boolean;
  animation?: CardAnimation;
  onClick: () => void;
  onEmpty?: () => void;
}

const Deck: FC<DeckProps> = ({
  cards,
  enabled,
  animation,
  onClick,
  onEmpty,
}) => {
  useEffect(() => {
    if (cards.length === 0 && onEmpty) {
      onEmpty();
    }
  }, [cards]);

  return (
    <>
      {cards.length > 0 ? (
        (() => {
          const card = cards[0];
          return (
            <div className="relative">
              {/* <span>{game.deck.length}</span> */}
              {enabled && (
                <div className="w-full h-full flex items-center justify-center absolute left-0 top-0 z-0">
                  <div className="animate-ping bg-blue-500 w-3/5 h-3/5 rounded-md"></div>
                </div>
              )}

              <div className="absolute left-0 top-0">
                <CardComponent card={card} hidden disabled />
              </div>

              <div className="relative z-10">
                <CardComponent
                  key={card.id}
                  card={card}
                  onClick={onClick}
                  hidden
                  disabled={!enabled}
                  animation={animation}
                ></CardComponent>
              </div>
            </div>
          );
        })()
      ) : (
        <CardComponent disabled />
      )}
    </>
  );
};

export default Deck;
