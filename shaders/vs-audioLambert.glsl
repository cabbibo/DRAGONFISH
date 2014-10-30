varying vec3 vNorm;
      
void main() {
  vNorm = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
