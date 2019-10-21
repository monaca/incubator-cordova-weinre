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
WebInspector.DOMSyntaxHighlighter=function(e){this._tokenizer=WebInspector.SourceTokenizer.Registry.getInstance().getTokenizer(e)},WebInspector.DOMSyntaxHighlighter.prototype={createSpan:function(e,t){var n=document.createElement("span");return n.className="webkit-"+t,n.appendChild(document.createTextNode(e)),n},syntaxHighlightNode:function(e){this._tokenizer.condition=this._tokenizer.initialCondition;var t=e.textContent.split("\n");e.removeChildren();for(var n=t[0].length?0:1;n<t.length;++n){var i=t[n],r=0;this._tokenizer.line=i;var o=0;do{var a=this._tokenizer.nextToken(o),h=this._tokenizer.tokenType;if(h){if(r<o){var d=i.substring(r,o);e.appendChild(document.createTextNode(d))}var s=i.substring(o,a);e.appendChild(this.createSpan(s,h)),r=a}o=a}while(o<i.length);if(r<i.length){d=i.substring(r,i.length);e.appendChild(document.createTextNode(d))}n<t.length-1&&e.appendChild(document.createElement("br"))}}};