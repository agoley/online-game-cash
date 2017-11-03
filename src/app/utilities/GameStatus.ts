import { IGameStatus } from "app/models/game-status.interface";
import { IGameCollision } from "app/models/game-collision.interface";

export class GameStatus implements IGameStatus {
    status: string;
    collision: IGameCollision;

    constructor() {
        this.status = 'ok';
        this.collision = null;
    }

}