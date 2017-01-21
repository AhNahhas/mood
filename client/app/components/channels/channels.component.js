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
var ChannelsComponent = (function () {
    function ChannelsComponent(channelsService, router) {
        this.channelsService = channelsService;
        this.router = router;
        var that = this;
        new Fingerprint2().get(function (result) {
            that.fingerprintId = result;
        });
    }
    // e : title
    ChannelsComponent.prototype.addChannel = function (e) {
        var _this = this;
        console.log('Adding channel ' + e);
        var that = this;
        var newChannel = {
            title: e,
            users: [] // empty user list
        };
        this.channelsService.addChannel(newChannel).subscribe(function (newChannelId) {
            _this.title = '';
            _this.joinChannel(newChannelId, _this.fingerprintId);
        });
    };
    // channelId, userId
    ChannelsComponent.prototype.joinChannel = function (cId, uId) {
        var _this = this;
        console.log('Joining channel ' + cId + ' as ' + uId);
        var data = {
            channelId: cId,
            userId: uId
        };
        this.channelsService.joinChannel(data).subscribe(function (data) {
            _this.router.navigate(['/v/' + cId]);
        });
    };
    // Enter event on html input
    ChannelsComponent.prototype.checkChannel = function (event) {
        var _this = this;
        event.preventDefault();
        var t = this.title;
        var res = 0;
        var channelId;
        this.channelsService.getChannels().subscribe(function (channels) {
            console.log(channels);
            _this.channels = channels;
            _this.channels.forEach(function (e) {
                if (e.title == t) {
                    res = 1;
                    channelId = e._id;
                }
            });
            if (res == 1) {
                _this.joinChannel(channelId, _this.fingerprintId);
            }
            else {
                _this.addChannel(t);
            }
        });
    };
    return ChannelsComponent;
}());
ChannelsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'channels',
        templateUrl: 'channels.component.html',
        styleUrls: ['channels.component.css']
    }),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService, router_1.Router])
], ChannelsComponent);
exports.ChannelsComponent = ChannelsComponent;
//# sourceMappingURL=channels.component.js.map