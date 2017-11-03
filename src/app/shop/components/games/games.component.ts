import { Component, OnInit } from '@angular/core';
import { GameService } from "app/shared/services/game.service";
import { Subscription } from "rxjs/Subscription";

import { Game } from '../../../models/game.interface';

@Component({
  selector: 'shop-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.less']
})
export class GamesComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {}

}
