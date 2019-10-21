/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
WebInspector.PleaseWaitMessage=function(){this.element=document.createElement("div"),this.element.className="please-wait-msg",this.element.textContent=WebInspector.UIString("Please wait…"),this.cancelButton=document.createElement("button"),this.cancelButton.textContent=WebInspector.UIString("Cancel"),this.cancelButton.addEventListener("click",this._cancelClicked.bind(this),!1)},WebInspector.PleaseWaitMessage.prototype={_cancelClicked:function(){if(this._cancelCallback){var e=this._cancelCallback;delete this._cancelCallback,e()}},hide:function(){var e=WebInspector.PleaseWaitMessage.prototype.instance.element;e.parentNode&&e.parentNode.removeChild(e)},get instance(){return!1 in WebInspector.PleaseWaitMessage.prototype&&(WebInspector.PleaseWaitMessage.prototype._instance=new WebInspector.PleaseWaitMessage),WebInspector.PleaseWaitMessage.prototype._instance},show:function(e,t){var n=WebInspector.PleaseWaitMessage.prototype.instance,a=n.element;a.parentNode!==e&&(a.parentNode&&a.parentNode.removeChild(a),1<a.childNodes.length&&a.removeChild(n.cancelButton),t&&(a.appendChild(n.cancelButton),n._cancelCallback=t),e.appendChild(a))},startAction:function(e,t,n){var a=WebInspector.PleaseWaitMessage.prototype.instance.element;a.parentNode!==e?(WebInspector.PleaseWaitMessage.prototype.show(e,n),setTimeout(function(){try{t()}finally{a.parentNode&&a.parentNode.removeChild(a)}},0)):t()}};