import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-second-child',
  templateUrl: './second-child.component.html',
  styleUrls: ['./second-child.component.css']
})

export class SecondChildComponent implements OnInit, OnChanges, AfterViewInit {

  constructor() { }
  

  @Input() my_input2: string='pink';

  @Output() my_output2= new EventEmitter<string>();
  @Output() my_output1= new EventEmitter<string>();
 
  @ViewChild('THEFirstCanvas', { static: true })


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
    //console.log('2nd child ngOnInit');
    
  }


  ngAfterViewInit() { 
    this.theCanvas=document.getElementById('canvasID');
    if (!this.ctx) { //true
        this.ctx=this.theCanvas.getContext('2d');
    }
    this.draw();
    //console.log('color-2nd child end of AfterViewInit');
    }

draw() {

      
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
      //console.log('2nd child emit color',this.rgbaColor),
      this.my_output2.emit(this.rgbaColor);
      this.my_output1.emit(this.rgbaColor);

       
     }
     
     getColorAtPosition(x: number, y: number) {
       const imageData = this.ctx.getImageData(x, y, 1, 1).data;
       return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
     }
     
     ngOnChanges(changes: SimpleChanges) { 
    //nothing to process   
    // console.log('mgOnCHanges 2nd child');
    
     }




}
