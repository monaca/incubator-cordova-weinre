/*
 * Copyright (C) 2008 Nokia Inc.  All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY
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
WebInspector.DOMStorageItemsView=function(t){WebInspector.View.call(this),this.domStorage=t,this.element.addStyleClass("storage-view"),this.element.addStyleClass("table"),this.deleteButton=new WebInspector.StatusBarButton(WebInspector.UIString("Delete"),"delete-storage-status-bar-item"),this.deleteButton.visible=!1,this.deleteButton.addEventListener("click",this._deleteButtonClicked.bind(this),!1),this.refreshButton=new WebInspector.StatusBarButton(WebInspector.UIString("Refresh"),"refresh-storage-status-bar-item"),this.refreshButton.addEventListener("click",this._refreshButtonClicked.bind(this),!1)},WebInspector.DOMStorageItemsView.prototype={get statusBarItems(){return[this.refreshButton.element,this.deleteButton.element]},show:function(t){WebInspector.View.prototype.show.call(this,t),this.update()},hide:function(){WebInspector.View.prototype.hide.call(this),this.deleteButton.visible=!1},update:function(){this.element.removeChildren();var t=this._showDOMStorageEntries.bind(this);this.domStorage.getEntries(t)},_showDOMStorageEntries:function(t){this._dataGrid=this._dataGridForDOMStorageEntries(t),this.element.appendChild(this._dataGrid.element),this._dataGrid.autoSizeColumns(10),this.deleteButton.visible=!0},resize:function(){this._dataGrid&&this._dataGrid.updateWidths()},_dataGridForDOMStorageEntries:function(t){var e={0:{},1:{}};e[0].title=WebInspector.UIString("Key"),e[1].title=WebInspector.UIString("Value");for(var i=[],s=[],r=t.length,a=0;a<t.length;a++){var n={},o=t[a][0];n[0]=o;var d=t[a][1];n[1]=d;var h=new WebInspector.DataGridNode(n,!1);h.selectable=!0,i.push(h),s.push(o)}var l=new WebInspector.DataGrid(e,this._editingCallback.bind(this),this._deleteCallback.bind(this));for(r=i.length,a=0;a<r;++a)l.appendChild(i[a]);return l.addCreationNode(!1),0<r&&(i[0].selected=!0),l},_deleteButtonClicked:function(t){this._dataGrid&&this._dataGrid.selectedNode&&this._deleteCallback(this._dataGrid.selectedNode)},_refreshButtonClicked:function(t){this.update()},_editingCallback:function(t,e,i,s){var r=this.domStorage;0===e?(i&&r.removeItem(i),r.setItem(s,t.data[1])):r.setItem(t.data[0],s),this.update()},_deleteCallback:function(t){t&&!t.isCreationNode&&(this.domStorage&&this.domStorage.removeItem(t.data[0]),this.update())}},WebInspector.DOMStorageItemsView.prototype.__proto__=WebInspector.View.prototype;