
function createStones( geo , mat ){

    var geo = new THREE.IcosahedronGeometry(10 ,0 );
    var mat = mat || new THREE.MeshNormalMaterial();
    
    var mat = new THREE.MeshLambertMaterial({
      shading: THREE.FlatShading,
      color:0xffffff,
      map:audioController.texture,
      //wireframe:true,
      depthWrite:false,
      transparent:true,
      //opacity: .1,
      side: THREE.DoubleSide,
      blending:THREE.AdditiveBlending
    });

    var geometry = new THREE.Geometry();

    place(0,0,0,0);
    place(0,0,0,1);
    place(0,0,0,2);
    place(0,0,0,3);
    place(0,0,0,4);
    place(0,0,0,5);
    place(10,0,0,0);
    place(-10,0,0,1);
    place(0,10,0,2);
    place(0,-10,0,3);
    place(0,0,10,4);
    place(0,0,-10,5);
    place(10,10,0,0);
    place(-10,10,0,1);
    place(-10,10,0,2);
    place(-10,-10,0,3);
    place(10,0,10,4);
    place(10,0,-10,5);

    for( var i=0; i < placingMatrix.length; i++ ){

      var mesh = new THREE.Mesh( geo , mat );

      var p = placingMatrix[i][0];
      var s = placingMatrix[i][1];
      var r = placingMatrix[i][2];

      mesh.position.set( p[0] , p[1] , p[2] );
      mesh.scale.set( s[0] , s[1] , s[2] );
      mesh.rotation.x = r[0]//,r[1],r[2] );
      mesh.rotation.y = r[1]//,r[1],r[2] );
      mesh.rotation.z = r[2]//,r[1],r[2] );

      mesh.updateMatrix();
      geometry.merge( geo , mesh.matrix );

    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    //assignUVs( geometry );
    stones = new THREE.Mesh( geometry , mat );
    scene.add( stones );

    return stones 

}


function assignUVs( geometry ){

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
