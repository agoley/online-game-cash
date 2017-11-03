
import { IGameCollision } from "app/models/game-collision.interface";

export class GameCollision implements IGameCollision {
    type: string;
    edge: string;
    overlap: number;
    is: boolean;

    constructor() {
        this.edge = null;
        this.overlap = null;
        this.is = false;
        this.type = null;
    }

}