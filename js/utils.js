 function changeColor( color ){


    recreateLights( color.getHex() );

    baseColor = color;

    var vecColor = new THREE.Vector3( 
      color.r,
      color.g,
      color.b
    );


    //jellyMat.uniforms.color.value = vecColor;
    console.log( explosion );
    explosion.particles.material.uniforms.color.value = vecColor;


  }


  function recreateLights( color ){

    for( var i = 0; i< lights.length; i++ ){

      scene.remove( lights[i] );

    }

    lights = [];

    lights[0] = createLightCluster( color , new THREE.Vector3( 0 , 0 , 1 ) );
    lights[1] = createLightCluster( color , new THREE.Vector3( 0 , 1 , 0 ) );
    lights[2] = createLightCluster( color , new THREE.Vector3( 1 , 0 , 0 ) );
    lights[3] = createLightCluster( color , new THREE.Vector3( 0 , 0 , -1 ) );
    lights[4] = createLightCluster( color , new THREE.Vector3( 0 , -1 , 0 ) );
    lights[5] = createLightCluster( color , new THREE.Vector3( -1 , 0 , 0 ) );
    

  }


  function createLightCluster(  baseColor , baseDir ){


    var mainColor = new THREE.Color( baseColor );
    var mainDir = baseDir.clone();

    var c = mainColor.clone();
    c.r = c.r + ( (Math.random() -.9) )*.5;
    c.g = c.g + ( (Math.random() -.9))*.5;
    c.b = c.b + ( (Math.random() -.9) )*.5;

    var d = mainDir.clone();
    d.x = d.x + ( (Math.random()-.5) * .5 );
    d.y = d.y + ( (Math.random()-.5) * .5 );
    d.z = d.z + ( (Math.random()-.5) * .5 );

    d.normalize();
    //c.normalize();

   // c.r = d.x;
    var light = new THREE.DirectionalLight(c.getHex() , 1);
    
    light.position.copy( d );
    lights.push( light );
    scene.add( light );

    return light;


  }

 function assignUVs( geometry ){

   console.log( 'HELLOAA' );
    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

}
