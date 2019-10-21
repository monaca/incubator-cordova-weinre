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
WebInspector.TestController=function(n){this._callId=n,this._waitUntilDone=!1,this.results=[]},WebInspector.TestController.prototype={waitUntilDone:function(){this._waitUntilDone=!0},notifyDone:function(n){void 0===n&&this.results.length&&(n=this.results);var t=void 0===n?'"<undefined>"':JSON.stringify(n);InspectorBackend.didEvaluateForTestInFrontend(this._callId,t)},runAfterPendingDispatches:function(n){0!==WebInspector.pendingDispatches?setTimeout(this.runAfterPendingDispatches.bind(this),0,n):n()}},WebInspector.evaluateForTestInFrontend=function(n,t){var e=new WebInspector.TestController(n);e.runAfterPendingDispatches(function(){try{var n;n=window[t]&&"function"==typeof window[t]?window[t].call(WebInspector,e):window.eval(t),e._waitUntilDone||e.notifyDone(n)}catch(n){e.notifyDone(n.toString())}})};