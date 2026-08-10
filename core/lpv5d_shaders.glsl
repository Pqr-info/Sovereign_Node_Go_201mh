#version 300 es
precision highp float;

// Input attributes from vertex shader
in vec3 v_cube_coord;      // Normalized spatial mapping [0.0 to 1.0] matching X, Y, Z coordinates
in float v_state_type;     // Decoded ternary state: -1.0 (Blue), 0.0 (Green), +1.0 (Red)
in float v_intensity;      // Velocity-mapped scalar intensity [0.0 to 1.0]
in float v_temporal_phi;   // Localized temporal drift scalar ($\Phi$) derived from Pitch Bend

// System Uniforms
uniform float u_time;               // Continuous clock for quantum noise orchestration
uniform vec2 u_resolution;          // Screen viewport constraints (X, Y)
uniform float u_global_drift_alpha; // Micro-alignment offset multiplier

// Output Fragment Buffer
out vec4 fragColor;

// --- High-Performance Deterministic Pseudo-Random Generator ---
float hash3D(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

// --- Coherent Noise Pass for Superposition Mapping ---
float proceduralNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smoothstep interpolation
    
    return mix(
        mix(mix(hash3D(i + vec3(0,0,0)), hash3D(i + vec3(1,0,0)), f.x),
            mix(hash3D(i + vec3(0,1,0)), hash3D(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash3D(i + vec3(0,0,1)), hash3D(i + vec3(1,0,1)), f.x),
            mix(hash3D(i + vec3(0,1,1)), hash3D(i + vec3(1,1,1)), f.x), f.y), 
        f.z
    );
}

void main() {
    // 1. Establish Baseline Core Emissive Palettes
    vec3 color_red   = vec3(1.0, 0.20, 0.20);   // #FF3333 High Valence Attraction Well
    vec3 color_blue  = vec3(0.20, 0.40, 1.0);   // #3366FF Low Valence Repulsion Node
    vec3 color_green = vec3(0.0, 1.0, 0.40);    // #00FF66 Quantum Superposition State
    
    vec3 final_rgb = vec3(0.0);
    float final_alpha = 1.0;
    
    // Normalized Screen UV Coordinates for vignette mathematics
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    // --- EVALUATION BRANCH 1: 🔴 RED (+1) ATTRACTION STATE ---
    if (v_state_type > 0.5) {
        // Calculate a structural spherical Fresnel ring inside the matrix node boundaries
        float center_dist = length(v_cube_coord - vec3(0.5));
        float fresnel = pow(1.0 - center_dist, 3.0);
        
        // Intensity dynamically scales the radius of the gravitational attraction glow
        float glow_boundary = smoothstep(0.0, 0.5 * v_intensity, fresnel);
        
        final_rgb = color_red * (fresnel + 0.3) * (v_intensity * 1.5);
        final_alpha = glow_boundary;
    }
    
    // --- EVALUATION BRANCH 2: 🔵 BLUE (-1) REPULSION / DECAY STATE ---
    else if (v_state_type < -0.5) {
        // Compute an inner procedural dark-energy collapse profile (inverse vignette)
        vec2 dist_center = uv - vec2(0.5);
        float radial_vignette = smoothstep(0.1, 0.8 * (1.0 - v_intensity), length(dist_center));
        
        // Blue node emits sharp bounding coordinates that wash out toward the viewport margins
        final_rgb = mix(color_blue * 0.4, color_blue * 1.2, radial_vignette);
        final_alpha = (1.0 - radial_vignette) * v_intensity;
    }
    
    // --- EVALUATION BRANCH 3: 🟢 GREEN (0) SUPERPOSITION STATE ---
    else {
        // High-frequency temporal flicker calculation
        // Modulates coordinates through the temporal drift scalar ($\Phi$) to shift patterns during desync
        vec3 noise_vector = v_cube_coord * 45.0 + vec3(0.0, 0.0, u_time * (25.0 + (v_temporal_phi * 50.0)));
        float phase_flicker = proceduralNoise(noise_vector);
        
        // Grounding events force noise to clamp down. Uncached cells violently fluctuate.
        float unstable_mask = step(0.45, phase_flicker) * step(phase_flicker, 0.55);
        
        final_rgb = color_green * (phase_flicker * 0.5 + 0.5);
        
        // Alpha spikes aggressively during desync, making high drift zones visually chaotic
        final_alpha = unstable_mask * (0.3 + abs(v_temporal_phi) * u_global_drift_alpha);
    }
    
    // 2. Final Fragment Pipeline Assignment
    fragColor = vec4(final_rgb, final_alpha);
}
