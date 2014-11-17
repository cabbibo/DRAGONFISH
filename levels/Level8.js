

var LEVEL_8_PARAMS = {};


LEVEL_8_PARAMS.position = new THREE.Vector3( 0 , -2000 , 0 );

LEVEL_8_PARAMS.note = 'lvl/8';
LEVEL_8_PARAMS.ambient = 'lvl4/ambient1';
  

LEVEL_8_PARAMS.death = {

  note:'death',
  startScore: 1,
  loop:'lvl3/death',
  geo:'skull1',
  mat:'audioBright',
  color:0xee6622,
  scale: .02,
  speed: 6,
  dist: 200,
  
  position: new THREE.Vector3( 0 , -6 , 0 ),
  plumeGeos:[
    'fractal',
    'fractal',
    'fractal',
    'fractal'
  ],
  plumeMats:[
    'audioBright',
    'audioBright',
    'audioBright',
    'audioBright'
  ],
  plumeScales:[
    5,
    4,
    2,
    3
  ]

}


LEVEL_8_PARAMS.geo = 'totem';




LEVEL_8_PARAMS.skybox = {

  geo:'totem',
  note: 'srBeast1',
  map: 'audioController',
  mat: 'lambert',
  scale: .00001,
   
  init: function(geo){

    var skybox = new THREE.Mesh( GEOS.cube , MATS.lambert );
    skybox.scale.multiplyScalar( this.scale );
    skybox.note = this.note
    return skybox;
    


  },

  
  onHook: function( hook ){

   
    var c = hook.color.getHex();
    this.material.color = hook.color;
    /*resetColorUniform( this.material.uniforms.color1 , c , .4 );
    resetColorUniform( this.material.uniforms.color2 , c , .4 );
    resetColorUniform( this.material.uniforms.color3 , c , .4 );
    resetColorUniform( this.material.uniforms.color4 , c , .4 );*/


  }

}

LEVEL_8_PARAMS.crystal = {

  geo: 'fractal',
  mat: 'audioBright',
  scale:1,
  position: new THREE.Vector3( 0 , 0 , 0 )
}

LEVEL_8_PARAMS.stones = {


  geo:'logoGeo',

  init:function( geo  ){

      

      var m = MATS.audioBright.clone();
      m.uniforms.t_audio.value = audioController.texture;
      
      

        var g = STONES.level8;

      var stones = new THREE.Mesh( g , m );

     return stones 


  },
  

  onHook : function ( hook ){

    var c = hook.color.getHex();
    this.material.color = hook.color;
    //resetColorUniform( this.material.uniforms.color1 , c , 1.4 );
    //resetColorUniform( this.material.uniforms.color2 , c , 1.4 );
    //resetColorUniform( this.material.uniforms.color3 , c , 1.4 );
    //resetColorUniform( this.material.uniforms.color4 , c , 1.4 );

  }




}
/*

   Path

*/
LEVEL_8_PARAMS.path = {

  notes:['srNight1','srNight2','srNight3','srNight4'],
  pathDetail: 0,

  markerMat: new THREE.MeshNormalMaterial(),
  markerGeo: 'totem',
  markerScale: .1,
  initMarkers: function( geo ){


  },

  createGeometry: function( oldPos , newPos ){
    
    var geometry = new THREE.Geometry();

    var dif = newPos.clone().sub( oldPos );

    var chunk = dif.multiplyScalar( 1/this.pathDetail );

    geometry.vertices.push( oldPos );
    for( var i = 0; i < this.pathDetail; i++ ){

      var chunkPos = geometry.vertices[i].clone().add( chunk );

      geometry.vertices.push( chunkPos );
      
    }

    return geometry;

  },

  createGuides: function(){

    var guides = [];

    var geo = new THREE.BoxGeometry( .5 , .5 , 3.5 );
   
   // mat.side = THREE.DoubleSide;
     var m = MATS.audioBright.clone();
      m.uniforms.t_audio.value = audioController.texture;
      m.uniforms.displacement.value = 0//.21; 



   
    var cone = new THREE.CylinderGeometry( 1 , 0 , 3);
    var coneMesh = new THREE.Mesh( cone , m);
    coneMesh.rotation.set(  -Math.PI / 2 , 0 ,0);
    coneMesh.position.z = 2;
    coneMesh.updateMatrix();


    geo.merge(  cone , coneMesh.matrix );



    for( var  i = 0; i < 300; i++ ){

      var guide = new THREE.Mesh( geo , m );
      guide.lifeTime = 0;
      guide.lifeSpeed = Math.random() * .5 + .5;
      guide.velocity = new THREE.Vector3();
      guides.push( guide );
    
    }


    return guides;

  },

  update: function(){


    var oClosestMarker = this.closestMarker || this.markers[0];
    this.closestMarker = this.markers[0];


    var closestDistance = 10000000000;
    for( var i = 0; i < this.markers.length; i++ ){


      var dif = this.markers[i].position.clone().sub( this.dragonFish.leader.position );

      var l = dif.length();

      if( l < closestDistance ){

        this.closestMarker = this.markers[i];
        closestDistance = l;

      }

    }

    if( this.closestMarker != oClosestMarker ){

      console.log( 'NEW MARKER HIT' );

      var rand = Math.floor( this.notes.length * Math.random() )
      this.notes[rand].play();

    }
    //console.log( 'HELLO' );

    //console.log( this.guides );
    var guides = this.guides;

    for( var i = 0; i < guides.length; i++ ){

      var guide = guides[i];

      var dif = guide.position.clone().sub( this.scene.position );
      guide.velocity.sub( dif.normalize().multiplyScalar( .01) );

      var dif = guide.position.clone().sub( this.dragonFish.leader.position );
      dif.normalize();

      var dif2 = this.scene.position.clone().sub( this.dragonFish.leader.position );

      var para = dif.clone().projectOnVector( dif2 );
      dif.sub( para );

      guide.velocity.add( dif.normalize().multiplyScalar( -.004 ) ); 
      
      guide.position.add( guide.velocity );
      guide.velocity.multiplyScalar( .97 );

      guide.lookAt( guide.position.clone().add( guide.velocity ) );

      if( guide.growing ){
        guide.lifeTime += .02 * guide.lifeSpeed;
      }else{
        guide.lifeTime -= .008 * guide.lifeSpeed;
      }

      if( guide.lifeTime <= 0 ){

        guide.position.copy( this.dragonFish.leader.position );

        guide.velocity = new THREE.Vector3();
        guide.velocity.x = (Math.random() - .5 ) * .2;
        guide.velocity.y = (Math.random() - .5 ) * .2;
        guide.velocity.z = (Math.random() - .5 ) * .2;


        var rand = new THREE.Vector3();

        rand.x = (Math.random() - .5 ) * 200;
        rand.y = (Math.random() - .5 ) * 200;
        rand.z = (Math.random() - .5 ) * 200;

        guide.position.add( rand );

        guide.growing = true;


      }else if( guide.lifeTime >= 1 ){

        guide.growing = false;
        guide.lifeTime = 1;
       // guide.note.play();

      }


      guide.scale.x = guide.lifeTime;
      guide.scale.y = guide.lifeTime;
      guide.scale.z = guide.lifeTime;

    }


  },

  addPath: function( levelPath ){


    //for( var i = 0; i < levelPath.markers



  }
    




}
LEVEL_8_PARAMS.newTypes = [

  {
    type: 'lvl4_part2_highSynth',
    note: 'lvl/8',
    loop: 'lvl4/part2/highSynth',
    geo:  'fractal',
    numOf: 3,
    boss: false,
    startScore: 0,
    mat:'audioBright',
color: new THREE.Color( 0xffffff ),
   instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.uniforms.t_audio.value = audioController.texture;
      m.uniforms.displacement.value = 1; 
      var head = new THREE.Mesh(
          geo,
          m
      );
      head.scale.multiplyScalar( 1.1 );

      var m1 = head.clone();
      m1.scale.multiplyScalar( .7 );

      var m2 = head.clone();
      m2.scale.multiplyScalar( .6 );

      var m3 = head.clone();
      m3.scale.multiplyScalar( .6 );

      var m4 = head.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1:m1,
          m2:m2,
          m3:m3,
          m4:m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false,//true,
          maxSpeed: .5
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },




  {
    type: 'lvl4_part2_hats',
    note: 'lvl/8',
    loop: 'lvl4/part2/hats',
    geo:  'fractal',
    numOf: 3,
    boss: false,
    startScore: 3,
    mat:'audioBright',
  color: new THREE.Color( 0xffffff ),
   instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.uniforms.t_audio.value = audioController.texture;
      m.uniforms.displacement.value = .3; 
    
      var head = new THREE.Mesh(
          geo,
          m
      );
      head.scale.multiplyScalar( 1.1 );

      var m1 = head.clone();
      m1.scale.multiplyScalar( .7 );

      var m2 = head.clone();
      m2.scale.multiplyScalar( .6 );

      var m3 = head.clone();
      m3.scale.multiplyScalar( .6 );

      var m4 = head.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1:m1,
          m2:m2,
          m3:m3,
          m4:m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false,//true,
          maxSpeed: .5
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  
  },

 
  {
    type: 'lvl4_part2_vox',
    note: 'lvl/8',
    loop: 'lvl4/part2/vox',
    geo:  'fractal',
    numOf: 3,
    boss: false,
    mat:'audioBright',
    startScore: 6,
     color: new THREE.Color( 0xffffff ),

    instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.uniforms.t_audio.value = audioController.texture;
      m.uniforms.displacement.value = .5; 
    
      var head = new THREE.Mesh(
          geo,
          m
      );
      head.scale.multiplyScalar( 1.1 );

      var m1 = head.clone();
      m1.scale.multiplyScalar( .7 );

      var m2 = head.clone();
      m2.scale.multiplyScalar( .6 );

      var m3 = head.clone();
      m3.scale.multiplyScalar( .6 );

      var m4 = head.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1:m1,
          m2:m2,
          m3:m3,
          m4:m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false,//true,
          maxSpeed: .5
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  
  
  },


  {
    type: 'lvl4_part2_lowSynth',
    note: 'lvl/8',
    loop: 'lvl4/part2/lowSynth',
    geo:  'fractal',
    numOf: 3,
    mat:'audioBright',
    boss: false,
    startScore: 9,
     color: new THREE.Color( 0xffffff ),
   instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.uniforms.t_audio.value = audioController.texture;
      m.uniforms.displacement.value = .1; 
    
      var head = new THREE.Mesh(
          geo,
          m
      );
      head.scale.multiplyScalar( 1.1 );

      var m1 = head.clone();
      m1.scale.multiplyScalar( .7 );

      var m2 = head.clone();
      m2.scale.multiplyScalar( .6 );

      var m3 = head.clone();
      m3.scale.multiplyScalar( .6 );

      var m4 = head.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1:m1,
          m2:m2,
          m3:m3,
          m4:m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false,//true,
          maxSpeed: .5
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },

   {
    type: 'lvl4_part2_drums',
    note: 'lvl/9',
    loop: 'lvl4/part2/drums',
    geo:  'fractal',
    numOf: 1,
    boss: true,
    mat:'audioBright',
    startScore: 12,
    color: new THREE.Color( 0xffffff ),
    instantiate: function( level , dragonFish , note , loop , geo, mat ){

       var m = mat;
      m.uniforms.t_audio.value = audioController.texture;
      m.uniforms.displacement.value = .3; 
    
      var head = new THREE.Mesh(
          geo,
          m
      );
      head.scale.multiplyScalar( 1.1 );

      var m1 = head.clone();
      m1.scale.multiplyScalar( .7 );

      var m2 = head.clone();
      m2.scale.multiplyScalar( .6 );

      var m3 = head.clone();
      m3.scale.multiplyScalar( .6 );

      var m4 = head.clone();
      m4.scale.multiplyScalar( .6 );
      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish , level , this.type , {
          
          head:head.clone(),
          m1: m1,
          m2: m2,
          m3: m3,
          m4: m4,
          note:note,
          loop:loop,
          startScore: this.startScore,            
          color: this.color,
          power: 1/ this.numOf,
          boss: true,
          maxSpeed: 100
            

        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );

      }
  
      return hooks;
    }
  },


]


