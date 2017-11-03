import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Subscription } from "rxjs/Subscription";

import { Game } from "app/models/game.interface";
import { environment } from '../../../../environments/environment';
import { GameService } from "app/shared/services/game.service";
import { trigger, animate, transition, style, state } from "@angular/animations";



@Component({
  host: {
    '(document:click)': 'onClick($event)',
    '(window:resize)': 'onResize($event)'
  },
  selector: 'shop-featured',
  animations: [
    trigger(
      'toast-in',
      [
        transition(
          ':enter', [
            style({ left: -250, opacity: 0 }),
            animate('250ms', style({ left: -5, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ left: -5, 'opacity': 1 }),
            animate('250ms', style({ left: -250, opacity: 0 }))
          ]
        )]
    ),
    trigger(
      'fade',
      [
        transition(
          ':enter', [
            style({ transform: 'translateX(0)', opacity: 0 }),
            animate('250ms', style({ transform: 'translateX(0)', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ transform: 'translateX(0)', 'opacity': 1 }),
            animate('250ms', style({ transform: 'translateX(0)', opacity: 0 }))
          ]
        )]
    ),
    trigger('gameState', [
      state('inactive', style({
        height: '250px'
      })),
      state('active', style({
        width: '425px',
      })),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('250ms ease-out'))
    ])
  ],
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
})
export class FeaturedComponent implements OnInit {
  @Input() genre: string;

  _games: Subscription;
  games: Game[];
  filteringByConsole: boolean;
  filteringByGenre: boolean;
  consoleFilter: string;
  genreFilter: string;
  genreOptions: any[];
  consoleOptions: any[];
  actionGames: Game[];
  actionIndex: number;
  rows: any[][];
  size: number;
  gameWidth: number;
  gamesToShow: any[];
  resizing = false;
  isHovering: string;
  focused: any;
  gameInFocus: string;
  gameInDetail: Game;
  showToast: boolean;
  showGame: boolean;

  filter = {
    genre: {
      action: false,
      adventure: false,
      fighting: false,
      family: false,
      strategy: false,
      rpg: false
    },
    console: {
      xbox1: false,
      ps4: false,
      switch: false,
      xbox360: false,
      ps3: false,
      ds: false,
      wii: false
    }
  };

  constructor(private gameService: GameService, private _eref: ElementRef, private cd: ChangeDetectorRef) {
    this.filteringByConsole = false;
    this.filteringByGenre = false;
    this.showToast = false;
    this.gameInFocus = null;
    this.showGame = true;

    this._games = gameService.getObvservableGames()
      .subscribe(data => this.processGames(this.processGames(data)));

    this.genreOptions = ['ACTION', 'ADVENTURE', 'FIGHTING', 'FAMILY', 'STRATEGY', "ROLE-PLAYING"];
    this.consoleOptions = ['XBOX ONE', 'PLAYSTATION 4', 'XBOX 360', 'PLAYSTATION 3', 'NINTENDO DS', "SWITCH", "WII"];

  }

  processGames(games) {
    if (games) {
      this.games = [];
      for (var i = 0; i < games.length; i++) {
        this.games.push(games[i]);
      }
      this.setGamesToShow();
      this.fitGames();
    }
  }

  getRows() {
    var arrays = [];
    this.size = ((window.innerWidth - 80) / 178) - 1;

    for (var i = 0; i < this.gamesToShow.length; i++) {
      var row = [];
      for (var j = 0; j < this.size && i < this.gamesToShow.length; j++ , i++) {
        this.gamesToShow[i].state = 'inactive';
        row.push(this.gamesToShow[i]);
      }
      arrays.push(row);
      i--;
    }

    return arrays;

  }

  fitGames() {
    this.rows = this.getRows();
    this.setGameWidth();
  }

  setGameWidth() {
    if (this.games.length > 0) {
      var l = this.rows[0].length;
      this.gameWidth = (window.innerWidth - (80 + (l * 6))) / l;

      if (this.gameWidth > 300) this.gameWidth = 300;
    }
  }

  onResize(event) {
    this.fitGames();
  }

  onMouseEnter(game: any, event) {
    this.isHovering = game.image_path;
    setTimeout(() => {
      if (this.isHovering === game.image_path) {
        if (this.gameInDetail) {
          this.gameInDetail = game;
        } else {
          this.focused = event.srcElement;
          game.state = 'active';
        }
      }
    }, 750);
    this.cd.detectChanges();
  }

  isGameInDetail(game: Game) {
    return this.gameInDetail ? this.gameInDetail.image_path === game.image_path : false;
  }

  animationDone(event, r, i, game) {
    var gameIndex = ((r * this.rows[0].length)) + i;
    var itm = document.getElementsByClassName("cover")[gameIndex];

    if (event.fromState === 'active') {
      setTimeout(() => {
        var row = document.getElementsByClassName("row")[r];
        (<HTMLElement>row).style.marginLeft = '0';
        (<HTMLElement>itm).style.width = this.gameWidth + 'px';
        this.gameInFocus = null;
      }, 0);
    } else if (event.fromState === 'inactive') {
      this.gameInFocus = game.image_path;
    }
  }

  animationStart(event, index, r) {
    if (event.fromState === 'inactive') {
      var el = document.getElementsByClassName("row")[r];
      if (this.rows[0].length != 1 && index == (this.rows[0].length - 1)) {
        (<HTMLElement>el).style.marginLeft = this.gameWidth - 425 + 'px';
      } else if (index != 0) {
        (<HTMLElement>el).style.marginLeft = -125 + 'px';
      }
    }
  }

  onMouseLeave(game: any) {
    this.isHovering = null;
    game.state = 'inactive';
    this.cd.detectChanges();
  }

  isGameActive(game) {
    return this.gameInFocus == game.image_path;
  }

  shouldDetailsBeShowing(row: Game[]) {
    if (this.gameInDetail) {
      for (var i = 0; i < row.length; i++) {
        if (this.gameInDetail.image_path == row[i].image_path) {
          return true;
        }
      }
    }
    return false;
  }

  onDetailsClose() {
    this.gameInDetail = null;
  }

  showDetailsForGame(game: any) {
    // minimize the game
    this.isHovering = null;
    game.state = 'inactive';
    this.cd.detectChanges();

    // set the game in detail
    this.gameInDetail = game;
  }

  getSelectedGenres(): string[] {
    var selected: string[] = [];
    if (this.filter.genre.action) selected.push('ACTION');
    if (this.filter.genre.adventure) selected.push('ADVENTURE');
    if (this.filter.genre.fighting) selected.push('FIGHTING');
    if (this.filter.genre.family) selected.push('FAMILY');
    if (this.filter.genre.strategy) selected.push('STRATEGY');
    if (this.filter.genre.rpg) selected.push('ROLE-PLAYING');
    return selected;
  }

  getSelectedConsoles(): string[] {
    var selected: string[] = [];
    if (this.filter.console.xbox1) selected.push('XBOX ONE');
    if (this.filter.console.ps4) selected.push('PLAYSTATION 4');
    if (this.filter.console.xbox360) selected.push('XBOX 360');
    if (this.filter.console.ps3) selected.push('PLAYSTATION 3');
    if (this.filter.console.ds) selected.push('NINTENDO DS');
    if (this.filter.console.switch) selected.push('SWITCH');
    if (this.filter.console.wii) selected.push('WII');
    return selected;
  }

  onGenreSelect(event) {
    switch (event) {
      case 'ACTION':
        this.filter.genre.action = !this.filter.genre.action;
        break;
      case 'ADVENTURE':
        this.filter.genre.adventure = !this.filter.genre.adventure;
        break;
      case 'FIGHTING':
        this.filter.genre.fighting = !this.filter.genre.fighting;
        break;
      case 'FAMILY':
        this.filter.genre.family = !this.filter.genre.family;
        break;
      case 'STRATEGY':
        this.filter.genre.strategy = !this.filter.genre.strategy;
        break;
      case 'ROLE-PLAYING':
        this.filter.genre.rpg = !this.filter.genre.rpg;
        break;
      default: break;
    }

    this.setGamesToShow();
    this.fitGames();

  }

  onConsoleSelect(event) {
    switch (event) {
      case 'XBOX ONE':
        this.filter.console.xbox1 = !this.filter.console.xbox1;
        break;
      case 'PLAYSTATION 4':
        this.filter.console.ps4 = !this.filter.console.ps4;
        break;
      case 'XBOX 360':
        this.filter.console.xbox360 = !this.filter.console.xbox360;
        break;
      case 'NINTENDO DS':
        this.filter.console.ds = !this.filter.console.ds;
        break;
      case 'PLAYSTATION 3':
        this.filter.console.ps3 = !this.filter.console.ps3;
        break;
      case 'SWITCH':
        this.filter.console.switch = !this.filter.console.switch;
        break;
      case 'WII':
        this.filter.console.wii = !this.filter.console.wii;
        break;
      default: break;
    }

    this.setGamesToShow();
    this.fitGames();

  }

  setGamesToShow() {
    this.gamesToShow = [];

    for (var i = 0; i < this.games.length; i++) {
      var g: Game = this.games[i];
      if (this.shouldGameBeShowing(g)) {
        this.gamesToShow.push(g);
      }
    }
  }


  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target))
      this.filteringByConsole = false;
  }

  shouldGameBeShowing(game: Game) {

    if (this.filter.genre.action ||
      this.filter.genre.adventure ||
      this.filter.genre.fighting ||
      this.filter.genre.family ||
      this.filter.genre.strategy ||
      this.filter.genre.rpg) {
      // the genre filter is dirty

      for (var i = 0; i < game.genre.length; i++) {
        switch (game.genre[i]) {
          case 'Action':
            if (!this.filter.genre.action) {
              return false;
            }
            break;
          case 'Adventure':
            if (!this.filter.genre.adventure) {
              return false;
            }
            break;
          case 'Fighting':
            if (!this.filter.genre.fighting) {
              return false;
            }
            break;
          case 'Family':
            if (!this.filter.genre.family) {
              return false;
            }
            break;
          case 'Strategy':
            if (!this.filter.genre.family) {
              return false;
            }
            break;
          case 'RPG':
            if (!this.filter.genre.rpg) {
              return false;
            }
            break;
          default: { } // do nothing
        }
      }
    }

    if (this.filter.console.ds ||
      this.filter.console.ps3 ||
      this.filter.console.ps4 ||
      this.filter.console.switch ||
      this.filter.console.wii ||
      this.filter.console.xbox1 ||
      this.filter.console.xbox360) {

      // the console filter is dirty
      switch (game.console) {
        case 'Xbox One':
          if (!this.filter.console.xbox1) return false;
          break;
        case 'PS4':
          if (!this.filter.console.ps4) return false;
          break;
        case 'PS3':
          if (!this.filter.console.ps3) return false;
          break;
        case 'Wii U':
          if (!this.filter.console.wii) return false;
          break;
        case 'Xbox 360':
          if (!this.filter.console.xbox360) return false;
          break;
        case 'Nintendo DS':
          if (!this.filter.console.ds) return false;
          break;
        case 'Switch':
          if (!this.filter.console.switch) return false;
          break;
        default: { } // do nothing
      }
    }
    return true;
  }

  getImagePath(game: Game) {
    var p: string;
    if (this.gameInFocus === game.image_path) {
      p = this.getGamePlayImagePath(game);
    } else {
      p = environment.images + 'games/' + game.image_path;
    }
    return p;
  }

  getGamePlayImagePath(game: Game) {
    var i = game.image_path.indexOf('.');
    return environment.images + 'games/' + game.image_path.slice(0, i) + '_gp' + game.image_path.slice(i);
  }

  toggleConsoleFilter() {
    this.filteringByConsole = !this.filteringByConsole;
    this.filteringByGenre = false;
  }

  menuClose(event) {
    if (this.filteringByGenre) {
      this.filteringByGenre = false;
    }
    if (this.filteringByConsole) {
      this.filteringByConsole = false;
    }
  }

  toggleGenreFilter() {
    this.filteringByGenre = !this.filteringByGenre;
    this.filteringByConsole = false;
  }

  ngOnInit() {
    this.games = [];
    this.gameService.getAll();
  }

  onAdd(game, action: string) {
    this.isHovering = null;
    game.state = 'inactive';
    this.gameInDetail = null;
    this.showToast = true;
  }

  onCloseToast() {
    this.showToast = false;
  }

  onReset(event: boolean) {
    // reset the game
    
    this.showGame = false;

    setTimeout(() => {
      this.showGame = true;
    }, 300);
  }

}
