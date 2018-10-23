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
WebInspector.CallStackSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Call Stack"))},WebInspector.CallStackSidebarPane.prototype={update:function(e){if(this.bodyElement.removeChildren(),this.placards=[],delete this._selectedCallFrame,!e){var t=document.createElement("div");return t.className="info",t.textContent=WebInspector.UIString("Not Paused"),void this.bodyElement.appendChild(t)}for(var a,r,n,s=e.callFrames,l=0;l<s.length;++l){var c=s[l];switch(c.type){case"function":a=c.functionName||WebInspector.UIString("(anonymous function)");break;case"program":a=WebInspector.UIString("(program)")}r=(n=WebInspector.debuggerModel.scriptForSourceID(c.sourceID))?WebInspector.displayNameForURL(n.sourceURL):WebInspector.UIString("(internal script)"),0<c.line&&(r?r+=":"+c.line:r=WebInspector.UIString("line %d",c.line));var i=new WebInspector.Placard(a,r);i.callFrame=c,i.element.addEventListener("click",this._placardSelected.bind(this),!1),this.placards.push(i),this.bodyElement.appendChild(i.element)}e.breakpoint?this._scriptBreakpointHit():e.eventType===WebInspector.DebuggerEventTypes.NativeBreakpoint&&this._nativeBreakpointHit(e.eventData)},get selectedCallFrame(){return this._selectedCallFrame},set selectedCallFrame(e){this._selectedCallFrame=e;for(var t=0;t<this.placards.length;++t){var a=this.placards[t];a.selected=a.callFrame===this._selectedCallFrame}this.dispatchEventToListeners("call frame selected")},handleShortcut:function(e){var t=WebInspector.KeyboardShortcut.makeKeyFromEvent(e),a=this._shortcuts[t];a&&(a(e),e.handled=!0)},_selectNextCallFrameOnStack:function(){var e=this._selectedCallFrameIndex();-1!=e&&this._selectedPlacardByIndex(e+1)},_selectPreviousCallFrameOnStack:function(){var e=this._selectedCallFrameIndex();-1!=e&&this._selectedPlacardByIndex(e-1)},_selectedPlacardByIndex:function(e){if(!(e<0||e>=this.placards.length)){var t=this.placards[e];this.selectedCallFrame=t.callFrame}},_selectedCallFrameIndex:function(){if(!this._selectedCallFrame)return-1;for(var e=0;e<this.placards.length;++e){if(this.placards[e].callFrame===this._selectedCallFrame)return e}return-1},_placardSelected:function(e){var t=e.target.enclosingNodeOrSelfWithClass("placard");this.selectedCallFrame=t.placard.callFrame},registerShortcuts:function(e){this._shortcuts={};var t=WebInspector.KeyboardShortcut.makeDescriptor(WebInspector.KeyboardShortcut.Keys.Period,WebInspector.KeyboardShortcut.Modifiers.Ctrl);this._shortcuts[t.key]=this._selectNextCallFrameOnStack.bind(this);var a=WebInspector.KeyboardShortcut.makeDescriptor(WebInspector.KeyboardShortcut.Keys.Comma,WebInspector.KeyboardShortcut.Modifiers.Ctrl);this._shortcuts[a.key]=this._selectPreviousCallFrameOnStack.bind(this),e.addRelatedKeys([t.name,a.name],WebInspector.UIString("Next/previous call frame"))},_scriptBreakpointHit:function(){var e=document.createElement("div");e.className="info",e.appendChild(document.createTextNode(WebInspector.UIString("Paused on a JavaScript breakpoint."))),this.bodyElement.appendChild(e)},_nativeBreakpointHit:function(e){var t=WebInspector.breakpointManager.breakpointViewForEventData(e);if(t){var a=document.createElement("div");a.className="info",t.populateStatusMessageElement(a,e),this.bodyElement.appendChild(a)}}},WebInspector.CallStackSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype;