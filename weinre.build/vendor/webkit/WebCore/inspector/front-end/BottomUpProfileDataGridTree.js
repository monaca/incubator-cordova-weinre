/*
 * Copyright (C) 2009 280 North Inc. All Rights Reserved.
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
// Bottom Up Profiling shows the entire callstack backwards:
// The root node is a representation of each individual function called, and each child of that node represents
// a reverse-callstack showing how many of those calls came from it. So, unlike top-down, the statistics in
// each child still represent the root node. We have to be particularly careful of recursion with this mode
// because a root node can represent itself AND an ancestor.
WebInspector.BottomUpProfileDataGridNode=function(/*ProfileView*/e,/*ProfileNode*/t,/*BottomUpProfileDataGridTree*/o){WebInspector.ProfileDataGridNode.call(this,e,t,o,this._willHaveChildren(t)),this._remainingNodeInfos=[]},WebInspector.BottomUpProfileDataGridNode.prototype={_takePropertiesFromProfileDataGridNode:function(/*ProfileDataGridNode*/e){this._save(),this.selfTime=e.selfTime,this.totalTime=e.totalTime,this.numberOfCalls=e.numberOfCalls},
// When focusing, we keep just the members of the callstack.
_keepOnlyChild:function(/*ProfileDataGridNode*/e){this._save(),this.removeChildren(),this.appendChild(e)},_exclude:function(e){this._remainingNodeInfos&&this._populate(),this._save();for(var t=this.children,o=this.children.length;o--;)t[o]._exclude(e);var r=this.childrenByCallUID[e];r&&this._merge(r,!0)},_restore:function(){WebInspector.ProfileDataGridNode.prototype._restore(),this.children.length||(this.hasChildren=this._willHaveChildren())},_merge:function(/*ProfileDataGridNode*/e,/*Boolean*/t){this.selfTime-=e.selfTime,WebInspector.ProfileDataGridNode.prototype._merge.call(this,e,t)},_sharedPopulate:function(){for(var e=this._remainingNodeInfos,t=e.length,o=0;o<t;++o){var r=e[o],i=r.ancestor,a=r.focusNode;
// If we already have this child, then merge the data together.
if(n=this.findChild(i)){var l=r.totalTimeAccountedFor;n.selfTime+=a.selfTime,n.numberOfCalls+=a.numberOfCalls,l||(n.totalTime+=a.totalTime)}else{
// If not, add it as a true ancestor.
// In heavy mode, we take our visual identity from ancestor node...
var n=new WebInspector.BottomUpProfileDataGridNode(this.profileView,i,this.tree);i!==a&&(
// but the actual statistics from the "root" node (bottom of the callstack).
n.selfTime=a.selfTime,n.totalTime=a.totalTime,n.numberOfCalls=a.numberOfCalls),this.appendChild(n)}var s=i.parent;s&&s.parent&&(r.ancestor=s,n._remainingNodeInfos.push(r))}delete this._remainingNodeInfos},_willHaveChildren:function(e){
// In bottom up mode, our parents are our children since we display an inverted tree.
// However, we don't want to show the very top parent since it is redundant.
return!(!(e=e||this.profileNode).parent||!e.parent.parent)}},WebInspector.BottomUpProfileDataGridNode.prototype.__proto__=WebInspector.ProfileDataGridNode.prototype,WebInspector.BottomUpProfileDataGridTree=function(/*ProfileView*/e,/*ProfileNode*/t){WebInspector.ProfileDataGridTree.call(this,e,t);
// Iterate each node in pre-order.
var o=0,r=[[],[t]],i={};this._remainingNodeInfos=[];for(var a=0;a<r.length;++a)for(var l=r[a],n=r[++a],s=n.length,h=0;h<s;++h){var p=n[h];if(p.UID||(p.UID=++o),p.head&&p!==p.head){
// The total time of this ancestor is accounted for if we're in any form of recursive cycle.
var d=i[p.callUID],f=!1;if(d){for(
// The total time for this node has already been accounted for iff one of it's parents has already been visited.
// We can do this check in this style because we are traversing the tree in pre-order.
var c=l.length,m=0;m<c;++m)if(d[l[m].UID]){f=!0;break}}else d={},i[p.callUID]=d;d[p.UID]=!0,this._remainingNodeInfos.push({ancestor:p,focusNode:p,totalTimeAccountedFor:f})}var _=p.children;_.length&&(r.push(l.concat([p])),r.push(_))}
// Populate the top level nodes.
return WebInspector.BottomUpProfileDataGridNode.prototype._populate.call(this),this},WebInspector.BottomUpProfileDataGridTree.prototype={
// When focusing, we keep the entire callstack up to this ancestor.
focus:function(/*ProfileDataGridNode*/e){if(e){this._save();for(var t=e,o=e;t.parent&&t instanceof WebInspector.ProfileDataGridNode;)t._takePropertiesFromProfileDataGridNode(e),(t=(o=t).parent)instanceof WebInspector.ProfileDataGridNode&&t._keepOnlyChild(o);this.children=[o],this.totalTime=e.totalTime}},exclude:function(/*ProfileDataGridNode*/e){if(e){this._save();var t=e.callUID,o=this.childrenByCallUID[t];
// If we have a top level node that is excluded, get rid of it completely (not keeping children),
// since bottom up data relies entirely on the root node.
o&&this.children.remove(o);for(var r=this.children,i=r.length,a=0;a<i;++a)r[a]._exclude(t);this.lastComparator&&this.sort(this.lastComparator,!0)}},_sharedPopulate:WebInspector.BottomUpProfileDataGridNode.prototype._sharedPopulate},WebInspector.BottomUpProfileDataGridTree.prototype.__proto__=WebInspector.ProfileDataGridTree.prototype;