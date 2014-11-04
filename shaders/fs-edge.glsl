varying vec3 vNorm;
varying vec3 vEye;

void main(){

  float match = max( 0. , dot( vNorm , normalize(vEye) ) );

  vec3 c = vec3( 1.  );

  if( match < .5 ){


    c = vec3( 0. );

  }
  gl_FragColor = vec4( c, 1. );
  

}
