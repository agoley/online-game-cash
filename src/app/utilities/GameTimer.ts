import { ITimer } from "app/models/timer.interface";

export class GameTimer implements ITimer {
    running: boolean;
    value: number;
    pauseValue: number;

    constructor(value: number) {
        this.value = value;
        this.running = false;
    }

    start(): void {
        this.running = true;

        var f = () => {
            setTimeout(() => {
                if (!this.running) {
                    return;
                }
                this.value += 100;
                f();
            }, 100);
        }

        f();
    }
    pause(): void {
        this.running = false;
        this.pauseValue = this.value;
        
    }

    clear(): void {
        this.running = false;
        this.value = 0;
    }

    getDisplayValue(): string {
        var v = this.pauseValue? this.pauseValue : this.value;
        var minutes = Math.floor(v / 60000);
        var seconds = ((v % 60000) / 1000).toFixed(0);
        var millis = (v % 1000) < 10 ? 0 : (v % 1000) / 10;

        var minS = ((minutes) < 10 ? '0' + minutes : minutes);
        var secS = (parseFloat(seconds) < 10 ? '0' + seconds : seconds);
        var milS = ((millis) < 10 ? '0' + millis : millis);
        return minS + ":" + secS + ':' + milS;
    }

}