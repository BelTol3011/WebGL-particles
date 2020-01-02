import vertex_shader_source from "./shaders/vertex.vert";
import fragment_shader_source from "./shaders/fragment.frag";
import { createShader, createProgram } from "./glUtils";
import { resizeCanvas } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const gl = canvas.getContext("webgl") as WebGLRenderingContext;

const positions = [
    -1, -1, 0, 0, 0, 0, 0, 0,
    -1, 1, 0, 0, 1, 1, 0, 0,
    1, -1, 0, 1, 0, 0, 1, 0,
    1, 1, 0, 1, 1, 0, 0, 1
]

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

const program = createProgram(gl, vertexShader, fragmentShader);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);

const uvLocation = gl.getAttribLocation(program, "a_uv");
gl.enableVertexAttribArray(uvLocation);
gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 8 * 4, 3 * 4);

const colorLocation = gl.getAttribLocation(program, "a_color");
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 8 * 4, 5 * 4);

const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const timeLocation = gl.getUniformLocation(program, "u_time");

function update(timeMs: number) {
    const time = timeMs / 1000;
    resizeCanvas(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time);

    requestAnimationFrame(update);
}

update(0);