import { Component, OnInit , Input, Output, HostListener,  HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID} from '@angular/core';
  
import { DatePipe, formatDate, ViewportScroller } from '@angular/common'; 

import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';


import { BucketList } from '../JsonServerClass';
import { Bucket_List_Info } from '../JsonServerClass';

// configServer is needed to use ManageGoogleService
// it is stored in MangoDB and accessed via ManageMangoDBService
import { configServer, XMVConfig, LoginIdentif} from '../JsonServerClass';
import { msgConsole } from '../JsonServerClass';
import {msginLogConsole} from '../consoleLog'
import { environment } from 'src/environments/environment';

import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import {AccessConfigService} from 'src/app/CloudServices/access-config.service';

import {  getStyleDropDownContent, getStyleDropDownBox, classDropDown } from '../DropDownStyle';
import {classPosDiv, getPosDiv} from '../getPosDiv';
import {CalcFatCalories} from '../Health/CalcFatCalories';
import {classConfHTMLFitHealth, classConfTableAll} from '../Health/classConfHTMLTableAll';

import {ClassCaloriesFat, mainClassCaloriesFat} from '../Health/ClassHealthCalories';
import {ClassItem, DailyReport, mainDailyReport, ClassMeal, ClassDish} from '../Health/ClassHealthCalories';

import {ClassSubConv, mainConvItem, mainRecordConvert, mainClassUnit} from '../ClassConverter';
import {mainClassConv, ClassConv, ClassUnit, ConvItem, recordConvert} from '../ClassConverter';

export class classRecipe{
  ingr:string='';
  quantity:number=0;
  unit:string='gram';
}

export class classRecordRecipe{
  name:string='';
  data:Array<any>=[];
  dataPerso:Array<any>=[];
  materiel:string='';
  materielPerso:string='';
  nutrition=new classNutrition;
  nutritionPerso=new classNutrition;
  comments:string='';
  commentsPerso:string='';
}

export class classNutrition{
  calories:number=0;
  proteins:number=0;
  carbs:number=0;
  cholesterol:number=0;
  satFat:number=0;
  totalWeight:number=0;
}

export class classFileRecipe{
  fileType:string='';
  recipe:Array<classRecordRecipe>=[];
}

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})

export class RecipeComponent {
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
@Input() InConvToDisplay=new mainConvItem;

ConfigCaloriesFat=new mainClassCaloriesFat;
ConvertUnit=new mainClassConv;

returnData={
  error:0,
  outHealthData: new DailyReport
}

posDivAfterTitle= new classPosDiv;
posDivBeforeTitle= new classPosDiv;

recipeFile=new classFileRecipe;
initialRecipeFile=new classFileRecipe;

Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
googleBucketName:string='';
googleObjectName:string='';
myListOfObjects=new Bucket_List_Info;

EventHTTPReceived:Array<boolean>=[];
Error_Access_Server:string='';
id_Animation:Array<number>=[];
TabLoop:Array<number>=[];
NbWaitHTTP:number=0;

recipe:string='';
recordRecipe:number=0;

listActions:Array<string>=['Cancel','Delete','Add after', 'Add before', 'Copy','Move after', 'Move before','Change value for all','Calculate nutrition facts'];
tabRecipe:Array<string>=[];
tabActionRecipe:Array<string>=['Cancel','Create','Delete'];
recipeTable:Array<classFileRecipe>=[]

tabDialog:Array<boolean>=[];
prevDialog:number=0;

heightActionRecipe:number=80;
heightSearchDropdown:number=0;
heightListRecipe:number=0;
theHeight:number=0;
posLeftDropDown:number=40;
posTopDropDown:number=-25;

fileNb:number=-1;

isListOfObjectsRetrieved:boolean=false;
isFileRetrieved:boolean=false;
isFileUpdated:boolean=false;
isListRecipe:boolean=false;
IsSaveConfirmed:boolean=false;
isActionRecipe:boolean=false;
isCreateRecipeName:boolean=false;
isChangeValueForAll:boolean=false;
isChangeValueForAllPerso:boolean=false;
isDeleteRecipe:boolean=false;
changeValue:number=0;

SpecificForm=new FormGroup({
  FileName: new FormControl('', { nonNullable: true }),
  changeValue: new FormControl('', { nonNullable: true }),
})

idText:string='';
idNb:number=0;

temporaryNameRecipe:string="";

textToSearch:string='';
tabSearch:Array<string>=[];

posGramTabConvert:number=0;

tabListCalFat:Array<any>=[];
isIngrDropDown:boolean=false;
ingrType:string="";

heightDropDown:number=0;
scrollY:string='hidden';
maxHeightDropDown:number=200;
heightItemDropDown:number=25;
marginLeft:number=50;
marginTop:number=20;
styleBox:any;
styleBoxOption:any;
styleBoxAction:any;
styleBoxOptionAction:any;

theStdPersoDisplay:Array<string>=['Y','N'];

ngOnInit(){
  this.googleBucketName=this.identification.recipe.bucket;
  this.listActions;
  // get list of objects
  this.GetAllObjects(0);
  this.theHeight=(this.listActions.length + 1)* 25;
  this.getRecord(this.identification.configFitness.bucket,this.identification.configFitness.files.calories,2);
  this.getRecord(this.identification.configFitness.bucket,this.identification.configFitness.files.convertUnit,3);
  this.styleBoxAction = {
    'width': 150 + 'px',
    'height': 90 + 'px',
    'position': 'absolute',
    'margin-left':'15%', 
    'margin-top':'5px',
    'z-index': '1'
  }
  this.styleBoxOptionAction = {
    'background-color':'lightgrey',
    'width': 150 + 'px',
    'height':90 + 'px',
    'margin-top' :  0 + 'px',
    'margin-left': 0 + 'px',
    'overflow-x': 'hidden',
    'overflow-y': 'hidden',
    'border':'1px blue solid'
    }
}

RadioSelection(event:any){
  const i=parseInt(event.target.id.substring(2));
  const val=Number(event.target.id.substring(0,1));
  if (this.fileNb !== Number(event.target.id)){
    this.recipeFile.recipe.splice(0,this.recipeFile.recipe.length);
    this.initialRecipeFile.recipe.splice(0,this.initialRecipeFile.recipe.length);
    this.fileNb = Number(event.target.id);
    this.getRecord(this.googleBucketName, this.myListOfObjects.items[this.fileNb].name,1);
    this.recordRecipe=0;
    
  } else {
      // keep the files
      this.recipeFile.recipe.splice(0,this.recipeFile.recipe.length);
      this.fillFileRecord(this.initialRecipeFile,this.recipeFile);
      
  }

}

resetBooleans(){
  this.isListRecipe=false;
  this.isActionRecipe=false;
  this.isDeleteRecipe=false;
  this.isIngrDropDown=false;
  this.IsSaveConfirmed=false;
  this.isCreateRecipeName=false;
  this.isListRecipe=false;
  this.tabDialog[this.prevDialog]=false;
}
onAction(event:any){
  
  this.resetBooleans();

  this.findId(event.target.id);
  if (this.idText==='Action'){
    this.prevDialog=this.idNb;
    this.tabDialog[this.prevDialog]=true;
    this.listActions[4]="Copy to perso";
  } else  if (this.idText==='ActionPerso'){
    this.prevDialog=this.idNb;
    this.tabDialog[this.prevDialog]=true;
    this.listActions[4]="Copy to standard";
  } else if (event.target.id==='listRecipe' && this.isRecipeModified===false){
    this.tabRecipe.splice(0,this.tabRecipe.length);
    this.tabRecipe[0]='Cancel';
    for (var i=0; i<this .recipeFile.recipe.length; i++){
      this.tabRecipe[i+1] = this .recipeFile.recipe[i].name;
    }
    if (this.tabRecipe.length>9){
      this.heightListRecipe=250;
    } else { this.heightListRecipe = this.tabRecipe.length * 25;}
    this.isListRecipe=true;
  } else if(event.target.id==='ActionRecipe'){
    this.isActionRecipe=true;
  }
  
}
margLeftChangeAll:number=0;
currentValue:number=0;
currentIngr:string="";
afterDropDown(event:any){
  this.tabDialog[this.prevDialog]=false;
  this.resetBooleans();
  var i=0;
  if (event.target.id==='Action'){
      if (event.target.textContent.trim()==="Cancel" ){

      } else if (event.target.textContent.trim()==="Delete" ){
        
      } else if (event.target.textContent.trim()==="Add after" ){
        const pushData=new classRecipe;
        this.recipeFile.recipe[this.recordRecipe].data.splice(this.idNb+1,0,pushData);
        const pushDataPerso=new classRecipe;
        this.recipeFile.recipe[this.recordRecipe].dataPerso.push(pushDataPerso);
      } else if (event.target.textContent.trim()==="Add before" ){
        const pushData=new classRecipe;
        this.recipeFile.recipe[this.recordRecipe].data.splice(this.idNb,0,pushData);
        const pushDataPerso=new classRecipe;
        this.recipeFile.recipe[this.recordRecipe].dataPerso.push(pushDataPerso);
      } else if (event.target.textContent.trim().substring(0,4)==="Copy" ){
        for (i=0; i<this.recipeFile.recipe[this.recordRecipe].dataPerso.length && 
          this.recipeFile.recipe[this.recordRecipe].dataPerso[i].ingr!==""; i++){}
        if (i===this.recipeFile.recipe[this.recordRecipe].dataPerso.length){
          const pushData=new classRecipe;
          this.recipeFile.recipe[this.recordRecipe].data.push(pushData);
          const pushDataPerso=new classRecipe;
          this.recipeFile.recipe[this.recordRecipe].dataPerso.push(pushDataPerso);
          i=this.recipeFile.recipe[this.recordRecipe].dataPerso.length-1;
          
        }
        this.recipeFile.recipe[this.recordRecipe].dataPerso[i].ingr=this.recipeFile.recipe[this.recordRecipe].data[this.idNb].ingr;
        this.recipeFile.recipe[this.recordRecipe].dataPerso[i].quantity=this.recipeFile.recipe[this.recordRecipe].data[this.idNb].quantity;
        this.recipeFile.recipe[this.recordRecipe].dataPerso[i].unit=this.recipeFile.recipe[this.recordRecipe].data[this.idNb].unit;

      } else if (event.target.textContent.trim()==="Move after" ){
        if (this.idNb<this.recipeFile.recipe[this.recordRecipe].data.length-1){
          var saveData=new classRecipe;
          saveData=this.recipeFile.recipe[this.recordRecipe].data[this.idNb];
          this.recipeFile.recipe[this.recordRecipe].data[this.idNb]=this.recipeFile.recipe[this.recordRecipe].data[this.idNb+1];
          this.recipeFile.recipe[this.recordRecipe].data[this.idNb+1]=saveData;
        }
      } else if (event.target.textContent.trim()==="Move before" ){
        if (this.idNb>0){
          var saveData=new classRecipe;
          saveData=this.recipeFile.recipe[this.recordRecipe].data[this.idNb];
          this.recipeFile.recipe[this.recordRecipe].data[this.idNb]=this.recipeFile.recipe[this.recordRecipe].data[this.idNb-1];
          this.recipeFile.recipe[this.recordRecipe].data[this.idNb-1]=saveData;
        }
        
      } else if (event.target.textContent.trim()==="Change value for all" ){
        this.isChangeValueForAll=true;
        this.currentValue=this.recipeFile.recipe[this.recordRecipe].data[this.idNb].quantity;
        this.currentIngr=this.recipeFile.recipe[this.recordRecipe].data[this.idNb].ingr;
        this.margLeftChangeAll=-250;
      } else if (event.target.textContent.trim()==="Calculate nutrition facts" ){
        this.calculateNutrition('std');
    }
  } else if (event.target.id==='ActionPerso'){
    if (event.target.textContent.trim()==="Cancel" ){

    } else if (event.target.textContent.trim()==="Delete" ){
      
    } else if (event.target.textContent.trim()==="Add after" ){
      const pushDataPerso=new classRecipe;
      this.recipeFile.recipe[this.recordRecipe].dataPerso.splice(this.idNb+1,0,pushDataPerso);
      const pushData=new classRecipe;
      this.recipeFile.recipe[this.recordRecipe].data.push(pushData);
    } else if (event.target.textContent.trim()==="Add before" ){
      const pushDataPerso=new classRecipe;
      this.recipeFile.recipe[this.recordRecipe].dataPerso.splice(this.idNb,0,pushDataPerso);
      const pushData=new classRecipe;
      this.recipeFile.recipe[this.recordRecipe].data.push(pushData);
      
    } else if (event.target.textContent.trim().substring(0,4)==="Copy" ){
      for (var i=0; i<this.recipeFile.recipe[this.recordRecipe].data.length && 
        this.recipeFile.recipe[this.recordRecipe].data[i].ingr!==""; i++){}
      if (i===this.recipeFile.recipe[this.recordRecipe].data.length){
        const pushDataPerso=new classRecipe;
        this.recipeFile.recipe[this.recordRecipe].dataPerso.push(pushDataPerso);
        const pushData=new classRecipe;
        this.recipeFile.recipe[this.recordRecipe].data.push(pushData);
        i=this.recipeFile.recipe[this.recordRecipe].data.length-1;
      }
      this.recipeFile.recipe[this.recordRecipe].data[i].ingr=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].ingr;
      this.recipeFile.recipe[this.recordRecipe].data[i].quantity=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].quantity;
      this.recipeFile.recipe[this.recordRecipe].data[i].unit=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].unit;

    } else if (event.target.textContent.trim()==="Move after" ){
      if (this.idNb<this.recipeFile.recipe[this.recordRecipe].dataPerso.length-1){
        var saveData=new classRecipe;
        saveData=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb];
        this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb]=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb+1];
        this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb+1]=saveData;
      }
    } else if (event.target.textContent.trim()==="Move before" ){
      if (this.idNb>0){
        var saveData=new classRecipe;
        saveData=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb];
        this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb]=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb-1];
        this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb-1]=saveData;
      } 
    } else if (event.target.textContent.trim()==="Change value for all" ){
      this.isChangeValueForAllPerso=true;
      this.currentValue=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].quantity;
      this.currentIngr=this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].ingr;
      this.margLeftChangeAll=30;
    } else if (event.target.textContent.trim()==="Calculate nutrition facts" ){
        this.calculateNutrition('perso');
    }
  } else if (event.target.id==='selRecipe'){
    if (event.target.textContent.trim()==="Cancel" ){

    } else {
        this.recordRecipe=Number(event.target.value) - 1;
    }
  } else if (event.target.id.substring(0,7)==="selText"){
    this.findId(event.target.id);
    // search text is selected
    //for (var i=0; i<this.recipeFile.recipe.length && this.recipeFile.recipe[i].name!==this.tabSearch[Number(event.target.value)]; i++){};
    for (var i=0; i<this.recipeFile.recipe.length && this.recipeFile.recipe[i].name!==this.tabSearch[Number(this.idNb)]; i++){};
    if (i<this.recipeFile.recipe.length){this.recordRecipe=i;};
    this.tabSearch.splice(0,this.tabSearch.length);
    this.textToSearch = "";
  
  } else if(event.target.id==='ActionRecipe'){
    this.isActionRecipe=false;
    if (this.tabActionRecipe[event.target.value]==="Cancel"){

    } else if (this.tabActionRecipe[event.target.value]==="Delete"){
      this.isDeleteRecipe=true;   
      this.delMsg=this.recipeFile.recipe[this.recordRecipe].name; 
      //this.styleBox=getStyleDropDownContent(90, 240);
      this.styleBox = {
        'width': 90 + 'px',
        'height': 240 + 'px',
        'position': 'absolute',
        'margin-left':'15%', 
        'margin-top':'5px',
        'z-index': '1'
      }
      //this.styleBoxOption=getStyleDropDownBox(90, 240,  0, 0, "hidden");
      this.styleBoxOption = {
        'background-color':'cyan',
        'width': 240 + 'px',
        'height':90 + 'px',
        'margin-top' :  0 + 'px',
        'margin-left': 0 + 'px',
        'overflow-x': 'hidden',
        'overflow-y': 'hidden',
        'border':'1px blue solid'
        }

    } if (this.tabActionRecipe[event.target.value]==="Create"){

      const classRecord=new classRecordRecipe;
      this.recipeFile.recipe.push(classRecord);
      this.recordRecipe=this.recipeFile.recipe.length-1;
      const pushData=new classRecipe;
      this.recipeFile.recipe[this.recordRecipe].data.push(pushData);
      const pushDataPerso=new classRecipe;
      this.recipeFile.recipe[this.recordRecipe].dataPerso.push(pushDataPerso);
      this.isRecipeModified=true;
      this.isCreateRecipeName=true;
      this.recipeFile.recipe[this.recordRecipe].name="";
      }
  }
  this.calculateHeight();
}

onChangeValues(event:any){

  var value = 0;
  if (event.target.id==="cancel"){this.resetBooleans();}
  else {
    this.changeValue=Number(this.SpecificForm.controls["changeValue"].value);
    if (this.changeValue !==0){
      
      if (this.isChangeValueForAll === true){
        value = this.changeValue / this.recipeFile.recipe[this.recordRecipe].data[this.idNb].quantity ;
        for (var i=0; i<this.recipeFile.recipe[this.recordRecipe].data.length; i++){
          this.recipeFile.recipe[this.recordRecipe].data[i].quantity = this.recipeFile.recipe[this.recordRecipe].data[i].quantity * value;
        }
        
    
      } else if (this.isChangeValueForAllPerso === true){
        value = this.changeValue / this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].quantity;
        for (var i=0; i<this.recipeFile.recipe[this.recordRecipe].dataPerso.length; i++){
          this.recipeFile.recipe[this.recordRecipe].dataPerso[i].quantity = this.recipeFile.recipe[this.recordRecipe].dataPerso[i].quantity * value;
        }
      }
    }
  }
  
  this.isChangeValueForAll=false;
  this.isChangeValueForAllPerso=false;
  this.currentIngr="";
  this.currentValue=0;

}

calculateNutrition(type:string){
  var theTotal=0;
  if (type==='std' || type==='all'){
    theTotal=0;
    this.processNutrition(this.recipeFile.recipe[this.recordRecipe].data);
    this.recipeFile.recipe[this.recordRecipe].nutrition.calories=this.returnData.outHealthData.total.Calories;
    this.recipeFile.recipe[this.recordRecipe].nutrition.carbs=this.returnData.outHealthData.total.Carbs + this.returnData.outHealthData.total.Sugar;
    this.recipeFile.recipe[this.recordRecipe].nutrition.proteins=this.returnData.outHealthData.total.Protein;
    this.recipeFile.recipe[this.recordRecipe].nutrition.cholesterol=this.returnData.outHealthData.total.Cholesterol;
    this.recipeFile.recipe[this.recordRecipe].nutrition.satFat=this.returnData.outHealthData.total.Fat.Saturated;
    for (var i=0; i<this.recipeFile.recipe[this.recordRecipe].data.length; i++){
      if (this.recipeFile.recipe[this.recordRecipe].data[i].unit==='gram'){
        theTotal=theTotal+Number(this.recipeFile.recipe[this.recordRecipe].data[i].quantity);
      } else {
        // convert unit
        for (var j=0; j<this.ConvertUnit.tabConv[this.posGramTabConvert].convert.length && 
          this.ConvertUnit.tabConv[this.posGramTabConvert].convert[j].toUnit!==this.recipeFile.recipe[this.recordRecipe].data[i].unit; j++ ){}
          if (j<this.ConvertUnit.tabConv[this.posGramTabConvert].convert.length){
            theTotal=theTotal+Number(this.recipeFile.recipe[this.recordRecipe].data[i].quantity) / Number(this.ConvertUnit.tabConv[this.posGramTabConvert].convert[j].value);
          } else { 
            // error 
          }
      }
    }
    this.recipeFile.recipe[this.recordRecipe].nutrition.totalWeight=theTotal;
  } 
  if (type==='perso' || type==='all'){
    this.processNutrition(this.recipeFile.recipe[this.recordRecipe].dataPerso);
    theTotal=0;
    this.recipeFile.recipe[this.recordRecipe].nutritionPerso.calories=this.returnData.outHealthData.total.Calories;
    this.recipeFile.recipe[this.recordRecipe].nutritionPerso.carbs=this.returnData.outHealthData.total.Carbs + this.returnData.outHealthData.total.Sugar;
    this.recipeFile.recipe[this.recordRecipe].nutritionPerso.proteins=this.returnData.outHealthData.total.Protein;
    this.recipeFile.recipe[this.recordRecipe].nutritionPerso.cholesterol=this.returnData.outHealthData.total.Cholesterol;
    this.recipeFile.recipe[this.recordRecipe].nutritionPerso.satFat=this.returnData.outHealthData.total.Fat.Saturated;
    for (var i=0; i<this.recipeFile.recipe[this.recordRecipe].dataPerso.length; i++){
      if (this.recipeFile.recipe[this.recordRecipe].dataPerso[i].unit==='gram'){
        theTotal=theTotal+Number(this.recipeFile.recipe[this.recordRecipe].dataPerso[i].quantity);
      } else {
        // convert unit
        for (var j=0; j<this.ConvertUnit.tabConv[this.posGramTabConvert].convert.length && 
          this.ConvertUnit.tabConv[this.posGramTabConvert].convert[j].toUnit!==this.recipeFile.recipe[this.recordRecipe].dataPerso[i].unit; j++ ){}
          if (j<this.ConvertUnit.tabConv[this.posGramTabConvert].convert.length){
            theTotal=theTotal+Number(this.recipeFile.recipe[this.recordRecipe].dataPerso[i].quantity) / Number(this.ConvertUnit.tabConv[this.posGramTabConvert].convert[j].value);
          } else { 
            // error 
          }
      }
    }
    this.recipeFile.recipe[this.recordRecipe].nutritionPerso.totalWeight=theTotal;
  } 
 
}
processNutrition(infile:any){

var myHealth=new DailyReport;
myHealth.date=new Date();
var j=0;
const classMeal=new ClassMeal;
myHealth.meal.push(classMeal);
for (var i=0; i<infile.length; i++){
    const classDish=new ClassDish;
    myHealth.meal[0].dish.push(classDish);
    j=myHealth.meal[0].dish.length-1;
    myHealth.meal[0].dish[j].name=infile[i].ingr;
    myHealth.meal[0].dish[j].quantity=infile[i].quantity;
    myHealth.meal[0].dish[j].unit=infile[i].unit;
}

this.returnData = CalcFatCalories(this.ConfigCaloriesFat, myHealth, this.ConvertUnit);

}

/** 
selectedPosition ={ 
  x: 0,
  y: 0} ;

selectedPositionPage ={ 
    x: 0,
    y: 0} ;
selectedPositionClient ={ 
      x: 0,
      y: 0} ;

theEvent={
    target:{
      id:"",
      value:0,
      textContent:""
    }
}
***/

// @HostListener('window:mouseup', ['$event'])
onMouseUp(evt: MouseEvent) {
    this.modifInput(evt);
    //this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    //this.selectedPositionPage = { x: evt.pageX, y: evt.pageY };
    //this.selectedPositionClient = { x: evt.clientX, y: evt.clientY };
  }

filterCalFat(ingr:string){
  this.tabListCalFat.splice(0,this.tabListCalFat.length);
  var j=-1;
  for (var i=0; i<this.ConfigCaloriesFat.tabCaloriesFat.length; i++){
    for (var k=0; k<this.ConfigCaloriesFat.tabCaloriesFat[i].Content.length; k++){
      if (this.ConfigCaloriesFat.tabCaloriesFat[i].Content[k].Name.toLowerCase().indexOf(ingr.toLowerCase().trim()) !== -1){
        j++
        this.tabListCalFat.push({name:"",serving:"",unit:""})
        this.tabListCalFat[j].name=this.ConfigCaloriesFat.tabCaloriesFat[i].Content[k].Name;
        this.tabListCalFat[j].serving=this.ConfigCaloriesFat.tabCaloriesFat[i].Content[k].Serving;
        this.tabListCalFat[j].unit=this.ConfigCaloriesFat.tabCaloriesFat[i].Content[k].ServingUnit;
      }
    }
  }
  if (this.tabListCalFat.length!==0){
    this.isIngrDropDown=true;
    if (this.tabListCalFat.length *  this.heightItemDropDown > this.maxHeightDropDown){
      this.heightDropDown=this.maxHeightDropDown;
      this.scrollY='scroll';
    } else {
      this.heightDropDown=this.tabListCalFat.length *  this.heightItemDropDown;
      this.scrollY='hidden';
    }
    /***
    this.posDivBeforeTitle=getPosDiv("posDivBeforeTitle");
    this.posDivAfterTitle=getPosDiv("posAfterTitle");
    this.marginTop=Math.trunc((this.selectedPositionClient.y - this.posDivAfterTitle.ClientRect.Top) / 25 );
    ****/
    this.styleBox=getStyleDropDownContent(this.heightDropDown, 230 );
    this.styleBoxOption=getStyleDropDownBox(this.heightDropDown, 230, 0 , 0, this.scrollY);
  } else {
    this.isIngrDropDown=false;
  }
  
}


nameRecipe(event:any){
  if (event.target.id==='input'){
    this.temporaryNameRecipe=event.target.value;
  }
  if (event.target.id==='save'){
    this.isCreateRecipeName=false;
    this.recipeFile.recipe[this.recordRecipe].name=this.temporaryNameRecipe;
  } else if (event.target.id==='clear'){
    this.temporaryNameRecipe="";
  } else if (event.target.id==='cancel'){
    this.recipeFile.recipe.splice(this.recordRecipe,1);
    this.temporaryNameRecipe="";
    this.recordRecipe=0;
    this.resetBooleans();
  }
}

delMsg:string="";
delRecipe(event:any){
  this.isDeleteRecipe=false;
  if (event.target.id==='YesDelConfirm'){

    this.recipeFile.recipe.splice(this.recordRecipe,1);
    this.recordRecipe=0;
    this.calculateHeight();
  }
}

findId(id:string){
  const i=id.indexOf('-');
  if (i===-1){
    this.idText=id;
    this.idNb=0;
  } else {
    this.idText=id.substring(0,i);
    this.idNb=Number(id.substring(i+1));
  }
}

searchText(event:any){
  var j=-1;
  if (event.target.id==='search'){
    this.textToSearch = event.target.value;
    this.tabSearch.splice(0,this.tabSearch.length);
    for (var i=0; i<this.recipeFile.recipe.length; i++){
      if (this.recipeFile.recipe[i].name.indexOf(this.textToSearch)!==-1 || this.textToSearch===""){
        j++
        this.tabSearch[j]=this.recipeFile.recipe[i].name;
      }
      if (this.tabSearch.length>9){
        this.heightSearchDropdown=250;
      } else {
        this.heightSearchDropdown=25*this.tabSearch.length;
      }
    }

  } else if (event.target.id==='cancel'){
    this.textToSearch = "";
    this.tabSearch.splice(0,this.tabSearch.length);
    this.resetBooleans();
  }
}
isRecipeModified:boolean=false;

modifInput(event:any){
  this.findId(event.target.id);
  this.isIngrDropDown=false;
  this.isRecipeModified=true;
  if (this.idText==="ingr"){
      this.recipeFile.recipe[this.recordRecipe].data[this.idNb].ingr=event.target.value;
      this.ingrType=this.idText;
      this.filterCalFat(event.target.value);
  } else if (this.idText==="selingr"){
    this.recipeFile.recipe[this.recordRecipe].data[this.idNb].ingr=this.tabListCalFat[event.target.value].name.trim();
  } else if (this.idText==="quantity"){
    this.recipeFile.recipe[this.recordRecipe].data[this.idNb].quantity=event.target.value;
  } else if (this.idText==="unit"){
    this.recipeFile.recipe[this.recordRecipe].data[this.idNb].unit=event.target.value;
  } else if (this.idText==="ingrPerso"){
    this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].ingr=event.target.value;
    this.ingrType=this.idText;
    this.filterCalFat(event.target.value);
  } else if (this.idText==="selingrPerso"){
    this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].ingr=this.tabListCalFat[event.target.value].name.trim();
  } else if (this.idText==="quantityPerso"){
    this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].quantity=event.target.value;
  } else if (this.idText==="unitPerso"){
    this.recipeFile.recipe[this.recordRecipe].dataPerso[this.idNb].unit=event.target.value;
  } else if (this.idText==="comments"){
    this.recipeFile.recipe[this.recordRecipe].comments=event.target.value;
    this.calculateHeight();
  } else if (this.idText==="commentsPerso"){
    this.recipeFile.recipe[this.recordRecipe].commentsPerso=event.target.value;
    this.calculateHeight();
  } else if (this.idText==="materiel"){
    this.recipeFile.recipe[this.recordRecipe].materiel=event.target.value;
    this.calculateHeight();
  } else if (this.idText==="materielPerso"){
    this.recipeFile.recipe[this.recordRecipe].materielPerso=event.target.value;
    this.calculateHeight();
  }
  
}

fillFileRecord(inFile:any,outFile:any){
  outFile.fileType=inFile.fileType;
  for (var i=0; i<inFile.recipe.length; i++){
      const classRecord=new classRecordRecipe;
      outFile.recipe.push(classRecord);
      outFile.recipe[i].name=inFile.recipe[i].name;
      outFile.recipe[i].comments=inFile.recipe[i].comments;
      outFile.recipe[i].commentsPerso=inFile.recipe[i].commentsPerso;
      outFile.recipe[i].nutrition.calories=inFile.recipe[i].nutrition.calories;
      outFile.recipe[i].nutrition.proteins=inFile.recipe[i].nutrition.proteins;
      outFile.recipe[i].nutrition.carbs=inFile.recipe[i].nutrition.carbs;
      outFile.recipe[i].nutrition.cholesterol=inFile.recipe[i].nutrition.cholesterol;
      outFile.recipe[i].nutrition.satFat=inFile.recipe[i].nutrition.satFat;
      outFile.recipe[i].nutrition.totalWeight=inFile.recipe[i].nutrition.totalWeight;
      outFile.recipe[i].nutritionPerso.calories=inFile.recipe[i].nutritionPerso.calories;
      outFile.recipe[i].nutritionPerso.proteins=inFile.recipe[i].nutritionPerso.proteins;
      outFile.recipe[i].nutritionPerso.carbs=inFile.recipe[i].nutritionPerso.carbs;
      outFile.recipe[i].nutritionPerso.cholesterol=inFile.recipe[i].nutritionPerso.cholesterol;
      outFile.recipe[i].nutritionPerso.satFat=inFile.recipe[i].nutritionPerso.satFat;
      outFile.recipe[i].nutritionPerso.totalWeight=inFile.recipe[i].nutritionPerso.totalWeight;

      for (var j=0; j<inFile.recipe[i].data.length; j++){
          const pushData=new classRecipe;
          outFile.recipe[i].data.push(pushData);
          outFile.recipe[i].data[j].ingr=inFile.recipe[i].data[j].ingr;
          outFile.recipe[i].data[j].quantity=inFile.recipe[i].data[j].quantity;
          outFile.recipe[i].data[j].unit=inFile.recipe[i].data[j].unit;      
          const pushDataPerso=new classRecipe;
          outFile.recipe[i].dataPerso.push(pushDataPerso);
          outFile.recipe[i].dataPerso[j].ingr=inFile.recipe[i].dataPerso[j].ingr;
          outFile.recipe[i].dataPerso[j].quantity=inFile.recipe[i].dataPerso[j].quantity;
          outFile.recipe[i].dataPerso[j].unit=inFile.recipe[i].dataPerso[j].unit;   
        }       
    }
  }

CancelRecord(){
    this.recipeFile.recipe.splice(0,this.recipeFile.recipe.length);
    this.fillFileRecord(this.initialRecipeFile,this.recipeFile);
    this.resetBooleans();
    this.isRecipeModified=false;
    this.isCreateRecipeName=false;
  }

CancelSave(){
    this.resetBooleans();
  }

message:string="";
ConfirmSave(){
    this.resetBooleans();
    this.tabDialog[this.prevDialog]=false;
    this.SpecificForm.controls['FileName'].setValue(this.myListOfObjects.items[this.fileNb].name);
    this.IsSaveConfirmed = true;
  }

SaveRecord(){
    this.calculateNutrition('all');
    this.putRecord(this.googleBucketName, this.SpecificForm.controls['FileName'].value, this.recipeFile);
    this.resetBooleans();
    this.isRecipeModified=false;
    this.isCreateRecipeName=false;
  }

putRecord(GoogleBucket:string, GoogleObject:string, record:any){
    
    var file=new File ([JSON.stringify(record)],GoogleObject, {type: 'application/json'});
    /**
    if (GoogleObject==='ConsoleLog.json'){
      const myTime=new Date();
      GoogleObject='ConsoleLog.json-'+ myTime.toString().substring(4,21);
      file=new File ([JSON.stringify(this.myConsole)],GoogleObject, {type: 'application/json'});
      }  
     */
    this.ManageGoogleService.uploadObject(this.configServer, GoogleBucket, file )
      .subscribe(res => {
              if (res.type===4){
                this.message='File "'+ GoogleObject +'" is successfully stored in the cloud';
                this.isRecipeModified=false;
                this.IsSaveConfirmed=false;
                //this.returnFile.emit(record);
              }
            },
            error_handler => {
              //**this.LogMsgConsole('Individual Record is not updated: '+ this.Table_User_Data[this.identification.id].UserId );
              this.Error_Access_Server='File' + GoogleObject +' *** Save action failed - status is '+error_handler.status;
            } 
          )
      }

nbCallGetRecord:number=0;
heightMaterielPerso:number=0;
heightCommentsPerso:number=0;
heightMateriel:number=0;
heightComments:number=0;

getRecord(Bucket:string,GoogleObject:string, iWait:number){
  
  this.EventHTTPReceived[iWait]=false;
  this.NbWaitHTTP++;
  this.waitHTTP(this.TabLoop[iWait],30000,iWait);
  this.Error_Access_Server='';
  this.ManageGoogleService.getContentObject(this.configServer, Bucket, GoogleObject )
            .subscribe((data ) => {
                this.nbCallGetRecord=0;
                this.EventHTTPReceived[iWait]=true;
                if (iWait===1){
                  this.isFileRetrieved=true;
                  this.initialRecipeFile.fileType=data.fileType;
                  for (var i=0; i<data.recipe.length; i++){
                    const classRecord=new classRecordRecipe;
                    this.initialRecipeFile.recipe.push(classRecord);
                    this.initialRecipeFile.recipe[i].name=data.recipe[i].name;
                    this.initialRecipeFile.recipe[i].comments=data.recipe[i].comments;
                    this.initialRecipeFile.recipe[i].commentsPerso=data.recipe[i].commentsPerso;
                    this.initialRecipeFile.recipe[i].materiel=data.recipe[i].materiel;
                    this.initialRecipeFile.recipe[i].materielPerso=data.recipe[i].materielPerso;
                    this.initialRecipeFile.recipe[i].nutrition.calories=data.recipe[i].nutrition.calories;
                    this.initialRecipeFile.recipe[i].nutrition.proteins=data.recipe[i].nutrition.proteins;
                    this.initialRecipeFile.recipe[i].nutrition.carbs=data.recipe[i].nutrition.carbs;
                    this.initialRecipeFile.recipe[i].nutrition.cholesterol=data.recipe[i].nutrition.cholesterol;
                    this.initialRecipeFile.recipe[i].nutrition.satFat=data.recipe[i].nutrition.satFat;
                    this.initialRecipeFile.recipe[i].nutrition.totalWeight=data.recipe[i].nutrition.totalWeight;

                    this.initialRecipeFile.recipe[i].nutritionPerso.calories=data.recipe[i].nutritionPerso.calories;
                    this.initialRecipeFile.recipe[i].nutritionPerso.proteins=data.recipe[i].nutritionPerso.proteins;
                    this.initialRecipeFile.recipe[i].nutritionPerso.carbs=data.recipe[i].nutritionPerso.carbs;
                    this.initialRecipeFile.recipe[i].nutritionPerso.cholesterol=data.recipe[i].nutritionPerso.cholesterol;
                    this.initialRecipeFile.recipe[i].nutritionPerso.satFat=data.recipe[i].nutritionPerso.satFat;
                    this.initialRecipeFile.recipe[i].nutritionPerso.totalWeight=data.recipe[i].nutritionPerso.totalWeight;

                    for (var j=0; j<data.recipe[i].data.length; j++){
                      const pushData=new classRecipe;
                      this.initialRecipeFile.recipe[i].data.push(pushData);
                      this.initialRecipeFile.recipe[i].data[j].ingr=data.recipe[i].data[j].ingr;
                      this.initialRecipeFile.recipe[i].data[j].quantity=data.recipe[i].data[j].quantity;
                      this.initialRecipeFile.recipe[i].data[j].unit=data.recipe[i].data[j].unit;
                      const pushDataPerso=new classRecipe;
                      this.initialRecipeFile.recipe[i].dataPerso.push(pushDataPerso);
                      this.initialRecipeFile.recipe[i].dataPerso[j].ingr=data.recipe[i].dataPerso[j].ingr;
                      this.initialRecipeFile.recipe[i].dataPerso[j].quantity=data.recipe[i].dataPerso[j].quantity;
                      this.initialRecipeFile.recipe[i].dataPerso[j].unit=data.recipe[i].dataPerso[j].unit;
                    }
                    
                  }
                  this.heightMateriel=(this.initialRecipeFile.recipe[0].materiel.length / 40 ) * 25 + 25;
                  this.heightComments=(this.initialRecipeFile.recipe[0].comments.length / 40 ) * 25 + 25;
                  this.heightMaterielPerso=(this.initialRecipeFile.recipe[0].materielPerso.length /40 ) * 25 + 25;
                  this.heightCommentsPerso=(this.initialRecipeFile.recipe[0].commentsPerso.length /40 ) * 25 + 25;
                  this.fillFileRecord(this.initialRecipeFile,this.recipeFile);
                } else if (iWait===2){
                  this.ConfigCaloriesFat=data;
                } else if (iWait===3){
                  this.ConvertUnit=data;
                  for (var i=0; i<this.ConvertUnit.tabConv.length && this.ConvertUnit.tabConv[i].fromUnit!=='gram';i++){};
                  if (i<this.ConvertUnit.tabConv.length){this.posGramTabConvert=i};
                }

            },
            (error_handler) => {
              this.nbCallGetRecord++
              this.Error_Access_Server='Could not retrieve the file - number of calls = ' + this.nbCallGetRecord ;
            }
            )
  }

  calculateHeight(){
    this.heightMateriel=(this.recipeFile.recipe[0].materiel.length / 40 ) * 25 + 25;
    this.heightComments=(this.recipeFile.recipe[0].comments.length / 40 ) * 25 + 25;
    this.heightMaterielPerso=(this.recipeFile.recipe[0].materielPerso.length /40 ) * 25 + 25;
    this.heightCommentsPerso=(this.recipeFile.recipe[0].commentsPerso.length /40 ) * 25 + 25;
  }
 
  GetAllObjects(iWait:number){

    this.scroller.scrollToAnchor('theTop');
    this.EventHTTPReceived[iWait]=false;
    this.NbWaitHTTP++;
    this.waitHTTP(this.TabLoop[iWait],30000,iWait);
    this.Error_Access_Server='';
    var i=0;
    const lengthFile=this.identification.recipe.fileStartName.length;
    const HTTP_Address=this.Google_Bucket_Access_Root+ this.googleBucketName + "/o"  ;
    console.log('RetrieveAllObjects()'+this.googleBucketName);
    this.http.get<Bucket_List_Info>(HTTP_Address )
            .subscribe((data ) => {
                  console.log('RetrieveAllObjects() - data received');
                  this.nbCallGetRecord=0;
                  this.myListOfObjects=data;
                  this.EventHTTPReceived[iWait]=true;
                  for (i=this.myListOfObjects.items.length-1; i>-1; i--){
                        if (this.myListOfObjects.items[i].name.substring(0,lengthFile)!==this.identification.recipe.fileStartName){
                          this.myListOfObjects.items.splice(i,1);
                          // keep the files corresponding to the recipes of the user
                        } 
                  }
                  this.isListOfObjectsRetrieved=true; 
            },
            error_handler => {
                  console.log('RECIPE RetrieveAllObjects() - error handler; HTTP='+HTTP_Address);
                  this.nbCallGetRecord++;
                  iWait=this.nbCallGetRecord+10;
                  if (this.nbCallGetRecord<4){
                    this.GetAllObjects(iWait);
                  } else { this.nbCallGetRecord=0;}
                  this.Error_Access_Server='RetrieveAllObjects()==> ' + error_handler.statusText+'   name=> '+ error_handler.name ;
            } 
      )
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
            //if (this.EventHTTPReceived[1]===true && this.EventHTTPReceived[2]===true && this.EventHTTPReceived[3]===true){
            //  this.calculateNutrition('all');
            //}
      }  
  }


}
