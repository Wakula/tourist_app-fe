import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'touristfe';

  constructor() { }

  private setSessionListener(){
    window.addEventListener('storage', (event) => {
      if(event.key == 'sessionId') {
        window.location.reload();
      }
    }, false);
  }

  ngOnInit() {
    this.setSessionListener();
  }
}
