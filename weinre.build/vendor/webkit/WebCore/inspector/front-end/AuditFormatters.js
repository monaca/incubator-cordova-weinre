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
WebInspector.applyFormatters=function(t){var e,r,n=typeof t;switch(n){case"string":case"boolean":case"number":e=WebInspector.AuditFormatters.text,r=[t.toString()];break;case"object":t instanceof Array?(e=WebInspector.AuditFormatters.concat,r=t):t.type&&t.arguments&&(e=WebInspector.AuditFormatters[t.type],r=t.arguments)}if(!e)throw"Invalid value or formatter: "+n+JSON.stringify(t);return e.apply(null,r)},WebInspector.AuditFormatters={text:function(t){return document.createTextNode(t)},snippet:function(t){var e=document.createElement("div");return e.innerText=t,e.className="source-code",e},concat:function(){for(var t=document.createElement("span"),e=0;e<arguments.length;++e)t.appendChild(WebInspector.applyFormatters(arguments[e]));return t},url:function(t,e,r){var n=document.createElement("a");return n.href=t,n.title=t,n.textContent=e||t,r&&(n.target="_blank"),n}};