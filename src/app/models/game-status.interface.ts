
import { IGameCollision } from "app/models/game-collision.interface";

export interface IGameStatus {
    status: string;
    collision: IGameCollision | null;
}