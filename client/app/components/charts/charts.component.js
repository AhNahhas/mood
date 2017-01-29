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
var ChartsComponent = (function () {
    function ChartsComponent(route, votesService, channelsService) {
        this.route = route;
        this.votesService = votesService;
        this.channelsService = channelsService;
        console.log('constructor chart');
        this.addDataGlobal(route.snapshot.params['id']);
    }
    ChartsComponent.prototype.addDataGlobal = function (channelId) {
        var _this = this;
        console.log("adding Data");
        var iteration = 1;
        var i = 0;
        var j = 0;
        var k = 0;
        var tableau = [0];
        var tableauMoyenne = [];
        this.votesService.getVotes(channelId).subscribe(function (votes) {
            while (iteration < votes.length) {
                votes.forEach(function (e) {
                    tableau.push(e.status);
                });
                //console.log(tableau);
                iteration = votes.length;
            }
            while (i <= iteration) {
                j = i;
                while (j > 0) {
                    k = k + tableau[j];
                    j = j - 1;
                }
                if (i == 0) {
                    tableauMoyenne.push(0);
                }
                else {
                    tableauMoyenne.push(k / i);
                }
                k = 0;
                i = i + 1;
            }
            _this.constructData(tableauMoyenne);
            _this.showMood(tableauMoyenne[iteration]);
        });
    };
    //graph global
    ChartsComponent.prototype.constructData = function (tableau) {
        this.data = {};
        this.data = {
            title: { text: "L\'évolution de la moyenne des votes" },
            series: [{
                    data: tableau,
                }]
        };
    };
    //graph Mensuel
    ChartsComponent.prototype.addDataDaily = function (channelId) {
        var _this = this;
        var iteration = 1;
        var i = 0;
        var j = 0;
        var k = 0;
        var tableau = [0];
        var tableauMoyenne = [];
        //24h = 86400000 secondes
        this.votesService.getVotes(channelId).subscribe(function (votes) {
            while (iteration < votes.length) {
                votes.forEach(function (e) {
                    if (new Date(e.time.toString()).getTime() > new Date().getTime() - 86400000) {
                        tableau.push(e.status);
                        console.log(new Date(e.time.toString()).getTime());
                    }
                    iteration++;
                });
            }
            while (i <= iteration) {
                j = i;
                while (j > 0) {
                    k = k + tableau[j];
                    j = j - 1;
                }
                if (i == 0) {
                    tableauMoyenne.push(0);
                }
                else {
                    tableauMoyenne.push(k / i);
                }
                k = 0;
                i = i + 1;
            }
            _this.constructData(tableauMoyenne);
            _this.showMood(tableauMoyenne[iteration]);
        });
    };
    ChartsComponent.prototype.showMood = function (Moyenne) {
        if (0 <= Moyenne && Moyenne < 1) {
            this.image = ":(";
        }
        if (1 <= Moyenne && Moyenne < 2) {
            this.image = ":/";
        }
        if (2 <= Moyenne && Moyenne < 3) {
            this.image = ":|";
        }
        if (3 <= Moyenne && Moyenne < 4) {
            this.image = ":)";
        }
        if (4 <= Moyenne && Moyenne < 5) {
            this.image = ":D";
        }
    };
    return ChartsComponent;
}());
ChartsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'simple-chart-example',
        templateUrl: 'charts.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, votes_service_1.VotesService, channels_service_1.ChannelsService])
], ChartsComponent);
exports.ChartsComponent = ChartsComponent;
//# sourceMappingURL=charts.component.js.map