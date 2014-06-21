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

}


function updateMechanics( delta ){

  controls.update( delta );

  if( !paused ){

    intersectPlane.position.copy( camera.position );

    var dT = distanceToIntersectPlane;
    var m =  ( controls.speed / controls.maxSpeed ); 
    var d = dT + m * m * dT * 5;
    var vector = new THREE.Vector3( 0, 0, -d );
    vector.applyQuaternion( camera.quaternion );
    intersectPlane.position.add( vector );

    intersectPlane.lookAt( camera.position );
     var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );

    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObject( intersectPlane );

    if( intersects.length > 0 ){
     bait.position.copy( intersects[0].point );
    }

    deathBait.oldPositions.unshift( bait.position );

    if( deathBait.oldPositions.length > 50 ){

      deathBait.oldPositions.pop();

    }

    var avePosition = new THREE.Vector3();
    for(var i = 0; i< deathBait.oldPositions.length; i++ ){

      avePosition.add( deathBait.oldPositions[i] );

    }

    avePosition.multiplyScalar( 1/ deathBait.oldPositions.length );

    var dif = deathBait.position.clone().sub( bait.position );
    deathBait.velocity.add( dif.normalize().multiplyScalar( -.003 ) );

    deathBait.position.add( deathBait.velocity );

    deathBait.velocity.multiplyScalar( .99 );


    //camera.lookAt( dragonFish.leader.position );
      
  }


}




window.addEventListener( 'mousemove' , onMouseMove , false );


  function onMouseMove( event ) {

      event.preventDefault();

      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  }
