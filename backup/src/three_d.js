/* Hello and welcome to my JavaScript.  This is version 1.2 of
 * three_d.js. It assumes r81 of three.js.
 * 
 * The first part of this file are some d3.js modules.
 * 
 * Most of the early functions in my code handle the mouse and touch
 * events -- rotating, panning, raycasting, etc.  I learned how to use
 * quaternions while writing the rotation code, and as of v1.1 it's
 * pretty clean -- no longer a fudged together saga involving
 * arbitrarily-signed angles.
 * 
 * The creation of the plots themselves is a fairly disorganised mess,
 * caused by me only deciding to allow transitions between data values
 * quite late, and copy-pasting out some blocks of code to somewhat
 * unthematic functions.  Scatterplots start in make_scatter(); surfaces
 * start in make_surface().
 * 
 * The plot area itself is mostly made in basic_plot_setup() and
 * basic_plot_listeners().  Axes and scales are created in make_axes().
 * The scatterplot points are made in make_points(), and the
 * mesh/surface in make_mesh_points(), which calls make_mesh_arrays().
 * 
 * It hangs together, just....
 * 
 * David Barry, 2018-07-06.
 */


import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

import {
	touch_start_fn,
	touch_move_fn,
	touch_end_fn,
	mouse_down_fn,
	mouse_up_fn,
	mouse_zoom_wrapper,
	mouse_move_wrapper,
	mouse_out_wrapper,
  } from './mouse.js'
import { get_current_camera, reset_camera_wrapper,reset_camera } from './camera.js'
import {set_surface_color_scale_fn,
	calculate_color,
	hex_to_css_color,
	hex_to_rgb_obj,
	hex_to_rgb_obj_255,
	css_color_to_hex,
	set_point_color,
	set_label_color,
	get_colors,
	colorise_otherise_params,} from './color.js'
import {
	update_labels,
	toggle_grid,
	get_scale_factor,
	toggle_ticks,
	toggle_axis_titles,
	toggle_box,
	toggle_camera,
	get_font_height,
	hide_surface_point,
	hide_mesh_point,
	make_axes,
  } from './display.js'

import {check_surface_data_sizes,
    update_surface_input_data,
    make_mesh_arrays,
    make_mesh_points,
} from './surface.js'

import {
    update_points_input_data,
    make_points,
    set_point_size,
} from './scatter.js'

import {make_surface} from './surface.js'
const tau = 6.283185307179586;
const rad2deg = 57.295779513082323;

// The main array, one entry per plot,
// which will hold everything.
let plots = [];


function get_i_plot(div_id,plots) {
	for (var i = 0; i < plots.length; i++) {
		if (plots[i] !== null) {
			if (plots[i].parent_div.id == div_id) {
				return i;
			}
		}
	}
	return -1;
}

function destroy_plot(plot) {
	plot.parent_div.innerHTML = "";
	plot = null;
}







function hide_photosphere(plot) {
	plot.scene.remove(plot.photosphere);
}

function show_photosphere(plot) {
	plot.scene.add(plot.photosphere);
}




function update_render(plot) {
	plot.renderer.render(plot.scene, get_current_camera(plot));
}

function prepare_sizes(plot, params) {
	colorise_otherise_params(plot, params);
	
	if (plot.geom_type == "none") {
		plot.have_any_labels = false;
		plot.have_any_sizes = false;
		return;
	}
	
	var i;
	
	plot.have_any_sizes = plot.have_any_sizes || false;
	plot.have_any_labels = plot.have_any_labels || false;
	
	for (i = 0; i < params.data.length; i++) {
		if (params.data[i].hasOwnProperty("size")) {
			if (!!params.data[i].size || (params.data[i].size === 0)) {
				plot.have_any_sizes = true;
			} else {
				params.data[i].size = null;
			}
		} else {
			params.data[i].size = null;
		}
		
		if (!params.data[i].hasOwnProperty("label")) {
			params.data[i].label = "";
		} else {
			if (params.data[i].label !== null) {
				if (typeof(params.data[i].label) != "string") {
					params.data[i].label = params.data[i].label + "";
				}
				
				if (params.data[i].label.length > 0) {
					plot.have_any_labels = true;
				}
			} else {
				params.data[i].label = "";
			}
		}
	}
	
	if (params.hasOwnProperty("size_exponent")) {
		plot.size_exponent = 2*params.size_exponent;
	} else {
		if (!(plot.hasOwnProperty("size_exponent"))) {
			plot.size_exponent = 2;
		}
	}
}


function calculate_locations(plot, params, ignore_surface_colors) {
	if (ignore_surface_colors === undefined) { ignore_surface_colors = false; }
	
	var return_object = {};
	return_object.null_points = [];
	
	var this_loc, this_size, group, i, j;
	var axes = ["x", "y", "z"];
	
	if (plot.plot_type == "scatter") {
		return_object.plot_locations = [];
		
		var use_default = false;
		
		for (i = 0; i < params.data.length; i++) {
			return_object.plot_locations.push([]);
			return_object.null_points.push(0);
			
			for (j = 0; j < 3; j++) {
				return_object.plot_locations[i].push(plot.scales[j](params.data[i][axes[j]]));
				
				if (isNaN(return_object.plot_locations[i][j]) || (params.data[i][axes[j]] === null)) {
					return_object.plot_locations[i][j] = 0;
					return_object.null_points[i] = 1;
				}
			}
			
			if (plot.have_any_sizes) {
				if ((params.data[i].size === null) || (isNaN(params.data[i].size))) {
					use_default = true;
				} else {
					if (plot.size_exponent != 0) {
						this_size = plot.scales[3](params.data[i].scaled_size);
					} else {
						use_default = true;
					}
				}
			} else {
				use_default = true;
			}
			
			if (use_default) {
				if (plot.have_groups) {
					group = params.data[i].group;
				} else {
					group = "default_group";
				}
				
				this_size = plot.groups[group].default_point_height;
			}
			
			return_object.plot_locations[i].push(this_size);
		}
	} else if (plot.plot_type == "surface") {
		return_object.plot_locations = {"x": [], "y": [], "z": [], "color": []};
		var this_color;
		
		for (i = 0; i < 2; i++) {
			// x and y.
			
			for (j = 0; j < params.data[axes[i]].length; j++) {
				return_object.plot_locations[axes[i]].push(plot.scales[i](params.data[axes[i]][j]));
			}
		}
		
		// z.
		for (i = 0; i < params.data.z.length; i++) {
			return_object.plot_locations.z.push([]);
			return_object.null_points.push([]);
			
			for (j = 0; j < params.data.z[i].length; j++) {
				return_object.null_points[i].push(0);
				return_object.plot_locations.z[i].push(plot.scales[2](params.data.z[i][j]));
				
				if (isNaN(return_object.plot_locations.z[i][j]) || (params.data.z[i][j] === null)) {
					return_object.plot_locations.z[i][j] = 0;
					return_object.null_points[i][j] = 1;
				}
			}
		}
		
		if (!("color_fn" in plot)) {
			if (!("color_scale" in params)) {
				params.color_scale = "viridis";
			} 
			set_surface_color_scale_fn(plot, params.color_scale);
		}
		// if (plot.have_color_matrix) {
		// 	var tiny_div = document.createElement("div");
		// 	tiny_div.style.width = "1px";
		// 	tiny_div.style.height = "1px";
		// 	plot.parent_div.appendChild(tiny_div);
			
		// 	if (ignore_surface_colors) {
		// 		for (i = 0; i < plot.mesh_points.length; i++) {
		// 			return_object.plot_locations.color.push([]);
					
		// 			for (j = 0; j < plot.mesh_points[i].length; j++) {
		// 				return_object.plot_locations.color[i].push([0, 0, 0]);
		// 			}
		// 		}
		// 	} else {
		// 		for (i = 0; i < params.data.color.length; i++) {
		// 			return_object.plot_locations.color.push([]);
					
		// 			for (j = 0; j < params.data.color[i].length; j++) {
		// 				this_color = params.data.color[i][j];
						
		// 				if (typeof(this_color) == "string") {
		// 					this_color = css_color_to_hex(this_color, tiny_div);
		// 					params.data.color[i][j] = this_color;
		// 				}
						
		// 				this_color = hex_to_rgb_obj(this_color);
		// 				return_object.plot_locations.color[i].push([this_color.r, this_color.g, this_color.b]);
		// 			}
		// 		}
		// 	}
			
		// 	plot.parent_div.removeChild(tiny_div);
		// } else {
			params.data.color = [];
			var this_color, this_color_num;
			
			for (i = 0; i < params.data.z.length; i++) {
				return_object.plot_locations.color.push([]);
				params.data.color.push([]);
				
				for (j = 0; j < params.data.z[i].length; j++) {
					if (return_object.null_points[i][j]) {
						this_color = [0, 0, 0];
						this_color_num = 0;
					} else {
						this_color = calculate_color(params.data.z[i][j], plot.color_domain, plot.color_fn);
						this_color_num = 65536*Math.round(255*this_color[0]) + 256*Math.round(255*this_color[1]) + Math.round(255*this_color[2]);
					}
					
					return_object.plot_locations.color[i].push(this_color.slice(0));
					params.data.color[i].push(this_color_num);
				}
			}
		//}
	}
	
	return return_object;
}






function smoothstep(t) {
	return t*t*t*(t*(t*6 - 15) + 10);
}

function animate_transition_wrapper(plot) {
	return function() {
		animate_transition(plot);
	}
}

function animate_transition(plot) {
	var i, j, t, group, i_group;
	
	if (plot.transition_t > 1) { plot.transition_t = 1; }
	t = smoothstep(plot.transition_t);
	
	if (plot.plot_type == "scatter") {
		if (plot.geom_type == "point") {
			var positions = plot.points_merged.geometry.attributes.position.array;
			var sizes = plot.points_merged.geometry.attributes.dot_height.array;
			var colors = plot.points_merged.geometry.attributes.color.array;
		} else if (plot.geom_type == "quad") {
			var this_size, colors;
			var scale_factor = 2 * get_scale_factor(plot);
		}
		
		
		if (plot.have_segments) {
			var group_lines = {};
			if (group in plot.groups) 
			 {
				
				for (group in plot.groups)
				
				{
					group_lines[group] = {};
					
					group_lines[group].positions = plot.groups[group].segment_lines.geometry.attributes.position.array;
					group_lines[group].colors = plot.groups[group].segment_lines.geometry.attributes.color.array;
					
					plot.groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
					plot.groups[group].segment_lines.geometry.attributes.color.needsUpdate = true;
				}
			}
		}
	} else if (plot.plot_type == "surface") {
		var positions = plot.surface.geometry.attributes.position.array;
		var colors = plot.surface.geometry.attributes.color.array;
		
		var mesh_positions = plot.surface_mesh.geometry.attributes.position.array;
		var mesh_colors = plot.surface_mesh.geometry.attributes.color.array;
		
		plot.surface.geometry.attributes.position.needsUpdate = true;
		plot.surface.geometry.attributes.color.needsUpdate = true;
		
		plot.surface_mesh.geometry.attributes.position.needsUpdate = true;
		plot.surface_mesh.geometry.attributes.color.needsUpdate = true;
	}
	
	var new_color, this_color, r, g, b, this_x, this_y, this_z;
	
	if (plot.plot_type == "scatter") {
		for (i = 0; i < plot.points.length; i++) {
			new_color = hex_to_rgb_obj_255(plot.new_colors[i]);
			this_size = t*plot.new_locations[i][3] + (1 - t)*plot.old_heights[i];
			
			if ((plot.geom_type == "point") || (plot.geom_type == "quad")) {
				r = Math.round(t*new_color.r + (1 - t)*plot.old_colors[4*i + 0]);
				g = Math.round(t*new_color.g + (1 - t)*plot.old_colors[4*i + 1]);
				b = Math.round(t*new_color.b + (1 - t)*plot.old_colors[4*i + 2]);
			} else if (plot.geom_type == "none") {
				// Whoops.
				r = Math.round(t*new_color.r + (1 - t)*255*plot.old_colors[4*i + 0]);
				g = Math.round(t*new_color.g + (1 - t)*255*plot.old_colors[4*i + 1]);
				b = Math.round(t*new_color.b + (1 - t)*255*plot.old_colors[4*i + 2]);
			}
			
			this_color = (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b);
			
			set_point_color(plot, i, this_color, true);
			if (plot.points[i].have_label) {
				set_label_color(plot, i, this_color);
			}
			
			set_point_size(plot, i, this_size, scale_factor);
			
			if (plot.geom_type == "point") {
				this_x = t*plot.new_locations[i][0] + (1 - t)*plot.old_positions[3*i + 0];
				this_y = t*plot.new_locations[i][1] + (1 - t)*plot.old_positions[3*i + 1];
				this_z = t*plot.new_locations[i][2] + (1 - t)*plot.old_positions[3*i + 2];
				
				positions[3*i + 0] = this_x;
				positions[3*i + 1] = this_y;
				positions[3*i + 2] = this_z;
			} else if (plot.geom_type == "quad") {
				this_x = t*plot.new_locations[i][0] + (1 - t)*plot.old_positions[i].x;
				this_y = t*plot.new_locations[i][1] + (1 - t)*plot.old_positions[i].y;
				this_z = t*plot.new_locations[i][2] + (1 - t)*plot.old_positions[i].z;
				
				plot.points[i].position.x = this_x;
				plot.points[i].position.y = this_y;
				plot.points[i].position.z = this_z;
			}
			
			if (plot.have_segments) {
				// If points are connected, then the groups shouldn't
				// change; irregular behaviour will results if groups
				// _do_ change.
				group = plot.points[i].group;
				i_group = plot.points[i].i_group;
				
				if (plot.geom_type == "none") {
					this_x = t*plot.new_locations[i][0] + (1 - t)*plot.old_positions[3*i + 0];
					this_y = t*plot.new_locations[i][1] + (1 - t)*plot.old_positions[3*i + 1];
					this_z = t*plot.new_locations[i][2] + (1 - t)*plot.old_positions[3*i + 2];
				}
				
				group_lines[group].positions[3*i_group + 0] = this_x;
				group_lines[group].positions[3*i_group + 1] = this_y;
				group_lines[group].positions[3*i_group + 2] = this_z;
			}
		}
		
		if (plot.geom_type == "point") {
			plot.points_merged.geometry.attributes.position.needsUpdate = true;
		}
		
		if (plot.have_segments) {
			plot.groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
			//plot.groups[group].segment_lines.geometry.attributes.color.needsUpdate = true;
		}
		
		if (plot.have_any_labels) {
			update_labels(plot);
		}
	} else if (plot.plot_type == "surface") {
		var n_points = positions.length/3;
		
		for (i = 0; i < n_points; i++) {
			positions[3*i + 0] = t*plot.new_surface_positions[3*i + 0] + (1 - t)*plot.old_surface_positions[3*i + 0];
			positions[3*i + 1] = t*plot.new_surface_positions[3*i + 1] + (1 - t)*plot.old_surface_positions[3*i + 1];
			positions[3*i + 2] = t*plot.new_surface_positions[3*i + 2] + (1 - t)*plot.old_surface_positions[3*i + 2];
			
			colors[4*i + 0] = t*plot.new_surface_colors[4*i + 0] + (1 - t)*plot.old_surface_colors[4*i + 0];
			colors[4*i + 1] = t*plot.new_surface_colors[4*i + 1] + (1 - t)*plot.old_surface_colors[4*i + 1];
			colors[4*i + 2] = t*plot.new_surface_colors[4*i + 2] + (1 - t)*plot.old_surface_colors[4*i + 2];
			colors[4*i + 3] = t*plot.new_surface_colors[4*i + 3] + (1 - t)*plot.old_surface_colors[4*i + 3];
		}
		
		
		n_points = mesh_positions.length/3;
		
		for (i = 0; i < n_points; i++) {
			mesh_positions[3*i + 0] = t*plot.new_mesh_positions[3*i + 0] + (1 - t)*plot.old_mesh_positions[3*i + 0];
			mesh_positions[3*i + 1] = t*plot.new_mesh_positions[3*i + 1] + (1 - t)*plot.old_mesh_positions[3*i + 1];
			mesh_positions[3*i + 2] = t*plot.new_mesh_positions[3*i + 2] + (1 - t)*plot.old_mesh_positions[3*i + 2];
			
			mesh_colors[4*i + 0] = t*plot.new_mesh_colors[4*i + 0] + (1 - t)*plot.old_mesh_colors[4*i + 0];
			mesh_colors[4*i + 1] = t*plot.new_mesh_colors[4*i + 1] + (1 - t)*plot.old_mesh_colors[4*i + 1];
			mesh_colors[4*i + 2] = t*plot.new_mesh_colors[4*i + 2] + (1 - t)*plot.old_mesh_colors[4*i + 2];
			mesh_colors[4*i + 3] = t*plot.new_mesh_colors[4*i + 3] + (1 - t)*plot.old_mesh_colors[4*i + 3];
		}
	}
	
	update_render(plot);
	
	if (plot.transition_t < 1) {
		plot.transition_t += 1/60;
		requestAnimationFrame(animate_transition_wrapper(plot));
	}
}


function change_data(plots, params, new_dataset, animate, append) {
	let i, j, group, i_group;
	
	if (new_dataset === undefined) {
		// Try a smooth transition if not otherwise specified.
		new_dataset = false;
		animate = true;
	}
	
	if (animate === undefined) { animate = true; }
	
	if (plot.plot_type == "scatter") {
		if (params.data.length != plot.points.length) {
			animate = false;
			new_dataset = true;
		}
	} else if (plot.plot_type == "surface") {
		if (append) {
			if (!("append_axis" in params)) {
				console.warn("Need to specify params.append_axis as either \"x\" or \"y\" to append data; cancelling.");
				return;
			}
		}
		
		let size_checks = check_surface_data_sizes(params);
		if (!size_checks.data) { return; }
		
		if (params.data.z.length != plot.mesh_points.length) {
			animate = false;
			new_dataset = true;
		}
		
		for (i = 0; i < params.data.z.length; i++) {
			if (params.data.z[i].length != plot.mesh_points[i].length) {
				animate = false;
				new_dataset = true;
				break;
			}
		}
	}
	
	if (append === undefined) { append = false; }
	
	if (append) {
		new_dataset = true;
		animate = false;
		
		if (plot.plot_type == "scatter") {
			if (plot.have_groups) {
				for (i = 0; i < params.data.length; i++) {
					if (!("group" in params.data[i])) {
						params.data[i].group = "default_group";
					}
				}
			}
		} else if (plot.plot_type == "surface") {
			let have_axis = ("append_axis" in params);
			
			if (have_axis) {
				if (params.append_axis == "x") { params.append_axis = "+x"; }
				if (params.append_axis == "y") { params.append_axis = "+y"; }
				
				if ((params.append_axis == "+x") || (params.append_axis == "-x") || (params.append_axis == "+y") || (params.append_axis == "-y")) {
					// All good.
				} else {
					have_axis = false;
				}
			}
			
			if (!have_axis) {
				console.warn("Need params.append_axis to be one of \"-x\", \"+x\", \"-y\", \"+y\"; cancelling append.");
				return;
			}
			
			
			if ((params.append_axis == "+x") || (params.append_axis == "-x")) {
				if (params.data.z[0].length != plot.mesh_points[0].length) {
					console.warn("Appending to x-axis but params.data.z[0] does not have the same length as original data.z[0]; cancelling.");
					return;
				}
			} else if ((params.append_axis == "+y") || (params.append_axis == "-y")) {
				if (params.data.z.length != plot.mesh_points.length) {
					console.warn("Appending to y-axis but params.data.z does not have the same length as original data.z; cancelling.");
					return;
				}
			}
		}
	}
	
	if (plot.plot_type == "surface") {
		var change_colors = true;
		
		if (!size_checks.colors && new_dataset && !append) {
			plot.have_color_matrix = false;
		}
		
		if (!size_checks.colors && !new_dataset && plot.have_color_matrix) {
			change_colors = false;
		}
	}
	
	let keep_axes = ("keep_axes" in params) ? params.keep_axes : false;
	if (new_dataset && !append) { keep_axes = false; }
	
	if (!keep_axes) {
		// Remove some old things....
		if (plot.show_grid) {
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
		}
		
		if (plot.show_ticks) {
			for (i = 0; i < 3; i++) {
				for (j = 0; j < 4; j++) {
					plot.scene.remove(plot.axis_ticks[i][j]);
				}
			}
			
			for (i = 0; i < plot.tick_text_planes.length; i++) {
				plot.scene.remove(plot.tick_text_planes[i]);
			}
		}
		
		if (plot.show_axis_titles) {
			for (i = 0; i < 3; i++) {
				plot.scene.remove(plot.axis_text_planes[i]);
			}
		}
		
		if (plot.show_box) {
			plot.scene.remove(plot.axis_box);
		}
	}
	
	if (new_dataset) {
		if (!append) {
			// Clear the scene.
			for (i = plot.scene.children.length; i >= 0; i--) {
				plot.scene.remove(plot.scene.children[i]);
			}
			
			if (plot.plot_type == "scatter") {
				if (plot.have_any_labels) {
					plot.labels = [];
					plot.have_any_labels = false;
				}
			}
		}
			
		if (plot.plot_type == "scatter") {
			if (plot.have_groups) {
				for (i = 0; i < params.data.length; i++) {
					if ("group" in params.data[i]) {
						if (plot.groups[params.data[i].group] === undefined) {
							console.warn("Group " + params.data[i].group + " not declared in params.groups");
							params.data[i].group = "default_group";
						}
					} else {
						console.warn("Groups initialised, but missing group property.");
						params.data[i].group = "default_group";
					}
				}
			}
			
			prepare_sizes(plot, params);
		}
		
		if (!keep_axes) {
			make_axes(plot, params, append);
		} else {
			if (plot.plot_type == "scatter") {
				if (plot.geom_type != "none") {
					for (i = 0; i < params.data.length; i++) {
						if (plot.size_exponent == 0) {
							params.data[i].scaled_size = 1;
						} else {
							params.data[i].scaled_size = Math.pow(params.data[i].size, 1/plot.size_exponent);
						}
					}
				}
			}
		}
		
		if (append && (plot.plot_type == "surface")) {
			// To match how points get appended to an existing dataset,
			// the surface appending should be done in make_mesh_points(),
			// but the need to re-interpolate a bunch of z- and colour-
			// values makes it easier to just build a new params.data
			// object.
			
			plot.scene.remove(plot.surface);
			plot.scene.remove(plot.surface_mesh);
			
			var old_hide_points = JSON.parse(JSON.stringify(plot.hide_points));
			var old_hide_mesh_points = JSON.parse(JSON.stringify(plot.hide_mesh_points));
			
			var append_data = JSON.parse(JSON.stringify(params.data));
			var store_colors = true;
			var new_colors_null = false;
			
			params.data = {"x": [], "y": [], "z": [], "other": []};
			
			if (!size_checks.colors && !plot.have_color_matrix) {
				store_colors = false;
			}
			
			if (!size_checks.colors && plot.have_color_matrix) {
				new_colors_null = true;
			}
			
			if (size_checks.colors && !plot.have_color_matrix) {
				plot.have_color_matrix = true;
			}
			
			if (store_colors) {
				params.data.color = [];
			}
			
			var old_nx = plot.mesh_points.length;
			var old_ny = plot.mesh_points[0].length;
			var nx, ny;
			
			for (i = 0; i < old_nx; i++) {
				params.data.x.push(plot.mesh_points[i][0].input_data.x);
			}
			
			for (i = 0; i < old_ny; i++) {
				params.data.y.push(plot.mesh_points[0][i].input_data.y);
			}
			
			if ((params.append_axis == "+x") || (params.append_axis == "-x")) {
				nx = old_nx + append_data.x.length;
				ny = old_ny;
				
				for (i = 0; i < append_data.x.length; i++) {
					if (params.append_axis == "+x") {
						params.data.x.push(append_data.x[i]);
					} else {
						params.data.x.unshift(append_data.x[append_data.x.length - 1 - i]);
					}
				}
			} else if ((params.append_axis == "+y") || (params.append_axis == "-y")) {
				nx = old_nx;
				ny = old_ny + params.data.y.length;
				
				for (i = 0; i < append_data.y.length; i++) {
					if (params.append_axis == "+y") {
						params.data.y.push(append_data.y[i]);
					} else {
						params.data.y.unshift(append_data.y[append_data.y.length - 1 - i]);
					}
				}
			}
			
			for (i = 0; i < old_nx; i++) {
				params.data.z.push([]);
				params.data.other.push([]);
				
				if (store_colors) {
					params.data.color.push([]);
				}
				
				for (j = 0; j < old_ny; j++) {
					params.data.z[i].push(plot.mesh_points[i][j].input_data.z);
					params.data.other[i].push(JSON.parse(JSON.stringify(plot.mesh_points[i][j].input_data.other)));
					
					if (store_colors) {
						params.data.color[i].push(plot.mesh_points[i][j].input_data.color);
					}
				}
			}
			
			if (params.append_axis == "+x") {
				for (i = 0; i < append_data.x.length; i++) {
					params.data.z.push([]);
					params.data.other.push([]);
					
					if (store_colors) {
						params.data.color.push([]);
					}
					
					for (j = 0; j < old_ny; j++) {
						params.data.z[i + old_nx].push(append_data.z[i][j]);
						params.data.other[i + old_nx].push(JSON.parse(JSON.stringify(append_data.other[i][j])));
						
						if (store_colors) {
							if (new_colors_null) {
								params.data.color[i + old_nx].push(0);
							} else {
								params.data.color[i + old_nx].push(append_data.color[i][j]);
							}
						}
					}
				}
			} else if (params.append_axis == "-x") {
				for (i = append_data.x.length - 1; i >= 0; i--) {
					params.data.z.unshift([]);
					params.data.other.unshift([]);
					
					if (store_colors) {
						params.data.color.unshift([]);
					}
					
					for (j = 0; j < old_ny; j++) {
						params.data.z[0].push(append_data.z[i][j]);
						params.data.other[0].push(JSON.parse(JSON.stringify(append_data.other[i][j])));
						
						if (store_colors) {
							if (new_colors_null) {
								params.data.color[0].push(0);
							} else {
								params.data.color[0].push(append_data.color[i][j]);
							}
						}
					}
				}
			} else if (params.append_axis == "+y") {
				for (i = 0; i < old_nx; i++) {
					for (j = 0; j < append_data.y.length; j++) {
						params.data.z[i].push(append_data.z[i][j]);
						params.data.other[i].push(JSON.parse(JSON.stringify(append_data.other[i][j])));
						
						if (store_colors) {
							if (new_colors_null) {
								params.data.color[i].push(0);
							} else {
								params.data.color[i].push(append_data.color[i][j]);
							}
						}
					}
				}
			} else if (params.append_axis == "-y") {
				for (i = 0; i < old_nx; i++) {
					for (j = append_data.y.length - 1; j >= 0; j--) {
						params.data.z[i].unshift(append_data.z[i][j]);
						params.data.other[i].unshift(JSON.parse(JSON.stringify(append_data.other[i][j])));
						
						if (store_colors) {
							if (new_colors_null) {
								params.data.color[i].unshift(0);
							} else {
								params.data.color[i].unshift(append_data.color[i][j]);
							}
						}
					}
				}
			}
		}
		
		let temp_obj = calculate_locations(plot, params);
		let plot_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
		
		if (plot.plot_type == "scatter") {
			// The usual JSON.parse trick doesn't work on the Float32Array I guess?
			var null_points = new Float32Array(params.data.length);
			for (i = 0; i < params.data.length; i++) {
				null_points[i] = temp_obj.null_points[i];
			}
			
			make_points(plot, params, plot_locations, null_points, append);
		} else if (plot.plot_type == "surface") {
			make_mesh_points(plot, params, temp_obj.plot_locations, temp_obj.null_points);
			
			var hide_loop_offset_i = 0;
			var hide_loop_offset_j = 0;
			
			if (params.append_axis == "-x") { hide_loop_offset_i = append_data.x.length; }
			if (params.append_axis == "-y") { hide_loop_offset_j = append_data.y.length; }
			
			for (i = 0; i < old_nx; i++) {
				for (j = 0; j < old_ny; j++) {
					if (old_hide_points[i][j]) {
						hide_surface_point(plot, i + hide_loop_offset_i, j + hide_loop_offset_j);
					}
					
					if (old_hide_mesh_points[i][j]) {
						hide_mesh_point(plot, i + hide_loop_offset_i, j + hide_loop_offset_j);
					}
				}
			}
		}
		
		update_render(plot);
	} else {
		// Not new dataset.
		
		if (plot.plot_type == "scatter") {
			// Labels will stay the same.
			for (i = 0; i < plot.points.length; i++) {
				if (plot.points[i].have_label) {
					params.data[i].label = plot.points[i].input_data.label;
				}
				
				if (plot.have_groups) {
					if ("group" in params.data[i]) {
						if (plot.groups[params.data[i].group] === undefined) {
							console.warn("Group " + params.data[i].group + " not declared in params.groups");
							plot.points[i].group = "default_group";
						}
					} else {
						params.data[i].group = plot.points[i].group;
					}
				}
			}
			
			prepare_sizes(plot, params);
		}
		
		if (!keep_axes) {
			make_axes(plot, params);
		} else {
			if (plot.plot_type == "scatter") {
				for (i = 0; i < params.data.length; i++) {
					if (plot.size_exponent == 0) {
						params.data[i].scaled_size = 1;
					} else {
						params.data[i].scaled_size = Math.pow(params.data[i].size, 1/plot.size_exponent);
					}
				}
			}
		}
		
		if (plot.plot_type == "scatter") {
			if (plot.geom_type == "point") {
				var positions = plot.points_merged.geometry.attributes.position.array;
				var sizes = plot.points_merged.geometry.attributes.dot_height.array;
				var null_points = plot.points_merged.geometry.attributes.null_point.array;
				var colors = plot.points_merged.geometry.attributes.color.array;
			} else if (plot.geom_type == "quad") {
				var colors, null_points;
				var scale_factor = get_scale_factor(plot);
				
				if (plot.have_groups) {
					for (i = 0; i < plot.points.length; i++) {
						if (params.data[i].group !== undefined) {
							group = params.data[i].group;
							
							if (plot.groups[group] !== undefined) {
								if (group != plot.points[i].input_data.group) {
									plot.points[i].material = plot.groups[group].quad_material;
									plot.points[i].group = params.data[i].group;
								}
							} else {
								console.warn("Group " + group + " was not defined in params.groups when the plot was initialised; ignoring.");
							}
						}
					}
				}
			}

			if (plot.have_segments) {
				var group_lines = {};
				
				for (group in plot.groups) {
					if (group in plot.groups) {
						group_lines[group] = {};
						
						group_lines[group].positions = plot.groups[group].segment_lines.geometry.attributes.position.array;
						group_lines[group].colors = plot.groups[group].segment_lines.geometry.attributes.color.array;
						group_lines[group].hides = plot.groups[group].segment_lines.geometry.attributes.hide_point.array;
						group_lines[group].nulls = plot.groups[group].segment_lines.geometry.attributes.null_point.array;
					}
				}
			}
		} else if (plot.plot_type == "surface") {
			var positions = plot.surface.geometry.attributes.position.array;
			var colors = plot.surface.geometry.attributes.color.array;
			var nulls = plot.surface.geometry.attributes.null_point.array;
			
			var mesh_positions = plot.surface_mesh.geometry.attributes.position.array;
			var mesh_colors = plot.surface_mesh.geometry.attributes.color.array;
			var mesh_nulls = plot.surface_mesh.geometry.attributes.null_point.array;
			
			if (size_checks.colors) {
				plot.have_color_matrix = true;
			}
		}
		
		
		if (animate) {
			plot.transition_t = 0;
			
			if (plot.plot_type == "scatter") {
				if (plot.geom_type == "point") {
					plot.old_positions = new Float32Array(positions);
					plot.old_colors    = new Float32Array(colors);
					plot.old_heights   = new Float32Array(sizes);
				} else {
					// Quad or none.
					plot.old_positions = [];
					plot.old_colors    = [];
					plot.old_heights   = [];
					
					for (i = 0; i < plot.points.length; i++) {
						if (plot.geom_type == "quad") {
							plot.old_positions.push(JSON.parse(JSON.stringify(plot.points[i].position)));
							
							colors = plot.points[i].geometry.attributes.color.array;
							
							plot.old_colors[4*i + 0] = colors[0];
							plot.old_colors[4*i + 1] = colors[1];
							plot.old_colors[4*i + 2] = colors[2];
							plot.old_colors[4*i + 3] = colors[3];
							
							plot.old_heights[i] = plot.points[i].scale.x / (2 * scale_factor);
						} else if (plot.geom_type == "none") {
							group = plot.points[i].group;
							i_group = plot.points[i].i_group;
							
							plot.old_positions[3*i + 0] = group_lines[group].positions[3*i_group + 0];
							plot.old_positions[3*i + 1] = group_lines[group].positions[3*i_group + 1];
							plot.old_positions[3*i + 2] = group_lines[group].positions[3*i_group + 2];
							
							plot.old_colors[4*i + 0] = group_lines[group].colors[4*i_group + 0];
							plot.old_colors[4*i + 1] = group_lines[group].colors[4*i_group + 1];
							plot.old_colors[4*i + 2] = group_lines[group].colors[4*i_group + 2];
							plot.old_colors[4*i + 3] = group_lines[group].colors[4*i_group + 3];
						}
					}
				}
				
				var temp_obj = calculate_locations(plot, params);
				plot.new_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
				plot.new_colors = get_colors(plot, params);
				
				for (i = 0; i < plot.points.length; i++) {
					if (plot.have_segments) {
						group = plot.points[i].group;
						i_group = plot.points[i].i_group;
					}
					
					if (plot.geom_type == "point") {
						null_points[i] = temp_obj.null_points[i];
						
						if (plot.points[i].have_label && null_points[i]) {
							plot.scene.remove(plot.labels[i]);
						}
					} else if (plot.geom_type == "quad") {
						null_points = plot.points[i].geometry.attributes.null_point.array;
						null_points[0] = temp_obj.null_points[i];
						null_points[1] = temp_obj.null_points[i];
						null_points[2] = temp_obj.null_points[i];
						null_points[3] = temp_obj.null_points[i];
						
						plot.points[i].geometry.attributes.null_point.needsUpdate = true;
						
						if (plot.points[i].have_label && null_points[0]) {
							plot.scene.remove(plot.labels[i]);
						}
					}
					
					if (plot.have_segments) {
						group_lines[group].nulls[i_group] = temp_obj.null_points[i];
					}
				}
				
				
				if (plot.geom_type == "point") {
					plot.points_merged.geometry.attributes.null_point.needsUpdate = true;
				}
				
				if (plot.have_segments) {
					for (group in plot.groups) {
						if (plot.groups.hasOwnProperty(group)) {
							plot.groups[group].segment_lines.geometry.attributes.null_point.needsUpdate = true;
							
						}
					}
				}
				
				update_points_input_data(i_plot, params, plot.new_locations);
			} else if (plot.plot_type == "surface") {
				var temp_obj = calculate_locations(plot, params, !change_colors);
				
				var plot_locations = temp_obj.plot_locations;
				var new_null_points = temp_obj.null_points;
				
				var array_obj = make_mesh_arrays(plot, params, plot_locations, new_null_points, false);
				
				plot.old_surface_positions = new Float32Array(positions);
				plot.old_surface_colors = new Float32Array(colors);
				
				plot.old_mesh_positions = new Float32Array(mesh_positions);
				plot.old_mesh_colors = new Float32Array(mesh_colors);
				
				plot.new_surface_positions = new Float32Array(array_obj.surface_positions);
				plot.new_mesh_positions = new Float32Array(array_obj.mesh_positions);
				
				if (change_colors) {
					plot.new_surface_colors = new Float32Array(array_obj.surface_colors);
					plot.new_mesh_colors = new Float32Array(array_obj.mesh_colors);
				} else {
					plot.new_surface_colors = new Float32Array(colors);
					plot.new_mesh_colors = new Float32Array(mesh_colors);
				}
				
				plot.surface_mesh.geometry.attributes.null_point.needsUpdate = true;
				plot.surface.geometry.attributes.null_point.needsUpdate = true;
				
				for (i = 0; i < nulls.length; i++) {
					if (nulls[i] && !array_obj.surface_nulls[i]) {
						// If the point was previously null, have it
						// immediately appear at its new location.
						plot.old_surface_positions[3*i + 0] = plot.new_surface_positions[3*i + 0];
						plot.old_surface_positions[3*i + 1] = plot.new_surface_positions[3*i + 1];
						plot.old_surface_positions[3*i + 2] = plot.new_surface_positions[3*i + 2];
						
						if (change_colors) {
							plot.old_surface_colors[4*i + 0] = plot.new_surface_colors[4*i + 0];
							plot.old_surface_colors[4*i + 1] = plot.new_surface_colors[4*i + 1];
							plot.old_surface_colors[4*i + 2] = plot.new_surface_colors[4*i + 2];
							plot.old_surface_colors[4*i + 3] = plot.new_surface_colors[4*i + 3];
						}
					}
					
					nulls[i] = array_obj.surface_nulls[i];
				}
				
				for (i = 0; i < mesh_nulls.length; i++) {
					if (mesh_nulls[i] && !array_obj.surface_nulls[i]) {
						plot.old_mesh_positions[3*i + 0] = plot.new_mesh_positions[3*i + 0];
						plot.old_mesh_positions[3*i + 1] = plot.new_mesh_positions[3*i + 1];
						plot.old_mesh_positions[3*i + 2] = plot.new_mesh_positions[3*i + 2];
						
						if (change_colors) {
							plot.old_mesh_colors[4*i + 0] = plot.new_mesh_colors[4*i + 0];
							plot.old_mesh_colors[4*i + 1] = plot.new_mesh_colors[4*i + 1];
							plot.old_mesh_colors[4*i + 2] = plot.new_mesh_colors[4*i + 2];
							plot.old_mesh_colors[4*i + 3] = plot.new_mesh_colors[4*i + 3];
						}
					}
					
					mesh_nulls[i] = array_obj.mesh_nulls[i];
				}
				
				update_surface_input_data(i_plot, params, 0, 0, change_colors);
			}
			
			animate_transition(i_plot);
		} else {
			// Not animated -- immediate update.
			var temp_obj = calculate_locations(plot, params, !change_colors);
			
			var plot_locations = temp_obj.plot_locations;
			var new_null_points = temp_obj.null_points;
			
			if (plot.plot_type == "scatter") {
				var new_colors = get_colors(plot, params);
				var color_obj;
				
				for (i = 0; i < plot.points.length; i++) {
					set_point_color(plot, i, params.data[i].color, true);
					set_point_size(plot, i, plot_locations[i][3], 2*scale_factor);
					
					if (plot.geom_type == "point") {
						positions[3*i + 0] = plot_locations[i][0];
						positions[3*i + 1] = plot_locations[i][1];
						positions[3*i + 2] = plot_locations[i][2];
						
						null_points[i] = new_null_points[i];
					} else if (plot.geom_type == "quad") {
						plot.points[i].position.x = plot_locations[i][0];
						plot.points[i].position.y = plot_locations[i][1];
						plot.points[i].position.z = plot_locations[i][2];
						
						null_points = plot.points[i].geometry.attributes.null_point.array;
						null_points[0] = new_null_points[i];
						null_points[1] = new_null_points[i];
						null_points[2] = new_null_points[i];
						null_points[3] = new_null_points[i];
						
						plot.points[i].geometry.attributes.null_point.needsUpdate = true;
						plot.points[i].geometry.attributes.color.needsUpdate = true;
					}
					
					
					if (plot.points[i].have_label) {
						set_label_color(plot, i, params.data[i].color);
						
						if (null_points[i]) {
							plot.scene.remove(plot.labels[i]);
						}
					}
					
					
					if (plot.have_segments) {
						// If points are connected, then the groups shouldn't
						// change; irregular behaviour will results if groups
						// _do_ change.
						group = plot.points[i].group;
						i_group = plot.points[i].i_group;
						
						group_lines[group].positions[3*i_group + 0] = plot_locations[i][0];
						group_lines[group].positions[3*i_group + 1] = plot_locations[i][1];
						group_lines[group].positions[3*i_group + 2] = plot_locations[i][2];
						
						group_lines[group].nulls[i_group] = new_null_points[i];
					}
				}
				
				if (plot.geom_type == "point") {
					plot.points_merged.geometry.attributes.position.needsUpdate = true;
					plot.points_merged.geometry.attributes.null_point.needsUpdate = true;
				}
				
				if (plot.have_segments) {
					for (group in plot.groups) {
						if (group in plot.groups) {
							plot.groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
							plot.groups[group].segment_lines.geometry.attributes.null_point.needsUpdate = true;
						}
					}
				}
				
				update_points_input_data(i_plot, params, plot_locations);
				
				if (plot.have_any_labels) {
					update_labels(plot);
				}
			} else if (plot.plot_type == "surface") {
				var array_obj = make_mesh_arrays(plot, params, plot_locations, new_null_points, false);
				
				plot.surface.geometry.attributes.position.needsUpdate = true;
				plot.surface.geometry.attributes.color.needsUpdate = true;
				plot.surface.geometry.attributes.null_point.needsUpdate = true;
				
				plot.surface_mesh.geometry.attributes.position.needsUpdate = true;
				plot.surface_mesh.geometry.attributes.color.needsUpdate = true;
				plot.surface_mesh.geometry.attributes.null_point.needsUpdate = true;
				
				for (i = 0; i < nulls.length; i++) {
					positions[3*i + 0] = array_obj.surface_positions[3*i + 0];
					positions[3*i + 1] = array_obj.surface_positions[3*i + 1];
					positions[3*i + 2] = array_obj.surface_positions[3*i + 2];
					
					if (change_colors) {
						colors[4*i + 0] = array_obj.surface_colors[4*i + 0];
						colors[4*i + 1] = array_obj.surface_colors[4*i + 1];
						colors[4*i + 2] = array_obj.surface_colors[4*i + 2];
						colors[4*i + 3] = array_obj.surface_colors[4*i + 3];
					}
					
					nulls[i] = array_obj.surface_nulls[i];
				}
				
				for (i = 0; i < mesh_nulls.length; i++) {
					mesh_positions[3*i + 0] = array_obj.mesh_positions[3*i + 0];
					mesh_positions[3*i + 1] = array_obj.mesh_positions[3*i + 1];
					mesh_positions[3*i + 2] = array_obj.mesh_positions[3*i + 2];
					
					if (change_colors) {
						mesh_colors[4*i + 0] = array_obj.mesh_colors[4*i + 0];
						mesh_colors[4*i + 1] = array_obj.mesh_colors[4*i + 1];
						mesh_colors[4*i + 2] = array_obj.mesh_colors[4*i + 2];
						mesh_colors[4*i + 3] = array_obj.mesh_colors[4*i + 3];
					}
					
					mesh_nulls[i] = array_obj.mesh_nulls[i];
				}
				
				update_surface_input_data(i_plot, params, 0, 0, change_colors);
			}
			
			update_render(plot);
		}
	}
}



function check_webgl_fallback(params) {
	// https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
	let canvas = document.createElement("canvas");
	let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (!(gl && gl instanceof WebGLRenderingContext)) {
		let div_html = "";
		if (params.hasOwnProperty("fallback_image")) {
			div_html = "<img src=\"" + params.fallback_image + "\">";
		} else {
			div_html = "Sorry, you do not have WebGL enabled.";
		}
		
		let div = document.getElementById(params.div_id);
		div.innerHTML = div_html;
		
		return false;
	} else {
		return true;
	}
}

function basic_plot_setup(plot,i_plot, params) {
	// A variable for possible use in the touch controls.
	plot.old_t = Date.now();
	
	// Following is used to see if we should render once a photosphere
	// texture is loaded:
	plot.tried_initial_render = false;
	
	// First up, preparing the area.
	
	//plot.container_height = plot.parent_div.offsetHeight;
	plot.scene = new THREE.Scene();
	
	plot.container_width = plot.parent_div.offsetWidth;
	plot.renderer = new THREE.WebGLRenderer({"antialias": true});

	plot.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	
	plot.make_toggles = ("show_toggles"in params) ? params.show_toggles : true;
	plot.make_snaps = ("show_snaps" in params) ? params.show_snaps : true;
	
	let toggle_div = document.createElement("div");
	toggle_div.id = "div_toggle_scatter_" + i_plot;
	let div_html = "";
	
	if (plot.make_toggles) {
		let camera_img = "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";
		let grid_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAFlJREFUSInt17EKgDAMRdFc8f9/+TkJHQQ7xATiu1vJcIY2Q5GkaOjoQLdgIH22BX+V4fkw9x6/vcLMJMW5Hp4C0mcRf7xjw2V5ncoyPB/2OpVleD5M16ftAqB5QSpf4rrTAAAAAElFTkSuQmCC";
		let ticks_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAEVJREFUSInt1iEOACAMQ9GWcP8rF4XDkkH2J2eeaLLOSaKCGRUoMDAw8J+wJZXc6rk7wrZOfXFr3y/jfrD5QICBgYGfhxcjRRswVeMTTgAAAABJRU5ErkJggg==";
		let axis_title_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAylJREFUSIntl1lIVGEUx8+dscywlVa1IgtboE1L2mibssKQ1okgiDasB5MKw6BArLCCgihaqV4iWqCHNlqwoGyhqDAL2yyCFCptuNmMTc69vx5G8nN0rncs6qUPzsvl3P9vzv+c+b7vagDyD5bjX0D/g0VEpOZBlsRpmmgW0XdjsXxXX6ouFHe7cPkOcZ3XG4GdeXl5eeoDTQzxebxiBHQp//RN1MnrkJIhC2alS0bGdBmXGFv/qzVNzNoaiYrV5NPrCvHW1ZSQ4hJX2lyZPztNRnSJakgm3DK/cnd9IiLyK4bvKOV72BfA1IvI7hXMjVtxhUojfG54MGDqt8jqXQ8W52h2v/Q3nWxUcmVlfDAvKYe7umklbQ0GE09hJnFK1VFj9/CqETtA+al5dBRBHCkUPPVZyzYPBowqri7rrljeivF7X6Oy/W8OMKWNIBKD62AZP5oVtQMGjM8XWdxFsbz1BPaX1cn7itma7EBE6DTvNOUBO4o2wWDw8ZybTorl0ZMO8tavU7Suf/BZ/EquWk1Ty8BAoILTs9srlkczcvEMuoogMoAN975iPU4tBQOBDydIj5UGfzERJ6O2l1ATiVCkYKjl/bE0YlRw31yeREqNHAz4S9k2SK24G0suV2K/uy0CG1RdzyRBQuzusZxrXyJDR9bjijMs6ByEdR+W0ACesPomngimyz74RxmHpsYgIjhTd1Diec72ZE2B92HNbd32ZNsE+3hakIJDBGk7jcNvg5uHrzifIarlieu5V20PbQNsot/JIUkEkc64z1ZQvzl5ebRpYAPLk3If8u1PgI3Pl1nWs66PmdeoCpkhs/o+Of3UYRvM5sfe3wTXfuDknA5BwYG53G/SRhO9KJs+quVDt1DczAFlAfbzat9EokUQZyo7n1nsEqaHG6vilao1RhQ8t7w0hAV7n+QzXBNE2jDZxlFnVF5gYUelakcqu16EuTQ0BS49ksX8yUPp4awX6TXJzdJV2Ww6WkJo9/zvzpKftZxF6cnBi4AaMb1Jnupm7fGXjapvBD7vcoQcAkqMOcHHkDZXFy6kXbj8umg18xJ6CEeD/58wf2f9BL0fPYwPEcFvAAAAAElFTkSuQmCC";
		let box_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAE9JREFUSInt1zEOACAIQ9FiuP+VcSKRxFFh+Z0Iy4ud0CIiNJA1gUqS52BmLWAW7Lflr5yPG6saGBgYGBgYGBgY+H3KXd111Be4+ws1VvUGpBoNQFww7NMAAAAASUVORK5CYII=";
		
		div_html += "<table style=\"margin-left:auto;margin-right:auto;border-spacing:0px;\">";
		div_html += "<tr>";
		div_html += "<td id=\"icon_three_d_scatter_camera_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + camera_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_grid_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + grid_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_ticks_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + ticks_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_axis_title_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + axis_title_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_box_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + box_img + "\"></td>";
		div_html += "</tr>";
		div_html += "</table>";
	}
	
	if (plot.make_snaps) {
		let cube_back_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA4BJREFUSIntl0FoWnccxz+xSY0aGuOrJE43kxQZdEtKd5ARhjAC0qx4KDwvenQghJGMHcty6CE59TBCGHgwh0A8VE8RlpFTCb3MHUqX2zw0TXza2DxNYXvRWPjvoCYmamJXb9sXHjz+/N7383/v9/s+3usRQgg6ksr2tkIs9oqtLQVFOaBSeYsQFcAIaJjNb0ilfsDlcrd06L24oGkqz54pPHnyiqdPFRSlQLmsNZgOAR8BtwEbYK+tpzGZXrC5uUkuV8Lj8TTDfL5Vnj8/IZ8v8O6dRvU++4Bh4CbwRc3cUjNtr+vXP2Fu7ksePYpSKpXwer0XSyYFRAW8EHAo4G8B4l8cf4qxsd+EEELs7++LxcVFsbGxIRqlAx/wGjAA0pW770QOh4NwOMzOzg6JROJ0XQcOwA/EgNQHg+qSJIlwOMzu7i7r6+t1GIALCACbwHZXgbOzs6iqyvLycuM0uoAQEAVKQFNzO5RGJlMgm82yt7fH4eEhxWKRra2ti6PvAL4DIkCZaj/bm4IC5IA88DtHRypLSyNoGpjNZiwWC+Pj40xPT2MymZpzVh2ScAPwa6AAvAQytfOjhnoz1bx9ysDADR4+/IZWQzYwMNAKVgd+D/wI/Ap8DJhqpm7Oh7muNL29xZagutrAqF30OXADkNuXvYd0V5fouwLqENY9/Q/7T8OOr6y4JGeXSa2Z198mJSCDzfaaajZbB/sK2F/ACfBHzfQtADodGAx6bt0yc++ejWDQwuTkVyQSv7C09BPhcBhJklrBTjh7qRZrpmUAenp2MRpvcucO3L9vw+//DJfL0HbnsiyTTCaJRCItgb2wzbVrY1gsg9y9a+bBg9v4/QYkSWJ19Q1WqxWfb/LyB9Agn8+HXq9nZWWFUCiEw+E4g8XjHuAlsvxt2x2/r7xeL/39/USjUQKBAC6XCwCdLM9RLks8fvwzqqp2BQbg8XiYmZkhFouRTqerMIBgMMjo6CiRSKSrQLfbTSAQIB6Pk8lkznImyzITExNEIhEymcwHgzRNQ1VVjo+PGRkZIZlMnh/9enOj0SihUKhj00Lh/DfHwcEBlUoFAKPRiMViYX5+vjln9eaura0BYLVaT00VRSGXy5HP58lmsxSLRTRNo6+v79TUbrczNTWF3W5vGv2edj8WqVSKhYUFhoaGcDqdp6aDg4MMDw9jt9txOp0tTdvpH1kNa5nouZWwAAAAAElFTkSuQmCC";
		let cube_bottom_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA8JJREFUSIntlk1IG2kYx39KYpqJHzHxa5ykLYHAIkG6LuQgwSpCTqaXainuMYcUkdVLby60yN560cPSHPQgKIX1ZKAGLwURFzzVTRe2sKjRRKNmJlp2s0lsnT2YxI+YqNTb7h9eGOZ55v97P55neMtUVVW5hmRZJhqNEg6HiUaj7O7ucnh4yNHREYIgEA6HSSQSjI6O4nQ6L/Uouwi7aKooCslkMm9aW1tLc3MzDQ0NiKKIJEkIgkAgECAUCgHgcrno6OgogGkmJyfJZDJ5UwCtVktjYyN1dXW0tbXR3NyMyWRCEISSq29qasLtdjMxMUEqlcLtdp+HjY2NMTQ0RE9PD5IkodfrrzQtJYvFgtfrZWpqinQ6jcfjycfKPR4PsVgMvV6P2Wz+KtBZoM/nIxQKMTs7ewqzWCz09fUxMzPDysrKV4NyMpvN+Hw+NjY2mJ6ePoEB2O12+vv7mZ+fZ3Fx8VaBAwMDyLLM+Pg4mlzAbrfj9XqLHu5NFIlE2N7eZnNzk3g8TiKRYGFh4RQGJ3s9ODiI3+8vONyLSiaTRKNRdnZ22NvbIxgMIssya2trABiNRkwmEzabje7ubgwGw3lYbuk+ny8P7OrqQlEU1tfXiUQiKIrCwcFBPt9oNCKKIlarFZvNxvDw8KVFVllZWQjLAYeHhxkZGSEYDGK1WjEYDIiiiNPpPNfMOQUCAfb390tW86UwAEEQcDgcVFdX09vbW9TgJiq/KkGn090K6Fqw29T/sP80LH1lRtE+K64kkcg/vHmjMDeX4MOHFJ8+pfjyJY5OV8HTp8mijV0SFov9xdu3GV6+/I2PH2Mkk2mOj3PRGuAOIAImwEU6/Sc1NUscHrouBWoymQwrKzKTkwrv3iXY2joglUqjqjpgA6jLprYA+uwo9ktq5fNnPVVVS4TDLiyW83maoaFl4BvAmJ1pS3amAhAB6oHWUhtwQXaOj+Hu3SXev/+O1lZzPlJuNrcDfwCOrKmlxMyvD1TVFh48WGZxUT6FxeM/ZOk/A3LRz28uC6r6LQ8fLhMIyFRUZEt/dfV7OjvvA/5bB0I7jx79TiCggHpGjx/PqfCTClsqqCpMqDCXfb7p+FuFuAqrKvyiglstuBE/e7aA3/8r4AUWOCmQ4tcDSAIKsA1sAnFgFziirAw0GoH6ehMOR1Vhn71+7UYU7/DixVT2Tf0Z0yiwA+xlzRNAkrIyLTqdgCSZ6OyUePKkHZdLQhDM57wLVpbTq1crPH/+I1AL3MubarU1SFIjbrdEf/89OjokwHyZRYH+BaX9mrpbeeodAAAAAElFTkSuQmCC";
		let cube_front_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAAwNJREFUSIntlsFLG1kcxz+RhDFT2GrGRp2ZBXchl0UP9ZBSGkLLwpycW1Ihgpc5DCyie+ipFFrwL9CDMNB4EOLFQA5S9Fp781LaHLNdze5k1WVnEpcYY2xrDyZRG2uVpodCv/CYw+/x+cyb95j38xwdHR1xiTiOQ6FQIJ/PUygU2NnZYXd3l8PDQ0RRJJ/PUywWmZ6eJhwOn8vwfCz7GOq6LpVKpQnt7u5GlmWCwSD9/f0oioIoiiwvL5PNZgGIRCJEo9EWmXd+fp5ardaEAvh8Pnp7e+np6WF4eBhZlgkEAoiieOHq+/r60DSNZDJJtVpF07SzspmZGaamphgZGUFRFPx+/2ehF0VVVQzDYGFhgYODA3Rdb9Y6dF1ne3sbv9+PJElfJDotNE2TbDZLOp0+kamqSjweZ3FxkfX19S8WNSJJEqZpsrm5SSqVOpYBhEIhEokEKysrrK2ttVX44MFvCIJDOj2Lt1EIhUIYhvHJzb1KHMdmaekfMpm/ePnyP1y3yLt3L05kcPytJyYmsCyrZXNbUyGXK7C0tMWzZ//y6tVzKpUihvFnvd4FBICfgV+B22dljaWbptkUxmL3eP3aJZXaYHXV5s0bl/39Eu/fcwraD+jAT3WBdM7LFVtlDeHDh79z584j4vFV4EfgWh0arj8V4Gon91zZcUS2tgaBH4DYlaCfSsfnpwhtEV1S1r58l32XfROyCm/fum2VecvlMrlcjo2NDWzbxnVdSqUSogjl8h/AQPtkmUyGvb29Zs8xODiILMuoqsrTp/MUi+37g3hHR0cBGB8fb0tLcFE6JicnkSSJubk5HMf5ujKAsbExBgYGsCzrKwqrJ6cxFosxNDSEZVnYtt0mQQWwgRzw99n7TNd1BEEgmUzy+LFxRahbH1WgBBzg8YDXC8HgdW7eHGq9PDVNo7Ozk9nZBWo1gBunqg6wX4eW6uBjqCAIKEond+92cf/+L0QirR10S6/fSC63Tjj8hFJpGLgF/I/HI+DzCSjKdTSti0QiQDQa4LLtwQcpnyeKkn0kgAAAAABJRU5ErkJggg==";
		let cube_right_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA8ZJREFUSIntl81LI3cYxz+rhuhYjMkoMW+NWwgFXyLNQYpbCqGQQyGgGHFR8JKDUCR4XhRzWP+A7UE2sPEgVBbssksvypbCIrtCs4VFix7qwWpeJrHJaMQM0bCdHtxkN5iobXNrv8fhy/cz8+N5nt8zt1RVVbmBMpkM8Xic/f194vE4qVSKbDZLoVBApxN4+jTLzs4pwWCAubn+ihkN14XKsoyiKBQKBQRBQK/XYzab6erqwmQyYbFYEASB7e0tdnZ+IxhcBfLMzX15Gba4uMj5+XkpFECj0WA0Gmlra8PlcmE2mzEYDAiCUPXL6+sBPgY+JxgMI0l5Hj70lJucTqcaDofVzc1NNZ1Oq7lcTv0nGh7eVOFnFVQVoirMq8PDP5R56rxeL8lkkqamJkRRvPLtby4rMMmTJ7/idn9felpntVoZGRlheXmZSCRSA1BRIjDJixe/09f33QUMwOFwMDY2xurqKuvr6zUGfsPWVgaz+dv31ehwOPD7/YTDYfL5PB6P54qQq6QAMpAADoA0cIQkPS8vfavVytTUFKFQiLOzM7xeb/VIRSEejyNJEtnsIbu7r4EM0PHO0QoYgE+Ar4Dmy30miiKTk5MloNvtRpZl9vb2iMViyLLM8fFxyd/a2kpnpwmd7lOgBfgaqFRkH12GFYHT09PMzMywtraGzWajubkZk8lEf39/WTMX9fjxFpCvArpQRRiAIAj09PTQ0tKCz+erGvB3VHedQavV1gR0I1gt9T/sPwx7+/Z6T9U+q6YPx1Q0GkWSJM7PcyhKFugBKq8EV8IURSGZTBKNRjk5OUGSpEtjymAw4HQ6uX37NvfuGbhzJ87GxnPgCypNkobT01N2d3crzr7t7W1EUaS7u7vqmPpQr16JDA018ezZy4rA+lwuFywuNHq9HqfTidvtZnBwEEVRcLlcDA0NYbfbEUURjUZT9ZgA7t4VicX+5M2b14ANKPp/oWF0dBSAiYmJGq0E8OiRg46OJubnfwIGuLhEoS4QCCCKIgsLC2QymZrAAO7ft/LgwWfABhcX6rvSHx8fp7Ozk1AoVFNgIGBlZWUAeAmcvu8zn89Hb28voVCIWCz2r0GKopDJZOjrixMM/gH8WF76Xq8XrVZLOBzG7/ffOFSWZRKJBAcHB6TTaVKpFIVCAbi4F202AysrE5f7zOPx0NjYyNLSEgDt7e2l0GIzHx4ekkgkODo6QlEUNBoNgiBgMBiwWCwMDAxgsVgQRbEs+1a1H4tIJMLs7Cx6vR673V4K1el0GI1GLBYLdru9Ymg1/QW4hNSnAVbhAgAAAABJRU5ErkJggg==";
		let cube_left_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA5JJREFUSIntlk9IW1kUh7+2xoxP0eTFmry8iBhwFqVk4SILKylBSJGZLIq6EWaVRYoM1HVxkSLdi8jQQLMRlAEDLbzFiBvLYLuYnZNlQI35Z9SXGGd8JhOKs3CM0fzrYHYz3/Zefh8H7jn33Lu4uLjgK1BVlWQySSwWI5lMkslkyOfzlEolBEEgFouRy+WYn5/H6XTWzLh3W3Y7NJvNomlaOdRoNGK1Wunr60OSJGRZRhAEFEUhEokAMDo6isvlqpK1hcMrnJ7+wcHBZSiATqfDbDbT29vL8PAwVqsVURQRBKFh9RaLBY/HQygUolAo4PF4bsqmpn4iEPiB6envEUWZjo6OpqGNsNls+Hw+lpeXKRaLeL3e8tl98BEIZNne7sBkMt1JVCn0+/1EIhHC4XCl7DEwxdTUKouLv91ZdIXJZMLv97O3t8fKysqVDGAImObly1+Ym/u1pcKZmRlUVWVxcZG266MhwMebNyEODgq8e+epG9KMRCJBKpVif3+f4+NjcrkcGxsblTIAG/AjoVAQVS3y/r23ZhiApmkkk0nS6TSHh4esr6+jqio7OzsAGAwGRFHEbrczNjZGZ2fnbRmACfDz4UOQJ0+KfPrkJhrNsru7SyKRIJvNcnJyUr5tMBiQJIn+/n7sdjuzs7M1H1lXV1ct2ZVwls+f53j2bJ2nT/tpb+9EkiScTueNZr5CURSOjo4avuY6MgABeIwgdPPq1WT9a/+C+80uPHigb4noq2St5H/Zf1hWLBab3mnQZ7WpHFPxeJx0Os3Z2RnxeJzu7m40Tavb2E1kf3F4GCEcPmVvL101pkRRxOFwMDg4iCiKbG5usrCwgN/vx2Qy1ZIVGsry+X30+m/rjqlKJicnURSFYDBYU9gGhw1kXQwNfXfja2+G1+tFr9eztLSEz+fDZrOVz+5LUh/Qug8TwOPx4Ha7CYVCRKPRa1kq5cLh+OYfodYyocvlYnx8nNXV1bKwDWB724nb/TsfP24Bo1xO/LvjdDoxGo2sra2hadp1n21uOpiYsABbtKJCTdNQVZXz83MsFguKolRvxC9eRAkGd7ms8GcmJh4SDjdeD7LZ7I2dI5PJUCqVABAEAVEUaW9vr+6zt2+HkKQOAoEt4E++fHlYDq3cOVKpFLlcDk3T0Ol05VBZlhkZGUGW5aqnX1XZFa9fJwgEAjx6VOD5c5l8/jK0p6cHs9mMLMsMDAzUDK3H3x0DgYWMs5l/AAAAAElFTkSuQmCC";
		let cube_top_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA71JREFUSIntl01Im3ccxz+JZsmyEZPnUTQ8kehQHKhp8RCYbBm5CB5SlGZYUvBQD7kM7aG9lEl378WTNIdcPHio1EFz2NqLL8goIqWTespAyKtvidGaf0wjfXZIfFuSqau37Qt/Ep6Xz+fHP78fzxONqqoql4pgcTHN9HSaV68yxON7FAp5VDUP6EtrnydPvufBA1tFQm0ZUgiWltI8e5Zmfj5DPH5IPp+nWJIeMABm4Cvgc0A+c3eKhw9/J5uFx4/LhZq+vgX13TvY3t7j6IgzUHMJLJWW8XIbgACW8Ptbefq0/e8nv1PhpQo7KmTVou5TV1aFl+rt23+oZ6MdGPgGWAHiV6j+ohiBb3n+fAO3e/XkqNbjaeXFix+AX4Dla5KdCufnM9y4UeRqP3wAj6edhQUfGs2vwOI1C12srh5SX7942o0uVztv345w82YQVT0E+v6lQABpIAFESp8HpFIL51vf4bARifyI3R7g48c84LkAGgeSQBT4E9gDjGg0YDCYaW6WcLu/5t69Vl6//qx8zmw2mffv/dTVBTg6ygPuUqXrQKz0PQOAVgtGo5mODistLTp6eup59Og+lRrtzZsvy2UARqPM3t59JOkn8vnfqKlpxmT6gq4uK7duOblzx4rNppyDhkIhtre3K4qOU1FWFBqZnOyiocGEx+OtCrhKtBdfor8W0SVl15f/Zf9hWT6fv/CaqnNWLUII4vE4yWSSaDRKMpkkm80SjUYxmUwIITAaKw92VZkQgo2NDaLRKPv7+ySTSTKZzMl5s9mMJEk4HA5aW1uRJIm5uTkmJibw+/3IslzGrD04OCAcDrO+vk4sFiOdTp9A19bWkGWZzs5OnE4nVqsVRVGqVu71egmFQgQCgYrCmmw2+7MQgkKhgMViweFw4Ha7GRgYQAhBT08Pg4OD2O12ZFlGp9P94zZ3dHSQy+WYnZ2lra0Nk8kEwMrKCrVDQ0MADA8PV634qunr68NgMBAMBvH5fLS3F198tKOjo8iyzOTkJKlU6lpkAC6Xi/7+fqanpwmHw0UZwN27d2lpaSEQCFyr0Ol04vP5mJmZIRaLnc6Z1+ulu7ubQCBALBb7ZJEQglQqRS6Xo6mpiVAodL71PR4Per2eYDDIyMjIpaHpdJpEIkEkEmFnZ4fNzU0KhQJQfC5KksTY2Fj5nB3/uFNTUwA0NDScQI+HeWtri0Qiwe7uLkIIdDrdCVRRFHp7e1EUpaz1NdX+WCwvLzM+Po7FYsFut59A6+rqaGxsRFEU7HZ7RWi1/AW9hKN9Ep/IIwAAAABJRU5ErkJggg==";
		
		div_html += "<table style=\"margin-left:auto;margin-right:auto;border-spacing:0px;\">";
		div_html += "<tr>";
		div_html += "<td id=\"icon_three_d_scatter_snap_home_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\">Reset</td>";
		div_html += "<td id=\"icon_three_d_scatter_snap_top_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + cube_top_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_snap_bottom_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + cube_bottom_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_snap_left_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + cube_left_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_snap_right_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + cube_right_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_snap_front_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + cube_front_img + "\"></td>";
		div_html += "<td id=\"icon_three_d_scatter_snap_back_" + i_plot + "\" style=\"cursor:pointer;padding-left:5px;;padding-right:5px;\"><img src=\"data:image/png;base64, " + cube_back_img + "\"></td>";
		div_html += "</tr>";
		div_html += "</table>";
	}
	
	if (plot.make_toggles || plot.make_snaps) {
		toggle_div.innerHTML = div_html;
		plot.parent_div.appendChild(toggle_div);
	}
	
	let width, height;
	let margin_left = parseInt(plot.parent_div.style.paddingLeft);
	let border_left = parseInt(plot.parent_div.style.borderLeft);
	let margin_right = parseInt(plot.parent_div.style.paddingRight);
	let border_right = parseInt(plot.parent_div.style.borderRight);
	
	margin_left = isNaN(margin_left) ? 0 : margin_left;
	margin_right = isNaN(margin_right) ? 0 : margin_right;
	border_left = isNaN(border_left) ? 0 : border_left;
	border_right = isNaN(border_right) ? 0 : border_right;
	
	let margins = margin_left + margin_right + border_left + border_right;
	
	if (!("width" in params) && !("height" in params)) {
		width = Math.min(plot.parent_div.offsetWidth - margins, window.innerHeight);
		height = width;
	} else {
		if (("width" in params) && ("height" in params)) {
			width = params.width;
			height = params.height;
		} else {
			if ("width" in params) {
				width = params.width;
				height = Math.min(width, window.innerHeight);
			} else {
				height = params.height;
				width = Math.min(plot.parent_div.offsetWidth - margins, window.innerHeight);
			}
		}
	}
	
	let temp_width = width + margins;
	
	// Make the scene a little bit larger (but hidden) so that points
	// don't suddenly disappear from the screen when their centroid
	// leaves the visible area.
	plot.max_point_height = ("max_point_height" in params) ? params.max_point_height : 25;
	
	let hidden_margin = 0;
	if (plot.geom_type == "point") {
		if ("hidden_margins" in params) {
			hidden_margin = params.hidden_margins ? Math.ceil(plot.max_point_height / 2) : 0;
		}
	}
	
	plot.renderer.setSize(width + 2*hidden_margin, height + 2*hidden_margin);
	plot.parent_div.style.width = width + "px";
	
	let wrapper_div = document.createElement("div");
	wrapper_div.id= "main_plot"
	wrapper_div.style.width = width + "px";
	wrapper_div.style.height = height + "px";
	wrapper_div.style.overflow = "hidden";
	plot.parent_div.appendChild(wrapper_div);
	
	plot.renderer.domElement.style.position = "relative";
	plot.renderer.domElement.style.marginTop = -hidden_margin + "px";
	plot.renderer.domElement.style.marginLeft = -hidden_margin + "px";
	
	wrapper_div.appendChild(plot.renderer.domElement);
	
	plot.width = width + 2*hidden_margin;
	plot.height = height + 2*hidden_margin;
	
	plot.mid_x = plot.width / 2;
	plot.mid_y = plot.height / 2;
	
	let bg_color = ("background_color" in params) ? params.background_color : "#FFFFFF";
	let bg_color_hex;
	
	//let tiny_div = document.createElement("div");
	//tiny_div.id= 'tiny_div';
	// tiny_div.style.width = "1px";
	// tiny_div.style.height = "1px";
	//plot.parent_div.appendChild(tiny_div);
	// if (typeof(bg_color) == "string") {
	// 	bg_color_hex = css_color_to_hex(bg_color, tiny_div);
	// } else {
	// 	bg_color_hex = bg_color;
	// 	bg_color = hex_to_css_color(bg_color);
	// }
	
	plot.bg_color = bg_color;
	plot.bg_color_hex = bg_color_hex;
	plot.scene.background = new THREE.Color(plot.bg_color);
	
	let aspect = plot.width / plot.height;
	
	plot.null_width = ("null_width" in params) ? params.null_width/2 : 0.5;
	plot.null_width_time = ("null_width_time" in params) ? params.null_width_time/2 : 30000;
	
	// Set up the camera(s).
	
	plot.init_lonlat = [-3*tau/8, tau/8];
	if ("init_lonlat" in params) {
		plot.init_lonlat = JSON.parse(JSON.stringify(params.init_lonlat));
	}
	
	plot.init_rot = ("init_camera_rot" in params) ? params.init_camera_rot : 0;
	plot.camera_r = ("camera_r" in params) ? params.camera_r : 5;
	
	if ("camera_distance_scale" in params) {
		plot.camera_distance_scale = params.camera_distance_scale;
	} else {
		plot.camera_distance_scale = Math.max(plot.camera_r, 1);
	}
	
	plot.camera_origin = new THREE.Vector3(0, 0, 0);
	plot.init_origin = [0, 0, 0];
	if ("init_camera_origin" in params) {
		plot.init_origin = JSON.parse(JSON.stringify(params.init_camera_origin));
		plot.camera_origin.x = params.init_camera_origin[0];
		plot.camera_origin.y = params.init_camera_origin[1];
		plot.camera_origin.z = params.init_camera_origin[2];
		
		//plot.init_origin = JSON.parse(JSON.stringify(params.init_camera_origin));
	}
	
	plot.view_type = ("view_type" in params) ? params.view_type : "perspective";
	
	plot.max_fov = ("max_fov" in params) ? params.max_fov : 90;
	plot.min_fov = ("min_fov" in params) ? params.min_fov : 1;
	plot.max_pan_dist_sq = ("max_pan_distance" in params) ? params.max_pan_distance : 0.5*plot.camera_r;
	
	plot.max_pan_dist_sq = plot.max_pan_dist_sq * plot.max_pan_dist_sq;
	
	let theta, ortho_top, ortho_right;
	if (plot.view_type == "perspective") {
		plot.init_fov = ("fov" in params) ? params.fov : 47.25;
		
		theta = plot.init_fov / 2;
		ortho_top = plot.camera_distance_scale * Math.tan(theta / rad2deg);
		ortho_right = ortho_top * aspect;
	} else {
		// Orthographic.
		if ("ortho_right" in params) {
			ortho_right = params.ortho_right;
			ortho_top = ortho_right / aspect;
		} else if ("ortho_top" in params) {
			ortho_top = params.ortho_top;
			ortho_right = ortho_top * aspect;
		} else {
			plot.init_fov = ("fov" in params) ? params.fov : 47.25;
			
			ortho_top = plot.camera_distance_scale * Math.tan(0.5 * plot.init_fov / rad2deg);
			ortho_right = ortho_top * aspect;
		}
		
		theta = Math.atan2(ortho_top, plot.camera_distance_scale) * rad2deg * 2;
		if (theta > 90) { theta = 90; }
		
		plot.init_fov = theta;
	}
	
	let frustum_far = (plot.camera_distance_scale < 5) ? 50 : 10 * plot.camera_distance_scale;
	
	plot.persp_camera = new THREE.PerspectiveCamera(
		plot.init_fov,
		aspect,
		0.01,
		frustum_far);
	
	
	plot.init_ortho_top = ortho_top;
	plot.init_ortho_right = ortho_right;
	
	plot.ortho_camera = new THREE.OrthographicCamera(
		-ortho_right, ortho_right, ortho_top, -ortho_top, 0.01, frustum_far);
	
	plot.persp_camera.rotation.order = "ZYX";
	plot.ortho_camera.rotation.order = "ZYX";
	
	plot.aux_camera_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(tau/4, 0, tau/4, "ZYX"));
	
	reset_camera(
		plot,
		true,
		[plot.init_lonlat[0], plot.init_lonlat[1], plot.init_rot],
		plot.init_origin);
	
	plot.rotation_dir = 1;
	if ("reverse_rotation" in params) {
		plot.rotation_dir = params.reverse_rotation ? -1 : 1;
	}
	
	plot.rotate_less_with_zoom = ("rotate_less_with_zoom" in params) ? params.rotate_less_with_zoom : false;
	
	
	// Preparing the font for labels etc.
	
	let font = ("font" in params) ? params.font : "Arial, sans-serif";
	plot.font = font;
	
	let test_font_size = 96;
	// The 1.08 is a fudge factor; the get_font_height() function doesn't really work.
	plot.font_ratio = 1.08 * get_font_height("font-family: " + font + "; font-size: " + test_font_size + "px", plot.parent_div) / test_font_size;
	
	plot.mouse = new THREE.Vector2();
	plot.raycaster = new THREE.Raycaster();
	
	//plot.parent_div.removeChild(tiny_div);
	
	if ("photosphere_image" in params) {
		let photosphere_radius = ("photosphere_radius" in params) ? params.photosphere_radius : 1;
		
		let width_segments = ("photosphere_width_segments" in params) ? params.photosphere_width_segments : 60;
		let height_segments = ("photosphere_height_segments" in params) ? params.photosphere_height_segments : 60;
		
		plot.photosphere_geometry = new THREE.SphereGeometry(photosphere_radius, width_segments, height_segments);
		let geom_scale = -1;
		if ("photosphere_inverted" in params) {
			if (params.photosphere_inverted) {
				geom_scale = 1;
			}
		}
		
		plot.photosphere_geometry.scale(geom_scale, 1, 1);
		
		plot.photosphere_texture = new THREE.TextureLoader().load(params.photosphere_image, function() {
			add_photosphere(plot, params);
		});
	}
}

function add_photosphere(plot, params) {
	plot.photosphere_texture.minFilter = THREE.NearestFilter;
	
	let material = new THREE.MeshBasicMaterial({"map": plot.photosphere_texture});
	plot.photosphere = new THREE.Mesh(plot.photosphere_geometry, material);
	plot.photosphere.rotation.x = tau/4;
	
	if ("photosphere_origin" in params) {
		plot.photosphere.position.set(
			params.photosphere_origin[0],
			params.photosphere_origin[1],
			params.photosphere_origin[2]);
	}
	
	plot.scene.add(plot.photosphere);
	
	if (plot.tried_initial_render) {
		// The plot was rendered without the texture having
		// loaded, so render again:
		update_render(plot);
	}
}

function basic_plot_listeners(plot, i_plot,params) {
	plot.mouse_operation = "none";
	plot.two_finger_operation = "none";
	
	plot.renderer.domElement.addEventListener("mousedown", mouse_down_fn(plot));
	plot.renderer.domElement.addEventListener("mouseup", mouse_up_fn(plot, false));
	plot.renderer.domElement.addEventListener("mouseout", mouse_up_fn(plot, true));
	
	if (plot.have_mouseout) {
		if (plot.plot_type == "scatter") {
			plot.renderer.domElement.addEventListener("mouseout", mouse_out_wrapper(plot, -1, true));
		} else if (plot.plot_type == "surface") {
			plot.renderer.domElement.addEventListener("mouseout", mouse_out_wrapper(plot, [-1, -1], true));
		}
	}
	
	
	plot.renderer.domElement.addEventListener("mousemove", mouse_move_wrapper(plot));
	plot.renderer.domElement.addEventListener("wheel", mouse_zoom_wrapper(plot));
	plot.renderer.domElement.addEventListener("touchstart", touch_start_fn(plot));
	plot.renderer.domElement.addEventListener("touchmove", touch_move_fn(plot));
	plot.renderer.domElement.addEventListener("touchend", touch_end_fn(plot));
	
	if (plot.make_toggles) {
		document.getElementById("icon_three_d_scatter_camera_" + i_plot).addEventListener("click", toggle_camera(plot));
		document.getElementById("icon_three_d_scatter_grid_" + i_plot).addEventListener("click", toggle_grid(plot));
		document.getElementById("icon_three_d_scatter_ticks_" + i_plot).addEventListener("click", toggle_ticks(plot));
		document.getElementById("icon_three_d_scatter_axis_title_" + i_plot).addEventListener("click", toggle_axis_titles(plot));
		document.getElementById("icon_three_d_scatter_box_" + i_plot).addEventListener("click", toggle_box(plot));
	}
	
	if (plot.make_snaps) {
		document.getElementById("icon_three_d_scatter_snap_home_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[plot.init_lonlat[0], plot.init_lonlat[1], plot.init_rot],
				plot.init_origin));
		
		document.getElementById("icon_three_d_scatter_snap_top_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[0, tau/4, -tau/4],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_bottom_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[0, -tau/4, -tau/4],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_front_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[-tau/4, 0, 0],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_back_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[tau/4, 0, 0],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_left_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[0, 0, 0],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_right_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				plot,
				false,
				[tau/2, 0, 0],
				[0, 0, 0]));
	}
}

function custom_plot_listeners(plot, params) {
	plot.have_mouseover = false;
	plot.have_mouseout = false;
	plot.have_click = false;
	
	if (plot.plot_type == "scatter") {
		plot.clicked_i = -1;
		plot.mouseover_i = -1;
	} else if (plot.plot_type == "surface") {
		plot.clicked_i = [-1, -1];
		plot.mouseover_i = [-1, -1];
	}
	
	let possible_events = true;
	if (plot.plot_type == "scatter") {
		if (plot.geom_type == "none") {
			possible_events = false;
		}
	}
	
	if (possible_events) {
		if ("mouseover" in params) {
			plot.have_mouseover = true;
			plot.mouseover = params.mouseover;
		}
		
		if ("mouseout" in params) {
			plot.have_mouseout = true;
			plot.mouseout = params.mouseout;
		}
		
		if ("click" in params) {
			plot.have_click = true;
			plot.click = params.click;
		}
	}
}





export {get_i_plot,
	destroy_plot,
	hide_photosphere,
	show_photosphere,
	update_render,
	prepare_sizes,
	calculate_locations,
	smoothstep,
	animate_transition_wrapper,
	animate_transition,
	 change_data,
	check_webgl_fallback,
	basic_plot_setup,
	basic_plot_listeners,
	custom_plot_listeners,
	make_surface,
	tau,
	rad2deg,
}