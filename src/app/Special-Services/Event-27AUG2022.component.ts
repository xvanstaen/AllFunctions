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

    FrenchLabels=['Formulaire', 'Nombre de personnes','Plat principal','Boeuf', 'Poisson', "Reste la nuit à l'hotel", 'Oui', 'Non',
          "Si vous voulez jouer au golf merci d'indiquer",'jour','Samedi', 'Dimanche', 'nombre de joueurs', 'nombre de trous','trous',
          'Nos commentaires','Vos commentaires (i.e. restriction nourriture, autres)','Valider', 'Adresse'];
    EnglishLabels=['Form', 'Number of people','Main dish','Beef', 'Fish', 'Spend the night at the hotel', 'Yes', 'No',
          'If you want to play golf please indicate','day','Saturday', 'Sunday', 'number of people', 'number of holes','holes',
          'Our comments','Your feedback (e.g. food requirements, others)','Validate', 'Address'];
    LanguageLabels=['', '','','', '', '', 'Yes', 'No',
          'If you want to play golf please indicate','','Saturday', 'Sunday', 'number of people', 'number of holes','holes',
          '','Your feedback (e.g. food requirements, others)','Validate', 'Address'];

    @Output() returnDATA= new EventEmitter<any>();

    Admin_UserId:string="XMVIT-Admin";
    invite:boolean=true;
    total_invitee:number=0;
    total_rooms:number=0;

    MrName:string='';
    MrsName:string='';

    myForm = new FormGroup({
      userId: new FormControl(''),
      psw: new FormControl(''),
      firstname: new  FormControl(''),
      surname: new  FormControl(''),
      nbInvitees: new  FormControl(0),
      night: new  FormControl(''),
      brunch: new  FormControl(''),
      day: new  FormControl(''),
      golf: new  FormControl(0),
      golfHoles: new  FormControl(0),
      dishMr: new  FormControl(''),
      dishMrs: new  FormControl(''),
      practiceSaturday: new  FormControl(''),
      bouleSaturday: new  FormControl(''),
      bouleSunday: new  FormControl(''),
      readRecord: new  FormControl(0),
      myComment: new  FormControl(''),
      yourComment: new  FormControl(''),
      readAccess: new  FormControl(0),
      writeAccess: new  FormControl(0),
    });

    CommentStructure={
      dishMr:'B',
      dishMrs:'F',
      day:'',
      golf:0,
      holes:0,
      practiceSaturday:'y',
      bouleSaturday:'y',
      bouleSunday:'y',
      theComments:'',
      readAccess:0,
      writeAccess:0,
    }

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
    myKeyUp:any;
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
      this.  myKeyUp='';
      // get all the records from the login component via the @input
      this.Table_User_Data = this.LoginTable_User_Data;
      this.Table_DecryptPSW= this.LoginTable_DecryptPSW;
      
      // by default language is French
      this.LanguageLabels=this.FrenchLabels;
      this.yourLanguage='FR';

      // Admin features which purpose is to list all the records and update any field
      if (this.identification.UserId===this.Admin_UserId) {
        // administrator is connected
        this.invite=false;

        this.Error_Access_Server='';    
        // this.manageInvitees();
        this.count_invitees('Y');

      } else {
        this.invite=true;
          //this.manageInvitees(); // retrieve the object
          // a user is connected so must display his/her information
          this.myForm.controls['brunch'].setValue(this.Table_User_Data[this.identification.id].brunch);
          this.myForm.controls['night'].setValue(this.Table_User_Data[this.identification.id].night);
          this.Table_User_Data[this.identification.id].nbinvitees=Number(this.Table_User_Data[this.identification.id].nbinvitees);
          this.myForm.controls['nbInvitees'].setValue(this.Table_User_Data[this.identification.id].nbinvitees);
          this.myForm.controls['myComment'].setValue(this.Table_User_Data[this.identification.id].myComment);
    
          this.ConvertComment();
          this.CommentStructure.readAccess ++;
          this.Table_User_Data[this.identification.id].yourComment=JSON.stringify(this.CommentStructure);
          this.SaveRecord();

          }
          this.scroller.scrollToAnchor('targetTOP');
  }    

  goDown(event:string){
    if (event==='FR'){
      this.yourLanguage='FR';
      this.LanguageLabels=this.FrenchLabels;
    } if (event==='UK'){
      this.yourLanguage='UK';
      this.LanguageLabels=this.EnglishLabels;
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

      // always update the record 
      this.Table_User_Data[i].nbinvitees=Number(this.myForm.controls['nbInvitees'].value);
      this.Table_User_Data[i].night=this.myForm.controls['night'].value;
      this.Table_User_Data[i].brunch=this.myForm.controls['brunch'].value;

      this.CommentStructure.dishMr=this.myForm.controls['dishMr'].value;
      this.CommentStructure.dishMrs=this.myForm.controls['dishMrs'].value;
      this.CommentStructure.golf=this.myForm.controls['golf'].value;
      if (this.myForm.controls['golf'].value===0){
          this.myForm.controls['golfHoles'].setValue(0);
          this.myForm.controls['day'].setValue('');
      } else{
          this.CommentStructure.holes=this.myForm.controls['golfHoles'].value;
          this.CommentStructure.day=this.myForm.controls['day'].value;
      }
      this.CommentStructure.theComments=this.myForm.controls['yourComment'].value;
      this.CommentStructure.practiceSaturday=this.myForm.controls['practiceSaturday'].value;
      this.CommentStructure.bouleSaturday=this.myForm.controls['bouleSaturday'].value;
      this.CommentStructure.bouleSunday=this.myForm.controls['bouleSunday'].value;
      this.CommentStructure.writeAccess ++;
      this.Table_User_Data[i].yourComment=JSON.stringify(this.CommentStructure);
     
      this.SaveRecord();

  }

  ValidateRecord(){

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
          this.Table_User_Data[this.i].nbinvitees=Number(this.myForm.controls['nbInvitees'].value);
          this.Table_User_Data[this.i].brunch=this.myForm.controls['brunch'].value;
          this.Table_User_Data[this.i].night=this.myForm.controls['night'].value;
          this.Table_User_Data[this.i].myComment=this.myForm.controls['myComment'].value;
          this.CommentStructure.dishMr=this.myForm.controls['dishMr'].value;
          this.CommentStructure.dishMrs=this.myForm.controls['dishMrs'].value;
          if (this.myForm.controls['golf'].value===0){
            this.myForm.controls['golfHoles'].setValue(0);
            this.myForm.controls['day'].setValue('');
          }
          this.CommentStructure.practiceSaturday=this.myForm.controls['practiceSaturday'].value;
          this.CommentStructure.bouleSaturday=this.myForm.controls['bouleSaturday'].value;
          this.CommentStructure.bouleSunday=this.myForm.controls['bouleSunday'].value;
          this.CommentStructure.golf=this.myForm.controls['golf'].value;
          this.CommentStructure.holes=this.myForm.controls['golfHoles'].value;
          this.CommentStructure.day=this.myForm.controls['day'].value;
          this.CommentStructure.theComments=this.myForm.controls['yourComment'].value;
          this.Table_User_Data[this.i].yourComment=JSON.stringify(this.CommentStructure);

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
          
          this.count_invitees('N')



  }  

ReadRecord(){
  if (this.myForm.controls['readRecord'].value<=this.Table_User_Data.length){
    // read the item
        this.i=this.myForm.controls['readRecord'].value;
        this.identification.id=this.i;
        this.myForm.controls['userId'].setValue(this.Table_User_Data[this.i].UserId);
        this.myForm.controls['firstname'].setValue(this.Table_User_Data[this.i].firstname);
        this.myForm.controls['surname'].setValue(this.Table_User_Data[this.i].surname);
        this.Table_User_Data[this.i].nbinvitees=Number(this.Table_User_Data[this.i].nbinvitees);
        this.myForm.controls['nbInvitees'].setValue(this.Table_User_Data[this.i].nbinvitees);
        this.myForm.controls['brunch'].setValue(this.Table_User_Data[this.i].brunch);
        this.myForm.controls['night'].setValue(this.Table_User_Data[this.i].night);
        this.myForm.controls['psw'].setValue(this.Table_DecryptPSW[this.i]);

        this.ConvertComment();

        this.myForm.controls['readRecord'].setValue(0);
        this.recordToUpdate=this.i;
  } else { this.error_message='wrong record to access';}
}


count_invitees(ConvertComment:string){
  this.total_invitee = 0;
  this. total_rooms = 0;
  for (this.i=0; this.i<this.Table_User_Data.length; this.i ++){

    this.total_invitee = this.total_invitee + Number(this.Table_User_Data[this.i].nbinvitees);
    if (this.Table_User_Data[this.i].night==='y'){
      this. total_rooms = this. total_rooms+Number(this.Table_User_Data[this.i].nbinvitees);
    }
    
    if (ConvertComment==='Y'){
        this.identification.id=this.i;
        this.ConvertComment();
    }
  }
  this. total_rooms = this. total_rooms/2;
}

ConvertComment(){
  this.CommentStructure=JSON.parse(this.Table_User_Data[this.identification.id].yourComment);
  if (this.CommentStructure.dishMr==='M'){
    this.CommentStructure.dishMr='B';
  }
  this.myForm.controls['dishMr'].setValue(this.CommentStructure.dishMr);
  this.myForm.controls['dishMrs'].setValue(this.CommentStructure.dishMrs);
  this.myForm.controls['golf'].setValue(this.CommentStructure.golf);
  this.myForm.controls['golfHoles'].setValue(this.CommentStructure.holes);
  this.myForm.controls['yourComment'].setValue(this.CommentStructure.theComments);
  this.myForm.controls['day'].setValue(this.CommentStructure.day);
  if (this.CommentStructure.practiceSaturday===undefined){
    this.CommentStructure.practiceSaturday='n';
    this.CommentStructure.bouleSaturday='n';
    this.CommentStructure.bouleSunday='n';
  } 
  if (this.CommentStructure.readAccess===undefined){
    this.CommentStructure.readAccess=0;
  }
  this.myForm.controls['readAccess'].setValue(this.CommentStructure.readAccess);
  if (this.CommentStructure.writeAccess===undefined){
    this.CommentStructure.writeAccess=0;
  }
  this.myForm.controls['writeAccess'].setValue(this.CommentStructure.writeAccess);

  this.myForm.controls['practiceSaturday'].setValue(this.CommentStructure.practiceSaturday);
  this.myForm.controls['bouleSaturday'].setValue(this.CommentStructure.bouleSaturday);
  this.myForm.controls['bouleSunday'].setValue(this.CommentStructure.bouleSunday);

  const i=this.Table_User_Data[this.identification.id].firstname.indexOf('&');
  if (i>1){
        this.MrName=this.Table_User_Data[this.identification.id].firstname.substring(0,i-1);
        this.MrsName=this.Table_User_Data[this.identification.id].firstname.substring(i+1,this.Table_User_Data[this.identification.id].firstname.length);
  } else{
      this.MrName=this.Table_User_Data[this.identification.id].firstname
      if (this.yourLanguage==='FR'){
          this.MrsName='Madame';
        } else{
            this.MrsName='Mrs'
          }
  }
}

  keyupFunction(event:any){ // TO BE TESTED
      this.myKeyUp=event.target.value;
  }

  ClickInvitees(event:any){
    const i = event;
    this.Table_User_Data[this.identification.id].nbinvitees=Number(event.target.value);
  }


  SaveRecord(){
    this.Google_Object_Name="Event-27AUG2022.json";

    this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name  + '&uploadType=media';
    this.http.post(this.HTTP_Address,  this.Table_User_Data )
    .subscribe(res => {
          this.returnDATA.emit(this.Table_User_Data);

          },
          error_handler => {
            this.Error_Access_Server= "  object ===>   " + JSON.stringify( this.Table_User_Data)  + '   error message: ' + error_handler.message + ' error status: '+ error_handler.statusText+' name: '+ error_handler.name + ' url: '+ error_handler.url;
            // alert(this.Error_Access_Server_Post + ' --- ' +  this.Sent_Message + ' -- http post = ' + this.HTTP_AddressPOST);
          } 
     )
  }

  onCrypt(type_crypto:string){
    if (type_crypto==='Encrypt'){
            this.Encrypt=encrypt(this.Decrypt,this.Crypto_Key,this.Crypto_Method);
      } else { // event=Decrypt
            this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
          } 
  }

  updateAllRecords(){
    this.SaveRecord();
    this.clear();
  }

  AccessRecord(id:number){
    this.myForm.controls['readRecord'].setValue(id);
    this.ReadRecord();
    this.scroller.scrollToAnchor('targetInvitees');
  }

  DeleteRecords(){
    this.Table_User_Data.splice(this.identification.id,1);
    for (this.i=this.identification.id; this.i< this.Table_User_Data.length; this.i++){
      this.Table_User_Data[this.i].id--;
    }
    this.count_invitees('N');
  }

}