import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';
  import {classPosSlider} from '../../JsonServerClass';

  import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.css']
})
export class ColorSliderComponent implements OnInit, OnChanges, AfterViewInit {


  constructor() { }

 
  @Input() my_input2: string='';
  @Input() paramChange:number=0;
  @Input() posSlider=new classPosSlider; 
  @Input() INreturnField={
    rgba:'',
    xPos:0,
    yPos:0
  }
  @Output() my_output2= new EventEmitter<any>();
  @Output() my_output1= new EventEmitter<string>();

  @ViewChild('THECanvas', { static: true })


  i=0;
  mytext:string='';
  InputChange:boolean=false;


  mousedown:boolean=false;

  selectedPos={x:0,y:0}

  hexColor: string='';
  rgbaColor: any;
  theCanvas:any;
  ctx:any;

  returnField={
    rgba:'',
    xPos:0,
    yPos:0
  }

  canvas={
    width:0,
    height:0
  }
  selectNb:number=255;
  getScreenWidth:number=0;
  getScreenHeight:number=0;
  browserType:string="";
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


ngOnInit(): void {
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
  
  if (navigator.userAgent.indexOf("Firefox")>0){
    this.browserType="Firefox";
  } else {this.browserType="Others"};

  if (this.posSlider.VerHor==='H'){
      this.canvas.width=255;
      this.canvas.height=50;
      this.selectNb=1;
  } else {
    this.canvas.width=50;
    this.canvas.height=255;
    this.selectNb=255;
  }
  if (this.INreturnField.rgba!==undefined && this.INreturnField.rgba!=='' ){
    this.selectedPos.x=this.INreturnField.xPos;
    this.selectedPos.y=this.INreturnField.yPos;
  } else {
    this.selectedPos.x=0;
    this.selectedPos.y=0;
    
  }
}

ngAfterViewInit() { 
  this.theCanvas=document.getElementById('canvasIDSliderH');
  /*
  if (this.posSlider.VerHor==='H'){
    this.theCanvas=document.getElementById('canvasIDSliderH');
  } else {
    this.theCanvas=document.getElementById('canvasIDSliderV');
  }
  */
  if (!this.ctx){
    this.ctx=this.theCanvas.getContext('2d');
  }
    
  this.draw();
  if (this.INreturnField.rgba!==undefined && this.INreturnField.rgba!=='' ){
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 2
    //this.ctx.rect(0, this.selectedHeight - 5, width, 10)


    if (this.posSlider.VerHor==='H'){
      this.ctx.rect( this.INreturnField.xPos - 1, 0, this.ctx.lineWidth, this.canvas.height);
    } else {
      this.ctx.rect(0, this.INreturnField.yPos - 1, this.canvas.width, this.ctx.lineWidth);
    }
    //this.ctx.rect( this.INreturnField.xPos - 5, 0, 10, 50)
    this.ctx.stroke()
    this.ctx.closePath()
  } 
}


returnValue(event:any){
  if (this.posSlider.VerHor==='H'){
    this.selectedPos.x=event.currentTarget.valueAsNumber;
  } else {
    this.selectedPos.y=256-event.currentTarget.valueAsNumber;
  }
  this.selectNb=event.currentTarget.valueAsNumber;
  
 this.draw();
 this.emitColor();
 this.colorSelected();
}

draw() {

      var gradient:any;
      const width = this.theCanvas.width;
      const height = this.theCanvas.height;
      this.ctx.clearRect(0, 0, width , height);
      if (this.posSlider.VerHor==='H'){
      // x0=The x-coordinate of the start point of the gradient
      // y0=The y-coordinate of the start point of the gradient
      // x1=The x-coordinate of the end point of the gradient
      // y1=The y-coordinate of the end point of the gradient
      // this.ctx.createLinearGradient(x0, y0, x1 , y1);
          gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width , 0);
      } else {
          gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      }
      
      gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
      gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
      gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
      gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
      gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
      gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

      /*
      const grd = this.ctx.createLinearGradient(0, 0, 250, 0);
      grd.addColorStop(0, "black");
      grd.addColorStop("0.3", "magenta");
      grd.addColorStop("0.5", "blue");
      grd.addColorStop("0.6", "green");
      grd.addColorStop("0.8", "yellow");
      grd.addColorStop(1, "red");
      */

      this.ctx.beginPath();
      this.ctx.fillStyle = gradient;
      //this.ctx.fillStyle = grd;
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fill();
      this.ctx.closePath();



}

myMouse:number=0;
onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.myMouse++
    this.selectedPos = { x: evt.offsetX, y: evt.offsetY };
    this.selectNb=256-this.selectedPos.y;
    this.draw();
    this.emitColor();
    this.colorSelected();
  }
  
colorSelected(){
  if (this.selectedPos.x!==0 || this.selectedPos.y!==0){
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 2;
    if (this.posSlider.VerHor==='H'){
      this.ctx.rect( this.selectedPos.x - 1, 0, this.ctx.lineWidth, this.canvas.height);
    } else {
      this.ctx.rect(0, this.selectedPos.y - 1, this.canvas.width, this.ctx.lineWidth);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedPos = { x: evt.offsetX, y: evt.offsetY };
      this.selectNb=256-this.selectedPos.y;
      this.draw();
      this.emitColor();
      this.colorSelected();
    } 
  }

@HostListener('window:mouseup', ['$event'])
onMouseUp(evt: MouseEvent) { 
    this.mousedown = false;
  }
 

emitColor() {
      this.rgbaColor = this.getColorAtPosition();
      this.returnField.rgba=this.rgbaColor;
      this.returnField.xPos=this.selectedPos.x;
      this.returnField.yPos=this.selectedPos.y;
      this.my_output1.emit(this.rgbaColor);
      this.my_output2.emit(this.returnField);
     }
     
getColorAtPosition() {

  if (this.posSlider.VerHor==='H'){
      var imageData = this.ctx.getImageData(this.selectedPos.x, 1, 1, 1);
  } else {
    var imageData = this.ctx.getImageData(3, this.selectedPos.y, 1, 1);
  }

 // for (var i=0; i<255; i++){
 //   var imageDataB = this.ctx.getImageData(i , 3, 1, 1);
 // }

  return 'rgba(' + imageData.data[0] + ',' + imageData.data[1] + ',' + imageData.data[2] + ',1)';


     }
     
ngOnChanges(changes: SimpleChanges) { 
  var i=0;
  for (const propName in changes){
      const j=changes[propName];
      if (propName==='paramChange' && changes['paramChange'].firstChange===false){
        this.ngOnInit();
        this.draw();
        if (this.INreturnField.rgba!==undefined && this.INreturnField.rgba!=='' ){
          this.ctx.beginPath()
          this.ctx.strokeStyle = 'white'
          this.ctx.lineWidth = 2
          //this.ctx.rect(0, this.selectedHeight - 5, width, 10)
      
      
          if (this.posSlider.VerHor==='H'){
            this.ctx.rect( this.INreturnField.xPos - 1, 0, this.ctx.lineWidth, this.canvas.height);
          } else {
            this.ctx.rect(0, this.INreturnField.yPos - 1, this.canvas.width, this.ctx.lineWidth);
          }
          //this.ctx.rect( this.INreturnField.xPos - 5, 0, 10, 50)
          this.ctx.stroke()
          this.ctx.closePath()
        } 
      }
     }
    }



}
