import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component,  SimpleChanges, ViewChild, AfterViewInit, OnInit,  OnChanges,
  Output, Input, HostListener, EventEmitter } from '@angular/core';
  import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
  // import {point_circle} from '.././MyStdFunctions'

@Component({
  selector: 'app-my-canvas',
  templateUrl: './my-canvas.component.html',
  styleUrls: ['./my-canvas.component.css']
})
export class MyCanvasComponent implements OnInit {
  

  constructor() { }
  
  @ViewChild('TestCanvas', { static: true })

  theCanvas:any;
  ctx:any;
  startangle:number=0;
  endangle:number=0;
  x_coordinate:number=0;
  y_coordinate:number=0;
  theRadius:number=0;
  theRadiusBis:number=0;
  DirectionClock:boolean=true;
  radioValue:string='';
  x_From:number=0;
  y_From:number=0;
  x_To:number=0;
  y_To:number=0;
  x_Pas:number=0;
  y_Pas:number=0;
  i_loop:number=0;
  j_loop:number=0;
  k_loop:number=0;
  max_loop:number=10000;
  x_interval:number=0;
  theta_v:number=0;
  theta_pas_v:number=0;
  id_interval:number=0;
  x_translate:number=0;
  y_translate:number=0;
  angle_moon:number=0;
  angle_moonBis:number=0;
  moon_x_prev:number=0;
  moon_y_prev:number=0;

  new_x:number=0;
  new_y:number=0;
  prev_x:number=0;
  prev_y:number=0;

  TheCanvasForm: FormGroup = new FormGroup({ 
    ReturnToPage: new FormControl(),
    xPos: new FormControl(),
    yPos: new FormControl(),
    radius: new FormControl(),
    sAngle: new FormControl(),
    eAngle: new FormControl(),
    Clockwise: new FormControl(),
    theta: new FormControl(),
    theta_pas: new FormControl(),

  });
  MoveCanvasForm: FormGroup = new FormGroup({ 
    xFrom: new FormControl(),
    yFrom: new FormControl(),
    xTo: new FormControl(),
    yTo: new FormControl(),
    radius: new FormControl(),
    xPas: new FormControl(),
    yPas: new FormControl(),

  });

  ngOnInit() {
    this.radioValue='';
    this.TheCanvasForm.controls['xPos'].setValue(200);
    this.TheCanvasForm.controls['yPos'].setValue(200);
    this.TheCanvasForm.controls['radius'].setValue(100);
    this.TheCanvasForm.controls['sAngle'].setValue(0);
    this.TheCanvasForm.controls['eAngle'].setValue(2);
    this.TheCanvasForm.controls['Clockwise'].setValue(true);
    this.TheCanvasForm.controls['theta'].setValue(0);
    this.TheCanvasForm.controls['theta_pas'].setValue(15);

    this.MoveCanvasForm.controls['xFrom'].setValue(30);
    this.MoveCanvasForm.controls['xTo'].setValue(90);
    this.MoveCanvasForm.controls['yFrom'].setValue(30);
    this.MoveCanvasForm.controls['yTo'].setValue(90);
    this.MoveCanvasForm.controls['radius'].setValue(5);
    this.MoveCanvasForm.controls['xPas'].setValue(10);
    this.MoveCanvasForm.controls['yPas'].setValue(10);
  }

  ngAfterViewInit() { 
      this.theCanvas=document.getElementById('canvasElem');
            
      if (!this.ctx) { //true
          this.ctx=this.theCanvas.getContext('2d');
      }

    }

  drawCanvas(){
      const width = this.theCanvas.width;
      const height = this.theCanvas.height;
      // DRAW a circle
      this.ctx.beginPath(); //	Begins a path, or resets the current path
      
     

      // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
      // The x-coordinate of the center of the circle
      // The y-coordinate of the center of the circle
      // The radius of the circle
      // The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle) e.g. 1.75 * Math.PI
      // The ending angle, in radians e.g. 1.75 * Math.PI

      // counterclockwise	(true or false) Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
      //for (this.startangle=0; this.startangle<8;){
         
      
      this.ctx.arc(this.x_coordinate, this.y_coordinate, this.theRadius, this.startangle, this.endangle * Math.PI,this.DirectionClock); //Creates an arc/curve (used to create circles, or parts of circles)
      this.ctx.stroke(); // Actually draws the path you have defined
      // this.y_coordinate=this.y_coordinate + 50;
      //}
    }

  drawCircleParam(){
      this.x_coordinate=this.TheCanvasForm.controls['xPos'].value;
      this.y_coordinate=this.TheCanvasForm.controls['yPos'].value;
      this.theRadius= this.TheCanvasForm.controls['radius'].value;
      this.startangle= this.TheCanvasForm.controls['sAngle'].value;
      this.endangle=this.TheCanvasForm.controls['eAngle'].value;
      this.DirectionClock=this.TheCanvasForm.controls['Clockwise'].value;
      this.x_To=this.MoveCanvasForm.controls['xTo'].value;
      this.y_To=this.MoveCanvasForm.controls['yTo'].value;
      this.x_Pas=this.MoveCanvasForm.controls['xPas'].value;
      this.y_Pas=this.MoveCanvasForm.controls['yPas'].value;
      this.theRadiusBis=this.MoveCanvasForm.controls['radius'].value;
      this.theta_v=this.TheCanvasForm.controls['theta'].value;
      this.theta_pas_v=this.TheCanvasForm.controls['theta_pas'].value;
    }


    RadioActions(event:any){
      if (event!==''){
        this.radioValue=event;
      } else  {this.radioValue= this.TheCanvasForm.controls['ReturnToPage'].value};
      if (this.radioValue==='Circle') {
        this.drawCircleParam();
        this.drawCanvas();
        // indicate the center of the circle
        this.ctx.beginPath();
        this.ctx.font = 'bold 18px serif';
        this.ctx.strokeText('A', this.x_coordinate, this.y_coordinate);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x_coordinate, this.y_coordinate);
        this.ctx.lineTo(this.x_coordinate, this.y_coordinate+this.theRadius);
        this.ctx.stroke();
      }
      else if (this.radioValue==='MoveCircle') {
        this.MoveCanvas('Create');
      }
      else if (this.radioValue==='CircleByPoint') {
          this.draw_circle_byPoint();
      }
      else if (this.radioValue==='Clear') {
        
        this.MoveCanvas('Clear');
        this.TheCanvasForm.controls['ReturnToPage'].setValue('');
        this.ngOnInit();
      }
    }

    ClearCanvas(){
        this.ctx.beginPath();
        //this.ctx.clearRect(this.x_coordinate - this.theRadius - 1, this.y_coordinate - this.theRadius - 1, this.theRadius * 2 + 2, this.theRadius * 2 + 2);
        this.ctx.clearRect(0,0,this.theCanvas.width,this.theCanvas.height);
        this.ctx.closePath();
    }


    MoveCanvas(type_action:string){


      this.drawCircleParam();
      for (this.x_From=this.MoveCanvasForm.controls['xFrom'].value;  this.x_From<this.x_To; this.i_loop<this.max_loop)
      {
       

        for (this.y_From=this.MoveCanvasForm.controls['yFrom'].value;  this.y_From<=this.y_To; this.i_loop<this.max_loop)
        {
          
          this.x_coordinate=this.x_From;
          this.y_coordinate=this.y_From;
          this.i_loop=this.i_loop+1;
          if (type_action==='Create' ){
            this.drawCanvas();
          }
          else if (type_action==='Clear'){
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            this.ClearCanvas();
            this.moon_cycle()
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            this.ClearCanvas();
          }
          this.y_From=this.y_From+this.y_Pas;
          
        }
        this.x_From=this.x_From+this.x_Pas;
      }

    }
    

    draw_circle_byPoint(){
      this. drawCircleParam();
      const moon = new Image();
      const earth = new Image();
      const sun = new Image();
      sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
      // moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
      earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
      moon.src = '../assets/MoonNew.png';
      const champagne=new Image();
      champagne.src=' 🍾';
      
      const pas= 2 * Math.PI / this.theta_pas_v;
      this.x_interval=0;
      this.i_loop=0;

      this.x_translate=20;
      this.y_translate=20;

      this.prev_x= this.x_coordinate;
      this.prev_y= this.y_coordinate;
      
       //To be analyzed https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
        const i= setInterval(() => {
              this.theta_v+=pas
              this.new_x = this.x_coordinate + this.theRadius * Math.cos(this.theta_v);
              this.new_y = this.y_coordinate + this.theRadius * Math.sin(this.theta_v);
              if (this.i_loop!==0){
                this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
                this.ctx.beginPath();
                //this.ctx.clearRect(this.prev_x -(this.x_translate/2) - 1, this.prev_y -(this.y_translate/2) - 1, this.theRadiusBis  + this.x_translate+ 2, this.theRadiusBis  + this.y_translate+2);
                //this.ctx.clearRect(this.x_coordinate - this.theRadius*2 - this.theRadiusBis- 1, this.y_coordinate - this.theRadiusBis- this.theRadius*2 - 1, this.theRadius *3   + this.theRadiusBis*4+ 2, this.theRadius *32   + this.theRadiusBis*4+2);
             
               this.ClearCanvas();
               this.ctx.stroke();

                //this.ctx.closePath();

              }
             
              this.prev_x=this.new_x;
              this.prev_y=this.new_y;

              this.i_loop++;   

              this.ctx.fillStyle = 'white'; // color inside circle
              this.ctx.strokeStyle= 'red'; // color line cycle
              this.ctx.lineWidth = 3; // weight of the line
                    
              //
              // This is equivalent to earth moving around the sun
              //
                this.ctx.beginPath(); // critical
                this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
                // draw a circle only
                
                this.ctx.arc( this.x_coordinate, this.y_coordinate, this.theRadius, 0, 2 * Math.PI);
                this.ctx.fillStyle = 'lightblue'; // color inside circle
                this.ctx.strokeStyle= 'red'; // color line cycle
                this.ctx.lineWidth = 3; // weight of the line
                this.ctx.fill();
                this.ctx.stroke();

        this.ctx.drawImage(sun,this.x_coordinate-150, this.y_coordinate-150, 300, 300);

                this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
                const time = new Date();
                this.ctx.translate( this.x_coordinate, this.y_coordinate);
                this.ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
                
                this.ctx.beginPath(); // if omitted then circle crosses the moon 
                //this.ctx.drawImage(earth,this.new_x-1-(this.x_translate/2), this.new_y-(this.y_translate/2), this.x_translate,this.y_translate );
                //this.ctx.drawImage(earth,this.theRadius/2+this.x_translate/2-5,this.theRadius/2+this.y_translate/2-5);
                this.ctx.translate( this.theRadius-this.x_translate-this.theRadiusBis*2, this.theRadius-this.x_translate-this.theRadiusBis*2);
                this.ctx.drawImage(earth,-11.5,-11.5);
                this.ctx.stroke();


                // draw a small circle at the center of the earth - FOR THE FUN
                this.ctx.translate( 0,0);
                this.ctx.beginPath();
                
                //this.ctx.beginPath(); 
                // this.ctx.arc(this.new_x, this.new_y, 3, 0, 2 * Math.PI); 
                this.ctx.arc(0.2, 0.2, 0, 0, 2 * Math.PI); 
                this.ctx.strokeStyle= 'white'; // color line cycle
                this.ctx.lineWidth = 1; // weight of the line
                this.ctx.fillStyle = "green";
                this.ctx.fill();
                this.ctx.stroke();

                // ==================================
                // draw the moon moving around earth
                //this.ctx.setTransform(1, 0, 0, 1, 0, 0); 

                //this.ctx.translate(100, 380);

                
                  
                  // clear previous circle
                 // this.ctx.beginPath();
                  //this.ctx.clearRect(-5,-5, 30 ,80);
                 // this.ctx.stroke();

                  // =========== process of the moon ============
                  
                  //this.angle_moon=this.angle_moon+(1/360); // pas = 5
                  //if (this.angle_moon>360){ 
                  //  this.angle_moon=0;
                  //}
                  // this.ctx.rotate(this.angle_moon * Math.PI / 180);

                  this.ctx.beginPath(); 
                  this.ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
                  //this.ctx.fillStyle = "purple";
                  //this.ctx.fillRect(0, 0, 2, 30); // Shadow
                  //this.ctx.stroke();
      
                  // this.ctx.arc(-this.theRadius-this.theRadiusBis, -this.theRadius-this.theRadiusBis+40, 5, 0, 2 * Math.PI); 
                  this.ctx.arc(0, 35, 5, 0, 2 * Math.PI); 
                  this.ctx.strokeStyle= 'black'; // color line cycle
                  this.ctx.lineWidth = 1; // weight of the line
                  this.ctx.fillStyle = "red";
                  this.ctx.fill();
                  this.ctx.stroke();

                  this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
                 
                  

                if (this.i_loop===1500){
                  clearInterval(i);
                }
                /*
                if (this.theta_v >= 2 * Math.PI){
                  clearInterval(i);
                }
                */
              }, 80); // setInterval(()

    } // draw_circle_byPoint()

   

    Sun_Earth(){
    const sun = new Image();
    const moon = new Image();
    const earth = new Image();

      //sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
      moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
      earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
      // window.requestAnimationFrame(draw);

      this.i_loop=0;

      const width = this.theCanvas.width;
      const height = this.theCanvas.height;
    const i= setInterval(() => {

          this.i_loop++;   
          this.ctx.globalCompositeOperation = 'destination-over';
          this.ctx.clearRect(0, 0,  width, height); // clear canvas
        
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';

          this.ctx.save();
          this.ctx.translate(150, 150);
        
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
          this.ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
          this.ctx.stroke();

            // Sun
          this.ctx.drawImage(sun, 0, 0, 300, 300);
          if (this.i_loop===1500){
            clearInterval(i);
          }
    }, 10); // setInterval(()
      // window.requestAnimationFrame(draw);

  }


  moon_cycle(){
      
    this.k_loop=0;
   
    
    const j= setInterval(() => {
        const time = new Date();
        this.k_loop++
        // reposition 
        if (this.k_loop===1){
            if (this.moon_x_prev===0){
              this.moon_x_prev=this.new_x;
              this.moon_y_prev=this.new_y;
            }
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
           // this.ctx.translate(this.moon_x_prev, this.moon_y_prev);
            this.ctx.translate(150, 400);
            // clear previous position
            this.ctx.rotate(this.angle_moonBis * Math.PI / 180);
            this.ctx.beginPath();
            this.ctx.clearRect(0-8-2, 30-8-2, 8*2+8,8*2+8);
            this.ctx.stroke();

            this.moon_x_prev=this.new_x;
            this.moon_y_prev=this.new_y;
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
            this.ctx.translate(150, 400);
            // this.ctx.translate(this.new_x, this.new_y);
        }
        
        // clear previous picture
        this.ctx.beginPath();
        this.ctx.clearRect(0-8-2, 30-8-2, 8*2+8 ,8*2+8);


        this.ctx.stroke();

        //using time would be an issue between two calls of this function
        // this.ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
       
        this.angle_moonBis=this.angle_moonBis+(0.01/360); // pas 
        if (this.angle_moonBis>360){ 
          this.angle_moonBis=0;
        }
        this.ctx.rotate(this.angle_moonBis * Math.PI / 180);
        // draw a small rectangle
        //this.ctx.beginPath(); 
        //this.ctx.fillStyle = "lightblue";
        //this.ctx.fillRect(0, 0, 2, 40); // Shadow
        //this.ctx.stroke();
        // draw a circle at the top of the small rectangle
        this.ctx.arc(0, 30, 8, 0, 2 * Math.PI); 
        this.ctx.strokeStyle= 'dark'; // color line cycle
        this.ctx.lineWidth = 1; // weight of the line
        this.ctx.fillStyle = "pink";
        this.ctx.fill();
        this.ctx.stroke();
    
        if (this.k_loop>15000){
          clearInterval(j);
        }
      }, 75); // setInterval(()
     
  }

save_text(){
  /*
                this.ctx.beginPath(); 
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(0, 0+30);
                this.ctx.strokeStyle= 'black'; // color line cycle
                this.ctx.lineWidth = 2; // weight of the line
                this.ctx.fill();
                this.ctx.stroke();
              */


                /* ============ ANOTHER DRAWING =============
                if (this.i_loop===1){
                  this.ctx.beginPath(); 
                  // draw a circle only
                  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                  this.ctx.arc( this.x_coordinate + 180, this.y_coordinate + 180, this.theRadius, 0, 2 * Math.PI);
                  this.ctx.lineWidth = 1;
                  this.ctx.strokeStyle= 'dark';
                  this.ctx.fillStyle = "green";
                  this.ctx.fill();
                  this.ctx.stroke();
                }

                this.ctx.beginPath(); 
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.ctx.arc(this.new_x + 180, this.new_y + 180, this.theRadiusBis, 0, 2 * Math.PI); 
                this.ctx.strokeStyle= 'dark';
                this.ctx.lineWidth = 2;
                this.ctx.fillStyle = "yellow";
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.closePath();

                *******************/



                // refer to 
                // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/canvas
                // and
                // https://www.w3schools.com/tags/ref_canvas.asp
                
                
                //this.ctx.font='bold 48px serif'

                // this.ctx.filter = 'blur(4px)';
                // brightness()  contrast() drop-shadow(x, y, blur_radius, color) grayscale(x%)
                // hue-rotate(angle) rotation of the drawing ==> angle = n degree
                // hue-rotate(%) opacity(%) saturate(% sepia(%) 
                // if multiple filters then this.ctx.filter='contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)';


                // ctx.lineWidth = 15;
                // ctx.lineCap = 'round'; ==> butt round square
                // ctx.setLineDash([4, 16]);
                // ctx.lineJoin = 'round'; ==> "round", "bevel", "miter"
}


  }


