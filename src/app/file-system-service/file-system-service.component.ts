import { Component, OnInit , Input, Output, HostListener,  OnDestroy, HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID} from '@angular/core';
  
import { DatePipe, formatDate } from '@angular/common'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';

import { BucketList, Bucket_List_Info  } from '../JsonServerClass';

// configServer is needed to use ManageGoogleService
// it is stored in MangoDB and accessed via ManageMangoDBService

import {msginLogConsole} from '../consoleLog'
import { configServer, XMVConfig, LoginIdentif, msgConsole } from '../JsonServerClass';
import {classPosDiv, getPosDiv} from '../getPosDiv';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import {AccessConfigService} from 'src/app/CloudServices/access-config.service';

import { classFileSystem, classAccessFile }  from 'src/app/classFileSystem';

import { fnAddTime, convertDate, strDateTime, fnCheckLockLimit, checkData, validateLock, createRecord, updatedAt  } from '../MyStdFunctions';

@Component({
  selector: 'app-file-system-service',
  templateUrl: './file-system-service.component.html',
  styleUrls: ['./file-system-service.component.css']
})
export class FileSystemServiceComponent {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    ) { }

  @Output() returnStatus= new EventEmitter<any>();

  @Input() XMVConfig=new XMVConfig;
  @Input() configServer = new configServer;
  @Input() identification= new LoginIdentif;
  @Input() iWait:number=0;;
  @Input() tabLock:Array<classAccessFile>=[]; //0=unlocked; 1=locked by user; 2=locked by other user; 3=must be checked;
  

  myLogConsole:boolean=false;
  myConsole:Array< msgConsole>=[];
  returnConsole:Array< msgConsole>=[];
  SaveConsoleFinished:boolean=false;
  HTTP_Address:string='';
  type:string='';

  EventHTTPReceived:Array<boolean>=[];
  maxEventHTTPrequest:number=1;
  id_Animation:Array<number>=[];
  TabLoop:Array<number>=[];
  NbWaitHTTP:number=0;


ngOnInit(){
    var theStatus:any;
    this.EventHTTPReceived[this.iWait]=false;
    this.NbWaitHTTP++;
    this.waitHTTP(this.TabLoop[this.iWait],30000,this.iWait);
    this.ManageGoogleService.getContentObject(this.configServer, this.XMVConfig.BucketSystemFile, this.XMVConfig.ObjectSystemFile )
        .subscribe((data ) => {
          // record is found   

          theStatus=checkData( data, this.iWait, this.tabLock);     
          if (Array.isArray(theStatus)===false){
            console.log("this is not a file system record; return the error code or this.iWait object ");
            if (typeof theStatus !== 'object'){
                if (theStatus===300){
                  console.log( this.tabLock[this.iWait].object + ' ==> already locked ; status= ' + theStatus);
                  this.returnStatus.emit ({
                    message: "already locked detected after checkData ", error:theStatus
                  });
                } else {
                  console.log(this.tabLock[this.iWait].object +' error on Lock after checkData ' + theStatus);
                  this.returnStatus.emit ({
                    message: "error on Lock after checkData ", error: theStatus
                  });
                }
            } else {
              this.returnStatus.emit(theStatus);
            }
  
          } 
          else if (typeof theStatus === 'object'  ){
            for (var i=0; i<theStatus.length && (theStatus[i].object!==this.tabLock[this.iWait].object || theStatus[i].bucket!==this.tabLock[this.iWait].bucket); i++){}
            if (this.tabLock[this.iWait].action==="lock" && i<theStatus.length){
              this.tabLock[this.iWait].createdAt = theStatus[i].createdAt;
              this.tabLock[this.iWait].updatedAt = theStatus[i].updatedAt;
              this.tabLock[this.iWait].lock = 1;
              console.log('record ' + this.tabLock[this.iWait].object + ' locked - createdAT' +  this.tabLock[this.iWait].createdAt + '  updatedAt' + this.tabLock[this.iWait].updatedAt);
  
            } else if (this.tabLock[this.iWait].action==="unlock" && i===theStatus.length){
              this.tabLock[this.iWait].lock = 0;
              console.log('record ' + this.tabLock[this.iWait].object + ' unlocked  - tabLock[this.iWait].lock=0' );
            } else if ((this.tabLock[this.iWait].action==="updatedAt" || this.tabLock[this.iWait].action==="check&update") && i<theStatus.length){
              this.tabLock[this.iWait].updatedAt = theStatus[i].updatedAt;
              this.tabLock[this.iWait].createdAt = theStatus[i].createdAt;
              console.log('record ' + this.tabLock[this.iWait].object + ' updated - createdAT' +  this.tabLock[this.iWait].createdAt + '  updatedAt' + this.tabLock[this.iWait].updatedAt);
            }  

            // write in FileSystem
            const file=new File ([JSON.stringify(theStatus)], this.XMVConfig.ObjectSystemFile, {type: 'application/json'});
            this.ManageGoogleService.uploadObject(this.configServer, this.XMVConfig.BucketSystemFile, file )
              .subscribe(res => {
                if (res.type===4){
                  console.log(' file system = ' + JSON.stringify(theStatus[i]));
                  this.returnStatus.emit (this.tabLock);
                }
                },
                err => {
                    console.log('on Lock ' + this.tabLock[this.iWait].object + ' - after save is a failure ' + err);
                    this.returnStatus.emit ({error: err, fileSystem: theStatus});;
                })
          } else {
            console.log(this.tabLock[this.iWait].object + '===> after updateFileSystemt() - ERROR 808 -->  '+ theStatus);
            //console.log('Should process empty file'); 
            this.returnStatus.emit ({ message: "could not process updateFileSystem ", error: theStatus });
          }
        },
        (err) => {  
          // file is not found
          if (this.tabLock[this.iWait].action==="lock"  || this.tabLock[this.iWait].action==="check&update"){
            theStatus=checkData( [], this.iWait, this.tabLock); 
            if (typeof theStatus === 'object'){
                  //console.log('file not found & record created');
                  
                  this.tabLock[this.iWait].createdAt = theStatus[theStatus.length-1].createdAt;
                  this.tabLock[this.iWait].updatedAt = theStatus[theStatus.length-1].updatedAt;
                  this.tabLock[this.iWait].lock = 1;
                  console.log('record ' + this.tabLock[this.iWait].object + ' locked - createdAT' +  this.tabLock[this.iWait].createdAt + '  updatedAt' + this.tabLock[this.iWait].updatedAt);
      
                  const file=new File ([JSON.stringify(theStatus)], this.XMVConfig.ObjectSystemFile, {type: 'application/json'});
                  this.ManageGoogleService.uploadObject(this.configServer, this.XMVConfig.BucketSystemFile, file )
                    .subscribe(res => {
                        if (res.type===4){
                          console.log(' file system = ' + JSON.stringify(theStatus[0]));
                          this.returnStatus.emit (this.tabLock);
                        }
                        },
                        err => {
                            console.log('on Lock ' + this.tabLock[this.iWait].object + ' - after save is a failure ' + err);
                            this.returnStatus.emit ({ message: "on Lock - after save is a failure ", error:err.status });
                        })
            }
            else {
                if (theStatus===300){
                  console.log(' file empty however already locked detected after checkData ?? status=' + theStatus);
                  this.returnStatus.emit ({message: " file empty however already locked detected after checkData " , error: theStatus });
                } else {
                  console.log(this.tabLock[this.iWait].object + 'file empty however  error on Lock after checkData?? status= ' + theStatus);
                  this.returnStatus.emit ({ message: " file empty however error on Lock after checkData " , error: theStatus });
                }
            }
          } else if (this.tabLock[this.iWait].action==="unlock"){
            this.returnStatus.emit ({message: "on Unlock Err809 - file not found "});                  
          } else if (this.tabLock[this.iWait].action==="check" || this.tabLock[this.iWait].action==="updatedAt" ){
              console.log('check file ' + this.tabLock[this.iWait].object +  ' does not exist; return inData.status 800');
              //this.tabLock[this.iWait].createdAt='';
              //this.tabLock[this.iWait].updatedAt='';
              //this.tabLock[this.iWait].status=800;
              this.returnStatus.emit (this.tabLock[this.iWait]);
          } else {
            this.returnStatus.emit ({ message: "on Unlock Err819 - file not found & action unkown = " + this.tabLock[this.iWait].action });
          }
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
            if (this.EventHTTPReceived[eventNb]===true ){
                    window.cancelAnimationFrame(this.id_Animation[eventNb]);
            }    
      }  
  }

LogMsgConsole(msg:string){
  if (this.myConsole.length>40){
    //this.SaveNewRecord('logconsole','ConsoleLog.json',this.myLogConsole, -1);
    //this.message='Saving of LogConsole';
  }
  this.SaveConsoleFinished=false;

  this.myLogConsole=true;
  msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_Address, this.type);
  
  }

}
