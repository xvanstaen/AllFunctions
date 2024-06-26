import { Component, OnInit, ViewChild, AfterViewInit,SimpleChanges,
  Output, Input, HostListener, EventEmitter, ElementRef, } from '@angular/core';
import { FormGroup,UntypedFormControl, FormControl, Validators} from '@angular/forms';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";

import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMongoDBService } from 'src/app/CloudServices/ManageMongoDB.service';
import { LoginIdentif , configServer, classUserLogin } from './JsonServerClass';
import { EventAug, configPhoto, StructurePhotos } from './JsonServerClass';
import { environment } from 'src/environments/environment';
import { classCredentials} from './JsonServerClass';
import { mainClassConv,mainConvItem, mainRecordConvert, mainClassUnit} from './ClassConverter';
import { classAccessFile } from './classFileSystem';

import { fillConfig } from './copyFilesFunction';
import { fnAddTime } from './MyStdFunctions';
import { isArray } from 'chart.js/dist/helpers/helpers.core';
import { fillCredentials } from './copyFilesFunction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  
  constructor(
    private ManageGoogleService: ManageGoogleService,
    private ManageMongoDB: ManageMongoDBService,
    private elementRef: ElementRef,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
   
    ) {}


      // import configuration files
      // access MongoDB
  configServer=new configServer;
  initConfigServer=new configServer;
  configServerChanges:number=0;
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
  credentialsFS = new classCredentials;
  credentialsMongo = new classCredentials;
  isCredentials:boolean=false;
  myParams={server:"", scope:"test"};

  theForm: FormGroup = new FormGroup({ 
    userId: new FormControl({value:'', disabled:false}, { nonNullable: true }),
    psw: new FormControl({value:'', disabled:false}, { nonNullable: true }),
  });

  isNewUser:boolean=true;
  selectApps:number=0;
  dictionaryOnly:boolean=false;
  IpAddress:string="";
  bearerAuthorisation:string="";
  theNumber:string="";
  isIdRetrieved:boolean=false;
  saveServerUsrId:number=0;
  inputSelect:number=0;
  isAppsSelected:boolean=false;
  errorMsg:string="";
  isResetServer:boolean=false;

  @Input() LoginTable_User_Data:Array<EventAug>=[];
  @Input() LoginTable_DecryptPSW:Array<string>=[];

  inData=new classAccessFile;
  tabServers: Array<string> = [
    'http://localhost:8080', 'https://test-server-359505.uc.r.appspot.com',
    'https://xmv-it-consulting.uc.r.appspot.com', 'https://serverfs.ue.r.appspot.com'
  ]

  saveGoogleServer:string="";

  ngOnInit(){
   // const snapshotParam = this.route.snapshot.paramMap.get("server");
   // console.log('snapshotParam=' + JSON.stringify(snapshotParam))

  // http://localhost:4200/?server=8080&scope=test 
   // http://localhost:4200/?server=XMV&scope=prod 

   this.initConfigServer.googleServer=this.tabServers[2];
   this.initConfigServer.mongoServer=this.tabServers[1];
   this.initConfigServer.fileSystemServer=this.tabServers[3];
    this.route.queryParams
      .subscribe(params => {
        console.log(params); 
        console.log(JSON.stringify(params));
        this.myParams.server = params['server'];
        this.myParams.scope = params['scope'];
        this.http.get("http://api.ipify.org/?format=json").subscribe(
          (res:any)=>{
              this.IpAddress = res.ip;
          }, err=> {console.log("issue to retrieve ipAddress" + err)});

        this.RetrieveConfig();        
      }
    );
  }

      // this is for allFunctions only so that test BackendServer is used


  getServerNames(event:any){
    this.initConfigServer.googleServer=event.google;;
    this.initConfigServer.mongoServer=event.mongo;
    this.initConfigServer.fileSystemServer=event.fileSystem;
    this.configServer.googleServer = this.initConfigServer.googleServer;
    this.configServer.mongoServer = this.initConfigServer.mongoServer;
    this.configServer.fileSystemServer = this.initConfigServer.fileSystemServer;
    this.configServerChanges++;
  }
  
  RetrieveConfig(){
    console.log('RetrieveConfig()');
    var test_prod='';
        
  
    /**
    if (this.myParams.server==="8080"){
          this.initConfigServer.googleServer='http://localhost:8080';
          this.initConfigServer.mongoServer='http://localhost:8080';
          this.initConfigServer.fileSystemServer='http://localhost:8080';

    } else  if (this.myParams.server==="XMV"){
          this.initConfigServer.googleServer='https://xmv-it-consulting.uc.r.appspot.com';
          this.initConfigServer.mongoServer='https://xmv-it-consulting.uc.r.appspot.com';
          this.initConfigServer.fileSystemServer='https://xmv-it-consulting.uc.r.appspot.com';
            
    } else {
          this.initConfigServer.googleServer='https://test-server-359505.uc.r.appspot.com';
          this.initConfigServer.mongoServer='https://test-server-359505.uc.r.appspot.com';
          this.initConfigServer.fileSystemServer='https://test-server-359505.uc.r.appspot.com';
    }
     */
    if (this.myParams.scope==="prod"){
        test_prod='prod';
    } else {
        test_prod='test';
    }
      
    this.initConfigServer.test_prod=test_prod; // retrieve the corresponding record test or production
    this.initConfigServer.GoogleProjectId='ConfigDB';
    
    this.ManageMongoDB.findConfig(this.initConfigServer, 'configServer')
     // this.ManageMongoDB.findConfigbyURL(this.initConfigServer, 'configServer', '')
      .subscribe(
        data => {
         // test if data is an array if (Array.isArray(data)===true){}
         //     this.configServer=data[0];
       

        if (Array.isArray(data) === false){
          this.configServer = fillConfig(data);
        } else {
          for (let i=0; i<data.length; i++){
              if (data[i].title==="configServer" && data[i].test_prod===test_prod){
                  //this.configServer = data[i];
                  this.configServer = fillConfig(data[i]);
              } 
            }
        }
        
        this.configServer.googleServer = this.initConfigServer.googleServer;
        this.configServer.mongoServer = this.initConfigServer.mongoServer;
        this.configServer.fileSystemServer = this.initConfigServer.fileSystemServer;
        this.configServer.IpAddress=this.IpAddress;
        this.configServer.test_prod= this.initConfigServer.test_prod;
        this.configServer.project="AllFunctions";
        this.saveGoogleServer = this.configServer.googleServer;
        //this.configServer.project=this.initConfigServer.project;
          //this.getTokenOAuth2();
          if (this.credentials.access_token===""){
            this.getServerUsrId('Google');
        }  
        if (this.credentialsMongo.access_token===""){
            this.getServerUsrId('Mongo');
        }  
        if (this.credentialsFS.access_token===""){
            this.getServerUsrId('FS');
        } 
        
        this.isConfigServerRetrieved=true;
        },
        error => {
          console.log('error to retrieve the configuration file ;  error = ', error);
        });
  }


  getCredentialsFS(){
    const theServer='fileSystem';
    this.ManageGoogleService.getFSCredentials(this.configServer)
        .subscribe(
            (data ) => {
              this.credentialsFS.creationDate = data.credentials.creationDate;
              this.credentialsFS.userServerId = data.credentials.userServerId
              console.log('getCredentials server='+theServer +' '+JSON.stringify(data));
            },
            err => {
              console.log("return from getCredentials() for server '" + theServer + "' with error = "+ err.status);
            });
    }
  

    getServerUsrId(serverType:any){
      console.log('getCredentials()');
      
      if (serverType==='Mongo'){
          this.configServer.googleServer = this.configServer.mongoServer;
      } else if (serverType==='FS'){
        this.configServer.googleServer = this.configServer.fileSystemServer
      }
      //this.ManageGoogleService.getCredentials(this.configServer  )
      this.ManageGoogleService.getNewServerUsrId (this.configServer  )
      .subscribe(
          (data ) => {
            if (serverType==='Google'){
              this.configServer.googleServer = this.saveGoogleServer;
              this.credentials = fillCredentials(data.credentials);
            } else if (serverType==='Mongo'){
                this.credentialsMongo = fillCredentials(data.credentials);
            } else if (serverType==='FS'){
                this.credentialsFS = fillCredentials(data.credentials);
            }
            this.isCredentials=true;
  
          },
          err => {
            console.log('return from requestToken() with error = '+ JSON.stringify(err));
            });
    }

  
  
  assignNewServerUsrId(){
    this.ManageGoogleService.getNewServerUsrId(this.configServer)
    .subscribe(
        (data ) => {
            this.credentials.userServerId=data.credentials.userServerId;
            this.saveServerUsrId=data.credentials.userServerId;
          },
          err => {

          }
    )
  }

  onInput(event:any){
      this.inputSelect=Number(event.target.value);
      this.selectApps=0;
      this.selHealthFunction=0;
      this.dictionaryOnly=false;
      this.isAppsSelected=false;
  }

  onSelectApps(){
    this.isAppsSelected=true;
    this.selectApps=this.inputSelect;
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

  fnResetServer(){
    /*
    this.isCredentials=false;
    this.isResetServer=true;
    this.isIdRetrieved=false;
    this.getDefaultCredentials(event);
    this.assignNewServerUsrId();
    */
  }

  changeServerName(event:any){
    if (event==="Google"){
      this.getServerUsrId('Google');
    }  
    if (event==="Mongo"){
        this.getServerUsrId('Mongo');
    }  
    if (event==="FS"){
        this.getServerUsrId('FS');
    } 
}    

  fnNewCredentials(credentials:any){
    this.isResetServer=true;
    this.credentials=credentials;

  }


  validateIdentification(){
    this.errorMsg="";
    if (this.theForm.controls['userId'].value !== '' && this.theForm.controls['psw'].value !== '' ){
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


isGetLogin:boolean=false;
  getLogin(userId:string,psw:string){
    this.isGetLogin=true;
    this.errorMsg="retrieving your information .... is in progress";
    this.ManageGoogleService.encryptAllFn(this.configServer,psw, 1, 'AES', 'Yes')
      .subscribe((data ) => { 
        if (data.status===undefined){
          this.configServer.userLogin.id=userId;
          this.configServer.userLogin.psw=data.response;
          this.configServer.userLogin.accessLevel="";
          this.checkLogin();
        } else {
          this.errorMsg = data.msg;
        }
        this.isGetLogin=false;
      },
      err => {
        this.errorMsg = err.msg;
        this.isGetLogin=false;
      })


  }

  checkLogin(){
    this.ManageGoogleService.checkLogin(this.configServer)
        .subscribe((data ) => {    
            if (data.status===undefined){ 
              this.getUserAccessLevel();
              this.identification=data;
              this.isIdRetrieved=true;
              
              this.identification.userServerId=this.credentialsFS.userServerId;
              this.identification.credentialDate=this.credentialsFS.creationDate;
              this.identification.IpAddress=this.configServer.IpAddress;
              this.errorMsg="";
            

// TO BE DELETED
if (this.configServer.userLogin.accessLevel==="High" || this.configServer.userLogin.accessLevel==="Very High"){
    this.selectApps=16;
    //this.selHealthFunction=5
    this.isAppsSelected=true;
}


        //
              console.log("isResetServer= "+this.isResetServer + "  isIdRetrieved=" + this.isIdRetrieved + "  isConfigServerRetrieved=" + this.isConfigServerRetrieved)
            } else {
              this.errorMsg='invalid user-id/password';
            }
        //
      },
        err=> {
          console.log('error to checkLogin - error status=' + err.status + ' '+ err.message );
          this.errorMsg="Identification failed; update the fields";
        })
  }

  getUserAccessLevel(){
    this.ManageGoogleService.getSecurityAccess(this.configServer )
    .subscribe((data ) => {  
          if (data.status===200){
            this.configServer.userLogin.accessLevel = data.accessLevel;
          } else {
            this.errorMsg=data.msg
          }
      },
      err =>{
          console.log('getSecurityAccess  error ' + err);
          this.errorMsg="Server problem. Lower level of access has been assigned"
      });
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

      /*
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
      
      */ 
 

}

