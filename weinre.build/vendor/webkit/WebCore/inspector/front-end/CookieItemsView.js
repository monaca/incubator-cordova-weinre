/*
 * Copyright (C) 2009 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Joseph Pecoraro
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
WebInspector.CookieItemsView=function(e,t){WebInspector.View.call(this),this.element.addStyleClass("storage-view"),this._deleteButton=new WebInspector.StatusBarButton(WebInspector.UIString("Delete"),"delete-storage-status-bar-item"),this._deleteButton.visible=!1,this._deleteButton.addEventListener("click",this._deleteButtonClicked.bind(this),!1),this._refreshButton=new WebInspector.StatusBarButton(WebInspector.UIString("Refresh"),"refresh-storage-status-bar-item"),this._refreshButton.addEventListener("click",this._refreshButtonClicked.bind(this),!1),this._treeElement=e,this._cookieDomain=t,this._emptyMsgElement=document.createElement("div"),this._emptyMsgElement.className="storage-empty-view",this._emptyMsgElement.textContent=WebInspector.UIString("This site has no cookies."),this.element.appendChild(this._emptyMsgElement)},WebInspector.CookieItemsView.prototype={get statusBarItems(){return[this._refreshButton.element,this._deleteButton.element]},show:function(e){WebInspector.View.prototype.show.call(this,e),this._update()},hide:function(){WebInspector.View.prototype.hide.call(this),this._deleteButton.visible=!1},resize:function(){this._cookiesTable&&this._cookiesTable.updateWidths()},_update:function(){WebInspector.Cookies.getCookiesAsync(this._updateWithCookies.bind(this))},_updateWithCookies:function(e,t){if(this._cookies=t?this._filterCookiesForDomain(e):e,!this._cookies.length)
// Nothing to show.
return this._emptyMsgElement.removeStyleClass("hidden"),this._deleteButton.visible=!1,void(this._cookiesTable&&this._cookiesTable.element.addStyleClass("hidden"));this._cookiesTable||(this._cookiesTable=t?new WebInspector.CookiesTable(this._cookieDomain,!1,this._deleteCookie.bind(this)):new WebInspector.SimpleCookiesTable,this.element.appendChild(this._cookiesTable.element)),this._cookiesTable.setCookies(this._cookies),this._cookiesTable.element.removeStyleClass("hidden"),this._emptyMsgElement.addStyleClass("hidden"),t&&(this._treeElement.subtitle=String.sprintf(WebInspector.UIString("%d cookies (%s)"),this._cookies.length,Number.bytesToString(this._totalSize)),this._deleteButton.visible=!0),this._cookiesTable.updateWidths()},_filterCookiesForDomain:function(e){var t=[],i=[];this._totalSize=0,WebInspector.forAllResources(function(e){var t=e.documentURL.asParsedURL();t&&t.host==this._cookieDomain&&i.push(e.url)}.bind(this));for(var s=0;s<e.length;++s)for(var o=!1,n=e[s].size,a=0;a<i.length;++a){var r=i[a];WebInspector.Cookies.cookieMatchesResourceURL(e[s],r)&&(this._totalSize+=n,o||(o=!0,t.push(e[s])))}return t},_deleteCookie:function(e){InspectorBackend.deleteCookie(e.name,this._cookieDomain),this._update()},_deleteButtonClicked:function(){this._cookiesTable.selectedCookie&&this._deleteCookie(this._cookiesTable.selectedCookie)},_refreshButtonClicked:function(e){this._update()}},WebInspector.CookieItemsView.prototype.__proto__=WebInspector.View.prototype,WebInspector.SimpleCookiesTable=function(){this.element=document.createElement("div");var e={0:{},1:{}};e[0].title=WebInspector.UIString("Name"),e[1].title=WebInspector.UIString("Value"),this._dataGrid=new WebInspector.DataGrid(e),this._dataGrid.autoSizeColumns(20,80),this.element.appendChild(this._dataGrid.element),this._dataGrid.updateWidths()},WebInspector.SimpleCookiesTable.prototype={setCookies:function(e){this._dataGrid.removeChildren();for(var t={},i=0;i<e.length;++i)if(!t[e[i].name]){t[e[i].name]=!0;var s={};s[0]=e[i].name,s[1]=e[i].value;var o=new WebInspector.DataGridNode(s,!1);o.selectable=!0,this._dataGrid.appendChild(o)}this._dataGrid.children[0].selected=!0},resize:function(){this._dataGrid&&this._dataGrid.updateWidths()}};