import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";

import { Game } from "app/models/game.interface";
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs/Observable";

@Injectable()
export class GameService {
    _games: Subject<Game[]>;
    games: Game[];

    _searchTerm: Subject<string>;

    constructor(private http: Http) {
        this._games = new Subject<Game[]>();
        this._searchTerm = new Subject<string>();
    }

    getObvservableGames() {
        return this._games.asObservable();
    }

    sendGames(data) {
        this._games.next(data);
    }

    getGames() {
        return this.games;
    }

    get(genre: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(environment.api + '/games', { genre }, { headers: headers })
            .map(res => res.json())
            .subscribe(json => { this.process(json) });
    }

    getAll() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get(environment.api + '/games', { headers: headers })
            .map(res => res.json())
            .subscribe(json => { this.process(json) });
    }

    search(searchTerm: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(environment.api + '/games/search', { searchTerm }, { headers: headers })
            .map(res => res.json())
            .subscribe(json => { this.process(json) });
    }

    private process(json) {
        this.games = [];

        if (json) {
            for (var i = 0; i < json.length; i++) {
                this.games.push(json[i]);
            }
            this.sendGames(this.games);
        }
    }

}
