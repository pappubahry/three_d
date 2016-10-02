/* Hello and welcome to my JavaScript.  This is version 0 of three_d.js.
 * It assumes r81 of three.js.
 * 
 * The first part of this file are some d3.js modules.
 * 
 * Most of the early functions in my code handle the mouse and touch
 * events -- rotating, panning, raycasting, etc.  I am not happy that
 * I carry around redundant information about the camera's location and
 * orientation, but otherwise I think that part of the code is
 * reasonable, and I learned how to use quaternions while writing it.
 * 
 * The creation of the plots themselves is a fairly disorganised mess,
 * caused by me only deciding to allow transitions between data values
 * quite late, and copy-pasting out some blocks of code to somewhat
 * unthematic functions.  But if you follow make_scatter(), then
 * hopefully you'll get the gist of it.
 * 
 * David Barry, 2016-10-02.
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
"  gl_FragColor = vec4(vertex_color) * texture2D(texture, gl_PointCoord);",
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
				plots[i_plot].clicked_i = get_raycast_i(i_plot);
			}
		} else {
			plots[i_plot].two_finger_operation = "none";
			plots[i_plot].clicked_i = -1;
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
		
		if ((event.touches.length == 0) && (plots[i_plot].clicked_i >= 0)) {
			set_normed_mouse_coords({"clientX": event.changedTouches[0].clientX, "clientY": event.changedTouches[0].clientY}, i_plot);
			var this_clicked_i = get_raycast_i(i_plot);
			
			if (this_clicked_i == plots[i_plot].clicked_i) {
				plots[i_plot].click(
					i_plot,
					plots[i_plot].clicked_i,
					plots[i_plot].points[this_clicked_i]);
				
				plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
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
					plots[i_plot].clicked_i = get_raycast_i(i_plot);
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

var mouse_up_fn = function(i_plot) {
	return function(event) {
		plots[i_plot].mouse_operation = "none";
		
		if (plots[i_plot].have_click) {
			set_normed_mouse_coords(event, i_plot);
			if (plots[i_plot].have_click) {
				var this_clicked_i = get_raycast_i(i_plot);
			}
			
			if ((this_clicked_i == plots[i_plot].clicked_i) && (this_clicked_i >= 0)) {
				plots[i_plot].click(
					i_plot,
					plots[i_plot].clicked_i,
					plots[i_plot].points[this_clicked_i]);
				
				plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
			}
			
			plots[i_plot].clicked_i = -1;
		}
		
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
			var width = 2*plots[i_plot].ortho_camera.right;
			
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
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
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
	var delta_y = event.clientY - plots[i_plot].click_start_y;
	
	set_normed_mouse_coords(event, i_plot);
	
	var perc_horiz = plots[i_plot].mouse.x;
	var perc_vert = -plots[i_plot].mouse.y;
	
	var start_lon = plots[i_plot].camera_lonlat[0];
	var start_lat = plots[i_plot].camera_lonlat[1];
	var start_psi = plots[i_plot].camera_rot;
	
	var i;
	
	if (plots[i_plot].mouse_operation == "rotate") {
		var delta_lat = delta_y * (tau/2) * (1 - Math.abs(perc_horiz)) / plots[i_plot].height;
		var delta_lon = delta_x * (tau/2) * (1 - Math.abs(perc_vert)) / plots[i_plot].width;
		var delta_psi = delta_y * (tau/2) * perc_horiz / plots[i_plot].width +
						delta_x * (tau/2) * perc_vert / plots[i_plot].height;
		
		
		var base_quat = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(-start_lat, start_lon, start_psi, "YXZ"))
			.premultiply(plots[i_plot].aux_camera_quat);
		
		var change_quat = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(-delta_lat, delta_lon, delta_psi, "YXZ"))
			.premultiply(base_quat);
		
		var old_posn_quat = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(start_psi, -start_lat, start_lon, "ZYX"));
		
		var new_posn_quat = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(0, -delta_lat, delta_lon, "ZYX"))
			.premultiply(old_posn_quat);
		
		var new_posn_vec = new THREE.Vector3(1, 0, 0)
			.applyQuaternion(new_posn_quat);
		
		var r = plots[i_plot].camera_r;
		new_posn_vec.multiplyScalar(r);
		
		var new_theta = Math.asin(new_posn_vec.z / r);
		var new_phi;
		
		if (Math.abs(new_posn_vec.z / r) >= 1) {
			// Over a pole up to round-off error.
			new_phi = start_lon;
		} else {
			new_phi = Math.atan2(new_posn_vec.y, new_posn_vec.x);
		}
		
		plots[i_plot].camera_lonlat[0] = new_phi;
		plots[i_plot].camera_lonlat[1] = new_theta;
		
		plots[i_plot].camera_up = new THREE.Vector3(0, 1, 0)
			.applyQuaternion(change_quat);
		
		var test_quat = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(-new_theta, new_phi, 0, "YXZ"))
			.premultiply(plots[i_plot].aux_camera_quat);
		
		var test_up = new THREE.Vector3(0, 1, 0)
			.applyQuaternion(test_quat);
		
		var new_psi = plots[i_plot].camera_up.angleTo(test_up);
		
		plots[i_plot].camera_rot = new_psi;
		
		get_current_camera(i_plot).position
			.copy(new_posn_vec);
			
		var this_quat = new THREE.Quaternion()
			.setFromEuler(new THREE.Euler(-new_theta, new_phi, new_psi, "YXZ"))
			.premultiply(plots[i_plot].aux_camera_quat);
		
		get_current_camera(i_plot).rotation.setFromQuaternion(this_quat);
		
		var post_rot_up_check = new THREE.Vector3(0, 1, 0)
			.applyQuaternion(this_quat);
		
		
		var rot_angle_check = post_rot_up_check.angleTo(plots[i_plot].camera_up);
		if (Math.abs(rot_angle_check) > 1e-6) {
			if (Math.abs(rot_angle_check) - 2*Math.abs(new_psi) < 1e-6) {
				//console.log("~~~Fudging the psi angle~~~");
				plots[i_plot].camera_rot *= -1;
				
				var this_quat = new THREE.Quaternion()
					.setFromEuler(new THREE.Euler(-new_theta, new_phi, -new_psi, "YXZ"))
					.premultiply(plots[i_plot].aux_camera_quat);
				
				get_current_camera(i_plot).rotation.setFromQuaternion(this_quat);
				
				var post_rot_up_check = new THREE.Vector3(0, 1, 0)
					.applyQuaternion(this_quat);
				
				rot_angle_check = post_rot_up_check.angleTo(plots[i_plot].camera_up);
			}
		}
		
		if (Math.abs(rot_angle_check) > 1e-6) {
			console.log("CHECK ANGLE ERROR:");
			console.log([post_rot_up_check.x, post_rot_up_check.y, post_rot_up_check.z].join());
			console.log(post_rot_up_check.angleTo(plots[i_plot].camera_up));
		}
		
		var camera_up_dot = plots[i_plot].camera_up.dot(get_current_camera(i_plot).position);
		var test_up_dot = test_up.dot(get_current_camera(i_plot).position);
		var post_check_dot = post_rot_up_check.dot(get_current_camera(i_plot).position);
		
		if (Math.abs(camera_up_dot) > 1e-6) { console.log("ERROR camera_up_dot: " + camera_up_dot); }
		if (Math.abs(test_up_dot) > 1e-6) { console.log("ERROR test_up_dot: " + test_up_dot); }
		if (Math.abs(post_check_dot) > 1e-6) { console.log("ERROR post_check_dot: " + post_check_dot); }
		
		get_current_camera(i_plot).position.add(plots[i_plot].camera_origin);
		
		if (plots[i_plot].geom_type == "quad") {
			for (i = 0; i < plots[i_plot].points.length; i++) {
				plots[i_plot].points[i].rotation.copy(get_current_camera(i_plot).rotation);
			}
		}
		
		for (i = 0; i < plots[i_plot].axis_text_planes.length; i++) {
			plots[i_plot].axis_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
		}
		
		for (i = 0; i < plots[i_plot].tick_text_planes.length; i++) {
			plots[i_plot].tick_text_planes[i].rotation.copy(get_current_camera(i_plot).rotation);
		}
		
		if (plots[i_plot].have_any_labels) {
			update_labels(i_plot);
		}
		
		if (plots[i_plot].show_grid) {
			update_gridlines(i_plot);
		}
		
		if (plots[i_plot].dynamic_axis_labels) {
			update_axes(i_plot);
		}
		
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
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
			
			var mouseover_i = get_raycast_i(i_plot);
			
			if (mouseover_i != plots[i_plot].mouseover_i) {
				if ((plots[i_plot].mouseover_i >= 0) && (plots[i_plot].have_mouseout)) {
					// mouseout
					plots[i_plot].mouseout(
						i_plot,
						plots[i_plot].mouseover_i,
						plots[i_plot].points[plots[i_plot].mouseover_i]);
				}
				
				plots[i_plot].mouseover_i = mouseover_i;
			}
			
			if ((mouseover_i >= 0) && (plots[i_plot].have_mouseover)) {
				// mouseover
				plots[i_plot].mouseover(
					i_plot,
					plots[i_plot].mouseover_i,
					plots[i_plot].points[mouseover_i]);
			}
			
			plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
		}
	}
	
	plots[i_plot].click_start_x = event.clientX;
	plots[i_plot].click_start_y = event.clientY;
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
	} else {
		// Quads.
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
		plots[i_plot].point_material.uniforms.is_perspective.value = 0.0;
	} else {
		theta = Math.atan2(plots[i_plot].ortho_camera.top, plots[i_plot].camera_r) * rad2deg * 2;
		if (theta > plots[i_plot].max_fov) { theta = plots[i_plot].max_fov; }
		if (theta < plots[i_plot].min_fov) { theta = plots[i_plot].min_fov; }
		
		plots[i_plot].persp_camera.fov = theta;
		
		plots[i_plot].persp_camera.position.copy(plots[i_plot].ortho_camera.position);
		plots[i_plot].persp_camera.rotation.copy(plots[i_plot].ortho_camera.rotation);
		
		plots[i_plot].view_type = "perspective";
		plots[i_plot].point_material.uniforms.is_perspective.value = 1.0;
	}
	
	get_current_camera(i_plot).updateProjectionMatrix();
	if (plots[i_plot].show_grid) {
		update_gridlines(i_plot);
	}
	plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
}

var update_labels = function(i_plot) {
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
	
	for (var i = 0; i < plots[i_plot].points.length; i++) {
		if (plots[i_plot].geom_type == "point") {
			position.copy(new THREE.Vector3(positions[3*i], positions[3*i + 1], positions[3*i + 2]));
		} else {
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
			.setFromEuler(new THREE.Euler(0, -plots[i_plot].camera_lonlat[1], plots[i_plot].camera_lonlat[0], "ZYX"));
		
		var r = new THREE.Vector3(1, 0, 0)
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
	
	// The following mess of quaternions can almost certainly be
	// simplified, but it's been a few days since I worked out
	// how all this fits together.
	
	plots[i_plot].aux_camera_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(tau/4, 0, tau/4, "ZYX"));
	
	var init_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(0, -lat, lon, "ZYX"));
	
	var change_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(0, 0, psi, "YXZ"))
		.premultiply(init_quat);
	
	var base_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(-lat, lon, 0, "YXZ"))
		.premultiply(plots[i_plot].aux_camera_quat);
	
	var change_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(0, 0, psi, "YXZ"))
		.premultiply(base_quat);
	
	plots[i_plot].camera_up = new THREE.Vector3(0, 1, 0)
		.applyQuaternion(change_quat);
	
	var this_quat = new THREE.Quaternion()
		.setFromEuler(new THREE.Euler(-lat, lon, psi, "YXZ"))
		.premultiply(plots[i_plot].aux_camera_quat);
	
	plots[i_plot].persp_camera.position.copy(new THREE.Vector3(1, 0, 0)
		.applyQuaternion(init_quat)
		.multiplyScalar(plots[i_plot].camera_r))
		.add(origin_vec);
	
	plots[i_plot].persp_camera.rotation.setFromQuaternion(this_quat);
	
	plots[i_plot].ortho_camera.position.copy(plots[i_plot].persp_camera.position);
	plots[i_plot].ortho_camera.rotation.copy(plots[i_plot].persp_camera.rotation);
	
	plots[i_plot].camera_lonlat = [lon, lat];
	plots[i_plot].camera_rot = psi;
	plots[i_plot].camera_origin = new THREE.Vector3().copy(origin_vec);
	
	if (plots[i_plot].view_type == "perspective") {
		plots[i_plot].persp_camera.fov = plots[i_plot].init_fov;
	} else {
		// Orthographic.
		plots[i_plot].ortho_camera.top = plots[i_plot].init_ortho_top;
		plots[i_plot].ortho_camera.bottom = -plots[i_plot].init_ortho_top;
		plots[i_plot].ortho_camera.left = -plots[i_plot].init_ortho_right;
		plots[i_plot].ortho_camera.right = plots[i_plot].init_ortho_right;
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
				plots[i_plot].labels[i].scale.x = plots[i_plot].init_label_scale;
				plots[i_plot].labels[i].scale.y = plots[i_plot].init_label_scale;
			}
		}
		
		if (plots[i_plot].geom_type == "quad") {
			for (i = 0; i < plots[i_plot].points.length; i++) {
				plots[i_plot].points[i].rotation.copy(get_current_camera(i_plot).rotation);
				set_size(i_plot, i, plots[i_plot].points[i].input_data.sphere_size);
			}
		}
		
		if (plots[i_plot].show_grid) {
			update_gridlines(i_plot);
		}
		
		if (plots[i_plot].dynamic_axis_labels) {
			update_axes(i_plot);
		}
		
		get_current_camera(i_plot).updateProjectionMatrix();
		plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
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

var set_color = function(i_plot, i, col) {
	var rgb = hex_to_rgb_obj_255(col);
	
	if (plots[i_plot].geom_type == "point") {
		var colors = plots[i_plot].points_merged.geometry.attributes.color.array;
		plots[i_plot].points_merged.geometry.attributes.color.needsUpdate = true;
		colors[4*i] = rgb.r;
		colors[4*i + 1] = rgb.g;
		colors[4*i + 2] = rgb.b;
		colors[4*i + 3] = 255;
	} else {
		var colors = plots[i_plot].points[i].geometry.attributes.color.array;
		plots[i_plot].points[i].geometry.attributes.color.needsUpdate = true;
		
		for (var i = 0; i < 4; i++) {
			colors[4*i + 0] = rgb.r;
			colors[4*i + 1] = rgb.g;
			colors[4*i + 2] = rgb.b;
			colors[4*i + 3] = 255;
		}
	}
}

var set_label_color = function(i_plot, i, col) {
	var rgb = hex_to_rgb_obj(col);
	plots[i_plot].labels[i].material.uniforms.color.value = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
}

var set_label_background_color = function(i_plot, i, col) {
	var rgb = hex_to_rgb_obj(col);
	plots[i_plot].labels[i].material.uniforms.bg_color.value = new THREE.Vector4(rgb.r, rgb.g, rgb.b, 1.0);
}

var set_size = function(i_plot, i, size, scale_factor) {
	if (plots[i_plot].geom_type == "point") {
		var dot_heights = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
		plots[i_plot].points_merged.geometry.attributes.dot_height.needsUpdate = true;
		
		dot_heights[i] = size;		
	} else {
		if (scale_factor === undefined) {
			var scale_factor = 2 * get_scale_factor(i_plot);
		}
		
		plots[i_plot].points[i].scale.x = scale_factor * size;
		plots[i_plot].points[i].scale.y = scale_factor * size;
	}
}

var update_render = function(i_plot) {
	plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
}

var hide_point = function(i_plot, i) {
	if (plots[i_plot].geom_type == "point") {
		var hide_points = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
		plots[i_plot].points_merged.geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[i] = 1.0;
	} else {
		var hide_points = plots[i_plot].points[i].geometry.attributes.hide_point.array;
		plots[i_plot].points[i].geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[0] = 1.0;
		hide_points[1] = 1.0;
		hide_points[2] = 1.0;
		hide_points[3] = 1.0;
	}
}

var show_point = function(i_plot, i) {
	if (plots[i_plot].geom_type == "point") {
		var hide_points = plots[i_plot].points_merged.geometry.attributes.hide_point.array;
		plots[i_plot].points_merged.geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[i] = 0.0;
	} else {
		var hide_points = plots[i_plot].points[i].geometry.attributes.hide_point.array;
		plots[i_plot].points[i].geometry.attributes.hide_point.needsUpdate = true;
		
		hide_points[0] = 0.0;
		hide_points[1] = 0.0;
		hide_points[2] = 0.0;
		hide_points[3] = 0.0;
	}
}

var hide_label = function(i_plot, i) {
	if (plots[i_plot].points[i].have_label) {
		plots[i_plot].scene.remove(plots[i_plot].labels[i]);
	}
}

var show_label = function(i_plot, i) {
	if (plots[i_plot].points[i].have_label) {
		plots[i_plot].scene.add(plots[i_plot].labels[i]);
	}
}

var prepare_sizes = function(i_plot, params) {
	var i;
	
	var tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	plots[i_plot].have_any_sizes = false;
	plots[i_plot].have_any_labels = false;
	var default_color = (params.hasOwnProperty("default_color")) ? params.default_color : 0xFFFFFF;
	
	if (typeof(default_color) == "string") {
		default_color = css_color_to_hex(default_color, tiny_div);
	}
	
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
		
		if (!params.data[i].hasOwnProperty("color")) {
			params.data[i].color = default_color;
		} else {
			if (typeof(params.data[i].color) == "string") {
				params.data[i].color = css_color_to_hex(params.data[i].color, tiny_div);
			}
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
		
		if (!params.data[i].hasOwnProperty("other")) {
			params.data[i].other = {};
		}
	}
	
	
	if (params.hasOwnProperty("default_point_height")) {
		plots[i_plot].default_point_height = params.default_point_height;
	} else {
		if (!(plots[i_plot].hasOwnProperty("default_point_height"))) {
			plots[i_plot].default_point_height = 20;
		}
	}
	
	
	if (params.hasOwnProperty("size_exponent")) {
		plots[i_plot].size_exponent = 2*params.size_exponent;
	} else {
		if (!(plots[i_plot].hasOwnProperty("size_exponent"))) {
			plots[i_plot].size_exponent = 2;
		}
	}
	
	plots[i_plot].parent_div.removeChild(tiny_div);
}

var make_axes = function(i_plot, params) {
	// Sometimes this will be called when the plot is
	// first initialised; sometimes it will be when the
	// data is updated change_data() calls it.
	
	var i, j, k, l;
	var axes = ["x", "y", "z", "size"];
	
	var fix_axes = false;
	
	var same_scale;
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
	
	for (i = 0; i < params.data.length; i++) {
		if (plots[i_plot].size_exponent == 0) {
			params.data[i].scaled_size = 1;
			
			if (params.hasOwnProperty("size_scale_bound")) {
				params.scaled_size_scale_bound = 1;
			}
		} else {
			params.data[i].scaled_size = Math.pow(params.data[i].size, 1/plots[i_plot].size_exponent);
			
			if (params.hasOwnProperty("size_scale_bound")) {
				params.scaled_size_scale_bound = Math.pow(params.size_scale_bound, 1/plots[i_plot].size_exponent);
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
	
	plots[i_plot].domains = [];
	plots[i_plot].ranges = [];
	plots[i_plot].scales = [];
	
	var adjust_domains;
	
	for (i = 0; i < 3; i++) {
		adjust_domains = true;
		
		if (params.hasOwnProperty(axes[i] + "_scale_bounds")) {
			this_domain = JSON.parse(JSON.stringify(params[axes[i] + "_scale_bounds"]));
			plots[i_plot].domains.push([this_domain[0], this_domain[1]]);
			adjust_domains = false;
		} else {
			plots[i_plot].domains.push(
				[d3.min(params.data, function(d) { return d[axes[i]]; }),
				 d3.max(params.data, function(d) { return d[axes[i]]; })]
			);
		}
			
		this_axis_range = plots[i_plot].domains[i][1] - plots[i_plot].domains[i][0];
		axis_ranges[i] = this_axis_range;
		
		if (this_axis_range == 0) {
			plots[i_plot].domains[i][0] -= plots[i_plot].null_width;
			plots[i_plot].domains[i][1] += plots[i_plot].null_width;
		} else {
			if (adjust_domains) {
				plots[i_plot].domains[i][0] -= 0.1*this_axis_range;
				plots[i_plot].domains[i][1] += 0.1*this_axis_range;
			}
		}
		
		if (fix_axes && same_scale[i]) {
			if (this_axis_range > max_fixed_range) {
				max_fixed_range = this_axis_range;
			}
		}
	}
	
	// Sphere min size extent is always zero.
	if (params.hasOwnProperty("size_scale_bound")) {
		plots[i_plot].domains.push([0, params.scaled_size_scale_bound]);
	} else {
		plots[i_plot].domains.push([0, d3.max(params.data, function(d) { return d.scaled_size; })]);
	}
	
	var axis_scale_factor = [1, 1, 1];
	for (i = 0; i < 3; i++) {
		if (fix_axes && same_scale[i]) {
			axis_scale_factor[i] = axis_ranges[i] / max_fixed_range;
		}
		
		plots[i_plot].ranges.push([-axis_scale_factor[i], axis_scale_factor[i]]);
	}
	
	if (params.hasOwnProperty("max_point_height")) {
		plots[i_plot].max_point_height = params.max_point_height;
	} else {
		if (!plots[i_plot].hasOwnProperty("max_point_height")) {
			plots[i_plot].max_point_height = 25;
		}
	}
	
	plots[i_plot].ranges.push([0, plots[i_plot].max_point_height]);
	
	for (i = 0; i < 4; i++) {
		plots[i_plot].scales.push(
			d3.scaleLinear()
				.domain(plots[i_plot].domains[i])
				.range(plots[i_plot].ranges[i])
		);
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
			axis_tick_values.push(d3.scaleLinear().domain(plots[i_plot].domains[i]).ticks(num_ticks[i]));
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
		d3_formatter = d3.format(tick_formats[i]);
		plots[i_plot].num_ticks.push(axis_tick_values[i].length);
		
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
	//var axis_font_size = (params.hasOwnProperty("axis_font_size")) ? params.axis_font_size : 30;
	
	init_scale = 2 * axis_font_size * plots[i_plot].camera_r * Math.tan(0.5 * plots[i_plot].persp_camera.fov / rad2deg) / plots[i_plot].height;
	//init_scale = 2 * axis_font_size * plots[i_plot].camera_r * Math.tan(0.5 * plots[i_plot].init_fov / rad2deg) / plots[i_plot].height;
	
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

var calculate_locations = function(i_plot, params) {
	var return_object = {};
	return_object.plot_locations = [];
	return_object.null_points = [];
	
	var this_loc, this_size;
	var axes = ["x", "y", "z"];
	
	for (var i = 0; i < params.data.length; i++) {
		return_object.plot_locations.push([]);
		return_object.null_points.push(0);
		
		for (var j = 0; j < 3; j++) {
			return_object.plot_locations[i].push(plots[i_plot].scales[j](params.data[i][axes[j]]));
			
			if (isNaN(return_object.plot_locations[i][j])) {
				return_object.null_points[i] = 1;
			}
		}
		
		if (plots[i_plot].have_any_sizes) {
			if ((params.data[i].size === null) || (isNaN(params.data[i].size))) {
				this_size = plots[i_plot].default_point_height;
			} else {
				if (plots[i_plot].size_exponent != 0) {
					this_size = plots[i_plot].scales[3](params.data[i].scaled_size);
				} else {
					this_size = plots[i_plot].default_point_height;
				}
			}
		} else {
			this_size = plots[i_plot].default_point_height;
		}
		
		return_object.plot_locations[i].push(this_size);
	}
	
	return return_object;
}

var get_colors = function(i_plot, params) {
	var tiny_div = document.createElement("div");
	tiny_div.style.width = "1px";
	tiny_div.style.height = "1px";
	plots[i_plot].parent_div.appendChild(tiny_div);
	
	var colors = [];
	
	for (var i = 0; i < params.data.length; i++) {
		if (!params.data[i].hasOwnProperty("color")) {
			params.data[i].color = default_color;
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

var make_points = function(i_plot, params, plot_locations, null_points) {
	var i, j, font_color, color_obj;
	
	var scale_factor = get_scale_factor(i_plot);
	
	if (plots[i_plot].geom_type == "point") {
		var point_locations = new Float32Array(params.data.length * 3);
		var point_colors = new Uint8Array(params.data.length * 4);
		var hide_points = new Float32Array(params.data.length);
		var dot_heights = new Float32Array(params.data.length);
	}
	
	plots[i_plot].points = [];
	plots[i_plot].point_geoms = [];
	plots[i_plot].points_merged_geom = new THREE.BufferGeometry();
	plots[i_plot].labels = [];
	
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
		
		if (plots[i_plot].geom_type == "point") {
			point_locations[3*i + 0] = isNaN(plot_locations[i][0]) ? 0 : plot_locations[i][0];
			point_locations[3*i + 1] = isNaN(plot_locations[i][1]) ? 0 : plot_locations[i][1];
			point_locations[3*i + 2] = isNaN(plot_locations[i][2]) ? 0 : plot_locations[i][2];
			
			dot_heights[i] = plot_locations[i][3];
			
			point_colors[4*i + 0] = color_obj.r;
			point_colors[4*i + 1] = color_obj.g;
			point_colors[4*i + 2] = color_obj.b;
			point_colors[4*i + 3] = 255; //alpha
			
			hide_points[i] = 0;
			plots[i_plot].points.push({});
		} else {
			// Quad.
			
			plots[i_plot].points.push(new THREE.Mesh(
				new THREE.PlaneBufferGeometry(1, 1, 1),
				plots[i_plot].quad_material
			));
			
			plots[i_plot].points[i].point_colors = new Uint8Array(16);
			plots[i_plot].points[i].hide_points = new Float32Array(4);
			plots[i_plot].points[i].null_points = new Float32Array(4);
			
			// Need to copy the values across each of the four vertices
			// for the shader to work properly.
			for (j = 0; j < 4; j++) {
				plots[i_plot].points[i].point_colors[4*j + 0] = color_obj.r;
				plots[i_plot].points[i].point_colors[4*j + 1] = color_obj.g;
				plots[i_plot].points[i].point_colors[4*j + 2] = color_obj.b;
				plots[i_plot].points[i].point_colors[4*j + 3] = 255;
				
				plots[i_plot].points[i].hide_points[j] = 0;
				plots[i_plot].points[i].null_points[j] = null_points[i];
			}
			
			plots[i_plot].points[i].position.x = plot_locations[i][0];
			plots[i_plot].points[i].position.y = plot_locations[i][1];
			plots[i_plot].points[i].position.z = plot_locations[i][2];
			
			plots[i_plot].points[i].scale.x = 2 * scale_factor * plot_locations[i][3];
			plots[i_plot].points[i].scale.y = 2 * scale_factor * plot_locations[i][3];
			
			plots[i_plot].points[i].rotation.copy(get_current_camera(i_plot).rotation);
			
			plots[i_plot].points[i].geometry.addAttribute("color", new THREE.BufferAttribute(plots[i_plot].points[i].point_colors, 4, true));
			plots[i_plot].points[i].geometry.addAttribute("hide_point", new THREE.BufferAttribute(plots[i_plot].points[i].hide_points, 1));
			plots[i_plot].points[i].geometry.addAttribute("null_point", new THREE.BufferAttribute(plots[i_plot].points[i].null_points, 1));
			
			plots[i_plot].scene.add(plots[i_plot].points[i]);
		}
		
		if (plots[i_plot].have_any_labels) {
			plots[i_plot].points[i].have_label = false;
			
			if (params.data[i].label.length > 0) {
				plots[i_plot].points[i].have_label = true;
				
				plots[i_plot].labels.push(
					make_label_text_plane(
						params.data[i].label,
						plots[i_plot].font,
						plots[i_plot].label_font_size,
						use_white,
						plots[i_plot].bg_color_hex,
						i_plot
				));
				
				plots[i_plot].labels[i].material.uniforms.color.value = new THREE.Vector4(color_obj.r/255, color_obj.g/255, color_obj.b/255, 1.0);
				
				plots[i_plot].labels[i].position.set(plot_locations[i][0], plot_locations[i][1], plot_locations[i][2]);
				plots[i_plot].labels[i].scale.set(plots[i_plot].init_label_scale, plots[i_plot].init_label_scale, 1);
				
				plots[i_plot].show_label = show_labels;
				if (show_labels && !null_points[i]) {
					plots[i_plot].scene.add(plots[i_plot].labels[i]);
				}
			} else {
				plots[i_plot].labels.push(null);
			}
		}
		
		// Some more properties added to the object for use in mouseovers etc.
		plots[i_plot].points[i].input_data = {};
		plots[i_plot].points[i].input_data.other = JSON.parse(JSON.stringify(params.data[i].other));
	}
	
	update_input_data(i_plot, params, plot_locations);
	
	if (plots[i_plot].geom_type == "point") {
		plots[i_plot].points_merged_geom.addAttribute("position", new THREE.BufferAttribute(point_locations, 3));
		plots[i_plot].points_merged_geom.addAttribute("color", new THREE.BufferAttribute(point_colors, 4, true));
		plots[i_plot].points_merged_geom.addAttribute("dot_height", new THREE.BufferAttribute(dot_heights, 1));
		plots[i_plot].points_merged_geom.addAttribute("hide_point", new THREE.BufferAttribute(hide_points, 1));
		plots[i_plot].points_merged_geom.addAttribute("null_point", new THREE.BufferAttribute(null_points, 1));
		plots[i_plot].points_merged = new THREE.Points(plots[i_plot].points_merged_geom, plots[i_plot].point_material);
		
		plots[i_plot].scene.add(plots[i_plot].points_merged);
	}
		
	if (plots[i_plot].have_any_labels) {
		update_labels(i_plot);
	}
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
	var i, j, t;
	
	if (plots[i_plot].transition_t > 1) { plots[i_plot].transition_t = 1; }
	t = smoothstep(plots[i_plot].transition_t);
	
	if (plots[i_plot].geom_type == "point") {
		var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
		var sizes = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
		var colors = plots[i_plot].points_merged.geometry.attributes.color.array;
	} else {
		var this_size, colors;
		var scale_factor = 2 * get_scale_factor(i_plot);
	}
	
	var new_color, this_color, r, g, b;
	
	for (i = 0; i < plots[i_plot].points.length; i++) {
		new_color = hex_to_rgb_obj_255(plots[i_plot].new_colors[i]);
		this_size = t*plots[i_plot].new_locations[i][3] + (1 - t)*plots[i_plot].old_heights[i];
		
		r = Math.round(t*new_color.r + (1 - t)*plots[i_plot].old_colors[4*i + 0]);
		g = Math.round(t*new_color.g + (1 - t)*plots[i_plot].old_colors[4*i + 1]);
		b = Math.round(t*new_color.b + (1 - t)*plots[i_plot].old_colors[4*i + 2]);
		
		this_color = (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b);
		
		set_color(i_plot, i, this_color);
		if (plots[i_plot].points[i].have_label) {
			set_label_color(i_plot, i, this_color);
		}
		
		set_size(i_plot, i, this_size, scale_factor);
		
		if (plots[i_plot].geom_type == "point") {
			positions[3*i + 0] = t*plots[i_plot].new_locations[i][0] + (1 - t)*plots[i_plot].old_positions[3*i + 0];
			positions[3*i + 1] = t*plots[i_plot].new_locations[i][1] + (1 - t)*plots[i_plot].old_positions[3*i + 1];
			positions[3*i + 2] = t*plots[i_plot].new_locations[i][2] + (1 - t)*plots[i_plot].old_positions[3*i + 2];
		} else {
			// Quads.
			plots[i_plot].points[i].position.x = t*plots[i_plot].new_locations[i][0] + (1 - t)*plots[i_plot].old_positions[i].x;
			plots[i_plot].points[i].position.y = t*plots[i_plot].new_locations[i][1] + (1 - t)*plots[i_plot].old_positions[i].y;
			plots[i_plot].points[i].position.z = t*plots[i_plot].new_locations[i][2] + (1 - t)*plots[i_plot].old_positions[i].z;
		}
	}
	
	if (plots[i_plot].geom_type == "point") {
		plots[i_plot].points_merged.geometry.attributes.position.needsUpdate = true;
	}
	
	if (plots[i_plot].have_any_labels) {
		update_labels(i_plot);
	}
	
	update_render(i_plot);
	
	if (plots[i_plot].transition_t < 1) {
		plots[i_plot].transition_t += 1/60;
		requestAnimationFrame(animate_transition_wrapper(i_plot));
	}
}

var update_input_data = function(i_plot, params, locations) {
	for (var i = 0; i < plots[i_plot].points.length; i++) {
		plots[i_plot].points[i].input_data.i = i;
		plots[i_plot].points[i].input_data.x = params.data[i].x;
		plots[i_plot].points[i].input_data.y = params.data[i].y;
		plots[i_plot].points[i].input_data.z = params.data[i].z;
		plots[i_plot].points[i].input_data.size = params.data[i].size;
		plots[i_plot].points[i].input_data.scaled_size = params.data[i].scaled_size;
		plots[i_plot].points[i].input_data.sphere_size = locations[i][3];
		plots[i_plot].points[i].input_data.color = params.data[i].color;
		plots[i_plot].points[i].input_data.label = params.data[i].label;
	}
}

var change_data = function(i_plot, params, new_dataset, animate) {
	var i, j;
	
	if (new_dataset === undefined) {
		// Try a smooth transition if not otherwise specified.
		new_dataset = false;
		animate = true;
	}
	
	if (animate === undefined) { animate = true; }
	
	if (params.data.length != plots[i_plot].points.length) {
		animate = false;
		new_dataset = true;
	}
	
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
	
	if (new_dataset) {
		// Clear the scene.
		for (i = plots[i_plot].scene.children.length; i >= 0; i--) {
			plots[i_plot].scene.remove(plots[i_plot].scene.children[i]);
		}
		
		if (plots[i_plot].have_any_labels) {
			plots[i_plot].labels = [];
			plots[i_plot].have_any_labels = false;
		}
		
		plots[i_plot].scene.remove(plots[i_plot].points_merged);
		
		prepare_sizes(i_plot, params);
		make_axes(i_plot, params);
		
		var temp_obj = calculate_locations(i_plot, params);
		var plot_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
		
		// The usual JSON.parse trick doesn't work on the Float32Array I guess?
		var null_points = new Float32Array(params.data.length);
		for (i = 0; i < params.data.length; i++) {
			null_points[i] = temp_obj.null_points[i];
		}
		
		make_points(i_plot, params, plot_locations, null_points);
		update_render(i_plot);
	} else {
		// Labels will stay the same.
		for (i = 0; i < plots[i_plot].points.length; i++) {
			if (plots[i_plot].points[i].have_label) {
				params.data[i].label = plots[i_plot].points[i].input_data.label;
			}
		}
		
		prepare_sizes(i_plot, params);
		make_axes(i_plot, params);
		
		if (plots[i_plot].geom_type == "point") {
			var positions = plots[i_plot].points_merged.geometry.attributes.position.array;
			var sizes = plots[i_plot].points_merged.geometry.attributes.dot_height.array;
			var null_points = plots[i_plot].points_merged.geometry.attributes.null_point.array;
			var colors = plots[i_plot].points_merged.geometry.attributes.color.array;
		} else {
			var colors, null_points;
			var scale_factor = get_scale_factor(i_plot);
		}
		
		if (animate) {
			plots[i_plot].old_positions = [];
			plots[i_plot].old_heights = [];
			plots[i_plot].old_colors = [];
			
			for (i = 0; i < plots[i_plot].points.length; i++) {
				if (plots[i_plot].geom_type == "point") {
					plots[i_plot].old_positions[3*i + 0] = positions[3*i + 0];
					plots[i_plot].old_positions[3*i + 1] = positions[3*i + 1];
					plots[i_plot].old_positions[3*i + 2] = positions[3*i + 2];
					
					plots[i_plot].old_colors[4*i + 0] = colors[4*i + 0];
					plots[i_plot].old_colors[4*i + 1] = colors[4*i + 1];
					plots[i_plot].old_colors[4*i + 2] = colors[4*i + 2];
					plots[i_plot].old_colors[4*i + 3] = colors[4*i + 3];
					
					plots[i_plot].old_heights[i] = sizes[i];
				} else {
					plots[i_plot].old_positions.push(JSON.parse(JSON.stringify(plots[i_plot].points[i].position)));
					
					colors = plots[i_plot].points[i].geometry.attributes.color.array;
					
					plots[i_plot].old_colors[4*i + 0] = colors[0];
					plots[i_plot].old_colors[4*i + 1] = colors[1];
					plots[i_plot].old_colors[4*i + 2] = colors[2];
					plots[i_plot].old_colors[4*i + 3] = colors[3];
					
					plots[i_plot].old_heights[i] = plots[i_plot].points[i].scale.x / (2 * scale_factor);
				}
				
			}
			
			var temp_obj = calculate_locations(i_plot, params);
			plots[i_plot].new_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
			
			plots[i_plot].new_colors = get_colors(i_plot, params);
			
			for (i = 0; i < plots[i_plot].points.length; i++) {
				if (plots[i_plot].geom_type == "point") {
					null_points[i] = temp_obj.null_points[i];
					
					if (plots[i_plot].points[i].have_label && null_points[i]) {
						plots[i_plot].scene.remove(plots[i_plot].labels[i]);
					}
				} else {
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
			}
			
			
			if (plots[i_plot].geom_type == "point") {
				plots[i_plot].points_merged.geometry.attributes.null_point.needsUpdate = true;
			}
			
			plots[i_plot].transition_t = 0;
			
			update_input_data(i_plot, params, plots[i_plot].new_locations);
			
			animate_transition(i_plot);
		} else {
			var temp_obj = calculate_locations(i_plot, params);
			
			var plot_locations = temp_obj.plot_locations;
			var new_null_points = temp_obj.null_points;
			
			var new_colors = get_colors(i_plot, params);
			var color_obj;
			
			for (i = 0; i < plots[i_plot].points.length; i++) {
				set_color(i_plot, i, params.data[i].color);
				set_size(i_plot, i, plot_locations[i][3], scale_factor);
				
				if (plots[i_plot].geom_type == "point") {
					positions[3*i + 0] = plot_locations[i][0];
					positions[3*i + 1] = plot_locations[i][1];
					positions[3*i + 2] = plot_locations[i][2];
					
					null_points[i] = new_null_points[i];
				} else {
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
			}
			
			if (plots[i_plot].geom_type == "point") {
				plots[i_plot].points_merged.geometry.attributes.position.needsUpdate = true;
				plots[i_plot].points_merged.geometry.attributes.null_point.needsUpdate = true;
			}
			
			update_input_data(i_plot, params, plot_locations);
			
			if (plots[i_plot].have_any_labels) {
				update_labels(i_plot);
			}
			
			update_render(i_plot);
		}
	}
}

var make_scatter = function(params) {
	// First check if the browser supports WebGL.
	// https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
	
	var canvas = document.createElement("canvas");
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (!(gl && gl instanceof WebGLRenderingContext)) {
		// Fallback.
		var div_html = "";
		if (params.hasOwnProperty("fallback_image")) {
			div_html = "<img src=\"" + params.fallback_image + "\">";
		} else {
			div_html = "Sorry, you do not have WebGL enabled.";
		}
		
		var div = document.getElementById(params.div_id);
		div.innerHTML = div_html;
		return;
	}
	
	plots.push({});
	var i_plot = plots.length - 1;
	
	var point_type = (params.hasOwnProperty("point_type")) ? params.point_type : "sphere";
	
	if (point_type == "custom") {
		if (!(params.hasOwnProperty("custom_point"))) {
			point_type = "sphere";
		}
	}
	
	// Wait till the texture is loaded before doing everything else.
	var image_src;
	
	if (point_type == "sphere") {
		image_src = "data:image/png;base64, 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";
	} else if (point_type == "plus") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAWxJREFUeJzt3TEOAyEMAEGc//+Z+wJNQnSzU1NYaOWChlmIvfc+OTcz8+1Z/snn9gC5qwBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAG5Of9TMO7UBcAWAKwBcAeAKAFcAuALAFQCuAHBze4BfOX3xnBnmTtZqA/AKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgHM9UM+rJflrUAAAAASUVORK5CYII=";
	} else if (point_type == "square") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABHNCSVQICAgIfAhkiAAAABZJREFUCJlj/P///38GJMDEgAYICwAABl0EBLhJJOwAAAAASUVORK5CYII=";
	} else if (point_type == "circle") {
		image_src = "data:image/png;base64, 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";
	} else if (point_type == "cross") {
		image_src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAABG9JREFUeJztnUlyGzEMAJv5/5+dQ8KUl2g0QywEQPQtXkiMu12xJEoaHx8fH1wwxhhXn29i8s4r/HE77n6hzliNB3ecTn5pL9js5amrWwGsLNz4s+LodgCrGzQ+rLp5FIBkoyYmjwOAjiAaqz7GGGMpAMmmjS4S+QBDssjnhRp/pPLhbwCSxb4v2PigIR8+BSBZ9H8LN3ZoyYdvAUgWf7VBo4umfPhPAJJNrjZq5GjLhxcBSDZ7t2GzhoV8uAhAsumdjZv7WMmHNwFINr87QHONpXy4EYBkiCeDND+xlg83A5AMAx3BCh7y4UEA0BF44SUfHgYAHYE1nvJhIQDoCKzwlg+LAUBHoM0O+SAIADoCLXbJB2EA0BFI2SkfFAKAjmCV3fJBKQDoCJ4SQT4oBgAdwV2iyAflAKAjeEck+WAQAHQEr4gmH4wCgI7gOxHlg2EA0BFMosoH4wCgI4gsHxwCgHMjiC4fnAKA8yLIIB8cA4BzIsgiH5wDgPoRZJIPGwKAuhFkkw+bAoB6EWSUDxsDgDoRZJUPmwOA/BFklg8BAoC8EWSXD0ECgHwRVJAPgQKAPBFUkQ/BAoD4EVSSDwEDgLgRVJMPQQOAeBFUlA+BA4A4EVSVD8EDgP0RVJYPCQKAfRFUlw9JAgD/CE6QD4kCAL8ITpEPyQIA+whOkg8JAwC7CE6TD0kDAP0ITpQPiQMAvQhOlQ/JAwB5BCfLhwIBgP+bV1SRD0UCAL8IKsmHQgGAfQTV5EOxAMAugoryoWAAoB9BVflQNADQi6CyfCgcAMgjqC4fFt84MgsnCJRS+gek8d9A9YjKXpzmH4KVIyh5YRY3BatGUO6iLO8MqhhBqQvyuDu4WgRlLsbzAaFKEZS4EO9HA6FOBOkvQvp4/u7nHewm9QVoHeY4OYK0w2uf5Dk1gpSDWx3jOjGCdENbn+E7LYJUA3sd4DwpgjTDep/ePSWCFIPuOrp9QgThh9x9br96BKEH3C1fOofFLNqEHS6K/EnVCEIOFk3+pGIE4YaKKn9SLYJQA0WXP6kUQZhhssifVIkgxCDZ5E8qRLB9iKzyJ9kjSPkbFOEH95nMEWzbvIr8SdYIUv0BFVX+JGME7ptWlT/JFkGK289Z5E8yReC22SnyJ1kiCH33aVb5kwwRmG9yqvxJ9AhCPnpWRf4kcgRmi7f8r0SNINThiaryJxEjUF+05V8TLYIQZ+dOkT+JFIHaYi3/GVEi2Hp0+lT5kwgRiBdp+TJ2R7DlmTMt/ys7I1j+5pavy64IXJ842fKv2RHB429q+bZ4R+DyvPmW/wzPCG5/ccv3xSsC05dNafkyPCJ4+0Utfy/WEZi8albL18UygpefbPmxsIpA9UUTW74tFhH8+GDLj412BF8+0PJzoBnBv3+0/FxoRTAki7X8vWhEMFp+bqQRLAXQ8mMhieDxO4e2/HhInJR+69iTWI3gUQD92x+bFT+3A2j5OXjq6VYALT8XT3y9DaDl5+TReYBXNyNafn6ubiKOMcZv9DyMv2rLebEAAAAASUVORK5CYII=";
	} else if (point_type == "custom") {
		image_src = params.custom_point;
	}
	
	plots[i_plot].texture = new THREE.TextureLoader().load(image_src, function () { make_scatter_main(params); });
}

var make_scatter_main = function(params) {
	var i, j, k, l;
	var i_plot = plots.length - 1;
	
	plots[i_plot].texture.flipY = true;
	
	// A variable for possible use in the touch controls.
	plots[i_plot].old_t = Date.now();
	
	// First up, preparing the area.
	
	plots[i_plot].parent_div = document.getElementById(params.div_id);
	plots[i_plot].container_height = plots[i_plot].parent_div.offsetHeight;
	
	plots[i_plot].scene = new THREE.Scene();
	
	plots[i_plot].container_width = plots[i_plot].parent_div.offsetWidth;
	plots[i_plot].renderer = new THREE.WebGLRenderer({"antialias": true});

	plots[i_plot].renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	
	var make_toggles = (params.hasOwnProperty("show_toggles")) ? params.show_toggles : true;
	var make_snaps = (params.hasOwnProperty("show_snaps")) ? params.show_snaps : true;
	
	var toggle_div = document.createElement("div");
	toggle_div.id = "div_toggle_scatter_" + i_plot;
	var div_html = "";
	
	if (make_toggles) {
		var camera_img = "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";
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
	
	if (make_snaps) {
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
	
	if (make_toggles || make_snaps) {
		toggle_div.innerHTML = div_html;
		plots[i_plot].parent_div.appendChild(toggle_div);
	}
	
	plots[i_plot].geom_type = (params.hasOwnProperty("geom_type")) ? params.geom_type : "quad";
	
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
	
	prepare_sizes(i_plot, params);
	
	// Set up the camera(s).
	
	plots[i_plot].camera_lonlat = [-3*tau/8, tau/8];
	if (params.hasOwnProperty("init_lonlat")) {
		plots[i_plot].camera_lonlat = JSON.parse(JSON.stringify(params.init_lonlat));
	}
	
	plots[i_plot].init_lonlat = JSON.parse(JSON.stringify(plots[i_plot].camera_lonlat));
	plots[i_plot].camera_rot = params.hasOwnProperty("init_camera_rot") ? params.init_camera_rot : 0;
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
	var is_perspective = (plots[i_plot].view_type == "perspective") ? 1 : 0;
	
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
	
	reset_camera(
		i_plot,
		true,
		[plots[i_plot].camera_lonlat[0], plots[i_plot].camera_lonlat[1], plots[i_plot].camera_rot],
		plots[i_plot].init_origin);
	
	
	// Preparing the font for labels etc.
	
	var font = (params.hasOwnProperty("font")) ? params.font : "Arial, sans-serif";
	plots[i_plot].font = font;
	
	var test_font_size = 96;
	// The 1.08 is a fudge factor; the get_font_height() function doesn't really work.
	plots[i_plot].font_ratio = 1.08 * get_font_height("font-family: " + font + "; font-size: " + test_font_size + "px", plots[i_plot].parent_div) / test_font_size;
	
	make_axes(i_plot, params);
	
	var temp_obj = calculate_locations(i_plot, params);
	var plot_locations = JSON.parse(JSON.stringify(temp_obj.plot_locations));
	
	// The usual JSON.parse trick doesn't work on the Float32Array I guess?
	//var null_points = JSON.parse(JSON.stringify(temp_obj.null_points));
	var null_points = new Float32Array(params.data.length);
	for (i = 0; i < params.data.length; i++) {
		null_points[i] = temp_obj.null_points[i];
	}
	
	plots[i_plot].mouse = new THREE.Vector2();
	plots[i_plot].raycaster = new THREE.Raycaster();
	
	var pixel_ratio = window.devicePixelRatio ? window.devicePixelRatio : 1.0;
	
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
	
	plots[i_plot].quad_material = new THREE.ShaderMaterial({
		"uniforms": {
			"texture": {"type": "t", "value": plots[i_plot].texture}
		},
		"vertexShader":   shader_quads_vertex,
		"fragmentShader": shader_quads_fragment
	});
	
	make_points(i_plot, params, plot_locations, null_points);
	
	plots[i_plot].have_mouseover = false;
	plots[i_plot].have_mouseout = false;
	plots[i_plot].have_click = false;
	plots[i_plot].clicked_i = -1;
	plots[i_plot].mouseover_i = -1;
	
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
	
	
	plots[i_plot].renderer.render(plots[i_plot].scene, get_current_camera(i_plot));
	
	plots[i_plot].parent_div.removeChild(tiny_div);
	plots[i_plot].mouse_operation = "none";
	plots[i_plot].two_finger_operation = "none";
	
	plots[i_plot].renderer.domElement.addEventListener("mousedown", mouse_down_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("mouseup", mouse_up_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("mouseout", mouse_up_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("mousemove", mouse_move_wrapper(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("wheel", mouse_zoom_wrapper(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("touchstart", touch_start_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("touchmove", touch_move_fn(i_plot));
	plots[i_plot].renderer.domElement.addEventListener("touchend", touch_end_fn(i_plot));
	
	if (make_toggles) {
		document.getElementById("icon_three_d_scatter_camera_" + i_plot).addEventListener("click", toggle_camera(i_plot));
		document.getElementById("icon_three_d_scatter_grid_" + i_plot).addEventListener("click", toggle_grid(i_plot));
		document.getElementById("icon_three_d_scatter_ticks_" + i_plot).addEventListener("click", toggle_ticks(i_plot));
		document.getElementById("icon_three_d_scatter_axis_title_" + i_plot).addEventListener("click", toggle_axis_titles(i_plot));
		document.getElementById("icon_three_d_scatter_box_" + i_plot).addEventListener("click", toggle_box(i_plot));
	}
	
	if (make_snaps) {
		document.getElementById("icon_three_d_scatter_snap_home_" + i_plot).addEventListener("click",
			reset_camera_wrapper(
				i_plot,
				false,
				[plots[i_plot].init_lonlat[0], plots[i_plot].init_lonlat[1], plots[i_plot].camera_rot],
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
exports.set_color = set_color;
exports.set_label_color = set_label_color;
exports.set_label_background_color = set_label_background_color;
exports.set_size = set_size;
exports.update_render = update_render;
exports.hide_point = hide_point;
exports.show_point = show_point;
exports.hide_label = hide_label;
exports.show_label = show_label;
exports.prepare_sizes = prepare_sizes;
exports.make_axes = make_axes;
exports.calculate_locations = calculate_locations;
exports.get_colors = get_colors;
exports.make_points = make_points;
exports.smoothstep = smoothstep;
exports.animate_transition_wrapper = animate_transition_wrapper;
exports.animate_transition = animate_transition;
exports.update_input_data = update_input_data;
exports.change_data = change_data;
exports.make_scatter = make_scatter;
exports.make_scatter_main = make_scatter_main;
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
