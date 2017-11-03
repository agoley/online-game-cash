import { IGameElementInMotion } from "app/models/game-element-in-motion.interface";
import { GameElementInMotion } from "app/utilities/GameElementInMotion";

export class GameSunny {
    elementsInMotion: GameElementInMotion[];

    constructor() {
        this.elementsInMotion = [];
    }

    /**
     * Hide an element
     * @param el 
     * @param timeout 
     */
    public hide(el: HTMLElement, timeout: number) {
        setTimeout(() => {
            el.style.opacity = '0';
        }, timeout);
    }

    /**
     * Show an Element
     * @param el 
     * @param timeout 
     */
    public show(el: HTMLElement, timeout: number) {
        setTimeout(() => {
            el.style.opacity = '1.0';
        }, timeout);
    }

    /**
     * Flash an element
     * @param el 
     * @param timeout 
     */
    public flash(el: HTMLElement, timeout: number) {
        var is: boolean = true;

        var f = () => {
            setTimeout(() => {
                if (is) {
                    this.hide(el, 0);
                    is = false;
                    f();
                } else {
                    this.show(el, 0);
                    is = true;
                    f();
                }
            }, timeout);
        }

        f();
    }



    /**
     * Move an HTMLElement, it must be positioned absolutly
     * @param el 
     * @param direction 
     * @param pixels 
     */
    public move(el: HTMLElement, direction: string, pixels: number) {
        var cr: ClientRect = el.getBoundingClientRect();

        if (direction === 'up') {
            var coords: number = cr.top - pixels;
            el.style.top = coords.toString() + 'px';
        } else if (direction === 'left') {
            var coords: number = cr.left - pixels;
            el.style.left = coords.toString() + 'px';
        } else if (direction === 'down') {
            var coords: number = cr.top + pixels;
            el.style.top = coords.toString() + 'px';
        } else if (direction === 'right') {
            var coords: number = cr.left + pixels;
            el.style.left = coords.toString() + 'px';
        } else {
            console.log('GameSunny (move): unkown direction ' + direction);
        }
    }

    public moveTo(el: HTMLElement, top: number, left: number) {
        el.style.top = top + 'px';
        el.style.left = left + 'px';
    }

    public motion(el: HTMLElement, direction: string, pixels: number, time: number) {
        var eom: GameElementInMotion = new GameElementInMotion(el, direction, time, pixels);
        this.elementsInMotion.push(eom);

        setTimeout(() => {
            if (this.elementIsStillInMotion(el)) {
                this.move(el, direction, pixels);
            }
        }, time);

    }

    /**
     * Checks if an element is still in motion
     * @param el 
     */
    public elementIsStillInMotion(el: HTMLElement) {
        for (var i = 0; i < this.elementsInMotion.length; i++) {
            var eim = this.elementsInMotion[i];
            if (eim.el.accessKey === el.accessKey) {
                return true;
            }
        }
        return false;
    }

    public fade(el: HTMLElement, target: number, timeout: number, step: number) {
        var curr: number = parseFloat(el.style.opacity);
        if (!curr && curr != 0) curr = 1.0;

        var out: boolean = target < curr;
        if (!curr) curr = 1.0;

        var f = () => {
            setTimeout(() => {
                if (out) {
                    if (curr > target) {
                        curr = (curr - target) > step ? curr - step : curr - (Math.abs(curr - target));
                        el.style.opacity = curr.toString();
                        f();
                    }
                } else {
                    if (curr < target) {
                        curr = (target - curr) > step ? curr + step : curr + (Math.abs(curr - target));
                        el.style.opacity = curr.toString();
                        f();
                    }
                }
            }, timeout)
        }

        f();

    }

    /**
     * Rotate an element
     * @param el 
     * @param degrees 
     * @param duration 
     * @param curve 
     * @param step
     */
    public rotate(el: HTMLElement, degrees: number, duration: number, curve: string, step: number) {
        var timeout = duration / step;
        var curr = this.getDegrees(el);
        var clockwise: boolean = degrees > curr;

        var f = () => {
            setTimeout(() => {
                if (clockwise) {
                    if (curr < degrees) {
                        curr = (degrees - curr > step) ? curr + step : curr + (degrees - curr);
                        el.style.webkitTransform = this.getTransformForDegrees(curr);
                        el.style.transform = this.getTransformForDegrees(curr);
                        f();
                    }
                } else {
                    // counter clockwise rotation
                    if (curr > degrees) {
                        curr -= step;
                        el.style.webkitTransform = this.getTransformForDegrees(curr);
                        el.style.transform = this.getTransformForDegrees(curr);
                        f();
                    }
                }

            }, timeout);
        }

        f();
    }

    public getTransformForDegrees(degrees: number): string {
        return 'rotate(' + degrees + 'deg)';
    }

    public getDegrees(el: HTMLElement): number {
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform")

        if (!tr) {
            console.log("Either no transform set, or browser doesn't do getComputedStyle");
            return null;
        }

        if (tr === 'none') {
            tr =  'matrix(0, 0, 0, 0, 0, 0)';
        }

        var values: any = tr.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');

        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];

        var angle = Math.round(Math.asin(b) * (180 / Math.PI));
        return angle;
    }


    public moveAlongCurve(el: HTMLElement, steps: number, radius: number, theta: number, time: number, invertX: boolean, invertY: boolean) {
        var s = 0;
        var r = el.getBoundingClientRect();
        var cx = invertX? (r.right - (Math.abs(r.left - r.right) / 2)) + radius : (r.right - (Math.abs(r.left - r.right) / 2)) - radius;
        var cy = (r.bottom - (Math.abs(r.top - r.bottom) / 2));

        var f = () => {
            setTimeout(() => {
                var x = this.getCircularX(theta, s, radius, cx, steps, invertX);
                var y = this.getCircularY(theta, s, radius, cy, steps, invertY);
                this.moveTo(el, y, x);
                s++;
                if (s < steps) {
                    f();
                }
            }, time)
        }

        f();
    }

    public getCircularX(theta: number, step: number, radius: number, centerX: number, steps: number, invert: boolean): number {
        var angle = (theta * step / steps);
        var x = invert? (radius * -Math.cos(angle) + centerX) : (radius * Math.cos(angle) + centerX)
        return x;
    }

    public getCircularY(theta: number, step: number, radius: number, centerY: number, steps: number, invert: boolean): number {
        var angle = (theta * step / steps);
        var y = invert? (radius * -Math.sin(angle) + centerY): (radius * Math.sin(angle) + centerY);
        return y;
    }
}