import { Component, OnInit , Input, Output, HostListener,  OnDestroy, HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject} from '@angular/core';
  
import { DatePipe, formatDate } from '@angular/common'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, UntypedFormControl,FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';

import {msginLogConsole} from '../consoleLog'
import { configServer, LoginIdentif, OneBucketInfo, classPointOfRef, classCircuitRec, msgConsole, classCredentials } from '../JsonServerClass';
import { findIds } from '../MyStdFunctions';

import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';

@Component({
  selector: 'app-manage-circuits',
  templateUrl: './manage-circuits.component.html',
  styleUrls: ['./manage-circuits.component.css']
})
export class ManageCircuitsComponent {


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private datePipe: DatePipe,
    ) { }

    @Output() newCredentials= new EventEmitter<any>();
    @Output() resetServer= new EventEmitter<any>();

    @Input() configServer = new configServer;
    @Input() identification= new LoginIdentif;

    tabPoR:Array<classPointOfRef>=[];
    selectedPoint= new classPointOfRef;

    isCircuitSelected:boolean=true;

    tabCircuit:Array<any>=[];
    
    fileCircuit:Array<classCircuitRec>=[];

    EventHTTPReceived:Array<boolean>=[];
    maxEventHTTPrequest:number=20;
    idAnimation:Array<number>=[];
    TabLoop:Array<number>=[];
    NbWaitHTTP:number=0;

    errorMessage:string="";
  
    formOptions: FormGroup = new FormGroup({ 
      pointRef: new FormControl("", { nonNullable: true }),
      lat: new FormControl(0, { nonNullable: true }),
      lgt: new FormControl(0, { nonNullable: true }),
      fileName: new FormControl("", { nonNullable: true }),
    })

    istabPointOfRef:boolean=false;
    tabAction=["Cancel","Add before","Add after","Delete"];
    tabActionH=["Cancel","Add before","Add after","Delete","Zoom-in","Zoom-out"];
    tabDialog:Array<boolean>=[]; 
    iDialog:number=0;
    expandCircuit:number=-1;

    isFileModified:boolean=false;
    isTabOfRefReceived:boolean=false;
    isFileCircuitReceived:boolean=false;
    isListCountries:boolean=false;
    saveAction:string="";
    saveRecord:number=0;
    saveConfirmed:boolean=false;

    TabOfId:Array<any>=[];
    strFound:string="";
   
    errorMsg:string="";

  


ngOnInit(){
  /****
  this.ManageGoogleService.insertCacheFile(this.configServer,this.identification.circuits.file)
    .subscribe((data ) => {  
          console.log('insertCacheFile ==> ' + JSON.stringify(data));
      },
      err => {
          console.log('error on insertCacheFile :'+ JSON.stringify(err));
      });
  *****/
  this.GetRecord(this.identification.circuits.bucket, this.identification.circuits.file,1);
  //this.GetRecord("config-xmvit", "CountryISO.json",2);
  this.GetRecord("config-xmvit", "CountryISOPreferred.json",2);
  
}

resetBooleans(){
  this.tabDialog[this.iDialog]=false;
  this.errorMessage="";
  this.errorMsg="";
}

manageFile(event:any){
  this.tabPoR=event;
  this.isTabOfRefReceived=true;
}


tabRef:Array<any>=[];
onInput(event:any){
  this.resetBooleans();

  this.TabOfId.splice(0,this.TabOfId.length);
  const theValue= findIds(event.target.id,"-");
  
  for (var i=0; i<theValue.tabOfId.length; i++){
    this.TabOfId[i]=theValue.tabOfId[i];
  }
  if (theValue.strFound==="actionH"){
    this.iDialog=1;
    this.tabDialog[this.iDialog]=true;
    this.tabDialog[0]=false;
  }  else if (theValue.strFound==="selActionH"){
    this.iDialog=1;
    this.tabDialog[this.iDialog]=false;
    if (this.tabActionH[this.TabOfId[1]]==="Add after"){
        const record = new classCircuitRec;
        this.fileCircuit.splice(this.TabOfId[0]+1,0,record);
        const recordPoR= new classPointOfRef;
        this.fileCircuit[this.fileCircuit.length-1].points.push(recordPoR);
        this.isFileModified=true;
    } else if (this.tabActionH[this.TabOfId[1]]==="Add before"){
        const record = new classCircuitRec;
        this.fileCircuit.splice(this.TabOfId[0],0,record);
        const recordPoR= new classPointOfRef;
        this.fileCircuit[this.fileCircuit.length-1].points.push(recordPoR);
        this.isFileModified=true;
    } else if (this.tabActionH[this.TabOfId[1]]==="Delete"){
      this.isFileModified=true;
      this.isDeleteCircuit=true;
    } else if (this.tabActionH[this.TabOfId[1]]==="Zoom-in"){
        this.expandCircuit=this.TabOfId[0];
    } else if (this.tabActionH[this.TabOfId[1]]==="Zoom-out"){
        this.expandCircuit=-1;
  } 
  } else if (theValue.strFound==="name"){
      this.isFileModified=true;
      this.fileCircuit[this.TabOfId[0]].name=event.target.value;
  } else if (theValue.strFound==="country"){
      this.isFileModified=true;
      this.fileCircuit[this.TabOfId[0]].country=event.target.value;
  } else if (theValue.strFound==="city"){
      this.isFileModified=true;
      this.fileCircuit[this.TabOfId[0]].city=event.target.value;
  } else if (theValue.strFound==="PoRef"){ // first letters of PoR are input by user
      for (var i=0; i<this.tabPoR.length; i++){
        this.iDialog=0;
        this.tabDialog[this.iDialog]=true;
        this.tabDialog[1]=false;
        if (this.tabPoR[i].ref.toLowerCase().indexOf(event.target.value.toLowerCase().trim())!==-1){
          const thePush=new classPointOfRef;
          this.tabRef.push(thePush);
          this.tabRef[this.tabRef.length-1]=this.tabPoR[i];
        }
      }
  } else if (theValue.strFound==="selPoR"){ // PoR has been selected by the customer
      this.isFileModified=true;
      this.fileCircuit[this.TabOfId[0]].points[this.TabOfId[1]].ref=this.tabRef[this.TabOfId[2]].ref;
      this.fileCircuit[this.TabOfId[0]].points[this.TabOfId[1]].alt=this.tabRef[this.TabOfId[2]].alt;
      this.fileCircuit[this.TabOfId[0]].points[this.TabOfId[1]].lat=this.tabRef[this.TabOfId[2]].lat;
      this.fileCircuit[this.TabOfId[0]].points[this.TabOfId[1]].lon=this.tabRef[this.TabOfId[2]].lon;
      this.isFileModified=true;
      this.tabRef.splice(0, this.tabRef.length);
  } else  if (theValue.strFound==="actionPoR"){ // display tabAction
    this.iDialog=2;
    this.tabDialog[this.iDialog]=true;
    this.tabDialog[1]=false;
    this.tabDialog[0]=false;
    
  } else  if (theValue.strFound==="selAction"){ // action on PoR selected by user
    this.iDialog=2;
    this.tabDialog[this.iDialog]=false;
    if (this.tabActionH[this.TabOfId[2]]==="Add after"){
     
      const recordPoR= new classPointOfRef;
      this.fileCircuit[this.TabOfId[0]].points.splice(this.TabOfId[1]+1,0,recordPoR);
      this.isFileModified=true;
    } else if (this.tabActionH[this.TabOfId[2]]==="Add before"){
        const recordPoR= new classPointOfRef;
        this.fileCircuit[this.TabOfId[0]].points.splice(this.TabOfId[1],0,recordPoR);
        this.isFileModified=true;
    } else if (this.tabActionH[this.TabOfId[2]]==="Delete"){
      this.isFileModified=true;
      this.isDeletePoR=true;
    } 
  } else if (theValue.strFound==="delPoRYES"){
    this.isDeletePoR=false;
    this.fileCircuit[this.TabOfId[0]].points.splice(this.TabOfId[1],1);
  } else if (theValue.strFound==="delPoRNO"){
    this.isDeletePoR=false;
  } else if (theValue.strFound==="delCircuitYES"){
    this.isDeleteCircuit=false;
    this.fileCircuit.splice(this.TabOfId[0],1);
  } else if (theValue.strFound==="delCircuitNO"){
    this.isDeleteCircuit=false;
  }
  this.scroller.scrollToAnchor('bottomCircuit');
}

isDeleteCircuit:boolean=false;
isDeletePoR:boolean=false;
onSelectPoR(event:any){
  this.selectedPoint=event;
}


checkFormData(){
  this.errorMsg="";
  if (this.formOptions.controls["pointRef"].value==="" || this.formOptions.controls["lat"].value===""
      || this.formOptions.controls["lgt"].value ===""){
        this.errorMsg="All fields are mandatory";
  } else if (isNaN(this.formOptions.controls["lat"].value) 
  || isNaN(this.formOptions.controls["lgt"].value)){
    this.errorMsg="Latitude and Loongitude must be numeric values";
  }
}


manageUpdates(event:any){
  if (event.target.id==="confirmSave"){
      this.saveConfirmed=true;
      this.formOptions.controls["fileName"].setValue(this.identification.circuits.file);
  }  else if (event.target.id==="reinitialize"){
    this.GetRecord(this.identification.circuits.bucket,this.identification.circuits.file,1);
      this.saveConfirmed=false;
      this.isFileModified=false;
  } else if (event.target.id==="noReinit"){
    
  } else if (event.target.id==="saveFile"){
    this.saveFile(this.identification.circuits.bucket, this.identification.circuits.file, this.fileCircuit);
  } else if (event.target.id==="cancelSave"){
      this.saveConfirmed=false;
  }
}



saveFile(bucket:string, object:string,record:any){
  this.errorMessage='';
  // const fileName =this.formOptions.controls["fileName"].value;
  var file=new File ([JSON.stringify(record)],object, {type: 'application/json'});
 
  this.ManageGoogleService.uploadObject(this.configServer, bucket, file , object)
    .subscribe(
      res => {
        if (res.type===4){ 
          this.errorMessage="file " + object + " has been successfully saved"
          console.log(this.errorMessage);
          this.isFileModified=false;
          this.saveConfirmed=false;
          this.scroller.scrollToAnchor('bottomCircuit');
        }
      }, 
      err => {
        this.errorMessage='failure to get record ' + object+ ' ;  error = '+ JSON.stringify(err);
        console.log(this.errorMessage);
        this.scroller.scrollToAnchor('bottomCircuit');
      })
}
listCountry:Array<any>=[];
GetRecord(bucketName:string,objectName:string, iWait:number){
  this.errorMessage="";
  this.EventHTTPReceived[iWait]=false;
  this.NbWaitHTTP++;
  this.waitHTTP(this.TabLoop[iWait],30000,iWait);
  this.ManageGoogleService.getContentObject(this.configServer, bucketName, objectName )
      .subscribe((data ) => {  
        if (iWait===1){ // Circuits
          this.fileCircuit.splice(0,this.fileCircuit.length);
          this.fileCircuit=data;
          this.isFileCircuitReceived=true;
          }
        else if (iWait===2){ // Circuits
          if (data.text === undefined){
            this.listCountry=data;
          } else {

          
            this.listCountry.splice(0,this.listCountry.length);
            var myStr=data.text;
            const theChar=" = '";
            var lenStr=myStr.length;
            while (lenStr>5){
              var i = myStr.indexOf(theChar);
              this.listCountry.push({country:"",code:""});
              this.listCountry[this.listCountry.length-1].code=myStr.substring(i+4,i+6).toUpperCase();
              
              /*
              var trouve=false;
              for (var j=i-1; j>0; j-- ){
                if (myStr.substring(j,j+1)==='"'){
                  trouve = true;
                  this.listCountry[this.listCountry.length-1].country=myStr.substring(j+1,i);
                }
              }
              if (trouve===false){
                this.listCountry[this.listCountry.length-1].country=myStr.substring(1,i);
              }
              */
              this.listCountry[this.listCountry.length-1].country=myStr.substring(1,i);
              myStr=myStr.substring(i+11);
              lenStr=myStr.length;
            }
            
            this.saveFile("config-xmvit","CountryISO.json",this.listCountry);
            }
          }
          this.scroller.scrollToAnchor('bottomCircuit');
      },
      error => {
        this.errorMessage='failure to get record ' + objectName +' ;  error = '+ JSON.stringify(error);
        console.log(this.errorMessage);
        if (iWait===1){ // Circuits
          const record = new classCircuitRec;
          this.fileCircuit.push(record);
          this.fileCircuit[0].name="";
          this.fileCircuit[0].country="Singapore";
          this.fileCircuit[0].city="";
          const recordPoR= new classPointOfRef;
          this.fileCircuit[0].points.push(recordPoR);
          this.isFileCircuitReceived=true;
          }
        this.scroller.scrollToAnchor('bottomCircuit');
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

firstLoop:boolean=true;
ngOnChanges(changes: SimpleChanges) { 
    if (this.firstLoop===true){
      this.firstLoop=false;
    } else {
      for (const propName in changes){
        const j=changes[propName];
        if (propName==='credentials'){
          console.log('credentials have been updated');
        }
      }
    }

}

}