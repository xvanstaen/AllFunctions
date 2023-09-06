import { Component, OnInit, ViewChild, AfterViewInit,SimpleChanges,
  Output, Input, HostListener, EventEmitter, ElementRef, } from '@angular/core';
import { FormGroup,UntypedFormControl, FormControl, Validators} from '@angular/forms';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";

import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { LoginIdentif , configServer } from './JsonServerClass';
import { environment } from 'src/environments/environment';
import { classCredentials} from './JsonServerClass'
import {mainClassConv,mainConvItem, mainRecordConvert, mainClassUnit} from './ClassConverter';
import { classAccessFile } from './classFileSystem';


import { fnAddTime } from './MyStdFunctions'
import { isArray } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  
  constructor(
    private ManageGoogleService: ManageGoogleService,
    private ManageMangoDB: ManageMangoDBService,
    private elementRef: ElementRef,
    private http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
   
    ) {}


      // import configuration files
      // access MongoDB
  configServer=new configServer;
  //XMVConfig=new XMVConfig;
  isConfigServerRetrieved:boolean=false;
  identification=new LoginIdentif;
  ConvertUnit=new mainClassConv;
  ConvToDisplay=new mainConvItem;
  theTabOfUnits=new mainClassUnit;
  WeightRefTable=new mainRecordConvert;
  convertOnly:boolean=true;
  selHealthFunction:number=0;
  credentials = new classCredentials;
  myParams={code:"", scope:""};
  isCredentials:boolean=false;
  theForm: FormGroup = new FormGroup({ 
    userId: new FormControl({value:'', disabled:false}, { nonNullable: true }),
    psw: new FormControl({value:'', disabled:false}, { nonNullable: true }),
  });


  ngOnInit(){
    //const snapshotParam = this.route.snapshot.paramMap.get("animal");
    //console.log('snapshotParam=' + JSON.stringify(snapshotParam))
    this.route.queryParams
      .subscribe(params => {
        console.log(params); 
        console.log(JSON.stringify(params));
        
        this.myParams.code = params['code'];
        this.myParams.scope = params['scope'];
        
      }
    );
      console.log('getIpAddress');
      this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
        this.IpAddress = res.ip;
      });

    this.RetrieveConfig();
  }
  
inData=new classAccessFile;
  RetrieveConfig(){
    console.log('RetrieveConfig()');
        if (environment.production === false){
          test_prod='test';
      }
      // var test_prod='prod';
      var test_prod='test';  // this is for allFunctions only so that test BackendServer is used
      var InitconfigServer=new configServer;
      //InitconfigServer.baseUrl='http://localhost:8080';
      InitconfigServer.baseUrl='https://test-server-359505.uc.r.appspot.com';
      InitconfigServer.test_prod=test_prod;
      InitconfigServer.GoogleProjectId='ConfigDB';
      this.ManageMangoDB.findConfig(InitconfigServer, 'configServer')
     // this.ManageMangoDB.findConfigbyURL(InitconfigServer, 'configServer', '')
      .subscribe(
        data => {
         // test if data is an array if (Array.isArray(data)===true){}
         //     this.configServer=data[0];
       

        if (Array.isArray(data) === false){
          this.configServer = data;
        } else {

 
          for (let i=0; i<data.length; i++){
              if (data[i].title==="configServer" && data[i].test_prod===test_prod){
                  this.configServer = data[i];
              } }
            }

    // this.configServer.baseUrl='http://localhost:8080';
          this.configServer.IpAddress=this.IpAddress;
          console.log('configServer is retrieved');
          //this.getTokenOAuth2();
          if (this.credentials.access_token===""){
                this.getDefaultCredentials();
          } 
        },
        error => {
          console.log('error to retrieve the configuration file ;  error = ', error);
         
        });
  }

  selectApps:number=0;
  dictionaryOnly:boolean=false;
  IpAddress:string="";
  bearerAuthorisation:string="";

  getTokenOAuth2(){

    console.log('requestToken()');
    this.ManageGoogleService.getTokenOAuth2(this.configServer  )
    .subscribe(
        (data ) => {
          console.log('return from requestToken() with no error');
            console.log(JSON.stringify(data));
          
        },
        err => {
          console.log('return from requestToken() with error');
            console.log(JSON.stringify(err));
          });

  }

  theNumber:string="";
  isIdRetrieved:boolean=false;
  
  getDefaultCredentials(){

    this.ManageGoogleService.getDefaultCredentials(this.configServer  )
    .subscribe(
        (data ) => {
          this.credentials.access_token=data.credentials.access_token;
          this.credentials.id_token=data.credentials.id_token
          this.credentials.refresh_token=data.credentials.refresh_token
          this.credentials.token_type=data.credentials.token_type;
          this.credentials.userServerId=data.credentials.userServerId;
          this.credentials.creationDate=data.credentials.creationDate;
          // this.getInfoToken(); // this is a test

          this.isCredentials=true;
          if (this.isResetServer===true){
            this.isResetServer=false;
            this.getLogin(this.theForm.controls['userId'].value,this.theForm.controls['psw'].value);
          };
        },
        err => {
          console.log('return from requestToken() with error = '+ JSON.stringify(err));
          });
  }

  getInfoToken(){
    console.log('getInfoToken()');
    this.ManageGoogleService.getInfoToken(this.configServer, this.credentials.access_token  )
    .subscribe(
        (data ) => {
            console.log(JSON.stringify(data));
            //this.tokenValues=data.tokenValues;
        },
        err => {
            console.log('return from getInfoToken() with error');
            console.log(JSON.stringify(err));
          });
  }

  onInput(event:any){
      this.selectApps=Number(event.target.value);
      this.dictionaryOnly=false;
      this.isAppsSelected=false;
      if (this.selectApps===11){
        this.selHealthFunction=5;
      } else if (this.selectApps===12){
        this.selHealthFunction=3;
      } else if (this.selectApps===13){
        this.selHealthFunction=7;
      }  else if (this.selectApps===15){
        this.dictionaryOnly=true;
      }else{
        this.selHealthFunction=0
      } 
  }

  isAppsSelected:boolean=false;
  onSelectApps(){
    this.isAppsSelected=true;
  }

  errorMsg:string="";

  isResetServer:boolean=false;

  resetServer(){
    this.isCredentials=false;
    this.isResetServer=true;
    this.isIdRetrieved=false;
    this.getDefaultCredentials();
  }

  validateIdentification(){
    this.errorMsg="";

    if (this.theForm.controls['userId'].value !== '' && this.theForm.controls['psw'].value){
      if (this.isCredentials===true){
        this.getLogin(this.theForm.controls['userId'].value,this.theForm.controls['psw'].value);
      }
      else {
          this.errorMsg="Configuration file not completely processed yet; submit again";
      }
    } else {
      this.errorMsg="Fill-in both fields";
    }
  }

  clearForm(){
    this.theForm.controls['userId'].setValue('');
    this.theForm.controls['psw'].setValue('');
  }

  ReceiveFiles(event:any){

    if (event.fileType!=='' && 
            event.fileType===this.identification.configFitness.fileType.convertUnit){ 
        this.ConvertUnit=event;
    } else if (event.fileType!=='' && 
            event.fileType===this.identification.configFitness.fileType.convToDisplay){ 
         this.ConvToDisplay=event;
  
    } else if (event.fileType!=='' && 
            event.fileType===this.identification.configFitness.fileType.tabOfUnits){ 
        this.theTabOfUnits=event;
  
    } else if (event.fileType!=='' && 
          event.fileType===this.identification.configFitness.fileType.weightReference){ 
        this.WeightRefTable=event;
      } 
  }



  getLogin(object:string,psw:string){
    // this.ManageGoogleService.getContentObject(this.configServer, Bucket, GoogleObject )
    this.errorMsg="retrieving your information .... in progress";
    this.ManageGoogleService.checkLogin(this.configServer, object, psw )
        .subscribe((data ) => {    
            this.identification=data;
            this.isIdRetrieved=true;
            this.isConfigServerRetrieved=true;
            this.identification.IpAddress=this.IpAddress;
            this.identification.userServerId=this.credentials.userServerId;
            this.identification.credentialDate=this.credentials.creationDate;
            this.errorMsg="";
      },
        err=> {
          console.log('error to checkLogin - error status=' + err.status + ' '+ err.message );
          this.errorMsg="Identification failed; update the fields";
        })
  }

  getFileContentHTTP(bucket:any, object:any){

    const theBearer = 'Bearer ' +    this.credentials.access_token;
    const theHeaders = new HttpHeaders( { 'Authorization': theBearer,
    'Content-Type' : 'application/json', "Accept": "application/json", 
              }  );
    const HTTP_Address='https://storage.googleapis.com/download/storage/v1/b/' + bucket + '/o/' + object +'?alt=media' ;
    //const HTTP_Address='https://storage.googleapis.com/storage/v1/b/' + bucket + '/o' + object +'?alt=media&name=' ;
    this.http.get(HTTP_Address,  {headers: theHeaders})
          .subscribe((data ) => {  
            console.log(JSON.stringify(data)); 
          },
            err => {
                console.log('File not retrieved ' + err.status  );
                if ( err.error!==undefined ){
                    console.log('Error = ' + ' ' + err.error.error.code  + ' ' + err.error.error.message)
                }
              });
      }   

}

