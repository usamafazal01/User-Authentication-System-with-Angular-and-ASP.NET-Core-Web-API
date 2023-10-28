import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized.');
    // Start session check when the component is initialized.
    this.sessionService.startSessionCheck();
  }
}
