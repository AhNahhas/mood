import { Component } from '@angular/core';
import { ChannelsService } from './services/channels.service';
import { VotesService } from './services/votes.service';
@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers: [ChannelsService, VotesService]
})
export class AppComponent {
}
