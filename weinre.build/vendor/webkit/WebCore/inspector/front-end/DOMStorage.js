/*
 * Copyright (C) 2008 Nokia Inc.  All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED "AS IS" AND ANY
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
WebInspector.DOMStorage=function(e,t,o){this._id=e,this._domain=t,this._isLocalStorage=o},WebInspector.DOMStorage.prototype={get id(){return this._id},get domain(){return this._domain},get isLocalStorage(){return this._isLocalStorage},getEntries:function(e){InspectorBackend.getDOMStorageEntries(this._id,e)},setItem:function(e,t,o){InspectorBackend.setDOMStorageItem(this._id,e,t,o)},removeItem:function(e,t){InspectorBackend.removeDOMStorageItem(this._id,e,t)}},WebInspector.DOMStorageDispatcher=function(){},WebInspector.DOMStorageDispatcher.prototype={addDOMStorage:function(e){if(WebInspector.panels.resources){var t=new WebInspector.DOMStorage(e.id,e.host,e.isLocalStorage);WebInspector.panels.resources.addDOMStorage(t)}},selectDOMStorage:function(e){WebInspector.showPanel("resources"),WebInspector.panels.resources.selectDOMStorage(e)},updateDOMStorage:function(e){WebInspector.panels.resources.updateDOMStorage(e)}},InspectorBackend.registerDomainDispatcher("DOMStorage",new WebInspector.DOMStorageDispatcher);