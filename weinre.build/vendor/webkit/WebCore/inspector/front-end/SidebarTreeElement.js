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
WebInspector.SidebarSectionTreeElement=function(t,e,s){TreeElement.call(this,t.escapeHTML(),e||{},s)},WebInspector.SidebarSectionTreeElement.prototype={selectable:!1,get smallChildren(){return this._smallChildren},set smallChildren(t){this._smallChildren!==t&&(this._smallChildren=t,this._smallChildren?this._childrenListNode.addStyleClass("small"):this._childrenListNode.removeStyleClass("small"))},onattach:function(){this._listItemNode.addStyleClass("sidebar-tree-section")},onreveal:function(){this.listItemElement&&this.listItemElement.scrollIntoViewIfNeeded(!1)}},WebInspector.SidebarSectionTreeElement.prototype.__proto__=TreeElement.prototype,WebInspector.SidebarTreeElement=function(t,e,s,l,i){TreeElement.call(this,"",l||{},i),i&&(this.disclosureButton=document.createElement("button"),this.disclosureButton.className="disclosure-button"),this.iconElement||(this.iconElement=document.createElement("img"),this.iconElement.className="icon"),this.statusElement=document.createElement("div"),this.statusElement.className="status",this.titlesElement=document.createElement("div"),this.titlesElement.className="titles",this.titleElement=document.createElement("span"),this.titleElement.className="title",this.titlesElement.appendChild(this.titleElement),this.subtitleElement=document.createElement("span"),this.subtitleElement.className="subtitle",this.titlesElement.appendChild(this.subtitleElement),this.className=t,this.mainTitle=e,this.subtitle=s},WebInspector.SidebarTreeElement.prototype={get small(){return this._small},set small(t){this._small=t,this._listItemNode&&(this._small?this._listItemNode.addStyleClass("small"):this._listItemNode.removeStyleClass("small"))},get mainTitle(){return this._mainTitle},set mainTitle(t){this._mainTitle=t,this.refreshTitles()},get subtitle(){return this._subtitle},set subtitle(t){this._subtitle=t,this.refreshTitles()},get bubbleText(){return this._bubbleText},set bubbleText(t){this.bubbleElement||(this.bubbleElement=document.createElement("div"),this.bubbleElement.className="bubble",this.statusElement.appendChild(this.bubbleElement)),this._bubbleText=t,this.bubbleElement.textContent=t},refreshTitles:function(){var t=this.mainTitle;this.titleElement.textContent!==t&&(this.titleElement.textContent=t);var e=this.subtitle;e?(this.subtitleElement.textContent!==e&&(this.subtitleElement.textContent=e),this.titlesElement.removeStyleClass("no-subtitle")):(this.subtitleElement.textContent="",this.titlesElement.addStyleClass("no-subtitle"))},isEventWithinDisclosureTriangle:function(t){return t.target===this.disclosureButton},onattach:function(){this._listItemNode.addStyleClass("sidebar-tree-item"),this.className&&this._listItemNode.addStyleClass(this.className),this.small&&this._listItemNode.addStyleClass("small"),this.hasChildren&&this.disclosureButton&&this._listItemNode.appendChild(this.disclosureButton),this._listItemNode.appendChild(this.iconElement),this._listItemNode.appendChild(this.statusElement),this._listItemNode.appendChild(this.titlesElement)},onreveal:function(){this._listItemNode&&this._listItemNode.scrollIntoViewIfNeeded(!1)}},WebInspector.SidebarTreeElement.prototype.__proto__=TreeElement.prototype;