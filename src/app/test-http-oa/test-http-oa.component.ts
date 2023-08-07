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

import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import {AccessConfigService} from 'src/app/CloudServices/access-config.service';

@Component({
  selector: 'app-test-http-oa',
  templateUrl: './test-http-oa.component.html',
  styleUrls: ['./test-http-oa.component.css']
})

export class TestHttpOAComponent {

constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private scroller: ViewportScroller,
    private ManageMangoDBService: ManageMangoDBService,
    private ManageGoogleService: ManageGoogleService,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    ) { }

@Input() XMVConfig=new XMVConfig;
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

theHeaders = new HttpHeaders( { 'Authorization': 'Bearer 4%2F0AZEOvhVsiezUkgG3EirImgqobFuIGPlA_ApXwR_BU7Yyzmc618blmGDGaD84HwjhQXBDig',
  'Content-Type' : 'application/json',"Accept": "application/json", 
                   }  );

theHeadersB = new HttpHeaders( { 'Content-Type' : 'application/json',
        "Accept": "application/json", "cacheControl": "public, max-age=0"
        } );                

ngOnInit(){
  this.http.post(this.HTTP_Address, this.fileRecord , {headers: this.theHeaders})
      .subscribe(res => {
          console.log('=======> Partial Upload successfull');
          this.ManageGoogleService.getListMetaObjects(this.configServer, 'config-xmvit' )
          .subscribe((data ) => {
                  console.log(data);
              },
              err => {
                  console.log('Metaobject not retrieved ' + err.status);
                });

          this.http.patch('https://storage.googleapis.com/storage/v1/b/config-xmvit/o/unloadfileSystem?fields=id,bucket,generation,metadata/key1',
          this.fileRecord ) // , {headers: theHeaders}
              .subscribe(res => {
                  console.log('=======> Partial Upload successfull');
              }, err => {
                  console.log('error on this.http.put ' + err.status + ' ' + err.statusText);
              })



      }, err => {
          console.log('error on this.http.put ' + err.status + ' ' + err.statusText);
      })
      
      this.http.post('https://storage.googleapis.com/upload/storage/v1/b/config-xmvit/o?uploadType=media&name=unloadfileSystem&metadata={cache-control:no-cache,no-store,max-age=0}',
      this.fileRecord , {headers: this.theHeaders}) // 
          .subscribe(res => {
              console.log('=======> Partial Upload successfull');
              this.ManageGoogleService.getListMetaObjects(this.configServer, 'config-xmvit' )
              .subscribe((data ) => {
                      console.log(data);
                  },
                  err => {
                      console.log('Metaobject not retrieved ' + err.status);
                    });
    
              this.http.patch('https://storage.googleapis.com/storage/v1/b/config-xmvit/o/unloadfileSystem?fields=id,bucket,generation,metadata/key1',
              this.fileRecord ) // , {headers: theHeaders}
                  .subscribe(res => {
                      console.log('=======> Partial Upload successfull');
                  }, err => {
                      console.log('error on this.http.put ' + err.status + ' ' + err.statusText);
                  })
    
    
    
          }, err => {
              console.log('error on this.http.put ' + err.status + ' ' + err.statusText);
          })
    }
}
