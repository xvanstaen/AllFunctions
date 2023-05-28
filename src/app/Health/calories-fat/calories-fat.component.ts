import { Component, OnInit , Input, Output, HostListener,  HostBinding, ChangeDetectionStrategy, 
  SimpleChanges,EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID} from '@angular/core';
  
import { DatePipe, formatDate } from '@angular/common'; 

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { Observable } from 'rxjs';

import { BucketList } from '../../JsonServerClass';
import { Bucket_List_Info } from '../../JsonServerClass';

// configServer is needed to use ManageGoogleService
// it is stored in MangoDB and accessed via ManageMangoDBService
import { configServer } from '../../JsonServerClass';
import { XMVConfig } from '../../JsonServerClass';
import { environment } from 'src/environments/environment';
import { LoginIdentif } from '../../JsonServerClass';
import {manage_input} from '../../manageinput';
import {eventoutput, thedateformat} from '../../apt_code_name';
import { msgConsole } from '../../JsonServerClass';
import {msginLogConsole} from '../../consoleLog'
import {ClassSubConv} from '../../ClassConverter'
import {ClassConv} from '../../ClassConverter'
import {ClassUnit} from '../../ClassConverter'
import {ConvItem} from '../../ClassConverter'
import {mainClassCaloriesFat, ClassCaloriesFat} from '../ClassHealthCalories'
import {ClassItem} from '../ClassHealthCalories'

import {classConfCaloriesFat} from '../classConfHTMLTableAll';


import { ManageMangoDBService } from 'src/app/CloudServices/ManageMangoDB.service';
import { ManageGoogleService } from 'src/app/CloudServices/ManageGoogle.service';
import {AccessConfigService} from 'src/app/CloudServices/access-config.service';

@Component({
  selector: 'app-calories-fat',
  templateUrl: './calories-fat.component.html',
  styleUrls: ['./calories-fat.component.css']
})
export class CaloriesFatComponent implements OnInit {

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
  @Input() ConfigCaloriesFat=new mainClassCaloriesFat;
  @Input() inFileRecipe=new mainClassCaloriesFat;
  @Input() HTMLCaloriesFat=new classConfCaloriesFat;
  @Input() posAppCalFat= {
            Top:0,
            Left:0,
          }
  @Output() myEmit= new EventEmitter<any>();
  @Output() myEmitRecipe= new EventEmitter<any>();

  outConfigCaloriesFat=new mainClassCaloriesFat;
  outFileRecipe=new mainClassCaloriesFat;


  IsSaveConfirmed:boolean=false;
  IsSaveRecipeConfirmed:boolean=false;
  SpecificForm=new FormGroup({
        FileName: new FormControl(''),
        FileNameRecipe: new FormControl(''),
      })

  getScreenWidth: any;
  getScreenHeight: any;
  device_type:string='';

  error_msg:string='';

  TabOfId:Array<number>=[];    

  filterType:boolean=false;
  filterFood:boolean=false;
  filterRecipe:boolean=false;
  filterRecipeFood:boolean=false;

  // Tables for DROPDOWN
  tabType:Array<any>=[{name:''}];
  tabFood:Array<any>=[{name:''}];
  tabInputType:Array<any>=[];
  tabInputFood:Array<any>=[];
  typeAction:Array<string>=['add before', 'add after','delete'];
  TabAction:Array<any>=[{name:'',action:''}];
  TabActionRecipe:Array<any>=[{name:'',action:''}];

  tabRecipe:Array<any>=[];

  // to open DROPDOWN box 
  dialogueCalFat:Array<boolean>=[false, false,false,false]; // first is for type and second one is for food/ingredient


  selType:string='';
  selFood:string='';

  // when value is one then item has been created in this session
  tabNewRecord:Array<any>=[
      { nb:0, // type     
        food:[{nb:0}]
      }
      ] ;

  isDeleteType:boolean=false;
  isDeleteFood:boolean=false;
  isDeleteRecipe:boolean=false;
  isDeleteRecipeFood:boolean=false;

  myAction:string='';
  myType:string='';
      
  theEvent={
    target:{
      id:'',
      textContent:''
    }
  }

  posDeletedItem:number=0;
  posType=585;
  posFood=660;
  nameDeletedItem:string='';
      
  tablePosTop:number=-1;
  tablePosLeft:number=0;
  theHeight:number=0;
  docHeaderAll:any;
    
  // get position of pointer/cursor
  mousedown:boolean=false;
  selectedPosition ={ 
    x: 0,
    y: 0} ;
    

@HostListener('window:mouseup', ['$event'])
onMouseUp(event: MouseEvent) {
    this.selectedPosition = { x: event.pageX, y: event.pageY };
    if (this.tablePosTop<0){
      this.getPosAfterTitle();
    }
  }
  
onMouseDown(event: MouseEvent) {
    this.selectedPosition = { x: event.pageX, y: event.pageY };
  }
  
onMouseMove(event: MouseEvent) {
    this.selectedPosition = { x: event.pageX, y: event.pageY };
  }

// position of the table referenced by the <div id="posTable"> 
getPosAfterTitle(){
    this.docHeaderAll = document.getElementById("posTable");
    this.tablePosLeft = this.docHeaderAll.offsetLeft;
    this.tablePosTop = this.docHeaderAll.offsetTop;
    this.theHeight=Number(this.HTMLCaloriesFat.title.height.substring(0,this.HTMLCaloriesFat.title.height.indexOf('px')));
   // console.log('Div Title ==>  tablePosLeft='+this.tablePosLeft+'  tablePosTop='+this.tablePosTop);
  } 


@HostListener('window:resize', ['$event'])
onWindowResize() {
  this.getScreenWidth = window.innerWidth ;
  this.getScreenHeight = window.innerHeight;
  }

ngOnInit(): void {
  this.onWindowResize();
  this.device_type = navigator.userAgent;
  this.device_type = this.device_type.substring(10, 48);

  this.TabAction[0].name='Cancel';
  this.TabAction[0].action='';
  this.TabActionRecipe[0].name='Cancel';
  this.TabActionRecipe[0].action='';
  var itemName='Type';
  
  for (var i=0; i<this.typeAction.length; i++){
      const myAction={name:'',action:''};
      this.TabAction.push(myAction);
      this.TabAction[this.TabAction.length-1].name=itemName;
      this.TabAction[this.TabAction.length-1].action=this.typeAction[i];

      this.TabActionRecipe.push(myAction);
      this.TabActionRecipe[this.TabAction.length-1].name='Recipe';
      this.TabActionRecipe[this.TabAction.length-1].action=this.typeAction[i];
  }
  itemName='Food';
  for (i=0; i<this.typeAction.length; i++){
      const myAction={name:'',action:''};
      this.TabAction.push(myAction);
      this.TabAction[this.TabAction.length-1].name=itemName;
      this.TabAction[this.TabAction.length-1].action=this.typeAction[i];
      this.TabActionRecipe.push(myAction);
      this.TabActionRecipe[this.TabAction.length-1].name=itemName;
      this.TabActionRecipe[this.TabAction.length-1].action=this.typeAction[i];
  }
  

  if (this.ConfigCaloriesFat.tabCaloriesFat.length===0){
    this.initOutTab(this.ConfigCaloriesFat,'calories');
  } else { 
    this.fillConfig(this.outConfigCaloriesFat, this.ConfigCaloriesFat,'Calories');
  }
  this.initTrackRecord();
  this.SpecificForm.controls['FileName'].setValue(this.identification.configFitness.files.calories);
 
  if (this.inFileRecipe.tabCaloriesFat.length===0){
    this.initOutTab(this.outFileRecipe,'Recipe');
  } else { 
    this.fillConfig(this.outFileRecipe, this.inFileRecipe, 'Recipe');
  }

}

fillConfig(outFile:any,inFile:any, type:string){
  if (type==='Calories'){
    this.tabType[0].name='';
    this.tabFood[0].name='';
    outFile.tabCaloriesFat.splice(0,outFile.tabCaloriesFat.length);
    outFile.fileType=inFile.fileType;
    for (var i=0; i<inFile.tabCaloriesFat.length; i++){
      const CalFatClass = new ClassCaloriesFat;
      outFile.tabCaloriesFat.push(CalFatClass);
      outFile.tabCaloriesFat[i].Type=inFile.tabCaloriesFat[i].Type;
      this.tabType.push({name:''});
      this.tabType[this.tabType.length-1].name=inFile.tabCaloriesFat[i].Type.toLowerCase().trim();
      for (var j=0; j<inFile.tabCaloriesFat[i].Content.length; j++){
        const itemClass= new ClassItem;
        outFile.tabCaloriesFat[i].Content.push(itemClass);
        outFile.tabCaloriesFat[i].Content[j]=inFile.tabCaloriesFat[i].Content[j];
        this.tabFood.push({name:''});
        this.tabFood[this.tabFood.length-1].name=inFile.tabCaloriesFat[i].Content[j].Name.toLowerCase().trim();;
        }
    }
    this.tabType.sort((a, b) => (a.name < b.name) ? -1 : 1);
    this.tabFood.sort((a, b) => (a.name < b.name) ? -1 : 1);
    this.tabType[0].name='cancel';
    this.tabFood[0].name='cancel';
    } else {
      outFile.tabCaloriesFat.splice(0,outFile.tabCaloriesFat.length);
      outFile.fileType=inFile.fileType;
      for (var i=0; i<inFile.tabCaloriesFat.length; i++){
        const CalFatClass = new ClassCaloriesFat;
        outFile.tabCaloriesFat.push(CalFatClass);
        outFile.tabCaloriesFat[i].Type=inFile.tabCaloriesFat[i].Type;

        for (var j=0; j<inFile.tabCaloriesFat[i].Content.length; j++){
          const itemClass= new ClassItem;
          outFile.tabCaloriesFat[i].Content.push(itemClass);
          outFile.tabCaloriesFat[i].Content[j]=inFile.tabCaloriesFat[i].Content[j];

          }
      }
    }
}


initTrackRecord(){
    for (var i=0; i<this.outConfigCaloriesFat.tabCaloriesFat.length; i++){
      if (this.tabNewRecord.length===0 || i!==0){
        const trackNew={nb:0,food:[{nb:0}]};
        this.tabNewRecord.push(trackNew);
      }
      
      for (var j=0; j<this.outConfigCaloriesFat.tabCaloriesFat[i].Content.length; j++){
          if (this.tabNewRecord[i].food.length ===0 || j!==0){
            const trackNew={nb:0};
            this.tabNewRecord[i].food.push(trackNew);
          }
      }
    }
  }

findAction(idString:string){
  this.error_msg='';
  var j=-1;
  for (var i=1; i<idString.length && idString.substring(i,i+1)!=='-'; i++){
  }
  this.myType=idString.substring(0,i).trim();
  this.myAction=idString.substring(i+1).trim();
}

onAction(event:any){
  
  var iAction=0;
  this.dialogueCalFat[0]=false;
  this.dialogueCalFat[1]=false;
  var trouve=false;
  this.error_msg='';
  
  if (event.currentTarget.id !==''){
      this.theEvent.target.id=event.currentTarget.id;
      this.findIds(event.currentTarget.id); 
      iAction=Number(event.currentTarget.value);
  } else if (event.target.id!==''){
      this.theEvent.target.id=event.target.id;
      this.findIds(event.target.id); 
      iAction=Number(event.target.value); 
  } else if (event.target.textContent!==''){
      this.findAction(event.target.textContent);
      this.theEvent.target.id='selAction';
      for (var i=0; i<this.TabAction.length && trouve===false; i++){
          if (this.TabAction[i].name===this.myType && this.TabAction[i].action===this.myAction){
            trouve=true;
            iAction=i;
          }
      }
  } 
  if (this.theEvent.target.id.substring(0,16)==='RecipeOpenAction'){
    this.dialogueCalFat[1]=true;
  } else if (this.theEvent.target.id.substring(0,15)==='RecipeSelAction'){
      if (iAction===0){
        this.isDeleteRecipe=false;
        this.isDeleteRecipeFood=false;    
      } else if (this.TabActionRecipe[iAction].name==='Recipe'){
          if (this.TabActionRecipe[iAction].action==='add before'){
              this.createAfterBefore(this.TabOfId[0],'Recipe');
          } else if (this.TabActionRecipe[iAction].action==='add after'){
              this.createAfterBefore(this.TabOfId[0]+1,'Recipe');
          } else if (this.TabActionRecipe[iAction].action==='delete'){
          if (this.outFileRecipe.tabCaloriesFat.length==1 ){
              this.nameDeletedItem='';
              this.error_msg='only one item - cannot be deleted';
          } else {
            this.nameDeletedItem='Type item: '+ this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Type;
            this.posDeletedItem=this.posType;
            this.isDeleteRecipe=true;
              }
            }
      } else if (this.TabActionRecipe[iAction].name==='Food'){
        if (this.TabActionRecipe[iAction].action==='add before'){
          this.createAfterBefore(this.TabOfId[1],'RecipeFood');
        } else if (this.TabActionRecipe[iAction].action==='add after'){
          this.createAfterBefore(this.TabOfId[1]+1,'RecipeFood');
        } else if (this.TabActionRecipe[iAction].action==='delete'){
          if (this.outFileRecipe.tabCaloriesFat.length==1 && this.outFileRecipe.tabCaloriesFat[0].Content.length===1){
            this.nameDeletedItem='';  
            this.error_msg='only one food item - cannot be deleted';
          } else {
            this.nameDeletedItem='food item: '+ this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Name;
            this.posDeletedItem=this.posFood;
            this.isDeleteRecipeFood=true;
          }
        } 
      }
    } else if (this.theEvent.target.id.substring(0,10)==='openAction'){
      this.dialogueCalFat[0]=true;
    } else  if (this.theEvent.target.id.substring(0,9)==='selAction'){
      if (iAction===0){
        this.isDeleteType=false;
        this.isDeleteFood=false;    
      } else 
      if (this.TabAction[iAction].name==='Type'){
        if (this.TabAction[iAction].action==='add before'){
            this.createAfterBefore(this.TabOfId[0],'Type');
        } else if (this.TabAction[iAction].action==='add after'){
            this.createAfterBefore(this.TabOfId[0]+1,'Type');
        } else if (this.TabAction[iAction].action==='delete'){
          if (this.outConfigCaloriesFat.tabCaloriesFat.length==1 ){
            this.nameDeletedItem='';
            this.error_msg='only one item - cannot be deleted';
        } else {
          this.nameDeletedItem='Type item: '+ this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Type;
          this.posDeletedItem=this.posType;
          this.isDeleteType=true;
            }
        } 
      } else if (this.TabAction[iAction].name==='Food'){
        if (this.TabAction[iAction].action==='add before'){
          this.createAfterBefore(this.TabOfId[1],'Food');
        } else if (this.TabAction[iAction].action==='add after'){
          this.createAfterBefore(this.TabOfId[1]+1,'Food');
        } else if (this.TabAction[iAction].action==='delete'){
          if (this.outConfigCaloriesFat.tabCaloriesFat.length==1 && this.outConfigCaloriesFat.tabCaloriesFat[0].Content.length===1){
            this.nameDeletedItem='';  
            this.error_msg='only one item - cannot be deleted';
          } else {
            this.nameDeletedItem='food item: '+ this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Name;
            this.posDeletedItem=this.posFood;
            this.isDeleteFood=true;
          }
        } 
      }
    } else if (this.theEvent.target.id.substring(0,6)==='YesDel'){
      if (this.isDeleteType===true){
        this.outConfigCaloriesFat.tabCaloriesFat.splice(this.TabOfId[0],1);
        this.tabNewRecord.splice(this.TabOfId[0],1);
      } if (this.isDeleteFood===true){
        this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content.splice(this.TabOfId[1],1);
        this.tabNewRecord[this.TabOfId[0]].food.splice(this.TabOfId[1],1);
      }
      this.isDeleteType=false;
      this.isDeleteFood=false;
    } else  if (this.theEvent.target.id.substring(0,5)==='NoDel'){
      this.isDeleteType=false;
      this.isDeleteFood=false;    
    }  
}

createAfterBefore(increment:number, item:string){
  if (item==='Type'){
    const CalFatClass = new ClassCaloriesFat;
    this.outConfigCaloriesFat.tabCaloriesFat.splice(increment,0,CalFatClass);
    const itemClass= new ClassItem;
    this.outConfigCaloriesFat.tabCaloriesFat[increment].Content.push(itemClass);
    const trackNew={nb:1,food:[{nb:1}]};
    this.tabNewRecord.splice(increment,0,trackNew);
  } else if (item==='Food'){
    const itemClass= new ClassItem;
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content.splice(increment,0,itemClass);
    const trackNew={nb:1};
    this.tabNewRecord[this.TabOfId[0]].food.splice(increment,0,trackNew);
  } else if (item==='Recipe'){
    const CalFatClass = new ClassCaloriesFat;
    this.outFileRecipe.tabCaloriesFat.splice(increment,0,CalFatClass);
    const itemClass= new ClassItem;
    this.outFileRecipe.tabCaloriesFat[increment].Content.push(itemClass);

  } else if (item==='RecipeFood'){
    const itemClass= new ClassItem;
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content.splice(increment,0,itemClass);
 
  } 
}

initOutTab(inFile:any,type:string){
  const CalFatClass = new ClassCaloriesFat;
  inFile.tabCaloriesFat.push(CalFatClass);
  if (type='calories'){
    inFile.fileType=this.identification.configFitness.fileType.calories;
  } else {
    inFile.fileType=this.identification.fitness.fileType.recipe;
  }
  
  const itemClass= new ClassItem;
  inFile.tabCaloriesFat[inFile.tabCaloriesFat.length-1].Content.push(itemClass);
}

offsetHeight:number=0;
offsetLeft:number=0;
offsetTop:number=0;
offsetWidth:number=0;
scrollHeight:number=0;
scrollTop:number=0;


onInput(event:any){

  //this.getPosAfterTitle();
  //this.offsetHeight= event.currentTarget.offsetHeight;
  this.offsetLeft = event.currentTarget.offsetLeft;
  //this.offsetTop = event.currentTarget.offsetTop;
  this.offsetWidth = event.currentTarget.offsetWidth;
  //this.scrollHeight = event.currentTarget.scrollHeight;
  //this.scrollTop = event.currentTarget.scrollTop;
  //console.log('offsetHeight='+this.offsetHeight +'  offsetLeft= '+this.offsetLeft + ' offsetTop=' + this.offsetTop 
  //+ ' scrollHeight='+this.scrollHeight+ '  scrollTop=' +this.scrollTop);
  this.tabInputType.splice(0,this.tabInputType.length);
  this.tabInputFood.splice(0,this.tabInputFood.length);
  var iTab:number=0;
  this.error_msg='';

  this.findIds(event.target.id);
  if (event.target.id.substring(0,4)==='type'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Type=event.target.value.toLowerCase().trim();
    // check if first letters already exists
    iTab=-1;
    for (var i=0; i<this.tabType.length; i++){
      if (this.tabType[i].name.substr(0,event.target.value.trim().length)===event.target.value.toLowerCase().trim()){
        iTab++;
        this.tabInputType[iTab]=this.tabType[i].name.toLowerCase().trim();
      }
    }
  } else if (event.target.id.substring(0,4)==='name'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Name=event.target.value.toLowerCase().trim();
  // check if first letters already exists
    iTab=-1;
    for (var i=0; i<this.tabType.length; i++){
      if (this.tabFood[i].name.substr(0,event.target.value.trim().length)===event.target.value.toLowerCase().trim()){
        iTab++;
        this.tabInputFood[iTab]=this.tabFood[i].name.toLowerCase().trim();
      }
    }
  } else if (event.target.id.substring(0,4)==='serv'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Serving=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='unit'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].ServingUnit=event.target.value.toLowerCase().trim();
  } else if (event.target.id.substring(0,4)==='calo'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Calories=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='prot'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Protein=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='carb'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Carbs=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='glyi'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].GlyIndex=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='suga'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Sugar=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='chol'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Cholesterol=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='satu'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Fat.Saturated=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='tota'){
    this.outConfigCaloriesFat.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Fat.Total=Number(event.target.value);
  }
}


onInputRecipe(event:any){

 
  //this.offsetHeight= event.currentTarget.offsetHeight;
  this.offsetLeft = event.currentTarget.offsetLeft;
  //this.offsetTop = event.currentTarget.offsetTop;
  this.offsetWidth = event.currentTarget.offsetWidth;

  this.tabInputType.splice(0,this.tabInputType.length);
  this.tabInputFood.splice(0,this.tabInputFood.length);
  var iTab:number=0;
  this.error_msg='';

  this.findIds(event.target.id);
  if (event.target.id.substring(0,6)==='Recipe'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Type=event.target.value.toLowerCase().trim();
    // check if first letters already exists
    iTab=-1;
    for (var i=0; i<this.tabType.length; i++){
      if (this.tabType[i].name.substr(0,event.target.value.trim().length)===event.target.value.toLowerCase().trim()){
        iTab++;
        this.tabInputType[iTab]=this.tabType[i].name.toLowerCase().trim();
      }
    }
  } else if (event.target.id.substring(0,4)==='name'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Name=event.target.value.toLowerCase().trim();
  // check if first letters already exists
    iTab=-1;
    for (var i=0; i<this.tabType.length; i++){
      if (this.tabFood[i].name.substr(0,event.target.value.trim().length)===event.target.value.toLowerCase().trim()){
        iTab++;
        this.tabInputFood[iTab]=this.tabFood[i].name.toLowerCase().trim();
      }
    }
  } else if (event.target.id.substring(0,4)==='serv'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Serving=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='unit'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].ServingUnit=event.target.value.toLowerCase().trim();
  } else if (event.target.id.substring(0,4)==='calo'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Calories=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='prot'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Protein=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='carb'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Carbs=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='glyi'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].GlyIndex=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='suga'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Sugar=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='chol'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Cholesterol=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='satu'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Fat.Saturated=Number(event.target.value);
  } else if (event.target.id.substring(0,4)==='tota'){
    this.outFileRecipe.tabCaloriesFat[this.TabOfId[0]].Content[this.TabOfId[1]].Fat.Total=Number(event.target.value);
  }
}



checkText:string='';
SearchText(event:any){
  if (event.currentTarget.id==='search' && event.currentTarget.value!==''){
    this.checkText=event.currentTarget.value.toLowerCase().trim();
  } else { 
    this.checkText=''; 
  }
}
onFilter(event:any){
  this.filterType=false;
  this.filterFood=false;
  this.selType='';
  this.selFood='';
  if (event.target.id==='Type'){
    this.filterType=true;
  } else if (event.target.id==='Food'){
    this.filterFood=true;
  } else if (event.target.textContent.indexOf('cancel')===-1){
    if (event.target.id==='selType'){
      this.selType=event.target.textContent;
    } else if (event.target.id==='selFood'){
      this.selFood=event.target.textContent;
    }   
  }
}


findIds(theId:string){
  this.error_msg='';
  var TabDash=[];
  this.TabOfId.splice(0,this.TabOfId.length);
  var j=-1;
  for (var i=4; i<theId.length; i++){
    if (theId.substring(i,i+1)==='-'){
        j++;
        TabDash[j]=i+1;
        TabDash.push(0);
    }
  }
  TabDash[j+1]=theId.length+1;

  i=0;
  for (j=0; j<TabDash.length-1; j++){
    this.TabOfId[i]=parseInt(theId.substring(TabDash[j],TabDash[j+1]-1));
    //this.TabOfId.push(0);
    i++;
  }
}

ConfirmSave(event:any){
  // check if there is no dupes of FOOD
  if (event.target.id==='RecipeSave'){
    this.IsSaveRecipeConfirmed=true;
    this.SpecificForm.controls['FileNameRecipe'].setValue(this.identification.fitness.files.recipe);
  } else {

 
    this.tabType.splice(0,this.tabType.length);
    this.tabFood.splice(0,this.tabFood.length);
    var i=0;
    var j=0;

    for (i=0; i<this.outConfigCaloriesFat.tabCaloriesFat.length; i++){
        this.tabType.push({name:''});
        this.tabType[this.tabType.length-1].name=this.outConfigCaloriesFat.tabCaloriesFat[i].Type.toLowerCase().trim();
        for (j=0; j<this.outConfigCaloriesFat.tabCaloriesFat[i].Content.length; j++){
          this.tabFood.push({name:''});
          this.tabFood[this.tabFood.length-1].name=this.outConfigCaloriesFat.tabCaloriesFat[i].Content[j].Name.toLowerCase().trim();;
        }
    }
    this.tabType.sort((a, b) => (a.name < b.name) ? -1 : 1);
    this.tabFood.sort((a, b) => (a.name < b.name) ? -1 : 1);

    var trouve=false;
    for (i=1; i<this.tabType.length && trouve===false; i++){
        if (this.tabType[i].name===this.tabType[i-1].name){
          trouve=true;
        }
    }
    if (trouve!== true){
      for (j=1; j<this.tabFood.length && trouve===false; j++){
        if (this.tabFood[j].name===this.tabFood[j-1].name){
          trouve=true;
        }
    }
    }
    if (trouve!== true){
      this.IsSaveConfirmed=true;
    } else {
      if (i<this.tabType.length){
        this.error_msg='you have created dupe type-element   ' + this.tabType[i-1].name;
      } else if (j<this.tabFood.length){
        this.error_msg='you have created dupe food-element   ' + this.tabFood[j-1].name;
      }
    }
  }
}

CancelSave(event:any){
  
  if (event.target.id==='RecipeCancel'){
    this.IsSaveRecipeConfirmed=false;
  } else {
    this.IsSaveConfirmed=false;
  }
  
}

CancelUpdates(event:any){
  if (event.target.id==='RecipeCancel'){
    this.IsSaveRecipeConfirmed=false;
  } else {
    this.IsSaveConfirmed=false;
    this.outConfigCaloriesFat.tabCaloriesFat.splice(0, this.outConfigCaloriesFat.tabCaloriesFat.length);
    this.tabNewRecord.splice(0, this.tabNewRecord.length);
    if (this.ConfigCaloriesFat.tabCaloriesFat.length===0){
      this.initOutTab(this.ConfigCaloriesFat,'calories');
    } else {
      this.fillConfig(this.outConfigCaloriesFat, this.ConfigCaloriesFat.fileType,'Calories');
      this.initTrackRecord();
    }
  }
}


SaveFile(event:any){
  if (event.target.id==='RecipeSave'){
    this.IsSaveRecipeConfirmed=false;
    this.myEmitRecipe.emit(this.SpecificForm.controls['FileNameRecipe'].value);
    this.myEmitRecipe.emit(this.outFileRecipe);
  } else {
    this.IsSaveConfirmed=false;
    // rebuild the filter tabs
    this.tabType.splice(0,this.tabType.length);
    this.tabFood.splice(0,this.tabFood.length);
    //var iFood=0;

    for (var i=0; i<this.outConfigCaloriesFat.tabCaloriesFat.length; i++){
      this.tabType.push({name:''});
      this.tabType[this.tabType.length-1].name=this.outConfigCaloriesFat.tabCaloriesFat[i].Type.toLowerCase().trim();
      for (var j=0; j<this.outConfigCaloriesFat.tabCaloriesFat[i].Content.length; j++){
        //iFood++
        this.tabFood.push({name:''});
        this.tabFood[this.tabFood.length-1].name=this.outConfigCaloriesFat.tabCaloriesFat[i].Content[j].Name.toLowerCase().trim();;
        }
    }
    this.tabType.sort((a, b) => (a.name < b.name) ? -1 : 1);
    this.tabFood.sort((a, b) => (a.name < b.name) ? -1 : 1);
    this.tabType.splice(0,0,{name:'cancel'});
    this.tabFood.splice(0,0,{name:'cancel'});
    //this.tabType[0].name='cancel';
    //this.tabFood[0].name='cancel';
    this.tabNewRecord.splice(0, this.tabNewRecord.length);
    this.initTrackRecord();
    this.myEmit.emit(this.SpecificForm.controls['FileName'].value);
    this.myEmit.emit(this.outConfigCaloriesFat);
  }
}

/**
ngOnChanges(changes: SimpleChanges) { 

  var i=0;
    for (const propName in changes){
        const j=changes[propName];
        if (propName==='ConfigCaloriesFat'){

            
        }
    }

}
 */
}
