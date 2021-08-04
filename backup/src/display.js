import { switch_camera_type ,get_current_camera} from "./camera.js";
import {css_color_to_hex,hex_to_css_color,hex_to_rgb_obj} from './color.js'
import {surrounding_surface_quads,surrounding_mesh_segments} from './surface.js'
import { tau,rad2deg } from "./three_d.js";
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
  // This function moves the axis titles and
  // ticks to the nearest relevant axis to camera.

  var i, j, k, i2, i3, min_dist, this_dist;

  var axes = ["x", "y", "z"];
  var signs = [-1, 1];
  var wanted_signs = [0, 0];
  var final_signs;
  var this_vec;
  var tick_ct = 0;
  var tick_axis;

  for (i = 0; i < 3; i++) {
    min_dist = -1;

    i2 = (i + 1) % 3;
    i3 = (i2 + 1) % 3;

    final_signs = [1, 1];

    for (j = 0; j < 2; j++) {
      for (k = 0; k < 2; k++) {
        this_vec = new THREE.Vector3(0, 0, 0);
        this_vec[axes[i]] = 0;
        this_vec[axes[i2]] = plot.ranges[i2][1] * signs[j];
        this_vec[axes[i3]] = plot.ranges[i3][1] * signs[k];

        this_dist = this_vec.distanceToSquared(
          get_current_camera(plot).position
        );

        if (min_dist < 0 || this_dist < min_dist) {
          min_dist = this_dist;
          wanted_signs[0] = signs[j];
          wanted_signs[1] = signs[k];
        }
      }
    }

    if (plot.axis_text_planes[i].position[axes[i2]] * wanted_signs[0] < 0) {
      final_signs[0] = -1;
    }

    if (plot.axis_text_planes[i].position[axes[i3]] * wanted_signs[1] < 0) {
      final_signs[1] = -1;
    }

    plot.axis_text_planes[i].position[axes[i2]] *= final_signs[0];
    plot.axis_text_planes[i].position[axes[i3]] *= final_signs[1];

    for (j = 0; j < plot.num_ticks[i]; j++) {
      plot.tick_text_planes[tick_ct].position[axes[i2]] *= final_signs[0];
      plot.tick_text_planes[tick_ct].position[axes[i3]] *= final_signs[1];
      tick_ct++;
    }

    tick_axis = wanted_signs[0] + 1 + (wanted_signs[1] + 1) / 2;

    if (plot.show_ticks) {
      for (j = 0; j < 4; j++) {
        if (j != tick_axis) {
          plot.scene.remove(plot.axis_ticks[i][j]);
        } else {
          plot.scene.add(plot.axis_ticks[i][j]);
        }
      }
    }
  }

  plot.renderer.render(plot.scene, get_current_camera(plot));
}

function toggle_ticks(plot) {
  return function () {
    var i, j;
    if (plot.show_ticks) {
      plot.show_ticks = false;
      //plots[i_plot].scene.remove(plots[i_plot].axis_ticks);
      for (i = 0; i < 3; i++) {
        for (j = 0; j < 4; j++) {
          plot.scene.remove(plot.axis_ticks[i][j]);
        }
      }

      for (i = 0; i < plot.tick_text_planes.length; i++) {
        plot.scene.remove(plot.tick_text_planes[i]);
      }
    } else {
      plot.show_ticks = true;
      //plots[i_plot].scene.add(plots[i_plot].axis_ticks);
      if (plot.dynamic_axis_labels) {
        update_axes(plot);
      } else {
        plot.scene.add(plot.axis_ticks[0][0]);
        plot.scene.add(plot.axis_ticks[1][0]);
        plot.scene.add(plot.axis_ticks[2][0]);
      }

      for (i = 0; i < plot.tick_text_planes.length; i++) {
        plot.scene.add(plot.tick_text_planes[i]);
      }
    }

    plot.renderer.render(plot.scene, get_current_camera(plot));
  };
}

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
  return function () {
    if (plot.show_box) {
      plot.show_box = false;
      plot.scene.remove(plot.axis_box);
    } else {
      plot.show_box = true;
      plot.scene.add(plot.axis_box);
    }

    plot.renderer.render(plot.scene, get_current_camera(plot));
  };
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

function make_axes(plot, params, append) {
  // Sometimes this will be called when the plot is
  // first initialised; sometimes it will be when the
  // data is updated change_data() calls it.

  if (append === undefined) {
    append = false;
  }

  var i, j, k, l;
  var axes = ["x", "y", "z", "size"];

  var specify_axis_lengths = params.hasOwnProperty("axis_length_ratios");
  var fix_axes = false;
  var same_scale;

  if (!append) {
    var time_axis = params.hasOwnProperty("time_axis")
      ? JSON.parse(JSON.stringify(params.time_axis))
      : [false, false, false];
    plot.time_axis = JSON.parse(JSON.stringify(time_axis));
  } else {
    time_axis = JSON.parse(JSON.stringify(plot.time_axis));
  }

  if (specify_axis_lengths) {
    var axis_length_ratios = JSON.parse(
      JSON.stringify(params.axis_length_ratios)
    );
    var max_axis_ratio = d3.max(axis_length_ratios);
    fix_axes = true;

    // Poorly named:
    same_scale = [true, true, true];
  } else {
    if (params.hasOwnProperty("same_scale")) {
      same_scale = JSON.parse(JSON.stringify(params.same_scale));
    } else {
      same_scale = [false, false, false];
    }

    var num_same_scales = 0;

    for (i = 0; i < same_scale.length; i++) {
      if (same_scale[i]) {
        num_same_scales++;
      }
    }
    if (num_same_scales > 1) {
      fix_axes = true;
    }
  }

  if (plot.plot_type == "scatter") {
    if (params.hasOwnProperty("size_scale_bound")) {
      if (plot.size_exponent == 0) {
        params.scaled_size_scale_bound = 1;
      } else {
        params.scaled_size_scale_bound = Math.pow(
          params.size_scale_bound,
          1 / plot.size_exponent
        );
      }
    }

    for (i = 0; i < params.data.length; i++) {
      if (plot.size_exponent == 0) {
        params.data[i].scaled_size = 1;
      } else {
        params.data[i].scaled_size = Math.pow(
          params.data[i].size,
          1 / plot.size_exponent
        );
      }
    }
  }

  // var tiny_div = document.createElement("div");
  // tiny_div.style.width = "1px";
  // tiny_div.style.height = "1px";
  // plot.parent_div.appendChild(tiny_div);

  // var axis_color;
  // if (params.hasOwnProperty("axis_color")) {
  //   axis_color = params.axis_color;
  // } else {
  //   if (!plot.hasOwnProperty("axis_color")) {
  //     axis_color = 0xffffff;
  //   } else {
  //     axis_color = plot.axis_color;
  //   }
  // }

  // if (typeof axis_color == "string") {
  //   axis_color = css_color_to_hex(axis_color, tiny_div);
  // }
  plot.axis_color = "#000000";

  var line_material = new THREE.LineBasicMaterial({ color: plot.axis_color });

  var axis_ranges = [100, 100, 100, 100];
  var max_fixed_range = -1;
  var this_axis_range;
  var this_domain;
  var temp_min1, temp_max1, temp_min2, temp_max2;

  if (!append) {
    plot.domains = [];
  }
  plot.ranges = [];
  plot.scales = [];

  var adjust_domains;

  for (i = 0; i < 3; i++) {
    adjust_domains = true;

    if (params.hasOwnProperty(axes[i] + "_scale_bounds")) {
      this_domain = JSON.parse(
        JSON.stringify(params[axes[i] + "_scale_bounds"])
      );
      plot.domains.push([this_domain[0], this_domain[1]]);
      adjust_domains = false;

      if (i == 2 && plot.plot_type == "surface") {
        if (!params.hasOwnProperty("color_scale_bounds")) {
          plot.color_domain = plot.domains[2].slice(0);
        } else {
          plot.color_domain = params.color_scale_bounds.slice(0);
        }
      }
    } else {
      if (plot.plot_type == "scatter") {
        temp_min1 = d3.min(params.data, function (d) {
          return d[axes[i]];
        });
        temp_max1 = d3.max(params.data, function (d) {
          return d[axes[i]];
        });

        if (append) {
          temp_min2 = d3.min(plot.points, function (d) {
            return d.input_data[axes[i]];
          });
          temp_max2 = d3.max(plot.points, function (d) {
            return d.input_data[axes[i]];
          });

          plot.domains[i][0] = d3.min([temp_min1, temp_min2]);
          plot.domains[i][1] = d3.max([temp_max1, temp_max2]);
        } else {
          plot.domains.push([temp_min1, temp_max1]);
        }
      } else if (plot.plot_type == "surface") {
        if (i < 2) {
          // x or y.

          temp_min1 = d3.min(params.data[axes[i]]);
          temp_max1 = d3.max(params.data[axes[i]]);

          if (append) {
            if (i == 0) {
              // x.
              temp_min2 = d3.min(plot.mesh_points, function (d) {
                return d[0].input_data.x;
              });
              temp_max2 = d3.max(plot.mesh_points, function (d) {
                return d[0].input_data.x;
              });
            } else if (i == 1) {
              // y.
              temp_min2 = d3.min(plot.mesh_points[0], function (d) {
                return d.input_data.y;
              });
              temp_max2 = d3.max(plot.mesh_points[0], function (d) {
                return d.input_data.y;
              });
            }

            plot.domains[i][0] = d3.min([temp_min1, temp_min2]);
            plot.domains[i][1] = d3.max([temp_max1, temp_max2]);
          } else {
            plot.domains.push([temp_min1, temp_max1]);
          }
        } else if (i == 2) {
          // z.

          temp_min1 = d3.min(params.data.z, function (d) {
            return d3.min(d);
          });
          temp_max1 = d3.max(params.data.z, function (d) {
            return d3.max(d);
          });

          if (append) {
            temp_min2 = d3.min(plot.mesh_points, function (d) {
              return d3.min(d, function (d2) {
                return d2.input_data.z;
              });
            });
            temp_max2 = d3.max(plot.mesh_points, function (d) {
              return d3.max(d, function (d2) {
                return d2.input_data.z;
              });
            });

            plot.domains[i][0] = d3.min([temp_min1, temp_min2]);
            plot.domains[i][1] = d3.max([temp_max1, temp_max2]);
          } else {
            plot.domains.push([temp_min1, temp_max1]);
          }

          if (!params.hasOwnProperty("color_scale_bounds")) {
            plot.color_domain = plot.domains[2].slice(0);
            if (time_axis[i]) {
              plot.color_domain[0] = new Date(
                JSON.parse(JSON.stringify(plot.color_domain[0]))
              );
              plot.color_domain[1] = new Date(
                JSON.parse(JSON.stringify(plot.color_domain[1]))
              );

              if (
                plot.color_domain[0].getTime() == plot.color_domain[1].getTime()
              ) {
                plot.color_domain[0].setTime(
                  plot.color_domain[0].getTime() - plot.null_width_time
                );
                plot.color_domain[1].setTime(
                  plot.color_domain[1].getTime() + plot.null_width_time
                );
              }
            } else {
              if (plot.color_domain[0] == plot.color_domain[1]) {
                plot.color_domain[0] -= plot.null_width;
                plot.color_domain[1] += plot.null_width;
              }
            }
          } else {
            plot.color_domain = params.color_scale_bounds.slice(0);
          }
        }
      }
    }

    if (time_axis[i]) {
      // It looks like for a time axis, the domains[i] contains
      // shallow copies of the min and max from the data, so go
      // through JSON to prevent the input data values from being
      // changed when the axis extents are changed (!).
      plot.domains[i][0] = new Date(
        JSON.parse(JSON.stringify(plot.domains[i][0]))
      );
      plot.domains[i][1] = new Date(
        JSON.parse(JSON.stringify(plot.domains[i][1]))
      );

      this_axis_range =
        plot.domains[i][1].getTime() - plot.domains[i][0].getTime();
    } else {
      this_axis_range = plot.domains[i][1] - plot.domains[i][0];
    }

    axis_ranges[i] = this_axis_range;

    if (this_axis_range == 0) {
      if (time_axis[i]) {
        plot.domains[i][0].setTime(
          plot.domains[i][0].getTime() - plot.null_width_time
        );
        plot.domains[i][1].setTime(
          plot.domains[i][1].getTime() + plot.null_width_time
        );
      } else {
        plot.domains[i][0] -= plot.null_width;
        plot.domains[i][1] += plot.null_width;
      }
    } else {
      if (adjust_domains) {
        if (time_axis[i]) {
          plot.domains[i][0].setTime(
            plot.domains[i][0].getTime() - 0.1 * this_axis_range
          );
          plot.domains[i][1].setTime(
            plot.domains[i][1].getTime() + 0.1 * this_axis_range
          );
        } else {
          plot.domains[i][0] -= 0.1 * this_axis_range;
          plot.domains[i][1] += 0.1 * this_axis_range;
        }
      }
    }

    if (fix_axes && same_scale[i]) {
      if (this_axis_range > max_fixed_range) {
        max_fixed_range = this_axis_range;
      }
    }
  }

  if (plot.plot_type == "scatter") {
    // Sphere min size extent is always zero.
    if (params.hasOwnProperty("size_scale_bound")) {
      plot.domains.push([0, params.scaled_size_scale_bound]);
    } else {
      temp_max1 = d3.max(params.data, function (d) {
        return d.scaled_size;
      });

      if (append) {
        temp_max2 = d3.max(plot.points, function (d) {
          return d.input_data.scaled_size;
        });
        plot.domains[3][1] = d3.max([temp_max1, temp_max2]);
      } else {
        plot.domains.push([0, temp_max1]);
      }
    }
  }

  var axis_scale_factor = [1, 1, 1];
  for (i = 0; i < 3; i++) {
    if (fix_axes && same_scale[i]) {
      axis_scale_factor[i] = axis_ranges[i] / max_fixed_range;
    }

    if (fix_axes && specify_axis_lengths) {
      axis_scale_factor[i] = axis_length_ratios[i] / max_axis_ratio;
    }

    plot.ranges.push([-axis_scale_factor[i], axis_scale_factor[i]]);
  }

  if (plot.plot_type == "scatter") {
    if (params.hasOwnProperty("max_point_height")) {
      plot.max_point_height = params.max_point_height;
    } else {
      if (!plot.hasOwnProperty("max_point_height")) {
        plot.max_point_height = 25;
      }
    }

    plot.ranges.push([0, plot.max_point_height]);
  }

  var n_axes = 4;
  time_axis.push(false);
  if (plot.plot_type == "surface") {
    n_axes = 3;
  }

  for (i = 0; i < n_axes; i++) {
    if (time_axis[i]) {
      plot.scales.push(
        d3.scaleTime().domain(plot.domains[i]).range(plot.ranges[i])
      );
    } else {
      plot.scales.push(
        d3.scaleLinear().domain(plot.domains[i]).range(plot.ranges[i])
      );
    }
  }
  var box_geom = []
  //var box_geom = new THREE.Geometry();
  // LineSegments draws a segment between vertices 0 and 1, 2, and 3, 4 and 5, ....
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      -axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      -axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      -axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      -axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );

  // Top:
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      -axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      -axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      -axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      -axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  // Vertical edges:
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      -axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      -axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      axis_scale_factor[0],
      axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );

  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      -axis_scale_factor[1],
      -axis_scale_factor[2]
    )
  );
  box_geom.push(
    new THREE.Vector3(
      -axis_scale_factor[0],
      -axis_scale_factor[1],
      axis_scale_factor[2]
    )
  );
  // Base:
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );

  // // Top:
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // // Vertical edges:
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     axis_scale_factor[0],
  //     axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );

  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     -axis_scale_factor[2]
  //   )
  // );
  // box_geom.vertices.push(
  //   new THREE.Vector3(
  //     -axis_scale_factor[0],
  //     -axis_scale_factor[1],
  //     axis_scale_factor[2]
  //   )
  // );
  box_geom = new THREE.BufferGeometry().setFromPoints( box_geom );
  plot.axis_box = new THREE.LineSegments(box_geom, line_material);

  if (!plot.hasOwnProperty("show_box")) {
    plot.show_box = params.hasOwnProperty("show_box") ? params.show_box : true;
  }

  if (plot.show_box) {
    plot.scene.add(plot.axis_box);
  }

  // Axis ticks.
  var num_ticks = params.hasOwnProperty("num_ticks")
    ? JSON.parse(JSON.stringify(params.num_ticks))
    : [4, 4, 4];
  var tick_lengths = params.hasOwnProperty("tick_lengths")
    ? JSON.parse(JSON.stringify(params.tick_lengths))
    : [0.03, 0.03, 0.03];

  if (!plot.hasOwnProperty("show_ticks")) {
    plot.show_ticks = params.hasOwnProperty("show_ticks")
      ? JSON.parse(JSON.stringify(params.show_ticks))
      : true;
  }

  var tick_formats, dx, dec_places, sig_figs, max_abs_value;
  var axis_tick_values = [];
  var axis_key;

  for (i = 0; i < 3; i++) {
    axis_key = axes[i] + "_tick_values";
    if (params.hasOwnProperty(axis_key)) {
      axis_tick_values.push(JSON.parse(JSON.stringify(params[axis_key])));
    } else {
      if (time_axis[i]) {
        axis_tick_values.push(
          d3.scaleTime().domain(plot.domains[i]).ticks(num_ticks[i])
        );
      } else {
        axis_tick_values.push(
          d3.scaleLinear().domain(plot.domains[i]).ticks(num_ticks[i])
        );
      }
    }
  }

  var this_dx;

  if (params.hasOwnProperty("tick_formats")) {
    tick_formats = JSON.parse(JSON.stringify(params.tick_formats));
  } else {
    tick_formats = ["", "", ""];
  }

  for (i = 0; i < 3; i++) {
    if (tick_formats[i] == "") {
      if (!time_axis[i]) {
        dx = plot.domains[i][1] - plot.domains[i][0];

        for (j = 0; j < axis_tick_values[i].length - 1; j++) {
          this_dx = axis_tick_values[i][j + 1] - axis_tick_values[i][j];
          if (this_dx < dx) {
            dx = this_dx;
          }
        }

        if (dx < 10) {
          dec_places = d3.precisionFixed(dx);
          tick_formats[i] = "." + dec_places + "f";
        } else {
          max_abs_value = plot.domains[i][1];
          if (Math.abs(plot.domains[i][0]) > Math.abs(max_abs_value)) {
            max_abs_value = Math.abs(plot.domains[i][0]);
          }

          sig_figs = d3.precisionRound(dx, max_abs_value);
          tick_formats[i] = "." + sig_figs + "r";
        }
      } else {
        // Handled later on when the d3.timeFormat is called?
      }
    } else if (tick_formats[i] == "none") {
      tick_formats[i] = "";
    }
  }

  plot.axis_ticks = [];
  var tick_vertices = [];
  var tick_geom, vertex1, vertex2, i2, i3;

  var tick_locations = [];

  tick_geom = [];
  var signs = [-1, 1];

  var axis_ct;

  for (i = 0; i < 3; i++) {
    tick_locations.push([]);
    tick_geom.push([
      [],
      [],
      [],
      []
    ])
    plot.axis_ticks.push([]);

    i2 = (i + 1) % 3;
    i3 = (i2 + 1) % 3;
    for (j = 0; j < axis_tick_values[i].length; j++) {
      axis_ct = 0;
      for (k = 0; k < 2; k++) {
        for (l = 0; l < 2; l++) {
          vertex1 = new THREE.Vector3(0, 0, 0);
          vertex1[axes[i]] = plot.scales[i](axis_tick_values[i][j]);
          vertex1[axes[i2]] = signs[k] * axis_scale_factor[i2];
          vertex1[axes[i3]] = signs[l] * axis_scale_factor[i3];

          vertex2 = new THREE.Vector3(
            tick_lengths[i],
            tick_lengths[i],
            tick_lengths[i]
          );
          vertex2[axes[i]] = 0;
          vertex2[axes[i2]] *= signs[k];
          vertex2[axes[i3]] *= signs[l];
          vertex2.add(vertex1);

          tick_geom[i][axis_ct].push(vertex1);
          tick_geom[i][axis_ct].push(vertex2);

          axis_ct++;
        }
      }
      tick_locations[i][j] = vertex1[axes[i]];
    }
    
    for (j = 0; j < 4; j++) {
      let g = new THREE.BufferGeometry().setFromPoints( tick_geom[i][j]);
      plot.axis_ticks[i].push(
        new THREE.LineSegments(g, line_material)
      );
    }
  }
  console.log(plot.axis_ticks)
  if (plot.show_ticks) {
    plot.scene.add(plot.axis_ticks[0][0]);
    plot.scene.add(plot.axis_ticks[1][0]);
    plot.scene.add(plot.axis_ticks[2][0]);
  }

  // Gridlines.
  var grid_color = "#000000"
  // params.hasOwnProperty("grid_color")
  //   ? params.grid_color
  //   : 0x808080;
  // if (typeof grid_color == "string") {
  //   grid_color = css_color_to_hex(grid_color, tiny_div);
  // }

  plot.bounding_planes = [
    axis_scale_factor[0],
    axis_scale_factor[1],
    axis_scale_factor[2],
  ];
  var grid_material = new THREE.LineBasicMaterial({ color: grid_color });

  if (!plot.hasOwnProperty("show_grid")) {
    plot.show_grid = params.hasOwnProperty("show_grid")
      ? params.show_grid
      : true;
  }

  plot.grid_lines_upper = [];
  plot.grid_lines_lower = [];
  var grid_geom_lower, grid_geom_upper;
  var tick_ct;

  for (i = 0; i < 3; i++) {
    // grid_geom_lower = new THREE.Geometry();
    // grid_geom_upper = new THREE.Geometry();
    grid_geom_lower = [];
    grid_geom_upper = [];

    // Want to draw lines on the planes parallel
    // to axis[i] == const.

    for (j = 0; j < 3; j++) {
      if (j != i) {
        k = ~(i | j) & 3;

        for (tick_ct = 0; tick_ct < axis_tick_values[j].length; tick_ct++) {
          // Lower plane:
          let vertex1 = new THREE.Vector3();
          vertex1[axes[i]] = -axis_scale_factor[i];
          vertex1[axes[k]] = -axis_scale_factor[k];
          vertex1[axes[j]] = tick_locations[j][tick_ct];

          let vertex2 = new THREE.Vector3();
          vertex2[axes[i]] = -axis_scale_factor[i];
          vertex2[axes[k]] = axis_scale_factor[k];
          vertex2[axes[j]] = tick_locations[j][tick_ct];

          grid_geom_lower.push(vertex1);
          grid_geom_lower.push(vertex2);

          // Upper plane:
          vertex1 = new THREE.Vector3();
          vertex1[axes[i]] = axis_scale_factor[i];
          vertex1[axes[k]] = -axis_scale_factor[k];
          vertex1[axes[j]] = tick_locations[j][tick_ct];

          vertex2 = new THREE.Vector3();
          vertex2[axes[i]] = axis_scale_factor[i];
          vertex2[axes[k]] = axis_scale_factor[k];
          vertex2[axes[j]] = tick_locations[j][tick_ct];

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

  // Axis tick values.

  // var tick_font_size;
  // if (params.hasOwnProperty("tick_font_size")) {
  //   tick_font_size = params.tick_font_size;
  // } else {
  //   if (!plot.hasOwnProperty("tick_font_size")) {
  //     tick_font_size = 28;
  //   } else {
  //     tick_font_size = plot.tick_font_size;
  //   }
  // }
  // plot.tick_font_size = tick_font_size;

  // // In case we're on orthographic camera and the perspective fov hasn't updated:
  // if (plot.view_type == "orthographic") {
  //   plot.persp_camera.fov =
  //     Math.atan2(plot.ortho_camera.top, plot.camera_distance_scale) *
  //     rad2deg *
  //     2;
  // }

  // var init_scale =
  //   (2 *
  //     tick_font_size *
  //     plot.camera_distance_scale *
  //     Math.tan((0.5 * plot.persp_camera.fov) / rad2deg)) /
  //   plot.height;

  // var axis_tick_gaps = [0.1, 0.1, 0.1];
  // if (params.hasOwnProperty("axis_tick_gaps")) {
  //   axis_tick_gaps = JSON.parse(JSON.stringify(params.axis_tick_gaps));
  // } else {
  //   if (plot.hasOwnProperty("axis_tick_gaps")) {
  //     axis_tick_gaps = JSON.parse(JSON.stringify(plot.axis_tick_gaps));
  //   }
  // }
  // plot.axis_tick_gaps = JSON.parse(JSON.stringify(axis_tick_gaps));

  // if (!plot.hasOwnProperty("init_tick_scale")) {
  //   // If we're changing data, we may already have this scale set,
  //   // and it would get updated to the wrong fov.
  //   plot.init_tick_scale = init_scale;
  // }

  // var tick_font_color;
  // if (params.hasOwnProperty("tick_font_color")) {
  //   if (typeof params.axis_font_color == "number") {
  //     tick_font_color = hex_to_css_color(params.tick_font_color);
  //   } else {
  //     tick_font_color = params.tick_font_color;
  //   }
  // } else {
  //   if (!plot.hasOwnProperty("tick_font_color")) {
  //     tick_font_color = "#FFFFFF";
  //   } else {
  //     tick_font_color = plot.tick_font_color;
  //   }
  // }
  // plot.tick_font_color = "#FFFFFF"//tick_font_color;
  // var d3_formatter;
  // var tick_ct = 0;
  // plot.tick_text_planes = [];
  // plot.num_ticks = [];

  // var font;
  // if (params.hasOwnProperty("font")) {
  //   font = params.font;
  // } else {
  //   if (!plot.hasOwnProperty("font")) {
  //     font = "Arial, sans-serif";
  //   } else {
  //     font = plot.font;
  //   }
  // }
  // plot.font = font;

  // var bg_color;
  // if (params.hasOwnProperty("background_color")) {
  //   bg_color = params.background_color;
  // } else {
  //   if (!plot.hasOwnProperty("background_color")) {
  //     bg_color = "#000000";
  //   } else {
  //     bg_color = plot.background_color;
  //   }
  // }
  // plot.background_color = bg_color;

  // //var bg_color_hex;

  // // if (typeof bg_color == "string") {
  // //   bg_color_hex = css_color_to_hex(bg_color, tiny_div);
  // // } else {
  // //   bg_color_hex = bg_color;
  // //   bg_color = hex_to_css_color(bg_color);
  // // }

  // for (i = 0; i < 3; i++) {
  //   plot.num_ticks.push(axis_tick_values[i].length);

  //   if (time_axis[i]) {
  //     if (tick_formats[i] == "") {
  //       d3_formatter = plot.scales[i].tickFormat(plot.num_ticks[i]);
  //     } else {
  //       d3_formatter = d3.timeFormat(tick_formats[i]);
  //     }
  //   } else {
  //     d3_formatter = d3.format(tick_formats[i]);
  //   }

  //   for (j = 0; j < axis_tick_values[i].length; j++) {
  //     plot.tick_text_planes.push(
  //       make_text_plane(
  //         d3_formatter(axis_tick_values[i][j]),
  //         font,
  //         tick_font_size,
  //         tick_font_color,
  //         bg_color,
  //         true,
  //         plot.font_ratio
  //       )
  //     );

  //     for (k = 0; k < 3; k++) {
  //       if (i == k) {
  //         plot.tick_text_planes[tick_ct].position[axes[k]] =
  //           tick_locations[i][j];
  //       } else {
  //         plot.tick_text_planes[tick_ct].position[axes[k]] =
  //           -axis_scale_factor[k] - axis_tick_gaps[k];
  //       }
  //     }

  //     plot.tick_text_planes[tick_ct].rotation.copy(
  //       get_current_camera(plot).rotation
  //     );
  //     plot.tick_text_planes[tick_ct].scale.set(init_scale, init_scale, 1);

  //     if (plot.show_ticks) {
  //       plot.scene.add(plot.tick_text_planes[tick_ct]);
  //     }

  //     tick_ct++;
  //   }
  // }

  // if (!plot.hasOwnProperty("show_axis_titles")) {
  //   plot.show_axis_titles = params.hasOwnProperty("show_axis_titles")
  //     ? JSON.parse(JSON.stringify(params.show_axis_titles))
  //     : true;
  // }

  // var axis_titles = params.hasOwnProperty("axis_titles")
  //   ? JSON.parse(JSON.stringify(params.axis_titles))
  //   : ["x", "y", "z"];

  // var axis_title_gaps = [0.3, 0.3, 0.3];
  // if (params.hasOwnProperty("axis_title_gaps")) {
  //   axis_title_gaps = JSON.parse(JSON.stringify(params.axis_title_gaps));
  // } else {
  //   if (plot.hasOwnProperty("axis_title_gaps")) {
  //     axis_title_gaps = JSON.parse(JSON.stringify(plot.axis_title_gaps));
  //   }
  // }
  // plot.axis_title_gaps = JSON.parse(JSON.stringify(axis_title_gaps));

  // var axis_font_color;
  // if (params.hasOwnProperty("axis_font_color")) {
  //   axis_font_color = params.axis_font_color;
  // } else {
  //   if (!plot.hasOwnProperty("axis_font_color")) {
  //     axis_font_color = "#FFFFFF";
  //   } else {
  //     axis_font_color = plot.axis_font_color;
  //   }
  // }

  // if (typeof axis_font_color == "number") {
  //   axis_font_color = hex_to_css_color(params.axis_font_color);
  // }

  // plot.axis_font_color = axis_font_color;

  // plot.axis_text_planes = [];

  // var axis_font_size;
  // if (params.hasOwnProperty("axis_font_size")) {
  //   axis_font_size = params.axis_font_size;
  // } else {
  //   if (!plot.hasOwnProperty("axis_font_size")) {
  //     axis_font_size = 30;
  //   } else {
  //     axis_font_size = plot.axis_font_size;
  //   }
  // }
  // plot.axis_font_size = axis_font_size;

  // init_scale =
  //   (2 *
  //     axis_font_size *
  //     plot.camera_distance_scale *
  //     Math.tan((0.5 * plot.persp_camera.fov) / rad2deg)) /
  //   plot.height;

  // if (!plot.hasOwnProperty("init_axis_title_scale")) {
  //   // If we're changing data, we may already have this scale set,
  //   // and it would get updated to the wrong fov.
  //   plot.init_axis_title_scale = init_scale;
  // }

  // for (i = 0; i < 3; i++) {
  //   plot.axis_text_planes.push(
  //     make_text_plane(
  //       axis_titles[i],
  //       font,
  //       axis_font_size,
  //       axis_font_color,
  //       bg_color,
  //       true,
  //       plot.font_ratio
  //     )
  //   );

  //   for (j = 0; j < 3; j++) {
  //     if (i == j) {
  //       plot.axis_text_planes[i].position[axes[j]] = 0;
  //     } else {
  //       plot.axis_text_planes[i].position[axes[j]] =
  //         -axis_scale_factor[j] - axis_title_gaps[i];
  //     }
  //   }

  //   plot.axis_text_planes[i].rotation.copy(get_current_camera(plot).rotation);
  //   plot.axis_text_planes[i].scale.set(init_scale, init_scale, 1);

  //   if (plot.show_axis_titles) {
  //     plot.scene.add(plot.axis_text_planes[i]);
  //   }
  // }

  // if (!plot.hasOwnProperty("dynamic_axis_labels")) {
  //   plot.dynamic_axis_labels = params.hasOwnProperty("dynamic_axis_labels")
  //     ? params.dynamic_axis_labels
  //     : false;
  // }
  // if (plot.dynamic_axis_labels) {
  //   update_axes(plot);
  // }

  //plot.parent_div.removeChild(tiny_div);
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
  update_axes
};
