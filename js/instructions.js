


var instructionsMouseDown = false;
var instructionsMouseMove = false;
var instructionsComplete = false;
var instructionsCounter = 0;
var instructionsTimer  = 0;

var instructionsZMovementComplete = false;
var instructionsXYMovementComplete = false;


function addInstructions(){


  document.addEventListener( 'mousedown' , onMouseDown , false );
  document.addEventListener( 'mouseup' , onMouseUp , false );
  document.addEventListener( 'mousemove' , onMouseMove , false );

  function onMouseDown(){

    //console.log( 'INSTRUCTIONS MOUSE DOWN' );
    instructionsMouseDown = true;

    instructionsCounter = 0;

  }

  function onMouseUp(){

    //console.log( 'INSTRUCTIONS MOUSE UP' );
    instructionsMouseDown = false;

  }

  function onMouseMove(){

    //console.log( 'INTRUCTIONS MOUSE MOVE' );

    instructionsMouseMove = true;

    if( !instructionsXYMovementComplete ){

      xyMovementComplete();

    }

  }

}

function updateInstructions(){

/*  if( !instructionsComplete ){


    instructionsTimer += 1;

    if( instructionsTimer >= 5000 ){

      if( !instructionsXYMovementComplete ){

        addXYMovementInstructions();

      }else{


        if( !instructionsZMovementComplete ){

          addZMovementInstructions();

        }

      }


    }

    if( instructionsMouseDown ){

      instructionsCounter += 1;

      if( instructionsCounter >= 100 ){

        zMovementComplete();

      }

    }

  }*/

}

function zMovementComplete(){

  //console.log( 'zMovementComplete' );

  instructionsZMovementComplete = true;

  if( instructionsXYMovementComplete ){
    instructionsComplete = true;
  }

}

function xyMovementComplete(){

 // console.log( 'xyMovementComplete' );
  instructionsXYMovementComplete = true;

  if( instructionsZMovementComplete ){
    instructionsComplete = true;
  }

  intructionsTimer = 0;

}

