uniform sampler2D t_audio;
uniform float displacement;
varying vec3 vNorm;
      
void main() {
  vNorm =normalize( normalMatrix * normal);
  vec3 pos = position;

  vec3 n =  texture2D(t_audio , vec2( abs( vNorm.x ),0.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( (position * (1. + displacement * (-1. + length( n )))), 1.0 );
}
