
uniform vec3 color;
uniform sampler2D t_audio;

$lightColors

varying vec3 vNorm;

void main(){

 
  vec4 c = texture2D( t_audio , vec2( abs( vNorm.x ) , 0.) );
  gl_FragColor = vec4( .1 ) + c;

}
