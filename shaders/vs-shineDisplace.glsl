
uniform sampler2D t_audio;
uniform float displacement;
varying vec3 vNorm;
varying vec3 vEye;
varying vec3 vPos;    

void main() {
  vNorm =normalize( normalMatrix * normal);
  vec3 pos = position;
  pos += displacement * vNorm * length( pos )  * length( texture2D( t_audio , vec2(abs( vNorm.x) , 0. )) )/4.;
  vEye = cameraPosition - (modelMatrix * vec4( pos , 1. ) ).xyz;
  vPos = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.0 );
}
