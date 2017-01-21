import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelsService } from '../../services/channels.service';
import { Channel } from '../../custom_class/Channel';

declare var Fingerprint2: any;

@Component({
    moduleId: module.id,
    selector: 'channels',
    templateUrl: 'channels.component.html',
    styleUrls: ['channels.component.css']
})
export class ChannelsComponent {
    channels: Channel[];
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
        console.log('Adding channel ' + e);
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
        console.log('Joining channel ' + cId + ' as ' + uId);
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

        let t = this.title;
        let res = 0;
        let channelId: string;

        this.channelsService.getChannels().subscribe(channels => {
            console.log(channels);
            this.channels = channels;
            this.channels.forEach(function (e) {
                if (e.title == t) {
                    res = 1;
                    channelId = e._id;
                }
            });
            if (res == 1) {
                this.joinChannel(channelId, this.fingerprintId);
            } else {
                this.addChannel(t);
            }
        });
    }
}
