
var NOTES = {};
var LOOPS = {};


var notes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
]


var loops = [
  "death",
]


function initAudio(){

  for( var i = 0; i < notes.length; i++ ){

    loader.beginLoading();
    var newName = 'audio/notes/' + notes[i] + '.mp3';
    var note = new LoadedAudio( audioController , newName , {
      looping:false 
    });

    NOTES['a'+notes[i]] = note;
 //   audioController.notes.push( note );
     
    note.onLoad = function(){
      this.endLoading();;
    }.bind( loader );


  }


    loader.beginLoading();
    var newName = 'audio/death.mp3';
    var note = new LoadedAudio( audioController , newName , {
      looping:true 
    });

    LOOPS['death'] = note;
 //   audioController.notes.push( note );
     
    note.onLoad = function(){
      this.endLoading();
    }.bind( loader );


}
