varying vec3 vNorm;
      
void main() {
  vNorm =normalize( normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
