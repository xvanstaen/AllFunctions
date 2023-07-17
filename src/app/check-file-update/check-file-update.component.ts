import { Component, OnInit , Input, Output, HostListener,  HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID} from '@angular/core';
  
import { DatePipe, formatDate } from '@angular/common'; 

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { configServer, XMVConfig, LoginIdentif, msgConsole } from '../JsonServerClass';
import { classFileSystem, classAccessFile, classReturnCheckFileUpdate }  from '../classFileSystem';




@Component({
  selector: 'app-check-file-update',
  templateUrl: './check-file-update.component.html',
  styleUrls: ['./check-file-update.component.css']
})
export class CheckFileUpdateComponent {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    ) { }

  @Input() inData=new classAccessFile;
  @Input() configServer=new configServer;
  @Input() XMVConfig=new XMVConfig;

  @Output() returnValue= new EventEmitter<classReturnCheckFileUpdate>();

  status=new classReturnCheckFileUpdate;
  fileSystem:Array<classFileSystem>=[];;

  ngOnInit(){

    this.ManageGoogleService.getContentObject(this.configServer, this.XMVConfig.BucketSystemFile, this.XMVConfig.ObjectSystemFile)
    .subscribe((data ) => {   
      this.status.error=0;
      for (var i=0; i<data.length && (data[i].object!==this.inData.object || data[i].bucket!==this.inData.bucket); i++){}
      if (this.inData.action==="lock"){
          if (i===data.length ){
            // record is not locked so create a new record and flag lock to true
            this.createRecord();
            this.saveFile();
          } else { // record already exists and already locked
            this.status.error=300;
            this.status.lock=true;
            this.returnValue.emit(this.status);
          }
        } else if (this.inData.action==="unlock"){
          if (i===data.length ){
            // record is not found so cannot be unlocked
            // should log an error
            this.status.error=400;
            this.status.lock=false;
            this.returnValue.emit(this.status);
          } else { // record is found; delete it
            this.fileSystem.splice(i,1);
            this.saveFile();
          }
        }
    
    },
    error_handler => {

      this.status.error=500; // record not found 
      this.returnValue.emit(this.status);
    }
    )
  }

  createRecord(){
    const recordSystem=new classFileSystem;
    this.fileSystem.push(recordSystem);
    this.fileSystem[this.fileSystem.length-1].bucket=this.inData.bucket;
    this.fileSystem[this.fileSystem.length-1].object=this.inData.object;
    this.fileSystem[this.fileSystem.length-1].byUser=this.inData.user;
    this.fileSystem[this.fileSystem.length-1].lock=true;
    const myTime=new Date();
    const myDate= myTime.toString().substring(4,25);
    this.fileSystem[this.fileSystem.length-1].from=myDate;
    this.fileSystem[this.fileSystem.length-1].to=myDate;
  }


  saveFile(){
    var file=new File ([JSON.stringify(this.fileSystem)],this.XMVConfig.ObjectSystemFile, {type: 'application/json'});
    
    this.ManageGoogleService.uploadObject(this.configServer, this.XMVConfig.BucketSystemFile, file )
      .subscribe(res => {
              if (res.type===4){
                this.status.error=0;
                if (this.inData.action==="unlock"){
                  this.status.lock=false;
                } else {
                  this.status.lock=true;
                }
                this.returnValue.emit(this.status);
              }
            },
            error_handler => {
              this.status.error=404;
              if (this.inData.action==="unlock"){
                this.status.lock=true;
              } else {
                this.status.lock=false;
              }
              this.returnValue.emit(this.status);
            } 
          )
      }
  

  
}
