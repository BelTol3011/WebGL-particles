
attribute vec3 a_position;
attribute vec2 a_uv;
attribute vec3 a_color;

uniform float u_time;

varying vec2 v_uv;
varying vec3 v_color;

void main () {
    // gl_Position = vec4((a_position*0.5)+vec3(0.2*sin(u_time+a_position.x+a_position.y), 0.2*cos(u_time+a_position.x+a_position.y), 0.), 1);
    gl_Position = vec4(a_position, 1);
    v_uv = a_uv;
    v_color = a_color;
}