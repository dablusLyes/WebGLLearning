let canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");
var shaderType;
(function (shaderType) {
    shaderType[shaderType["VERTEX_SHADER"] = gl.VERTEX_SHADER] = "VERTEX_SHADER";
    shaderType[shaderType["FRAGMENT_SHADER"] = gl.FRAGMENT_SHADER] = "FRAGMENT_SHADER";
})(shaderType || (shaderType = {}));
// #1 Creating a bitch ass Program
const program = gl.createProgram();
// #2 Clearing the Canvas and Setting the Clear Colors
gl.clearColor(0.01, 0.01, 0.01, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// #3 Creating The objects Vertices and shoving into a bitchass Float32Array
const triangleVerteces = [
    // Top right vertex, Red
    0.5, 0.5, 1.0, 0.0, 0.0,
    //  left, Green
    -0.5, -0.5, 0.0, 1.0, 0.0,
    // Bottom right, Blue
    0.5, -0.5, 0.0, 0.0, 1.0,
];
const triangleVerteces2 = [
    // Top Left vertex, Blue
    -0.5, 0.5, 1.0, 1.0, 1.0,
    //  top Right, Green
    0.5, 0.5, 1.0, 0.0, 0.0,
    // Bottom left, Blue
    -0.5, -0.5, 0.0, 1.0, 0.0,
];
const triangles = [triangleVerteces, triangleVerteces2];
const ObjectVerticesCpuBuffer = new Float32Array(triangleVerteces);
// #4 Making that whole fuckery into a Buffer that's readable by the fuckass GPU
const triangleGeoBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
gl.bufferData(gl.ARRAY_BUFFER, ObjectVerticesCpuBuffer, gl.STATIC_DRAW);
// #5 Writing the fuckass Vertex and Fragment Shaders
//      #5.1  Vertex Shader is basically the positions of the fuckass triangle
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
//     #5.2  Fragment Shader is the color of the fuckass triangle
const fragmentShaderSource = `#version 300 es
	precision mediump float;
	in vec3 vColor;
	out vec4 fragColor;
	void main() {
		fragColor = vec4(vColor, 1.0); 
		}
		`;
// #6 Compile said Fuckass Vertex Shader
//      #6.1 Create the shader object (empty)
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//      #6.2 Attach the source code to the shader object
gl.shaderSource(vertexShader, vertexShaderSource);
//     #6.3 Compile the shader
gl.compileShader(vertexShader);
//     #6.4 Check for errors in compilation
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("Vertex shader compilation failed:", gl.getShaderInfoLog(vertexShader));
}
// #7 Compile the Fragment Shader
//      #7.1 Create the shader object (empty)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//      #7.2 Attach the source code to the shader object
gl.shaderSource(fragmentShader, fragmentShaderSource);
//     #7.3 Compile the shader
gl.compileShader(fragmentShader);
//     #7.4 Check for errors in compilation
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error("Fragment shader compilation failed:", gl.getShaderInfoLog(fragmentShader));
}
// #8 Attach the shaders to the bitchass program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
// #9 Link the program so that it can be used
gl.linkProgram(program);
// #10 Check if the program linked successfully
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking failed:", gl.getProgramInfoLog(program));
}
// #11 Use the program for rendering
gl.useProgram(program);
const stride = 5 * Float32Array.BYTES_PER_ELEMENT; // 5 floats per vertex
// #12 get the location of the vertexPosition attribute in the shader
const vertexPositionLocation = gl.getAttribLocation(program, "vertexPosition");
// Attribute pointer setup tyshiiiii
gl.vertexAttribPointer(vertexPositionLocation, // location
2, // size (x, y)
gl.FLOAT, false, stride, 0);
gl.enableVertexAttribArray(vertexPositionLocation);
// Color attribute
const colorAttribLocation = gl.getAttribLocation(program, "vertexColor");
gl.vertexAttribPointer(colorAttribLocation, // Attribute location for color
3, // Number of components per color (r, g, b)
gl.FLOAT, // Type of each component
false, // Normalize the data? (not needed for float)
stride, // Stride (5 floats per vertex)
2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(colorAttribLocation);
// #14 Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw the triangle
// dettach the shaders
gl.detachShader(program, vertexShader);
gl.detachShader(program, fragmentShader);
