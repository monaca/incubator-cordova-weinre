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
WebInspector.ContextMenu=function(){this._items=[],this._handlers={}},WebInspector.ContextMenu.prototype={show:function(t){
// Remove trailing separator.
for(;0<this._items.length&&!("id"in this._items[this._items.length-1]);)this._items.splice(this._items.length-1,1);this._items.length&&(WebInspector._contextMenu=this,InspectorFrontendHost.showContextMenu(t,this._items)),t.stopPropagation()},appendItem:function(t,e,n){var s=this._items.length;this._items.push({type:"item",id:s,label:t,enabled:!n}),this._handlers[s]=e},appendCheckboxItem:function(t,e,n,s){var i=this._items.length;this._items.push({type:"checkbox",id:i,label:t,checked:!!n,enabled:!s}),this._handlers[i]=e},appendSeparator:function(){
// No separator dupes allowed.
0!==this._items.length&&"id"in this._items[this._items.length-1]&&this._items.push({type:"separator"})},_itemSelected:function(t){this._handlers[t]&&this._handlers[t].call(this)}},WebInspector.contextMenuItemSelected=function(t){WebInspector._contextMenu&&WebInspector._contextMenu._itemSelected(t)},WebInspector.contextMenuCleared=function(){
// FIXME: Unfortunately, contextMenuCleared is invoked between show and item selected
// so we can't delete last menu object from WebInspector. Fix the contract.
};