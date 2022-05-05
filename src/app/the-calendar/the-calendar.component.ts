import { Component,  OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';

import {convertDate} from '../MyStdFunctions'

@Component({
  selector: 'app-the-calendar',
  templateUrl: './the-calendar.component.html',
  styleUrls: ['./the-calendar.component.css']
})
export class TheCalendarComponent implements OnInit {
  
  error_msg: string='';

  test_date=new Date(2000/12/31);
  oneway_date=new Date(2000/12/31);
  return_date=new Date(2000/12/31);
  theplaceholderO:string="dd-mm-yyyy";
  theplaceholderR:string="dd-mm-yyyy";
  StringtodayDate:string="";
  todayDate=new Date();
  travel_O_R: string='';
  type_error:number=0;

  TheCalendarform: FormGroup = new FormGroup({ 
    oneway_boarding_date: new FormControl(),
    return_boarding_date: new FormControl(),
    travel_type: new FormControl() //one way or return flight
  })
  
  constructor(
      public matDialog: MatDialog,
      // private datePipe: DatePipe,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<TheCalendarComponent>,
      @Inject(MAT_DIALOG_DATA) 
      private data: {theorigin_date:string,thereturn_date:string,thetype_T:string},
  ){
      this.oneway_date = new Date(data.theorigin_date);
      this.return_date = new Date(data.thereturn_date);
      this.travel_O_R = data.thetype_T;
  }

  ngOnInit() {
    this.TheCalendarform=this.fb.group({
      oneway_boarding_date: this.oneway_date,
      return_boarding_date: this.return_date,
      travel_type: this.travel_O_R
    });
    if (this.travel_O_R === "") {
      this.theplaceholderO="dd/mm/yyyy";
      this.theplaceholderR="dd/mm/yyyy";
    } 
    else if (this.travel_O_R === "R"){
      this.theplaceholderO=convertDate(this.oneway_date,"dd-mm-yyyy");
      this.theplaceholderR=this.return_date.toString() 
      // the below also works
      //this.theplaceholderR=formatDate(this.return_date, 'dd/MM/yyyy', 'en-US');
    }
    else{
      this.theplaceholderO=this.oneway_date.toString();
      this.theplaceholderR="dd/mm/yyyy";
    }
    this.StringtodayDate=convertDate(this.todayDate,"yyyy-mm-dd");
  }
  
  OnCancel() {
   this.dialogRef.close(this.TheCalendarform.value);
  }

  OnSubmit() {
    // return the date(s) and type of trip
    this.type_error=0;
    this.error_msg="";
    this.oneway_date = this.TheCalendarform.controls['oneway_boarding_date'].value;
    this.return_date = this.TheCalendarform.controls['return_boarding_date'].value;
    this.travel_O_R = this.TheCalendarform.controls['travel_type'].value;

    if (this.travel_O_R ===''){
      this.type_error = 3;
          this.error_msg = "select type of trip";
    }
     else if (this.travel_O_R ==='R' && this.return_date.toString() === this.test_date.toString()) {
              this.type_error = 2;
              this.error_msg = " *** select a date ***";
      }
        else if ((this.travel_O_R ==='O' || this.travel_O_R ==='R') &&
              this.oneway_date.toString() === this.test_date.toString()){
              this.type_error = 1;
              this.error_msg = " *** select a date ***";
        }
          else if (this.oneway_date.toString() < this.StringtodayDate){
              this.type_error = 4;
              this.error_msg = " *** date must be equal or later than today ***";
          }
              else if (this.return_date.toString() < this.StringtodayDate){
                this.type_error = 5;
                this.error_msg = " *** date must be greater than today ***";
              }
                  else if (this.return_date.toString() < this.oneway_date.toString()){
                      this.type_error = 6;
                      this.error_msg = " *** return date must be after first date ***";
                  }
                    else{
                        this.dialogRef.close(this.TheCalendarform.value); 
                    }
  }
}
