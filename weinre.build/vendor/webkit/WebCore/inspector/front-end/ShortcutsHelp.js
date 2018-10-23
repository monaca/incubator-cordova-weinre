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
WebInspector.ShortcutsHelp=function(){this._sections={}},WebInspector.ShortcutsHelp.prototype={section:function(e){var t=this._sections[e];return t||(this._sections[e]=t=new WebInspector.ShortcutsSection(e)),t},show:function(){this._helpScreen||(this._helpScreen=new WebInspector.HelpScreen(WebInspector.UIString("Keyboard Shortcuts")),this._buildTable(this._helpScreen.contentElement,2)),this._helpScreen.show()},_buildTable:function(e,t){var n=0,r=[];for(var s in this._sections)n+=this._sections[s]._height,r.push(this._sections[s]);r=r.sort(function(e,t){return e.order-t.order});var i=n/t,c=document.createElement("table");c.className="help-table";var h=c.createChild("tr");
// This manual layout ugliness should be gone once WebKit implements
// pagination hints for CSS columns (break-inside etc).
for(s=0;s<r.length;){var o=h.createChild("td");o.style.width=100/t+"%";for(var a=o.createChild("table"),l=0;l<i&&s<r.length;l+=r[s]._height,s++)r[s].renderSection(a)}e.appendChild(c)}},WebInspector.shortcutsHelp=new WebInspector.ShortcutsHelp,WebInspector.ShortcutsSection=function(e){this.name=e,this._lines=[],this.order=++WebInspector.ShortcutsSection._sequenceNumber},WebInspector.ShortcutsSection._sequenceNumber=0,WebInspector.ShortcutsSection.prototype={addKey:function(e,t){this.addLine(this._renderKey(e),t)},addRelatedKeys:function(e,t){this.addLine(this._renderSequence(e,"/"),t)},addAlternateKeys:function(e,t){this.addLine(this._renderSequence(e,WebInspector.UIString("or")),t)},addLine:function(e,t){this._lines.push({key:e,text:t})},renderSection:function(e){this._renderHeader(e);for(var t=0;t<this._lines.length;++t){var n=e.createChild("tr");n.createChild("td","help-key-cell").innerHTML=this._lines[t].key+" : ",n.createChild("td").innerText=this._lines[t].text}},_renderHeader:function(e){var t=e.createChild("tr");t.createChild("th"),t.createChild("th").innerText=this.name},_renderSequence:function(e,t){var n='<span class="help-key-delimiter">'+t.escapeHTML()+"</span>";return e.map(this._renderKey).join(n)},_renderKey:function(e){return e.split(" + ").map(function(e){return'<span class="help-key monospace">'+e.escapeHTML()+"</span>"}).join('<span class="help-combine-keys">+</span>')},get _height(){return this._lines.length+2;// add some space for header
}};