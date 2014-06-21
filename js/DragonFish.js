function DragonFish( bait , params ){

  this.params = _.defaults(params || {} , {
  });

  this.bait = bait;
  
  /*

     HEAD

  */
 // this.head = this.createHead( head );
 // this.plume    = this.createPlume( plume );
 // this.flagella = this.createFlagella( flagella );
  

  this.leader = new Fish(bait,1, fishSkeleton.head.spine );

  /*var leaderMarker = new THREE.Mesh(
    new THREE.CubeGeometry( .5 , .5 , .5 ),
    new THREE.MeshBasicMaterial()
  );
  this.leader.body.add( leaderMarker );*/
  //this.position = this.leader.position;
  this.spine = [];
  this.tail;
  
  /*
  
     PLUME

  */
  //this.initPlume();

  //this.initBody();

  this.addToScene( this.leader );

}

DragonFish.replaceMesh = function( mesh ){


}

DragonFish.prototype.addToScene = function( object ){

  this.recursiveCall( object , function( body ){
    scene.add( body );
  });

}

DragonFish.prototype.removeFromScene = function( object ){

  this.recursiveCall( object , function( body ){
    scene.remove( body );
  });

}

DragonFish.prototype.update = function(){


  for( var i= 3; i< this.spine.length; i++ ){

    var c1 = this.spine[i];

    var dToCam = c1.position.clone().sub( camera.position );
    var lToCam = dToCam.length();


    c1.velocity.set( 0 , 0,0 );
    c1.velocity.add( dToCam.multiplyScalar( 8 / (lToCam*lToCam*lToCam*lToCam) ) );
    c1.position.add( c1.velocity );


    var spine = this.spine[i];
    var a = audioController.analyzer.array[i*5] /150;
    var vel = spine.velocity;

    var velLength = vel.length();
  }

  this.leader.update();


}

DragonFish.prototype.initPlume = function( m1 , m2 , m3 ){

  var m1 = m1 || fishSkeleton.plume.spine;
  var m2 = m2 || fishSkeleton.plume.child1;
  var m3 = m3 || fishSkeleton.plume.child2;

  for( var j = 0; j < 3; j++ ){

    var f = new Fish( this.leader , .9 , fishSkeleton.plume.spine );

    var column1 = [];

    f.timeToChange = 1;
   // f.subAttractDist = .4;
    f.subAttractDist = .1;
    for( var k = 0; k < 1; k++ ){


      var f1;
      if( k === 0 ){           
        f1 = new Fish( f ,  .9 , fishSkeleton.plume.child1 );
      }else{
        f1 = new Fish( column1[k-1] , .3, fishSkeleton.plume.child1 );
      }

      f1.sibRepelDiv = 40;
      f1.sibRepelDist = 2;
      f1.sibRepelPow = 1;

      for( var l = 0; l <10; l++ ){
        var f2 = new Fish( f1 , .8 , fishSkeleton.plume.child2);
        
        for( var m = 0; m < 10; m++ ){
          var f3 = new Fish( f2 , .4 , fishSkeleton.plume.spine );
          f3.sibRepelDist = 2;

        }

      }

      column1.push( f1 );

    }

  }

  this.addToScene( this.leader );


}

DragonFish.prototype.initBody = function(){

  
    this.spine.push( this.leader );

    for( var i = 0; i < 3; i++ ){

      this.addVertabrae();
    
    }
        
   this.tail = this.spine[ this.spine.length - 1 ];

}

DragonFish.prototype.addPrecreatedVertabrae = function( vertabrae ){

  if( this.spine.length === 0 ){

    vertabrae.dom = this.leader;
    vertabrae.dom.sub.push( vertabrae );

  }else{
  
    vertabrae.dom = this.spine[ this.spine.length - 1 ];
    vertabrae.dom.sub.push( vertabrae );
  
  }
  
  this.spine.push( vertabrae );


}

DragonFish.prototype.addBoss = function( vertabrae ){

  vertabrae.dom = this.leader;

  this.spine.splice( 0 , 0 , vertabrae );
 
  vertabrae.dom.sub.push( vertabrae );

}




DragonFish.prototype.createVertabrae = function( dom , m1 , m2 , m3 , m4 ){

  var m1 = m1 || fishSkeleton.flagella.spine;
  var m2 = m2 || fishSkeleton.flagella.child1;
  var m3 = m3 || fishSkeleton.flagella.child2;
  var m4 = m4 || fishSkeleton.flagella.child3;

  var vertabrae = new Fish( dom , .8 , m1 );
  vertabrae.position.copy( dom.position );

  for( var i = 0; i < 3; i++ ){
    
    var child1 = new Fish( vertabrae , .7 , m2 );
    child1.position.copy( vertabrae.position );

    for( var j = 0;  j < 2; j++ ){

      var child2 = new Fish( child1 , .6 , m3 );
      child2.position.copy( vertabrae.position );

      for( var k = 0; k < 3; k++ ){

        var child3 = new Fish( child2 , .5 , m4 );
        child3.position.copy( vertabrae.position );

      }

    }

  }


  return vertabrae;

}


DragonFish.prototype.createBoss = function( dom , m1 , m2 , m3 , m4 ){

  var m1 = m1 || fishSkeleton.flagella.spine;
  var m2 = m2 || fishSkeleton.flagella.child1;
  var m3 = m3 || fishSkeleton.flagella.child2;
  var m4 = m4 || fishSkeleton.flagella.child3;


  /*var connect = new Fish( this.leader , 1 , dom );
  connect.position.copy( this.leader.position );*/

  var vertabrae = new Fish( dom , .8 , m1 );
  vertabrae.position.copy( dom.position );

  var sp = [];

  for( var X = 0; X < 3; X++ ){
    for( var i = 0; i < 5; i++ ){
    
      var child1;
      if( i == 0 ){
        child1 = new Fish( vertabrae , .6 , m2 );
        child1.position.copy( vertabrae.position );
        sp.push( child1 );

      }else{

        child1 = new Fish( sp[i-1] , .6 , m2 );
        sp.push( child1 );
      }

      for( var j = 0;  j < 2; j++ ){

        var child2 = new Fish( child1 , .4 , m3 );
        child2.position.copy( vertabrae.position );

        for( var k = 0; k < 3; k++ ){

          var child3 = new Fish( child2 , .2 , m4 );
          child3.position.copy( vertabrae.position );

        }

      }

    }
  }


  return vertabrae;

}



DragonFish.prototype.addVertabrae = function( m1 , m2 , m3 , m4 ){

  var id = this.spine.length;

  var dom = this.spine[ id - 1 ];

  var v = this.createVertabrae( dom , m1 , m2 , m3 , m4 );
 
  this.spine.push( v );

  //this.tail = this;



}
DragonFish.prototype.removeVertabraeById = function( id ){

  if( this.spine[id].loop ){

    var v = this.spine[id];
    v.loop.gain.gain.value -= v.power;

  }else{

    console.log( 'This Spine is out of the Loop' );

  }

  var newDom = this.spine[id-1];
  if( id === 0 ){
    newDom = this.leader;
  }


  this.spine[id].dom = undefined;
  if( this.spine[id+1] ){

    this.spine[id+1].dom = newDom;
    newDom.sub.push( this.spine[id+1] );

  }

  for( var i =0; i <  newDom.sub.length; i++ ){

    if(  newDom.sub[i] == this.spine[id] ){

       newDom.sub.splice( i , 1 );

      console.log( 'SPLACES' );
    }

  }

  for( var i = 0; i < this.spine[id].sub.length; i++ ){

    if( this.spine[id].sub[i] === this.spine[id+1] ){

      console.log('YUS');
      this.spine[id].sub.splice( i , 1 ); 

    }

  }

   
  var i = { x:1 };
  var t = { x:0 };

  var tween = new TWEEN.Tween( i ).to( t , 1 * 1000 );

  tween.spine = this.spine[id];
  tween.dragonFish = this;
  tween.onUpdate(function( ){


    this.dragonFish.recursiveCall( this.spine , function( body ){

      body.scale.multiplyScalar(  i.x );
      
    });
   

    if( i.x < .01 ){

    
      this.dragonFish.removeFromScene( this.spine );
      /*this.dragonFish.recursiveCall( this.spine , function( body ){
        scene.remove( body );
      });*/
  
    }    //console.log( 'hello' );

  }.bind(tween));


  tween.start();


  this.spine.splice( id , 1 );

}

DragonFish.prototype.recursiveCall = function( object , callback ){

  callback( object.body );
  for( var i = 0; i < object.sub.length; i++ ){
    this.recursiveCall( object.sub[i] , callback );
  }

}

DragonFish.prototype.removeVertabrae = function( vertabrae ){

  for( var i = 0; i < this.spine.length; i++ ){

    if( this.spine[i] === vertabrae ){

      this.spine.splice( i , 1 );

    }

  }



}



/*
 

TODO:
DragonFish.prototype.column( dom , size , sub ){

  var fish = [];

  for( var i = 0; i < size; i++ ){

    var f;
    if( i == 0 ){
      f = new Fish( dom , 
    }


  }

}

*/
