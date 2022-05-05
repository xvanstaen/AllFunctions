import { Component,  SimpleChanges, ViewChild, AfterViewInit, OnInit,  OnChanges,
  Output, Input, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css']
})
export class ColorPaletteComponent implements OnInit, OnChanges, AfterViewInit {

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
    //console.log('Color Palette AfterView in Palette  : ', this.my_input1);
      this.theCanvas=document.getElementById('canvasElPalette');
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
      
      //console.log('palette  ngOnChange', this.my_input1, changes['my_input1'].currentValue, 'previous value  ', changes['my_input1'].previousValue); 
      if (changes['my_input1'].firstChange===true){
        this.previous_my_input1 = changes['my_input1'].currentValue; // data is not used indeed
      }
      else {
            this.draw();
            const pos = this.selectedPosition;
            if (pos) {
              this.rgbaColor=this.getColorAtPosition(pos.x, pos.y);
              //this.my_output1.emit(this.rgbaColor);
            }
            // else { console.log('else of ngOnChanges')}
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
      //console.log('palette emitColor 2', this.rgbaColor);
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
  



}
