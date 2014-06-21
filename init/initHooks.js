var HOOKS = {};


var colors = [ 0xc0ffee, 0xfecc88 , 0xaa77ff ];

function initHooks(){

  initHeavyBass( 'heavyBass' , 50 );

}

function initHeavyBass( title , numOf ){

  var loop = LOOPS.clean_heavyBeat;
  var note = NOTES.clean1;
  color = new THREE.Color( 0xff0000 );

  var geo = new THREE.IcosahedronGeometry( .5 );
  var mat = new THREE.MeshBasicMaterial({ color:color.getHex() } );
  var mesh = new THREE.Mesh(geo,mat);
  
  HOOKS[ title ] =  [];
  
  for( var i = 0; i < numOf; i++ ){

    var hook = new Hook( dragonFish , title , {

      head:new THREE.Object3D(),
      m1: mesh,
      note:note,
      loop:loop,
      color:color

    });

    HOOKS[ title ].push( hook );

  }


}



/*
 for( var i = 0; i < 40; i++ ){

    var colorHex =  colors[ Math.floor( Math.random() * colors.length )];
    var m = new THREE.MeshBasicMaterial({
      color:colorHex,
      shading: THREE.FlatShading,
      blending:THREE.AdditiveBlending,
      transparent:true,
      map:audioController.texture,

      depthwrite:false
    });


    var headObj = new THREE.Object3D();
    var color = new THREE.Color( colorHex );

    var noteIndex = Math.floor( Math.random() * audioController.notes.length );
    var note = audioController.notes[ noteIndex ];

    var loopIndex = Math.floor( Math.random() * audioController.loops.length );
    var loop = audioController.loops[ loopIndex ];


    var newMat = jellyMat.clone();
    newMat.uniforms.t_audio.value = loop.texture;


    var mesh = new THREE.Mesh(  
      new THREE.CylinderGeometry( 1.3 , 1.3 , 2.3, 50, 50,5 ),
      newMat 
    );
    mesh.scale.multiplyScalar( .08 );

    var c = new THREE.Color( colorHex );
    var cVec = new THREE.Vector3( c.r , c.g , c.b );


    var u = {
      uPos: { type:"v3" , value : dragonFish.leader.position },
      uVel: { type:"v3" , value : dragonFish.leader.velocity },
      color: { type:"v3" , value : cVec },
      t_audio:{ type:"t" , value: loop.texture },
      audioLookup:{ type:"f", value: .2},
      time:time
    }

    var jMat = new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader:shaders.vertexShaders.sphere,
      fragmentShader:shaders.fragmentShaders.sphere,
      side:THREE.DoubleSide,
     // blending:THREE.AdditiveBlending,
     // transparent:true,
     // depthWrite:false,
    });

    var mesh = new THREE.Mesh( 
      new THREE.CylinderGeometry( 1, 1 , 1, 50 ,5,5 ),
      jMat
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = 1.3;

    var newObj = new THREE.Object3D();
    newObj.add( mesh );
    //mesh.updateMatrix();
    
    hook = new Hook( dragonFish , {
      head:headObj,
      m1: newObj,
      color:color,
      loop:loop,
      note:note,
    });

  }





*/
