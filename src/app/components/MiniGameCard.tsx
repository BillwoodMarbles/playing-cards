import React, { FC } from "react";
import { Card, CardAnimation } from "../types";
import "../styles/decks.css";
import { MiniGameRequirements, getMiniGameByTitle } from "../data/party-cards";
import { FaCoins, FaDice, FaPencilAlt, FaRunning } from "react-icons/fa";
import { CgCardSpades, CgSpinner } from "react-icons/cg";
import { GiGlassShot } from "react-icons/gi";
import { IoBeer } from "react-icons/io5";

interface MiniGameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card;
  hidden?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  index?: number;
  animation?: CardAnimation;
}

const MiniGameCard: FC<MiniGameCardProps> = ({
  card,
  hidden,
  disabled,
  onClick,
  selected,
  index,
  animation = "none",
}) => {
  const selectedClass = selected ? "ring-2 ring-blue-300 -translate-y-2" : "";
  const miniGame =
    card?.type === "non-standard" && card.name
      ? getMiniGameByTitle(card.name)
      : undefined;
  const disabledClass = disabled ? "cursure-default" : "cursor-pointer";

  const onCardClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const animationClass = () => {
    if (animation === "new-deal") {
      return "animate-reveal-hand";
    }

    if (animation === "draw-from") {
      return "animate-slide-out";
    }

    if (animation === "draw-to") {
      return "animate-slide-in-up";
    }

    if (animation === "draw-from-reverse") {
      return "animate-slide-up-out";
    }

    if (animation === "discard") {
      return "animate-slide-in-down";
    }

    if (animation === "discard-reverse") {
      return "animate-slide-in-up";
    }

    return "";
  };

  const getMiniGameIcon = () => {
    if (miniGame?.icon && miniGame?.title) {
      const IconComponent = getMiniGameByTitle(miniGame?.title)?.icon;
      if (IconComponent) {
        return <IconComponent />;
      }
    }
  };

  const getRequirementIcon = (requirement: MiniGameRequirements) => {
    switch (requirement) {
      case "dice":
        return <FaDice />;
      case "cards":
        return <CgCardSpades />;
      case "coins":
        return <FaCoins />;
      case "shot-glass":
        return <GiGlassShot />;
      case "standing":
        return <FaRunning />;
      case "drinking":
        return <IoBeer />;
      case "drawing":
        return <FaPencilAlt />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onCardClick}
      className={`relative rounded-lg transition ease-in-out duration-75 flex items-center justify-center shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] 
      ${disabledClass} ${selectedClass} ${animationClass()} ${
        hidden
          ? "deck-party bg-gradient-to-br from-red-300 to-red-400"
          : "bg-white"
      }`}
      style={
        {
          zIndex: index,
          "--animation-delay": `0ms`,
        } as React.CSSProperties
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="420"
        width="340"
        className="w-full h-auto"
      />
      {hidden && (
        <div className="absolute rounded-lg top-0 left-0 border border-white h-full w-full p-2 ">
          <div className="rounded-lg border border-white h-full w-full opacity-50"></div>
        </div>
      )}

      {!hidden && miniGame && (
        <div className="absolute top-0 left-0 text-center flex items-between flex-col text-black w-full h-full">
          <div>
            <div className="p-4">
              <h3 className="text-xl font-bold leading-5 text-sky-700 uppercase">
                {miniGame.title}
              </h3>
            </div>
          </div>
          <div className="px-4 pb-4 flex items-start text-center h-full w-full overflow-y-auto">
            <div className="w-full text-left">
              {miniGame?.icon && (
                <>
                  <div className="flex text-sky-700 justify-center mb-4 text-5xl">
                    {getMiniGameIcon()}
                  </div>
                </>
              )}

              {miniGame?.description?.map((line, index) => {
                return (
                  <p key={index} className="text-sm mb-3">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
          <div>
            <hr className="mx-4 border-t-2 border-gray-500" />
            <div className="p-4 text-base relative w-full">
              <p>
                <strong>{miniGame.reward}</strong>
              </p>

              <div className="h-full flex items-center px-4 absolute top-0 right-0">
                {miniGame.requirements?.map((line, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-full border-2 border-gray-400 h-8 w-8 text-lg ml-1 flex items-center justify-center"
                    >
                      {getRequirementIcon(line)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGameCard;
