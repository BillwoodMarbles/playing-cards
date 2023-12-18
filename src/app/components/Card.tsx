import React, { FC } from "react";
import { Card, CardAnimation } from "../types";
import "../styles/decks.css";
import { getMiniGameByTitle } from "../data/party-cards";

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

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card;
  hidden?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  wild?: boolean;
  selected?: boolean;
  size?: "small" | "medium" | "large" | "full";
  index?: number;
  animation?: CardAnimation;
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
  animation = "none",
}) => {
  const selectedClass = selected ? "ring-2 ring-blue-300 -translate-y-2" : "";
  const miniGame =
    card?.type === "non-standard" && card.name
      ? getMiniGameByTitle(card.name)
      : undefined;
  const disabledClass = disabled ? "cursure-default" : "cursor-pointer";

  const getBackgroundClass = () => {
    if (!card) {
      return "bg-white border border-gray-400";
    } else if (hidden) {
      return "shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] bg-gradient-to-br from-red-300 to-red-400 deck-party";
    } else if (wild) {
      return "shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-500 text-white";
    } else {
      return "shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] bg-gradient-to-br from-white to-slate-50";
    }
  };

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

  const getAnimationDelay = () => {
    if (animation === "new-deal" && index) {
      return index * 100;
    } else {
      return 0;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-24 h-28 rounded-md";
      case "medium":
        return "w-28 h-32 rounded-md";
      case "large":
        return "w-44 rounded-lg";
      case "full":
        return "w-64 h-80 rounded-xl";
      default:
        return "w-32 h-40 rounded-lg";
    }
  };

  const getMiniGameIcon = () => {
    if (miniGame?.icon && miniGame?.title) {
      const IconComponent = getMiniGameByTitle(miniGame?.title)?.icon;
      if (IconComponent) {
        return <IconComponent />;
      }
    }
  };

  return (
    <div
      onClick={onCardClick}
      className={`relative transition ease-in-out rou duration-75 flex items-center justify-center ${getSizeClasses()} ${getCardColorClass(
        card
      )} ${getBackgroundClass()} ${disabledClass} ${selectedClass} ${animationClass()}`}
      style={
        {
          zIndex: index,
          "--animation-delay": `${getAnimationDelay()}ms`,
        } as React.CSSProperties
      }
    >
      {children && children}

      {hidden && (
        <div className="rounded-md border  border-white h-full w-full p-2 ">
          <div className="rounded-md border border-white h-full w-full opacity-50"></div>
        </div>
      )}

      {!children &&
        !hidden &&
        card &&
        card.suit !== undefined &&
        card.value !== undefined && (
          <>
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-5xl">{suits[card.suit]}</div>
            </div>

            <div className="absolute left-1 top-1 flex justify-center items-center flex-col">
              <div className="text-2xl leading-none">{values[card.value]}</div>
              <div className="text-2xl leading-5">{suits[card.suit]}</div>
            </div>

            <div className="absolute right-1 bottom-1 flex justify-center items-center flex-col">
              <div className="text-2xl leading-5">{suits[card.suit]}</div>
              <div className="text-2xl leading-none">{values[card.value]}</div>
            </div>
          </>
        )}

      {!children && !hidden && miniGame && (
        <div className="text-center w-full flex items-between flex-col text-black h-full">
          <div>
            <div className={size === "full" ? "p-4" : "p-1"}>
              <h3 className="text-base font-bold leading-5 text-sky-700 uppercase">
                {miniGame.title}
              </h3>
            </div>
          </div>
          <div
            className={`${
              size === "full" ? "px-4 pb-4" : "px-1 pb-1"
            } flex items-start text-center h-full w-full overflow-y-auto`}
          >
            <div className="w-full text-left">
              {miniGame?.icon && (
                <>
                  <div className="flex text-sky-700  justify-center mb-4 text-4xl">
                    {getMiniGameIcon()}
                  </div>
                </>
              )}

              {miniGame?.description?.map((line, index) => {
                return (
                  <p
                    key={index}
                    className={
                      size === "full" ? "text-sm mb-3" : "text-xs mb-1"
                    }
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
          <div>
            <hr className="mx-4 border-t-2 border-gray-500" />
            <div className={size === "full" ? "p-4 text-base" : "p-1 text-sm"}>
              <p>
                <strong>{miniGame.reward}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
