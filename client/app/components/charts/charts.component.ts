

import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelsService } from '../../services/channels.service';
import { VotesService } from '../../services/votes.service';


@Component({
        moduleId: module.id,
    selector: 'simple-chart-example',
    templateUrl: 'charts.component.html'
   
})

export class ChartsComponent {
    data3 : string[]
    data: Object;
    tableau : number[];
    image: string;  
    
    constructor(private route: ActivatedRoute, private votesService : VotesService, private channelsService : ChannelsService ) {

       console.log('constructor chart');
       this.addDataGlobal(route.snapshot.params['id']);
       
       
    }

    
    addDataGlobal(channelId){
            console.log("adding Data");
            var iteration = 1;
            var i : number = 0;
            var j : number = 0;
            var k : number = 0;
            var tableau = [0];
            var tableauMoyenne = [];
            this.votesService.getVotes(channelId).subscribe(votes => {
                while(iteration<votes.length){
                    
                    votes.forEach(function (e) {
                        tableau.push( e.status as number );
                    });
                    //console.log(tableau);
                    iteration = votes.length;
                }
                while(i<=iteration)
                {
                    j = i;
                    while(j>0){
                        k = k + tableau[j];
                        j = j-1;
                    }
                    if(i==0){
                        tableauMoyenne.push(0);
                    }
                    else{
                         tableauMoyenne.push(k/i);
                    }
                    k = 0;
                    i = i + 1 ;
                }
                this.constructData(tableauMoyenne);
                this.showMood(tableauMoyenne[iteration]);

            });
    }

    //graph global
    constructData(tableau){
        this.data = {};
        this.data = {
        title : { text : "L\'évolution de la moyenne des votes" },
        series: [{
            data: tableau,
            }]
        };
    }


    //graph Mensuel
    addDataDaily(channelId) {
            var iteration = 1;
            var i : number = 0;
            var j : number = 0;
            var k : number = 0;
            var tableau = [0];
            var tableauMoyenne = [];
            //24h = 86400000 secondes
            this.votesService.getVotes(channelId).subscribe( votes => {
                 while(iteration<votes.length){
                    votes.forEach(function (e) {
                        if(new Date(e.time.toString()).getTime() > new Date().getTime() - 86400000)
                        {
                            tableau.push( e.status as number );
                            console.log(new Date(e.time.toString()).getTime());
                            
                        }
                        iteration++;
                    });
                }
                while(i<=iteration)
                {
                    j = i;
                    while(j>0){
                        k = k + tableau[j];
                        j = j-1;
                    }
                    if(i==0){
                        tableauMoyenne.push(0);
                    }
                    else{
                         tableauMoyenne.push(k/i);
                    }
                    k = 0;
                    i = i + 1 ;
                }
                this.constructData(tableauMoyenne);
                this.showMood(tableauMoyenne[iteration]);

            });
            
            
    }






    showMood(Moyenne){
        
        if(0<=Moyenne && Moyenne<1){
            this.image = ":("
        }
        if(1<=Moyenne && Moyenne<2){
            this.image = ":/"
        }
        if(2<=Moyenne && Moyenne<3){
            this.image = ":|"
        }
        if(3<=Moyenne && Moyenne<4){
            this.image = ":)"
        }
        if(4<=Moyenne && Moyenne<5){
            this.image = ":D"
        }
   }
}