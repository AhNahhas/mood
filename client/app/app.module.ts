import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChartsComponent } from './components/charts/charts.component';
import { VoteComponent } from './components/vote/vote.component';
import { PageNotFoundComponent } from './components/pageNotFound/pageNotFound.component';
import { ChartModule } from 'angular2-highcharts';


const appRoutes: Routes = [
  { path: '', component: ChannelsComponent },
  { path: 'chart/:id', component: ChartsComponent },
  { path: 'v/:id', component: VoteComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, RouterModule.forRoot(appRoutes), ChartModule],
  declarations: [AppComponent, ChannelsComponent, VoteComponent, PageNotFoundComponent, ChartsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
