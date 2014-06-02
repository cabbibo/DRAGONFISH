var maxLength=3;
var maxWidth=.3;
var bLength
var bWidth
var bMax=30;
var bCount=0;

var directions=[[[1,0,0],[-1,0,0]],[[0,1,0],[0,-1,0]],[[0,0,1],[0,0,-1]]]

var rDir;
var rPos;
var placingMatrix = [];

//putting something in the zero place, so that our hovercube doesn't always jump to the center
placingMatrix.push([[0,0,0],[0,0,0],[0,0,0]]);


function place(matrix , oX,oY,oZ,oDir){
	bCount++
	bLength=maxLength/((bCount/3)+1);
	bWidth=maxWidth/((bCount/3)+1);
	
	getDir(oDir);
	getPos();
	
	var dirArray=directions[rDir]
	
	var x= oX + (((bLength+bWidth) * 20)*dirArray[rPos][0])
	var y= oY + (((bLength+bWidth)* 20)*dirArray[rPos][1])
	var z= oZ + (((bLength+bWidth)* 20)*dirArray[rPos][2])
	
	var sX=((bLength-bWidth)*dirArray[0][0])+bWidth;
	var sY=((bLength-bWidth)*dirArray[0][1])+bWidth;
	var sZ=((bLength-bWidth)*dirArray[0][2])+bWidth;

   // var sX = bWidth*300; 
   // var sY = bWidth*300; 
   // var sZ = bWidth*300; 

    var rX = Math.random() * Math.PI * 2;
    var rY = Math.random() * Math.PI * 2;
    var rZ = Math.random() * Math.PI * 2;

    //var sX = 1;
    //var sY = 1;
    //var sZ = 1;
    //
	matrix.push([[x,y,z],[sX,sY,sZ],[rX,rY,rZ]])

	if(bCount<=bMax){
		place(matrix,x,y,z,rDir)	
	}else{
		bCount=0;	
		bLength=300;
		bWidth=100;
	}
	
}



function getDir(notThis){
	rDir=Math.floor(Math.random()*3);
	if(rDir==notThis){
		getDir(notThis);
	}
}

function getPos(){
	rPos=Math.floor(Math.random()*2);
}
