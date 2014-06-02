	uniform sampler2D textureMap;
    uniform sampler2D normalMap;
    uniform vec3 color;
    uniform float normalScale;
    uniform float texScale;
    uniform float useSSS;
    uniform float useScreen;
    uniform float time;
    uniform vec3 center;

    varying vec3 vNormal;
    varying vec4 vPosition;
    varying vec4 vOPosition;
	varying vec3 vONormal;
	varying vec3 vU;
    varying vec3 vEye;
    varying float vDisplacement;

	float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

    void main() {

        vec3 n = normalize( vONormal.xyz );
        vec3 blend_weights = abs( n );
        blend_weights = ( blend_weights - 0.2 ) * 7.;  
        blend_weights = max( blend_weights, 0. );
        blend_weights /= ( blend_weights.x + blend_weights.y + blend_weights.z );

        vec3 dFromCenter = vPosition.xyz - center;
        vec2 coord1 = vPosition.yz * texScale;
        vec2 coord2 = vPosition.zx * texScale;
        vec2 coord3 = vPosition.xy * texScale;

        vec3 bump1 = texture2D( normalMap, coord1 + vec2( time * .1 , time * .2 ) ).rgb;  
        vec3 bump2 = texture2D( normalMap, coord2 + vec2( time * .13 , time * .083 ) ).rgb;  
        vec3 bump3 = texture2D( normalMap, coord3 + vec2( time * .05 , time * .15 ) ).rgb; 

        vec3 blended_bump = bump1 * blend_weights.xxx +  
                            bump2 * blend_weights.yyy +  
                            bump3 * blend_weights.zzz;

        vec3 tanX = vec3( vNormal.x, -vNormal.z, vNormal.y);
        vec3 tanY = vec3( vNormal.z, vNormal.y, -vNormal.x);
        vec3 tanZ = vec3(-vNormal.y, vNormal.x, vNormal.z);
        vec3 blended_tangent = tanX * blend_weights.xxx +  
                               tanY * blend_weights.yyy +  
                               tanZ * blend_weights.zzz; 

        vec3 normalTex = blended_bump * 2.0 - 1.0;
        normalTex.xy *= normalScale;
        normalTex.y *= -1.;
        normalTex = normalize( normalTex );
        mat3 tsb = mat3( normalize( blended_tangent ), normalize( cross( vNormal, blended_tangent ) ), normalize( vNormal ) );
        vec3 finalNormal = tsb * normalTex;

        vec3 r = reflect( normalize( vU ), normalize( finalNormal ) );
        float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z + 1.0 ) );
        vec2 calculatedNormal = vec2( r.x / m + 0.5,  r.y / m + 0.5 );

        vec3 base = texture2D( textureMap, calculatedNormal ).rgb;

		float rim = 1.75 * max( 0., abs( dot( normalize( vNormal ), normalize( -vOPosition.xyz ) ) ) );
		base += useSSS * color * ( 1. - .75 * rim );
		base += ( 1. - useSSS ) * 10. * base * color * clamp( 1. - rim, 0., .15 );

		if( useScreen == 1. ) {
			base = vec3( 1. ) - ( vec3( 1. ) - base ) * ( vec3( 1. ) - base );
		}

		float nn = .05 * random( vec3( 1. ), length( gl_FragCoord ) );
        base += vec3( nn );

        float distance = min( 1.0 , 5. / length( vPosition.xy ) );



        gl_FragColor = vec4( vec3( 3.0 , .8 , 0.0 ) * base.rgb * distance *distance* abs((vDisplacement)/4.), distance *distance  );

       // gl_FragColor = vec4(normalize(( base.rgb * 5.5 )+vec3( 3.0 , .8 , 0.0 ) *vDisplacement *distance),  1. );


        //gl_FragColor = vec4( vec3( .6 , .3,.1) + ( .1 * vDisplacement ) * base.rgb * 20. / length(abs(dFromCenter)),  .1 );


       // gl_FragColor = vec4( 1.0 , 1.0 , 1.0, .1 );


    }

