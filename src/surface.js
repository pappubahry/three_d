import {
	shader_mesh_vertex,
	shader_mesh_fragment,
	shader_surface_vertex,
	shader_surface_fragment,
  } from './shader.js';
import {	calculate_color,
	set_surface_point_color,
	hex_to_rgb_obj,
	css_color_to_hex,
} from './color.js';

import * as d3 from "https://cdn.skypack.dev/d3@7";
import {
    make_axes,
	toggle_box,
	toggle_ticks,
	resize_axes,
  } from './display.js'

import {
	update_render,
	calculate_locations,
	check_webgl_fallback,
	basic_plot_setup,
	basic_plot_listeners,
	custom_plot_listeners,
} from './main.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';


function check_surface_data_sizes(params) {
	let i, j;
	
	// Check to see if the data is correctly formatted.
	let x_values = params.data.x;
	let y_values = params.data.y;
	let z_values = params.data.z;
	
	let have_colors = false;

	if ((x_values.length < 2) || (y_values.length < 2)) {
		console.warn("Need to have at least two values defined for each of x and y.");
		return {"data": false, "colors": false};
	}

	if ("color" in params.data) {
		have_colors = true;
		let color_values = params.data.color;
		
		if (color_values.length != x_values.length) {
			console.warn("params.data.color does not have the same length as params.data.x; ignoring colors.");
			have_colors = false;
		}
	}
	
	if (z_values.length != x_values.length) {
		console.warn("params.data.z does not have the same length as params.data.x; plot abandoned.");
		return {"data": false, "colors": false};
	}
	
	for (i = 0; i < z_values.length; i++) {
		if (z_values[i].length != y_values.length) {
			console.warn("params.data.z[" + i + "] does not have the same length as params.data.y; plot abandoned.");
			return {"data": false, "colors": false};
		}
		
		if (have_colors) {
			if (color_values[i].length != y_values.length) {
				console.warn("params.data.color[" + i + "] does not have the same length as params.data.y; ignoring colors.");
				have_colors = false;
			}
		}
	}
	
	let have_other = true;
	if (!("other" in params.data)) {
		params.data.other = [];
		
		for (i = 0; i < z_values.length; i++) {
			params.data.other.push([]);
			
			for (j = 0; j < y_values.length; j++) {
				params.data.other[i].push({});
			}
		}
	} else {
		let other_values = params.data.other;
		if (other_values.length != x_values.length) {
			console.warn("params.data.other does not have the same length as params.data.x; ignoring other.");
			have_other = false;
		}
		
		for (i = 0; i < other_values.length; i++) {
			if (other_values[i].length != y_values.length) {
				console.warn("params.data.other[" + i + "] does not have the same length as params.data.y; ignoring other.");
				have_other = false;
			}
		}
	}
	
	return {"data": true, "colors": have_colors, "other": have_other};
}

function make_surface(plot, params,canvas) {
	//if (!check_webgl_fallback(params)) { return; }
	if (!plot.canvas){plot.canvas = canvas}
	plot.surface_list = [];
	plot.surface_nr = 1;
	let surf ={nr:plot.surface_nr,name:params.name,scaled_bound:[[-1,1], [-1,1], [-1,1]]}
	plot.surface_list.push(surf)
	
	let size_checks = check_surface_data_sizes(params);
	if (!size_checks.data) { return; }
	//let plot = plots[i_plot]
	//plot.have_color_matrix = size_checks.colors;
	//plot.have_other = size_checks.other;
	//plots.push({});
	//let i_plot = plots.length - 1;
	//let plot = plots[i_plot];
	var flatz = params.data.z.flat()
	const p_x = params.data.x.filter(function (value) {
		return !Number.isNaN(value)})
	const p_y =  params.data.y.filter(function (value) {
		return !Number.isNaN(value)})
	const p_z = flatz.filter(function (value) {
			return !Number.isNaN(value)})
	surf.bounds={x:[Math.min(...p_x),Math.max(...p_x)],y:[Math.min(...p_y),Math.max(...p_y)],z:[Math.min(...p_z),Math.max(...p_z)]}
	basic_plot_setup(plot,params,plot.canvas);
	make_axes(plot, params);
	surf.scaled_bound = plot.current_scale //assign to the first surface
	plot.surface_material = new THREE.ShaderMaterial({
		"vertexShader":   shader_surface_vertex,
		"fragmentShader": shader_surface_fragment,
		"side": THREE.DoubleSide
	});
	
	let mesh_color;
	mesh_color = new THREE.Vector4(1, 1, 1, 1);

	
	let use_const_color = 1; //mesh grid constant color
	
	if ("uniform_mesh_color" in params) {
		use_const_color = params.uniform_mesh_color | 0;
	}

	plot.mesh_material = new THREE.ShaderMaterial({
		"uniforms": {
			"use_const_color": {"type": "f",  "value": use_const_color},
			"const_color":     {"type": "v4", "value": mesh_color}
		},
		"vertexShader":   shader_mesh_vertex,
		"fragmentShader": shader_mesh_fragment
	});
	
	let temp_obj = calculate_locations(plot, params);
	make_mesh_points(plot,plot.surface_nr, params, temp_obj.plot_locations, temp_obj.null_points);
	
	custom_plot_listeners(plot, params);

	update_render(plot);
	plot.tried_initial_render = true;
	plot.surface_nr +=1
	//basic_plot_listeners(plot, i_plot,params);
}



function add_surface(plot, params){
	if (plot.surface_list.length>0){
			let size_checks = check_surface_data_sizes(params);
	if (!size_checks.data) { return; }
	if (plot.surface_list.map(surf => surf.name).includes(params.name)) {return} //no duplicated name
	plot.show_box =true
	toggle_box(plot)
	plot.show_ticks =true
	toggle_ticks(plot)
	plot.axis_box.geometry.dispose()
	plot.axis_box.material.dispose()
	for (const ticks of plot.axis_ticks_group.children){
		ticks.geometry.dispose()
		ticks.material.dispose()
	}
	for (let i = 0; i < 3; i++){
		plot.scene.remove(plot.grid_lines_upper[i]);
		plot.scene.remove(plot.grid_lines_lower[i]);
	}
	plot.show_box =true
	plot.show_ticks = true
	let surf ={nr:plot.surface_nr,name:params.name}
	
	var flatz = params.data.z.flat()
	const p_x = params.data.x.filter(function (value) {
		return !Number.isNaN(value)})
	const p_y =  params.data.y.filter(function (value) {
		return !Number.isNaN(value)})
	const p_z = flatz.filter(function (value) {
			return !Number.isNaN(value)})
	surf.bounds={x:[Math.min(...p_x),Math.max(...p_x)],y:[Math.min(...p_y),Math.max(...p_y)],z:[Math.min(...p_z),Math.max(...p_z)]}
	plot.surface_list.push(surf)

	let temp_obj = calculate_locations(plot, params);
	surf.scaled_bound=surf_scaled_bound(temp_obj.plot_locations)
	update_plot_bounds("add",plot,surf.scaled_bound)
	make_mesh_points(plot,plot.surface_nr, params, temp_obj.plot_locations, temp_obj.null_points);
	plot.surface_nr +=1
	resize_axes(plot)
	} else {
		make_surface(plot,params)
		
	}
	update_render(plot);
}

function remove_surface (plot,name){
	let surf = plot.surface_list.find(surf => surf.name === name);
	if (surf === undefined) {return} //surface not found
	if (plot.surface_list.length >1){
		let surf_ind = plot.surface_list.findIndex(surf => surf.name === name);
		plot.show_box =true
		toggle_box(plot)
		plot.show_ticks =true
		toggle_ticks(plot)
		plot.axis_box.geometry.dispose()
		plot.axis_box.material.dispose()
		for (const ticks of plot.axis_ticks_group.children){
			ticks.geometry.dispose()
			ticks.material.dispose()
		}
		for (let i = 0; i < 3; i++){
			plot.scene.remove(plot.grid_lines_upper[i]);
			plot.scene.remove(plot.grid_lines_lower[i]);
		}
		plot.show_box =true
		plot.show_ticks = true
	
		const surf_obj=plot.scene.getObjectByProperty( "uuid",surf.surface.uuid )
		plot.group_surf.remove(surf_obj)
		surf_obj.geometry.dispose()
		surf_obj.material.dispose()
		if(plot.showing_mesh){
			const surf_mesh_obj =plot.scene.getObjectByProperty( "uuid",surf.surface_mesh.uuid )
			plot.group_mesh.remove(surf_mesh_obj)
			surf_mesh_obj.geometry.dispose()
			surf_mesh_obj.material.dispose()
		}
		plot.surface_list = plot.surface_list.filter((value)=>{ return value.name != name})
		update_plot_bounds("remove",plot)
		
		resize_axes(plot)

	} else {
		let surf_ind = plot.surface_list.findIndex(surf => surf.name === name);
		
	
		const surf_obj=plot.scene.getObjectByProperty( "uuid",surf.surface.uuid )
		plot.group_surf.remove(surf_obj)
		surf_obj.geometry.dispose()
		surf_obj.material.dispose()
		if(plot.showing_mesh){
			const surf_mesh_obj =plot.scene.getObjectByProperty( "uuid",surf.surface_mesh.uuid )
			plot.group_mesh.remove(surf_mesh_obj)
			surf_mesh_obj.geometry.dispose()
			surf_mesh_obj.material.dispose()
		}
	
		plot.surface_list = plot.surface_list.filter((value)=>{ return value.name != name})
		
		
	}
	update_render(plot);
}

function surf_scaled_bound (surf_scaled_coord){
	let x_max = d3.max(surf_scaled_coord.x)
	let x_min = d3.min(surf_scaled_coord.x)
	let y_max = d3.max(surf_scaled_coord.y)
	let y_min = d3.min(surf_scaled_coord.y)
	let z_flat= surf_scaled_coord.z.flat()
	let z_max = d3.max(z_flat)
	let z_min = d3.min(z_flat)
	return [[x_min,x_max],[y_min,y_max],[z_min,z_max]]
}

function update_plot_bounds (operation, plot, surf_scaled_bound){
	if (operation === "add"){
		console.log(plot.current_scale)
		let plot_x_max = ((surf_scaled_bound[0][1]>plot.current_scale[0][1])?surf_scaled_bound[0][1]:plot.current_scale[0][1])
		let plot_x_min = ((surf_scaled_bound[0][0]<plot.current_scale[0][0])?surf_scaled_bound[0][0]:plot.current_scale[0][0])
		let plot_y_max = ((surf_scaled_bound[1][1]>plot.current_scale[1][1])?surf_scaled_bound[1][1]:plot.current_scale[1][1])
		let plot_y_min = ((surf_scaled_bound[1][0]<plot.current_scale[1][0])?surf_scaled_bound[1][0]:plot.current_scale[1][0])
		let plot_z_max = ((surf_scaled_bound[2][1]>plot.current_scale[2][1])?surf_scaled_bound[2][1]:plot.current_scale[2][1])
		let plot_z_min = ((surf_scaled_bound[2][0]<plot.current_scale[2][0])?surf_scaled_bound[2][0]:plot.current_scale[2][0])
		plot.current_scale = [[plot_x_min,plot_x_max],[plot_y_min,plot_y_max],[plot_z_min,plot_z_max]]
		console.log(plot.current_scale)
		return
	} else if (operation === "remove"){
		console.log(plot.current_scale)
		console.log(plot.surface_list)
		let all_x = plot.surface_list.map(surf => surf.scaled_bound[0]).flat();
		let all_y = plot.surface_list.map(surf => surf.scaled_bound[1]).flat();
		let all_z = plot.surface_list.map(surf => surf.scaled_bound[2]).flat();
		let maxX=d3.max(all_x)
		let minX=d3.min(all_x)
		let maxY=d3.max(all_y)
		let minY=d3.min(all_y)
		let maxZ=d3.max(all_z)
		let minZ=d3.min(all_z)
		plot.current_scale=[[minX,maxX],[minY,maxY],[minZ,maxZ]]
		console.log(plot.current_scale)
		return
	}
}

function update_surface_input_data(surf, params, start_i, start_j, change_colors) {
	if (start_j === undefined) { start_j = 0; }
	if (start_i === undefined) { start_i = 0; }
	if (change_colors === undefined) { change_colors = true; }
	
	for (var i = start_i; i < surf.mesh_points.length; i++) {
		for (var j = start_j; j < surf.mesh_points[i].length; j++) {
			surf.mesh_points[i][j].input_data.i = i;
			surf.mesh_points[i][j].input_data.j = j;
			surf.mesh_points[i][j].input_data.x = params.data.x[i - start_i];
			surf.mesh_points[i][j].input_data.y = params.data.y[j - start_j];
			surf.mesh_points[i][j].input_data.z = params.data.z[i - start_i][j - start_j];
			
			if (change_colors) {
				surf.mesh_points[i][j].input_data.color = params.data.color[i - start_i][j - start_j];
			}
			
			// input_data.other is set in make_mesh_points().
		}
	}
}

function make_mesh_arrays(plot, params, plot_locations, null_points) {
	// The basic unit of the creation of the surface is a "quad", which
	// connects four neighbouring grid nodes, (x[i], y[j]) to 
	// (x[i+1], y[j+1]).  But instead of only two triangles in the quad,
	// instead there are four (for symmetry reasons -- important for
	// colour and null-point interpolation), with the centroid of the
	// quad needing to have its values be interpolated.
	//
	// By contrast, the mesh is easy, just a pair of vertices per
	// nearest-neighbour pair of points.
	
	var return_obj = {};
	
	var i, j, k, color_obj, start_i, start_j, this_loc, i_quad, i_segment;
	
	var nx = plot_locations.x.length;
	var ny = plot_locations.y.length;
	
	var n_quads = (nx - 1) * (ny - 1);
	var n_segments = nx * (ny - 1) + ny * (nx - 1);
	
	i_quad = 0;
	i_segment = 0;
	
	return_obj.surface_positions = new Float32Array(n_quads * 36);
	return_obj.surface_colors    = new Float32Array(n_quads * 48);
	return_obj.surface_nulls     = new Float32Array(n_quads * 12);
	return_obj.surface_hides     = new Float32Array(n_quads * 12);
	
	return_obj.mesh_positions = new Float32Array(n_segments * 6);
	return_obj.mesh_colors    = new Float32Array(n_segments * 8);
	return_obj.mesh_nulls     = new Float32Array(n_segments * 2);
	return_obj.mesh_hides     = new Float32Array(n_segments * 2);
	return_obj.mesh_hide_axes = new Float32Array(n_segments * 2);
	
	// Surface.
	
	var this_x, this_y, this_z, this_rgb, this_null, this_non_null, tri_null, non_nulls;
	var i1, j1, i_base_12, i_base_36, i_base_48;
	var k_tri, k_tri_3, k_tri_9, k_tri_12, k_vert, k_vert_3, k_vert_4;
	
	// Indices in the this_{x,y,z,etc.} arrays for each vertex of
	// each triangle in the quad:
	var xi = [
		[1, 0, 2],
		[1, 2, 2],
		[1, 2, 0],
		[1, 0, 0]
	];
	
	var yi = [
		[1, 0, 0],
		[1, 0, 2],
		[1, 2, 2],
		[1, 2, 0]
	];
	
	var zi = [
		[4, 0, 1],
		[4, 1, 2],
		[4, 2, 3],
		[4, 3, 0]
	];
	
	for (i = 0; i < nx - 1; i++) {
		this_x = [plot_locations.x[i], 0.5*(plot_locations.x[i] + plot_locations.x[i + 1]), plot_locations.x[i + 1]];
		i1 = [i, i+1, i+1, i];
		
		for (j = 0; j < ny - 1; j++) {
			this_y = [plot_locations.y[j], 0.5*(plot_locations.y[j] + plot_locations.y[j + 1]), plot_locations.y[j + 1]];
			j1 = [j, j, j+1, j+1];
			
			// First four entries in these arrays are the exact mesh
			// nodes; final entry is the interpolated point:
			this_z = [0, 0, 0, 0, 0];
			this_null = [0, 0, 0, 0, 0];
			this_non_null = [1, 1, 1, 1, 1];
			this_rgb = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
			
			non_nulls = 0;
			
			for (k = 0; k < 4; k++) {
				this_z[k] = plot_locations.z[i1[k]][j1[k]];
				this_rgb[k] = plot_locations.color[i1[k]][j1[k]].slice(0);
				this_null[k] = null_points[i1[k]][j1[k]];
				this_non_null[k] = 1 - this_null[k];
				
				non_nulls += this_non_null[k];
			}
			
			if (non_nulls >= 3) {
				// Need at least 3 corners of the quad to interpolate
				// the centre.
				this_null[4] = 0;
				this_z[4] = (this_non_null[0]*this_z[0] + this_non_null[1]*this_z[1] + this_non_null[2]*this_z[2] + this_non_null[3]*this_z[3]) / non_nulls;
				
				for (k = 0; k < 3; k++) {
					this_rgb[4][k] = (this_non_null[0]*this_rgb[0][k] + this_non_null[1]*this_rgb[1][k] + this_non_null[2]*this_rgb[2][k] + this_non_null[3]*this_rgb[3][k]) / non_nulls;
				}
			} else {
				this_null[4] = 1;
				this_z[4] = 0;
			}
			
			tri_null = [
				this_null[0] || this_null[1] || this_null[4],
				this_null[1] || this_null[2] || this_null[4],
				this_null[2] || this_null[3] || this_null[4],
				this_null[3] || this_null[0] || this_null[4]
			];
			
			i_base_12 = i_quad*12;
			i_base_36 = i_quad*36;
			i_base_48 = i_quad*48;
			
			for (k_tri = 0; k_tri < 4; k_tri++) {
				k_tri_3  = k_tri*3;
				k_tri_9  = k_tri*9;
				k_tri_12 = k_tri*12;
				
				for (k_vert = 0; k_vert < 3; k_vert++) {
					k_vert_3 = k_vert*3;
					k_vert_4 = k_vert*4;
					
					return_obj.surface_positions[i_base_36 + k_tri_9 + k_vert_3 + 0] = this_x[xi[k_tri][k_vert]];
					return_obj.surface_positions[i_base_36 + k_tri_9 + k_vert_3 + 1] = this_y[yi[k_tri][k_vert]];
					return_obj.surface_positions[i_base_36 + k_tri_9 + k_vert_3 + 2] = this_z[zi[k_tri][k_vert]];
					
					return_obj.surface_colors[i_base_48 + k_tri_12 + k_vert_4 + 0] = this_rgb[zi[k_tri][k_vert]][0];
					return_obj.surface_colors[i_base_48 + k_tri_12 + k_vert_4 + 1] = this_rgb[zi[k_tri][k_vert]][1];
					return_obj.surface_colors[i_base_48 + k_tri_12 + k_vert_4 + 2] = this_rgb[zi[k_tri][k_vert]][2];
					return_obj.surface_colors[i_base_48 + k_tri_12 + k_vert_4 + 3] = 1;
					
					return_obj.surface_nulls[i_base_12 + k_tri_3 + k_vert] = tri_null[k_tri];
					return_obj.surface_hides[i_base_12 + k_tri_3 + k_vert] = 0;
				}
			}
			
			i_quad++;
		}
	}
	
	// Mesh.
	// Two loops through, one for segments along x-direction,
	// one for y.
	
	var nxy = [nx, ny];
	var axes = ["x", "y"];
	var this_xy, this_yx1, this_yx2, this_z1, this_z2, this_null1, this_null2, this_rgb1, this_rgb2;
	var i1, i2, j1, j2;
	
	if (!("hiding_mesh_axes" in plot)) {
		plot.hiding_mesh_axes = [false, false];
		plot.hiding_mesh_axes[0] = ("hide_mesh_x" in params) ? (0 | params.hide_mesh_x) : 0;
		plot.hiding_mesh_axes[1] = ("hide_mesh_y" in params) ? (0 | params.hide_mesh_y) : 0;
	}
	
	for (var i_dirn = 0; i_dirn < 2; i_dirn++) {
		for (i = 0; i < nxy[i_dirn]; i++) {
			this_xy = plot_locations[axes[i_dirn]][i];
			
			for (j = 0; j < nxy[1 - i_dirn] - 1; j++) {
				this_yx1 = plot_locations[axes[1 - i_dirn]][j];
				this_yx2 = plot_locations[axes[1 - i_dirn]][j + 1];
				
				if (i_dirn == 0) {
					i1 = i;
					i2 = i;
					j1 = j;
					j2 = j + 1;
				} else {
					i1 = j;
					i2 = j + 1;
					j1 = i;
					j2 = i;
				}
				
				this_z1 = plot_locations.z[i1][j1];
				this_rgb1 = JSON.parse(JSON.stringify(plot_locations.color[i1][j1]));
				this_null1 = null_points[i1][j1];
				
				this_z2 = plot_locations.z[i2][j2];
				this_rgb2 = JSON.parse(JSON.stringify(plot_locations.color[i2][j2]));
				this_null2 = null_points[i2][j2];
				
				return_obj.mesh_positions[i_segment*6 + 0 + i_dirn] = this_xy;
				return_obj.mesh_positions[i_segment*6 + 1 - i_dirn] = this_yx1;
				return_obj.mesh_positions[i_segment*6 + 2         ] = this_z1;
				
				return_obj.mesh_positions[i_segment*6 + 3 + i_dirn] = this_xy;
				return_obj.mesh_positions[i_segment*6 + 4 - i_dirn] = this_yx2;
				return_obj.mesh_positions[i_segment*6 + 5         ] = this_z2;
				
				return_obj.mesh_colors[i_segment*8 + 0] = this_rgb1[0];
				return_obj.mesh_colors[i_segment*8 + 1] = this_rgb1[1];
				return_obj.mesh_colors[i_segment*8 + 2] = this_rgb1[2];
				return_obj.mesh_colors[i_segment*8 + 3] = 1;
				
				return_obj.mesh_colors[i_segment*8 + 4] = this_rgb2[0];
				return_obj.mesh_colors[i_segment*8 + 5] = this_rgb2[1];
				return_obj.mesh_colors[i_segment*8 + 6] = this_rgb2[2];
				return_obj.mesh_colors[i_segment*8 + 7] = 1;
				
				return_obj.mesh_nulls[i_segment*2 + 0] = this_null1;
				return_obj.mesh_nulls[i_segment*2 + 1] = this_null2;
				
				return_obj.mesh_hides[i_segment*2 + 0] = 0;
				return_obj.mesh_hides[i_segment*2 + 1] = 0;
				
				return_obj.mesh_hide_axes[i_segment*2 + 0] = plot.hiding_mesh_axes[1 - i_dirn];
				return_obj.mesh_hide_axes[i_segment*2 + 1] = plot.hiding_mesh_axes[1 - i_dirn];
				
				i_segment++;
			}
		}
	}
	
	return return_obj;
}

function make_mesh_points(plot, surface_nr,params, plot_locations, null_points) {
	var i, j;
	var nx = plot_locations.x.length;
	var ny = plot_locations.y.length;
	

	var surf = plot.surface_list.find(surf => surf.nr === surface_nr)
	var surface_geom = new THREE.BufferGeometry();
	var mesh_geom    = new THREE.BufferGeometry();
	
	var array_obj = make_mesh_arrays(plot, params, plot_locations, null_points);

	surface_geom.setAttribute("position",   new THREE.BufferAttribute(array_obj.surface_positions, 3, true));
	surface_geom.setAttribute("color",      new THREE.BufferAttribute(array_obj.surface_colors,    4, true));
	surface_geom.setAttribute("null_point", new THREE.BufferAttribute(array_obj.surface_nulls,     1, true));
	surface_geom.setAttribute("hide_point", new THREE.BufferAttribute(array_obj.surface_hides,     1, true));
	surf.surface = new THREE.Mesh(surface_geom, plot.surface_material);
	//plot.surface = new THREE.Mesh(surface_geom, plot.surface_material);
	if (!("showing_surface" in plot)) {
		plot.showing_surface = ("show_surface" in params) ? params.show_surface : true;
	}
	
	if (plot.showing_surface) { plot.group_surf.add(surf.surface); }
	surf.visible = true;
	mesh_geom.setAttribute("position",   new THREE.BufferAttribute(array_obj.mesh_positions, 3, true));
	mesh_geom.setAttribute("color",      new THREE.BufferAttribute(array_obj.mesh_colors,    4, true));
	mesh_geom.setAttribute("null_point", new THREE.BufferAttribute(array_obj.mesh_nulls,     1, true));
	mesh_geom.setAttribute("hide_point", new THREE.BufferAttribute(array_obj.mesh_hides,     1, true));
	mesh_geom.setAttribute("hide_axis",  new THREE.BufferAttribute(array_obj.mesh_hide_axes, 1, true));
	
	//plot.surface_mesh = new THREE.LineSegments(mesh_geom, plot.mesh_material);
	surf.surface_mesh = new THREE.LineSegments(mesh_geom, plot.mesh_material);
	if (!("showing_mesh" in plot)) {
		plot.showing_mesh = ("show_mesh" in params) ? params.show_mesh : true;
	}
	
	if (plot.showing_mesh) { plot.group_mesh.add(surf.surface_mesh); }
	
	surf.mesh_points = [];
	surf.hide_points = [];
	surf.hide_mesh_points = [];
	
	// Update input data.
	for (i = 0; i < nx; i++) {
		surf.mesh_points.push([]);
		surf.hide_points.push([]);
		surf.hide_mesh_points.push([]);
		
		for (j = 0; j < ny; j++) {
			surf.mesh_points[i].push({"input_data": {}});
			if (plot.have_other) {
				surf.mesh_points[i][j].input_data.other = JSON.parse(JSON.stringify(params.data.other[i][j]));
			} else {
				surf.mesh_points[i][j].input_data.other = {};
			}
			
			surf.hide_points[i].push(0);
			surf.hide_mesh_points[i].push(0);
		}
	}
	
	update_surface_input_data(surf, params, array_obj.start_i, array_obj.start_j);
}


function show_surface (plot) {
	plot.scene.add(plot.surface);
	plot.showing_surface = true;
}

function hide_surface(plot) {
	plot.scene.remove(plot.surface);
	plot.showing_surface = false;
}

function show_mesh (plot) {
	plot.scene.add(plot.surface_mesh);
	plot.showing_mesh = true;
}

function hide_mesh(plot) {
	plot.scene.remove(plot.surface_mesh);
	plot.showing_mesh = false;
}

function set_mesh_uniform_color (plot, col) {
	if (col == "variable") {
		plot.surface_mesh.material.uniforms.use_const_color.value = 0;
		return;
	}
	
	var i, rgb;
	plot.surface_mesh.material.uniforms.use_const_color.value = 1;
	
	if (typeof(col) == "string") { col = css_color_to_hex(col); }
	if (typeof(col) == "object") {
		var is_255 = false;
		for (i = 0; i < 3; i++) {
			if (col[i] > 1) { is_255 = true; }
		}
		
		if (is_255) {
			for (i = 0; i < 3; i++) {
				col[i] /= 255;
			}
		}
		
		rgb = {"r": col[0], "g": col[1], "b": col[2]};
	} else {
		var rgb = hex_to_rgb_obj(col);
	}
	
	plot.mesh_material.uniforms.const_color.value = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
}

function use_uniform_mesh_color(plot) {
	plot.mesh_material.uniforms.use_const_color.value = 1;
	return;
}

function surrounding_surface_quads(plot, i, j) {
	var nx = plot.intersected_surf.mesh_points.length;
	var ny = plot.intersected_surf.mesh_points[0].length;
	
	var i_quad = [-1, -1, -1, -1];
	
	if ((i < nx - 1) && (j < ny - 1)) { i_quad[0] =       i*(ny - 1) + j;     }
	if ((i < nx - 1) && (j > 0))      { i_quad[1] =       i*(ny - 1) + j - 1; }
	if ((i > 0)      && (j > 0))      { i_quad[2] = (i - 1)*(ny - 1) + j - 1; }
	if ((i > 0)      && (j < ny - 1)) { i_quad[3] = (i - 1)*(ny - 1) + j;     }
	
	return i_quad;
}

function surrounding_mesh_segments(plot, i, j) {
	var nx = plot.mesh_points.length;
	var ny = plot.mesh_points[0].length;
	
	var i_segment = [-1, -1, -1, -1];
	
	if (i < nx - 1) { i_segment[0] = (ny - 1)*nx + j*(nx - 1) + i; }
	if (i > 0)      { i_segment[1] = (ny - 1)*nx + j*(nx - 1) + i - 1; }
	if (j < ny - 1) { i_segment[2] =               i*(ny - 1) + j; }
	if (j > 0)      { i_segment[3] =               i*(ny - 1) + j - 1; }
	
	return i_segment;
}

function set_surface_point_z(plot, i, j, z) {
	plot.mesh_points[i][j].input_data.z = z;
	var this_z = plot.scales[2](z);
	
	var positions = plot.surface.geometry.attributes.position.array;
	var nulls     = plot.surface.geometry.attributes.null_point.array;
	
	plot.surface.geometry.attributes.position.needsUpdate   = true;
	plot.surface.geometry.attributes.null_point.needsUpdate = true;
	
	var mesh_positions = plot.surface_mesh.geometry.attributes.position.array;
	var mesh_nulls     = plot.surface_mesh.geometry.attributes.null_point.array;
	
	plot.surface_mesh.geometry.attributes.position.needsUpdate = true;
	plot.surface_mesh.geometry.attributes.null_point.needsUpdate = true;
	
	var nx = plot.mesh_points.length;
	var ny = plot.mesh_points[0].length;
	
	// Start with the surface.
	
	// The mesh point (i, j) is at the corner of up to four quads.
	var i_quad = surrounding_surface_quads(plot, i, j);
	
	/* Ordering of the vertices in a quad:
	 * 
	 * 8,10    5,7
	 *   ______
	 *  |\    /|  y[j+1]
	 *  | \  / |
	 *  |  \/  |  Central (interpolated) point: 0, 3, 6, 9
	 *  |  /\  |
	 *  | /  \ |
	 *  |/____\|  y[j]
	 * 
	 * 1,11    2,4
	 * x[i]  x[i+1]
	 * 
	 * (x[i], y[j]) is
	 *    vertices 1, 11 of i_quad[0],
	 *    vertices 8, 10 of i_quad[1],
	 *    vertices 5,  7 of i_quad[2],
	 *    vertices 2,  4 of i_quad[3].
	 * 
	 */
	
	var new_i_vert = [
		[1, 11],
		[8, 10],
		[5,  7],
		[2,  4]
	];
	
	var tri_i = [
		[0, 3],
		[2, 3],
		[1, 2],
		[0, 1]
	];
	
	var k, k_vert, i1, j1;
	var tri_null, non_nulls;
	
	var this_null = 1*(isNaN(z) || (z === null));
	var non_null = 1 - this_null;
	
	plot.mesh_points[i][j].input_data.z = z;
	
	if (this_null) { this_z = 0; };
	
	var quad_z = [0, 0, 0, 0, 0];
	var quad_null = [0, 0, 0, 0, 0];
	var quad_non_null = [1, 1, 1, 1, 1];
	var temp_z = [0, 0, 0, 0, 0];
	
	for (k = 0; k < 4; k++) {
		// Loop over quads.
		
		if (i_quad[k] >= 0) {
			i1 = Math.floor(i_quad[k] / (ny - 1));
			j1 = i_quad[k] % (ny - 1);
			
			// temp_z: real z-values.
			// quad_z: world-space z-values.
			// Interpolate on the world-space values in case one day
			// I have non-linear scales.
			
			temp_z[0] = plot.mesh_points[i1  ][j1  ].input_data.z;
			temp_z[1] = plot.mesh_points[i1+1][j1  ].input_data.z;
			temp_z[2] = plot.mesh_points[i1+1][j1+1].input_data.z;
			temp_z[3] = plot.mesh_points[i1  ][j1+1].input_data.z;
			
			non_nulls = 0;
			
			for (k_vert = 0; k_vert < 4; k_vert++) {
				if (isNaN(temp_z[k_vert]) || (temp_z[k_vert] === null)) {
					quad_null[k_vert] = 1;
					quad_z[k_vert] = 0;
				} else {
					quad_null[k_vert] = 0;
					quad_z[k_vert] = plot.scales[2](temp_z[k_vert]);
				}
				
				quad_non_null[k_vert] = 1 - quad_null[k_vert];
				non_nulls += quad_non_null[k_vert];
			}
			
			quad_null[4] = (non_nulls >= 3) ? 0 : 1;
			
			tri_null = [
				quad_null[0] || quad_null[1] || quad_null[4],
				quad_null[1] || quad_null[2] || quad_null[4],
				quad_null[2] || quad_null[3] || quad_null[4],
				quad_null[3] || quad_null[0] || quad_null[4]
			];
			
			// Interpolate the central value:
			quad_z[4] = 0;
			
			if (non_nulls >= 3) {
				for (k_vert = 0; k_vert < 4; k_vert++) {
					quad_z[4] += quad_non_null[k_vert] * quad_z[k_vert];
				}
				quad_z[4] /= non_nulls;
			}
			
			positions[i_quad[k]*36 +  2] = quad_z[4];
			positions[i_quad[k]*36 + 11] = quad_z[4];
			positions[i_quad[k]*36 + 20] = quad_z[4];
			positions[i_quad[k]*36 + 29] = quad_z[4];
			
			for (var k_tri = 0; k_tri < 4; k_tri++) {
				nulls[i_quad[k]*12 + k_tri*3 + 0] = tri_null[k_tri];
				nulls[i_quad[k]*12 + k_tri*3 + 1] = tri_null[k_tri];
				nulls[i_quad[k]*12 + k_tri*3 + 2] = tri_null[k_tri];
			}
			
			positions[i_quad[k]*36 + 3*new_i_vert[k][0] + 2] = this_z;
			positions[i_quad[k]*36 + 3*new_i_vert[k][1] + 2] = this_z;
			
			nulls[i_quad[k]*12 + new_i_vert[k][0]] = tri_null[tri_i[k][0]];
			nulls[i_quad[k]*12 + new_i_vert[k][1]] = tri_null[tri_i[k][1]];
		}
	}
	
	
	// Now the mesh.
	
	var i_segment = surrounding_mesh_segments(plot, i, j);
	var idx = [0, 3, 0, 3];
	var idx_null = [0, 1, 0, 1];
	
	for (k = 0; k < 4; k++) {
		// Loop over segments.
		
		if (i_segment[k] >= 0) {
			mesh_positions[i_segment[k]*6 + idx[k] + 2] = this_z;
			mesh_nulls[i_segment[k]*2 + idx_null[k]] = this_null;
		}
	}
	
	
	if (!plot.have_color_matrix) {
		// Re-calculate the colour according to the scale.
		var this_color = calculate_color(z, plot.color_domain, plot.color_fn);
		var this_color_num = 65536*Math.round(255*this_color[0]) + 256*Math.round(255*this_color[1]) + Math.round(255*this_color[2]);
		set_surface_point_color(plot, i, j, this_color_num, true);
	}
}

export {check_surface_data_sizes,
    make_surface,
    update_surface_input_data,
    make_mesh_arrays,
    make_mesh_points,
    show_surface,
	add_surface,
	remove_surface,
    hide_surface,
    show_mesh,
    hide_mesh,
    set_mesh_uniform_color,
    use_uniform_mesh_color,
    surrounding_surface_quads,
    surrounding_mesh_segments,
    set_surface_point_z}
