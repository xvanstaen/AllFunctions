import {
  Component, OnInit, Input, Output, OnChanges, HostListener, OnDestroy, HostBinding, ChangeDetectionStrategy,
  SimpleChanges, EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID
} from '@angular/core';

// angular-google-auth2
//import {AuthService} from 'angular-google-auth2';

import { Buffer } from 'buffer';

import { DatePipe, formatDate } from '@angular/common';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { msginLogConsole } from '../consoleLog';
import { configServer, LoginIdentif, msgConsole, classCredentials } from '../JsonServerClass';

import { classAccessFile, classFileSystem } from '../classFileSystem';

import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { TutorialService } from 'src/app/CloudServices/tutorial.service';

export class classPSW{
  id: number=0;
  UserId:string= '';
  psw:string= '';
  key: number=0;
  method:string= '';
  cryptoAuth:string= '';
  bucketUserInfo:string= '';
}

export class classTuto{
  title: string= '';
  description: string= '';
  published: boolean=false;
}

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.css']
})
export class TutorialsComponent {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private ManageTutorialService: TutorialService,

  ) { }

  @Input() configServer = new configServer;
  @Input() credentials = new classCredentials;

  EventHTTPReceived: Array<boolean> = [];
  maxEventHTTPrequest: number = 20;
  id_Animation: Array<number> = [];
  TabLoop: Array<number> = [];
  maxLoop: number = 5000;
  tabLock:Array<classAccessFile>=[]; 
  iWait:string="";
  error:string="";

  db:string="ConfigDB";
  collection:string="";
  theSearch:string="";
  theSearchField:string="bucket";
  objectId:string="";
  typeRecord:string=""; // FS, PSW, TUTO

  recordFS=new classFileSystem;
  tabRecordFS:Array<classFileSystem>=[]
  tabIdFS:Array<string>=[];
  collectionFS:string="filesystems";
  idRecordFS:string="";
  dbFS:string="ConfigDB";
  isSelectedIdFS:number=0;

  recordPSW=new classPSW;
  tabRecordPSW:Array<classPSW>=[];
  tabIdPSW:Array<string>=[];
  idRecordPSW:string="";
  collectionPSW:string="usrpsws";
  dbPSW:string="ConfigDB";
  isSelectedIdPSW:number=0;

  recordTuto= new classTuto;
  tabRecordTuto:Array<classTuto>=[];
  tabIdTuto:Array<string>=[];
  idRecordTuto:string="";
  collectionTuto:string="tutorials";
  dbTuto:string="ConfigDB";
  isSelectedIdTuto:number=0;

  tabActions:Array<string>=['FS','PSW','Tuto'];
  selectedAction:number=4;

  ngOnInit(){
    //this.configServer = new configServer;
    //this.newConfig.test_prod='test';
    //this.newConfig.baseUrl='http://localhost:8080';
    //this.newConfig.baseUrl="https://xmv-it-consulting.uc.r.appspot.com";
    //this.newConfig.baseUrl='https://test-server-359505.uc.r.appspot.com';
    this.onReinit();    
    console.log('test');
  }

  onReinit(){
    this.recordFS.bucket="xmv-system";
    this.recordFS.byUser="xavier";
    this.recordFS.createdAt="12dec2024";
    this.recordFS.credentialDate="13dec2025";
    this.recordFS.lock=false;
    this.recordFS.object="fileSystem";
    this.recordFS.timeoutFileSystem.hh=1;
    this.recordFS.timeoutFileSystem.mn=4;
    this.recordFS.userServerId=2;
    this.recordFS.updatedAt="12jan2023";

    this.typeRecord="FS";
    this.db="ConfigDB";
    this.collection="filesystems";

    this.recordTuto.title="myTitle";
    this.recordTuto.description="myDescription";
    this.recordTuto.published=false;

    this.recordPSW.id=1;
    this.recordPSW.bucketUserInfo="the bucket";
    this.recordPSW.cryptoAuth="YES";
    this.recordPSW.key=2;
    this.recordPSW.UserId="Xavier";
    this.recordPSW.method="AES";
    this.recordPSW.psw="thePSW"

  }

  onInput(event:any){
    this.error='';
    if (event.target.id==="collection"){
      this.collection=event.target.value;
    } else if (event.target.id==="theSearch"){
      this.theSearch=event.target.value;
    } else if (event.target.id==="theSearchField"){
      this.theSearchField=event.target.value;
    } else if (event.target.id==="objectId"){
      this.objectId=event.target.value;
    } else if (event.target.id==="db"){
      this.db=event.target.value;
    } else if (event.target.id==="type"){
      this.typeRecord=event.target.value;
    } 
  }

  onInputFS(event:any){
    this.error='';
    if (event.target.id==="bucket"){
      this.recordFS.bucket=event.target.value;
    } else if (event.target.id==="byUser"){
      this.recordFS.byUser=event.target.value;
    } else if (event.target.id==="createdAt"){
      this.recordFS.createdAt=event.target.value;
    } else if (event.target.id==="credentialDate"){
      this.recordFS.credentialDate=event.target.value;
    } else if (event.target.id==="lock"){
      this.recordFS.lock=event.target.value;
    } else if (event.target.id==="object"){
      this.recordFS.object=event.target.value;
    } else if (event.target.id==="hh"){
      this.recordFS.timeoutFileSystem.hh=Number(event.target.value);
    } else if (event.target.id==="mn"){
      this.recordFS.timeoutFileSystem.mn=Number(event.target.value);
    } else if (event.target.id==="userServerId"){
      this.recordFS.userServerId=Number(event.target.value);
    } else if (event.target.id==="updatedAt"){
      this.recordFS.updatedAt=event.target.value;
    }  else if (event.target.id==="collectionFS"){
      this.collectionFS=event.target.value;
    } else if (event.target.id==="dbFS"){
      this.dbFS=event.target.value;
    } 
  }

  onInputPSW(event:any){
    this.error='';
    if (event.target.id==="collectionPSW"){
      this.collectionPSW=event.target.value;
    } else if (event.target.id==="dbPSW"){
      this.dbPSW=event.target.value;
    } else if (event.target.id==="idPSW"){
      this.recordPSW.id=Number(event.target.value);
    } else if (event.target.id==="UserId"){
      this.recordPSW.UserId=event.target.value;
    } else if (event.target.id==="psw"){
      this.recordPSW.psw=event.target.value;
    } else if (event.target.id==="key"){
      this.recordPSW.key =Number(event.target.value);
    } else if (event.target.id==="method"){
      this.recordPSW.method =event.target.value;
    } else if (event.target.id==="cryptoAuth"){
      this.recordPSW.cryptoAuth =event.target.value;
    } else if (event.target.id==="bucketUserInfo"){
      this.recordPSW.bucketUserInfo =event.target.value;
    }
  }

  onInputTuto(event:any){
    this.error='';
    if (event.target.id==="collectionTuto"){
      this.collectionTuto=event.target.value;
    } else if (event.target.id==="dbTuto"){
      this.dbTuto=event.target.value;
    } else if (event.target.id==="title"){
      this.recordTuto.title =event.target.value;
    } else if (event.target.id==="description"){
      this.recordTuto.description =event.target.value;
    } else if (event.target.id==="published"){
      this.recordTuto.published =event.target.value;
    }
  }

  onSelectType(event:any){
      this.selectedAction=Number(event.target.id.substring(4));
  }

  
  actionSave(event:any){
    this.error='';
    if (event.target.id==='saveFS'){
      this.createRecord(this.dbFS,this.collectionFS,this.recordFS);
      this.typeRecord="FS";
    } if (event.target.id==='savePSW'){
      this.createRecord(this.dbPSW,this.collectionPSW,this.recordPSW);
      this.typeRecord="PSW";
    } if (event.target.id==='saveTuto'){
      this.createRecord(this.dbTuto,this.collectionTuto,this.recordTuto);
      this.typeRecord="TUTO";
    }
  }

  actionUpdate(event:any){
    this.error='';
    if (event.target.id==='updateFS'){
        this.updateRecord(this.dbFS,this.collectionFS,this.recordFS, this.idRecordFS);

    } else if (event.target.id==='updatePSW'){
        this.updateRecord(this.dbPSW, this.collectionPSW,this.recordPSW,this.idRecordPSW);

    } else if (event.target.id==='updateTuto'){
        this.updateRecord(this.dbTuto, this.collectionTuto,this.recordTuto,this.idRecordTuto);
    }
  }

  createRecord(dataBase:any,collection:string,record:any){
    this.error='';
    this.ManageTutorialService.upload(this.configServer, dataBase, collection,record)
    .subscribe(
      (data) => {
        console.log(data);
        this.error='record is created';
        this.getAllRecords(dataBase,collection, this.typeRecord, "keep");
      },
      err => {
        this.getError(err, "createRecord","");
      });
  } 

  updateRecord( dataBase:any, collection:string, record:any, objectId:any){
    this.error='';
    this.ManageTutorialService.update(this.configServer, dataBase, collection, objectId, record)
    .subscribe(
      (data) => {
        if (data.status!==undefined  && data.status===200){
          this.error=data.message;
          this.getAllRecords(dataBase,collection, this.typeRecord, "keep");
          
        } else if (data.status!==undefined  && data.status!==200){
          this.error=data.message;
        }
      },
      err => {
        this.getError(err, "updateRecord","");
      });
  }


  delById(event:any){
    if (event.target.id==="delIdFS"){
      if (this.idRecordFS==="" && this.tabIdFS[this.isSelectedIdFS]!==""){
        this.deleteById(this.db, this.collectionFS, this.tabIdFS[this.isSelectedIdFS]);
      } else {
        this.deleteById(this.dbFS, this.collectionFS, this.idRecordFS);
      }
      this.typeRecord="FS";
    } else if (event.target.id==="delIdPSW"){
      if (this.idRecordPSW==="" && this.tabIdPSW[this.isSelectedIdPSW]!==""){
        this.deleteById(this.db, this.collectionPSW, this.tabIdPSW[this.isSelectedIdPSW]);
      } else {
        this.deleteById(this.db, this.collectionPSW, this.idRecordPSW);
      }
      this.typeRecord="PSW";
    } else if (event.target.id==="delIdTuto"){
      if (this.tabIdTuto[this.isSelectedIdTuto]!==""){
        this.deleteById(this.db, this.collectionTuto, this.tabIdTuto[this.isSelectedIdTuto]);
      } else {
        this.deleteById(this.db, this.collectionTuto, this.idRecordTuto);
      }
      this.typeRecord="TUTO";
    } else if (event.target.id==="commonObjectId"){
      if (this.objectId!==""){
        this.deleteById(this.db, this.collection, this.objectId);
      }
      
    }    
  }

  delAll(){
    this.deleteAllRecords( this.db, this.collection);
    
  }

  delByString(){
    this.deleteByString(this.db, this.collection, this.theSearch, this.theSearchField);
  }
  
  deleteById(dataBase:any, collection:string, id:any){
    this.error='';
    this.ManageTutorialService.deleteById(this.configServer, dataBase, collection, id)
    .subscribe(
      (data) => {
        if (data.status!==undefined  && data.status!==200){
          this.error=data.message;
        } else {
          this.error="Record successfully deleted";
          this.getAllRecords(dataBase,collection, this.typeRecord, "keep");
        }
      },
      err => {
        this.getError(err, "deleteById", "id");
      });
  }

  deleteByString(dataBase:any, collection:string, searchString:string, searchField:string){
    this.error='';
    
    this.ManageTutorialService.deleteByCriteria(this.configServer, dataBase, collection, searchString, searchField)
    .subscribe(
      (data) => {
        if (data.status!==undefined ){
          this.error=data.message;
        } else {
          this.error="Record successfully deleted";
          this.getAllRecords(dataBase,collection, this.typeRecord, "keep");
        }
      },
      err => {
        this.getError(err, "deleteByString","");
      });
  }

  deleteAllRecords(dataBase:any,collection:string){
    this.error='';
    this.ManageTutorialService.deleteAll(this.configServer, dataBase, collection)
    .subscribe(
      (data) => {
        if (data.status!==undefined&& data.status===200 ){
          this.error=data.message;
          this.getAllRecords(dataBase,collection, this.typeRecord, "keep");
        } else {
          this.error="No records deleted";
        }
      },
      err => {
        this.getError(err, "deleteAllRecords","");
      });
  }

  selectId(event:any){
    
    if (event.target.id.substring(0,4)==="FSY-"){
      this.isSelectedIdFS=Number(event.target.id.substring(4));
      this.recordFS=this.tabRecordFS[this.isSelectedIdFS];
      this.idRecordFS=this.tabIdFS[this.isSelectedIdFS];

    } else if (event.target.id.substring(0,4)==="PSW-"){
      this.isSelectedIdPSW=Number(event.target.id.substring(4));
      this.recordPSW=this.tabRecordPSW[this.isSelectedIdPSW];
      this.idRecordPSW=this.tabIdPSW[this.isSelectedIdPSW];
      
    } else if (event.target.id.substring(0,4)==="TUT-"){
      this.isSelectedIdTuto=Number(event.target.id.substring(4));
      this.recordTuto=this.tabRecordTuto[this.isSelectedIdTuto];
      this.idRecordTuto=this.tabIdTuto[this.isSelectedIdTuto];
    }
  }


  findAll(event:any){
    this.error='';
    if (this.collection==="" || this.db==="" || this.typeRecord==="" ){
      this.error='fields collection & db must be filled in';
    }  else {
      this.getAllRecords(this.db, this.collection, this.typeRecord, "");
    }     
  }

  findByString(event:any){
    this.error='';
    const iWait=0;
    const type=this.typeRecord;
    if (this.collection==="" || this.db==="" || this.typeRecord==="" || this.theSearch==="" || this.theSearchField===""){
      this.error='fields collection & db $ search string & fields must be filled in';
    }  else {
        this.ManageTutorialService.getByCriteria(this.configServer, this.db, this.collection,this.theSearch, this.theSearchField)
        .subscribe(
          (data) => {
            this.processFind(data, type, iWait);
          },
          err => {
            this.getError(err, "findByString","");
          });
    }
  }

  

  findById(event:any){
    this.error='';
    const iWait=0;
    const type=this.typeRecord;
    if (this.collection==="" || this.db==="" || this.typeRecord==="" || this.objectId==="" ){
      this.error='fields collection & db $ search string & fields must be filled in';
    }  else {
        this.ManageTutorialService.getById(this.configServer, this.db, this.collection,this.objectId)
        .subscribe(
          (data) => {
            this.processFind(data, type, iWait);
          },
          err => {
            this.getError(err, "findById","id");
  
          });
    }
  }


  getAllRecords(dataBase:string, collect:string, type:string, keep:string) {
    const iWait=0;
    if (keep===""){
      this.error='';
    }
    this.EventHTTPReceived[iWait] = false;
    this.waitHTTP(this.TabLoop[iWait], this.maxLoop, iWait);
    this.ManageTutorialService.getAll(this.configServer, dataBase, collect)
      .subscribe(
        (data) => {
          this.processFind(data, type, iWait);
        },
        err => {
          console.log('getAllRecords error=' + JSON.stringify(err));
          this.getError(err, "getAllRecords","");
        });
  }

  processFind(data:any, type:any, iWait:number){
    if (data.status===undefined){
      if (type==='FS'){
        this.receiveFS(data);
        this.selectedAction=0;
        
      } else if (type==='PSW'){
        this.receivePSW(data);
        this.selectedAction=1;

      } else if (type==='TUTO'){
        this.receiveTUTO(data);
        this.selectedAction=2;
        }
      this.EventHTTPReceived[iWait] = true;
    } else {
      this.error = "Status:"+ data.status + "  " + data ;
    }
  }


  receiveFS(data:any){
    this.tabRecordFS.splice(0,this.tabRecordFS.length);
    this.tabIdFS.splice(0,this.tabIdFS.length);
    if (Array.isArray(data) === false){
        const theClass = new classFileSystem;
        this.tabRecordFS.push(theClass);
        this.tabRecordFS[0]=data;
        this.tabIdFS[0]=data.id;
        this.isSelectedIdFS=0;
    } else {
        for (var i=0; i<data.length; i++){
            const theClass = new classFileSystem;
            this.tabRecordFS.push(theClass);
            this.tabRecordFS[i]=data[i];
            this.tabIdFS[i]=data[i].id;
            this.isSelectedIdFS=0;
        }
    }
    if (this.tabRecordFS.length>0){
      this.recordFS=this.tabRecordFS[0];
      this.idRecordFS=this.tabIdFS[0];
    } else { this.error = "no record found"}
  }

  receivePSW(data:any){
    this.tabRecordPSW.splice(0,this.tabRecordPSW.length);
    this.tabIdPSW.splice(0,this.tabIdPSW.length);
    if (Array.isArray(data) === false){
        const theClass = new classPSW;
        this.tabRecordPSW.push(theClass);
        this.tabRecordPSW[0]=data;
        this.tabIdPSW[0]=data.id;
        this.isSelectedIdPSW=0;
    } else {
        for (var i=0; i<data.length; i++){
            const theClass= new classPSW;
            this.tabRecordPSW.push(theClass);
            this.tabRecordPSW[i]=data[i];
            this.tabIdPSW[i]=data[i].id;
            this.isSelectedIdPSW=0;
        }
    }
    if (this.tabRecordPSW.length>0){
      this.recordPSW=this.tabRecordPSW[0];
      this.idRecordPSW=this.tabIdPSW[0];
    } else { this.error = "no record found"}
  }

  receiveTUTO(data:any){
    this.tabRecordTuto.splice(0,this.tabRecordTuto.length);
    this.tabIdTuto.splice(0,this.tabIdTuto.length);
    if (Array.isArray(data) === false){
        const theClass = new classTuto;
        this.tabRecordTuto.push(theClass);
        this.tabRecordTuto[0]=data;
        this.tabIdTuto[0]=data.id;
        this.isSelectedIdTuto=0;
    } else {
        for (var i=0; i<data.length; i++){
            const theClass= new classTuto;
            this.tabRecordTuto.push(theClass);
            this.tabRecordTuto[i]=data[i];
            this.tabIdTuto[i]=data[i].id;
            this.isSelectedIdTuto=0;
        }
    }
    if (this.tabRecordTuto.length>0){
      this.recordTuto=this.tabRecordTuto[0];
      this.idRecordTuto=this.tabIdTuto[0];
    } else { this.error = "no record found"}
  }

  getError(err:any, process:any, byId:string){
    if (err.error.status===540 || err.error.status===510 || err.error.status===520 ){
      this.error = "Process: " + process + "  " + err.error.message;
    } else if (err.error.status===521 ){
        if (byId==="id" && err.error.message.indexOf("Cast to")){
          this.error = "Process: " + process + " failed; 'id' is invalid " ;
        } else {
          this.error = "Process: " + process + "  " + err.error.message;
        }
    } else {
        this.error = this.error = "Process: " + process + "  " + err.message;
    }
  }

  waitHTTP(loop: number, max_loop: number, eventNb: number) {
    const pas = 500;
    if (loop % pas === 0) {
      console.log('waitHTTP ==> loop=' + loop + ' max_loop=' + max_loop + '  eventNb=' + eventNb);
    }
    loop++

    this.id_Animation[eventNb] = window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop, eventNb));
    if (loop > max_loop || this.EventHTTPReceived[eventNb] === true) {
      console.log('exit waitHTTP ==> loop=' + loop + ' max_loop=' + max_loop + ' this.EventHTTPReceived=' +
        this.EventHTTPReceived[eventNb]);
      //if (this.EventHTTPReceived[eventNb]===true ){
      window.cancelAnimationFrame(this.id_Animation[eventNb]);
      //}    
    }
  }
/*
  ngOnChanges(changes: SimpleChanges){
    console.log('ngOnChanges()');
    for (const propName in changes) {
      const j = changes[propName];
      if (propName === 'configServer' || propName === 'newConfigServer') {
        if (changes['configServer'].firstChange === false) {
          console.log('configServer has been updated');
        }
      }
    }
  }
*/
}
