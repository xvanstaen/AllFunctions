import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import { encrypt, decrypt} from '../EncryptDecryptServices';

@Component({
  selector: 'app-Event-27AUG2022',
  templateUrl: './Event-27AUG2022.component.html',
  styleUrls: ['./Event-27AUG2022.component.css']
})

export class Event27AugComponent {

  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    ) {}
  

    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';
    yourLanguage:string='FR';
    @Input() LoginTable_User_Data:Array<EventAug>=[];
    @Input() LoginTable_DecryptPSW:Array<string>=[];
    @Input() identification={
      id: 0,
      key:0,
      method:'',
      UserId:'',
      psw:'',
      phone:'',
    };

    @Output() returnDATA= new EventEmitter<any>();

    Admin_UserId:string="XMVIT-Admin";
    invite:boolean=true;
    total_invitee:number=0;

    myForm = new FormGroup({
      userId: new FormControl(''),
      psw: new FormControl(''),
      firstname: new  FormControl(''),
      surname: new  FormControl(''),
      nbInvitees: new  FormControl(''),
      night: new  FormControl(''),
      brunch: new  FormControl(''),
      readRecord: new  FormControl(''),
      myComment: new  FormControl(''),
      yourComment: new  FormControl(''),
    });

    Encrypt:string='';
    Decrypt:string='';
    Crypto_Method:string='AES';
    Crypto_Error:string='';
    Crypto_Key:number=2;

    // ACCESS TO GOOGLE STORAGE
    Server_Name:string='Google'; // "Google" or "MyJson"
    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
    //Google_Bucket_Name:string='my-db-json'; // if "MyJson"
    Google_Bucket_Name:string='manage-login'; 
    Google_Object_Name:string='';

    Bucket_Info_Array:any={
      kind:'',
      items:[
      {
          kind: "",
          id: "", 
          selfLink: "", // link to the general info of the bucket/objectobject
          mediaLink: "", // link to get the content of the object
          name: "", // name of the object
          bucket: "", //name of the bucket
          generation: "", 
          metageneration: "",
          contentType: "", //application/json
          storageClass: "", //STANDARD
          size: "", // number of bytes
          md5Hash: "",
          crc32c: "",
          etag: "",
          timeCreated: "",
          updated: "",
          timeStorageClassUpdated: ""
      }
    ]
    
  };

    error_message:string='';
    HTTP_Address:string='';
    Error_Access_Server:string='';
    i:number=0;
    bucket_data:string='';
    Table_User_Data:Array<EventAug>=[];
    Table_DecryptPSW:Array<string>=[];
    Individual_User_Data= new EventAug;

    recordToUpdate:number=0;

@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


  ngOnInit(){
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.Table_User_Data = this.LoginTable_User_Data;
      this.Table_DecryptPSW= this.LoginTable_DecryptPSW;
      this.count_invitees();
      if (this.identification.UserId===this.Admin_UserId) {
        // administrator is connected
        this.invite=false;
        this.myForm.controls['brunch'].setValue("y");
        this.myForm.controls['night'].setValue("y");
        this.myForm.controls['nbInvitees'].setValue(2);
        this.myForm.controls['userId'].setValue('Event-27AUG2022');
        this.myForm.controls['readRecord'].setValue(0);
        this.Error_Access_Server='';    
        // this.manageInvitees();


      } else {
          //this.manageInvitees(); // retrieve the object
          // a user is connected
          this.myForm.controls['brunch'].setValue(this.Table_User_Data[this.identification.id].brunch);
          this.myForm.controls['night'].setValue(this.Table_User_Data[this.identification.id].night);
          this.myForm.controls['nbInvitees'].setValue(this.Table_User_Data[this.identification.id].nbinvitees);
          this.myForm.controls['myComment'].setValue(this.Table_User_Data[this.identification.id].myComment);
          this.myForm.controls['yourComment'].setValue(this.Table_User_Data[this.identification.id].yourComment);
          }
      
  }

  goDown(event:string){
    if (event==='FR'){
      this.yourLanguage='FR'
    } if (event==='UK'){
      this.yourLanguage='UK'
    } else {
    this.scroller.scrollToAnchor(event);
    }
  }


  manageInvitees(){
   
    // get list of objects in bucket
    /*
    this.Google_Object_Name="Event-Aug2022/";
    this.Google_Bucket_Access_Root='https://storage.cloud.google.com/storage/v1/b/';
    this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o";
    this.http.get<any>(this.HTTP_Address )
          .subscribe(data => {
                this.Bucket_Info_Array=data;
                
                for (this.i=0; this.i<this.Bucket_Info_Array.items.length-1; this.i++ ){
                        this.Error_Access_Server= this.Error_Access_Server + ' ==== ' + this.Bucket_Info_Array.items[this.i].name ;
                }
              },   
              error_handler => {
                this.Error_Access_Server='error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                  // alert(this.message  + ' -- http get = ' + this.HTTP_Address);
                } 
          )
      */
    // ****** get content of object *******
    this.Google_Object_Name="Event-27AUG2022.json";
    this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media"; 
    this.http.get<any>(this.HTTP_Address )
          .subscribe((data ) => {
               
                this.bucket_data=JSON.stringify(data);
                var obj = JSON.parse(this.bucket_data);

                this.total_invitee=0;
                for (this.i=0; this.i<obj.length; this.i++){
                    this.Individual_User_Data= new EventAug;
                    this.Table_User_Data.push(this.Individual_User_Data);
                    this.Table_User_Data[this.i] =obj[this.i];
                    this.total_invitee=this.total_invitee+this.Table_User_Data[this.i].nbinvitees;

                    this.Table_DecryptPSW.push(' ');
                    this.Crypto_Key=this.Table_User_Data[this.i].key;
                    this.Crypto_Method=this.Table_User_Data[this.i].method;
                    this.Encrypt=this.Table_User_Data[this.i].psw;
                    this.onCrypt("Decrypt");
                    this.Table_DecryptPSW[this.i]= this.Decrypt;
                }

                },
                error_handler => {
                  this.Error_Access_Server='error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                } 
          )
    }
  
  clear(){
    this.myForm.reset({
      userId: '',
      psw:'',
      firstname:'',
      surname:'',
      readRecord:0
    });
  }

  ConfirmData(){
    const i=this.identification.id;
    if (this.myForm.controls['nbInvitees'].value!==this.Table_User_Data[i].nbinvitees ||
    this.myForm.controls['brunch'].value!==this.Table_User_Data[i].brunch ||
    this.myForm.controls['night'].value!==this.Table_User_Data[i].night ||
    this.myForm.controls['yourComment'].value!==this.Table_User_Data[i].yourComment)
   {
      // data has been modified - update the record 
      
      const i=this.identification.id;
      this.Table_User_Data[i].nbinvitees=this.myForm.controls['nbInvitees'].value;
      this.Table_User_Data[i].night=this.myForm.controls['night'].value;
      this.Table_User_Data[i].brunch=this.myForm.controls['brunch'].value;
      this.Table_User_Data[i].yourComment=this.myForm.controls['yourComment'].value;

      this.SaveRecord();
    }
  }

  ValidateRecord(){
    if (this.myForm.controls['readRecord'].value!==0){
        // read the item
        this.i=this.myForm.controls['readRecord'].value;
        if (this.i<=this.Table_User_Data.length) {
            this.i--
            this.myForm.controls['userId'].setValue(this.Table_User_Data[this.i].UserId);
            this.myForm.controls['firstname'].setValue(this.Table_User_Data[this.i].firstname);
            this.myForm.controls['surname'].setValue(this.Table_User_Data[this.i].surname);
            this.myForm.controls['nbInvitees'].setValue(this.Table_User_Data[this.i].nbinvitees);
            this.myForm.controls['brunch'].setValue(this.Table_User_Data[this.i].brunch);
            this.myForm.controls['night'].setValue(this.Table_User_Data[this.i].night);
            this.myForm.controls['psw'].setValue(this.Table_DecryptPSW[this.i]);
            this.myForm.controls['myComment'].setValue(this.Table_User_Data[this.i].myComment);
            this.myForm.controls['yourComment'].setValue(this.Table_User_Data[this.i].yourComment);
            this.myForm.controls['readRecord'].setValue(0);
            this.recordToUpdate=this.i;
      } else { this.error_message='wrong record to access';}

    } else {
          if (this.myForm.controls['night'].value.toLowerCase() !== "y" 
          && this.myForm.controls['night'].value.toLowerCase() !=='n'
          && this.myForm.controls['night'].value.toLowerCase() !=='na'){
            this.error_message='enter "y" or "n" for field "night"';
          } else 
          if (this.myForm.controls['brunch'].value.toLowerCase() !== "y" 
          && this.myForm.controls['brunch'].value.toLowerCase() !=='n'
          && this.myForm.controls['brunch'].value.toLowerCase() !=='na'){
            this.error_message='enter "y" or "n" for field "brunch"';
          } else 
          if (this.myForm.controls['brunch'].value === "" || this.myForm.controls['night'].value==='' ||
          this.myForm.controls['firstname'].value === "" || this.myForm.controls['surname'].value==='' ||
          this.myForm.controls['nbInvitees'].value === "" || this.myForm.controls['userId'].value==='' ||
          this.myForm.controls['psw'].value === ""
          ){
            this.error_message='one or several fields are empty';
          } else {
          
          if (this.recordToUpdate!==0){
            this.i=this.recordToUpdate;
            this.recordToUpdate=0;
          } else 
          {
                for (this.i=0; this.i<this.Table_User_Data.length && this.Table_User_Data[this.i].UserId!=='' && (
                    this.Table_User_Data[this.i].surname!==this.myForm.controls['surname'].value ||
                    this.Table_User_Data[this.i].firstname!==this.myForm.controls['firstname'].value)
                    ; this.i++ ){
                  
                }
                if (this.i>this.Table_User_Data.length-1) {     
                  this.Individual_User_Data= new EventAug;
                  this.Table_User_Data.push(this.Individual_User_Data);
                  this.i=this.Table_User_Data.length-1;
                } 
              }
          this.Table_User_Data[this.i].UserId=this.myForm.controls['userId'].value;
          this.Table_User_Data[this.i].firstname= this.myForm.controls['firstname'].value;
          this.Table_User_Data[this.i].surname=this.myForm.controls['surname'].value;
          this.Table_User_Data[this.i].nbinvitees=this.myForm.controls['nbInvitees'].value;
          this.Table_User_Data[this.i].brunch=this.myForm.controls['brunch'].value;
          this.Table_User_Data[this.i].night=this.myForm.controls['night'].value;
          this.Table_User_Data[this.i].myComment=this.myForm.controls['myComment'].value;
          this.Table_User_Data[this.i].yourComment=this.myForm.controls['yourComment'].value;
          this.Table_User_Data[this.i].id=this.i;
          this.Table_User_Data[this.i].key=2;
          this.Table_User_Data[this.i].method='AES';
          this.Table_DecryptPSW[this.i]=this.myForm.controls['psw'].value;
          this.Crypto_Key=this.Table_User_Data[this.i].key;
          this.Crypto_Method=this.Table_User_Data[this.i].method;
          this.Decrypt=this.Table_DecryptPSW[this.i];
          this.onCrypt("Encrypt");
          this.Table_User_Data[this.i].psw= this.Encrypt;
          
              
          this.Individual_User_Data=this.Table_User_Data[this.i];
          
          this.SaveRecord();
          this.count_invitees()
        }
      }

  }  

count_invitees(){
  this.total_invitee=0;
  for (this.i=0; this.i<this.Table_User_Data.length; this.i ++){
    this.total_invitee=this.total_invitee+this.Table_User_Data[this.i].nbinvitees;
   
  }
}

  SaveRecord(){
    this.Google_Object_Name="Event-27AUG2022.json";

    this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name  + '&uploadType=media';
    this.http.post(this.HTTP_Address,  this.Table_User_Data )
    .subscribe(res => {
          // this.Error_Access_Server=JSON.stringify( this.Table_User_Data) + " RETURN ==> " + JSON.stringify(res) + ' -- http post  has no errors = ' + this.HTTP_Address;
          // alert('Created Successfully');  

          },
          error_handler => {
            this.Error_Access_Server= "  object ===>   " + JSON.stringify( this.Table_User_Data)  + '   error message: ' + error_handler.message + ' error status: '+ error_handler.statusText+' name: '+ error_handler.name + ' url: '+ error_handler.url;
            // alert(this.Error_Access_Server_Post + ' --- ' +  this.Sent_Message + ' -- http post = ' + this.HTTP_AddressPOST);
          } 
     )
     this.returnDATA.emit(this.Table_User_Data);
  }

  onCrypt(type_crypto:string){
    if (type_crypto==='Encrypt'){
            this.Encrypt=encrypt(this.Decrypt,this.Crypto_Key,this.Crypto_Method);
      } else { // event=Decrypt
            this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
          } 
  }

}