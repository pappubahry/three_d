
function init_plot() {
	//check WebGL
	let canvas_test = document.createElement("canvas");
	let gl = canvas_test.getContext("webgl") || canvas_test.getContext("experimental-webgl");
	if (!(gl && gl instanceof WebGLRenderingContext)) {
		let div_html = "";
		if (params.hasOwnProperty("fallback_image")) {
			div_html = "<img src=\"" + params.fallback_image + "\">";
		} else {
			div_html = "Sorry, you do not have WebGL enabled.";
		}

		let div = document.getElementById(plot_div_id);
		div.innerHTML = div_html;
	}

	var plot_div_id = "div_plot_area";

	let make_toggles = true;
	let make_snaps = true;
	let i_plot = 0;
	let toggle_div = document.createElement("div");
	toggle_div.id = "div_toggle_scatter_" + i_plot;
	let div_html = "";


	//dir picker
	toggle_div.innerHTML = div_html;
	let parent_div = document.getElementById(plot_div_id)
	parent_div.appendChild(toggle_div);
	let dirpicker = document.createElement("button");
	dirpicker.innerHTML = "Open Directory";
	toggle_div.appendChild(dirpicker);
	var pmd_list_div = document.createElement('div');
	toggle_div.appendChild(pmd_list_div)
	dirpicker.onclick = async function getDir() {
		const dirHandle = await window.showDirectoryPicker();
		pmd_list_div.innerHTML = ""
		var pmd_files = []
		for await (const f of dirHandle.values()) {
			if (f.kind === "file" && f.name.includes(".pmd")) {
				console.log("a")
				pmd_files.push(f.name)
				var checkBox = document.createElement("input");
				var label = document.createElement("label");
				checkBox.type = "checkbox";
				checkBox.value = f.name;
				pmd_list_div.appendChild(checkBox);
				pmd_list_div.appendChild(label);
				label.appendChild(document.createTextNode(f.name));
			}
		}
	}
	//add dummy surface
	let add_surf = document.createElement("button");
	add_surf.innerHTML = "Add surface called miocene";
	toggle_div.appendChild(add_surf);
	add_surf.onclick = async function addsurf() {
		let params = {};
		params.data = {};

		// Grid with 6 values along x, 4 values along y:
		params.data.x = [2, 6, 7, 8, 9, 10, 11, 12];
		params.data.y = [0, 2, 4, 6, 8, 10];
		params.name = 'miocene'
		// z array has length 6, each entry an array of length 4:
		params.data.z = [
			[10, 10, 10, 10, 9, 8],
			[10, 10, 10, 10, 9, 8],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 2, 1],
			[0, 0, 0, 0, 2, 1],
		];
		params.color_scale = "plasma"
		w.postMessage({ add_surf: params })
	}

	let remove_surf = document.createElement("button");
	remove_surf.innerHTML = "remove miocene";
	toggle_div.appendChild(remove_surf);
	remove_surf.onclick = async function remove_surf() {

		w.postMessage({ remove_surf: "miocene" })
	}


	var params = {};
	params.data = {};

	// Grid with 6 values along x, 4 values along y:
	params.data.x = [5, 6, 7, 8, 9, 10];
	params.data.y = [0, 5, 10, 15];
	params.name = 'seabed'
	// z array has length 6, each entry an array of length 4:
	params.data.z = [
		[NaN, 11, 5, 18],
		[10, 12, 11, 8],
		[11, 13, 11, NaN],
		[10, 15, 12, 9],
		[11, 14, 11, 10],
		[11, 10, 10, 9]
	];
	params.color_scale = "plasma"

	// let plots = []
	// plots.push({});
	// //let i_plot = 0;
	// let plot = plots[i_plot];
	var plot = {}
	plot.mouseover = true;
	plot.ve = 1;
	plot.mouseout = true;
	plot.showing_mesh = true; //show grid mesh on surface
	plot.plot_type = "surface";

	//plot.parent_div.style.width = plot.width + "px";

	plot.pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
	plot.plotWindowRatio={height: 0.8, width: 0.8}
	plot.width = window.innerWidth *plot.plotWindowRatio.width
	plot.height = window.innerHeight*plot.plotWindowRatio.height
	var canvas = document.createElement("canvas");
	canvas.style = "border: 1px solid black;"
	parent_div.appendChild(canvas);
	var w = new Worker('./worker.js', { type: "module" });
	var offscreen = canvas.transferControlToOffscreen();
	w.postMessage({ canvas: offscreen, plot: plot, params: params }, [offscreen]);
	window.addEventListener('resize', () => { w.postMessage({ events_name: "windowResize", size: { height: window.innerHeight, width: window.innerWidth } }) });
	//add slider
	let slider = document.getElementById("slider");
	slider.value=plot.ve
	let sliderVal = document.createElement("sliderVal")
	slider.oninput= function(){
		sliderVal.innerHTML=this.value;
		w.postMessage({VE:this.value})
	}
	sliderVal.innerHTML=slider.value
	//2d
	let view2d = document.createElement("button");
	view2d.innerHTML = "2D view";
	toggle_div.appendChild(view2d);
	view2d.onclick = async function setView2d() {
		w.postMessage({ view2D: view2d.innerHTML })
	}

	toggle_div.appendChild(slider);
	toggle_div.appendChild(sliderVal)
	w.onmessage =function (event) {
		if (event.data.view === '2D'){
			view2d.innerHTML="3D view"
		}
		if (event.data.view === '3D'){
			view2d.innerHTML="2D view"
		}
	}
	var mouse_events = ['mousedown', 'mouseup', 'mouseout', 'mousemove', 'wheel', 'touchstart', 'touchmove', 'touchend']
	mouse_events.forEach((events_name) => {
		canvas.addEventListener(events_name, (e) => {
			w.postMessage({
				events_name,
				event: {
					clientX: e.clientX,
					clientY: e.clientY,
					deltaY: e.deltaY,
					type: e.type,
					button: e.button,
					ctrlKey: e.ctrlKey,
					shiftkey: e.shiftkey,
					bounding_rect: canvas.getBoundingClientRect()
				}
			})
		})
	})
}

init_plot();
