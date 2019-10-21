/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
 * Copyright (C) 2009 Apple Inc. All rights reserved.
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
WebInspector.TextEditorHighlighter=function(i,t){this._textModel=i,this._tokenizer=WebInspector.SourceTokenizer.Registry.getInstance().getTokenizer("text/html"),this._damageCallback=t,this.reset()},WebInspector.TextEditorHighlighter.prototype={set mimeType(i){var t=WebInspector.SourceTokenizer.Registry.getInstance().getTokenizer(i);t&&(this._tokenizer=t,this._tokenizerCondition=this._tokenizer.initialCondition)},reset:function(){this._lastHighlightedLine=0,this._lastHighlightedColumn=0,this._tokenizerCondition=this._tokenizer.initialCondition},highlight:function(i){
// First check if we have work to do.
i<=this._lastHighlightedLine||(this._requestedEndLine=i,this._highlightTimer||(
// Do small highlight synchronously. This will provide instant highlight on PageUp / PageDown, gentle scrolling.
this._highlightInChunks(i),
// Schedule tail highlight if necessary.
this._lastHighlightedLine<i&&(this._highlightTimer=setTimeout(this._highlightInChunks.bind(this,i),100))))},_highlightInChunks:function(i){delete this._highlightTimer,
// First we always check if we have work to do. Could be that user scrolled back and we can quit.
this._requestedEndLine<=this._lastHighlightedLine||(this._requestedEndLine===i?(this._highlightLines(this._requestedEndLine),
// Schedule tail highlight if necessary.
this._lastHighlightedLine<this._requestedEndLine&&(this._highlightTimer=setTimeout(this._highlightInChunks.bind(this,this._requestedEndLine),10))):
// User keeps updating the job in between of our timer ticks. Just reschedule self, don't eat CPU (they must be scrolling).
this._highlightTimer=setTimeout(this._highlightInChunks.bind(this,this._requestedEndLine),100))},_highlightLines:function(i){
// Tokenizer is stateless and reused accross viewers, restore its condition before highlight and save it after.
this._tokenizer.condition=this._tokenizerCondition;for(var t=0,e=this._lastHighlightedLine;e<i;++e){var h=this._textModel.line(e);this._tokenizer.line=h;var n=this._textModel.getAttribute(e,"highlight")||{};
// Highlight line.
do{var s=this._tokenizer.nextToken(this._lastHighlightedColumn),g=this._tokenizer.tokenType;if(g&&(n[this._lastHighlightedColumn]={length:s-this._lastHighlightedColumn,tokenType:g,subTokenizer:this._tokenizer.subTokenizer}),this._lastHighlightedColumn=s,1e3<++t)break}while(this._lastHighlightedColumn<h.length);if(this._textModel.setAttribute(e,"highlight",n),this._lastHighlightedColumn<h.length)
// Too much work for single chunk - exit.
break;this._lastHighlightedColumn=0}this._damageCallback(this._lastHighlightedLine,e),this._tokenizerCondition=this._tokenizer.condition,this._lastHighlightedLine=e}};