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
WebInspector.ScopeChainSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Scope Variables")),this._sections=[],this._expandedSections={},this._expandedProperties=[]},WebInspector.ScopeChainSidebarPane.prototype={update:function(e){if(this.bodyElement.removeChildren(),!e){var t=document.createElement("div");return t.className="info",t.textContent=WebInspector.UIString("Not Paused"),void this.bodyElement.appendChild(t)}for(var r=0;r<this._sections.length;++r){(o=this._sections[r]).title&&(o.expanded?this._expandedSections[o.title]=!0:delete this._expandedSections[o.title])}var n=!(this._sections=[]),i=e.scopeChain;for(r=0;r<i.length;++r){var o,p=i[r],s=null,a=p.description,c=null,l=null;p.isLocal?(n=!0,s=WebInspector.UIString("Local"),c=WebInspector.UIString("No Variables"),a=null,p.thisObject&&(l=[new WebInspector.RemoteObjectProperty("this",WebInspector.RemoteObject.fromPayload(p.thisObject))])):p.isClosure?(s=WebInspector.UIString("Closure"),c=WebInspector.UIString("No Variables"),a=null):r===i.length-1?s=WebInspector.UIString("Global"):p.isElement?s=WebInspector.UIString("Event Target"):p.isDocument?s=WebInspector.UIString("Event Document"):p.isWithBlock&&(s=WebInspector.UIString("With Block")),s&&s!==a||(a=null),(o=new WebInspector.ObjectPropertiesSection(WebInspector.RemoteObject.fromPayload(p),s,a,c,!0,l,WebInspector.ScopeVariableTreeElement)).editInSelectedCallFrameWhenPaused=!0,o.pane=this,(!n||p.isLocal||s in this._expandedSections)&&(o.expanded=!0),this._sections.push(o),this.bodyElement.appendChild(o.element)}}},WebInspector.ScopeChainSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype,WebInspector.ScopeVariableTreeElement=function(e){WebInspector.ObjectPropertyTreeElement.call(this,e)},WebInspector.ScopeVariableTreeElement.prototype={onattach:function(){WebInspector.ObjectPropertyTreeElement.prototype.onattach.call(this),this.hasChildren&&this.propertyIdentifier in this.treeOutline.section.pane._expandedProperties&&this.expand()},onexpand:function(){this.treeOutline.section.pane._expandedProperties[this.propertyIdentifier]=!0},oncollapse:function(){delete this.treeOutline.section.pane._expandedProperties[this.propertyIdentifier]},get propertyIdentifier(){if("_propertyIdentifier"in this)return this._propertyIdentifier;var e=this.treeOutline.section;return this._propertyIdentifier=e.title+":"+(e.subtitle?e.subtitle+":":"")+this.propertyPath,this._propertyIdentifier},get propertyPath(){if("_propertyPath"in this)return this._propertyPath;for(var e,t=this;e=e?t.property.name+"."+e:t.property.name,(t=t.parent)&&!t.root;);return this._propertyPath=e}},WebInspector.ScopeVariableTreeElement.prototype.__proto__=WebInspector.ObjectPropertyTreeElement.prototype;