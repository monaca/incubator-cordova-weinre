/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
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
WebInspector.AuditResultView=function(e){WebInspector.View.call(this),this.element.className="audit-result-view",e.sort(function(e,t){return(e.title||"").localeCompare(t.title||"")});for(var t=0;t<e.length;++t)this.element.appendChild(new WebInspector.AuditCategoryResultPane(e[t]).element)},WebInspector.AuditResultView.prototype.__proto__=WebInspector.View.prototype,WebInspector.AuditCategoryResultPane=function(e){WebInspector.SidebarPane.call(this,e.title);var t=document.createElement("ol");this.bodyElement.addStyleClass("audit-result-tree"),this.bodyElement.appendChild(t),this._treeOutline=new TreeOutline(t),this._treeOutline.expandTreeElementsWhenArrowing=!0,e.ruleResults.sort(function(e,t){var l=WebInspector.AuditRule.SeverityOrder[e.severity||0]-WebInspector.AuditRule.SeverityOrder[t.severity||0];return l||(l=(e.value||"").localeCompare(t.value||"")),l});for(var l=0;l<e.ruleResults.length;++l){var n=e.ruleResults[l],r=this._appendResult(this._treeOutline,n);if(r.listItemElement.addStyleClass("audit-result"),n.severity){var s=document.createElement("img");s.className="severity-"+n.severity,r.listItemElement.appendChild(s)}}this.expand()},WebInspector.AuditCategoryResultPane.prototype={_appendResult:function(e,t){var l="";"string"==typeof t.value&&(l=t.value,t.violationCount&&(l=String.sprintf("%s (%d)",l,t.violationCount)));var n=new TreeElement(null,null,!!t.children);if(n.titleHTML=l,e.appendChild(n),t.className&&n.listItemElement.addStyleClass(t.className),"string"!=typeof t.value&&n.listItemElement.appendChild(WebInspector.applyFormatters(t.value)),t.children)for(var r=0;r<t.children.length;++r)this._appendResult(n,t.children[r]);return t.expanded&&(n.listItemElement.removeStyleClass("parent"),n.listItemElement.addStyleClass("parent-expanded"),n.expand()),n}},WebInspector.AuditCategoryResultPane.prototype.__proto__=WebInspector.SidebarPane.prototype;