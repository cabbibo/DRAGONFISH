uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_og;

uniform float dT;
uniform float timer;

uniform float velocity;

uniform mat4 uModel;

varying vec2 vUv;

void main(){

  vec3 pos = texture2D( t_pos , vUv.xy ).xyz;
  vec3 oPos = texture2D( t_oPos , vUv.xy ).xyz;
  vec3 ogPos = texture2D( t_og , vUv.xy ).xyz;

  vec3 vel = pos - oPos;


  ogPos = ( uModel * vec4( ogPos , 1. ) ).xyz;

  vec3 dif = pos - ogPos;
  //vel += dif  * .1;
  vel *= .9;

  vec3 center = (uModel * vec4( vec3( 0.) , 1. ) ).xyz;


  vec3 newPos = pos;// + vel * dT; 

  gl_FragColor = vec4( ( newPos - center ) , 1. );


}
