import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelsService } from '../../services/channels.service';
import { VotesService } from '../../services/votes.service';

import 'rxjs/add/operator/switchMap';


declare var Fingerprint2: any;

@Component({
    moduleId: module.id,
    selector: 'vote',
    templateUrl: 'vote.component.html',
    styleUrls: ['vote.component.css']
})

export class VoteComponent {
    channelId: string;
    channelTitle: string;
    fingerprintId: string;
    voted: boolean = true;

    constructor(private route: ActivatedRoute, private router: Router, private votesService: VotesService, private channelsService: ChannelsService) {
        console.log('Vote constructor');
        this.channelId = route.snapshot.params['id'];
        this.verifyChannel(this.channelId);

        var that = this;
        new Fingerprint2().get(function (result) {
            that.fingerprintId = result;
        });
    }

    vote(i) {
        console.log('Adding vote: ' + i);
        var newVote = {
            channelId: this.channelId,
            userId: this.fingerprintId,
            time: new Date(),
            status: i
        };

        this.voted = true;  // For the "flahsing effect" on the progress bar

        this.votesService.addVote(newVote).subscribe(data => {
            console.log(data);
            this.voted = false;
        });
    }

    verifyChannel(channelId) {
        this.channelsService.getChannel(channelId).subscribe(
            data => {
                //console.log(data);
                if (data == null) {
                    this.errorId();
                } else {
                    this.channelTitle = data.title;
                    //console.log(this.dateFromObjectId(data._id));
                    console.log('Valid channelId!');
                }
            },
            error => {
                //console.log(error);
                this.errorId();
            }
        );
    }

    dateFromObjectId(objectId) {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    // Bad channelId
    errorId() {
        console.log('Error with channelId')
        console.log('Redirecting...');
        this.router.navigate(['/404']); // Or redirect to index ['/']
    }
}