
var GEOS = {};

function initGeos(){

  GEOS.cube = new THREE.BoxGeometry( 1 , 1 , 1 );
  //GEOS.cube.computeFaceNormals();
  //GEOS.cube.computeVertexNormals();
  GEOS.box50_50_50 = new THREE.BoxGeometry( 1 , 1 , 1, 50,50,50 );
  GEOS.box10_10_10 = new THREE.BoxGeometry( 1 , 1 , 1, 10,10,10 );
  GEOS.box = GEOS.cube.clone(); 
  GEOS.tetra = new THREE.TetrahedronGeometry( 1 , 0 );
  GEOS.icosa = new THREE.IcosahedronGeometry( 1 , 0 );
  GEOS.icosa6 = new THREE.IcosahedronGeometry( 1 , 6 );
  GEOS.icosa5 = new THREE.IcosahedronGeometry( 1 , 5 );
  GEOS.icosa4 = new THREE.IcosahedronGeometry( 1 , 4 );
  GEOS.octa = new THREE.OctahedronGeometry( 1 , 0 );
  GEOS.cone500 = new THREE.CylinderGeometry( 1 , 0 , 2 , 50 , 10 );

  GEOS.feather1 = feather1();
  GEOS.feather2 = feather2();
  GEOS.feather3 = feather3();
  
  
  GEOS.mandala1 = mandala1();
  GEOS.mandala2 = mandala2();
  GEOS.mandala3 = mandala3();
  
  
  GEOS.flower = flower();
  GEOS.fractal = fractal();
  
  
  GEOS.tetraColumn = tetraColumn();



  var models = [

    "skull",
    "skull1",
    "totem",
    "bone",
    "logoGeo"

  ]
  for( var i=0; i < models.length; i++ ){
  
    var geoName = models[i];
    loader.beginLoading();
    var x = { geoName: geoName };
    loader.OBJLoader.load( 'models/' + geoName +'.obj' , function( object ){
      
      object.traverse( function ( child ) {
          if ( child instanceof THREE.Mesh ) {
            GEOS[this.geoName] = child.geometry;     
            GEOS[this.geoName].computeFaceNormals();
            GEOS[this.geoName].computeVertexNormals();
           // assignUVs( GEOS[this.geoName] );
          /* 
            var m = new THREE.Mesh( GEOS[geoName] , new THREE.MeshNormalMaterial() );
            m.scale.multiplyScalar( .00001 );
            this.scene.add( m );*/
          }
      }.bind( this ));

      loader.endLoading();
    }.bind( x ));

  }

  for( var propt in GEOS ){

    GEOS[ propt ].computeVertexNormals();
    GEOS[ propt ].computeFaceNormals();
    GEOS[ propt ].computeVertexNormals();
    GEOS[ propt ].verticesNeedUpdate = true;
    GEOS[ propt ].normalsNeedUpdate = true;


   //assignUVs( GEOS[ propt ] );
  }

  function feather1(){

    var g = new THREE.Geometry();

    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( new THREE.BoxGeometry(1,1,1));

      b.scale.y = .2;
      b.scale.x = .2;

      b.position.z  = -i * .3;//*.1 + .3 * Math.random();
      b.position.x = (Math.random()-.5) * i *.1;
      b.position.y = (Math.random()-.5) * i *.1;
     // b.rotation.x = (Math.random()-.5) * i / 10;
     // b.rotation.y = (Math.random()-.5)* i / 10;
     //
      b.lookAt( new THREE.Vector3() );


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();




    return g;


  }

  function feather2(){

    var g = new THREE.Geometry();

    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( new THREE.TetrahedronGeometry(1,0));


      b.scale.y = .2;
      b.scale.x = .2;
      b.scale.z = 1.;

      b.position.z  = -i * .3;//*.1 + .3 * Math.random();
      b.position.x = (Math.random()-.5) * i *.6;
      b.position.y = (Math.random()-.5) * i *.6;

      b.lookAt( new THREE.Vector3() );
    //  b.rotation.x = (Math.random()-.5) * i / 10;
    //  b.rotation.y = (Math.random()-.5)* i / 10;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;


  }

  function feather3(){

    var g = new THREE.Geometry();

    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( new THREE.IcosahedronGeometry(.5,0));


      b.scale.y = .2;
      b.scale.x = .2;
      b.scale.z = 1.;

      b.position.z  = -i * .3;//*.1 + .3 * Math.random();
      b.position.x = (Math.random()-.5) * i *.6;
      b.position.y = (Math.random()-.5) * i *.6;

      b.lookAt( new THREE.Vector3() );
    //  b.rotation.x = (Math.random()-.5) * i / 10;
    //  b.rotation.y = (Math.random()-.5)* i / 10;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;


  }

  function mandala1(){

    var g = new THREE.Geometry();

    var m = new THREE.BoxGeometry(1,1,1)
    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( m );


     b.scale.y = .2;
      b.scale.x = .2;
      b.scale.z = 1.;

      var r = (i / 10 ) * 2 * Math.PI;
      b.position.x = Math.cos( r );
      b.position.y = Math.sin( r );

      b.lookAt( new THREE.Vector3() );
    //  b.rotation.x = (Math.random()-.5) * i / 10;
    //  b.rotation.y = (Math.random()-.5)* i / 10;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;


  }

   function mandala2(){

    var g = new THREE.Geometry();

    var m = new THREE.BoxGeometry(1,1,1)
    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( m );


     b.scale.y = .1;
      b.scale.x = .4;
      b.scale.z = 1.;

      var r = (i / 10 ) * 2 * Math.PI;
      b.position.x = Math.cos( r );
      b.position.y = Math.sin( r );
     // b.position.z = -1;

      b.lookAt( new THREE.Vector3(0,0,1) );
    //  b.rotation.x = (Math.random()-.5) * i / 10;
    //  b.rotation.y = (Math.random()-.5)* i / 10;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;


  }

  function mandala3(){

    var g = new THREE.Geometry();

    //var m = new THREE.BoxGeometry(1,1,1)
    var m = new THREE.CylinderGeometry(.5,0,1,5)
    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( m );


     b.scale.y = .1;
      b.scale.x = .4;
      b.scale.z = 1.;

      var r = (i / 10 ) * 2 * Math.PI;
      b.position.x = Math.cos( r );
      b.position.y = Math.sin( r );
     // b.position.z = -1;

      b.lookAt( new THREE.Vector3(0,0,1) );
    //  b.rotation.x = (Math.random()-.5) * i / 10;
    //  b.rotation.y = (Math.random()-.5)* i / 10;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;


  }

   function flower(){

    var g = new THREE.Geometry();

    //var m = new THREE.BoxGeometry(1,1,1)
    var m = mandala3();
    var m2 = feather1();
    for( var i = 0; i < 10; i++ ){


      var b = new THREE.Mesh( m );


      b.scale.y = .8;
      b.scale.x = .8;
      b.scale.z = .8;

      var r = (i / 10 ) * 2 * Math.PI;
      b.position.x = Math.cos( r );
      b.position.y = Math.sin( r );
     // b.position.z = -1;

      b.lookAt( new THREE.Vector3(0,0,1) );
    //  b.rotation.x = (Math.random()-.5) * i / 10;
    //  b.rotation.y = (Math.random()-.5)* i / 10;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );
      g.merge( m2 , b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;


  }




  function tetraColumn(){


    var geo = new THREE.TetrahedronGeometry( .5 , 0);
    var mat = new THREE.MeshNormalMaterial();

    var tetrahedron = new THREE.Mesh( geo , mat );

    var geometry = new THREE.Geometry();
    for( var i = 0; i < 14; i++ ){

      //var mesh = new THREE.Mesh( geo , mat );
         //mesh.position.x = i/1;

      var m = tetrahedron.clone();
      m.rotation.y = Math.random() * Math.PI * 2;

      m.position.z = .4 - ( i / 14 ) * 5;
      m.position.x =( Math.random()  - .5 ) * 2.3 * ( (i / 14));
      m.position.y =( Math.random()  - .5 ) * 2.3 *(  (i / 14));
      m.scale.multiplyScalar( 1 - (i / 14) );
      m.updateMatrix();

      geometry.merge( m.geometry , m.matrix );

    }


    return geometry;
    //var tetraCluster = geometry;


  }

  function fractal(){

    var geo = new THREE.BoxGeometry( 1 , 1,1);

    var cube = new THREE.Mesh( geo );
   
    var geometry = new THREE.Geometry();

    var dirs = [

      [1,0,0],
      [0,1,0],
      [0,0,1],
      [-1,0,0],
      [0,-1,0],
      [0,0,-1],

    ]

    for( var i = 0; i < 6; i++ ){
        
      var m = cube.clone();
      m.position.x = 1 * dirs[i][0];
      m.position.y = 1 * dirs[i][1];
      m.position.z = 1 * dirs[i][2];

      m.scale.multiplyScalar( .333 );
      m.updateMatrix();
      geometry.merge( m.geometry , m.matrix );


      for( var j = 0; j < 6; j++ ){

        var m1 = m.clone();
        m1.position.x = m.position.x + 1 * m.scale.x * dirs[j][0];
        m1.position.y = m.position.y + 1 * m.scale.x * dirs[j][1];
        m1.position.z = m.position.z + 1 * m.scale.x * dirs[j][2];

        m1.scale.multiplyScalar( .333 );
        m1.updateMatrix();
        geometry.merge( m1.geometry , m1.matrix );

        for( var k = 0; k < 6; k++ ){

          var m2 = m1.clone();
          m2.position.x = m1.position.x + 1 * m1.scale.x * dirs[k][0];
          m2.position.y = m1.position.y + 1 * m1.scale.x * dirs[k][1];
          m2.position.z = m1.position.z + 1 * m1.scale.x * dirs[k][2];

          m2.scale.multiplyScalar( .333 );
          m2.updateMatrix();
          geometry.merge( m2.geometry , m2.matrix );


        }

      }

    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();



    return geometry
  }

  /*loader.addToLoadBar();
  loader.OBJLoader.load( 'lib/totem_6.obj' , function( object ){
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          GEOS.totemGeo = child.geometry;       
        }
    });
    loader.loadBarAdd();
  });*/

  
    
 /* loader.addToLoadBar();
  loader.OBJLoader.load( 'models/logoGeo.obj' , function( object ){
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          GEOS.logoGeo = child.geometry;
                GEOS[geoName].computeFaceNormals();
            GEOS[geoName].computeVertexNormals();
        }
    });
    loader.loadBarAdd();
  });*/






}
