"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var channels_service_1 = require("../../services/channels.service");
var votes_service_1 = require("../../services/votes.service");
require("rxjs/add/operator/switchMap");
var VoteComponent = (function () {
    function VoteComponent(route, router, votesService, channelsService) {
        this.route = route;
        this.router = router;
        this.votesService = votesService;
        this.channelsService = channelsService;
        this.voted = true;
        console.log('Vote constructor');
        this.channelId = route.snapshot.params['id'];
        this.verifyChannel(this.channelId);
        var that = this;
        new Fingerprint2().get(function (result) {
            that.fingerprintId = result;
        });
    }
    VoteComponent.prototype.vote = function (i) {
        var _this = this;
        console.log('Adding vote: ' + i);
        var newVote = {
            channelId: this.channelId,
            userId: this.fingerprintId,
            time: new Date(),
            status: i
        };
        this.voted = true; // For the "flahsing effect" on the progress bar
        this.votesService.addVote(newVote).subscribe(function (data) {
            console.log(data);
            _this.voted = false;
        });
    };
    VoteComponent.prototype.verifyChannel = function (channelId) {
        var _this = this;
        this.channelsService.getChannel(channelId).subscribe(function (data) {
            //console.log(data);
            if (data == null) {
                _this.errorId();
            }
            else {
                _this.channelTitle = data.title;
                //console.log(this.dateFromObjectId(data._id));
                console.log('Valid channelId!');
            }
        }, function (error) {
            //console.log(error);
            _this.errorId();
        });
    };
    VoteComponent.prototype.dateFromObjectId = function (objectId) {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };
    ;
    // Bad channelId
    VoteComponent.prototype.errorId = function () {
        console.log('Error with channelId');
        console.log('Redirecting...');
        this.router.navigate(['/404']); // Or redirect to index ['/']
    };
    return VoteComponent;
}());
VoteComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'vote',
        templateUrl: 'vote.component.html',
        styleUrls: ['vote.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, votes_service_1.VotesService, channels_service_1.ChannelsService])
], VoteComponent);
exports.VoteComponent = VoteComponent;
//# sourceMappingURL=vote.component.js.map