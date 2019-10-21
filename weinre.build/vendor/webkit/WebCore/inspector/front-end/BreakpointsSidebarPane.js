/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.JavaScriptBreakpointsSidebarPane=function(e){WebInspector.SidebarPane.call(this,WebInspector.UIString("Breakpoints")),this.listElement=document.createElement("ol"),this.listElement.className="breakpoint-list",this.emptyElement=document.createElement("div"),this.emptyElement.className="info",this.emptyElement.textContent=WebInspector.UIString("No Breakpoints"),this.bodyElement.appendChild(this.emptyElement),this._items={},WebInspector.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.BreakpointAdded,this._breakpointAdded,this),WebInspector.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.BreakpointRemoved,this._breakpointRemoved,this),WebInspector.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.BreakpointResolved,this._breakpointResolved,this),WebInspector.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.ParsedScriptSource,this._parsedScriptSource,this),WebInspector.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.DebuggerPaused,this._debuggerPaused,this),WebInspector.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.DebuggerResumed,this._debuggerResumed,this),WebInspector.breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.ProjectChanged,this._projectChanged,this)},WebInspector.JavaScriptBreakpointsSidebarPane.prototype={_breakpointAdded:function(e){var t=e.data,n=t.id;if(!t.url||WebInspector.debuggerModel.scriptsForURL(t.url).length){var i=document.createElement("li"),r=document.createElement("input");r.className="checkbox-elem",r.type="checkbox",r.checked=t.enabled,r.addEventListener("click",this._breakpointItemCheckboxClicked.bind(this,n),!1),i.appendChild(r);var o=document.createElement("span");i.appendChild(o),i._data=t;for(var a=this.listElement.firstChild;a&&!(a._data&&0<this._compareBreakpoints(a._data,i._data));)a=a.nextSibling;this._addListElement(i,a),i.addEventListener("contextmenu",this._contextMenuEventFired.bind(this,n),!0),this._setupBreakpointElement(t,i);var s={};s.element=i,s.checkbox=r,this._items[n]=s,this.expanded||(this.expanded=!0)}},_breakpointRemoved:function(e){var t=e.data,n=this._items[t];n&&(delete this._items[t],this._removeListElement(n.element))},_breakpointResolved:function(e){var t=e.data;this._breakpointRemoved({data:t.id}),this._breakpointAdded({data:t})},_parsedScriptSource:function(e){e.data.sourceURL;var t=WebInspector.debuggerModel.breakpoints;for(var n in t)n in this._items||this._breakpointAdded({data:t[n]})},_breakpointEnableChanged:function(e,t){var n=t.data,i=this._items[n];i&&(i.checkbox.checked=e)},_breakpointItemCheckboxClicked:function(e,t){var n=WebInspector.debuggerModel.breakpointForId(e);WebInspector.debuggerModel.updateBreakpoint(e,n.condition,t.target.checked),
// Breakpoint element may have it's own click handler.
t.stopPropagation()},_contextMenuEventFired:function(e,t){var n=new WebInspector.ContextMenu;n.appendItem(WebInspector.UIString("Remove Breakpoint"),this._removeBreakpoint.bind(this,e)),n.show(t)},_debuggerPaused:function(e){var t=e.data.breakpoint;if(t){var n=this._items[t.id];n&&(n.element.addStyleClass("breakpoint-hit"),this._lastHitBreakpointItem=n)}},_debuggerResumed:function(){this._lastHitBreakpointItem&&(this._lastHitBreakpointItem.element.removeStyleClass("breakpoint-hit"),delete this._lastHitBreakpointItem)},_addListElement:function(e,t){t?this.listElement.insertBefore(e,t):(this.listElement.firstChild||(this.bodyElement.removeChild(this.emptyElement),this.bodyElement.appendChild(this.listElement)),this.listElement.appendChild(e))},_removeListElement:function(e){this.listElement.removeChild(e),this.listElement.firstChild||(this.bodyElement.removeChild(this.listElement),this.bodyElement.appendChild(this.emptyElement))},_projectChanged:function(){this.listElement.removeChildren(),this.listElement.parentElement&&(this.bodyElement.removeChild(this.listElement),this.bodyElement.appendChild(this.emptyElement)),this._items={}},_compare:function(e,t){return e!==t?e<t?-1:1:0},_compareBreakpoints:function(e,t){return this._compare(e.url,t.url)||this._compare(e.lineNumber,t.lineNumber)},_setupBreakpointElement:function(e,t){var n,i=e.lineNumber;e.locations.length&&(n=e.locations[0].sourceID,i=e.locations[0].lineNumber);var r=e.url?WebInspector.displayNameForURL(e.url):WebInspector.UIString("(program)"),o=document.createTextNode(r+":"+(i+1));t.appendChild(o);var a=document.createElement("div");if(a.className="source-text monospace",t.appendChild(a),n){WebInspector.debuggerModel.scriptForSourceID(n).sourceLine(i,function(e){a.textContent=e}.bind(this))}t.addStyleClass("cursor-pointer");var s=WebInspector.panels.scripts.showSourceLine.bind(WebInspector.panels.scripts,e.url,i+1);t.addEventListener("click",s,!1)},_removeBreakpoint:function(e){WebInspector.debuggerModel.removeBreakpoint(e)}},WebInspector.JavaScriptBreakpointsSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype,WebInspector.NativeBreakpointsSidebarPane=function(e){WebInspector.SidebarPane.call(this,e),this.listElement=document.createElement("ol"),this.listElement.className="breakpoint-list",this.emptyElement=document.createElement("div"),this.emptyElement.className="info",this.emptyElement.textContent=WebInspector.UIString("No Breakpoints"),this.bodyElement.appendChild(this.emptyElement),WebInspector.breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.ProjectChanged,this._projectChanged,this)},WebInspector.NativeBreakpointsSidebarPane.prototype={addBreakpointItem:function(e){var t=e.element;(t._breakpointItem=e).addEventListener("breakpoint-hit",this.expand,this),e.addEventListener("removed",this._removeListElement.bind(this,t),this);for(var n=this.listElement.firstChild;n&&!(n._breakpointItem&&0<n._breakpointItem.compareTo(t._breakpointItem));)n=n.nextSibling;this._addListElement(t,n),e.click&&(t.addStyleClass("cursor-pointer"),t.addEventListener("click",e.click.bind(e),!1)),t.addEventListener("contextmenu",this._contextMenuEventFired.bind(this,e),!0)},_contextMenuEventFired:function(e,t){var n=new WebInspector.ContextMenu;n.appendItem(WebInspector.UIString("Remove Breakpoint"),e.remove.bind(e)),n.show(t)},_addListElement:function(e,t){t?this.listElement.insertBefore(e,t):(this.listElement.firstChild||(this.bodyElement.removeChild(this.emptyElement),this.bodyElement.appendChild(this.listElement)),this.listElement.appendChild(e))},_removeListElement:function(e){this.listElement.removeChild(e),this.listElement.firstChild||(this.bodyElement.removeChild(this.listElement),this.bodyElement.appendChild(this.emptyElement))},_projectChanged:function(){this.listElement.removeChildren(),this.listElement.parentElement&&(this.bodyElement.removeChild(this.listElement),this.bodyElement.appendChild(this.emptyElement))}},WebInspector.NativeBreakpointsSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype,WebInspector.XHRBreakpointsSidebarPane=function(){WebInspector.NativeBreakpointsSidebarPane.call(this,WebInspector.UIString("XHR Breakpoints"));var e=document.createElement("button");e.className="add",e.addEventListener("click",function(e){e.stopPropagation(),this._startEditingBreakpoint(null)}.bind(this),!1),this.titleElement.appendChild(e)},WebInspector.XHRBreakpointsSidebarPane.prototype={addBreakpointItem:function(e){WebInspector.NativeBreakpointsSidebarPane.prototype.addBreakpointItem.call(this,e),e._labelElement.addEventListener("dblclick",this._startEditingBreakpoint.bind(this,e),!1)},_startEditingBreakpoint:function(e){if(!this._editingBreakpoint){this._editingBreakpoint=!0,this.expanded||(this.expanded=!0);var t=document.createElement("span");t.className="breakpoint-condition editing",e?(e.populateEditElement(t),this.listElement.insertBefore(t,e.element),e.element.addStyleClass("hidden")):this._addListElement(t,this.listElement.firstChild);var n=this._hideEditBreakpointDialog.bind(this,t,!0,e),i=this._hideEditBreakpointDialog.bind(this,t,!1,e);WebInspector.startEditing(t,{commitHandler:n,cancelHandler:i})}},_hideEditBreakpointDialog:function(e,t,n){this._removeListElement(e),this._editingBreakpoint=!1,t?(n&&n.remove(),WebInspector.breakpointManager.createXHRBreakpoint(e.textContent.toLowerCase())):n&&n.element.removeStyleClass("hidden")}},WebInspector.XHRBreakpointsSidebarPane.prototype.__proto__=WebInspector.NativeBreakpointsSidebarPane.prototype,WebInspector.BreakpointItem=function(e){this._breakpoint=e,this._element=document.createElement("li");var t=document.createElement("input");t.className="checkbox-elem",t.type="checkbox",t.checked=this._breakpoint.enabled,t.addEventListener("click",this._checkboxClicked.bind(this),!1),this._element.appendChild(t),this._createLabelElement(),this._breakpoint.addEventListener("enable-changed",this._enableChanged,this),this._breakpoint.addEventListener("hit-state-changed",this._hitStateChanged,this),this._breakpoint.addEventListener("label-changed",this._labelChanged,this),this._breakpoint.addEventListener("removed",this.dispatchEventToListeners.bind(this,"removed")),e.click&&(this.click=e.click.bind(e))},WebInspector.BreakpointItem.prototype={get element(){return this._element},compareTo:function(e){return this._breakpoint.compareTo(e._breakpoint)},populateEditElement:function(e){this._breakpoint.populateEditElement(e)},remove:function(){this._breakpoint.remove()},_checkboxClicked:function(e){this._breakpoint.enabled=!this._breakpoint.enabled,
// Breakpoint element may have it's own click handler.
e.stopPropagation()},_enableChanged:function(e){this._element.firstChild.checked=this._breakpoint.enabled},_hitStateChanged:function(e){e.target.hit?(this._element.addStyleClass("breakpoint-hit"),this.dispatchEventToListeners("breakpoint-hit")):this._element.removeStyleClass("breakpoint-hit")},_labelChanged:function(e){this._element.removeChild(this._labelElement),this._createLabelElement()},_createLabelElement:function(){this._labelElement=document.createElement("span"),this._breakpoint.populateLabelElement(this._labelElement),this._element.appendChild(this._labelElement)}},WebInspector.BreakpointItem.prototype.__proto__=WebInspector.Object.prototype,WebInspector.EventListenerBreakpointsSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Event Listener Breakpoints")),this.categoriesElement=document.createElement("ol"),this.categoriesElement.tabIndex=0,this.categoriesElement.addStyleClass("properties-tree event-listener-breakpoints"),this.categoriesTreeOutline=new TreeOutline(this.categoriesElement),this.bodyElement.appendChild(this.categoriesElement),WebInspector.breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.ProjectChanged,this._projectChanged,this),WebInspector.breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.EventListenerBreakpointAdded,this._breakpointAdded,this),this._breakpointItems={},this._createCategory(WebInspector.UIString("Keyboard"),"listener",["keydown","keyup","keypress","textInput"]),this._createCategory(WebInspector.UIString("Mouse"),"listener",["click","dblclick","mousedown","mouseup","mouseover","mousemove","mouseout","mousewheel"]),
// FIXME: uncomment following once inspector stops being drop targer in major ports.
// Otherwise, inspector page reacts on drop event and tries to load the event data.
// this._createCategory(WebInspector.UIString("Drag"), "listener", ["drag", "drop", "dragstart", "dragend", "dragenter", "dragleave", "dragover"]);
this._createCategory(WebInspector.UIString("Control"),"listener",["resize","scroll","zoom","focus","blur","select","change","submit","reset"]),this._createCategory(WebInspector.UIString("Clipboard"),"listener",["copy","cut","paste","beforecopy","beforecut","beforepaste"]),this._createCategory(WebInspector.UIString("Load"),"listener",["load","unload","abort","error"]),this._createCategory(WebInspector.UIString("DOM Mutation"),"listener",["DOMActivate","DOMFocusIn","DOMFocusOut","DOMAttrModified","DOMCharacterDataModified","DOMNodeInserted","DOMNodeInsertedIntoDocument","DOMNodeRemoved","DOMNodeRemovedFromDocument","DOMSubtreeModified","DOMContentLoaded"]),this._createCategory(WebInspector.UIString("Device"),"listener",["deviceorientation","devicemotion"]),this._createCategory(WebInspector.UIString("Timer"),"instrumentation",["setTimer","clearTimer","timerFired"])},WebInspector.EventListenerBreakpointsSidebarPane.prototype={_createCategory:function(e,t,n){var i={};i.element=new TreeElement(e),this.categoriesTreeOutline.appendChild(i.element),i.element.listItemElement.addStyleClass("event-category"),i.element.selectable=!0,i.checkbox=this._createCheckbox(i.element),i.checkbox.addEventListener("click",this._categoryCheckboxClicked.bind(this,i),!0),i.children={};for(var r=0;r<n.length;++r){var o=t+":"+n[r],a={},s=WebInspector.EventListenerBreakpointView.eventNameForUI(o);a.element=new TreeElement(s),i.element.appendChild(a.element);var d=document.createElement("div");d.className="breakpoint-hit-marker",a.element.listItemElement.appendChild(d),a.element.listItemElement.addStyleClass("source-code"),a.element.selectable=!0,a.checkbox=this._createCheckbox(a.element),a.checkbox.addEventListener("click",this._breakpointCheckboxClicked.bind(this,a),!0),a.parent=i,a.eventName=o,this._breakpointItems[o]=a,i.children[o]=a}},_createCheckbox:function(e){var t=document.createElement("input");return t.className="checkbox-elem",t.type="checkbox",e.listItemElement.insertBefore(t,e.listItemElement.firstChild),t},_categoryCheckboxClicked:function(e){var t=e.checkbox.checked;for(var n in e.children){var i=e.children[n];i.checkbox.checked!==t&&(i.checkbox.checked=t,this._breakpointCheckboxClicked(i))}},_breakpointCheckboxClicked:function(e){e.checkbox.checked?WebInspector.breakpointManager.createEventListenerBreakpoint(e.eventName):e.breakpoint.remove()},_breakpointAdded:function(e){var t=e.data,n=this._breakpointItems[t.eventName];(n.breakpoint=t).addEventListener("hit-state-changed",this._breakpointHitStateChanged.bind(this,n)),t.addEventListener("removed",this._breakpointRemoved.bind(this,n)),n.checkbox.checked=!0,this._updateCategoryCheckbox(n)},_breakpointHitStateChanged:function(e,t){t.target.hit?(this.expanded=!0,e.parent.element.expand(),e.element.listItemElement.addStyleClass("breakpoint-hit")):e.element.listItemElement.removeStyleClass("breakpoint-hit")},_breakpointRemoved:function(e){e.breakpoint=null,e.checkbox.checked=!1,this._updateCategoryCheckbox(e)},_updateCategoryCheckbox:function(e){var t=e.parent,n=!1,i=!1;for(var r in t.children){(e=t.children[r]).checkbox.checked?n=!0:i=!0}t.checkbox.checked=n,t.checkbox.indeterminate=n&&i},_projectChanged:function(){for(var e in this._breakpointItems){var t=this._breakpointItems[e];t.breakpoint=null,t.checkbox.checked=!1,this._updateCategoryCheckbox(t)}}},WebInspector.EventListenerBreakpointsSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype;