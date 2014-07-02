uniform vec3 to;
uniform vec3 from;
uniform sampler2D t_audio;
uniform float time;

varying vec3 vPos;
varying vec4 vAudio;

void main(){


  vec3 line = to-from;

  float lookup = mod( position.x * 2000. , 3. );
  vec4 audioPower = texture2D( t_audio , vec2( lookup/3. , 0. ) );
  vAudio = audioPower;

  vec3 dirNorm = normalize( line );

  vec3 upVector = vec3( 0. , 0. , 1. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3 upVectorPara = upVectorProj * dirNorm;
  vec3 upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );

  float theta = position.x * 20. * 3.14195;
 
  float x = cos( theta );
  float y = sin( theta );

  float r =  audioPower.x * audioPower.y * audioPower.z * 1.;

  vPos = ( position.x * line ) + from;

  vPos += ( r * x * basisX ) + ( r * y * basisY );

  //gl_Linewidth = 5.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );



}

