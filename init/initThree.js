function initThree(){

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 
    50 ,
    window.innerWidth / window.innerHeight,
    sceneSize / 100 ,
    sceneSize * 400
    );

  // placing our camera position so it can see everything
  camera.position.z = 20;

  clock = new THREE.Clock();
      // Getting the container in the right location
    container = document.createElement( 'div' );
    container.id = "container";
    
    document.body.appendChild( container );

 // Getting the stats in the right position
    stats = new Stats();

    stats.domElement.style.position  = 'absolute';
    stats.domElement.style.bottom    = '0px';
    stats.domElement.style.right     = '0px';
    stats.domElement.style.zIndex    = '999';

    document.body.appendChild( stats.domElement );

    // Setting up our Renderer
    renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // Making sure our renderer is always the right size
    window.addEventListener( 'resize', onWindowResize , false );

    var stars = THREE.ImageUtils.loadTexture( 'img/starMap.png' );
    var geo = new THREE.SphereGeometry(4000 , 50 , 50 )
    var mat = new THREE.MeshBasicMaterial({

      side: THREE.BackSide,
      map: stars,
      depthWrite: false

    });
    starMap = new THREE.Mesh( geo , mat );

    scene.add( starMap );
    starMap.position = camera.position;



}

// Resets the renderer to be the proper size
function onWindowResize(){

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}



