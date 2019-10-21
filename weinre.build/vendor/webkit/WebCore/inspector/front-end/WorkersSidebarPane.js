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
WebInspector.WorkersSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Workers")),this._workers={},this._enableWorkersCheckbox=new WebInspector.Checkbox(WebInspector.UIString("Debug"),"sidebar-pane-subtitle",WebInspector.UIString("Allow debugging workers. Enabling this option will replace native workers with the iframe-based JavaScript implementation")),this.titleElement.insertBefore(this._enableWorkersCheckbox.element,this.titleElement.firstChild),this._enableWorkersCheckbox.addEventListener(this._onTriggerInstrument.bind(this)),this._enableWorkersCheckbox.checked=!1,this._listElement=document.createElement("ol"),this._listElement.className="workers-list",this.bodyElement.appendChild(this._listElement),this._treeOutline=new TreeOutline(this._listElement)},WebInspector.WorkersSidebarPane.prototype={addWorker:function(e,t,r){if(!(e in this._workers)){var n=new WebInspector.Worker(e,t,r);this._workers[e]=n;var i=WebInspector.linkifyURL(t,WebInspector.displayNameForURL(t),"worker-item",!0,t),s=new TreeElement(null,n,!1);s.titleHTML=i,this._treeOutline.appendChild(s)}},removeWorker:function(e){e in this._workers&&(this._treeOutline.removeChild(this._treeOutline.findTreeElement(this._workers[e])),delete this._workers[e])},setInstrumentation:function(e){InspectorBackend.removeAllScriptsToEvaluateOnLoad(),e&&InspectorBackend.addScriptToEvaluateOnLoad("("+InjectedFakeWorker+")")},reset:function(){this.setInstrumentation(this._enableWorkersCheckbox.checked),this._treeOutline.removeChildren(),this._workers={}},_onTriggerInstrument:function(e){this.setInstrumentation(this._enableWorkersCheckbox.checked)}},WebInspector.WorkersSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype,WebInspector.Worker=function(e,t,r){this.id=e,this.url=t,this.shared=r};