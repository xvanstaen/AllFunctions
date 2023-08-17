import { Component, OnInit, ViewChild, AfterViewInit,SimpleChanges,
  Output, Input, HostListener, EventEmitter, ElementRef, } from '@angular/core';
import { FormGroup,UntypedFormControl, FormControl, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { LoginIdentif ,XMVConfig, configServer } from './JsonServerClass';
import { environment } from 'src/environments/environment';

import {mainClassConv,mainConvItem, mainRecordConvert, mainClassUnit} from './ClassConverter';
import { classAccessFile } from './classFileSystem';

import { fnAddTime } from './MyStdFunctions'

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
   
    ) {}


      // import configuration files
      // access MongoDB
  configServer=new configServer;
  XMVConfig=new XMVConfig;
  isConfigServerRetrieved:boolean=false;
  identification=new LoginIdentif;
  ConvertUnit=new mainClassConv;
  ConvToDisplay=new mainConvItem;
  theTabOfUnits=new mainClassUnit;
  WeightRefTable=new mainRecordConvert;
  convertOnly:boolean=true;
  selHealthFunction:number=0;

  ngOnInit(){
      // getIpAddres
      this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
        this.IpAddress = res.ip;
      });

    this.RetrieveConfig();
  }
  
inData=new classAccessFile;
  RetrieveConfig(){
      // var test_prod='prod';
      var test_prod='test';  // this is for allFunctions only so that test BackendServer is used
      const InitconfigServer=new configServer;
      InitconfigServer.baseUrl='https://localhost:8080';
      InitconfigServer.baseUrl='https://test-server-359505.uc.r.appspot.com';
      
      InitconfigServer.GoogleProjectId='ConfigDB';
      this.ManageMangoDB.findConfigbyURL(InitconfigServer, 'configServer', '')
      .subscribe(
        data => {
         // test if data is an array if (Array.isArray(data)===true){}
         //     this.configServer=data[0];
       
         if (environment.production === false){
            test_prod='test';
         }
        
        for (let i=0; i<data.length; i++){
            if (data[i].title==="configServer" && data[i].test_prod===test_prod){
                this.configServer = data[i];

               //this.configServer.baseUrl='http://localhost:8080';
               this.configServer.IpAddress=this.IpAddress;
            
            } else if (data[i].title==="configPhoto" && data[i].test_prod===test_prod){
                this.XMVConfig = data[i];
            }

        }
        
        this.getRecord('manage-login','Fitness.json',0);
       
        },
        error => {
          console.log('error to retrieve the configuration file ;  error = ', error.status);
         
        });
  }

  selectApps:number=0;
  dictionaryOnly:boolean=false;
  IpAddress:string="";
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

  isIdRetrieved:boolean=false;
  getRecord(Bucket:string,GoogleObject:string, iWait:number){
    this.ManageGoogleService.getContentObject(this.configServer, Bucket, GoogleObject )
        .subscribe((data ) => {    
          this.identification=data;
          this.isIdRetrieved=true;
          this.isConfigServerRetrieved=true;
          this.identification.IpAddress=this.IpAddress;
      },
        err=> {
          console.log('error to access the file ' + GoogleObject + '  error status=' + err.status + ' '+ err.message );
      })
  }



           
}

