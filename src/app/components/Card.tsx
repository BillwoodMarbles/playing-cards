import { FC, useEffect, useState } from "react";
import { Card, CardAnimation } from "../types";

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
  size?: "small" | "medium" | "large";
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

  const getBackgroundClass = () => {
    if (!card) {
      return "bg-white border border-gray-400";
    } else if (hidden) {
      return "shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] bg-gradient-to-br from-red-300 to-red-400";
    } else if (wild) {
      return "shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-500 text-white";
    } else {
      return "shadow-[0_2px_5px_-1px_rgba(0,0,0,0.33)] bg-gradient-to-br from-white to-slate-50";
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

  const animationClass = () => {
    if (animation === "new-deal") {
      return "animate-reveal-hand";
    }

    if (animation === "draw") {
      return "animate-slide-in";
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
        return "w-44";
      default:
        return "w-32 h-40 rounded-lg";
    }
  };

  return (
    <div
      onClick={onCardClick}
      className={`relative transition ease-in-out duration-75 flex items-center justify-center ${getSizeClasses()} ${getCardColorClass(
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

      {!children && !hidden && card && (
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
    </div>
  );
};

export default CardComponent;
