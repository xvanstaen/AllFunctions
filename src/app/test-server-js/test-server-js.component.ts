import {
  Component, OnInit, Input, Output, HostListener, OnDestroy, HostBinding, ChangeDetectionStrategy,
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
import { Observable } from 'rxjs';

import { BucketList, Bucket_List_Info, OneBucketInfo, classCredentials, classTabMetaPerso } from '../JsonServerClass';

// configServer is needed to use ManageGoogleService
// it is stored in MangoDB and accessed via ManageMangoDBService

import { msginLogConsole } from '../consoleLog';
import { configServer, LoginIdentif, msgConsole } from '../JsonServerClass';

import { classAccessFile, classFileSystem } from '../classFileSystem';

import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { AccessConfigService } from 'src/app/CloudServices/access-config.service';



@Component({
  selector: 'app-test-server-js',
  templateUrl: './test-server-js.component.html',
  styleUrls: ['./test-server-js.component.css']
})
export class TestServerJSComponent {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private datePipe: DatePipe,

    //public auth: AuthService,

    @Inject(LOCALE_ID) private locale: string,
  ) { }

  @Input() configServer = new configServer;
  @Input() credentials = new classCredentials;

  HTTP_Address: string = 'https://storage.googleapis.com/upload/storage/v1/b/config-xmvit/o?uploadType=media&name=unloadfileSystem&metadata={cache-control:no-cache,no-store,max-age=0}';
  HTTP_AddressPOST: string = '';
  Google_Bucket_Access_Root: string = 'https://storage.googleapis.com/storage/v1/b/';
  Google_Bucket_Access_RootPOST: string = 'https://storage.googleapis.com/upload/storage/v1/b/';

  GoogleObject_Option: string = '/o?uploadType=media&name='
  GoogleObject_MetadataStart: string = '&metadata={'
  GoogleObject_MetadataEnd: string = '&metadata={'

  cacheControl: string = 'cache-control:no-cache,no-store,max-age=0';
  authorization: string = 'Bearer';
  contentTypeJson: string = 'application/json';
  contentTypeurlencoded: string = 'application/x-www-form-urlencoded';
  accept: string = 'application/json';

  theHeadersAll = new HttpHeaders({
    "Authorization": "",
    "Content-Type": "",
    "Accept": "",
  });

  copyData:string="";

  TabBuckets = [{ name: '' }];
  myListOfObjects = new Bucket_List_Info;
  oneMetadata = new OneBucketInfo;

  bucket_data: string = '';

  DisplayListOfObjects: boolean = false;
  Error_Access_Server: string = '';

  fileRecord: any;
  isConfirmedSave: boolean = false;
  isGetMetadata: boolean = false;
  isGetAllMetadata: boolean = false;
  isConfirmedDelete:boolean=false;

  EventHTTPReceived: Array<boolean> = [];
  maxEventHTTPrequest: number = 20;
  id_Animation: Array<number> = [];
  TabLoop: Array<number> = [];
  maxLoop: number = 5000;
  tabLock:Array<classAccessFile>=[]; 
  iWait:string="";

  theForm: FormGroup = new FormGroup({
    testProd: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    nameServer: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    server: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    srcBucket: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    srcObject: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    destBucket: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    destObject: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    action: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    fileContent: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    metaControl: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
    metaType: new FormControl({ value: '', disabled: false }, { nonNullable: true }),
  });

  tabAction: Array<string> = ['cancel', 'list all buckets', 'list all objects', 'get file content', 'get list metadata for all objects', 'get metadata for one object', 'update metadata for one object',  'save object', 'save object with meta perso' , 'rename object', 
  'copy object', 'move object', 'delete object', 'cache console', 'get memory File System','reset memory File System'];

  tabServers: Array<string> = [
    'http://localhost:8080', 'https://test-server-359505.uc.r.appspot.com','https://xmv-it-consulting.uc.r.appspot.com'
  ]
  //   'delBucket'
  actionDropdown: boolean = false;
  returnFileContent: any;
  error: any;
  currentAction: string = "";
  tabMetaPerso: Array<classTabMetaPerso> = [];
  strMetaDataPerso:string="";

  memoryFS:Array<any>=[{
    fileName:"",
    record:[]
  }]

  memoryCacheConsole:Array<any>=[];

  ngOnInit() {
   // this.configServer.baseUrl = 'http://localhost:8080';
    this.reinitialise();
    
    console.log('ngOnInit');
    for (var i = 0; i < this.maxEventHTTPrequest; i++) {
      this.TabLoop[i] = 0;
      this.EventHTTPReceived[i] = false;
    }
    this.currentAction='list all buckets';
    this.getListBuckets();
    for (var i = 0; i < 5; i++) {
      const classMeta=new classTabMetaPerso;
      this.tabMetaPerso.push(classMeta);
      this.tabMetaPerso[i].key="";
      this.tabMetaPerso[i].value="";
    }

    if (this.credentials.access_token !== undefined || this.credentials.access_token !== "") {
      this.authorization = 'Bearer ' + this.credentials.access_token;
      this.theHeadersAll = new HttpHeaders({
        "Authorization": this.authorization,
        "Content-Type": this.contentTypeJson,
        "Accept": this.accept,
      });
    }
  }


  inputMetaPerso(event: any) {
    if (event.target.id.substring(0, 2) === "K-") {
      this.tabMetaPerso[Number(event.target.id.substring(2))].key = event.target.value;
    } else if (event.target.id.substring(0, 2) === "V-") {
      this.tabMetaPerso[Number(event.target.id.substring(2))].value = event.target.value;
    }

  }

  reinitialise() {

    this.theForm.controls['server'].setValue('server');
    this.theForm.controls['nameServer'].setValue(this.tabServers[1]);
    this.theForm.controls['testProd'].setValue('prod');
    this.theForm.controls['srcBucket'].setValue('');
    this.theForm.controls['srcObject'].setValue('');
    this.theForm.controls['destBucket'].setValue('');
    this.theForm.controls['destObject'].setValue('');
    this.theForm.controls['fileContent'].setValue('');
    this.theForm.controls['action'].setValue('');
    this.theForm.controls['metaControl'].setValue(this.cacheControl);
    this.theForm.controls['metaType'].setValue(this.contentTypeJson);
    this.error = "";
    this.returnFileContent = "";
    this.currentAction = "";
    this.isConfirmedDelete= false;
    this.isConfirmedSave= false;
  }


  requestToken() {
    this.EventHTTPReceived[9] = false;
    this.waitHTTP(this.TabLoop[9], this.maxLoop, 9);
    this.ManageGoogleService.getTokenOAuth2(this.configServer)
      .subscribe((data) => {
        console.log(JSON.stringify(data));
        this.EventHTTPReceived[9] = true;
      },
        err => {
          console.log(JSON.stringify(err))
          this.EventHTTPReceived[9] = true;
        });
  }


  onAction() {
    console.log('onAction');
    this.metaDataMsg='';
    this.actionDropdown = true;
  }

  copySelection(event:any){
    if (event.target.id.indexOf('-')!==-1){
      this.copyData=event.target.id.substring(event.target.id.indexOf('-')+1);
    }
  }

  pasteAction(event:any){
    if (event.target.id==="srcBucket"){
      this.theForm.controls['srcBucket'].setValue(this.copyData);
    } else if (event.target.id==="destBucket"){
      this.theForm.controls['destBucket'].setValue(this.copyData);
    } else if (event.target.id==="srcObject"){
      this.theForm.controls['srcObject'].setValue(this.copyData);
    } else if (event.target.id==="destObject"){
      this.theForm.controls['destObject'].setValue(this.copyData);
    }

  }

  testConvertObject(){
    const newObject = {
      cacheControl: 'public,max-age=0,no-cache,no-store',
      contentType: 'application/json',
      myArrayOne:['val1','val2'],
      myArrayTwo:[{key:'key1',val:'val1', tab:[{sK:"sk1",sV:"sv",sTab:[0,1,2]}]}, {key:'key2',val:'val2', tab:[{sK:"sk1",sV:"sv",sTab:[0,1,2]}]}, {key:'key3',val:'val3', tab:[{sK:"sk1",sV:"sv",sTab:[0,1,2]}]}],
      subObject:{
        title:"theTitle",
        subsubObject:[{subkey:'subkey1',subval:'subval1'}, {subkey:'subkey1',subval:'subval1'}]
        }
      }

    const refObject ={
      cacheControl: '',
      contentType: '',
      inBeetween:0,
      myArrayOne:[],
      myArrayTwo:[],
      subObject:{
        title:"",
        subsubObject:[]
        },
      undef:"",
    }

    const strNewObject=JSON.stringify(newObject);
    console.log('strNewObject= '+strNewObject);

    const receivedObject=this.stringToObject(strNewObject,refObject);

    
  }

  stringToObject(myString:string,inObject:any){

    var strInObject=JSON.stringify(inObject);
    console.log('strInObject= '+strInObject);
    var tabOpenParenthesis=[];
    var tabCloseParenthesis=[];

    var tabOpenArray=[];
    var tabCloseArray=[];
    
    var iTabOpPar=-1;
    var iTabClPar=-1;
    var iTabOpArr=-1;
    var iTabClArr=-1;
    var tabParenthesis=[];
    var tabArray=[];
    var iTabPar=-1;
    var iTabArr=-1;
    for (var iPos=0; iPos<myString.length; iPos++){
      if (myString.substring(iPos,iPos+1)==='{'){
        iTabOpPar++
        tabOpenParenthesis[iTabOpPar]=iPos;
      } else if (myString.substring(iPos,iPos+1)==='}'){
        iTabClPar++
        tabCloseParenthesis[iTabClPar]=iPos;
      } else if (myString.substring(iPos,iPos+1)==='['){
        iTabOpArr++
        tabOpenArray[iTabOpArr]=iPos;
      } else if (myString.substring(iPos,iPos+1)===']'){
        iTabClArr++ 
        tabCloseArray[iTabClArr]=iPos;
      }

    }

   var contentTables=[];
   for (var i=0; i<tabOpenArray.length; i++){
    contentTables[i]=myString.substring(tabOpenArray[i],tabCloseArray[tabCloseArray.length-i]);
   } 

   var contentObjects=[];
   for (var i=0; i<tabOpenParenthesis.length; i++){
    contentObjects[i]=myString.substring(tabOpenParenthesis[i],tabCloseParenthesis[tabCloseParenthesis.length-1-i]);
   } 
    
    console.log('inObject= '+inObject);
    return (inObject);
  }

  selectServer(event: any) {
    this.configServer.baseUrl = event.target.textContent.trim();
    this.theForm.controls['nameServer'].setValue(event.target.textContent.trim());
  }

  selectAction(event: any) {
    this.testConvertObject();

    var testProd = this.theForm.controls['testProd'].value;
    this.configServer.test_prod = testProd.toLowerCase().trim();

    this.isConfirmedDelete= false;
    this.isConfirmedSave= false;
    this.actionDropdown = false;
    this.error = "";
    this.metaDataMsg="";
    this.returnFileContent = "";
    this.currentAction = event.target.textContent.trim();

    if (event.target.textContent.trim() !== "cancel") {
      this.theForm.controls['action'].setValue(event.target.textContent.trim());
      if (event.target.textContent.trim() === 'list all buckets') {
        this.getListBuckets();

      } else if (event.target.textContent.trim() === 'list all objects') {
        this.getListObjects(this.theForm.controls['srcBucket'].value);

      } else if (event.target.textContent.trim() === 'get file content') {
        if (this.theForm.controls['server'].value === 'HTTP') {
          this.getFileContentHTTP(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);
        } else {
          this.getFileContent(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);
        }

      } else if (event.target.textContent.trim() === 'get list metadata for all objects') {
        this.listMetaDataObject(this.theForm.controls['srcBucket'].value);

      } else if (event.target.textContent.trim() === 'get metadata for one object') {
        this.getMetaData(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);

      }  else if (event.target.textContent.trim() === 'copy object') {
        this.copyObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value, this.theForm.controls['destBucket'].value, this.theForm.controls['destObject'].value);

      } else if (event.target.textContent.trim() === 'move object') {
        this.moveObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value, this.theForm.controls['destBucket'].value, this.theForm.controls['destObject'].value);
      
      } else if (event.target.textContent.trim() === 'rename object') {
        this.renameObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value, this.theForm.controls['destObject'].value);
        
      }  else if (event.target.textContent.trim() === 'delete object' && this.theForm.controls['srcObject'].value!=="" ) {
        this.isConfirmedDelete = true;
        
        
      }else if (event.target.textContent.trim() === 'save object'  && this.theForm.controls['srcObject'].value!=="") {
        this.isConfirmedSave = true;

      } else if (event.target.textContent.trim() === 'save object with meta perso' && this.theForm.controls['srcObject'].value!=="") {
        this.isConfirmedSave = true;
       
      
      } else if (event.target.textContent.trim() === 'cache console') {
        this.getCacheConsole();

      }  else if (event.target.textContent.trim() === 'get memory File System') {
        this.getMemoryFS();

      } else if (event.target.textContent.trim() === 'reset memory File System') {
        this.resetMemoryFS(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);

        //'get memory File System','reset memory File System'
      } else {
        this.error = 'ACTION UNKNOWN';
      }
    }

  }

  actionUpdateMeta() {
    this.currentAction = "";
    this.metaDataMsg="";

    for (var i = this.tabMetaPerso.length-1; i > 0; i--) {
      if (this.tabMetaPerso[i].key === "") {
        this.tabMetaPerso.splice(i, 1);
      }
    }

    this.updateMetaData(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value,);
  }

  metaDataMsg:string="";
  updateMetaData(bucket: any, object: any) {

    this.metaDataMsg="";
    this.EventHTTPReceived[5] = false;
    this.waitHTTP(this.TabLoop[5], this.maxLoop, 5);
    this.strMetaDataPerso = "";
    this.ManageGoogleService.updateMetaData(this.configServer, bucket, object, this.theForm.controls['metaControl'].value, this.theForm.controls['metaType'].value, this.tabMetaPerso)
      .subscribe(
        (data) => {
          if (data.type === 4 && data.status === 200) {
            this.returnFileContent = JSON.stringify(data);
            this.metaDataMsg=data.body.message;
            this.strMetaDataPerso = JSON.stringify(data.body.metaData.metadata);
            this.fullSizeTabMeta();
            this.EventHTTPReceived[5] = true;
          }
      
        },
        err => {
          //console.log('Metadata not updated for unloadfileSystem');
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[5] = true;
        });
  }


  confirmDelete(event: any) {
    this.isConfirmedDelete= false;
    if (event.target.id === "Save") {
      this.deleteObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);
    }
  }

  confirmSave(event: any) {
    this.isConfirmedSave = false;

    if (event.target.id === "Save") {
      if (this.currentAction==='save object with meta perso'){
        this.uploadMetaPerso(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value, this.theForm.controls['fileContent'].value)
      } else  if (this.currentAction==='save object'){

        if (this.theForm.controls['server'].value === 'HTTP') {
          this.saveObjectHTTP(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value, this.theForm.controls['fileContent'].value);
        } else {
          this.saveObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value, this.theForm.controls['fileContent'].value);
        }
      }
    } else { this.currentAction = ""; }

  }

  getListBuckets() {
    this.EventHTTPReceived[0] = false;
    this.waitHTTP(this.TabLoop[0], this.maxLoop, 0);
    this.ManageGoogleService.getListBuckets(this.configServer)
      .subscribe((data) => {
        //console.log(JSON.stringify(data));
        this.returnFileContent = JSON.stringify(data);
        this.TabBuckets = data;
        this.EventHTTPReceived[0] = true;
      },
        err => {
          //console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
        });
  }

  getListObjects(bucket: any) {
    this.EventHTTPReceived[1] = false;
    this.waitHTTP(this.TabLoop[1], this.maxLoop, 1);
    this.ManageGoogleService.getListObjects(this.configServer, bucket)
      .subscribe((data) => {
        //console.log(JSON.stringify(data));
        this.myListOfObjects.items = data;
        this.returnFileContent = JSON.stringify(data);
        this.EventHTTPReceived[1] = true;
      },
        err => {
          //console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[1] = true;
        });
  }

  getFileContent(bucket: any, object: any) {
    this.EventHTTPReceived[2] = false;
    this.waitHTTP(this.TabLoop[2], this.maxLoop, 2);
    this.ManageGoogleService.getContentObject(this.configServer, bucket, object)
      .subscribe((data) => {
        //console.log(JSON.stringify(data)); 
        this.returnFileContent = JSON.stringify(data);
        this.EventHTTPReceived[2] = true;
      },
        err => {
          //console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[2] = true;
        });
  }

  getFileContentHTTP(bucket: any, object: any) {
    this.EventHTTPReceived[2] = false;
    this.waitHTTP(this.TabLoop[2], this.maxLoop, 2);
    this.HTTP_Address = 'https://storage.googleapis.com/download/storage/v1/b/' + bucket + '/o/' + object + '?alt=media';
    //this.HTTP_Address=this.Google_Bucket_Access_Root+bucket+this.GoogleObject_Option+object;
    this.http.get(this.HTTP_Address, { headers: this.theHeadersAll })
      .subscribe((data) => {
        //console.log(JSON.stringify(data)); 
        this.returnFileContent = JSON.stringify(data);
        this.EventHTTPReceived[2] = true;
      },
        err => {
          //console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[2] = true;
        });
  }

  tabListMetaPerso:Array<string>=[];
  listMetaDataObject(bucket: any) {
    this.EventHTTPReceived[3] = false;
    this.waitHTTP(this.TabLoop[3], this.maxLoop, 3);
    this.ManageGoogleService.getListMetaObjects(this.configServer, bucket)
      .subscribe((data) => {
        //console.log(JSON.stringify(data));
        this.myListOfObjects.items.splice(0, this.myListOfObjects.items.length);
        this.tabListMetaPerso.splice(0,this.tabListMetaPerso.length);
        for (var i = 0; i < data.length; i++) {
          const metadata = new OneBucketInfo;
          this.myListOfObjects.items.push(metadata);
          this.myListOfObjects.items[i] = data[i].items;
          if (data[i].items.metadata!==undefined){
            this.tabListMetaPerso[i]=JSON.stringify(data[i].items.metadata);
          } else {
            this.tabListMetaPerso[i]="";
          }
        }
        this.returnFileContent = JSON.stringify(data);
        this.EventHTTPReceived[3] = true;
      },
        err => {
          //console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[3] = true;
        });
  }

  fullSizeTabMeta(){
    for (var i = this.tabMetaPerso.length; i<5; i++) {
      const classMeta=new classTabMetaPerso;
      this.tabMetaPerso.push(classMeta);
    }
  }


  getMetaData(bucket: any, object: any) {
    this.EventHTTPReceived[4] = false;
    this.waitHTTP(this.TabLoop[4], this.maxLoop, 4);
    this.strMetaDataPerso = "";
    this.ManageGoogleService.getMetaObject(this.configServer, bucket, object)
      .subscribe(
        (data) => {
          var k=0;
          this.returnFileContent = JSON.stringify(data);
          this.theForm.controls['metaControl'].setValue(data.cacheControl);
          this.theForm.controls['metaType'].setValue(data.contentType);
          this.strMetaDataPerso = JSON.stringify(data.metadata);
          var iTab=-1;
          this.fullSizeTabMeta();
          if (this.strMetaDataPerso!==undefined ){
            for (var iPos=2; iPos<this.strMetaDataPerso.length; iPos++){
                
                var jPos=this.strMetaDataPerso.substring(iPos).indexOf('":"');
                iTab++
                this.tabMetaPerso[iTab].key=this.strMetaDataPerso.substring(iPos,jPos+iPos);
                
                iPos=iPos+jPos+3;
                jPos=this.strMetaDataPerso.substring(iPos).indexOf('","');
                k=2;
                if (jPos===-1){
                  jPos=this.strMetaDataPerso.substring(iPos).indexOf('"}');
                  k=1;
                }
                this.tabMetaPerso[iTab].value=this.strMetaDataPerso.substring(iPos,jPos+iPos);
                iPos=iPos+jPos+k;
            }
          }
          iTab++
          for (var i=iTab; i<5; i++) {
            this.tabMetaPerso[i].key="";
            this.tabMetaPerso[i].value="";
          }
          this.oneMetadata = data;
          this.EventHTTPReceived[4] = true;
        },
        err => {
          //console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[4] = true;
        });
  }

  deleteObject(srcbucket: any, srcobject: any) {
    this.EventHTTPReceived[7] = false;
    this.waitHTTP(this.TabLoop[7], this.maxLoop, 7);
    this.ManageGoogleService.deleteObject(this.configServer, srcbucket, srcobject)
      .subscribe(
        (data) => {
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[7] = true;
        },
        err => {
          //console.log('Error to copy ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[7] = true;
        });
  }


  renameObject(srcbucket: any, srcobject: any, destobject: any) {
    this.EventHTTPReceived[7] = false;
    this.waitHTTP(this.TabLoop[7], this.maxLoop, 7);
    this.ManageGoogleService.renameObject(this.configServer, srcbucket, srcobject, destobject)
      .subscribe(
        (data) => {
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[7] = true;
        },
        err => {
          //console.log('Error to copy ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[7] = true;
        });
  }

  moveObject(srcbucket: any, srcobject: any, destbucket: any, destobject: any) {
    this.EventHTTPReceived[7] = false;
    this.waitHTTP(this.TabLoop[7], this.maxLoop, 7);
    this.ManageGoogleService.moveObject(this.configServer, srcbucket, destbucket, srcobject, destobject)
      .subscribe(
        (data) => {
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[7] = true;
        },
        err => {
          //console.log('Error to copy ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[7] = true;
        });
  }

  copyObject(srcbucket: any, srcobject: any, destbucket: any, destobject: any) {
    this.EventHTTPReceived[6] = false;
    this.waitHTTP(this.TabLoop[6], this.maxLoop, 6);
    this.ManageGoogleService.copyObject(this.configServer, srcbucket, destbucket, srcobject, destobject)
      .subscribe(
        (data) => {
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[6] = true;
        },
        err => {
          //console.log('Error to move ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[6] = true;
        });
  }

  getCacheConsole() {
    this.EventHTTPReceived[10] = false;
    this.waitHTTP(this.TabLoop[10], this.maxLoop, 10);
    this.ManageGoogleService.getCacheConsole(this.configServer)
      .subscribe(
        (data) => {
          this. memoryCacheConsole.splice(0,this. memoryCacheConsole.length);
          for (var i=0; i<data.length; i++){
            const theClass={theDate:'',msg:"",content:""};
            this. memoryCacheConsole.push(theClass);
            this. memoryCacheConsole[i]=data[i];
            if (typeof data[i].content === 'object'){
              this. memoryCacheConsole[i].content=JSON.stringify(data[i].content);
            }
          }

          this.EventHTTPReceived[10] = true;
        },
        err => {
          //console.log('Error to move ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[10] = true;
        });
  }

  tabNameFS:Array<string>=[];
  
  getMemoryFS() {
    this.error="";
    this.EventHTTPReceived[11] = false;
    this.waitHTTP(this.TabLoop[11], this.maxLoop, 11);
    this.ManageGoogleService.getMemoryFS(this.configServer)
      .subscribe(
        (data) => {
          this.memoryFS.splice(0,this.memoryFS.length);
          for (var i=0; i<data.data.length; i++){
            this.memoryFS.push({fileName:"",record:[]});
            this.memoryFS[i].fileName=data.data[i].fileName;
            if (data.data[i].content.length===0){
              this.error=this.error + " --- " + "File System " + this.memoryFS[i].fileName+ " memory is empty";
            } else {
              for (var j=0; j<data.data[i].content.length; j++){
                const theClass=new classFileSystem;
                this.memoryFS[i].record.push(theClass);
                this.memoryFS[i].record[this.memoryFS[i].record.length-1]=data.data[i].content[j];
                
              }
            }
          }
          
          
            this.EventHTTPReceived[11] = true;
        },
        err => {
          //console.log('Error to move ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[11] = true;
        });
  }

  resetMemoryFS(srcBucket:string, srcObject:string) {
    
    this.EventHTTPReceived[12] = false;
    this.waitHTTP(this.TabLoop[12], this.maxLoop, 12);
    this.ManageGoogleService.resetFS(this.configServer, srcBucket, srcObject,this.tabLock,this.iWait)
      .subscribe(
        (data) => {
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[12] = true;
        },
        err => {
          //console.log('Error to move ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[12] = true;
        });
  }


  saveObject(srcbucket: any, srcobject: any, record: any) {

    var myObject: any;
    if (record.substring(0, 1) === "{") {
      myObject = JSON.parse(record);
    } else {
      myObject = record;
    }

    var file = new File([JSON.stringify(myObject)], srcobject, { type: 'application/json' });
    this.EventHTTPReceived[8] = false;
    this.waitHTTP(this.TabLoop[8], this.maxLoop, 8);
    this.ManageGoogleService.uploadObject(this.configServer, srcbucket, file, srcobject)
      .subscribe(data => {
        if (data.type === 4 && data.status === 200) {
          console.log(JSON.stringify(data));
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[8] = true;
        }
      },
        err => {
          console.log('Metaobject not retrieved ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[8] = true;
        });
  }

  uploadMetaPerso(srcbucket: any, srcobject: any, record: any) {

    var myObject: any;
    if (record.substring(0, 1) === "{") {
      myObject = JSON.parse(record);
    } else {
      myObject = record;
    }

    var file = new File([JSON.stringify(myObject)], srcobject, { type: 'application/json' });
    this.EventHTTPReceived[8] = false;
    this.waitHTTP(this.TabLoop[8], this.maxLoop, 8);
    this.ManageGoogleService.uploadObjectMetaPerso(this.configServer, srcbucket, file, srcobject, this.theForm.controls['metaControl'].value, this.theForm.controls['metaType'].value, this.tabMetaPerso)
      .subscribe(data => {
        if (data.type === 4 && data.status === 200) {
          console.log(JSON.stringify(data));
          this.returnFileContent = JSON.stringify(data);
          this.EventHTTPReceived[8] = true;
        }
      },
        err => {
          console.log('Upload of object and meaPerso failed ' + err.status);
          this.error = JSON.stringify(err);
          this.EventHTTPReceived[8] = true;
        });
  }


  saveObjectHTTP(srcbucket: any, srcobject: any, record: any) {
    var myObject: any;
    // check if must be used or not
    if (record.substring(0, 1) === "{") {
      myObject = JSON.parse(record);
    } else {
      myObject = record;
    }


    this.HTTP_Address = this.Google_Bucket_Access_RootPOST + srcbucket + this.GoogleObject_Option + srcobject;
    this.http.post(this.HTTP_Address, record, { headers: this.theHeadersAll })
      .subscribe(
        data => {
          console.log(JSON.stringify(data));
        },
        err => {
          console.log(JSON.stringify(err));
        })
  }

  waitHTTP(loop: number, max_loop: number, eventNb: number) {
    const pas = 500;
    if (loop % pas === 0) {
      console.log('waitHTTP ==> loop=' + loop + ' max_loop=' + max_loop);
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


  manageAuth() {


    const OAUTH_CLIENT = '699868766266-iimi67j8gvpnogsq45jul0fbuelecp4i.apps.googleusercontent.com';
    const OAUTH_SECRET = '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';



    const API_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    const HTTP_OPTIONSA = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
        , 'Authorization': 'Basic ' + btoa(OAUTH_CLIENT + ":" + OAUTH_SECRET)
      })
    };
    const HTTP_OPTIONSB = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'

      })
    };
    const theScope = "&scope=https://www.googleapis.com/auth/devstorage.read_write" // Manage your data in Google Cloud Storage
    //const theScope="https://www.googleapis.com/auth/devstorage.full_control"    // Manage your data and permissions in Google Cloud Storage
    //const theScope="&scope=https://storage.googleapis.com/storage/v1/b/config-xmvit"
    //const theScope="https://www.googleapis.com/auth/cloud-platform.read-only" // View your data across Google Cloud Platform services
    //const theScope="https://www.googleapis.com/auth/cloud-platform" // View and manage your data across Google Cloud Platform services

    const reDirect = "http://localhost:4200"
    const body = new HttpParams()
      .set('grant_type', 'client_credentials');

    //     &redirect_uri=http://localhost:4200

    this.http.post(API_URL + "?include_granted_scopes=true&response_type=code&access_type=offline" + theScope + "&client_id=" + OAUTH_CLIENT, HTTP_OPTIONSB)
      .subscribe(
        data => {
          console.log(JSON.stringify(data));
        },
        err => {
          console.log(JSON.stringify(err));
        });



    this.http.post(API_URL, body, HTTP_OPTIONSA)
      .subscribe(
        data => {
          console.log("========================");
          console.log(JSON.stringify(data));
        },
        err => {
          console.log("========================");
          console.log(JSON.stringify(err));
        })
  }


}
