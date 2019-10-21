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
WebInspector.ScriptFormatter=function(){this._worker=new Worker("ScriptFormatterWorker.js"),this._worker.onmessage=this._handleMessage.bind(this),this._worker.onerror=this._handleError.bind(this),this._tasks=[]},WebInspector.ScriptFormatter.locationToPosition=function(t,o,n){return(o?t[o-1]+1:0)+n},WebInspector.ScriptFormatter.positionToLocation=function(t,o){var n={};return n.lineNumber=t.upperBound(o-1),n.lineNumber?n.columnNumber=o-t[n.lineNumber-1]-1:n.columnNumber=o,n},WebInspector.ScriptFormatter.findScriptRanges=function(t,o){for(var n=[],r=0;r<o.length;++r){var i={lineNumber:o[r].lineOffset,columnNumber:o[r].columnOffset};i.position=WebInspector.ScriptFormatter.locationToPosition(t,i.lineNumber,i.columnNumber);var e=i.position+o[r].length,a=WebInspector.ScriptFormatter.positionToLocation(t,e);a.position=e,n.push({start:i,end:a,sourceID:o[r].sourceID})}return n.sort(function(t,o){return t.start.position-o.start.position}),n},WebInspector.ScriptFormatter.prototype={formatContent:function(e,a){var s=this._splitContentIntoChunks(e.text,e.scriptRanges);this._formatChunks(s,0,function(){for(var t=this._buildContentFromChunks(s),o=new WebInspector.SourceMappingForFormattedScript(e.text.lineEndings(),t.text.lineEndings(),t.mapping),n=[],r=0;r<e.scriptRanges.length;++r){var i=e.scriptRanges[r];formattedScriptRange={},formattedScriptRange.start=o.originalPositionToFormattedLocation(i.start.position),formattedScriptRange.end=o.originalPositionToFormattedLocation(i.end.position),formattedScriptRange.sourceID=i.sourceID,n.push(formattedScriptRange)}a(new WebInspector.SourceFrameContent(t.text,o,n))}.bind(this))},_splitContentIntoChunks:function(i,t){var e=[];function o(t,o,n){var r={};r.start=t,r.end=o,r.isScript=n,r.text=i.substring(t,o),e.push(r)}for(var n=0,r=0;r<t.length;++r){var a=t[r].start.position,s=t[r].end.position;n<a&&o(n,a,!1),o(a,s,!0),n=s}return n<i.length&&o(n,i.length,!1),e},_formatChunks:function(n,r,i){for(;;){if(r===n.length)return void i();var e=n[r++];if(e.isScript)break}this._formatScript(e.text,function(t,o){e.text=t,e.mapping=o,this._formatChunks(n,r,i)}.bind(this))},_buildContentFromChunks:function(t){for(var o="",n={original:[],formatted:[]},r=0;r<t.length;++r){var i=t[r];if(n.original.push(i.start),n.formatted.push(o.length),i.isScript){o&&(o+="\n");for(var e=0;e<i.mapping.original.length;++e)n.original.push(i.mapping.original[e]+i.start),n.formatted.push(i.mapping.formatted[e]+o.length);o+=i.text}else o&&(o+="\n"),o+=i.text;n.original.push(i.end),n.formatted.push(o.length)}return{text:o,mapping:n}},_formatScript:function(t,o){this._tasks.push({source:t,callback:o}),this._worker.postMessage(t)},_handleMessage:function(t){this._tasks.shift().callback(t.data.formattedSource,t.data.mapping)},_handleError:function(t){console.warn("Error in script formatter worker:",t),t.preventDefault();var o=this._tasks.shift();o.callback(o.source,{original:[],formatted:[]})}},WebInspector.SourceMappingForFormattedScript=function(t,o,n){WebInspector.SourceMapping.call(this),this._originalLineEndings=t,this._formattedLineEndings=o,this._mapping=n},WebInspector.SourceMappingForFormattedScript.prototype={actualLocationToSourceLocation:function(t,o){var n=WebInspector.ScriptFormatter.locationToPosition(this._originalLineEndings,t,o);return this.originalPositionToFormattedLocation(n)},sourceLocationToActualLocation:function(t,o){var n=WebInspector.ScriptFormatter.locationToPosition(this._formattedLineEndings,t,o),r=this._convertPosition(this._mapping.formatted,this._mapping.original,n);return WebInspector.ScriptFormatter.positionToLocation(this._originalLineEndings,r)},originalPositionToFormattedLocation:function(t){var o=this._convertPosition(this._mapping.original,this._mapping.formatted,t),n=WebInspector.ScriptFormatter.positionToLocation(this._formattedLineEndings,o);return n.position=o,n},_convertPosition:function(t,o,n){var r=t.upperBound(n),i=t[r]-t[r-1],e=o[r]-o[r-1],a=o[r-1];return i&&(a+=Math.round((n-t[r-1])*e/i)),a}},WebInspector.SourceMappingForFormattedScript.prototype.__proto__=WebInspector.SourceMapping.prototype;