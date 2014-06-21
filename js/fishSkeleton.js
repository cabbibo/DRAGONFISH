
    fishSkeleton = {
      head:{},
      plume:{},
      flagella:{}
    };


    var headMat = new THREE.MeshPhongMaterial({

      specular:0xffaaaa,
      emissive:0x001111,
      color:0x004499,
      shading: THREE.FlatShading

    });


    var shinyRed = new THREE.MeshPhongMaterial({

      specular:0xffaaaa,
      emissive:0x001111,
      color:0x004499,
      shading: THREE.FlatShading

    });

var shinyRed1 = new THREE.MeshPhongMaterial({

      specular:0xeebb66,
      emissive:0x111111,
      color:0x999944,
      shading: THREE.FlatShading

    });

var shinyRed2 = new THREE.MeshPhongMaterial({

      specular:0xffcc44,
      emissive:0x001111,
      color:0x449999,
      shading: THREE.FlatShading

    });

    var shinyYellow = new THREE.MeshPhongMaterial({

      specular:0xffffaa,
      emissive:0x441111,
      color:0xaa9933,
      shading: THREE.FlatShading

    });


    var shinyYellow1 = new THREE.MeshPhongMaterial({

      specular:0xffffaa,
      emissive:0x114411,
      color:0xaa44cc,
      shading: THREE.FlatShading

    });


    var shinyYellow2 = new THREE.MeshPhongMaterial({

      specular:0xaaaa22,
      emissive:0x443344,
      color:0xaa9933,
      shading: THREE.FlatShading

    });


    var shinyBlue = new THREE.MeshPhongMaterial({

      specular:0xaaaaff,
      emissive:0x441111,
      color:0xaa4499,
      shading: THREE.FlatShading

    });
    
    var shinyWhite = new THREE.MeshPhongMaterial({

      specular:0xffffff,
      emissive:0x000000,
      color:0xcccccc,
      shading: THREE.FlatShading

    });



    var geo = new THREE.TetrahedronGeometry( .2 , 0);
    var mat = new THREE.MeshNormalMaterial();

    var tetrahedron = new THREE.Mesh( geo , mat );

    var geometry = new THREE.Geometry();
    for( var i = 0; i < 14; i++ ){

      //var mesh = new THREE.Mesh( geo , mat );
         //mesh.position.x = i/1;

      var m = tetrahedron.clone();
      m.rotation.y = Math.random() * Math.PI * 2;

      m.position.z = .4 - ( i / 14 );
      m.position.x =( Math.random()  - .5 ) * .3 * ( (i / 14));
      m.position.y =( Math.random()  - .5 ) * .3 *(  (i / 14));
      m.scale.multiplyScalar( 1 - (i / 14) );
      m.updateMatrix();

      geometry.merge( m.geometry , m.matrix );

    }


    var tetraCluster = geometry;
    var safeTetra = tetraCluster.clone();

    /*

       HEAD

    */

    var obj = new THREE.Object3D();
    var geo = new THREE.CylinderGeometry( .1, .1 , 1 );
    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh( geo , shinyBlue );
    mesh.rotation.x = -Math.PI / 2;


    var eye1 = new THREE.Mesh( geo ,shinyRed);
    eye1.scale.multiplyScalar( .5 );
    eye1.position.x = .2

    var eye2 = new THREE.Mesh( geo ,shinyRed);
    eye2.scale.multiplyScalar( .5 );
    eye2.position.x = -.2

    mesh.add( eye1 );
    mesh.add( eye2 );

    beak = new THREE.Mesh( 
      new THREE.CylinderGeometry( .8 , 0 , 2.3, 50 ),
      headMat 
    );

    beak.rotation.x = -Math.PI / 2;
    beak.position.z = 1.3;


    obj.add( beak );

    //obj.add( mesh );


    fishSkeleton.head.spine = obj;

    /*
    
       PLUME

    */

    // spine
    var geo = new THREE.BoxGeometry( .3 , .3 , 1.8 );
    var mesh = new THREE.Mesh( geo , shinyRed );

    fishSkeleton.plume.spine = mesh;

    // child1
    var geo = new THREE.BoxGeometry( .1 , .1 , .5 );
    var mesh = new THREE.Mesh( tetraCluster  , shinyRed1 );

    fishSkeleton.plume.child1 = mesh;

    // child2
    var geo = new THREE.BoxGeometry( .1 , .1 , .5 );
    var mesh = new THREE.Mesh( tetraCluster , shinyRed2 );

    fishSkeleton.plume.child2 = mesh;

     // child3
    var geo = new THREE.BoxGeometry( .1 , .1 , .5 );
    var mesh = new THREE.Mesh( geo , shinyWhite );

    fishSkeleton.plume.child3 = mesh;
    
    // child2
    
  
    /*

      FLAGELLA

    */

  
    // spine
    var geo = new THREE.BoxGeometry( .3 , .3 , .9 );
    var geo = new THREE.CylinderGeometry( .2 , 0 , .4 , 10 );
    var mesh = new THREE.Mesh( geo , shinyYellow );
    mesh.rotation.x = - Math.PI / 2;
    mesh.matrix.needsUpdate = true;

    var obj = new THREE.Object3D();
    obj.add( mesh );
    fishSkeleton.flagella.spine = obj;


    // child 1
    var geo = new THREE.BoxGeometry( .1 , .1 , .5 );
    var mesh = new THREE.Mesh(  tetraCluster , shinyYellow1 );

    fishSkeleton.flagella.child1 = mesh;

    // child 2
    var geo = new THREE.BoxGeometry( .1 , .1 , .5 );
    var mesh = new THREE.Mesh(  tetraCluster , shinyYellow2 );

    fishSkeleton.flagella.child2 = mesh;

    // child 3
    var geo = new THREE.BoxGeometry( .1 , .1 , .5 );
    var mesh = new THREE.Mesh(  tetraCluster, shinyWhite );

    fishSkeleton.flagella.child3 = mesh;




    /*

       Body

    */
    /*var geo = new THREE.TetrahedronGeometry( .2 , 0);
    var mat = new THREE.MeshNormalMaterial()

    var mesh = new THREE.Mesh( geo , mat );

       
    var geometry = geo;
    var mat = new THREE.MeshNormalMaterial();
    var tetrahedron = new THREE.Mesh( geo , mat );

    var geometry = new THREE.Geometry();
    for( var i = 0; i < 14; i++ ){

      //var mesh = new THREE.Mesh( geo , mat );
         //mesh.position.x = i/1;

      var m = tetrahedron.clone();
      m.rotation.y = Math.random() * Math.PI * 2;

      m.position.z = .4 - ( i / 14 );
      m.position.x =( Math.random()  - .5 ) * .3 * ( (i / 14));
      m.position.y =( Math.random()  - .5 ) * .3 *(  (i / 14));
      m.scale.multiplyScalar( 1 - (i / 14) );
      m.updateMatrix();

      geometry.merge( m.geometry , m.matrix );

    }
    
    
       mat = new THREE.MeshPhongMaterial({

      specular:0xffaaaa,
      emissive:0x001111,
      color:0x004499,
      shading: THREE.FlatShading
        

    });
    var newHead = new THREE.Mesh( geometry, mat );

    var mat = new THREE.MeshNormalMaterial();
    var mat = new THREE.MeshPhongMaterial({

      specular:0xffffaa,
      emissive:0x441111,
      color:0xaa9933,
      shading: THREE.FlatShading

    });

    var newHead1 = new THREE.Mesh( geometry, mat );
    var mat = new THREE.MeshPhongMaterial({

      specular:0xaaaaff,
      emissive:0x441111,
      color:0xaa4499,
      shading: THREE.FlatShading

    });
    
    var newHead2 = new THREE.Mesh( geometry, mat );
    var mat = new THREE.MeshPhongMaterial({

      specular:0xffffff,
      emissive:0x000000,
      color:0xcccccc,
      shading: THREE.FlatShading

    });

    //var mat = new THREE.MeshBasicMaterial({color:0x000000})


    var column = new THREE.Mesh( 
        new THREE.IcosahedronGeometry(.1 , 1),
        mat
    );



    fishSkeleton.shinyTri1  = newHead;
    fishSkeleton.shinyTri2  = newHead1;
    fishSkeleton.shinyTri3  = newHead2;
    fishSkeleton.column     = column;
 
*/

