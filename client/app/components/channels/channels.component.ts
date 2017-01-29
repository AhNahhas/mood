import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelsService } from '../../services/channels.service';

declare var Fingerprint2: any;

@Component({
    moduleId: module.id,
    selector: 'channels',
    templateUrl: 'channels.component.html',
    styleUrls: ['channels.component.css']
})
export class ChannelsComponent {
    title: string;
    fingerprintId: string;

    constructor(private channelsService: ChannelsService, private router: Router) {
        var that = this;
        new Fingerprint2().get(function (result) {
            that.fingerprintId = result;
        });
    }

    // e : title
    addChannel(e: string) {
        //console.log('Adding channel ' + e);
        var that = this;
        var newChannel = {
            title: e,
            users: []   // empty user list
        };

        this.channelsService.addChannel(newChannel).subscribe(newChannelId => {
            this.title = '';
            this.joinChannel(newChannelId, this.fingerprintId);
        });
    }

    // channelId, userId
    joinChannel(cId: string, uId: string) {
        //console.log('Joining channel ' + cId + ' as ' + uId);
        var data = {
            channelId: cId,
            userId: uId
        };

        this.channelsService.joinChannel(data).subscribe(data => {
            this.router.navigate(['/v/' + cId]);
        });
    }

    // Enter event on html input
    checkChannel(event) {
        event.preventDefault();
        this.channelsService.getChannels().subscribe(channels => { //Get all channels
            let chan = channels.filter(x => x.title == this.title); //Filter results
            if(chan.length > 0 && chan.title == this.title){ //Join if it exists
                this.joinChannel(chan._id, this.fingerprintId);
            } else {
                this.addChannel(this.title);
            }
        });
    }
}
