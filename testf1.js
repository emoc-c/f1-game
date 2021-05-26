class collisable{
  constructor(posx,posy){
    this.x=posx;
    this.y=posy;
  }
  distance(other){
    //return dist(this.x,this.y,other.x,other.y);
    return [abs(this.x-other.x),abs(this.y-other.y)];
  }
}
class players extends collisable{
  constructor(posx,posy,posreal,posimg){
    super(posx,posy);
    this.real=posreal;
    this.img=posimg;
    this.lx=0;
    this.ly=0;
  }
  move(){
    this.lx=this.x;
    this.ly=this.y;
    if(this.real){
      this.x=mouseX;
      this.y=mouseY;
    }else{
        this.y=this.y;
    }
 }
  Draw(){
    push();
    stroke(color(10,10,10,70));
    strokeWeight(20);
    line(this.x-this.img.width*0.3,this.y-this.img.height*0.05,this.lx-100,this.ly-this.img.height*0.05);
    line(this.x-this.img.width*0.3,this.y+this.img.height*0.05,this.lx-100,this.ly+this.img.height*0.05);
    translate(this.x,this.y);
    scale(0.3);
    image(this.img,0,0);
    pop();
  }
}
class BG{
  constructor(img,y){
    this.img=img;
    this.x1=width/2;
    this.y=y;
    this.x2=width/2+this.img.width;
    this.speed=width/500;
  }
  move(){
    if(this.x1>-this.img.width/2){
      this.x1-=this.speed;
      this.x2-=this.speed;
    }
    else{
      this.x1=this.x2;
      this.x2=this.x1+this.img.width;
    }
  
  }
  Draw(){
    //background(128);
    image(this.img,this.x1,this.y);
    image(this.img,this.x2,this.y);
  }
}
class blocks extends collisable{
  constructor(posspeed,possize,pospos){
    super(width,pospos);
    //id:0=normal
    //   1=assassin
    //   2=bait
    this.id=0;
    //this.x=width;
    //this.y=pospos;
    this.speed=posspeed;
    this.size=possize;
    //this.thecolor=color(random(0,255),random(0,255),random(0,255));
    this.thecolor=color(255,0,0);
  }
  move(){
    this.x-=this.speed;
    //assassin
    if(this.id==1){
     let ag=atan2(mouseY-this.y,mouseX-this.x);
     this.y+=this.speed*sin(ag);
     //bait
    }else if(this.id==2){
     let ag=atan2((mouseY+this.size+img.width*0.17)-this.y,mouseX-this.x);
     this.y+=this.speed*sin(ag);
      
    }
    //high speed
    //else if(score>50) this.y+= 20*(noise(this.x/100)-0.5);
    fill(this.thecolor);
    circle(this.x,this.y,this.size);
    fill(255);
  }
}


let dead=false;
let frame=0;
let cnv;
let img,fond,groundim;
let score=0;
let obstacle=[];
let high =0;
let sky,ground;
let player=[];
function preload(){
  groundim=loadImage('img/game/ground.png');
  
  fond=loadImage('img/game/fond.png');
  img=loadImage('img/game/f1.png');
  high= getItem('highscore');
}
function setup(){
  cnv= createCanvas(windowWidth,windowHeight);
  //cnv.parent('game');
  imageMode(CENTER);
  textAlign(CENTER,CENTER);
  textSize(50);
  noStroke();
  fond.resize(width,height);
  groundim.resize(width,height/6);
  sky=new BG(fond,height/2);
  player[0]= new players(width/2,height/2,true,img);
  //player[1]= new players(width/4,height/4,false,img);
}

let button;
function draw(){
 
  background(0);
  backg();
  if(!dead){ 
    play();
  }else{
    text("score :"+score,width/2,height/10);
    text("highscore :"+high,width/2,2*height/10);
    button.mousePressed(newgame);
    
  }
 
}
//draw bg
function backg(){
  sky.move();
  sky.Draw();
}
//restart screen
function restart(){
    text("score :"+score,width/2,height/10);
    text("highscore :"+high,width/2,2*height/10);
    button.mousePressed(newgame);
}

//push other blocks
function pushother(){
  for(let i=0;i<obstacle.length;i++){
    for(let j=0;j<obstacle.length;j++){
      if(i!=j && dist(obstacle[i].x,obstacle[i].y,obstacle[j].x,obstacle[j].y)<obstacle[i].size/2 + obstacle[j].size/2 && obstacle[i].x<obstacle[j].x){
        obstacle[i].speed=obstacle[j].speed;
      }
    }
  }
}

function endgame(){
  dead=true;
  addbutton();
  frame=0;
  offset=0;
  if(score>high){
    high=score;
    storeItem('highscore',high);
  }

}
//detect collisions
function detect(){
  detectCar();
  for(let i=0;i<obstacle.length;i++){
    for(let j=0;j<player.length;j++){
      let Dist=obstacle[i].distance(player[j]);
      
      if (Dist[0]<((player[j].img.width*0.3)/2) && Dist[1]<((player[j].img.height*0.3)/2)){
        endgame();
      }
    }
  }
}
function detectCar(){
  for(let carsel=0;carsel<player.length;carsel++){
    for(let carcol=carsel+1;carcol<player.length;carcol++){
      let Dist=player[carsel].distance(player[carcol]);
      if (Dist[0]<((player[carcol].img.width*0.25)) && Dist[1]<((player[carcol].img.height*0.25))){
        endgame();
      }
    }
  }
  
}

//detect if its out of the screen
function out(){
  for(let i=0;i<obstacle.length;i++){
    if (obstacle[i].x<0){
      obstacle.splice(i,1);
    }
  }

}

let roadsize=300;
let offset=0;

function play(){
  
  frame+=1;
 //add blocks
  if(frame%30==0){
    offset+=70*cos(frame*0.01);
    obstacle[obstacle.length]= new blocks(5,70,height/2+offset-(roadsize/2+35));
    obstacle[obstacle.length]= new blocks(5,70,height/2+offset+(roadsize/2+35));
    //add an assassin block
    /*
    if(random(0,100)<=(score*60)/100){
      if(random(0,1)>0.5) obstacle[obstacle.length-1].id=1
      else obstacle[obstacle.length-1].id=2;
    }*/
    score++;
  }
  pushother();
  //move blocks
  for(let i=0;i<obstacle.length;i++){
    obstacle[i].move();
  }
  //circle(mouseX,mouseY,img.width*0.17);
  //draw the player
  drawplayers();
  
  //score
  text("score :"+score,width/2,height/10);
  
  //tests
  detect();
  out();
}
function drawplayers(){
  for(let i=0;i<player.length;i++){
    player[i].move();
    player[i].Draw();
  }
}
function addbutton(){
   button = createButton('Try again');
   button.size(200,200);
   button.style('background-color',color(88,224,68));
   button.style('font-size','50px');
   button.position(width/2-button.width/2,height/2-button.height/2);
}
function newgame(){
  dead=false;
  score=0;
  obstacle=[];
  button.remove();
}
