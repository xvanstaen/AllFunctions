//import { ValueConverter } from '@angular/compiler/src/render3/view/template';
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


  var_i:number=0;
  var_j:number=0;
  var_k:number=0;

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

  max_loop:number=10000; // just for security

  theta_v:number=0;
  theta_pas_v:number=0;


  angle_moon:number=0;
  angle_moonBis:number=0;
  moon_x_prev:number=0;
  moon_y_prev:number=0;

  // used to stop the animation
  id_Animation:number=0;
  id_Animation_two:number=0;
  id_Animation_three:number=0;

  new_x:number=0;
  new_y:number=0;
  prev_x:number=0;
  prev_y:number=0;

  app_to_display:string='';

  TheCanvasForm: FormGroup = new FormGroup({ 
    ReturnToPage: new FormControl({ nonNullable: true }),
    xPos: new FormControl( { nonNullable: true }),
    yPos: new FormControl({ nonNullable: true }),
    radius: new FormControl({ nonNullable: true }),
    sAngle: new FormControl({ nonNullable: true }),
    eAngle: new FormControl({ nonNullable: true }),
    Clockwise: new FormControl({ nonNullable: true }),
    theta: new FormControl({ nonNullable: true }),
    theta_pas: new FormControl({ nonNullable: true }),

  });
  MoveCanvasForm: FormGroup = new FormGroup({ 
    xFrom: new FormControl({ nonNullable: true }),
    yFrom: new FormControl({ nonNullable: true }),
    xTo: new FormControl({ nonNullable: true }),
    yTo: new FormControl({ nonNullable: true }),
    radius: new FormControl({ nonNullable: true }),
    xPas: new FormControl({ nonNullable: true }),
    yPas: new FormControl({ nonNullable: true }),

  });

  moon = new Image();
  earth = new Image();
  sun = new Image();
  champagne:string='';
  
  max_i_loop:number=10000;
  max_j_loop:number=10000;
  max_k_loop:number=10000;
 
  ngOnInit() {
    this.radioValue='';
    this.app_to_display='';
    this.TheCanvasForm.controls['xPos'].setValue(160);
    this.TheCanvasForm.controls['yPos'].setValue(160);
    this.TheCanvasForm.controls['radius'].setValue(100);
    this.TheCanvasForm.controls['sAngle'].setValue(0);
    this.TheCanvasForm.controls['eAngle'].setValue(2);
    this.TheCanvasForm.controls['Clockwise'].setValue(true);
    this.TheCanvasForm.controls['theta'].setValue(0);
    this.TheCanvasForm.controls['theta_pas'].setValue(15);

    this.MoveCanvasForm.controls['xFrom'].setValue(230);
    this.MoveCanvasForm.controls['xTo'].setValue(290);
    this.MoveCanvasForm.controls['yFrom'].setValue(230);
    this.MoveCanvasForm.controls['yTo'].setValue(290);
    this.MoveCanvasForm.controls['radius'].setValue(5);
    this.MoveCanvasForm.controls['xPas'].setValue(10);
    this.MoveCanvasForm.controls['yPas'].setValue(10);
    this.champagne=' 🍾';
  this.sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  this.moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
  this.earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  //this.moon.src = '../assets/MoonNew.png';


  this.var_j=45 * Math.PI / 180;
  this.var_j=this.var_j/10;
 
  }

  ngAfterViewInit() { 
      this.theCanvas=document.getElementById('canvasElem');
            
      if (!this.ctx) { //true
          this.ctx=this.theCanvas.getContext('2d');
      }

    }

  drawCanvas(){

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
    
    }

  GetParam(){
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
      this.app_to_display='';
      if (event!==''){
        this.radioValue=event;
      } else  {this.radioValue= this.TheCanvasForm.controls['ReturnToPage'].value};
      if (this.radioValue==='Circle') {
        this.GetParam();
        this.drawCanvas();
        // at the center of the circle insert character 'A' and also draw a line 
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
      else if (this.radioValue==='DrawAnimation') {
          this.i_loop=0;
          this.draw_animation();
      }
      else if (this.radioValue==='Clear') {
        this.MoveCanvas('Clear');
        this.TheCanvasForm.controls['ReturnToPage'].setValue('');
        this.ngOnInit();
      }
      else if (this.radioValue==='Sun_Earth') {
          this.j_loop=0;
          this.Sun_Earth();
      }  
      else if (this.radioValue==='CircleRotate') {
        this.k_loop=0;
        this.circle_rotation();
    }  
    else if (this.radioValue==='StopAnim') {
      this.stopAnimation();
      
  }  
      else {    this.app_to_display='other'};
    }


    AllAnimationsn(){

      this.k_loop=0;
      this.i_loop=0;
      this.j_loop=0;
      this.draw_animation();
      this.Sun_Earth();
      this.circle_rotation();
    }

    ClearCanvas(){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
        this.ctx.beginPath();
        //this.ctx.clearRect(this.x_coordinate - this.theRadius - 1, this.y_coordinate - this.theRadius - 1, this.theRadius * 2 + 2, this.theRadius * 2 + 2);
        this.ctx.clearRect(0,0,this.theCanvas.width,this.theCanvas.height);
        this.ctx.closePath();
    }


    MoveCanvas(type_action:string){


      this.GetParam();
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
          }
          this.y_From=this.y_From+this.y_Pas;
        }
        this.x_From=this.x_From+this.x_Pas;
      }
    }
    

    draw_animation(){
      this.GetParam();      
      const pas= 2 * Math.PI / this.theta_pas_v;
      const w_size_image=300;
      const h_size_image=300;
      const distEarthMoon=35;
      const radiusMoon=5;

      this.prev_x= this.x_coordinate;
      this.prev_y= this.y_coordinate;
      
      this.ctx.globalCompositeOperation = 'source-over';

      //To be analyzed https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
    
      //this.theta_v+=pas
      //this.new_x = this.x_coordinate + this.theRadius * Math.cos(this.theta_v);
      //this.new_y = this.y_coordinate + this.theRadius * Math.sin(this.theta_v);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
      // delete the max size of the rectangle which is the image 'sun'
      this.ctx.beginPath();
      //this.ctx.clearRect(this.prev_x -(this.x_translate/2) - 1, this.prev_y -(this.y_translate/2) - 1, this.theRadiusBis  + this.x_translate+ 2, this.theRadiusBis  + this.y_translate+2);
      //this.ctx.clearRect(this.x_coordinate - this.theRadius*2 - this.theRadiusBis- 1, this.y_coordinate - this.theRadiusBis- this.theRadius*2 - 1, this.theRadius *4  + this.theRadiusBis*4+ 2, this.theRadius *4   + this.theRadiusBis*4+2);
      this.ctx.clearRect(this.x_coordinate-w_size_image/2,this.y_coordinate-h_size_image/2, w_size_image, h_size_image);  
      this.ctx.stroke();
      //this.ctx.fillStyle = 'lightblue'; // color inside circle
      //this.ctx.fill();
      //this.ctx.fillRect(this.x_coordinate-w_size_image/2,this.y_coordinate-h_size_image/2, w_size_image, h_size_image);  
      //this.ctx.stroke();
      // prev may not be needed
      //this.prev_x=this.new_x;
      //this.prev_y=this.new_y;

      this.i_loop++;   

      //
      // This is equivalent to earth moving around the sun
      //
      this.ctx.beginPath(); // critical
      //this.ctx.setTransform(1, 0, 0, 1, 0, 0); // not needed as there has been no change of the position
      this.ctx.drawImage(this.sun,this.x_coordinate-w_size_image/2,this.y_coordinate-h_size_image/2, w_size_image, h_size_image);               
      this.ctx.arc( this.x_coordinate, this.y_coordinate, this.theRadius, 0, 2 * Math.PI);
      //this.ctx.fillStyle = 'lightblue'; // color inside circle
      //this.ctx.fill();

      this.ctx.strokeStyle= 'lightblue'; // color line cycle
      this.ctx.lineWidth = 3; // weight of the line
      this.ctx.closePath();
      this.ctx.stroke();  // MAY NOT BE NEEDED AS PATH HAS BEEN CLOSED

      const time = new Date();
      this.ctx.translate( this.x_coordinate, this.y_coordinate);
      this.ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
                
      this.ctx.beginPath(); // if omitted then circle crosses the moon 
      this.ctx.translate( this.theRadius-this.theRadiusBis*2-20, this.theRadius-this.theRadiusBis*2-20);
      this.ctx.drawImage(this.earth,-11.5,-11.5);

      // draw a small circle at the center of the earth - FOR THE FUN
      this.ctx.translate( 0,0);
      this.ctx.beginPath();
                
      // this.ctx.arc(this.new_x, this.new_y, 3, 0, 2 * Math.PI); 
      this.ctx.arc(0.2, 0.2, 0, 0, 2 * Math.PI); // if radius is 0 then nothing is drawn
      this.ctx.strokeStyle= 'white'; // color line cycle
      this.ctx.lineWidth = 1; // weight of the line
      this.ctx.fillStyle = "green";
      this.ctx.fill();

      this.ctx.beginPath(); 
      this.ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());

      this.ctx.arc(0, distEarthMoon, radiusMoon, 0, 2 * Math.PI); 
      this.ctx.strokeStyle= 'black'; // color line cycle
      this.ctx.lineWidth = 1; // weight of the line
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.font = '30px FontAwesome'; 
      this.ctx.fillText(this.champagne,0,0);
      this.ctx.stroke();

      this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
          
      this.id_Animation_three=window.requestAnimationFrame(() => this.draw_animation());
        if (this.i_loop>this.max_i_loop){
           window.cancelAnimationFrame(this.id_Animation_three);
            this.ClearCanvas();
      } 
    } // draw_animation()

   draw_with_interval(){

    const i= setInterval(() => {

      //this.angle_moon=this.angle_moon+(0.1/360); // pas = 0.1
      //if (this.angle_moon>360){ 
      //  this.angle_moon=0;
      //}
      // this.ctx.rotate(this.angle_moon * Math.PI / 180);

      if (this.i_loop===1500){
            clearInterval(i);
          }
      //if (this.theta_v >= 2 * Math.PI){
      //            clearInterval(i);
      //          }

      }, 80); // setInterval(()


//======= OTHER SOLUTION
       const j= () => {
          this.id_Animation_two=window.requestAnimationFrame(j) ;
           if (this.j_loop>30000){
                   window.cancelAnimationFrame(this.id_Animation_two);
          } 
         } 
        j();

   }

    Sun_Earth(){

    const x=290;
    const y=640;
    const w_size_image=300;
    const h_size_image=300;
    const distEarthMoon=29;
    const distEarthSun=105;
    const radiusMoon=5;
    const radiusEarth=12;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
      this.j_loop++;   
      this.ctx.globalCompositeOperation = 'destination-over';
      this.ctx.clearRect(x-w_size_image/2, y-h_size_image/2, w_size_image, h_size_image);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
      this.ctx.save();
      this.ctx.translate(x,y);

      // Earth
      const time = new Date();
      
      const angle=((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds();
      this.ctx.rotate(angle);
      this.ctx.translate(distEarthSun, 0);

      //this.ctx.fillRect(0, -radiusEarth, distEarthMoon, 2*radiusEarth); // Shadow)
      this.ctx.drawImage(this.earth, -radiusEarth, -radiusEarth);
        
      // Moon
      //this.ctx.save();
      this.ctx.rotate(angle*10);
      this.ctx.translate(0, distEarthMoon);
      this.ctx.drawImage(this.moon,-radiusMoon, -radiusMoon, 15, 15);
      //this.ctx.restore();
        
      this.ctx.restore();
          
      this.ctx.beginPath();
      this.ctx.arc(x,y, distEarthSun, 0, Math.PI * 2, false); // Earth orbit
      this.ctx.stroke();

      // Sun
      this.ctx.drawImage(this.sun,x-w_size_image/2, y-h_size_image/2, w_size_image,h_size_image);

      this.id_Animation_two=window.requestAnimationFrame(() => this.Sun_Earth());
      if (this.j_loop>this.max_j_loop){
        window.cancelAnimationFrame(this.id_Animation_two);
        this.ClearCanvas();
        } 

  }
    
stopAnimation(){
  this.i_loop=this.max_i_loop+1;
  this.j_loop=this.max_j_loop+1;
  this.k_loop=this.max_k_loop+1;


}

  circle_rotation(){
    const x=90;
    const y=400;
    const radius=18;
    const lenRect=60;
    const wLine=1;
    const time = new Date();
    this.k_loop++

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
   
    this.ctx.translate(x, y); 
    // clear previous picture
    this.ctx.beginPath();
    //this.ctx.clearRect(-50, -50, 100 ,100);
    // clear the drawing area
    this.ctx.clearRect(-(lenRect + radius+wLine), -(lenRect + radius + wLine), (lenRect + radius+ wLine)*2,(lenRect + radius+wLine)*2);
  

// MAY NOT BE NEEDED - TO BE TESTED
//      this.ctx.stroke();


 //     this.ctx.beginPath();
       // this.ctx.rotate(this.angle_moonBis * Math.PI / 180);
      this.ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());

      // draw a small rectangle from the centre
      //this.ctx.beginPath(); 
      this.ctx.fillStyle = "lightblue";
      this.ctx.fillRect(0, 0, 4, lenRect); // Shadow
      //this.ctx.stroke();

      // draw a circle at the top of the small rectangle which length is lenRect
      this.ctx.arc(0, lenRect, radius, 0, 2 * Math.PI); 
      this.ctx.strokeStyle= 'dark'; // color line cycle
      this.ctx.lineWidth = wLine; // weight of the line
      this.ctx.fillStyle = "pink";
      this.ctx.fill();
      this.ctx.stroke();

   
    this.id_Animation=window.requestAnimationFrame(() => this.circle_rotation());
    if (this.k_loop>this.max_k_loop){
      window.cancelAnimationFrame(this.id_Animation);
      this.ClearCanvas();
      } 
  }

save_text(){
  /* THESE ARE JUST COMMENTS
  ==========================
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


