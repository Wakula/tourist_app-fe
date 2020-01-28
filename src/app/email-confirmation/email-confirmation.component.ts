import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'

import {UserService} from '../_services/user.service'


@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      userService.uuidConfirmation(params.uuid).subscribe()
    })
  }

  ngOnInit() {
  }

}
