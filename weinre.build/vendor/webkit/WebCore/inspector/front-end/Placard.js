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
WebInspector.Placard=function(e,t){this.element=document.createElement("div"),this.element.className="placard",(this.element.placard=this).titleElement=document.createElement("div"),this.titleElement.className="title",this.subtitleElement=document.createElement("div"),this.subtitleElement.className="subtitle",this.element.appendChild(this.subtitleElement),this.element.appendChild(this.titleElement),this.title=e,this.subtitle=t,this.selected=!1},WebInspector.Placard.prototype={get title(){return this._title},set title(e){this._title!==e&&(this._title=e,this.titleElement.textContent=e)},get subtitle(){return this._subtitle},set subtitle(e){this._subtitle!==e&&(this._subtitle=e,this.subtitleElement.textContent=e)},get selected(){return this._selected},set selected(e){e?this.select():this.deselect()},select:function(){this._selected||(this._selected=!0,this.element.addStyleClass("selected"))},deselect:function(){this._selected&&(this._selected=!1,this.element.removeStyleClass("selected"))},toggleSelected:function(){this.selected=!this.selected}};