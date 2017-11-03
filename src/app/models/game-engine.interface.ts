import { IGameLevel } from "app/models/game-level.interface";
import { GameTimer } from "app/utilities/GameTimer";

export interface IGameEngine {
    hero: HTMLElement;
    level: IGameLevel;
    bonus: number;
    alive: boolean;
    timer: GameTimer;
}