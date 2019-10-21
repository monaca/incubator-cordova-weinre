/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.Script=function(s,e,t,i,n,r,c,o,h){
// if no URL, look for "//@ sourceURL=" decorator
// note that this sourceURL comment decorator is behavior that FireBug added
// in it's 1.1 release as noted in the release notes:
// http://fbug.googlecode.com/svn/branches/firebug1.1/docs/ReleaseNotes_1.1.txt
if(this.sourceID=s,this.sourceURL=e,this._source=t,this.lineOffset=i,this.columnOffset=n,this.length=r,this.errorLine=c,this.errorMessage=o,this.worldType=h,!e){
// use of [ \t] rather than \s is to prevent \n from matching
var u=/^\s*\/\/[ \t]*@[ \t]*sourceURL[ \t]*=[ \t]*(\S+).*$/m.exec(t);u&&(this.sourceURL=u[1])}},WebInspector.Script.WorldType={MAIN_WORLD:0,EXTENSIONS_WORLD:1},WebInspector.Script.WorldType={MAIN_WORLD:0,EXTENSIONS_WORLD:1},WebInspector.Script.prototype={get startingLine(){return this.lineOffset+1},get linesCount(){return this.source?(this._lineEndings||(this._lineEndings=this._source.findAll("\n")),this._lineEndings.length+1):0},sourceLine:function(s,e){function t(){s-=this.lineOffset,e(this._source.substring(this._lineEndings[s-1],this._lineEndings[s]))}this._lineEndings?t.call(this):this.requestSource(function(){this._lineEndings=this._source.findAll("\n"),t.call(this)}.bind(this))},get source(){return!this._source&&this.resource&&(this._source=this.resource.content),this._source},set source(s){this._source=s,delete this._lineEndings},requestSource:function(e){this._source?e(this._source):InspectorBackend.getScriptSource(this.sourceID,function(s){this._source=s,e(this._source)}.bind(this))}};