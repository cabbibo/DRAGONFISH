
uniform sampler2D lightMap;


uniform vec3 uVel;
uniform vec3 uPos;

uniform vec3 color;
varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vVel;

varying vec4 vAudio;
varying vec4 vAudio1;
	

varying vec3 vLightFront;
varying vec3 vLightBack;

    
void main(){


  vec3 c =vec3( vAudio.x , cos( vAudio.z  * 3.14), sin( vAudio.y * 10. ));
  //vec3 c2 = c * vec3( 1.0 , .5 , 0.0 );

  float r = abs(sin((vAudio.x - vAudio.y) * 2. * 3.14));
  float g = abs(sin((vAudio.y - vAudio.z) * 2. * 3.14));
  float b = abs(sin((vAudio.z - vAudio.w) * 2. * 3.14));
  float a = abs(sin((vAudio.w - vAudio.x) * 2. * 3.14));

 // r =r+ abs(sin((vAudio1.x - vAudio1.y) * 2. * 3.14));
 //g =g+ abs(sin((vAudio1.y - vAudio1.z) * 2. * 3.14));
 //b =b+ abs(sin((vAudio1.z - vAudio1.w) * 2. * 3.14));
 a = abs(sin((vAudio1.w - vAudio1.x) * 2. * 3.14));

  gl_FragColor= vec4( .7 *normalize(vec3(r,g,b)) ,a*.1);


  gl_FragColor.xyz *= vec3( .1 , .6 , .5 );
 // gl_FragColor = vec4( 1.0 , vLightBack.xy , 1.0 );

  gl_FragColor = vec4( normalize(vAudio1+vAudio).xyz * color , vAudio.x * vAudio1.x );
}
