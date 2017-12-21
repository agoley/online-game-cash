import { IGamePosition } from "app/models/game-position.interface";
import { IGameStatus } from "app/models/game-status.interface";
import { IGameEngine } from "app/models/game-engine.interface";
import { IGameLevel } from "app/models/game-level.interface";
import { GameStatus } from "app/utilities/GameStatus";
import { GameCollision } from "app/utilities/GameCollision";
import { GamePosition } from "app/utilities/GamePosition";
import { GameLevel } from "app/utilities/GameLevel";
import { GameSunny } from "app/utilities/GameSunny";
import { GameLists } from "app/lists/game-lists";
import { GameTimer } from "app/utilities/GameTimer";

/**
 * Runs logic for the game to function.
 */
export class GameEngine implements IGameEngine {
    alive: boolean;
    bonus: number;
    hero: HTMLElement;
    level: GameLevel;
    sunny: GameSunny;
    messages: string[];
    terminal: HTMLElement;
    timer: GameTimer;
    communicating: boolean;
    showReset: boolean;

    constructor(hero: HTMLElement, level: GameLevel) {
        this.hero = hero;
        this.level = level;
        this.sunny = new GameSunny();
        this.messages = window.innerWidth > 1000 ? GameLists.messages : GameLists.messagesMobile;
        this.terminal = <HTMLElement>document.getElementsByClassName('message-interface-content-text')[0];
        this.bonus = 0;
        this.alive = true;
        this.timer = new GameTimer(0);
        this.communicating = false;
        this.showReset = false;
        this.level.stats.nemisisHP = 10;
    }

    start() {
        this.bounceElement(this.hero, "y", 5, 2);
        this.writeWelcomeMsgs();
        this.pulse();

        for (var i = 0; i < this.level.verticallyMovingObstacles.length; i++) {
            this.bounceElement(<HTMLElement>this.level.verticallyMovingObstacles[i], "y", 10, 1);
        }
    }

    gameOver() {
        setTimeout(() => {
            this.timer.pause();
            if (this.level.track.getBoundingClientRect().right <= 300) {
                this.timer.value -= (this.bonus * 1000);
                this.writeMsg(this.terminal, "YOU WIN!. YOU'RE FINAL TIME IS " + this.timer.getDisplayValue(), 75, true);
                this.alive = false;
            } else {
                this.alive = false;
                this.writeMsg(this.terminal, 'ERROR! YOU HAVE FAILED.', 75, true);
            }
        }, 0);

    }

    pulse() {
        var f = () => {
            setTimeout(() => {
                if (this.hero.getBoundingClientRect().top < 305) {
                    this.gameOver();
                }
                if (this.hero.getBoundingClientRect().top > 605) {
                    this.gameOver();
                }
                if (this.alive) {
                    f();
                }
            }, 10);

        }
        f();
    }

    public getPosition(el: HTMLElement): GamePosition {
        var r: ClientRect = el.getBoundingClientRect();
        return new GamePosition(r);
    }

    flashCursor() {
        var el = <HTMLElement>document.getElementById('message-interface-content-cursor');
        this.sunny.flash(el, 500);
    }

    writeWelcomeMsgs() {
        this.terminal.innerHTML = '<span style="color: white; font-size: 20px; line-height: 10px;">|</span>';
        this.writeMsg(this.terminal, this.messages[0], 50, false);

        var i = 1;

        var f = () => {
            setTimeout(() => {
                if (this.alive) {
                    if (i < this.messages.length) {
                        this.writeMsg(this.terminal, this.messages[i], 50, false);
                        i++;
                        f();
                    } else {
                        this.terminal.innerHTML = 'COMMUNICATION ENDED.';
                    }
                }
            }, 8000);
        }
        f();
    }

    writeMsg(el: HTMLElement, msg: string, timeout: number, isGameOver: boolean) {
        var curr = '';
        var i = 0;

        var f = () => {
            setTimeout(() => {
                if (i < msg.length) {
                    curr = curr + msg.charAt(i);
                    el.innerHTML = curr + '<span style="color: white; font-size: 20px; line-height: 10px;">|</span>';
                    i++;
                    f();
                } else {
                    var waiting = true;

                    var c = () => {
                        setTimeout(function () {
                            if (el.innerHTML === '<span style="color: white; font-size: 20px; line-height: 10px;">|</span>' || el.innerHTML === '') {
                                if (el.innerHTML == '') {
                                    el.innerHTML = '<span style="color: white; font-size: 20px; line-height: 10px;">|</span>';
                                    c();
                                } else {
                                    el.innerHTML = '';
                                    c();
                                }
                            }
                        }, 400);
                    }

                    var b = () => {
                        setTimeout(() => {
                            if (waiting) {
                                if (el.innerHTML == curr) {
                                    el.innerHTML = curr + '<span style="color: white; font-size: 20px; line-height: 10px;">|</span>';
                                    b();
                                } else {
                                    el.innerHTML = curr;
                                    b();
                                }
                            } else {
                                if (this.alive) {
                                    el.innerHTML = '';
                                } else {
                                    if (this.level.track.getBoundingClientRect().right > 300) {
                                        console.log('in writeMsg')
                                        el.innerHTML = "ERROR! YOU HAVE FAILED.";
                                        var resestBtn = <HTMLElement>document.getElementById('resetBtn');
                                        resestBtn.style.display = 'inline-block';
                                        this.sunny.flash(resestBtn, 500);
                                    }
                                }
                                c();
                            }
                        }, 300);
                    }
                    b();


                    setTimeout(() => {
                        waiting = false;
                    }, 1000);
                }
            }, timeout);
        }

        f();
    }

    alignNemisis() {

        if (this.hero) {
            var nlf = (<HTMLElement>this.level.nemisis[0]); // nemisis left facing
            var nrf = (<HTMLElement>this.level.nemisis[1]); // nemisis right facing


            if (nrf.classList.contains('hidden')) {
                if (this.hero.getBoundingClientRect().left > nlf.getBoundingClientRect().right) {
                    // hero is behind the nemisis show the reverse nemisis
                    nrf.classList.remove('hidden');

                    // position the nemisis
                    nrf.style.top = nlf.style.top;
                    nrf.style.top = nlf.style.top;

                    nlf.classList.add('hidden');

                }
            } else if (nlf.classList.contains('hidden')) {
                if (this.hero.getBoundingClientRect().right < nrf.getBoundingClientRect().left) {
                    // hero is in front of the nemisis show the forward nemisis
                    nlf.classList.remove('hidden');

                    // position the nemisis
                    nlf.style.top = nrf.style.top;
                    nlf.style.left = nrf.style.left;

                    nrf.classList.add('hidden');

                }
            }
        }
    }

    onMoveRight(pixels: number) {
        if (!this.alive) {
            return;
        }

        var collision: GameCollision;
        var newPos = this.getPosition(this.hero);
        newPos.left += pixels;
        newPos.right += pixels;
        collision = this.collideAll(newPos);

        if (collision.edge === 'right') {
            pixels = Math.floor(pixels - collision.overlap);
        }

        // if (document.getElementById('track').getBoundingClientRect().right > (window.innerWidth + 210)) {
        this.sunny.move(this.level.track, 'left', pixels);
        for (var i = 0; i < this.level.trackItms.length; i++) {
            this.sunny.move(<HTMLElement>this.level.trackItms[i], 'left', pixels);
            // this.alignNemisis();
        }
        // } else {
        // this.sunny.move(this.hero, 'right', 15);
        // }
    }

    onMoveLeft(pixels: number) {
        if (!this.alive) {
            return;
        }

        var collision: GameCollision;
        var newPos = this.getPosition(this.hero);
        newPos.left -= pixels;
        newPos.right -= pixels;
        collision = this.collideAll(newPos);

        if (collision.edge === 'left') {
            pixels = Math.floor(pixels - collision.overlap);
        }

        if (document.getElementById('track').getBoundingClientRect().left < -10) {
            this.sunny.move(this.level.track, 'right', pixels);
            for (var i = 0; i < this.level.trackItms.length; i++) {
                this.sunny.move(<HTMLElement>this.level.trackItms[i], 'right', pixels);
                // this.alignNemisis();
            }
        } else {
            // this.sunny.move(this.hero, 'left', 15);
        }
    }

    public brickBreak(el) {
        var bricks = 6;
        for (var i = 0; i < bricks; i++) {
            if (el.classList.contains('b' + i)) {

                if (el.classList.contains('bonus-1')) {
                    this.bonus += 2;
                }
                // break brick no i
                var c0 = <HTMLElement>this.level.chips.item((i * 4));
                var c1 = <HTMLElement>this.level.chips.item((i * 4) + 1);
                var c2 = <HTMLElement>this.level.chips.item((i * 4) + 2);
                var c3 = <HTMLElement>this.level.chips.item((i * 4) + 3);

                this.sunny.rotate(c0, 1447, 4500, 'ease-out', 40);
                this.sunny.fade(c0, 0, 150, 0.1);
                this.sunny.moveAlongCurve(c0, 90, 50, Math.PI, 20, false, true);

                this.sunny.rotate(c1, 1447, 4500, 'ease-out', 40);
                this.sunny.fade(c1, 0, 150, 0.1);
                this.sunny.moveAlongCurve(c1, 90, 100, Math.PI, 20, false, true);


                this.sunny.rotate(c2, 1447, 4500, 'ease-out', 40);
                this.sunny.fade(c2, 0, 150, 0.1);
                this.sunny.moveAlongCurve(c2, 90, 100, Math.PI, 20, true, true);

                this.sunny.rotate(c3, 1447, 4500, 'ease-out', 40);
                this.sunny.fade(c3, 0, 150, 0.1);
                this.sunny.moveAlongCurve(c3, 90, 50, Math.PI, 20, true, true);
            }
        }

        el.style.display = 'none';

    }

    bounceElement(el: HTMLElement, axis: string, millis: number, pixels: number) {
        var direction: string;
        if (axis === 'y') {
            // bounce vertically

            direction = 'up';
            var bounce = () => {
                setTimeout(() => {
                    if (!this.alive) {
                        return;
                    }

                    var gs: GameStatus = this.status(el);

                    if (gs.status === 'hit wall') {
                        if (gs.collision.edge === 'top') {
                            direction = 'down';
                        } else if (gs.collision.edge === 'bottom') {
                            direction = 'up';
                        }
                    }
                    this.sunny.move(el, direction, pixels);
                    bounce();

                }, millis);
            }
            bounce();
        }
    }

    /**
     * Get the result of the heros position on a level
     */
    public status(el: HTMLElement): GameStatus {
        var gameStatus: GameStatus = new GameStatus();

        // check for collision
        var collision = this.collideAll(this.getPosition(el));

        if (collision.is) {
            gameStatus.collision = collision;
            if (collision.type === 'death') {
                gameStatus.status = 'hit death';
            }
            if (collision.type === 'wall') {
                gameStatus.status = 'hit wall';
            }
        }

        return gameStatus;
    }

    /**
     * Collides a position with a collection of objects
     * @param el 
     */
    public collideAll(pos: GamePosition): GameCollision {
        var collision: GameCollision = new GameCollision();
        var deathObjects = this.level.deaths;
        var wallObjects = this.level.walls;

        // check for game ending collisons first
        for (var i = 0; i < deathObjects.length; i++) {
            var rect: ClientRect = (<HTMLElement>deathObjects[i]).getBoundingClientRect();
            var position: GamePosition = new GamePosition(rect)
            collision = this.collide(pos, position);
            if (collision.is) collision.type = 'death';
        }

        // check for non game ending collisions
        for (var i = 0; i < wallObjects.length; i++) {
            var el: HTMLElement = <HTMLElement>wallObjects[i];
            // if (el.style.display !== 'none') {
            var rect: ClientRect = el.getBoundingClientRect();
            var position: GamePosition = new GamePosition(rect)
            collision = this.collide(pos, position);
            if (collision.is) {
                collision.type = 'wall';
                if (el.classList.contains('score-up') && collision.edge === 'top') {
                    this.brickBreak(el.parentElement);
                }

                if (el.classList.contains('nemisis') && collision.edge === 'bottom') {
                    if (el.classList.contains('nemisis-reverse')) {
                        var nrf = (<HTMLElement>this.level.nemisis[1]); // nemisis right facing
                        var nrfh = (<HTMLElement>this.level.nemisis[3]); // nemisis right facing hit

                        var t = nrf.style.top;
                        var l = nrf.style.left;

                        nrfh.classList.remove('hidden');
                        nrf.classList.add('hidden');

                        // position the nemisis
                        nrfh.style.top = t;
                        nrfh.style.left = l;

                        setTimeout(() => {
                            var t = nrfh.style.top;
                            var l = nrfh.style.left;

                            nrfh.classList.add('hidden');
                            nrf.classList.remove('hidden');

                            // position the nemisis
                            nrf.style.top = t;
                            nrf.style.left = l;

                            if (this.level.stats.nemisisHP === 1) {
                                for (var i = 0; i < this.level.nemisis.length; i++) {
                                    this.sunny.fade((<HTMLElement>this.level.nemisis[i]), 0, 200, 0.1);
                                    (<HTMLElement>this.level.nemisis[i]).classList.add('disabled');
                                    this.sunny.fade((<HTMLElement>document.getElementsByClassName('finish-line')[0]), 0, 150, 0.1);
                                    if ((<HTMLElement>document.getElementsByClassName('finish-line')[0]))
                                        (<HTMLElement>document.getElementsByClassName('finish-line')[0]).remove();
                                }
                                this.level.stats.nemisisHP = this.level.stats.nemisisHP - 1;
                            }
                            this.level.stats.nemisisHP = this.level.stats.nemisisHP - 1;

                        }, 50);



                        // console.log(this.level.stats.nemisisHP);
                    }

                    if (el.classList.contains('nemisis-forward')) {
                        var nlf = (<HTMLElement>this.level.nemisis[0]);
                        var nlfh = (<HTMLElement>this.level.nemisis[2]);

                        var t = nlf.style.top;
                        var l = nlf.style.left;

                        nlfh.classList.remove('hidden');
                        nlf.classList.add('hidden');

                        // position the nemisis
                        nlfh.style.top = t;
                        nlfh.style.left = l;

                        setTimeout(() => {

                            var t = nlfh.style.top;
                            var l = nlfh.style.left;

                            nlf.classList.remove('hidden');
                            nlfh.classList.add('hidden');

                            // position the nemisis
                            nlf.style.top = t;
                            nlf.style.left = l;

                            if (this.level.stats.nemisisHP === 1) {
                                for (var i = 0; i < this.level.nemisis.length; i++) {
                                    this.sunny.fade((<HTMLElement>this.level.nemisis[i]), 0, 150, 0.1);
                                    this.sunny.rotate((<HTMLElement>this.level.nemisis[i]), 1447, 2500, 'ease-out', 40);

                                    (<HTMLElement>this.level.nemisis[i]).classList.add('disabled');
                                    if ((<HTMLElement>document.getElementsByClassName('finish-line')[0]))
                                        (<HTMLElement>document.getElementsByClassName('finish-line')[0]).remove();
                                }
                                this.level.stats.nemisisHP = this.level.stats.nemisisHP - 1;
                            }
                            this.level.stats.nemisisHP = this.level.stats.nemisisHP - 1;

                        }, 50);



                        // console.log(this.level.stats.nemisisHP);
                    }
                }

                if (el.classList.contains('disabled')) {
                    collision.type = null;
                }
                return collision;
                // }
            }
        }

        return collision;
    }

    /**
     * Collides two GamePositions
     * @param r1 { GamePosition }
     * @param r2 { GamePosition }
     */
    public collide(r1: GamePosition, r2: GamePosition): GameCollision {
        var collision: GameCollision = new GameCollision();

        if (Math.abs(r1.top - r2.bottom) <= 3 && (r1.right > r2.left && r1.left < r2.right)) {
            collision.edge = 'top';
            collision.overlap = Math.abs(r1.top - r2.bottom);
            collision.is = true;
            return collision;
        }

        if (Math.abs(r1.bottom - r2.top) <= 3 && (r1.right > r2.left && r1.left < r2.right)) {
            collision.edge = 'bottom';
            collision.overlap = Math.abs(r1.bottom - r2.top);
            collision.is = true;
            return collision;
        }

        if (r1.right >= r2.left && (r1.right - r2.left) <= 25 && (r1.bottom > r2.top && r1.top + 15 < r2.bottom)) {
            // console.log('r1: ' + r1.top + ' ' +r1.left + ' ' + r1.bottom + ' ' + r1.right );
            // console.log('r2: ' + r2.top + ' ' +r2.left + ' ' + r2.bottom + ' ' + r2.right );

            collision.edge = 'right';
            collision.overlap = Math.abs(r1.right - r2.left);
            collision.is = true;
            return collision;
        }

        if (r1.left <= r2.right && (r2.right - r1.left) <= 25 && (r1.bottom > r2.top && r1.top < r2.bottom)) {
            collision.edge = 'left';
            collision.overlap = Math.abs(r1.left - r2.right);
            collision.is = true;
            return collision;
        }

        return collision;
    }

    /**
     * Hides the title screen
     */
    public static hideTitle() {
        // select all elements with class text
        var textElements = document.getElementsByClassName("text");

        // add the 'text-hidden' class to it
        for (var i = 0; i < textElements.length; i++) {
            (<HTMLElement>textElements[i]).classList.add('text-hidden');
        }

        // select the green stripe
        var greenStripeElement = document.getElementsByClassName("green-stripe")[0];

        // add the first transformation class to the green stripe
        (<HTMLElement>greenStripeElement).classList.add('green-stripe-1');
    }
}