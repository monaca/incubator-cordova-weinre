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
WebInspector.ExtensionPanel=function(e,t,n,o){this.toolbarItemLabel=t,this._addStyleRule(".toolbar-item."+e+" .toolbar-icon","background-image: url("+n+");"),WebInspector.Panel.call(this,e)},WebInspector.ExtensionPanel.prototype={get defaultFocusedElement(){return this.sidebarTreeElement||this.element},updateMainViewWidth:function(e){this.bodyElement.style.left=e+"px",this.resize()},searchCanceled:function(e){WebInspector.extensionServer.notifySearchAction(this._id,"cancelSearch"),WebInspector.Panel.prototype.searchCanceled.apply(this,arguments)},performSearch:function(e){WebInspector.extensionServer.notifySearchAction(this._id,"performSearch",e),WebInspector.Panel.prototype.performSearch.apply(this,arguments)},jumpToNextSearchResult:function(){WebInspector.extensionServer.notifySearchAction(this._id,"nextSearchResult"),WebInspector.Panel.prototype.jumpToNextSearchResult.call(this)},jumpToPreviousSearchResult:function(){WebInspector.extensionServer.notifySearchAction(this._id,"previousSearchResult"),WebInspector.Panel.prototype.jumpToPreviousSearchResult.call(this)},_addStyleRule:function(e,t){var n=document.createElement("style");n.textContent=e+" { "+t+" }",document.head.appendChild(n)}},WebInspector.ExtensionPanel.prototype.__proto__=WebInspector.Panel.prototype,WebInspector.ExtensionWatchSidebarPane=function(e,t){WebInspector.SidebarPane.call(this,e),this._id=t},WebInspector.ExtensionWatchSidebarPane.prototype={setObject:function(e,t){this._setObject(WebInspector.RemoteObject.fromLocalObject(e),t)},setExpression:function(e,t){InspectorBackend.evaluate(e,"extension-watch",!1,this._onEvaluate.bind(this,t))},_onEvaluate:function(e,t){this._setObject(WebInspector.RemoteObject.fromPayload(t),e)},_setObject:function(e,t){this.bodyElement.removeChildren();var n=new WebInspector.ObjectPropertiesSection(e,t,null,!0);t||n.headerElement.addStyleClass("hidden"),n.expanded=!0,this.bodyElement.appendChild(n.element),WebInspector.extensionServer.notifyExtensionWatchSidebarUpdated(this._id)}},WebInspector.ExtensionWatchSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype;