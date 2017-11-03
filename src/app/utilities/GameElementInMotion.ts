import { IGameElementInMotion } from "app/models/game-element-in-motion.interface";

export class GameElementInMotion implements IGameElementInMotion {
    el: HTMLElement;
    direction: string;
    time: number;
    pixels: number;

    constructor(e: HTMLElement, d: string, t: number, p: number ) {
        this.el = e;
        this.direction = d;
        this.time = t;
        this.pixels = p;
    }
}