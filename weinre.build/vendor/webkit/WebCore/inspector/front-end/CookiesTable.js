/*
 * Copyright (C) 2009 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Joseph Pecoraro
 * Copyright (C) 2010 Google Inc. All rights reserved.
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
WebInspector.CookiesTable=function(e,t,i){this._cookieDomain=e;var s={0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{}};s[0].title=WebInspector.UIString("Name"),s[0].sortable=!0,s[0].disclosure=t,s[0].width="24%",s[1].title=WebInspector.UIString("Value"),s[1].sortable=!0,s[1].width="34%",s[2].title=WebInspector.UIString("Domain"),s[2].sortable=!0,s[2].width="7%",s[3].title=WebInspector.UIString("Path"),s[3].sortable=!0,s[3].width="7%",s[4].title=WebInspector.UIString("Expires"),s[4].sortable=!0,s[4].width="7%",s[5].title=WebInspector.UIString("Size"),s[5].aligned="right",s[5].sortable=!0,s[5].width="7%",s[6].title=WebInspector.UIString("HTTP"),s[6].aligned="centered",s[6].sortable=!0,s[6].width="7%",s[7].title=WebInspector.UIString("Secure"),s[7].aligned="centered",s[7].sortable=!0,s[7].width="7%",this._dataGrid=new WebInspector.DataGrid(s,null,i?this._onDeleteFromGrid.bind(this):null),this._dataGrid.addEventListener("sorting changed",this._rebuildTable,this),this.element=this._dataGrid.element,this._data=[],this._deleteCallback=i},WebInspector.CookiesTable.prototype={updateWidths:function(){this._dataGrid&&this._dataGrid.updateWidths()},setCookies:function(e){this._data=[{cookies:e}],this._rebuildTable()},addCookiesFolder:function(e,t){this._data.push({cookies:t,folderName:e}),this._rebuildTable()},get selectedCookie(){var e=this._dataGrid.selectedNode;return e?e.cookie:null},_rebuildTable:function(){this._dataGrid.removeChildren();for(var e=0;e<this._data.length;++e){var t=this._data[e];if(t.folderName){var i=[t.folderName,"","","","",this._totalSize(t.cookies),"",""],s=new WebInspector.DataGridNode(i);s.selectable=!0,this._dataGrid.appendChild(s),s.element.addStyleClass("row-group"),this._populateNode(s,t.cookies),s.expand()}else this._populateNode(this._dataGrid,t.cookies)}},_populateNode:function(e,t){var i=this.selectedCookie;if(e.removeChildren(),t){this._sortCookies(t);for(var s=0;s<t.length;++s){var a=this._createGridNode(t[s]);e.appendChild(a),i===t[s]&&(a.selected=!0)}}},_totalSize:function(e){for(var t=0,i=0;e&&i<e.length;++i)t+=e[i].size;return t},_sortCookies:function(e){var t,s="ascending"===this._dataGrid.sortOrder?1:-1;function i(e,t,i){return s*(t[e]+"").localeCompare(i[e]+"")}switch(parseInt(this._dataGrid.sortColumnIdentifier)){case 0:t=i.bind(this,"name");break;case 1:t=i.bind(this,"value");break;case 2:t=i.bind(this,"domain");break;case 3:t=i.bind(this,"path");break;case 4:t=function(e,t){return e.session!==t.session?s*(e.session?1:-1):e.session?0:s*(e.expires-t.expires)};break;case 5:t=function(e,t,i){return s*(t[e]-i[e])}.bind(this,"size");break;case 6:t=i.bind(this,"httpOnly");break;case 7:t=i.bind(this,"secure");break;default:i.bind(this,"name")}e.sort(t)},_createGridNode:function(e){var t={};t[0]=e.name,t[1]=e.value,t[2]=e.domain||"",t[3]=e.path||"",t[4]=e.type===WebInspector.Cookie.Type.Request?"":e.session?WebInspector.UIString("Session"):new Date(e.expires).toGMTString(),t[5]=e.size;t[6]=e.httpOnly?"✓":"",t[7]=e.secure?"✓":"";var i=new WebInspector.DataGridNode(t);return i.cookie=e,i.selectable=!0,i},_onDeleteFromGrid:function(e){this._deleteCallback(e.cookie)}};