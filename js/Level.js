/*

   TODO:
  
      Make a new MAT object that can easily create and keep track of all materials


  The Level does the following:

    - Begins Loading:
      - Handles loading of all the neccesary assests, including audio
      and models
      - called when previous level is initialized

    - Instansiate
      - Handles creation of neccesary meshes, including the creation of
      the path, creation of the crystal, creation of the skybox, creation
      of the stones, and creation of hook
      - called when finished loading

    - Initialize
      - Handles the adding of the objects to the scene that are neccesary
      to guide the user to the level, AKA, the Path, the Stones and the skybox
      -called when the previous level is completed

    - onStart
      - Handles adding hooks, and activating the level
      - Called when user reaches the center of this level and activates its crystal

    - Update
      - After the level is initialized, but not started, the update checks for
        removing the unused parts of the vertabrae, as well as looking for the
        distance to the crystal to see if it starts, and updates the path
      - Once the level is started, update takes care of updating all of the loops


*/
function Level( name , dragonFish , params ){

  this.name = name;
  this.params = params;

  this.newTypes = params.newTypes || [];
  this.oldTypes = params.oldTypes || [];


  this.dead = false;

  
  this.totalNeededToLoad = 0;
  this.totalLoaded = 0;
  this.fullyLoaded  = false;
  this.prepared     = false;
  this.crystalAdded = false;
  this.active = false;

http://cabbibo.github.io/learningRotations/
  this.startScore = 0;
  this.currentScore = 0;
  this.endScore = 0;
  this.length = 0;



  this.dragonFish = dragonFish;
  this.scene = new THREE.Object3D();

  this.scene.position = params.position;


  this.hooksOnDeck = [];

  this.hooks = [];

}





/*
 
   LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING 

*/

// Does the heavy lifting of Loading all the audio
Level.prototype.beginLoading = function(){


  for( var i = 0; i < this.params.path.notes.length; i++ ){

    this.loadNote(  this.params.path.notes[i] );

  }
 
  this.loadNote(  this.params.death.note );
  this.loadGeo(  this.params.death.geo );
  this.loadGeo(   this.params.path.markerGeo  );  
  this.loadNote(  this.params.note            ); 
  this.loadNote(  this.params.skybox.note     ); 
  this.loadGeo(   this.params.skybox.geo      );
  this.loadGeo(   this.params.crystal.geo     );
  this.loadGeo(   this.params.stones.geo     );

  for( var i = 0; i < this.newTypes.length; i++ ){

    // Loading Loops
    var loopName = this.newTypes[i].loop;
    this.loadLoop( loopName ); 
    // Loading Notes
    var noteName = this.newTypes[i].note;
    this.loadNote( noteName );

    // LoadingGeometry
    var geoName = this.newTypes[i].geo;
    this.loadGeo( geoName );

  }



}

Level.prototype.loadNote = function( noteName ){

  if( !NOTES[noteName] ){
   
    NOTES[noteName] == 'LOADING';

    var newName = 'audio/notes/' + noteName + '.mp3';

    this.totalNeededToLoad ++;
    var note = new LoadedAudio( audioController , newName ,{
      looping: false
    });

    var nn2 = noteName;
    note.onLoad = function(){
      this.onLoad();
    }.bind( this );

    NOTES[ noteName ] = note;

  }

}

Level.prototype.loadLoop = function( loopName ){
    
  if( !LOOPS[loopName] ){
     
    LOOPS[loopName] == 'LOADING';

    var newName = 'audio/loops/' + loopName + '.mp3';

    this.totalNeededToLoad ++;
    var loop = new LoadedAudio( audioController , newName ,{
      looping: true
    });

    loop.onLoad = function(){
      this.onLoad();
    }.bind( this );

    LOOPS[ loopName ] = loop;

  }

}

Level.prototype.loadGeo = function( geoName ){
 
  if( typeof geoName !== 'string' ){

    console.log( 'not a name' );
    return;

  }
  if( geoName && !GEOS[geoName] ){
    
    GEOS[geoName] == 'LOADING';
    var newName = 'models/' + geoName + '.obj'; 
    this.totalNeededToLoad ++;

    loader.OBJLoader.load( newName , function( object ){
      object.traverse( function ( child ) {
          if ( child instanceof THREE.Mesh ) {
            GEOS[geoName] = child.geometry;       
          }
      });

      this.onLoad();

    }.bind( this ));

  }

}



Level.prototype.onLoad = function(){
  
  this.totalLoaded ++;

  if( this.totalLoaded == this.totalNeededToLoad ){

    this.fullyLoaded = true;

    this.instantiate();

  }

}



/*

   INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE INSTANTIATE 

*/


Level.prototype.instantiate = function(){


  this.note = NOTES[ this.params.note ];
  

  for( var  i = 0; i < this.newTypes.length; i++ ){

    var loop = LOOPS[ this.newTypes[i].loop ];
    var note = NOTES[ this.newTypes[i].note ];
    var geo  = GEOS[  this.newTypes[i].geo  ];

    var hooks = this.newTypes[i].instantiate( this , this.dragonFish, note ,loop , geo );

    for( var j = 0; j < hooks.length; j++ ){

      this.hooksOnDeck.push( hooks[j] );

    }

  }


  looper.onNextLoop( this.startLoops.bind( this ) );

  // TODO
  /*
    this.createStones();
  */
 
  this.createDeath();
  this.createStones();
  this.createCrystal();
  this.createSkybox();
  this.createPath();

  this.prepared = true;

  this.onPrepared();
}



Level.prototype.onPrepared = function(){}

Level.prototype.startLoops = function(){

  for( var i = 0; i < this.newTypes.length; i++ ){

    var loop = LOOPS[ this.newTypes[i].loop ];

    if( !loop.playing ){

      loop.play();
      loop.gain.gain.value = 0;

    }


  }

}


Level.prototype.createStones = function(){

  this.stones = this.params.stones.init( GEOS[ this.params.stones.geo ] )

}

Level.prototype.createDeath = function(){

  this.death = {};
  this.death.note = NOTES[ this.params.death.note ];
  this.death.geo = GEOS[ this.params.death.geo ];
  this.death.mat = MATS[ this.params.death.mat ].clone();
  this.death.mat.color= new THREE.Color( this.params.death.color );

  this.death.mesh = new THREE.Mesh( this.death.geo , this.death.mat );
  this.death.mesh.scale.multiplyScalar( this.params.death.scale );

  this.death.mesh.position = this.params.death.position;


}
Level.prototype.createSkybox = function(){

  var g = GEOS[this.params.skybox.geo];
  
  this.skybox = this.params.skybox.init( g );

}

Level.prototype.createCrystal = function(){

  var g = this.params.crystal.geo;

  // Overwrite if its a loaded geo 
  if( typeof this.params.crystal.geo === 'string' ){
    g = GEOS[this.params.crystal.geo];
  }
  var m = this.params.crystal.mat;

  this.crystal = new THREE.Mesh( g , m );
  this.crystal.scale.multiplyScalar( this.params.crystal.scale );

  this.crystal.size = this.params.crystal.size || 3;
  if( this.params.crystal.rotation ){
    console.log('sasda' );
    console.log( this.crystal.rotation );
    console.log( this.params.crystal.rotation );
    this.crystal.rotation.copy( this.params.crystal.rotation );
    /*console.log( this.crystal.rotation );
    var object = new THREE.Object3D();
    object.add( this.crystal );
    this.crystal = object ;*/


  }
}

Level.prototype.createPath = function(){

  var oPos;
  if( this.oldLevel ){
    oPos = this.oldLevel.scene.position;
  }else{
    oPos = new THREE.Vector3();
  }

  var pos = this.scene.position;

  var pathGeo = this.params.path.createGeometry( oPos , pos );

  var markers = [];

  for( var i = 0; i < pathGeo.vertices.length; i++ ){

  
    var g = GEOS[this.params.path.markerGeo];
    var m = this.params.path.markerMat;
    var mesh = new THREE.Mesh( g , m );

    mesh.position = pathGeo.vertices[i];

    mesh.scale.multiplyScalar( this.params.path.markerScale );

    if( i == pathGeo.vertices.length -1 ){

      mesh.scale.multiplyScalar( .01 );

    }
    markers.push( mesh );

  }

  var notes = [];
  for( var i = 0; i < this.params.path.notes.length; i++ ){

    var note = NOTES[ this.params.path.notes[i] ];
    notes.push( note );

  }
  this.path = {};

  this.path.notes = notes;
  this.path.update = this.params.path.update;
  this.path.scene = this.scene;
  this.path.dragonFish = this.dragonFish;
  this.path.guides = this.params.path.createGuides();
  this.path.markers = markers;

  console.log( 'NOTESSs' );
  console.log( this.path.notes );

}







/*
 

   INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION INITIALIZATION   


*/


Level.prototype.initialize = function(){

  scene.add( this.scene );

  if( !this.fullyLoaded || !this.prepared ){

    console.log( 'TOTALLY FUCKED' );

  }else{

    this.startScore   = SCORE;
    this.currentScore = 0;
    this.length       = this.hooksOnDeck.length;

    this.addPath();
    this.addSkybox();
    this.prepareVertabraeForDestruction();

    this.scene.add( this.crystal );
    this.scene.add( this.stones );
    this.crystalAdded = true;


    if( this.nextLevel ){

      this.nextLevel.beginLoading();
    }

  }


}


Level.prototype.prepareVertabraeForDestruction = function(){

  var from;

  if( this.oldLevel ){
   from = this.oldLevel.scene.position.clone();
  }else{
    from = new THREE.Vector3();
  }
  this.distanceFromPreviousLevel = from.sub( this.scene.position ).length();
    //TODO: Make sure this works
  // Remove any unnecchesary hooks
  for( var i = 0; i < this.dragonFish.spine.length; i++ ){

    var verta = this.dragonFish.spine[i];
    var saved = false;

    if( verta.type === 'alwaysSafe' ){
      saved = true;
    }
    for( var j = 0; j < this.oldTypes.length; j++ ){

      console.log('VERTA TYPE' );
      console.log( verta.type );
      if( verta.type == this.oldTypes[j] ){
        saved = true;      
      }
    }

    if( !saved ){

      console.log( 'NOT SAVED' );
        verta.percentToDestruction = Math.random();
        //this.dragonFish.removeVertabraeById( i );
        
    }else{

      console.log( 'SAVED' );

    }

  }

}

Level.prototype.addSkybox = function(){

  var marker = this.skybox;

  this.scene.add( marker );

  
    marker.init = { scale: 0 };
    marker.target = { scale: marker.scale.x };

    var tween = new TWEEN.Tween( marker.init ).to( marker.target , 500 );

    tween.easing( TWEEN.Easing.Quartic.In )
  
    tween.marker = marker;
    tween.note   = NOTES[ this.skybox.note ];

    tween.onUpdate( function(){

      this.scale.x = this.init.scale;
      this.scale.y = this.init.scale;
      this.scale.z = this.init.scale;

    }.bind( marker ));

    tween.onComplete( function(){
      tween.note.play();
    }.bind( tween ));

    tween.start();

}


Level.prototype.addPath = function(){


  for( var i = 0; i < this.path.guides.length; i++ ){

    scene.add( this.path.guides[i] );

  }

  for( var  i = 0; i < this.path.markers.length; i++ ){

    var marker = this.path.markers[i];

    scene.add( marker );

  
    marker.init = { scale: 0 };
    marker.target = { scale: marker.scale.x };

    var tween = new TWEEN.Tween( marker.init ).to( marker.target , (i+1) * 1000 );

    tween.easing( TWEEN.Easing.Quartic.In )
  
    tween.marker = marker;
    tween.note   = this.path.note;

    tween.onUpdate( function(){

      this.scale.x = this.init.scale;
      this.scale.y = this.init.scale;
      this.scale.z = this.init.scale;

    }.bind( marker ));

    tween.onComplete( function(){
      //tween.note.play();
    }.bind( tween ));

    tween.start();



  }

}





/*

   START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START START 

*/


Level.prototype.onStart = function(){

  // puts the crystal on the head of the dragonfish
  scene.remove( this.crystal );

  // out with the old, in with the new
  if( this.oldLevel ){
    dragonFish.leader.body.remove( this.oldLevel.crystal );
    this.oldLevel.removeSkybox();
    this.oldLevel.removeStones();
  }

  dragonFish.leader.body.add( this.crystal );

  this.note.play();

  this.removePath();

  this.checkForNewHooks( this.currentScore );

  this.startHooks();
  this.startDeath();

  this.active = true;

}


Level.prototype.startDeath = function(){

  console.log( 'hello' );
  for( var i= 0; i < deathDragon.leader.body.children.length; i++){

    console.log( 'EHSA');
    var c = deathDragon.leader.body.children[i];
    deathDragon.leader.body.remove( c );

  }
  deathDragon.leader.body.add( this.death.mesh );



}
Level.prototype.startHooks = function(){


  for( var i =0; i < this.hooks.length; i++ ){

    var hook = this.hooks[i];

    hook.activate();
    this.dragonFish.addToScene( hook.vertabrae );

  }


}

Level.prototype.removeSkybox = function(){

    var marker = this.skybox;

    scene.add( marker );

  
    marker.init = { scale: marker.scale.x };
    marker.target = { scale: 0 };

    var tween = new TWEEN.Tween( marker.init ).to( marker.target , 1000 );

    tween.easing( TWEEN.Easing.Quartic.In )
  
    tween.marker = marker;
    tween.note   = this.path.note;

    tween.onUpdate( function(){

      this.scale.x = this.init.scale;
      this.scale.y = this.init.scale;
      this.scale.z = this.init.scale;

    }.bind( marker ));

    tween.onComplete( function(){
      scene.remove( this ); 
    }.bind( marker ));

    tween.start();




}

Level.prototype.removeStones = function(){

  this.scene.remove( this.stones );

}

//TODO:
//Not ACtually removing?
Level.prototype.removePath = function(){


  for( var  i = 0; i < this.path.markers.length; i++ ){

    var marker = this.path.markers[i];

    marker.init = { scale: marker.scale.x };
    marker.target = { scale: 0 };

    var tween = new TWEEN.Tween( marker.init ).to( marker.target , (i+1) * 300 );

    tween.easing( TWEEN.Easing.Quartic.In )
  
    tween.marker = marker;
    tween.note   = this.path.note;

    tween.onUpdate( function(){

      this.scale.x = this.init.scale;
      this.scale.y = this.init.scale;
      this.scale.z = this.init.scale;

    }.bind( marker ));

    tween.onComplete( function(){
      scene.remove( this ); 
    }.bind( marker ));

    tween.start();


  }

  for( var  i = 0; i < this.path.guides.length; i++ ){

    var marker = this.path.guides[i];

    marker.init = { scale: marker.scale.x };
    marker.target = { scale: 0 };

    var rand = Math.random() * .1 + .9;

    var tween = new TWEEN.Tween( marker.init ).to( marker.target , 1000 );

    tween.easing( TWEEN.Easing.Quartic.In )
  
    tween.marker = marker;
    tween.note   = this.path.note;

    tween.onUpdate( function(){

      this.scale.x = this.init.scale;
      this.scale.y = this.init.scale;
      this.scale.z = this.init.scale;

    }.bind( marker ));

    tween.onComplete( function(){
      scene.remove( this ); 
    }.bind( marker ));

    tween.start();

  }

}




/*


   UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE  
*/


Level.prototype.update = function(){


  if( this.crystalAdded === true && this.active === false ){
  
    this.path.update.bind( this.path );//.bind( this );
    this.path.update();
    this.checkVertabraeForDestruction();

    var dif = this.scene.position.clone().sub( this.dragonFish.leader.position );
  
    if( dif.length() <= this.crystal.size ){

      this.onStart();

    }

  }

  if( this.active ){

    this.updateHooks();

  }

}

Level.prototype.checkVertabraeForDestruction = function(){


  var from = this.dragonFish.leader.position.clone();
  var dif = from.sub( this.scene.position );


  
  var length = 1 - dif.length() / this.distanceFromPreviousLevel;
  var percentToLocation = length; 
  for( var i = 0; i < this.dragonFish.spine.length; i++ ){

   var verta = this.dragonFish.spine[i];

   if( percentToLocation > verta.percentToDestruction ){

     console.log( 'VERTA REMOVED' );
     console.log( verta.percentToDestruction );
     this.dragonFish.removeVertabraeById( i );
     i--;


   }


  }

}

Level.prototype.updateHooks = function(){

  for( var i = 0; i < this.hooks.length; i++ ){
    this.hooks[i].updateForces( this );
  }

  for( var i= 0; i < this.hooks.length; i++ ){

    this.hooks[i].updatePosition();
    this.hooks[i].checkForCollision( 2 , i );
  }

  //console.log( this.hooks[0].position.x );
  
  if( !paused ){
    this.dragonFish.update();
  }

}

/*
 
   HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS HOOK EVENTS 

*/

// Check to see if we should put any more hooks into circulation
Level.prototype.onHook = function( index , hook ){


  SCORE ++;

  this.currentScore = SCORE - this.startScore;

  this.percentComplete = this.currentScore / this.length;

  this.checkForNewHooks( this.currentScore );

  document.getElementById( 'hookCount' ).innerHTML = SCORE;

  hook.explode();

  this.hooks.splice( index , 1 );

  if( this.percentComplete == 1 ){

    this.onComplete();

  }


}



Level.prototype.checkForNewHooks = function( score ){

  for( var i = 0; i < this.hooksOnDeck.length; i++ ){

    var hook = this.hooksOnDeck[i];

    if( hook.startScore <= score ){

      this.hooksOnDeck.splice( i , 1 );
      this.hooks.push( hook );

      hook.activate();
      this.dragonFish.addToScene( hook.vertabrae );

      i--;

    
    }


  }
}


Level.prototype.onDeath = function(){

  if( !this.dead ){
    
    this.dead = true;
    this.death.note.play();

    if( this.dragonFish.spine[0] ){
     this.dragonFish.removeVertabraeById( 0 );
    }

    setTimeout( function(){

      this.dead = false;

    }.bind( this ) , 1000 );

  }

}


Level.prototype.onComplete = function(){

  console.log( 'MUTHAFUCKIN COMPLETE' );
  //TODO:
  //PLAY FINISH NOISE

  if( this.nextLevel ){
    this.nextLevel.initialize();
    CURRENT_LEVEL ++;
    
  }else{

    this.endGame();
    console.log( 'TODO: FINISH GAME' );

  }

}

Level.prototype.endGame = function(){
    document.getElementById( 'hookCount' ).innerHTML = 'YOU WON';
}

Level.prototype.onEnd = function(){


}



/*
    
    - New Hooks - instantiate
    - Clear Hooks - clear all of the unneed hooks that are part of the dragonfish
    - Skybox - Object needs to be loaded
    - Pathway - some sort of representation of how to get to the next level
    - level complete Noise


*/

