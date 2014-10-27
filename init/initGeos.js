
var GEOS = {};

function initGeos(){

  GEOS.cube = new THREE.BoxGeometry( 1 , 1 , 1 );
  GEOS.box80_80_80 = new THREE.BoxGeometry( 1 , 1 , 1, 80,80,80 );
  GEOS.box = GEOS.cube; 
  GEOS.tetra = new THREE.TetrahedronGeometry( 1 , 0 );
  GEOS.icosa = new THREE.IcosahedronGeometry( 1 , 0 );
  GEOS.icosa6 = new THREE.IcosahedronGeometry( 1 , 6 );
  GEOS.icosa4 = new THREE.IcosahedronGeometry( 1 , 4 );
  GEOS.octa = new THREE.OctahedronGeometry( 1 , 0 );

  GEOS.feather1 = feather1();


  function feather1(){

    var g = new THREE.Geometry();

    for( var i = 0; i < 10; i++ ){

      var b = new THREE.Mesh( new THREE.BoxGeometry(1,1,1));

      b.scale.y = .2;
      b.scale.x = .2;

      b.position.z  = -i * .3;//*.1 + .3 * Math.random();
      b.position.x = (Math.random()-.5) * i *.1;
      b.position.y = (Math.random()-.5) * i *.1;
      b.rotation.x = (Math.random()-.5) * i / 20;
      b.rotation.y = (Math.random()-.5)* i / 20;


      b.updateMatrix();

      g.merge( b.geometry, b.matrix );



    }

    g.computeFaceNormals();
    g.computeVertexNormals();




    return g;


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
