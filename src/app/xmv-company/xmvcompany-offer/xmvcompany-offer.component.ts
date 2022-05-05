import { Component, OnInit,  Input, Output,EventEmitter } from '@angular/core';

import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-xmvcompany-offer',
  templateUrl: './xmvcompany-offer.component.html',
  styleUrls: ['./xmvcompany-offer.component.css']
})
export class XMVCompanyOfferComponent implements OnInit {

  @Input() GoToContact: number=0;
  @Output() my_output1= new EventEmitter<number>();


  constructor(

    private elementRef: ElementRef, 
    private scroller: ViewportScroller,
    ) {}

  ngOnInit(): void {
  }

goDown1(event:string){
  this.scroller.scrollToAnchor(event);
}
  
/****
 * Other Methods to scroll in HTML page
 * 
 * 
  goDown2() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById("targetGreen").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  goDown3() {
    this.router.navigate([], { fragment: "targetBlue" });
  }
 * 
 * 
 */


  Display_Contact(){
    // this.router.navigateByUrl('Contact');
    this.my_output1.emit(1);
 }
}
