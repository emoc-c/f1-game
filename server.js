let log;
let ip='192.168.4.64:5000';
function login(){
  httpGet('http://'+ip+'/','json',function(response){console.log(response);
                                                             log=response;  
                                                          });
}

function setup() {
  createCanvas(1000,1000);
  background(0);
 
}

let playersJSON;
function askServ() {
  if(playersJSON==null){
  let x=mouseX;
  let y=mouseY;
  console.log(log);
  playersJSON=loadJSON('http://'+ip+'/?log='+log+'&x='+x+'&y='+y);
  }
  else if(playersJSON!=null && playersJSON['0']!=null){
    for(let num=0;playersJSON[num+'']!=null;num++){
      //console.log(players[num+'']);
      let found=false;
      for(var cars of player){
        if(cars.id==playersJSON[num+''].id){
          cars.x=playersJSON[num+''].x;
          cars.y=playersJSON[num+''].y;
          found=true;
          break;
        }
      }
      if(!found){
        if(playersJSON[num+''].id!=log){
        player[player.length]=new players(playersJSON[num+''].x,playersJSON[num+''].y,false,img,playersJSON[num+''].id);
        }
        else{
          player[player.length]=new players(playersJSON[num+''].x,playersJSON[num+''].y,true,img,log);
        }
      }
      
    }
    playersJSON=null;
  }


}
