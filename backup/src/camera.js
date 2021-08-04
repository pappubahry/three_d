import { update_gridlines, update_labels,update_axes} from './display.js'
import {set_point_size} from './scatter.js'
import {update_render,rad2deg} from './three_d.js'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
function get_current_camera(plot) {
  if (plot.view_type == "perspective") {
    return plot.persp_camera;
  } else {
    return plot.ortho_camera;
  }
}

function update_fov_from_ortho(plot) {
  var theta =
    Math.atan2(
      plot.ortho_camera.top,
      plot.camera_distance_scale
    ) *
    rad2deg *
    2;
  if (theta > plot.max_fov) {
    theta = plot.max_fov;
  }
  if (theta < plot.min_fov) {
    theta = plot.min_fov;
  }

  plot.persp_camera.fov = theta;
}



function switch_camera_type(plot) {
  var aspect = plot.width / plot.height;
  var left, top, theta;

  if (plot.view_type == "perspective") {
    theta = plot.persp_camera.fov / 2;
    top = plot.camera_distance_scale * Math.tan(theta / rad2deg);
    left = top * aspect;

    plot.ortho_camera.left = -left;
    plot.ortho_camera.right = left;
    plot.ortho_camera.top = top;
    plot.ortho_camera.bottom = -top;

    plot.ortho_camera.position.copy(
      plot.persp_camera.position
    );
    plot.ortho_camera.rotation.copy(
      plot.persp_camera.rotation
    );

    plot.view_type = "orthographic";

    if (plot.geom_type == "point") {
      plot.point_material.uniforms.is_perspective.value = 0.0;
    }
  } else {
    update_fov_from_ortho(plot);

    plot.persp_camera.position.copy(
      plot.ortho_camera.position
    );
    plot.persp_camera.rotation.copy(
      plot.ortho_camera.rotation
    );

    plot.view_type = "perspective";

    if (plot.geom_type == "point") {
      plot.point_material.uniforms.is_perspective.value = 1.0;
    }
  }

  get_current_camera(plot).updateProjectionMatrix();
  if (plot.show_grid) {
    update_gridlines(plot);
  }
  plot.renderer.render(
    plot.scene,
    get_current_camera(plot)
  );
}


function reset_camera_wrapper(plot, first_init, angles, origin) {
	return function () {
		reset_camera(plot, first_init, angles, origin);
	}
}

function reset_camera(plot, first_init, angles, origin) {
	var i;
	var lon = angles[0];
	var lat = angles[1];
	var psi = angles[2];
	
	var origin_vec = new THREE.Vector3(origin[0], origin[1], origin[2]);
	
	var change_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(-lat, lon, psi, "YXZ"))
		.premultiply(plot.aux_camera_quat);
	
	plot.persp_camera.rotation.setFromQuaternion(change_quat);
	
	plot.camera_up = new THREE.Vector3(0, 1, 0)
		.applyQuaternion(change_quat);
	
	plot.persp_camera.position
		.set(0, 0, 1)
		.applyQuaternion(change_quat)
		.multiplyScalar(plot.camera_r)
		.add(origin_vec);
	
	plot.ortho_camera.position.copy(plot.persp_camera.position);
	plot.ortho_camera.rotation.copy(plot.persp_camera.rotation);
	
	plot.camera_origin = new THREE.Vector3().copy(origin_vec);
	
	if (plot.view_type == "perspective") {
		plot.persp_camera.fov = plot.init_fov;
	} else {
		// Orthographic.
		plot.ortho_camera.top    =  plot.init_ortho_top;
		plot.ortho_camera.bottom = -plot.init_ortho_top;
		plot.ortho_camera.left   = -plot.init_ortho_right;
		plot.ortho_camera.right  =  plot.init_ortho_right;
	}
	
	if (!first_init) {
		for (i = 0; i < plot.axis_text_planes.length; i++) {
			plot.axis_text_planes[i].rotation.copy(get_current_camera(plot).rotation);
			plot.axis_text_planes[i].scale.x = plot.init_axis_title_scale;
			plot.axis_text_planes[i].scale.y = plot.init_axis_title_scale;
		}
		
		for (i = 0; i < plot.tick_text_planes.length; i++) {
			plot.tick_text_planes[i].rotation.copy(get_current_camera(plot).rotation);
			plot.tick_text_planes[i].scale.x = plot.init_tick_scale;
			plot.tick_text_planes[i].scale.y = plot.init_tick_scale;
		}
		
		if (plot.have_any_labels) {
			update_labels(plot);
			
			for (i = 0; i < plot.points.length; i++) {
				if (plot.labels[i] !== null) {
					plot.labels[i].scale.x = plot.init_label_scale;
					plot.labels[i].scale.y = plot.init_label_scale;
				}
			}
		}
		
		if (plot.geom_type == "quad") {
			for (i = 0; i < plot.points.length; i++) {
				plot.points[i].rotation.copy(get_current_camera(plot).rotation);
				set_point_size(plot, i, plot.points[i].input_data.sphere_size);
			}
		}
		
		if (plot.show_grid) {
			update_gridlines(plot);
		}
		
		if (plot.dynamic_axis_labels) {
			update_axes(plot);
		}
		
		get_current_camera(plot).updateProjectionMatrix();
		update_render(plot);
	} else {
		get_current_camera(plot).updateProjectionMatrix();
	}
}

export { get_current_camera ,update_fov_from_ortho,reset_camera_wrapper,reset_camera, switch_camera_type};
