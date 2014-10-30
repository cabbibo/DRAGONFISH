uniform vec3 lightColors[6];
uniform vec3 lightDirections[6];


vec3 lambertLightColor( vec3 normToPass ){
  
  vec3 fColor = vec3( 0. );
  for( int i = 0; i < 6; i++ ){

    fColor += max( 0., dot( normToPass , normalize( lightDirections[i] ) )) * lightColors[i] * .5;

  }

  return fColor;

}

vec3 lambertAudioLightColor( vec3 normToPass , sampler2D audio ){
  
  vec3 fColor = vec3( 0. );
  for( int i = 0; i < 6; i++ ){

    float match =  dot( normToPass , normalize( lightDirections[i] ) );
    vec4 a = texture2D( audio , vec2( abs( sin(match*1.)) , 0. ) );
    fColor += max( 0. , match) *  a.xyz  * lightColors[i];

  }

  return fColor;

}
