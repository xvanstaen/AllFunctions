import { Component, OnInit, AfterViewInit, Inject,LOCALE_ID } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common'; 
import { Output, Input, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
// import {MatDatepicker, MatDateRangePicker, MatDatepickerToggle} from '@angular/material/datepicker';

//import * as moment from 'moment';
//import 'moment/locale/pt-br';
// import {MatRadioModule} from '@angular/material/radio';  
   

import {WeekDays} from '../ArrayCityRegion';
import {manage_input} from '../manageinput';
import{generate_calendar, selectDay} from '../generate_calendar';

import {eventoutput, fillcalendar, thedateformat, DaysOfMonths } from '../apt_code_name';

@Component({
  selector: 'app-my-date-picker',
  templateUrl: './my-date-picker.component.html',
  styleUrls: ['./my-date-picker.component.css']
})

export class MyDatePickerComponent implements OnInit {
  
  myObj:eventoutput = {
    error_msg:"",
    type_error:0,
    theInput:"",
    input_year:"",
    input_month:"",
    input_day:"",
  }

  initObj:fillcalendar = {
    monthname_c:'',
    monthname_n:'',
    weekday_n:0,
    weekday_c:0,
    dayspermonth1:[],
    dayspermonth2:[],

    datePipe_OW:new Date("2000/01/01"),
    datePipe_RET:new Date("2000/01/01"),

    input_OW:"",
    input_RET:"",
    valid_input_OW:"",
    valid_input_RET:"",
    
    today_year:0,
    today_month:0,
    today_day:0,
  
    yearnb:0,
    monthnb:0,
    daynb:0,

    nyearnb:0,
    nmonthnb:0,
    ndaynb:0,

    display_yearnb:0,
    display_monthnb:0,
    display_daynb:0,

    display_nyearnb:0,
    display_nmonthnb:0,
    display_ndaynb:0,

    maxDate_day:0,
    maxDate_month:0,
    maxDate_year:0,

    minDate_day:1,
    minDate_month:1,
    minDate_year:1900,

    type_error:0,
    error_msg:'',
}

  todayDate=new Date();

  oneway_date=new Date("2000/01/01");
  return_date=new Date("2000/01/01");
  refDate=new Date("2000/01/01");
  

  placeholderOW:string="dd-mm-yyyy";
  placeholderR:string="dd-mm-yyyy";
  
  Display_p_holder_ow:string='Y';
  Display_p_holder_r:string='Y';

  ref_format: thedateformat = {
      MyDateFormat:"",
      separator_char:"",
      separator_one_p:0,
      separator_two_p:0,
      day_position:0,
      year_position:0,
      month_position:0,

      length_year:0,
      length_month:0,
      length_day:0,
  }

  type_input:string='';
  type_arrow:string='';

  //inputDate=moment(); // to be tested
  varDate=new Date();

  work_string:string="";

  i:number=0;

SelectedDay?:DaysOfMonths;
 
  maxDate=new Date();

  // number of characters to display for the days
  nb_char: number=3;

  error_msg:string="";
  type_error:number=0;
  var_number:number=0;

  StringOfDays=WeekDays;

  travel_O_R: string='';

  datePipeToday?: any;
  datePipeMax?: any;

  datePipeMin?: any;
  FormatValidationOnly:boolean=true;

  TheCalendarform: FormGroup = new FormGroup({ 
    oneway_boarding_date: new FormControl(),
    return_boarding_date: new FormControl(),
    travel_type: new FormControl(),//one way or return flight
  })
  constructor(
    public matDialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,


    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MyDatePickerComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {theorigin_date:string,thereturn_date:string,thetype_T:string},
){
    this.oneway_date = new Date(data.theorigin_date);
    this.return_date = new Date(data.thereturn_date);
    this.travel_O_R = data.thetype_T;
}


  ngOnInit() {
    this.TheCalendarform=this.fb.group({
      oneway_boarding_date: [this.oneway_date, Validators.required],
      return_boarding_date: this.return_date,
      travel_type: this.travel_O_R,
    });
    
    this.ref_format.length_day=2;
    this.ref_format.length_month=2;
    this.ref_format.length_year=4;
    this.ref_format.MyDateFormat="dd-MM-yyyy";
    this.ref_format.separator_char="-";
   
    // input will be tested against the date format
    this.ref_format.day_position = this.ref_format.MyDateFormat.indexOf("d")+1;
    if (this.ref_format.day_position===0) {this.ref_format.day_position = this.ref_format.MyDateFormat.indexOf("D")+1};
    this.ref_format.month_position = this.ref_format.MyDateFormat.indexOf("m")+1;
    if (this.ref_format.month_position===0) {this.ref_format.month_position = this.ref_format.MyDateFormat.indexOf("M")+1};
    this.ref_format.year_position = this.ref_format.MyDateFormat.indexOf("y")+1;
    if (this.ref_format.year_position===0) {this.ref_format.year_position = this.ref_format.MyDateFormat.indexOf("Y")+1};

    this.ref_format.separator_one_p=this.ref_format.MyDateFormat.indexOf(this.ref_format.separator_char)+1;
    this.ref_format.separator_two_p= this.ref_format.separator_one_p+this.ref_format.MyDateFormat.substr(this.ref_format.separator_one_p,this.ref_format.MyDateFormat.length-this.ref_format.separator_one_p).indexOf(this.ref_format.separator_char)+1;

   // if not date has been input yet then display how the date should be entered e.g. "yyyy-mm-dd"
   if (formatDate(this.oneway_date,"yyyy-MM-dd",this.locale) === formatDate(this.refDate,"yyyy-MM-dd",this.locale))
    {
      this.Display_p_holder_ow='Y'

    } else{this.Display_p_holder_ow='N'}
   if (formatDate(this.return_date,"yyyy-MM-dd",this.locale) === formatDate(this.refDate,"yyyy-MM-dd",this.locale)) 
   {
      this.Display_p_holder_r='Y' 

    } else{this.Display_p_holder_r='N'}
   
    // if used to make a booking cannot for instance be for more than 1 year in advance
    // this.maxDate.setDate(this.maxDate.getDate()+365);
    this.initObj.maxDate_year=parseInt(formatDate(this.todayDate,'yyyy',this.locale))+1;
    this.initObj.maxDate_month=parseInt(formatDate(this.todayDate,'MM',this.locale));
    this.initObj.maxDate_day=parseInt(formatDate(this.todayDate,'dd',this.locale))-2;
    this.maxDate=new Date(this.initObj.maxDate_year,this.initObj.maxDate_month-1,this.initObj.maxDate_day);
    
    // 2 methods to format a date
    this.datePipeToday = this.datePipe.transform(this.todayDate,"yyyy-MM-dd");
    this.datePipeMax = formatDate(this.maxDate,"yyyy-MM-dd",this.locale);
    this.datePipeMax = this.datePipe.transform(this.maxDate,"YYYY-MM-dd");
     

    this.initObj.today_year=parseInt(formatDate(Date.now(),'YYYY',this.locale));
    this.initObj.today_month=parseInt(formatDate(Date.now(),'MM',this.locale));
    this.initObj.today_day=parseInt(formatDate(Date.now(),'dd',this.locale));

    

    this.travel_O_R = this.TheCalendarform.controls['travel_type'].value;
    if (this.travel_O_R ==='') {

        this.initObj.valid_input_OW="N";
        this.initObj.valid_input_RET="N";
        this.initObj.monthnb=parseInt(formatDate(Date.now(),'MM',this.locale));
        this.initObj.yearnb=parseInt(formatDate(Date.now(),'YYYY',this.locale));
        this.initObj.daynb=parseInt(formatDate(Date.now(),'dd',this.locale));
  
        this.initObj=generate_calendar("", "",this.initObj);

    } else if (this.travel_O_R ==='O' || this.travel_O_R ==='R') {
          this.initObj.valid_input_OW="Y";
          this.initObj.valid_input_RET="N";
          this.initObj.datePipe_OW=this.TheCalendarform.controls['oneway_boarding_date'].value;
          this.initObj.monthnb=parseInt(formatDate(this.initObj.datePipe_OW,'MM',this.locale));
          this.initObj.yearnb=parseInt(formatDate(this.initObj.datePipe_OW,'YYYY',this.locale));
          this.initObj.daynb=parseInt(formatDate(this.initObj.datePipe_OW,'dd',this.locale)); 
          this.initObj.input_OW = formatDate(this.initObj.datePipe_OW,this.ref_format.MyDateFormat,this.locale).toString();

           if (this.travel_O_R ==='R') {
              this.initObj.valid_input_RET="Y";
              this.initObj.datePipe_RET=this.TheCalendarform.controls['return_boarding_date'].value;
              this.initObj.nmonthnb=parseInt(formatDate(this.initObj.datePipe_RET,'MM',this.locale));
              this.initObj.nyearnb=parseInt(formatDate(this.initObj.datePipe_RET,'YYYY',this.locale));
              this.initObj.ndaynb=parseInt(formatDate(this.initObj.datePipe_RET,'dd',this.locale)); 
              this.initObj.input_RET = formatDate(this.initObj.datePipe_RET,this.ref_format.MyDateFormat,this.locale).toString();
          } 
          this.initObj=generate_calendar("OW", "",this.initObj);   
      }

    for (this.i=0; this.i<7; this.i++) {
      this.StringOfDays[this.i].DoW = WeekDays[this.i].DoW.substr(0,this.nb_char);
   }
  }

  OnCancel() {
    // if any, date input by user is ignored
    
    this.dialogRef.close(this.TheCalendarform.value);
   }

  OnInputOW(event:any){
    
    this.initObj.input_OW = event.target.value;
    this.work_string=event.inputType ;

    this.FormatValidationOnly=false;
    this.datePipeMin=this.datePipeToday;

    this.myObj=manage_input(
      this.initObj.input_OW,
      this.work_string,
      this.ref_format,
      this.initObj.maxDate_year,
      this.initObj.today_year,
      this.datePipe,
      this.datePipeMax,
      this.datePipeToday,
      this.datePipeMin,
      this.FormatValidationOnly);

      this.initObj.input_OW=this.myObj.theInput;
      this.error_msg=this.myObj.error_msg;
      this.type_error=this.myObj.type_error;

      if (this.initObj.input_OW.length<this.ref_format.MyDateFormat.length && this.initObj.valid_input_OW==="Y") {
        // must reinitialise to the current month
        if (this.initObj.valid_input_RET==="N") { // display current and next months calendar
          this.initObj=generate_calendar("","", this.initObj);
        } else{ // dislay only previous month calendar related to first input
          this.initObj=generate_calendar("","RET", this.initObj); 
        }
      }

      if (this.type_error===0 && this.initObj.input_OW.length===this.ref_format.MyDateFormat.length ){
          // full date is correct; display corresponding calendar
          this.initObj.daynb=Number(this.myObj.input_day);
          this.initObj.monthnb=Number(this.myObj.input_month);
          this.initObj.yearnb=Number(this.myObj.input_year);
          this.initObj.valid_input_OW="Y";
          if (this.initObj.valid_input_RET==="N"){
                  this.initObj=generate_calendar("OW","", this.initObj); 
          } // else{this.initObj=generate_calendar("OW","RET", this.initObj); }
          this.initObj.datePipe_OW.setDate(this.initObj.daynb);
          this.initObj.datePipe_OW.setMonth(this.initObj.monthnb-1);
          this.initObj.datePipe_OW.setFullYear(this.initObj.yearnb);

          if (this.initObj.valid_input_RET==="Y" && this.initObj.datePipe_OW > this.initObj.datePipe_RET){
            this.type_error=21;
            this.error_msg="return date must be after departure date";
          }
      } else {this.initObj.valid_input_OW="N" };

      if (this.initObj.input_OW.length>0) {
        this.Display_p_holder_ow="N";
      } else {
        this.Display_p_holder_ow="Y";
      }
  } // end of OnInputOW

  OnInputRET(event:any){
    this.initObj.input_RET = event.target.value;
    this.work_string=event.inputType ; // e.g. "deleteContentBackward"

    this.FormatValidationOnly=false;
    this.datePipeMin=this.datePipeToday;

    this.myObj=manage_input(
      this.initObj.input_RET,
      this.work_string,
      this.ref_format,
      this.initObj.maxDate_year,
      this.initObj.today_year,
      this.datePipe,
      this.datePipeMax,
      this.datePipeToday,      
      this.datePipeMin,
      this.FormatValidationOnly);

      this.initObj.input_RET=this.myObj.theInput;
      this.error_msg=this.myObj.error_msg;
      this.type_error=this.myObj.type_error+20;

      if (this.initObj.input_RET.length<this.ref_format.MyDateFormat.length && this.initObj.valid_input_RET==="Y") {
        // must reinitialise to the current month
        
        if (this.initObj.valid_input_OW==="N") { // display current and next months calendar
            this.initObj=generate_calendar("","", this.initObj);
        } else{ // dislay only next month calendar 
            this.initObj=generate_calendar("OW","", this.initObj);
        }

      }
      if (this.type_error===20 && this.initObj.input_RET.length===this.ref_format.MyDateFormat.length ){
        // full date is correct; 
   
          this.initObj.ndaynb=Number(this.myObj.input_day);
          this.initObj.nmonthnb=Number(this.myObj.input_month);
          this.initObj.nyearnb=Number(this.myObj.input_year);
          if (this.initObj.valid_input_OW==="N"){
                this.initObj=generate_calendar("","RET", this.initObj); 
          } else{   this.initObj=generate_calendar("OW","", this.initObj); }
         
          this.initObj.valid_input_RET="Y";
          this.initObj.datePipe_RET.setDate(this.initObj.ndaynb);
          this.initObj.datePipe_RET.setMonth(this.initObj.nmonthnb-1);
          this.initObj.datePipe_RET.setFullYear(this.initObj.nyearnb);
          if (this.initObj.valid_input_OW==="Y" && this.initObj.datePipe_OW > this.initObj.datePipe_RET){
            this.type_error=11;
            this.error_msg="return date must be after departure date";
          } 
          
      } else {this.initObj.valid_input_RET="N"};

      if (this.initObj.input_RET.length>0) {
        this.Display_p_holder_ow="N";
      } else {
        this.Display_p_holder_ow="Y";
      }

      /* NOT COMPLETELY ANALYZED AND MAY NOT BE SIMPLER/FASTER THAN CODING WITHIN HTML COMPONENT
      
      for (this.k1=2; this.initObj.dayspermonth2Bis[this.k1]=0){this.k1=this.k1+1;}
      for (this.k2=2; this.initObj.dayspermonth2Bis[this.k2]=0){this.k2=this.k2+1;}

      if (this.initObj.today_year=== this.initObj.dayspermonth1Bis[0].DoMonth &&
          this.initObj.today_month=== this.initObj.dayspermonth1Bis[1].DoMonth){
        this.initObj.dayspermonth1Bis[this.initObj.today_day+this.k1].type_data="T";
      }
      // Selected dates on first calendar
      if (this.initObj.yearnb=== this.initObj.dayspermonth1Bis[0].DoMonth &&
          this.initObj.monthnb=== this.initObj.dayspermonth1Bis[1].DoMonth){
        this.initObj.dayspermonth1Bis[this.initObj.daynb+this.k1].type_data="O";
      }
      if (this.initObj.nyearnb=== this.initObj.dayspermonth1Bis[0].DoMonth &&
          this.initObj.nmonthnb=== this.initObj.dayspermonth1Bis[1].DoMonth){
        this.initObj.dayspermonth1Bis[this.initObj.ndaynb+this.k1].type_data="R";
      }
      // Selected dates on second calendar
      if (this.initObj.yearnb=== this.initObj.dayspermonth2Bis[0].DoMonth &&
          this.initObj.monthnb=== this.initObj.dayspermonth2Bis[1].DoMonth){
        this.initObj.dayspermonth2Bis[this.initObj.daynb+this.k2].type_data="O";
      }
      if (this.initObj.nyearnb=== this.initObj.dayspermonth2Bis[0].DoMonth &&
          this.initObj.nmonthnb=== this.initObj.dayspermonth2Bis[1].DoMonth){
        this.initObj.dayspermonth2Bis[this.initObj.ndaynb+this.k1].type_data="R";
      }
      if (this.initObj.valid_input_OW==="Y" && this.initObj.valid_input_RET==="Y"){

        // flag the selectde range
        
      
      }
      
      
      */

  } // end of OnInputRET
    

   OnArrowLeft(the_arrow:string){
              this.initObj=generate_calendar("P_OW","", this.initObj);

   }
   OnArrowRight(event:any){
        this.initObj=generate_calendar("","N_RET", this.initObj);
   }

  OnSubmit() {

    
    this.travel_O_R = this.TheCalendarform.controls['travel_type'].value;
        if (this.travel_O_R ==='X'){
        this.initObj.input_OW="";
        this.initObj.input_RET="";
        this.initObj.valid_input_OW="N";
        this.initObj.valid_input_RET="N";
        this.TheCalendarform.controls['travel_type'].setValue("");
        this.initObj.monthnb=parseInt(formatDate(Date.now(),'MM',this.locale));
        this.initObj.yearnb=parseInt(formatDate(Date.now(),'YYYY',this.locale));
        this.initObj.daynb=parseInt(formatDate(Date.now(),'dd',this.locale));
        this.initObj=generate_calendar("", "",this.initObj);
    }
    else if (this.travel_O_R ===''){
      this.type_error = 3;
          this.error_msg = "select type of trip";
    }
     else if (this.travel_O_R ==='R' && this.initObj.valid_input_RET==="N") {
              this.type_error = 22;
              this.error_msg = " *** select a return date ***";
      }
        else if ((this.travel_O_R ==='O' || this.travel_O_R ==='R') &&
        this.initObj.valid_input_OW==="N"){
              this.type_error = 1;
              this.error_msg = " *** select the departure date ***";
        }
          
          else{

            this.initObj.datePipe_OW.setDate(this.initObj.daynb);
            this.initObj.datePipe_OW.setMonth(this.initObj.monthnb-1);
            this.initObj.datePipe_OW.setFullYear(this.initObj.yearnb);
            this.TheCalendarform.controls['oneway_boarding_date'].setValue(this.initObj.datePipe_OW);
            if (this.initObj.valid_input_RET==="Y"){
                    this.initObj.datePipe_RET.setDate(this.initObj.ndaynb);
                    this.initObj.datePipe_RET.setMonth(this.initObj.nmonthnb-1);
                    this.initObj.datePipe_RET.setFullYear(this.initObj.nyearnb); 
                    this.TheCalendarform.controls['return_boarding_date'].setValue(this.initObj.datePipe_RET);
            }
            this.dialogRef.close(this.TheCalendarform.value); 
          }

   }


  onSelectCalendOne(array_month:DaysOfMonths){
    this.type_error=0;
    this.error_msg='';
    this.SelectedDay=array_month;
    const noCheck=false;
    this.initObj=selectDay(1, this.SelectedDay, this.datePipe, this.ref_format.MyDateFormat,this.locale,this.initObj, this.datePipeMax, this.datePipeToday, noCheck);
    this.type_error=this.initObj.type_error;
    this.error_msg=this.initObj.error_msg;
  } // end on SelectCalendOne()

  onSelectCalendTwo(array_month:DaysOfMonths){
    this.type_error=0;
    this.error_msg='';
    this.SelectedDay=array_month;
    const noCheck=false;
    this.initObj=selectDay(2, this.SelectedDay, this.datePipe, this.ref_format.MyDateFormat,this.locale,this.initObj,this.datePipeMax, this.datePipeToday,noCheck);
    this.type_error=this.initObj.type_error;
    this.error_msg=this.initObj.error_msg;
  } // end on SelectCalendTwo()
/*
   
   */

}
/*
 Sun_Earth(){
    const sun = new Image();
    const moon = new Image();
    const earth = new Image();
    const x=150;
    const y=400;
    const w_size_image=300;
    const h_size_image=300;

      sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
      moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
      earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

      this.i_loop=0;

      //const width = this.theCanvas.width;
      //const height = this.theCanvas.height;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
      this.i_loop++;   
      this.ctx.globalCompositeOperation = 'destination-over';
      // this.ctx.clearRect(0, 0,  width, height); // clear canvas
      this.ctx.clearRect(x, y,  x+10, y+10);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';

      this.ctx.save();
      this.ctx.translate(x+w_size_image/2,y+h_size_image);
        
      // Earth
      const time = new Date();
      this.ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
      this.ctx.translate(105, 0);
      this.ctx.fillRect(0, -12, 30, 24); // Shadow
      this.ctx.drawImage(earth, -12, -12);
        
      // Moon
      //this.ctx.save();
      this.ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
      this.ctx.translate(0, 28.5);
      this.ctx.drawImage(moon, -3.5, -3.5);
      // this.ctx.restore();
        
      this.ctx.restore();
          
      this.ctx.beginPath();
      this.ctx.arc(x+w_size_image/2,y+h_size_image, 105, 0, Math.PI * 2, false); // Earth orbit
      this.ctx.stroke();

      // Sun
      this.ctx.drawImage(sun,x,y,w_size_image, h_size_image);

      this.id_Animation_two=window.requestAnimationFrame(() => this.Sun_Earth());
      if (this.j_loop>30000){
        window.cancelAnimationFrame(this.id_Animation_two);
        } 

  }
*/

