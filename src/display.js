import { switch_camera_type ,get_current_camera} from "./camera.js";
import {css_color_to_hex,hex_to_css_color,hex_to_rgb_obj} from './color.js'
import {surrounding_surface_quads,surrounding_mesh_segments} from './surface.js'
import { update_render,tau,rad2deg } from "./main.js";
import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
function update_labels(plot, start_i, end_i) {
  if (plot.geom_type == "none") {
    return;
  }
  if (!plot.have_any_labels) {
    return;
  }

  if (start_i === undefined) {
    start_i = 0;
  }
  if (end_i === undefined) {
    end_i = plot.points.length - 1;
  }

  var up = new THREE.Vector3();
  var this_pos = new THREE.Vector3();
  var label_height, scale_factor;

  scale_factor = get_scale_factor(plot);

  // What my pen-and-paper work says:
  label_height = (scale_factor * plot.label_font_size) / 4;

  // Fudge!
  label_height *= 4;

  var null_points, hide_points;

  if (plot.geom_type == "point") {
    var positions = plot.points_merged.geometry.attributes.position.array;
    null_points = plot.points_merged.geometry.attributes.null_point.array;
    hide_points = plot.points_merged.geometry.attributes.hide_point.array;
  }

  var position = new THREE.Vector3();
  var need_update;

  for (var i = start_i; i <= end_i; i++) {
    if (plot.geom_type == "point") {
      position.copy(
        new THREE.Vector3(
          positions[3 * i],
          positions[3 * i + 1],
          positions[3 * i + 2]
        )
      );
    } else if (plot.geom_type == "quad") {
      position.copy(plot.points[i].position);
    }

    if (plot.points[i].have_label) {
      up.copy(plot.camera_up);
      this_pos = up
        .multiplyScalar(
          plot.points[i].input_data.sphere_size * scale_factor + label_height
        )
        .add(position);

      plot.labels[i].position.copy(this_pos);
      plot.labels[i].rotation.copy(get_current_camera(plot).rotation);
    }
  }
}

function toggle_grid(plot) {
  return function () {
    var i;
    if (plot.show_grid) {
      plot.show_grid = false;

      for (i = 0; i < 3; i++) {
        if (plot.showing_upper_grid[i]) {
          plot.scene.remove(plot.grid_lines_upper[i]);
        }

        if (plot.showing_lower_grid[i]) {
          plot.scene.remove(plot.grid_lines_lower[i]);
        }

        plot.showing_upper_grid[i] = false;
        plot.showing_lower_grid[i] = false;
      }
    } else {
      plot.show_grid = true;
      update_gridlines(plot);
    }

    plot.renderer.render(plot.scene, get_current_camera(plot));
  };
}
function update_gridlines(plot) {
  var test_pos, d_upper, d_lower, normal, i, theta;
  var axes = ["x", "y", "z"];

  if (plot.view_type == "perspective") {
    var rel_r = new THREE.Vector3();

    for (i = 0; i < 3; i++) {
      // Upper plane.

      normal = new THREE.Vector3(0, 0, 0);
      normal[axes[i]] = 1;

      rel_r = new THREE.Vector3(0, 0, 0);
      rel_r[axes[i]] = plot.bounding_planes[i];
      rel_r.sub(get_current_camera(plot).position);

      theta = rel_r.angleTo(normal);

      // Honestly I think it should be <= instead of >
      // but who am I to argue with the results?
      if (theta > tau / 4) {
        // Switch off grid
        if (plot.showing_upper_grid[i]) {
          plot.scene.remove(plot.grid_lines_upper[i]);
          plot.showing_upper_grid[i] = false;
        }
      } else {
        if (!plot.showing_upper_grid[i]) {
          plot.scene.add(plot.grid_lines_upper[i]);
          plot.showing_upper_grid[i] = true;
        }
      }

      // Lower plane.

      normal[axes[i]] = -1;

      rel_r = new THREE.Vector3(0, 0, 0);
      rel_r[axes[i]] = -plot.bounding_planes[i];
      rel_r.sub(get_current_camera(plot).position);

      theta = rel_r.angleTo(normal);

      if (theta > tau / 4) {
        // Switch off grid
        if (plot.showing_lower_grid[i]) {
          plot.scene.remove(plot.grid_lines_lower[i]);
          plot.showing_lower_grid[i] = false;
        }
      } else {
        if (!plot.showing_lower_grid[i]) {
          plot.scene.add(plot.grid_lines_lower[i]);
          plot.showing_lower_grid[i] = true;
        }
      }
    }
  } else {
    // Orthographic -- only three faces should have a grid.

    var r_quat = new THREE.Quaternion().setFromEuler(
      get_current_camera(plot).rotation
    );

    var r = new THREE.Vector3(0, 0, 1).applyQuaternion(r_quat);

    for (i = 0; i < 3; i++) {
      normal = new THREE.Vector3(0, 0, 0);
      normal[axes[i]] = 1;

      theta = r.angleTo(normal);

      if (theta <= tau / 4) {
        // Switch off grid
        if (plot.showing_upper_grid[i]) {
          plot.scene.remove(plot.grid_lines_upper[i]);
          plot.showing_upper_grid[i] = false;
        }
      } else {
        if (!plot.showing_upper_grid[i]) {
          plot.scene.add(plot.grid_lines_upper[i]);
          plot.showing_upper_grid[i] = true;
        }
      }

      normal[axes[i]] = -1;

      theta = r.angleTo(normal);

      if (theta <= tau / 4) {
        // Switch off grid
        if (plot.showing_lower_grid[i]) {
          plot.scene.remove(plot.grid_lines_lower[i]);
          plot.showing_lower_grid[i] = false;
        }
      } else {
        if (!plot.showing_lower_grid[i]) {
          plot.scene.add(plot.grid_lines_lower[i]);
          plot.showing_lower_grid[i] = true;
        }
      }
    }
  }
}
function get_scale_factor(plot) {
  if (plot.view_type == "perspective") {
    // a point of size 10 pixels has a radius of 5 pixels, which corresponds to
    // a distance of half_height * 5 / (half_height in pixels).
    return (
      (plot.camera_distance_scale *
        Math.tan((0.5 * plot.persp_camera.fov) / rad2deg)) /
      plot.height
    );
  } else {
    return plot.ortho_camera.top / plot.height;
  }
}
function update_axes(plot) {
 
}

function toggle_ticks(plot){
  if (plot.show_ticks){
    plot.scene.remove(plot.axis_ticks_group);
    plot.show_ticks = false;
  } else {

  }
}

// function toggle_ticks(plot) {
//   return function () {
//     var i, j;
//     if (plot.show_ticks) {
//       plot.show_ticks = false;
//       //plots[i_plot].scene.remove(plots[i_plot].axis_ticks);
//       for (i = 0; i < 3; i++) {
//         for (j = 0; j < 4; j++) {
//           plot.scene.remove(plot.axis_ticks[i][j]);
//         }
//       }

//       for (i = 0; i < plot.tick_text_planes.length; i++) {
//         plot.scene.remove(plot.tick_text_planes[i]);
//       }
//     } else {
//       plot.show_ticks = true;
//       //plots[i_plot].scene.add(plots[i_plot].axis_ticks);
//       if (plot.dynamic_axis_labels) {
//         update_axes(plot);
//       } else {
//         plot.scene.add(plot.axis_ticks[0][0]);
//         plot.scene.add(plot.axis_ticks[1][0]);
//         plot.scene.add(plot.axis_ticks[2][0]);
//       }

//       for (i = 0; i < plot.tick_text_planes.length; i++) {
//         plot.scene.add(plot.tick_text_planes[i]);
//       }
//     }

//     plot.renderer.render(plot.scene, get_current_camera(plot));
//   };
// }

function toggle_axis_titles(plot) {
  return function () {
    var i;
    if (plot.show_axis_titles) {
      plot.show_axis_titles = false;
      for (i = 0; i < 3; i++) {
        plot.scene.remove(plot.axis_text_planes[i]);
      }
    } else {
      plot.show_axis_titles = true;
      for (i = 0; i < 3; i++) {
        plot.scene.add(plot.axis_text_planes[i]);
      }
    }

    plot.renderer.render(plot.scene, get_current_camera(plot));
  };
}

function toggle_box(plot) {

    if (plot.show_box) {
      plot.show_box = false;
      plot.scene.remove(plot.axis_box);
    } else {
      plot.show_box = true;
      plot.scene.add(plot.axis_box);
    }

    plot.renderer.render(plot.scene, get_current_camera(plot));

}
function toggle_camera(plot) {
  return function () {
    switch_camera_type(plot);
  };
}

function are_same_color(color1, color2) {
  var canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 1;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = color2;
  ctx.fillRect(1, 0, 1, 1);

  var pixel_data = ctx.getImageData(0, 0, 2, 1);
  var pixels = pixel_data.data;
  var r1 = pixels[0];
  var g1 = pixels[1];
  var b1 = pixels[2];

  var r2 = pixels[4];
  var g2 = pixels[5];
  var b2 = pixels[6];

  return r1 == r2 && g1 == g2 && b1 == b2;
}

function get_text_width(text, font_size, font_face) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  context.font = font_size + "px " + font_face;

  return context.measureText(text).width;
}

function make_text_canvas(
  text,
  canvas_width,
  canvas_height,
  font_size,
  font_face,
  font_color,
  bg_color_css
) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  context.fillStyle = bg_color_css;
  context.fillRect(0, 0, canvas_width, canvas_height);
  context.font = font_size + "px " + font_face;
  context.fillStyle = font_color;
  context.fillText(text, 0, font_size);

  return canvas;
}

function make_label_text_plane(
  text,
  font_face,
  font_size,
  use_white_text,
  background_color,
  font_ratio
) {
  // background_color is numerical.

  var canvas_height = Math.pow(
    2,
    Math.ceil(Math.log(font_size) / 0.693147180559945)
  );

  font_size = Math.floor(canvas_height / font_ratio) - 1;

  var canvas_width = get_text_width(text, font_size, font_face);

  // Shouldn't be a problem, but just in case....
  if (canvas_width == 0) {
    canvas_width = 1;
  }

  var aspect = canvas_width / canvas_height;

  var font_color = use_white_text ? "#FFFFFF" : "#000000";
  var color_for_uniform = use_white_text ? 1.0 : 0.0;

  var bg_color_css = hex_to_css_color(background_color);
  var bg_color_obj = hex_to_rgb_obj(background_color);

  var texture = new THREE.Texture(
    make_text_canvas(
      text,
      canvas_width,
      canvas_height,
      font_size,
      font_face,
      font_color,
      bg_color_css
    )
  );
  texture.needsUpdate = true;

  // It resizes the canvas to powers of 2 with the default minFilter:
  texture.minFilter = THREE.LinearFilter;

  var new_obj = new THREE.Mesh(
    new THREE.PlaneGeometry(aspect, 1, 1),
    new THREE.ShaderMaterial({
      uniforms: {
        texture: { type: "t", value: texture },
        color: { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
        bg_color: {
          type: "v4",
          value: new THREE.Vector4(
            bg_color_obj.r,
            bg_color_obj.g,
            bg_color_obj.b,
            1.0
          ),
        },
        base_bg_color: {
          type: "v4",
          value: new THREE.Vector4(
            bg_color_obj.r,
            bg_color_obj.g,
            bg_color_obj.b,
            1.0
          ),
        },
        base_text_color: { type: "f", value: color_for_uniform },
      },
      vertexShader: shader_labels_vertex,
      fragmentShader: shader_labels_fragment,
    })
  );

  return new_obj;
}

function make_text_plane(
  text,
  font_face,
  font_size,
  font_color,
  background_color,
  is_transparent,
  font_ratio
) {
  // Inspired by Lee Stemkoski's example at
  // https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
  // which doesn't work with the latest three.js release.

  var canvas_height = Math.pow(
    2,
    Math.ceil(Math.log(font_size) / 0.693147180559945)
  );

  font_size = Math.floor(canvas_height / font_ratio) - 1;

  var canvas_width = get_text_width(text, font_size, font_face);

  // Shouldn't be a problem, but just in case....
  if (canvas_width == 0) {
    canvas_width = 1;
  }

  var aspect = canvas_width / canvas_height;
  // The main text:
  var texture = new THREE.Texture(
    make_text_canvas(
      text,
      canvas_width,
      canvas_height,
      font_size,
      font_face,
      font_color,
      background_color
    )
  );
  texture.needsUpdate = true;

  // It resizes the canvas to powers of 2 with the default minFilter:
  texture.minFilter = THREE.LinearFilter;

  var alpha_texture;

  if (is_transparent) {
    var canvas_alpha_map = document.createElement("canvas");
    canvas_alpha_map.width = canvas_width;
    canvas_alpha_map.height = canvas_height;
    var context_alpha_map = canvas_alpha_map.getContext("2d");
    context_alpha_map.font = font_size + "px " + font_face;
    context_alpha_map.fillStyle = background_color;
    context_alpha_map.fillRect(0, 0, canvas_width, canvas_height);

    // Grab the RGB of the background colour.
    var pixel_data = context_alpha_map.getImageData(
      0,
      0,
      canvas_width,
      canvas_height
    );
    var pixels = pixel_data.data;
    var r = pixels[0];
    var g = pixels[1];
    var b = pixels[2];

    context_alpha_map.fillStyle = font_color;
    context_alpha_map.fillText(text, 0, font_size);

    pixel_data = context_alpha_map.getImageData(
      0,
      0,
      canvas_width,
      canvas_height
    );
    pixels = pixel_data.data;

    for (var i = 0; i < pixels.length; i += 4) {
      if (pixels[i] == r && pixels[i + 1] == g && pixels[i + 2] == b) {
        pixels[i] = 0;
        pixels[i + 1] = 0;
        pixels[i + 2] = 0;
        pixels[i + 3] = 0;
      } else {
        pixels[i] = 255;
        pixels[i + 1] = 255;
        pixels[i + 2] = 255;
        pixels[i + 3] = 255;
      }
    }

    context_alpha_map.putImageData(pixel_data, 0, 0);

    alpha_texture = new THREE.Texture(canvas_alpha_map);
    alpha_texture.needsUpdate = true;
    alpha_texture.minFilter = THREE.LinearFilter;
  } else {
    alpha_texture = null;
  }

  var new_obj = new THREE.Mesh(
    new THREE.PlaneGeometry(aspect, 1, 1),
    new THREE.MeshBasicMaterial({
      map: texture,
      alphaMap: alpha_texture,
      transparent: is_transparent,
    })
  );

  return new_obj;
}

function get_font_height(font_style, div) {
  // Mostly from http://stackoverflow.com/a/7462767

  var dummy = document.createElement("div");

  if (div === undefined) {
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(dummy);
  } else {
    div.appendChild(dummy);
  }

  // I don't think the height actually varies with the letters:
  dummy.innerHTML = "Éy";
  dummy.setAttribute("style", font_style);

  var result = dummy.offsetHeight;

  if (div === undefined) {
    body.removeChild(dummy);
  } else {
    div.removeChild(dummy);
  }
  return result;
}

function set_surface_point_hide(plot, i, j, hide) {
  var hides = plot.surface.geometry.attributes.hide_point.array;
  plot.surface.geometry.attributes.hide_point.needsUpdate = true;

  plot.hide_points[i][j] = hide;

  var nx = plot.mesh_points.length;
  var ny = plot.mesh_points[0].length;

  var i_quad = surrounding_surface_quads(plot, i, j);

  var new_i_vert = [
    [1, 11],
    [8, 10],
    [5, 7],
    [2, 4],
  ];

  var quad_hides = [0, 0, 0, 0, 0];
  var non_hides, tri_hide;
  var i1, j1;

  for (var k = 0; k < 4; k++) {
    if (i_quad[k] >= 0) {
      i1 = Math.floor(i_quad[k] / (ny - 1));
      j1 = i_quad[k] % (ny - 1);

      // Interpolated points (hide if there's at least one vertex
      // to hide in the triangle).
      quad_hides[0] = plot.hide_points[i1][j1];
      quad_hides[1] = plot.hide_points[i1 + 1][j1];
      quad_hides[2] = plot.hide_points[i1 + 1][j1 + 1];
      quad_hides[3] = plot.hide_points[i1][j1 + 1];

      non_hides =
        4 - (quad_hides[0] + quad_hides[1] + quad_hides[2] + quad_hides[3]);

      quad_hides[4] = non_hides >= 3 ? 0 : 1;

      tri_hide = [
        quad_hides[0] || quad_hides[1] || quad_hides[4],
        quad_hides[1] || quad_hides[2] || quad_hides[4],
        quad_hides[2] || quad_hides[3] || quad_hides[4],
        quad_hides[3] || quad_hides[0] || quad_hides[4],
      ];

      for (var k_tri = 0; k_tri < 4; k_tri++) {
        hides[i_quad[k] * 12 + k_tri * 3 + 0] = tri_hide[k_tri];
        hides[i_quad[k] * 12 + k_tri * 3 + 1] = tri_hide[k_tri];
        hides[i_quad[k] * 12 + k_tri * 3 + 2] = tri_hide[k_tri];
      }

      hides[i_quad[k] * 12 + new_i_vert[k][0]] = hide;
      hides[i_quad[k] * 12 + new_i_vert[k][1]] = hide;
    }
  }
}

function set_mesh_point_hide(plot, i, j, hide) {
  var hides = plot.surface_mesh.geometry.attributes.hide_point.array;
  plot.surface_mesh.geometry.attributes.hide_point.needsUpdate = true;

  plot.hide_mesh_points[i][j] = hide;

  var nx = plot.mesh_points.length;
  var ny = plot.mesh_points[0].length;

  var i_segment = surrounding_mesh_segments(plot, i, j);

  var idx_hide = [0, 1, 0, 1];

  for (var k = 0; k < 4; k++) {
    // Loop over segments.

    if (i_segment[k] >= 0) {
      hides[i_segment[k] * 2 + idx_hide[k]] = hide;
    }
  }
}

function hide_surface_point(plot, i, j) {
  set_surface_point_hide(plot, i, j, 1);
}

function show_surface_point(plot, i, j) {
  set_surface_point_hide(plot, i, j, 0);
}

function hide_mesh_point(plot, i, j) {
  set_mesh_point_hide(plot, i, j, 1);
}

function show_mesh_point(plot, i, j) {
  set_mesh_point_hide(plot, i, j, 0);
}

function set_mesh_axis_hide(plot, i_dirn, hide) {
  plot.hiding_mesh_axes[i_dirn] = !!hide;

  var hide_axes = plot.surface_mesh.geometry.attributes.hide_axis.array;
  plot.surface_mesh.geometry.attributes.hide_axis.needsUpdate = true;

  var N = hide_axes.length / 2;
  var offset_i = 0;

  if (i_dirn == 0) {
    offset_i = N;
  }

  for (var i = offset_i; i < N + offset_i; i++) {
    hide_axes[i] = hide;
  }
}

function hide_mesh_x(plot) {
  set_mesh_axis_hide(plot, 0, 1);
}

function show_mesh_x(plot) {
  set_mesh_axis_hide(plot, 0, 0);
}

function hide_mesh_y(plot) {
  set_mesh_axis_hide(plot, 1, 1);
}

function show_mesh_y(plot) {
  set_mesh_axis_hide(plot, 1, 0);
}

function make_box(plot){
  var line_material = new THREE.LineBasicMaterial({ color: plot.axis_color });
  var box_geom = []
  //var box_geom = new THREE.Geometry();
  // LineSegments draws a segment between vertices 0 and 1, 2, and 3, 4 and 5, ....
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][0],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][1],
      plot.current_scale[2][0]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][1],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][1],
      plot.current_scale[2][0]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][1],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][0],
      plot.current_scale[2][0]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][0],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][0],
      plot.current_scale[2][0]
    )
  );

  // Top:
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][0],
      plot.current_scale[2][1]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][1],
      plot.current_scale[2][1]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][1],
      plot.current_scale[2][1]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][1],
      plot.current_scale[2][1]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][1],
      plot.current_scale[2][1]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][0],
      plot.current_scale[2][1]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][0],
      plot.current_scale[2][1]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][0],
      plot.current_scale[2][1]
    )
  );

  // Vertical edges:
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][1],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][1],
      plot.current_scale[2][1]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][0],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][0],
      plot.current_scale[2][1]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][1],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][1],
      plot.current_scale[1][1],
      plot.current_scale[2][1]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][0],
      plot.current_scale[2][0]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      plot.current_scale[0][0],
      plot.current_scale[1][0],
      plot.current_scale[2][1]
    )
  );
  box_geom = new THREE.BufferGeometry().setFromPoints( box_geom );
  plot.axis_box = new THREE.LineSegments(box_geom, line_material);
  plot.axis_box.name = "box"  
  if (plot.show_box) {
    plot.scene.add(plot.axis_box);
  }
}
function make_ticks(plot){
  
  var line_material = new THREE.LineBasicMaterial({ color: plot.axis_color });

  plot.axis_tick_values = [];
  for (let i = 0; i < 3; i++) {
        plot.axis_tick_values.push(
          d3.scaleLinear().domain(plot.bounds[i]).ticks(plot.num_ticks[i])
        );
  }
  plot.axis_ticks = [];
  var tick_geom, vertex1, vertex2, i2, i3;

  plot.tick_locations = [];
  tick_geom = [];
  var signs = [-1, 1];
  var scale_loc = [0,1];
  var axis_ct;

  plot.scales = [];

  for (let i = 0; i < 3; i++) {
    plot.scales.push(
      d3.scaleLinear().domain(plot.bounds[i]).range(plot.current_scale[i])
    );
    plot.tick_locations.push([]);
    tick_geom.push([
      [],
      [],
      [],
      []
    ])
    plot.axis_ticks.push([]);

    i2 = (i + 1) % 3;
    i3 = (i2 + 1) % 3;
    for (let j = 0; j < plot.axis_tick_values[i].length; j++) {
      axis_ct = 0;
      for (let k = 0; k < 2; k++) {
        for (let l = 0; l < 2; l++) {
          vertex1 = new THREE.Vector3(0, 0, 0);
          vertex1[plot.axes[i]] = plot.scales[i](plot.axis_tick_values[i][j]);
          vertex1[plot.axes[i2]] =  plot.current_scale[i2][scale_loc[k]];
          vertex1[plot.axes[i3]] =  plot.current_scale[i3][scale_loc[k]];
          vertex2 = new THREE.Vector3(
            plot.tick_lengths[i],
            plot.tick_lengths[i],
            plot.tick_lengths[i]
          );
            
          vertex2[plot.axes[i]] = 0;
          vertex2[plot.axes[i2]] *= signs[k];
          vertex2[plot.axes[i3]] *= signs[l];
          vertex2.add(vertex1);
          tick_geom[i][axis_ct].push(vertex1);
          tick_geom[i][axis_ct].push(vertex2);

          axis_ct++;
        }
      }

      plot.tick_locations[i][j] = vertex1[plot.axes[i]];
    }
    
    for (let j = 0; j < 4; j++) {
      let g = new THREE.BufferGeometry().setFromPoints( tick_geom[i][j]);
      plot.axis_ticks[i].push(
        new THREE.LineSegments(g, line_material)
      );
    }
  }
  if (plot.show_ticks) {
    plot.axis_ticks_group = new THREE.Group();
    plot.axis_ticks_group.name ="axisTicks"
    plot.axis_ticks_group.add(plot.axis_ticks[0][0]);
    plot.axis_ticks_group.add(plot.axis_ticks[1][0]);
    plot.axis_ticks_group.add(plot.axis_ticks[2][0]);
    plot.scene.add(plot.axis_ticks_group);
  }
  axis_labels(plot,tick_geom)
}

function make_grid(plot){
  

  plot.bounding_planes = [
    plot.current_scale[0][1],
    plot.current_scale[1][1],
    plot.current_scale[2][1],
  ];
  var grid_material = new THREE.LineBasicMaterial({ color: plot.grid_color });


  plot.grid_lines_upper = [];
  plot.grid_lines_lower = [];
  var grid_geom_lower, grid_geom_upper;
  for (let i = 0; i < 3; i++) {
    // grid_geom_lower = new THREE.Geometry();
    // grid_geom_upper = new THREE.Geometry();
    grid_geom_lower = [];
    grid_geom_upper = [];

    // Want to draw lines on the planes parallel
    // to axis[i] == const.
    for (let j = 0; j < 3; j++) {
      if (j != i) {
        let k = ~(i | j) & 3;
        for (let tick_ct = 0; tick_ct < plot.axis_tick_values[j].length; tick_ct++) {
          // Lower plane:
          let vertex1 = new THREE.Vector3();
          vertex1[plot.axes[i]] = plot.current_scale[i][0];
          vertex1[plot.axes[k]] = plot.current_scale[k][0];
          vertex1[plot.axes[j]] = plot.tick_locations[j][tick_ct];

          let vertex2 = new THREE.Vector3();
          vertex2[plot.axes[i]] = plot.current_scale[i][0];
          vertex2[plot.axes[k]] = plot.current_scale[k][1];
          vertex2[plot.axes[j]] = plot.tick_locations[j][tick_ct];

          grid_geom_lower.push(vertex1);
          grid_geom_lower.push(vertex2);

          // Upper plane:
          vertex1 = new THREE.Vector3();
          vertex1[plot.axes[i]] = plot.current_scale[i][1];
          vertex1[plot.axes[k]] = plot.current_scale[k][0];
          vertex1[plot.axes[j]] = plot.tick_locations[j][tick_ct];

          vertex2 = new THREE.Vector3();
          vertex2[plot.axes[i]] = plot.current_scale[i][1];
          vertex2[plot.axes[k]] = plot.current_scale[k][1];
          vertex2[plot.axes[j]] = plot.tick_locations[j][tick_ct];

          grid_geom_upper.push(vertex1);
          grid_geom_upper.push(vertex2);
        }
      }
    }
    let g_upper = new THREE.BufferGeometry().setFromPoints( grid_geom_upper );
    let g_lower = new THREE.BufferGeometry().setFromPoints( grid_geom_lower );
    plot.grid_lines_upper.push(
      new THREE.LineSegments(g_upper, grid_material)
    );
    
    plot.grid_lines_lower.push(
      new THREE.LineSegments(g_lower, grid_material)
    );
  }
  plot.showing_upper_grid = [false, false, false];
  plot.showing_lower_grid = [false, false, false];

  if (plot.show_grid) {
    update_gridlines(plot);
  }
}
function make_axes(plot, params, append) {
  if (!plot.hasOwnProperty("show_box")) {
    plot.show_box = params.hasOwnProperty("show_box") ? params.show_box : true;
  }
  plot.num_ticks = params.hasOwnProperty("num_ticks")
  ? JSON.parse(JSON.stringify(params.num_ticks))
  : [4, 4, 4];
plot.tick_lengths = params.hasOwnProperty("tick_lengths")
  ? JSON.parse(JSON.stringify(params.tick_lengths))
  : [0.03, 0.03, 0.03];

if (!plot.hasOwnProperty("show_ticks")) {
  plot.show_ticks = params.hasOwnProperty("show_ticks")
    ? JSON.parse(JSON.stringify(params.show_ticks))
    : true;
}
if (!plot.hasOwnProperty("show_grid")) {
  plot.show_grid = params.hasOwnProperty("show_grid")
    ? params.show_grid
    : true;
}
plot.grid_color = "#000000"



  let other_surfx = []
  let other_surfy = []
  let other_surfz = []
  for (var i = 0; i < plot.surface_list.length; i++) {
    other_surfx.push(...plot.surface_list[i].bounds.x)
    other_surfy.push(...plot.surface_list[i].bounds.y)
    other_surfz.push(...plot.surface_list[i].bounds.z)
  }
  const other_surf = {x:other_surfx,y:other_surfy,z:other_surfz}
  if (append === undefined) {
    append = false;
  }
  plot.axes = ["x", "y", "z", "size"];





 

  plot.axis_color = "#000000";


  var axis_ranges = [100, 100, 100];
  var temp_min1, temp_max1
  let max_fixed_range;
  plot.bounds = [];
  


  for (i = 0; i < 3; i++) {
        if (i < 2) {
          // x or y.

          temp_min1 = d3.min([...params.data[plot.axes[i]],...other_surf[plot.axes[i]]]);
          temp_max1 = d3.max([...params.data[plot.axes[i]],...other_surf[plot.axes[i]]]);

            plot.bounds.push([temp_min1, temp_max1]);

        } else if (i == 2) {
          // z.
          temp_min1 = d3.min([...params.data.z.flat(),...other_surf.z]);
          
          temp_max1 = d3.max([...params.data.z.flat(),...other_surf.z]);

            plot.bounds.push([temp_min1, temp_max1]);

          if (!params.hasOwnProperty("color_scale_bounds")) {
            plot.color_domain = plot.bounds[2].slice(0);
                plot.color_domain[0] -= plot.null_width;
                plot.color_domain[1] += plot.null_width;
          } else {
            plot.color_domain = params.color_scale_bounds.slice(0);
          }
        
        } 

    axis_ranges[i] = plot.bounds[i][1] - plot.bounds[i][0];
    
    max_fixed_range = d3.max(axis_ranges.slice(0,2))

  }
  let axis_scale_factor = [];
  for (let i = 0; i < 3; i++) {
      axis_scale_factor[i] = axis_ranges[i] / max_fixed_range;
      if (i===2){//set VE
        axis_scale_factor[i] = axis_scale_factor[i]*plot.ve
      }
  }
  plot.current_scale = [[-axis_scale_factor[0],axis_scale_factor[0]], [-axis_scale_factor[1],axis_scale_factor[1]], [-axis_scale_factor[2],axis_scale_factor[2]]]



  

  make_box(plot)


make_ticks(plot)
  


make_grid(plot)
}


function resize_axes(plot) {
  

  // Axis ticks.


  let all_x = []
  let all_y = []
  let all_z = []
  for (let surf of plot.surface_list){
    let bounds = surf.bounds
    all_x.push(...bounds.x)
    all_y.push(...bounds.y)
    all_z.push(...bounds.z)
    }
  plot.bounds=[[d3.min(all_x),d3.max(all_x)],[d3.min(all_y),d3.max(all_y)],[d3.min(all_z),d3.max(all_z)]]


  var n_axes = 3;
  var plot_scales = []
for (let i = 0; i < n_axes; i++) {
    plot_scales.push(
      d3.scaleLinear().domain(plot.bounds[i]).range(plot.current_scale[i])
    );
 }
 make_box(plot)
//ticks and label
make_ticks(plot)

  // Gridlines.

make_grid(plot)

}

function axis_labels(plot,tick_geom){
  //labels
if(plot.axis_ticks_label_group){
  plot.scene.remove(plot.axis_ticks_label_group)
  for (const label of plot.axis_ticks_label_group.children){
		label.geometry.dispose()
		label.material.dispose()
	}
  delete plot.axis_ticks_label_group;
} 
  plot.axis_ticks_label_group = new THREE.Group();
  plot.axis_ticks_label_group.name="label"
  plot.scene.add(plot.axis_ticks_label_group);
  var text_material = new THREE.LineBasicMaterial({ color: "#000000" });
  var loader = new THREE.FontLoader();
  const z_range = tick_geom[2][0][tick_geom[2][0].length-1].z-tick_geom[2][0][1].z
  const y_range = tick_geom[1][0][tick_geom[1][0].length-1].y-tick_geom[1][0][1].y
  const x_range = tick_geom[0][0][tick_geom[0][0].length-1].x-tick_geom[0][0][1].x

  const largestRange = d3.max([z_range,y_range,x_range])
  
  const text_size = largestRange/30
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const label_gap = 0.1
    for (let i=0; i<3;i++){
      let k = 1
      for (let j=0; j<plot.axis_tick_values[i].length;j++){
        let label_text = plot.axis_tick_values[i][j]
        let label_coord = tick_geom[i][0][k]
        k+=2
        var geometry = new THREE.TextGeometry(label_text.toString(), {
          font: font,
          size: text_size,
          height: 0.0005,
        });
        geometry.computeBoundingBox()
        const text_box=geometry.boundingBox 
        const width = text_box.max.x-text_box.min.x
        const height = text_box.max.y-text_box.min.y
        let mesh = new THREE.Mesh(geometry, text_material);
        if (i===0){
          mesh.position.set(label_coord.x-(width/2),label_coord.y-label_gap ,label_coord.z )
        } else if (i===1){
          mesh.position.set(label_coord.x-label_gap-width,label_coord.y-(height/2),label_coord.z )
        } else if (i ===2){
          mesh.position.set(label_coord.x-width,label_coord.y-height,label_coord.z )
        } 
        plot.axis_ticks_label_group.add(mesh);
      }
    }
  })
  plot.scene.add(plot.axis_ticks_label_group);
  update_render(plot);
}

export {
  update_labels,
  toggle_grid,
  update_gridlines,
  get_scale_factor,
  toggle_ticks,
  toggle_axis_titles,
  toggle_box,
  toggle_camera,
  are_same_color,
  get_text_width,
  make_text_canvas,
  make_label_text_plane,
  make_text_plane,
  get_font_height,
  set_surface_point_hide,
  set_mesh_point_hide,
  hide_surface_point,
  show_surface_point,
  hide_mesh_point,
  show_mesh_point,
  hide_mesh_x,
  show_mesh_x,
  hide_mesh_y,
  show_mesh_y,
  make_axes,
  update_axes,
  resize_axes
};
