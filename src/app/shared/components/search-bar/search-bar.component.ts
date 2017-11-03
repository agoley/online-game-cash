import { Component, OnInit } from '@angular/core';
import { GameService } from "app/shared/services/game.service";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchTerm: string;

  constructor(private gameService: GameService) { }

  ngOnInit() {}

 /**
  * Filter the games whenever the searchTerm is modified.
  * @param event 
  */
  onNewSearchTerm(event) {
    this.gameService.search(this.searchTerm);
  }

}
