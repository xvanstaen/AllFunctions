import { Component, OnInit , Input, Output, HostListener,  OnDestroy, HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID} from '@angular/core';
  
// angular-google-auth2
//import {AuthService} from 'angular-google-auth2';

import { Buffer } from 'buffer';

import { DatePipe, formatDate } from '@angular/common'; 

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';

import { BucketList, Bucket_List_Info, OneBucketInfo, classCredentials } from '../JsonServerClass';

// configServer is needed to use ManageGoogleService
// it is stored in MangoDB and accessed via ManageMangoDBService

import {msginLogConsole} from '../consoleLog'
import { configServer,LoginIdentif, msgConsole } from '../JsonServerClass';

import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import {AccessConfigService} from 'src/app/CloudServices/access-config.service';

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

  HTTP_Address:string='https://storage.googleapis.com/upload/storage/v1/b/config-xmvit/o?uploadType=media&name=unloadfileSystem&metadata={cache-control:no-cache,no-store,max-age=0}';
  HTTP_AddressPOST:string='';
  Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
  Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';

  GoogleObject_Option:string='/o?uploadType=media&name='
  GoogleObject_MetadataStart:string='&metadata={'
  GoogleObject_MetadataEnd:string='&metadata={'

  cacheControl:string='cache-control:no-cache,no-store,max-age=0';
  authorization:string='Bearer';
  contentTypeJson:string='application/json';
  contentTypeurlencoded:string='application/x-www-form-urlencoded';
  accept:string='application/json';

  theHeadersAll = new HttpHeaders( { 
    "Authorization" : "",    
    "Content-Type" : "",
    "Accept": "", 
                  }  );



 

  TabBuckets=[{name:''}];
  myListOfObjects=new Bucket_List_Info;
  oneMetadata=new OneBucketInfo;

  bucket_data:string='';
  
  DisplayListOfObjects:boolean=false;
  Error_Access_Server:string='';

  fileRecord:any;
  isConfirmedSave:boolean=false;
  isGetMetadata:boolean=false;
  isGetAllMetadata:boolean=false;

  EventHTTPReceived:Array<boolean>=[];
  maxEventHTTPrequest:number=20;
  id_Animation:Array<number>=[];
  TabLoop:Array<number>=[];
  maxLoop:number=5000;


  theForm: FormGroup = new FormGroup({ 
    server: new FormControl({value:'HTTP', disabled:false}, { nonNullable: true }),
    srcBucket: new FormControl({value:'mynonprivatebucket', disabled:false}, { nonNullable: true }),
    srcObject: new FormControl({value:'aconfigfile', disabled:false}, { nonNullable: true }),
    destBucket: new FormControl({value:'', disabled:false}, { nonNullable: true }),
    destObject: new FormControl({value:'', disabled:false}, { nonNullable: true }),
    action: new FormControl({value:'', disabled:false}, { nonNullable: true }),
    fileContent: new FormControl({value:'', disabled:false}, { nonNullable: true }),
  });

  tabAction:Array<string>=['cancel','listBuckets', 'listObjects', 'getFileContent','getListMetadata','getMetadata', 'updateMetadata', 'saveObject',  'renameObject', 'copyObject', 'moveObject', 'delObject'];
  //   'delBucket'
  actionDropdown:boolean=false;
  returnFileContent:any;
  error:any;
  currentAction:string="";

  ngOnInit(){
    this.configServer.baseUrl='http://localhost:8080';
    console.log('ngOnInit');
    for (var i=0; i<this.maxEventHTTPrequest; i++){
      this.TabLoop[i]=0;
      this.EventHTTPReceived[i]=false;
    }

    if (this.credentials.access_token!==undefined || this.credentials.access_token!==""){
          this.authorization = 'Bearer ' +    this.credentials.access_token;
          this.theHeadersAll = new HttpHeaders( { 
            "Authorization" : this.authorization,    
            "Content-Type" : this.contentTypeJson,
            "Accept": this.accept, 
           }  );
    }


  }


  requestToken(){

    this.EventHTTPReceived[9]=false;
    this.waitHTTP(this.TabLoop[9], this.maxLoop, 9);
    this.ManageGoogleService.getTokenOAuth2(this.configServer  )
    .subscribe((data ) => {
            console.log(JSON.stringify(data));
            this.EventHTTPReceived[9]=true;
        },
        err => {
            console.log(JSON.stringify(err))
            this.EventHTTPReceived[9]=true;
          });

  }

 
  onAction(){
    console.log('onAction');
    this.actionDropdown=true;
  }

  selectAction(event:any){
    this.actionDropdown=false;
    this.error="";
    this.returnFileContent="";
    this.currentAction=event.target.textContent.trim();
    if (event.target.textContent.trim()!=="cancel"){
        this.theForm.controls['action'].setValue(event.target.textContent.trim());
        if (event.target.textContent.trim()==='listBuckets'){
          this.getListBuckets();

        }  else if (event.target.textContent.trim()==='listObjects'){
          this.getListObjects(this.theForm.controls['srcBucket'].value);

        } else if (event.target.textContent.trim()==='getFileContent'){
          if (this.theForm.controls['server'].value==='HTTP'){
              this.getFileContentHTTP(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);

          } else {
            this.getFileContent(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);

          }

        } else if (event.target.textContent.trim()==='getListMetadata'){
          this.listMetaDataObject(this.theForm.controls['srcBucket'].value);

        } else if (event.target.textContent.trim()==='getMetadata'){
              this.getMetaData(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);

        } else if (event.target.textContent.trim()==='updateMetadata'){
            this.updateMetaData(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value);

        } else if (event.target.textContent.trim()==='copyObject'){
            this.copyObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value,this.theForm.controls['destBucket'].value, this.theForm.controls['destObject'].value);

        } else if (event.target.textContent.trim()==='moveObject'){
          this.moveObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value,this.theForm.controls['destBucket'].value, this.theForm.controls['destObject'].value);
          

        } else if (event.target.textContent.trim()==='saveObject'){
          
          this.isConfirmedSave=true;
        } else {
          this.error='ACTION UNKNOWN';
        }
    }

  }

  confirmSave(event:any){
    this.isConfirmedSave=false;
   
    if (event.target.id==="Save"){
      if (this.theForm.controls['server'].value==='HTTP'){
          this.saveObjectHTTP(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value,this.theForm.controls['fileContent'].value);
       } else {
          this.saveObject(this.theForm.controls['srcBucket'].value, this.theForm.controls['srcObject'].value,this.theForm.controls['fileContent'].value);
      }
    } else {this.currentAction="";}
    
  }

  reinitialise(){
    console.log('reinitialise');
    this.theForm.controls['srcBucket'].setValue('mynonprivatebucket');
    this.theForm.controls['srcObject'].setValue('aconfigfile');
    this.theForm.controls['destBucket'].setValue('');
    this.theForm.controls['destObject'].setValue('');
    this.theForm.controls['fileContent'].setValue('');
    this.theForm.controls['action'].setValue('');
    this.error="";
    this.returnFileContent="";
    this.currentAction="";
  }

  getListBuckets(){
    this.EventHTTPReceived[0]=false;
    this.waitHTTP(this.TabLoop[0], this.maxLoop, 0);
    this.ManageGoogleService.getListBuckets(this.configServer )
    .subscribe((data ) => {
            //console.log(JSON.stringify(data));
            this.returnFileContent=JSON.stringify(data);
            this.TabBuckets=data;
            this.EventHTTPReceived[0]=true;
        },
        err => {
            //console.log('Metaobject not retrieved ' + err.status);
            this.error=JSON.stringify(err);
          });
  } 

  getListObjects(bucket:any){
    this.EventHTTPReceived[1]=false;
    this.waitHTTP(this.TabLoop[1], this.maxLoop, 1);
    this.ManageGoogleService.getListObjects(this.configServer , bucket )
    .subscribe((data ) => {
            //console.log(JSON.stringify(data));
            this.myListOfObjects.items=data;
            this.returnFileContent=JSON.stringify(data);
            this.EventHTTPReceived[1]=true;
        },
        err => {
            //console.log('Metaobject not retrieved ' + err.status);
            this.error=JSON.stringify(err);
            this.EventHTTPReceived[1]=true;
          });
  } 

  getFileContent(bucket:any, object:any){
    this.EventHTTPReceived[2]=false;
    this.waitHTTP(this.TabLoop[2], this.maxLoop, 2);
      this.ManageGoogleService.getContentObject(this.configServer, bucket, object )
          .subscribe((data ) => {  
            //console.log(JSON.stringify(data)); 
            this.returnFileContent=JSON.stringify(data);
            this.EventHTTPReceived[2]=true;
          },
            err => {
                //console.log('Metaobject not retrieved ' + err.status);
                this.error=JSON.stringify(err);
                this.EventHTTPReceived[2]=true;
              });
      }

  getFileContentHTTP(bucket:any, object:any){
    this.EventHTTPReceived[2]=false;
    this.waitHTTP(this.TabLoop[2], this.maxLoop, 2);
    this.HTTP_Address='https://storage.googleapis.com/download/storage/v1/b/' + bucket + '/o/' + object +'?alt=media' ;
    //this.HTTP_Address=this.Google_Bucket_Access_Root+bucket+this.GoogleObject_Option+object;
    this.http.get(this.HTTP_Address,  {headers: this.theHeadersAll})
          .subscribe((data ) => {  
            //console.log(JSON.stringify(data)); 
            this.returnFileContent=JSON.stringify(data);
            this.EventHTTPReceived[2]=true;
          },
            err => {
                //console.log('Metaobject not retrieved ' + err.status);
                this.error=JSON.stringify(err);
                this.EventHTTPReceived[2]=true;
              });
      }

  listMetaDataObject(bucket:any){
    this.EventHTTPReceived[3]=false;
    this.waitHTTP(this.TabLoop[3], this.maxLoop, 3);
    this.ManageGoogleService.getListMetaObjects(this.configServer, bucket )
    .subscribe((data ) => {
            //console.log(JSON.stringify(data));
            this.myListOfObjects.items.splice(0,this.myListOfObjects.items.length);
            for (var i=0; i<data.length; i++){
                const metadata = new OneBucketInfo;
                this.myListOfObjects.items.push(metadata);
                this.myListOfObjects.items[i]=data[i].items;
            }
            this.returnFileContent=JSON.stringify(data);
            this.EventHTTPReceived[3]=true;
        },
        err => {
            //console.log('Metaobject not retrieved ' + err.status);
            this.error=JSON.stringify(err);
            this.EventHTTPReceived[3]=true;
          });
  }


  getMetaData(bucket:any, object:any){
    this.EventHTTPReceived[4]=false;
    this.waitHTTP(this.TabLoop[4], this.maxLoop, 4);
    this.ManageGoogleService.getMetaObject(this.configServer, bucket, object )
    .subscribe(
        (data ) => {
          this.oneMetadata=data;
          this.returnFileContent=JSON.stringify(data);
          this.EventHTTPReceived[4]=true;
        },
        err => {
            //console.log('Metaobject not retrieved ' + err.status);
            this.error=JSON.stringify(err);
            this.EventHTTPReceived[4]=true;
        });
  }

  updateMetaData(bucket:any, object:any){
    const newMetadata = {
      cacheControl: 'public,max-age=0,no-cache,no-store',
      contentType: 'application/json'
    };
    this.EventHTTPReceived[5]=false;
    this.waitHTTP(this.TabLoop[5], this.maxLoop, 5);
    this.ManageGoogleService.updateMetadata(this.configServer, bucket, object, newMetadata)
      .subscribe(
        (data ) => {
            if (data.type===4 && data.status===200 ){
              this.returnFileContent=JSON.stringify(data);
            }  
            this.EventHTTPReceived[5]=true;
          },
        err => {
              //console.log('Metadata not updated for unloadfileSystem');
              this.error=JSON.stringify(err);
              this.EventHTTPReceived[5]=true;
          }); 
  }

  moveObject(srcbucket:any,srcobject:any,destbucket:any,destobject:any){
    this.EventHTTPReceived[7]=false;
    this.waitHTTP(this.TabLoop[7], this.maxLoop, 7);
    this.ManageGoogleService.moveObject(this.configServer, srcbucket,destbucket,srcobject,destobject)
    .subscribe(
      (data ) => {
         this.returnFileContent=JSON.stringify(data);
         this.EventHTTPReceived[7]=true;
      },
      err => {
          //console.log('Error to copy ' + err.status);
          this.error=JSON.stringify(err);
          this.EventHTTPReceived[7]=true;
      });
  }

  copyObject(srcbucket:any,srcobject:any,destbucket:any,destobject:any){
    this.EventHTTPReceived[6]=false;
    this.waitHTTP(this.TabLoop[6], this.maxLoop, 6);
    this.ManageGoogleService.copyObject(this.configServer, srcbucket,destbucket,srcobject,destobject)
    .subscribe(
      (data ) => {
         this.returnFileContent=JSON.stringify(data);
         this.EventHTTPReceived[6]=true;
      },
      err => {
          //console.log('Error to move ' + err.status);
          this.error=JSON.stringify(err);
          this.EventHTTPReceived[6]=true;
      });
  }



  saveObject(srcbucket:any, srcobject:any, record:any){

      var myObject:any;
      if (record.substring(0,1)==="{"){
        myObject=JSON.parse(record);
      } else {
        myObject=record;
      }
     
      var file=new File ([JSON.stringify(myObject)], srcobject, {type: 'application/json'});
      this.EventHTTPReceived[8]=false;
      this.waitHTTP(this.TabLoop[8], this.maxLoop, 8);
      this.ManageGoogleService.uploadObject(this.configServer, srcbucket, file ,srcobject)
        .subscribe(data => {
          if (data.type===4 && data.status===200 ){
              console.log(JSON.stringify(data));
              this.returnFileContent=JSON.stringify(data);
              this.EventHTTPReceived[8]=true;
          }
        },
          err => {
              console.log('Metaobject not retrieved ' + err.status);
              this.error=JSON.stringify(err);
              this.EventHTTPReceived[8]=true;
            });
      }
      

saveObjectHTTP(srcbucket:any, srcobject:any, record:any){
  var myObject:any;
  // check if must be used or not
  if (record.substring(0,1)==="{"){
    myObject=JSON.parse(record);
  } else {
    myObject=record;
  } 


  this.HTTP_Address=this.Google_Bucket_Access_RootPOST+srcbucket+this.GoogleObject_Option+srcobject;
  this.http.post(this.HTTP_Address, record , {headers: this.theHeadersAll})
      .subscribe(
        data => {
          console.log(JSON.stringify(data));
      },
        err => {
          console.log(JSON.stringify(err));
      })
}

waitHTTP(loop:number, max_loop:number, eventNb:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('waitHTTP ==> loop=' + loop + ' max_loop=' + max_loop);
  }
 loop++
  
  this.id_Animation[eventNb]=window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop, eventNb));
  if (loop>max_loop || this.EventHTTPReceived[eventNb]===true ){
            console.log('exit waitHTTP ==> loop=' + loop + ' max_loop=' + max_loop + ' this.EventHTTPReceived=' + 
                    this.EventHTTPReceived[eventNb] );
            //if (this.EventHTTPReceived[eventNb]===true ){
                    window.cancelAnimationFrame(this.id_Animation[eventNb]);
            //}    
      }  
  }


  manageAuth(){

 
     const OAUTH_CLIENT = '699868766266-iimi67j8gvpnogsq45jul0fbuelecp4i.apps.googleusercontent.com';
     const OAUTH_SECRET='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';
     

     
     const API_URL= "https://accounts.google.com/o/oauth2/v2/auth";
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
     const theScope="&scope=https://www.googleapis.com/auth/devstorage.read_write" // Manage your data in Google Cloud Storage
     //const theScope="https://www.googleapis.com/auth/devstorage.full_control"    // Manage your data and permissions in Google Cloud Storage
     //const theScope="&scope=https://storage.googleapis.com/storage/v1/b/config-xmvit"
     //const theScope="https://www.googleapis.com/auth/cloud-platform.read-only" // View your data across Google Cloud Platform services
     //const theScope="https://www.googleapis.com/auth/cloud-platform" // View and manage your data across Google Cloud Platform services
     
     const reDirect="http://localhost:4200"
     const body = new HttpParams()
         .set('grant_type', 'client_credentials');
 
    //     &redirect_uri=http://localhost:4200
 
     this.http.post(API_URL+"?include_granted_scopes=true&response_type=code&access_type=offline"+theScope+"&client_id="+OAUTH_CLIENT,  HTTP_OPTIONSB)
         .subscribe(
           data => {
             console.log(JSON.stringify(data));
         },
           err => {
             console.log(JSON.stringify(err));
         });
 
        
 
     this.http.post(API_URL , body ,    HTTP_OPTIONSA )
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
