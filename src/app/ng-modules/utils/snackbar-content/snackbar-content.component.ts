import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar-content',
  templateUrl: './snackbar-content.component.html',
  styleUrls: ['./snackbar-content.component.sass']
})
export class SnackbarContentComponent implements OnInit {

  message?:any;
  constructor() { }

  ngOnInit(): void {
  }

}
