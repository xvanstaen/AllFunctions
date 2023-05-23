import { Component, OnInit , Input, Output, HostListener, OnChanges, HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID} from '@angular/core';
  
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import {Bucket_List_Info} from '../JsonServerClass';
import { StructurePhotos } from '../JsonServerClass';
import { BucketExchange } from '../JsonServerClass';
import { XMVConfig } from '../JsonServerClass';
import { msginLogConsole } from '../consoleLog';
import { LoginIdentif } from '../JsonServerClass';
import { BucketList } from '../JsonServerClass';
import { environment } from 'src/environments/environment';
import { msgConsole } from '../JsonServerClass';
import { UserParam } from '../JsonServerClass';
import { OneBucketInfo } from '../JsonServerClass';
import { configServer } from '../JsonServerClass';


import {mainClassConv,mainConvItem, mainRecordConvert, mainClassUnit} from '../ClassConverter';
import {mainClassCaloriesFat, mainDailyReport} from '../Health/ClassHealthCalories';
import {ConfigFitness} from '../Health/ClassFitness';
import {classConfHTMLFitHealth} from '../Health/classConfHTMLTableAll';
import { classConfigChart, classchartHealth } from '../Health/classConfigChart';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';


@Component({
  selector: 'app-AdminJson',
  templateUrl: './AdminJson.component.html',
  styleUrls: ['./AdminJson.component.css']
})

export class AdminJsonComponent {
  @Output() returnFile= new EventEmitter<any>();
  @Input() ConfigCaloriesFat=new mainClassCaloriesFat;

  @Input() ConvertUnit=new mainClassConv;
  @Input() ConvToDisplay=new mainConvItem;
  @Input() theTabOfUnits=new mainClassUnit;
  @Input() WeightRefTable=new mainRecordConvert;
  @Input() ConfigHTMLFitHealth=new classConfHTMLFitHealth;
  @Input() ConfigChart=new classConfigChart;
  @Input() MyConfigFitness=new ConfigFitness;

  @Input() HealthAllData=new mainDailyReport; 

  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    private ManageGoogleService: ManageGoogleService,
    private ManageMangoDBService: ManageMangoDBService,
    ) {}

    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';

    myLogConsole:boolean=false;
    myConsole:Array< msgConsole>=[];
    returnConsole:Array< msgConsole>=[];
    SaveConsoleFinished:boolean=true;
    type:string='';


    EventHTTPReceived:Array<boolean>=[];
    id_Animation:Array<number>=[];
    TabLoop:Array<number>=[];

     // ACCESS TO GOOGLE STORAGE
    HTTP_AddressLog:string='';
    HTTP_Address:string='';
    myHeader=new HttpHeaders(); 
    bucket_data:string='';
    
    ListOfBucket=new BucketList;
    SelectedBucketInfo=new OneBucketInfo;

    TabBuckets=[{name:''}];

    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  
    Google_Bucket_Name:string=''; 
    Error_Access_Server:string='';

   
   
    Error_msgMongo:string='';
    RecordToWrite=new LoginIdentif;
    // https://storage.googleapis.com/storage/v1/b?project=xmv-it-consulting
    @Input() LoginTable_User_Data:Array<EventAug>=[];
    @Input() LoginTable_DecryptPSW:Array<string>=[];

    @Input() identification=new LoginIdentif;
    @Input() WeddingPhotos:Array<StructurePhotos>=[];
    @Input() ConfigXMV=new XMVConfig;
    @Input() configServer=new configServer;
   
    SelectedConfigFile=new XMVConfig;
    ModifConfigFile=new XMVConfig;
    fileRetrieved:boolean=false;

    GoToComponent:number=-1;
    ContentTodisplay:boolean=false;
    ModifyText:boolean=false;
    ModifiedField:Array<string>=[];
    IsFieldModified:Array<boolean>=[];
    Max_Fields:number=0;

    theReceivedData:any;
    isDataReceived:boolean=false;
    SpecificConfigFormat:string='';
    NbRefresh_Bucket:number=0;

    TabAppsAutho:Array<any>=[];
    Max_Apps:number=10;

    convertOnly:boolean=false;

@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


ngOnInit(){
      //this.LogMsgConsole('ngOnInit ManageJson ===== Device ' + navigator.userAgent + '======');

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.HTTP_AddressLog=this.Google_Bucket_Access_RootPOST + this.ConfigXMV.BucketConsole+ "/o?name="  ;
      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });
      this.EventHTTPReceived[0]=true;
      //this.waitHTTP(this.TabLoop[0], 20000, 0);
      
      //this.AccessMongo(); TESTING OF HTTP.POST
      this.getBucket();
      var i=0;
      for (i=0; i<this.Max_Apps; i++){
        this.TabAppsAutho[i]='N';
      }
      if (this.identification.apps[0]==='ALL'){
          for (i=0; i<this.Max_Apps; i++){
            this.TabAppsAutho[i]='Y';
          }
      } else {
          for (i=0; i<this.identification.apps.length; i++){
            if (this.identification.apps[i]==='Bucket')     {this.TabAppsAutho[0]='Y';}
            else if (this.identification.apps[i]==='Photos'){this.TabAppsAutho[1]='Y';}
            else if (this.identification.apps[i]==='27Aug'){this.TabAppsAutho[2]='Y';}
            else if (this.identification.apps[i]==='Contact'){this.TabAppsAutho[3]='Y';}
            else if (this.identification.apps[i]==='Login'){this.TabAppsAutho[4]='Y';}
            else if (this.identification.apps[i]==='Console'){this.TabAppsAutho[5]='Y';}
            else if (this.identification.apps[i]==='Config'){this.TabAppsAutho[6]='Y';}
            else if (this.identification.apps[i]==='Fitness'){this.TabAppsAutho[7]='Y';}
            else if (this.identification.apps[i]==='Health'){this.TabAppsAutho[8]='Y';}
            else if (this.identification.apps[i]==='ConvMgt'){this.TabAppsAutho[9]='Y';}
            else if (this.identification.apps[i]==='ConvFn'){this.TabAppsAutho[10]='Y';}
        }
      }

  }    
ActionMessage:string='';
Process(event:string){
  this.ActionMessage='';
  this.isDataReceived=false;
  this.ContentTodisplay=false;
  this.theReceivedData={};
  if (event==='Bucket'){
    this.GoToComponent=0;
    this.ActionMessage='Administration of Buckets';
  } else
  if (event==='Photos'){
    this.GoToComponent=1;
  } else if (event==='27Aug'){
    this.GoToComponent=2;
  
  } else if (event==='Contact'){
    this.GoToComponent=3;
  } else if (event==='Login'){
    this.ActionMessage='Administration of Logins';
    this.GoToComponent=4; 
    this.NbRefresh_Bucket=0;
    this.Google_Bucket_Name=this.ListOfBucket.Login;
  } else if (event==='Console'){
    this.GoToComponent=5;
    this.ActionMessage='Administration of Log Console';
    this.Google_Bucket_Name=this.ListOfBucket.Console;
  } else if (event==='Config'){
    this.ActionMessage='Administration of Configuration parameters';
    this.Google_Bucket_Name=this.ListOfBucket.Config;
    this.GoToComponent=6;
    this.scroller.scrollToAnchor('targetConfig');
  }   else if (event==='Fitness'){
    this.GoToComponent=7;
  } else if (event==='Health'){
      this.GoToComponent=8;
  } else if (event==='ConvMgt'){
      this.GoToComponent=9;
      this.convertOnly=false;
    } else if (event==='ConvFn'){
      this.GoToComponent=10;
      this.convertOnly=true;
  }  else if (event==='Refresh_Login'){
    this.NbRefresh_Bucket++; 
  }
}

getBucket(){
  this.Error_Access_Server='';

  this.ManageGoogleService.getListBuckets(this.configServer)
    .subscribe(
      data => {
        console.log('successful retrieval of list of buckets ', data);
        this.TabBuckets =data;
      },
      error => {
        this.Error_Access_Server='failure to get list of buckets ;  error = '+ error;
        console.log(this.Error_Access_Server);
       
      });
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

    } else if (event.fileType!=='' && 
    event.fileType===this.identification.fitness.fileType.FitnessMyConfig){ 
  this.MyConfigFitness=event;
  }

  else if (event.fileType!=='' && 
      event.fileType===this.identification.fitness.fileType.Health){
    this.HealthAllData=event;
  }

  else if (event.fileType!=='' && 
      event.fileType===this.identification.configFitness.fileType.calories){ 
    this.ConfigCaloriesFat=event;
  } 
  else if (event.fileType!=='' && 
      event.fileType===this.identification.configFitness.fileType.confHTML){ 
    this.ConfigHTMLFitHealth=event;
  } else if (event.fileType!=='' && 
      event.fileType===this.identification.configFitness.fileType.confChart){ 
      this.ConfigChart=event;
      }
  this.returnFile.emit(event);
}


ReceivedDataConfig(event:any){
  this.SpecificConfigFormat='';
  if (event.BucketConsole!==undefined){
      this.SelectedConfigFile=event;
      this.ModifConfigFile=event;
      this.ContentTodisplay=true;
      this.ModifyText=false;
      this.scroller.scrollToAnchor('targeEndList');
      this.Max_Fields=20+this.ModifConfigFile.TabBucketPhoto.length+(this.ModifConfigFile.UserSpecific.length*3);
      for (let i=0; i<this.Max_Fields; i++){
        this.ModifiedField.push('');
        this.IsFieldModified.push(false);
      }
  } else {
    this.SpecificConfigFormat=JSON.stringify(event);
    this.ContentTodisplay=false;
  }
}

BucketInfo(event:any){
  this.SelectedBucketInfo=event;
}


ReceivedData(event:any){
  this.theReceivedData=event;
  this.isDataReceived=true;
  this.scroller.scrollToAnchor('targeEndList');

  }


TextInput(event:any){
  this.ModifyText=true;

  const d=Number(event.target.id.substring(5));
  this.ModifiedField[d]=event.target.value;
  this.IsFieldModified[d]=true;

}

UpdateConfigFile(){
  if (this.IsFieldModified[1]===true){this.ModifConfigFile.BucketLogin=this.ModifiedField[1]};
  if (this.IsFieldModified[2]===true){this.ModifConfigFile.BucketConsole=this.ModifiedField[2]};
  if (this.IsFieldModified[3]===true){this.ModifConfigFile.BucketContact=this.ModifiedField[3]};
  if (this.IsFieldModified[4]===true){this.ModifConfigFile.SourceJson_Google_Mongo=this.ModifiedField[4]};
  if (this.IsFieldModified[5]===true){this.ModifConfigFile.Max_Nb_Bucket_Wedding=Number(this.ModifiedField[5])};
  if (this.IsFieldModified[6]===true){
    if (this.ModifiedField[6]==='false'){this.ModifConfigFile.GetOneBucketOnly=false};
    if (this.ModifiedField[6]==='true'){this.ModifConfigFile.GetOneBucketOnly=true};
  }
 
  if (this.IsFieldModified[7]===true){this.ModifConfigFile.nb_photo_per_page=Number(this.ModifiedField[7])};
  if (this.IsFieldModified[8]===true){
    if (this.ModifiedField[8]==='false'){this.ModifConfigFile.process_display_canvas=false};
    if (this.ModifiedField[8]==='true'){this.ModifConfigFile.process_display_canvas=true};
  }
   
  if (this.IsFieldModified[9]===true){this.ModifConfigFile.padding=Number(this.ModifiedField[9])};

  if (this.IsFieldModified[10]===true){this.ModifConfigFile.width500=Number(this.ModifiedField[10])};
  if (this.IsFieldModified[11]===true){this.ModifConfigFile.maxPhotosWidth500=Number(this.ModifiedField[11])};
  if (this.IsFieldModified[12]===true){this.ModifConfigFile.width900=Number(this.ModifiedField[12])};
  if (this.IsFieldModified[13]===true){this.ModifConfigFile.maxPhotosWidth900=Number(this.ModifiedField[13])};
  if (this.IsFieldModified[14]===true){this.ModifConfigFile.maxWidth=Number(this.ModifiedField[14])};
  if (this.IsFieldModified[15]===true){this.ModifConfigFile.maxPhotosmaxWidth=Number(this.ModifiedField[15])};


  let j=16;
  for (let i=0; i<this.ModifConfigFile.TabBucketPhoto.length; i++){
    if (this.IsFieldModified[i+j]===true){this.ModifConfigFile.TabBucketPhoto[i]=this.ModifiedField[i+j]};
  };
  //j=j+this.ModifConfigFile.TabBucketPhoto.length-1;
  
  for (let i=0; i<this.ModifConfigFile.UserSpecific.length; i++){
    let j=this.ModifConfigFile.TabBucketPhoto.length+16+(i*2);
    if (this.IsFieldModified[j+i]===true)
             {this.ModifConfigFile.UserSpecific[i].id=this.ModifiedField[j+i]};
    if (this.IsFieldModified[j+i+1]===true)
             {this.ModifConfigFile.UserSpecific[i].type=this.ModifiedField[i+j+1]};
    if (this.IsFieldModified[j+i+2]===true){
              if (this.ModifiedField[i+j+2]==='true'){ this.ModifConfigFile.UserSpecific[i].log=true};
              if (this.ModifiedField[i+j+2]==='false'){ this.ModifConfigFile.UserSpecific[i].log=false};
          };
  };

}

BackToSaveFile(event:any){
  if (event.SaveIsCancelled ===false){
      this.UpdateConfigFile();
  } else { 
  this.ContentTodisplay=false;
  this.scroller.scrollToAnchor('targetTop');
}
}

// for testing purpose only
///////////////////////////
 AccessMongo(){
     const HTTP_Address="https://data.mongodb-api.com/app/data-kpsyr/endpoint/data/v1/action/insertOne" ;
     this.myHeader=new HttpHeaders({
      'content-type': 'application/json',
      'Access-Control-Request-Headers':'*' ,
      'api-key': '8fYe3bJ4J0bfxVgCSjvCyFHRBfzqFD89DGf1HYemJeWYuENYo8uU4tobkKyZ6xkm'
    });
    // 'cache-control': 'private, max-age=0',
    const data_raw={
      "collection":"TestFile.json",
      "database":"Manage-Login",
      "dataSource":"Cluster0",
      "document": {
        "name": "John Sample",
        "age": 42
      }
    }
     this.RecordToWrite.id=99;
     this.RecordToWrite.key=0;
     this.RecordToWrite.method='AES';
     this.RecordToWrite.UserId='the user';
     this.RecordToWrite.psw='thepassword';
     this.RecordToWrite.phone='0000000';
     // update the file
     this.http.post(HTTP_Address, data_raw , {'headers':this.myHeader} )
       .subscribe(res => {
             this.Error_msgMongo='Successful POST';
             },
             error_handler => {
               this.Error_msgMongo='Error of POST, code='+error_handler.status;
               console.log(this.Error_msgMongo);
               
             } 
           )
 }

LogMsgConsole(msg:string){

  msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
  
  }


}