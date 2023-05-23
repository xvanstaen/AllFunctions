import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Directive, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { Router, RouterModule, NavigationStart, ActivatedRoute, ParamMap } from '@angular/router';
import { Event as NavigationEvent } from "@angular/router";
import { filter, map } from "rxjs/operators";



@Component({
  selector: 'app-rootBIS',
  templateUrl: './app.BIS.component.html',
  styleUrls: ['./app.BIS.component.css']
})
export class AppComponent {
  title = 'XMVWebSiteRef';
  @ViewChild('titleContainer', { static: true })
 
  myTypeRoute:number=0;
  myRoutingTable:Array<any>=[
    {Route:'myRouting'},
    {Route:'myKEHP'},
    {Route:'myColorPicker'},
    {Route:'myColorSlider'},
    {Route:'myColorPalette'},
    {Route:'myXMVcompany'},
    {Route:'IntlPhoneNb'},
    {Route:'TopicURL'},
    {Route:'Contact'},
    {Route:'MyCanvas'},
    {Route:'MyLogin'},
    {Route:'myFitnessStat'},
 
    ];


  constructor(
    public matDialog: MatDialog,
    private router:Router,
    private myroute:ActivatedRoute,
    private renderer:Renderer2,
    private elRef:ElementRef,
    private browserLocation:Location,
    private SLocation:LocationStrategy ){

      router.events
			.pipe(
				// The "events" stream contains all the navigation events. The NavigationStart event contains
				// information about what initiated the navigation sequence.
        filter((event): event is NavigationStart => event instanceof NavigationStart)
    )
			.subscribe(
				( event: NavigationStart ) => {
          
					//console.group( "Group NavigationStart Event === " );
					//console.log( "navigation id:", event.id );
					//console.log( "route:", event.url );
					//console.log( "trigger:", event.navigationTrigger );
          
         if (event.id>1 && event.url!=='/myKEHP' && event.url!=='/myRouting' && event.url!=='/myColorPicker'
         && event.url!=='/myColorSlider' && event.url!=='/myColorPalette' && event.url!=='/myXMVcompany'
         && event.url!=='/IntlPhoneNb' && event.url!=='/TopicURL' && event.url!=='/Contact'  && event.url!=='/MyCanvas'
         && event.url!=='/MyLogin'  && event.url!=='/myFitnessStat' 
         ) {
           
           this.myTypeRoute=1;
           this.Route_Other();

         } else if (event.navigationTrigger==='popstate'){ 
              if (event.url==='/myKEHP'){  
                  
                  this.myTypeRoute=1;
                  // this.Route_KEHP(); 
              } else if (event.url==='/myColorPicker'){  
                this.myTypeRoute=2;
               
                } else if (event.url==='/myColorSlider'){  
                  this.myTypeRoute=3
                  
                  } else if (event.url==='/myColorPalette'){  
                    this.myTypeRoute=4;
                    
                  } else if (event.url==='/myXMVcompany'){  
                    this.myTypeRoute=5;
                  } else if (event.url==='/IntlPhoneNb'){  
                    this.myTypeRoute=6;
                  } else if (event.url==='/TopicURL'){  
                    this.myTypeRoute=7;
                  } else if (event.url==='/Contact'){  
                    this.myTypeRoute=8;
                  } else if (event.url==='/MyCanvas'){  
                    this.myTypeRoute=9;
                  } else if (event.url==='/MyLogin'){  
                    this.myTypeRoute=10;
                  } else if (event.url==='/myFitnessStat'){  
                    this.myTypeRoute=11;
                    } else  {
                        this.myTypeRoute=0;
                        
                        // this.Route_Other();
                  
                      } 
            } 

          // console.groupEnd();
				});
    }

  ngOnInit(){
    //console.log('ngOnInit app.component');
    
    // convert to [5] to display XMV Company 
    if (!this.myTypeRoute){
      this.router.navigateByUrl(this.myRoutingTable[0].Route);
  
    }
    else{
      this.router.navigateByUrl(this.myRoutingTable[this.myTypeRoute].Route);
    }

  }
 
  Route_KEHP(){
    // route to my KE Home Page
    console.log('Route_KEHP');
    this.router.navigateByUrl('myKEHP');
  }

  Route_Other(){
    // route to my specific Routing module
    console.log('Route_Other');
    this.router.navigateByUrl('myRouting');
  }                                                                                                                  
  Route_ColorPicker(){
    // route to my specific Routing module
    console.log('Color_Picker');
    this.router.navigateByUrl('myColorPicker');
  }                   
}

