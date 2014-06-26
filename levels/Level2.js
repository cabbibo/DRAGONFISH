

var LEVEL_2_PARAMS = {};


LEVEL_2_PARAMS.position = new THREE.Vector3( 0 , 1000 , 0 );

LEVEL_2_PARAMS.note = 'clean6',

LEVEL_2_PARAMS.death = {

  note:'glassSmash',
  geo:'skull',
  loop:'lvl1/ambient',
  mat:'planet',
  color:0xee6622,
  scale: 1,
  position: new THREE.Vector3( 0 , -10 , 0 )

}


LEVEL_2_PARAMS.geo = 'totem';



LEVEL_2_PARAMS.oldTypes = [

  //'lvl1_part1_synth',
  'lvl1_part1_drums',
  'lvl1_part1_perc',

] 

LEVEL_2_PARAMS.skybox = {

  geo:'totem',
  note: 'srBeast1',
  map: 'audioController',
  mat: 'planet',
  scale: 100,
  init: function(geo){

    //this.mat.map = audioController.texture;

    geo.computeFaceNormals();
    geo.computeVertexNormals();
    
    console.log( geo );

    //this.mat.needsUpdate = true;
    console.log( 'SKYBOX2' );
    console.log( this.mat );
    console.log( geo );
    console.log( geo );

    var mat = MATS[ this.mat ].clone();
    mat.side = THREE.DoubleSide;
    
    mat.uniforms.tNormal.value = MATS.textures.normals.moss;
    mat.uniforms.t_audio.value = audioController.texture;
    mat.uniforms.texScale.value = .1;
    mat.uniforms.normalScale.value= .1;
    var skybox = new THREE.Mesh( geo , mat );

    skybox.note = this.note;
    skybox.scale.multiplyScalar( this.scale );

    //scene.add( skybox );
    return skybox;
    


  }

}

LEVEL_2_PARAMS.crystal = {

  geo: new THREE.CylinderGeometry( 2,0,5 ),
  mat: new THREE.MeshPhongMaterial({ side:THREE.DoubleSide }),
  map: 'audioController',  
  scale:.3,
  rotation: new THREE.Euler( -Math.PI / 2 , 0 , 0 )

}

LEVEL_2_PARAMS.stones = {


  geo:'logoGeo',

  init:function( geo  ){

    
    var geo = new THREE.CubeGeometry( 10 ,10,10 );
    var mat = mat || new THREE.MeshNormalMaterial();
    
    var mat = new THREE.MeshLambertMaterial({
      shading: THREE.FlatShading,
      color:0xffffff,
      map:audioController.texture,
      //wireframe:true,
      depthWrite:false,
      transparent:true,
      //opacity: .1,
      side: THREE.DoubleSide,
      blending:THREE.AdditiveBlending
    });

    var geometry = new THREE.Geometry();

    var placingMatrix = [];
    placingMatrix.push([[0,0,0],[0,0,0],[0,0,0]]);

  
    place(placingMatrix, 0,0,0,0);
    place(placingMatrix, 0,0,0,1);
    place(placingMatrix, 0,0,0,2);
    place(placingMatrix, 0,0,0,3);
    place(placingMatrix, 0,0,0,4);
    place(placingMatrix, 0,0,0,5);
    place(placingMatrix, 10,0,0,0);
    place(placingMatrix, -10,0,0,1);
    place(placingMatrix, 0,10,0,2);
    place(placingMatrix, 0,-10,0,3);
    place(placingMatrix, 0,0,10,4);
    place(placingMatrix, 0,0,-10,5);
    place(placingMatrix, 10,10,0,0);
    place(placingMatrix, -10,10,0,1);
    place(placingMatrix, -10,10,0,2);
    place(placingMatrix, -10,-10,0,3);
    place(placingMatrix, 10,0,10,4);
    place(placingMatrix, 10,0,-10,5);

    for( var i=0; i < placingMatrix.length; i++ ){

      var mesh = new THREE.Mesh( geo , mat );

      var p = placingMatrix[i][0];
      var s = placingMatrix[i][1];
      var r = placingMatrix[i][2];

      mesh.position.set( p[0] , p[1] , p[2] );
      mesh.scale.set( s[0] , s[1] , s[2] );
      mesh.rotation.x = r[0]//,r[1],r[2] );
      mesh.rotation.y = r[1]//,r[1],r[2] );
      mesh.rotation.z = r[2]//,r[1],r[2] );

      mesh.updateMatrix();
      geometry.merge( geo , mesh.matrix );

    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    //assignUVs( geometry );
    stones = new THREE.Mesh( geometry , mat );

    return stones 


  }




}
/*

   Path

*/
LEVEL_2_PARAMS.path = {

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
    var mat = new THREE.MeshPhongMaterial();



   
    var cone = new THREE.CylinderGeometry( 1 , 0 , 3);
    var coneMesh = new THREE.Mesh( cone);
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

LEVEL_2_PARAMS.newTypes = [

  {
    type: 'lvl1_part2_synth',
    note: 'clean1',
    loop: 'lvl1/part2/synth',
    geo:  'logoGeo',
    numOf: 1,
    boss: false,
    startScore: 0,
    color: new THREE.Color( 0xaa5555),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          geo,
          m
      );

      head.scale.multiplyScalar( .1 );

      var g = new THREE.IcosahedronGeometry(2);
      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

      m1.scale.x = .1;
      m1.scale.y = .1;
      m1.scale.z = .1;

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
    type: 'lvl1_part2_lead',
    note: 'clean1',
    loop: 'lvl1/part2/lead',
    geo:  'logoGeo',
    numOf: 1,
    boss: false,
    startScore: 1,
    color: new THREE.Color( 0x55aa55),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          geo,
          m
      );

      head.scale.multiplyScalar( .1 );

      var g = new THREE.IcosahedronGeometry(2);
      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

      m1.scale.x = .1;
      m1.scale.y = .1;
      m1.scale.z = .1;

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
    type: 'lvl1_part2_vox',
    note: 'clean1',
    loop: 'lvl1/part2/vox',
    geo:  'logoGeo',
    numOf: 1,
    boss: false,
    startScore: 2,
    color: new THREE.Color( 0x5555aa),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          geo,
          m
      );

      head.scale.multiplyScalar( .1 );

      var g = new THREE.IcosahedronGeometry(2);
      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

      m1.scale.x = .1;
      m1.scale.y = .1;
      m1.scale.z = .1;

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
    type: 'lvl1_part2_toms',
    note: 'clean1',
    loop: 'lvl1/part2/toms',
    geo:  'logoGeo',
    numOf: 1,
    boss: false,
    startScore: 3,
    color: new THREE.Color( 0xaa5599),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          geo,
          m
      );

      head.scale.multiplyScalar( .1 );

      var g = new THREE.IcosahedronGeometry(2);
      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

      m1.scale.x = .1;
      m1.scale.y = .1;
      m1.scale.z = .1;

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
    type: 'lvl1_part2_drums',
    note: 'clean1',
    loop: 'lvl1/part2/drums',
    geo:  'logoGeo',
    numOf: 1,
    boss: true,
    startScore: 4,
    color: new THREE.Color(0x7755aa),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          geo,
          m
      );

      head.scale.multiplyScalar( .1 );

      var g = new THREE.IcosahedronGeometry(2);
      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

      m1.scale.x = .1;
      m1.scale.y = .1;
      m1.scale.z = .1;

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

]


