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
    @Inject(LOCALE_ID) private locale: string,
    ) { }

  @Input() configServer = new configServer;
  @Input() identification= new LoginIdentif;
  
  HTTP_Address:string='https://storage.googleapis.com/upload/storage/v1/b/config-xmvit/o?uploadType=media&name=unloadfileSystem&metadata={cache-control:no-cache,no-store,max-age=0}';
  HTTP_AddressPOST:string='';
  Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
  Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';

  Google_Object_Health:string='HealthTracking';
  Google_Object_Console:string='LogConsole';
  Google_Object_Calories:string='ConfigCaloriesFat';
  bucket_data:string='';
  myListOfObjects=new Bucket_List_Info;
  DisplayListOfObjects:boolean=false;
  Error_Access_Server:string='';

  fileRecord:any;
  
  ngOnInit(){
    
  }

  updateMetaData(){
    const newMetadata = {
      cacheControl: 'public,max-age=0,no-cache,no-store',
      contentType: 'application/json'
    };
    this.ManageGoogleService.updateMetadata(this.configServer, 'config-xmvit', 'unloadfileSystem', newMetadata)
      .subscribe(
        (data ) => {
            if (data.type===4 && data.status===200 ){
              console.log(data.body.message);
              this.ManageGoogleService.getMetaObject(this.configServer, 'config-xmvit','unloadfileSystem' )
              .subscribe(
                  (data ) => {
                      console.log(data);
                  },
                  err => {
                      console.log('Metaobject not retrieved ' + err.status);
                  });
            }  
          },
        err => {
              console.log('Metadata not updated for unloadfileSystem');
          }); 
  }

  moveObject(){
    this.ManageGoogleService.moveObject(this.configServer, 'config-xmvit', 'config-xmvit','fileSystem','copyFileSystem')
    .subscribe(
      (data ) => {
          console.log(data);
      },
      err => {
          console.log('Error to copy ' + err.status);
      });
  }

  listMetaDataObject(){
    this.ManageGoogleService.getListMetaObjects(this.configServer, 'config-xmvit' )
    .subscribe((data ) => {
            console.log(data);
        },
        err => {
            console.log('Metaobject not retrieved ' + err.status);
          });
  }


}
