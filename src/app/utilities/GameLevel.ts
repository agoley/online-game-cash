import { IGameLevel } from "app/models/game-level.interface";

export class GameLevel implements IGameLevel {
    chips: HTMLCollectionOf<Element>;
    trackItms: HTMLCollectionOf<Element>;
    nemisis: HTMLCollectionOf<Element>;
    track: HTMLElement;
    walls: HTMLCollectionOf<Element>;
    deaths: HTMLCollectionOf<Element>;
    verticallyMovingObstacles: HTMLCollectionOf<Element>;
    horizontallyMovingObstacles: HTMLCollectionOf<Element>;

    constructor(nemisis: HTMLCollectionOf<Element>,
        track: HTMLElement,
        walls: HTMLCollectionOf<Element>,
        deaths: HTMLCollectionOf<Element>,
        verticallyMovingObstacles: HTMLCollectionOf<Element>,
        horizontallyMovingObstacles: HTMLCollectionOf<Element>,
        trackItms: HTMLCollectionOf<Element>,
        chips: HTMLCollectionOf<Element>,) {
        this.nemisis = nemisis;
        this.track = track;
        this.walls = walls;
        this.deaths = deaths;
        this.verticallyMovingObstacles = verticallyMovingObstacles;
        this.horizontallyMovingObstacles = horizontallyMovingObstacles;
        this.trackItms = trackItms;
        this.chips = chips
    }

}