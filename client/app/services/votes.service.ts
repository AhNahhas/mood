import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VotesService {
    constructor(private http: Http) {
        console.log('Votes service initialized...');
    }

    addVote(newVote) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/vote', JSON.stringify(newVote), { headers: headers }).map(res => res.json());
    }

}