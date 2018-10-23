/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008, 2009 Anthony Ricaud <rik@webkit.org>
 * Copyright (C) 2009 Google Inc. All rights reserved.
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
WebInspector.TimelineGrid=function(){this.element=document.createElement("div"),this._itemsGraphsElement=document.createElement("div"),this._itemsGraphsElement.id="resources-graphs",this.element.appendChild(this._itemsGraphsElement),this._dividersElement=document.createElement("div"),this._dividersElement.className="resources-dividers",this.element.appendChild(this._dividersElement),this._eventDividersElement=document.createElement("div"),this._eventDividersElement.className="resources-event-dividers",this.element.appendChild(this._eventDividersElement),this._dividersLabelBarElement=document.createElement("div"),this._dividersLabelBarElement.className="resources-dividers-label-bar",this.element.appendChild(this._dividersLabelBarElement)},WebInspector.TimelineGrid.prototype={get itemsGraphsElement(){return this._itemsGraphsElement},updateDividers:function(e,t,i){var s=Math.round(this._dividersElement.offsetWidth/64),d=t.boundarySpan/s;if(!e&&this._currentDividerSlice===d)return!1;"number"!=typeof i&&(i=0),this._currentDividerSlice=d;for(
// Reuse divider elements and labels.
var l=this._dividersElement.firstChild,n=this._dividersLabelBarElement.firstChild,r=this._dividersLabelBarElement.clientWidth,a=r-i,v=i?0:1;v<=s;++v){if(!l){(l=document.createElement("div")).className="resources-divider",this._dividersElement.appendChild(l),(n=document.createElement("div")).className="resources-divider";var m=document.createElement("div");m.className="resources-divider-label",n._labelElement=m,n.appendChild(m),this._dividersLabelBarElement.appendChild(n),r=this._dividersLabelBarElement.clientWidth}v===(i?0:1)?(l.addStyleClass("first"),n.addStyleClass("first")):(l.removeStyleClass("first"),n.removeStyleClass("first")),v===s?(l.addStyleClass("last"),n.addStyleClass("last")):(l.removeStyleClass("last"),n.removeStyleClass("last"));var h=100*(i+a*(v/s))/r;this._setDividerAndBarLeft(l,n,h),isNaN(d)?n._labelElement.textContent="":n._labelElement.textContent=t.formatValue(d*v),l=l.nextSibling,n=n.nextSibling}
// Remove extras.
for(;l;){var o=l.nextSibling;this._dividersElement.removeChild(l),l=o}for(;n;){o=n.nextSibling;this._dividersLabelBarElement.removeChild(n),n=o}return!0},_setDividerAndBarLeft:function(e,t,i){var s=parseFloat(e.style.left);!isNaN(s)&&Math.abs(s-i)<.1||(e.style.left=i+"%",t.style.left=i+"%")},addEventDivider:function(e){this._eventDividersElement.appendChild(e)},addEventDividers:function(e){this.element.removeChild(this._eventDividersElement);for(var t=0;t<e.length;++t)e[t]&&this._eventDividersElement.appendChild(e[t]);this.element.appendChild(this._eventDividersElement)},removeEventDividers:function(){this._eventDividersElement.removeChildren()},hideEventDividers:function(){this._eventDividersElement.addStyleClass("hidden")},showEventDividers:function(){this._eventDividersElement.removeStyleClass("hidden")},setScrollAndDividerTop:function(e,t){this._dividersElement.style.top=e+"px",this._eventDividersElement.style.top=e+"px",this._dividersLabelBarElement.style.top=t+"px"}};