import { FC } from "react";
import { Game, Player, PlayerAction, Round } from "../types";

interface NotificationsProps {
  game: Game;
  player?: Player;
  isPlayerTurn?: boolean;
  currentRound?: Round;
  currentPlayerAction?: PlayerAction;
}

const NotificationsComponent: FC<NotificationsProps> = ({
  game,
  player,
  isPlayerTurn,
  currentRound,
  currentPlayerAction,
}) => {
  const isLastRound = () => {
    return game.currentRound === game.rounds.length - 1;
  };

  const getPlayerById = (playerId: string) => {
    return game.players.find((player) => player.id === playerId);
  };

  const getNotifcations = () => {
    const notifications = [];

    if (game?.status === "open") {
      if (game.players.length < 2) {
        notifications.push(
          <div className="text-center">Waiting for players...</div>
        );
      } else {
        if (player?.type === "host") {
          notifications.push(<div className="text-center">Ready to start</div>);
        } else {
          notifications.push(
            <div className="text-center">Waiting for host to start</div>
          );
        }
      }
    } else if (game?.status === "in-progress") {
      if (currentRound?.status === "complete") {
        if (isLastRound()) {
          notifications.push(<div className="text-center">Game Over</div>);
        } else {
          notifications.push(
            <div className="text-center">
              Round Over. Waiting for host to start new round
            </div>
          );
        }
      } else if (currentRound?.status === "open") {
        if (currentRound?.dealer === player?.id) {
          notifications.push(<div className="text-center">Ready to deal</div>);
        } else {
          notifications.push(
            <div className="text-center">Waiting for dealer</div>
          );
        }
      } else {
        if (currentRound?.roundWinner) {
          notifications.push(
            <div className="text-center">
              GRANDMA!!! - {getPlayerById(currentRound?.roundWinner)?.name}
            </div>
          );
        }

        if (isPlayerTurn) {
          notifications.push(currentPlayerAction?.description);
        } else {
          notifications.push(
            <div className="text-center">
              {getPlayerById(game.playerTurn)?.name}&lsquo;s Turn
            </div>
          );
        }
      }
    }

    return notifications;
  };

  return (
    <div className="flex w-full justify-center px-4 py-1 h-10 flex-col items-center bg-slate-200 text-xs ">
      {getNotifcations().map((notification) => notification)}
    </div>
  );
};

export default NotificationsComponent;
