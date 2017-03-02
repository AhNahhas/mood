import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChannelsService } from '../../services/channels.service';
import { VotesService } from '../../services/votes.service';
import { CommentsService } from '../../services/comments.service';
import * as _ from 'underscore';
import * as moment from 'moment';

import { Comment } from '../../interfaces/comment.interface';
import { Vote } from '../../interfaces/vote.interface';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  channelId: string;
  channelTitle: string;
  options: Object;
  data: Object; //for the chart

  votes: Vote[];  //channel's votes
  comments: Comment[]; // channel's comments
  voteList: { comments: Comment[], date: Date, format: string, votes: Vote[] }[];   // sorted votes
  commentList: boolean[]; // comments' visibility

  period: string; // Global, day, week or month

  timeStart: Date;
  timeEnd: Date;
  loop: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private votesService: VotesService,
    private channelsService: ChannelsService,
    private commentsService: CommentsService
  ) {
    this.channelId = route.snapshot.params['id'];
    this.verifyChannel(this.channelId);

    this.period = "global"; // default value
    this.timeStart = new Date();
    this.timeEnd = new Date();
    this.commentList = [];


    // A changer http://api.highcharts.com/highcharts/
    this.options = {
      chart: {
        height: 200
      },
      title: { text: 'simple chart' },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2],
      }]
    };
  }

  ngOnInit() {
    this.getVotes(this.channelId);
    this.getComments(this.channelId);
  }

  showComment(i: number) {
    this.commentList[i] = !this.commentList[i];
  }

  periodOnChange(event) {
    this.period = event;
    this.formatData(this.votes, this.comments);
  }

  loadData() {
    if (this.votes != undefined && this.comments != undefined) // Promise on both subscribe()
      this.formatData(this.votes, this.comments);
  }

  getComments(channelId) {
    this.commentsService.getComments(channelId).subscribe(comments => {
      let tableau = [];
      comments.forEach(function (e) {
        e.time = new Date(e.time);
        tableau.push(e);
      });
      this.comments = comments;
      this.loadData();
    });
  }

  // Get the channel's votes
  getVotes(channelId) {
    this.votesService.getVotes(channelId).subscribe(votes => {
      let tableau = [];
      votes.forEach(function (e) {
        e.time = new Date(e.time);
        tableau.push(e);
      });
      this.votes = votes;
      this.timeStart = votes[0].time;
      this.loadData();
    });
  }

  getVoteCount(element) {
    let slice = element.slice(1, element.length);
    let sum = [];
    slice.forEach((e) => {
      sum.push(e.length);
    });

    return sum.reduce(function (acc, val) {
      return acc + val;
    }, 0);
  }

  getVotePercentage(element, i: number) {
    let total = this.getVoteCount(element);
    return (total != 0) ? Math.round(element[i].length / total * 100) : 0;
  }

  getAverageScore(voteList) {
    if (voteList != undefined) {
      let sum = 0;
      let count = 0;
      voteList.forEach((element) => {
        for (let i = 1; i < 6; i++) {
          sum += element.votes[i].length * i;
          count += element.votes[i].length;
        }
      });
      return Math.round(sum / count * 10) / 10 || 0; // Rounded to one decimal, if 0 votes return 0
    }
  }

  getBestAverageScore(voteList) {
    if (voteList != undefined) {
      let res = 0;
      let sum;
      let count;
      let average;
      voteList.forEach((element) => {
        sum = 0;
        count = 0;
        for (let i = 1; i < 6; i++) {
          sum += element.votes[i].length * i;
          count += element.votes[i].length;
        }
        average = Math.round(sum / count * 10) / 10 || 0;
        if (average > res) {
          res = average;
        }
        if (res == 5) {
          return res;
        }
      });
      return res;
    }
  }

  getWorstAverageScore(voteList) {
    if (voteList != undefined) {
      let res = 5;
      let sum;
      let count;
      let average;
      voteList.forEach((element) => {
        sum = 0;
        count = 0;
        for (let i = 1; i < 6; i++) {
          sum += element.votes[i].length * i;
          count += element.votes[i].length;
        }
        average = Math.round(sum / count * 10) / 10 || 0;
        if (average != 0 && average < res) {
          res = average;
        }
        if (res == 1) {
          return res;
        }
      });
      return res;
    }
  }

  getMostRecentMood(voteList, i: number) { // i = score
    if (voteList != undefined) {
      let res = "Date not found";
      voteList.slice().forEach((element) => {
        if (i == this.getAverageScore([element])) {
          res = element.date;
        }
      });
      return res;
    }
  }

  getAverageScore_Rounded(voteList) {
    return Math.round(this.getAverageScore(voteList));
  }

  getBestAverageScore_Rounded(voteList) {
    return Math.round(this.getBestAverageScore(voteList));
  }

  getWorstAverageScore_Rounded(voteList) {
    return Math.round(this.getWorstAverageScore(voteList));
  }

  // Format votes and comments
  formatData(votes: { _id: string, channelId: string, status: number, time: Date, userId: string }[], comments) {
    let dates = [];
    if (this.period == "global") {
      let tmp = _.uniq(votes.slice().reverse(), (e) => { return e.userId });  // Unique userId
      let tmp2 = _.groupBy(tmp, (e) => { return e.status });          // Group by status  
      let arrFlatten = [];
      _.each(tmp2, function (e, index) {
        arrFlatten[index] = e;
      });

      dates.push({
        date: this.timeStart,
        format: "global",
        votes: arrFlatten,
        comments: comments
      });
    } else if (this.period == "day") {
      let startDate = moment(this.timeStart).clone().startOf('day');
      let endDate = moment(this.timeEnd).clone().startOf('day');

      while (startDate.diff(endDate) < 1) {
        dates.push({
          date: startDate.clone().toDate(), // A day
          votes: [],                      // Votes that day
          comments: []
        });
        startDate.add(1, 'd');                // Adding one day
      }
      let votesCursor = 0;
      let commentsCursor = 0;
      dates.forEach((element) => {
        while (votesCursor < votes.length && moment(element.date).diff(moment(votes[votesCursor].time).startOf('day')) == 0) {
          element.votes.push(votes[votesCursor]);
          votesCursor++;
        }

        while (commentsCursor < comments.length && moment(element.date).diff(moment(comments[commentsCursor].time).startOf('day')) == 0) {
          element.comments.push(comments[commentsCursor]);
          commentsCursor++;
        }
      });

      let res = [];
      dates.forEach((element) => {
        let tmp = _.uniq(element.votes.reverse(), (e: Vote) => { return e.userId });
        let tmp2 = _.groupBy(tmp, (e) => { return e.status });
        let arrFlatten = [];
        _.each(tmp2, function (e, index) {
          arrFlatten[index] = e;
        });
        res.push({
          date: element.date,
          format: 'day',
          votes: arrFlatten,
          comments: element.comments
        });
      });
      dates = res;
    } else if (this.period == "week") {
      let startDate = moment(this.timeStart).clone().startOf('week');
      let endDate = moment(this.timeEnd).clone().startOf('week');

      while (startDate.isoWeeks() <= endDate.isoWeeks()) {
        dates.push({
          date: startDate.clone().add(1, 'd').toDate(), // Starting day of the week, moment set it to sunday so we change it to monday
          votes: [],                                     // Votes that week
          comments: []
        });
        startDate.add(1, 'w');                            // Adding one week
      }

      let votesCursor = 0;
      let commentsCursor = 0;
      dates.forEach((element) => {
        while (votesCursor < votes.length && moment(element.date).startOf('week').diff(moment(votes[votesCursor].time).startOf('week')) == 0) {
          element.votes.push(votes[votesCursor]);
          votesCursor++;
        }

        while (commentsCursor < comments.length && moment(element.date).startOf('week').diff(moment(comments[commentsCursor].time).startOf('week')) == 0) {
          element.comments.push(comments[commentsCursor]);
          commentsCursor++;
        }
      });

      let res = [];
      dates.forEach((element) => {
        let tmp = _.uniq(element.votes.reverse(), (e: Vote) => { return e.userId });
        let tmp2 = _.groupBy(tmp, (e) => { return e.status });
        let arrFlatten = [];
        _.each(tmp2, function (e, index) {
          arrFlatten[index] = e;
        });
        res.push({
          date: element.date,
          format: 'week',
          votes: arrFlatten,
          comments: element.comments
        });
      });
      dates = res;
    } else if (this.period == "month") {
      let startDate = moment(this.timeStart).clone().startOf('month');
      let endDate = moment(this.timeEnd).clone().startOf('month');
      while (startDate.month() <= endDate.month()) {
        dates.push({
          date: startDate.clone().toDate(),               // Starting day of the month
          votes: [],                                       // Votes that month
          comments: []
        });
        startDate.add(1, 'month');                          // Adding one month
      }

      let votesCursor = 0;
      let commentsCursor = 0;
      dates.forEach((element) => {
        while (votesCursor < votes.length && moment(element.date).startOf('month').diff(moment(votes[votesCursor].time).startOf('month')) == 0) {
          element.votes.push(votes[votesCursor]);
          votesCursor++;
        }

        while (commentsCursor < comments.length && moment(element.date).startOf('month').diff(moment(comments[commentsCursor].time).startOf('month')) == 0) {
          element.comments.push(comments[commentsCursor]);
          commentsCursor++;
        }
      });

      let res = [];
      dates.forEach((element) => {
        let tmp = _.uniq(element.votes.reverse(), (e: Vote) => { return e.userId });
        let tmp2 = _.groupBy(tmp, (e) => { return e.status });
        let arrFlatten = [];
        _.each(tmp2, function (e, index) {
          arrFlatten[index] = e;
        });
        res.push({
          date: element.date,
          format: 'month',
          votes: arrFlatten,
          comments: element.comments
        });
      });
      dates = res;
    }

    // Filling with empty arrays for ngFor
    let max = 0;
    this.commentList = [];
    dates.forEach((element) => {
      for (let i = 0; i < 6; i++) {
        if (element.votes[i] == undefined) {
          element.votes[i] = [];
        }
        if (element.votes[i].length > max) {
          max = element.votes[i].length;
        }
      }

      element.votes[0] = max; // get the max vote count
      this.commentList.push(false);   // Comments are not shown
    });
    this.voteList = dates.reverse();
  }

  getSmiley(i: number) {
    let smiley: String;
    if (i == 1) {
      smiley = ":(";
    } else if (i == 2) {
      smiley = ":/";
    } else if (i == 3) {
      smiley = ":|";
    } else if (i == 4) {
      smiley = ":)";
    } else if (i == 5) {
      smiley = ":D";
    }
    return smiley;
  }

  getSmileyBgColor(i: number) {
    let color: String;
    if (i == 1) {
      color = "#8c3b5d";
    } else if (i == 2) {
      color = "#ff7b00";
    } else if (i == 3) {
      color = "#f1c500";
    } else if (i == 4) {
      color = "#5b90e5";
    } else if (i == 5) {
      color = "#1fbc99";
    }
    return color;
  }

  buildPieChart(seriesData) {
    this.data = {
      chart: {
        type: 'pie'
      },
      title: {
        text: this.channelTitle
      },
      tooltip: {
        pointFormat: '{series.name} <b>{point.percentage:.1f}%</b><br>quantity: <b>{point.y}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> - {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'percentage',
        colorByPoint: true,
        data: seriesData
      }]
    };
  }

  verifyChannel(channelId) {
    this.channelsService.getChannel(channelId).subscribe(
      data => {
        if (data == null) {
          this.errorId();
        } else {
          this.channelTitle = data.title;
        }
      },
      error => {
        this.errorId();
      }
    );
  }

  // Bad channelId
  errorId() {
    console.log('Error with channelId')
    console.log('Redirecting...');
    this.router.navigate(['/404']); // Or redirect to index ['/']
  }
}
