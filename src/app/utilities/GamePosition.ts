import { IGamePosition } from "app/models/game-position.interface";

export class GamePosition implements IGamePosition {
    top: number;
    left: number;
    bottom: number;
    right: number;

    constructor(rect: ClientRect) {
        this.top = rect.top;
        this.left = rect.left;
        this.bottom = rect.bottom;
        this.right = rect.right;
    }

}