/*
 * Copyright (C) 2010 Apple Inc. All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.ApplicationCacheItemsView=function(t,e){WebInspector.View.call(this),this.element.addStyleClass("storage-view"),this.element.addStyleClass("table"),
// FIXME: Delete Button semantics are not yet defined.
// FIXME: Needs better tooltip. (Localized)
this.deleteButton=new WebInspector.StatusBarButton(WebInspector.UIString("Delete"),"delete-storage-status-bar-item"),this.deleteButton.visible=!1,this.deleteButton.addEventListener("click",this._deleteButtonClicked.bind(this),!1),
// FIXME: Refresh Button semantics are not yet defined.
// FIXME: Needs better tooltip. (Localized)
this.refreshButton=new WebInspector.StatusBarButton(WebInspector.UIString("Refresh"),"refresh-storage-status-bar-item"),this.refreshButton.addEventListener("click",this._refreshButtonClicked.bind(this),!1),Preferences.onlineDetectionEnabled&&(this.connectivityIcon=document.createElement("img"),this.connectivityIcon.className="storage-application-cache-connectivity-icon",this.connectivityIcon.src="",this.connectivityMessage=document.createElement("span"),this.connectivityMessage.className="storage-application-cache-connectivity",this.connectivityMessage.textContent=""),this.divider=document.createElement("span"),this.divider.className="status-bar-item status-bar-divider",this.statusIcon=document.createElement("img"),this.statusIcon.className="storage-application-cache-status-icon",this.statusIcon.src="",this.statusMessage=document.createElement("span"),this.statusMessage.className="storage-application-cache-status",this.statusMessage.textContent="",this._treeElement=t,this._appcacheDomain=e,this._emptyMsgElement=document.createElement("div"),this._emptyMsgElement.className="storage-empty-view",this._emptyMsgElement.textContent=WebInspector.UIString("No Application Cache information available."),this.element.appendChild(this._emptyMsgElement),this.updateStatus(applicationCache.UNCACHED)},WebInspector.ApplicationCacheItemsView.prototype={get statusBarItems(){return Preferences.onlineDetectionEnabled?[this.refreshButton.element,this.deleteButton.element,this.connectivityIcon,this.connectivityMessage,this.divider,this.statusIcon,this.statusMessage]:[this.refreshButton.element,this.deleteButton.element,this.divider,this.statusIcon,this.statusMessage]},show:function(t){WebInspector.View.prototype.show.call(this,t),this.updateNetworkState(navigator.onLine),this._update()},hide:function(){WebInspector.View.prototype.hide.call(this),this.deleteButton.visible=!1},updateStatus:function(t){var e={};e[applicationCache.UNCACHED]={src:"Images/warningOrangeDot.png",text:"UNCACHED"},e[applicationCache.IDLE]={src:"Images/warningOrangeDot.png",text:"IDLE"},e[applicationCache.CHECKING]={src:"Images/successGreenDot.png",text:"CHECKING"},e[applicationCache.DOWNLOADING]={src:"Images/successGreenDot.png",text:"DOWNLOADING"},e[applicationCache.UPDATEREADY]={src:"Images/successGreenDot.png",text:"UPDATEREADY"},e[applicationCache.OBSOLETE]={src:"Images/errorRedDot.png",text:"OBSOLETE"};var s=e[t];s?(this.statusIcon.src=s.src,this.statusMessage.textContent=s.text):console.error("Unknown Application Cache Status was Not Handled: %d",t)},updateNetworkState:function(t){Preferences.onlineDetectionEnabled&&(this.connectivityMessage.textContent=t?(this.connectivityIcon.src="Images/successGreenDot.png",WebInspector.UIString("Online")):(this.connectivityIcon.src="Images/errorRedDot.png",WebInspector.UIString("Offline")))},_update:function(){WebInspector.ApplicationCacheDispatcher.getApplicationCachesAsync(this._updateCallback.bind(this))},_updateCallback:function(t){
// FIXME: applicationCaches is just one cache.
// FIXME: are these variables needed anywhere else?
this._manifest=t.manifest,this._creationTime=t.creationTime,this._updateTime=t.updateTime,this._size=t.size,this._resources=t.resources;var e=t.lastPathComponent;if(!this._manifest)return this._emptyMsgElement.removeStyleClass("hidden"),this.deleteButton.visible=!1,void(this._dataGrid&&this._dataGrid.element.addStyleClass("hidden"));this._dataGrid||this._createDataGrid(),this._populateDataGrid(),this._dataGrid.autoSizeColumns(20,80),this._dataGrid.element.removeStyleClass("hidden"),this._emptyMsgElement.addStyleClass("hidden"),this.deleteButton.visible=!0;var s=Number.bytesToString(this._size);this._treeElement.subtitle=WebInspector.UIString("%s (%s)",e,s)},_createDataGrid:function(){var t={0:{},1:{},2:{}};t[0].title=WebInspector.UIString("Resource"),t[0].sort="ascending",t[0].sortable=!0,t[1].title=WebInspector.UIString("Type"),t[1].sortable=!0,t[2].title=WebInspector.UIString("Size"),t[2].aligned="right",t[2].sortable=!0,this._dataGrid=new WebInspector.DataGrid(t),this.element.appendChild(this._dataGrid.element),this._dataGrid.addEventListener("sorting changed",this._populateDataGrid,this),this._dataGrid.updateWidths()},_populateDataGrid:function(){var t,e,s=this._dataGrid.selectedNode?this._dataGrid.selectedNode.resource:null,i="ascending"===this._dataGrid.sortOrder?1:-1;function a(t,e,s){return i*(e[t]+"").localeCompare(s[t]+"")}switch(parseInt(this._dataGrid.sortColumnIdentifier)){case 0:t=a.bind(this,"name");break;case 1:t=a.bind(this,"type");break;case 2:t=function(t,e,s){return i*(e[t]-s[t])}.bind(this,"size");break;default:a.bind(this,"resource");// FIXME: comparator = ?
}this._resources.sort(t),this._dataGrid.removeChildren();for(var n=0;n<this._resources.length;++n){var r={},c=this._resources[n];r[0]=c.name,r[1]=c.type,r[2]=Number.bytesToString(c.size);var o=new WebInspector.DataGridNode(r);o.resource=c,o.selectable=!0,this._dataGrid.appendChild(o),c===s&&((e=o).selected=!0)}e||(this._dataGrid.children[0].selected=!0)},resize:function(){this._dataGrid&&this._dataGrid.updateWidths()},_deleteButtonClicked:function(t){this._dataGrid&&this._dataGrid.selectedNode&&
// FIXME: Delete Button semantics are not yet defined. (Delete a single, or all?)
this._deleteCallback(this._dataGrid.selectedNode)},_deleteCallback:function(t){
// FIXME: Should we delete a single (selected) resource or all resources?
// InspectorBackend.deleteCachedResource(...)
// this._update();
},_refreshButtonClicked:function(t){
// FIXME: Is this a refresh button or a re-fetch manifest button?
// this._update();
}},WebInspector.ApplicationCacheItemsView.prototype.__proto__=WebInspector.View.prototype;