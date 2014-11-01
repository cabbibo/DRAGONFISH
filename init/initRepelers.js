function initRepelers(){

  for( var i =0; i<25; i++ ){

    var mesh = new THREE.Mesh( GEOS.icosa , MATS.normal );

    var t = Math.random() * 2 * Math.PI;
    var p = Math.random() * 2 * Math.PI;

    mesh.target   = toCart( 1. , t , p );
    mesh.velocity = new THREE.Vector3();
    mesh.power    = new THREE.Vector3( 1 , 1 , 1);

    mesh.position.copy( mesh.target );
    REPELERS.push( mesh );

    //scene.add( mesh );

  }

}
