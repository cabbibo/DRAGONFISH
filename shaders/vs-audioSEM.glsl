uniform sampler2D t_loop;
uniform float displacement;

varying vec3 vNorm;
     
varying vec3 vEye;
varying vec3 vPos;


void main() {

  vNorm =normalize( normalMatrix * normal);
  vec4 a = texture2D( t_loop , vec2( abs( vNorm.x ) , 0. ));

  vec3 pos = position;

  //pos += normal * length( a ) * displacement;

  vPos = pos;
  vEye = cameraPosition -( modelMatrix * vec4( pos , 1. ) ).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
