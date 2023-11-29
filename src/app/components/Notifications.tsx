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

  const getPlayerName = (playerId: number) => {
    return game.players[playerId]?.name;
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
        if (
          currentRound?.roundWinner !== undefined &&
          currentRound.roundWinner >= 0
        ) {
          notifications.push(
            <div className="text-center">
              GRANDMA!!! - {getPlayerName(currentRound?.roundWinner)}
            </div>
          );
        }

        if (isPlayerTurn) {
          notifications.push(currentPlayerAction?.description);
        } else {
          notifications.push(
            <div className="text-center">
              {game.players[game.playerTurn]?.name}&lsquo;s Turn
            </div>
          );
        }
      }
    }

    return notifications;
  };

  return (
    <div className="flex justify-center px-4 py-2 rounded-md flex-col items-center absolute top-4">
      {getNotifcations().map((notification) => notification)}
    </div>
  );
};

export default NotificationsComponent;
