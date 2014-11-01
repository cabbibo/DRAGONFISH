varying vec3 vNorm;
     
varying vec3 vEye;

void main() {
  vNorm =normalize( normalMatrix * normal);
  vEye = cameraPosition -( modelMatrix * vec4( position , 1. ) ).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
