/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
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
WebInspector.ImageView=function(e){WebInspector.ResourceView.call(this,e),this.element.addStyleClass("image")},WebInspector.ImageView.prototype={hasContent:function(){return!0},show:function(e){WebInspector.ResourceView.prototype.show.call(this,e),this._createContentIfNeeded()},_createContentIfNeeded:function(){if(!this._container){var e=document.createElement("div");e.className="image",this.element.appendChild(e);var o=document.createElement("img");o.addStyleClass("resource-image-view"),e.appendChild(o),this._container=document.createElement("div"),this._container.className="info",this.element.appendChild(this._container);var t=document.createElement("h1");t.className="title",t.textContent=this.resource.displayName,this._container.appendChild(t);var s=document.createElement("dl");s.className="infoList",this.resource.populateImageSource(o),o.addEventListener("load",function(){var e=this.resource.content;if(e)var t=this._base64ToSize(e);else t=this.resource.resourceSize;var n=[{name:WebInspector.UIString("Dimensions"),value:WebInspector.UIString("%d × %d",o.naturalWidth,o.naturalHeight)},{name:WebInspector.UIString("File size"),value:Number.bytesToString(t)},{name:WebInspector.UIString("MIME type"),value:this.resource.mimeType}];s.removeChildren();for(var i=0;i<n.length;++i){var r,a;(r=document.createElement("dt")).textContent=n[i].name,s.appendChild(r),(a=document.createElement("dd")).textContent=n[i].value,s.appendChild(a)}(r=document.createElement("dt")).textContent=WebInspector.UIString("URL"),s.appendChild(r),(a=document.createElement("dd")).appendChild(WebInspector.linkifyURLAsNode(this.resource.url)),s.appendChild(a),this._container.appendChild(s)}.bind(this),!1)}},_base64ToSize:function(e){if(!e.length)return 0;var t=3*(e.length||0)/4;return 0<e.length&&"="===e[e.length-1]&&t--,1<e.length&&"="===e[e.length-2]&&t--,t}},WebInspector.ImageView.prototype.__proto__=WebInspector.ResourceView.prototype;