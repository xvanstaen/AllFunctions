import { Component,  SimpleChanges, ViewChild, AfterViewInit, OnInit,  OnChanges,
  Output, Input, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-first-child',
  templateUrl: './first-child.component.html',
  styleUrls: ['./first-child.component.css']
})
export class FirstChildComponent implements OnInit, OnChanges, AfterViewInit {

  constructor() { }

  @Input() my_input1: string='';
  @Output() my_output1= new EventEmitter<string>();

  @ViewChild('myCanvas', { static: true })

  i=0;
  mytext:string='';
  InputChange:boolean=false;
  previous_my_input1:string='';

  rgbaColor:string='';
  mousedown: boolean = false;
  selectedPosition ={ 
          x: 0,
          y: 0} ;

  theCanvas:any;
  ctx:any;

  ngOnInit(): void {
    //console.log('first child init - no emit');
  }
   

  ngAfterViewInit() { 
    //console.log('first-child AfterViewInit in Palette  ', this.my_input1);
      this.theCanvas=document.getElementById('canvasEl');
            
      if (!this.ctx) { //true
          this.ctx=this.theCanvas.getContext('2d');
      }
      this.draw();
     
    }
  
    
  draw() {
      const width = this.theCanvas.width;
      const height = this.theCanvas.height;
      
      this.ctx.fillStyle = this.my_input1 || 'rgba(255,255,255,1)';
      this.ctx.fillRect(0, 0, width, height);
    
      const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
      whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
      whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
  
      this.ctx.fillStyle = whiteGrad;
      this.ctx.fillRect(0, 0, width, height);
  
      const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
      blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
      blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
  
      this.ctx.fillStyle = blackGrad;
      this.ctx.fillRect(0, 0, width, height);
      //console.log(' first child draw 1', this.rgbaColor);
      if (this.selectedPosition) {
        this.ctx.strokeStyle = this.my_input1;
        this.ctx.fillStyle = this.my_input1;
        this.ctx.beginPath();
        this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
      }
    }
  
    ngOnChanges(changes: SimpleChanges) {   
      
      //console.log('ngOnChange 1st child ', this.my_input1, changes['my_input1'].currentValue, 'previous value  ', changes['my_input1'].previousValue); 
      if (changes['my_input1'].firstChange===true){
        this.previous_my_input1 = changes['my_input1'].currentValue; // thought to use it but didn't
      }
      else {
            this.draw();
            const pos = this.selectedPosition;
            if (pos) {
              this.rgbaColor=this.getColorAtPosition(pos.x, pos.y);
            }
            //else { console.log('else of ngOnChanges')}
          }
        
          
    }


    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent) {
      this.mousedown = false;
    }
  
    onMouseDown(evt: MouseEvent) {
      //console.log("mouse down in Palette");
      this.mousedown = true;
      
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.draw();
      //this.myColor=this.getColorAtPosition(evt.offsetX, evt.offsetY);
      //this.myConversion=this.myStyle + this.myColor + "'> " + this.myColor;
      this.rgbaColor=this.getColorAtPosition(evt.offsetX, evt.offsetY);
      this.my_output1.emit(this.rgbaColor);
 
    }
  
    onMouseMove(evt: MouseEvent) {
      if (this.mousedown) {
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.emitColor(evt.offsetX, evt.offsetY);
      }
    }
  
    emitColor(x: number, y: number) {
      
      this.rgbaColor = this.getColorAtPosition(x, y);
      // console.log('palette emitColor 2', this.rgbaColor);
      //this.myConversion=this.myStyle + this.myColor + "'> " + this.myColor;
      // console.log('my conversion',this.myConversion);
      // this.myDiv.innerHTML+=this.myConversion; // += allows to append
      //this.myDiv.innerHTML=this.myConversion;
      this.my_output1.emit(this.rgbaColor);

    }
  
  
  
    getColorAtPosition(x: number, y: number) {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      //console.log('getColor', this.ctx.getImageData(x, y, 1, 1).data);
      return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
  




/*
onMouseDown(evt: MouseEvent) {
  
  this.mousedown = true;
  this.i++
  this.mytext=this.mytext+this.i.toString();
  console.log('onMouse', this.mytext, this.InputChange);
  this.my_output1.emit(this.mytext);
  }

onMouseMove(evt: MouseEvent) {
  
  if (this.mousedown) {
    //console.log('onMouseDown ', evt);
      this.mousedown = true;
      this.i++
      this.mytext=this.mytext+this.i.toString();
      this.my_output1.emit(this.mytext);
    
  } // else the mouse dow has not been pressed once
}


@HostListener('window:mouseup', ['$event'])
onMouseUp(evt: MouseEvent) { 
  // console.log('onMouseUp ', evt);
  this.mousedown = false;
}

  ngOnChanges(theChange: SimpleChanges){
    
    console.log('ngOnChanges: current value',  theChange['my_input1'].currentValue, 'previous value  ', theChange['my_input1'].previousValue);

    
    
    if(this.my_input1==='=='){
      this.mytext="";
      this.i=0;
    } else {
        this.mytext=this.mytext+this.my_input1;
      }
    
  }
*/

}
