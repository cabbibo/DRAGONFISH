var shaders;

function initShaders(){

  shaders = new ShaderLoader('shaders');
  
  shaders.load( 'fs-floor'    , 'floor'   , 'fragment'    );
  shaders.load( 'vs-floor'    , 'floor'   , 'vertex'      );
  shaders.load( 'fs-sphere'   , 'sphere'  , 'fragment'    );
  shaders.load( 'vs-sphere'   , 'sphere'  , 'vertex'      );

  shaders.load( 'fs-simPos'   , 'posSim'  , 'simulation'  );
  shaders.load( 'fs-simVel'   , 'velSim'  , 'simulation'  );

  shaders.load( 'fs-render'   , 'render'  , 'fragment'    );
  shaders.load( 'vs-render'   , 'render'  , 'vertex'      );
  shaders.load( 'curlSim'   , 'curlSim' , 'simulation'  );


  loader.addToLoadBar();
  shaders.shaderSetLoaded = function(){
    loader.loadBarAdd();
  }

}


