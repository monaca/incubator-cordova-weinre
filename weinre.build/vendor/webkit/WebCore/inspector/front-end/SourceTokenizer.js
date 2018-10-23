/* Generated by re2c 0.13.5 on Tue Jan 26 01:16:33 2010 */
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
WebInspector.SourceTokenizer=function(){},WebInspector.SourceTokenizer.prototype={set line(e){this._line=e},set condition(e){this._condition=e},get condition(){return this._condition},get subTokenizer(){return this._condition.subTokenizer},getLexCondition:function(){return this.condition.lexCondition},setLexCondition:function(e){this.condition.lexCondition=e},_charAt:function(e){return e<this._line.length?this._line.charAt(e):"\n"}},WebInspector.SourceTokenizer.Registry=function(){this._tokenizers={},this._tokenizerConstructors={"text/css":"SourceCSSTokenizer","text/html":"SourceHTMLTokenizer","text/javascript":"SourceJavaScriptTokenizer"}},WebInspector.SourceTokenizer.Registry.getInstance=function(){return WebInspector.SourceTokenizer.Registry._instance||(WebInspector.SourceTokenizer.Registry._instance=new WebInspector.SourceTokenizer.Registry),WebInspector.SourceTokenizer.Registry._instance},WebInspector.SourceTokenizer.Registry.prototype={getTokenizer:function(e){if(!this._tokenizerConstructors[e])return null;var t=this._tokenizerConstructors[e],n=this._tokenizers[t];return n||(n=new WebInspector[t],this._tokenizers[e]=n),n}};