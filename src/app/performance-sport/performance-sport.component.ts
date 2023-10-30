import { Component, OnInit , Input, Output, HostListener,  OnDestroy, HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject} from '@angular/core';
  
import { DatePipe, formatDate } from '@angular/common'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, UntypedFormControl,FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';



import {msginLogConsole} from '../consoleLog'
import { configServer, LoginIdentif, OneBucketInfo, classPointOfRef, msgConsole, classCredentials } from '../JsonServerClass';
import { classGarminGoldenCheetah } from '../classGarminGoldenCheetah';

import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';


@Component({
  selector: 'app-performance-sport',
  templateUrl: './performance-sport.component.html',
  styleUrls: ['./performance-sport.component.css']
})
export class PerformanceSportComponent {


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private datePipe: DatePipe,
    ) { }

    @Output() newCredentials= new EventEmitter<any>();
    @Output() returnFile= new EventEmitter<any>();
    @Output() resetServer= new EventEmitter<any>();

    @Input() configServer = new configServer;
    @Input() identification= new LoginIdentif;

    tabPoR:Array<classPointOfRef>=[];

    cheetahRecord = new classGarminGoldenCheetah;

    EventHTTPReceived:Array<boolean>=[];
    maxEventHTTPrequest:number=20;
    idAnimation:Array<number>=[];
    TabLoop:Array<number>=[];
    NbWaitHTTP:number=0;

    errorMessage:string="";
  
    NbRefreshBucket:number=0;
    bucketName:string="";
    retrieveListObject:boolean=false;

    SelectedBucketInfo=new OneBucketInfo;
    //theReceivedData:any;
    isDataReceived:boolean=false;

    TabBuckets=[{name:''}];

    formOptions: FormGroup = new FormGroup({ 
      seconds: new FormControl(800, { nonNullable: true }),
      meters: new FormControl(500, { nonNullable: true }),
      fileName: new FormControl("", { nonNullable: true }),
    })
    NbRefresh_Bucket=0;

    istabPointOfRef:boolean=false;
    isManagePointOfRef:boolean=false;
    isConfirmSave:boolean=false;

ngOnInit(){

  this.bucketName=this.identification.performanceSport.bucket;


}
/***
specificGet(){ // may be rejected because no access to public in Google cloud
  this.http.get(this.SelectedBucketInfo.mediaLink).subscribe((res:any)=>{
    const theData=res;
  },
  theErr => {
    console.log(theErr);
  });
}
 */

BucketInfo(event:any){
  this.SelectedBucketInfo=event;
  this.formOptions.controls["fileName"].setValue(this.SelectedBucketInfo.name);
 
  //this.specificGet();
  /*
  this.ManageGoogleService.getTextObject(this.configServer, this.bucketName, this.SelectedBucketInfo.name )
    .subscribe((data ) => {  
    const myData=data;
    console.log(myData.text);
  },
  err => {
    console.log('error');
  });
 */
}


actionPointOfRef(event:any){
  if (event==="managePoRef"){
    this.isManagePointOfRef=true;
  }  if (event==="cancelPoRef"){
    this.isManagePointOfRef=false;
  } 
}

confirmSave(event:any){
  if (event="confirmSave"){
    this.isConfirmSave=true;
  }
}

perf:Array<any>=[];
//classPerf={time:0,dist:0,speed:0,heart:0,alt:0,lat:0,lon:0,slope:0});
i : number = 0;
lastOccurrence:number=0;
ReceivedData(event:any){
    //this.theReceivedData=event;
    const stringNumber="0123456789.";
    this.isPerfProcessCompleted=false;
    this.isDataReceived=true;
    var trouve=false;
    var lengthSec=0;
    var iPerf=0; 
    var j = 0;
    var k = 0;
    var maxFields=3;
    this.perf.splice(0,this.perf.length);
    this.scroller.scrollToAnchor('result');
    if (typeof event==="object" && event.text!==undefined){
        const lengthText=event.text.length;
       
        // test if file contains all columns
        // Time	Distance	Heart rate	Speed	Altitude	Latitude	Longitude	Slope
        const fileType = event.text.indexOf("Altitude"); // if =-1 contains 3 columns only
        const fileRide = event.text.indexOf("RIDE"); // if =-1 contains 3 columns only
        if (fileRide===-1){
          if (fileType!==-1 ){
            maxFields=8;
          }
          
          for (this.i=0; this.i<lengthText && stringNumber.indexOf(event.text.substring(this.i,this.i+1))===-1 ; this.i++){
          }
          // "\t" refers to tabulation
          for (this.i=this.i; this.i<lengthText; this.i++){
            for (j=this.i; j<lengthText && event.text.substring(j,j+1)==="\t"; j++){
              // search first tabulation character
            }
            for (k=j+1; k<lengthText && stringNumber.indexOf(event.text.substring(k,k+1))>-1; k++){
              // search first non tabulation character
            }
            

            iPerf++
            if (iPerf===1){

                this.perf.push({time:0,dist:0,speed:0,heart:0,alt:0,lat:0,lon:0,slope:0});
                
                this.perf[this.perf.length-1].time=Number(event.text.substring(j,k));
            } else if (iPerf===2){
                this.perf[this.perf.length-1].dist=Number(event.text.substring(j,k));
            } else if (iPerf===maxFields){
                    // there is no separation - tabulation - betweeen speed and next sec
                    // each row is +1 sec; start of sec is this.perf[0].time ; most of the time should be 0
                    // next sec = this.perf.length + this.perf[0].time
                    
                    var processSec = true;
                    if ( event.text.substring(k+1,k+2)!=="\t" ){
                      // character is not a tabulation; not a standard text format
                      processSec = false;
                    } 
                    
                    lengthSec=0;

                    if (k<lengthText && processSec === true){
                        trouve=false;
                        for (var z=10; trouve===false; z=z*10){
                          lengthSec++
                          if ((this.perf.length + Number(this.perf[0].time)) < z){
                            trouve=true;
                          } 
                        }
                    }
                    if (fileType===-1){
                      this.perf[this.perf.length-1].speed=Number(event.text.substring(j,k-lengthSec));
                    } else {
                      this.perf[this.perf.length-1].slope=Number(event.text.substring(j,k-lengthSec));
                    }
                    
                    if (processSec === true){
                      if (k<lengthText){

                        this.perf.push({time:0,dist:0,speed:0,heart:0,alt:0,lat:0,lon:0,slope:0});
                        this.perf[this.perf.length-1].time=this.perf.length - 1 + Number(this.perf[0].time);
                      }
                      iPerf=1;
                    } else {
                      iPerf=0;
                    }
    
            } else if (fileType!==-1) { // 
                if (iPerf===3){
                  this.perf[this.perf.length-1].heart=Number(event.text.substring(j,k));
                } else if (iPerf===4){
                  this.perf[this.perf.length-1].speed=Number(event.text.substring(j,k));
                } else if (iPerf===5){
                  this.perf[this.perf.length-1].alt=Number(event.text.substring(j,k));
                } else if (iPerf===6){
                  this.perf[this.perf.length-1].lat=Number(event.text.substring(j,k));
                } else if (iPerf===7){
                  this.perf[this.perf.length-1].lon=Number(event.text.substring(j,k));
                } 
              }
            this.i=k;
          }
        } else { // fileRide !== -1 which means it is a "RIDE" record
          this.myString = event.text.substring(fileRide);
          
          for (j=0; this.myString.length > 60; j++){
            this.perf.push({time:0,dist:0,speed:0,heart:0,alt:0,lat:0,lon:0,slope:0});
            this.perf[this.perf.length-1].time=this.fillPerf(0,',');
            this.perf[this.perf.length-1].dist=this.fillPerf(1,',');
            this.perf[this.perf.length-1].speed=this.fillPerf(2,',');
            this.perf[this.perf.length-1].heart=this.fillPerf(3,',');
            this.perf[this.perf.length-1].alt=this.fillPerf(4,',');
            this.perf[this.perf.length-1].lat=this.fillPerf(5,',');
            this.perf[this.perf.length-1].lon=this.fillPerf(6,',');
            this.perf[this.perf.length-1].slope=this.fillPerf(7,'}');
          }
          console.log('length myString=' + this.myString.length +   'myStr='+this.myString);
          console.log('last record : j=' + j + "  data is " + JSON.stringify(this.perf[this.perf.length-1]));
        
        
        }
   
    } else if (Array.isArray(event) && event[0].speed!==undefined){
        for (j=0; j<event.length; j++){
          this.perf.push({time:0,dist:0,speed:0,heart:0,alt:0,lat:0,lon:0,slope:0});
          if (event[j].sec!==undefined){
            this.perf[j].time=event[j].sec;
          } else if (event[j].time!==undefined){
            this.perf[j].time=event[j].time;
          }
          this.perf[j].dist=event[j].dist;
          this.perf[j].speed=event[j].speed;
          if (event[j].heart!==undefined) {
            this.perf[j].heart=event[j].heart;
          }
          if (event[j].heart!==undefined) {
            this.perf[j].speed=event[j].speed;
          }
          if (event[j].alt!==undefined) {
            this.perf[j].alt=event[j].alt;
          }
          if (event[j].lat!==undefined) {
            this.perf[j].lat=event[j].lat;
          }
          if (event[j].lon!==undefined) {
            this.perf[j].lon=event[j].lon;
          }
          if (event[j].slope!==undefined) {
            this.perf[j].slope=event[j].slope;
          }
        }
    }

    var k=0;
    this.errorMessage="";
    for (var i=0; i<this.perf.length; i++){
        for (j=0; j<this.perf.length && this.perf[j].lon!==0; j++){}
        k=0;
        if (j<this.perf.length){
          for ( k=j+1; k<this.perf.length && this.perf[k].lon===0; k++){}
          if (k<this.perf.length){
              this.newFillLatLon(j,k);
          } else { 
            this.errorMessage = "LAT & LON are nil and cannot be updated";
          }
          
        }
        if (k===0){
          i=j;
        } else {
          i=k;
        }
      }




    this.lastOccurrence=this.perf.length-1;
    if ( this.perf.length===0){
      this.errorMsg = this.errorMsg + "  file perf is empty - check the problem";
    } else {
      this.isFileProcessed=true;
    }
    
  }

  isFileProcessed:boolean=false;

  errorMsg:string="";
  checkOptions(){
    this.errorMsg="";
    if (isNaN(this.formOptions.controls['seconds'].value)){
      this.errorMsg='enter a numeric value for seconds';
    } else if (isNaN(this.formOptions.controls['meters'].value)){
      this.errorMsg='enter a numeric value for meters';
    }
    if (this.errorMsg==='' && this.perf.length>0){
      this.performancePerSec();
    } else if ( this.perf.length===0){
      this.errorMsg = this.errorMsg + "  file perf is empty - check the problem";
    }

  }

myString:string="";
fillPerf(iRecord:number, specChar:string){
  const tabRecord=['"SECS":','"KM":','"KPH":','"HR":','"ALT":','"LAT":','"LON":','"SLOPE":'];
  var myNb=0;
  const iFind = this.myString.indexOf((tabRecord[iRecord]));
  this.myString = this.myString.substring( iFind + tabRecord[iRecord].length);
  var theComa=this.myString.indexOf(specChar);
  if (theComa!==-1){
    myNb=Number(this.myString.substring(0,theComa));
  } else if (theComa===-1 && tabRecord[iRecord]==='"SECS":'){
    myNb=-1;
  } 
  return (myNb);
}

fillLatLon(startR:number,endR:number ){
  var tabDic:Array<any>=[];

  var totalRow=endR - startR +1;
  var k=1;

  tabDic[k]=Math.trunc(totalRow/2);
  this.perf[startR+tabDic[k]].lat = (this.perf[endR+1].lat + this.perf[startR-1].lat)/2;
  this.perf[startR+tabDic[k]].lon = (this.perf[endR+1].lon + this.perf[startR-1].lon)/2;

  var refRow=tabDic[k];
  for (var i=0; i<totalRow; i++){
    refRow=Math.trunc(refRow/2);
    var endLoop=false;
    k++;
    tabDic[k]=refRow;
    if (this.perf[startR+tabDic[k]].lat===0){
      for (var l=startR+tabDic[k]-1; l>startR-2 && this.perf[l].lat===0; l--){};
      for (var m=startR+tabDic[k]+1; m<endR+2 && this.perf[m].lat===0; m++){};
      this.perf[startR+tabDic[k]].lat = (this.perf[m].lat + this.perf[l].lat)/2;
      this.perf[startR+tabDic[k]].lon = (this.perf[m].lon + this.perf[l].lon)/2;
    }
    

    
    for (var j= 3; endLoop===false; j++){
      if (refRow * j<totalRow){
        k++;
        tabDic[k]=refRow * j;
        if (this.perf[startR+tabDic[k]].lat===0){
          for (var l=startR+tabDic[k]-1; l>startR-2 && this.perf[l].lat===0; l--){};
          for (var m=startR+tabDic[k]+1; m<endR+2 && this.perf[m].lat===0; m++){};
          this.perf[startR+tabDic[k]].lat = (this.perf[m].lat + this.perf[l].lat)/2;
          this.perf[startR+tabDic[k]].lon = (this.perf[m].lon + this.perf[l].lon)/2;
        }
      } else {endLoop=true}
    }
    if (refRow===2){
      i=totalRow+1;
    }
     console.log('end dichotomie');
  }

  for (var i=startR; i<endR+1; i++){
      if (this.perf[i].lat === 0){
          for (var l=i-1; l>startR-2 && this.perf[l].lat===0; l--){};
          for (var n=i+1; n<endR+2 && this.perf[n].lat===0; n++){};
          this.perf[i].lat = (this.perf[n].lat + this.perf[l].lat)/2;
          this.perf[i].lon = (this.perf[n].lon + this.perf[l].lon)/2;
      }
  }
}


newFillLatLon(startR:number,endR:number){
var primeTabDic=[];

var firstRowRef=startR-1;
var lastRowRef=endR+1;

var tabTest:Array<any>=[]
  
var iPrimeDic=-1;


var midRowRef=0;
const  refValue=(lastRowRef - firstRowRef + 1) + 20; // buffer - used to avoid any loop
var secureValue = 0;
var trouve =false;


iPrimeDic=0;
primeTabDic[iPrimeDic]=lastRowRef;
iPrimeDic++;
primeTabDic[iPrimeDic]=firstRowRef;


    trouve=false;
    firstRowRef=primeTabDic[iPrimeDic];
    lastRowRef=primeTabDic[iPrimeDic-1];
    while (trouve === false && secureValue < refValue && iPrimeDic>-1){
          secureValue++

          if (iPrimeDic<1){ /**/
            trouve=true; 
            primeTabDic.splice(0,primeTabDic.length);
            iPrimeDic=-1;
            
          } else {
            if (iPrimeDic>1 && midRowRef === firstRowRef){/**/
              primeTabDic.splice(iPrimeDic,1);
              iPrimeDic--
              if (iPrimeDic>0){
                firstRowRef=primeTabDic[iPrimeDic];
                lastRowRef=primeTabDic[iPrimeDic-1];
                midRowRef=Math.trunc((lastRowRef + firstRowRef)/2) ;
              } else  {
                primeTabDic.splice(0,primeTabDic.length);
                iPrimeDic=-1;
                midRowRef=0;
                trouve=true;
              }
            } else {
              firstRowRef=primeTabDic[iPrimeDic];
              lastRowRef=primeTabDic[iPrimeDic-1];
              midRowRef=Math.trunc((lastRowRef + firstRowRef)/2) ;
            }
            if (this.perf[midRowRef].lat===0 && iPrimeDic!==-1){
              this.perf[midRowRef].lat = (this.perf[lastRowRef].lat + this.perf[firstRowRef].lat)/2;
              this.perf[midRowRef].lon = (this.perf[lastRowRef].lon + this.perf[firstRowRef].lon)/2;
        
              /** to be deleted after testing  */
              tabTest.push({"row":0,"lat":0,"lon":0});
              tabTest[tabTest.length-1].row=midRowRef;
              tabTest[tabTest.length-1].lat=this.perf[midRowRef].lat;
              tabTest[tabTest.length-1].lon=this.perf[midRowRef].lon;
              // lastRowRef=midRowRef;
              if (midRowRef === primeTabDic[iPrimeDic] + 1 && midRowRef === primeTabDic[iPrimeDic-1] - 1){
                  primeTabDic.splice(iPrimeDic,1);
                  iPrimeDic--
              } else

              if (midRowRef > firstRowRef - 1){
                  iPrimeDic++
                  if (midRowRef>primeTabDic[iPrimeDic-1]){
                    primeTabDic[iPrimeDic]=primeTabDic[iPrimeDic-1];
                    primeTabDic[iPrimeDic-1]=midRowRef;
                  } else {
                    primeTabDic[iPrimeDic]=midRowRef;
                  }
                  
              } else if (midRowRef > primeTabDic[iPrimeDic - 1] + 1){
                  primeTabDic[iPrimeDic]=midRowRef;
                  midRowRef=0;
              } else {
                  primeTabDic.splice(iPrimeDic,1);
                  iPrimeDic--
              }
              
              /**************** */
            } else {
              if (iPrimeDic!==-1){
                primeTabDic.splice(iPrimeDic,1);
                iPrimeDic--
                midRowRef=0;
                console.log(' midRow ' + midRowRef + ' was already processed');
              }
            }
            
          }

    }
    console.log('end of the loop');

    
}

  tabSecond:Array<any>=[];
  tabMeter:Array<any>=[];
  alt={lowest:2000,lDist:0,highest:0,hDist:0};
  heart={lowest:200,lDist:0,highest:0,hDist:0};
  speed={highest:0,dist:0}

  isPerfProcessCompleted:boolean=false;
  performancePerSec(){

  this.tabMeter.splice(0,this.tabMeter.length);
  this.tabSecond.splice(0,this.tabSecond.length);

  var distanceK = 0;
  var nbItemsMeter =0;
  var nbItemsSecond =0;
  this.alt.lowest=2000;
  this.alt.lDist=0;
  this.alt.highest=0;
  this.alt.hDist=0;
  this.heart.lowest=2000;
  this.heart.lDist=0;
  this.heart.highest=0;
  this.heart.hDist=0;
  this.speed.highest=0;
  this.speed.dist=0;

  const intervalSec = this.formOptions.controls['seconds'].value
  const intervalDistance = this.formOptions.controls['meters'].value / 1000;
  var iSec = 0;
  var jSec = 0;
  var kSec = 0;
  var kMeter = 0;
  var cumulSec = 0;
  var meterNotManaged = false;

  for (var i=1; i<this.perf.length; i++){

    if (this.perf[i].alt<this.alt.lowest){
      this.alt.lowest=this.perf[i].alt;
      this.alt.lDist=this.perf[i].dist;
    }
    if (this.perf[i].alt>this.alt.highest){
      this.alt.highest=this.perf[i].alt;
      this.alt.hDist=this.perf[i].dist;
    }
    if (this.perf[i].heart<this.heart.lowest){
      this.heart.lowest=this.perf[i].heart;
      this.heart.lDist=this.perf[i].dist;
    }
    if (this.perf[i].heart>this.heart.highest){
      this.heart.highest=this.perf[i].heart;
      this.heart.hDist=this.perf[i].dist;
    }
    if (this.perf[i].speed>this.speed.highest){
      this.speed.highest=this.perf[i].speed;
      this.speed.dist=this.perf[i].dist;
    }


    jSec=jSec+this.perf[i].time - this.perf[i-1].time;
    kMeter++
    meterNotManaged = false;

    if (this.perf[i].dist > intervalDistance * (nbItemsMeter + 1)){
      nbItemsMeter++
      this.tabMeter.push({dist:0,time:0,speed:0,strTime:"",cumulDist:0,cumulTime:"",cumulSpeed:0,cumulStrTime:""});
      this.tabMeter[this.tabMeter.length-1].cumulDist=this.perf[i-1].dist;
      this.tabMeter[this.tabMeter.length-1].cumulTime=this.perf[i-1].time;
      meterNotManaged = true;
    }
    if (jSec === intervalSec){
      nbItemsSecond++
      this.tabSecond.push({dist:0,interval:0,speed:0,cumulDist:0,cumulInterval:0,cumulTime:"",cumulSpeed:0});
      this.tabSecond[this.tabSecond.length-1].cumulDist = this.perf[i].dist;
      this.tabSecond[this.tabSecond.length-1].interval = intervalSec;
      cumulSec = cumulSec + intervalSec;
      jSec = 0;
    } else {
      if (jSec > intervalSec){
 
            kSec = this.perf[i].sec - this.perf[i-1].sec;
            // Distance during kSec
            distanceK = this.perf[i].dist - this.perf[i-1].dist;
            // Distance per second
            distanceK = distanceK / kSec
            
            
            nbItemsSecond = nbItemsSecond + 1
            this.tabSecond.push({dist:0,interval:0,speed:0,cumulDist:0,cumulInterval:0,cumulTime:"",cumulSpeed:0});
            this.tabSecond[this.tabSecond.length-1].cumulDist = this.perf[i-1].dist + ((intervalSec - (jSec - kSec)) * distanceK);
            this.tabSecond[this.tabSecond.length-1].interval = intervalSec;
            cumulSec = cumulSec + intervalSec;
            jSec = jSec - intervalSec
                const ModK = jSec % intervalSec;
                const RoundK = (iSec - ModK) / intervalSec;
                var IK = 0;
                while (IK < RoundK){
                    IK = IK + 1;
                    nbItemsSecond = nbItemsSecond + 1;
                    this.tabSecond.push({dist:0,interval:0,speed:0,cumulDist:0,cumulInterval:0,cumulTime:"",cumulSpeed:0});
                    this.tabSecond[this.tabSecond.length-1].interval = intervalSec;
                    this.tabSecond[this.tabSecond.length-1].cumulDist = this.tabSecond[this.tabSecond.length-2].cumulDist + distanceK * intervalSec;
                    cumulSec = cumulSec + intervalSec;
                  }
 
                jSec = ModK
                cumulSec = cumulSec + ModK
        }
    }
  }
  if (meterNotManaged === false){
      nbItemsMeter++
      this.tabMeter.push({dist:0,time:0,speed:0,strTime:"",cumulDist:0,cumulTime:0,cumulSpeed:0,cumulStrTime:""});
      this.tabMeter[this.tabMeter.length-1].cumulDist=this.perf[i-1].dist;
      this.tabMeter[this.tabMeter.length-1].cumulTime=this.perf[i-1].time;
  }

  if (jSec > 0){
      nbItemsSecond++
      this.tabSecond.push({dist:0,interval:0,speed:0,cumulDist:0,cumulInterval:0,cumulTime:"",cumulSpeed:0});
      this.tabSecond[this.tabSecond.length-1].cumulDist = this.perf[i-1].dist;
      this.tabSecond[this.tabSecond.length-1].interval = jSec;
  }
    //****************************/
    // complete the process for the display of all data


  //****************************/
  this.tabSecond[0].dist=this.tabSecond[0].cumulDist;
  this.tabSecond[0].speed=this.tabSecond[0].dist * 1000 / this.tabSecond[0].interval * 3.6;
  this.tabSecond[0].cumulInterval=this.tabSecond[0].interval;
  this.tabSecond[0].cumulTime=this.formatHHMNSS(this.tabSecond[0].cumulInterval) ;
  this.tabSecond[0].cumulSpeed=this.tabSecond[0].speed;
  for (var i=1; i<this.tabSecond.length; i++){
    
    this.tabSecond[i].dist=this.tabSecond[i].cumulDist - this.tabSecond[i-1].cumulDist;
    this.tabSecond[i].speed=this.tabSecond[i].dist * 1000 / this.tabSecond[i].interval * 3.6;

    this.tabSecond[i].cumulInterval=this.tabSecond[i].interval + this.tabSecond[i-1].cumulInterval;

    this.tabSecond[i].cumulTime=this.formatHHMNSS(this.tabSecond[i].cumulInterval) ;
    this.tabSecond[i].cumulSpeed=this.tabSecond[i].cumulDist * 1000 / this.tabSecond[i].cumulInterval * 3.6;;

  }
 //****************************/
    this.tabMeter[0].dist=this.tabMeter[0].cumulDist;
    this.tabMeter[0].time=this.tabMeter[0].cumulTime;
    this.tabMeter[0].strTime=this.formatHHMNSS(this.tabMeter[0].time) ;
   
    this.tabMeter[0].speed=Number(this.tabMeter[0].dist)  * 1000 / Number(this.tabMeter[0].time) * 3.6;
    this.tabMeter[0].cumulStrTime=this.tabMeter[0].strTime;
    this.tabMeter[0].cumulSpeed=this.tabMeter[0].speed;
    for (var i=1; i<this.tabMeter.length; i++){
      this.tabMeter[i].dist=this.tabMeter[i].cumulDist - this.tabMeter[i-1].cumulDist;
      this.tabMeter[i].time=this.tabMeter[i].cumulTime - this.tabMeter[i-1].cumulTime;

      this.tabMeter[i].strTime=this.formatHHMNSS(this.tabMeter[i].time) ;
      this.tabMeter[i].speed=Number(this.tabMeter[i].dist)  * 1000 / Number(this.tabMeter[i].time) * 3.6;

      this.tabMeter[i].cumulStrTime=this.formatHHMNSS(this.tabMeter[i].cumulTime) ;
      this.tabMeter[i].cumulSpeed=Number(this.tabMeter[i].cumulDist)  * 1000 / Number(this.tabMeter[i].cumulTime) * 3.6;
    }

    this.scroller.scrollToAnchor('bottomPage');
    this.isPerfProcessCompleted=true;
}

GetRecord(bucketName:string,objectName:string, iWait:number){
  this.errorMessage="";
  this.EventHTTPReceived[iWait]=false;
  this.NbWaitHTTP++;
  this.waitHTTP(this.TabLoop[iWait],30000,iWait);
  this.ManageGoogleService.getContentObject(this.configServer, bucketName, objectName )
      .subscribe((data ) => {  
          if (iWait===0){
          }
      },
      error => {
        this.errorMessage='failure to get record ' + objectName +' ;  error = '+ JSON.stringify(error);
        console.log(this.errorMessage);
      })
}


formatHHMNSS(theTime:number){
  const hh =  Math.trunc(theTime  / 3600);
  const MODmn = theTime % 3600;
  const mn =  Math.trunc(MODmn / 60);
  const sec = MODmn % 60;
  var strHH="";
  var strMN="";
  var strSEC="";
  if (hh<10){
    strHH="0"+hh.toString();
  } else {
    strHH=hh.toString();
  }
  if (mn<10){
    strMN="0"+mn.toString();
  } else {
    strMN=mn.toString();
  }
  if (sec<10){
    strSEC="0"+sec.toString();
  } else {
    strSEC=sec.toString();
  }

  return (strHH+":"+strMN+":"+strSEC) ;
}

getBucket(){
  this.errorMessage="";
  this.ManageGoogleService.getListBuckets(this.configServer)
    .subscribe(
      data => {
        console.log('successful retrieval of list of buckets ');
        this.TabBuckets =data;
      },
      error => {
        this.errorMessage='failure to get list of buckets ;  error = '+ error;
        console.log(this.errorMessage);
       
      });
}

cancelFile(){
  this.isConfirmSave=false;
}

saveFile(){
  this.errorMessage='';
  // const fileName =this.formOptions.controls["fileName"].value;
  var file=new File ([JSON.stringify(this.perf)], this.formOptions.controls["fileName"].value, {type: 'application/json'});
 
  this.ManageGoogleService.uploadObject(this.configServer, this.identification.performanceSport.bucket, file , this.formOptions.controls["fileName"].value)
    .subscribe(
      res => {
        if (res.type===4){ 
          this.errorMessage="file " + this.formOptions.controls["fileName"].value + " has been successfully saved"
          this.isConfirmSave=false;
        }
      }, 
      err => {
        this.errorMessage='failure to get record ' + this.formOptions.controls["fileName"].value + ' ;  error = '+ JSON.stringify(err);
        console.log(this.errorMessage);
      })
}

waitHTTP(loop:number, maxloop:number, eventNb:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('waitHTTP ==> loop=' + loop + ' maxloop=' + maxloop);
  }
 loop++
  
  this.idAnimation[eventNb]=window.requestAnimationFrame(() => this.waitHTTP(loop, maxloop, eventNb));
  if (loop>maxloop || this.EventHTTPReceived[eventNb]===true ){
            console.log('exit waitHTTP ==> loop=' + loop + ' maxloop=' + maxloop + ' this.EventHTTPReceived=' + 
                    this.EventHTTPReceived[eventNb] );
            if (this.EventHTTPReceived[eventNb]===true ){
                    window.cancelAnimationFrame(this.idAnimation[eventNb]);
            }    
      }  
  }


}
