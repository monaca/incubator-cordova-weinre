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
WebInspector.PropertiesSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Properties"))},WebInspector.PropertiesSidebarPane.prototype={update:function(e){var t=this.bodyElement;if(!e)return t.removeChildren(),void(this.sections=[]);InspectorBackend.getNodePrototypes(e.id,function(e){var t=this.bodyElement;t.removeChildren(),this.sections=[];
// Get array of prototype user-friendly names.
for(var r=0;r<e.length;++r){var o=WebInspector.RemoteObject.fromPayload(e[r]),n=o.description;n.match(/Prototype$/)&&(n=n.replace(/Prototype$/,""));var i=new WebInspector.ObjectPropertiesSection(o,n);this.sections.push(i),t.appendChild(i.element)}}.bind(this))}},WebInspector.PropertiesSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype;