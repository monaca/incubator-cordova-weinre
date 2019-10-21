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
WebInspector.TopDownProfileDataGridNode=function(/*ProfileView*/e,/*ProfileNode*/o,/*TopDownProfileDataGridTree*/t){var r=o.children&&o.children.length;WebInspector.ProfileDataGridNode.call(this,e,o,t,r),this._remainingChildren=o.children},WebInspector.TopDownProfileDataGridNode.prototype={_sharedPopulate:function(){for(var e=this._remainingChildren,o=e.length,t=0;t<o;++t)this.appendChild(new WebInspector.TopDownProfileDataGridNode(this.profileView,e[t],this.tree));this._remainingChildren=null},_exclude:function(e){this._remainingChildren&&this._populate(),this._save();for(var o=this.children,t=this.children.length;t--;)o[t]._exclude(e);var r=this.childrenByCallUID[e];r&&this._merge(r,!0)}},WebInspector.TopDownProfileDataGridNode.prototype.__proto__=WebInspector.ProfileDataGridNode.prototype,WebInspector.TopDownProfileDataGridTree=function(/*ProfileView*/e,/*ProfileNode*/o){WebInspector.ProfileDataGridTree.call(this,e,o),this._remainingChildren=o.children,WebInspector.TopDownProfileDataGridNode.prototype._populate.call(this)},WebInspector.TopDownProfileDataGridTree.prototype={focus:function(/*ProfileDataGridNode*/e){e&&(this._save(),e.savePosition(),this.children=[e],this.totalTime=e.totalTime)},exclude:function(/*ProfileDataGridNode*/e){if(e){this._save();var o=e.callUID;WebInspector.TopDownProfileDataGridNode.prototype._exclude.call(this,o),this.lastComparator&&this.sort(this.lastComparator,!0)}},restore:function(){this._savedChildren&&(this.children[0].restorePosition(),WebInspector.ProfileDataGridTree.prototype.restore.call(this))},_merge:WebInspector.TopDownProfileDataGridNode.prototype._merge,_sharedPopulate:WebInspector.TopDownProfileDataGridNode.prototype._sharedPopulate},WebInspector.TopDownProfileDataGridTree.prototype.__proto__=WebInspector.ProfileDataGridTree.prototype;