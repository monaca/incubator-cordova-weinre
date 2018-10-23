/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008, 2009 Anthony Ricaud <rik@webkit.org>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.SummaryBar=function(e){this.categories=e,this.element=document.createElement("div"),this.element.className="summary-bar",this.graphElement=document.createElement("canvas"),this.graphElement.setAttribute("width","450"),this.graphElement.setAttribute("height","38"),this.graphElement.className="summary-graph",this.element.appendChild(this.graphElement),this.legendElement=document.createElement("div"),this.legendElement.className="summary-graph-legend",this.element.appendChild(this.legendElement)},WebInspector.SummaryBar.prototype={get calculator(){return this._calculator},set calculator(e){this._calculator=e},reset:function(){this.legendElement.removeChildren(),this._drawSummaryGraph()},update:function(e){var t=this.calculator.computeSummaryValues(e),a=[];for(var r in this.legendElement.removeChildren(),this.categories){var l=t.categoryValues[r];if(l){var o=this.categories[r].color,n={color:o,value:l};a.push(n);var i=this._makeLegendElement(this.categories[r].title,this.calculator.formatValue(l),o);this.legendElement.appendChild(i)}}if(t.total){var s=this._makeLegendElement(WebInspector.UIString("Total"),this.calculator.formatValue(t.total));s.addStyleClass("total"),this.legendElement.appendChild(s)}this._drawSummaryGraph(a)},_drawSwatch:function(e,t){var a=e.getContext("2d");function r(){a.fillStyle=t,a.fillRect(0,0,13,13);var e=a.createLinearGradient(0,0,13,13);e.addColorStop(0,"rgba(255, 255, 255, 0.2)"),e.addColorStop(1,"rgba(255, 255, 255, 0.0)"),a.fillStyle=e,a.fillRect(0,0,13,13),(e=a.createLinearGradient(13,13,0,0)).addColorStop(0,"rgba(0, 0, 0, 0.2)"),e.addColorStop(1,"rgba(0, 0, 0, 0.0)"),a.fillStyle=e,a.fillRect(0,0,13,13),a.strokeStyle="rgba(0, 0, 0, 0.6)",a.strokeRect(.5,.5,12,12)}a.clearRect(0,0,13,24),r(),a.save(),a.translate(0,25),a.scale(1,-1),r(),a.restore(),this._fadeOutRect(a,0,13,13,13,.5,0)},_drawSummaryGraph:function(o){o&&o.length?delete this._showingEmptySummaryGraph:(o=[{color:"white",value:1}],this._showingEmptySummaryGraph=!0);
// Calculate the total of all segments.
for(var t=0,e=0;e<o.length;++e)t+=o[e].value;
// Calculate the percentage of each segment, rounded to the nearest percent.
var n=o.map(function(e){return Math.max(Math.round(100*e.value/t),1)}),a=0;
// Calculate the total percentage.
for(e=0;e<n.length;++e)a+=n[e];
// Make sure our percentage total is not greater-than 100, it can be greater
// if we rounded up for a few segments.
for(;100<a;)for(e=0;e<n.length&&100<a;++e)1<n[e]&&(--n[e],--a);
// Make sure our percentage total is not less-than 100, it can be less
// if we rounded down for a few segments.
for(;a<100;)for(e=0;e<n.length&&a<100;++e)++n[e],++a;var i=this.graphElement.getContext("2d"),s=0,h=0,d=450,c=19,m=c/2;function r(){
// Make a rounded rect path.
i.beginPath(),i.moveTo(s,h+m),i.lineTo(s,h+c-m),i.arc(s+m,h+c-m,m,Math.PI,Math.PI/2,!0),i.lineTo(s+d-m,h+c),i.arc(s+d-m,h+c-m,m,Math.PI/2,0,!0),i.lineTo(s+d,h+m),i.arc(s+d-m,h+m,m,0,3*Math.PI/2,!0),i.lineTo(s+m,h),i.arc(s+m,h+m,m,Math.PI/2,Math.PI,!0),i.closePath(),
// Clip to the rounded rect path.
i.save(),i.clip();for(
// Fill the segments with the associated color.
var e=0,t=0;t<o.length;++t){var a=Math.round(d*n[t]/100);i.fillStyle=o[t].color,i.fillRect(s+e,h,a,c),e+=a}
// Draw the segment divider lines.
for(t=i.lineWidth=1;t<20;++t)i.beginPath(),i.moveTo(s+t*Math.round(d/20)+.5,h),i.lineTo(s+t*Math.round(d/20)+.5,h+c),i.closePath(),i.strokeStyle="rgba(0, 0, 0, 0.2)",i.stroke(),i.beginPath(),i.moveTo(s+t*Math.round(d/20)+1.5,h),i.lineTo(s+t*Math.round(d/20)+1.5,h+c),i.closePath(),i.strokeStyle="rgba(255, 255, 255, 0.2)",i.stroke();
// Draw the pill shading.
var r=i.createLinearGradient(s,h,s,h+c/1.5);r.addColorStop(0,"rgba(220, 220, 220, 0.6)"),r.addColorStop(.4,"rgba(220, 220, 220, 0.2)"),r.addColorStop(1,"rgba(255, 255, 255, 0.0)");var l=i.createLinearGradient(s,h+c/3,s,h+c);l.addColorStop(0,"rgba(0, 0, 0, 0.0)"),l.addColorStop(.8,"rgba(0, 0, 0, 0.2)"),l.addColorStop(1,"rgba(0, 0, 0, 0.5)"),i.fillStyle=l,i.fillRect(s,h,d,c),i.fillStyle=r,i.fillRect(s,h,d,c),i.restore()}i.clearRect(s,h,d,2*c),
// This draws a line with a shadow that is offset away from the line. The line is stroked
// twice with different X shadow offsets to give more feathered edges. Later we erase the
// line with destination-out 100% transparent black, leaving only the shadow. This only
// works if nothing has been drawn into the canvas yet.
i.beginPath(),i.moveTo(s+4,h+c-3-.5),i.lineTo(s+d-4,h+c-3-.5),i.closePath(),i.save(),i.shadowBlur=2,i.shadowColor="rgba(0, 0, 0, 0.5)",i.shadowOffsetX=3,i.shadowOffsetY=5,i.strokeStyle="white",i.lineWidth=1,i.stroke(),i.shadowOffsetX=-3,i.stroke(),i.restore(),i.save(),i.globalCompositeOperation="destination-out",i.strokeStyle="rgba(0, 0, 0, 1)",i.lineWidth=1,i.stroke(),i.restore(),r(),i.save(),i.translate(0,2*c+1),i.scale(1,-1),r(),i.restore(),this._fadeOutRect(i,s,h+c+1,d,c,.5,0)},_fadeOutRect:function(e,t,a,r,l,o,n){e.save();var i=e.createLinearGradient(t,a,t,a+l);i.addColorStop(0,"rgba(0, 0, 0, "+(1-o)+")"),i.addColorStop(.8,"rgba(0, 0, 0, "+(1-n)+")"),i.addColorStop(1,"rgba(0, 0, 0, 1.0)"),e.globalCompositeOperation="destination-out",e.fillStyle=i,e.fillRect(t,a,r,l),e.restore()},_makeLegendElement:function(e,t,a){var r=document.createElement("label");if(r.className="summary-graph-legend-item",a){var l=document.createElement("canvas");l.className="summary-graph-legend-swatch",l.setAttribute("width","13"),l.setAttribute("height","24"),r.appendChild(l),this._drawSwatch(l,a)}var o=document.createElement("div");o.className="summary-graph-legend-label",r.appendChild(o);var n=document.createElement("div");n.className="summary-graph-legend-header",n.textContent=e,o.appendChild(n);var i=document.createElement("div");return i.className="summary-graph-legend-value",i.textContent=t,o.appendChild(i),r}},WebInspector.SummaryBar.prototype.__proto__=WebInspector.Object.prototype;