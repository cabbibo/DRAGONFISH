varying vec3 vNorm;
varying vec3 vEye;
void main(){

  vNorm = normalMatrix * normal;

  vec3 mPos = ( modelMatrix * vec4( position , 1. ) ).xyz;
  vEye = mPos - cameraPosition; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position , 1. );

}
