const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");
gl.clearColor(0.01, 0.01, 0.01, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
/**
 * Creating and Compiling a Shader
 * @param gl
 * @param type
 * @param shaderSource
 * @returns WebGLShader
 */
function createShader(gl, type, shaderSource) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
        return shader;
    else
        console.error(gl.COMPILE_STATUS);
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
/**
 * Creating WebGL program and linking it to a Vertex and Fragment Shader
 * @param gl
 * @param vertexShader
 * @param fragmentShader
 * @returns
 */
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success)
        return program;
    else
        console.error('Error With Program' + gl.LINK_STATUS);
    gl.deleteProgram(program);
}
// #3 Creating The objects Vertices and shoving into a bitchass Float32Array
const triangleVerteces = [
    // Top right vertex, Red
    1, 1, 1.0, 0.0, 0.0,
    //  bottom left, Green
    -1., -1., 0.0, 1.0, 0.0,
    // Bottom right, Blue
    1., -1., 0.0, 0.0, 1.0,
    // Top Left vertex, Blue
    -1., 1., 1.0, 1.0, 1.0,
    //  top Right, Green
    1., 1., 1.0, 0.0, 0.0,
    // Bottom left, Blue
    -1., -1., 0.0, 1.0, 0.0,
];
const triangles = [triangleVerteces];
const squareVerteces = [
    // Top right vertex, Red
    1, 1, 1.0, 0.0, 0.0,
    //  bottom left, Green
    -1., -1., 0.0, 1.0, 0.0,
    // Bottom right, Blue
    1., -1., 0.0, 0.0, 1.0,
    // Top Left vertex, Blue
    -1., 1., 1.0, 1.0, 1.0,
];
const vertexShaderSource = `#version 300 es
							precision mediump float;

							in vec2 vertexPosition;
							in vec3 vertexColor;
							out vec3 vColor;
							void main() {
								gl_Position = vec4(vertexPosition, 0.0, 1.0);
								vColor = vertexColor;
								}
								`;
const fragmentShaderSource = `#version 300 es
								precision mediump float;
								in vec3 vColor;
								out vec4 fragColor;
								void main() {
									fragColor = vec4(vColor, 1.0); 
									}
									`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
let program = createProgram(gl, vertexShader, fragmentShader);
let positionAttributeLocation = gl.getAttribLocation(program, "vertexPosition");
let positionBuffer = gl.createBuffer();
function drawTriangle(vertexArray) {
    const ObjectVertecesCpuBuffer = new Float32Array(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, ObjectVertecesCpuBuffer, gl.STATIC_DRAW);
    let vao = gl.createVertexArray();
    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
    const vertexPositionLocation = gl.getAttribLocation(program, "vertexPosition");
    const colorAttribLocation = gl.getAttribLocation(program, "vertexColor");
    gl.vertexAttribPointer(vertexPositionLocation, // location
    2, // size (x, y)
    gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(vertexPositionLocation);
    // Color attribute
    gl.vertexAttribPointer(colorAttribLocation, // Attribute location for color
    3, // Number of components per color (r, g, b)
    gl.FLOAT, // Type of each component
    false, // Normalize the data? (not needed for float)
    stride, // Stride (5 floats per vertex)
    2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorAttribLocation);
    // #14 Draw the triangle
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw the triangle
}
triangles.forEach((triangle) => {
    drawTriangle(triangle);
});
