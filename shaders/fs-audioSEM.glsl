
uniform vec3 color;
uniform sampler2D t_audio;
uniform sampler2D t_sem;

$lightColors
$semLookup

varying vec3 vNorm;
varying vec3 vEye;

void main(){

  vec3 fColor = lambertAudioColor( vNorm , t_audio );
  vec2 sem = semLookup( vNorm , normalize(vEye) );

  vec4 cSEM = texture2D( t_sem , sem );

  gl_FragColor =cSEM * 1.5 * vec4( vNorm * .5 + .8 , 1.) * vec4(  fColor , 1. );


}
