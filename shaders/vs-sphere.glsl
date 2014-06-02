
uniform vec3 uVel;
uniform vec3 uPos;
uniform sampler2D t_audio;
uniform float audioLookup;
uniform float time;

varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vVel;

varying vec4 vAudio;
varying vec4 vAudio1;

$simplex
void main(){


  vec3 pos = position;

  float z = pos.z;

  float n = snoise( normalize( normal ) + time );

  float vN = snoise( uPos * .1 );




  float sect = 10. * 3.14159; // * (1.+.3* vN);

  vAudio = texture2D( t_audio , vec2( abs( sin( uv.x * sect )) , 0.0 ) );
  //vAudio1 = texture2D( t_audio , vec2( abs( sin( uv.y * sect )) , 0.0 ) );


  vAudio1 = texture2D( t_audio ,vec2( abs( sin( uv.y * sect )),0.0) );

  float ring = vAudio1.r;
   //pos *= .8 * pos.y + .5 * (  1.* vAudio.x * pos.y * ring ) + n/4.;
 
   pos.xyz *= .4 + ring * pos.y;//.1 + ring * pos.y;

   pos.y += vAudio.x;
   pos *= 1.;
   vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

  gl_Position = projectionMatrix * mvPos;



}
