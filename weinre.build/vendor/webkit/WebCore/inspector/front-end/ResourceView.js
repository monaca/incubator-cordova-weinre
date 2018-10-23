/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) IBM Corp. 2009  All rights reserved.
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
WebInspector.ResourceView=function(e){WebInspector.View.call(this),this.element.addStyleClass("resource-view"),this.resource=e},WebInspector.ResourceView.prototype={hasContent:function(){return!1}},WebInspector.ResourceView.prototype.__proto__=WebInspector.View.prototype,WebInspector.ResourceView.createResourceView=function(e){switch(e.category){case WebInspector.resourceCategories.documents:case WebInspector.resourceCategories.stylesheets:case WebInspector.resourceCategories.scripts:case WebInspector.resourceCategories.xhr:var r=new WebInspector.SourceFrameContentProviderForResource(e),o=e.type===WebInspector.Resource.Type.Script,t=new WebInspector.SourceFrame(r,e.url,o);return t.resource=e,t;case WebInspector.resourceCategories.images:return new WebInspector.ImageView(e);case WebInspector.resourceCategories.fonts:return new WebInspector.FontView(e);default:return new WebInspector.ResourceView(e)}},WebInspector.ResourceView.resourceViewTypeMatchesResource=function(e){var r=e._resourcesView;switch(e.category){case WebInspector.resourceCategories.documents:case WebInspector.resourceCategories.stylesheets:case WebInspector.resourceCategories.scripts:case WebInspector.resourceCategories.xhr:return r.__proto__===WebInspector.SourceFrame.prototype;case WebInspector.resourceCategories.images:return r.__proto__===WebInspector.ImageView.prototype;case WebInspector.resourceCategories.fonts:return r.__proto__===WebInspector.FontView.prototype;default:return r.__proto__===WebInspector.ResourceView.prototype}},WebInspector.ResourceView.resourceViewForResource=function(e){return e?(e._resourcesView||(e._resourcesView=WebInspector.ResourceView.createResourceView(e)),e._resourcesView):null},WebInspector.ResourceView.recreateResourceView=function(e){var r=WebInspector.ResourceView.createResourceView(e),o=e._resourcesView,t=o.visible?o.element.parentNode:null,s=o.scrollTop;return e._resourcesView.detach(),delete e._resourcesView,e._resourcesView=r,t&&r.show(t),s&&(r.scrollTop=s),r},WebInspector.ResourceView.existingResourceViewForResource=function(e){return e?e._resourcesView:null},WebInspector.SourceFrameContentProviderForResource=function(e){WebInspector.SourceFrameContentProvider.call(this),this._resource=e}
//This is a map from resource.type to mime types
//found in WebInspector.SourceTokenizer.Registry.
,WebInspector.SourceFrameContentProviderForResource.DefaultMIMETypeForResourceType={0:"text/html",1:"text/css",4:"text/javascript"},WebInspector.SourceFrameContentProviderForResource.prototype={requestContent:function(c){this._resource.requestContent(function(e){var r=WebInspector.SourceFrameContentProviderForResource.DefaultMIMETypeForResourceType[this._resource.type]||this._resource.mimeType;this._resource.type!==WebInspector.Resource.Type.Script&&(
// WebKit html lexer normalizes line endings and scripts are passed to VM with "\n" line endings.
// However, resource content has original line endings, so we have to normalize line endings here.
e=e.replace(/\r\n/g,"\n"));var o=new WebInspector.IdenticalSourceMapping,t=WebInspector.debuggerModel.scriptsForURL(this._resource.url),s=WebInspector.ScriptFormatter.findScriptRanges(e.lineEndings(),t);c(r,new WebInspector.SourceFrameContent(e,o,s))}.bind(this))}},WebInspector.SourceFrameContentProviderForResource.prototype.__proto__=WebInspector.SourceFrameContentProvider.prototype;