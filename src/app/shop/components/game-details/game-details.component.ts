import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, animate, transition, style, state } from "@angular/animations";

import { Game } from "app/models/game.interface";
import { environment } from "environments/environment";

@Component({
  selector: 'shop-game-details',
  animations: [
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
    )],
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {
  @Input() game: any;
  @Output()
  close: EventEmitter<boolean>;
   @Output()
  add: EventEmitter<string>;
  actions: string;
  view: string;

  constructor() {
    this.close = new EventEmitter<boolean>();
    this.add = new EventEmitter<string>();
    this.actions = null;
    this.view = 'details';
  }

  ngOnInit() {
  }

  getGamePlayImagePath() {
    var i = this.game.image_path.indexOf('.');
    return environment.images + 'games/' + this.game.image_path.slice(0, i) + '_gp' + this.game.image_path.slice(i);
  }

  onClose() {
    this.close.emit(true);
  }

   onAdd() {
    this.add.emit(this.actions);
  }
}
