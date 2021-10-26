import three_d from './src/three_d.js';
var plot
self.onmessage = function (event) {
    if (event.data.canvas){
        var canvas = event.data.canvas;
        plot = event.data.plot;
        var params = event.data.params
        three_d.make_surface(plot,params,canvas);
    }
    if (event.data.events_name === 'mousedown'){
        three_d.mouse_down_fn(event.data.event,plot)
    }
    if (event.data.events_name === 'mouseup'){
        three_d.mouse_up_fn(event.data.event,plot,false)
    }
    if (event.data.events_name === 'mouseout'){
        three_d.mouse_up_fn(event.data.event,plot,true)
        three_d.mouse_out_wrapper(plot, [-1, -1], true)
    }
    if (event.data.events_name === 'wheel'){
        three_d.mouse_zoom_wrapper(event.data.event,plot)
    }
    if (event.data.events_name === 'mousemove'){
        three_d.mouse_move_wrapper(event.data.event,plot)
    }
    if (event.data.events_name === 'windowResize'){
        three_d.resizeCanvas(plot,event.data.size)
    }
    if (event.data.add_surf){
        var surf_params = event.data.add_surf
        three_d.add_surface(plot,surf_params)
    }
    if (event.data.remove_surf){
        let surf_to_remove = event.data.remove_surf
        three_d.remove_surface(plot,surf_to_remove)
    }
    if (event.data.VE){
        three_d.setVE(plot,event.data.VE)
    }
    if (event.data.view2D === "2D view"){
        three_d.view2D(plot);
        self.postMessage({view:"2D"})
    }
    if (event.data.view2D === "3D view"){
        three_d.view3D(plot);
        self.postMessage({view:"3D"})
    }
}
