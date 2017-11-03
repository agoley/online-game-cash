export interface Game {
    _id: string;
    _v: number;
    title: string;
    console: string,
    developer: string;
    summary: string;
    release_date: string;
    genre: string[];
    buy_price: number;
    sell_price: number;
    image_path: string;
    quantity: number;
    clicksThisMonth: number;
    clicksLastMonth: number;
}