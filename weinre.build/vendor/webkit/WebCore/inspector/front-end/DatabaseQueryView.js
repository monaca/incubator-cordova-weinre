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
WebInspector.DatabaseQueryView=function(e){WebInspector.View.call(this),this.database=e,this.element.addStyleClass("storage-view"),this.element.addStyleClass("query"),this.element.addStyleClass("monospace"),this.element.tabIndex=0,this.element.addEventListener("selectstart",this._selectStart.bind(this),!1),this.promptElement=document.createElement("div"),this.promptElement.className="database-query-prompt",this.promptElement.appendChild(document.createElement("br")),this.promptElement.addEventListener("keydown",this._promptKeyDown.bind(this),!0),this.element.appendChild(this.promptElement),this.prompt=new WebInspector.TextPrompt(this.promptElement,this.completions.bind(this)," ")},WebInspector.DatabaseQueryView.prototype={show:function(e){WebInspector.View.prototype.show.call(this,e),setTimeout(function(){!this.prompt.isCaretInsidePrompt()&&window.getSelection().isCollapsed&&this.prompt.moveCaretToEndOfPrompt()}.bind(this),0)},completions:function(e,n,t){var o=e.toString().toLowerCase();if(o.length){var i=[];this.database.getTableNames(function(e){s(e.map(function(e){return e+" "})),s(["SELECT ","FROM ","WHERE ","LIMIT ","DELETE FROM ","CREATE ","DROP ","TABLE ","INDEX ","UPDATE ","INSERT INTO ","VALUES ("]),t(i)})}function s(e){if(!n||!i.length)for(var t=0;t<e.length;++t){var s=e[t].toLowerCase();if(!(s.length<o.length)&&(0===s.indexOf(o)&&(i.push(e[t]),n)))return}}},_promptKeyDown:function(e){isEnterKey(e)&&this._enterKeyPressed(e)},_selectStart:function(e){this._selectionTimeout&&clearTimeout(this._selectionTimeout),this.prompt.clearAutoComplete(),this._selectionTimeout=setTimeout(function(){delete this._selectionTimeout,!this.prompt.isCaretInsidePrompt()&&window.getSelection().isCollapsed&&this.prompt.moveCaretToEndOfPrompt(),this.prompt.autoCompleteSoon()}.bind(this),100)},_enterKeyPressed:function(e){e.preventDefault(),e.stopPropagation(),this.prompt.clearAutoComplete(!0);var t=this.prompt.text;t.length&&(this.prompt.history.push(t),this.prompt.historyOffset=0,this.prompt.text="",this.database.executeSql(t,this._queryFinished.bind(this,t),this._queryError.bind(this,t)))},_queryFinished:function(e,t,s){var n=WebInspector.panels.resources.dataGridForResult(t,s),o=e.trim();n&&(n.element.addStyleClass("inline"),this._appendQueryResult(o,n.element),n.autoSizeColumns(5)),(o.match(/^create /i)||o.match(/^drop table /i))&&WebInspector.panels.resources.updateDatabaseTables(this.database)},_queryError:function(e,t){if(t.message)var s=t.message;else if(2==t.code)s=WebInspector.UIString("Database no longer has expected version.");else s=WebInspector.UIString("An unexpected error %s occurred.",t.code);this._appendQueryResult(e,s,"error")},_appendQueryResult:function(e,t,s){var n=document.createElement("div");n.className="database-user-query";var o=document.createElement("span");o.className="database-query-text",o.textContent=e,n.appendChild(o);var i=document.createElement("div");i.className="database-query-result",s&&i.addStyleClass(s),"string"==typeof t||t instanceof String?i.textContent=t:t&&t.nodeName&&i.appendChild(t),i.childNodes.length&&n.appendChild(i),this.element.insertBefore(n,this.promptElement),this.promptElement.scrollIntoView(!1)}},WebInspector.DatabaseQueryView.prototype.__proto__=WebInspector.View.prototype;