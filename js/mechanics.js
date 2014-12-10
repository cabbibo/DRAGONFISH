
var ROTATION_VECTOR = new THREE.Vector3();
var MOVE_VECTOR = new THREE.Vector3();
var RV = ROTATION_VECTOR;
var MV = MOVE_VECTOR;

var CAM_SPEED = 0;

var tmpQ = new THREE.Quaternion();


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

  var frame = controller.frame();
  if(frame.valid === true ){


    if( frame.hands[0] ){

      var np = frame.interactionBox.normalizePoint;
      //console.log( frame.hands[0].palmPosition );

      var p = frame.interactionBox.normalizePoint( frame.hands[0].palmPosition );
      //console.log( p );

      console.log( frame.hands[0] );
      var d = frame.hands[0].direction;
      var n = frame.hands[0].palmNormal;
    

    
      RV.x = d[1] * .02;
      RV.y = -d[0] * .02;
      RV.x += (p[1]-.5) * .02; 
      RV.y += -(p[0]-.5) * .02;

      RV.z =  n[0] * .01;

      CAM_SPEED = -(p[2]-.5) * 1;
    }

    
    tmpQ.set( RV.x , RV.y, RV.z, 1 ).normalize();
	camera.quaternion.multiply( tmpQ );

    MV.set( 0 , 0 , -1 );
    MV.applyQuaternion( camera.quaternion );
    
    MV.multiplyScalar( CAM_SPEED );

    camera.position.add( MV );

    CAM_SPEED *= .99;

    RV.multiplyScalar( .97 );


    tv.set( 0 , 0 , -1 );
    tv.applyQuaternion( camera.quaternion );

    tv.multiplyScalar( CAM_SPEED * CAM_SPEED * CAM_SPEED * 100. + 20 );
    tv1.copy( camera.position );
    tv1.add( tv );

    bait.position.copy( tv1 );

    if( deathDragon.attacking === true ){
      TMP_VECTOR_3.copy( deathBait.position ).sub( bait.position );
    }else{
      TMP_VECTOR_3.set( 0 , 10000 , 0 );
    }




    deathBait.velocity.add( TMP_VECTOR_3.normalize().multiplyScalar( -.003 * LEVELS[ CURRENT_LEVEL].death.speed  ) );
    deathBait.position.add( deathBait.velocity );
    deathBait.velocity.multiplyScalar( .99 );


  }else{
    
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


      deathBait.velocity.add( TMP_VECTOR_3.normalize().multiplyScalar( -.003 * LEVELS[ CURRENT_LEVEL].death.speed  ) );
      deathBait.position.add( deathBait.velocity );
      deathBait.velocity.multiplyScalar( .99 );

    }

    //camera.lookAt( dragonFish.leader.position );
      
  }


}



// This function moves from a position from leap space, 
  // to a position in scene space, using the sceneSize
  // we defined in the global variables section
  function leapToScene( position ){

    var x = position[0] - frame.interactionBox.center[0];
    var y = position[1] - frame.interactionBox.center[1];
    var z = position[2] - frame.interactionBox.center[2];
      
    x /= frame.interactionBox.size[0];
    y /= frame.interactionBox.size[1];
    z /= frame.interactionBox.size[2];

    x *= sceneSize;
    y *= sceneSize;
    z *= sceneSize;

    z -= sceneSize;

    return [ x , y , z ];

  }




