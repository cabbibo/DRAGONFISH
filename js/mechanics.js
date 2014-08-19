function initMechanics(){


  controls = new THREE.FlyControls( camera );

  controls.movementSpeed = 4;
  controls.rollSpeed = Math.PI / 5 ;
  controls.autoForward = false;

  controls.dragToLook = false;

  projector = new THREE.Projector();
  raycaster = new THREE.Raycaster();
 
      // Plane for mouse
  intersectPlane = new THREE.Mesh(
    new THREE.PlaneGeometry( 3000 , 3000 ),
    new THREE.MeshNormalMaterial()
  );

  intersectPlane.visible = false;
  scene.add( intersectPlane );


  mouse = new THREE.Vector2();

  window.addEventListener( 'mousemove' , onMouseMove , false );
  document.addEventListener( 'mousedown' , onMouseDown , false );
  document.addEventListener( 'mouseup' , onMouseUp , false );


  function onMouseMove( event ) {

      event.preventDefault();
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  }

  function onMouseDown( event ) {
    distanceToIntersectPlane += 10;
  }

  function onMouseUp( event ) {
    distanceToIntersectPlane -= 10;
  }
    

}


function updateMechanics( delta ){

  controls.update( delta );

  if( !paused ){

    intersectPlane.position.copy( camera.position );

    var dT = distanceToIntersectPlane;
    var m =  ( controls.speed / controls.maxSpeed ); 
    var d = dT + m * m * dT * 3;
    var vector = new THREE.Vector3( 0, 0, -d );

    TMP_VECTOR_3.set( 0 , 0, -d );
    TMP_VECTOR_3.applyQuaternion( camera.quaternion );
    intersectPlane.position.add( TMP_VECTOR_3 );

    intersectPlane.lookAt( camera.position );
    TMP_VECTOR_3.set( mouse.x, mouse.y, 1 );
    projector.unprojectVector(  TMP_VECTOR_3, camera );

    raycaster.set( camera.position, TMP_VECTOR_3.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObject( intersectPlane );

    if( intersects.length > 0 ){
     bait.position.copy( intersects[0].point );
    }

    /*deathBait.oldPositions.unshift( bait.position );

    if( deathBait.oldPositions.length > 50 ){

      deathBait.oldPositions.pop();

    }*/

    /*TMP_VECTOR_3.set( 0 , 0 , 0 );
    for(var i = 0; i< deathBait.oldPositions.length; i++ ){

       TMP_VECTOR_3.add( deathBait.oldPositions[i] );

    }

    TMP_VECTOR_3.multiplyScalar( 1/ deathBait.oldPositions.length );*/

    if( deathDragon.attacking === true ){
      TMP_VECTOR_3.copy( deathBait.position ).sub( bait.position );
    }else{
      TMP_VECTOR_3.set( 0 , 10000 , 0 );
    }


    deathBait.velocity.add( TMP_VECTOR_3.normalize().multiplyScalar( -.003 ) );
    deathBait.position.add( deathBait.velocity );
    deathBait.velocity.multiplyScalar( .99 );


    //camera.lookAt( dragonFish.leader.position );
      
  }


}




