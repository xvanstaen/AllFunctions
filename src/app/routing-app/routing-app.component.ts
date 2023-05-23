import { Component, OnInit, ViewChild, AfterViewInit,SimpleChanges,
  Output, Input, HostListener, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { FileSaverModule } from 'ngx-filesaver';
import { FormGroup,UntypedFormControl, FormControl, Validators} from '@angular/forms';
import { encrypt, decrypt} from '../EncryptDecryptServices';
import * as CryptoJS from 'crypto-js';  
import { Injectable } from '@angular/core';
import { interval, lastValueFrom } from 'rxjs';
//import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { catchError } from 'rxjs/operators'
//import { throwError } from 'rxjs';

import { configServer } from '../JsonServerClass';
import { XMVConfig } from '../JsonServerClass';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';

@Injectable({
    providedIn: 'root'
    })



@Component({
  selector: 'app-routing-app',
  templateUrl: './routing-app.component.html',
  styleUrls: ['./routing-app.component.css']
})
export class RoutingAppComponent implements OnInit {

  @Input() selectApps:number=0;
  @Input() configServer=new configServer;
  @Input()  XMVConfig=new XMVConfig;

  EventHTTPReceived:Array<boolean>=[];
  id_Animation:Array<number>=[];
  TabLoop:Array<number>=[];
  NbWaitHTTP:number=0;

  Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
  Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  Error_Access_Server:string='';
  Encrypt:string='';
  Decrypt:string='LIM!12monica#Chin';
  Crypto_Method:string='AES';
  Crypto_Error:string='';
  Crypto_Key:number=2;
  Crypto_Record:number=0;
  Server_Type:string='Google';
  Bucket_Name:string='manage-login';
  Object_Name:string='XMVIT-Admin';
  Encrypt_Data={
    id: 3,
    encrypted:'',
    decrypted:'',
    key:0,
    method:''
  }

  UserId_Data:any={
    id: 0,
    key:0,
    method:'',
    UserId:'',
    psw:'',
    phone:''
  }
  
  mystring: string='';
  myDiv:any;  
  mySlider:any;
  myOutput:any;
  myValue:number=0;
  otherValue:number=0;
  
  my_input_child1:string='';
  my_input_child2:string='';
  my_output_child1:string='';
  my_output_child2:string='';

  selected_color:string='';

  AngularWebSite:Array<any>=[
    {id:0,
    topic:'',
    url:'',
    }
  ];

  HTTPstring:string='';
  JsonServer:string='';


  Length_Array:number=0;

  public uploadFileName: string='';
  public uploadFileContent:string='';
  public readFileContent:string=''

  public myreader = new FileReader() ;
  i:number=0;
  myMSG:string='';

  data= {
    title: '',
    file: '',
    myfile: '',
    other: '',
    desc: ''    
  }

  
  /* to be used by openFile() */ 
  // TO BE CHANGED
  myForm = new FormGroup({
    name: new FormControl('', {validators:[Validators.required, Validators.minLength(3)], nonNullable: true}),
    file: new FormControl('',{validators:[ Validators.required], nonNullable: true}),
    fileSource: new FormControl('', {validators:[Validators.required], nonNullable: true}),
  });

  

  // Boolean to display the features 
  isDisplayLogos:boolean=false;
  isDisplayTelephone:boolean=false;
  isDisplaySlider:boolean=false;
  isDisplayColorPicker:boolean=false;
  isDisplayEncrypt:boolean=false;
  isDisplayCSSTable:boolean=false;
  isDisplayUploadFile:boolean=false;
  isDisplaySaveDownload:boolean=false;

  TheSelectDisplays: FormGroup = new FormGroup({ 
    Logos: new FormControl('N', { nonNullable: true }),
    Telephone: new FormControl('N', { nonNullable: true }),
    Slider: new FormControl('N', { nonNullable: true }),
    ColorPicker: new FormControl('N', { nonNullable: true }),
    Encrypt: new FormControl('N', { nonNullable: true }),
    CSSTable: new FormControl('N', { nonNullable: true }),
    UploadFile: new FormControl('N', { nonNullable: true }),
    SaveDownload: new FormControl('N', { nonNullable: true }),
    KEHP: new FormControl('N', { nonNullable: true }),
})


  constructor(
    private router:Router, 
    private http: HttpClient,
    private ManageGoogleService: ManageGoogleService,
    private ManageMangoDBService: ManageMangoDBService,
    
    ) {}


ngOnInit() {
    
    // console.log('ngOnInit of routing-test.ts')
    this.my_input_child1='red';
    this.my_input_child2='red';
    this.selected_color =this.my_input_child1;
    this.Error_Access_Server='';
    this.HTTPstring='http://localhost:3000/myTopicsURL/';
    
    // get the first item to know the size of the table which is stored in element '.topic'
    // first parameter is id to retrive in JsonServer and seecond parameter is occurence of array to fill-in 
    this.JsonServer=this.HTTPstring+1;
    
      const item=this.selectApps-1; 
      const event='Y-'+ item.toString();
      this.SelRadio(event);

  }


displayCSSTable(){
  this.http.get<any>(this.JsonServer)
  .subscribe(data => {
      this.AngularWebSite[0]=data;
      this.Length_Array=Number(this.AngularWebSite[0].topic);

      // create right size of the array; [0] alreay exists
      for (this.i=0; this.i<this.Length_Array; this.i++){
              this.AngularWebSite.push(this.AngularWebSite[0]);
            }

      // retrieve the entire table
      this.http.get<any>(this.HTTPstring)
          .subscribe(data => {
                //console.log('data = ', data);
                this.AngularWebSite=data;
            }
            )
    },
      error_handler => {
            //this.handleError('routing-app', '');
            this.Server_Error(error_handler);
      
    }  
      )
    ;
}

  SelRadio(event:any){
    const i = event.substring(2);
    const NoYes=event.substring(0,1);
    if (i==='1'){
      if (NoYes==='Y'){
          this.isDisplayLogos=true;
      } else {
          this.isDisplayLogos=false;
      }
    } else if (i==='2'){
        if (NoYes==='Y'){
          this.isDisplayTelephone=true;
        } else {
          this.isDisplayTelephone=false;
        }
    } else if (i==='3'){
        if (NoYes==='Y'){
          this.isDisplaySlider=true;
        } else {
          this.isDisplaySlider=false;
        }
      } else if (i==='4'){
        if (NoYes==='Y'){
          this.isDisplayColorPicker=true;
        } else {
          this.isDisplayColorPicker=false;
        }
      } else if (i==='5'){
        if (NoYes==='Y'){
          this.isDisplayEncrypt=true;
        } else {
          this.isDisplayEncrypt=false;
        }
      } 
      else if (i==='6'){
        if (NoYes==='Y'){
          this.displayCSSTable();
          this.isDisplayCSSTable=true;
        } else {
          this.isDisplayCSSTable=false;
        }
      } else if (i==='7'){
        if (NoYes==='Y'){
          this.isDisplayUploadFile=true;
        } else {
          this.isDisplayUploadFile=false;
        }
      } else if (i==='8'){
        if (NoYes==='Y'){
          this.isDisplaySaveDownload=true;
        } else {
          this.isDisplaySaveDownload=false;
        }
      }
  }

onCrypt(event:any){
  // const key= "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O";
  /*
  const IV = "MTIzNDU2Nzg=";
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const mode = CryptoJS.mode.CBC;
  */
  this.Crypto_Error='';
  if (this.Crypto_Key<1 || this.Crypto_Key>3){
    this.Crypto_Error='Crypto key must be 1, 2 or 3';
  } else if (event==='Encrypt'){
      // ==== DES native
      //this.Encrypt = CryptoJS.TripleDES.encrypt(this.Decrypt, keyHex, { iv, mode }).toString();
      // ==== DES function
      //this.Encrypt=encrypt(this.Decrypt,key,'DES');
      // ==== AES native
      //this.Encrypt=CryptoJS.AES.encrypt(this.Decrypt, key).toString();
      // ==== AES function
      //this.Encrypt=encrypt(this.Decrypt,key,'AES');
      if (this.Decrypt===''){
        this.Crypto_Error="Decrypt field is empty";
      } else
      if (this.Crypto_Method==='AES' || this.Crypto_Method==='DES'){
        this.Encrypt=encrypt(this.Decrypt,this.Crypto_Key,this.Crypto_Method);
        } else { this.Crypto_Error="Wrong method for crypto. Must be either 'AES' or 'DES'" 
      } 
      console.log(this.Decrypt, " , ", this.Encrypt);
  } else { 
      if (this.Encrypt===''){
        this.Crypto_Error="Encrypt field is empty";
      } else
      if (this.Crypto_Method==='AES' || this.Crypto_Method==='DES'){
        this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
        } else { this.Crypto_Error="Wrong method for crypto. Must be either 'AES' or 'DES'"
      } 
      console.log(this.Decrypt, " , ", this.Encrypt);
    }


}
onClear(){
  this.Decrypt='';
  this.Encrypt='';
}


onSave(event:any){
  this.Error_Access_Server='';
  
  
  if (this.Server_Type==="Google"){
    this.HTTPstring=this.Google_Bucket_Access_RootPOST + this.Bucket_Name + "/o?name=" + this.Object_Name  + '.json&uploadType=media';
    this.UserId_Data.id=0;
    // this.UserId_Data.key=this.Crypto_Key.toString();
    this.UserId_Data.key=this.Crypto_Key;
    this.UserId_Data.method=this.Crypto_Method;
    this.UserId_Data.psw=this.Encrypt;
    this.UserId_Data.UserId=this.Object_Name;
    this.UserId_Data.phone='+6582680480';
    console.log("Before HTTP ", this.Decrypt, " , ", this.Encrypt);
    this.http.post(this.HTTPstring,this.UserId_Data )
    .subscribe(res => {
          alert('Uploaded Successfully='+this.Decrypt);
        },
        error_handler => {
          alert(error_handler.message + '  '+ error_handler.statusText)
          })
    }
  else{
    this.Encrypt_Data.id=0;
    this.Encrypt_Data.encrypted=this.Encrypt;
    this.Encrypt_Data.decrypted=this.Decrypt;
    this.Encrypt_Data.method=this.Crypto_Method;
    this.Encrypt_Data.key=this.Crypto_Key;
    this.HTTPstring='http://localhost:3000/myEncryption/';
    this.http.post(this.HTTPstring,this.Encrypt_Data )
    .subscribe(res => {
          alert('Uploaded Successfully='+this.Decrypt);
        },
        error_handler => {
          alert(error_handler.message + '  '+ error_handler.statusText)
          })
  }
 
}

onRead(){
  this.Error_Access_Server='';
  this.HTTPstring='http://localhost:3000/myEncryption/'+this.Crypto_Record;
  this.Crypto_Error='';

    this.http.get<any>(this.HTTPstring)
    .subscribe(data => {
      this.Encrypt_Data=data;
      this.Encrypt=this.Encrypt_Data.encrypted;
      this.Crypto_Method=this.Encrypt_Data.method;
      this.Crypto_Key=Number(this.Encrypt_Data.key);
      this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
          },
      error_handler => {
        // this.Crypto_Error='Server error';
        this.Server_Error(error_handler);
      }
    );
}

Server_Error(error:HttpErrorResponse){
  this.Error_Access_Server='Cannot access server for '+ error.url;
  // console.log('error',error);
}

returnValue(event:any){
  this.myDiv=event;
  this.otherValue = this.myDiv.currentTarget.valueAsNumber;
  this.mystring=this.myDiv.currentTarget.value;
  // console.log('event',this.mystring,  event );
  this.mySlider = document.getElementById("myRange");
  this.myValue =this.mySlider.value;
  // console.log('values: myOutput', this.otherValue, 'myValue=', this.myValue);
  }

ClearDiv(){
  this.TheSelectDisplays.controls['KEHP'].setValue('N');
  this.router.navigateByUrl('myKEHP');
  }

  ToColorPicker(){

    this.router.navigateByUrl('myColorPicker');
  }

  MyFitnessStat(){
    this.router.navigateByUrl('myFitnessStat');
  }


  /******  How to highlight PROGRESS of UPLOAD  ======= */

  /* === 1st method to upload file (no http invoked) ====== */


  public async onFileSelected(event:any) {
    /*
        When the change event gets triggered, the file is not automatically uploaded to the backend by the browser. 
        Instead, we will need to trigger an HTTP request ourselves, in response to the change event.
      */
     // console.log('event file ', event);
    const file:File = event.target.files[0];
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text(); 
    this.data.title=this.myForm.controls['name'].value;
    this.data.file=this.uploadFileContent;
    this.data.myfile='';
    this.data.other='$$$$$$$$$';
    this.data.desc='===========';
    // if needs to be sent to JSONserver then needs to trigger process related to HTTP  
    this.http.post('http://localhost:3000/posts',this.data )
        .subscribe(res => {
              console.log('content =', this.data);
              alert('Uploaded Successfully');
    })
    this.data.file='QWERTYIASDFGUXCBV';
    this.http.put('http://localhost:3000/posts/4',this.data )
        .subscribe(res => {
              console.log('content =', this.data);
              alert('Uploaded Successfully');
    })

  }
  
  public async getTextFile(file:any) {
        this.uploadFileContent = await file.text(); 
        console.log('in getTextFile = ', this.uploadFileContent);
    return(this.uploadFileContent);
  }
  
  
  
  public saveFileName = "test";
  public saveFileContent = '{ "name": "test"}';
  public saveFileExtension = 'json';
  public myFile:any;
  /* =========== DOWNLOAD file in Download folder ========== */

  public onSaveFile(): void {
    let fileName = this.saveFileName + '.' + this.saveFileExtension;
    let fileContent = this.saveFileContent;
  
    const file = new Blob([fileContent], { type: "text/plain" });
  
    const link = document.createElement("a");
    console.log('Link ',link);
    link.href = URL.createObjectURL(file);
    console.log('link.href', link.href);
    link.download = fileName;
    link.click();
    link.remove(); 
  }

  // ======= upload file via http method / usage of a fake JSON server or file.io ======
     
  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      const file:File = event.target.files[0];
      this.myFile = event.target.files[0];
      // PatchValue is used to update only a subset of the elements of the FormGroup or FormArray . 
      // It only updates the matching objects and ignores the rest.
      
// COMPILATION ERROR - CHECK HOW TO CORRECT IT
      // this.myForm.patchValue({ fileSource: file});
    }
  }
     
  

requestPromise() {
  return new Promise((resolve, reject) => {
    const reader = new FileReader() ;
   
    
    //reader.onload = () => {
    //  resolve(reader.result);
    //};
    
    reader.onload = function () {
      resolve(JSON.stringify(reader.result));
      console.log('async: ', reader.result);
    
    };
    reader.onerror = function (error) {
      reject(error);
      console.log('Error: ', error);
    };
     /*
    The main methods:
        readAsArrayBuffer(blob) – read the data in binary format ArrayBuffer.
        readAsText(blob, [encoding]) – read the data as a text string with the given encoding (utf-8 by default).
        readAsDataURL(blob) – read the binary data and encode it as base64 data url.
        abort() – cancel the operation.
    */
        reader.readAsDataURL(this.myFile) ;
        //reader.readAsText(this.myFile);
    
  }) 
}

ngOnChanges(changes: SimpleChanges) { 

  
   }


GetRecord(Bucket:string,GoogleObject:string, iWait:number){

    this.EventHTTPReceived[iWait]=false;
    this.NbWaitHTTP++;
    this.waitHTTP(this.TabLoop[iWait],30000,iWait);
    this.ManageGoogleService.getContentObject(this.configServer, Bucket, GoogleObject )
        .subscribe((data ) => { 
          const a = data;
         }
        );
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

submit(event:any){
    const formData = new FormData();
// 16MAY2023 Error at compilation - string vs file
    // const file:File = this.myForm.controls['fileSource'].value;
    const fileName=this.myForm.controls['name'].value;

    if (this.myForm.controls['name'].value!=='' && this.myForm.controls['file'].value!==''){
      const myText=this.getTextFile(this.myFile); // FOR TEST PURPOSE to get content of file with await function

    // 16MAY2023 Error at compilation - string vs blob
      //formData.append('file', this.myForm.controls['fileSource'].value);
        
        //***************************************************** */
        // then start the server:  json-server --watch db.json
        //***************************************************** */
        
      /*
      const upload$ = this.http.post("http://localhost:3000/posts", formData);

      upload$.subscribe(res => {
        console.log(res);
        this.myMSG='Uploaded Successfully.' + JSON.stringify(res);
        alert(this.myMSG);
      });
      
      //  this.http.post("http://localhost:3000/posts", formData)
      //  this.http.post('https://jsonplaceholder.typicode.com/posts',formData)
      //  this.http.post('http://file.io', formData) // this one works

      /*=============================*/


    // == Convert file content to Base64 ==
      /*
            const reader = new FileReader() ;
            // reader.readAsDataURL(this.myForm.controls['fileSource'].value);
            reader.readAsDataURL(this.myFile) 
            //reader.readAsText(this.myFile);

            reader.onload = function () {
      
              console.log('reader.result = ', reader.result);
            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
            this.myMSG = reader.result as string;
     
       */     
      
      // myText contains data returned by getTextFile and is equivalent to this.uploadFileContent
      //function(value) {console.log('the value ', value)}
      
      const myReader=this.requestPromise().then((result) => {
        this.mystring=JSON.stringify(result);
        // 16MAY2023 Error at compilation - string vs nb
        //this.data.title=this.myForm.controls['name'].value;
        this.data.file=this.uploadFileContent;
        this.data.myfile=this.mystring;
        this.data.other='$$$$$$$$$';
        this.data.desc='===========';
     
        //console.log ('== data = ', this.data);
        this.http.post('http://localhost:3000/myfile',this.data )
            .subscribe(res => {
              alert('Uploaded Successfully.');
            })
        return result});


      /*-------
      this.http.post('http://localhost:3000/posts',formData)
        .subscribe(res => {
          console.log(res);
          this.myMSG='Uploaded Successfully.' + JSON.stringify(res);
          alert(this.myMSG);
        })
      ------*/
        
    }
      else if (this.myForm.controls['name'].value===''){
        this.myForm.controls['name'].setErrors({'invalid': true, 'required': true});
        this.myForm.controls['name'].markAsTouched();
      } 
      /** 
        else if (this.myForm.controls['file'].value===''){
          this.myForm.controls['file'].setErrors({'invalid': true, 'required': true});
          this.myForm.controls['file'].markAsTouched();
        }
      */
  }

  /* ------ Code on HttpRequest(), POST method ==== NOT ADAPTED & TESTED

    var xhr = new XMLHttpRequest();
    xhr.open("POST", yourUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value: value
    }));

    function makeRequest (method, url, data) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        if(method=="POST" && data){
            xhr.send(data);
        }else{
            xhr.send();
        }
      });
    }


  */

}
