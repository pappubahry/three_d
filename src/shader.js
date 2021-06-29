// Shader code:

const shader_points_vertex = [
  "attribute vec4 color;",
  "attribute float dot_height;",
  "attribute float hide_point;",
  "attribute float null_point;",
  "uniform float camera_r;",
  "uniform float is_perspective;",
  "uniform float pixel_ratio;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  vertex_color = color;",
  "  vertex_hide_point = hide_point;",
  "  vertex_null_point = null_point;",
  "  float this_height;",
  "  if (is_perspective > 0.5) {",
  "    float r1 = length(cameraPosition - position);",
  "    if (r1 < 0.01) {",
  "      r1 = 0.01;",
  "    }",
  "    this_height = camera_r * pixel_ratio * dot_height / r1;",
  "  } else {",
  "    this_height = dot_height * pixel_ratio;",
  "  }",
  "  gl_PointSize = this_height;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const shader_points_fragment = [
  "uniform sampler2D texture;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  gl_FragColor = vec4(vertex_color) * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));",
  "  if ((gl_FragColor.a < 0.1) || (vertex_hide_point > 0.5) || (vertex_null_point > 0.5)) {",
  "    discard;",
  "  }",
  "}",
].join("\n");

const shader_quads_vertex = [
  "attribute vec4 color;",
  "attribute float hide_point;",
  "attribute float null_point;",
  "varying vec4 vertex_color;",
  "varying vec2 vUv;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  vertex_color = color;",
  "  vUv = uv;",
  "  vertex_hide_point = hide_point;",
  "  vertex_null_point = null_point;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const shader_quads_fragment = [
  "varying vec2 vUv;",
  "uniform sampler2D texture;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  gl_FragColor = vec4(vertex_color) * texture2D(texture, vUv);",
  "  if ((gl_FragColor.a < 0.1) || (vertex_hide_point > 0.5) || (vertex_null_point > 0.5)) {",
  "    discard;",
  "  }",
  "}",
].join("\n");

const shader_labels_vertex = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const shader_labels_fragment = [
  "varying vec2 vUv;",
  "uniform sampler2D texture;",
  "uniform vec4 color;",
  "uniform vec4 bg_color;",
  "uniform vec4 base_bg_color;",
  "uniform float base_text_color;",
  "void main() {",
  "  float t;",
  "  float sum_bg = base_bg_color.x + base_bg_color.y + base_bg_color.z;",
  "  float sum_tex = texture2D(texture, vUv).r + texture2D(texture, vUv).g + texture2D(texture, vUv).b;",
  "  if (base_text_color > 0.5) {",
  "    // Texture was made with white text.",
  "    if (sum_bg == 3.0) {",
  "      // White text was written on white background.",
  "      t = 0.0;",
  "    } else {",
  "      t = (sum_tex - sum_bg) / (3.0 - sum_bg);",
  "    }",
  "    gl_FragColor = bg_color + t*(color - bg_color);",
  "  } else {",
  "    // Texture was made with black text.",
  "    if (sum_bg == 0.0) {",
  "      // Black text was written on black background.",
  "      t = 0.0;",
  "    } else {",
  "      t = 1.0 - sum_tex / sum_bg;",
  "    }",
  "  }",
  "  gl_FragColor = bg_color + t*(color - bg_color);",
  "  gl_FragColor = clamp(gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));",
  "}",
].join("\n");

const shader_lines_vertex = [
  "attribute vec4 color;",
  "attribute float hide_point;",
  "attribute float null_point;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  vertex_color = color;",
  "  vertex_hide_point = hide_point;",
  "  vertex_null_point = null_point;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const shader_lines_fragment = [
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  gl_FragColor = vertex_color;",
  "  if ((vertex_hide_point > 0.0) || (vertex_null_point > 0.0)) {",
  "    discard;",
  "  }",
  "}",
].join("\n");

const shader_mesh_vertex = [
  "attribute vec4 color;",
  "attribute float hide_point;",
  "attribute float hide_axis;",
  "attribute float null_point;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_hide_axis;",
  "varying float vertex_null_point;",
  "void main() {",
  "  vertex_color = color;",
  "  vertex_hide_point = hide_point;",
  "  vertex_hide_axis  = hide_axis;",
  "  vertex_null_point = null_point;",
  // Move the mesh a touch closer to the camera than the surface it's on,
  // so that it is clearly visible.
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + 1.0e-3 * normalize(cameraPosition - position), 1.0);",
  "}",
].join("\n");

const shader_mesh_fragment = [
  "uniform float use_const_color;",
  "uniform vec4 const_color;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_hide_axis;",
  "varying float vertex_null_point;",
  "void main() {",
  "  if (use_const_color > 0.5) {",
  "    gl_FragColor = const_color;",
  "  } else {",
  "    gl_FragColor = vertex_color;",
  "  }",
  "  if (((vertex_hide_point > 0.0) || (vertex_null_point > 0.0)) || (vertex_hide_axis > 0.0)) {",
  "    discard;",
  "  }",
  "}",
].join("\n");

const shader_surface_vertex = [
  "attribute vec4 color;",
  "attribute float hide_point;",
  "attribute float null_point;",
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  vertex_color = color;",
  "  vertex_hide_point = hide_point;",
  "  vertex_null_point = null_point;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const shader_surface_fragment = [
  "varying vec4 vertex_color;",
  "varying float vertex_hide_point;",
  "varying float vertex_null_point;",
  "void main() {",
  "  gl_FragColor = vertex_color;",
  "  if ((vertex_hide_point > 0.0) || (vertex_null_point > 0.0)) {",
  "    discard;",
  "  }",
  "}",
].join("\n");

const shader_temp_vertex = [
  "void main() {",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const shader_temp_fragment = [
  "void main() {",
  "  gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);",
  "}",
].join("\n");

export {
  shader_points_vertex,
  shader_points_fragment,
  shader_quads_vertex,
  shader_quads_fragment,
  shader_labels_vertex,
  shader_labels_fragment,
  shader_lines_vertex,
  shader_lines_fragment,
  shader_mesh_vertex,
  shader_mesh_fragment,
  shader_surface_vertex,
  shader_surface_fragment,
  shader_temp_vertex,
  shader_temp_fragment,
};
