

var CREDITS_PARAMS = {};

CREDITS_PARAMS.credits = true;
CREDITS_PARAMS.position = new THREE.Vector3( 1000 , -1000 , 0 );

CREDITS_PARAMS.note = 'clean6',

CREDITS_PARAMS.death = {

  note:'b7',
  loop:'lvl1/ambient',
  geo:'skull1',
  mat:'planet',
  color:0xee6622,
  scale: .01,
  position: new THREE.Vector3( 0 , -3 , 0 )

}


CREDITS_PARAMS.geo = 'totem';




CREDITS_PARAMS.skybox = {

  geo:'totem',
  note: 'srBeast1',
  map: 'audioController',
  mat: 'lambert',
  scale: .000001,
  init: function(geo){
    
    var skybox = new THREE.Mesh( GEOS.logoGeo , mat );

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

CREDITS_PARAMS.crystal = {

  geo: new THREE.CylinderGeometry( 2,0,5 ,20 , 20 ),
  mat: 'edge',
  map: 'audioController',  
  scale:.3,
  rotation: new THREE.Euler( -Math.PI / 2 , 0 , 0 )

}

CREDITS_PARAMS.stones = {


  geo:'logoGeo',

  init:function( geo  ){

  
      
      var mat = MATS.edge;
        var g = STONES.credits;

      
      var stones = new THREE.Mesh( geo , mat );
      stones.scale.multiplyScalar( .001 );

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
CREDITS_PARAMS.path = {

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
   
    var mat = MATS[ 'planet' ].clone();
   // mat.side = THREE.DoubleSide;
    
    mat.uniforms.tNormal.value = MATS.textures.normals.moss;
    mat.uniforms.t_audio.value = audioController.texture;



   
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
CREDITS_PARAMS.newTypes = [

  {
    type: 'credits_bass',
    note: 'clean1',
    loop: 'credits/bass',
    geo:  'bone',
    numOf: 3,
    boss: false,
    startScore: 0,
    mat:'lambert',
    color: new THREE.Color(0x000000),
    instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
      m.color = this.color;
    
    /*  m.uniforms.tNormal.value = MATS.textures.normals.moss;
      m.uniforms.t_audio.value = loop.texture;
      var c = this.color.getHex();
      resetColorUniform( m.uniforms.color1 , c , 1 );
      resetColorUniform( m.uniforms.color2 , c , 1 );
      resetColorUniform( m.uniforms.color3 , c , 1 );
      resetColorUniform( m.uniforms.color4 , c , 1 );*/


      var head = textCreator.createMesh('AUDIO');

      head.scale.multiplyScalar( .01);
      head.material.depthWrite = false;
      head.material.opacity = .9;
    //  head.material.blending = THREE.AdditiveBlending
      head.material.color = this.color;
      
      var m1 = new THREE.Object3D();
      
      var mesh = textCreator.createMesh('          @L4Suicide');
     
      mesh.material.depthWrite = false;
      mesh.material.opacity = .9;
     // mesh.material.blending = THREE.AdditiveBlending
      mesh.material.color = this.color;

      mesh.rotation.y = Math.PI / 2;

      m1.add( mesh );

      //m1.rotation.x = Math.PI
      m1.scale.x = .02;
      m1.scale.y = .02;
      m1.scale.z = .02;

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
    type: 'credits_kick',
    note: 'clean1',
    loop: 'credits/kick',
    geo:  'bone',
    numOf: 3,
    boss: false,
    startScore: 0,
    mat:'lambert',
    color: new THREE.Color(0x000000),
    instantiate: function( level , dragonFish , note , loop , geo , mat ){

      var m = mat;
      m.side = THREE.DoubleSide;
      m.color = this.color;
    
    /*  m.uniforms.tNormal.value = MATS.textures.normals.moss;
      m.uniforms.t_audio.value = loop.texture;
      var c = this.color.getHex();
      resetColorUniform( m.uniforms.color1 , c , 1 );
      resetColorUniform( m.uniforms.color2 , c , 1 );
      resetColorUniform( m.uniforms.color3 , c , 1 );
      resetColorUniform( m.uniforms.color4 , c , 1 );*/


      var head = textCreator.createMesh('MODELS');

      head.scale.multiplyScalar( .01);
      head.material.depthWrite = false;
      head.material.opacity = .9;
     // head.material.blending = THREE.AdditiveBlending
      head.material.color = this.color;
      
      var m1 = new THREE.Object3D();
      
      var mesh = textCreator.createMesh('    @Teeps');
      mesh.material.depthWrite = false;
      mesh.material.opacity = .9;
      //mesh.material.blending = THREE.AdditiveBlending
      mesh.material.color = this.color;
      mesh.rotation.y = Math.PI / 2;

      m1.add( mesh );

      //m1.rotation.x = Math.PI
      m1.scale.x = .02;
      m1.scale.y = .02;
      m1.scale.z = .02;

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
    type: 'credits_clap',
    note: 'clean1',
    loop: 'credits/clap',
    geo:  'logoGeo',
    numOf: 1,
    boss: false,
    startScore: 1,
    mat:'planetDisplace',
    color: new THREE.Color( 0x000000),
    instantiate: function( level , dragonFish , note , loop , geo, mat ){

    
      var head = textCreator.createMesh('THANKS');

      head.scale.multiplyScalar( .01);
      head.material.depthWrite = false;
      head.material.opacity = .9;
      //head.material.blending = THREE.AdditiveBlending
      head.material.color = this.color;

      var m1 = new THREE.Object3D();
      
      var mesh = textCreator.createMesh('      @MrDoob');

      mesh.material.depthWrite = false;
      mesh.material.opacity = .9;
      //mesh.material.blending = THREE.AdditiveBlending
      mesh.material.color = this.color;

      mesh.rotation.y = Math.PI / 2;
      m1.add( mesh );

      //m1.rotation.x = Math.PI
      m1.scale.x = .02;
      m1.scale.y = .02;
      m1.scale.z = .02;

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
    type: 'credits_anime',
    note: 'clean1',
    loop: 'credits/anime',
    geo:  'logoGeo',
    numOf: 1,
    boss: true,
    startScore: 1,
    mat:'planetDisplace',
    color: new THREE.Color( 0x000000) ,
    instantiate: function( level , dragonFish , note , loop , geo, mat ){

    
      var head = textCreator.createMesh('CODE');

      head.scale.multiplyScalar( .01);
      head.material.depthWrite = false;
      head.material.opacity = .9;
      head.material.blending = THREE.AdditiveBlending
      head.material.color = this.color;

      var m1 = new THREE.Object3D();
      
      var mesh = textCreator.createMesh('       @Cabbibo');

      mesh.material.depthWrite = false;
      mesh.material.opacity = .9;
      //mesh.material.blending = THREE.AdditiveBlending
      mesh.material.color = this.color;

      mesh.rotation.y = Math.PI / 2;
      m1.add( mesh );

      //m1.rotation.x = Math.PI
      m1.scale.x = .02;
      m1.scale.y = .02;
      m1.scale.z = .02;

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
          boss: true,
          maxSpeed: .5
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },



  

]


