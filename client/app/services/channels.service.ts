import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChannelsService {
    constructor(private http: Http) {
        console.log('Channels service initialized...');
    }

    getChannels() {
        return this.http.get('/api/channels').map(res => res.json());
    }

    getChannel(channelId) {
        return this.http.get('/api/channel/' + channelId).map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    addChannel(newChannel) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/channel', JSON.stringify(newChannel), { headers: headers }).map(res => res.json());
    }

    joinChannel(data) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/channel/', JSON.stringify(data), { headers: headers }).map(res => res.json());
    }
}