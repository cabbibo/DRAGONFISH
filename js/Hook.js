

   
  function Hook( dragonFish, level, type , params ){
   

    this.id = Math.random();
    this.level = level;

    this.type = type || 'THIS HAS NO TYPE';
    this.params = _.defaults( params || {} , {
    
      color: new THREE.Color( 0xffffff ),
     // audioTexture: audioController.texture,
      //note: 'clean1.wav',
      //loop: 'clean_heavyBeat.wav',
      head: new THREE.Object3D(),
      m1:   fishSkeleton.flagella.child1,
      m2:   fishSkeleton.flagella.child2,
      m3:   fishSkeleton.flagella.child3,
      m4:   fishSkeleton.flagella.child1,
      startScore: 0,
      repelDistance: 3,
      boss: false,
      maxSpeed: .5
    
    });

    this.startScore = this.params.startScore;

    this.boss = this.params.boss;
   
    
    /*this.velocity.x = (Math.random()-.5 ) * .1;
    this.velocity.y = (Math.random()-.5 ) * .1;
    this.velocity.z = (Math.random()-.5 ) * .1;*/
   
   // var geo = new THREE.IcosahedronGeometry( .5 ,1 );
   // var mat = new THREE.MeshNormalMaterial({wireframe:true});
   // var head = new THREE.Mesh( geo , mat );
    //this.head = head;
    //
    this.head = this.params.head;

    this.maxSpeed = this.params.maxSpeed;

    this.color = this.params.color;
    
    this.note  = this.params.note;
    this.loop = this.params.loop;

    this.power=this.params.power;

    //this.head.position = this.position;
   
    
    this.dragonFish = dragonFish;

    this.position = this.head.position;
    this.velocity = new THREE.Vector3();
    this.force    = new THREE.Vector3();


    this.clueGeo = new THREE.BufferGeometry();

    var pos = new THREE.BufferAttribute(  new Float32Array( 1024 * 3 ), 3  );
    this.clueGeo.addAttribute( 'position', pos );
    var positions =  pos.array;//this.clueGeo.getAttribute( 'position' ).array;

    for( var i = 0; i < 1024; i++ ){

      positions[i*3] = i / 1024;
      positions[i*3+1] = i / 1024;
      positions[i*3+2] = i / 1024;

    }

    
    var mat = MATS.clueLine.clone();
    mat.uniforms.to.value = this.dragonFish.leader.position;
    mat.uniforms.from.value = this.position;

    if( this.params.loop ){
      mat.uniforms.t_audio.value = this.params.loop.texture;
    }else{
      mat.uniforms.t_audio.value = audioController.texture;
    }

    var c = new THREE.Vector3();
    c.x = this.params.color.r;
    c.y = this.params.color.g;
    c.z = this.params.color.b;
    mat.uniforms.color.value = c;
    this.clueLine = new THREE.Line( this.clueGeo , mat );
    this.clueLine.frustumCulled = false;
    
    this.reposition();



    document.getElementById( 'hookCount' ).innerHTML = SCORE;
    

  }

  Hook.prototype.createVertabrae = function( mesh ){

    this.vertabrae = this.dragonFish.createVertabrae( this.head , mesh , materials );

  }


  Hook.prototype.activate = function(){

    this.reposition();

    if( !this.params.boss ){
      
      this.vertabrae = this.dragonFish.createVertabrae( 
        this.head , 
        this.params.m1 , 
        this.params.m2, 
        this.params.m3,
        this.params.m4
      );
    
    }else{

      this.vertabrae = this.dragonFish.createBoss(
        this.head , 
        this.params.m1 , 
        this.params.m2, 
        this.params.m3,
        this.params.m4
      )

    }

    // the vertabrae also needs to keep track of the type!
    this.vertabrae.type   = this.type;
    this.vertabrae.note   = this.note;
    this.vertabrae.loop   = this.loop;
    this.vertabrae.power  = this.power;


    scene.add( this.head );
    scene.add( this.clueLine );
    this.active = true;

  }


  // Getting Hooked
  Hook.prototype.onHooked = function(){

    SCORE ++;

    document.getElementById( 'hookCount' ).innerHTML = SCORE;
   // console.log( this );

    this.explode();
    //debugger;
    //
  
  }

  Hook.prototype.explode = function(){

    this.note.play();

    if( this.boss ){
    
      this.vertabrae.ui = this.ui;
      this.vertabrae.id = this.id;
      this.dragonFish.addBoss( this.vertabrae );
      looper.tweenGain( this.loop.gain , 1 );
      

    }else{

      this.vertabrae.ui = this.ui;
      this.vertabrae.id = this.id;
      this.dragonFish.addPrecreatedVertabrae( this.vertabrae );
      this.loop.gain.gain.value += this.power;
      
    }
      
    explosion.renderer.simulationUniforms.justHit.value = 1.;

    scene.remove( this.clueLine );
    scene.remove( this.head );
    changeColor( this.color , this.level.lightUncertainty );

  }

  Hook.prototype.updateForces = function( level ){

    var hooks = level.hooks;
    var position = level.scene.position;

    this.force.set( 0 , 0,0 );    
    for( var i = 0; i < hooks.length; i++ ){

      var h1 = hooks[i];

      if( h1 !== this ){

        var dist = this.position.clone().sub( h1.position );
        var l = dist.length();

        this.force.sub( dist.normalize().multiplyScalar(l*.0000001) ); //dist.normalize().multiplyScalar( .1/ l ));

      }
    
    }

    var d = this.position.clone().sub( position );

    this.force.sub( d.normalize().multiplyScalar( d.length() * d.length() * .001 ) );



    // Runs from dragonfish
    var dif = this.position.clone().sub( this.dragonFish.leader.position );
    var l = dif.length();

    if( l < this.params.repelDistance ){

      var s = this.dragonFish.leader.velocity.length();
      this.force.add( dif.normalize().multiplyScalar( .008 * s * ( 10/l)) ) ;
    }

    this.vertabrae.update();

  }

  Hook.prototype.updatePosition = function(){

    this.clueLine.geometry.verticesNeedUpdate = true;

    this.velocity.add( this.force );//.clone().multiplyScalar( aveVol));
   

    if( this.velocity.length() >= this.maxSpeed ){

      this.velocity.normalize().multiplyScalar( this.maxSpeed );

    }
    
    this.position.add( this.velocity ); 


    this.head.lookAt( this.position.clone().add( this.velocity ) );
    //this.velocity.multiplyScalar( .999 );


  }

  Hook.prototype.checkForCollision = function( size , index ){

    var dif = this.position.clone().sub( this.dragonFish.leader.position );

    if( dif.length() <= size ){
     
      this.level.onHook( index , this );

    }


  }

  Hook.prototype.destroy = function(){

    this.loop.gain.gain.value -= .1;
    var i = { x: 1 };
    var t = { x:0 };

    var tween = new TWEEN.Tween( i ).to( t , 3 * 1000 );

    tween.hook = this;
    tween.onUpdate(function( ){

      this.hook.head.scale.x = i.x;
      this.hook.head.scale.y = i.x;
      this.hook.head.scale.z = i.x;
     

      if( i.x < .1 ){
        
        console.log( this.vertabrae );
        scene.remove( this.hook.head );

      }
      //console.log( 'hello' );

    }.bind(tween));


    tween.start();

  }


  Hook.prototype.reposition = function(){

      this.position.x = (Math.random() -.5 )*100 + this.level.scene.position.x ;
      this.position.y = (Math.random() -.5 )*100 + this.level.scene.position.y;
      this.position.z = (Math.random() -.5 )*100 + this.level.scene.position.z;

      this.head.rotation.x = Math.random() * Math.PI * 2;
      this.head.rotation.y = Math.random() * Math.PI * 2;
      this.head.rotation.z = Math.random() * Math.PI * 2;
  
  }

