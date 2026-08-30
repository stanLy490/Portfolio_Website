const fragmentShader = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    const int Maxstep = 100;
    const float Mindist = 0.01;
    const float Maxdist = 100.0;
    const float Surfdist = 0.1;

    // [你原来的所有GLSL函数保持不变]
    float random3d(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }
    
    float noise3d(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n000 = random3d(i);
        float n100 = random3d(i + vec3(1.0, 0.0, 0.0));
        float n010 = random3d(i + vec3(0.0, 1.0, 0.0));
        float n110 = random3d(i + vec3(1.0, 1.0, 0.0));
        float n001 = random3d(i + vec3(0.0, 0.0, 1.0));
        float n101 = random3d(i + vec3(1.0, 0.0, 1.0));
        float n011 = random3d(i + vec3(0.0, 1.0, 1.0));
        float n111 = random3d(i + vec3(1.0, 1.0, 1.0));
        
        float nx00 = mix(n000, n100, f.x);
        float nx01 = mix(n001, n101, f.x);
        float nx10 = mix(n010, n110, f.x);
        float nx11 = mix(n011, n111, f.x);
        
        float nxy0 = mix(nx00, nx10, f.y);
        float nxy1 = mix(nx01, nx11, f.y);
        
        return mix(nxy0, nxy1, f.z);
    }
    
    float fbm3d(vec3 p) {
        float v = 0.0;
        float a = 0.6;
        for (int i = 0; i < 6; ++i) {
            v += a * noise3d(p);
            p = p * 2.4 + vec3(0.3, 0.5, 0.7);
            a *= 0.48;
        }
        return v;
    }
    
    float detailNoise(vec3 p) {
        return noise3d(p * 8.0) * 0.3 + noise3d(p * 16.0) * 0.15;
    }
    
    float craterPattern(vec3 p) {
        float n = fbm3d(p * 2.5);
        n = n - 0.5;
        float crater = -pow(max(0.0, -n), 2.0) * 0.4;
        return crater;
    }

    float getDist(vec3 p) {
        vec3 basePos = vec3(0.0, 0.0, 5.0);
        vec3 localP = p - basePos;
        
        float d1 = length(localP - vec3(0.7, 0.2, 0.1)) - 1.0;
        float d2 = length(localP - vec3(-0.5, -0.4, 0.3)) - 1.2;
        float d3 = length(localP - vec3(0.2, 0.8, -0.4)) - 0.7;
        float d4 = length(localP - vec3(-0.1, -0.6, -0.3)) - 1.1;
        float d5 = length(localP - vec3(0.4, -0.5, 0.7)) - 0.9;
        
        float k = 0.8;
        float d = d1;
        
        float h = clamp(0.5 + 0.5 * (d2 - d) / k, 0.0, 1.0);
        d = mix(d, d2, h) - k * h * (1.0 - h);
        
        h = clamp(0.5 + 0.5 * (d3 - d) / k, 0.0, 1.0);
        d = mix(d, d3, h) - k * h * (1.0 - h);
        
        h = clamp(0.5 + 0.5 * (d4 - d) / k, 0.0, 1.0);
        d = mix(d, d4, h) - k * h * (1.0 - h);
        
        h = clamp(0.5 + 0.5 * (d5 - d) / k, 0.0, 1.0);
        d = mix(d, d5, h) - k * h * (1.0 - h);
        
        float largeBumps = fbm3d(p * 1.2) * 0.35;
        float mediumDetail = fbm3d(p * 3.5) * 0.18;
        float smallDetail = detailNoise(p) * 0.12;
        float craters = craterPattern(p);
        float sharpFeatures = (noise3d(p * 12.0) - 0.5) * 0.08;
        
        d += largeBumps + mediumDetail + smallDetail + craters + sharpFeatures;
        
        return d;
    }
    
    float rayMarching(vec3 ori, vec3 dir) {
        float d = Mindist;
        for(int i = 0; i < Maxstep; i++) {
            vec3 p = ori + dir * d;
            float d1 = getDist(p);
            d += d1;
            if(d > Maxdist || d1 < Mindist) break;
        }
        return d;
    }

    vec3 getNormal(vec3 p) {
        float d = getDist(p);
        vec2 e = vec2(0.001, 0.0);
        vec3 n = d - vec3(
            getDist(p - e.xyy),
            getDist(p - e.yxy),
            getDist(p - e.yyx)
        );
        return normalize(n);
    }
    
    float getLight(vec3 p, vec3 lightPos) {
        vec3 l = normalize(lightPos - p);
        vec3 n = getNormal(p);
        
        float diffuse = clamp(dot(n, l), 0.0, 1.0);
        float roughness = noise3d(p * 10.0) * 0.3 + 0.7;
        diffuse *= roughness;
        
        vec3 shadowOri = p + n * Surfdist * 2.0;
        float shadowDist = rayMarching(shadowOri, l);
        
        if(shadowDist < length(lightPos - p) * 0.95) {
            diffuse *= 0.15;
        }
        
        return diffuse;
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        
        vec3 camPos = vec3(0.0, 1.0, 2.0);
        vec3 lookAt = vec3(0.0, 0.0, 5.0);
        
        vec3 forth = normalize(lookAt - camPos);
        vec3 right = normalize(cross(vec3(0, 1, 0), forth));
        vec3 up = cross(forth, right);
        
        vec3 rayDir = normalize(forth + uv.x * right + uv.y * up);
        
        vec3 lightPos = vec3(4.0 * sin(iTime * 1.2), 5.0, 5.0 + 4.0 * cos(iTime * 1.2));
        
        float d = rayMarching(camPos, rayDir);
        
        vec3 col = vec3(0.0);
        
        if (d < Maxdist) {
            vec3 p = camPos + rayDir * d;
            float dif = getLight(p, lightPos);
            
            vec3 baseColor = vec3(0.85, 0.82, 0.78);
            float colorVar = noise3d(p * 5.0) * 0.15;
            baseColor += vec3(colorVar);
            
            col = baseColor * dif;
            
            vec3 viewDir = normalize(camPos - p);
            vec3 lightDir = normalize(lightPos - p);
            vec3 n = getNormal(p);
            vec3 halfDir = normalize(viewDir + lightDir);
            float spec = pow(max(dot(n, halfDir), 0.0), 8.0) * 0.3;
            col += spec;
        }

        gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
    }
`;

// ============ 超简化的JS部分 ============
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

// 编译shader的辅助函数
function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

// 创建program
const program = gl.createProgram();
gl.attachShader(program, compileShader(gl.VERTEX_SHADER, 
    'attribute vec2 p; void main(){gl_Position=vec4(p,0,1);}'));
gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShader));
gl.linkProgram(program);
gl.useProgram(program);

// 设置全屏quad
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

// 获取uniform位置
const uRes = gl.getUniformLocation(program, 'iResolution');
const uTime = gl.getUniformLocation(program, 'iTime');

// 渲染循环
const startTime = Date.now();
function render() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (Date.now() - startTime) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}
render();

// 窗口resize
onresize = render;