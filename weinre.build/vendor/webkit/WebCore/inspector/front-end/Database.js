/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
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
WebInspector.Database=function(e,a,t,s){this._id=e,this._domain=a,this._name=t,this._version=s},WebInspector.Database.prototype={get id(){return this._id},get name(){return this._name},set name(e){this._name=e},get version(){return this._version},set version(e){this._version=e},get domain(){return this._domain},set domain(e){this._domain=e},get displayDomain(){return WebInspector.Resource.prototype.__lookupGetter__("displayDomain").call(this)},getTableNames:function(a){InspectorBackend.getDatabaseTableNames(this._id,function(e){a(e.sort())})},executeSql:function(e,t,s){InspectorBackend.executeSQL(this._id,e,function(e,a){e?WebInspector.DatabaseDispatcher._callbacks[a]={onSuccess:t,onError:s}:s(WebInspector.UIString("Database not found."))})}},WebInspector.DatabaseDispatcher=function(){},WebInspector.DatabaseDispatcher._callbacks={},WebInspector.DatabaseDispatcher.prototype={addDatabase:function(e){var a=new WebInspector.Database(e.id,e.domain,e.name,e.version);WebInspector.panels.resources.addDatabase(a)},selectDatabase:function(e){WebInspector.showPanel("resources"),WebInspector.panels.resources.selectDatabase(e)},sqlTransactionSucceeded:function(e,a,t){if(WebInspector.DatabaseDispatcher._callbacks[e]){var s=WebInspector.DatabaseDispatcher._callbacks[e].onSuccess;delete WebInspector.DatabaseDispatcher._callbacks[e],s&&s(a,t)}},sqlTransactionFailed:function(e,a){if(WebInspector.DatabaseDispatcher._callbacks[e]){var t=WebInspector.DatabaseDispatcher._callbacks[e].onError;delete WebInspector.DatabaseDispatcher._callbacks[e],t&&t(a)}}},InspectorBackend.registerDomainDispatcher("Database",new WebInspector.DatabaseDispatcher);