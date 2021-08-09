import {make_surface} from './src/three_d.js'
import {hide_surface} from './src/surface.js'
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

	let make_toggles= true;
	let make_snaps= true;
	let i_plot = 0;
	let toggle_div = document.createElement("div");
	toggle_div.id = "div_toggle_scatter_" + i_plot;
	let div_html = "";
	
	if (make_toggles) {
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
	
	if (make_snaps) {
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
	
	if (make_toggles || make_snaps) {
		toggle_div.innerHTML = div_html;
    let parent_div = document.getElementById(plot_div_id)
		parent_div.appendChild(toggle_div);
	}
	//dir picker

    let dirpicker = document.createElement("button");
	dirpicker.innerHTML = "Open Directory";
	toggle_div.appendChild(dirpicker);
	var pmd_list_div = document.createElement('div');
	toggle_div.appendChild(pmd_list_div)
	dirpicker.onclick = async function getDir() {
		const dirHandle = await window.showDirectoryPicker();
		pmd_list_div.innerHTML=""
		var pmd_files = []
		for await (const f of dirHandle.values()){
			if (f.kind==="file" && f.name.includes(".pmd")){
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
	  add_surf.onclick = async function addsurf(){
		let params = {};
		params.data = {};
		
		// Grid with 6 values along x, 4 values along y:
		params.data.x = [5, 6, 7, 8, 9, 10,11,12];
		params.data.y = [0, 0.5, 1, 1.5,2,2.5];
		params.name = 'miocene'
		// z array has length 6, each entry an array of length 4:
		params.data.z = [
			[10, 10,10, 10,9,8],
		  [10, 10,10, 10,9,8],
		  [0, 0,0, 0,2,1],
		  [0, 0,0, 0,2,1],
		  [0, 0,0, 0,2,1],
		  [0, 0,0, 0,2,1],
		  [0, 0,0, 0,2,1],
		  [0, 0,0, 0,2,1],
		];
		params.color_scale = "plasma"
		w.postMessage({add_surf:params})
	  }

	  let remove_surf = document.createElement("button");
	  remove_surf.innerHTML = "remove miocene";
	  toggle_div.appendChild(remove_surf);
	  remove_surf.onclick = async function remove_surf(){

		w.postMessage({remove_surf:"miocene"})
	  }

	var params = {};
    params.data = {};
    
    // Grid with 6 values along x, 4 values along y:
    params.data.x = [5, 6, 7, 8, 9, 10];
    params.data.y = [0, 0.5, 1, 1.5];
    params.name = 'seabed'
    // z array has length 6, each entry an array of length 4:
    params.data.z = [
      [NaN, 11, 9.5, 10],
      [10, 12, 11,  8],
      [11, 13, 11,  NaN],
      [10, 15, 12,  9],
      [11, 14, 11, 10],
      [11, 10, 10,  9]
    ];
	params.color_scale = "plasma"

    // let plots = []
	// plots.push({});
	// //let i_plot = 0;
	// let plot = plots[i_plot];
	var plot = {}
	plot.mouseover = true;
	plot.mouseout=true;
	plot.showing_mesh = true; //show grid mesh on surface
	plot.plot_type = "surface";
	plot.width = 1000
	plot.height = 1000
	var parent_div = document.getElementById(plot_div_id);
	//plot.parent_div.style.width = plot.width + "px";

	plot.pixelRatio=window.devicePixelRatio ? window.devicePixelRatio : 1;
	var canvas = document.createElement("canvas");
	
	parent_div.appendChild(canvas);
	var w = new Worker('./worker.js',{ type: "module" });
	var offscreen = canvas.transferControlToOffscreen();
	w.postMessage({canvas:offscreen,plot:plot,params:params}, [offscreen]);

    //make_surface(plots,params,canvas);
    //hide_surface(plots[0])
    
    //three_d.hide_mesh(0);
	var mouse_events = ['mousedown', 'mouseup','mouseout','mousemove','wheel','touchstart','touchmove','touchend']
	mouse_events.forEach((events_name)=>{
		canvas.addEventListener(events_name, (e)=>{
			w.postMessage({
				events_name,
				event:{
					clientX: e.clientX,
					clientY: e.clientY,
					deltaY:e.deltaY,
					type: e.type,
					button:e.button,
					ctrlKey:e.ctrlKey,
					shiftkey:e.shiftkey,
					bounding_rect:canvas.getBoundingClientRect()
				}
			})
		})
	})
  }
  
init_plot();
