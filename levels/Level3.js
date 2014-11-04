var LEVEL_3_PARAMS = {};


LEVEL_3_PARAMS.lightUncertainty = .3;

LEVEL_3_PARAMS.position = new THREE.Vector3( 0,2000, 0 );

LEVEL_3_PARAMS.note = 'clean6',

LEVEL_3_PARAMS.death = {

  startScore:3,  
  note:'glassSmash',
  geo:'skull',
  loop:'lvl2/ambient',
  mat:'phong',
  color:0xee6622,
  scale: 100,
  position: new THREE.Vector3( 0 , -10 , 0 ),
  plumeGeos:[
    'box',
    'box',
    'box',
    'box'
  ],
  plumeMats:[
    'basic',
    'basic',
    'basic',
    'basic'
  ],
  plumeScales:[
    1,
    .5,
    .1,
    .1
  ]


}


LEVEL_3_PARAMS.geo = 'totem';



LEVEL_3_PARAMS.oldTypes = [

  //'lvl1_part2_drums',
  'lvl1_part2_vox',

] 


LEVEL_3_PARAMS.skybox = {

  geo: 'box80_80_80',
  note: 'srBeast1',
  map: 'audioController',
  mat: 'planet',
  scale: 800,
  init: function(geo){

    var skybox = GEMS.level3.body;
    skybox.gem = GEMS.level3;
 
    skybox.note = this.note;
    skybox.scale.multiplyScalar( this.scale );

    //scene.add( skybox );
    return skybox;
    


  }

}


LEVEL_3_PARAMS.crystal = {

  geo: new THREE.CylinderGeometry( 2,0,5 ),
  mat: new THREE.MeshPhongMaterial({ side:THREE.DoubleSide }),
  map: 'audioController',  
  scale:.3,
  rotation: new THREE.Euler( -Math.PI / 2 , 0 , 0 )

}

LEVEL_3_PARAMS.stones = {


  geo:'feather1',

  init:function( geo  ){

    
    //var geo = new THREE.CubeGeometry( 3 ,3,3 );
    var mat = mat || new THREE.MeshNormalMaterial();
    
    var mat = new THREE.MeshLambertMaterial({
      shading: THREE.FlatShading,
      color:0xffffff,
      //map:audioController.texture,
      //wireframe:true,
    //  depthWrite:false,
     // transparent:true,
      //opacity: .1,
      //side: THREE.DoubleSide,
      //blending:THREE.AdditiveBlending
    });

      //assignUVs( geometry );
    stones = new THREE.Mesh( STONES.level3 , mat );

    return stones 


  }




}
/*

   Path

*/
LEVEL_3_PARAMS.path = {

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
      guide.scale.multiplyScalar( 10 );
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

LEVEL_3_PARAMS.newTypes = [

  {
    type: 'lvl2_part1_drums',
    note: 'clean1',
    loop: 'lvl2/part1/drums',
    geo:  'feather1',
    numOf: 3,
    boss: false,
    startScore: 0,
    color: new THREE.Color( 0xA67F00 ),
    instantiate: function( level , dragonFish , note , loop , geo  ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          new THREE.BoxGeometry( 1 , 1 , 1 ),
          m
      );

      head.scale.multiplyScalar( 1.1 );

      //var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

      m1.scale.x = 1.1;
      m1.scale.y = 1.1;
      m1.scale.z = 1.1;

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

        console.log( 'HOOSK');
        console.log( hook );
        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },




  {
    type: 'lvl2_part1_perc',
    note: 'clean1',
    loop: 'lvl2/part1/perc',
    geo:  'feather1',
    numOf: 3,
    boss: false,
    startScore: 3,
    color: new THREE.Color( 0xA64100 ),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          GEOS.logoGeo,
          m
      );

      head.scale.multiplyScalar( .1 );



      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

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
    type: 'lvl2_part1_synth1',
    note: 'clean1',
    loop: 'lvl2/part1/synth1',
    geo:  'feather1',
    numOf: 3,
    boss: false,
    startScore: 4,
    color: new THREE.Color( 0x970026 ),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          GEOS.logoGeo,
          m
      );

      head.scale.multiplyScalar( .1 );


      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );


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
    type: 'lvl2_part1_wood',
    note: 'clean1',
    loop: 'lvl2/part1/wood',
    geo:  'feather1',
    numOf: 3,
    boss: false,
    startScore: 7,
    color: new THREE.Color(0xA61700 ),
    instantiate: function( level , dragonFish , note , loop , geo ){

      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          GEOS.logoGeo,
          m
      );

      head.scale.multiplyScalar( .1 );


      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , m );

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
    type: 'lvl2_part1_synth2',
    note: 'clean1',
    loop: 'lvl2/part1/synth2',
    geo:  'logoGeo',
    mat: 'audioLambert',
    numOf: 1,
    boss: true,
    startScore: 12,
    color: new THREE.Color( 0x3C6C67 ),
    instantiate: function( level , dragonFish , note , loop , geo , mat ){


      mat.uniforms.t_audio.value = LOOPS[ this.loop ].texture
  
      var c = this.color;
      mat.uniforms.color.value = new THREE.Vector3( c.r , c.g , c.b ); 
      var m = new THREE.MeshPhongMaterial({color: this.color.getHex() });
      var head = new THREE.Mesh(
          geo,
          mat
      );

      head.scale.multiplyScalar( .1 );

      var g = new THREE.IcosahedronGeometry(2);
      var m = new THREE.MeshLambertMaterial({ color: this.color.getHex() });
      var m1 = new THREE.Mesh( geo , mat );

      m1.scale.x = .1;
      m1.scale.y = .1;
      m1.scale.z = .1;

      m2 = m1.clone();
      m2.scale.multiplyScalar( .6);

      m3 = m2.clone();
      m3.scale.multiplyScalar( .6 );

      m4 = m3.clone();
      m4.scale.multiplyScalar( 1.6 );

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
          boss: true
        });

        var id = Math.random();
        hook.id = id;

        hooks.push( hook );
      }
  
      return hooks;
    }
  },

]


