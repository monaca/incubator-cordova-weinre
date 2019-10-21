/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
WebInspector.ResourceTreeModel=function(){this.reset()},WebInspector.ResourceTreeModel.prototype={reset:function(){this._resourcesByURL={},this._resourcesByFrameId={},this._subframes={},WebInspector.panels&&WebInspector.panels.resources.clear()},addOrUpdateFrame:function(e){var r=new WebInspector.Resource(null,e.url);WebInspector.panels.resources.addOrUpdateFrame(e.parentId,e.id,e.name,r.displayName);var s=this._subframes[e.parentId];s||(s={},this._subframes[e.parentId||0]=s),s[e.id]=!0},didCommitLoadForFrame:function(e,r){
// frame.parentId === 0 is when main frame navigation happens.
this._clearChildFramesAndResources(e.parentId?e.id:0,r.loaderId),this.addOrUpdateFrame(e);for(var s=this._resourcesByFrameId[e.id],o=0;s&&o<s.length;++o)WebInspector.panels.resources.addResourceToFrame(e.id,s[o])},frameDetachedFromParent:function(e){this._clearChildFramesAndResources(e,0),WebInspector.panels.resources.removeFrame(e)},addResourceToFrame:function(e,r){var s=this._resourcesByFrameId[e];s||(s=[],this._resourcesByFrameId[e]=s),s.push(r),this._bindResourceURL(r),WebInspector.panels.resources.addResourceToFrame(e,r)},forAllResources:function(e){this._callForFrameResources(0,e)},addConsoleMessage:function(e){var r=this.resourceForURL(e.url);if(r){switch(e.level){case WebInspector.ConsoleMessage.MessageLevel.Warning:r.warnings+=e.repeatDelta;break;case WebInspector.ConsoleMessage.MessageLevel.Error:r.errors+=e.repeatDelta}var s=WebInspector.ResourceView.resourceViewForResource(r);s.addMessage&&s.addMessage(e)}},clearConsoleMessages:function(){this.forAllResources(function(e){e.clearErrorsAndWarnings()})},resourceForURL:function(e){
// FIXME: receive frameId here.
var r=this._resourcesByURL[e];return r instanceof Array?r[0]:r},_bindResourceURL:function(e){var r=this._resourcesByURL[e.url];r?r instanceof Array?r.push(e):this._resourcesByURL[e.url]=[r,e]:this._resourcesByURL[e.url]=e},_clearChildFramesAndResources:function(e,r){WebInspector.panels.resources.removeResourcesFromFrame(e),this._clearResources(e,r);var s=this._subframes[e];if(s){for(var o in s)WebInspector.panels.resources.removeFrame(o),this._clearChildFramesAndResources(o,r);delete this._subframes[e]}},_clearResources:function(e,r){var s=this._resourcesByFrameId[e];if(s){for(var o=[],a=0;a<s.length;++a){var n=s[a];n.loader.loaderId!==r?this._unbindResourceURL(n):o.push(n)}delete this._resourcesByFrameId[e],o.length&&(this._resourcesByFrameId[e]=o)}},_callForFrameResources:function(e,r){for(var s=this._resourcesByFrameId[e],o=0;s&&o<s.length;++o)if(r(s[o]))return!0;var a=this._subframes[e];if(a)for(var n in a)if(this._callForFrameResources(n,r))return!0;return!1},_unbindResourceURL:function(e){var r=this._resourcesByURL[e.url];if(r)return r instanceof Array?(r.remove(e,!0),void(1===r.length&&(this._resourcesByURL[e.url]=r[0]))):void delete this._resourcesByURL[e.url]}};