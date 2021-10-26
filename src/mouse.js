import {get_current_camera, update_fov_from_ortho} from './camera.js';

import {update_labels,update_gridlines,update_axes,get_scale_factor} from './display.js';
import {tau,rad2deg,update_render} from './main.js'
import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

function set_touch_coords(event, plot) {
  var num_touches = event.touches.length;

  if (num_touches == 1) {
    plot.touch_start_x = [event.touches[0].clientX];
    plot.touch_start_y = [event.touches[0].clientY];
  } else if (num_touches == 2) {
    plot.touch_start_x = [
      event.touches[0].clientX,
      event.touches[1].clientX,
    ];
    plot.touch_start_y = [
      event.touches[0].clientY,
      event.touches[1].clientY,
    ];
  } else {
    plot.touch_start_x = [];
    plot.touch_start_y = [];
  }
  return;
}

function touch_start_fn(plot) {
  return function (event) {
    event.preventDefault();
    set_touch_coords(event, plot);
    if (event.touches.length == 1) {
      set_normed_mouse_coords(
        {
          clientX: event.touches[0].clientX,
          clientY: event.touches[0].clientY,
        },
        plot
      );
      plot.old_t = Date.now();

      if (plot.have_click) {
        if (plot.plot_type == "scatter") {
          plot.clicked_i = get_raycast_i(plot);
        } else if (plot.plot_type == "surface") {
          plot.clicked_i = get_raycast_i(plot).slice(0);
        }
      }
    } else {
      plot.two_finger_operation = "none";
      if (plot.plot_type == "scatter") {
        plot.clicked_i = -1;
      } else if (plot.plot_type == "surface") {
        plot.clicked_i = [-1, -1];
      }
    }
  };
}

function touch_move_fn(plot) {
  return function (event) {
    event.preventDefault();

    var num_touches = event.touches.length;
    if (num_touches != plot.touch_start_x.length) {
      // Something's gone wrong if we're here.
      set_touch_coords(event, plot);
      return;
    }

    if (num_touches == 1) {
      // Rotate like with the mouse.
      plot.mouse_operation = "rotate";
      plot.click_start_x = plot.touch_start_x[0];
      plot.click_start_y = plot.touch_start_y[0];

      set_touch_coords(event, plot);

      plot.new_t = Date.now();

      if (plot.new_t - plot.old_t > 100) {
        // Don't rotate if it's a tap, which I define as lasting
        // 0.1 seconds or less.
        mouse_move_fn(
          {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
          },
          plot
        );
      }
    } else if (num_touches == 2) {
      // Need to test whether it's a pinch or two-finger scroll.
      var x11 = plot.touch_start_x[0];
      var x12 = event.touches[0].clientX;
      var y11 = plot.touch_start_y[0];
      var y12 = event.touches[0].clientY;

      var x21 = plot.touch_start_x[1];
      var x22 = event.touches[1].clientX;
      var y21 = plot.touch_start_y[1];
      var y22 = event.touches[1].clientY;

      var dx1 = x12 - x11;
      var dx2 = x22 - x21;
      var dy1 = y12 - y11;
      var dy2 = y22 - y21;

      var pinch = false;

      if (
        Math.abs(dx1) + Math.abs(dy1) == 0 ||
        Math.abs(dx2) + Math.abs(dy2) == 0
      ) {
        // One finger not moving; treat as pinch.
        pinch = true;
      } else {
        var r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        var r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        var theta = Math.acos((dx1 * dx2 + dy1 * dy2) / (r1 * r2));

        if (theta > tau / 4) {
          pinch = true;
        }
      }

      var do_action = true;

      if (pinch) {
        if (plot.two_finger_operation == "pan") {
          plot.new_t = Date.now();

          if (plot.new_t - plot.old_t < 100) {
            do_action = false;
          }
        }

        if (do_action) {
          var dist_1 = (x11 - x21) * (x11 - x21) + (y11 - y21) * (y11 - y21);
          var dist_2 = (x12 - x22) * (x12 - x22) + (y12 - y22) * (y12 - y22);

          var event_to_pass = {};
          event_to_pass.deltaY = dist_2 > dist_1 ? -1 : 1;

          event_to_pass.clientX = 0.5 * (x21 + x22);
          event_to_pass.clientY = 0.5 * (y21 + y22);
          event_to_pass.zoom_factor = 1.035;

          plot.two_finger_operation = "zoom";
          plot.old_t = Date.now();

          mouse_zoom(event_to_pass, plot);
        }
      } else {
        // Pan.
        if (plot.two_finger_operation == "zoom") {
          plot.new_t = Date.now();

          if (plot.new_t - plot.old_t < 100) {
            do_action = false;
          }
        }

        if (do_action) {
          plot.mouse_operation = "pan";
          plot.click_start_x = 0.5 * (x11 + x21);
          plot.click_start_y = 0.5 * (y11 + y21);

          plot.two_finger_operation = "pan";
          plot.old_t = Date.now();

          mouse_move_fn(
            {
              clientX: 0.5 * (x12 + x22),
              clientY: 0.5 * (y12 + y22),
            },
            plot
          );
        }
      }

      set_touch_coords(event, plot);
    }
  };
}

function touch_end_fn(plot) {
  return function (event) {
    event.preventDefault();
    set_touch_coords(event, plot);

    var possible_click;
    if (plot.plot_type == "scatter") {
      possible_click = plot.clicked_i >= 0;
    } else if (plot.plot_type == "surface") {
      possible_click = plot.clicked_i[0] >= 0;
    }

    if (event.touches.length == 0 && possible_click) {
      set_normed_mouse_coords(
        {
          clientX: event.changedTouches[0].clientX,
          clientY: event.changedTouches[0].clientY,
        },
        plot
      );

      var this_clicked_i;

      if (plot.plot_type == "scatter") {
        this_clicked_i = get_raycast_i(plot);
      } else if (plot.plot_type == "surface") {
        this_clicked_i = get_raycast_i(plot).slice(0);
      }

      if (plot.plot_type == "scatter") {
        if (this_clicked_i == plot.clicked_i) {
          plot.click(
            plot,
            plot.clicked_i,
            plot.points[this_clicked_i]
          );

          update_render(plot);
        }
      } else if (plot.plot_type == "surface") {
        if (
          this_clicked_i[0] == plot.clicked_i[0] &&
          this_clicked_i[1] == plot.clicked_i[1]
        ) {
          plot.click(
            plot,
            plot.clicked_i[0],
            plot.clicked_i[1],
            plot.mesh_points[plot.clicked_i[0]][
              plot.clicked_i[1]
            ]
          );

          update_render(plot);
        }
      }
    }
  };
}

function mouse_down_fn(e,plot) {
  plot.click_start_x = e.clientX;
  plot.click_start_y = e.clientY;

  var click_type = e.button;
  var ctrl = e.ctrlKey //|| ectrlKey;
  var shiftkey = e.shiftKey;
  if (click_type == 0) {
    // Left mouse button.
    if (ctrl) {
      plot.mouse_operation = "pan";
    } else if (shiftkey) {
      plot.mouse_operation = "zoom";
    } else {
      plot.mouse_operation = "rotate";
      set_normed_mouse_coords(e, plot);
      if (plot.have_click) {
        if (plot.plot_type == "scatter") {
          plot.clicked_i = get_raycast_i(plot);
        } else if (plot.plot_type == "surface") {
          plot.clicked_i = get_raycast_i(plot).slice(0);
        }
      }
    }
  }

  if (click_type == 1) {
    // Middle mouse button.
    plot.mouse_operation = "pan";
  }

  //event.preventDefault();
};

function mouse_up_fn(event,plot, from_mouseout) {
    plot.mouse_operation = "none";
    var need_update = false;

    if (plot.have_click || plot.have_mouseout) {
      need_update = true;
      set_normed_mouse_coords(event, plot);

      var this_clicked_i;

      if (plot.plot_type == "scatter") {
        if (from_mouseout) {
          this_clicked_i = -1;
        } else {
          this_clicked_i = get_raycast_i(plot);
        }
      } else if (plot.plot_type == "surface") {
        if (from_mouseout) {
          this_clicked_i = [-1, -1];
        } else {
          this_clicked_i = get_raycast_i(plot).slice(0);
        }
      }
    }

    if (plot.have_click) {
      if (plot.plot_type == "scatter") {
        if (this_clicked_i == plot.clicked_i && this_clicked_i >= 0) {
          plot.click(
            plot,
            plot.clicked_i,
            plot.points[this_clicked_i]
          );
        }

        plot.clicked_i = -1;
      } else if (plot.plot_type == "surface") {
        if (
          this_clicked_i[0] >= 0 &&
          this_clicked_i[0] == plot.clicked_i[0] &&
          this_clicked_i[1] == plot.clicked_i[1]
        ) {
          plot.click(
            plot,
            plot.clicked_i[0],
            plot.clicked_i[1],
            plot.mesh_points[this_clicked_i[0]][this_clicked_i[1]]
          );
        }

        plot.clicked_i = [-1, -1];
      }
    }

    if (plot.have_mouseout || plot.have_mouseover) {
      if (plot.plot_type == "scatter") {
        if (this_clicked_i != plot.mouseover_i) {
          if (plot.have_mouseout) {
            mouse_out_wrapper(plot, this_clicked_i, false);
            //mouse_out_fn(event, plot, this_clicked_i, false);
          }

          plot.mouseover_i = this_clicked_i;

          if (this_clicked_i >= 0 && plot.have_mouseover) {
            plot.mouseover(
              plot,
              plot.mouseover_i,
              plot.points[this_clicked_i]
            );
          }
        }
      } else if (plot.plot_type == "surface") {
        if (
          this_clicked_i[0] != plot.mouseover_i[0] ||
          this_clicked_i[1] != plot.mouseover_i[1]
        ) {
          if (plot.have_mouseout) {
            mouse_out_wrapper(plot, this_clicked_i, false);
            //mouse_out_fn(event, plot, this_clicked_i, false);
          }
          plot.mouseover_i = this_clicked_i.slice(0);

          if (this_clicked_i[0] >= 0 && plot.have_mouseover) {
            plot.mouseover(
              plot,
              plot.mouseover_i[0],
              plot.mouseover_i[1],
              plot.intersected_surf.mesh_points[plot.mouseover_i[0]][
                plot.mouseover_i[1]
              ]
            );
          }
        }
      }
    }

    if (need_update) {
      update_render(plot);
    }

    //event.preventDefault();
  }


// function mouse_up_fn(event,plot, from_mouseout) {
//   return function (event) {
//     plot.mouse_operation = "none";
//     var need_update = false;

//     if (plot.have_click || plot.have_mouseout) {
//       need_update = true;
//       set_normed_mouse_coords(event, plot);

//       var this_clicked_i;

//       if (plot.plot_type == "scatter") {
//         if (from_mouseout) {
//           this_clicked_i = -1;
//         } else {
//           this_clicked_i = get_raycast_i(plot);
//         }
//       } else if (plot.plot_type == "surface") {
//         if (from_mouseout) {
//           this_clicked_i = [-1, -1];
//         } else {
//           this_clicked_i = get_raycast_i(plot).slice(0);
//         }
//       }
//     }

//     if (plot.have_click) {
//       if (plot.plot_type == "scatter") {
//         if (this_clicked_i == plot.clicked_i && this_clicked_i >= 0) {
//           plot.click(
//             plot,
//             plot.clicked_i,
//             plot.points[this_clicked_i]
//           );
//         }

//         plot.clicked_i = -1;
//       } else if (plot.plot_type == "surface") {
//         if (
//           this_clicked_i[0] >= 0 &&
//           this_clicked_i[0] == plot.clicked_i[0] &&
//           this_clicked_i[1] == plot.clicked_i[1]
//         ) {
//           plot.click(
//             plot,
//             plot.clicked_i[0],
//             plot.clicked_i[1],
//             plot.mesh_points[this_clicked_i[0]][this_clicked_i[1]]
//           );
//         }

//         plot.clicked_i = [-1, -1];
//       }
//     }

//     if (plot.have_mouseout || plot.have_mouseover) {
//       if (plot.plot_type == "scatter") {
//         if (this_clicked_i != plot.mouseover_i) {
//           if (plot.have_mouseout) {
//             mouse_out_fn(event, plot, this_clicked_i, false);
//           }

//           plot.mouseover_i = this_clicked_i;

//           if (this_clicked_i >= 0 && plot.have_mouseover) {
//             plot.mouseover(
//               plot,
//               plot.mouseover_i,
//               plot.points[this_clicked_i]
//             );
//           }
//         }
//       } else if (plot.plot_type == "surface") {
//         if (
//           this_clicked_i[0] != plot.mouseover_i[0] ||
//           this_clicked_i[1] != plot.mouseover_i[1]
//         ) {
//           if (plot.have_mouseout) {
//             mouse_out_fn(event, plot, this_clicked_i, false);
//           }

//           plot.mouseover_i = this_clicked_i.slice(0);

//           if (this_clicked_i[0] >= 0 && plot.have_mouseover) {
//             plot.mouseover(
//               plot,
//               plot.mouseover_i[0],
//               plot.mouseover_i[1],
//               plot.mesh_points[plot.mouseover_i[0]][
//                 plot.mouseover_i[1]
//               ]
//             );
//           }
//         }
//       }
//     }

//     if (need_update) {
//       update_render(plot);
//     }

//     event.preventDefault();
//   };
// }

function pan_towards(plot, new_posn) {
  var test_dist = new_posn.lengthSq();
  if (test_dist > plot.max_pan_dist_sq) {
    new_posn.multiplyScalar(
      Math.sqrt(plot.max_pan_dist_sq / test_dist)
    );
  }

  var dr = new THREE.Vector3().subVectors(
    new_posn,
    plot.camera_origin
  );

  plot.camera_origin.add(dr);

  get_current_camera(plot).position.add(dr);
}

function mouse_zoom_wrapper(event,plot) {
  mouse_zoom(event, plot)
}

function mouse_zoom(event, plot) {
  var scroll_amount = Math.sign(event.deltaY);
  var zoom_factor = 1.25;

  var i;

  if (event.hasOwnProperty("zoom_factor")) {
    // Function called via shift+mousemove.
    zoom_factor = event.zoom_factor;
  }

  if (scroll_amount != 0) {
    // Want to zoom-to-point, where the point is assumed
    // to be on the plane x=0 if the camera is at (r, 0, 0)
    // looking towards the origin.
    //
    // _1 variables are for the current zoom; _2 for the new zoom.

    var scale_ratio;

    var bounding_rect =
      event.bounding_rect //plot.renderer.domElement.getBoundingClientRect();

    if (plot.view_type == "perspective") {
      var px2rad =
        plot.persp_camera.fov / (plot.height * rad2deg);
      var old_px2rad = px2rad;

      var theta_1 =
        (event.clientY - bounding_rect.top - plot.mid_y) * px2rad;
      var phi_1 =
        (event.clientX - bounding_rect.left - plot.mid_x) * px2rad;

      if (phi_1 > tau / 4) {
        phi_1 = (0.99 * tau) / 4;
      }
      if (phi_1 < -tau / 4) {
        phi_1 = (0.99 * tau) / 4;
      }

      var point_x_1 = plot.camera_distance_scale * Math.tan(phi_1);
      var point_y_1 =
        (plot.camera_distance_scale * Math.tan(theta_1)) /
        Math.cos(phi_1);
      if (scroll_amount < 0) {
        if (plot.persp_camera.fov > plot.min_fov) {
          plot.persp_camera.fov /= zoom_factor;

          if (plot.persp_camera.fov < plot.min_fov) {
            plot.persp_camera.fov = plot.min_fov;
          }
        }
      } else {
        if (plot.persp_camera.fov < plot.max_fov) {
          plot.persp_camera.fov *= zoom_factor;

          if (plot.persp_camera.fov > plot.max_fov) {

            plot.persp_camera.fov = plot.max_fov;
          }
        }
      }
      px2rad =
        plot.persp_camera.fov / (plot.height * rad2deg);
      scale_ratio = px2rad / old_px2rad;

      var theta_2 =
        (event.clientY - bounding_rect.top - plot.mid_y) * px2rad;
      var phi_2 =
        (event.clientX - bounding_rect.left - plot.mid_x) * px2rad;

      if (phi_2 > tau / 4) {
        phi_2 = (0.99 * tau) / 4;
      }
      if (phi_2 < -tau / 4) {
        phi_2 = (0.99 * tau) / 4;
      }

      var point_x_2 = plot.camera_distance_scale * Math.tan(phi_2);
      var point_y_2 =
        (plot.camera_distance_scale * Math.tan(theta_2)) /
        Math.cos(phi_2);

      var pan_x = -point_x_2 + point_x_1;
      var pan_y = point_y_2 - point_y_1;
    } else {
      // Orthographic.
      // Playing fast and loose with "width" and "height" notation here.
      var height = 2 * plot.ortho_camera.top;
      var width = 2 * plot.ortho_camera.right;

      var base_y = event.clientY - bounding_rect.top - plot.mid_y;
      var base_x = event.clientX - bounding_rect.left - plot.mid_x;

      var y1 = (base_y * height) / plot.height;
      var x1 = (base_x * width) / plot.width;

      scale_ratio = zoom_factor;
      var theta, temp_top;

      if (scroll_amount < 0) {
        temp_top = plot.ortho_camera.top / zoom_factor;
        theta =
          Math.atan2(temp_top, plot.camera_distance_scale) *
          rad2deg *
          2;
        if (theta < plot.min_fov) {
          temp_top =
            plot.camera_distance_scale *
            Math.tan(plot.min_fov / (2 * rad2deg));
        }

        scale_ratio = temp_top / plot.ortho_camera.top;

        plot.ortho_camera.top *= scale_ratio;
        plot.ortho_camera.bottom *= scale_ratio;
        plot.ortho_camera.left *= scale_ratio;
        plot.ortho_camera.right *= scale_ratio;
      } else {
        temp_top = plot.ortho_camera.top * zoom_factor;

        theta =
          Math.atan2(temp_top, plot.camera_distance_scale) *
          rad2deg *
          2;
        if (theta > plot.max_fov) {

          temp_top =
            plot.camera_distance_scale *
            Math.tan(plot.max_fov / (2 * rad2deg));
        }

        scale_ratio = temp_top / plot.ortho_camera.top;

        plot.ortho_camera.top *= scale_ratio;
        plot.ortho_camera.bottom *= scale_ratio;
        plot.ortho_camera.left *= scale_ratio;
        plot.ortho_camera.right *= scale_ratio;
      }

      height = 2 * plot.ortho_camera.top;
      width = 2 * plot.ortho_camera.right;

      var y2 = (base_y * height) / plot.height;
      var x2 = (base_x * width) / plot.width;

      var pan_x = -x2 + x1;
      var pan_y = y2 - y1;

      update_fov_from_ortho(plot);
    }

    var up_vector = new THREE.Vector3()
      .copy(plot.camera_up)
      .multiplyScalar(pan_y);

    var posn_vector = new THREE.Vector3()
      .subVectors(
        get_current_camera(plot).position,
        plot.camera_origin
      )
      .normalize();

    var right_vector = new THREE.Vector3()
      .crossVectors(plot.camera_up, posn_vector)
      .multiplyScalar(pan_x);

    var test_posn = new THREE.Vector3()
      .copy(plot.camera_origin)
      .add(up_vector)
      .add(right_vector);

    pan_towards(plot, test_posn);

    // Re-scale text labels.
    // for (i = 0; i < plot.axis_text_planes.length; i++) {
    //   plot.axis_text_planes[i].scale.x *= scale_ratio;
    //   plot.axis_text_planes[i].scale.y *= scale_ratio;
    // }

    // for (i = 0; i < plot.tick_text_planes.length; i++) {
    //   plot.tick_text_planes[i].scale.x *= scale_ratio;
    //   plot.tick_text_planes[i].scale.y *= scale_ratio;
    // }

    if (plot.geom_type == "quad") {
      for (i = 0; i < plot.points.length; i++) {
        plot.points[i].scale.x *= scale_ratio;
        plot.points[i].scale.y *= scale_ratio;
      }
    }

    if (plot.have_any_labels) {
      for (i = 0; i < plot.points.length; i++) {
        if (plot.points[i].have_label) {
          plot.labels[i].scale.x *= scale_ratio;
          plot.labels[i].scale.y *= scale_ratio;
        }
      }

      update_labels(plot);
    }

    get_current_camera(plot).updateProjectionMatrix();

    if (plot.show_grid) {
      update_gridlines(plot);
    }

    update_render(plot);
  }

  if (typeof event.preventDefault === "function") {
    event.preventDefault();
  }
}

function mouse_move_wrapper(event,plot) {

    // Reasons for the differing signs on delta_x and
    // delta_y are lost to the mists of history, but
    // may have something to do with all the negative
    // latitudes in my quaternion definitions.
    var delta_x = -event.clientX + plot.click_start_x;
    var delta_y = event.clientY - plot.click_start_y;
  
    set_normed_mouse_coords(event, plot);
  
    var i;
    if (plot.mouse_operation == "rotate" && plot.view_type == "perspective") {
      var perc_horiz = plot.mouse.x;
      var perc_vert = -plot.mouse.y;
  
      var delta_lat =
        (plot.rotation_dir *
          delta_y *
          (tau / 2) *
          (1 - Math.abs(perc_horiz))) /
        plot.height;
      var delta_lon =
        (plot.rotation_dir *
          delta_x *
          (tau / 2) *
          (1 - Math.abs(perc_vert))) /
        plot.width;
      var delta_psi =
        (delta_y * (tau / 2) * perc_horiz) / plot.width +
        (delta_x * (tau / 2) * perc_vert) / plot.height;
  
      if (plot.rotate_less_with_zoom) {
        var zoom_scale = Math.min(
          1,
          Math.tan((0.5 * plot.persp_camera.fov) / rad2deg)
        );
        delta_lat *= zoom_scale;
        delta_lon *= zoom_scale;
  
        // The following is a fudge, based on the idea that if
        // rotate_less_with_zoom, then we're probably inside a photosphere,
        // and in that case I find that halving the psi rotation feels
        // more comfortable.
        delta_psi *= 0.5;
      }
  
      var change_quat = new THREE.Quaternion()
        .setFromEuler(get_current_camera(plot).rotation)
        .multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(-delta_lat, delta_lon, delta_psi, "YXZ")
          )
        );
  
      get_current_camera(plot)
        .position.set(0, 0, 1)
        .applyQuaternion(change_quat)
        .multiplyScalar(plot.camera_r)
        .add(plot.camera_origin);
  
      plot.camera_up = new THREE.Vector3(0, 1, 0).applyQuaternion(
        change_quat
      );
  
      get_current_camera(plot).rotation.setFromQuaternion(change_quat);
  
      if (plot.plot_type == "scatter") {
        if (plot.geom_type == "quad") {
          for (i = 0; i < plot.points.length; i++) {
            plot.points[i].rotation.copy(
              get_current_camera(plot).rotation
            );
          }
        }
  
        if (plot.have_any_labels) {
          update_labels(plot);
        }
      }
  
      // for (i = 0; i < plot.axis_text_planes.length; i++) {
      //   plot.axis_text_planes[i].rotation.copy(
      //     get_current_camera(plot).rotation
      //   );
      // }
  
      // for (i = 0; i < plot.tick_text_planes.length; i++) {
      //   plot.tick_text_planes[i].rotation.copy(
      //     get_current_camera(plot).rotation
      //   );
      // }
  
      if (plot.show_grid) {
        update_gridlines(plot);
      }
  
      if (plot.dynamic_axis_labels) {
        update_axes(plot);
      }
  
      update_render(plot);
    } else if (plot.mouse_operation == "pan") {
      // Moving the mouse upwards will pan in the direction of camera_up.
      // Moving the mouse sideways will pan in the direction camera_up x camera.position
      // after a translate.
  
      var x_factor, y_factor;
  
      if (plot.view_type == "perspective") {
        var dist_scale =
          2 *
          plot.camera_distance_scale *
          Math.tan(get_current_camera(plot).fov / (2 * rad2deg));
  
        x_factor = (dist_scale * delta_x) / plot.height;
        y_factor = (dist_scale * delta_y) / plot.height;
      } else {
        // Orthographic.
        var height = 2 * plot.ortho_camera.top;
        var width = 2 * plot.ortho_camera.right;
  
        x_factor = (delta_x * width) / plot.width;
        y_factor = (delta_y * height) / plot.height;
      }
  
      var start_posn = new THREE.Vector3().copy(
        get_current_camera(plot).position
      );
  
      var up_vector = new THREE.Vector3()
        .copy(plot.camera_up)
        .multiplyScalar(y_factor);
  
      var posn_vector = new THREE.Vector3()
        .subVectors(
          get_current_camera(plot).position,
          plot.camera_origin
        )
        .normalize();
  
      var right_vector = new THREE.Vector3()
        .crossVectors(plot.camera_up, posn_vector)
        .multiplyScalar(x_factor);
  
      var test_posn = new THREE.Vector3()
        .copy(plot.camera_origin)
        .add(up_vector)
        .add(right_vector);
  
      pan_towards(plot, test_posn);
  
      if (plot.show_grid) {
        update_gridlines(plot);
      }
  
      if (plot.dynamic_axis_labels) {
        update_axes(plot);
      }
  
      plot.renderer.render(
        plot.scene,
        get_current_camera(plot)
      );
    } else if (plot.mouse_operation == "zoom") {
      mouse_zoom(
        {
          deltaY: delta_y,
          clientX: event.clientX,
          clientY: event.clientY,
          zoom_factor: 1.05,
          preventDefault: function () {
            return;
          },
        },
        plot
      );
    } else if (plot.mouse_operation == "none") {
      // Possible mouseover / mouseout event.
      
      if (plot.have_mouseover || plot.have_mouseout) {
        var mouseover_i;
  
        if (plot.plot_type == "scatter") {
          mouseover_i = get_raycast_i(plot);
        } else if (plot.plot_type == "surface") {         
          mouseover_i = get_raycast_i(plot).slice(0);
        }
        if (plot.plot_type == "scatter") {
          if (mouseover_i != plot.mouseover_i) {
            if (plot.have_mouseout) {
              mouse_out_wrapper(plot, mouseover_i, false);
             //mouse_out_fn(event, plot, mouseover_i, false);
            }
            plot.mouseover_i = mouseover_i;
  
            if (mouseover_i >= 0 && plot.have_mouseover) {
              plot.mouseover(
                plot,
                mouseover_i,
                plot.points[mouseover_i]
              );
            }
          }
        } else if (plot.plot_type == "surface") {
          if (
            mouseover_i[0] != plot.mouseover_i[0] ||
            mouseover_i[1] != plot.mouseover_i[1]
          ) {
            if (plot.have_mouseout) {
              mouse_out_wrapper(plot, mouseover_i, false);
              //mouse_out_fn(event, plot, mouseover_i, false);
            }
            plot.mouseover_i = mouseover_i.slice(0);
  
            if (mouseover_i[0] >= 0 && plot.have_mouseover) {
              plot.mouseover(
                plot,
                mouseover_i[0],
                mouseover_i[1],
                plot.intersected_surf.mesh_points[mouseover_i[0]][mouseover_i[1]]
              );
            }
          }
        }
  
        update_render(plot);
      }
    }
  
    plot.click_start_x = event.clientX;
    plot.click_start_y = event.clientY;
  }


// function mouse_move_wrapper(plot) {
//   return function (event) {
//     mouse_move_fn(event, plot);
//   };
// }

// function mouse_move_fn(event, plot) {
//   // Reasons for the differing signs on delta_x and
//   // delta_y are lost to the mists of history, but
//   // may have something to do with all the negative
//   // latitudes in my quaternion definitions.
//   var delta_x = -event.clientX + plot.click_start_x;
//   var delta_y = event.clientY - plot.click_start_y;

//   set_normed_mouse_coords(event, plot);

//   var i;

//   if (plot.mouse_operation == "rotate") {
//     var perc_horiz = plot.mouse.x;
//     var perc_vert = -plot.mouse.y;

//     var delta_lat =
//       (plot.rotation_dir *
//         delta_y *
//         (tau / 2) *
//         (1 - Math.abs(perc_horiz))) /
//       plot.height;
//     var delta_lon =
//       (plot.rotation_dir *
//         delta_x *
//         (tau / 2) *
//         (1 - Math.abs(perc_vert))) /
//       plot.width;
//     var delta_psi =
//       (delta_y * (tau / 2) * perc_horiz) / plot.width +
//       (delta_x * (tau / 2) * perc_vert) / plot.height;

//     if (plot.rotate_less_with_zoom) {
//       var zoom_scale = Math.min(
//         1,
//         Math.tan((0.5 * plot.persp_camera.fov) / rad2deg)
//       );
//       delta_lat *= zoom_scale;
//       delta_lon *= zoom_scale;

//       // The following is a fudge, based on the idea that if
//       // rotate_less_with_zoom, then we're probably inside a photosphere,
//       // and in that case I find that halving the psi rotation feels
//       // more comfortable.
//       delta_psi *= 0.5;
//     }

//     var change_quat = new THREE.Quaternion()
//       .setFromEuler(get_current_camera(plot).rotation)
//       .multiply(
//         new THREE.Quaternion().setFromEuler(
//           new THREE.Euler(-delta_lat, delta_lon, delta_psi, "YXZ")
//         )
//       );

//     get_current_camera(plot)
//       .position.set(0, 0, 1)
//       .applyQuaternion(change_quat)
//       .multiplyScalar(plot.camera_r)
//       .add(plot.camera_origin);

//     plot.camera_up = new THREE.Vector3(0, 1, 0).applyQuaternion(
//       change_quat
//     );

//     get_current_camera(plot).rotation.setFromQuaternion(change_quat);

//     if (plot.plot_type == "scatter") {
//       if (plot.geom_type == "quad") {
//         for (i = 0; i < plot.points.length; i++) {
//           plot.points[i].rotation.copy(
//             get_current_camera(plot).rotation
//           );
//         }
//       }

//       if (plot.have_any_labels) {
//         update_labels(plot);
//       }
//     }

//     // for (i = 0; i < plot.axis_text_planes.length; i++) {
//     //   plot.axis_text_planes[i].rotation.copy(
//     //     get_current_camera(plot).rotation
//     //   );
//     // }

//     // for (i = 0; i < plot.tick_text_planes.length; i++) {
//     //   plot.tick_text_planes[i].rotation.copy(
//     //     get_current_camera(plot).rotation
//     //   );
//     // }

//     if (plot.show_grid) {
//       update_gridlines(plot);
//     }

//     if (plot.dynamic_axis_labels) {
//       update_axes(plot);
//     }

//     update_render(plot);
//   } else if (plot.mouse_operation == "pan") {
//     // Moving the mouse upwards will pan in the direction of camera_up.
//     // Moving the mouse sideways will pan in the direction camera_up x camera.position
//     // after a translate.

//     var x_factor, y_factor;

//     if (plot.view_type == "perspective") {
//       var dist_scale =
//         2 *
//         plot.camera_distance_scale *
//         Math.tan(get_current_camera(plot).fov / (2 * rad2deg));

//       x_factor = (dist_scale * delta_x) / plot.height;
//       y_factor = (dist_scale * delta_y) / plot.height;
//     } else {
//       // Orthographic.
//       var height = 2 * plot.ortho_camera.top;
//       var width = 2 * plot.ortho_camera.right;

//       x_factor = (delta_x * width) / plot.width;
//       y_factor = (delta_y * height) / plot.height;
//     }

//     var start_posn = new THREE.Vector3().copy(
//       get_current_camera(plot).position
//     );

//     var up_vector = new THREE.Vector3()
//       .copy(plot.camera_up)
//       .multiplyScalar(y_factor);

//     var posn_vector = new THREE.Vector3()
//       .subVectors(
//         get_current_camera(plot).position,
//         plot.camera_origin
//       )
//       .normalize();

//     var right_vector = new THREE.Vector3()
//       .crossVectors(plot.camera_up, posn_vector)
//       .multiplyScalar(x_factor);

//     var test_posn = new THREE.Vector3()
//       .copy(plot.camera_origin)
//       .add(up_vector)
//       .add(right_vector);

//     pan_towards(plot, test_posn);

//     if (plot.show_grid) {
//       update_gridlines(plot);
//     }

//     if (plot.dynamic_axis_labels) {
//       update_axes(plot);
//     }

//     plot.renderer.render(
//       plot.scene,
//       get_current_camera(plot)
//     );
//   } else if (plot.mouse_operation == "zoom") {
//     mouse_zoom(
//       {
//         deltaY: delta_y,
//         clientX: event.clientX,
//         clientY: event.clientY,
//         zoom_factor: 1.05,
//         preventDefault: function () {
//           return;
//         },
//       },
//       plot
//     );
//   } else if (plot.mouse_operation == "none") {
//     // Possible mouseover / mouseout event.
//     if (plot.have_mouseover || plot.have_mouseout) {
//       var mouseover_i;

//       if (plot.plot_type == "scatter") {
//         mouseover_i = get_raycast_i(plot);
//       } else if (plot.plot_type == "surface") {
//         mouseover_i = get_raycast_i(plot).slice(0);
//       }

//       if (plot.plot_type == "scatter") {
//         if (mouseover_i != plot.mouseover_i) {
//           if (plot.have_mouseout) {
//             mouse_out_wrapper(plot, mouseover_i, false);
//            //mouse_out_fn(event, plot, mouseover_i, false);
//           }

//           plot.mouseover_i = mouseover_i;

//           if (mouseover_i >= 0 && plot.have_mouseover) {
//             plot.mouseover(
//               plot,
//               mouseover_i,
//               plot.points[mouseover_i]
//             );
//           }
//         }
//       } else if (plot.plot_type == "surface") {
//         if (
//           mouseover_i[0] != plot.mouseover_i[0] ||
//           mouseover_i[1] != plot.mouseover_i[1]
//         ) {
//           if (plot.have_mouseout) {
//             mouse_out_wrapper(plot, mouseover_i, false);
//             //mouse_out_fn(event, plot, mouseover_i, false);
//           }

//           plot.mouseover_i = mouseover_i.slice(0);

//           if (mouseover_i[0] >= 0 && plot.have_mouseover) {
//             plot.mouseover(
//               plot,
//               mouseover_i[0],
//               mouseover_i[1],
//               plot.mesh_points[mouseover_i[0]][mouseover_i[1]]
//             );
//           }
//         }
//       }

//       update_render(plot);
//     }
//   }

//   plot.click_start_x = event.clientX;
//   plot.click_start_y = event.clientY;
// }

function mouse_out_wrapper(plot,mouseover_i, do_render) {
  if (plot.plot_type == "scatter") {
    if (plot.mouseover_i >= 0) {
      plot.mouseout(
        plot,
        plot.mouseover_i,
        plot.points[plot.mouseover_i]
      );
    }

    plot.mouseover_i = mouseover_i;
  } else if (plot.plot_type == "surface") {
    if (plot.mouseover_i[0] >= 0) {
      plot.mouseout(
        plot,
        plot.mouseover_i[0],
        plot.mouseover_i[1],
        plot.intersected_surf.mesh_points[plot.mouseover_i[0]][
          plot.mouseover_i[1]
        ]
      );
    }
    plot.mouseover_i = mouseover_i.slice(0);
  }

  if (do_render) {
    update_render(plot);
  }
}



// function mouse_out_wrapper(plot, mouseover_i, do_render) {
//   return function (event) {
//     return mouse_out_fn(event, plot, mouseover_i, do_render);
//   };
// }

// function mouse_out_fn(event, plot, mouseover_i, do_render) {
//   if (plot.plot_type == "scatter") {
//     if (plot.mouseover_i >= 0) {
//       plot.mouseout(
//         plot,
//         plot.mouseover_i,
//         plot.points[plot.mouseover_i]
//       );
//     }

//     plot.mouseover_i = mouseover_i;
//   } else if (plot.plot_type == "surface") {
//     if (plot.mouseover_i[0] >= 0) {
//       plot.mouseout(
//         plot,
//         plot.mouseover_i[0],
//         plot.mouseover_i[1],
//         plot.mesh_points[plot.mouseover_i[0]][
//           plot.mouseover_i[1]
//         ]
//       );
//     }

//     plot.mouseover_i = mouseover_i.slice(0);
//   }

//   if (do_render) {
//     update_render(plot);
//   }
// }

function set_normed_mouse_coords(event, plot) {
  var bounding_rect = event.bounding_rect//plot.renderer.domElement.getBoundingClientRect();
  plot.mouse.x =
    -1 + (2 * (event.clientX - bounding_rect.left)) / bounding_rect.width;
  plot.mouse.y =
    1 - (2 * (event.clientY - bounding_rect.top)) / bounding_rect.height;
  if (plot.mouse.x < -1) {
    plot.mouse.x = -1;
  }
  if (plot.mouse.y < -1) {
    plot.mouse.y = -1;
  }
  if (plot.mouse.x > 1) {
    plot.mouse.x = 1;
  }
  if (plot.mouse.y > 1) {
    plot.mouse.y = 1;
  }
  
}


function get_raycast_i(plot) {
  // Have to use a custom raycaster because the three.js one
  // for points assumes that all points are the same size.
  // My code follows the three.js code very closely.

  plot.raycaster.setFromCamera(
    plot.mouse,
    get_current_camera(plot)
  );
  var i;
  var scale_factor = get_scale_factor(plot);
  var ray = new THREE.Ray();
  var intersects = [];
  var this_distance_sq, distance_sq;
  if (plot.plot_type == "scatter") {
    if (plot.geom_type == "point") {
      var matrixWorld = plot.points_merged.matrixWorld;
      var inverseMatrix = new THREE.Matrix4().copy( matrixWorld ).invert()
      //var inverseMatrix = new THREE.Matrix4().getInverse(matrixWorld);
      ray.copy(plot.raycaster.ray).applyMatrix4(inverseMatrix);

      var positions =
        plot.points_merged.geometry.attributes.position.array;
      var sizes =
        plot.points_merged.geometry.attributes.dot_height.array;
      var position = new THREE.Vector3();

      var hide_points =
        plot.points_merged.geometry.attributes.hide_point.array;
      var null_points =
        plot.points_merged.geometry.attributes.null_point.array;

      for (i = 0; i < positions.length / 3; i++) {
        position.copy(
          new THREE.Vector3(
            positions[3 * i],
            positions[3 * i + 1],
            positions[3 * i + 2]
          )
        );

        if (!(hide_points[i] || null_points[i])) {
          this_distance_sq = ray.distanceSqToPoint(position);

          if (
            this_distance_sq <
            sizes[i] * sizes[i] * scale_factor * scale_factor
          ) {
            distance_sq =
              plot.raycaster.ray.origin.distanceToSquared(position);
            intersects.push({ index: i, distance_sq: distance_sq });
          }
        }
      }

      if (intersects.length > 0) {
        return intersects[
          d3.scan(intersects, function (a, b) {
            return a.distance_sq - b.distance_sq;
          })
        ].index;
      } else {
        return -1;
      }
    } else if (plot.geom_type == "quad") {
      intersects = plot.raycaster.intersectObjects(
        plot.points
      );

      if (intersects.length > 0) {
        var hide_points, null_points, this_i;

        for (i = 0; i < intersects.length; i++) {
          this_i = intersects[i].object.input_data.i;
          hide_points =
            plot.points[this_i].geometry.attributes.hide_point.array;
          null_points =
            plot.points[this_i].geometry.attributes.null_point.array;

          if (!(hide_points[0] || null_points[0])) {
            this_distance_sq = intersects[0].point.distanceToSquared(
              intersects[0].object.position
            );

            if (
              this_distance_sq <
              0.25 * intersects[0].object.scale.x * intersects[0].object.scale.x
            ) {
              return this_i;
            }
          }
        }
      }

      return -1;
    } else {
      // geom_type == "none".
      return -1;
    }
  } else if (plot.plot_type == "surface") {
    intersects = plot.raycaster.intersectObjects(
      plot.group_surf.children
    );

    if (intersects.length > 0) {
      intersects = intersects[0];
      
      plot.intersected_surf = plot.surface_list.find(function(surface, index) {
        if(surface.surface.uuid == intersects.object.uuid)
          return true;
      });
      //intersected_surf = intersected_surf.surface
      var nulls = plot.intersected_surf.surface.geometry.attributes.null_point.array;
      var hides = plot.intersected_surf.surface.geometry.attributes.hide_point.array;
      var i_vertex;
      
        // The faceIndex goes up in 3's, by observation
        // (or by study of the three.js source code).
        i_vertex = intersects.face.a;
        if (!nulls[i_vertex] && !hides[i_vertex + 1] && !hides[i_vertex + 2]) {
          // Non-null triangle -- have to find the two possible
          // vertices, then work out which one is closest to the
          // mouse.

          var i_tri_all, i_tri_local, i_quad, cand_ij1, cand_ij2;

          i_tri_all = i_vertex / 3;
          i_quad = Math.floor(i_tri_all / 4);
          i_tri_local = i_tri_all % 4;

          var positions =
          plot.intersected_surf.surface.geometry.attributes.position.array;
          var posn1 = new THREE.Vector3(
            positions[3 * i_vertex + 3],
            positions[3 * i_vertex + 4],
            positions[3 * i_vertex + 5]
          );
          var posn2 = new THREE.Vector3(
            positions[3 * i_vertex + 6],
            positions[3 * i_vertex + 7],
            positions[3 * i_vertex + 8]
          );

          var nx = plot.intersected_surf.mesh_points.length;
          var ny = plot.intersected_surf.mesh_points[0].length;

          var i1 = Math.floor(i_quad / (ny - 1));
          var j1 = i_quad % (ny - 1);
          if (i_tri_local == 0) {
            cand_ij1 = [i1, j1];
            cand_ij2 = [i1 + 1, j1];
          } else if (i_tri_local == 1) {
            cand_ij1 = [i1 + 1, j1];
            cand_ij2 = [i1 + 1, j1 + 1];
          } else if (i_tri_local == 2) {
            cand_ij1 = [i1 + 1, j1 + 1];
            cand_ij2 = [i1, j1 + 1];
          } else if (i_tri_local == 3) {
            cand_ij1 = [i1, j1 + 1];
            cand_ij2 = [i1, j1];
          } else {
            
            console.warn("Raycast error; not supposed to happen.");
            return [-1, -1];
          }

          var matrixWorld = plot.intersected_surf.surface.matrixWorld;
          var inverseMatrix = new THREE.Matrix4().copy( matrixWorld ).invert()
          //var inverseMatrix = new THREE.Matrix4().getInverse(matrixWorld);
          ray.copy(plot.raycaster.ray).applyMatrix4(inverseMatrix);

          var dist1 = ray.distanceSqToPoint(posn1);
          var dist2 = ray.distanceSqToPoint(posn2);

          if (dist1 < dist2) {
            return cand_ij1;
          } else {
            return cand_ij2;
          }
        }
      
    }

    return [-1, -1];
  }
}

export {
  touch_start_fn,
  touch_move_fn,
  touch_end_fn,
  mouse_down_fn,
  mouse_up_fn,
  mouse_zoom_wrapper,
  mouse_move_wrapper,
  mouse_out_wrapper,
  set_normed_mouse_coords
};
