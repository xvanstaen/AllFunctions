
import { Component, HostListener, OnInit, OnChanges, ChangeDetectorRef, AfterViewChecked } from '@angular/core';


import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-xmv-company',
  templateUrl: './xmv-company.component.html',
  styleUrls: ['./xmv-company.component.css']
})
export class XmvCompanyComponent implements OnInit, OnChanges, AfterViewChecked {

  constructor(

    private http: HttpClient, 
    private cdref: ChangeDetectorRef
    ) {}
  
  redisplay_profile:number=0;

  display_GoToContact:number=0;
  display_GoToOffer:number=0;
  getScreenWidth: any;
  getScreenHeight: any;
  device_type:string='';

  
  i_Profile:number=0;
  i_Offer:number=1;
  i_Contact:number=2;
  i_HomePage:number=3;
  i_Others:number=4;
  Profile:string="Profile";
  Offer:string="Offer";
  Contact:string="Contact";
  HomePage:string="HomePage";
  Others:string="Others";
  i_table:number=0;
  Display_Table:Array<any>=[
    {type:'', display:false}, 
    {type:'', display:false}, 
    {type:'', display:false}, 
    {type:'', display:false},
    {type:'', display:false}, 

  ];

  ngOnInit(): void {
    this.i_table=this.i_HomePage;
    this.Display_Table[this.i_table].display=true;
    this.Display_Table[this.i_Profile].type=this.Profile;
    this.Display_Table[this.i_Offer].type=this.Offer;
    this.Display_Table[this.i_Contact].type=this.Contact;
    this.Display_Table[this.i_HomePage].type=this.HomePage;
    this.Display_Table[this.i_Others].type=this.Others;
    
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.device_type = navigator.userAgent;
    this.device_type = this.device_type.substring(10, 48);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  Display_Profile(){
    this.redisplay_profile++;
    this.Display_Table[this.i_table].display=false;
    this.i_table=this.i_Profile;
    this.Display_Table[this.i_table].display=true;
  }

  Reset(event:number){
    this.redisplay_profile=1;
  }

  Display_Contact(){
     this.Display_Table[this.i_table].display=false;
    this.i_table=this.i_Contact;
     this.Display_Table[this.i_table].display=true;
  }

  Display_Offer(){
     this.Display_Table[this.i_table].display=false;
    this.i_table=this.i_Offer;
     this.Display_Table[this.i_table].display=true;
  }

  Display_Others(){
     this.Display_Table[this.i_table].display=false;
    this.i_table=this.i_Others;
     this.Display_Table[this.i_table].display=true;
  }

  Display_HomePage(){
     this.Display_Table[this.i_table].display=false;
    this.i_table=this.i_HomePage;
     this.Display_Table[this.i_table].display=true;
  }
  
  BackTo(event:any){
 
  }

  TopicURL(){

  }
  ngOnChanges(){
    console.log('on changes');
  }

  ngAfterViewChecked(){
    this.cdref.detectChanges();
    // console.log('cdref',this.cdref.detectChanges());
  }

}

