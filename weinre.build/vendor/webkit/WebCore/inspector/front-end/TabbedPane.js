/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.TabbedPane=function(e){this.element=e||document.createElement("div"),this.element.addStyleClass("tabbed-pane"),this._tabsElement=this.element.createChild("div","tabbed-pane-header"),this._contentElement=this.element.createChild("div","tabbed-pane-content"),this._tabs={}},WebInspector.TabbedPane.prototype={appendTab:function(e,t,n){var a=document.createElement("li");a.textContent=t,a.addEventListener("click",this.selectTab.bind(this,e,!0),!1),this._tabsElement.appendChild(a),this._contentElement.appendChild(n.element),this._tabs[e]={tabElement:a,view:n}},selectTab:function(e,t){if(!(e in this._tabs))return!1;this._currentTab&&(this._hideTab(this._currentTab),delete this._currentTab);var n=this._tabs[e];if(this._showTab(n),this._currentTab=n,t){var a={tabId:e};this.dispatchEventToListeners("tab-selected",a)}return!0},_showTab:function(e){e.tabElement.addStyleClass("selected"),e.view.show(this._contentElement)},_hideTab:function(e){e.tabElement.removeStyleClass("selected"),e.view.visible=!1}},WebInspector.TabbedPane.prototype.__proto__=WebInspector.Object.prototype;