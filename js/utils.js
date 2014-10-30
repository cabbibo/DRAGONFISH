 function changeColor( color , uncertainty ){


  // console.log('WE CAN BEGIN AGAIN');
  // console.log( uncertainty );
    recreateLights( color.getHex(), uncertainty );
    

    baseColor = color;

    var vecColor = new THREE.Vector3( 
      color.r,
      color.g,
      color.b
    );


    //jellyMat.uniforms.color.value = vecColor;
    explosion.particles.material.uniforms.color.value = vecColor;


  }


  function recreateLights( color , uncertainty ){

    var u = uncertainty || .4;
    for( var i = 0; i< lights.length; i++ ){

      scene.remove( lights[i] );

    }

    lights = [];

    lights[0] = createLightCluster( color , new THREE.Vector3( 0 , 0 , 1 )  , u);
    lights[1] = createLightCluster( color , new THREE.Vector3( 0 , 1 , 0 ) ,u);
    lights[2] = createLightCluster( color , new THREE.Vector3( 1 , 0 , 0 ) ,u);
    lights[3] = createLightCluster( color , new THREE.Vector3( 0 , 0 , -1 ) ,u);
    lights[4] = createLightCluster( color , new THREE.Vector3( 0 , -1 , 0 ) ,u);
    lights[5] = createLightCluster( color , new THREE.Vector3( -1 , 0 , 0 ) ,u);
   

    var l = lights;
   
   // console.log( l[0] );
    lightDirections.value[0].copy( l[0].position );
    lightDirections.value[1].copy( l[1].position );
    lightDirections.value[2].copy( l[2].position );
    lightDirections.value[3].copy( l[3].position );
    lightDirections.value[4].copy( l[4].position );
    lightDirections.value[5].copy( l[5].position );

    lightColors.value[0].set( l[0].color.r , l[0].color.g , l[0].color.b );
    lightColors.value[1].set( l[1].color.r , l[1].color.g , l[1].color.b );
    lightColors.value[2].set( l[2].color.r , l[2].color.g , l[2].color.b );
    lightColors.value[3].set( l[3].color.r , l[3].color.g , l[3].color.b );
    lightColors.value[4].set( l[4].color.r , l[4].color.g , l[4].color.b );
    lightColors.value[5].set( l[5].color.r , l[5].color.g , l[5].color.b );



  }


  function createLightCluster(  baseColor , baseDir , uncertainty ){


    var mainColor = new THREE.Color( baseColor );
    var mainDir = baseDir.clone();

    var c = mainColor.clone();
    c.r = c.r + ( (Math.random()) )*uncertainty;
    c.g = c.g + ( (Math.random())) *uncertainty;
    c.b = c.b + ( (Math.random()) )*uncertainty;

    var d = mainDir.clone();
    d.x = d.x + ( (Math.random()-.5) * .5 );
    d.y = d.y + ( (Math.random()-.5) * .5 );
    d.z = d.z + ( (Math.random()-.5) * .5 );

    d.normalize();
    //c.normalize();

   // c.r = d.x;
    var light = new THREE.DirectionalLight(c.getHex() , .5 );
    
    light.position.copy( d );
    lights.push( light );
    scene.add( light );

    return light;


  }


  function randomColorVector( hexCode , size ){

    var size = size || .5;

    var c = new THREE.Color( hexCode );

    var newC = new THREE.Vector3();

    newC.x = c.r + (Math.random() - (size/2) ) * size;
    newC.y = c.g + (Math.random() - (size/2) ) * size;
    newC.z = c.b + (Math.random() - (size/2) ) * size;

    return newC;

  }

  function resetColorUniform( uniform , color , size ){

    uniform.value = randomColorVector( color , size );

  }

  function assignUVs( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

  }




/*

   PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION  PLACE FUNCTION 


*/

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
