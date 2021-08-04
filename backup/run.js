import {make_surface} from './src/three_d.js'
import {hide_surface} from './src/surface.js'
import {set_surface_point_color} from './src/color.js'
function init_plot() {
    var params = {};
    params.div_id = "div_plot_area";
    
    params.data = {};
    
    // Grid with 6 values along x, 4 values along y:
    params.data.x = [5, 6, 7, 8, 9, 10];
    params.data.y = [0, 0.5, 1, 1.5];
    
    // z array has length 6, each entry an array of length 4:
    params.data.z = [
      [10, 11, 9.5, 10],
      [10, 12, 11,  8],
      [11, 13, 11,  9],
      [10, 15, 12,  9],
      [11, 14, 11, 10],
      [11, 10, 10,  9]
    ];
    params.mouseover = function(i_plot, i, j, d) {
          set_surface_point_color(i_plot, i, j, 0xFFFFFF);
      }
      
      params.mouseout = function(i_plot, i, j, d) {
          set_surface_point_color(i_plot, i, j, d.input_data.color);
      }
    let plots = []
    make_surface(plots,params);
    //hide_surface(plots[0])
    
    //three_d.hide_mesh(0);
  }
  
init_plot();
