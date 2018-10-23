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
WebInspector.TextRange=function(t,e,n,i){this.startLine=t,this.startColumn=e,this.endLine=n,this.endColumn=i},WebInspector.TextRange.prototype={isEmpty:function(){return this.startLine===this.endLine&&this.startColumn===this.endColumn},get linesCount(){return this.endLine-this.startLine},clone:function(){return new WebInspector.TextRange(this.startLine,this.startColumn,this.endLine,this.endColumn)}},WebInspector.TextEditorModel=function(){this._lines=[""],this._attributes=[],this._undoStack=[],this._noPunctuationRegex=/[^ !%&()*+,-.:;<=>?\[\]\^{|}~]+/},WebInspector.TextEditorModel.prototype={set changeListener(t){this._changeListener=t},get linesCount(){return this._lines.length},line:function(t){if(t>=this._lines.length)throw"Out of bounds:"+t;return this._lines[t]},lineLength:function(t){return this._lines[t].length},setText:function(t,e){t||(t=new WebInspector.TextRange(0,0,this._lines.length-1,this._lines[this._lines.length-1].length));var n=this._pushUndoableCommand(t,e),i=this._innerSetText(t,e);return n.range=i.clone(),this._changeListener&&this._changeListener(t,i,n.text,e),i},set replaceTabsWithSpaces(t){this._replaceTabsWithSpaces=t},_innerSetText:function(t,e){if(this._eraseRange(t),""===e)return new WebInspector.TextRange(t.startLine,t.startColumn,t.startLine,t.startColumn);var n=e.split("\n");this._replaceTabsIfNeeded(n);var i=this._lines[t.startLine].substring(0,t.startColumn),s=(this._arguments,this._lines[t.startLine].substring(t.startColumn)),r=i.length;
// Insert text.
if(1===n.length)this._setLine(t.startLine,i+n[0]+s),r+=n[0].length;else{this._setLine(t.startLine,i+n[0]);for(var a=1;a<n.length;++a)this._insertLine(t.startLine+a,n[a]);this._setLine(t.startLine+n.length-1,n[n.length-1]+s),r=n[n.length-1].length}return new WebInspector.TextRange(t.startLine,t.startColumn,t.startLine+n.length-1,r)},_replaceTabsIfNeeded:function(t){if(this._replaceTabsWithSpaces)for(var e=["    ","   ","  "," "],n=0;n<t.length;++n){for(var i=t[n],s=i.indexOf("\t");-1!==s;)s=(i=i.substring(0,s)+e[s%4]+i.substring(s+1)).indexOf("\t",s+1);t[n]=i}},_eraseRange:function(t){if(!t.isEmpty()){var e=this._lines[t.startLine].substring(0,t.startColumn),n=this._lines[t.endLine].substring(t.endColumn);t.endLine>t.startLine&&this._removeLines(t.startLine+1,t.endLine-t.startLine),this._setLine(t.startLine,e+n)}},_setLine:function(t,e){this._lines[t]=e},_removeLines:function(t,e){this._lines.splice(t,e),this._attributes.splice(t,e)},_insertLine:function(t,e){this._lines.splice(t,0,e),this._attributes.splice(t,0,{})},wordRange:function(t,e){return new WebInspector.TextRange(t,this.wordStart(t,e,!0),t,this.wordEnd(t,e,!0))},wordStart:function(t,e,n){var i=this._lines[t].substring(0,e).split("").reverse().join(""),s=this._noPunctuationRegex.exec(i);return!s||n&&0!==s.index?e:e-s.index-s[0].length},wordEnd:function(t,e,n){var i=this._lines[t].substring(e),s=this._noPunctuationRegex.exec(i);return!s||n&&0!==s.index?e:e+s.index+s[0].length},copyRange:function(t){t||(t=new WebInspector.TextRange(0,0,this._lines.length-1,this._lines[this._lines.length-1].length));var e=[];if(t.startLine===t.endLine)return e.push(this._lines[t.startLine].substring(t.startColumn,t.endColumn)),e.join("\n");e.push(this._lines[t.startLine].substring(t.startColumn));for(var n=t.startLine+1;n<t.endLine;++n)e.push(this._lines[n]);return e.push(this._lines[t.endLine].substring(0,t.endColumn)),e.join("\n")},setAttribute:function(t,e,n){var i=this._attributes[t];i||(i={},this._attributes[t]=i),i[e]=n},getAttribute:function(t,e){var n=this._attributes[t];return n?n[e]:null},removeAttribute:function(t,e){var n=this._attributes[t];n&&delete n[e]},_pushUndoableCommand:function(t,e){var n={text:this.copyRange(t),startLine:t.startLine,startColumn:t.startColumn,endLine:t.startLine,endColumn:t.startColumn};return this._inUndo?this._redoStack.push(n):(this._inRedo||(this._redoStack=[]),this._undoStack.push(n)),n},undo:function(){this._markRedoableState(),this._inUndo=!0;var t=this._doUndo(this._undoStack);return delete this._inUndo,t},redo:function(){this.markUndoableState(),this._inRedo=!0;var t=this._doUndo(this._redoStack);return delete this._inRedo,t},_doUndo:function(t){for(var e=null,n=t.length-1;0<=n;--n){var i=t[n];if(t.length=n,e=this.setText(i.range,i.text),0<n&&t[n-1].explicit)return e}return e},markUndoableState:function(){this._undoStack.length&&(this._undoStack[this._undoStack.length-1].explicit=!0)},_markRedoableState:function(){this._redoStack.length&&(this._redoStack[this._redoStack.length-1].explicit=!0)},resetUndoStack:function(){this._undoStack=[]}};