
uniform vec3 color;
uniform sampler2D t_audio;
uniform sampler2D t_sem;
uniform sampler2D t_normal;
uniform float normalScale;
uniform float texScale;

$lightColors
$semLookup
$triplanarMap


varying vec3 vNorm;
varying vec3 vEye;
varying vec3 vPos;

void main(){

  vec3 norm = triplanarMap( vNorm , vPos , t_normal , normalScale , texScale );
  
  //vec3 fColor = lambertAudioColor( norm , t_audio );
  vec3 fColor = texture2D( t_audio, vec2( abs( vNorm.x) , 0. ) ).xyz;
 // fColor *= texture2D( t_audio, vec2( abs( norm.y) , 0. ) ).xyz;

  vec2 sem = semLookup( norm , normalize(vEye) );

  vec4 cSEM = texture2D( t_sem , sem );


  gl_FragColor =vec4( 1.5 * (norm * .5 + .5 ) *  fColor ,1.);


}
