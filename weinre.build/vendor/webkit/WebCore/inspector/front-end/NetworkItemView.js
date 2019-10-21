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
WebInspector.NetworkItemView=function(e){WebInspector.View.call(this),this.element.addStyleClass("network-item-view"),this._headersView=new WebInspector.ResourceHeadersView(e);
// Do not store reference to content view - it can be recreated.
var t=WebInspector.ResourceView.resourceViewForResource(e);if(this._tabbedPane=new WebInspector.TabbedPane(this.element),this._tabbedPane.appendTab("headers",WebInspector.UIString("Headers"),this._headersView),t.hasContent()&&(
// Reusing this view, so hide it at first.
t.visible=!1,this._tabbedPane.appendTab("content",WebInspector.UIString("Content"),t)),Preferences.showCookiesTab&&(this._cookiesView=new WebInspector.ResourceCookiesView(e),this._tabbedPane.appendTab("cookies",WebInspector.UIString("Cookies"),this._cookiesView)),Preferences.showTimingTab){var s=new WebInspector.ResourceTimingView(e);this._tabbedPane.appendTab("timing",WebInspector.UIString("Timing"),s)}this._tabbedPane.addEventListener("tab-selected",this._tabSelected,this)},WebInspector.NetworkItemView.prototype={show:function(e){WebInspector.View.prototype.show.call(this,e),this._selectTab()},_selectTab:function(e){e||(e=WebInspector.settings.resourceViewTab),this._tabbedPane.selectTab(e)||(this._isInFallbackSelection=!0,this._tabbedPane.selectTab("headers"),delete this._isInFallbackSelection)},_tabSelected:function(e){WebInspector.settings.resourceViewTab=e.data.tabId},resize:function(){this._cookiesView&&this._cookiesView.visible&&this._cookiesView.resize()}},WebInspector.NetworkItemView.prototype.__proto__=WebInspector.View.prototype;