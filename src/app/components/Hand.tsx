import { FC } from "react";
import CardComponent from "./Card";
import { Card, CardAnimation, Game, Player } from "../types";
import HandContainer from "./HandContainer";
import { isWildCard } from "../utils/game";
import useAnimations from "../hooks/useAnimations";
import { GameTypes } from "../data/game-configs";

interface HandProps {
  game: Game;
  cards: Card[];
  player: Player | null;
  selectedCard?: Card | null;
  animation?: CardAnimation;
  peekedCards?: Card[];
  onClick?: (card: Card) => void;
}

const Hand: FC<HandProps> = ({
  game,
  cards,
  player,
  peekedCards,
  selectedCard,
  onClick,
}) => {
  const { getCardAnimation } = useAnimations(game, player);

  const isCardHidden = (card: Card) => {
    if (game.gameType === GameTypes.MINI_GOLF) {
      const isCardPeeked = peekedCards?.find(
        (peekedCard) => peekedCard.id === card.id
      );
      return card.status === "hidden" && isCardPeeked === undefined;
    }
    return false;
  };

  const onCardClick = (card: Card) => {
    if (onClick) {
      onClick(card);
    }
  };

  return (
    <>
      <div className="relative overflow-y-visible overflow-x-hidden">
        <HandContainer>
          {cards?.map((card, index) => {
            return (
              <div
                key={card.id}
                style={{
                  zIndex: index,
                }}
                className="relative w-12 h-14"
              >
                <div className="absolute left-0 top-0">
                  <CardComponent
                    selected={selectedCard?.id === card?.id}
                    wild={isWildCard(game, card)}
                    card={card}
                    onClick={() => onCardClick(card)}
                    size="small"
                    index={index}
                    hidden={isCardHidden(card)}
                    animation={getCardAnimation(card)}
                  />
                </div>
              </div>
            );
          })}
        </HandContainer>
      </div>
    </>
  );
};

export default Hand;
