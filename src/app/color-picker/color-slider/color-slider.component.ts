import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.css']
})
export class ColorSliderComponent implements OnInit, OnChanges, AfterViewInit {


  constructor() { }

 

  @Input() my_input2: string='';
  @Output() my_output2= new EventEmitter<string>();
  @Output() my_output1= new EventEmitter<string>();

  @ViewChild('THECanvas', { static: true })


  i=0;
  mytext:string='';
  InputChange:boolean=false;


  mousedown:boolean=false;

  selectedHeight: number=0;

  hexColor: string='';
  rgbaColor: any;

  theCanvas:any;
  ctx:any;

  ngOnInit(): void {
  }

  ngAfterViewInit() { 
    this.theCanvas=document.getElementById('canvasIDSlider');
    if (!this.ctx) { //true
        // from origin
        //this.ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
        //this.ctx = this.myCanvas.nativeElement.getContext('2d');
        this.ctx=this.theCanvas.getContext('2d');
    }
    this.draw();
    //console.log('color-slider end of AfterViewInit');
    }

draw() {
    // from origin
    //const width = this.myCanvas.nativeElement.width;
    //const height = this.myCanvas.nativeElement.height;
      const width = this.theCanvas.width;
      const height = this.theCanvas.height;
      this.ctx.clearRect(0, 0, width, height);
      const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
      gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
      gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
      gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
      gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
      gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

      this.ctx.beginPath();
      this.ctx.rect(0, 0, width, height);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.closePath();

      if (this.selectedHeight) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = 5
        this.ctx.rect(0, this.selectedHeight - 5, width, 10)
        this.ctx.stroke()
        this.ctx.closePath()
      }

}


  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
    }
  
  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) { 
    // console.log('onMouseUp ', evt);
    this.mousedown = false;
  }
  

    emitColor(x: number, y: number) {
      this.rgbaColor = this.getColorAtPosition(x, y);
      this.my_output2.emit(this.rgbaColor);
      this.my_output1.emit(this.rgbaColor);

       
     }
     
     getColorAtPosition(x: number, y: number) {
       const imageData = this.ctx.getImageData(x, y, 1, 1).data;
       return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
     }
     
     ngOnChanges(changes: SimpleChanges) { 
    //nothing to process   
    //console.log('mgOnCHanges Slider');
    
     }




}
