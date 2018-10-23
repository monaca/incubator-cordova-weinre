/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
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
WebInspector.SidebarPane=function(e){this.element=document.createElement("div"),this.element.className="pane",this.titleElement=document.createElement("div"),this.titleElement.className="title",this.titleElement.tabIndex=0,this.titleElement.addEventListener("click",this.toggleExpanded.bind(this),!1),this.titleElement.addEventListener("keydown",this._onTitleKeyDown.bind(this),!1),this.bodyElement=document.createElement("div"),this.bodyElement.className="body",this.element.appendChild(this.titleElement),this.element.appendChild(this.bodyElement),this.title=e,this.growbarVisible=!1,this.expanded=!1},WebInspector.SidebarPane.prototype={get title(){return this._title},set title(e){this._title!==e&&(this._title=e,this.titleElement.textContent=e)},get growbarVisible(){return this._growbarVisible},set growbarVisible(e){this._growbarVisible!==e&&((this._growbarVisible=e)&&!this._growbarElement?(this._growbarElement=document.createElement("div"),this._growbarElement.className="growbar",this.element.appendChild(this._growbarElement)):!e&&this._growbarElement&&(this._growbarElement.parentNode&&this._growbarElement.parentNode(this._growbarElement),delete this._growbarElement))},get expanded(){return this._expanded},set expanded(e){e?this.expand():this.collapse()},expand:function(){this._expanded||(this._expanded=!0,this.element.addStyleClass("expanded"),this.onexpand&&this.onexpand(this))},collapse:function(){this._expanded&&(this._expanded=!1,this.element.removeStyleClass("expanded"),this.oncollapse&&this.oncollapse(this))},toggleExpanded:function(){this.expanded=!this.expanded},_onTitleKeyDown:function(e){(isEnterKey(e)||e.keyCode===WebInspector.KeyboardShortcut.Keys.Space.code)&&this.toggleExpanded()}},WebInspector.SidebarPane.prototype.__proto__=WebInspector.Object.prototype;