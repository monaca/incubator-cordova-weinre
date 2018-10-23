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
WebInspector.ExtensionAuditCategory=function(t,e,n){this._id=t,this._displayName=e,this._ruleCount=n},WebInspector.ExtensionAuditCategory.prototype={
// AuditCategory interface
get id(){return this._id},get displayName(){return this._displayName},get ruleCount(){return this._ruleCount},run:function(t,e){new WebInspector.ExtensionAuditCategoryResults(this,e)}},WebInspector.ExtensionAuditCategoryResults=function(t,e){this._category=t,this._pendingRules=t.ruleCount,this._ruleCompletionCallback=e,this.id=t.id+"-"+ ++WebInspector.ExtensionAuditCategoryResults._lastId,WebInspector.extensionServer.startAuditRun(t,this)},WebInspector.ExtensionAuditCategoryResults.prototype={get complete(){return!this._pendingRules},cancel:function(){for(;!this.complete;)this._addResult(null)},addResult:function(t,e,n,i){var s=new WebInspector.AuditRuleResult(t);s.addChild(e),s.severity=n,i&&this._addNode(s,i),this._addResult(s)},_addNode:function(t,e){var n=t.addChild(e.contents,e.expanded);if(e.children)for(var i=0;i<e.children.length;++i)this._addNode(n,e.children[i])},_addResult:function(t){this._ruleCompletionCallback(t),this._pendingRules--,this._pendingRules||WebInspector.extensionServer.stopAuditRun(this)}},WebInspector.ExtensionAuditCategoryResults._lastId=0;