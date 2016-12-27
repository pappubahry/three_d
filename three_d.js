/* Hello and welcome to my JavaScript.  This is version 1.1 of
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
 * David Barry, 2016-12-27.
 */



/* d3.js modules:

Copyright 2010-2016 Mike Bostock
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

Neither the name of the author nor the names of contributors may be used to
endorse or promote products derived from this software without specific prior
written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// https://d3js.org/d3-array/ Version 1.0.1. Copyright 2016 Mike Bostock.
!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(n.d3=n.d3||{})}(this,function(n){"use strict";function r(n,r){return n<r?-1:n>r?1:n>=r?0:NaN}function t(n){return 1===n.length&&(n=e(n)),{left:function(r,t,e,u){for(null==e&&(e=0),null==u&&(u=r.length);e<u;){var o=e+u>>>1;n(r[o],t)<0?e=o+1:u=o}return e},right:function(r,t,e,u){for(null==e&&(e=0),null==u&&(u=r.length);e<u;){var o=e+u>>>1;n(r[o],t)>0?u=o:e=o+1}return e}}}function e(n){return function(t,e){return r(n(t),e)}}function u(n,r){return r<n?-1:r>n?1:r>=n?0:NaN}function o(n){return null===n?NaN:+n}function f(n,r){var t,e,u=n.length,f=0,l=0,i=-1,a=0;if(null==r)for(;++i<u;)isNaN(t=o(n[i]))||(e=t-f,f+=e/++a,l+=e*(t-f));else for(;++i<u;)isNaN(t=o(r(n[i],i,n)))||(e=t-f,f+=e/++a,l+=e*(t-f));if(a>1)return l/(a-1)}function l(n,r){var t=f(n,r);return t?Math.sqrt(t):t}function i(n,r){var t,e,u,o=-1,f=n.length;if(null==r){for(;++o<f;)if(null!=(e=n[o])&&e>=e){t=u=e;break}for(;++o<f;)null!=(e=n[o])&&(t>e&&(t=e),u<e&&(u=e))}else{for(;++o<f;)if(null!=(e=r(n[o],o,n))&&e>=e){t=u=e;break}for(;++o<f;)null!=(e=r(n[o],o,n))&&(t>e&&(t=e),u<e&&(u=e))}return[t,u]}function a(n){return function(){return n}}function h(n){return n}function c(n,r,t){n=+n,r=+r,t=(u=arguments.length)<2?(r=n,n=0,1):u<3?1:+t;for(var e=-1,u=0|Math.max(0,Math.ceil((r-n)/t)),o=new Array(u);++e<u;)o[e]=n+e*t;return o}function s(n,r,t){var e=g(n,r,t);return c(Math.ceil(n/e)*e,Math.floor(r/e)*e+e/2,e)}function g(n,r,t){var e=Math.abs(r-n)/Math.max(0,t),u=Math.pow(10,Math.floor(Math.log(e)/Math.LN10)),o=e/u;return o>=C?u*=10:o>=E?u*=5:o>=G&&(u*=2),r<n?-u:u}function v(n){return Math.ceil(Math.log(n.length)/Math.LN2)+1}function p(){function n(n){var u,o,f=n.length,l=new Array(f);for(u=0;u<f;++u)l[u]=r(n[u],u,n);var i=t(l),a=i[0],h=i[1],c=e(l,a,h);Array.isArray(c)||(c=s(a,h,c));for(var g=c.length;c[0]<=a;)c.shift(),--g;for(;c[g-1]>=h;)c.pop(),--g;var v,p=new Array(g+1);for(u=0;u<=g;++u)v=p[u]=[],v.x0=u>0?c[u-1]:a,v.x1=u<g?c[u]:h;for(u=0;u<f;++u)o=l[u],a<=o&&o<=h&&p[F(c,o,0,g)].push(n[u]);return p}var r=h,t=i,e=v;return n.value=function(t){return arguments.length?(r="function"==typeof t?t:a(t),n):r},n.domain=function(r){return arguments.length?(t="function"==typeof r?r:a([r[0],r[1]]),n):t},n.thresholds=function(r){return arguments.length?(e="function"==typeof r?r:a(Array.isArray(r)?R.call(r):r),n):e},n}function d(n,r,t){if(null==t&&(t=o),e=n.length){if((r=+r)<=0||e<2)return+t(n[0],0,n);if(r>=1)return+t(n[e-1],e-1,n);var e,u=(e-1)*r,f=Math.floor(u),l=+t(n[f],f,n),i=+t(n[f+1],f+1,n);return l+(i-l)*(u-f)}}function M(n,t,e){return n=B.call(n,o).sort(r),Math.ceil((e-t)/(2*(d(n,.75)-d(n,.25))*Math.pow(n.length,-1/3)))}function y(n,r,t){return Math.ceil((t-r)/(3.5*l(n)*Math.pow(n.length,-1/3)))}function N(n,r){var t,e,u=-1,o=n.length;if(null==r){for(;++u<o;)if(null!=(e=n[u])&&e>=e){t=e;break}for(;++u<o;)null!=(e=n[u])&&e>t&&(t=e)}else{for(;++u<o;)if(null!=(e=r(n[u],u,n))&&e>=e){t=e;break}for(;++u<o;)null!=(e=r(n[u],u,n))&&e>t&&(t=e)}return t}function m(n,r){var t,e=0,u=n.length,f=-1,l=u;if(null==r)for(;++f<u;)isNaN(t=o(n[f]))?--l:e+=t;else for(;++f<u;)isNaN(t=o(r(n[f],f,n)))?--l:e+=t;if(l)return e/l}function b(n,t){var e,u=[],f=n.length,l=-1;if(null==t)for(;++l<f;)isNaN(e=o(n[l]))||u.push(e);else for(;++l<f;)isNaN(e=o(t(n[l],l,n)))||u.push(e);return d(u.sort(r),.5)}function A(n){for(var r,t,e,u=n.length,o=-1,f=0;++o<u;)f+=n[o].length;for(t=new Array(f);--u>=0;)for(e=n[u],r=e.length;--r>=0;)t[--f]=e[r];return t}function w(n,r){var t,e,u=-1,o=n.length;if(null==r){for(;++u<o;)if(null!=(e=n[u])&&e>=e){t=e;break}for(;++u<o;)null!=(e=n[u])&&t>e&&(t=e)}else{for(;++u<o;)if(null!=(e=r(n[u],u,n))&&e>=e){t=e;break}for(;++u<o;)null!=(e=r(n[u],u,n))&&t>e&&(t=e)}return t}function x(n){for(var r=0,t=n.length-1,e=n[0],u=new Array(t<0?0:t);r<t;)u[r]=[e,e=n[++r]];return u}function k(n,r){for(var t=r.length,e=new Array(t);t--;)e[t]=n[r[t]];return e}function q(n,t){if(e=n.length){var e,u,o=0,f=0,l=n[f];for(t||(t=r);++o<e;)(t(u=n[o],l)<0||0!==t(l,l))&&(l=u,f=o);return 0===t(l,l)?f:void 0}}function L(n,r,t){for(var e,u,o=(null==t?n.length:t)-(r=null==r?0:+r);o;)u=Math.random()*o--|0,e=n[o+r],n[o+r]=n[u+r],n[u+r]=e;return n}function S(n,r){var t,e=0,u=n.length,o=-1;if(null==r)for(;++o<u;)(t=+n[o])&&(e+=t);else for(;++o<u;)(t=+r(n[o],o,n))&&(e+=t);return e}function j(n){if(!(u=n.length))return[];for(var r=-1,t=w(n,_),e=new Array(t);++r<t;)for(var u,o=-1,f=e[r]=new Array(u);++o<u;)f[o]=n[o][r];return e}function _(n){return n.length}function z(){return j(arguments)}var D=t(r),F=D.right,O=D.left,P=Array.prototype,R=P.slice,B=P.map,C=Math.sqrt(50),E=Math.sqrt(10),G=Math.sqrt(2);n.bisect=F,n.bisectRight=F,n.bisectLeft=O,n.ascending=r,n.bisector=t,n.descending=u,n.deviation=l,n.extent=i,n.histogram=p,n.thresholdFreedmanDiaconis=M,n.thresholdScott=y,n.thresholdSturges=v,n.max=N,n.mean=m,n.median=b,n.merge=A,n.min=w,n.pairs=x,n.permute=k,n.quantile=d,n.range=c,n.scan=q,n.shuffle=L,n.sum=S,n.ticks=s,n.tickStep=g,n.transpose=j,n.variance=f,n.zip=z,Object.defineProperty(n,"__esModule",{value:!0})})/
// https://d3js.org/d3-collection/ Version 1.0.1. Copyright 2016 Mike Bostock.
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.d3=n.d3||{})}(this,function(n){"use strict";function t(){}function e(n,e){var r=new t;if(n instanceof t)n.each(function(n,t){r.set(t,n)});else if(Array.isArray(n)){var i,u=-1,o=n.length;if(null==e)for(;++u<o;)r.set(u,n[u]);else for(;++u<o;)r.set(e(i=n[u],u,n),i)}else if(n)for(var s in n)r.set(s,n[s]);return r}function r(){function n(t,i,u,o){if(i>=a.length)return null!=f?f(t):null!=r?t.sort(r):t;for(var s,c,h,l=-1,v=t.length,p=a[i++],y=e(),d=u();++l<v;)(h=y.get(s=p(c=t[l])+""))?h.push(c):y.set(s,[c]);return y.each(function(t,e){o(d,e,n(t,i,u,o))}),d}function t(n,e){if(++e>a.length)return n;var r,i=h[e-1];return null!=f&&e>=a.length?r=n.entries():(r=[],n.each(function(n,i){r.push({key:i,values:t(n,e)})})),null!=i?r.sort(function(n,t){return i(n.key,t.key)}):r}var r,f,c,a=[],h=[];return c={object:function(t){return n(t,0,i,u)},map:function(t){return n(t,0,o,s)},entries:function(e){return t(n(e,0,o,s),0)},key:function(n){return a.push(n),c},sortKeys:function(n){return h[a.length-1]=n,c},sortValues:function(n){return r=n,c},rollup:function(n){return f=n,c}}}function i(){return{}}function u(n,t,e){n[t]=e}function o(){return e()}function s(n,t,e){n.set(t,e)}function f(){}function c(n,t){var e=new f;if(n instanceof f)n.each(function(n){e.add(n)});else if(n){var r=-1,i=n.length;if(null==t)for(;++r<i;)e.add(n[r]);else for(;++r<i;)e.add(t(n[r],r,n))}return e}function a(n){var t=[];for(var e in n)t.push(e);return t}function h(n){var t=[];for(var e in n)t.push(n[e]);return t}function l(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t}var v="$";t.prototype=e.prototype={constructor:t,has:function(n){return v+n in this},get:function(n){return this[v+n]},set:function(n,t){return this[v+n]=t,this},remove:function(n){var t=v+n;return t in this&&delete this[t]},clear:function(){for(var n in this)n[0]===v&&delete this[n]},keys:function(){var n=[];for(var t in this)t[0]===v&&n.push(t.slice(1));return n},values:function(){var n=[];for(var t in this)t[0]===v&&n.push(this[t]);return n},entries:function(){var n=[];for(var t in this)t[0]===v&&n.push({key:t.slice(1),value:this[t]});return n},size:function(){var n=0;for(var t in this)t[0]===v&&++n;return n},empty:function(){for(var n in this)if(n[0]===v)return!1;return!0},each:function(n){for(var t in this)t[0]===v&&n(this[t],t.slice(1),this)}};var p=e.prototype;f.prototype=c.prototype={constructor:f,has:p.has,add:function(n){return n+="",this[v+n]=n,this},remove:p.remove,clear:p.clear,values:p.keys,size:p.size,empty:p.empty,each:p.each},n.nest=r,n.set=c,n.map=e,n.keys=a,n.values=h,n.entries=l,Object.defineProperty(n,"__esModule",{value:!0})})/
// https://d3js.org/d3-color/ Version 1.0.1. Copyright 2016 Mike Bostock.
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.d3=t.d3||{})}(this,function(t){"use strict";function e(t,e,n){t.prototype=e.prototype=n,n.constructor=t}function n(t,e){var n=Object.create(t.prototype);for(var i in e)n[i]=e[i];return n}function i(){}function r(t){var e;return t=(t+"").trim().toLowerCase(),(e=O.exec(t))?(e=parseInt(e[1],16),new l(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1)):(e=S.exec(t))?a(parseInt(e[1],16)):(e=_.exec(t))?new l(e[1],e[2],e[3],1):(e=z.exec(t))?new l(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=C.exec(t))?s(e[1],e[2],e[3],e[4]):(e=L.exec(t))?s(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=A.exec(t))?u(e[1],e[2]/100,e[3]/100,1):(e=B.exec(t))?u(e[1],e[2]/100,e[3]/100,e[4]):D.hasOwnProperty(t)?a(D[t]):"transparent"===t?new l(NaN,NaN,NaN,0):null}function a(t){return new l(t>>16&255,t>>8&255,255&t,1)}function s(t,e,n,i){return i<=0&&(t=e=n=NaN),new l(t,e,n,i)}function o(t){return t instanceof i||(t=r(t)),t?(t=t.rgb(),new l(t.r,t.g,t.b,t.opacity)):new l}function h(t,e,n,i){return 1===arguments.length?o(t):new l(t,e,n,null==i?1:i)}function l(t,e,n,i){this.r=+t,this.g=+e,this.b=+n,this.opacity=+i}function u(t,e,n,i){return i<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new g(t,e,n,i)}function c(t){if(t instanceof g)return new g(t.h,t.s,t.l,t.opacity);if(t instanceof i||(t=r(t)),!t)return new g;if(t instanceof g)return t;t=t.rgb();var e=t.r/255,n=t.g/255,a=t.b/255,s=Math.min(e,n,a),o=Math.max(e,n,a),h=NaN,l=o-s,u=(o+s)/2;return l?(h=e===o?(n-a)/l+6*(n<a):n===o?(a-e)/l+2:(e-n)/l+4,l/=u<.5?o+s:2-o-s,h*=60):l=u>0&&u<1?0:h,new g(h,l,u,t.opacity)}function d(t,e,n,i){return 1===arguments.length?c(t):new g(t,e,n,null==i?1:i)}function g(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}function p(t,e,n){return 255*(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)}function f(t){if(t instanceof y)return new y(t.l,t.a,t.b,t.opacity);if(t instanceof x){var e=t.h*E;return new y(t.l,Math.cos(e)*t.c,Math.sin(e)*t.c,t.opacity)}t instanceof l||(t=o(t));var n=N(t.r),i=N(t.g),r=N(t.b),a=w((.4124564*n+.3575761*i+.1804375*r)/H),s=w((.2126729*n+.7151522*i+.072175*r)/J),h=w((.0193339*n+.119192*i+.9503041*r)/K);return new y(116*s-16,500*(a-s),200*(s-h),t.opacity)}function b(t,e,n,i){return 1===arguments.length?f(t):new y(t,e,n,null==i?1:i)}function y(t,e,n,i){this.l=+t,this.a=+e,this.b=+n,this.opacity=+i}function w(t){return t>U?Math.pow(t,1/3):t/T+Q}function m(t){return t>R?t*t*t:T*(t-Q)}function k(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function N(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function M(t){if(t instanceof x)return new x(t.h,t.c,t.l,t.opacity);t instanceof y||(t=f(t));var e=Math.atan2(t.b,t.a)*F;return new x(e<0?e+360:e,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}function v(t,e,n,i){return 1===arguments.length?M(t):new x(t,e,n,null==i?1:i)}function x(t,e,n,i){this.h=+t,this.c=+e,this.l=+n,this.opacity=+i}function q(t){if(t instanceof j)return new j(t.h,t.s,t.l,t.opacity);t instanceof l||(t=o(t));var e=t.r/255,n=t.g/255,i=t.b/255,r=(nt*i+tt*e-et*n)/(nt+tt-et),a=i-r,s=(Z*(n-r)-X*a)/Y,h=Math.sqrt(s*s+a*a)/(Z*r*(1-r)),u=h?Math.atan2(s,a)*F-120:NaN;return new j(u<0?u+360:u,h,r,t.opacity)}function $(t,e,n,i){return 1===arguments.length?q(t):new j(t,e,n,null==i?1:i)}function j(t,e,n,i){this.h=+t,this.s=+e,this.l=+n,this.opacity=+i}var I=.7,P=1/I,O=/^#([0-9a-f]{3})$/,S=/^#([0-9a-f]{6})$/,_=/^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/,z=/^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/,C=/^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/,L=/^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/,A=/^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/,B=/^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/,D={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};e(i,r,{displayable:function(){return this.rgb().displayable()},toString:function(){return this.rgb()+""}}),e(l,h,n(i,{brighter:function(t){return t=null==t?P:Math.pow(P,t),new l(this.r*t,this.g*t,this.b*t,this.opacity)},darker:function(t){return t=null==t?I:Math.pow(I,t),new l(this.r*t,this.g*t,this.b*t,this.opacity)},rgb:function(){return this},displayable:function(){return 0<=this.r&&this.r<=255&&0<=this.g&&this.g<=255&&0<=this.b&&this.b<=255&&0<=this.opacity&&this.opacity<=1},toString:function(){var t=this.opacity;return t=isNaN(t)?1:Math.max(0,Math.min(1,t)),(1===t?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===t?")":", "+t+")")}})),e(g,d,n(i,{brighter:function(t){return t=null==t?P:Math.pow(P,t),new g(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?I:Math.pow(I,t),new g(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*e,r=2*n-i;return new l(p(t>=240?t-240:t+120,r,i),p(t,r,i),p(t<120?t+240:t-120,r,i),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1}}));var E=Math.PI/180,F=180/Math.PI,G=18,H=.95047,J=1,K=1.08883,Q=4/29,R=6/29,T=3*R*R,U=R*R*R;e(y,b,n(i,{brighter:function(t){return new y(this.l+G*(null==t?1:t),this.a,this.b,this.opacity)},darker:function(t){return new y(this.l-G*(null==t?1:t),this.a,this.b,this.opacity)},rgb:function(){var t=(this.l+16)/116,e=isNaN(this.a)?t:t+this.a/500,n=isNaN(this.b)?t:t-this.b/200;return t=J*m(t),e=H*m(e),n=K*m(n),new l(k(3.2404542*e-1.5371385*t-.4985314*n),k(-.969266*e+1.8760108*t+.041556*n),k(.0556434*e-.2040259*t+1.0572252*n),this.opacity)}})),e(x,v,n(i,{brighter:function(t){return new x(this.h,this.c,this.l+G*(null==t?1:t),this.opacity)},darker:function(t){return new x(this.h,this.c,this.l-G*(null==t?1:t),this.opacity)},rgb:function(){return f(this).rgb()}}));var V=-.14861,W=1.78277,X=-.29227,Y=-.90649,Z=1.97294,tt=Z*Y,et=Z*W,nt=W*X-Y*V;e(j,$,n(i,{brighter:function(t){return t=null==t?P:Math.pow(P,t),new j(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?I:Math.pow(I,t),new j(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=isNaN(this.h)?0:(this.h+120)*E,e=+this.l,n=isNaN(this.s)?0:this.s*e*(1-e),i=Math.cos(t),r=Math.sin(t);return new l(255*(e+n*(V*i+W*r)),255*(e+n*(X*i+Y*r)),255*(e+n*(Z*i)),this.opacity)}})),t.color=r,t.rgb=h,t.hsl=d,t.lab=b,t.hcl=v,t.cubehelix=$,Object.defineProperty(t,"__esModule",{value:!0})})/
// https://d3js.org/d3-format/ Version 1.0.2. Copyright 2016 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(t.d3=t.d3||{})}(this,function(t){"use strict";function n(t,n){if((r=(t=n?t.toExponential(n-1):t.toExponential()).indexOf("e"))<0)return null;var r,e=t.slice(0,r);return[e.length>1?e[0]+e.slice(2):e,+t.slice(r+1)]}function r(t){return t=n(Math.abs(t)),t?t[1]:NaN}function e(t,n){return function(r,e){for(var i=r.length,o=[],a=0,u=t[0],s=0;i>0&&u>0&&(s+u+1>e&&(u=Math.max(1,e-s)),o.push(r.substring(i-=u,i+u)),!((s+=u+1)>e));)u=t[a=(a+1)%t.length];return o.reverse().join(n)}}function i(t,n){t=t.toPrecision(n);t:for(var r,e=t.length,i=1,o=-1;i<e;++i)switch(t[i]){case".":o=r=i;break;case"0":0===o&&(o=i),r=i;break;case"e":break t;default:o>0&&(o=0)}return o>0?t.slice(0,o)+t.slice(r+1):t}function o(t,r){var e=n(t,r);if(!e)return t+"";var i=e[0],o=e[1],a=o-(d=3*Math.max(-8,Math.min(8,Math.floor(o/3))))+1,u=i.length;return a===u?i:a>u?i+new Array(a-u+1).join("0"):a>0?i.slice(0,a)+"."+i.slice(a):"0."+new Array(1-a).join("0")+n(t,Math.max(0,r+a-1))[0]}function a(t,r){var e=n(t,r);if(!e)return t+"";var i=e[0],o=e[1];return o<0?"0."+new Array((-o)).join("0")+i:i.length>o+1?i.slice(0,o+1)+"."+i.slice(o+1):i+new Array(o-i.length+2).join("0")}function u(t){return new s(t)}function s(t){if(!(n=M.exec(t)))throw new Error("invalid format: "+t);var n,r=n[1]||" ",e=n[2]||">",i=n[3]||"-",o=n[4]||"",a=!!n[5],u=n[6]&&+n[6],s=!!n[7],c=n[8]&&+n[8].slice(1),f=n[9]||"";"n"===f?(s=!0,f="g"):p[f]||(f=""),(a||"0"===r&&"="===e)&&(a=!0,r="0",e="="),this.fill=r,this.align=e,this.sign=i,this.symbol=o,this.zero=a,this.width=u,this.comma=s,this.precision=c,this.type=f}function c(t){return t}function f(t){function n(t){function n(t){var n,a,u,c=M,p=x;if("c"===g)p=v(t)+p,t="";else{t=+t;var w=(t<0||1/t<0)&&(t*=-1,!0);if(t=v(t,m),w)for(n=-1,a=t.length,w=!1;++n<a;)if(u=t.charCodeAt(n),48<u&&u<58||"x"===g&&96<u&&u<103||"X"===g&&64<u&&u<71){w=!0;break}if(c=(w?"("===i?i:"-":"-"===i||"("===i?"":i)+c,p=p+("s"===g?y[8+d/3]:"")+(w&&"("===i?")":""),b)for(n=-1,a=t.length;++n<a;)if(u=t.charCodeAt(n),48>u||u>57){p=(46===u?s+t.slice(n+1):t.slice(n))+p,t=t.slice(0,n);break}}l&&!f&&(t=o(t,1/0));var j=c.length+t.length+p.length,P=j<h?new Array(h-j+1).join(r):"";switch(l&&f&&(t=o(P+t,P.length?h-p.length:1/0),P=""),e){case"<":return c+t+p+P;case"=":return c+P+t+p;case"^":return P.slice(0,j=P.length>>1)+c+t+p+P.slice(j)}return P+c+t+p}t=u(t);var r=t.fill,e=t.align,i=t.sign,c=t.symbol,f=t.zero,h=t.width,l=t.comma,m=t.precision,g=t.type,M="$"===c?a[0]:"#"===c&&/[boxX]/.test(g)?"0"+g.toLowerCase():"",x="$"===c?a[1]:/[%p]/.test(g)?"%":"",v=p[g],b=!g||/[defgprs%]/.test(g);return m=null==m?g?6:12:/[gprs]/.test(g)?Math.max(1,Math.min(21,m)):Math.max(0,Math.min(20,m)),n.toString=function(){return t+""},n}function i(t,e){var i=n((t=u(t),t.type="f",t)),o=3*Math.max(-8,Math.min(8,Math.floor(r(e)/3))),a=Math.pow(10,-o),s=y[8+o/3];return function(t){return i(a*t)+s}}var o=t.grouping&&t.thousands?e(t.grouping,t.thousands):c,a=t.currency,s=t.decimal;return{format:n,formatPrefix:i}}function h(n){return x=f(n),t.format=x.format,t.formatPrefix=x.formatPrefix,x}function l(t){return Math.max(0,-r(Math.abs(t)))}function m(t,n){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(r(n)/3)))-r(Math.abs(t)))}function g(t,n){return t=Math.abs(t),n=Math.abs(n)-t,Math.max(0,r(n)-r(t))+1}var d,p={"":i,"%":function(t,n){return(100*t).toFixed(n)},b:function(t){return Math.round(t).toString(2)},c:function(t){return t+""},d:function(t){return Math.round(t).toString(10)},e:function(t,n){return t.toExponential(n)},f:function(t,n){return t.toFixed(n)},g:function(t,n){return t.toPrecision(n)},o:function(t){return Math.round(t).toString(8)},p:function(t,n){return a(100*t,n)},r:a,s:o,X:function(t){return Math.round(t).toString(16).toUpperCase()},x:function(t){return Math.round(t).toString(16)}},M=/^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;s.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(null==this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(null==this.precision?"":"."+Math.max(0,0|this.precision))+this.type};var x,y=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];h({decimal:".",thousands:",",grouping:[3],currency:["$",""]}),t.formatDefaultLocale=h,t.formatLocale=f,t.formatSpecifier=u,t.precisionFixed=l,t.precisionPrefix=m,t.precisionRound=g,Object.defineProperty(t,"__esModule",{value:!0})})/
// https://d3js.org/d3-interpolate/ Version 1.1.1. Copyright 2016 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("d3-color")):"function"==typeof define&&define.amd?define(["exports","d3-color"],n):n(t.d3=t.d3||{},t.d3)}(this,function(t,n){"use strict";function r(t,n,r,e,o){var a=t*t,u=a*t;return((1-3*t+3*a-u)*n+(4-6*a+3*u)*r+(1+3*t+3*a-3*u)*e+u*o)/6}function e(t){var n=t.length-1;return function(e){var o=e<=0?e=0:e>=1?(e=1,n-1):Math.floor(e*n),a=t[o],u=t[o+1],i=o>0?t[o-1]:2*a-u,l=o<n-1?t[o+2]:2*u-a;return r((e-o/n)*n,i,a,u,l)}}function o(t){var n=t.length;return function(e){var o=Math.floor(((e%=1)<0?++e:e)*n),a=t[(o+n-1)%n],u=t[o%n],i=t[(o+1)%n],l=t[(o+2)%n];return r((e-o/n)*n,a,u,i,l)}}function a(t){return function(){return t}}function u(t,n){return function(r){return t+r*n}}function i(t,n,r){return t=Math.pow(t,r),n=Math.pow(n,r)-t,r=1/r,function(e){return Math.pow(t+e*n,r)}}function l(t,n){var r=n-t;return r?u(t,r>180||r<-180?r-360*Math.round(r/360):r):a(isNaN(t)?n:t)}function c(t){return 1===(t=+t)?f:function(n,r){return r-n?i(n,r,t):a(isNaN(n)?r:n)}}function f(t,n){var r=n-t;return r?u(t,r):a(isNaN(t)?n:t)}function s(t){return function(r){var e,o,a=r.length,u=new Array(a),i=new Array(a),l=new Array(a);for(e=0;e<a;++e)o=n.rgb(r[e]),u[e]=o.r||0,i[e]=o.g||0,l[e]=o.b||0;return u=t(u),i=t(i),l=t(l),o.opacity=1,function(t){return o.r=u(t),o.g=i(t),o.b=l(t),o+""}}}function p(t,n){var r,e=n?n.length:0,o=t?Math.min(e,t.length):0,a=new Array(e),u=new Array(e);for(r=0;r<o;++r)a[r]=x(t[r],n[r]);for(;r<e;++r)u[r]=n[r];return function(t){for(r=0;r<o;++r)u[r]=a[r](t);return u}}function h(t,n){var r=new Date;return t=+t,n-=t,function(e){return r.setTime(t+n*e),r}}function d(t,n){return t=+t,n-=t,function(r){return t+n*r}}function g(t,n){var r,e={},o={};null!==t&&"object"==typeof t||(t={}),null!==n&&"object"==typeof n||(n={});for(r in n)r in t?e[r]=x(t[r],n[r]):o[r]=n[r];return function(t){for(r in e)o[r]=e[r](t);return o}}function y(t){return function(){return t}}function v(t){return function(n){return t(n)+""}}function b(t,n){var r,e,o,a=P.lastIndex=O.lastIndex=0,u=-1,i=[],l=[];for(t+="",n+="";(r=P.exec(t))&&(e=O.exec(n));)(o=e.index)>a&&(o=n.slice(a,o),i[u]?i[u]+=o:i[++u]=o),(r=r[0])===(e=e[0])?i[u]?i[u]+=e:i[++u]=e:(i[++u]=null,l.push({i:u,x:d(r,e)})),a=O.lastIndex;return a<n.length&&(o=n.slice(a),i[u]?i[u]+=o:i[++u]=o),i.length<2?l[0]?v(l[0].x):y(n):(n=l.length,function(t){for(var r,e=0;e<n;++e)i[(r=l[e]).i]=r.x(t);return i.join("")})}function x(t,r){var e,o=typeof r;return null==r||"boolean"===o?a(r):("number"===o?d:"string"===o?(e=n.color(r))?(r=e,L):b:r instanceof n.color?L:r instanceof Date?h:Array.isArray(r)?p:isNaN(r)?g:d)(t,r)}function m(t,n){return t=+t,n-=t,function(r){return Math.round(t+n*r)}}function M(t,n,r,e,o,a){var u,i,l;return(u=Math.sqrt(t*t+n*n))&&(t/=u,n/=u),(l=t*r+n*e)&&(r-=t*l,e-=n*l),(i=Math.sqrt(r*r+e*e))&&(r/=i,e/=i,l/=i),t*e<n*r&&(t=-t,n=-n,l=-l,u=-u),{translateX:o,translateY:a,rotate:Math.atan2(n,t)*_,skewX:Math.atan(l)*_,scaleX:u,scaleY:i}}function w(t){return"none"===t?z:(S||(S=document.createElement("DIV"),B=document.documentElement,D=document.defaultView),S.style.transform=t,t=D.getComputedStyle(B.appendChild(S),null).getPropertyValue("transform"),B.removeChild(S),t=t.slice(7,-1).split(","),M(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5]))}function X(t){return null==t?z:(H||(H=document.createElementNS("http://www.w3.org/2000/svg","g")),H.setAttribute("transform",t),(t=H.transform.baseVal.consolidate())?(t=t.matrix,M(t.a,t.b,t.c,t.d,t.e,t.f)):z)}function A(t,n,r,e){function o(t){return t.length?t.pop()+" ":""}function a(t,e,o,a,u,i){if(t!==o||e!==a){var l=u.push("translate(",null,n,null,r);i.push({i:l-4,x:d(t,o)},{i:l-2,x:d(e,a)})}else(o||a)&&u.push("translate("+o+n+a+r)}function u(t,n,r,a){t!==n?(t-n>180?n+=360:n-t>180&&(t+=360),a.push({i:r.push(o(r)+"rotate(",null,e)-2,x:d(t,n)})):n&&r.push(o(r)+"rotate("+n+e)}function i(t,n,r,a){t!==n?a.push({i:r.push(o(r)+"skewX(",null,e)-2,x:d(t,n)}):n&&r.push(o(r)+"skewX("+n+e)}function l(t,n,r,e,a,u){if(t!==r||n!==e){var i=a.push(o(a)+"scale(",null,",",null,")");u.push({i:i-4,x:d(t,r)},{i:i-2,x:d(n,e)})}else 1===r&&1===e||a.push(o(a)+"scale("+r+","+e+")")}return function(n,r){var e=[],o=[];return n=t(n),r=t(r),a(n.translateX,n.translateY,r.translateX,r.translateY,e,o),u(n.rotate,r.rotate,e,o),i(n.skewX,r.skewX,e,o),l(n.scaleX,n.scaleY,r.scaleX,r.scaleY,e,o),n=r=null,function(t){for(var n,r=-1,a=o.length;++r<a;)e[(n=o[r]).i]=n.x(t);return e.join("")}}}function N(t){return((t=Math.exp(t))+1/t)/2}function C(t){return((t=Math.exp(t))-1/t)/2}function Y(t){return((t=Math.exp(2*t))-1)/(t+1)}function j(t,n){var r,e,o=t[0],a=t[1],u=t[2],i=n[0],l=n[1],c=n[2],f=i-o,s=l-a,p=f*f+s*s;if(p<K)e=Math.log(c/u)/F,r=function(t){return[o+t*f,a+t*s,u*Math.exp(F*t*e)]};else{var h=Math.sqrt(p),d=(c*c-u*u+J*p)/(2*u*G*h),g=(c*c-u*u-J*p)/(2*c*G*h),y=Math.log(Math.sqrt(d*d+1)-d),v=Math.log(Math.sqrt(g*g+1)-g);e=(v-y)/F,r=function(t){var n=t*e,r=N(y),i=u/(G*h)*(r*Y(F*n+y)-C(y));return[o+i*f,a+i*s,u*r/N(F*n+y)]}}return r.duration=1e3*e,r}function q(t){return function(r,e){var o=t((r=n.hsl(r)).h,(e=n.hsl(e)).h),a=f(r.s,e.s),u=f(r.l,e.l),i=f(r.opacity,e.opacity);return function(t){return r.h=o(t),r.s=a(t),r.l=u(t),r.opacity=i(t),r+""}}}function k(t,r){var e=f((t=n.lab(t)).l,(r=n.lab(r)).l),o=f(t.a,r.a),a=f(t.b,r.b),u=f(t.opacity,r.opacity);return function(n){return t.l=e(n),t.a=o(n),t.b=a(n),t.opacity=u(n),t+""}}function R(t){return function(r,e){var o=t((r=n.hcl(r)).h,(e=n.hcl(e)).h),a=f(r.c,e.c),u=f(r.l,e.l),i=f(r.opacity,e.opacity);return function(t){return r.h=o(t),r.c=a(t),r.l=u(t),r.opacity=i(t),r+""}}}function E(t){return function r(e){function o(r,o){var a=t((r=n.cubehelix(r)).h,(o=n.cubehelix(o)).h),u=f(r.s,o.s),i=f(r.l,o.l),l=f(r.opacity,o.opacity);return function(t){return r.h=a(t),r.s=u(t),r.l=i(Math.pow(t,e)),r.opacity=l(t),r+""}}return e=+e,o.gamma=r,o}(1)}function I(t,n){for(var r=new Array(n),e=0;e<n;++e)r[e]=t(e/(n-1));return r}var S,B,D,H,L=function t(r){function e(t,r){var e=o((t=n.rgb(t)).r,(r=n.rgb(r)).r),a=o(t.g,r.g),u=o(t.b,r.b),i=o(t.opacity,r.opacity);return function(n){return t.r=e(n),t.g=a(n),t.b=u(n),t.opacity=i(n),t+""}}var o=c(r);return e.gamma=t,e}(1),T=s(e),V=s(o),P=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,O=new RegExp(P.source,"g"),_=180/Math.PI,z={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1},Q=A(w,"px, ","px)","deg)"),Z=A(X,", ",")",")"),F=Math.SQRT2,G=2,J=4,K=1e-12,U=q(l),W=q(f),$=R(l),tt=R(f),nt=E(l),rt=E(f);t.interpolate=x,t.interpolateArray=p,t.interpolateBasis=e,t.interpolateBasisClosed=o,t.interpolateDate=h,t.interpolateNumber=d,t.interpolateObject=g,t.interpolateRound=m,t.interpolateString=b,t.interpolateTransformCss=Q,t.interpolateTransformSvg=Z,t.interpolateZoom=j,t.interpolateRgb=L,t.interpolateRgbBasis=T,t.interpolateRgbBasisClosed=V,t.interpolateHsl=U,t.interpolateHslLong=W,t.interpolateLab=k,t.interpolateHcl=$,t.interpolateHclLong=tt,t.interpolateCubehelix=nt,t.interpolateCubehelixLong=rt,t.quantize=I,Object.defineProperty(t,"__esModule",{value:!0})})/
// https://d3js.org/d3-scale/ Version 1.0.3. Copyright 2016 Mike Bostock.
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("d3-array"),require("d3-collection"),require("d3-interpolate"),require("d3-format"),require("d3-time"),require("d3-time-format"),require("d3-color")):"function"==typeof define&&define.amd?define(["exports","d3-array","d3-collection","d3-interpolate","d3-format","d3-time","d3-time-format","d3-color"],n):n(e.d3=e.d3||{},e.d3,e.d3,e.d3,e.d3,e.d3,e.d3,e.d3)}(this,function(e,n,a,f,c,t,r,d){"use strict";function i(e){function n(n){var a=n+"",r=f.get(a);if(!r){if(t!==X)return t;f.set(a,r=c.push(n))}return e[(r-1)%e.length]}var f=a.map(),c=[],t=X;return e=null==e?[]:K.call(e),n.domain=function(e){if(!arguments.length)return c.slice();c=[],f=a.map();for(var t,r,d=-1,i=e.length;++d<i;)f.has(r=(t=e[d])+"")||f.set(r,c.push(t));return n},n.range=function(a){return arguments.length?(e=K.call(a),n):e.slice()},n.unknown=function(e){return arguments.length?(t=e,n):t},n.copy=function(){return i().domain(c).range(e).unknown(t)},n}function u(){function e(){var e=t().length,c=d[1]<d[0],i=d[c-0],u=d[1-c];a=(u-i)/Math.max(1,e-o+2*l),b&&(a=Math.floor(a)),i+=(u-i-a*(e-o))*h,f=a*(1-o),b&&(i=Math.round(i),f=Math.round(f));var s=n.range(e).map(function(e){return i+a*e});return r(c?s.reverse():s)}var a,f,c=i().unknown(void 0),t=c.domain,r=c.range,d=[0,1],b=!1,o=0,l=0,h=.5;return delete c.unknown,c.domain=function(n){return arguments.length?(t(n),e()):t()},c.range=function(n){return arguments.length?(d=[+n[0],+n[1]],e()):d.slice()},c.rangeRound=function(n){return d=[+n[0],+n[1]],b=!0,e()},c.bandwidth=function(){return f},c.step=function(){return a},c.round=function(n){return arguments.length?(b=!!n,e()):b},c.padding=function(n){return arguments.length?(o=l=Math.max(0,Math.min(1,n)),e()):o},c.paddingInner=function(n){return arguments.length?(o=Math.max(0,Math.min(1,n)),e()):o},c.paddingOuter=function(n){return arguments.length?(l=Math.max(0,Math.min(1,n)),e()):l},c.align=function(n){return arguments.length?(h=Math.max(0,Math.min(1,n)),e()):h},c.copy=function(){return u().domain(t()).range(d).round(b).paddingInner(o).paddingOuter(l).align(h)},e()}function b(e){var n=e.copy;return e.padding=e.paddingOuter,delete e.paddingInner,delete e.paddingOuter,e.copy=function(){return b(n())},e}function o(){return b(u().paddingInner(1))}function l(e){return function(){return e}}function h(e){return+e}function s(e,n){return(n-=e=+e)?function(a){return(a-e)/n}:l(n)}function g(e){return function(n,a){var f=e(n=+n,a=+a);return function(e){return e<=n?0:e>=a?1:f(e)}}}function p(e){return function(n,a){var f=e(n=+n,a=+a);return function(e){return e<=0?n:e>=1?a:f(e)}}}function m(e,n,a,f){var c=e[0],t=e[1],r=n[0],d=n[1];return t<c?(c=a(t,c),r=f(d,r)):(c=a(c,t),r=f(r,d)),function(e){return r(c(e))}}function M(e,a,f,c){var t=Math.min(e.length,a.length)-1,r=new Array(t),d=new Array(t),i=-1;for(e[t]<e[0]&&(e=e.slice().reverse(),a=a.slice().reverse());++i<t;)r[i]=f(e[i],e[i+1]),d[i]=c(a[i],a[i+1]);return function(a){var f=n.bisect(e,a,1,t)-1;return d[f](r[f](a))}}function v(e,n){return n.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp())}function x(e,n){function a(){return t=Math.min(i.length,u.length)>2?M:m,r=d=null,c}function c(n){return(r||(r=t(i,u,o?g(e):e,b)))(+n)}var t,r,d,i=Z,u=Z,b=f.interpolate,o=!1;return c.invert=function(e){return(d||(d=t(u,i,s,o?p(n):n)))(+e)},c.domain=function(e){return arguments.length?(i=J.call(e,h),a()):i.slice()},c.range=function(e){return arguments.length?(u=K.call(e),a()):u.slice()},c.rangeRound=function(e){return u=K.call(e),b=f.interpolateRound,a()},c.clamp=function(e){return arguments.length?(o=!!e,a()):o},c.interpolate=function(e){return arguments.length?(b=e,a()):b},a()}function y(e,a,f){var t,r=e[0],d=e[e.length-1],i=n.tickStep(r,d,null==a?10:a);switch(f=c.formatSpecifier(null==f?",f":f),f.type){case"s":var u=Math.max(Math.abs(r),Math.abs(d));return null!=f.precision||isNaN(t=c.precisionPrefix(i,u))||(f.precision=t),c.formatPrefix(f,u);case"":case"e":case"g":case"p":case"r":null!=f.precision||isNaN(t=c.precisionRound(i,Math.max(Math.abs(r),Math.abs(d))))||(f.precision=t-("e"===f.type));break;case"f":case"%":null!=f.precision||isNaN(t=c.precisionFixed(i))||(f.precision=t-2*("%"===f.type))}return c.format(f)}function w(e){var a=e.domain;return e.ticks=function(e){var f=a();return n.ticks(f[0],f[f.length-1],null==e?10:e)},e.tickFormat=function(e,n){return y(a(),e,n)},e.nice=function(f){var c=a(),t=c.length-1,r=null==f?10:f,d=c[0],i=c[t],u=n.tickStep(d,i,r);return u&&(u=n.tickStep(Math.floor(d/u)*u,Math.ceil(i/u)*u,r),c[0]=Math.floor(d/u)*u,c[t]=Math.ceil(i/u)*u,a(c)),e},e}function k(){var e=x(s,f.interpolateNumber);return e.copy=function(){return v(e,k())},w(e)}function N(){function e(e){return+e}var n=[0,1];return e.invert=e,e.domain=e.range=function(a){return arguments.length?(n=J.call(a,h),e):n.slice()},e.copy=function(){return N().domain(n)},w(e)}function q(e,n){e=e.slice();var a,f=0,c=e.length-1,t=e[f],r=e[c];return r<t&&(a=f,f=c,c=a,a=t,t=r,r=a),e[f]=n.floor(t),e[c]=n.ceil(r),e}function C(e,n){return(n=Math.log(n/e))?function(a){return Math.log(a/e)/n}:l(n)}function D(e,n){return e<0?function(a){return-Math.pow(-n,a)*Math.pow(-e,1-a)}:function(a){return Math.pow(n,a)*Math.pow(e,1-a)}}function S(e){return isFinite(e)?+("1e"+e):e<0?0:e}function I(e){return 10===e?S:e===Math.E?Math.exp:function(n){return Math.pow(e,n)}}function O(e){return e===Math.E?Math.log:10===e&&Math.log10||2===e&&Math.log2||(e=Math.log(e),function(n){return Math.log(n)/e})}function F(e){return function(n){return-e(-n)}}function L(){function e(){return r=O(t),d=I(t),f()[0]<0&&(r=F(r),d=F(d)),a}var a=x(C,D).domain([1,10]),f=a.domain,t=10,r=O(10),d=I(10);return a.base=function(n){return arguments.length?(t=+n,e()):t},a.domain=function(n){return arguments.length?(f(n),e()):f()},a.ticks=function(e){var a,c=f(),i=c[0],u=c[c.length-1];(a=u<i)&&(h=i,i=u,u=h);var b,o,l,h=r(i),s=r(u),g=null==e?10:+e,p=[];if(!(t%1)&&s-h<g){if(h=Math.round(h)-1,s=Math.round(s)+1,i>0){for(;h<s;++h)for(o=1,b=d(h);o<t;++o)if(l=b*o,!(l<i)){if(l>u)break;p.push(l)}}else for(;h<s;++h)for(o=t-1,b=d(h);o>=1;--o)if(l=b*o,!(l<i)){if(l>u)break;p.push(l)}}else p=n.ticks(h,s,Math.min(s-h,g)).map(d);return a?p.reverse():p},a.tickFormat=function(e,n){if(null==n&&(n=10===t?".0e":","),"function"!=typeof n&&(n=c.format(n)),e===1/0)return n;null==e&&(e=10);var f=Math.max(1,t*e/a.ticks().length);return function(e){var a=e/d(Math.round(r(e)));return a*t<t-.5&&(a*=t),a<=f?n(e):""}},a.nice=function(){return f(q(f(),{floor:function(e){return d(Math.floor(r(e)))},ceil:function(e){return d(Math.ceil(r(e)))}}))},a.copy=function(){return v(a,L().base(t))},a}function P(e,n){return e<0?-Math.pow(-e,n):Math.pow(e,n)}function A(){function e(e,n){return(n=P(n,a)-(e=P(e,a)))?function(f){return(P(f,a)-e)/n}:l(n)}function n(e,n){return n=P(n,a)-(e=P(e,a)),function(f){return P(e+n*f,1/a)}}var a=1,f=x(e,n),c=f.domain;return f.exponent=function(e){return arguments.length?(a=+e,c(c())):a},f.copy=function(){return v(f,A().exponent(a))},w(f)}function E(){return A().exponent(.5)}function R(){function e(){var e=0,r=Math.max(1,c.length);for(t=new Array(r-1);++e<r;)t[e-1]=n.quantile(f,e/r);return a}function a(e){if(!isNaN(e=+e))return c[n.bisect(t,e)]}var f=[],c=[],t=[];return a.invertExtent=function(e){var n=c.indexOf(e);return n<0?[NaN,NaN]:[n>0?t[n-1]:f[0],n<t.length?t[n]:f[f.length-1]]},a.domain=function(a){if(!arguments.length)return f.slice();f=[];for(var c,t=0,r=a.length;t<r;++t)c=a[t],null==c||isNaN(c=+c)||f.push(c);return f.sort(n.ascending),e()},a.range=function(n){return arguments.length?(c=K.call(n),e()):c.slice()},a.quantiles=function(){return t.slice()},a.copy=function(){return R().domain(f).range(c)},a}function T(){function e(e){if(e<=e)return d[n.bisect(r,e,0,t)]}function a(){var n=-1;for(r=new Array(t);++n<t;)r[n]=((n+1)*c-(n-t)*f)/(t+1);return e}var f=0,c=1,t=1,r=[.5],d=[0,1];return e.domain=function(e){return arguments.length?(f=+e[0],c=+e[1],a()):[f,c]},e.range=function(e){return arguments.length?(t=(d=K.call(e)).length-1,a()):d.slice()},e.invertExtent=function(e){var n=d.indexOf(e);return n<0?[NaN,NaN]:n<1?[f,r[0]]:n>=t?[r[t-1],c]:[r[n-1],r[n]]},e.copy=function(){return T().domain([f,c]).range(d)},w(e)}function U(){function e(e){if(e<=e)return f[n.bisect(a,e,0,c)]}var a=[.5],f=[0,1],c=1;return e.domain=function(n){return arguments.length?(a=K.call(n),c=Math.min(a.length,f.length-1),e):a.slice()},e.range=function(n){return arguments.length?(f=K.call(n),c=Math.min(a.length,f.length-1),e):f.slice()},e.invertExtent=function(e){var n=f.indexOf(e);return[a[n-1],a[n]]},e.copy=function(){return U().domain(a).range(f)},e}function W(e){return new Date(e)}function Y(e){return e instanceof Date?+e:+new Date((+e))}function j(e,a,c,t,r,d,i,u,b){function o(n){return(i(n)<n?m:d(n)<n?M:r(n)<n?y:t(n)<n?w:a(n)<n?c(n)<n?k:N:e(n)<n?C:D)(n)}function l(a,f,c,t){if(null==a&&(a=10),"number"==typeof a){var r=Math.abs(c-f)/a,d=n.bisector(function(e){return e[2]}).right(S,r);d===S.length?(t=n.tickStep(f/te,c/te,a),a=e):d?(d=S[r/S[d-1][2]<S[d][2]/r?d-1:d],t=d[1],a=d[0]):(t=n.tickStep(f,c,a),a=u)}return null==t?a:a.every(t)}var h=x(s,f.interpolateNumber),g=h.invert,p=h.domain,m=b(".%L"),M=b(":%S"),y=b("%I:%M"),w=b("%I %p"),k=b("%a %d"),N=b("%b %d"),C=b("%B"),D=b("%Y"),S=[[i,1,$],[i,5,5*$],[i,15,15*$],[i,30,30*$],[d,1,ee],[d,5,5*ee],[d,15,15*ee],[d,30,30*ee],[r,1,ne],[r,3,3*ne],[r,6,6*ne],[r,12,12*ne],[t,1,ae],[t,2,2*ae],[c,1,fe],[a,1,ce],[a,3,3*ce],[e,1,te]];return h.invert=function(e){return new Date(g(e))},h.domain=function(e){return arguments.length?p(J.call(e,Y)):p().map(W)},h.ticks=function(e,n){var a,f=p(),c=f[0],t=f[f.length-1],r=t<c;return r&&(a=c,c=t,t=a),a=l(e,c,t,n),a=a?a.range(c,t+1):[],r?a.reverse():a},h.tickFormat=function(e,n){return null==n?o:b(n)},h.nice=function(e,n){var a=p();return(e=l(e,a[0],a[a.length-1],n))?p(q(a,e)):h},h.copy=function(){return v(h,j(e,a,c,t,r,d,i,u,b))},h}function B(){return j(t.timeYear,t.timeMonth,t.timeWeek,t.timeDay,t.timeHour,t.timeMinute,t.timeSecond,t.timeMillisecond,r.timeFormat).domain([new Date(2e3,0,1),new Date(2e3,0,2)])}function H(){return j(t.utcYear,t.utcMonth,t.utcWeek,t.utcDay,t.utcHour,t.utcMinute,t.utcSecond,t.utcMillisecond,r.utcFormat).domain([Date.UTC(2e3,0,1),Date.UTC(2e3,0,2)])}function Q(e){return e.match(/.{6}/g).map(function(e){return"#"+e})}function _(e){(e<0||e>1)&&(e-=Math.floor(e));var n=Math.abs(e-.5);return he.h=360*e-100,he.s=1.5-1.5*n,he.l=.8-.9*n,he+""}function z(e){var n=e.length;return function(a){return e[Math.max(0,Math.min(n-1,Math.floor(a*n)))]}}function V(e){function n(n){var t=(n-a)/(f-a);return e(c?Math.max(0,Math.min(1,t)):t)}var a=0,f=1,c=!1;return n.domain=function(e){return arguments.length?(a=+e[0],f=+e[1],n):[a,f]},n.clamp=function(e){return arguments.length?(c=!!e,n):c},n.interpolator=function(a){return arguments.length?(e=a,n):e},n.copy=function(){return V(e).domain([a,f]).clamp(c)},w(n)}var G=Array.prototype,J=G.map,K=G.slice,X={name:"implicit"},Z=[0,1],$=1e3,ee=60*$,ne=60*ee,ae=24*ne,fe=7*ae,ce=30*ae,te=365*ae,re=Q("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"),de=Q("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6"),ie=Q("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9"),ue=Q("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5"),be=f.interpolateCubehelixLong(d.cubehelix(300,.5,0),d.cubehelix(-240,.5,1)),oe=f.interpolateCubehelixLong(d.cubehelix(-100,.75,.35),d.cubehelix(80,1.5,.8)),le=f.interpolateCubehelixLong(d.cubehelix(260,.75,.35),d.cubehelix(80,1.5,.8)),he=d.cubehelix(),se=z(Q("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725")),ge=z(Q("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf")),pe=z(Q("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4")),me=z(Q("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));e.scaleBand=u,e.scalePoint=o,e.scaleIdentity=N,e.scaleLinear=k,e.scaleLog=L,e.scaleOrdinal=i,e.scaleImplicit=X,e.scalePow=A,e.scaleSqrt=E,e.scaleQuantile=R,e.scaleQuantize=T,e.scaleThreshold=U,e.scaleTime=B,e.scaleUtc=H,e.schemeCategory10=re,e.schemeCategory20b=de,e.schemeCategory20c=ie,e.schemeCategory20=ue,e.interpolateCubehelixDefault=be,e.interpolateRainbow=_,e.interpolateWarm=oe,e.interpolateCool=le,e.interpolateViridis=se,e.interpolateMagma=ge,e.interpolateInferno=pe,e.interpolatePlasma=me,e.scaleSequential=V,Object.defineProperty(e,"__esModule",{value:!0})})/
// https://d3js.org/d3-time-format/ Version 2.0.2. Copyright 2016 Mike Bostock.
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("d3-time")):"function"==typeof define&&define.amd?define(["exports","d3-time"],t):t(n.d3=n.d3||{},n.d3)}(this,function(n,t){"use strict";function e(n){if(0<=n.y&&n.y<100){var t=new Date((-1),n.m,n.d,n.H,n.M,n.S,n.L);return t.setFullYear(n.y),t}return new Date(n.y,n.m,n.d,n.H,n.M,n.S,n.L)}function r(n){if(0<=n.y&&n.y<100){var t=new Date(Date.UTC(-1,n.m,n.d,n.H,n.M,n.S,n.L));return t.setUTCFullYear(n.y),t}return new Date(Date.UTC(n.y,n.m,n.d,n.H,n.M,n.S,n.L))}function u(n){return{y:n,m:0,d:1,H:0,M:0,S:0,L:0}}function o(n){function t(n,t){return function(e){var r,u,o,c=[],i=-1,a=0,f=n.length;for(e instanceof Date||(e=new Date((+e)));++i<f;)37===n.charCodeAt(i)&&(c.push(n.slice(a,i)),null!=(u=rn[r=n.charAt(++i)])?r=n.charAt(++i):u="e"===r?" ":"0",(o=t[r])&&(r=o(e,u)),c.push(r),a=i+1);return c.push(n.slice(a,i)),c.join("")}}function o(n,t){return function(e){var o=u(1900),i=c(o,n,e+="",0);if(i!=e.length)return null;if("p"in o&&(o.H=o.H%12+12*o.p),"W"in o||"U"in o){"w"in o||(o.w="W"in o?1:0);var a="Z"in o?r(u(o.y)).getUTCDay():t(u(o.y)).getDay();o.m=0,o.d="W"in o?(o.w+6)%7+7*o.W-(a+5)%7:o.w+7*o.U-(a+6)%7}return"Z"in o?(o.H+=o.Z/100|0,o.M+=o.Z%100,r(o)):t(o)}}function c(n,t,e,r){for(var u,o,c=0,i=t.length,a=e.length;c<i;){if(r>=a)return-1;if(u=t.charCodeAt(c++),37===u){if(u=t.charAt(c++),o=Jn[u in rn?t.charAt(c++):u],!o||(r=o(n,e,r))<0)return-1}else if(u!=e.charCodeAt(r++))return-1}return r}function i(n,t,e){var r=Un.exec(t.slice(e));return r?(n.p=Hn[r[0].toLowerCase()],e+r[0].length):-1}function V(n,t,e){var r=Yn.exec(t.slice(e));return r?(n.w=An[r[0].toLowerCase()],e+r[0].length):-1}function nn(n,t,e){var r=Fn.exec(t.slice(e));return r?(n.w=Ln[r[0].toLowerCase()],e+r[0].length):-1}function tn(n,t,e){var r=Wn.exec(t.slice(e));return r?(n.m=jn[r[0].toLowerCase()],e+r[0].length):-1}function en(n,t,e){var r=bn.exec(t.slice(e));return r?(n.m=Zn[r[0].toLowerCase()],e+r[0].length):-1}function un(n,t,e){return c(n,Mn,t,e)}function on(n,t,e){return c(n,pn,t,e)}function cn(n,t,e){return c(n,xn,t,e)}function an(n){return Dn[n.getDay()]}function fn(n){return Cn[n.getDay()]}function ln(n){return wn[n.getMonth()]}function sn(n){return Tn[n.getMonth()]}function gn(n){return Sn[+(n.getHours()>=12)]}function dn(n){return Dn[n.getUTCDay()]}function hn(n){return Cn[n.getUTCDay()]}function yn(n){return wn[n.getUTCMonth()]}function mn(n){return Tn[n.getUTCMonth()]}function vn(n){return Sn[+(n.getUTCHours()>=12)]}var Mn=n.dateTime,pn=n.date,xn=n.time,Sn=n.periods,Cn=n.days,Dn=n.shortDays,Tn=n.months,wn=n.shortMonths,Un=a(Sn),Hn=f(Sn),Fn=a(Cn),Ln=f(Cn),Yn=a(Dn),An=f(Dn),bn=a(Tn),Zn=f(Tn),Wn=a(wn),jn=f(wn),Pn={a:an,A:fn,b:ln,B:sn,c:null,d:T,e:T,H:w,I:U,j:H,L:F,m:L,M:Y,p:gn,S:A,U:b,w:Z,W:W,x:null,X:null,y:j,Y:P,Z:I,"%":Q},In={a:dn,A:hn,b:yn,B:mn,c:null,d:J,e:J,H:O,I:X,j:N,L:B,m:_,M:$,p:vn,S:q,U:z,w:E,W:R,x:null,X:null,y:k,Y:G,Z:K,"%":Q},Jn={a:V,A:nn,b:tn,B:en,c:un,d:v,e:v,H:p,I:p,j:M,L:C,m:m,M:x,p:i,S:S,U:s,w:l,W:g,x:on,X:cn,y:h,Y:d,Z:y,"%":D};return Pn.x=t(pn,Pn),Pn.X=t(xn,Pn),Pn.c=t(Mn,Pn),In.x=t(pn,In),In.X=t(xn,In),In.c=t(Mn,In),{format:function(n){var e=t(n+="",Pn);return e.toString=function(){return n},e},parse:function(n){var t=o(n+="",e);return t.toString=function(){return n},t},utcFormat:function(n){var e=t(n+="",In);return e.toString=function(){return n},e},utcParse:function(n){var t=o(n,r);return t.toString=function(){return n},t}}}function c(n,t,e){var r=n<0?"-":"",u=(r?-n:n)+"",o=u.length;return r+(o<e?new Array(e-o+1).join(t)+u:u)}function i(n){return n.replace(cn,"\\$&")}function a(n){return new RegExp("^(?:"+n.map(i).join("|")+")","i")}function f(n){for(var t={},e=-1,r=n.length;++e<r;)t[n[e].toLowerCase()]=e;return t}function l(n,t,e){var r=un.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function s(n,t,e){var r=un.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function g(n,t,e){var r=un.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function d(n,t,e){var r=un.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function h(n,t,e){var r=un.exec(t.slice(e,e+2));return r?(n.y=+r[0]+(+r[0]>68?1900:2e3),e+r[0].length):-1}function y(n,t,e){var r=/^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(t.slice(e,e+6));return r?(n.Z=r[1]?0:-(r[2]+(r[3]||"00")),e+r[0].length):-1}function m(n,t,e){var r=un.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function v(n,t,e){var r=un.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function M(n,t,e){var r=un.exec(t.slice(e,e+3));return r?(n.m=0,n.d=+r[0],e+r[0].length):-1}function p(n,t,e){var r=un.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function x(n,t,e){var r=un.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function S(n,t,e){var r=un.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function C(n,t,e){var r=un.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function D(n,t,e){var r=on.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function T(n,t){return c(n.getDate(),t,2)}function w(n,t){return c(n.getHours(),t,2)}function U(n,t){return c(n.getHours()%12||12,t,2)}function H(n,e){return c(1+t.timeDay.count(t.timeYear(n),n),e,3)}function F(n,t){return c(n.getMilliseconds(),t,3)}function L(n,t){return c(n.getMonth()+1,t,2)}function Y(n,t){return c(n.getMinutes(),t,2)}function A(n,t){return c(n.getSeconds(),t,2)}function b(n,e){return c(t.timeSunday.count(t.timeYear(n),n),e,2)}function Z(n){return n.getDay()}function W(n,e){return c(t.timeMonday.count(t.timeYear(n),n),e,2)}function j(n,t){return c(n.getFullYear()%100,t,2)}function P(n,t){return c(n.getFullYear()%1e4,t,4)}function I(n){var t=n.getTimezoneOffset();return(t>0?"-":(t*=-1,"+"))+c(t/60|0,"0",2)+c(t%60,"0",2)}function J(n,t){return c(n.getUTCDate(),t,2)}function O(n,t){return c(n.getUTCHours(),t,2)}function X(n,t){return c(n.getUTCHours()%12||12,t,2)}function N(n,e){return c(1+t.utcDay.count(t.utcYear(n),n),e,3)}function B(n,t){return c(n.getUTCMilliseconds(),t,3)}function _(n,t){return c(n.getUTCMonth()+1,t,2)}function $(n,t){return c(n.getUTCMinutes(),t,2)}function q(n,t){return c(n.getUTCSeconds(),t,2)}function z(n,e){return c(t.utcSunday.count(t.utcYear(n),n),e,2)}function E(n){return n.getUTCDay()}function R(n,e){return c(t.utcMonday.count(t.utcYear(n),n),e,2)}function k(n,t){return c(n.getUTCFullYear()%100,t,2)}function G(n,t){return c(n.getUTCFullYear()%1e4,t,4)}function K(){return"+0000"}function Q(){return"%"}function V(t){return en=o(t),n.timeFormat=en.format,n.timeParse=en.parse,n.utcFormat=en.utcFormat,n.utcParse=en.utcParse,en}function nn(n){return n.toISOString()}function tn(n){var t=new Date(n);return isNaN(t)?null:t}var en,rn={"-":"",_:" ",0:"0"},un=/^\s*\d+/,on=/^%/,cn=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;V({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});var an="%Y-%m-%dT%H:%M:%S.%LZ",fn=Date.prototype.toISOString?nn:n.utcFormat(an),ln=+new Date("2000-01-01T00:00:00.000Z")?tn:n.utcParse(an);n.timeFormatDefaultLocale=V,n.timeFormatLocale=o,n.isoFormat=fn,n.isoParse=ln,Object.defineProperty(n,"__esModule",{value:!0})})/
// https://d3js.org/d3-time/ Version 1.0.3. Copyright 2016 Mike Bostock.
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.d3=t.d3||{})}(this,function(t){"use strict";function e(t,n,u,i){function a(e){return t(e=new Date(+e)),e}return a.floor=a,a.ceil=function(e){return t(e=new Date(e-1)),n(e,1),t(e),e},a.round=function(t){var e=a(t),n=a.ceil(t);return t-e<n-t?e:n},a.offset=function(t,e){return n(t=new Date(+t),null==e?1:Math.floor(e)),t},a.range=function(e,u,r){var o=[];if(e=a.ceil(e),r=null==r?1:Math.floor(r),!(e<u&&r>0))return o;do o.push(new Date(+e));while(n(e,r),t(e),e<u);return o},a.filter=function(u){return e(function(e){for(;t(e),!u(e);)e.setTime(e-1)},function(t,e){for(;--e>=0;)for(;n(t,1),!u(t););})},u&&(a.count=function(e,n){return r.setTime(+e),o.setTime(+n),t(r),t(o),Math.floor(u(r,o))},a.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?a.filter(i?function(e){return i(e)%t===0}:function(e){return a.count(0,e)%t===0}):a:null}),a}function n(t){return e(function(e){e.setDate(e.getDate()-(e.getDay()+7-t)%7),e.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+7*e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*s)/g})}function u(t){return e(function(e){e.setUTCDate(e.getUTCDate()-(e.getUTCDay()+7-t)%7),e.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+7*e)},function(t,e){return(e-t)/g})}var r=new Date,o=new Date,i=e(function(){},function(t,e){t.setTime(+t+e)},function(t,e){return e-t});i.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?e(function(e){e.setTime(Math.floor(e/t)*t)},function(e,n){e.setTime(+e+n*t)},function(e,n){return(n-e)/t}):i:null};var a=i.range,c=1e3,s=6e4,f=36e5,l=864e5,g=6048e5,T=e(function(t){t.setTime(Math.floor(t/c)*c)},function(t,e){t.setTime(+t+e*c)},function(t,e){return(e-t)/c},function(t){return t.getUTCSeconds()}),d=T.range,m=e(function(t){t.setTime(Math.floor(t/s)*s)},function(t,e){t.setTime(+t+e*s)},function(t,e){return(e-t)/s},function(t){return t.getMinutes()}),M=m.range,y=e(function(t){var e=t.getTimezoneOffset()*s%f;e<0&&(e+=f),t.setTime(Math.floor((+t-e)/f)*f+e)},function(t,e){t.setTime(+t+e*f)},function(t,e){return(e-t)/f},function(t){return t.getHours()}),h=y.range,C=e(function(t){t.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*s)/l},function(t){return t.getDate()-1}),U=C.range,F=n(0),D=n(1),Y=n(2),H=n(3),S=n(4),v=n(5),p=n(6),W=F.range,w=D.range,O=Y.range,z=H.range,k=S.range,x=v.range,b=p.range,j=e(function(t){t.setDate(1),t.setHours(0,0,0,0)},function(t,e){t.setMonth(t.getMonth()+e)},function(t,e){return e.getMonth()-t.getMonth()+12*(e.getFullYear()-t.getFullYear())},function(t){return t.getMonth()}),_=j.range,I=e(function(t){t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,e){t.setFullYear(t.getFullYear()+e)},function(t,e){return e.getFullYear()-t.getFullYear()},function(t){return t.getFullYear()});I.every=function(t){return isFinite(t=Math.floor(t))&&t>0?e(function(e){e.setFullYear(Math.floor(e.getFullYear()/t)*t),e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,n){e.setFullYear(e.getFullYear()+n*t)}):null};var P=I.range,q=e(function(t){t.setUTCSeconds(0,0)},function(t,e){t.setTime(+t+e*s)},function(t,e){return(e-t)/s},function(t){return t.getUTCMinutes()}),A=q.range,B=e(function(t){t.setUTCMinutes(0,0,0)},function(t,e){t.setTime(+t+e*f)},function(t,e){return(e-t)/f},function(t){return t.getUTCHours()}),E=B.range,G=e(function(t){t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+e)},function(t,e){return(e-t)/l},function(t){return t.getUTCDate()-1}),J=G.range,K=u(0),L=u(1),N=u(2),Q=u(3),R=u(4),V=u(5),X=u(6),Z=K.range,$=L.range,tt=N.range,et=Q.range,nt=R.range,ut=V.range,rt=X.range,ot=e(function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCMonth(t.getUTCMonth()+e)},function(t,e){return e.getUTCMonth()-t.getUTCMonth()+12*(e.getUTCFullYear()-t.getUTCFullYear())},function(t){return t.getUTCMonth()}),it=ot.range,at=e(function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCFullYear(t.getUTCFullYear()+e)},function(t,e){return e.getUTCFullYear()-t.getUTCFullYear()},function(t){return t.getUTCFullYear()});at.every=function(t){return isFinite(t=Math.floor(t))&&t>0?e(function(e){e.setUTCFullYear(Math.floor(e.getUTCFullYear()/t)*t),e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,n){e.setUTCFullYear(e.getUTCFullYear()+n*t)}):null};var ct=at.range;t.timeInterval=e,t.timeMillisecond=i,t.timeMilliseconds=a,t.utcMillisecond=i,t.utcMilliseconds=a,t.timeSecond=T,t.timeSeconds=d,t.utcSecond=T,t.utcSeconds=d,t.timeMinute=m,t.timeMinutes=M,t.timeHour=y,t.timeHours=h,t.timeDay=C,t.timeDays=U,t.timeWeek=F,t.timeWeeks=W,t.timeSunday=F,t.timeSundays=W,t.timeMonday=D,t.timeMondays=w,t.timeTuesday=Y,t.timeTuesdays=O,t.timeWednesday=H,t.timeWednesdays=z,t.timeThursday=S,t.timeThursdays=k,t.timeFriday=v,t.timeFridays=x,t.timeSaturday=p,t.timeSaturdays=b,t.timeMonth=j,t.timeMonths=_,t.timeYear=I,t.timeYears=P,t.utcMinute=q,t.utcMinutes=A,t.utcHour=B,t.utcHours=E,t.utcDay=G,t.utcDays=J,t.utcWeek=K,t.utcWeeks=Z,t.utcSunday=K,t.utcSundays=Z,t.utcMonday=L,t.utcMondays=$,t.utcTuesday=N,t.utcTuesdays=tt,t.utcWednesday=Q,t.utcWednesdays=et,t.utcThursday=R,t.utcThursdays=nt,t.utcFriday=V,t.utcFridays=ut,t.utcSaturday=X,t.utcSaturdays=rt,t.utcMonth=ot,t.utcMonths=it,t.utcYear=at,t.utcYears=ct,Object.defineProperty(t,"__esModule",{value:!0})});


(function (global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) :
	typeof define === "function" && define.amd ? define(["exports"], factory) :
	(factory((global.three_d = global.three_d || {})));
}(this, (function (exports) {
"use strict";

var tau = 6.283185307179586;
var rad2deg = 57.295779513082323;

// The main array, one entry per plot,
// which will hold everything.
var plots = [];

// Shader code:

var shader_points_vertex = [
"attribute vec4 color;",
"attribute float dot_height;",
"attribute float hide_point;",
"attribute float null_point;",
"uniform float camera_r;",
"uniform float is_perspective;",
"uniform float pixel_ratio;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  vertex_color = color;",
"  vertex_hide_point = hide_point;",
"  vertex_null_point = null_point;",
"  float this_height;",
"  if (is_perspective > 0.5) {",
"    float r1 = length(cameraPosition - position);",
"    if (r1 < 0.01) {",
"      r1 = 0.01;",
"    }",
"    this_height = camera_r * pixel_ratio * dot_height / r1;",
"  } else {",
"    this_height = dot_height * pixel_ratio;",
"  }",
"  gl_PointSize = this_height;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"}"
].join("\n");

var shader_points_fragment = [
"uniform sampler2D texture;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  gl_FragColor = vec4(vertex_color) * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));",
"  if ((gl_FragColor.a < 0.1) || (vertex_hide_point > 0.5) || (vertex_null_point > 0.5)) {",
"    discard;",
"  }",
"}"
].join("\n");

var shader_quads_vertex = [
"attribute vec4 color;",
"attribute float hide_point;",
"attribute float null_point;",
"varying vec4 vertex_color;",
"varying vec2 vUv;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  vertex_color = color;",
"  vUv = uv;",
"  vertex_hide_point = hide_point;",
"  vertex_null_point = null_point;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"}"
].join("\n");

var shader_quads_fragment = [
"varying vec2 vUv;",
"uniform sampler2D texture;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  gl_FragColor = vec4(vertex_color) * texture2D(texture, vUv);",
"  if ((gl_FragColor.a < 0.1) || (vertex_hide_point > 0.5) || (vertex_null_point > 0.5)) {",
"    discard;",
"  }",
"}"
].join("\n");

var shader_labels_vertex = [
"varying vec2 vUv;",
"void main() {",
"  vUv = uv;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"}"
].join("\n");

var shader_labels_fragment = [
"varying vec2 vUv;",
"uniform sampler2D texture;",
"uniform vec4 color;",
"uniform vec4 bg_color;",
"uniform vec4 base_bg_color;",
"uniform float base_text_color;",
"void main() {",
"  float t;",
"  float sum_bg = base_bg_color.x + base_bg_color.y + base_bg_color.z;",
"  float sum_tex = texture2D(texture, vUv).r + texture2D(texture, vUv).g + texture2D(texture, vUv).b;",
"  if (base_text_color > 0.5) {",
"    // Texture was made with white text.",
"    if (sum_bg == 3.0) {",
"      // White text was written on white background.",
"      t = 0.0;",
"    } else {",
"      t = (sum_tex - sum_bg) / (3.0 - sum_bg);",
"    }",
"    gl_FragColor = bg_color + t*(color - bg_color);",
"  } else {",
"    // Texture was made with black text.",
"    if (sum_bg == 0.0) {",
"      // Black text was written on black background.",
"      t = 0.0;",
"    } else {",
"      t = 1.0 - sum_tex / sum_bg;",
"    }",
"  }",
"  gl_FragColor = bg_color + t*(color - bg_color);",
"  gl_FragColor = clamp(gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));",
"}"
].join("\n");

var shader_lines_vertex = [
"attribute vec4 color;",
"attribute float hide_point;",
"attribute float null_point;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  vertex_color = color;",
"  vertex_hide_point = hide_point;",
"  vertex_null_point = null_point;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"}"
].join("\n");

var shader_lines_fragment = [
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  gl_FragColor = vertex_color;",
"  if ((vertex_hide_point > 0.0) || (vertex_null_point > 0.0)) {",
"    discard;",
"  }",
"}"
].join("\n");

var shader_mesh_vertex = [
"attribute vec4 color;",
"attribute float hide_point;",
"attribute float hide_axis;",
"attribute float null_point;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_hide_axis;",
"varying float vertex_null_point;",
"void main() {",
"  vertex_color = color;",
"  vertex_hide_point = hide_point;",
"  vertex_hide_axis  = hide_axis;",
"  vertex_null_point = null_point;",
// Move the mesh a touch closer to the camera than the surface it's on,
// so that it is clearly visible.
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + 1.0e-3 * normalize(cameraPosition - position), 1.0);",
"}"
].join("\n");

var shader_mesh_fragment = [
"uniform float use_const_color;",
"uniform vec4 const_color;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_hide_axis;",
"varying float vertex_null_point;",
"void main() {",
"  if (use_const_color > 0.5) {",
"    gl_FragColor = const_color;",
"  } else {",
"    gl_FragColor = vertex_color;",
"  }",
"  if (((vertex_hide_point > 0.0) || (vertex_null_point > 0.0)) || (vertex_hide_axis > 0.0)) {",
"    discard;",
"  }",
"}"
].join("\n");

var shader_surface_vertex = [
"attribute vec4 color;",
"attribute float hide_point;",
"attribute float null_point;",
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  vertex_color = color;",
"  vertex_hide_point = hide_point;",
"  vertex_null_point = null_point;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"}"
].join("\n");

var shader_surface_fragment = [
"varying vec4 vertex_color;",
"varying float vertex_hide_point;",
"varying float vertex_null_point;",
"void main() {",
"  gl_FragColor = vertex_color;",
"  if ((vertex_hide_point > 0.0) || (vertex_null_point > 0.0)) {",
"    discard;",
"  }",
"}"
].join("\n");

var shader_temp_vertex = [
"void main() {",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
"}"
].join("\n");

var shader_temp_fragment = [
"void main() {",
"  gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);",
"}"
].join("\n");

var set_touch_coords = function(event, i_plot) {
	var num_touches = event.touches.length;
		
	if (num_touches == 1) {
		plots[i_plot].touch_start_x = [event.touches[0].clientX];
		plots[i_plot].touch_start_y = [event.touches[0].clientY];
	} else if (num_touches == 2) {
		plots[i_plot].touch_start_x = [event.touches[0].clientX, event.touches[1].clientX];
		plots[i_plot].touch_start_y = [event.touches[0].clientY, event.touches[1].clientY];
	} else {
		plots[i_plot].touch_start_x = [];
		plots[i_plot].touch_start_y = [];
	}
}

var touch_start_fn = function(i_plot) {
	return function(event) {
		event.preventDefault();
		set_touch_coords(event, i_plot);
		if (event.touches.length == 1) {
			set_normed_mouse_coords({"clientX": event.touches[0].clientX, "clientY": event.touches[0].clientY}, i_plot);
			plots[i_plot].old_t = Date.now();
			
			if (plots[i_plot].have_click) {
				if (plots[i_plot].plot_type == "scatter") {
					plots[i_plot].clicked_i = get_raycast_i(i_plot);
				} else if (plots[i_plot].plot_type == "surface") {
					plots[i_plot].clicked_i = get_raycast_i(i_plot).slice(0);
				}
			}
		} else {
			plots[i_plot].two_finger_operation = "none";
			if (plots[i_plot].plot_type == "scatter") {
				plots[i_plot].clicked_i = -1;
			} else if (plots[i_plot].plot_type == "surface") {
				plots[i_plot].clicked_i = [-1, -1];
			}
		}
	};
}

var touch_move_fn = function(i_plot) {
	return function(event) {
		event.preventDefault();
		
		var num_touches = event.touches.length;
		if (num_touches != plots[i_plot].touch_start_x.length) {
			// Something's gone wrong if we're here.
			set_touch_coords(event, i_plot);
			return;
		}
		
		if (num_touches == 1) {
			// Rotate like with the mouse.
			plots[i_plot].mouse_operation = "rotate";
			plots[i_plot].click_start_x = plots[i_plot].touch_start_x[0];
			plots[i_plot].click_start_y = plots[i_plot].touch_start_y[0];
			
			set_touch_coords(event, i_plot);
			
			plots[i_plot].new_t = Date.now();
			
			if (plots[i_plot].new_t - plots[i_plot].old_t > 100) {
				// Don't rotate if it's a tap, which I define as lasting
				// 0.1 seconds or less.
				mouse_move_fn({
					"clientX": event.touches[0].clientX,
					"clientY": event.touches[0].clientY
				}, i_plot);
			}
			
		} else if (num_touches == 2) {
			// Need to test whether it's a pinch or two-finger scroll.
			var x11 = plots[i_plot].touch_start_x[0];
			var x12 = event.touches[0].clientX;
			var y11 = plots[i_plot].touch_start_y[0];
			var y12 = event.touches[0].clientY;
			
			var x21 = plots[i_plot].touch_start_x[1];
			var x22 = event.touches[1].clientX;
			var y21 = plots[i_plot].touch_start_y[1];
			var y22 = event.touches[1].clientY;
			
			var dx1 = x12 - x11;
			var dx2 = x22 - x21;
			var dy1 = y12 - y11;
			var dy2 = y22 - y21;
			
			var pinch = false;
			
			if ((Math.abs(dx1) + Math.abs(dy1) == 0) || (Math.abs(dx2) + Math.abs(dy2) == 0)) {
				// One finger not moving; treat as pinch.
				pinch = true;
			} else {
				var r1 = Math.sqrt(dx1*dx1 + dy1*dy1);
				var r2 = Math.sqrt(dx2*dx2 + dy2*dy2);
				
				var theta = Math.acos((dx1*dx2 + dy1*dy2) / (r1*r2));
				
				if (theta > tau/4) {
					pinch = true;
				}
			}
			
			var do_action = true;
			
			if (pinch) {
				if (plots[i_plot].two_finger_operation == "pan") {
					plots[i_plot].new_t = Date.now();
					
					if (plots[i_plot].new_t - plots[i_plot].old_t < 100) {
						do_action = false;
					}
				}
				
				if (do_action) {
					var dist_1 = ((x11 - x21)*(x11 - x21) + (y11 - y21)*(y11 - y21));
					var dist_2 = ((x12 - x22)*(x12 - x22) + (y12 - y22)*(y12 - y22));
					
					var event_to_pass = {};
					event_to_pass.deltaY = (dist_2 > dist_1) ? -1 : 1;
					
					event_to_pass.clientX = 0.5*(x21 + x22);
					event_to_pass.clientY = 0.5*(y21 + y22);
					event_to_pass.zoom_factor = 1.035;
					
					plots[i_plot].two_finger_operation = "zoom";
					plots[i_plot].old_t = Date.now();
					
					mouse_zoom(event_to_pass, i_plot);
				}
			} else {
				// Pan.
				if (plots[i_plot].two_finger_operation == "zoom") {
					plots[i_plot].new_t = Date.now();
					
					if (plots[i_plot].new_t - plots[i_plot].old_t < 100) {
						do_action = false;
					}
				}
				
				if (do_action) {
				
					plots[i_plot].mouse_operation = "pan";
					plots[i_plot].click_start_x = 0.5*(x11 + x21);
					plots[i_plot].click_start_y = 0.5*(y11 + y21);
					
					plots[i_plot].two_finger_operation = "pan";
					plots[i_plot].old_t = Date.now();
					
					mouse_move_fn({
						"clientX": 0.5*(x12 + x22),
						"clientY": 0.5*(y12 + y22)
					}, i_plot);
				}
			}
			
			set_touch_coords(event, i_plot);
		}
	};
}

var touch_end_fn = function(i_plot) {
	return function(event) {
		event.preventDefault();
		set_touch_coords(event, i_plot);
		
		var possible_click;
		if (plots[i_plot].plot_type == "scatter") {
			possible_click = (plots[i_plot].clicked_i >= 0);
		} else if (plots[i_plot].plot_type == "surface") {
			possible_click = (plots[i_plot].clicked_i[0] >= 0);
		}
		
		if ((event.touches.length == 0) && possible_click) {
			set_normed_mouse_coords({"clientX": event.changedTouches[0].clientX, "clientY": event.changedTouches[0].clientY}, i_plot);
			
			var this_clicked_i;
			
			if (plots[i_plot].plot_type == "scatter") {
				this_clicked_i = get_raycast_i(i_plot);
			} else if (plots[i_plot].plot_type == "surface") {
				this_clicked_i = get_raycast_i(i_plot).slice(0);
			}
			
			if (plots[i_plot].plot_type == "scatter") {
				if (this_clicked_i == plots[i_plot].clicked_i) {
					plots[i_plot].click(
						i_plot,
						plots[i_plot].clicked_i,
						plots[i_plot].points[this_clicked_i]);
					
					update_render(i_plot);
				}
			} else if (plots[i_plot].plot_type == "surface") {
				if ((this_clicked_i[0] == plots[i_plot].clicked_i[0]) && (this_clicked_i[1] == plots[i_plot].clicked_i[1])) {
					plots[i_plot].click(
						i_plot,
						plots[i_plot].clicked_i[0],
						plots[i_plot].clicked_i[1],
						plots[i_plot].mesh_points[plots[i_plot].clicked_i[0]][plots[i_plot].clicked_i[1]]);
					
					update_render(i_plot);
				}
			}
		}
	};
}

var mouse_down_fn = function(i_plot) {
	return function(event) {
		plots[i_plot].click_start_x = event.clientX;
		plots[i_plot].click_start_y = event.clientY;
		
		var click_type = event.button;
		var ctrl = event.altKey || event.ctrlKey;
		var shiftkey = event.shiftKey;
		
		if (click_type == 0) {
			// Left mouse button.
			if (ctrl) {
				plots[i_plot].mouse_operation = "pan";
			} else if (shiftkey) {
				plots[i_plot].mouse_operation = "zoom";
			} else {
				plots[i_plot].mouse_operation = "rotate";
				set_normed_mouse_coords(event, i_plot);
				
				if (plots[i_plot].have_click) {
					if (plots[i_plot].plot_type == "scatter") {
						plots[i_plot].clicked_i = get_raycast_i(i_plot);
					} else if (plots[i_plot].plot_type == "surface") {
						plots[i_plot].clicked_i = get_raycast_i(i_plot).slice(0);
					}
				}
			}
		}
		
		if (click_type == 1) {
			// Middle mouse button.
			plots[i_plot].mouse_operation = "pan";
		}
		
		event.preventDefault();
	};
}

var mouse_up_fn = function(i_plot, from_mouseout) {
	return function(event) {
		plots[i_plot].mouse_operation = "none";
		var need_update = false;
		
		if (plots[i_plot].have_click || plots[i_plot].have_mouseout) {
			need_update = true;
			set_normed_mouse_coords(event, i_plot);
			
			var this_clicked_i;
			
			if (plots[i_plot].plot_type == "scatter") {
				if (from_mouseout) {
					this_clicked_i = -1;
				} else {
					this_clicked_i = get_raycast_i(i_plot);
				}
			} else if (plots[i_plot].plot_type == "surface") {
				if (from_mouseout) {
					this_clicked_i = [-1, -1];
				} else {
					this_clicked_i = get_raycast_i(i_plot).slice(0);
				}
			}
		}
		
		if (plots[i_plot].have_click) {
			if (plots[i_plot].plot_type == "scatter") {
				if ((this_clicked_i == plots[i_plot].clicked_i) && (this_clicked_i >= 0)) {
					plots[i_plot].click(
						i_plot,
						plots[i_plot].clicked_i,
						plots[i_plot].points[this_clicked_i]);
				}
				
				plots[i_plot].clicked_i = -1;
			} else if (plots[i_plot].plot_type == "surface") {
				if ((this_clicked_i[0] >= 0) && (this_clicked_i[0] == plots[i_plot].clicked_i[0]) && (this_clicked_i[1] == plots[i_plot].clicked_i[1])) {
					plots[i_plot].click(
						i_plot,
						plots[i_plot].clicked_i[0],
						plots[i_plot].clicked_i[1],
						plots[i_plot].mesh_points[this_clicked_i[0]][this_clicked_i[1]]);
				}
				
				plots[i_plot].clicked_i = [-1, -1];
			}
		}
		
		if (plots[i_plot].have_mouseout || plots[i_plot].have_mouseover) {
			if (plots[i_plot].plot_type == "scatter") {
				if (this_clicked_i != plots[i_plot].mouseover_i) {
					if (plots[i_plot].have_mouseout) {
						mouse_out_fn(event, i_plot, this_clicked_i, false);
					}
					
					plots[i_plot].mouseover_i = this_clicked_i;
					
					if ((this_clicked_i >= 0) && (plots[i_plot].have_mouseover)) {
						plots[i_plot].mouseover(
							i_plot,
							plots[i_plot].mouseover_i,
							plots[i_plot].points[this_clicked_i]);
					}
				}
			} else if (plots[i_plot].plot_type == "surface") {
				if ((this_clicked_i[0] != plots[i_plot].mouseover_i[0]) || (this_clicked_i[1] != plots[i_plot].mouseover_i[1])) {
					if (plots[i_plot].have_mouseout) {
						mouse_out_fn(event, i_plot, this_clicked_i, false);
					}
					
					plots[i_plot].mouseover_i = this_clicked_i.slice(0);
					
					if ((this_clicked_i[0] >= 0) && (plots[i_plot].have_mouseover)) {
						plots[i_plot].mouseover(
							i_plot,
							plots[i_plot].mouseover_i[0],
							plots[i_plot].mouseover_i[1],
							plots[i_plot].mesh_points[plots[i_plot].mouseover_i[0]][plots[i_plot].mouseover_i[1]]);
					}
				}
			}
		}
		
		if (need_update) { update_render(i_plot); }
		
		event.preventDefault();
	};
}

var mouse_zoom_wrapper = function(i_plot) {
	return function(event) {
		mouse_zoom(event, i_plot);
	};
}

var mouse_zoom = function(event, i_plot) {
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
		
		var bounding_rect = plots[i_plot].renderer.domElement.getBoundingClientRect();
		
		if (plots[i_plot].view_type == "perspective") {
			var px2rad = plots[i_plot].persp_camera.fov / (plots[i_plot].height * rad2deg);
			var old_px2rad = px2rad;
			
			var theta_1 = (event.clientY - bounding_rect.top - plots[i_plot].mid_y) * px2rad;
			var phi_1 = (event.clientX - bounding_rect.left - plots[i_plot].mid_x) * px2rad;
			
			if (phi_1 > tau/4) { phi_1 = 0.99*tau/4; }
			if (phi_1 < -tau/4) { phi_1 = 0.99*tau/4; }
			
			var point_x_1 = plots[i_plot].camera_r * Math.tan(phi_1);
			var point_y_1 = plots[i_plot].camera_r * Math.tan(theta_1) / Math.cos(phi_1);
			
			if (scroll_amount < 0) {
				if (plots[i_plot].persp_camera.fov > plots[i_plot].min_fov) {
					plots[i_plot].persp_camera.fov /= zoom_factor;
					
					if (plots[i_plot].persp_camera.fov < plots[i_plot].min_fov) {
						plots[i_plot].persp_camera.fov = plots[i_plot].min_fov;
					}
				}
			} else {
				if (plots[i_plot].persp_camera.fov < plots[i_plot].max_fov) {
					plots[i_plot].persp_camera.fov *= zoom_factor;
					
					if (plots[i_plot].persp_camera.fov > plots[i_plot].max_fov) {
						plots[i_plot].persp_camera.fov = plots[i_plot].max_fov;
					}
				}
			}
			
			px2rad = plots[i_plot].persp_camera.fov / (plots[i_plot].height * rad2deg);
			scale_ratio = px2rad / old_px2rad;
			
			var theta_2 = (event.clientY - bounding_rect.top - plots[i_plot].mid_y) * px2rad;
			var phi_2 = (event.clientX - bounding_rect.left - plots[i_plot].mid_x) * px2rad;
			
			if (phi_2 > tau/4) { phi_2 = 0.99*tau/4; }
			if (phi_2 < -tau/4) { phi_2 = 0.99*tau/4; }
			
			var point_x_2 = plots[i_plot].camera_r * Math.tan(phi_2);
			var point_y_2 = plots[i_plot].camera_r * Math.tan(theta_2) / Math.cos(phi_2);
			
			var pan_x = -point_x_2 + point_x_1;
			var pan_y = point_y_2 - point_y_1;
		} else {
			// Orthographic.
			// Playing fast and loose with "width" and "height" notation here.
			var height = 2*plots[i_plot].ortho_camera.top;
			var width  = 2*plots[i_plot].ortho_camera.right;
			
			var base_y = (event.clientY - bounding_rect.top - plots[i_plot].mid_y);
			var base_x = (event.clientX - bounding_rect.left - plots[i_plot].mid_x);
			
			var y1 = base_y * height / plots[i_plot].height;
			var x1 = base_x * width / plots[i_plot].width;
			
			scale_ratio = zoom_factor;
			var theta, temp_top;
			
			if (scroll_amount < 0) {
				temp_top = plots[i_plot].ortho_camera.top / zoom_factor;
				theta = Math.atan2(temp_top, plots[i_plot].camera_r) * rad2deg * 2;
				if (theta < plots[i_plot].min_fov) {
					temp_top = plots[i_plot].camera_r * Math.tan(plots[i_plot].min_fov / (2 * rad2deg));
				}
				
				scale_ratio = temp_top / plots[i_plot].ortho_camera.top;
				
				plots[i_plot].ortho_camera.top *= scale_ratio;
				plots[i_plot].ortho_camera.bottom *= scale_ratio;
				plots[i_plot].ortho_camera.left *= scale_ratio;
				plots[i_plot].ortho_camera.right *= scale_ratio;
			} else {
				temp_top = plots[i_plot].ortho_camera.top * zoom_factor;
				
				theta = Math.atan2(temp_top, plots[i_plot].camera_r) * rad2deg * 2;
				if (theta > plots[i_plot].max_fov) {
					temp_top = plots[i_plot].camera_r * Math.tan(plots[i_plot].max_fov / (2 * rad2deg));
				}
				
				scale_ratio = temp_top / plots[i_plot].ortho_camera.top;
				
				plots[i_plot].ortho_camera.top *= scale_ratio;
				plots[i_plot].ortho_camera.bottom *= scale_ratio;
				plots[i_plot].ortho_camera.left *= scale_ratio;
				plots[i_plot].ortho_camera.right *= scale_ratio;
			}
			
			height = 2*plots[i_plot].ortho_camera.top;
			width = 2*plots[i_plot].ortho_camera.right;
			
			var y2 = base_y * height / plots[i_plot].height;
			var x2 = base_x * width / plots[i_plot].width;
			
			var pan_x = -x2 + x1;
			var pan_y = y2 - y1;
		}
		
		var up_vector = new THREE.Vector3()
			.copy(plots[i_plot].camera_up)
			.multiplyScalar(pan_y);
		
		var posn_vector = new THREE.Vector3()
			.subVectors(get_current_camera(i_plot).position, plots[i_plot].camera_origin)
			.normalize();
		
		var right_vector = new THREE.Vector3()
			.crossVectors(plots[i_plot].camera_up, posn_vector)
			.multiplyScalar(pan_x);
		
		plots[i_plot].camera_origin
			.add(up_vector)
			.add(right_vector);
		
		get_current_camera(i_plot).position
			.add(up_vector)
			.add(right_vector);
		
		// Re-scale text labels.
		for (i = 0; i < plots[i_plot].axis_text_planes.length; i++) {
			plots[i_plot].axis_text_planes[i].scale.x *= scale_ratio;
			plots[i_plot].axis_text_planes[i].scale.y *= scale_ratio;
		}
		
		for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
			plots[i_plot].tick_text_planes[i].scale.x *= scale_ratio;
			plots[i_plot].tick_text_planes[i].scale.y *= scale_ratio;
		}
		
		if (plots[i_plot].geom_type == "quad") {
			for (i = 0; i < plots[i_plot].points.length; i++) {
				plots[i_plot].points[i].scale.x *= scale_ratio;
				plots[i_plot].points[i].scale.y *= scale_ratio;
			}
		}
		
		if (plots[i_plot].have_any_labels) {
			for (i = 0; i < plots[i_plot].points.length; i++) {
				if (plots[i_plot].points[i].have_label) {
					plots[i_plot].labels[i].scale.x *= scale_ratio;
					plots[i_plot].labels[i].scale.y *= scale_ratio;
				}
			}
			
			update_labels(i_plot);
		}
		
		get_current_camera(i_plot).updateProjectionMatrix();
		
		if (plots[i_plot].show_grid) {
			update_gridlines(i_plot);
		}
		
		update_render(i_plot);
	}
	
	if (typeof event.preventDefault === "function") { event.preventDefault(); }
}

var mouse_move_wrapper = function(i_plot) {
	return function(event) {
		mouse_move_fn(event, i_plot);
	}
}

var set_normed_mouse_coords = function(event, i_plot) {
	var bounding_rect = plots[i_plot].renderer.domElement.getBoundingClientRect();
	plots[i_plot].mouse.x = -1 + 2*(event.clientX - bounding_rect.left) / plots[i_plot].width;
	plots[i_plot].mouse.y = 1 - 2*(event.clientY - bounding_rect.top) / plots[i_plot].height;
	if (plots[i_plot].mouse.x < -1) { plots[i_plot].mouse.x = -1; }
	if (plots[i_plot].mouse.y < -1) { plots[i_plot].mouse.y = -1; }
	if (plots[i_plot].mouse.x >  1) { plots[i_plot].mouse.x =  1; }
	if (plots[i_plot].mouse.y >  1) { plots[i_plot].mouse.y =  1; }
}

var mouse_move_fn = function(event, i_plot) {
	// Reasons for the differing signs on delta_x and
	// delta_y are lost to the mists of history, but
	// may have something to do with all the negative
	// latitudes in my quaternion definitions.
	var delta_x = -event.clientX + plots[i_plot].click_start_x;
	var delta_y =  event.clientY - plots[i_plot].click_start_y;
	
	set_normed_mouse_coords(event, i_plot);
	
	var i;
	
	if (plots[i_plot].mouse_operation == "rotate") {
		var perc_horiz =  plots[i_plot].mouse.x;
		var perc_vert  = -plots[i_plot].mouse.y;
		
		var delta_lat = delta_y * (tau/2) * (1 - Math.abs(perc_horiz)) / plots[i_plot].height;
		var delta_lon = delta_x * (tau/2) * (1 - Math.abs(perc_vert)) / plots[i_plot].width;
		var delta_psi = delta_y * (tau/2) * perc_horiz / plots[i_plot].width +
						delta_x * (tau/2) * perc_vert / plots[i_plot].height;
		
		var change_quat = new THREE.Quaternion()
			.setFromEuler(get_current_camera(i_plot).rotation)
			.multiply(
				new THREE.Quaternion()
					.setFromEuler(new THREE.Euler(-delta_lat, delta_lon, delta_psi, "YXZ"))
				);
		
		get_current_camera(i_plot).position
			.set(0, 0, 1)
			.applyQuaternion(change_quat)
			.multiplyScalar(plots[i_plot].camera_r)
			.add(plots[i_plot].camera_origin);
		
		plots[i_plot].camera_up = new THREE.Vector3(0, 1, 0)
			.applyQuaternion(change_quat);
		
		get_current_camera(i_plot).rotation.setFromQuaternion(change_quat);
		
		if (plots[i_plot].plot_type == "scatter") {
			if (plots[i_plot].geom_type == "quad") {
				for (i = 0; i < plots[i_plot].points.length; i++) {
					plots[i_plot].points[i].rotation.copy(get_current_camera(i_plot).rotation);
				}
			}
			
			if (plots[i_plot].have_any_labels) {
				update_labels(i_plot);
			}
		}
		
		for (i = 0; i < plots[i_plot].axis_text_planes.length; i++) {
			plots[i_plot].axis_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
		}
		
		for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
			plots[i_plot].tick_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
		}
		
		if (plots[i_plot].show_grid) {
			update_gridlines(i_plot);
		}
		
		if (plots[i_plot].dynamic_axis_labels) {
			update_axes(i_plot);
		}
		
		update_render(i_plot);
	} else if (plots[i_plot].mouse_operation == "pan") {
		// Moving the mouse upwards will pan in the direction of camera_up.
		// Moving the mouse sideways will pan in the direction camera_up x camera.position
		// after a translate.
		
		var x_factor, y_factor;
		
		if (plots[i_plot].view_type == "perspective") {
			var dist_scale = 2 * plots[i_plot].camera_r * Math.tan(get_current_camera(i_plot).fov / (2 * rad2deg));
			
			x_factor = dist_scale * delta_x / plots[i_plot].height;
			y_factor = dist_scale * delta_y / plots[i_plot].height;
		} else {
			// Orthographic.
			var height = 2*plots[i_plot].ortho_camera.top;
			var width = 2*plots[i_plot].ortho_camera.right;
			
			x_factor = delta_x * width / plots[i_plot].width;
			y_factor = delta_y * height / plots[i_plot].height;
		}
		
		var start_posn = new THREE.Vector3()
			.copy(get_current_camera(i_plot).position);
		
		var up_vector = new THREE.Vector3()
			.copy(plots[i_plot].camera_up)
			.multiplyScalar(y_factor);
		
		var posn_vector = new THREE.Vector3()
			.subVectors(get_current_camera(i_plot).position, plots[i_plot].camera_origin)
			.normalize();
		
		var right_vector = new THREE.Vector3()
			.crossVectors(plots[i_plot].camera_up, posn_vector)
			.multiplyScalar(x_factor);
		
		var test_posn = new THREE.Vector3()
			.copy(plots[i_plot].camera_origin)
			.add(up_vector)
			.add(right_vector);
		
		var test_dist = test_posn.lengthSq();
		if (test_dist > plots[i_plot].max_pan_dist_sq) {
			test_posn.multiplyScalar(Math.sqrt(plots[i_plot].max_pan_dist_sq / test_dist));
			
		}
		
		var dr = new THREE.Vector3()
			.subVectors(test_posn, plots[i_plot].camera_origin);
		
		plots[i_plot].camera_origin
			.add(dr);
		
		get_current_camera(i_plot).position
			.add(dr);
		
		if (plots[i_plot].show_grid) {
			update_gridlines(i_plot);
		}
		
		if (plots[i_plot].dynamic_axis_labels) {
			update_axes(i_plot);
		}
		
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
	} else if (plots[i_plot].mouse_operation == "zoom") {
		mouse_zoom({"deltaY": delta_y,
			"clientX": event.clientX,
			"clientY": event.clientY,
			"zoom_factor": 1.05,
			"preventDefault": function() { return; } },
			i_plot);
	} else if (plots[i_plot].mouse_operation == "none") {
		// Possible mouseover / mouseout event.
		if (plots[i_plot].have_mouseover || plots[i_plot].have_mouseout) {
			
			var mouseover_i;
			
			if (plots[i_plot].plot_type == "scatter") {
				mouseover_i = get_raycast_i(i_plot);
			} else if (plots[i_plot].plot_type == "surface") {
				mouseover_i = get_raycast_i(i_plot).slice(0);
			}
			
			if (plots[i_plot].plot_type == "scatter") {
				if (mouseover_i != plots[i_plot].mouseover_i) {
					
					if (plots[i_plot].have_mouseout) {
						mouse_out_fn(event, i_plot, mouseover_i, false);
					}
					
					plots[i_plot].mouseover_i = mouseover_i;
					
					if ((mouseover_i >= 0) && (plots[i_plot].have_mouseover)) {
						plots[i_plot].mouseover(
							i_plot,
							mouseover_i,
							plots[i_plot].points[mouseover_i]);
					}
				}
			} else if (plots[i_plot].plot_type == "surface") {
				if ((mouseover_i[0] != plots[i_plot].mouseover_i[0]) || (mouseover_i[1] != plots[i_plot].mouseover_i[1])) {
					if (plots[i_plot].have_mouseout) {
						mouse_out_fn(event, i_plot, mouseover_i, false);
					}
					
					plots[i_plot].mouseover_i = mouseover_i.slice(0);
					
					if ((mouseover_i[0] >= 0) && (plots[i_plot].have_mouseover)) {
						plots[i_plot].mouseover(
							i_plot,
							mouseover_i[0],
							mouseover_i[1],
							plots[i_plot].mesh_points[mouseover_i[0]][mouseover_i[1]]);
					}
				}
			}
			
			update_render(i_plot);
		}
	}
	
	plots[i_plot].click_start_x = event.clientX;
	plots[i_plot].click_start_y = event.clientY;
}

var mouse_out_wrapper = function(i_plot, mouseover_i, do_render) {
	return function (event) {
		return mouse_out_fn(event, i_plot, mouseover_i, do_render);
	}
}

var mouse_out_fn = function(event, i_plot, mouseover_i, do_render) {
	if (plots[i_plot].plot_type == "scatter") {
		if (plots[i_plot].mouseover_i >= 0) {
			plots[i_plot].mouseout(
				i_plot,
				plots[i_plot].mouseover_i,
				plots[i_plot].points[plots[i_plot].mouseover_i]);
		}
		
		plots[i_plot].mouseover_i = mouseover_i;
	} else if (plots[i_plot].plot_type == "surface") {
		if (plots[i_plot].mouseover_i[0] >= 0) {
			plots[i_plot].mouseout(
				i_plot,
				plots[i_plot].mouseover_i[0],
				plots[i_plot].mouseover_i[1],
				plots[i_plot].mesh_points[plots[i_plot].mouseover_i[0]][plots[i_plot].mouseover_i[1]]);
		}
		
		plots[i_plot].mouseover_i = mouseover_i.slice(0);
	}
	
	if (do_render) { update_render(i_plot); }
}

var get_scale_factor = function(i_plot) {
	if (plots[i_plot].view_type == "perspective") {
		// a point of size 10 pixels has a radius of 5 pixels, which correpsonds to
		// a distance of half_height * 5 / (half_height in pixels).
		return plots[i_plot].camera_r * Math.tan(0.5 * plots[i_plot].persp_camera.fov / rad2deg) / plots[i_plot].height;
	} else {
		return plots[i_plot].ortho_camera.top / plots[i_plot].height;
	}
}

var get_raycast_i = function(i_plot) {
	// Have to use a custom raycaster because the three.js one
	// for points assumes that all points are the same size.
	// My code follows the three.js code very closely.
	
	plots[i_plot].raycaster.setFromCamera(plots[i_plot].mouse, get_current_camera(i_plot));	
	var i;
	
	var scale_factor = get_scale_factor(i_plot);
	
	var ray = new THREE.Ray();
	var intersects = [];
	var this_distance_sq, distance_sq;
	
	if (plots[i_plot].plot_type == "scatter") {
		if (plots[i_plot].geom_type == "point") {
			var matrixWorld = plots[i_plot].points_merged.matrixWorld;
			var inverseMatrix = new THREE.Matrix4().getInverse(matrixWorld);
			ray.copy(plots[i_plot].raycaster.ray).applyMatrix4(inverseMatrix);
			
			var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
			var sizes = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
			var position = new THREE.Vector3();
			
			var hide_points = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
			var null_points = plots[i_plot].points_merged.geometry.attributes.null_point.array;
			
			for (i = 0; i < positions.length / 3; i++) {
				position.copy(new THREE.Vector3(positions[3*i], positions[3*i + 1], positions[3*i + 2]));
				
				if (!(hide_points[i] || null_points[i])) {
					this_distance_sq = ray.distanceSqToPoint(position);
					
					if (this_distance_sq < sizes[i] * sizes[i] * scale_factor * scale_factor) {
						distance_sq = plots[i_plot].raycaster.ray.origin.distanceToSquared(position);
						intersects.push({"index": i, "distance_sq": distance_sq});
					}
				}
			}
			
			if (intersects.length > 0) {
				return intersects[d3.scan(intersects, function(a, b) { return a.distance_sq - b.distance_sq; } )].index;
			} else {
				return -1;
			}
		} else if (plots[i_plot].geom_type == "quad") {
			intersects = three_d.plots[i_plot].raycaster.intersectObjects(plots[i_plot].points);
			
			if (intersects.length > 0) {
				var hide_points, null_points, this_i;
				
				for (i = 0; i < intersects.length; i++) {
					this_i = intersects[i].object.input_data.i;
					hide_points = plots[i_plot].points[this_i].geometry.attributes.hide_point.array;
					null_points = plots[i_plot].points[this_i].geometry.attributes.null_point.array;
					
					if (!(hide_points[0] || null_points[0])) {
						
						this_distance_sq = intersects[0].point.distanceToSquared(intersects[0].object.position);
						
						if (this_distance_sq < 0.25 * intersects[0].object.scale.x * intersects[0].object.scale.x) {
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
	} else if (plots[i_plot].plot_type == "surface") {
		intersects = three_d.plots[i_plot].raycaster.intersectObject(plots[i_plot].surface);
		
		if (intersects.length > 0) {
			var nulls = plots[i_plot].surface.geometry.attributes.null_point.array;
			var hides = plots[i_plot].surface.geometry.attributes.hide_point.array;
			
			var i_vertex;
			
			for (i = 0; i < intersects.length; i++) {
				// The faceIndex goes up in 3's, by observation
				// (or by study of the three.js source code).
				i_vertex = intersects[i].faceIndex;
				
				if (!nulls[i_vertex] && !hides[i_vertex + 1] && !hides[i_vertex + 2]) {
					// Non-null triangle -- have to find the two possible
					// vertices, then work out which one is closest to the
					// mouse.
					
					var i_tri_all, i_tri_local, i_quad, cand_ij1, cand_ij2;
					
					i_tri_all = i_vertex / 3;
					i_quad = Math.floor(i_tri_all / 4);
					i_tri_local = i_tri_all % 4;
					
					var positions = plots[i_plot].surface.geometry.attributes.position.array;
					var posn1 = new THREE.Vector3(positions[3*i_vertex + 3], positions[3*i_vertex + 4], positions[3*i_vertex + 5]);
					var posn2 = new THREE.Vector3(positions[3*i_vertex + 6], positions[3*i_vertex + 7], positions[3*i_vertex + 8]);
					
					var nx = plots[i_plot].mesh_points.length;
					var ny = plots[i_plot].mesh_points[0].length;
					
					var i1 = Math.floor(i_quad / (ny - 1));
					var j1 = i_quad % (ny - 1);
					
					if (i_tri_local == 0) {
						cand_ij1 = [i1  , j1];
						cand_ij2 = [i1+1, j1];
					} else if (i_tri_local == 1) {
						cand_ij1 = [i1+1, j1];
						cand_ij2 = [i1+1, j1+1];
					} else if (i_tri_local == 2) {
						cand_ij1 = [i1+1, j1+1];
						cand_ij2 = [i1  , j1+1];
					} else if (i_tri_local == 3) {
						cand_ij1 = [i1  , j1+1];
						cand_ij2 = [i1  , j1];
					} else {
						console.warn("Raycast error; not supposed to happen.");
						return [-1, -1];
					}
					
					var matrixWorld = plots[i_plot].surface.matrixWorld;
					var inverseMatrix = new THREE.Matrix4().getInverse(matrixWorld);
					ray.copy(plots[i_plot].raycaster.ray).applyMatrix4(inverseMatrix);
					
					var dist1 = ray.distanceSqToPoint(posn1);
					var dist2 = ray.distanceSqToPoint(posn2);
					
					if (dist1 < dist2) {
						return cand_ij1;
					} else {
						return cand_ij2;
					}
				}
			}
		}
		
		return [-1, -1];
	}
}

var get_current_camera = function(i_plot) {
	if (plots[i_plot].view_type == "perspective") {
		return plots[i_plot].persp_camera;
	} else {
		return plots[i_plot].ortho_camera;
	}
}

var toggle_camera = function(i_plot) {
	return function () {
		switch_camera_type(i_plot);
	}
}

var switch_camera_type = function(i_plot) {
	var aspect = plots[i_plot].width / plots[i_plot].height;
	var left, top, theta;
	
	if (plots[i_plot].view_type == "perspective") {
		theta = plots[i_plot].persp_camera.fov / 2;
		top = plots[i_plot].camera_r * Math.tan(theta / rad2deg);
		left = top * aspect;
		
		plots[i_plot].ortho_camera.left = -left;
		plots[i_plot].ortho_camera.right = left;
		plots[i_plot].ortho_camera.top = top;
		plots[i_plot].ortho_camera.bottom = -top;
		
		plots[i_plot].ortho_camera.position.copy(plots[i_plot].persp_camera.position);
		plots[i_plot].ortho_camera.rotation.copy(plots[i_plot].persp_camera.rotation);
		
		plots[i_plot].view_type = "orthographic";
		
		if (plots[i_plot].geom_type == "point") {
			plots[i_plot].point_material.uniforms.is_perspective.value = 0.0;
		}
	} else {
		theta = Math.atan2(plots[i_plot].ortho_camera.top, plots[i_plot].camera_r) * rad2deg * 2;
		if (theta > plots[i_plot].max_fov) { theta = plots[i_plot].max_fov; }
		if (theta < plots[i_plot].min_fov) { theta = plots[i_plot].min_fov; }
		
		plots[i_plot].persp_camera.fov = theta;
		
		plots[i_plot].persp_camera.position.copy(plots[i_plot].ortho_camera.position);
		plots[i_plot].persp_camera.rotation.copy(plots[i_plot].ortho_camera.rotation);
		
		plots[i_plot].view_type = "perspective";
		
		if (plots[i_plot].geom_type == "point") {
			plots[i_plot].point_material.uniforms.is_perspective.value = 1.0;
		}
	}
	
	get_current_camera(i_plot).updateProjectionMatrix();
	if (plots[i_plot].show_grid) {
		update_gridlines(i_plot);
	}
	plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
}

var update_labels = function(i_plot, start_i, end_i) {
	if (plots[i_plot].geom_type == "none") { return; }
	if (!plots[i_plot].have_any_labels) { return; }
	
	if (start_i === undefined) { start_i = 0; }
	if (end_i === undefined) { end_i = plots[i_plot].points.length - 1; }
	
	var up = new THREE.Vector3();
	var this_pos = new THREE.Vector3();
	var label_height, scale_factor;
	
	scale_factor = get_scale_factor(i_plot);
	
	// What my pen-and-paper work says:
	label_height = scale_factor * plots[i_plot].label_font_size / 4;
	
	// Fudge!
	label_height *= 4;
	
	var null_points, hide_points;
	
	if (plots[i_plot].geom_type == "point") {
		var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
		null_points = plots[i_plot].points_merged.geometry.attributes.null_point.array;
		hide_points = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
	}
	
	var position = new THREE.Vector3();
	var need_update;
	
	for (var i = start_i; i <= end_i; i++) {
		if (plots[i_plot].geom_type == "point") {
			position.copy(new THREE.Vector3(positions[3*i], positions[3*i + 1], positions[3*i + 2]));
		} else if (plots[i_plot].geom_type == "quad") {
			position.copy(plots[i_plot].points[i].position);
		}
		
		if (plots[i_plot].points[i].have_label) {
			up.copy(plots[i_plot].camera_up);
			this_pos = up
				.multiplyScalar(plots[i_plot].points[i].input_data.sphere_size * scale_factor + label_height)
				.add(position);
			
			plots[i_plot].labels[i].position.copy(this_pos);
			plots[i_plot].labels[i].rotation.copy(get_current_camera(i_plot).rotation);
		}
	}
}

var toggle_grid = function(i_plot) {
	return function () {
		var i;
		if (plots[i_plot].show_grid) {
			plots[i_plot].show_grid = false;
			
			for (i = 0; i < 3; i++) {
				if (plots[i_plot].showing_upper_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_upper[i]);
				}
				
				if (plots[i_plot].showing_lower_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_lower[i]);
				}
				
				plots[i_plot].showing_upper_grid[i] = false;
				plots[i_plot].showing_lower_grid[i] = false;
			}
		} else {
			plots[i_plot].show_grid = true;
			update_gridlines(i_plot);
		}
		
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
	}
}

var update_gridlines = function(i_plot) {
	var test_pos, d_upper, d_lower;
	var axes = ["x", "y", "z"];
	var normal;
	var i, theta;
	
	if (plots[i_plot].view_type == "perspective") {
		var rel_r = new THREE.Vector3();
		
		for (i = 0; i < 3; i++) {
			// Upper plane.
			
			normal = new THREE.Vector3(0, 0, 0);
			normal[axes[i]] = 1;
			
			rel_r = new THREE.Vector3(0, 0, 0);
			rel_r[axes[i]] = plots[i_plot].bounding_planes[i];
			rel_r.sub(get_current_camera(i_plot).position);
			
			theta = rel_r.angleTo(normal);
			
			// Honestly I think it should be <= instead of >
			// but who am I to argue with the results?
			if (theta > tau/4) {
				// Switch off grid
				if (plots[i_plot].showing_upper_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_upper[i]);
					plots[i_plot].showing_upper_grid[i] = false;
				}
			} else {
				if (!plots[i_plot].showing_upper_grid[i]) {
					plots[i_plot].scene.add(plots[i_plot].grid_lines_upper[i]);
					plots[i_plot].showing_upper_grid[i] = true;
				}
			}
			
			// Lower plane.
			
			normal[axes[i]] = -1;
			
			rel_r = new THREE.Vector3(0, 0, 0);
			rel_r[axes[i]] = -plots[i_plot].bounding_planes[i];
			rel_r.sub(get_current_camera(i_plot).position);
			
			theta = rel_r.angleTo(normal);
			
			if (theta > tau/4) {
				// Switch off grid
				if (plots[i_plot].showing_lower_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_lower[i]);
					plots[i_plot].showing_lower_grid[i] = false;
				}
			} else {
				if (!plots[i_plot].showing_lower_grid[i]) {
					plots[i_plot].scene.add(plots[i_plot].grid_lines_lower[i]);
					plots[i_plot].showing_lower_grid[i] = true;
				}
			}
		}
	} else {
		// Orthographic -- only three faces should have a grid.
		
		var r_quat = new THREE.Quaternion()
			.setFromEuler(get_current_camera(i_plot).rotation);
		
		var r = new THREE.Vector3(0, 0, 1)
			.applyQuaternion(r_quat);
		
		for (i = 0; i < 3; i++) {
			normal = new THREE.Vector3(0, 0, 0);
			normal[axes[i]] = 1;
			
			theta = r.angleTo(normal);
			
			if (theta <= tau/4) {
				// Switch off grid
				if (plots[i_plot].showing_upper_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_upper[i]);
					plots[i_plot].showing_upper_grid[i] = false;
				}
			} else {
				if (!plots[i_plot].showing_upper_grid[i]) {
					plots[i_plot].scene.add(plots[i_plot].grid_lines_upper[i]);
					plots[i_plot].showing_upper_grid[i] = true;
				}
			}
			
			normal[axes[i]] = -1;
			
			theta = r.angleTo(normal);
			
			if (theta <= tau/4) {
				// Switch off grid
				if (plots[i_plot].showing_lower_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_lower[i]);
					plots[i_plot].showing_lower_grid[i] = false;
				}
			} else {
				if (!plots[i_plot].showing_lower_grid[i]) {
					plots[i_plot].scene.add(plots[i_plot].grid_lines_lower[i]);
					plots[i_plot].showing_lower_grid[i] = true;
				}
			}
		}
	}
}

var update_axes = function(i_plot) {
	// This function moves the axis titles and
	// ticks to the nearest relevant axis to camera.
	
	var i, j, k, i2, i3, min_dist, this_dist;
	
	var axes = ["x", "y", "z"];
	var signs = [-1, 1];
	var wanted_signs = [0, 0];
	var final_signs;
	var this_vec;
	var tick_ct = 0;
	var tick_axis;
	
	for (i = 0; i < 3; i++) {
		min_dist = -1;
		
		i2 = (i + 1) % 3;
		i3 = (i2 + 1) % 3;
		
		final_signs = [1, 1];
		
		for (j = 0; j < 2; j++) {
			for (k = 0; k < 2; k++) {
				this_vec = new THREE.Vector3(0, 0, 0);
				this_vec[axes[i]] = 0;
				this_vec[axes[i2]] = plots[i_plot].ranges[i2][1] * signs[j];
				this_vec[axes[i3]] = plots[i_plot].ranges[i3][1] * signs[k];
				
				this_dist = this_vec.distanceToSquared(get_current_camera(i_plot).position);
				
				if ((min_dist < 0) || (this_dist < min_dist)) {
					min_dist = this_dist;
					wanted_signs[0] = signs[j];
					wanted_signs[1] = signs[k];
				}
			}
		}
		
		if (plots[i_plot].axis_text_planes[i].position[axes[i2]] * wanted_signs[0] < 0) {
			final_signs[0] = -1;
		}
		
		if (plots[i_plot].axis_text_planes[i].position[axes[i3]] * wanted_signs[1] < 0) {
			final_signs[1] = -1;
		}
		
		plots[i_plot].axis_text_planes[i].position[axes[i2]] *= final_signs[0];
		plots[i_plot].axis_text_planes[i].position[axes[i3]] *= final_signs[1];
		
		for (j = 0; j < plots[i_plot].num_ticks[i]; j++) {
			plots[i_plot].tick_text_planes[tick_ct].position[axes[i2]] *= final_signs[0];
			plots[i_plot].tick_text_planes[tick_ct].position[axes[i3]] *= final_signs[1];
			tick_ct++;
		}
		
		tick_axis = wanted_signs[0] + 1 + (wanted_signs[1] + 1)/2;
		
		if (plots[i_plot].show_ticks) {
			for (j = 0; j < 4; j++) {
				if (j != tick_axis) {
					plots[i_plot].scene.remove(plots[i_plot].axis_ticks[i][j]);
				} else {
					plots[i_plot].scene.add(plots[i_plot].axis_ticks[i][j]);
				}
			}
		}
	}
	
	plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
}

var toggle_ticks = function(i_plot) {
	return function () {
		var i, j;
		if (plots[i_plot].show_ticks) {
			plots[i_plot].show_ticks = false;
			//plots[i_plot].scene.remove(plots[i_plot].axis_ticks);
			for (i = 0; i < 3; i++) {
				for (j = 0; j < 4; j++) {
					plots[i_plot].scene.remove(plots[i_plot].axis_ticks[i][j]);
				}
			}
			
			for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
				plots[i_plot].scene.remove(plots[i_plot].tick_text_planes[i]);
			}
		} else {
			plots[i_plot].show_ticks = true;
			//plots[i_plot].scene.add(plots[i_plot].axis_ticks);
			if (plots[i_plot].dynamic_axis_labels) {
				update_axes(i_plot);
			} else {
				plots[i_plot].scene.add(plots[i_plot].axis_ticks[0][0]);
				plots[i_plot].scene.add(plots[i_plot].axis_ticks[1][0]);
				plots[i_plot].scene.add(plots[i_plot].axis_ticks[2][0]);
			}
			
			for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
				plots[i_plot].scene.add(plots[i_plot].tick_text_planes[i]);
			}
		}
		
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
	}
}

var toggle_axis_titles = function(i_plot) {
	return function () {
		var i;
		if (plots[i_plot].show_axis_titles) {
			plots[i_plot].show_axis_titles = false;
			for (i = 0; i < 3; i++) {
				plots[i_plot].scene.remove(plots[i_plot].axis_text_planes[i]);
			}
		} else {
			plots[i_plot].show_axis_titles = true;
			for (i = 0; i < 3; i++) {
				plots[i_plot].scene.add(plots[i_plot].axis_text_planes[i]);
			}
		}
		
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
	}
}

var toggle_box = function(i_plot) {
	return function () {
		if (plots[i_plot].show_box) {
			plots[i_plot].show_box = false;
			plots[i_plot].scene.remove(plots[i_plot].axis_box);
		} else {
			plots[i_plot].show_box = true;
			plots[i_plot].scene.add(plots[i_plot].axis_box);
		}
		
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
	}
}

var are_same_color = function(color1, color2) {
	var canvas = document.createElement("canvas");
	canvas.width = 2;
	canvas.height = 1;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = color1;
	ctx.fillRect(0, 0, 1, 1);
	ctx.fillStyle = color2;
	ctx.fillRect(1, 0, 1, 1);
	
	var pixel_data = ctx.getImageData(0, 0, 2, 1);
	var pixels = pixel_data.data;
	var r1 = pixels[0];
	var g1 = pixels[1];
	var b1 = pixels[2];
	
	var r2 = pixels[4];
	var g2 = pixels[5];
	var b2 = pixels[6];
	
	return ((r1 == r2) && (g1 == g2) && (b1 == b2));
}

var get_text_width = function(text, font_size, font_face) {
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	
	context.font = font_size + "px " + font_face;
    
    return context.measureText(text).width;
}

var make_text_canvas = function(text, canvas_width, canvas_height, font_size, font_face, font_color, bg_color_css) {
	var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	context.fillStyle = bg_color_css;
	context.fillRect(0, 0, canvas_width, canvas_height);
	context.font = font_size + "px " + font_face;
	context.fillStyle = font_color;
	context.fillText(text, 0, font_size);
	
	return canvas;
}

var make_label_text_plane = function(text, font_face, font_size, use_white_text, background_color, i_plot) {
	// background_color is numerical.
	
	var canvas_height = Math.pow(2, Math.ceil(Math.log(font_size) / 0.693147180559945));
	
	font_size = Math.floor(canvas_height / plots[i_plot].font_ratio) - 1;
	
	var canvas_width = get_text_width(text, font_size, font_face);
	
	// Shouldn't be a problem, but just in case....
	if (canvas_width == 0) { canvas_width = 1; }
	
	var aspect = canvas_width / canvas_height;
	
	var font_color = use_white_text ? "#FFFFFF" : "#000000";
	var color_for_uniform = use_white_text ? 1.0 : 0.0;
	
	var bg_color_css = hex_to_css_color(background_color);
	var bg_color_obj = hex_to_rgb_obj(background_color);
	
	var texture = new THREE.Texture(make_text_canvas(text, canvas_width, canvas_height, font_size, font_face, font_color, bg_color_css));
	texture.needsUpdate = true;
	
	// It resizes the canvas to powers of 2 with the default minFilter:
	texture.minFilter = THREE.LinearFilter;
	
	var new_obj = new THREE.Mesh(
		new THREE.PlaneGeometry(aspect, 1, 1),
		new THREE.ShaderMaterial({
			"uniforms": {
				"texture": {"type": "t", "value": texture},
				"color": {"type": "v4", "value": new THREE.Vector4(1.0, 1.0, 1.0, 1.0)},
				"bg_color": {"type": "v4", "value": new THREE.Vector4(bg_color_obj.r, bg_color_obj.g, bg_color_obj.b, 1.0)},
				"base_bg_color": {"type": "v4", "value": new THREE.Vector4(bg_color_obj.r, bg_color_obj.g, bg_color_obj.b, 1.0)},
				"base_text_color": {"type": "f", "value": color_for_uniform}
			},
			"vertexShader":   shader_labels_vertex,
			"fragmentShader": shader_labels_fragment
		})		
	);
	
	return new_obj;
}


var make_text_plane = function(text, font_face, font_size, font_color, background_color, is_transparent, i_plot) {
	// Inspired by Lee Stemkoski's example at
	// https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
	// which doesn't work with the latest three.js release.
	
	var canvas_height = Math.pow(2, Math.ceil(Math.log(font_size) / 0.693147180559945));
	
	font_size = Math.floor(canvas_height / plots[i_plot].font_ratio) - 1;
	
	var canvas_width = get_text_width(text, font_size, font_face);
	
	// Shouldn't be a problem, but just in case....
	if (canvas_width == 0) { canvas_width = 1; }
	
	var aspect = canvas_width / canvas_height;
	
	// The main text:
	var texture = new THREE.Texture(make_text_canvas(text, canvas_width, canvas_height, font_size, font_face, font_color, background_color));
	texture.needsUpdate = true;
	
	// It resizes the canvas to powers of 2 with the default minFilter:
	texture.minFilter = THREE.LinearFilter;
	
	var alpha_texture;
	
	if (is_transparent) {
		var canvas_alpha_map = document.createElement("canvas");
		canvas_alpha_map.width = canvas_width;
		canvas_alpha_map.height = canvas_height;
		var context_alpha_map = canvas_alpha_map.getContext("2d");
		context_alpha_map.font = font_size + "px " + font_face;
		context_alpha_map.fillStyle = background_color;
		context_alpha_map.fillRect(0, 0, canvas_width, canvas_height);
		
		// Grab the RGB of the background colour.
		var pixel_data = context_alpha_map.getImageData(0, 0, canvas_width, canvas_height);
		var pixels = pixel_data.data;
		var r = pixels[0];
		var g = pixels[1];
		var b = pixels[2];
		
		context_alpha_map.fillStyle = font_color;
		context_alpha_map.fillText(text, 0, font_size);
		
		pixel_data = context_alpha_map.getImageData(0, 0, canvas_width, canvas_height);
		pixels = pixel_data.data;
		
		for (var i = 0; i < pixels.length; i += 4) {
			if ((pixels[i] == r) && (pixels[i + 1] == g) && (pixels[i + 2] == b)) {
				pixels[i] = 0;
				pixels[i + 1] = 0;
				pixels[i + 2] = 0;
				pixels[i + 3] = 0;
			} else {
				pixels[i] = 255;
				pixels[i + 1] = 255;
				pixels[i + 2] = 255;
				pixels[i + 3] = 255;
			}
		}
		
		context_alpha_map.putImageData(pixel_data, 0, 0);
		
		alpha_texture = new THREE.Texture(canvas_alpha_map);
		alpha_texture.needsUpdate = true;
		alpha_texture.minFilter = THREE.LinearFilter;
	} else {
		alpha_texture = null;
	}
	
	var new_obj = new THREE.Mesh(
		new THREE.PlaneGeometry(aspect, 1, 1),
		new THREE.MeshBasicMaterial({map: texture, alphaMap: alpha_texture, transparent: is_transparent})		
	);
	
	return new_obj;
}

var get_font_height = function(font_style, div) {
	// Mostly from http://stackoverflow.com/a/7462767
	
	var dummy = document.createElement("div");
	
	if (div === undefined) {
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(dummy);
	} else {
		div.appendChild(dummy);
	}
	
	// I don't think the height actually varies with the letters:
	dummy.innerHTML = "Éy";
	dummy.setAttribute("style", font_style);
	
	var result = dummy.offsetHeight;
	
	if (div === undefined) {
		body.removeChild(dummy);
	} else {
		div.removeChild(dummy);
	}
	return result;
}

var hex_to_css_color = function(hex) {
	var r = hex >> 16;
	hex -= r << 16;
	var g = hex >> 8;
	var b = hex - (g << 8);
	
	return "rgb(" + r + "," + g + "," + b + ")";
}

var hex_to_rgb_obj = function(hex) {
	var r = hex >> 16;
	hex -= r << 16;
	var g = hex >> 8;
	var b = hex - (g << 8);
	
	return {"r": r/255, "g": g/255, "b": b/255};
}

var hex_to_rgb_obj_255 = function(hex) {
	var r = hex >> 16;
	hex -= r << 16;
	var g = hex >> 8;
	var b = hex - (g << 8);
	
	return {"r": r, "g": g, "b": b};
}


var css_color_to_hex = function(css, dummy) {
	// css a string; dummy an element of the DOM to colour.
	var remove_dummy = false;
	
	if (dummy === undefined) {
		var body = document.getElementsByTagName("body")[0];
		dummy = document.createElement("div");
		dummy.style.width = "1px";
		dummy.style.height = "1px";
		remove_dummy = true;
	}
	
	dummy.style.backgroundColor = css;
	
	if (remove_dummy) { body.appendChild(dummy); }
	
	var rgb = window.getComputedStyle(dummy).backgroundColor;
	
	if (remove_dummy) { body.removeChild(dummy); }
	
	rgb = rgb.replace(/rgb\(/, "");
	rgb = rgb.replace(/\)/, "");
	rgb = rgb.replace(/ /g, "");
	
	var reg = /([0-9]+)\,([0-9]+)\,([0-9]+)/g;
	rgb = reg.exec(rgb);
	
	return (parseInt(rgb[1]) << 16) + (parseInt(rgb[2]) << 8) + parseInt(rgb[3]);
}

var reset_camera_wrapper = function(i_plot, first_init, angles, origin) {
	return function () {
		reset_camera(i_plot, first_init, angles, origin);
	}
}

var reset_camera = function(i_plot, first_init, angles, origin) {
	var i;
	var lon = angles[0];
	var lat = angles[1];
	var psi = angles[2];
	
	var origin_vec = new THREE.Vector3(origin[0], origin[1], origin[2]);
	
	var change_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(-lat, lon, psi, "YXZ"))
		.premultiply(plots[i_plot].aux_camera_quat);
	
	plots[i_plot].persp_camera.rotation.setFromQuaternion(change_quat);
	
	plots[i_plot].camera_up = new THREE.Vector3(0, 1, 0)
		.applyQuaternion(change_quat);
	
	plots[i_plot].persp_camera.position
		.set(0, 0, 1)
		.applyQuaternion(change_quat)
		.multiplyScalar(plots[i_plot].camera_r)
		.add(origin_vec);
	
	plots[i_plot].ortho_camera.position.copy(plots[i_plot].persp_camera.position);
	plots[i_plot].ortho_camera.rotation.copy(plots[i_plot].persp_camera.rotation);
	
	plots[i_plot].camera_origin = new THREE.Vector3().copy(origin_vec);
	
	if (plots[i_plot].view_type == "perspective") {
		plots[i_plot].persp_camera.fov = plots[i_plot].init_fov;
	} else {
		// Orthographic.
		plots[i_plot].ortho_camera.top    =  plots[i_plot].init_ortho_top;
		plots[i_plot].ortho_camera.bottom = -plots[i_plot].init_ortho_top;
		plots[i_plot].ortho_camera.left   = -plots[i_plot].init_ortho_right;
		plots[i_plot].ortho_camera.right  =  plots[i_plot].init_ortho_right;
	}
	
	if (!first_init) {
		for (i = 0; i < plots[i_plot].axis_text_planes.length; i++) {
			plots[i_plot].axis_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
			plots[i_plot].axis_text_planes[i].scale.x = plots[i_plot].init_axis_title_scale;
			plots[i_plot].axis_text_planes[i].scale.y = plots[i_plot].init_axis_title_scale;
		}
		
		for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
			plots[i_plot].tick_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
			plots[i_plot].tick_text_planes[i].scale.x = plots[i_plot].init_tick_scale;
			plots[i_plot].tick_text_planes[i].scale.y = plots[i_plot].init_tick_scale;
		}
		
		if (plots[i_plot].have_any_labels) {
			update_labels(i_plot);
			
			for (i = 0; i < plots[i_plot].points.length; i++) {
				if (plots[i_plot].labels[i] !== null) {
					plots[i_plot].labels[i].scale.x = plots[i_plot].init_label_scale;
					plots[i_plot].labels[i].scale.y = plots[i_plot].init_label_scale;
				}
			}
		}
		
		if (plots[i_plot].geom_type == "quad") {
			for (i = 0; i < plots[i_plot].points.length; i++) {
				plots[i_plot].points[i].rotation.copy(get_current_camera(i_plot).rotation);
				set_point_size(i_plot, i, plots[i_plot].points[i].input_data.sphere_size);
			}
		}
		
		if (plots[i_plot].show_grid) {
			update_gridlines(i_plot);
		}
		
		if (plots[i_plot].dynamic_axis_labels) {
			update_axes(i_plot);
		}
		
		get_current_camera(i_plot).updateProjectionMatrix();
		update_render(i_plot);
	} else {
		get_current_camera(i_plot).updateProjectionMatrix();
	}
}

var get_i_plot = function(div_id) {
	for (var i = 0; i < plots.length; i++) {
		if (plots[i] !== null) {
			if (plots[i].parent_div.id == div_id) {
				return i;
			}
		}
	}
	
	return -1;
}

var destroy_plot = function(i_plot) {
	plots[i_plot].parent_div.innerHTML = "";
	plots[i_plot] = null;
}

var get_location = function(i_plot, position, world_space) {
	if (world_space === undefined) { world_space = false; }
	
	var axes = ["x", "y", "z"];
	var this_xyz = [0, 0, 0];
	var is_null = 0;
	var j;
	
	for (j = 0; j < 3; j++) {	
		if (!world_space) {
			this_xyz[j] = plots[i_plot].scales[j](position[j]);
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

var set_point_position = function(i_plot, i, position, set_segments, world_space) {
	if (world_space  === undefined) { world_space  = false; }
	if (set_segments === undefined) { set_segments = true;  }
	
	var loc = get_location(i_plot, position, world_space);
	var this_xyz = loc.coords;
	var is_null = loc.is_null;
	
	var axes = ["x", "y", "z"];
	var j;
	
	if (plots[i_plot].geom_type == "point") {
		var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
		var nulls = plots[i_plot].points_merged.geometry.attributes.null_point.array;
		plots[i_plot].points_merged.geometry.attributes.position.needsUpdate = true;
		plots[i_plot].points_merged.geometry.attributes.null_point.needsUpdate = true;
		
		for (j = 0; j < 3; j++) {
			positions[3*i + j] = this_xyz[j];
		}
		
		nulls[i] = is_null;
	} else if (plots[i_plot].geom_type == "quad") {
		for (j = 0; j < 3; j++) {
			plots[i_plot].points[i].position[axes[j]] = this_xyz[j];
		}
		
		var null_points = plots[i_plot].points[i].geometry.attributes.null_point.array;
		plots[i_plot].points[i].geometry.attributes.null_point.needsUpdate = true;
		
		null_points[0] = is_null;
		null_points[1] = is_null;
		null_points[2] = is_null;
		null_points[3] = is_null;
	}
	
	if (!world_space) {
		for (j = 0; j < 3; j++) {
			plots[i_plot].points[i].input_data[axes[j]] = position[j];
		}
	}
	
	if ((plots[i_plot].have_segments && set_segments) || (plots[i_plot].geom_type == "none")) {
		set_point_segments_position(i_plot, i, this_xyz, true, is_null);
	}
	
	update_labels(i_plot, i, i);
}

var set_point_segments_position = function(i_plot, i, position, world_space, is_null) {
	// Careful!  This function does not edit the points[i].input_data
	// fields, so it might lead to irregular behaviour if combined
	// with change_data().
	
	if (world_space === undefined) { world_space = false; }
	if (is_null === undefined) { is_null = false; }
	
	var loc = get_location(i_plot, position, world_space);
	var this_xyz = loc.coords;
	is_null = is_null || loc.is_null;
	
	var j;
	
	var group   = plots[i_plot].points[i].group;
	var i_group = plots[i_plot].points[i].i_group;
	
	var group_positions = plots[i_plot].groups[group].segment_lines.geometry.attributes.position.array;
	var group_nulls     = plots[i_plot].groups[group].segment_lines.geometry.attributes.null_point.array;
	
	plots[i_plot].groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
	plots[i_plot].groups[group].segment_lines.geometry.attributes.null_point.needsUpdate = true;
	
	for (j = 0; j < 3; j++) {
		group_positions[3*i_group + j] = this_xyz[j];
	}
	
	group_nulls[i_group] = is_null;
}

var set_surface_point_hide = function(i_plot, i, j, hide) {
	var hides = plots[i_plot].surface.geometry.attributes.hide_point.array;
	plots[i_plot].surface.geometry.attributes.hide_point.needsUpdate = true;
	
	plots[i_plot].hide_points[i][j] = hide;
	
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	var i_quad = surrounding_surface_quads(i_plot, i, j);
	
	var new_i_vert = [
		[1, 11],
		[8, 10],
		[5,  7],
		[2,  4]
	];
	
	var quad_hides = [0, 0, 0, 0, 0];
	var non_hides, tri_hide;
	var i1, j1;
	
	for (var k = 0; k < 4; k++) {
		if (i_quad[k] >= 0) {
			i1 = Math.floor(i_quad[k] / (ny - 1));
			j1 = i_quad[k] % (ny - 1);
			
			// Interpolated points (hide if there's at least one vertex
			// to hide in the triangle).
			quad_hides[0] = plots[i_plot].hide_points[i1  ][j1  ];
			quad_hides[1] = plots[i_plot].hide_points[i1+1][j1  ];
			quad_hides[2] = plots[i_plot].hide_points[i1+1][j1+1];
			quad_hides[3] = plots[i_plot].hide_points[i1  ][j1+1];
			
			non_hides = 4 - (quad_hides[0] + quad_hides[1] + quad_hides[2] + quad_hides[3]);
			
			quad_hides[4] = (non_hides >= 3) ? 0 : 1;
			
			tri_hide = [
				quad_hides[0] || quad_hides[1] || quad_hides[4],
				quad_hides[1] || quad_hides[2] || quad_hides[4],
				quad_hides[2] || quad_hides[3] || quad_hides[4],
				quad_hides[3] || quad_hides[0] || quad_hides[4]
			];
			
			for (var k_tri = 0; k_tri < 4; k_tri++) {
				hides[i_quad[k]*12 + k_tri*3 + 0] = tri_hide[k_tri];
				hides[i_quad[k]*12 + k_tri*3 + 1] = tri_hide[k_tri];
				hides[i_quad[k]*12 + k_tri*3 + 2] = tri_hide[k_tri];
			}
			
			hides[i_quad[k]*12 + new_i_vert[k][0]] = hide;
			hides[i_quad[k]*12 + new_i_vert[k][1]] = hide;
		}
	}
}

var set_mesh_point_hide = function(i_plot, i, j, hide) {
	var hides = plots[i_plot].surface_mesh.geometry.attributes.hide_point.array;
	plots[i_plot].surface_mesh.geometry.attributes.hide_point.needsUpdate = true;
	
	plots[i_plot].hide_mesh_points[i][j] = hide;
	
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	var i_segment = surrounding_mesh_segments(i_plot, i, j);
	
	var idx_hide = [0, 1, 0, 1];
	
	for (var k = 0; k < 4; k++) {
		// Loop over segments.
		
		if (i_segment[k] >= 0) {
			hides[i_segment[k]*2 + idx_hide[k]] = hide;
		}
	}
}

var hide_surface_point = function(i_plot, i, j) {
	set_surface_point_hide(i_plot, i, j, 1);
}

var show_surface_point = function(i_plot, i, j) {
	set_surface_point_hide(i_plot, i, j, 0);
}

var hide_mesh_point = function(i_plot, i, j) {
	set_mesh_point_hide(i_plot, i, j, 1);
}

var show_mesh_point = function(i_plot, i, j) {
	set_mesh_point_hide(i_plot, i, j, 0);
}

var set_mesh_axis_hide = function(i_plot, i_dirn, hide) {
	plots[i_plot].hiding_mesh_axes[i_dirn] = !!hide;
	
	var hide_axes = plots[i_plot].surface_mesh.geometry.attributes.hide_axis.array;
	plots[i_plot].surface_mesh.geometry.attributes.hide_axis.needsUpdate = true;
	
	var N = hide_axes.length/2;
	var offset_i = 0;
	
	if (i_dirn == 0) { offset_i = N; }
	
	for (var i = offset_i; i < N + offset_i; i++) {
		hide_axes[i] = hide;
	}
}

var hide_mesh_x = function(i_plot) {
	set_mesh_axis_hide(i_plot, 0, 1);
}

var show_mesh_x = function(i_plot) {
	set_mesh_axis_hide(i_plot, 0, 0);
}

var hide_mesh_y = function(i_plot) {
	set_mesh_axis_hide(i_plot, 1, 1);
}

var show_mesh_y = function(i_plot) {
	set_mesh_axis_hide(i_plot, 1, 0);
}

var surrounding_surface_quads = function(i_plot, i, j) {
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	var i_quad = [-1, -1, -1, -1];
	
	if ((i < nx - 1) && (j < ny - 1)) { i_quad[0] =       i*(ny - 1) + j;     }
	if ((i < nx - 1) && (j > 0))      { i_quad[1] =       i*(ny - 1) + j - 1; }
	if ((i > 0)      && (j > 0))      { i_quad[2] = (i - 1)*(ny - 1) + j - 1; }
	if ((i > 0)      && (j < ny - 1)) { i_quad[3] = (i - 1)*(ny - 1) + j;     }
	
	return i_quad;
}

var surrounding_mesh_segments = function(i_plot, i, j) {
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	var i_segment = [-1, -1, -1, -1];
	
	if (i < nx - 1) { i_segment[0] = (ny - 1)*nx + j*(nx - 1) + i; }
	if (i > 0)      { i_segment[1] = (ny - 1)*nx + j*(nx - 1) + i - 1; }
	if (j < ny - 1) { i_segment[2] =               i*(ny - 1) + j; }
	if (j > 0)      { i_segment[3] =               i*(ny - 1) + j - 1; }
	
	return i_segment;
}

var set_surface_point_z = function(i_plot, i, j, z) {
	plots[i_plot].mesh_points[i][j].input_data.z = z;
	var this_z = plots[i_plot].scales[2](z);
	
	var positions = plots[i_plot].surface.geometry.attributes.position.array;
	var nulls     = plots[i_plot].surface.geometry.attributes.null_point.array;
	
	plots[i_plot].surface.geometry.attributes.position.needsUpdate   = true;
	plots[i_plot].surface.geometry.attributes.null_point.needsUpdate = true;
	
	var mesh_positions = plots[i_plot].surface_mesh.geometry.attributes.position.array;
	var mesh_nulls     = plots[i_plot].surface_mesh.geometry.attributes.null_point.array;
	
	plots[i_plot].surface_mesh.geometry.attributes.position.needsUpdate = true;
	plots[i_plot].surface_mesh.geometry.attributes.null_point.needsUpdate = true;
	
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	// Start with the surface.
	
	// The mesh point (i, j) is at the corner of up to four quads.
	var i_quad = surrounding_surface_quads(i_plot, i, j);
	
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
	
	plots[i_plot].mesh_points[i][j].input_data.z = z;
	
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
			
			temp_z[0] = plots[i_plot].mesh_points[i1  ][j1  ].input_data.z;
			temp_z[1] = plots[i_plot].mesh_points[i1+1][j1  ].input_data.z;
			temp_z[2] = plots[i_plot].mesh_points[i1+1][j1+1].input_data.z;
			temp_z[3] = plots[i_plot].mesh_points[i1  ][j1+1].input_data.z;
			
			non_nulls = 0;
			
			for (k_vert = 0; k_vert < 4; k_vert++) {
				if (isNaN(temp_z[k_vert]) || (temp_z[k_vert] === null)) {
					quad_null[k_vert] = 1;
					quad_z[k_vert] = 0;
				} else {
					quad_null[k_vert] = 0;
					quad_z[k_vert] = plots[i_plot].scales[2](temp_z[k_vert]);
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
	
	var i_segment = surrounding_mesh_segments(i_plot, i, j);
	var idx = [0, 3, 0, 3];
	var idx_null = [0, 1, 0, 1];
	
	for (k = 0; k < 4; k++) {
		// Loop over segments.
		
		if (i_segment[k] >= 0) {
			mesh_positions[i_segment[k]*6 + idx[k] + 2] = this_z;
			mesh_nulls[i_segment[k]*2 + idx_null[k]] = this_null;
		}
	}
	
	
	if (!plots[i_plot].have_color_matrix) {
		// Re-calculate the colour according to the scale.
		var this_color = calculate_color(z, plots[i_plot].color_domain, plots[i_plot].color_fn);
		var this_color_num = 65536*Math.round(255*this_color[0]) + 256*Math.round(255*this_color[1]) + Math.round(255*this_color[2]);
		set_surface_point_color(i_plot, i, j, this_color_num, true);
	}
}

var set_color = function(i_plot, i, col, set_segments) {
	if (!plots[i_plot].set_color_warning) {
		console.warn("set_color() is deprecated; use set_point_color() instead.");
		plots[i_plot].set_color_warning = true;
	}
	set_point_color(i_plot, i, col, set_segments);
}

var set_point_color = function(i_plot, i, col, set_segments) {
	if (set_segments === undefined) { set_segments = true; }
	
	var rgb = hex_to_rgb_obj_255(col);
	
	if (plots[i_plot].geom_type == "point") {
		var colors = plots[i_plot].points_merged.geometry.attributes.color.array;
		plots[i_plot].points_merged.geometry.attributes.color.needsUpdate = true;
		colors[4*i] = rgb.r;
		colors[4*i + 1] = rgb.g;
		colors[4*i + 2] = rgb.b;
		colors[4*i + 3] = 255;
	} else if (plots[i_plot].geom_type == "quad") {
		var colors = plots[i_plot].points[i].geometry.attributes.color.array;
		plots[i_plot].points[i].geometry.attributes.color.needsUpdate = true;
		
		for (var j = 0; j < 4; j++) {
			colors[4*j + 0] = rgb.r;
			colors[4*j + 1] = rgb.g;
			colors[4*j + 2] = rgb.b;
			colors[4*j + 3] = 255;
		}
	}
	
	if (plots[i_plot].have_segments && set_segments) {
		set_point_segments_color(i_plot, i, col);
	}
}

var set_point_segments_color = function(i_plot, i, col) {
	var group   = plots[i_plot].points[i].group;
	var i_group = plots[i_plot].points[i].i_group;
	var rgb = hex_to_rgb_obj(col);
	
	var colors = plots[i_plot].groups[group].segment_lines.geometry.attributes.color.array;
	plots[i_plot].groups[group].segment_lines.geometry.attributes.color.needsUpdate = true;
	
	colors[4*i_group + 0] = rgb.r;
	colors[4*i_group + 1] = rgb.g;
	colors[4*i_group + 2] = rgb.b;
	colors[4*i_group + 3] = 1.0;
}

var set_label_color = function(i_plot, i, col) {
	var rgb = hex_to_rgb_obj(col);
	plots[i_plot].labels[i].material.uniforms.color.value = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
}

var set_label_background_color = function(i_plot, i, col) {
	var rgb = hex_to_rgb_obj(col);
	plots[i_plot].labels[i].material.uniforms.bg_color.value = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
}

var set_surface_point_color = function(i_plot, i, j, col, permanent) {
	if (permanent === undefined) { permanent = false; }
	var rgb = hex_to_rgb_obj(col);
	
	var colors = plots[i_plot].surface.geometry.attributes.color.array;
	plots[i_plot].surface.geometry.attributes.color.needsUpdate = true;
	
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	// The mesh point (i, j) is at the corner of up to four quads.
	var i_quad = surrounding_surface_quads(i_plot, i, j);
	
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
	
	var channels = ["r", "g", "b"];
	var channel;
	var non_null = 1;
	
	if (permanent) {
		var k_col, k_vert;
		
		var rgb1, rgb2, rgb3;
		var non_null1, non_null2, non_null3, non_nulls;
		
		// If the colour being changed is of a currently null point,
		// don't want to re-do interpolations.
		non_null = 1 - (isNaN(plots[i_plot].mesh_points[i][j].input_data.z) || (plots[i_plot].mesh_points[i][j].input_data.z === null));
		
		plots[i_plot].mesh_points[i][j].input_data.color = col;
		
		set_mesh_point_color(i_plot, i, j, col);
		
		// Indices of the other mesh points in each quad,
		// required to set the new interpolated value:
		
		var i1 = [
			[i+1, i+1, i  ],
			[i+1, i+1, i  ],
			[i-1, i-1, i  ],
			[i-1, i-1, i  ]
		];
		
		var j1 = [
			[j  , j+1, j+1],
			[j  , j-1, j-1],
			[j  , j-1, j-1],
			[j  , j+1, j+1]
		];
		
		var interp_i = [0, 12, 24, 36];
	}
	
	var idx_color_start = [
		[ 4, 44],
		[32, 40],
		[20, 28],
		[ 8, 16]
	];
	
	var k_col, k_vert;
	
	for (var k = 0; k < 4; k++) {
		// Loop over quads.
		
		if (i_quad[k] >= 0) {
			if (permanent) {
				rgb1 = hex_to_rgb_obj(plots[i_plot].mesh_points[i1[k][0]][j1[k][0]].input_data.color);
				rgb2 = hex_to_rgb_obj(plots[i_plot].mesh_points[i1[k][1]][j1[k][1]].input_data.color);
				rgb3 = hex_to_rgb_obj(plots[i_plot].mesh_points[i1[k][2]][j1[k][2]].input_data.color);
				
				non_null1 = 1 - 1*(isNaN(plots[i_plot].mesh_points[i1[k][0]][j1[k][0]].input_data.z) || (plots[i_plot].mesh_points[i1[k][0]][j1[k][0]].input_data.z === null));
				non_null2 = 1 - 1*(isNaN(plots[i_plot].mesh_points[i1[k][1]][j1[k][1]].input_data.z) || (plots[i_plot].mesh_points[i1[k][1]][j1[k][1]].input_data.z === null));
				non_null3 = 1 - 1*(isNaN(plots[i_plot].mesh_points[i1[k][2]][j1[k][2]].input_data.z) || (plots[i_plot].mesh_points[i1[k][2]][j1[k][2]].input_data.z === null));
				
				non_nulls = non_null + non_null1 + non_null2 + non_null3;
				
				if (non_nulls >= 3) {
					for (k_vert = 0; k_vert < 4; k_vert++) {
						for (k_col = 0; k_col < 3; k_col++) {
							channel = channels[k_col];
							colors[i_quad[k]*48 + interp_i[k_vert] + k_col] = (non_null*rgb[channel] + non_null1*rgb1[channel] + non_null2*rgb2[channel] + non_null3*rgb3[channel]) / non_nulls;
						}
						colors[i_quad[k]*48 + interp_i[k_vert] + 3] = 1;
					}
				}
			}
			
			for (k_col = 0; k_col < 3; k_col++) {
				colors[i_quad[k]*48 + idx_color_start[k][0] + k_col] = rgb[channels[k_col]];
				colors[i_quad[k]*48 + idx_color_start[k][1] + k_col] = rgb[channels[k_col]];
			}
			colors[i_quad[k]*48 + idx_color_start[k][0] + 3] = 1;
			colors[i_quad[k]*48 + idx_color_start[k][1] + 3] = 1;
		}
	}
}

var set_mesh_point_color = function(i_plot, i, j, col) {
	var rgb = hex_to_rgb_obj(col);
	
	var colors = plots[i_plot].surface_mesh.geometry.attributes.color.array;
	plots[i_plot].surface_mesh.geometry.attributes.color.needsUpdate = true;
	
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	//var i_segment = [-1, -1, -1, -1];
	var i_segment = surrounding_mesh_segments(i_plot, i, j);
	var idx = [0, 4, 0, 4];
	var base_i;
	
	for (var k = 0; k < 4; k++) {
		// Loop over segments.
		
		if (i_segment[k] >= 0) {
			base_i = i_segment[k]*8;
			
			colors[base_i + idx[k] + 0] = rgb.r;
			colors[base_i + idx[k] + 1] = rgb.g;
			colors[base_i + idx[k] + 2] = rgb.b;
			colors[base_i + idx[k] + 3] = 1;
		}
	}
}

var set_surface_color_scale_fn = function(i_plot, fn) {
	if (typeof(fn) == "function") {
		plots[i_plot].color_fn = fn;
	} else if (fn == "viridis") {
		plots[i_plot].color_fn = colorscale_viridis;
	} else if (fn == "inferno") {
		plots[i_plot].color_fn = colorscale_inferno;
	} else if (fn == "magma") {
		plots[i_plot].color_fn = colorscale_magma;
	} else if (fn == "plasma") {
		plots[i_plot].color_fn = colorscale_plasma;
	} else if (fn.search(/gr(e|a)yscale/) > -1) {
		plots[i_plot].color_fn = colorscale_greys;
	} else {
		plots[i_plot].color_fn = colorscale_viridis;
	}
}

var set_surface_color_scale = function(i_plot, fn) {
	set_surface_color_scale_fn(i_plot, fn);
	
	var nx = plots[i_plot].mesh_points.length;
	var ny = plots[i_plot].mesh_points[0].length;
	
	for (var i = 0; i < nx; i++) {
		for (var j = 0; j < ny; j++) {
			var this_color = calculate_color(plots[i_plot].mesh_points[i][j].input_data.z, plots[i_plot].color_domain, plots[i_plot].color_fn);
			var this_color_num = 65536*Math.round(255*this_color[0]) + 256*Math.round(255*this_color[1]) + Math.round(255*this_color[2]);
			set_surface_point_color(i_plot, i, j, this_color_num, true);
		}
	}
}

var set_size = function(i_plot, i, size, scale_factor) {
	if (!plots[i_plot].set_size_warning) {
		console.warn("set_size() is deprecated; use set_point_size() instead.");
		plots[i_plot].set_size_warning = true;
	}
	set_point_size(i_plot, i, size, scale_factor);
}

var set_point_size = function(i_plot, i, size, scale_factor) {
	if (plots[i_plot].geom_type == "point") {
		var dot_heights = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
		plots[i_plot].points_merged.geometry.attributes.dot_height.needsUpdate = true;
		
		dot_heights[i] = size;		
	} else if (plots[i_plot].geom_type == "quad") {
		if (scale_factor === undefined) {
			var scale_factor = 2 * get_scale_factor(i_plot);
		}
		
		plots[i_plot].points[i].scale.x = scale_factor * size;
		plots[i_plot].points[i].scale.y = scale_factor * size;
	}
}

var hide_point = function(i_plot, i, hide_segments) {
	if (hide_segments === undefined) { hide_segments = plots[i_plot].have_segments; }
	
	if (plots[i_plot].geom_type == "point") {
		var hide_points = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
		plots[i_plot].points_merged.geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[i] = 1.0;
	} else if (plots[i_plot].geom_type == "quad") {
		var hide_points = plots[i_plot].points[i].geometry.attributes.hide_point.array;
		plots[i_plot].points[i].geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[0] = 1.0;
		hide_points[1] = 1.0;
		hide_points[2] = 1.0;
		hide_points[3] = 1.0;
	}
	
	if (plots[i_plot].have_segments && hide_segments) {
		hide_point_segments(i_plot, i);
	}
}

var hide_point_segments = function(i_plot, i) {
	if (!plots[i_plot].have_segments) { return; }
	
	var group   = plots[i_plot].points[i].group;
	var i_group = plots[i_plot].points[i].i_group;
	
	var hides = plots[i_plot].groups[group].segment_lines.geometry.attributes.hide_point.array;
	plots[i_plot].groups[group].segment_lines.geometry.attributes.hide_point.needsUpdate = true;
	
	hides[i_group] = 1;
}

var hide_group = function(i_plot, group, hide_segments) {
	if (hide_segments === undefined) { hide_segments = plots[i_plot].have_segments; }
	
	if (!plots[i_plot].groups.hasOwnProperty(group)) { return; }
	
	for (var i = 0; i < plots[i_plot].groups[group].i_main.length; i++) {
		hide_point(i_plot, plots[i_plot].groups[group].i_main[i], hide_segments);
	}
}

var show_point = function(i_plot, i, show_segments) {
	if (show_segments === undefined) { show_segments = plots[i_plot].have_segments; }
	
	if (plots[i_plot].geom_type == "point") {
		var hide_points = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
		plots[i_plot].points_merged.geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[i] = 0.0;
	} else if (plots[i_plot].geom_type == "quad") {
		var hide_points = plots[i_plot].points[i].geometry.attributes.hide_point.array;
		plots[i_plot].points[i].geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[0] = 0.0;
		hide_points[1] = 0.0;
		hide_points[2] = 0.0;
		hide_points[3] = 0.0;
	}
	
	if (plots[i_plot].have_segments && show_segments) {
		show_point_segments(i_plot, i);
	}
}

var show_point_segments = function(i_plot, i) {
	if (!plots[i_plot].have_segments) { return; }
	
	var group   = plots[i_plot].points[i].group;
	var i_group = plots[i_plot].points[i].i_group;
	
	var hides = plots[i_plot].groups[group].segment_lines.geometry.attributes.hide_point.array;
	plots[i_plot].groups[group].segment_lines.geometry.attributes.hide_point.needsUpdate = true;
	
	hides[i_group] = 0;
}

var show_group = function(i_plot, group, show_segments) {
	if (show_segments === undefined) { show_segments = plots[i_plot].have_segments; }
	
	if (!plots[i_plot].groups.hasOwnProperty(group)) { return; }
	
	for (var i = 0; i < plots[i_plot].groups[group].i_main.length; i++) {
		show_point(i_plot, plots[i_plot].groups[group].i_main[i], show_segments);
	}
}

var hide_label = function(i_plot, i) {
	if (plots[i_plot].points[i].have_label) {
		plots[i_plot].scene.remove(plots[i_plot].labels[i]);
	}
}

var hide_group_labels = function(i_plot, group) {
	if (!plots[i_plot].groups.hasOwnProperty(group)) { return; }
	
	for (var i = 0; i < plots[i_plot].groups[group].i_main.length; i++) {
		hide_label(i_plot, plots[i_plot].groups[group].i_main[i]);
	}
}

var show_label = function(i_plot, i) {
	if (plots[i_plot].points[i].have_label) {
		plots[i_plot].scene.add(plots[i_plot].labels[i]);
	}
}

var show_group_labels = function(i_plot, group) {
	if (!plots[i_plot].groups.hasOwnProperty(group)) { return; }
	
	for (var i = 0; i < plots[i_plot].groups[group].i_main.length; i++) {
		show_label(i_plot, plots[i_plot].groups[group].i_main[i]);
	}
}

var show_surface = function(i_plot) {
	plots[i_plot].scene.add(plots[i_plot].surface);
	plots[i_plot].showing_surface = true;
}

var hide_surface = function(i_plot) {
	plots[i_plot].scene.remove(plots[i_plot].surface);
	plots[i_plot].showing_surface = false;
}

var show_mesh = function(i_plot) {
	plots[i_plot].scene.add(plots[i_plot].surface_mesh);
	plots[i_plot].showing_mesh = true;
}

var hide_mesh = function(i_plot) {
	plots[i_plot].scene.remove(plots[i_plot].surface_mesh);
	plots[i_plot].showing_mesh = false;
}

var set_mesh_uniform_color = function(i_plot, col) {
	if (col == "variable") {
		plots[i_plot].surface_mesh.material.uniforms.use_const_color.value = 0;
		return;
	}
	
	var i, rgb;
	plots[i_plot].surface_mesh.material.uniforms.use_const_color.value = 1;
	
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
	
	plots[i_plot].mesh_material.uniforms.const_color.value = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
}

var use_uniform_mesh_color = function(i_plot) {
	plots[i_plot].mesh_material.uniforms.use_const_color.value = 1;
	return;
}

var update_render = function(i_plot) {
	plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
}

var get_colors = function(i_plot, params) {
	var tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	var colors = [];
	
	for (var i = 0; i < params.data.length; i++) {
		if (!params.data[i].hasOwnProperty("color")) {
			if (!plots[i_plot].have_groups) {
				params.data[i].color = plots[i_plot].groups.default_group.default_color;
			} else {
				params.data[i].color = plots[i_plot].groups[params.data[i].group].default_color;
			}
		} else {
			if (typeof(params.data[i].color) == "string") {
				params.data[i].color = css_color_to_hex(params.data[i].color, tiny_div);
			} else {
				params.data[i].color = params.data[i].color;
			}
		}
		
		colors.push(params.data[i].color);
	}
	
	plots[i_plot].parent_div.removeChild(tiny_div);
	return colors;
}

var colorise_otherise_params = function(i_plot, params) {
	var colors = get_colors(i_plot, params);
	
	for (var i = 0; i < params.data.length; i++) {
		if (!params.data[i].hasOwnProperty("other")) {
			params.data[i].other = {};
		}
		
		params.data[i].color = colors[i];
	}
}

var prepare_sizes = function(i_plot, params) {
	colorise_otherise_params(i_plot, params);
	
	if (plots[i_plot].geom_type == "none") {
		plots[i_plot].have_any_labels = false;
		plots[i_plot].have_any_sizes = false;
		return;
	}
	
	var i;
	
	plots[i_plot].have_any_sizes = plots[i_plot].have_any_sizes || false;
	plots[i_plot].have_any_labels = plots[i_plot].have_any_labels || false;
	
	for (i = 0; i < params.data.length; i++) {
		if (params.data[i].hasOwnProperty("size")) {
			if (!!params.data[i].size || (params.data[i].size === 0)) {
				plots[i_plot].have_any_sizes = true;
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
					plots[i_plot].have_any_labels = true;
				}
			} else {
				params.data[i].label = "";
			}
		}
	}
	
	if (params.hasOwnProperty("size_exponent")) {
		plots[i_plot].size_exponent = 2*params.size_exponent;
	} else {
		if (!(plots[i_plot].hasOwnProperty("size_exponent"))) {
			plots[i_plot].size_exponent = 2;
		}
	}
}

var make_axes = function(i_plot, params, append) {
	// Sometimes this will be called when the plot is
	// first initialised; sometimes it will be when the
	// data is updated change_data() calls it.
	
	if (append === undefined) {
		append = false;
	}
	
	var i, j, k, l;
	var axes = ["x", "y", "z", "size"];
	
	var specify_axis_lengths = params.hasOwnProperty("axis_length_ratios");
	var fix_axes = false;
	var same_scale;
	
	if (!append) {
		var time_axis = params.hasOwnProperty("time_axis") ? JSON.parse(JSON.stringify(params.time_axis)) : [false, false, false];
		plots[i_plot].time_axis = JSON.parse(JSON.stringify(time_axis));
	} else {
		time_axis = JSON.parse(JSON.stringify(plots[i_plot].time_axis));
	}
	
	if (specify_axis_lengths) {
		var axis_length_ratios = JSON.parse(JSON.stringify(params.axis_length_ratios));
		var max_axis_ratio = d3.max(axis_length_ratios);
		fix_axes = true;
		
		// Poorly named:
		same_scale = [true, true, true];
	} else {
		if (params.hasOwnProperty("same_scale")) {
			same_scale = JSON.parse(JSON.stringify(params.same_scale));
		} else {
			same_scale = [false, false, false];
		}
		
		var num_same_scales = 0;
		
		for (i = 0; i < same_scale.length; i++) {
			if (same_scale[i]) { num_same_scales++; }
		}
		if (num_same_scales > 1) { fix_axes = true; }
	}
	
	
	if (plots[i_plot].plot_type == "scatter") {
		if (params.hasOwnProperty("size_scale_bound")) {
			if (plots[i_plot].size_exponent == 0) {
				params.scaled_size_scale_bound = 1;
			} else {
				params.scaled_size_scale_bound = Math.pow(params.size_scale_bound, 1/plots[i_plot].size_exponent);
			}
		}

		for (i = 0; i < params.data.length; i++) {
			if (plots[i_plot].size_exponent == 0) {
				params.data[i].scaled_size = 1;
			} else {
				params.data[i].scaled_size = Math.pow(params.data[i].size, 1/plots[i_plot].size_exponent);
			}
		}
	}
	
	
	var tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	var axis_color;
	if (params.hasOwnProperty("axis_color")) {
		axis_color = params.axis_color;
	} else {
		if (!plots[i_plot].hasOwnProperty("axis_color")) {
			axis_color = 0xFFFFFF;
		} else {
			axis_color = plots[i_plot].axis_color;
		}
	}
	
	if (typeof(axis_color) == "string") {
		axis_color = css_color_to_hex(axis_color, tiny_div);
	}
	
	plots[i_plot].axis_color = axis_color;
	
	var line_material = new THREE.LineBasicMaterial({"color": axis_color});
	
	var axis_ranges = [100, 100, 100, 100];
	var max_fixed_range = -1;
	var this_axis_range;
	var this_domain;
	var temp_min1, temp_max1, temp_min2, temp_max2;
	
	if (!append) {
		plots[i_plot].domains = [];
	}
	plots[i_plot].ranges = [];
	plots[i_plot].scales = [];
	
	var adjust_domains;
	
	for (i = 0; i < 3; i++) {
		adjust_domains = true;
		
		if (params.hasOwnProperty(axes[i] + "_scale_bounds")) {
			this_domain = JSON.parse(JSON.stringify(params[axes[i] + "_scale_bounds"]));
			plots[i_plot].domains.push([this_domain[0], this_domain[1]]);
			adjust_domains = false;
			
			if ((i == 2) && (plots[i_plot].plot_type == "surface")) {
				if (!params.hasOwnProperty("color_scale_bounds")) {
					plots[i_plot].color_domain = plots[i_plot].domains[2].slice(0);
				} else {
					plots[i_plot].color_domain = params.color_scale_bounds.slice(0);
				}
			}
		} else {
			if (plots[i_plot].plot_type == "scatter") {
				temp_min1 = d3.min(params.data, function(d) { return d[axes[i]]; });
				temp_max1 = d3.max(params.data, function(d) { return d[axes[i]]; });
				
				if (append) {
					temp_min2 = d3.min(plots[i_plot].points, function(d) { return d.input_data[axes[i]]; });
					temp_max2 = d3.max(plots[i_plot].points, function(d) { return d.input_data[axes[i]]; });
					
					plots[i_plot].domains[i][0] = d3.min([temp_min1, temp_min2]);
					plots[i_plot].domains[i][1] = d3.max([temp_max1, temp_max2]);
				} else {
					plots[i_plot].domains.push([temp_min1, temp_max1]);
				}
			} else if (plots[i_plot].plot_type == "surface") {
				if (i < 2) {
					// x or y.
					
					temp_min1 = d3.min(params.data[axes[i]]);
					temp_max1 = d3.max(params.data[axes[i]]);
					
					if (append) {
						if (i == 0) {
							// x.
							temp_min2 = d3.min(plots[i_plot].mesh_points, function(d) { return d[0].input_data.x; });
							temp_max2 = d3.max(plots[i_plot].mesh_points, function(d) { return d[0].input_data.x; });
						} else if (i == 1) {
							// y.
							temp_min2 = d3.min(plots[i_plot].mesh_points[0], function(d) { return d.input_data.y; });
							temp_max2 = d3.max(plots[i_plot].mesh_points[0], function(d) { return d.input_data.y; });
						}
						
						plots[i_plot].domains[i][0] = d3.min([temp_min1, temp_min2]);
						plots[i_plot].domains[i][1] = d3.max([temp_max1, temp_max2]);
					} else {
						plots[i_plot].domains.push([temp_min1, temp_max1]);
					}
				} else if (i == 2) {
					// z.
					
					temp_min1 = d3.min(params.data.z, function(d) { return d3.min(d); });
					temp_max1 = d3.max(params.data.z, function(d) { return d3.max(d); });
					
					if (append) {
						
						temp_min2 = d3.min(plots[i_plot].mesh_points, function(d) { return d3.min(d, function(d2) { return d2.input_data.z; }); });
						temp_max2 = d3.max(plots[i_plot].mesh_points, function(d) { return d3.max(d, function(d2) { return d2.input_data.z; }); });
						
						plots[i_plot].domains[i][0] = d3.min([temp_min1, temp_min2]);
						plots[i_plot].domains[i][1] = d3.max([temp_max1, temp_max2]);
					} else {
						plots[i_plot].domains.push([temp_min1, temp_max1]);
					}
					
					if (!params.hasOwnProperty("color_scale_bounds")) {
						plots[i_plot].color_domain = plots[i_plot].domains[2].slice(0);
						if (time_axis[i]) {
							plots[i_plot].color_domain[0] = new Date(JSON.parse(JSON.stringify(plots[i_plot].color_domain[0])));
							plots[i_plot].color_domain[1] = new Date(JSON.parse(JSON.stringify(plots[i_plot].color_domain[1])));
							
							if (plots[i_plot].color_domain[0].getTime() == plots[i_plot].color_domain[1].getTime()) {
								plots[i_plot].color_domain[0].setTime(plots[i_plot].color_domain[0].getTime() - plots[i_plot].null_width_time);
								plots[i_plot].color_domain[1].setTime(plots[i_plot].color_domain[1].getTime() + plots[i_plot].null_width_time);
							}
						} else {
							if (plots[i_plot].color_domain[0] == plots[i_plot].color_domain[1]) {
								plots[i_plot].color_domain[0] -= plots[i_plot].null_width;
								plots[i_plot].color_domain[1] += plots[i_plot].null_width;
							}
						}
					} else {
						plots[i_plot].color_domain = params.color_scale_bounds.slice(0);
					}
				}
			}
		}
		
		if (time_axis[i]) {
			// It looks like for a time axis, the domains[i] contains
			// shallow copies of the min and max from the data, so go
			// through JSON to prevent the input data values from being
			// changed when the axis extents are changed (!).
			plots[i_plot].domains[i][0] = new Date(JSON.parse(JSON.stringify(plots[i_plot].domains[i][0])));
			plots[i_plot].domains[i][1] = new Date(JSON.parse(JSON.stringify(plots[i_plot].domains[i][1])));
			
			this_axis_range = plots[i_plot].domains[i][1].getTime() - plots[i_plot].domains[i][0].getTime();
		} else {
			this_axis_range = plots[i_plot].domains[i][1] - plots[i_plot].domains[i][0];
		}
		
		axis_ranges[i] = this_axis_range;
		
		
		if (this_axis_range == 0) {
			if (time_axis[i]) {
				plots[i_plot].domains[i][0].setTime(plots[i_plot].domains[i][0].getTime() - plots[i_plot].null_width_time);
				plots[i_plot].domains[i][1].setTime(plots[i_plot].domains[i][1].getTime() + plots[i_plot].null_width_time);
			} else {
				plots[i_plot].domains[i][0] -= plots[i_plot].null_width;
				plots[i_plot].domains[i][1] += plots[i_plot].null_width;
			}
		} else {
			if (adjust_domains) {
				if (time_axis[i]) {
					plots[i_plot].domains[i][0].setTime(plots[i_plot].domains[i][0].getTime() - 0.1*this_axis_range);
					plots[i_plot].domains[i][1].setTime(plots[i_plot].domains[i][1].getTime() + 0.1*this_axis_range);
				} else {
					plots[i_plot].domains[i][0] -= 0.1*this_axis_range;
					plots[i_plot].domains[i][1] += 0.1*this_axis_range;
				}
			}
		}
		
		if (fix_axes && same_scale[i]) {
			if (this_axis_range > max_fixed_range) {
				max_fixed_range = this_axis_range;
			}
		}
	}
	
	if (plots[i_plot].plot_type == "scatter") {
		// Sphere min size extent is always zero.
		if (params.hasOwnProperty("size_scale_bound")) {
			plots[i_plot].domains.push([0, params.scaled_size_scale_bound]);
		} else {
			temp_max1 = d3.max(params.data, function(d) { return d.scaled_size; });
			
			if (append) {
				temp_max2 = d3.max(plots[i_plot].points, function(d) { return d.input_data.scaled_size; });
				plots[i_plot].domains[3][1] = d3.max([temp_max1, temp_max2]);
			} else {
				plots[i_plot].domains.push([0, temp_max1]);
			}
		}
	}
	
	var axis_scale_factor = [1, 1, 1];
	for (i = 0; i < 3; i++) {
		if (fix_axes && same_scale[i]) {
			axis_scale_factor[i] = axis_ranges[i] / max_fixed_range;
		}
		
		if (fix_axes && specify_axis_lengths) {
			axis_scale_factor[i] = axis_length_ratios[i] / max_axis_ratio;
		}
		
		plots[i_plot].ranges.push([-axis_scale_factor[i], axis_scale_factor[i]]);
	}
	
	if (plots[i_plot].plot_type == "scatter") {
		if (params.hasOwnProperty("max_point_height")) {
			plots[i_plot].max_point_height = params.max_point_height;
		} else {
			if (!plots[i_plot].hasOwnProperty("max_point_height")) {
				plots[i_plot].max_point_height = 25;
			}
		}
	
		plots[i_plot].ranges.push([0, plots[i_plot].max_point_height]);
	}
	
	var n_axes = 4;
	time_axis.push(false);
	if (plots[i_plot].plot_type == "surface") { n_axes = 3; }
	
	for (i = 0; i < n_axes; i++) {
		
		if (time_axis[i]) {
			plots[i_plot].scales.push(
				d3.scaleTime()
					.domain(plots[i_plot].domains[i])
					.range(plots[i_plot].ranges[i])
			);
		} else {
			plots[i_plot].scales.push(
				d3.scaleLinear()
					.domain(plots[i_plot].domains[i])
					.range(plots[i_plot].ranges[i])
			);
		}
	}
	
	
	var box_geom = new THREE.Geometry();
	// LineSegments draws a segment between vertices 0 and 1, 2, and 3, 4 and 5, ....
	
	// Base:
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0], -axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0],  axis_scale_factor[1], -axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0],  axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0],  axis_scale_factor[1], -axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0],  axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0], -axis_scale_factor[1], -axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0], -axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0], -axis_scale_factor[1], -axis_scale_factor[2]));
	
	// Top:
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0], -axis_scale_factor[1],  axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0],  axis_scale_factor[1],  axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0],  axis_scale_factor[1],  axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0],  axis_scale_factor[1],  axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0],  axis_scale_factor[1],  axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0], -axis_scale_factor[1],  axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0], -axis_scale_factor[1],  axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0], -axis_scale_factor[1],  axis_scale_factor[2]));
	
	// Vertical edges:
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0],  axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0],  axis_scale_factor[1],  axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0], -axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0], -axis_scale_factor[1],  axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0],  axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3( axis_scale_factor[0],  axis_scale_factor[1],  axis_scale_factor[2]));
	
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0], -axis_scale_factor[1], -axis_scale_factor[2]));
	box_geom.vertices.push(new THREE.Vector3(-axis_scale_factor[0], -axis_scale_factor[1],  axis_scale_factor[2]));
	
	plots[i_plot].axis_box = new THREE.LineSegments(box_geom, line_material);
	
	if (!(plots[i_plot].hasOwnProperty("show_box"))) {
		plots[i_plot].show_box = (params.hasOwnProperty("show_box")) ? params.show_box : true;
	}
	
	if (plots[i_plot].show_box) {
		plots[i_plot].scene.add(plots[i_plot].axis_box);
	}
	
	// Axis ticks.
	var num_ticks = (params.hasOwnProperty("num_ticks")) ? JSON.parse(JSON.stringify(params.num_ticks)) : [4, 4, 4];
	var tick_lengths = (params.hasOwnProperty("tick_lengths")) ? JSON.parse(JSON.stringify(params.tick_lengths)) : [0.03, 0.03, 0.03];
	
	if (!(plots[i_plot].hasOwnProperty("show_ticks"))) {
		plots[i_plot].show_ticks = (params.hasOwnProperty("show_ticks")) ? JSON.parse(JSON.stringify(params.show_ticks)) : true;
	}
	
	var tick_formats, dx, dec_places, sig_figs, max_abs_value;
	var axis_tick_values = [];
	var axis_key;
	
	for (i = 0; i < 3; i++) {
		axis_key = axes[i] + "_tick_values";
		if (params.hasOwnProperty(axis_key)) {
			axis_tick_values.push(JSON.parse(JSON.stringify(params[axis_key])));
		} else {
			if (time_axis[i]) {
				axis_tick_values.push(d3.scaleTime().domain(plots[i_plot].domains[i]).ticks(num_ticks[i]));
			} else {
				axis_tick_values.push(d3.scaleLinear().domain(plots[i_plot].domains[i]).ticks(num_ticks[i]));
			}
		}
	}
	
	var this_dx;
	
	if (params.hasOwnProperty("tick_formats")) {
		tick_formats = JSON.parse(JSON.stringify(params.tick_formats));
	} else {
		tick_formats = ["", "", ""];
	}
	
	for (i = 0; i < 3; i++) {
		if (tick_formats[i] == "") {
			if (!time_axis[i]) {
				dx = plots[i_plot].domains[i][1] - plots[i_plot].domains[i][0];
				
				for (j = 0; j < axis_tick_values[i].length - 1; j++) {
					this_dx = axis_tick_values[i][j+1] - axis_tick_values[i][j];
					if (this_dx < dx) {
						dx = this_dx;
					}
				}
				
				if (dx < 10) {
					dec_places = d3.precisionFixed(dx);
					tick_formats[i] = "." + dec_places + "f";
				} else {
					max_abs_value = plots[i_plot].domains[i][1];
					if (Math.abs(plots[i_plot].domains[i][0]) > Math.abs(max_abs_value)) {
						max_abs_value = Math.abs(plots[i_plot].domains[i][0]);
					}
					
					sig_figs = d3.precisionRound(dx, max_abs_value);
					tick_formats[i] = "." + sig_figs + "r";
				}
			} else {
				// Handled later on when the d3.timeFormat is called?
			}
		} else if (tick_formats[i] == "none") {
			tick_formats[i] = "";
		}
	}
	
	plots[i_plot].axis_ticks = [];
	var tick_vertices = [];
	var tick_geom, vertex1, vertex2, i2, i3;
	
	var tick_locations = [];
	
	tick_geom = [];
	var signs = [-1, 1];
	
	var axis_ct;
	
	for (i = 0; i < 3; i++) {
		tick_locations.push([]);
		tick_geom.push([new THREE.Geometry(), new THREE.Geometry(), new THREE.Geometry(), new THREE.Geometry()]);
		plots[i_plot].axis_ticks.push([]);
		
		i2 = (i + 1) % 3;
		i3 = (i2 + 1) % 3;
		
		for (j = 0; j < axis_tick_values[i].length; j++) {
			axis_ct = 0;
			
			for (k = 0; k < 2; k++) {
				for (l = 0; l < 2; l++) {
					vertex1 = new THREE.Vector3(0, 0, 0);
					vertex1[axes[i]] = plots[i_plot].scales[i](axis_tick_values[i][j]);
					vertex1[axes[i2]] = signs[k] * axis_scale_factor[i2];
					vertex1[axes[i3]] = signs[l] * axis_scale_factor[i3];
					
					vertex2 = new THREE.Vector3(tick_lengths[i], tick_lengths[i], tick_lengths[i]);
					vertex2[axes[i]] = 0;
					vertex2[axes[i2]] *= signs[k];
					vertex2[axes[i3]] *= signs[l];
					vertex2.add(vertex1);
					
					tick_geom[i][axis_ct].vertices.push(vertex1);
					tick_geom[i][axis_ct].vertices.push(vertex2);
					
					axis_ct++;
				}
			}
			
			tick_locations[i][j] = vertex1[axes[i]];
		}
		
		for (j = 0; j < 4; j++) {
			plots[i_plot].axis_ticks[i].push(new THREE.LineSegments(tick_geom[i][j], line_material));
		}
	}
	
	if (plots[i_plot].show_ticks) {
		plots[i_plot].scene.add(plots[i_plot].axis_ticks[0][0]);
		plots[i_plot].scene.add(plots[i_plot].axis_ticks[1][0]);
		plots[i_plot].scene.add(plots[i_plot].axis_ticks[2][0]);
	}
	
	
	// Gridlines.
	var grid_color = (params.hasOwnProperty("grid_color")) ? params.grid_color : 0x808080;
	if (typeof(grid_color) == "string") {
		grid_color = css_color_to_hex(grid_color, tiny_div);
	}
	
	plots[i_plot].bounding_planes = [axis_scale_factor[0], axis_scale_factor[1], axis_scale_factor[2]];
	
	var grid_material = new THREE.LineBasicMaterial({"color": grid_color});
	
	if (!(plots[i_plot].hasOwnProperty("show_grid"))) {
		plots[i_plot].show_grid = (params.hasOwnProperty("show_grid")) ? params.show_grid : true;
	}
	
	plots[i_plot].grid_lines_upper = [];
	plots[i_plot].grid_lines_lower = [];
	var grid_geom_lower, grid_geom_upper;
	var tick_ct;
	
	for (i = 0; i < 3; i++) {
		grid_geom_lower = new THREE.Geometry();
		grid_geom_upper = new THREE.Geometry();
		
		// Want to draw lines on the planes parallel
		// to axis[i] == const.
		
		for (j = 0; j < 3; j++) {
			if (j != i) {
				k = (~(i | j)) & 3;
				
				for (tick_ct = 0; tick_ct < axis_tick_values[j].length; tick_ct++) {
					// Lower plane:
					vertex1 = new THREE.Vector3();
					vertex1[axes[i]] = -axis_scale_factor[i];
					vertex1[axes[k]] = -axis_scale_factor[k];
					vertex1[axes[j]] = tick_locations[j][tick_ct];
					
					vertex2 = new THREE.Vector3();
					vertex2[axes[i]] = -axis_scale_factor[i];
					vertex2[axes[k]] = axis_scale_factor[k];
					vertex2[axes[j]] = tick_locations[j][tick_ct];
					
					grid_geom_lower.vertices.push(vertex1);
					grid_geom_lower.vertices.push(vertex2);
					
					// Upper plane:
					vertex1 = new THREE.Vector3();
					vertex1[axes[i]] = axis_scale_factor[i];
					vertex1[axes[k]] = -axis_scale_factor[k];
					vertex1[axes[j]] = tick_locations[j][tick_ct];
					
					vertex2 = new THREE.Vector3();
					vertex2[axes[i]] = axis_scale_factor[i];
					vertex2[axes[k]] = axis_scale_factor[k];
					vertex2[axes[j]] = tick_locations[j][tick_ct];
					
					grid_geom_upper.vertices.push(vertex1);
					grid_geom_upper.vertices.push(vertex2);
				}
			}
		}
		
		plots[i_plot].grid_lines_upper.push(new THREE.LineSegments(grid_geom_upper, grid_material));
		plots[i_plot].grid_lines_lower.push(new THREE.LineSegments(grid_geom_lower, grid_material));
	}
	
	plots[i_plot].showing_upper_grid = [false, false, false];
	plots[i_plot].showing_lower_grid = [false, false, false];
	
	if (plots[i_plot].show_grid) {
		update_gridlines(i_plot);
	}
	
	// Axis tick values.
	
	var tick_font_size;
	if (params.hasOwnProperty("tick_font_size")) {
		tick_font_size = params.tick_font_size;
	} else {
		if (!plots[i_plot].hasOwnProperty("tick_font_size")) {
			tick_font_size = 28;
		} else {
			tick_font_size = plots[i_plot].tick_font_size;
		}
	}
	plots[i_plot].tick_font_size = tick_font_size;
	
	// In case we're on orthographic camera and the perspective fov hasn't updated:
	if (plots[i_plot].view_type == "orthographic") {
		plots[i_plot].persp_camera.fov = Math.atan2(plots[i_plot].ortho_camera.top, plots[i_plot].camera_r) * rad2deg * 2;
	}
	
	var init_scale = 2 * tick_font_size * plots[i_plot].camera_r * Math.tan(0.5*plots[i_plot].persp_camera.fov / rad2deg) / plots[i_plot].height;
	
	
	var axis_tick_gaps = [0.1, 0.1, 0.1];
	if (params.hasOwnProperty("axis_tick_gaps")) {
		axis_tick_gaps = JSON.parse(JSON.stringify(params.axis_tick_gaps));
	} else {
		if (plots[i_plot].hasOwnProperty("axis_tick_gaps")) {
			axis_tick_gaps = JSON.parse(JSON.stringify(plots[i_plot].axis_tick_gaps));
		}
	}
	plots[i_plot].axis_tick_gaps = JSON.parse(JSON.stringify(axis_tick_gaps));
	
	if (!(plots[i_plot].hasOwnProperty("init_tick_scale"))) {
		// If we're changing data, we may already have this scale set,
		// and it would get updated to the wrong fov.
		plots[i_plot].init_tick_scale = init_scale;
	}
	
	var tick_font_color;
	if (params.hasOwnProperty("tick_font_color")) {
		if (typeof(params.axis_font_color) == "number") {
			tick_font_color = hex_to_css_color(params.tick_font_color);
		} else {
			tick_font_color = params.tick_font_color;
		}
	} else {
		if (!plots[i_plot].hasOwnProperty("tick_font_color")) {
			tick_font_color = "#FFFFFF";
		} else {
			tick_font_color = plots[i_plot].tick_font_color;
		}
	}
	plots[i_plot].tick_font_color = tick_font_color;
	
	var d3_formatter;
	var tick_ct = 0;
	plots[i_plot].tick_text_planes = [];
	plots[i_plot].num_ticks = [];
	
	var font;
	if (params.hasOwnProperty("font")) {
		font = params.font;
	} else {
		if (!plots[i_plot].hasOwnProperty("font")) {
			font = "Arial, sans-serif";
		} else {
			font = plots[i_plot].font;
		}
	}
	plots[i_plot].font = font;
	
	var bg_color;
	if (params.hasOwnProperty("background_color")) {
		bg_color = params.background_color;
	} else {
		if (!plots[i_plot].hasOwnProperty("background_color")) {
			bg_color = "#000000";
		} else {
			bg_color = plots[i_plot].background_color;
		}
	}
	plots[i_plot].background_color = bg_color;
	
	var bg_color_hex;
	
	if (typeof(bg_color) == "string") {
		bg_color_hex = css_color_to_hex(bg_color, tiny_div);
	} else {
		bg_color_hex = bg_color;
		bg_color = hex_to_css_color(bg_color);
	}
	
	for (i = 0; i < 3; i++) {
		plots[i_plot].num_ticks.push(axis_tick_values[i].length);
		
		if (time_axis[i]) {
			if (tick_formats[i] == "") {
				d3_formatter = plots[i_plot].scales[i].tickFormat(plots[i_plot].num_ticks[i]);
			} else {
				d3_formatter = d3.timeFormat(tick_formats[i]);
			}
		} else {
			d3_formatter = d3.format(tick_formats[i]);
		}
		
		for (j = 0; j < axis_tick_values[i].length; j++) {
			plots[i_plot].tick_text_planes.push(make_text_plane(d3_formatter(axis_tick_values[i][j]), font, tick_font_size, tick_font_color, bg_color, true, i_plot));
			
			for (k = 0; k < 3; k++) {
				if (i == k) {
					plots[i_plot].tick_text_planes[tick_ct].position[axes[k]] = tick_locations[i][j];
				} else {
					plots[i_plot].tick_text_planes[tick_ct].position[axes[k]] = -axis_scale_factor[k] - axis_tick_gaps[k];
				}
				
			}
			
			plots[i_plot].tick_text_planes[tick_ct].rotation.copy(get_current_camera(i_plot).rotation);
			plots[i_plot].tick_text_planes[tick_ct].scale.set(init_scale, init_scale, 1);
			
			if (plots[i_plot].show_ticks) {
				plots[i_plot].scene.add(plots[i_plot].tick_text_planes[tick_ct]);
			}
			
			tick_ct++;
		}
	}
	
	if (!(plots[i_plot].hasOwnProperty("show_axis_titles"))) {
		plots[i_plot].show_axis_titles = (params.hasOwnProperty("show_axis_titles")) ? JSON.parse(JSON.stringify(params.show_axis_titles)) : true;
	}
	
	var axis_titles = (params.hasOwnProperty("axis_titles")) ? JSON.parse(JSON.stringify(params.axis_titles)) : ["x", "y", "z"];
	
	var axis_title_gaps = [0.3, 0.3, 0.3];
	if (params.hasOwnProperty("axis_title_gaps")) {
		axis_title_gaps = JSON.parse(JSON.stringify(params.axis_title_gaps));
	} else {
		if (plots[i_plot].hasOwnProperty("axis_title_gaps")) {
			axis_title_gaps = JSON.parse(JSON.stringify(plots[i_plot].axis_title_gaps));
		}
	}
	plots[i_plot].axis_title_gaps = JSON.parse(JSON.stringify(axis_title_gaps));
	
	var axis_font_color;
	if (params.hasOwnProperty("axis_font_color")) {
		axis_font_color = params.axis_font_color;
	} else {
		if (!plots[i_plot].hasOwnProperty("axis_font_color")) {
			axis_font_color = "#FFFFFF";
		} else {
			axis_font_color = plots[i_plot].axis_font_color;
		}
	}
	
	if (typeof(axis_font_color) == "number") {
		axis_font_color = hex_to_css_color(params.axis_font_color);
	}
	
	plots[i_plot].axis_font_color = axis_font_color;
	
	
	plots[i_plot].axis_text_planes = [];
	
	
	
	var axis_font_size;
	if (params.hasOwnProperty("axis_font_size")) {
		axis_font_size = params.axis_font_size;
	} else {
		if (!plots[i_plot].hasOwnProperty("axis_font_size")) {
			axis_font_size = 30;
		} else {
			axis_font_size = plots[i_plot].axis_font_size;
		}
	}
	plots[i_plot].axis_font_size = axis_font_size;
	
	init_scale = 2 * axis_font_size * plots[i_plot].camera_r * Math.tan(0.5 * plots[i_plot].persp_camera.fov / rad2deg) / plots[i_plot].height;
	
	if (!(plots[i_plot].hasOwnProperty("init_axis_title_scale"))) {
		// If we're changing data, we may already have this scale set,
		// and it would get updated to the wrong fov.
		plots[i_plot].init_axis_title_scale = init_scale;
	}
	
	for (i = 0; i < 3; i++) {
		plots[i_plot].axis_text_planes.push(make_text_plane(axis_titles[i], font, axis_font_size, axis_font_color, bg_color, true, i_plot));
		
		for (j = 0; j < 3; j++) {
			if (i == j) {
				plots[i_plot].axis_text_planes[i].position[axes[j]] = 0;
			} else {
				plots[i_plot].axis_text_planes[i].position[axes[j]] = -axis_scale_factor[j] - axis_title_gaps[i];
			}
		}
		
		plots[i_plot].axis_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
		plots[i_plot].axis_text_planes[i].scale.set(init_scale, init_scale, 1);
		
		if (plots[i_plot].show_axis_titles) {
			plots[i_plot].scene.add(plots[i_plot].axis_text_planes[i]);
		}
	}
	
	if (!(plots[i_plot].hasOwnProperty("dynamic_axis_labels"))) {
		plots[i_plot].dynamic_axis_labels = (params.hasOwnProperty("dynamic_axis_labels")) ? params.dynamic_axis_labels : false;
	}
	
	if (plots[i_plot].dynamic_axis_labels) {
		update_axes(i_plot);
	}
	
	plots[i_plot].parent_div.removeChild(tiny_div);
}

var calculate_locations = function(i_plot, params, ignore_surface_colors) {
	if (ignore_surface_colors === undefined) { ignore_surface_colors = false; }
	
	var return_object = {};
	return_object.null_points = [];
	
	var this_loc, this_size, group, i, j;
	var axes = ["x", "y", "z"];
	
	if (plots[i_plot].plot_type == "scatter") {
		return_object.plot_locations = [];
		
		var use_default = false;
		
		for (i = 0; i < params.data.length; i++) {
			return_object.plot_locations.push([]);
			return_object.null_points.push(0);
			
			for (j = 0; j < 3; j++) {
				return_object.plot_locations[i].push(plots[i_plot].scales[j](params.data[i][axes[j]]));
				
				if (isNaN(return_object.plot_locations[i][j]) || (params.data[i][axes[j]] === null)) {
					return_object.plot_locations[i][j] = 0;
					return_object.null_points[i] = 1;
				}
			}
			
			if (plots[i_plot].have_any_sizes) {
				if ((params.data[i].size === null) || (isNaN(params.data[i].size))) {
					use_default = true;
				} else {
					if (plots[i_plot].size_exponent != 0) {
						this_size = plots[i_plot].scales[3](params.data[i].scaled_size);
					} else {
						use_default = true;
					}
				}
			} else {
				use_default = true;
			}
			
			if (use_default) {
				if (plots[i_plot].have_groups) {
					group = params.data[i].group;
				} else {
					group = "default_group";
				}
				
				this_size = plots[i_plot].groups[group].default_point_height;
			}
			
			return_object.plot_locations[i].push(this_size);
		}
	} else if (plots[i_plot].plot_type == "surface") {
		return_object.plot_locations = {"x": [], "y": [], "z": [], "color": []};
		var this_color;
		
		for (i = 0; i < 2; i++) {
			// x and y.
			
			for (j = 0; j < params.data[axes[i]].length; j++) {
				return_object.plot_locations[axes[i]].push(plots[i_plot].scales[i](params.data[axes[i]][j]));
			}
		}
		
		// z.
		for (i = 0; i < params.data.z.length; i++) {
			return_object.plot_locations.z.push([]);
			return_object.null_points.push([]);
			
			for (j = 0; j < params.data.z[i].length; j++) {
				return_object.null_points[i].push(0);
				return_object.plot_locations.z[i].push(plots[i_plot].scales[2](params.data.z[i][j]));
				
				if (isNaN(return_object.plot_locations.z[i][j]) || (params.data.z[i][j] === null)) {
					return_object.plot_locations.z[i][j] = 0;
					return_object.null_points[i][j] = 1;
				}
			}
		}
		
		if (!plots[i_plot].hasOwnProperty("color_fn")) {
			if (!params.hasOwnProperty("color_scale")) {
				plots[i_plot].color_fn = colorscale_viridis;
			} else {
				set_surface_color_scale_fn(i_plot, params.color_scale);
			}
		}
		
		if (plots[i_plot].have_color_matrix) {
			var tiny_div = document.createElement("div");
			tiny_div.style.width = "1px";
			tiny_div.style.height = "1px";
			plots[i_plot].parent_div.appendChild(tiny_div);
			
			if (ignore_surface_colors) {
				for (i = 0; i < plots[i_plot].mesh_points.length; i++) {
					return_object.plot_locations.color.push([]);
					
					for (j = 0; j < plots[i_plot].mesh_points[i].length; j++) {
						return_object.plot_locations.color[i].push([0, 0, 0]);
					}
				}
			} else {
				for (i = 0; i < params.data.color.length; i++) {
					return_object.plot_locations.color.push([]);
					
					for (j = 0; j < params.data.color[i].length; j++) {
						this_color = params.data.color[i][j];
						
						if (typeof(this_color) == "string") {
							this_color = css_color_to_hex(this_color, tiny_div);
							params.data.color[i][j] = this_color;
						}
						
						this_color = hex_to_rgb_obj(this_color);
						return_object.plot_locations.color[i].push([this_color.r, this_color.g, this_color.b]);
					}
				}
			}
			
			plots[i_plot].parent_div.removeChild(tiny_div);
		} else {
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
						this_color = calculate_color(params.data.z[i][j], plots[i_plot].color_domain, plots[i_plot].color_fn);
						this_color_num = 65536*Math.round(255*this_color[0]) + 256*Math.round(255*this_color[1]) + Math.round(255*this_color[2]);
					}
					
					return_object.plot_locations.color[i].push(this_color.slice(0));
					params.data.color[i].push(this_color_num);
				}
			}
		}
	}
	
	return return_object;
}

var interpolate_color = function(t, colors) {
	var num_colors = colors.length;
	
	if (t <= 0) { return colors[0]; }
	if (t >= 1) { return colors[num_colors - 1]; }
	
	var x = t*(num_colors - 1);
	var n = Math.floor(t*(num_colors - 1));
	if (n >= num_colors) { n = num_colors - 1; }
	
	var s = x - n;
	
	if (s < 0) { s = 0; }
	if (s > 1) { s = 1; }
	
	var rgb = [0, 0, 0];
	
	for (var i = 0; i < 3; i++) {
		rgb[i] = colors[n][i] + s*(colors[n + 1][i] - colors[n][i]);
	}
	
	
	
	return rgb;
}

var interpolate_color_255 = function(t, colors) {
	for (var i = 0; i < colors.length; i++) {
		colors[i][0] /= 255;
		colors[i][1] /= 255;
		colors[i][2] /= 255;
	}
	
	return interpolate_color(t, colors);
}

var colorscale_inferno = function(t) {
	return interpolate_color(t, [[0.001462,0.000466,0.013866],[0.002267,0.001270,0.018570],[0.003299,0.002249,0.024239],[0.004547,0.003392,0.030909],[0.006006,0.004692,0.038558],[0.007676,0.006136,0.046836],[0.009561,0.007713,0.055143],[0.011663,0.009417,0.063460],[0.013995,0.011225,0.071862],[0.016561,0.013136,0.080282],[0.019373,0.015133,0.088767],[0.022447,0.017199,0.097327],[0.025793,0.019331,0.105930],[0.029432,0.021503,0.114621],[0.033385,0.023702,0.123397],[0.037668,0.025921,0.132232],[0.042253,0.028139,0.141141],[0.046915,0.030324,0.150164],[0.051644,0.032474,0.159254],[0.056449,0.034569,0.168414],[0.061340,0.036590,0.177642],[0.066331,0.038504,0.186962],[0.071429,0.040294,0.196354],[0.076637,0.041905,0.205799],[0.081962,0.043328,0.215289],[0.087411,0.044556,0.224813],[0.092990,0.045583,0.234358],[0.098702,0.046402,0.243904],[0.104551,0.047008,0.253430],[0.110536,0.047399,0.262912],[0.116656,0.047574,0.272321],[0.122908,0.047536,0.281624],[0.129285,0.047293,0.290788],[0.135778,0.046856,0.299776],[0.142378,0.046242,0.308553],[0.149073,0.045468,0.317085],[0.155850,0.044559,0.325338],[0.162689,0.043554,0.333277],[0.169575,0.042489,0.340874],[0.176493,0.041402,0.348111],[0.183429,0.040329,0.354971],[0.190367,0.039309,0.361447],[0.197297,0.038400,0.367535],[0.204209,0.037632,0.373238],[0.211095,0.037030,0.378563],[0.217949,0.036615,0.383522],[0.224763,0.036405,0.388129],[0.231538,0.036405,0.392400],[0.238273,0.036621,0.396353],[0.244967,0.037055,0.400007],[0.251620,0.037705,0.403378],[0.258234,0.038571,0.406485],[0.264810,0.039647,0.409345],[0.271347,0.040922,0.411976],[0.277850,0.042353,0.414392],[0.284321,0.043933,0.416608],[0.290763,0.045644,0.418637],[0.297178,0.047470,0.420491],[0.303568,0.049396,0.422182],[0.309935,0.051407,0.423721],[0.316282,0.053490,0.425116],[0.322610,0.055634,0.426377],[0.328921,0.057827,0.427511],[0.335217,0.060060,0.428524],[0.341500,0.062325,0.429425],[0.347771,0.064616,0.430217],[0.354032,0.066925,0.430906],[0.360284,0.069247,0.431497],[0.366529,0.071579,0.431994],[0.372768,0.073915,0.432400],[0.379001,0.076253,0.432719],[0.385228,0.078591,0.432955],[0.391453,0.080927,0.433109],[0.397674,0.083257,0.433183],[0.403894,0.085580,0.433179],[0.410113,0.087896,0.433098],[0.416331,0.090203,0.432943],[0.422549,0.092501,0.432714],[0.428768,0.094790,0.432412],[0.434987,0.097069,0.432039],[0.441207,0.099338,0.431594],[0.447428,0.101597,0.431080],[0.453651,0.103848,0.430498],[0.459875,0.106089,0.429846],[0.466100,0.108322,0.429125],[0.472328,0.110547,0.428334],[0.478558,0.112764,0.427475],[0.484789,0.114974,0.426548],[0.491022,0.117179,0.425552],[0.497257,0.119379,0.424488],[0.503493,0.121575,0.423356],[0.509730,0.123769,0.422156],[0.515967,0.125960,0.420887],[0.522206,0.128150,0.419549],[0.528444,0.130341,0.418142],[0.534683,0.132534,0.416667],[0.540920,0.134729,0.415123],[0.547157,0.136929,0.413511],[0.553392,0.139134,0.411829],[0.559624,0.141346,0.410078],[0.565854,0.143567,0.408258],[0.572081,0.145797,0.406369],[0.578304,0.148039,0.404411],[0.584521,0.150294,0.402385],[0.590734,0.152563,0.400290],[0.596940,0.154848,0.398125],[0.603139,0.157151,0.395891],[0.609330,0.159474,0.393589],[0.615513,0.161817,0.391219],[0.621685,0.164184,0.388781],[0.627847,0.166575,0.386276],[0.633998,0.168992,0.383704],[0.640135,0.171438,0.381065],[0.646260,0.173914,0.378359],[0.652369,0.176421,0.375586],[0.658463,0.178962,0.372748],[0.664540,0.181539,0.369846],[0.670599,0.184153,0.366879],[0.676638,0.186807,0.363849],[0.682656,0.189501,0.360757],[0.688653,0.192239,0.357603],[0.694627,0.195021,0.354388],[0.700576,0.197851,0.351113],[0.706500,0.200728,0.347777],[0.712396,0.203656,0.344383],[0.718264,0.206636,0.340931],[0.724103,0.209670,0.337424],[0.729909,0.212759,0.333861],[0.735683,0.215906,0.330245],[0.741423,0.219112,0.326576],[0.747127,0.222378,0.322856],[0.752794,0.225706,0.319085],[0.758422,0.229097,0.315266],[0.764010,0.232554,0.311399],[0.769556,0.236077,0.307485],[0.775059,0.239667,0.303526],[0.780517,0.243327,0.299523],[0.785929,0.247056,0.295477],[0.791293,0.250856,0.291390],[0.796607,0.254728,0.287264],[0.801871,0.258674,0.283099],[0.807082,0.262692,0.278898],[0.812239,0.266786,0.274661],[0.817341,0.270954,0.270390],[0.822386,0.275197,0.266085],[0.827372,0.279517,0.261750],[0.832299,0.283913,0.257383],[0.837165,0.288385,0.252988],[0.841969,0.292933,0.248564],[0.846709,0.297559,0.244113],[0.851384,0.302260,0.239636],[0.855992,0.307038,0.235133],[0.860533,0.311892,0.230606],[0.865006,0.316822,0.226055],[0.869409,0.321827,0.221482],[0.873741,0.326906,0.216886],[0.878001,0.332060,0.212268],[0.882188,0.337287,0.207628],[0.886302,0.342586,0.202968],[0.890341,0.347957,0.198286],[0.894305,0.353399,0.193584],[0.898192,0.358911,0.188860],[0.902003,0.364492,0.184116],[0.905735,0.370140,0.179350],[0.909390,0.375856,0.174563],[0.912966,0.381636,0.169755],[0.916462,0.387481,0.164924],[0.919879,0.393389,0.160070],[0.923215,0.399359,0.155193],[0.926470,0.405389,0.150292],[0.929644,0.411479,0.145367],[0.932737,0.417627,0.140417],[0.935747,0.423831,0.135440],[0.938675,0.430091,0.130438],[0.941521,0.436405,0.125409],[0.944285,0.442772,0.120354],[0.946965,0.449191,0.115272],[0.949562,0.455660,0.110164],[0.952075,0.462178,0.105031],[0.954506,0.468744,0.099874],[0.956852,0.475356,0.094695],[0.959114,0.482014,0.089499],[0.961293,0.488716,0.084289],[0.963387,0.495462,0.079073],[0.965397,0.502249,0.073859],[0.967322,0.509078,0.068659],[0.969163,0.515946,0.063488],[0.970919,0.522853,0.058367],[0.972590,0.529798,0.053324],[0.974176,0.536780,0.048392],[0.975677,0.543798,0.043618],[0.977092,0.550850,0.039050],[0.978422,0.557937,0.034931],[0.979666,0.565057,0.031409],[0.980824,0.572209,0.028508],[0.981895,0.579392,0.026250],[0.982881,0.586606,0.024661],[0.983779,0.593849,0.023770],[0.984591,0.601122,0.023606],[0.985315,0.608422,0.024202],[0.985952,0.615750,0.025592],[0.986502,0.623105,0.027814],[0.986964,0.630485,0.030908],[0.987337,0.637890,0.034916],[0.987622,0.645320,0.039886],[0.987819,0.652773,0.045581],[0.987926,0.660250,0.051750],[0.987945,0.667748,0.058329],[0.987874,0.675267,0.065257],[0.987714,0.682807,0.072489],[0.987464,0.690366,0.079990],[0.987124,0.697944,0.087731],[0.986694,0.705540,0.095694],[0.986175,0.713153,0.103863],[0.985566,0.720782,0.112229],[0.984865,0.728427,0.120785],[0.984075,0.736087,0.129527],[0.983196,0.743758,0.138453],[0.982228,0.751442,0.147565],[0.981173,0.759135,0.156863],[0.980032,0.766837,0.166353],[0.978806,0.774545,0.176037],[0.977497,0.782258,0.185923],[0.976108,0.789974,0.196018],[0.974638,0.797692,0.206332],[0.973088,0.805409,0.216877],[0.971468,0.813122,0.227658],[0.969783,0.820825,0.238686],[0.968041,0.828515,0.249972],[0.966243,0.836191,0.261534],[0.964394,0.843848,0.273391],[0.962517,0.851476,0.285546],[0.960626,0.859069,0.298010],[0.958720,0.866624,0.310820],[0.956834,0.874129,0.323974],[0.954997,0.881569,0.337475],[0.953215,0.888942,0.351369],[0.951546,0.896226,0.365627],[0.950018,0.903409,0.380271],[0.948683,0.910473,0.395289],[0.947594,0.917399,0.410665],[0.946809,0.924168,0.426373],[0.946392,0.930761,0.442367],[0.946403,0.937159,0.458592],[0.946903,0.943348,0.474970],[0.947937,0.949318,0.491426],[0.949545,0.955063,0.507860],[0.951740,0.960587,0.524203],[0.954529,0.965896,0.540361],[0.957896,0.971003,0.556275],[0.961812,0.975924,0.571925],[0.966249,0.980678,0.587206],[0.971162,0.985282,0.602154],[0.976511,0.989753,0.616760],[0.982257,0.994109,0.631017],[0.988362,0.998364,0.644924]]);
}

var colorscale_magma = function(t) {
	return interpolate_color(t, [[0.001462,0.000466,0.013866],[0.002258,0.001295,0.018331],[0.003279,0.002305,0.023708],[0.004512,0.003490,0.029965],[0.005950,0.004843,0.037130],[0.007588,0.006356,0.044973],[0.009426,0.008022,0.052844],[0.011465,0.009828,0.060750],[0.013708,0.011771,0.068667],[0.016156,0.013840,0.076603],[0.018815,0.016026,0.084584],[0.021692,0.018320,0.092610],[0.024792,0.020715,0.100676],[0.028123,0.023201,0.108787],[0.031696,0.025765,0.116965],[0.035520,0.028397,0.125209],[0.039608,0.031090,0.133515],[0.043830,0.033830,0.141886],[0.048062,0.036607,0.150327],[0.052320,0.039407,0.158841],[0.056615,0.042160,0.167446],[0.060949,0.044794,0.176129],[0.065330,0.047318,0.184892],[0.069764,0.049726,0.193735],[0.074257,0.052017,0.202660],[0.078815,0.054184,0.211667],[0.083446,0.056225,0.220755],[0.088155,0.058133,0.229922],[0.092949,0.059904,0.239164],[0.097833,0.061531,0.248477],[0.102815,0.063010,0.257854],[0.107899,0.064335,0.267289],[0.113094,0.065492,0.276784],[0.118405,0.066479,0.286321],[0.123833,0.067295,0.295879],[0.129380,0.067935,0.305443],[0.135053,0.068391,0.315000],[0.140858,0.068654,0.324538],[0.146785,0.068738,0.334011],[0.152839,0.068637,0.343404],[0.159018,0.068354,0.352688],[0.165308,0.067911,0.361816],[0.171713,0.067305,0.370771],[0.178212,0.066576,0.379497],[0.184801,0.065732,0.387973],[0.191460,0.064818,0.396152],[0.198177,0.063862,0.404009],[0.204935,0.062907,0.411514],[0.211718,0.061992,0.418647],[0.218512,0.061158,0.425392],[0.225302,0.060445,0.431742],[0.232077,0.059889,0.437695],[0.238826,0.059517,0.443256],[0.245543,0.059352,0.448436],[0.252220,0.059415,0.453248],[0.258857,0.059706,0.457710],[0.265447,0.060237,0.461840],[0.271994,0.060994,0.465660],[0.278493,0.061978,0.469190],[0.284951,0.063168,0.472451],[0.291366,0.064553,0.475462],[0.297740,0.066117,0.478243],[0.304081,0.067835,0.480812],[0.310382,0.069702,0.483186],[0.316654,0.071690,0.485380],[0.322899,0.073782,0.487408],[0.329114,0.075972,0.489287],[0.335308,0.078236,0.491024],[0.341482,0.080564,0.492631],[0.347636,0.082946,0.494121],[0.353773,0.085373,0.495501],[0.359898,0.087831,0.496778],[0.366012,0.090314,0.497960],[0.372116,0.092816,0.499053],[0.378211,0.095332,0.500067],[0.384299,0.097855,0.501002],[0.390384,0.100379,0.501864],[0.396467,0.102902,0.502658],[0.402548,0.105420,0.503386],[0.408629,0.107930,0.504052],[0.414709,0.110431,0.504662],[0.420791,0.112920,0.505215],[0.426877,0.115395,0.505714],[0.432967,0.117855,0.506160],[0.439062,0.120298,0.506555],[0.445163,0.122724,0.506901],[0.451271,0.125132,0.507198],[0.457386,0.127522,0.507448],[0.463508,0.129893,0.507652],[0.469640,0.132245,0.507809],[0.475780,0.134577,0.507921],[0.481929,0.136891,0.507989],[0.488088,0.139186,0.508011],[0.494258,0.141462,0.507988],[0.500438,0.143719,0.507920],[0.506629,0.145958,0.507806],[0.512831,0.148179,0.507648],[0.519045,0.150383,0.507443],[0.525270,0.152569,0.507192],[0.531507,0.154739,0.506895],[0.537755,0.156894,0.506551],[0.544015,0.159033,0.506159],[0.550287,0.161158,0.505719],[0.556571,0.163269,0.505230],[0.562866,0.165368,0.504692],[0.569172,0.167454,0.504105],[0.575490,0.169530,0.503466],[0.581819,0.171596,0.502777],[0.588158,0.173652,0.502035],[0.594508,0.175701,0.501241],[0.600868,0.177743,0.500394],[0.607238,0.179779,0.499492],[0.613617,0.181811,0.498536],[0.620005,0.183840,0.497524],[0.626401,0.185867,0.496456],[0.632805,0.187893,0.495332],[0.639216,0.189921,0.494150],[0.645633,0.191952,0.492910],[0.652056,0.193986,0.491611],[0.658483,0.196027,0.490253],[0.664915,0.198075,0.488836],[0.671349,0.200133,0.487358],[0.677786,0.202203,0.485819],[0.684224,0.204286,0.484219],[0.690661,0.206384,0.482558],[0.697098,0.208501,0.480835],[0.703532,0.210638,0.479049],[0.709962,0.212797,0.477201],[0.716387,0.214982,0.475290],[0.722805,0.217194,0.473316],[0.729216,0.219437,0.471279],[0.735616,0.221713,0.469180],[0.742004,0.224025,0.467018],[0.748378,0.226377,0.464794],[0.754737,0.228772,0.462509],[0.761077,0.231214,0.460162],[0.767398,0.233705,0.457755],[0.773695,0.236249,0.455289],[0.779968,0.238851,0.452765],[0.786212,0.241514,0.450184],[0.792427,0.244242,0.447543],[0.798608,0.247040,0.444848],[0.804752,0.249911,0.442102],[0.810855,0.252861,0.439305],[0.816914,0.255895,0.436461],[0.822926,0.259016,0.433573],[0.828886,0.262229,0.430644],[0.834791,0.265540,0.427671],[0.840636,0.268953,0.424666],[0.846416,0.272473,0.421631],[0.852126,0.276106,0.418573],[0.857763,0.279857,0.415496],[0.863320,0.283729,0.412403],[0.868793,0.287728,0.409303],[0.874176,0.291859,0.406205],[0.879464,0.296125,0.403118],[0.884651,0.300530,0.400047],[0.889731,0.305079,0.397002],[0.894700,0.309773,0.393995],[0.899552,0.314616,0.391037],[0.904281,0.319610,0.388137],[0.908884,0.324755,0.385308],[0.913354,0.330052,0.382563],[0.917689,0.335500,0.379915],[0.921884,0.341098,0.377376],[0.925937,0.346844,0.374959],[0.929845,0.352734,0.372677],[0.933606,0.358764,0.370541],[0.937221,0.364929,0.368567],[0.940687,0.371224,0.366762],[0.944006,0.377643,0.365136],[0.947180,0.384178,0.363701],[0.950210,0.390820,0.362468],[0.953099,0.397563,0.361438],[0.955849,0.404400,0.360619],[0.958464,0.411324,0.360014],[0.960949,0.418323,0.359630],[0.963310,0.425390,0.359469],[0.965549,0.432519,0.359529],[0.967671,0.439703,0.359810],[0.969680,0.446936,0.360311],[0.971582,0.454210,0.361030],[0.973381,0.461520,0.361965],[0.975082,0.468861,0.363111],[0.976690,0.476226,0.364466],[0.978210,0.483612,0.366025],[0.979645,0.491014,0.367783],[0.981000,0.498428,0.369734],[0.982279,0.505851,0.371874],[0.983485,0.513280,0.374198],[0.984622,0.520713,0.376698],[0.985693,0.528148,0.379371],[0.986700,0.535582,0.382210],[0.987646,0.543015,0.385210],[0.988533,0.550446,0.388365],[0.989363,0.557873,0.391671],[0.990138,0.565296,0.395122],[0.990871,0.572706,0.398714],[0.991558,0.580107,0.402441],[0.992196,0.587502,0.406299],[0.992785,0.594891,0.410283],[0.993326,0.602275,0.414390],[0.993834,0.609644,0.418613],[0.994309,0.616999,0.422950],[0.994738,0.624350,0.427397],[0.995122,0.631696,0.431951],[0.995480,0.639027,0.436607],[0.995810,0.646344,0.441361],[0.996096,0.653659,0.446213],[0.996341,0.660969,0.451160],[0.996580,0.668256,0.456192],[0.996775,0.675541,0.461314],[0.996925,0.682828,0.466526],[0.997077,0.690088,0.471811],[0.997186,0.697349,0.477182],[0.997254,0.704611,0.482635],[0.997325,0.711848,0.488154],[0.997351,0.719089,0.493755],[0.997351,0.726324,0.499428],[0.997341,0.733545,0.505167],[0.997285,0.740772,0.510983],[0.997228,0.747981,0.516859],[0.997138,0.755190,0.522806],[0.997019,0.762398,0.528821],[0.996898,0.769591,0.534892],[0.996727,0.776795,0.541039],[0.996571,0.783977,0.547233],[0.996369,0.791167,0.553499],[0.996162,0.798348,0.559820],[0.995932,0.805527,0.566202],[0.995680,0.812706,0.572645],[0.995424,0.819875,0.579140],[0.995131,0.827052,0.585701],[0.994851,0.834213,0.592307],[0.994524,0.841387,0.598983],[0.994222,0.848540,0.605696],[0.993866,0.855711,0.612482],[0.993545,0.862859,0.619299],[0.993170,0.870024,0.626189],[0.992831,0.877168,0.633109],[0.992440,0.884330,0.640099],[0.992089,0.891470,0.647116],[0.991688,0.898627,0.654202],[0.991332,0.905763,0.661309],[0.990930,0.912915,0.668481],[0.990570,0.920049,0.675675],[0.990175,0.927196,0.682926],[0.989815,0.934329,0.690198],[0.989434,0.941470,0.697519],[0.989077,0.948604,0.704863],[0.988717,0.955742,0.712242],[0.988367,0.962878,0.719649],[0.988033,0.970012,0.727077],[0.987691,0.977154,0.734536],[0.987387,0.984288,0.742002],[0.987053,0.991438,0.749504]]);
}

var colorscale_plasma = function(t) {
	return interpolate_color(t, [[0.050383,0.029803,0.527975],[0.063536,0.028426,0.533124],[0.075353,0.027206,0.538007],[0.086222,0.026125,0.542658],[0.096379,0.025165,0.547103],[0.105980,0.024309,0.551368],[0.115124,0.023556,0.555468],[0.123903,0.022878,0.559423],[0.132381,0.022258,0.563250],[0.140603,0.021687,0.566959],[0.148607,0.021154,0.570562],[0.156421,0.020651,0.574065],[0.164070,0.020171,0.577478],[0.171574,0.019706,0.580806],[0.178950,0.019252,0.584054],[0.186213,0.018803,0.587228],[0.193374,0.018354,0.590330],[0.200445,0.017902,0.593364],[0.207435,0.017442,0.596333],[0.214350,0.016973,0.599239],[0.221197,0.016497,0.602083],[0.227983,0.016007,0.604867],[0.234715,0.015502,0.607592],[0.241396,0.014979,0.610259],[0.248032,0.014439,0.612868],[0.254627,0.013882,0.615419],[0.261183,0.013308,0.617911],[0.267703,0.012716,0.620346],[0.274191,0.012109,0.622722],[0.280648,0.011488,0.625038],[0.287076,0.010855,0.627295],[0.293478,0.010213,0.629490],[0.299855,0.009561,0.631624],[0.306210,0.008902,0.633694],[0.312543,0.008239,0.635700],[0.318856,0.007576,0.637640],[0.325150,0.006915,0.639512],[0.331426,0.006261,0.641316],[0.337683,0.005618,0.643049],[0.343925,0.004991,0.644710],[0.350150,0.004382,0.646298],[0.356359,0.003798,0.647810],[0.362553,0.003243,0.649245],[0.368733,0.002724,0.650601],[0.374897,0.002245,0.651876],[0.381047,0.001814,0.653068],[0.387183,0.001434,0.654177],[0.393304,0.001114,0.655199],[0.399411,0.000859,0.656133],[0.405503,0.000678,0.656977],[0.411580,0.000577,0.657730],[0.417642,0.000564,0.658390],[0.423689,0.000646,0.658956],[0.429719,0.000831,0.659425],[0.435734,0.001127,0.659797],[0.441732,0.001540,0.660069],[0.447714,0.002080,0.660240],[0.453677,0.002755,0.660310],[0.459623,0.003574,0.660277],[0.465550,0.004545,0.660139],[0.471457,0.005678,0.659897],[0.477344,0.006980,0.659549],[0.483210,0.008460,0.659095],[0.489055,0.010127,0.658534],[0.494877,0.011990,0.657865],[0.500678,0.014055,0.657088],[0.506454,0.016333,0.656202],[0.512206,0.018833,0.655209],[0.517933,0.021563,0.654109],[0.523633,0.024532,0.652901],[0.529306,0.027747,0.651586],[0.534952,0.031217,0.650165],[0.540570,0.034950,0.648640],[0.546157,0.038954,0.647010],[0.551715,0.043136,0.645277],[0.557243,0.047331,0.643443],[0.562738,0.051545,0.641509],[0.568201,0.055778,0.639477],[0.573632,0.060028,0.637349],[0.579029,0.064296,0.635126],[0.584391,0.068579,0.632812],[0.589719,0.072878,0.630408],[0.595011,0.077190,0.627917],[0.600266,0.081516,0.625342],[0.605485,0.085854,0.622686],[0.610667,0.090204,0.619951],[0.615812,0.094564,0.617140],[0.620919,0.098934,0.614257],[0.625987,0.103312,0.611305],[0.631017,0.107699,0.608287],[0.636008,0.112092,0.605205],[0.640959,0.116492,0.602065],[0.645872,0.120898,0.598867],[0.650746,0.125309,0.595617],[0.655580,0.129725,0.592317],[0.660374,0.134144,0.588971],[0.665129,0.138566,0.585582],[0.669845,0.142992,0.582154],[0.674522,0.147419,0.578688],[0.679160,0.151848,0.575189],[0.683758,0.156278,0.571660],[0.688318,0.160709,0.568103],[0.692840,0.165141,0.564522],[0.697324,0.169573,0.560919],[0.701769,0.174005,0.557296],[0.706178,0.178437,0.553657],[0.710549,0.182868,0.550004],[0.714883,0.187299,0.546338],[0.719181,0.191729,0.542663],[0.723444,0.196158,0.538981],[0.727670,0.200586,0.535293],[0.731862,0.205013,0.531601],[0.736019,0.209439,0.527908],[0.740143,0.213864,0.524216],[0.744232,0.218288,0.520524],[0.748289,0.222711,0.516834],[0.752312,0.227133,0.513149],[0.756304,0.231555,0.509468],[0.760264,0.235976,0.505794],[0.764193,0.240396,0.502126],[0.768090,0.244817,0.498465],[0.771958,0.249237,0.494813],[0.775796,0.253658,0.491171],[0.779604,0.258078,0.487539],[0.783383,0.262500,0.483918],[0.787133,0.266922,0.480307],[0.790855,0.271345,0.476706],[0.794549,0.275770,0.473117],[0.798216,0.280197,0.469538],[0.801855,0.284626,0.465971],[0.805467,0.289057,0.462415],[0.809052,0.293491,0.458870],[0.812612,0.297928,0.455338],[0.816144,0.302368,0.451816],[0.819651,0.306812,0.448306],[0.823132,0.311261,0.444806],[0.826588,0.315714,0.441316],[0.830018,0.320172,0.437836],[0.833422,0.324635,0.434366],[0.836801,0.329105,0.430905],[0.840155,0.333580,0.427455],[0.843484,0.338062,0.424013],[0.846788,0.342551,0.420579],[0.850066,0.347048,0.417153],[0.853319,0.351553,0.413734],[0.856547,0.356066,0.410322],[0.859750,0.360588,0.406917],[0.862927,0.365119,0.403519],[0.866078,0.369660,0.400126],[0.869203,0.374212,0.396738],[0.872303,0.378774,0.393355],[0.875376,0.383347,0.389976],[0.878423,0.387932,0.386600],[0.881443,0.392529,0.383229],[0.884436,0.397139,0.379860],[0.887402,0.401762,0.376494],[0.890340,0.406398,0.373130],[0.893250,0.411048,0.369768],[0.896131,0.415712,0.366407],[0.898984,0.420392,0.363047],[0.901807,0.425087,0.359688],[0.904601,0.429797,0.356329],[0.907365,0.434524,0.352970],[0.910098,0.439268,0.349610],[0.912800,0.444029,0.346251],[0.915471,0.448807,0.342890],[0.918109,0.453603,0.339529],[0.920714,0.458417,0.336166],[0.923287,0.463251,0.332801],[0.925825,0.468103,0.329435],[0.928329,0.472975,0.326067],[0.930798,0.477867,0.322697],[0.933232,0.482780,0.319325],[0.935630,0.487712,0.315952],[0.937990,0.492667,0.312575],[0.940313,0.497642,0.309197],[0.942598,0.502639,0.305816],[0.944844,0.507658,0.302433],[0.947051,0.512699,0.299049],[0.949217,0.517763,0.295662],[0.951344,0.522850,0.292275],[0.953428,0.527960,0.288883],[0.955470,0.533093,0.285490],[0.957469,0.538250,0.282096],[0.959424,0.543431,0.278701],[0.961336,0.548636,0.275305],[0.963203,0.553865,0.271909],[0.965024,0.559118,0.268513],[0.966798,0.564396,0.265118],[0.968526,0.569700,0.261721],[0.970205,0.575028,0.258325],[0.971835,0.580382,0.254931],[0.973416,0.585761,0.251540],[0.974947,0.591165,0.248151],[0.976428,0.596595,0.244767],[0.977856,0.602051,0.241387],[0.979233,0.607532,0.238013],[0.980556,0.613039,0.234646],[0.981826,0.618572,0.231287],[0.983041,0.624131,0.227937],[0.984199,0.629718,0.224595],[0.985301,0.635330,0.221265],[0.986345,0.640969,0.217948],[0.987332,0.646633,0.214648],[0.988260,0.652325,0.211364],[0.989128,0.658043,0.208100],[0.989935,0.663787,0.204859],[0.990681,0.669558,0.201642],[0.991365,0.675355,0.198453],[0.991985,0.681179,0.195295],[0.992541,0.687030,0.192170],[0.993032,0.692907,0.189084],[0.993456,0.698810,0.186041],[0.993814,0.704741,0.183043],[0.994103,0.710698,0.180097],[0.994324,0.716681,0.177208],[0.994474,0.722691,0.174381],[0.994553,0.728728,0.171622],[0.994561,0.734791,0.168938],[0.994495,0.740880,0.166335],[0.994355,0.746995,0.163821],[0.994141,0.753137,0.161404],[0.993851,0.759304,0.159092],[0.993482,0.765499,0.156891],[0.993033,0.771720,0.154808],[0.992505,0.777967,0.152855],[0.991897,0.784239,0.151042],[0.991209,0.790537,0.149377],[0.990439,0.796859,0.147870],[0.989587,0.803205,0.146529],[0.988648,0.809579,0.145357],[0.987621,0.815978,0.144363],[0.986509,0.822401,0.143557],[0.985314,0.828846,0.142945],[0.984031,0.835315,0.142528],[0.982653,0.841812,0.142303],[0.981190,0.848329,0.142279],[0.979644,0.854866,0.142453],[0.977995,0.861432,0.142808],[0.976265,0.868016,0.143351],[0.974443,0.874622,0.144061],[0.972530,0.881250,0.144923],[0.970533,0.887896,0.145919],[0.968443,0.894564,0.147014],[0.966271,0.901249,0.148180],[0.964021,0.907950,0.149370],[0.961681,0.914672,0.150520],[0.959276,0.921407,0.151566],[0.956808,0.928152,0.152409],[0.954287,0.934908,0.152921],[0.951726,0.941671,0.152925],[0.949151,0.948435,0.152178],[0.946602,0.955190,0.150328],[0.944152,0.961916,0.146861],[0.941896,0.968590,0.140956],[0.940015,0.975158,0.131326]]);
}

var colorscale_viridis = function(t) {
	return interpolate_color(t, [[0.267004,0.004874,0.329415],[0.268510,0.009605,0.335427],[0.269944,0.014625,0.341379],[0.271305,0.019942,0.347269],[0.272594,0.025563,0.353093],[0.273809,0.031497,0.358853],[0.274952,0.037752,0.364543],[0.276022,0.044167,0.370164],[0.277018,0.050344,0.375715],[0.277941,0.056324,0.381191],[0.278791,0.062145,0.386592],[0.279566,0.067836,0.391917],[0.280267,0.073417,0.397163],[0.280894,0.078907,0.402329],[0.281446,0.084320,0.407414],[0.281924,0.089666,0.412415],[0.282327,0.094955,0.417331],[0.282656,0.100196,0.422160],[0.282910,0.105393,0.426902],[0.283091,0.110553,0.431554],[0.283197,0.115680,0.436115],[0.283229,0.120777,0.440584],[0.283187,0.125848,0.444960],[0.283072,0.130895,0.449241],[0.282884,0.135920,0.453427],[0.282623,0.140926,0.457517],[0.282290,0.145912,0.461510],[0.281887,0.150881,0.465405],[0.281412,0.155834,0.469201],[0.280868,0.160771,0.472899],[0.280255,0.165693,0.476498],[0.279574,0.170599,0.479997],[0.278826,0.175490,0.483397],[0.278012,0.180367,0.486697],[0.277134,0.185228,0.489898],[0.276194,0.190074,0.493001],[0.275191,0.194905,0.496005],[0.274128,0.199721,0.498911],[0.273006,0.204520,0.501721],[0.271828,0.209303,0.504434],[0.270595,0.214069,0.507052],[0.269308,0.218818,0.509577],[0.267968,0.223549,0.512008],[0.266580,0.228262,0.514349],[0.265145,0.232956,0.516599],[0.263663,0.237631,0.518762],[0.262138,0.242286,0.520837],[0.260571,0.246922,0.522828],[0.258965,0.251537,0.524736],[0.257322,0.256130,0.526563],[0.255645,0.260703,0.528312],[0.253935,0.265254,0.529983],[0.252194,0.269783,0.531579],[0.250425,0.274290,0.533103],[0.248629,0.278775,0.534556],[0.246811,0.283237,0.535941],[0.244972,0.287675,0.537260],[0.243113,0.292092,0.538516],[0.241237,0.296485,0.539709],[0.239346,0.300855,0.540844],[0.237441,0.305202,0.541921],[0.235526,0.309527,0.542944],[0.233603,0.313828,0.543914],[0.231674,0.318106,0.544834],[0.229739,0.322361,0.545706],[0.227802,0.326594,0.546532],[0.225863,0.330805,0.547314],[0.223925,0.334994,0.548053],[0.221989,0.339161,0.548752],[0.220057,0.343307,0.549413],[0.218130,0.347432,0.550038],[0.216210,0.351535,0.550627],[0.214298,0.355619,0.551184],[0.212395,0.359683,0.551710],[0.210503,0.363727,0.552206],[0.208623,0.367752,0.552675],[0.206756,0.371758,0.553117],[0.204903,0.375746,0.553533],[0.203063,0.379716,0.553925],[0.201239,0.383670,0.554294],[0.199430,0.387607,0.554642],[0.197636,0.391528,0.554969],[0.195860,0.395433,0.555276],[0.194100,0.399323,0.555565],[0.192357,0.403199,0.555836],[0.190631,0.407061,0.556089],[0.188923,0.410910,0.556326],[0.187231,0.414746,0.556547],[0.185556,0.418570,0.556753],[0.183898,0.422383,0.556944],[0.182256,0.426184,0.557120],[0.180629,0.429975,0.557282],[0.179019,0.433756,0.557430],[0.177423,0.437527,0.557565],[0.175841,0.441290,0.557685],[0.174274,0.445044,0.557792],[0.172719,0.448791,0.557885],[0.171176,0.452530,0.557965],[0.169646,0.456262,0.558030],[0.168126,0.459988,0.558082],[0.166617,0.463708,0.558119],[0.165117,0.467423,0.558141],[0.163625,0.471133,0.558148],[0.162142,0.474838,0.558140],[0.160665,0.478540,0.558115],[0.159194,0.482237,0.558073],[0.157729,0.485932,0.558013],[0.156270,0.489624,0.557936],[0.154815,0.493313,0.557840],[0.153364,0.497000,0.557724],[0.151918,0.500685,0.557587],[0.150476,0.504369,0.557430],[0.149039,0.508051,0.557250],[0.147607,0.511733,0.557049],[0.146180,0.515413,0.556823],[0.144759,0.519093,0.556572],[0.143343,0.522773,0.556295],[0.141935,0.526453,0.555991],[0.140536,0.530132,0.555659],[0.139147,0.533812,0.555298],[0.137770,0.537492,0.554906],[0.136408,0.541173,0.554483],[0.135066,0.544853,0.554029],[0.133743,0.548535,0.553541],[0.132444,0.552216,0.553018],[0.131172,0.555899,0.552459],[0.129933,0.559582,0.551864],[0.128729,0.563265,0.551229],[0.127568,0.566949,0.550556],[0.126453,0.570633,0.549841],[0.125394,0.574318,0.549086],[0.124395,0.578002,0.548287],[0.123463,0.581687,0.547445],[0.122606,0.585371,0.546557],[0.121831,0.589055,0.545623],[0.121148,0.592739,0.544641],[0.120565,0.596422,0.543611],[0.120092,0.600104,0.542530],[0.119738,0.603785,0.541400],[0.119512,0.607464,0.540218],[0.119423,0.611141,0.538982],[0.119483,0.614817,0.537692],[0.119699,0.618490,0.536347],[0.120081,0.622161,0.534946],[0.120638,0.625828,0.533488],[0.121380,0.629492,0.531973],[0.122312,0.633153,0.530398],[0.123444,0.636809,0.528763],[0.124780,0.640461,0.527068],[0.126326,0.644107,0.525311],[0.128087,0.647749,0.523491],[0.130067,0.651384,0.521608],[0.132268,0.655014,0.519661],[0.134692,0.658636,0.517649],[0.137339,0.662252,0.515571],[0.140210,0.665859,0.513427],[0.143303,0.669459,0.511215],[0.146616,0.673050,0.508936],[0.150148,0.676631,0.506589],[0.153894,0.680203,0.504172],[0.157851,0.683765,0.501686],[0.162016,0.687316,0.499129],[0.166383,0.690856,0.496502],[0.170948,0.694384,0.493803],[0.175707,0.697900,0.491033],[0.180653,0.701402,0.488189],[0.185783,0.704891,0.485273],[0.191090,0.708366,0.482284],[0.196571,0.711827,0.479221],[0.202219,0.715272,0.476084],[0.208030,0.718701,0.472873],[0.214000,0.722114,0.469588],[0.220124,0.725509,0.466226],[0.226397,0.728888,0.462789],[0.232815,0.732247,0.459277],[0.239374,0.735588,0.455688],[0.246070,0.738910,0.452024],[0.252899,0.742211,0.448284],[0.259857,0.745492,0.444467],[0.266941,0.748751,0.440573],[0.274149,0.751988,0.436601],[0.281477,0.755203,0.432552],[0.288921,0.758394,0.428426],[0.296479,0.761561,0.424223],[0.304148,0.764704,0.419943],[0.311925,0.767822,0.415586],[0.319809,0.770914,0.411152],[0.327796,0.773980,0.406640],[0.335885,0.777018,0.402049],[0.344074,0.780029,0.397381],[0.352360,0.783011,0.392636],[0.360741,0.785964,0.387814],[0.369214,0.788888,0.382914],[0.377779,0.791781,0.377939],[0.386433,0.794644,0.372886],[0.395174,0.797475,0.367757],[0.404001,0.800275,0.362552],[0.412913,0.803041,0.357269],[0.421908,0.805774,0.351910],[0.430983,0.808473,0.346476],[0.440137,0.811138,0.340967],[0.449368,0.813768,0.335384],[0.458674,0.816363,0.329727],[0.468053,0.818921,0.323998],[0.477504,0.821444,0.318195],[0.487026,0.823929,0.312321],[0.496615,0.826376,0.306377],[0.506271,0.828786,0.300362],[0.515992,0.831158,0.294279],[0.525776,0.833491,0.288127],[0.535621,0.835785,0.281908],[0.545524,0.838039,0.275626],[0.555484,0.840254,0.269281],[0.565498,0.842430,0.262877],[0.575563,0.844566,0.256415],[0.585678,0.846661,0.249897],[0.595839,0.848717,0.243329],[0.606045,0.850733,0.236712],[0.616293,0.852709,0.230052],[0.626579,0.854645,0.223353],[0.636902,0.856542,0.216620],[0.647257,0.858400,0.209861],[0.657642,0.860219,0.203082],[0.668054,0.861999,0.196293],[0.678489,0.863742,0.189503],[0.688944,0.865448,0.182725],[0.699415,0.867117,0.175971],[0.709898,0.868751,0.169257],[0.720391,0.870350,0.162603],[0.730889,0.871916,0.156029],[0.741388,0.873449,0.149561],[0.751884,0.874951,0.143228],[0.762373,0.876424,0.137064],[0.772852,0.877868,0.131109],[0.783315,0.879285,0.125405],[0.793760,0.880678,0.120005],[0.804182,0.882046,0.114965],[0.814576,0.883393,0.110347],[0.824940,0.884720,0.106217],[0.835270,0.886029,0.102646],[0.845561,0.887322,0.099702],[0.855810,0.888601,0.097452],[0.866013,0.889868,0.095953],[0.876168,0.891125,0.095250],[0.886271,0.892374,0.095374],[0.896320,0.893616,0.096335],[0.906311,0.894855,0.098125],[0.916242,0.896091,0.100717],[0.926106,0.897330,0.104071],[0.935904,0.898570,0.108131],[0.945636,0.899815,0.112838],[0.955300,0.901065,0.118128],[0.964894,0.902323,0.123941],[0.974417,0.903590,0.130215],[0.983868,0.904867,0.136897],[0.993248,0.906157,0.143936]]);
}

var colorscale_greys = function(t) {
	if (t <= 0) { return [0, 0, 0]; }
	if (t >= 1) { return [1, 1, 1]; }
	
	return [t, t, t];
}

var calculate_color = function(val, domain, color_fn) {
	if (isNaN(val) || (val === null)) { return [0, 0, 0]; }
	
	var t = (val - domain[0]) / (domain[1] - domain[0]);
	return color_fn(t);
}

var make_points = function(i_plot, params, plot_locations, null_points, append) {
	if (append === undefined) {
		append = false;
	}
	
	var i, j, font_color, color_obj, group, start_i, this_size, this_loc, i_group;
	
	var scale_factor = get_scale_factor(i_plot);
	
	if (plots[i_plot].geom_type == "point") {
		if (append) {
			// Since the points are merged into a single geometry,
			// we can't really "append" to existing points, but
			// instead have to re-create the whole geometry.
			
			plots[i_plot].scene.remove(plots[i_plot].points_merged);
			
			var positions_old = plots[i_plot].points_merged.geometry.attributes.position.array;
			var sizes_old = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
			var hide_points_old = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
			var null_points_old = plots[i_plot].points_merged.geometry.attributes.null_point.array;
			var colors_old = plots[i_plot].points_merged.geometry.attributes.color.array;
			
			var point_locations = new Float32Array((plots[i_plot].points.length + params.data.length) * 3);
			var point_colors = new Uint8Array((plots[i_plot].points.length + params.data.length) * 4);
			var hide_points = new Float32Array(plots[i_plot].points.length + params.data.length);
			var dot_heights = new Float32Array(plots[i_plot].points.length + params.data.length);
			
			// null_points gets a separate suffix because an unsuffixed null_points
			// is an argument passed to this function.
			var null_points_new = new Float32Array(plots[i_plot].points.length + params.data.length);
			
			for (i = 0; i < plots[i_plot].points.length; i++) {
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
		
		plots[i_plot].points_merged_geom = new THREE.BufferGeometry();
	}
	
	if (!append) {
		plots[i_plot].points = [];
		plots[i_plot].labels = [];
		start_i = 0;
		
		if (plots[i_plot].have_groups || plots[i_plot].have_segments) {
			for (group in plots[i_plot].groups) {
				if (plots[i_plot].groups.hasOwnProperty(group)) {
					plots[i_plot].groups[group].i_main = [];
				}
			}
		}
		
		if (plots[i_plot].have_segments) {
			plots[i_plot].segment_material = new THREE.ShaderMaterial({
				"vertexShader":   shader_lines_vertex,
				"fragmentShader": shader_lines_fragment
			});
			
			for (group in plots[i_plot].groups) {
				if (plots[i_plot].groups.hasOwnProperty(group)) {
					plots[i_plot].groups[group].segment_geom = new THREE.BufferGeometry();
					
					plots[i_plot].groups[group].positions = [];
					plots[i_plot].groups[group].colors = [];
					plots[i_plot].groups[group].null_points = [];
					plots[i_plot].groups[group].hide_points = [];
				}
			}
		}
	} else {
		start_i = plots[i_plot].points.length;
		
		var keep_axes = (params.hasOwnProperty("keep_axes")) ? params.keep_axes : false;
		
		if (!keep_axes) {
			// Need to update existing world-space coordinates.
			
			var axes = ["x", "y", "z"];
			
			for (i = 0; i < plots[i_plot].points.length; i++) {
				if (plots[i_plot].have_segments) {
					group = plots[i_plot].points[i].group;
					i_group = plots[i_plot].points[i].i_group;
				}
				
				for (j = 0; j < 3; j++) {
					this_loc = plots[i_plot].scales[j](plots[i_plot].points[i].input_data[axes[j]]);
					
					if (plots[i_plot].geom_type == "point") {
						point_locations[3*i + j] = this_loc;
					} else if (plots[i_plot].geom_type == "quad") {
						plots[i_plot].points[i].position[axes[j]] = this_loc;
					}
					
					if (plots[i_plot].have_segments) {
						plots[i_plot].groups[group].positions[3*i_group + j] = this_loc;
					}
				}
				
				if (plots[i_plot].have_any_sizes) {
					this_size = plots[i_plot].points[i].input_data.size;
					
					if ((this_size !== null) && !isNaN(this_size) && (plots[i_plot].size_exponent != 0)) {
						plots[i_plot].points[i].input_data.sphere_size = plots[i_plot].scales[3](plots[i_plot].points[i].input_data.scaled_size);
						
						if (plots[i_plot].geom_type == "point") {
							dot_heights[i] = plots[i_plot].points[i].input_data.sphere_size;
						} else if (plots[i_plot].geom_type == "quad") {
							plots[i_plot].points[i].scale.x = 2 * scale_factor * plots[i_plot].points[i].input_data.sphere_size;
							plots[i_plot].points[i].scale.y = 2 * scale_factor * plots[i_plot].points[i].input_data.sphere_size;
						}
					} else {
						if (plots[i_plot].geom_type == "point") {
							dot_heights[i] = sizes_old[i];
						}
					}
				}
			}
		} else {
			if (plots[i_plot].geom_type == "point") {
				for (i = 0; i < plots[i_plot].points.length; i++) {
					point_locations[3*i + 0] = positions_old[3*i + 0];
					point_locations[3*i + 1] = positions_old[3*i + 1];
					point_locations[3*i + 2] = positions_old[3*i + 2];
					
					dot_heights[i] = sizes_old[i];
				}
			}
		}
	}
	
	var show_labels = (params.hasOwnProperty("show_labels")) ? params.show_labels : true;
	
	plots[i_plot].label_font_size = (params.hasOwnProperty("label_font_size")) ? params.label_font_size : 16;
	var label_font_size = plots[i_plot].label_font_size;
	
	var init_label_scale = 2 * label_font_size * scale_factor;
	plots[i_plot].init_label_scale = init_label_scale;
	
	var bg_color_obj = hex_to_rgb_obj(plots[i_plot].bg_color_hex);
	var sum_bg = bg_color_obj.r + bg_color_obj.g + bg_color_obj.b;
	var use_white = (sum_bg > 1.5) ? false : true;
	
	
	for (i = 0; i < params.data.length; i++) {
		color_obj = hex_to_rgb_obj_255(params.data[i].color);
		
		if (plots[i_plot].have_groups) {
			group = params.data[i].group;
		} else {
			group = "default_group";
		}
		
		if (plots[i_plot].geom_type == "point") {
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
			
			plots[i_plot].points.push({});
		} else if (plots[i_plot].geom_type == "quad") {
			
			plots[i_plot].points.push(new THREE.Mesh(
				new THREE.PlaneBufferGeometry(1, 1, 1),
				plots[i_plot].groups[group].quad_material
			));
			
			plots[i_plot].points[start_i + i].point_colors = new Uint8Array(16);
			plots[i_plot].points[start_i + i].hide_points = new Float32Array(4);
			plots[i_plot].points[start_i + i].null_points = new Float32Array(4);
			
			// Need to copy the values across each of the four vertices
			// for the shader to work properly.
			for (j = 0; j < 4; j++) {
				plots[i_plot].points[start_i + i].point_colors[4*j + 0] = color_obj.r;
				plots[i_plot].points[start_i + i].point_colors[4*j + 1] = color_obj.g;
				plots[i_plot].points[start_i + i].point_colors[4*j + 2] = color_obj.b;
				plots[i_plot].points[start_i + i].point_colors[4*j + 3] = 255;
				
				plots[i_plot].points[start_i + i].hide_points[j] = 0;
				plots[i_plot].points[start_i + i].null_points[j] = null_points[i];
			}
			
			plots[i_plot].points[start_i + i].position.x = plot_locations[i][0];
			plots[i_plot].points[start_i + i].position.y = plot_locations[i][1];
			plots[i_plot].points[start_i + i].position.z = plot_locations[i][2];
			
			plots[i_plot].points[start_i + i].scale.x = 2 * scale_factor * plot_locations[i][3];
			plots[i_plot].points[start_i + i].scale.y = 2 * scale_factor * plot_locations[i][3];
			
			plots[i_plot].points[start_i + i].rotation.copy(get_current_camera(i_plot).rotation);
			
			plots[i_plot].points[start_i + i].geometry.addAttribute("color", new THREE.BufferAttribute(plots[i_plot].points[start_i + i].point_colors, 4, true));
			plots[i_plot].points[start_i + i].geometry.addAttribute("hide_point", new THREE.BufferAttribute(plots[i_plot].points[start_i + i].hide_points, 1));
			plots[i_plot].points[start_i + i].geometry.addAttribute("null_point", new THREE.BufferAttribute(plots[i_plot].points[start_i + i].null_points, 1));
			
			plots[i_plot].scene.add(plots[i_plot].points[start_i + i]);
		} else if (plots[i_plot].geom_type == "none") {
			plots[i_plot].points.push({});
		}
		
		
		if (plots[i_plot].have_any_labels) {
			plots[i_plot].points[start_i + i].have_label = false;
			
			if (params.data[i].label.length > 0) {
				plots[i_plot].points[start_i + i].have_label = true;
				
				plots[i_plot].labels.push(
					make_label_text_plane(
						params.data[i].label,
						plots[i_plot].font,
						plots[i_plot].label_font_size,
						use_white,
						plots[i_plot].bg_color_hex,
						i_plot
				));
				
				plots[i_plot].labels[start_i + i].material.uniforms.color.value = new THREE.Vector4(color_obj.r/255, color_obj.g/255, color_obj.b/255, 1.0);
				
				plots[i_plot].labels[start_i + i].position.set(plot_locations[i][0], plot_locations[i][1], plot_locations[i][2]);
				plots[i_plot].labels[start_i + i].scale.set(plots[i_plot].init_label_scale, plots[i_plot].init_label_scale, 1);
				
				plots[i_plot].show_label = show_labels;
				if (show_labels && !null_points[i]) {
					plots[i_plot].scene.add(plots[i_plot].labels[start_i + i]);
				}
			} else {
				plots[i_plot].labels.push(null);
			}
		} else {
			plots[i_plot].labels.push(null);
		}
		
		
		if (plots[i_plot].have_groups) {
			if (params.data[i].hasOwnProperty("group")) {
				if (plots[i_plot].groups[params.data[i].group] === undefined) {
					console.warn("Group " + params.data[i].group + " not declared in params.groups");
					plots[i_plot].points[start_i + i].group = "default_group";
				} else {
					plots[i_plot].points[start_i + i].group = params.data[i].group;
				}
			} else {
				console.warn("Groups initialised, but missing group property.");
				plots[i_plot].points[start_i + i].group = "default_group";
			}
		} else {
			plots[i_plot].points[start_i + i].group = "default_group";
		}
		
		if (plots[i_plot].have_groups || plots[i_plot].have_segments) {
			plots[i_plot].groups[group].i_main.push(i);
			i_group = plots[i_plot].groups[group].i_main.length - 1;
			
			plots[i_plot].points[start_i + i].i_group = i_group;
		}
		
		if (plots[i_plot].have_segments) {
			plots[i_plot].groups[group].null_points.push(null_points[i]);
			
			plots[i_plot].groups[group].positions.push(plot_locations[i][0]);
			plots[i_plot].groups[group].positions.push(plot_locations[i][1]);
			plots[i_plot].groups[group].positions.push(plot_locations[i][2]);
			
			plots[i_plot].groups[group].colors.push(color_obj.r/255);
			plots[i_plot].groups[group].colors.push(color_obj.g/255);
			plots[i_plot].groups[group].colors.push(color_obj.b/255);
			plots[i_plot].groups[group].colors.push(1);
			
			plots[i_plot].groups[group].hide_points.push(0);
		}
		
		// Some more properties added to the object for use in mouseovers etc.
		plots[i_plot].points[start_i + i].input_data = {};
		plots[i_plot].points[start_i + i].input_data.other = JSON.parse(JSON.stringify(params.data[i].other));
	}
	
	update_points_input_data(i_plot, params, plot_locations, start_i);
	
	if (plots[i_plot].geom_type == "point") {
		plots[i_plot].points_merged_geom.addAttribute("position", new THREE.BufferAttribute(point_locations, 3));
		plots[i_plot].points_merged_geom.addAttribute("color", new THREE.BufferAttribute(point_colors, 4, true));
		plots[i_plot].points_merged_geom.addAttribute("dot_height", new THREE.BufferAttribute(dot_heights, 1));
		plots[i_plot].points_merged_geom.addAttribute("hide_point", new THREE.BufferAttribute(hide_points, 1));
		
		if (append) {
			plots[i_plot].points_merged_geom.addAttribute("null_point", new THREE.BufferAttribute(null_points_new, 1));
		} else {
			plots[i_plot].points_merged_geom.addAttribute("null_point", new THREE.BufferAttribute(null_points, 1));
		}
		
		plots[i_plot].points_merged = new THREE.Points(plots[i_plot].points_merged_geom, plots[i_plot].point_material);
		plots[i_plot].scene.add(plots[i_plot].points_merged);
	}
	
	if (plots[i_plot].have_segments) {
		var temp_positions, temp_colors, temp_hides, temp_nulls;
		
		for (group in plots[i_plot].groups) {
			if (plots[i_plot].groups.hasOwnProperty(group)) {
				temp_positions = new Float32Array(plots[i_plot].groups[group].positions);
				temp_colors = new Float32Array(plots[i_plot].groups[group].colors);
				temp_hides = new Float32Array(plots[i_plot].groups[group].hide_points);
				temp_nulls = new Float32Array(plots[i_plot].groups[group].null_points);
				
				plots[i_plot].groups[group].segment_geom.addAttribute("position", new THREE.BufferAttribute(temp_positions, 3));
				plots[i_plot].groups[group].segment_geom.addAttribute("color", new THREE.BufferAttribute(temp_colors, 4));
				plots[i_plot].groups[group].segment_geom.addAttribute("hide_point", new THREE.BufferAttribute(temp_hides, 1));
				plots[i_plot].groups[group].segment_geom.addAttribute("null_point", new THREE.BufferAttribute(temp_nulls, 1));
				
				plots[i_plot].groups[group].segment_lines = new THREE.Line(plots[i_plot].groups[group].segment_geom, plots[i_plot].segment_material);
				plots[i_plot].groups[group].segment_lines.frustumCulled = false;
				plots[i_plot].scene.add(plots[i_plot].groups[group].segment_lines);
			}
		}
	}
	
	if (plots[i_plot].have_any_labels) {
		update_labels(i_plot);
	}
}

var make_mesh_arrays = function(i_plot, params, plot_locations, null_points) {
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
	
	if (!plots[i_plot].hasOwnProperty("hiding_mesh_axes")) {
		plots[i_plot].hiding_mesh_axes = [false, false];
		plots[i_plot].hiding_mesh_axes[0] = params.hasOwnProperty("hide_mesh_x") ? (0 | params.hide_mesh_x) : 0;
		plots[i_plot].hiding_mesh_axes[1] = params.hasOwnProperty("hide_mesh_y") ? (0 | params.hide_mesh_y) : 0;
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
				
				return_obj.mesh_hide_axes[i_segment*2 + 0] = plots[i_plot].hiding_mesh_axes[1 - i_dirn];
				return_obj.mesh_hide_axes[i_segment*2 + 1] = plots[i_plot].hiding_mesh_axes[1 - i_dirn];
				
				i_segment++;
			}
		}
	}
	
	return return_obj;
}

var make_mesh_points = function(i_plot, params, plot_locations, null_points) {
	var i, j;
	var nx = plot_locations.x.length;
	var ny = plot_locations.y.length;
	
	var surface_geom = new THREE.BufferGeometry();
	var mesh_geom    = new THREE.BufferGeometry();
	
	var array_obj = make_mesh_arrays(i_plot, params, plot_locations, null_points);
	
	surface_geom.addAttribute("position",   new THREE.BufferAttribute(array_obj.surface_positions, 3, true));
	surface_geom.addAttribute("color",      new THREE.BufferAttribute(array_obj.surface_colors,    4, true));
	surface_geom.addAttribute("null_point", new THREE.BufferAttribute(array_obj.surface_nulls,     1, true));
	surface_geom.addAttribute("hide_point", new THREE.BufferAttribute(array_obj.surface_hides,     1, true));
	
	plots[i_plot].surface = new THREE.Mesh(surface_geom, plots[i_plot].surface_material);
	
	if (!plots[i_plot].hasOwnProperty("showing_surface")) {
		plots[i_plot].showing_surface = (params.hasOwnProperty("show_surface")) ? params.show_surface : true;
	}
	
	if (plots[i_plot].showing_surface) { plots[i_plot].scene.add(plots[i_plot].surface); }
	
	mesh_geom.addAttribute("position",   new THREE.BufferAttribute(array_obj.mesh_positions, 3, true));
	mesh_geom.addAttribute("color",      new THREE.BufferAttribute(array_obj.mesh_colors,    4, true));
	mesh_geom.addAttribute("null_point", new THREE.BufferAttribute(array_obj.mesh_nulls,     1, true));
	mesh_geom.addAttribute("hide_point", new THREE.BufferAttribute(array_obj.mesh_hides,     1, true));
	mesh_geom.addAttribute("hide_axis",  new THREE.BufferAttribute(array_obj.mesh_hide_axes, 1, true));
	
	plots[i_plot].surface_mesh = new THREE.LineSegments(mesh_geom, plots[i_plot].mesh_material);
	
	if (!plots[i_plot].hasOwnProperty("showing_mesh")) {
		plots[i_plot].showing_mesh = (params.hasOwnProperty("show_mesh")) ? params.show_mesh : true;
	}
	
	if (plots[i_plot].showing_mesh) { plots[i_plot].scene.add(plots[i_plot].surface_mesh); }
	
	plots[i_plot].mesh_points = [];
	plots[i_plot].hide_points = [];
	plots[i_plot].hide_mesh_points = [];
	
	// Update input data.
	for (i = 0; i < nx; i++) {
		plots[i_plot].mesh_points.push([]);
		plots[i_plot].hide_points.push([]);
		plots[i_plot].hide_mesh_points.push([]);
		
		for (j = 0; j < ny; j++) {
			plots[i_plot].mesh_points[i].push({"input_data": {}});
			if (plots[i_plot].have_other) {
				plots[i_plot].mesh_points[i][j].input_data.other = JSON.parse(JSON.stringify(params.data.other[i][j]));
			} else {
				plots[i_plot].mesh_points[i][j].input_data.other = {};
			}
			
			plots[i_plot].hide_points[i].push(0);
			plots[i_plot].hide_mesh_points[i].push(0);
		}
	}
	
	update_surface_input_data(i_plot, params, array_obj.start_i, array_obj.start_j);
}

var smoothstep = function(t) {
	return t*t*t*(t*(t*6 - 15) + 10);
}

var animate_transition_wrapper = function(i_plot) {
	return function() {
		animate_transition(i_plot);
	}
}

var animate_transition = function(i_plot) {
	var i, j, t, group, i_group;
	
	if (plots[i_plot].transition_t > 1) { plots[i_plot].transition_t = 1; }
	t = smoothstep(plots[i_plot].transition_t);
	
	if (plots[i_plot].plot_type == "scatter") {
		if (plots[i_plot].geom_type == "point") {
			var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
			var sizes = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
			var colors = plots[i_plot].points_merged.geometry.attributes.color.array;
		} else if (plots[i_plot].geom_type == "quad") {
			var this_size, colors;
			var scale_factor = 2 * get_scale_factor(i_plot);
		}
		
		
		if (plots[i_plot].have_segments) {
			var group_lines = {};
			
			for (group in plots[i_plot].groups) {
				if (plots[i_plot].groups.hasOwnProperty(group)) {
					group_lines[group] = {};
					
					group_lines[group].positions = plots[i_plot].groups[group].segment_lines.geometry.attributes.position.array;
					group_lines[group].colors = plots[i_plot].groups[group].segment_lines.geometry.attributes.color.array;
					
					plots[i_plot].groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
					plots[i_plot].groups[group].segment_lines.geometry.attributes.color.needsUpdate = true;
				}
			}
		}
	} else if (plots[i_plot].plot_type == "surface") {
		var positions = plots[i_plot].surface.geometry.attributes.position.array;
		var colors = plots[i_plot].surface.geometry.attributes.color.array;
		
		var mesh_positions = plots[i_plot].surface_mesh.geometry.attributes.position.array;
		var mesh_colors = plots[i_plot].surface_mesh.geometry.attributes.color.array;
		
		plots[i_plot].surface.geometry.attributes.position.needsUpdate = true;
		plots[i_plot].surface.geometry.attributes.color.needsUpdate = true;
		
		plots[i_plot].surface_mesh.geometry.attributes.position.needsUpdate = true;
		plots[i_plot].surface_mesh.geometry.attributes.color.needsUpdate = true;
	}
	
	var new_color, this_color, r, g, b, this_x, this_y, this_z;
	
	if (plots[i_plot].plot_type == "scatter") {
		for (i = 0; i < plots[i_plot].points.length; i++) {
			new_color = hex_to_rgb_obj_255(plots[i_plot].new_colors[i]);
			this_size = t*plots[i_plot].new_locations[i][3] + (1 - t)*plots[i_plot].old_heights[i];
			
			if ((plots[i_plot].geom_type == "point") || (plots[i_plot].geom_type == "quad")) {
				r = Math.round(t*new_color.r + (1 - t)*plots[i_plot].old_colors[4*i + 0]);
				g = Math.round(t*new_color.g + (1 - t)*plots[i_plot].old_colors[4*i + 1]);
				b = Math.round(t*new_color.b + (1 - t)*plots[i_plot].old_colors[4*i + 2]);
			} else if (plots[i_plot].geom_type == "none") {
				// Whoops.
				r = Math.round(t*new_color.r + (1 - t)*255*plots[i_plot].old_colors[4*i + 0]);
				g = Math.round(t*new_color.g + (1 - t)*255*plots[i_plot].old_colors[4*i + 1]);
				b = Math.round(t*new_color.b + (1 - t)*255*plots[i_plot].old_colors[4*i + 2]);
			}
			
			this_color = (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b);
			
			set_point_color(i_plot, i, this_color, true);
			if (plots[i_plot].points[i].have_label) {
				set_label_color(i_plot, i, this_color);
			}
			
			set_point_size(i_plot, i, this_size, scale_factor);
			
			if (plots[i_plot].geom_type == "point") {
				this_x = t*plots[i_plot].new_locations[i][0] + (1 - t)*plots[i_plot].old_positions[3*i + 0];
				this_y = t*plots[i_plot].new_locations[i][1] + (1 - t)*plots[i_plot].old_positions[3*i + 1];
				this_z = t*plots[i_plot].new_locations[i][2] + (1 - t)*plots[i_plot].old_positions[3*i + 2];
				
				positions[3*i + 0] = this_x;
				positions[3*i + 1] = this_y;
				positions[3*i + 2] = this_z;
			} else if (plots[i_plot].geom_type == "quad") {
				this_x = t*plots[i_plot].new_locations[i][0] + (1 - t)*plots[i_plot].old_positions[i].x;
				this_y = t*plots[i_plot].new_locations[i][1] + (1 - t)*plots[i_plot].old_positions[i].y;
				this_z = t*plots[i_plot].new_locations[i][2] + (1 - t)*plots[i_plot].old_positions[i].z;
				
				plots[i_plot].points[i].position.x = this_x;
				plots[i_plot].points[i].position.y = this_y;
				plots[i_plot].points[i].position.z = this_z;
			}
			
			if (plots[i_plot].have_segments) {
				// If points are connected, then the groups shouldn't
				// change; irregular behaviour will results if groups
				// _do_ change.
				group = plots[i_plot].points[i].group;
				i_group = plots[i_plot].points[i].i_group;
				
				if (plots[i_plot].geom_type == "none") {
					this_x = t*plots[i_plot].new_locations[i][0] + (1 - t)*plots[i_plot].old_positions[3*i + 0];
					this_y = t*plots[i_plot].new_locations[i][1] + (1 - t)*plots[i_plot].old_positions[3*i + 1];
					this_z = t*plots[i_plot].new_locations[i][2] + (1 - t)*plots[i_plot].old_positions[3*i + 2];
				}
				
				group_lines[group].positions[3*i_group + 0] = this_x;
				group_lines[group].positions[3*i_group + 1] = this_y;
				group_lines[group].positions[3*i_group + 2] = this_z;
			}
		}
		
		if (plots[i_plot].geom_type == "point") {
			plots[i_plot].points_merged.geometry.attributes.position.needsUpdate = true;
		}
		
		if (plots[i_plot].have_segments) {
			plots[i_plot].groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
			//plots[i_plot].groups[group].segment_lines.geometry.attributes.color.needsUpdate = true;
		}
		
		if (plots[i_plot].have_any_labels) {
			update_labels(i_plot);
		}
	} else if (plots[i_plot].plot_type == "surface") {
		var n_points = positions.length/3;
		
		for (i = 0; i < n_points; i++) {
			positions[3*i + 0] = t*plots[i_plot].new_surface_positions[3*i + 0] + (1 - t)*plots[i_plot].old_surface_positions[3*i + 0];
			positions[3*i + 1] = t*plots[i_plot].new_surface_positions[3*i + 1] + (1 - t)*plots[i_plot].old_surface_positions[3*i + 1];
			positions[3*i + 2] = t*plots[i_plot].new_surface_positions[3*i + 2] + (1 - t)*plots[i_plot].old_surface_positions[3*i + 2];
			
			colors[4*i + 0] = t*plots[i_plot].new_surface_colors[4*i + 0] + (1 - t)*plots[i_plot].old_surface_colors[4*i + 0];
			colors[4*i + 1] = t*plots[i_plot].new_surface_colors[4*i + 1] + (1 - t)*plots[i_plot].old_surface_colors[4*i + 1];
			colors[4*i + 2] = t*plots[i_plot].new_surface_colors[4*i + 2] + (1 - t)*plots[i_plot].old_surface_colors[4*i + 2];
			colors[4*i + 3] = t*plots[i_plot].new_surface_colors[4*i + 3] + (1 - t)*plots[i_plot].old_surface_colors[4*i + 3];
		}
		
		
		n_points = mesh_positions.length/3;
		
		for (i = 0; i < n_points; i++) {
			mesh_positions[3*i + 0] = t*plots[i_plot].new_mesh_positions[3*i + 0] + (1 - t)*plots[i_plot].old_mesh_positions[3*i + 0];
			mesh_positions[3*i + 1] = t*plots[i_plot].new_mesh_positions[3*i + 1] + (1 - t)*plots[i_plot].old_mesh_positions[3*i + 1];
			mesh_positions[3*i + 2] = t*plots[i_plot].new_mesh_positions[3*i + 2] + (1 - t)*plots[i_plot].old_mesh_positions[3*i + 2];
			
			mesh_colors[4*i + 0] = t*plots[i_plot].new_mesh_colors[4*i + 0] + (1 - t)*plots[i_plot].old_mesh_colors[4*i + 0];
			mesh_colors[4*i + 1] = t*plots[i_plot].new_mesh_colors[4*i + 1] + (1 - t)*plots[i_plot].old_mesh_colors[4*i + 1];
			mesh_colors[4*i + 2] = t*plots[i_plot].new_mesh_colors[4*i + 2] + (1 - t)*plots[i_plot].old_mesh_colors[4*i + 2];
			mesh_colors[4*i + 3] = t*plots[i_plot].new_mesh_colors[4*i + 3] + (1 - t)*plots[i_plot].old_mesh_colors[4*i + 3];
		}
	}
	
	update_render(i_plot);
	
	if (plots[i_plot].transition_t < 1) {
		plots[i_plot].transition_t += 1/60;
		requestAnimationFrame(animate_transition_wrapper(i_plot));
	}
}

var update_points_input_data = function(i_plot, params, locations, start_i) {
	if (start_i === undefined) { start_i = 0; }
	
	for (var i = start_i; i < plots[i_plot].points.length; i++) {
		plots[i_plot].points[i].input_data.i = i;
		plots[i_plot].points[i].input_data.x = params.data[i - start_i].x;
		plots[i_plot].points[i].input_data.y = params.data[i - start_i].y;
		plots[i_plot].points[i].input_data.z = params.data[i - start_i].z;
		plots[i_plot].points[i].input_data.size = params.data[i - start_i].size;
		plots[i_plot].points[i].input_data.scaled_size = params.data[i - start_i].scaled_size;
		plots[i_plot].points[i].input_data.sphere_size = locations[i - start_i][3];
		plots[i_plot].points[i].input_data.color = params.data[i - start_i].color;
		plots[i_plot].points[i].input_data.label = params.data[i - start_i].label;
		
		// input_data.other is set in make_points().
	}
}

var update_surface_input_data = function(i_plot, params, start_i, start_j, change_colors) {
	if (start_j === undefined) { start_j = 0; }
	if (start_i === undefined) { start_i = 0; }
	if (change_colors === undefined) { change_colors = true; }
	
	for (var i = start_i; i < plots[i_plot].mesh_points.length; i++) {
		for (var j = start_j; j < plots[i_plot].mesh_points[i].length; j++) {
			plots[i_plot].mesh_points[i][j].input_data.i = i;
			plots[i_plot].mesh_points[i][j].input_data.j = j;
			plots[i_plot].mesh_points[i][j].input_data.x = params.data.x[i - start_i];
			plots[i_plot].mesh_points[i][j].input_data.y = params.data.y[j - start_j];
			plots[i_plot].mesh_points[i][j].input_data.z = params.data.z[i - start_i][j - start_j];
			
			if (change_colors) {
				plots[i_plot].mesh_points[i][j].input_data.color = params.data.color[i - start_i][j - start_j];
			}
			
			// input_data.other is set in make_mesh_points().
		}
	}
}

var change_data = function(i_plot, params, new_dataset, animate, append) {
	var i, j, group, i_group;
	
	if (new_dataset === undefined) {
		// Try a smooth transition if not otherwise specified.
		new_dataset = false;
		animate = true;
	}
	
	if (animate === undefined) { animate = true; }
	
	if (plots[i_plot].plot_type == "scatter") {
		if (params.data.length != plots[i_plot].points.length) {
			animate = false;
			new_dataset = true;
		}
	} else if (plots[i_plot].plot_type == "surface") {
		if (append) {
			if (!params.hasOwnProperty("append_axis")) {
				console.warn("Need to specify params.append_axis as either \"x\" or \"y\" to append data; cancelling.");
				return;
			}
		}
		
		var size_checks = check_surface_data_sizes(params);
		if (!size_checks.data) { return; }
		
		if (params.data.z.length != plots[i_plot].mesh_points.length) {
			animate = false;
			new_dataset = true;
		}
		
		for (i = 0; i < params.data.z.length; i++) {
			if (params.data.z[i].length != plots[i_plot].mesh_points[i].length) {
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
		
		if (plots[i_plot].plot_type == "scatter") {
			if (plots[i_plot].have_groups) {
				for (i = 0; i < params.data.length; i++) {
					if (!params.data[i].hasOwnProperty("group")) {
						params.data[i].group = "default_group";
					}
				}
			}
		} else if (plots[i_plot].plot_type == "surface") {
			var have_axis = params.hasOwnProperty("append_axis");
			
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
				if (params.data.z[0].length != plots[i_plot].mesh_points[0].length) {
					console.warn("Appending to x-axis but params.data.z[0] does not have the same length as original data.z[0]; cancelling.");
					return;
				}
			} else if ((params.append_axis == "+y") || (params.append_axis == "-y")) {
				if (params.data.z.length != plots[i_plot].mesh_points.length) {
					console.warn("Appending to y-axis but params.data.z does not have the same length as original data.z; cancelling.");
					return;
				}
			}
		}
	}
	
	if (plots[i_plot].plot_type == "surface") {
		var change_colors = true;
		
		if (!size_checks.colors && new_dataset && !append) {
			plots[i_plot].have_color_matrix = false;
		}
		
		if (!size_checks.colors && !new_dataset && plots[i_plot].have_color_matrix) {
			change_colors = false;
		}
	}
	
	var keep_axes = (params.hasOwnProperty("keep_axes")) ? params.keep_axes : false;
	if (new_dataset && !append) { keep_axes = false; }
	
	if (!keep_axes) {
		// Remove some old things....
		if (plots[i_plot].show_grid) {
			for (i = 0; i < 3; i++) {
				if (plots[i_plot].showing_upper_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_upper[i]);
				}
				
				if (plots[i_plot].showing_lower_grid[i]) {
					plots[i_plot].scene.remove(plots[i_plot].grid_lines_lower[i]);
				}
				
				plots[i_plot].showing_upper_grid[i] = false;
				plots[i_plot].showing_lower_grid[i] = false;
			}
		}
		
		if (plots[i_plot].show_ticks) {
			for (i = 0; i < 3; i++) {
				for (j = 0; j < 4; j++) {
					plots[i_plot].scene.remove(plots[i_plot].axis_ticks[i][j]);
				}
			}
			
			for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
				plots[i_plot].scene.remove(plots[i_plot].tick_text_planes[i]);
			}
		}
		
		if (plots[i_plot].show_axis_titles) {
			for (i = 0; i < 3; i++) {
				plots[i_plot].scene.remove(plots[i_plot].axis_text_planes[i]);
			}
		}
		
		if (plots[i_plot].show_box) {
			plots[i_plot].scene.remove(plots[i_plot].axis_box);
		}
	}
	
	if (new_dataset) {
		if (!append) {
			// Clear the scene.
			for (i = plots[i_plot].scene.children.length; i >= 0; i--) {
				plots[i_plot].scene.remove(plots[i_plot].scene.children[i]);
			}
			
			if (plots[i_plot].plot_type == "scatter") {
				if (plots[i_plot].have_any_labels) {
					plots[i_plot].labels = [];
					plots[i_plot].have_any_labels = false;
				}
			}
		}
			
		if (plots[i_plot].plot_type == "scatter") {
			if (plots[i_plot].have_groups) {
				for (i = 0; i < params.data.length; i++) {
					if (params.data[i].hasOwnProperty("group")) {
						if (plots[i_plot].groups[params.data[i].group] === undefined) {
							console.warn("Group " + params.data[i].group + " not declared in params.groups");
							params.data[i].group = "default_group";
						}
					} else {
						console.warn("Groups initialised, but missing group property.");
						params.data[i].group = "default_group";
					}
				}
			}
			
			prepare_sizes(i_plot, params);
		}
		
		if (!keep_axes) {
			make_axes(i_plot, params, append);
		} else {
			if (plots[i_plot].plot_type == "scatter") {
				if (plots[i_plot].geom_type != "none") {
					for (i = 0; i < params.data.length; i++) {
						if (plots[i_plot].size_exponent == 0) {
							params.data[i].scaled_size = 1;
						} else {
							params.data[i].scaled_size = Math.pow(params.data[i].size, 1/plots[i_plot].size_exponent);
						}
					}
				}
			}
		}
		
		if (append && (plots[i_plot].plot_type == "surface")) {
			// To match how points get appended to an existing dataset,
			// the surface appending should be done in make_mesh_points(),
			// but the need to re-interpolate a bunch of z- and colour-
			// values makes it easier to just build a new params.data
			// object.
			
			plots[i_plot].scene.remove(plots[i_plot].surface);
			plots[i_plot].scene.remove(plots[i_plot].surface_mesh);
			
			var old_hide_points = JSON.parse(JSON.stringify(plots[i_plot].hide_points));
			var old_hide_mesh_points = JSON.parse(JSON.stringify(plots[i_plot].hide_mesh_points));
			
			var append_data = JSON.parse(JSON.stringify(params.data));
			var store_colors = true;
			var new_colors_null = false;
			
			params.data = {"x": [], "y": [], "z": [], "other": []};
			
			if (!size_checks.colors && !plots[i_plot].have_color_matrix) {
				store_colors = false;
			}
			
			if (!size_checks.colors && plots[i_plot].have_color_matrix) {
				new_colors_null = true;
			}
			
			if (size_checks.colors && !plots[i_plot].have_color_matrix) {
				plots[i_plot].have_color_matrix = true;
			}
			
			if (store_colors) {
				params.data.color = [];
			}
			
			var old_nx = plots[i_plot].mesh_points.length;
			var old_ny = plots[i_plot].mesh_points[0].length;
			var nx, ny;
			
			for (i = 0; i < old_nx; i++) {
				params.data.x.push(plots[i_plot].mesh_points[i][0].input_data.x);
			}
			
			for (i = 0; i < old_ny; i++) {
				params.data.y.push(plots[i_plot].mesh_points[0][i].input_data.y);
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
					params.data.z[i].push(plots[i_plot].mesh_points[i][j].input_data.z);
					params.data.other[i].push(JSON.parse(JSON.stringify(plots[i_plot].mesh_points[i][j].input_data.other)));
					
					if (store_colors) {
						params.data.color[i].push(plots[i_plot].mesh_points[i][j].input_data.color);
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
		
		var temp_obj = calculate_locations(i_plot, params);
		var plot_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
		
		if (plots[i_plot].plot_type == "scatter") {
			// The usual JSON.parse trick doesn't work on the Float32Array I guess?
			var null_points = new Float32Array(params.data.length);
			for (i = 0; i < params.data.length; i++) {
				null_points[i] = temp_obj.null_points[i];
			}
			
			make_points(i_plot, params, plot_locations, null_points, append);
		} else if (plots[i_plot].plot_type == "surface") {
			make_mesh_points(i_plot, params, temp_obj.plot_locations, temp_obj.null_points);
			
			var hide_loop_offset_i = 0;
			var hide_loop_offset_j = 0;
			
			if (params.append_axis == "-x") { hide_loop_offset_i = append_data.x.length; }
			if (params.append_axis == "-y") { hide_loop_offset_j = append_data.y.length; }
			
			for (i = 0; i < old_nx; i++) {
				for (j = 0; j < old_ny; j++) {
					if (old_hide_points[i][j]) {
						hide_surface_point(i_plot, i + hide_loop_offset_i, j + hide_loop_offset_j);
					}
					
					if (old_hide_mesh_points[i][j]) {
						hide_mesh_point(i_plot, i + hide_loop_offset_i, j + hide_loop_offset_j);
					}
				}
			}
		}
		
		update_render(i_plot);
	} else {
		// Not new dataset.
		
		if (plots[i_plot].plot_type == "scatter") {
			// Labels will stay the same.
			for (i = 0; i < plots[i_plot].points.length; i++) {
				if (plots[i_plot].points[i].have_label) {
					params.data[i].label = plots[i_plot].points[i].input_data.label;
				}
				
				if (plots[i_plot].have_groups) {
					if (params.data[i].hasOwnProperty("group")) {
						if (plots[i_plot].groups[params.data[i].group] === undefined) {
							console.warn("Group " + params.data[i].group + " not declared in params.groups");
							plots[i_plot].points[i].group = "default_group";
						}
					} else {
						params.data[i].group = plots[i_plot].points[i].group;
					}
				}
			}
			
			prepare_sizes(i_plot, params);
		}
		
		if (!keep_axes) {
			make_axes(i_plot, params);
		} else {
			if (plots[i_plot].plot_type == "scatter") {
				for (i = 0; i < params.data.length; i++) {
					if (plots[i_plot].size_exponent == 0) {
						params.data[i].scaled_size = 1;
					} else {
						params.data[i].scaled_size = Math.pow(params.data[i].size, 1/plots[i_plot].size_exponent);
					}
				}
			}
		}
		
		if (plots[i_plot].plot_type == "scatter") {
			if (plots[i_plot].geom_type == "point") {
				var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
				var sizes = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
				var null_points = plots[i_plot].points_merged.geometry.attributes.null_point.array;
				var colors = plots[i_plot].points_merged.geometry.attributes.color.array;
			} else if (plots[i_plot].geom_type == "quad") {
				var colors, null_points;
				var scale_factor = get_scale_factor(i_plot);
				
				if (plots[i_plot].have_groups) {
					for (i = 0; i < plots[i_plot].points.length; i++) {
						if (params.data[i].group !== undefined) {
							group = params.data[i].group;
							
							if (plots[i_plot].groups[group] !== undefined) {
								if (group != plots[i_plot].points[i].input_data.group) {
									plots[i_plot].points[i].material = plots[i_plot].groups[group].quad_material;
									plots[i_plot].points[i].group = params.data[i].group;
								}
							} else {
								console.warn("Group " + group + " was not defined in params.groups when the plot was initialised; ignoring.");
							}
						}
					}
				}
			}

			if (plots[i_plot].have_segments) {
				var group_lines = {};
				
				for (group in plots[i_plot].groups) {
					if (plots[i_plot].groups.hasOwnProperty(group)) {
						group_lines[group] = {};
						
						group_lines[group].positions = plots[i_plot].groups[group].segment_lines.geometry.attributes.position.array;
						group_lines[group].colors = plots[i_plot].groups[group].segment_lines.geometry.attributes.color.array;
						group_lines[group].hides = plots[i_plot].groups[group].segment_lines.geometry.attributes.hide_point.array;
						group_lines[group].nulls = plots[i_plot].groups[group].segment_lines.geometry.attributes.null_point.array;
					}
				}
			}
		} else if (plots[i_plot].plot_type == "surface") {
			var positions = plots[i_plot].surface.geometry.attributes.position.array;
			var colors = plots[i_plot].surface.geometry.attributes.color.array;
			var nulls = plots[i_plot].surface.geometry.attributes.null_point.array;
			
			var mesh_positions = plots[i_plot].surface_mesh.geometry.attributes.position.array;
			var mesh_colors = plots[i_plot].surface_mesh.geometry.attributes.color.array;
			var mesh_nulls = plots[i_plot].surface_mesh.geometry.attributes.null_point.array;
			
			if (size_checks.colors) {
				plots[i_plot].have_color_matrix = true;
			}
		}
		
		
		if (animate) {
			plots[i_plot].transition_t = 0;
			
			if (plots[i_plot].plot_type == "scatter") {
				if (plots[i_plot].geom_type == "point") {
					plots[i_plot].old_positions = new Float32Array(positions);
					plots[i_plot].old_colors    = new Float32Array(colors);
					plots[i_plot].old_heights   = new Float32Array(sizes);
				} else {
					// Quad or none.
					plots[i_plot].old_positions = [];
					plots[i_plot].old_colors    = [];
					plots[i_plot].old_heights   = [];
					
					for (i = 0; i < plots[i_plot].points.length; i++) {
						if (plots[i_plot].geom_type == "quad") {
							plots[i_plot].old_positions.push(JSON.parse(JSON.stringify(plots[i_plot].points[i].position)));
							
							colors = plots[i_plot].points[i].geometry.attributes.color.array;
							
							plots[i_plot].old_colors[4*i + 0] = colors[0];
							plots[i_plot].old_colors[4*i + 1] = colors[1];
							plots[i_plot].old_colors[4*i + 2] = colors[2];
							plots[i_plot].old_colors[4*i + 3] = colors[3];
							
							plots[i_plot].old_heights[i] = plots[i_plot].points[i].scale.x / (2 * scale_factor);
						} else if (plots[i_plot].geom_type == "none") {
							group = plots[i_plot].points[i].group;
							i_group = plots[i_plot].points[i].i_group;
							
							plots[i_plot].old_positions[3*i + 0] = group_lines[group].positions[3*i_group + 0];
							plots[i_plot].old_positions[3*i + 1] = group_lines[group].positions[3*i_group + 1];
							plots[i_plot].old_positions[3*i + 2] = group_lines[group].positions[3*i_group + 2];
							
							plots[i_plot].old_colors[4*i + 0] = group_lines[group].colors[4*i_group + 0];
							plots[i_plot].old_colors[4*i + 1] = group_lines[group].colors[4*i_group + 1];
							plots[i_plot].old_colors[4*i + 2] = group_lines[group].colors[4*i_group + 2];
							plots[i_plot].old_colors[4*i + 3] = group_lines[group].colors[4*i_group + 3];
						}
					}
				}
				
				var temp_obj = calculate_locations(i_plot, params);
				plots[i_plot].new_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
				plots[i_plot].new_colors = get_colors(i_plot, params);
				
				for (i = 0; i < plots[i_plot].points.length; i++) {
					if (plots[i_plot].have_segments) {
						group = plots[i_plot].points[i].group;
						i_group = plots[i_plot].points[i].i_group;
					}
					
					if (plots[i_plot].geom_type == "point") {
						null_points[i] = temp_obj.null_points[i];
						
						if (plots[i_plot].points[i].have_label && null_points[i]) {
							plots[i_plot].scene.remove(plots[i_plot].labels[i]);
						}
					} else if (plots[i_plot].geom_type == "quad") {
						null_points = plots[i_plot].points[i].geometry.attributes.null_point.array;
						null_points[0] = temp_obj.null_points[i];
						null_points[1] = temp_obj.null_points[i];
						null_points[2] = temp_obj.null_points[i];
						null_points[3] = temp_obj.null_points[i];
						
						plots[i_plot].points[i].geometry.attributes.null_point.needsUpdate = true;
						
						if (plots[i_plot].points[i].have_label && null_points[0]) {
							plots[i_plot].scene.remove(plots[i_plot].labels[i]);
						}
					}
					
					if (plots[i_plot].have_segments) {
						group_lines[group].nulls[i_group] = temp_obj.null_points[i];
					}
				}
				
				
				if (plots[i_plot].geom_type == "point") {
					plots[i_plot].points_merged.geometry.attributes.null_point.needsUpdate = true;
				}
				
				if (plots[i_plot].have_segments) {
					for (group in plots[i_plot].groups) {
						if (plots[i_plot].groups.hasOwnProperty(group)) {
							plots[i_plot].groups[group].segment_lines.geometry.attributes.null_point.needsUpdate = true;
							
						}
					}
				}
				
				update_points_input_data(i_plot, params, plots[i_plot].new_locations);
			} else if (plots[i_plot].plot_type == "surface") {
				var temp_obj = calculate_locations(i_plot, params, !change_colors);
				
				var plot_locations = temp_obj.plot_locations;
				var new_null_points = temp_obj.null_points;
				
				var array_obj = make_mesh_arrays(i_plot, params, plot_locations, new_null_points, false);
				
				plots[i_plot].old_surface_positions = new Float32Array(positions);
				plots[i_plot].old_surface_colors = new Float32Array(colors);
				
				plots[i_plot].old_mesh_positions = new Float32Array(mesh_positions);
				plots[i_plot].old_mesh_colors = new Float32Array(mesh_colors);
				
				plots[i_plot].new_surface_positions = new Float32Array(array_obj.surface_positions);
				plots[i_plot].new_mesh_positions = new Float32Array(array_obj.mesh_positions);
				
				if (change_colors) {
					plots[i_plot].new_surface_colors = new Float32Array(array_obj.surface_colors);
					plots[i_plot].new_mesh_colors = new Float32Array(array_obj.mesh_colors);
				} else {
					plots[i_plot].new_surface_colors = new Float32Array(colors);
					plots[i_plot].new_mesh_colors = new Float32Array(mesh_colors);
				}
				
				plots[i_plot].surface_mesh.geometry.attributes.null_point.needsUpdate = true;
				plots[i_plot].surface.geometry.attributes.null_point.needsUpdate = true;
				
				for (i = 0; i < nulls.length; i++) {
					if (nulls[i] && !array_obj.surface_nulls[i]) {
						// If the point was previously null, have it
						// immediately appear at its new location.
						plots[i_plot].old_surface_positions[3*i + 0] = plots[i_plot].new_surface_positions[3*i + 0];
						plots[i_plot].old_surface_positions[3*i + 1] = plots[i_plot].new_surface_positions[3*i + 1];
						plots[i_plot].old_surface_positions[3*i + 2] = plots[i_plot].new_surface_positions[3*i + 2];
						
						if (change_colors) {
							plots[i_plot].old_surface_colors[4*i + 0] = plots[i_plot].new_surface_colors[4*i + 0];
							plots[i_plot].old_surface_colors[4*i + 1] = plots[i_plot].new_surface_colors[4*i + 1];
							plots[i_plot].old_surface_colors[4*i + 2] = plots[i_plot].new_surface_colors[4*i + 2];
							plots[i_plot].old_surface_colors[4*i + 3] = plots[i_plot].new_surface_colors[4*i + 3];
						}
					}
					
					nulls[i] = array_obj.surface_nulls[i];
				}
				
				for (i = 0; i < mesh_nulls.length; i++) {
					if (mesh_nulls[i] && !array_obj.surface_nulls[i]) {
						plots[i_plot].old_mesh_positions[3*i + 0] = plots[i_plot].new_mesh_positions[3*i + 0];
						plots[i_plot].old_mesh_positions[3*i + 1] = plots[i_plot].new_mesh_positions[3*i + 1];
						plots[i_plot].old_mesh_positions[3*i + 2] = plots[i_plot].new_mesh_positions[3*i + 2];
						
						if (change_colors) {
							plots[i_plot].old_mesh_colors[4*i + 0] = plots[i_plot].new_mesh_colors[4*i + 0];
							plots[i_plot].old_mesh_colors[4*i + 1] = plots[i_plot].new_mesh_colors[4*i + 1];
							plots[i_plot].old_mesh_colors[4*i + 2] = plots[i_plot].new_mesh_colors[4*i + 2];
							plots[i_plot].old_mesh_colors[4*i + 3] = plots[i_plot].new_mesh_colors[4*i + 3];
						}
					}
					
					mesh_nulls[i] = array_obj.mesh_nulls[i];
				}
				
				update_surface_input_data(i_plot, params, 0, 0, change_colors);
			}
			
			animate_transition(i_plot);
		} else {
			// Not animated -- immediate update.
			var temp_obj = calculate_locations(i_plot, params, !change_colors);
			
			var plot_locations = temp_obj.plot_locations;
			var new_null_points = temp_obj.null_points;
			
			if (plots[i_plot].plot_type == "scatter") {
				var new_colors = get_colors(i_plot, params);
				var color_obj;
				
				for (i = 0; i < plots[i_plot].points.length; i++) {
					set_point_color(i_plot, i, params.data[i].color, true);
					set_point_size(i_plot, i, plot_locations[i][3], 2*scale_factor);
					
					if (plots[i_plot].geom_type == "point") {
						positions[3*i + 0] = plot_locations[i][0];
						positions[3*i + 1] = plot_locations[i][1];
						positions[3*i + 2] = plot_locations[i][2];
						
						null_points[i] = new_null_points[i];
					} else if (plots[i_plot].geom_type == "quad") {
						plots[i_plot].points[i].position.x = plot_locations[i][0];
						plots[i_plot].points[i].position.y = plot_locations[i][1];
						plots[i_plot].points[i].position.z = plot_locations[i][2];
						
						null_points = plots[i_plot].points[i].geometry.attributes.null_point.array;
						null_points[0] = new_null_points[i];
						null_points[1] = new_null_points[i];
						null_points[2] = new_null_points[i];
						null_points[3] = new_null_points[i];
						
						plots[i_plot].points[i].geometry.attributes.null_point.needsUpdate = true;
						plots[i_plot].points[i].geometry.attributes.color.needsUpdate = true;
					}
					
					
					if (plots[i_plot].points[i].have_label) {
						set_label_color(i_plot, i, params.data[i].color);
						
						if (null_points[i]) {
							plots[i_plot].scene.remove(plots[i_plot].labels[i]);
						}
					}
					
					
					if (plots[i_plot].have_segments) {
						// If points are connected, then the groups shouldn't
						// change; irregular behaviour will results if groups
						// _do_ change.
						group = plots[i_plot].points[i].group;
						i_group = plots[i_plot].points[i].i_group;
						
						group_lines[group].positions[3*i_group + 0] = plot_locations[i][0];
						group_lines[group].positions[3*i_group + 1] = plot_locations[i][1];
						group_lines[group].positions[3*i_group + 2] = plot_locations[i][2];
						
						group_lines[group].nulls[i_group] = new_null_points[i];
					}
				}
				
				if (plots[i_plot].geom_type == "point") {
					plots[i_plot].points_merged.geometry.attributes.position.needsUpdate = true;
					plots[i_plot].points_merged.geometry.attributes.null_point.needsUpdate = true;
				}
				
				if (plots[i_plot].have_segments) {
					for (group in plots[i_plot].groups) {
						if (plots[i_plot].groups.hasOwnProperty(group)) {
							plots[i_plot].groups[group].segment_lines.geometry.attributes.position.needsUpdate = true;
							plots[i_plot].groups[group].segment_lines.geometry.attributes.null_point.needsUpdate = true;
						}
					}
				}
				
				update_points_input_data(i_plot, params, plot_locations);
				
				if (plots[i_plot].have_any_labels) {
					update_labels(i_plot);
				}
			} else if (plots[i_plot].plot_type == "surface") {
				var array_obj = make_mesh_arrays(i_plot, params, plot_locations, new_null_points, false);
				
				plots[i_plot].surface.geometry.attributes.position.needsUpdate = true;
				plots[i_plot].surface.geometry.attributes.color.needsUpdate = true;
				plots[i_plot].surface.geometry.attributes.null_point.needsUpdate = true;
				
				plots[i_plot].surface_mesh.geometry.attributes.position.needsUpdate = true;
				plots[i_plot].surface_mesh.geometry.attributes.color.needsUpdate = true;
				plots[i_plot].surface_mesh.geometry.attributes.null_point.needsUpdate = true;
				
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
			
			update_render(i_plot);
		}
	}
}

var point_type_src = function(point_type, custom_point) {
	var image_src;
	
	if (point_type === undefined) {
		return image_src;
	}
	
	if (point_type == "sphere") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAAAAADmVT4XAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAJ0Uk5TAAB2k804AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AABGQSURBVHja1VtdS1zZEvXn5D1vPuXlPuRB8EEQQQiNSBAJooRuFIUI8QNEbdEWxQ/ED1RERIKGoGIQwyCKKEpQDAbJkBDChAxDmJAw3FtrVe199uluNRqT4RZMkp6XtU7Vqjr7VNUuKPi/tVve/k3s0H4F8u04+G21X8cijitWWHg7tJ/MIQIvVLvjTH8GJH4SegRO2P+EZjx+FgcHb9gCeNdbkfsHWRgJUrgxEgav6MQuEiuOGf6PkYg43Bi6wiu4IpeUlJQGJj9LlIbjcGMUQnhBB3ZpaVlZeXn5vcjkV3kZaXgOQSRuAt6h47nLAJ1IVFRUVIrdl//knxUJ0igrNQ6Owo8xyIFX9ASg74tVVVWbVd0XIhWJxD31hHAQN3gKP4avoSe8ogNbkB88eFBTU0urqamRX2RBT5TFKFzbCQpfGMITHdg1tXV1D2HJZJJ/P6yrq6utAQlwcBQgx2s7weND9wpfiUd/QOxkPazBmfw7lQSLWuUgoXAUzAnXwHfRB7z4Xh6e6A+TKUFuEnsUmfxqBA2QEA6gcC+icJ0wRI9fXCxPD98ren1Do0A3PxZraWkVaxGTH83NoCEcUsJBKTAQ13RCgF8izic80eWxmx+3tLa1t3eE1t7W1io0moVDI4JBCgl1wjUYROGn9xMBvKJ3dHZ2dXene9TS6e7urk6hARLCobGhXilUKIWiu3fuXImBZZ89fqLifhWcb/CC3tEF7N6+vkwm0w/LZPp6hUe3kGgXDhILUKh9UIU4uDB8P4MAv7TMPX6qXuEVvbdPkAcGBweH1ORfA/3CIg1PtNENDamHdTWIQ3nZFRl4/GKHX1OXrG9segT4zi6gA3toeHhkZNRsZGRkeHhISIgnxA9trUKhkXGoEiWUlV6FQfz5KyrF/Q9TDQbfnSb60LBAj42PTzgbHx8fGxsdUQ6g0N76GHGgExCGiMH36V/xRf10vzx+82OFzxAd2JOTU9PepqamJicnxsfEF0ODQiHdJYGQONQnr8wgGx/ul8dvbe/s7hF4PLuAC/bM7OwcbV7+m52dnZmZniIHpdDdqU5IiRavwgABCPHp/mbxfheefsjQZ2bn5sUWYIuL8gd+CQ3lIKEQCuqEXAaXyAD4hXeQf4Zf3yiPL943eKDPAXpxcfEJbGlpSf6UX4tgAQ6kMDSQ6VUnNIoQPANUpAsJWACQ/4Yv7pfH7+nrHxoGPJ59AdhLy8tPxZ6JyV/Ly8tLT5QEKYyNwgk9XR3KoDZgcGEQfAIqvoa/raO7p08ef2xictrgl5YFeWV1dXUNJn+vrKw8eyocnjgK6oSe7o42EYIwgBJRDy6RgQkg6/kdvjz+/Dzgib62tr7+XGxjQ/5YX19fW1UOSmFqYkyUIGEAg8aIgcngQgfcLRL8hOif8Qe+hF/cj+Dz6fHsa+uCvLG5ufnixYtNmPBQDqQwRyeAQbqznQwkGxOXBcEyAAmQkPpTl2qA/rocPh4fzl8B+vMNQP8WGXiAA9wACrPTUxPGAD5IPURNBIMLghALwIO6ZEOT4Yv84P6FRcSeD7+p4FtbW9vb21swktjchBvEC4uL4gQy6LcopCQVKi8OggtAcSkCAAE0B/hwvwR/ReEBLtA7Ozu7uzs04UEKjMQzcYIoQYTgddCgMrgoCC4AJQgABdDS3pnuE3yRH9y/bPBEB/Tu3t7e/v4ebdc4kAKdsOAYMBubIhmc44JAgQhASgQY4MP9z1b16eXZd3YBfSB2eEADD3GGURApiBKMwQCKYkszg2CZkNcFgQIlABBAG/El/Rh+Ed+6whP94PDw8KXY0UvaoRABB1Igg2dkMD0xOiQMIMSGZN1FLggcIBmgAuju7R8aJT7d/xyxB7w8+uHLo6Oj4+Pjk5Nj2tEROOwHDFQI4oPRIQhRg1BVea/8HBdEDmAAmh61dHQRf1rxxf2bDh7oAn3y6tWr01c08AAHpSBh2HguUVgig/ERyKC95VGTBiG/C0IHSAZIBZAAZAaHxyZn5uh/Pv+W4ANenvzV6enp69evz17TToUIOCgFcYIxECXOTIoQ+9KaCee7wDtAFShvYAuAOGDxieCvbwT48uyCfnb2xtnZmXEABWOwvgoG83PTwqC/FzpUF+RXAQmYAyQFzQEj45NIAAQgjn8q6AL/uzfl4BnsKAMvg8EMSjLfSqhGrAUxAogAiiBSQGpgY6QAKUASAAhga1vxT4hP9LeRkYNRONiPGCwuzCEIA32iQ62HSAQph/EYuAiwBkgKyDso3ScOkAogBUgF4PDp/TdAfwd7LyZ/kYJ6wTHYVBloLvb3dLVpIqAW5MTASbAcEkw2SA3s6lEHiAI1ANs7Hh+PD/j37z+okYNQMCdIGBwDVgPngha4ALVAZMh6HM8BH4EUaoA6YJYBWKMA9vY9PuDfA/4PNXIQCnCCZ7DNINAFmoqddIFmYtYrKciBKkowcoCUgDUIYGfX8M+A/87QP6qRg1AwBtTBHhmsrUCHdAESwTIxJwYuB+Q1VA0JShHsG3AOkABIBdrdP1B8RP8d4QX5kxo5CAWG4YxKPNzfYxBWnzkXSC2QchjGwBOIRYAS7OzJDI2pA0SBKgCHz8cH/KdPf5qRg1BgGN6YENUF6ytPnyzMqQw1E7UUxGpRLAKQoBQhc4CUAAZABMj4Ex/wnwD/lxk5CAWGgTKAC3bNBct0gY9BLfIgXot8FUIEUo2QYGZQFaAKlAAcHh1H+B8N/bMZOQgFMoAMvAuQisvqAsYAb+XqHBEoAZxE5CjuIjCKIigEJAWZAeIA0b/hA/7z57+dkYNQEAYf3qkMjpmKmggqwyHLA9aiuAi0CuiLEBJgDshraJ41QCPw8vhEEvD3t5CfEFD8L2bkIBSEwR/IBWQCXBCTIWKQI4IsDZIAkrB3YFhzgBJgChxTgeaAAP+rGDkYgw8MgrlgW4sRXknIg25LRK0EMQJRFaAGXRJaDqgEgggIAeJ/VfsSZ8BMODmStxJjYCKQWpTG+yBZi0oQqjBKgsqqWr6IUAYDDaoEGIF3H5B/f5oDvn4NGUgUqAMGgS5gDEwEkogigla8k7NVaAT0LOKTYJIEUIW2tAgwB8wBMfxvURBUiCwGkggWA4oAKuw3FUopir2SoyxkEjRrGQo0uLuXLYGIwDcx9UFuDF5qDCiCWRxLzkmDIAsfMAslCYbHVINrqkEvAa0Bfzn8b2rGADFwMsQbQfMAIlhciKdBXgJBFrokCDToktA5APjfvF1CgNV4fIQEHvk8zE9AjqOaBDgKLFsZogTCCPwdEPjHMaAIlMDbPAQmLA8vJYAsdEngNeiS0OWgx/9HTBmYCIzA2QUEanwlyhcC84AjoBIgAU3C0AH/mCkBF4NzCASVKD+BEq8BvgsjDxgBJqEWgSx8x8CJQAm8ujqBRK4InQayPCAEHP5//xsRcCI4h8BAPATnpqEQ6PdZwEJoInQaQAi8B0iADBADVwhyCUwhCy4UYZ46gPNglIZBITQGzgvfsjzw3mpxDoGuDk3DxHkE3HEgehu7QnQSi8Hn89IwyIKAwLIncEEhKlICqVgp1jTYcaX47bt4JXIcvhp+VIjO/Lvghb6Pg0qopbgoH4FKI5DODLkTmS8EjEH8bRy9i75+iRVCdUD2y8jeBXYuzibA77I8R0KmQRCD+HngS563cVYl3tSPE76O5SM936FQT0Q8D1TX8qtAzgOj7lAenEnDI2F4ItN3cYT/NoyAP5DoqRQHkuqsA0lBcCSr8bV4PJYGLgZxBsZBD6Z4F7uXcRSBSAJ5j2S3Cs6rRCPBmdBEEMTgU/xUbMfiT84Bb+xcHh5Kx4azXobRmTBS4b3KvGngv0vO3sQZGIfPHt+OQ+qAmASyziOl8WN5eCZL+hhkiyCIwcf4h4l9mXz0DoAETQLRh0mGHybJutwmSaxB5M/lWS546b5MQgbK4a8s/LM8ERi3DoF9Hud8msXaA4+jROShaNN/HL8+i3yAT9Po21Dx9aMgdADrsERg1B1J832cBirUROSXgR0Ln2p/RBmcOgb2faofyPqFrt/nEb4pwH+eMwL5P89DEViDotN3aFyDAg2SYydE3yAQT1iL4oN9nLtv4z3XJbIeTT9fhVYF8jQoNAbsEtZri8Yy8QmblAGD10YBDaKoRfPBtWi0PeG6A+oASjDWosnuUsVeiCnGAF26SXTpln2TKmBgXSJtU2mjzHeIDH/LfZuLAyDBtPbp8japYl9nUgybXJ8ycEHYpjtzfTJvQZdOG4XbuW26dtevztemsxi4Q4m2yiUTrVG5FjQqjz0F36lkr1TbtdBf2KhUB/A01tocNipzW6W+We/6ZBntVGqvHJ26gAGblTDt077x8NqvBr53wNQ4v0tZhlWCORGIBlalTgVwAaYV3gXWLEY2Hp+4brU3NsxPPP62x2cRHMZpsPWyZrUf2MAFYbM23q7fd/16a9hrt97grVW9/ZsIgC8B1ylOu8HVuROL2MSmTl4IqAVehzqwiBgYhVdkcWoji2BigedHBooA/MCi+cKBRSRDuIA6tIb5OEdGwkB9sM2evVLA1MTMBiaQX3xckT2ySZw3sskaWiEI4dCIUYASKcV9zKwwNeLgSP7A2OrAjYwwNltdiQZ3GFq129DqXAd4FRQHYzuOzYbc2O6phcHPzQ4wOVM7ILqN7YLB4fTEGAPARvlDPzvNP7mMTY6hQzTtbXCHwZENLpWCcNCxJW3PhoacGrrRqcPv1wzgBD2Y2p0/uSzW2X3SRrc2urTRLSfHnNxieMrRLYe32350ixm6m19Pjo2YABAAKrDkgvk51zdUh5X3dXiO5YnMIHYnZrC6ACcEw2tOrTm81gE6ZvhuhD8/F+Hb8Lrq0uG1258o5bnA1gdsfJ07vt8MxvfYIvAbBMtug8D832YLBJeO74P5ucsELjD0RgsMC7q+gQUGbjBsbNr2wsZzQbclikXih6NzL4AS3Wu7aIWCOzwlngE2eHSDJljhEAorusOxzjUOLHAQPdrh4ALFAPSv+HXxFY6LdzjiSyQtWGHiEok6QSlwiwVrLOIMW2IBuu5vYHtCwj/Q5/BVgGWlly6x5FnjaQzXeCa4xqOLNEvLtsXjNnmAHsJnetNc42m6whqPrZHcCRepwkUmbPI4CotcYhJfLC9zmck2mYItou5Oh18tFShYpSoouIxBuErmV7n6SEG8YJtc3KYyW3BrVFOEt8dvb/ErPIny713pu2iZjRRGyUF32ebNdJtNl9lGBF4f362S6TpdyVXX6bhNmrXO18N1PnKYmJziOt+MGPf5Jie4Sjc8OJDhOh+X6aJ1vu/Gz2GQvdCYsYXGsfhCo+0zDvYTXh7/cXMT99iqrrrQmB0Fv9LZbBTClc4Rt9E5rBudWG7t7urAWiken/KL43/XWmuMgS6VBkutyiEjnsBWKxZbBwcHBgb6iZ728H6p9YorpS4VYmu91VlrvcJBSOheL6yvr6+X4F3cJm22dVK4/+pLtQGDfIvNjx4bB24203rS3GzGajM2m3Wx2W2YX2OtOIpCod9sVyWQAvfKW9p0t7vTjMvdXKt+hNVut+DuHv/q+DnL7ffccnuq3u22t7S0tpm16nq7Lrcn4fzq+9Fe9zU3/G/peqk5QSlUIRK4WtBgy/3Nam6/n2vttYSvdPDq/uvcMIg23AMK4oaaWpBI8XpDI03vN/CCQ3DJ4kcvOEQM7mRd8RA/4JZFnV7wsCsedsND75ngckNpsY/+te+5RJdc7joK5FAZXnKpoeGOi7tqk+eSy7XgvRNyr/kk7JrP/Spn+BHd83HwP/T4oRNux69ZlZOEu+lEczed7JJRkd73uomrVvGrXkV22ao066oXsXnXK37d7Gau/eW77GZX3cpg7rabXrm78ctuBeF9u/C6X3HOdb/gzuGNOD+PF24XOhLuwmNRcN0x58LjjVr8wumd7Duf/u7pT7x2Gl64LYxfe8259PrTbt7Gr/0WhsDB/eOfhR5yiF8//sXXr8+7+v3L76DfKvjXoG/S/gfIBEis58sQTgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wOS0yNlQyMTo1Mjo0MSswODowMP+1LUcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDktMjZUMjE6NTI6NDErMDg6MDCO6JX7AAAAAElFTkSuQmCC";
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

var check_webgl_fallback = function(params) {
	// https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
	var canvas = document.createElement("canvas");
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (!(gl && gl instanceof WebGLRenderingContext)) {
		var div_html = "";
		if (params.hasOwnProperty("fallback_image")) {
			div_html = "<img src=\"" + params.fallback_image + "\">";
		} else {
			div_html = "Sorry, you do not have WebGL enabled.";
		}
		
		var div = document.getElementById(params.div_id);
		div.innerHTML = div_html;
		
		return false;
	} else {
		return true;
	}
}

var basic_plot_setup = function(i_plot, params) {
	// A variable for possible use in the touch controls.
	plots[i_plot].old_t = Date.now();
	
	// First up, preparing the area.
	
	plots[i_plot].container_height = plots[i_plot].parent_div.offsetHeight;
	
	plots[i_plot].scene = new THREE.Scene();
	
	plots[i_plot].container_width = plots[i_plot].parent_div.offsetWidth;
	plots[i_plot].renderer = new THREE.WebGLRenderer({"antialias": true});

	plots[i_plot].renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	
	plots[i_plot].make_toggles = (params.hasOwnProperty("show_toggles")) ? params.show_toggles : true;
	plots[i_plot].make_snaps = (params.hasOwnProperty("show_snaps")) ? params.show_snaps : true;
	
	var toggle_div = document.createElement("div");
	toggle_div.id = "div_toggle_scatter_" + i_plot;
	var div_html = "";
	
	if (plots[i_plot].make_toggles) {
		var camera_img = "iVBORw0KGgoAAAANSUhEUgAAAEYAAAAeCAYAAACR82geAAAABHNCSVQICAgIfAhkiAAACqxJREFUaIG1mXtMW+X/x18bp3BaoDdoy6WMi+ACKFvGgjMOxKH8MzGazWnSRCf/bJlhmmmyiS5AUpdMk8WBmWbRZV7mH/qHMzMadTPMSwzGxIBjMTIHHYVCabtS2tOylpzfH/x6HKOFtdv3nZykfc5z+ZzP83k+l/ez5plnnpFNJhPRaJRIJEIkEkEQBEKhEBkZGczPzwMgCAKxWIzs7GxisRiiKCIIAgAWi4ULFy6QlZVFVVUVkUiEWCyGIAjk5OSQl5dHeXk5FRUVlJeXYzQaycvL425BkiR8Ph8+nw+Hw8Ho6ChutxuPx4Pf7ycUCrGwsEBGRgZZWVnMz8/zxx9/8Nxzz9HV1YVGo1k25xqz2Sw3Njby7LPPotVq0ev1iKKIWq3GaDQCoFarlw2WJIlwOEw4HAbg0KFD5OTksH37diYmJpiensblcjE9PY3X62V2dpZIJEI0GmVhYQGHw5Hyh09OTnLt2jUmJydxu93Mzs4yNze3bCO0Wi35+fkUFBRgtVopKCiguLhY+Y6hoSG6urooLy8nGo3S3d29bKOExx57jLKyMs6fP8+jjz5KIBDA4/EQDAYJhUJIkkQ0GkWSJGKx2JInbjGiKPLnn3+i1WrR6XSoVCo0Gg01NTU0NjYq7aIoYjAYeO2111KyiNraWh544AFEUUQURfLz8zGbzWzcuBGz2UxhYSHFxcUJdz4RjEYjVqsVu93OO++8wyuvvMLrr79OVVXVf4qJRCLY7XY6Ojro7e2lqakJlUqFSqXCYDBQWVlJVlaWYk0GgwG1Wq08cWEOHDhAUVERr7766qqCiaKYkmJEUSQnJ4eDBw8uET5dhMNhXC4XGo2Gzs5Ozpw5w+HDh2lvb6e1tRUAYWFhAYAtW7agUqmw2+13vPBqiMViKfXfsWMH1dXVHD58mH379tHU1HTHMszPzyNJEhqNBpvNRklJCSdPnmRmZgabzYYQ76DVapEkKe2FVCoVOTk5dyxwIoyNjWG32zGZTPT29jI+Po7NZkt7PqPRSHFxMfCf/9Lr9WzdupV3332Xn3/+GSEjI4NwOIzFYiESidytb1kR8Uh3u4jL1draSnl5OT09PTgcDjo7O1cd6/V68fl8jI6O4nQ6lch1/vx52tvbgcWIKwgCubm5bNiwgYGBAQRBEPD5fBgMhpRNPB3EnXgqyM/PV35XVVVx/Phxuru76ejoYP/+/Vy/fp1r167h8XhwOp2rRquqqip+++039u3bR21t7RJf6XQ62b17N0JWVhYul4va2lpisZhy7v5XiIf3OEKhENnZ2Su23WrJeXl59PX1sXfvXnbt2sWGDRuUaKXX66murqakpITCwsKEOZMkSfz+++/U1tYue6dWqykoKEAQRRG3283mzZsVwdNRjMlkUs7tSrhVMTabjd27d/Pkk08C8OWXX/LRRx9x9uxZpY/b7U44V2NjI5FIhNOnT6cs70r+0OfzsTY3NxePx4NGoyF+rNJBZmYmWVlZq/bz+XxK/hMIBOjv72fbtm3K+5aWFvr7+wkEAkpbso0ymUxYrda05J2enl62SXEEg0HW5ufnK8oQBIHr16+ntdDtIhKJkJGRAcC5c+dobm5Gq9Uq77VaLQ8//DDnzp1T2vR6fdL5pqam0pIjHnRuhVqtxmw2s9ZgMDA7OwssKsbv96e10I0bN24r2vj9fiXB+/zzz3n66aeX9dm1axdffPGF8n98fDzpfMFgMGVZNRoNhYWFqNXqpH3WFhUVKYpRq9VLTDgVTE5O3tbYQCCAIAgEAgEuXrxIW1vbsj5tbW3LjlMi6PX6Fa1pJczMzCR1G16vl7Vms1nx+jqdDo/Hk9ZC0Wj0tvoFAgFEUeTChQtKHXUrtFotzc3N/PjjjwAUFhYmnCvV0uJmzM/PJ83b1Go1gl6vV/IKjUaTlmmmgmAwiE6nA+Drr79mzZo1Sft+9dVXyLKM2+1OmEZEIhGmp6fTksNisSRUrEajWfQxxcXFSv5iNBpT8jGSJOF0OhkaGmJsbIy5ublVxwSDQTQaDS0tLeh0OmZnZ5Fledmzbds2vvnmG2B5iI9DFMXbioTJkMxiXC4XQtwBhcNhcnNzE9ZLXq+XiYkJ/vnnHyYnJ5mYmMDr9SoTi6JIdnY2/f39bNq0iYaGhqTCSJKEXq9fEn1urXtGRkYYHh6mpaUFICmpZTQaMZlMq2sgAfx+/4pGIMTzl3///Zf5+XlGRkY4deoU4+PjuFwuhdUTRZHc3Fzy8/NZv349lZWVVFRUYDQaFRP//vvvOXbsGDt37mTnzp0JF5QkiYqKCuC/6HOrYj788ENeeOEFMjMzV/y4OH2QTra+UoJXUlKCAIspeGdnJ5mZmYyOjnL16lWsVisPPvhgSlRka2srBQUFvPXWW4yNjSXkZqLRqOJw29raePHFFwkEAkrbjRs3OH36NL/88osyxu12J8zI1Wo1cdokVRQUFCR95/f7WQvw0EMPUV9fz8mTJ6mvr8dut7N3715aW1upqqpKiZ+tq6vj+PHjOBwODh48uOxohsNhRQm3Rh+AH374gdraWiorK5W2ZLurVquxWCy3LdvNcDqdzMzMJHwnSdKixbS2tnLkyBGAu1JI5uXlcfToUd5++20OHDjAG2+8oaTusVhsSe7x2WefLVlr+/btbN26dcl8ce45EZJF0Tjd4HK5FLfg9/vxeDxEIhEGBwcRRTEhr2M2mxcVU1dXhyiKXL58GUEQ0i4kb4ZGo6Grq4tTp05x6NAh9u/fT0NDA7FYDIPBsKTfrYiH8zimpqaWRKY4ET88PMzff//NBx98QDAYxOPxEAgECAaDCt0Q9406nQ6r1crGjRtZt24dBoOB3t5eOjo6lpHhoiguKgbg3nvv5aefflIKybt1vdHe3o7VauXYsWNKlrtSKp4IXq8Xu92OSqVibm5OIeNh0R+MjIxQWlrKfffdh9VqvW2/2NfXx5EjR3jppZfo6upS+GSPxwPy/2NgYEC22Wzy888/Lw8MDMh3GxcvXpSbm5vl+vp6ORQKpTR2z5498pYtW+T33ntPHhwclMfHx+VQKCSHQiF5z549ssfjuSPZPv30U3nHjh3yd999J8uyLNtsNlmxmIaGBgRBwOv1pl1IxiFJEpcuXeLSpUtcvXoVp9NJLBbDYrHQ3Nyc8jF9//33OXPmDN9++y01NTXU1dUp60xMTNyxhcfJ8BMnTjAzM0NZWdl/RwkWj9PZs2dTKiQlSeLKlSv89ddfXLlyhfHxceU202KxsH79ep544gnuueeeOxbeZDJx4sQJhQzXaDR3lPnejKamJgoLCzl69Ci//vrrUsU8/vjjfPLJJ0kLyfgODQ4OMjw8rHh6QRAwm82UlZXxyCOPJKQM7wbiZPibb76Jw+Hg5ZdfXpU+SPYNLpcLt9ut3GrGo1X8WSPLsnzzwPvvv5/m5mb6+vpwOp1cvnyZoaEhHA6HQmIZDAZKS0upq6ujpqYmbRYtXXi9Xrq7u1GpVIyOjtLT00NdXZ0SrSYmJpiamsLpdDI1NbVqtDKbzRQVFbFu3TqKioowGo3LFfPUU08xPDzMpk2bCIVC6HQ6ysrKqK6upqGhIaWr0P8lJEmip6eHjz/+mM2bNyuX9fHL++zsbPR6vXKdW15eTmlpKUajcUkZkwz/B3DYwIm7wcjLAAAAAElFTkSuQmCC";
		var grid_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAFlJREFUSInt17EKgDAMRdFc8f9/+TkJHQQ7xATiu1vJcIY2Q5GkaOjoQLdgIH22BX+V4fkw9x6/vcLMJMW5Hp4C0mcRf7xjw2V5ncoyPB/2OpVleD5M16ftAqB5QSpf4rrTAAAAAElFTkSuQmCC";
		var ticks_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAEVJREFUSInt1iEOACAMQ9GWcP8rF4XDkkH2J2eeaLLOSaKCGRUoMDAw8J+wJZXc6rk7wrZOfXFr3y/jfrD5QICBgYGfhxcjRRswVeMTTgAAAABJRU5ErkJggg==";
		var axis_title_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAylJREFUSIntl1lIVGEUx8+dscywlVa1IgtboE1L2mibssKQ1okgiDasB5MKw6BArLCCgihaqV4iWqCHNlqwoGyhqDAL2yyCFCptuNmMTc69vx5G8nN0rncs6qUPzsvl3P9vzv+c+b7vagDyD5bjX0D/g0VEpOZBlsRpmmgW0XdjsXxXX6ouFHe7cPkOcZ3XG4GdeXl5eeoDTQzxebxiBHQp//RN1MnrkJIhC2alS0bGdBmXGFv/qzVNzNoaiYrV5NPrCvHW1ZSQ4hJX2lyZPztNRnSJakgm3DK/cnd9IiLyK4bvKOV72BfA1IvI7hXMjVtxhUojfG54MGDqt8jqXQ8W52h2v/Q3nWxUcmVlfDAvKYe7umklbQ0GE09hJnFK1VFj9/CqETtA+al5dBRBHCkUPPVZyzYPBowqri7rrljeivF7X6Oy/W8OMKWNIBKD62AZP5oVtQMGjM8XWdxFsbz1BPaX1cn7itma7EBE6DTvNOUBO4o2wWDw8ZybTorl0ZMO8tavU7Suf/BZ/EquWk1Ty8BAoILTs9srlkczcvEMuoogMoAN975iPU4tBQOBDydIj5UGfzERJ6O2l1ATiVCkYKjl/bE0YlRw31yeREqNHAz4S9k2SK24G0suV2K/uy0CG1RdzyRBQuzusZxrXyJDR9bjijMs6ByEdR+W0ACesPomngimyz74RxmHpsYgIjhTd1Diec72ZE2B92HNbd32ZNsE+3hakIJDBGk7jcNvg5uHrzifIarlieu5V20PbQNsot/JIUkEkc64z1ZQvzl5ebRpYAPLk3If8u1PgI3Pl1nWs66PmdeoCpkhs/o+Of3UYRvM5sfe3wTXfuDknA5BwYG53G/SRhO9KJs+quVDt1DczAFlAfbzat9EokUQZyo7n1nsEqaHG6vilao1RhQ8t7w0hAV7n+QzXBNE2jDZxlFnVF5gYUelakcqu16EuTQ0BS49ksX8yUPp4awX6TXJzdJV2Ww6WkJo9/zvzpKftZxF6cnBi4AaMb1Jnupm7fGXjapvBD7vcoQcAkqMOcHHkDZXFy6kXbj8umg18xJ6CEeD/58wf2f9BL0fPYwPEcFvAAAAAElFTkSuQmCC";
		var box_img = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAE9JREFUSInt1zEOACAIQ9FiuP+VcSKRxFFh+Z0Iy4ud0CIiNJA1gUqS52BmLWAW7Lflr5yPG6saGBgYGBgYGBgY+H3KXd111Be4+ws1VvUGpBoNQFww7NMAAAAASUVORK5CYII=";
		
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
	
	if (plots[i_plot].make_snaps) {
		var cube_back_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA4BJREFUSIntl0FoWnccxz+xSY0aGuOrJE43kxQZdEtKd5ARhjAC0qx4KDwvenQghJGMHcty6CE59TBCGHgwh0A8VE8RlpFTCb3MHUqX2zw0TXza2DxNYXvRWPjvoCYmamJXb9sXHjz+/N7383/v9/s+3usRQgg6ksr2tkIs9oqtLQVFOaBSeYsQFcAIaJjNb0ilfsDlcrd06L24oGkqz54pPHnyiqdPFRSlQLmsNZgOAR8BtwEbYK+tpzGZXrC5uUkuV8Lj8TTDfL5Vnj8/IZ8v8O6dRvU++4Bh4CbwRc3cUjNtr+vXP2Fu7ksePYpSKpXwer0XSyYFRAW8EHAo4G8B4l8cf4qxsd+EEELs7++LxcVFsbGxIRqlAx/wGjAA0pW770QOh4NwOMzOzg6JROJ0XQcOwA/EgNQHg+qSJIlwOMzu7i7r6+t1GIALCACbwHZXgbOzs6iqyvLycuM0uoAQEAVKQFNzO5RGJlMgm82yt7fH4eEhxWKRra2ti6PvAL4DIkCZaj/bm4IC5IA88DtHRypLSyNoGpjNZiwWC+Pj40xPT2MymZpzVh2ScAPwa6AAvAQytfOjhnoz1bx9ysDADR4+/IZWQzYwMNAKVgd+D/wI/Ap8DJhqpm7Oh7muNL29xZagutrAqF30OXADkNuXvYd0V5fouwLqENY9/Q/7T8OOr6y4JGeXSa2Z198mJSCDzfaaajZbB/sK2F/ACfBHzfQtADodGAx6bt0yc++ejWDQwuTkVyQSv7C09BPhcBhJklrBTjh7qRZrpmUAenp2MRpvcucO3L9vw+//DJfL0HbnsiyTTCaJRCItgb2wzbVrY1gsg9y9a+bBg9v4/QYkSWJ19Q1WqxWfb/LyB9Agn8+HXq9nZWWFUCiEw+E4g8XjHuAlsvxt2x2/r7xeL/39/USjUQKBAC6XCwCdLM9RLks8fvwzqqp2BQbg8XiYmZkhFouRTqerMIBgMMjo6CiRSKSrQLfbTSAQIB6Pk8lkznImyzITExNEIhEymcwHgzRNQ1VVjo+PGRkZIZlMnh/9enOj0SihUKhj00Lh/DfHwcEBlUoFAKPRiMViYX5+vjln9eaura0BYLVaT00VRSGXy5HP58lmsxSLRTRNo6+v79TUbrczNTWF3W5vGv2edj8WqVSKhYUFhoaGcDqdp6aDg4MMDw9jt9txOp0tTdvpH1kNa5nouZWwAAAAAElFTkSuQmCC";
		var cube_bottom_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA8JJREFUSIntlk1IG2kYx39KYpqJHzHxa5ykLYHAIkG6LuQgwSpCTqaXainuMYcUkdVLby60yN560cPSHPQgKIX1ZKAGLwURFzzVTRe2sKjRRKNmJlp2s0lsnT2YxI+YqNTb7h9eGOZ55v97P55neMtUVVW5hmRZJhqNEg6HiUaj7O7ucnh4yNHREYIgEA6HSSQSjI6O4nQ6L/Uouwi7aKooCslkMm9aW1tLc3MzDQ0NiKKIJEkIgkAgECAUCgHgcrno6OgogGkmJyfJZDJ5UwCtVktjYyN1dXW0tbXR3NyMyWRCEISSq29qasLtdjMxMUEqlcLtdp+HjY2NMTQ0RE9PD5IkodfrrzQtJYvFgtfrZWpqinQ6jcfjycfKPR4PsVgMvV6P2Wz+KtBZoM/nIxQKMTs7ewqzWCz09fUxMzPDysrKV4NyMpvN+Hw+NjY2mJ6ePoEB2O12+vv7mZ+fZ3Fx8VaBAwMDyLLM+Pg4mlzAbrfj9XqLHu5NFIlE2N7eZnNzk3g8TiKRYGFh4RQGJ3s9ODiI3+8vONyLSiaTRKNRdnZ22NvbIxgMIssya2trABiNRkwmEzabje7ubgwGw3lYbuk+ny8P7OrqQlEU1tfXiUQiKIrCwcFBPt9oNCKKIlarFZvNxvDw8KVFVllZWQjLAYeHhxkZGSEYDGK1WjEYDIiiiNPpPNfMOQUCAfb390tW86UwAEEQcDgcVFdX09vbW9TgJiq/KkGn090K6Fqw29T/sP80LH1lRtE+K64kkcg/vHmjMDeX4MOHFJ8+pfjyJY5OV8HTp8mijV0SFov9xdu3GV6+/I2PH2Mkk2mOj3PRGuAOIAImwEU6/Sc1NUscHrouBWoymQwrKzKTkwrv3iXY2joglUqjqjpgA6jLprYA+uwo9ktq5fNnPVVVS4TDLiyW83maoaFl4BvAmJ1pS3amAhAB6oHWUhtwQXaOj+Hu3SXev/+O1lZzPlJuNrcDfwCOrKmlxMyvD1TVFh48WGZxUT6FxeM/ZOk/A3LRz28uC6r6LQ8fLhMIyFRUZEt/dfV7OjvvA/5bB0I7jx79TiCggHpGjx/PqfCTClsqqCpMqDCXfb7p+FuFuAqrKvyiglstuBE/e7aA3/8r4AUWOCmQ4tcDSAIKsA1sAnFgFziirAw0GoH6ehMOR1Vhn71+7UYU7/DixVT2Tf0Z0yiwA+xlzRNAkrIyLTqdgCSZ6OyUePKkHZdLQhDM57wLVpbTq1crPH/+I1AL3MubarU1SFIjbrdEf/89OjokwHyZRYH+BaX9mrpbeeodAAAAAElFTkSuQmCC";
		var cube_front_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAAwNJREFUSIntlsFLG1kcxz+RhDFT2GrGRp2ZBXchl0UP9ZBSGkLLwpycW1Ihgpc5DCyie+ipFFrwL9CDMNB4EOLFQA5S9Fp781LaHLNdze5k1WVnEpcYY2xrDyZRG2uVpodCv/CYw+/x+cyb95j38xwdHR1xiTiOQ6FQIJ/PUygU2NnZYXd3l8PDQ0RRJJ/PUywWmZ6eJhwOn8vwfCz7GOq6LpVKpQnt7u5GlmWCwSD9/f0oioIoiiwvL5PNZgGIRCJEo9EWmXd+fp5ardaEAvh8Pnp7e+np6WF4eBhZlgkEAoiieOHq+/r60DSNZDJJtVpF07SzspmZGaamphgZGUFRFPx+/2ehF0VVVQzDYGFhgYODA3Rdb9Y6dF1ne3sbv9+PJElfJDotNE2TbDZLOp0+kamqSjweZ3FxkfX19S8WNSJJEqZpsrm5SSqVOpYBhEIhEokEKysrrK2ttVX44MFvCIJDOj2Lt1EIhUIYhvHJzb1KHMdmaekfMpm/ePnyP1y3yLt3L05kcPytJyYmsCyrZXNbUyGXK7C0tMWzZ//y6tVzKpUihvFnvd4FBICfgV+B22dljaWbptkUxmL3eP3aJZXaYHXV5s0bl/39Eu/fcwraD+jAT3WBdM7LFVtlDeHDh79z584j4vFV4EfgWh0arj8V4Gon91zZcUS2tgaBH4DYlaCfSsfnpwhtEV1S1r58l32XfROyCm/fum2VecvlMrlcjo2NDWzbxnVdSqUSogjl8h/AQPtkmUyGvb29Zs8xODiILMuoqsrTp/MUi+37g3hHR0cBGB8fb0tLcFE6JicnkSSJubk5HMf5ujKAsbExBgYGsCzrKwqrJ6cxFosxNDSEZVnYtt0mQQWwgRzw99n7TNd1BEEgmUzy+LFxRahbH1WgBBzg8YDXC8HgdW7eHGq9PDVNo7Ozk9nZBWo1gBunqg6wX4eW6uBjqCAIKEond+92cf/+L0QirR10S6/fSC63Tjj8hFJpGLgF/I/HI+DzCSjKdTSti0QiQDQa4LLtwQcpnyeKkn0kgAAAAABJRU5ErkJggg==";
		var cube_right_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA8ZJREFUSIntl81LI3cYxz+rhuhYjMkoMW+NWwgFXyLNQYpbCqGQQyGgGHFR8JKDUCR4XhRzWP+A7UE2sPEgVBbssksvypbCIrtCs4VFix7qwWpeJrHJaMQM0bCdHtxkN5iobXNrv8fhy/cz8+N5nt8zt1RVVbmBMpkM8Xic/f194vE4qVSKbDZLoVBApxN4+jTLzs4pwWCAubn+ihkN14XKsoyiKBQKBQRBQK/XYzab6erqwmQyYbFYEASB7e0tdnZ+IxhcBfLMzX15Gba4uMj5+XkpFECj0WA0Gmlra8PlcmE2mzEYDAiCUPXL6+sBPgY+JxgMI0l5Hj70lJucTqcaDofVzc1NNZ1Oq7lcTv0nGh7eVOFnFVQVoirMq8PDP5R56rxeL8lkkqamJkRRvPLtby4rMMmTJ7/idn9felpntVoZGRlheXmZSCRSA1BRIjDJixe/09f33QUMwOFwMDY2xurqKuvr6zUGfsPWVgaz+dv31ehwOPD7/YTDYfL5PB6P54qQq6QAMpAADoA0cIQkPS8vfavVytTUFKFQiLOzM7xeb/VIRSEejyNJEtnsIbu7r4EM0PHO0QoYgE+Ar4Dmy30miiKTk5MloNvtRpZl9vb2iMViyLLM8fFxyd/a2kpnpwmd7lOgBfgaqFRkH12GFYHT09PMzMywtraGzWajubkZk8lEf39/WTMX9fjxFpCvArpQRRiAIAj09PTQ0tKCz+erGvB3VHedQavV1gR0I1gt9T/sPwx7+/Z6T9U+q6YPx1Q0GkWSJM7PcyhKFugBKq8EV8IURSGZTBKNRjk5OUGSpEtjymAw4HQ6uX37NvfuGbhzJ87GxnPgCypNkobT01N2d3crzr7t7W1EUaS7u7vqmPpQr16JDA018ezZy4rA+lwuFywuNHq9HqfTidvtZnBwEEVRcLlcDA0NYbfbEUURjUZT9ZgA7t4VicX+5M2b14ANKPp/oWF0dBSAiYmJGq0E8OiRg46OJubnfwIGuLhEoS4QCCCKIgsLC2QymZrAAO7ft/LgwWfABhcX6rvSHx8fp7Ozk1AoVFNgIGBlZWUAeAmcvu8zn89Hb28voVCIWCz2r0GKopDJZOjrixMM/gH8WF76Xq8XrVZLOBzG7/ffOFSWZRKJBAcHB6TTaVKpFIVCAbi4F202AysrE5f7zOPx0NjYyNLSEgDt7e2l0GIzHx4ekkgkODo6QlEUNBoNgiBgMBiwWCwMDAxgsVgQRbEs+1a1H4tIJMLs7Cx6vR673V4K1el0GI1GLBYLdru9Ymg1/QW4hNSnAVbhAgAAAABJRU5ErkJggg==";
		var cube_left_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA5JJREFUSIntlk9IW1kUh7+2xoxP0eTFmry8iBhwFqVk4SILKylBSJGZLIq6EWaVRYoM1HVxkSLdi8jQQLMRlAEDLbzFiBvLYLuYnZNlQI35Z9SXGGd8JhOKs3CM0fzrYHYz3/Zefh8H7jn33Lu4uLjgK1BVlWQySSwWI5lMkslkyOfzlEolBEEgFouRy+WYn5/H6XTWzLh3W3Y7NJvNomlaOdRoNGK1Wunr60OSJGRZRhAEFEUhEokAMDo6isvlqpK1hcMrnJ7+wcHBZSiATqfDbDbT29vL8PAwVqsVURQRBKFh9RaLBY/HQygUolAo4PF4bsqmpn4iEPiB6envEUWZjo6OpqGNsNls+Hw+lpeXKRaLeL3e8tl98BEIZNne7sBkMt1JVCn0+/1EIhHC4XCl7DEwxdTUKouLv91ZdIXJZMLv97O3t8fKysqVDGAImObly1+Ym/u1pcKZmRlUVWVxcZG266MhwMebNyEODgq8e+epG9KMRCJBKpVif3+f4+NjcrkcGxsblTIAG/AjoVAQVS3y/r23ZhiApmkkk0nS6TSHh4esr6+jqio7OzsAGAwGRFHEbrczNjZGZ2fnbRmACfDz4UOQJ0+KfPrkJhrNsru7SyKRIJvNcnJyUr5tMBiQJIn+/n7sdjuzs7M1H1lXV1ct2ZVwls+f53j2bJ2nT/tpb+9EkiScTueNZr5CURSOjo4avuY6MgABeIwgdPPq1WT9a/+C+80uPHigb4noq2St5H/Zf1hWLBab3mnQZ7WpHFPxeJx0Os3Z2RnxeJzu7m40Tavb2E1kf3F4GCEcPmVvL101pkRRxOFwMDg4iCiKbG5usrCwgN/vx2Qy1ZIVGsry+X30+m/rjqlKJicnURSFYDBYU9gGhw1kXQwNfXfja2+G1+tFr9eztLSEz+fDZrOVz+5LUh/Qug8TwOPx4Ha7CYVCRKPRa1kq5cLh+OYfodYyocvlYnx8nNXV1bKwDWB724nb/TsfP24Bo1xO/LvjdDoxGo2sra2hadp1n21uOpiYsABbtKJCTdNQVZXz83MsFguKolRvxC9eRAkGd7ms8GcmJh4SDjdeD7LZ7I2dI5PJUCqVABAEAVEUaW9vr+6zt2+HkKQOAoEt4E++fHlYDq3cOVKpFLlcDk3T0Ol05VBZlhkZGUGW5aqnX1XZFa9fJwgEAjx6VOD5c5l8/jK0p6cHs9mMLMsMDAzUDK3H3x0DgYWMs5l/AAAAAElFTkSuQmCC";
		var cube_top_img = "iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAABHNCSVQICAgIfAhkiAAAA71JREFUSIntl01Im3ccxz+JZsmyEZPnUTQ8kehQHKhp8RCYbBm5CB5SlGZYUvBQD7kM7aG9lEl378WTNIdcPHio1EFz2NqLL8goIqWTespAyKtvidGaf0wjfXZIfFuSqau37Qt/Ep6Xz+fHP78fzxONqqoql4pgcTHN9HSaV68yxON7FAp5VDUP6EtrnydPvufBA1tFQm0ZUgiWltI8e5Zmfj5DPH5IPp+nWJIeMABm4Cvgc0A+c3eKhw9/J5uFx4/LhZq+vgX13TvY3t7j6IgzUHMJLJWW8XIbgACW8Ptbefq0/e8nv1PhpQo7KmTVou5TV1aFl+rt23+oZ6MdGPgGWAHiV6j+ohiBb3n+fAO3e/XkqNbjaeXFix+AX4Dla5KdCufnM9y4UeRqP3wAj6edhQUfGs2vwOI1C12srh5SX7942o0uVztv345w82YQVT0E+v6lQABpIAFESp8HpFIL51vf4bARifyI3R7g48c84LkAGgeSQBT4E9gDjGg0YDCYaW6WcLu/5t69Vl6//qx8zmw2mffv/dTVBTg6ygPuUqXrQKz0PQOAVgtGo5mODistLTp6eup59Og+lRrtzZsvy2UARqPM3t59JOkn8vnfqKlpxmT6gq4uK7duOblzx4rNppyDhkIhtre3K4qOU1FWFBqZnOyiocGEx+OtCrhKtBdfor8W0SVl15f/Zf9hWT6fv/CaqnNWLUII4vE4yWSSaDRKMpkkm80SjUYxmUwIITAaKw92VZkQgo2NDaLRKPv7+ySTSTKZzMl5s9mMJEk4HA5aW1uRJIm5uTkmJibw+/3IslzGrD04OCAcDrO+vk4sFiOdTp9A19bWkGWZzs5OnE4nVqsVRVGqVu71egmFQgQCgYrCmmw2+7MQgkKhgMViweFw4Ha7GRgYQAhBT08Pg4OD2O12ZFlGp9P94zZ3dHSQy+WYnZ2lra0Nk8kEwMrKCrVDQ0MADA8PV634qunr68NgMBAMBvH5fLS3F198tKOjo8iyzOTkJKlU6lpkAC6Xi/7+fqanpwmHw0UZwN27d2lpaSEQCFyr0Ol04vP5mJmZIRaLnc6Z1+ulu7ubQCBALBb7ZJEQglQqRS6Xo6mpiVAodL71PR4Per2eYDDIyMjIpaHpdJpEIkEkEmFnZ4fNzU0KhQJQfC5KksTY2Fj5nB3/uFNTUwA0NDScQI+HeWtri0Qiwe7uLkIIdDrdCVRRFHp7e1EUpaz1NdX+WCwvLzM+Po7FYsFut59A6+rqaGxsRFEU7HZ7RWi1/AW9hKN9Ep/IIwAAAABJRU5ErkJggg==";
		
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
	
	if (plots[i_plot].make_toggles || plots[i_plot].make_snaps) {
		toggle_div.innerHTML = div_html;
		plots[i_plot].parent_div.appendChild(toggle_div);
	}
	
	var width, height;
	var margin_left = parseInt(plots[i_plot].parent_div.style.paddingLeft);
	var border_left = parseInt(plots[i_plot].parent_div.style.borderLeft);
	var margin_right = parseInt(plots[i_plot].parent_div.style.paddingRight);
	var border_right = parseInt(plots[i_plot].parent_div.style.borderRight);
	
	margin_left = isNaN(margin_left) ? 0 : margin_left;
	margin_right = isNaN(margin_right) ? 0 : margin_right;
	border_left = isNaN(border_left) ? 0 : border_left;
	border_right = isNaN(border_right) ? 0 : border_right;
	
	var margins = margin_left + margin_right + border_left + border_right;
	
	if (!params.hasOwnProperty("width") && !params.hasOwnProperty("height")) {
		width = Math.min(plots[i_plot].parent_div.offsetWidth - margins, window.innerHeight);
		height = width;
	} else {
		if (params.hasOwnProperty("width") && params.hasOwnProperty("height")) {
			width = params.width;
			height = params.height;
		} else {
			if (params.hasOwnProperty("width")) {
				width = params.width;
				height = Math.min(width, window.innerHeight);
			} else {
				height = params.height;
				width = Math.min(plots[i_plot].parent_div.offsetWidth - margins, window.innerHeight);
			}
		}
	}
	
	var temp_width = width + margins;
	
	// Make the scene a little bit larger (but hidden) so that points
	// don't suddenly disappear from the screen when their centroid
	// leaves the visible area.
	plots[i_plot].max_point_height = (params.hasOwnProperty("max_point_height")) ? params.max_point_height : 25;
	
	var hidden_margin = 0;
	if (plots[i_plot].geom_type == "point") {
		if (params.hasOwnProperty("hidden_margins")) {
			hidden_margin = params.hidden_margins ? Math.ceil(plots[i_plot].max_point_height / 2) : 0;
		}
	}
	
	plots[i_plot].renderer.setSize(width + 2*hidden_margin, height + 2*hidden_margin);
	plots[i_plot].parent_div.style.width = width + "px";
	
	var wrapper_div = document.createElement("div");
	wrapper_div.style.width = width + "px";
	wrapper_div.style.height = height + "px";
	wrapper_div.style.overflow = "hidden";
	plots[i_plot].parent_div.appendChild(wrapper_div);
	
	plots[i_plot].renderer.domElement.style.position = "relative";
	plots[i_plot].renderer.domElement.style.marginTop = -hidden_margin + "px";
	plots[i_plot].renderer.domElement.style.marginLeft = -hidden_margin + "px";
	
	wrapper_div.appendChild(plots[i_plot].renderer.domElement);
	
	plots[i_plot].width = width + 2*hidden_margin;
	plots[i_plot].height = height + 2*hidden_margin;
	
	plots[i_plot].mid_x = plots[i_plot].width / 2;
	plots[i_plot].mid_y = plots[i_plot].height / 2;
	
	var bg_color = (params.hasOwnProperty("background_color")) ? params.background_color : "#000000";
	var bg_color_hex;
	
	var tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	if (typeof(bg_color) == "string") {
		bg_color_hex = css_color_to_hex(bg_color, tiny_div);
	} else {
		bg_color_hex = bg_color;
		bg_color = hex_to_css_color(bg_color);
	}
	
	plots[i_plot].bg_color = bg_color;
	plots[i_plot].bg_color_hex = bg_color_hex;
	plots[i_plot].scene.background = new THREE.Color(bg_color_hex);
	
	var aspect = plots[i_plot].width / plots[i_plot].height;
	
	plots[i_plot].null_width = (params.hasOwnProperty("null_width")) ? params.null_width/2 : 0.5;
	plots[i_plot].null_width_time = (params.hasOwnProperty("null_width_time")) ? params.null_width_time/2 : 30000;
	
	// Set up the camera(s).
	
	plots[i_plot].init_lonlat = [-3*tau/8, tau/8];
	if (params.hasOwnProperty("init_lonlat")) {
		plots[i_plot].init_lonlat = JSON.parse(JSON.stringify(params.init_lonlat));
	}
	
	plots[i_plot].init_rot = params.hasOwnProperty("init_camera_rot") ? params.init_camera_rot : 0;
	plots[i_plot].camera_r = params.hasOwnProperty("camera_r") ? params.camera_r : 5;
	
	plots[i_plot].camera_origin = new THREE.Vector3(0, 0, 0);
	plots[i_plot].init_origin = [0, 0, 0];
	if (params.hasOwnProperty("init_camera_origin")) {
		plots[i_plot].init_origin = JSON.parse(JSON.stringify(params.init_camera_origin));
		plots[i_plot].camera_origin.x = params.init_camera_origin[0];
		plots[i_plot].camera_origin.y = params.init_camera_origin[1];
		plots[i_plot].camera_origin.z = params.init_camera_origin[2];
		
		plots[i_plot].init_origin = JSON.parse(JSON.stringify(params.init_camera_origin));
	}
	
	plots[i_plot].view_type = (params.hasOwnProperty("view_type")) ? params.view_type : "perspective";
	
	plots[i_plot].max_fov = (params.hasOwnProperty("max_fov")) ? params.max_fov : 90;
	plots[i_plot].min_fov = (params.hasOwnProperty("min_fov")) ? params.min_fov : 1;
	plots[i_plot].max_pan_dist_sq = (params.hasOwnProperty("max_pan_distance")) ? params.max_pan_distance : 0.5*plots[i_plot].camera_r;
	
	plots[i_plot].max_pan_dist_sq = plots[i_plot].max_pan_dist_sq * plots[i_plot].max_pan_dist_sq;
	
	var theta, ortho_top, ortho_right;
	if (plots[i_plot].view_type == "perspective") {
		plots[i_plot].init_fov = (params.hasOwnProperty("fov")) ? params.fov : 47.25;
		
		theta = plots[i_plot].init_fov / 2;
		ortho_top = plots[i_plot].camera_r * Math.tan(theta / rad2deg);
		ortho_right = ortho_top * aspect;
	} else {
		// Orthographic.
		if (params.hasOwnProperty("ortho_right")) {
			ortho_right = params.ortho_right;
			ortho_top = ortho_right / aspect;
		} else if (params.hasOwnProperty("ortho_top")) {
			ortho_top = params.ortho_top;
			ortho_right = ortho_top * aspect;
		} else {
			plots[i_plot].init_fov = (params.hasOwnProperty("fov")) ? params.fov : 47.25;
			
			ortho_top = plots[i_plot].camera_r * Math.tan(0.5 * plots[i_plot].init_fov / rad2deg);
			ortho_right = ortho_top * aspect;
		}
		
		theta = Math.atan2(ortho_top, plots[i_plot].camera_r) * rad2deg * 2;
		if (theta > 90) { theta = 90; }
		
		plots[i_plot].init_fov = theta;
	}
	
	plots[i_plot].persp_camera = new THREE.PerspectiveCamera(
		plots[i_plot].init_fov,
		aspect,
		0.01,
		10*plots[i_plot].camera_r);
	
	
	plots[i_plot].init_ortho_top = ortho_top;
	plots[i_plot].init_ortho_right = ortho_right;
	
	plots[i_plot].ortho_camera = new THREE.OrthographicCamera(
		-ortho_right, ortho_right, ortho_top, -ortho_top, 0.01, 10*plots[i_plot].camera_r);
	
	plots[i_plot].persp_camera.rotation.order = "ZYX";
	plots[i_plot].ortho_camera.rotation.order = "ZYX";
	
	plots[i_plot].aux_camera_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(tau/4, 0, tau/4, "ZYX"));
	
	reset_camera(
		i_plot,
		true,
		[plots[i_plot].init_lonlat[0], plots[i_plot].init_lonlat[1], plots[i_plot].init_rot],
		plots[i_plot].init_origin);
	
	
	// Preparing the font for labels etc.
	
	var font = (params.hasOwnProperty("font")) ? params.font : "Arial, sans-serif";
	plots[i_plot].font = font;
	
	var test_font_size = 96;
	// The 1.08 is a fudge factor; the get_font_height() function doesn't really work.
	plots[i_plot].font_ratio = 1.08 * get_font_height("font-family: " + font + "; font-size: " + test_font_size + "px", plots[i_plot].parent_div) / test_font_size;
	
	plots[i_plot].mouse = new THREE.Vector2();
	plots[i_plot].raycaster = new THREE.Raycaster();
	
	plots[i_plot].parent_div.removeChild(tiny_div);
}

var basic_plot_listeners = function(i_plot, params) {
	plots[i_plot].mouse_operation = "none";
	plots[i_plot].two_finger_operation = "none";
	
	plots[i_plot].renderer.domElement.addEventListener("mousedown", mouse_down_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("mouseup", mouse_up_fn(i_plot, false));
	plots[i_plot].renderer.domElement.addEventListener("mouseout", mouse_up_fn(i_plot, true));
	
	if (plots[i_plot].have_mouseout) {
		if (plots[i_plot].plot_type == "scatter") {
			plots[i_plot].renderer.domElement.addEventListener("mouseout", mouse_out_wrapper(i_plot, -1, true));
		} else if (plots[i_plot].plot_type == "surface") {
			plots[i_plot].renderer.domElement.addEventListener("mouseout", mouse_out_wrapper(i_plot, [-1, -1], true));
		}
	}
	
	
	plots[i_plot].renderer.domElement.addEventListener("mousemove", mouse_move_wrapper(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("wheel", mouse_zoom_wrapper(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("touchstart", touch_start_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("touchmove", touch_move_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("touchend", touch_end_fn(i_plot));
	
	if (plots[i_plot].make_toggles) {
		document.getElementById("icon_three_d_scatter_camera_" + i_plot).addEventListener("click", toggle_camera(i_plot));
		document.getElementById("icon_three_d_scatter_grid_" + i_plot).addEventListener("click", toggle_grid(i_plot));
		document.getElementById("icon_three_d_scatter_ticks_" + i_plot).addEventListener("click", toggle_ticks(i_plot));
		document.getElementById("icon_three_d_scatter_axis_title_" + i_plot).addEventListener("click", toggle_axis_titles(i_plot));
		document.getElementById("icon_three_d_scatter_box_" + i_plot).addEventListener("click", toggle_box(i_plot));
	}
	
	if (plots[i_plot].make_snaps) {
		document.getElementById("icon_three_d_scatter_snap_home_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[plots[i_plot].init_lonlat[0], plots[i_plot].init_lonlat[1], plots[i_plot].init_rot],
				plots[i_plot].init_origin));
		
		document.getElementById("icon_three_d_scatter_snap_top_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[0, tau/4, -tau/4],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_bottom_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[0, -tau/4, -tau/4],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_front_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[-tau/4, 0, 0],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_back_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[tau/4, 0, 0],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_left_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[0, 0, 0],
				[0, 0, 0]));
		
		document.getElementById("icon_three_d_scatter_snap_right_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[tau/2, 0, 0],
				[0, 0, 0]));
	}
}

var custom_plot_listeners = function(i_plot, params) {
	plots[i_plot].have_mouseover = false;
	plots[i_plot].have_mouseout = false;
	plots[i_plot].have_click = false;
	
	if (plots[i_plot].plot_type == "scatter") {
		plots[i_plot].clicked_i = -1;
		plots[i_plot].mouseover_i = -1;
	} else if (plots[i_plot].plot_type == "surface") {
		plots[i_plot].clicked_i = [-1, -1];
		plots[i_plot].mouseover_i = [-1, -1];
	}
	
	var possible_events = true;
	if (plots[i_plot].plot_type == "scatter") {
		if (plots[i_plot].geom_type == "none") {
			possible_events = false;
		}
	}
	
	if (possible_events) {
		if (params.hasOwnProperty("mouseover")) {
			plots[i_plot].have_mouseover = true;
			plots[i_plot].mouseover = params.mouseover;
		}
		
		if (params.hasOwnProperty("mouseout")) {
			plots[i_plot].have_mouseout = true;
			plots[i_plot].mouseout = params.mouseout;
		}
		
		if (params.hasOwnProperty("click")) {
			plots[i_plot].have_click = true;
			plots[i_plot].click = params.click;
		}
	}
}

var make_scatter = function(params) {
	if (!check_webgl_fallback(params)) { return; }
	
	var i, group;
	
	plots.push({});
	var i_plot = plots.length - 1;
	
	plots[i_plot].plot_type = "scatter";
	
	plots[i_plot].parent_div = document.getElementById(params.div_id);
	
	var tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	plots[i_plot].geom_type = (params.hasOwnProperty("geom_type")) ? params.geom_type : "quad";
	
	if (plots[i_plot].geom_type == "none") {
		plots[i_plot].have_segments = true;
	} else {
		plots[i_plot].have_segments = (params.hasOwnProperty("connect_points")) ? params.connect_points : false;
	}
	
	var default_color = (params.hasOwnProperty("default_color")) ? params.default_color : 0xFFFFFF;
	
	if (typeof(default_color) == "string") {
		default_color = css_color_to_hex(default_color, tiny_div);
	}
	
	var point_type = (params.hasOwnProperty("point_type")) ? params.point_type : "sphere";
	
	if (point_type == "custom") {
		if (!(params.hasOwnProperty("custom_point"))) {
			point_type = "sphere";
		}
	}
	
	var default_image_src = point_type_src(point_type, params.custom_point);
	
	var default_point_height = (params.hasOwnProperty("default_point_height")) ? params.default_point_height : 20;
	
	plots[i_plot].have_groups = false;
	plots[i_plot].groups = {};
	
	plots[i_plot].texture_sources = [];
	var image_src;
	
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
		var data_groups = [];
		
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
		plots[i_plot].textures.push(new THREE.TextureLoader().load(plots[i_plot].texture_sources[i], function () { check_loaded_textures(i_plot, params); }));
	}
	
	plots[i_plot].parent_div.removeChild(tiny_div);
}

var check_loaded_textures = function(i_plot, params) {
	plots[i_plot].texture_count++;
	
	if (plots[i_plot].texture_count == plots[i_plot].texture_sources.length) {
		// All textures loaded.
		
		for (var i = 0; i < plots[i_plot].textures.length; i++) {
			//plots[i_plot].textures[i].minFilter = THREE.NearestFilter;
		}
		
		
		if (plots[i_plot].geom_type == "quad") {
			// Point each group's texture at the
			// relevant entry in the textures array.
			
			for (var group in plots[i_plot].groups) {
				if (plots[i_plot].groups.hasOwnProperty(group)) {
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

var make_scatter_main = function(params, i_plot) {
	var i, j, k, l;
	
	if (i_plot === undefined) {
		var i_plot = plots.length - 1;
	}
	
	basic_plot_setup(i_plot, params);
	prepare_sizes(i_plot, params);
	make_axes(i_plot, params);
	
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
	
	var temp_obj = calculate_locations(i_plot, params);
	var plot_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
	
	// The usual JSON.parse trick doesn't work on the Float32Array I guess?
	var null_points = new Float32Array(params.data.length);
	for (i = 0; i < params.data.length; i++) {
		null_points[i] = temp_obj.null_points[i];
	}
	
	make_points(i_plot, params, plot_locations, null_points);
	
	custom_plot_listeners(i_plot, params);
	
	update_render(i_plot);
	
	basic_plot_listeners(i_plot, params);
}

var check_surface_data_sizes = function(params) {
	var i, j;
	
	// Check to see if the data is correctly formatted.
	var x_values = params.data.x;
	var y_values = params.data.y;
	var z_values = params.data.z;
	
	var have_colors = false;
	
	if (params.data.hasOwnProperty("color")) {
		have_colors = true;
		var color_values = params.data.color;
		
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
	
	var have_other = true;
	if (!params.data.hasOwnProperty("other")) {
		params.data.other = [];
		
		for (i = 0; i < z_values.length; i++) {
			params.data.other.push([]);
			
			for (j = 0; j < y_values.length; j++) {
				params.data.other[i].push({});
			}
		}
	} else {
		var other_values = params.data.other;
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

var make_surface = function(params) {
	if (!check_webgl_fallback(params)) { return; }
	
	var size_checks = check_surface_data_sizes(params);
	if (!size_checks.data) { return; }
	
	if ((params.data.x.length < 2) || (params.data.y.length < 2)) {
		console.warn("Need to have at least two values defined for each of x and y.");
		return;
	}
	
	plots.push({});
	var i_plot = plots.length - 1;
	
	plots[i_plot].plot_type = "surface";
	plots[i_plot].parent_div = document.getElementById(params.div_id);
	plots[i_plot].have_color_matrix = size_checks.colors;
	plots[i_plot].have_other = size_checks.other;
	
	basic_plot_setup(i_plot, params);
	make_axes(i_plot, params);
	
	plots[i_plot].surface_material = new THREE.ShaderMaterial({
		"vertexShader":   shader_surface_vertex,
		"fragmentShader": shader_surface_fragment,
		"side": THREE.DoubleSide
	});
	
	var mesh_color;
	
	if (params.hasOwnProperty("mesh_color")) {
		mesh_color = params.mesh_color;
		
		if (typeof(mesh_color) == "string") {
			mesh_color = css_color_to_hex(mesh_color);
		}
		
		var rgb = hex_to_rgb_obj(mesh_color);
		mesh_color = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
	} else {
		// Set default mesh colour to black or white depending
		// on the background colour.
		var bg_color_obj = hex_to_rgb_obj(plots[i_plot].bg_color_hex);
		var sum_bg = bg_color_obj.r + bg_color_obj.g + bg_color_obj.b;
		if (sum_bg > 1.5) {
			mesh_color = new THREE.Vector4(0, 0, 0, 1);
		} else {
			mesh_color = new THREE.Vector4(1, 1, 1, 1);
		}
	}
	
	var use_const_color = 1;
	
	if (params.hasOwnProperty("uniform_mesh_color")) {
		use_const_color = params.uniform_mesh_color | 0;
	}
	
	plots[i_plot].mesh_material = new THREE.ShaderMaterial({
		"uniforms": {
			"use_const_color": {"type": "f",  "value": use_const_color},
			"const_color":     {"type": "v4", "value": mesh_color}
		},
		"vertexShader":   shader_mesh_vertex,
		"fragmentShader": shader_mesh_fragment
	});
	
	var temp_obj = calculate_locations(i_plot, params);
	make_mesh_points(i_plot, params, temp_obj.plot_locations, temp_obj.null_points);
	
	custom_plot_listeners(i_plot, params);
	
	update_render(i_plot);
	basic_plot_listeners(i_plot, params);
}


exports.set_touch_coords = set_touch_coords;
exports.touch_start_fn = touch_start_fn;
exports.touch_move_fn = touch_move_fn;
exports.touch_end_fn = touch_end_fn;
exports.mouse_down_fn = mouse_down_fn;
exports.mouse_up_fn = mouse_up_fn;
exports.mouse_zoom_wrapper = mouse_zoom_wrapper;
exports.mouse_zoom = mouse_zoom;
exports.mouse_move_wrapper = mouse_move_wrapper;
exports.set_normed_mouse_coords = set_normed_mouse_coords;
exports.mouse_move_fn = mouse_move_fn;
exports.get_scale_factor = get_scale_factor;
exports.get_raycast_i = get_raycast_i;
exports.get_current_camera = get_current_camera;
exports.toggle_camera = toggle_camera;
exports.switch_camera_type = switch_camera_type;
exports.update_labels = update_labels;
exports.toggle_grid = toggle_grid;
exports.update_gridlines = update_gridlines;
exports.update_axes = update_axes;
exports.toggle_ticks = toggle_ticks;
exports.toggle_axis_titles = toggle_axis_titles;
exports.toggle_box = toggle_box;
exports.are_same_color = are_same_color;
exports.get_text_width = get_text_width;
exports.make_text_canvas = make_text_canvas;
exports.make_label_text_plane = make_label_text_plane;
exports.make_text_plane = make_text_plane;
exports.get_font_height = get_font_height;
exports.hex_to_css_color = hex_to_css_color;
exports.hex_to_rgb_obj = hex_to_rgb_obj;
exports.hex_to_rgb_obj_255 = hex_to_rgb_obj_255;
exports.css_color_to_hex = css_color_to_hex;
exports.reset_camera_wrapper = reset_camera_wrapper;
exports.reset_camera = reset_camera;
exports.get_i_plot = get_i_plot;
exports.destroy_plot = destroy_plot;
exports.set_point_position = set_point_position;
exports.set_point_segments_position = set_point_segments_position;
exports.set_surface_point_z = set_surface_point_z;
exports.set_color = set_color;
exports.set_point_color = set_point_color;
exports.set_point_segments_color = set_point_segments_color;
exports.set_label_color = set_label_color;
exports.set_label_background_color = set_label_background_color;
exports.set_surface_point_color = set_surface_point_color;
exports.set_mesh_point_color = set_mesh_point_color;
exports.set_surface_color_scale = set_surface_color_scale;
exports.set_size = set_size;
exports.set_point_size = set_point_size;
exports.update_render = update_render;
exports.hide_point = hide_point;
exports.hide_group = hide_group;
exports.show_point = show_point;
exports.show_group = show_group;
exports.hide_label = hide_label;
exports.hide_group_labels = hide_group_labels;
exports.show_label = show_label;
exports.show_group_labels = show_group_labels;
exports.show_surface = show_surface;
exports.hide_surface = hide_surface;
exports.show_mesh = show_mesh;
exports.hide_mesh = hide_mesh;
exports.show_surface_point = show_surface_point;
exports.hide_surface_point = hide_surface_point;
exports.show_mesh_point = show_mesh_point;
exports.hide_mesh_point = hide_mesh_point;
exports.set_mesh_axis_hide = set_mesh_axis_hide;
exports.hide_mesh_x = hide_mesh_x;
exports.hide_mesh_y = hide_mesh_y;
exports.show_mesh_x = show_mesh_x;
exports.show_mesh_y = show_mesh_y;
exports.set_mesh_uniform_color = set_mesh_uniform_color;
exports.use_uniform_mesh_color = use_uniform_mesh_color;
exports.prepare_sizes = prepare_sizes;
exports.make_axes = make_axes;
exports.calculate_locations = calculate_locations;
exports.interpolate_color = interpolate_color;
exports.interpolate_color_255 = interpolate_color_255;
exports.get_colors = get_colors;
exports.make_points = make_points;
exports.smoothstep = smoothstep;
exports.animate_transition_wrapper = animate_transition_wrapper;
exports.animate_transition = animate_transition;
exports.update_points_input_data = update_points_input_data;
exports.change_data = change_data;
exports.make_scatter = make_scatter;
exports.make_scatter_main = make_scatter_main;
exports.make_surface = make_surface;
exports.basic_plot_listeners = basic_plot_listeners;
exports.basic_plot_setup = basic_plot_setup;
exports.calculate_color = calculate_color;
exports.check_loaded_textures = check_loaded_textures;
exports.check_surface_data_sizes = check_surface_data_sizes;
exports.check_webgl_fallback = check_webgl_fallback;
exports.colorise_otherise_params = colorise_otherise_params;
exports.colorscale_greys = colorscale_greys;
exports.colorscale_inferno = colorscale_inferno;
exports.colorscale_magma = colorscale_magma;
exports.colorscale_plasma = colorscale_plasma;
exports.colorscale_viridis = colorscale_viridis;
exports.custom_plot_listeners = custom_plot_listeners;
exports.get_location = get_location;
exports.hide_point_segments = hide_point_segments;
exports.make_mesh_arrays = make_mesh_arrays;
exports.make_mesh_points = make_mesh_points;
exports.mouse_out_fn = mouse_out_fn;
exports.mouse_out_wrapper = mouse_out_wrapper;
exports.point_type_src = point_type_src;
exports.set_mesh_point_hide = set_mesh_point_hide;
exports.set_surface_color_scale_fn = set_surface_color_scale_fn;
exports.set_surface_point_hide = set_surface_point_hide;
exports.show_point_segments = show_point_segments;
exports.surrounding_mesh_segments = surrounding_mesh_segments;
exports.surrounding_surface_quads = surrounding_surface_quads;
exports.update_surface_input_data = update_surface_input_data;
exports.plots = plots;
exports.tau = tau;
exports.rad2deg = rad2deg;
exports.shader_points_vertex = shader_points_vertex;
exports.shader_points_fragment = shader_points_fragment;
exports.shader_quads_vertex = shader_quads_vertex;
exports.shader_quads_fragment = shader_quads_fragment;
exports.shader_labels_vertex = shader_labels_vertex;
exports.shader_labels_fragment = shader_labels_fragment;

})));
