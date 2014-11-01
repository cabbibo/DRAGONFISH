
uniform vec3 color;
uniform float normalScale;
uniform float texScale;
uniform sampler2D t_audio;
uniform sampler2D t_normal;

$lightColors
$triplanarMap

varying vec3 vNorm;
varying vec3 vEye;
varying vec3 vPos;
void main(){

  vec3 norm = triplanarMap( vNorm , vPos , t_normal , normalScale , texScale );
  vec3 fColor = shineAudioLightColor( norm , normalize( vEye ) ,  t_audio , 1. );


  gl_FragColor = vec4( fColor + fColor* color  , 1. );
  //gl_FragColor = vec4( abs(norm) , 1. );

}
