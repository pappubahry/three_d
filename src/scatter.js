import {
	shader_points_vertex,
	shader_points_fragment,
	shader_quads_vertex,
	shader_quads_fragment,
	shader_lines_vertex,
	shader_lines_fragment,
  } from './shader.js';

import {
	update_render,
	prepare_sizes,
	calculate_locations,
	check_webgl_fallback,
	basic_plot_setup,
	basic_plot_listeners,
	custom_plot_listeners,} from './three_d.js'
import { get_current_camera } from './camera.js'
import {
    update_labels,

    get_scale_factor,
    make_label_text_plane,
    make_axes,
  } from './display.js'

  import {
	hex_to_rgb_obj,
	hex_to_rgb_obj_255,
	css_color_to_hex,
} from './color.js'
function make_scatter(params) {
	if (!check_webgl_fallback(params)) { return; }
	
	let i, group;
	
	plots.push({});
	let i_plot = plots.length - 1;
	
	plots[i_plot].plot_type = "scatter";
	
	plots[i_plot].parent_div = document.getElementById(params.div_id);
	
	let tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	plots[i_plot].geom_type = ("geom_type" in params) ? params.geom_type : "quad";
	
	if (plots[i_plot].geom_type == "none") {
		plots[i_plot].have_segments = true;
	} else {
		plots[i_plot].have_segments = ("connect_points" in params) ? params.connect_points : false;
	}
	
	let default_color = ("default_color" in params) ? params.default_color : 0xFFFFFF;
	
	if (typeof(default_color) == "string") {
		default_color = css_color_to_hex(default_color, tiny_div);
	}
	
	let point_type = ("point_type" in params) ? params.point_type : "sphere";
	
	if (point_type == "custom") {
		if (!(params.hasOwnProperty("custom_point"))) {
			point_type = "sphere";
		}
	}
	
	let default_image_src = point_type_src(point_type, params.custom_point);
	
	let default_point_height = ("default_point_height" in params) ? params.default_point_height : 20;
	
	plots[i_plot].have_groups = false;
	plots[i_plot].groups = {};
	
	plots[i_plot].texture_sources = [];
	let image_src;
	
	// Prepare the groups.
	if (params.hasOwnProperty("groups")) {
		for (i = 0; i < params.groups.length; i++) {
			if (params.groups[i].hasOwnProperty("name")) {
				plots[i_plot].have_groups = true;
				group = params.groups[i].name;
				
				plots[i_plot].groups[group] = {"num_points": 0};
				
				plots[i_plot].groups[group].default_point_height = (params.groups[i].hasOwnProperty("default_point_height")) ? params.groups[i].default_point_height : default_point_height;
				plots[i_plot].groups[group].default_color = (params.groups[i].hasOwnProperty("default_color")) ? params.groups[i].default_color : default_color;
				
				if (typeof(plots[i_plot].groups[group].default_color) == "string") {
					plots[i_plot].groups[group].default_color = css_color_to_hex(plots[i_plot].groups[group].default_color, tiny_div);
				}
				
				if (plots[i_plot].geom_type == "quad") {
					image_src = point_type_src(params.groups[i].point_type, params.groups[i].custom_point) || default_image_src;
					
					plots[i_plot].texture_sources.push(image_src);
					plots[i_plot].groups[params.groups[i].name].image_src = image_src;
				} else {
					if (params.groups[i].point_type !== undefined) {
						console.warn("Cannot have different point_type values for different groups with geom_type != \"quad\".");
					}
				}
			} else {
				console.warn("No group name!" + JSON.stringify(params.groups[i]));
			}
		}
		
		if (plots[i_plot].geom_type == "point") {
			plots[i_plot].texture_sources.push(default_image_src);
		}
		
		if (!plots[i_plot].groups.hasOwnProperty("default_group")) {
			plots[i_plot].groups.default_group = {
				"image_src": default_image_src,
				"default_point_height": default_point_height,
				"default_color": default_color};
			plots[i_plot].texture_sources.push(default_image_src);
		}
		
		// See if any named groups are not in the group details.
		let data_groups = [];
		
		for (i = 0; i < params.data.length; i++) {
			if (params.data[i].hasOwnProperty("group")) {
				if (plots[i_plot].groups[params.data[i].group] === undefined) {
					console.warn("Don't have group " + params.data[i].group + " in params.groups; ignoring groups.");
					plots[i_plot].have_groups = false;
					break;
				}
			} else {
				console.warn("No group defined for params.data[" + i + "]; ignoring groups.");
				plots[i_plot].have_groups = false;
				break;
			}
		}
	}
	
	if (!plots[i_plot].have_groups) {
		plots[i_plot].groups = {};
		plots[i_plot].groups.default_group = {
			"image_src": default_image_src,
			"default_point_height": default_point_height,
			"default_color": default_color};
		
		plots[i_plot].texture_sources = [];
		plots[i_plot].texture_sources.push(default_image_src);
	}
	
	plots[i_plot].texture_sources = plots[i_plot].texture_sources.filter(function(v, i, a) { return a.indexOf(v) === i; });
	
	if (plots[i_plot].geom_type == "quad") {
		for (group in plots[i_plot].groups) {
			if (plots[i_plot].groups.hasOwnProperty(group)) {
				plots[i_plot].groups[group].src_i = plots[i_plot].texture_sources.indexOf(plots[i_plot].groups[group].image_src);
			}
		}
	}
	
	plots[i_plot].texture_count = 0;
	plots[i_plot].textures = [];
	
	// The textures load asynchronously, so the onload function checks
	// to see if all textures have been loaded before continuing.
	
	for (i = 0; i < plots[i_plot].texture_sources.length; i++) {
		plots[i_plot].textures.push(new THREE.TextureLoader().load(plots[i_plot].texture_sources[i], function () { check_loaded_textures(plots,i_plot, params); }));
	}
	
	plots[i_plot].parent_div.removeChild(tiny_div);
}

function make_scatter_main (params, i_plot) {
	let i, j, k, l;
	
	if (i_plot === undefined) {
		var i_plot = plots.length - 1;
	}
	
	basic_plot_setup(plots,i_plot, params);
	prepare_sizes(plots[i_plot], params);
	make_axes(plots[i_plot], params);
	
	var pixel_ratio = window.devicePixelRatio ? window.devicePixelRatio : 1.0;
	
	var is_perspective = (plots[i_plot].view_type == "perspective") ? 1 : 0;
	
	if (plots[i_plot].geom_type == "point") {
		plots[i_plot].point_material = new THREE.ShaderMaterial({
			"uniforms": {
				"texture": {"type": "t", "value": plots[i_plot].texture},
				"camera_r": {"type": "f", "value": plots[i_plot].camera_r},
				"pixel_ratio": {"type": "f", "value": pixel_ratio},
				"is_perspective": {"type": "f", "value": is_perspective, "needsUpdate": true}
			},
			"vertexShader":   shader_points_vertex,
			"fragmentShader": shader_points_fragment
		});
	} else if (plots[i_plot].geom_type == "quad") {
		for (var group in plots[i_plot].groups) {
			if (plots[i_plot].groups.hasOwnProperty(group)) {
				plots[i_plot].groups[group].quad_material = new THREE.ShaderMaterial({
					"uniforms": {
						"texture": {"type": "t", "value": plots[i_plot].groups[group].texture}
					},
					"vertexShader":   shader_quads_vertex,
					"fragmentShader": shader_quads_fragment
				});
			}
		}
	}
	
	var temp_obj = calculate_locations(plots[i_plot], params);
	var plot_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
	
	// The usual JSON.parse trick doesn't work on the Float32Array I guess?
	var null_points = new Float32Array(params.data.length);
	for (i = 0; i < params.data.length; i++) {
		null_points[i] = temp_obj.null_points[i];
	}
	
	make_points(plot, params, plot_locations, null_points);
	
	custom_plot_listeners(plot, params);
	
	update_render(plots[i_plot]);
	plots[i_plot].tried_initial_render = true;
	
	basic_plot_listeners(plots[i_plot], params);
}

function update_points_input_data (plot, params, locations, start_i) {
	if (start_i === undefined) { start_i = 0; }
	
	for (var i = start_i; i < plot.points.length; i++) {
		plot.points[i].input_data.i = i;
		plot.points[i].input_data.x = params.data[i - start_i].x;
		plot.points[i].input_data.y = params.data[i - start_i].y;
		plot.points[i].input_data.z = params.data[i - start_i].z;
		plot.points[i].input_data.size = params.data[i - start_i].size;
		plot.points[i].input_data.scaled_size = params.data[i - start_i].scaled_size;
		plot.points[i].input_data.sphere_size = locations[i - start_i][3];
		plot.points[i].input_data.color = params.data[i - start_i].color;
		plot.points[i].input_data.label = params.data[i - start_i].label;
		
		// input_data.other is set in make_points().
	}
}

function point_type_src(point_type, custom_point) {
	var image_src;
	
	if (point_type === undefined) {
		return image_src;
	}
	
	if (point_type == "sphere") {
		image_src = "data:image/png;base64, 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";
	} else if (point_type == "plus") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAWxJREFUeJzt3TEOAyEMAEGc//+Z+wJNQnSzU1NYaOWChlmIvfc+OTcz8+1Z/snn9gC5qwBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAG5Of9TMO7UBcAWAKwBcAeAKAFcAuALAFQCuAHBze4BfOX3xnBnmTtZqA/AKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgHM9UM+rJflrUAAAAASUVORK5CYII=";
	} else if (point_type == "square") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABHNCSVQICAgIfAhkiAAAABZJREFUCJlj/P///38GJMDEgAYICwAABl0EBLhJJOwAAAAASUVORK5CYII=";
	} else if (point_type == "square_outlined") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAWFJREFUeJzt1LENxEAIAEF4uf+Wz8HLNVywMxEhEit2/s6QtOP4ac83nKODkt2dmZnf5T24TABxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAojbmTm3l+AeHyDuBc1CBv2D3mmmAAAAAElFTkSuQmCC";
	} else if (point_type == "circle") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAA6hJREFUeJztndGyoyAQBeP+/z/nPmwlRQhGkAFmON3vEcJpBrAsPR778+z8/WHSC6fs9Od6g25li7GL/CeqAn8++7w4juohCjmW0Tp9mmZv0K1ciBFmXCN01E3oZ0SWwXPnvtL1EvgVJ0K4HGuPnQobfE4EETx15iPlqKGfUZDBxdh76MTWwed4E2Fl41LB53gRYZUA0uG/8CDB7AYJvsBKEWYK8E6b4MtkIkzJZpYAhF/JbAlGN0DJv8HMJWGkAMz6TmZUg1ECEL4RoyUYIQDhGzNSAmsBCH8QoySwFIDwBzNCAisBCH8S1hJYCED4k7GUoFcAwl+ElQQ9AhD+Yiwk+NfbCcJfh8XY360AT6sOQD9JJWjO804FIHW/NGfTagzrvlPu7gdu7QEI3x93M2mpAKz7AWjdD9RWAFKPR1VmTUsAs98/rRnVCEDqcbnMrroCMPvj0JLV1UaBjV9gajaE3beCITa/KgCzfwOuqgAVQJyzCsDs34hfVYAKIE5JAKb9vnxle1oBKP/78CtLlgBx8k0Bm7+NKW0GqQDiIIA4qQDUfR3eWX9VANb/fSllyxIgDgKI8zoOcPwTIj0OUgHEQQBxEEAcBBAHAcQ5HpwAJHmdBKgA4iCAOAggDgKIgwDiIIA4CCAOAoiDAOIggDgIIA4CiIMA4iCAOAggDk8FC8JTwfAGAcRBAHEQQBwEECd9RQwnAQHy18RQAcRBAHG+BMi+PgUbUco2FYDkdeA1cfAfBBCnVPY5Dm7I2SvjqQDinArAaWAffmVZEoDk94UvhsAnfDVsc/hqGPyEL4duDF8OhUtqdvxUgYDUzP7Ho6ECcF8gDi1Z1QhA8nG5zK5pD0AV8E9rRrUCkHw8qjJrDZYNoWNqN34pt46BLAX+uJvJnV+9pz+VwAdZ+E2Z3qkATH+/NGfTEyb7AQfcWfdTum8Fsx9Yh8XY916B/cAietZ9kx8mIMFkrMLv/nECEkzCMnyTCyQgwWCswze7SAISDGJE+KYXSkACY0aFb36xBCQwYmT4Qy6YgASdjA5/2EUTPpJHhDoKN3iG5TTrNh7VoJIZs35qAwlIcMHs8Kc1ksCSUGBmyV/WUAYiPNYGv6zBBGkJPIS/rNEMKRG8BO+i8YytRfAW/AsXncj4Sj6qDCcPbLgac1edyQgrQoTgX7jsVMZp6l6EuHg0y/UYu+5cATcyRA49JUxHC1Ql3itGw4OXIccyZKdPmL0ebDF2W/yJC3rF2HqM/gCT3CbOYY2phQAAAABJRU5ErkJggg==";
	} else if (point_type == "cross") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAABG9JREFUeJztnUlyGzEMAJv5/5+dQ8KUl2g0QywEQPQtXkiMu12xJEoaHx8fH1wwxhhXn29i8s4r/HE77n6hzliNB3ecTn5pL9js5amrWwGsLNz4s+LodgCrGzQ+rLp5FIBkoyYmjwOAjiAaqz7GGGMpAMmmjS4S+QBDssjnhRp/pPLhbwCSxb4v2PigIR8+BSBZ9H8LN3ZoyYdvAUgWf7VBo4umfPhPAJJNrjZq5GjLhxcBSDZ7t2GzhoV8uAhAsumdjZv7WMmHNwFINr87QHONpXy4EYBkiCeDND+xlg83A5AMAx3BCh7y4UEA0BF44SUfHgYAHYE1nvJhIQDoCKzwlg+LAUBHoM0O+SAIADoCLXbJB2EA0BFI2SkfFAKAjmCV3fJBKQDoCJ4SQT4oBgAdwV2iyAflAKAjeEck+WAQAHQEr4gmH4wCgI7gOxHlg2EA0BFMosoH4wCgI4gsHxwCgHMjiC4fnAKA8yLIIB8cA4BzIsgiH5wDgPoRZJIPGwKAuhFkkw+bAoB6EWSUDxsDgDoRZJUPmwOA/BFklg8BAoC8EWSXD0ECgHwRVJAPgQKAPBFUkQ/BAoD4EVSSDwEDgLgRVJMPQQOAeBFUlA+BA4A4EVSVD8EDgP0RVJYPCQKAfRFUlw9JAgD/CE6QD4kCAL8ITpEPyQIA+whOkg8JAwC7CE6TD0kDAP0ITpQPiQMAvQhOlQ/JAwB5BCfLhwIBgP+bV1SRD0UCAL8IKsmHQgGAfQTV5EOxAMAugoryoWAAoB9BVflQNADQi6CyfCgcAMgjqC4fFt84MgsnCJRS+gek8d9A9YjKXpzmH4KVIyh5YRY3BatGUO6iLO8MqhhBqQvyuDu4WgRlLsbzAaFKEZS4EO9HA6FOBOkvQvp4/u7nHewm9QVoHeY4OYK0w2uf5Dk1gpSDWx3jOjGCdENbn+E7LYJUA3sd4DwpgjTDep/ePSWCFIPuOrp9QgThh9x9br96BKEH3C1fOofFLNqEHS6K/EnVCEIOFk3+pGIE4YaKKn9SLYJQA0WXP6kUQZhhssifVIkgxCDZ5E8qRLB9iKzyJ9kjSPkbFOEH95nMEWzbvIr8SdYIUv0BFVX+JGME7ptWlT/JFkGK289Z5E8yReC22SnyJ1kiCH33aVb5kwwRmG9yqvxJ9AhCPnpWRf4kcgRmi7f8r0SNINThiaryJxEjUF+05V8TLYIQZ+dOkT+JFIHaYi3/GVEi2Hp0+lT5kwgRiBdp+TJ2R7DlmTMt/ys7I1j+5pavy64IXJ842fKv2RHB429q+bZ4R+DyvPmW/wzPCG5/ccv3xSsC05dNafkyPCJ4+0Utfy/WEZi8albL18UygpefbPmxsIpA9UUTW74tFhH8+GDLj412BF8+0PJzoBnBv3+0/FxoRTAki7X8vWhEMFp+bqQRLAXQ8mMhieDxO4e2/HhInJR+69iTWI3gUQD92x+bFT+3A2j5OXjq6VYALT8XT3y9DaDl5+TReYBXNyNafn6ubiKOMcZv9DyMv2rLebEAAAAASUVORK5CYII=";
	} else if (point_type == "triangle") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAtdJREFUeJztm1mS2zAQxczc/87JTziVmXjRwqW7AZxA5cKDbYl6PMD8/svu69jJr90XIHtpuy9gFz+X31pDfhYWAA7S+lff+8QKWAA4OOM//eqnVcACwEHZfvQ/P6kCFgAOxvSzd/woFbAAcBCWX73fT6iABYBT3vC7T/uqV8ACwClt96hn/ZUrYAHglDV79EmfqhWwAHBKWj3rnF/FClgAOOWMnn3Kt1oFLACcUjavOuNfqQIWAE4Zk1e/4VOlAhYATgmLd73fV6ECFgBOeoN3v92bvQIWAE5qe3evv5O5AhYATlpzo6y/k7UCFgBOSmujrb+TsQIWAE46Y6Ouv5OtAhYATipbo6+/k6kCFgBOGlOzrL+TpQIWAE4KS7Otv5OhAhYATnhDs66/E70CFgBOaDuzr78TuQIWAE5YM6usvxO1AhYATkgrq62/E7ECFgBOOCOrrr8TrQIWAE4oG6uvvxOpAhYAThgTKevvRKmABYATwkLa+jsRKmAB4Gw3kLr+zu4KWAA4W+2jr7+zswIWAM4281z/d3ZVwALA2WKd63/OjgpYADjLjXP971ldAQsAZ6ltrv8YKytgAeAsM831n2NVBSwAnCWWuf5rrKiABYAz3TDXf4/ZFbAAcKba5frHMLMCFgDONLNc/1hmVcACwJlileufw4wKWAA4w41y/XMZXQELAGeoTa5/DSMrYAHgDDPJ9a9lVAUsAJwhFrn+PYyogAWAc9sg17+XuxWwAHBu2eP6Y3CnAhYAzmVzXH8srlbAAsC5ZI3rj8mVClgAOKeNcf2xOVsBCwDnlC2uPwdnKmAB4Bw2xfXn4mgFLACcQ5a4/pwcqYAFgPPRENefm08VsABw3trh+mvwrgIWAM5LM1x/LV5VwALAeWqF66/JswpYADj/GeH6a/OzAhYAzjcbXD+DfytgAeB8meD6WfQKWAA47fFw/VRaa80CwGmun40FgPMH+hkEw7ku6r8AAAAASUVORK5CYII=";
	} else if (point_type == "custom") {
		if (custom_point !== undefined) {
			image_src = custom_point;
		}
	}
	
	return image_src;
}

function make_points(plot, params, plot_locations, null_points, append) {
	if (append === undefined) {
		append = false;
	}
	
	var i, j, font_color, color_obj, group, start_i, this_size, this_loc, i_group;
	
	var scale_factor = get_scale_factor(plot);
	
	if (plot.geom_type == "point") {
		if (append) {
			// Since the points are merged into a single geometry,
			// we can't really "append" to existing points, but
			// instead have to re-create the whole geometry.
			
			plot.scene.remove(plot.points_merged);
			
			var positions_old = plot.points_merged.geometry.attributes.position.array;
			var sizes_old = plot.points_merged.geometry.attributes.dot_height.array;
			var hide_points_old = plot.points_merged.geometry.attributes.hide_point.array;
			var null_points_old = plot.points_merged.geometry.attributes.null_point.array;
			var colors_old = plot.points_merged.geometry.attributes.color.array;
			
			var point_locations = new Float32Array((plot.points.length + params.data.length) * 3);
			var point_colors = new Uint8Array((plot.points.length + params.data.length) * 4);
			var hide_points = new Float32Array(plot.points.length + params.data.length);
			var dot_heights = new Float32Array(plot.points.length + params.data.length);
			
			// null_points gets a separate suffix because an unsuffixed null_points
			// is an argument passed to this function.
			var null_points_new = new Float32Array(plot.points.length + params.data.length);
			
			for (i = 0; i < plot.points.length; i++) {
				point_colors[4*i + 0] = colors_old[4*i + 0];
				point_colors[4*i + 1] = colors_old[4*i + 1];
				point_colors[4*i + 2] = colors_old[4*i + 2];
				point_colors[4*i + 3] = colors_old[4*i + 3];
				
				hide_points[i] = hide_points_old[i];
				null_points_new[i] = null_points_old[i];
			}
		} else {
			var point_locations = new Float32Array(params.data.length * 3);
			var point_colors = new Uint8Array(params.data.length * 4);
			var hide_points = new Float32Array(params.data.length);
			var dot_heights = new Float32Array(params.data.length);
		}
		
		plot.points_merged_geom = new THREE.BufferGeometry();
	}
	
	if (!append) {
		plot.points = [];
		plot.labels = [];
		start_i = 0;
		
		if (plot.have_groups || plot.have_segments) {
			for (group in plot.groups) {
				if (plot.groups.hasOwnProperty(group)) {
					plot.groups[group].i_main = [];
				}
			}
		}
		
		if (plot.have_segments) {
			plot.segment_material = new THREE.ShaderMaterial({
				"vertexShader":   shader_lines_vertex,
				"fragmentShader": shader_lines_fragment
			});
			
			for (group in plot.groups) {
				if (plot.groups.hasOwnProperty(group)) {
					plot.groups[group].segment_geom = new THREE.BufferGeometry();
					
					plot.groups[group].positions = [];
					plot.groups[group].colors = [];
					plot.groups[group].null_points = [];
					plot.groups[group].hide_points = [];
				}
			}
		}
	} else {
		start_i = plot.points.length;
		
		var keep_axes = (params.hasOwnProperty("keep_axes")) ? params.keep_axes : false;
		
		if (!keep_axes) {
			// Need to update existing world-space coordinates.
			
			var axes = ["x", "y", "z"];
			
			for (i = 0; i < plot.points.length; i++) {
				if (plot.have_segments) {
					group = plot.points[i].group;
					i_group = plot.points[i].i_group;
				}
				
				for (j = 0; j < 3; j++) {
					this_loc = plot.scales[j](plot.points[i].input_data[axes[j]]);
					
					if (plot.geom_type == "point") {
						point_locations[3*i + j] = this_loc;
					} else if (plot.geom_type == "quad") {
						plot.points[i].position[axes[j]] = this_loc;
					}
					
					if (plot.have_segments) {
						plot.groups[group].positions[3*i_group + j] = this_loc;
					}
				}
				
				if (plot.have_any_sizes) {
					this_size = plot.points[i].input_data.size;
					
					if ((this_size !== null) && !isNaN(this_size) && (plot.size_exponent != 0)) {
						plot.points[i].input_data.sphere_size = plot.scales[3](plot.points[i].input_data.scaled_size);
						
						if (plot.geom_type == "point") {
							dot_heights[i] = plot.points[i].input_data.sphere_size;
						} else if (plot.geom_type == "quad") {
							plot.points[i].scale.x = 2 * scale_factor * plot.points[i].input_data.sphere_size;
							plot.points[i].scale.y = 2 * scale_factor * plot.points[i].input_data.sphere_size;
						}
					} else {
						if (plot.geom_type == "point") {
							dot_heights[i] = sizes_old[i];
						}
					}
				}
			}
		} else {
			if (plot.geom_type == "point") {
				for (i = 0; i < plot.points.length; i++) {
					point_locations[3*i + 0] = positions_old[3*i + 0];
					point_locations[3*i + 1] = positions_old[3*i + 1];
					point_locations[3*i + 2] = positions_old[3*i + 2];
					
					dot_heights[i] = sizes_old[i];
				}
			}
		}
	}
	
	var show_labels = (params.hasOwnProperty("show_labels")) ? params.show_labels : true;
	
	plot.label_font_size = (params.hasOwnProperty("label_font_size")) ? params.label_font_size : 16;
	var label_font_size = plot.label_font_size;
	
	var init_label_scale = 2 * label_font_size * scale_factor;
	plot.init_label_scale = init_label_scale;
	
	var bg_color_obj = hex_to_rgb_obj(plot.bg_color_hex);
	var sum_bg = bg_color_obj.r + bg_color_obj.g + bg_color_obj.b;
	var use_white = (sum_bg > 1.5) ? false : true;
	
	
	for (i = 0; i < params.data.length; i++) {
		color_obj = hex_to_rgb_obj_255(params.data[i].color);
		
		if (plot.have_groups) {
			group = params.data[i].group;
		} else {
			group = "default_group";
		}
		
		if (plot.geom_type == "point") {
			point_locations[3*(start_i + i) + 0] = isNaN(plot_locations[i][0]) ? 0 : plot_locations[i][0];
			point_locations[3*(start_i + i) + 1] = isNaN(plot_locations[i][1]) ? 0 : plot_locations[i][1];
			point_locations[3*(start_i + i) + 2] = isNaN(plot_locations[i][2]) ? 0 : plot_locations[i][2];
			
			dot_heights[start_i + i] = plot_locations[i][3];
			
			point_colors[4*(start_i + i) + 0] = color_obj.r;
			point_colors[4*(start_i + i) + 1] = color_obj.g;
			point_colors[4*(start_i + i) + 2] = color_obj.b;
			point_colors[4*(start_i + i) + 3] = 255; //alpha
			
			hide_points[start_i + i] = 0;
			
			if (append) {
				null_points_new[start_i + i] = null_points[i];
			}
			
			plot.points.push({});
		} else if (plot.geom_type == "quad") {
			
			plot.points.push(new THREE.Mesh(
				new THREE.PlaneBufferGeometry(1, 1, 1),
				plot.groups[group].quad_material
			));
			
			plot.points[start_i + i].point_colors = new Uint8Array(16);
			plot.points[start_i + i].hide_points = new Float32Array(4);
			plot.points[start_i + i].null_points = new Float32Array(4);
			
			// Need to copy the values across each of the four vertices
			// for the shader to work properly.
			for (j = 0; j < 4; j++) {
				plot.points[start_i + i].point_colors[4*j + 0] = color_obj.r;
				plot.points[start_i + i].point_colors[4*j + 1] = color_obj.g;
				plot.points[start_i + i].point_colors[4*j + 2] = color_obj.b;
				plot.points[start_i + i].point_colors[4*j + 3] = 255;
				
				plot.points[start_i + i].hide_points[j] = 0;
				plot.points[start_i + i].null_points[j] = null_points[i];
			}
			
			plot.points[start_i + i].position.x = plot_locations[i][0];
			plot.points[start_i + i].position.y = plot_locations[i][1];
			plot.points[start_i + i].position.z = plot_locations[i][2];
			
			plot.points[start_i + i].scale.x = 2 * scale_factor * plot_locations[i][3];
			plot.points[start_i + i].scale.y = 2 * scale_factor * plot_locations[i][3];
			
			plot.points[start_i + i].rotation.copy(get_current_camera(plot).rotation);
			
			plot.points[start_i + i].geometry.addAttribute("color", new THREE.BufferAttribute(plot.points[start_i + i].point_colors, 4, true));
			plot.points[start_i + i].geometry.addAttribute("hide_point", new THREE.BufferAttribute(plot.points[start_i + i].hide_points, 1));
			plot.points[start_i + i].geometry.addAttribute("null_point", new THREE.BufferAttribute(plot.points[start_i + i].null_points, 1));
			
			plot.scene.add(plot.points[start_i + i]);
		} else if (plot.geom_type == "none") {
			plot.points.push({});
		}
		
		
		if (plot.have_any_labels) {
			plot.points[start_i + i].have_label = false;
			
			if (params.data[i].label.length > 0) {
				plot.points[start_i + i].have_label = true;
				
				plot.labels.push(
					make_label_text_plane(
						params.data[i].label,
						plot.font,
						plot.label_font_size,
						use_white,
						plot.bg_color_hex,
						plot.font_ratio
				));
				
				plot.labels[start_i + i].material.uniforms.color.value = new THREE.Vector4(color_obj.r/255, color_obj.g/255, color_obj.b/255, 1.0);
				
				plot.labels[start_i + i].position.set(plot_locations[i][0], plot_locations[i][1], plot_locations[i][2]);
				plot.labels[start_i + i].scale.set(plot.init_label_scale, plot.init_label_scale, 1);
				
				plot.show_label = show_labels;
				if (show_labels && !null_points[i]) {
					plot.scene.add(plot.labels[start_i + i]);
				}
			} else {
				plot.labels.push(null);
			}
		} else {
			plot.labels.push(null);
		}
		
		
		if (plot.have_groups) {
			if (params.data[i].hasOwnProperty("group")) {
				if (plot.groups[params.data[i].group] === undefined) {
					console.warn("Group " + params.data[i].group + " not declared in params.groups");
					plot.points[start_i + i].group = "default_group";
				} else {
					plot.points[start_i + i].group = params.data[i].group;
				}
			} else {
				console.warn("Groups initialised, but missing group property.");
				plot.points[start_i + i].group = "default_group";
			}
		} else {
			plot.points[start_i + i].group = "default_group";
		}
		
		if (plot.have_groups || plot.have_segments) {
			plot.groups[group].i_main.push(i);
			i_group = plot.groups[group].i_main.length - 1;
			
			plot.points[start_i + i].i_group = i_group;
		}
		
		if (plot.have_segments) {
			plot.groups[group].null_points.push(null_points[i]);
			
			plot.groups[group].positions.push(plot_locations[i][0]);
			plot.groups[group].positions.push(plot_locations[i][1]);
			plot.groups[group].positions.push(plot_locations[i][2]);
			
			plot.groups[group].colors.push(color_obj.r/255);
			plot.groups[group].colors.push(color_obj.g/255);
			plot.groups[group].colors.push(color_obj.b/255);
			plot.groups[group].colors.push(1);
			
			plot.groups[group].hide_points.push(0);
		}
		
		// Some more properties added to the object for use in mouseovers etc.
		plot.points[start_i + i].input_data = {};
		plot.points[start_i + i].input_data.other = JSON.parse(JSON.stringify(params.data[i].other));
	}
	
	update_points_input_data(plot, params, plot_locations, start_i);
	
	if (plot.geom_type == "point") {
		plot.points_merged_geom.addAttribute("position", new THREE.BufferAttribute(point_locations, 3));
		plot.points_merged_geom.addAttribute("color", new THREE.BufferAttribute(point_colors, 4, true));
		plot.points_merged_geom.addAttribute("dot_height", new THREE.BufferAttribute(dot_heights, 1));
		plot.points_merged_geom.addAttribute("hide_point", new THREE.BufferAttribute(hide_points, 1));
		
		if (append) {
			plot.points_merged_geom.addAttribute("null_point", new THREE.BufferAttribute(null_points_new, 1));
		} else {
			plot.points_merged_geom.addAttribute("null_point", new THREE.BufferAttribute(null_points, 1));
		}
		
		plot.points_merged = new THREE.Points(plot.points_merged_geom, plot.point_material);
		plot.scene.add(plot.points_merged);
	}
	
	if (plot.have_segments) {
		var temp_positions, temp_colors, temp_hides, temp_nulls;
		
		for (group in plot.groups) {
			if (plot.groups.hasOwnProperty(group)) {
				temp_positions = new Float32Array(plot.groups[group].positions);
				temp_colors = new Float32Array(plot.groups[group].colors);
				temp_hides = new Float32Array(plot.groups[group].hide_points);
				temp_nulls = new Float32Array(plot.groups[group].null_points);
				
				plot.groups[group].segment_geom.addAttribute("position", new THREE.BufferAttribute(temp_positions, 3));
				plot.groups[group].segment_geom.addAttribute("color", new THREE.BufferAttribute(temp_colors, 4));
				plot.groups[group].segment_geom.addAttribute("hide_point", new THREE.BufferAttribute(temp_hides, 1));
				plot.groups[group].segment_geom.addAttribute("null_point", new THREE.BufferAttribute(temp_nulls, 1));
				
				plot.groups[group].segment_lines = new THREE.Line(plot.groups[group].segment_geom, plot.segment_material);
				plot.groups[group].segment_lines.frustumCulled = false;
				plot.scene.add(plot.groups[group].segment_lines);
			}
		}
	}
	
	if (plot.have_any_labels) {
		update_labels(plot);
	}
}

function hide_label(plot, i) {
	if (plot.points[i].have_label) {
		plot.scene.remove(plot.labels[i]);
	}
}

function hide_group_labels(plot, group) {
	if (!plot.groups.hasOwnProperty(group)) { return; }
	
	for (var i = 0; i < plot.groups[group].i_main.length; i++) {
		hide_label(plot, plot.groups[group].i_main[i]);
	}
}

function show_label(plot, i) {
	if (plot.points[i].have_label) {
		plot.scene.add(plot.labels[i]);
	}
}

function show_group_labels(plot, group) {
	if (!(group in plot.groups)) { return; }
	
	for (var i = 0; i < plot.groups[group].i_main.length; i++) {
		show_label(plot, plot.groups[group].i_main[i]);
	}
}

// function set_size(plot, i, size, scale_factor) {
// 	if (!plot.set_size_warning) {
// 		console.warn("set_size() is deprecated; use set_point_size() instead.");
// 		plot.set_size_warning = true;
// 	}
// 	set_point_size(plot, i, size, scale_factor);
// }

function set_point_size(plot, i, size, scale_factor) {
	if (plot.geom_type == "point") {
		var dot_heights = plot.points_merged.geometry.attributes.dot_height.array;
		plot.points_merged.geometry.attributes.dot_height.needsUpdate = true;
		
		dot_heights[i] = size;		
	} else if (plot.geom_type == "quad") {
		if (scale_factor === undefined) {
			var scale_factor = 2 * get_scale_factor(plot);
		}
		
		plot.points[i].scale.x = scale_factor * size;
		plot.points[i].scale.y = scale_factor * size;
	}
}

function hide_point(plot, i, hide_segments) {
	if (hide_segments === undefined) { hide_segments = plot.have_segments; }
	
	if (plot.geom_type == "point") {
		var hide_points = plot.points_merged.geometry.attributes.hide_point.array;
		plot.points_merged.geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[i] = 1.0;
	} else if (plot.geom_type == "quad") {
		var hide_points = plot.points[i].geometry.attributes.hide_point.array;
		plot.points[i].geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[0] = 1.0;
		hide_points[1] = 1.0;
		hide_points[2] = 1.0;
		hide_points[3] = 1.0;
	}
	
	if (plot.have_segments && hide_segments) {
		hide_point_segments(plot, i);
	}
}

function hide_point_segments (plot, i) {
	if (!plot.have_segments) { return; }
	
	var group   = plot.points[i].group;
	var i_group = plot.points[i].i_group;
	
	var hides = plot.groups[group].segment_lines.geometry.attributes.hide_point.array;
	plot.groups[group].segment_lines.geometry.attributes.hide_point.needsUpdate = true;
	
	hides[i_group] = 1;
}

function hide_group(plot, group, hide_segments) {
	if (hide_segments === undefined) { hide_segments = plot.have_segments; }
	
	if (!(group in plot.groups)) { return; }
	
	for (var i = 0; i < plot.groups[group].i_main.length; i++) {
		hide_point(plot, plot.groups[group].i_main[i], hide_segments);
	}
}

function show_point(plot, i, show_segments) {
	if (show_segments === undefined) { show_segments = plot.have_segments; }
	
	if (plot.geom_type == "point") {
		var hide_points = plot.points_merged.geometry.attributes.hide_point.array;
		plot.points_merged.geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[i] = 0.0;
	} else if (plot.geom_type == "quad") {
		var hide_points = plot.points[i].geometry.attributes.hide_point.array;
		plot.points[i].geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[0] = 0.0;
		hide_points[1] = 0.0;
		hide_points[2] = 0.0;
		hide_points[3] = 0.0;
	}
	
	if (plot.have_segments && show_segments) {
		show_point_segments(plot, i);
	}
}

function show_point_segments(plot, i) {
	if (!plot.have_segments) { return; }
	
	var group   = plot.points[i].group;
	var i_group = plot.points[i].i_group;
	
	var hides = plot.groups[group].segment_lines.geometry.attributes.hide_point.array;
	plot.groups[group].segment_lines.geometry.attributes.hide_point.needsUpdate = true;
	
	hides[i_group] = 0;
}

function show_group (plot, group, show_segments) {
	if (show_segments === undefined) { show_segments = plot.have_segments; }
	
	if (!plot.groups.hasOwnProperty(group)) { return; }
	
	for (var i = 0; i < plot.groups[group].i_main.length; i++) {
		show_point(plot, plot.groups[group].i_main[i], show_segments);
	}
}


function set_point_position(plot, i, position, set_segments, world_space) {
	if (world_space  === undefined) { world_space  = false; }
	if (set_segments === undefined) { set_segments = true;  }
	
	var loc = get_location(plot, position, world_space);
	var this_xyz = loc.coords;
	var is_null = loc.is_null;
	
	var axes = ["x", "y", "z"];
	var j;
	
	if (plot.geom_type == "point") {
		var positions = plot.points_merged.geometry.attributes.position.array;
		var nulls = plot.points_merged.geometry.attributes.null_point.array;
		plot.points_merged.geometry.attributes.position.needsUpdate = true;
		plot.points_merged.geometry.attributes.null_point.needsUpdate = true;
		
		for (j = 0; j < 3; j++) {
			positions[3*i + j] = this_xyz[j];
		}
		
		nulls[i] = is_null;
	} else if (plot.geom_type == "quad") {
		for (j = 0; j < 3; j++) {
			plot.points[i].position[axes[j]] = this_xyz[j];
		}
		
		var null_points = plot.points[i].geometry.attributes.null_point.array;
		plot.points[i].geometry.attributes.null_point.needsUpdate = true;
		
		null_points[0] = is_null;
		null_points[1] = is_null;
		null_points[2] = is_null;
		null_points[3] = is_null;
	}
	
	if (!world_space) {
		for (j = 0; j < 3; j++) {
			plot.points[i].input_data[axes[j]] = position[j];
		}
	}
	
	if ((plot.have_segments && set_segments) || (plot.geom_type == "none")) {
		set_point_segments_position(plot, i, this_xyz, true, is_null);
	}
	
	update_labels(plot, i, i);
}

function set_point_segments_position(plot, i, position, world_space, is_null) {
	// Careful!  This function does not edit the points[i].input_data
	// fields, so it might lead to irregular behaviour if combined
	// with change_data().
	
	if (world_space === undefined) { world_space = false; }
	if (is_null === undefined) { is_null = false; }
	
	var loc = get_location(plot, position, world_space);
	var this_xyz = loc.coords;
	is_null = is_null || loc.is_null;
	
	var j;
	
	var group   = plot.points[i].group;
	var i_group = plot.points[i].i_group;
	
	var group_positions = plot.groups[group].segment_lines.geometry.attributes.position.array;
	var group_nulls     = plot.groups[group].segment_lines.geometry.attributes.null_point.array;
	
	plot.groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
	plot.groups[group].segment_lines.geometry.attributes.null_point.needsUpdate = true;
	
	for (j = 0; j < 3; j++) {
		group_positions[3*i_group + j] = this_xyz[j];
	}
	
	group_nulls[i_group] = is_null;
}

function get_location(plot, position, world_space) {
	if (world_space === undefined) { world_space = false; }
	
	var axes = ["x", "y", "z"];
	var this_xyz = [0, 0, 0];
	var is_null = 0;
	var j;
	
	for (j = 0; j < 3; j++) {	
		if (!world_space) {
			this_xyz[j] = plot.scales[j](position[j]);
		} else {
			this_xyz[j] = position[j];
		}
		
		if (isNaN(this_xyz[j]) || (position[j] === null)) {
			is_null = 1;
			this_xyz[j] = 0;
		}
	}
	
	return {"coords": this_xyz, "is_null": is_null};
}

function check_loaded_textures (plots,i_plot, params) {
	plots[i_plot].texture_count++;
	
	if (plots[i_plot].texture_count == plots[i_plot].texture_sources.length) {
		// All textures loaded.
		
		if (plots[i_plot].geom_type == "quad") {
			// Point each group's texture at the
			// relevant entry in the textures array.
			
			for (var group in plots[i_plot].groups) {
				if (group in plots[i_plot].groups) {
					plots[i_plot].groups[group].texture = plots[i_plot].textures[plots[i_plot].groups[group].src_i];
					plots[i_plot].groups[group].texture.flipY = true;
				}
			}
		} else if (plots[i_plot].geom_type == "point") {
			// Restricted to only one texture with points.
			plots[i_plot].texture = plots[i_plot].textures[0];
			plots[i_plot].texture.flipY = true;
		}
		
		make_scatter_main(params, i_plot);
	}
}

 export {make_scatter,
    update_points_input_data,
    point_type_src,
    make_points,
    hide_label,
    hide_group_labels,
    show_label,
    show_group_labels,
    set_point_size,
    hide_point,
    hide_point_segments,
    hide_group,
    show_point,
    show_point_segments,
    show_group,
    set_point_position,
    set_point_segments_position}