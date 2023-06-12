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

  selectedHeight:number=0;
  selectedWidth:number=0;

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

ngOnInit(): void {
  if (this.posSlider.VerHor==='H'){
      this.canvas.width=255;
      this.canvas.height=50;
  } else {
    this.canvas.width=50;
    this.canvas.height=255;
  }


  }

ngAfterViewInit() { 
  if (this.posSlider.VerHor==='H'){
    this.theCanvas=document.getElementById('canvasIDSliderH');
  } else {
    this.theCanvas=document.getElementById('canvasIDSliderV');
  }
  this.ctx=this.theCanvas.getContext('2d');
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
          gradient = this.ctx.createLinearGradient(0, 0, width , 0);
      } else {
          gradient = this.ctx.createLinearGradient(0, 0, 0, height);
      }
      
      gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
      gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
      gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
      gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
      gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
      gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

      this.ctx.beginPath();
      this.ctx.fillStyle = gradient;
      this.ctx.rect(0, 0, width, height);
      this.ctx.fill();
      this.ctx.closePath();

      if (this.selectedWidth!==0 || this.selectedHeight!==0){
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = 2
        if (this.posSlider.VerHor==='H'){
          this.ctx.rect( this.selectedWidth - 1, 0, this.ctx.lineWidth, this.canvas.height);
        } else {
          this.ctx.rect(0, this.selectedHeight - 1, this.canvas.width, this.ctx.lineWidth);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }

}


onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.selectedWidth = evt.offsetX;
    this.draw();
    this.emitColor();
  }
  
onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.selectedWidth = evt.offsetX;
      this.draw();
      this.emitColor();
    } 
  }

@HostListener('window:mouseup', ['$event'])
onMouseUp(evt: MouseEvent) { 
    // console.log('onMouseUp ', evt);
    this.mousedown = false;
  }
  

emitColor() {
  var imageDataBis = this.ctx.getImageData(this.selectedWidth, this.selectedHeight, 1, 1);
  console.log('Image RGBA= '+imageDataBis.data[0] + ','+imageDataBis.data[2] + ','+imageDataBis.data[3] + ',' );
      this.rgbaColor = this.getColorAtPosition();
      this.returnField.rgba=this.rgbaColor;
      this.returnField.xPos=this.selectedWidth;
      this.returnField.yPos=this.selectedHeight;
      this.my_output1.emit(this.rgbaColor);
      this.my_output2.emit(this.returnField);
     }
     
getColorAtPosition() {

  var AA=0;
  var BB=0;
  var CC=0;
  var iFound=0;
  var imageData = this.ctx.getImageData(1, 1, 1, 1);

  if (this.posSlider.VerHor==='H'){
      for (var i=1; i<this.selectedWidth+3 ; i++){
        imageData = this.ctx.getImageData(i, 1, 1, 1);
        AA=imageData.data[0];
        BB=imageData.data[1];
        CC=imageData.data[2];
        if ((AA!==0 || BB !==0 || CC !==0) ){
            iFound=i;
        }
      }
  } else  if (this.posSlider.VerHor==='V'){
    for (var i=1; i<this.selectedHeight+3 ; i++){
      imageData = this.ctx.getImageData(1, i, 1, 1);
      AA=imageData.data[0];
      BB=imageData.data[1];
      CC=imageData.data[2];
      if ((AA!==0 || BB !==0 || CC !==0) ){
          iFound=i;
      }
    }
  }
  //imageData = this.ctx.getImageData(iFound, 1, 1, 1);
  //return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  return 'rgba(' + AA + ',' + BB + ',' + CC + ',1)';
     }
     
ngOnChanges(changes: SimpleChanges) { 
  var i=0;
  for (const propName in changes){
      const j=changes[propName];
      if (propName==='paramChange' && changes['paramChange'].firstChange===false){
        this.ngOnInit();
        this.draw();
      }
     }
    }



}
