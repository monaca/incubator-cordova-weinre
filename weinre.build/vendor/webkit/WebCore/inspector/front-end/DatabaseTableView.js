/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
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
WebInspector.DatabaseTableView=function(e,t){WebInspector.View.call(this),this.database=e,this.tableName=t,this.element.addStyleClass("storage-view"),this.element.addStyleClass("table"),this.refreshButton=new WebInspector.StatusBarButton(WebInspector.UIString("Refresh"),"refresh-storage-status-bar-item"),this.refreshButton.addEventListener("click",this._refreshButtonClicked.bind(this),!1)},WebInspector.DatabaseTableView.prototype={show:function(e){WebInspector.View.prototype.show.call(this,e),this.update()},get statusBarItems(){return[this.refreshButton.element]},update:function(){this.database.executeSql("SELECT * FROM "+this.tableName,this._queryFinished.bind(this),this._queryError.bind(this))},_queryFinished:function(e,t){this.element.removeChildren();var s=WebInspector.panels.resources.dataGridForResult(e,t);if(!s){var r=document.createElement("div");return r.className="storage-empty-view",r.textContent=WebInspector.UIString("The “%s”\ntable is empty.",this.tableName),void this.element.appendChild(r)}this.element.appendChild(s.element),s.autoSizeColumns(5)},_queryError:function(e){this.element.removeChildren();var t=document.createElement("div");t.className="storage-table-error",t.textContent=WebInspector.UIString("An error occurred trying to\nread the “%s” table.",this.tableName),this.element.appendChild(t)},_refreshButtonClicked:function(e){this.update()}},WebInspector.DatabaseTableView.prototype.__proto__=WebInspector.View.prototype;