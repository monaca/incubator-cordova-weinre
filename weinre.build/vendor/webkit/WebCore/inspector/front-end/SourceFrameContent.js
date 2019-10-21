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
WebInspector.SourceFrameContent=function(e,t,o){this._text=e,this._mapping=t,this._scriptRanges=o},WebInspector.SourceFrameContent.prototype={get text(){return this._text},get scriptRanges(){return this._scriptRanges},sourceFrameLineNumberToActualLocation:function(e){for(
// Script content may start right after <script> tag without new line (e.g. "<script>function f()...").
// In that case, column number should be equal to script column offset.
var t=0,o=0;o<this._scriptRanges.length;++o){var r=this._scriptRanges[o];if(!(r.start.lineNumber<e)){r.start.lineNumber===e&&(t=r.start.columnNumber);break}}var n=this._mapping.sourceLocationToActualLocation(e,t);return n.sourceID=this._sourceIDForSourceFrameLineNumber(e),n},actualLocationToSourceFrameLineNumber:function(e,t){return this._mapping.actualLocationToSourceLocation(e,t).lineNumber},_sourceIDForSourceFrameLineNumber:function(e){for(var t=0;t<this._scriptRanges.length;++t){var o=this._scriptRanges[t];if(e<o.start.lineNumber)return;if(!(e>o.end.lineNumber)&&(e!==o.end.lineNumber||o.end.columnNumber))return o.sourceID}}},WebInspector.SourceMapping=function(){},WebInspector.SourceMapping.prototype={actualLocationToSourceLocation:function(e,t){
// Should be implemented by subclasses.
},sourceLocationToActualLocation:function(e,t){
// Should be implemented by subclasses.
}},WebInspector.IdenticalSourceMapping=function(){WebInspector.SourceMapping.call(this)},WebInspector.IdenticalSourceMapping.prototype={actualLocationToSourceLocation:function(e,t){return{lineNumber:e,columnNumber:t}},sourceLocationToActualLocation:function(e,t){return{lineNumber:e,columnNumber:t}}},WebInspector.IdenticalSourceMapping.prototype.__proto__=WebInspector.SourceMapping.prototype;