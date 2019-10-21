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
WebInspector.GoToLineDialog=function(e){this._element=document.createElement("div"),this._element.className="go-to-line-dialog",this._element.addEventListener("keydown",this._onKeyDown.bind(this),!1),this._closeKeys=[WebInspector.KeyboardShortcut.Keys.Enter.code,WebInspector.KeyboardShortcut.Keys.Esc.code];var t=this._element;t.createChild("label").innerText=WebInspector.UIString("Go to line: "),this._input=t.createChild("input"),this._input.setAttribute("type","text"),this._input.setAttribute("size",6);var i=e.textModel.linesCount;i&&this._input.setAttribute("title",WebInspector.UIString("1 - %d",i));var n=this._onBlur.bind(this);this._input.addEventListener("blur",n,!1);var s=t.createChild("button");s.innerText=WebInspector.UIString("Go"),s.addEventListener("click",this._onClick.bind(this),!1),s.addEventListener("mousedown",function(e){
// Ok button click will close the dialog, removing onBlur listener
// to let click event be handled.
this._input.removeEventListener("blur",n,!1)}.bind(this),!1),(this._view=e).element.appendChild(this._element),this._previousFocusElement=WebInspector.currentFocusElement,WebInspector.currentFocusElement=this._input,this._input.select()},WebInspector.GoToLineDialog.show=function(e){this._instance||(this._instance=new WebInspector.GoToLineDialog(e))},WebInspector.GoToLineDialog.prototype={_hide:function(){this._isHiding||(this._isHiding=!0,WebInspector.currentFocusElement=this._previousFocusElement,WebInspector.GoToLineDialog._instance=null,this._element.parentElement.removeChild(this._element))},_onBlur:function(e){this._hide()},_onKeyDown:function(e){e.keyCode!==WebInspector.KeyboardShortcut.Keys.Tab.code?(e.keyCode===WebInspector.KeyboardShortcut.Keys.Enter.code&&this._highlightSelectedLine(),0<=this._closeKeys.indexOf(e.keyCode)&&(this._hide(),e.stopPropagation())):e.preventDefault()},_onClick:function(e){this._highlightSelectedLine(),this._hide()},_highlightSelectedLine:function(){var e=this._input.value,t=parseInt(e,10);!isNaN(t)&&0<t&&(t=Math.min(t,this._view.textModel.linesCount),this._view.highlightLine(t))}};