
uniform sampler2D t_audio;
uniform float displacement;
varying vec3 vNorm;
     

void main() {
  vNorm =normalize( normalMatrix * normal);
  vec3 pos = position;
  pos += displacement * vNorm * length( pos )  * length( texture2D( t_audio , vec2(abs( vNorm.x) , 0. )) )/4.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.0 );
}
