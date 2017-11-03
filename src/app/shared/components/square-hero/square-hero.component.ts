import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IGamePosition } from "app/models/game-position.interface";
import { GameEngine } from "app/utilities/GameEngine";
import { IGameLevel } from "app/models/game-level.interface";
import { GameLevel } from "app/utilities/GameLevel";
import { GamePosition } from "app/utilities/GamePosition";
import { GameStatus } from "app/utilities/GameStatus";
import { GameLists } from "app/lists/game-lists";
import { GameWindowManager } from "app/utilities/GameWindowManager";
import { GameSunny } from "app/utilities/GameSunny";
import { GameTimer } from "app/utilities/GameTimer";

@Component({
  selector: 'shared-square-hero',
  templateUrl: './square-hero.component.html',
  styleUrls: ['./square-hero.component.scss']
})
export class SquareHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('startBtn') startBtnRef: ElementRef;
  @ViewChild('hero') hero: ElementRef;
  @Output() reset: EventEmitter<boolean>;
  
  view: string = 'title';
  walls: HTMLCollectionOf<Element>;
  deaths: HTMLCollectionOf<Element>;
  engine: GameEngine;
  level: GameLevel;
  mIndex: number;
  messages: string[];
  sunny: GameSunny;
  gwm: GameWindowManager;

  constructor() {
    this.reset = new EventEmitter<boolean>();
    this.messages = GameLists.messages;
    this.mIndex = 0;
    this.sunny = new GameSunny();
    this.gwm = new GameWindowManager();

    this.gwm.disableScroll();
  }

  ngOnDestroy(): void {
    this.gwm.enableScroll();
  }

  ngAfterViewInit(): void {
    this.blinkStart();
    this.walls = document.getElementsByClassName('wall');
    this.deaths = document.getElementsByClassName('death');
    var bricks = document.getElementsByClassName('brick');
    var brickChips = document.getElementsByClassName('brick-chip');
    var track = <HTMLElement>document.getElementsByClassName('track')[0];
    var trackItms = document.getElementsByClassName('track-itm');
    var chips = document.getElementsByClassName('brick-chip');
    var vmos = document.getElementsByClassName('bounce-vertical');
    var nemisis = document.getElementsByClassName('nemisis');
    this.level = new GameLevel(nemisis, track, this.walls, this.deaths, vmos, null, trackItms, chips);
    this.engine = new GameEngine((<HTMLElement>this.hero.nativeElement), this.level);

    window.onkeydown = (e) => {
      if (this.view === 'game' && (e.keyCode == 39 || e.keyCode == 68) ) {
        this.onRightKeyPress();
      } else if (this.view === 'game' && (e.keyCode == 37 || e.keyCode == 65)) {
        this.onLeftKeyPress();
      } else if (this.view === 'game' && e.keyCode == 66) {
        this.engine.brickBreak(<HTMLElement>bricks.item(0));
      }
    }
  }

  onReset() {
    this.reset.emit(true);
  }

  start() {
    GameEngine.hideTitle();
    (<HTMLElement>document.getElementById('resetBtn')).style.display = 'none';    

    setTimeout(() => {
      this.view = 'game';
      this.engine.start();
    }, 2000);

  }

  getTime(): string {
    if (this.engine) {
      return this.engine.timer.getDisplayValue();
    } else {
      return '00:00:00';
    }

  }

  onRightKeyPress() {
    if (!this.engine.timer.running) {
      this.engine.timer.start();
    }
    this.engine.onMoveRight(25);
  }

  onLeftKeyPress() {
    this.engine.onMoveLeft(25);
  }

  blinkStart() {
    this.sunny.flash(<HTMLElement>this.startBtnRef.nativeElement, 500);
  }

  showReset(): boolean {
    return this.engine? this.engine.showReset : false;
  }
}
