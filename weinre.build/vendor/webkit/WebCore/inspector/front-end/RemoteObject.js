/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
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
WebInspector.RemoteObject=function(e,t,r,n){this._objectId=e,this._type=t,this._description=r,this._hasChildren=n},WebInspector.RemoteObject.fromPrimitiveValue=function(e){return new WebInspector.RemoteObject(null,typeof e,e)},WebInspector.RemoteObject.fromLocalObject=function(e){return new WebInspector.LocalJSONObject(e)},WebInspector.RemoteObject.resolveNode=function(e,t){InspectorBackend.resolveNode(e.id,function(e){t(e?WebInspector.RemoteObject.fromPayload(e):null)})},WebInspector.RemoteObject.fromPayload=function(e){return"object"==typeof e?new WebInspector.RemoteObject(e.objectId,e.type,e.description,e.hasChildren):e;
// FIXME: make sure we only get here with real payloads in the new DebuggerAgent.js.
},WebInspector.RemoteObject.type=function(e){if(null===e)return"null";var t=typeof e;return"object"!==t&&"function"!==t?t:e.type},WebInspector.RemoteObject.prototype={get objectId(){return this._objectId},get type(){return this._type},get description(){return this._description},get hasChildren(){return this._hasChildren},isError:function(){return"error"===this._type},getOwnProperties:function(e,t){this.getProperties(!1,e,t)},getProperties:function(e,t,r){this._objectId?InspectorBackend.getProperties(this._objectId,!!e,t,function(e){for(var t=0;e&&t<e.length;++t)e[t].value=WebInspector.RemoteObject.fromPayload(e[t].value);r(e)}):r([])},setPropertyValue:function(e,t,r){this._objectId?InspectorBackend.setPropertyValue(this._objectId,e,t,r):r(!1)},pushNodeToFrontend:function(e){InspectorBackend.pushNodeToFrontend(this._objectId,e)}},WebInspector.RemoteObjectProperty=function(e,t){this.name=e,this.value=t}
// The below is a wrapper around a local object that provides an interface comaptible
// with RemoteObject, to be used by the UI code (primarily ObjectPropertiesSection).
// Note that only JSON-compliant objects are currently supported, as there's no provision
// for traversing prototypes, extracting class names via constuctor, handling properties
// or functions.
,WebInspector.LocalJSONObject=function(e){this._value=e},WebInspector.LocalJSONObject.prototype={get description(){switch(this.type){case"array":return"["+this._value.length+"]";case"object":return this.hasChildren?"{...}":"{ }";default:return JSON.stringify(this._value)}},get type(){return null===this._value?"null":this._value instanceof Array?"array":typeof this._value},get hasChildren(){return"object"==typeof this._value&&null!==this._value&&Object.keys(this._value).length},getOwnProperties:function(e,t){return this.getProperties(!1,e,t)},getProperties:function(e,t,r){r(Object.keys(this._value).map(function(e){return new WebInspector.RemoteObjectProperty(e,new WebInspector.LocalJSONObject(this._value[e]))}.bind(this)))},isError:function(){return!1}};