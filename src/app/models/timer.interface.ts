export interface ITimer {
    value: number;
    running: boolean;
    
    getDisplayValue(): string;
    start(): void;
    pause(): void;
    clear(): void;
}