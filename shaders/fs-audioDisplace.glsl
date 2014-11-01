
uniform vec3 color;
uniform sampler2D t_audio;

$lightColors

varying vec3 vNorm;

void main(){

  vec3 fColor = lambertAudioLightColor( vNorm , t_audio );

  gl_FragColor = vec4( fColor + fColor* color , 1. );

}
