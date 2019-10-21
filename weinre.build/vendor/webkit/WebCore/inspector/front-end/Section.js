/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Google Inc.  All rights reserved.
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
WebInspector.Section=function(e,t){this.element=document.createElement("div"),this.element.className="section",(this.element._section=this).headerElement=document.createElement("div"),this.headerElement.className="header",this.titleElement=document.createElement("div"),this.titleElement.className="title",this.subtitleElement=document.createElement("div"),this.subtitleElement.className="subtitle",this.headerElement.appendChild(this.subtitleElement),this.headerElement.appendChild(this.titleElement),this.headerElement.addEventListener("click",this.toggleExpanded.bind(this),!1),this.element.appendChild(this.headerElement),this.title=e,this.subtitle=t,this._expanded=!1},WebInspector.Section.prototype={get title(){return this._title},set title(e){this._title!==e&&((this._title=e)instanceof Node?(this.titleElement.removeChildren(),this.titleElement.appendChild(e)):this.titleElement.textContent=e)},get subtitle(){return this._subtitle},set subtitle(e){this._subtitle!==e&&(this._subtitle=e,this.subtitleElement.textContent=e)},get subtitleAsTextForTest(){var e=this.subtitleElement.textContent,t=this.subtitleElement.querySelector("[data-uncopyable]");if(t){var i=t.getAttribute("data-uncopyable");i&&(e+=i)}return e},get expanded(){return this._expanded},set expanded(e){e?this.expand():this.collapse()},get populated(){return this._populated},set populated(e){!(this._populated=e)&&this.onpopulate&&this._expanded&&(this.onpopulate(this),this._populated=!0)},get nextSibling(){for(var e=this.element;(e=e.nextSibling)&&!e._section;);return e?e._section:null},get previousSibling(){for(var e=this.element;(e=e.previousSibling)&&!e._section;);return e?e._section:null},expand:function(){this._expanded||(this._expanded=!0,this.element.addStyleClass("expanded"),!this._populated&&this.onpopulate&&(this.onpopulate(this),this._populated=!0))},collapse:function(){this._expanded&&(this._expanded=!1,this.element.removeStyleClass("expanded"))},toggleExpanded:function(){this.expanded=!this.expanded}};