

var LEVEL_5_PARAMS = {};


LEVEL_5_PARAMS.position = new THREE.Vector3( 0 , 0 , 0 );

LEVEL_5_PARAMS.note = 'lvl/5',
LEVEL_5_PARAMS.ambient = 'lvl3/ambient';
  
LEVEL_5_PARAMS.lightUncertainty = .2;

LEVEL_5_PARAMS.death = {

  note:'death',
  loop:'lvl3/death',
  startScore:1,      
  geo:'skull1',
  mat:'audioDisplace',
  color:0xee6622,
  scale: .02,
  speed: 1.4,
  
  position: new THREE.Vector3( 0 , -6 , 0 ),
  plumeGeos:[
    'feather2',
    'feather2',
    'feather2',
    'feather2'
  ],
  plumeMats:[
    'audioDisplace',
    'audioDisplace',
    'audioDisplace',
    'audioDisplace'
  ],
  plumeScales:[
    1,
    .5,
    1.1,
    1.1
  ]


}


LEVEL_5_PARAMS.geo = 'totem';


LEVEL_5_PARAMS.skybox = {

  geo:'totem',
  note: 'srBeast1',
  map: 'audioController',
  mat: 'audioDisplace',
  scale: 100,
  init: function(geo ){

    //this.mat.map = audioController.texture;

    geo.computeFaceNormals();
    geo.computeVertexNormals();
    
  //  assignUVs( geo );

   var mat = MATS[ this.mat ].clone();
    mat.side = THREE.DoubleSide;
   
  //  console.log( MATS[this.mat] );
    //mat.uniforms.t_normal.value = MATS.textures.normals.moss;
   //
    mat.uniforms.t_audio.value = audioController.texture;
    mat.uniforms.displacement.value = .1;
   // mat.uniforms.texScale.value = .1;
   // mat.uniforms.normalScale.value= .1;*/
    mat.needsUpdate = true;
    
    var skybox = new THREE.Mesh( geo , mat );

    skybox.note = this.note;
    skybox.scale.multiplyScalar( this.scale );

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

LEVEL_5_PARAMS.crystal = {

  geo: new THREE.CylinderGeometry( 2,0,5 ),
  mat: 'audioDisplace',
  map: 'audioController',  
  scale:.3,
  rotation: new THREE.Euler( -Math.PI / 2 , 0 , 0 )

}

LEVEL_5_PARAMS.stones = {


  geo:'logoGeo',

  init:function( geo  ){

    
    //v      //assignUVs( geometry )
    //
    var mat = MATS.audioDisplace.clone();
    mat.uniforms.t_audio.value = audioController.texture;
    mat.uniforms.displacement.value = .0001;

    var stones = new THREE.Mesh( STONES.level5 , mat );

    return stones 

  },
  

  onHook : function ( hook ){

    var c = hook.color.getHex();
  //  this.material.uniforms.color.value = hook.color;
    //resetColorUniform( this.material.uniforms.color1 , c , 1.4 );
    //resetColorUniform( this.material.uniforms.color2 , c , 1.4 );
    //resetColorUniform( this.material.uniforms.color3 , c , 1.4 );
    //resetColorUniform( this.material.uniforms.color4 , c , 1.4 );

  }




}
/*

   Path

*/
LEVEL_5_PARAMS.path = {

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
   
        
    var mat = MATS['audioLambert'].clone();
    mat.uniforms.t_audio.value = audioController.texture;// new THREE.MeshPhongMaterial();





   
    var cone = new THREE.CylinderGeometry( 1 , 0 , 3);
    var coneMesh = new THREE.Mesh( cone , mat );
    coneMesh.rotation.set(  -Math.PI / 2 , 0 ,0);
    coneMesh.position.z = 2;
    coneMesh.updateMatrix();


    geo.merge(  cone , coneMesh.matrix );



    for( var  i = 0; i < 300; i++ ){

      var guide = new THREE.Mesh( geo , mat );
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
LEVEL_5_PARAMS.newTypes = [

  {
    type: 'lvl3_part1_drums',
    note: 'lvl/5',
    loop: 'lvl3/part1/drums',
    geo:  'bone',
    numOf: 3,
    boss: false,
    startScore: 0,
    mat:'audioDisplace',
    color: new THREE.Color(0x770000),
    instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
      m.color = this.color;

      m.uniforms.t_audio.value = loop.texture;
  
      var head = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          m
      );

      var m1 = new THREE.Object3D();
      
      var bone = new THREE.Mesh( geo , mat );

      bone.rotation.y = Math.PI / 2;
      m1.add( bone );

      //m1.rotation.x = Math.PI
      m1.scale.x = .01;
      m1.scale.y = .01;
      m1.scale.z = .01;

      m1.rotation.y = Math.PI / 2; 

      m2 = m1.clone();
      m2.scale.multiplyScalar( .6);

      m3 = m2.clone();
      m3.scale.multiplyScalar( .6 );

      m4 = m3.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1: m1,
          m2: m2,
          m3: m3,
          m4: m4,
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
    type: 'lvl3_part1_vox1',
    note: 'lvl/5',
    loop: 'lvl3/part1/vox1',
    geo:  'bone',
    numOf: 3,
    boss: false,
    startScore: 3,
    mat:'audioDisplace',
    color: new THREE.Color( 0x550000),
    instantiate: function( level , dragonFish , note , loop , geo, mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
      m.color = this.color;

      m.uniforms.t_audio.value = loop.texture;
  
      var head = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          m
      );

      var m1 = new THREE.Object3D();
      
      var bone = new THREE.Mesh( geo , mat );

      bone.rotation.y = Math.PI / 2;
      m1.add( bone );
      
      m1.scale.x = .01;
      m1.scale.y = .01;
      m1.scale.z = .01;

      m2 = m1.clone();
      m2.scale.multiplyScalar( .6);

      m3 = m2.clone();
      m3.scale.multiplyScalar( .6 );

      m4 = m3.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1: m1,
          m2: m2,
          m3: m3,
          m4: m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false 
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },

 
  {
    type: 'lvl3_part1_vox2',
    note: 'lvl/5',
    loop: 'lvl3/part1/vox2',
    geo:  'bone',
    numOf: 3,
    boss: false,
    mat:'audioDisplace',
    startScore: 4,
    color: new THREE.Color( 0x880000),
   instantiate: function( level , dragonFish , note , loop , geo, mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
      m.color = this.color;

      m.uniforms.t_audio.value = loop.texture;
  
      var head = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          m
      );

      var m1 = new THREE.Object3D();
      
      var bone = new THREE.Mesh( geo , mat );

      bone.rotation.y = Math.PI / 2;
      m1.add( bone );
      
      m1.scale.x = .01;
      m1.scale.y = .01;
      m1.scale.z = .01;

      m2 = m1.clone();
      m2.scale.multiplyScalar( .6);

      m3 = m2.clone();
      m3.scale.multiplyScalar( .6 );

      m4 = m3.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1: m1,
          m2: m2,
          m3: m3,
          m4: m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false 
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },


  {
    type: 'lvl3_part1_vox3',
    note: 'lvl/5',
    loop: 'lvl3/part1/vox3',
    geo:  'bone',
    numOf: 3,
    mat:'audioDisplace',
    boss: false,
    startScore: 6,
    color: new THREE.Color( 0x660000),
    instantiate: function( level , dragonFish , note , loop , geo, mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
      m.color = this.color;

      m.uniforms.t_audio.value = loop.texture;
  
      var head = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          m
      );

      var m1 = new THREE.Object3D();
      
      var bone = new THREE.Mesh( geo , mat );

      bone.rotation.y = Math.PI / 2;
      m1.add( bone );
      
      m1.scale.x = .01;
      m1.scale.y = .01;
      m1.scale.z = .01;

      m2 = m1.clone();
      m2.scale.multiplyScalar( .6);

      m3 = m2.clone();
      m3.scale.multiplyScalar( .6 );

      m4 = m3.clone();
      m4.scale.multiplyScalar( .6 );

      var hooks = [];

      for( var i = 0; i < this.numOf; i++ ){

        var hook = new Hook( dragonFish, level , this.type , {
          head:head.clone(),
          m1: m1,
          m2: m2,
          m3: m3,
          m4: m4,
          note:note,
          startScore: this.startScore,
          loop:loop,
          color: this.color,
          power: 1/ this.numOf,
          boss: false 
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },

   {
    type: 'lvl3_part1_bass',
    note: 'lvl/6',
    loop: 'lvl3/part1/bass',
    geo:  'logoGeo',
    numOf: 1,
    boss: true,
    mat:'shineDisplace',
    startScore: 12,
    color: new THREE.Color( 0x550000 ),
    instantiate: function( level , dragonFish , note , loop , geo, mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
    
      m.uniforms.t_normal.value = MATS.textures.normals.moss;
      m.uniforms.t_audio.value = loop.texture;
      m.uniforms.normalScale.value = 1.;
      m.uniforms.texScale.value = .3;
      m.uniforms.displacement.value = 1.1;

      var head = new THREE.Mesh(
          geo,
          m
      );

      head.scale.multiplyScalar( .1 );

      var m1 = new THREE.Mesh( geo , m );

      m1.scale.multiplyScalar( .1 );

      m2 = m1.clone();
      m2.scale.multiplyScalar( .6);

      m3 = m2.clone();
      m3.scale.multiplyScalar( .6 );

      m4 = m3.clone();
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


