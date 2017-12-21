export interface IGameLevel {
    nemisis: HTMLCollectionOf<Element> | null;
    track: HTMLElement | null;
    walls: HTMLCollectionOf<Element> | null;
    deaths: HTMLCollectionOf<Element> | null;
    verticallyMovingObstacles: HTMLCollectionOf<Element> | null;
    horizontallyMovingObstacles: HTMLCollectionOf<Element> | null;
    trackItms: HTMLCollectionOf<Element> | null;
    chips: HTMLCollectionOf<Element> | null;
    stats: any;
}