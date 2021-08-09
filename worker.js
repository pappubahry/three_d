import {make_surface,	touch_start_fn,
	touch_move_fn,
	touch_end_fn,
	mouse_down_fn,
    add_surface,
    remove_surface,
	mouse_up_fn,
	mouse_zoom_wrapper,
	mouse_move_wrapper,
	mouse_out_wrapper,
} from './src/three_d.js';

//importScripts('./src/three_d.js');
var plot
self.onmessage = function (event) {
    if (event.data.canvas){
        var canvas = event.data.canvas;
        plot = event.data.plot;
        var params = event.data.params
        make_surface(plot,params,canvas);
    }
    if (event.data.events_name === 'mousedown'){
        mouse_down_fn(event.data.event,plot)
    }
    if (event.data.events_name === 'mouseup'){
        mouse_up_fn(event.data.event,plot,false)
    }
    if (event.data.events_name === 'mouseout'){
        mouse_up_fn(event.data.event,plot,true)
        mouse_out_wrapper(plot, [-1, -1], true)
    }
    if (event.data.events_name === 'wheel'){
        mouse_zoom_wrapper(event.data.event,plot)
    }
    if (event.data.events_name === 'mousemove'){
        mouse_move_wrapper(event.data.event,plot)
    }
    if (event.data.add_surf){
        var surf_params = event.data.add_surf
        add_surface(plot,surf_params)
    }
    if (event.data.remove_surf){
        let surf_to_remove = event.data.remove_surf
        remove_surface(plot,surf_to_remove)
    }
}
