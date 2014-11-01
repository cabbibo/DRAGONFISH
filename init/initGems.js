

var GEMS = {};

function initGems(){


  GEMS.level2 = new RepelerMesh( 'LEVEL 2' , new THREE.Mesh( GEOS.icosa5 ) , REPELERS , {

      soul:{
  
        noiseSize:{ type:"f" , value: 3. , constraints:[.0001 , .01] },
        noiseVariation:     { type:"f" , value: .1   , constraints:[.01 , 1.] },
        dampening:          { type:"f" , value: .9 , constraints:[.8 , .999] },
        noisePower:         { type:"f" , value: 1   , constraints:[0 , 200.] },
        returnPower:        { type:"f" , value: 3.   , constraints:[ .0 ,2. ] },
        audioVelMultiplier: { type:"f" , value: .8   , constraints:[ 0 , 1 ] },
    
      },
      
      body:{
      
        audioDisplacement:{ type:"f" , value : 0.0 ,  constraints:[ 0 , 100 ]},

        tmp_color1:{ type:"color" , value: 0xff0000 },
        tmp_color2:{ type:"color" , value: 0x00ffe1 },
        tmp_color3:{ type:"color" , value: 0x5500ff },

        lightDirections:  lightDirections,
        lightColors:      lightColors,
        
        color1:{ type:"c" , value : new THREE.Color( 0xff0000 ) },
        color2:{ type:"c" , value : new THREE.Color( 0x00ffe1 ) },
        color3:{ type:"c" , value : new THREE.Color( 0x5500ff ) },
      },

      //type:'points'

      
    });

    GEMS.level3 = new RepelerMesh( 'LEVEL 3' , new THREE.Mesh( GEOS.box50_50_50 ) , REPELERS , {

      soul:{
  
        noiseSize:{ type:"f" , value: 3. , constraints:[.0001 , .01] },
        noiseVariation:     { type:"f" , value: .1   , constraints:[.01 , 1.] },
        dampening:          { type:"f" , value: .9 , constraints:[.8 , .999] },
        noisePower:         { type:"f" , value: 1   , constraints:[0 , 200.] },
        returnPower:        { type:"f" , value: 3.   , constraints:[ .0 ,2. ] },
        audioVelMultiplier: { type:"f" , value: .8   , constraints:[ 0 , 1 ] },
    
      },
      
      body:{
      
        audioDisplacement:{ type:"f" , value : 0.0 ,  constraints:[ 0 , 100 ]},

        tmp_color1:{ type:"color" , value: 0xff0000 },
        tmp_color2:{ type:"color" , value: 0x00ffe1 },
        tmp_color3:{ type:"color" , value: 0x5500ff },

        lightDirections:  lightDirections,
        lightColors:      lightColors,
        
        color1:{ type:"c" , value : new THREE.Color( 0xff0000 ) },
        color2:{ type:"c" , value : new THREE.Color( 0x00ffe1 ) },
        color3:{ type:"c" , value : new THREE.Color( 0x5500ff ) },
      },

      //type:'points'

    }); 

     GEMS.level7 = new RepelerMesh( 'LEVEL 3' , new THREE.Mesh( GEOS.box50_50_50 ) , REPELERS , {

      soul:{
  
        noiseSize:{ type:"f" , value: 3. , constraints:[.0001 , .01] },
        noiseVariation:     { type:"f" , value: .1   , constraints:[.01 , 1.] },
        dampening:          { type:"f" , value: .9 , constraints:[.8 , .999] },
        noisePower:         { type:"f" , value: 1   , constraints:[0 , 200.] },
        returnPower:        { type:"f" , value: 3.   , constraints:[ .0 ,2. ] },
        audioVelMultiplier: { type:"f" , value: .8   , constraints:[ 0 , 1 ] },
    
      },
      
      body:{
      
        audioDisplacement:{ type:"f" , value : 0.0 ,  constraints:[ 0 , 100 ]},

        tmp_color1:{ type:"color" , value: 0xff0000 },
        tmp_color2:{ type:"color" , value: 0x00ffe1 },
        tmp_color3:{ type:"color" , value: 0x5500ff },

        lightDirections:  lightDirections,
        lightColors:      lightColors,
        
        color1:{ type:"c" , value : new THREE.Color( 0xff0000 ) },
        color2:{ type:"c" , value : new THREE.Color( 0x00ffe1 ) },
        color3:{ type:"c" , value : new THREE.Color( 0x5500ff ) },
      },

      //type:'points'

      
    }); 








}
