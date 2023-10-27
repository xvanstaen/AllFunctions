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
import { findIds } from '../MyStdFunctions';

import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';

@Component({
  selector: 'app-manage-point-of-ref',
  templateUrl: './manage-point-of-ref.component.html',
  styleUrls: ['./manage-point-of-ref.component.css']
})
export class ManagePointOfRefComponent {


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
    tabAction=["Cancel","Add before","Add after","Modify","Delete"];
    tabDialog=[false,false,false,false];  
    iDialog:number=0;

    isDeleteRef:boolean=false;
    isUpdateRef:boolean=false;
    isAddRef:boolean=false;
    isFileModified:boolean=false;

    TabOfId:Array<any>=[];
    strFound:string="";
   
    errorMsg:string="";


ngOnInit(){

  this.ManageGoogleService.insertCacheFile(this.configServer,this.configServer.PointOfRef.file)
  .subscribe((data ) => {  

    console.log('insertCacheFile ==> ' + JSON.stringify(data));
  },
  err => {
    console.log('error on insertCacheFile :'+ JSON.stringify(err));
  });

  this.GetRecord(this.configServer.PointOfRef.bucket,this.configServer.PointOfRef.file,0);

}

resetBooleans(){
  this.tabDialog[this.iDialog]=false;
  this.errorMessage="";
  this.errorMsg="";
}

resetAllBooleans(){
  this.TabOfId.splice(0,this.TabOfId.length);
  this.tabDialog[this.iDialog]=false;
  this.isDeleteRef=false;
  this.isUpdateRef=false;
  this.isAddRef=false;
  this.errorMessage="";
  this.errorMsg="";
 }

 saveAction:string="";
 saveRecord:number=0;

onActionPoR(event:any){
  this.resetBooleans();
  
  this.TabOfId.splice(0,this.TabOfId.length);
  const theValue= findIds(event.target.id,"-");
  
  for (var i=0; i<theValue.tabOfId.length; i++){
    this.TabOfId[i]=theValue.tabOfId[i];
  }
  if (theValue.strFound==="Action"){
    
    this.tabDialog[0]=true;
    // display the list of action in a dropdown list
  } else if (theValue.strFound==="selAction"){
    if (this.TabOfId[1]===0){
      // no action to take
    } else  if (this.tabAction[this.TabOfId[1]]==='Add before' || this.tabAction[this.TabOfId[1]]==='Add after'){ // Add before
      this.saveAction = this.tabAction[this.TabOfId[1]];   
      this.saveRecord=this.TabOfId[0]; 
      this.formOptions.controls["pointRef"].setValue("");
          this.formOptions.controls["lat"].setValue(0);
          this.formOptions.controls["lgt"].setValue(0);
            this.isAddRef=true;
      } else {
          this.formOptions.controls["pointRef"].setValue(this.tabPoR[this.TabOfId[0]].ref);
          this.formOptions.controls["lat"].setValue(this.tabPoR[this.TabOfId[0]].lat);
          this.formOptions.controls["lgt"].setValue(this.tabPoR[this.TabOfId[0]].lgt);
          if (this.tabAction[this.TabOfId[1]]==="Modify"){ 
            this.isUpdateRef=true;
          } else if (this.tabAction[this.TabOfId[1]]==="Delete"){ 
            this.isDeleteRef=true;
          }
      }
  } else if (theValue.strFound==="confirmAdd"){
       this.checkFormData();
       if (this.errorMsg===""){
          const theClass=new classPointOfRef;
          if (this.saveAction==="Add before"){
            this.tabPoR.splice(this.saveRecord,0,theClass);
          } else {
            this.saveRecord++
            this.tabPoR.splice(this.saveRecord,0,theClass);
          }
          
          this.tabPoR[this.saveRecord].ref=this.formOptions.controls["pointRef"].value;
          this.tabPoR[this.saveRecord].lat=Number(this.formOptions.controls["lat"].value);
          this.tabPoR[this.saveRecord].lgt=Number(this.formOptions.controls["lgt"].value);
          this.isFileModified=true;
          this.isAddRef=false;
          this.tabDialog[0]=false;
       }
  } else if (theValue.strFound==="confirmModify"){
      this.checkFormData();
      if (this.errorMsg===""){
          this.tabPoR[this.TabOfId[0]].ref=this.formOptions.controls["pointRef"].value;
          this.tabPoR[this.TabOfId[0]].lat=Number(this.formOptions.controls["lat"].value);
          this.tabPoR[this.TabOfId[0]].lgt=Number(this.formOptions.controls["lgt"].value);
          this.isFileModified=true;
          this.isUpdateRef=false;
          this.tabDialog[0]=false;
      }
  } else if (theValue.strFound==="confirmDel"){
      this.tabPoR.splice(this.TabOfId[0],1);
      this.isFileModified=true;
      this.isDeleteRef=false;
      this.tabDialog[0]=false;

  } else if (theValue.strFound==="cancelAction"){
    this.isAddRef=false;
    this.isDeleteRef=false;
    this.isUpdateRef=false;
    this.tabDialog[0]=false;
  } 
  console.log(event.target.id);
}

saveConfirmed:boolean=false;


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
      this.formOptions.controls["fileName"].setValue(this.configServer.PointOfRef.file);
  }  else if (event.target.id==="reinitialize"){
    this.GetRecord(this.configServer.PointOfRef.bucket,this.configServer.PointOfRef.file,0);
      this.saveConfirmed=false;
      this.isFileModified=false;
  } else if (event.target.id==="noReinit"){
    
  } else if (event.target.id==="saveFile"){
      this.saveFile();
  } else if (event.target.id==="cancelSave"){
      this.saveConfirmed=false;
  }
}

saveFile(){
  this.errorMessage='';
  // const fileName =this.formOptions.controls["fileName"].value;
  var file=new File ([JSON.stringify(this.tabPoR)],this.configServer.PointOfRef.file, {type: 'application/json'});
 
  this.ManageGoogleService.uploadObject(this.configServer, this.configServer.PointOfRef.bucket, file , this.formOptions.controls["fileName"].value)
    .subscribe(
      res => {
        if (res.type===4){ 
          this.errorMessage="file " + this.formOptions.controls["fileName"].value + " has been successfully saved"
          console.log(this.errorMessage);
          this.isFileModified=false;
          this.resetAllBooleans;
        }
      }, 
      err => {
        this.errorMessage='failure to get record ' + this.formOptions.controls["fileName"].value + ' ;  error = '+ JSON.stringify(err);
        console.log(this.errorMessage);
      })
}

GetRecord(bucketName:string,objectName:string, iWait:number){
  this.errorMessage="";
  this.EventHTTPReceived[iWait]=false;
  this.NbWaitHTTP++;
  this.waitHTTP(this.TabLoop[iWait],30000,iWait);
  this.ManageGoogleService.getContentObject(this.configServer, bucketName, objectName )
      .subscribe((data ) => {  
          if (iWait===0){
            this.tabPoR.splice(0,this.tabPoR.length);
            for (var i=0; i<data.length; i++){
              const theClass=new classPointOfRef;
              this.tabPoR.push(theClass);
              this.tabPoR[i] = data[i];
            }
            this.istabPointOfRef=true;
          }
      },
      error => {
        this.errorMessage='failure to get record ' + objectName +' ;  error = '+ JSON.stringify(error);
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
