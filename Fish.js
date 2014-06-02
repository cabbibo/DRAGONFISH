

  function Fish( dom , level, mesh ){
    
    this.dom  = dom;
    this.level = level;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();

    // API
    //this.timeToChange = 1000;
    //this.springForce = .1;

    this.sibRepelPow = 1;
    this.sibRepelDiv = 10;
    this.sibRepelDist = 1;

    this.subAttractPow = 2;
    this.subAttractDiv = 20;
    this.subAttractDist = .01;

    this.connected = true;

    this.sub = [];

    var newMesh = mesh.clone();
   
    this.body = mesh.clone();
    this.body.position = this.position;

    if( this.dom.sub ){
      this.dom.sub.push( this );
    }

    this.counter = 0;

    this.body.scale.multiplyScalar( level );
  }


  Fish.prototype.update = function(){

    this.speed = this.velocity.length();
    
    this.counter ++;
   
    /*
    
       If attached to bait

    */

    if( !this.dom ){

      console.log( 'WTF' );
      console.log( this );

    }
    
    if( !this.dom.sub ){

      this.velocity.set( 0 , 0 , 0 );

      var dif = this.dom.position.clone().sub( this.position );

      var dis = dif.length();
      var dir = dif.normalize();

      this.velocity.add( dir.multiplyScalar( dis / 10 ) );

      this.position.add( this.velocity );

      //this.velocity.multiplyScalar( .96 );
    
      this.body.lookAt( this.position.clone().add( this.velocity ));

    }

    for( var i = 0; i < this.sub.length; i++ ){

      var c1 = this.sub[i];

      c1.velocity.set( 0 , 0 , 0 );

      for( var j = 0; j < this.sub.length; j++ ){

        if( i != j ){
          var c2 = this.sub[j];
          var dif = c1.position.clone().sub( c2.position );

          var l = dif.length();

          var c = (l-this.sibRepelDist);

          var sign = c >= 0 ? 1 : -1;
          var x = sign * Math.abs(Math.pow( Math.abs(c) , this.sibRepelPow ))/ this.sibRepelDiv;

          c1.velocity.sub( dif.normalize().multiplyScalar( x ) );

        }

      }



      var dif = this.position.clone().sub( c1.position );

      if( isNaN( this.position.x ) ){
        console.log( 'posNAN' );
        debugger
      }
    
      var dL = dif.length();
      var dN = dif.normalize();

      var dist = dL - this.subAttractDist;
      var sign = dist >= 0 ? 1 : -1;

      if( isNaN( sign ) ){
        console.log( 'signNAN' );
      }

      var pow = Math.pow( Math.abs( dist ) , this.subAttractPow );

      if( isNaN( pow ) ){
        console.log( 'powNAN');
      }


      c1.velocity.add( dif.multiplyScalar( pow * sign / this.subAttractDiv ) ); 

      if( c1.velocity.length() >2 ){

        c1.velocity.normalize().multiplyScalar(2 );

      }
      c1.position.add( c1.velocity );
      
      var d1 = c1.velocity.clone().normalize();
      var d2 = this.position.clone().sub( c1.position.clone() ).normalize();

      c1.body.lookAt( c1.position.clone().add(d2) );

      c1.update();

    }
  }

  Fish.prototype.connect = function(){
    this.connected = true;
  }

  Fish.prototype.disconnect = function(){
    this.connected = false;
  }
