import { Component, OnInit, ElementRef, AfterViewInit, Input } from '@angular/core';
import { Review } from '../review';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit { 

  @Input() reviews: Review[];
  @Input() loading: boolean;

  constructor(
    private router: Router,
    ) { }

  ngOnInit(): void {
    //(<any>window).reviewList = this;
  }

  // ngAfterViewInit(): void {
  //   const tree = this.router.parseUrl(this.router.url);
  //   if (tree.fragment) {
  //     const frag = tree.fragment;
  //     const element = document.getElementById(frag);
  //     console.log(element);
  //     // Cant seem to find element
  //   }
  // }

}
