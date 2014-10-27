var explosion = {};
var soulSucker = {};

function initExplosion( dragonFish ){

  var sprite = THREE.ImageUtils.loadTexture( 'lib/flare.png');

  var color = new THREE.Vector3( Math.random() , Math.random() , Math.random());
   
  var id = 1;
  var size = 64;

  var sim = shaders.simulationShaders.curlSim;

  var physicsRenderer = new PhysicsRenderer( size , sim , renderer ); 

  uniforms = {
    t_pos:{ type:"t" , value:null },
    t_oPos:{ type:"t" , value:null },
    t_ooPos:{ type:"t" , value:null },
    t_audio:{ type:"t" , value:audioController.texture},
    sprite:{ type:"t" , value:sprite},
    color:{ type:"v3" , value: new THREE.Vector3( 1. ,1., 1.) }
  }
  
  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shaders.vertexShaders.render,
    fragmentShader: shaders.fragmentShaders.render,

    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  })

  var geo = ParticleUtils.createLookupGeometry( size );

  var physicsParticles  = new THREE.PointCloud( geo , mat );
  physicsParticles.frustumCulled = false;

  physicsRenderer.addBoundTexture( physicsParticles , 't_pos' , 'output' );
  physicsRenderer.addBoundTexture( physicsParticles , 't_oPos' , 'oOutput' );
 // physicsRenderer.addBoundTexture( physicsParticles , 't_ooPos' , 'ooOutput' );

  scene.add( physicsParticles );

  var mesh = new THREE.Mesh( new THREE.SphereGeometry( .1 ) );

  var pTexture = ParticleUtils.createPositionsTexture( size , mesh );
  physicsRenderer.reset( pTexture );
  //physicsRenderer.addDebugScene( scene );
  //physicsRenderer.debugScene.scale.multiplyScalar( .1 );

  physicsRenderer.setUniform( 't_audio' , {
    type:"t" , value: audioController.texture
  });

  physicsRenderer.setUniform( 'uPos' , {
    type:"v3" , value: dragonFish.leader.position 
  });

  physicsRenderer.setUniform( 'uVel' , {
    type:"v3" , value: dragonFish.leader.velocity
  });

  var justHit =  {
    type:"f" , value: 0.0
   };
  physicsRenderer.setUniform( 'justHit' , justHit );


  explosion.renderer = physicsRenderer;
  explosion.particles = physicsParticles;
  explosion.justHit = justHit;

  return explosion;


}

function initSoulSucker( dragonFish , death){

  var sprite = THREE.ImageUtils.loadTexture( 'lib/flare.png');

  var color = new THREE.Vector3( Math.random() , Math.random() , Math.random());
   
  var id = 1;
  var size = 64;

  var sim = shaders.simulationShaders.deathSim;

  var physicsRenderer = new PhysicsRenderer( size , sim , renderer ); 

  
  var beingChased =  {
    type:"f" , value: 0.0
  };
    var justHit =  {
    type:"f" , value: 0.0
  };

  uniforms = {
    t_pos:{ type:"t" , value:null },
    t_oPos:{ type:"t" , value:null },
    t_ooPos:{ type:"t" , value:null },
    t_audio:{ type:"t" , value:audioController.texture},
    sprite:{ type:"t" , value:sprite},
    color:{ type:"v3" , value: new THREE.Vector3( 1. ,1., 1.) },
    uDeathPos:{ type:"v3" , value: death.leader.position  },
    uPos:{ type:"v3" , value: dragonFish.leader.position },
    beingChased: beingChased,
    justHit: justHit

  }
  
  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shaders.vertexShaders.deathParticles,
    fragmentShader: shaders.fragmentShaders.deathParticles,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  })

  var geo = ParticleUtils.createLookupGeometry( size );

  var physicsParticles  = new THREE.PointCloud( geo , mat );
  physicsParticles.frustumCulled = false;

  physicsRenderer.addBoundTexture( physicsParticles , 't_pos' , 'output' );
  physicsRenderer.addBoundTexture( physicsParticles , 't_oPos' , 'oOutput' );
  //physicsRenderer.addBoundTexture( physicsParticles , 't_ooPos' , 'ooOutput' );

  scene.add( physicsParticles );

  var mesh = new THREE.Mesh( new THREE.SphereGeometry( .1 ) );

  var pTexture = ParticleUtils.createPositionsTexture( size , mesh );
  physicsRenderer.reset( pTexture );
  //physicsRenderer.addDebugScene( scene );
  //physicsRenderer.debugScene.scale.multiplyScalar( .1 );

  physicsRenderer.setUniform( 't_audio' , {
    type:"t" , value: audioController.texture
  });

  physicsRenderer.setUniform( 'uPos' , {
    type:"v3" , value: dragonFish.leader.position 
  });

  physicsRenderer.setUniform( 'uDeathPos' , {
    type:"v3" , value: death.leader.position 
  });

  physicsRenderer.setUniform( 'uVel' , {
    type:"v3" , value: dragonFish.leader.velocity
  });


  physicsRenderer.setUniform( 'justHit' , justHit );
  physicsRenderer.setUniform( 'beingChased' , beingChased );




  soulSucker.renderer = physicsRenderer;
  soulSucker.particles = physicsParticles;
  soulSucker.justHit = justHit;
  soulSucker.beingChased = beingChased;


  return soulSucker;


}
