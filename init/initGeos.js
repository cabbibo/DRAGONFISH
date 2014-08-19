
var GEOS = {};

function initGeos(){

  GEOS.cube = new THREE.BoxGeometry( 1 , 1 , 1 );
  GEOS.tetra = new THREE.TetrahedronGeometry( 1 , 0 );
  GEOS.icosa = new THREE.IcosahedronGeometry( 1 , 0 );
  GEOS.octa = new THREE.OctahedronGeometry( 1 , 0 );
 /* loader.addToLoadBar();
  loader.OBJLoader.load( 'lib/totem_6.obj' , function( object ){
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          GEOS.totemGeo = child.geometry;       
        }
    });
    loader.loadBarAdd();
  });

  
  loader.OBJLoader.load( 'lib/cabbibo_1824.obj' , function( object ){
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          GEOS.logoGeo = child.geometry;
        }
    });
    loader.loadBarAdd();
  });
*/





}
