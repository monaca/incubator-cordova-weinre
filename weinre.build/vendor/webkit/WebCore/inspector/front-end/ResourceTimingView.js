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
WebInspector.ResourceTimingView=function(e){WebInspector.View.call(this),this.element.addStyleClass("resource-timing-view"),(this._resource=e).addEventListener("timing changed",this._refresh,this)},WebInspector.ResourceTimingView.prototype={show:function(e){if(!this._resource.timing)return this._emptyMsgElement||(this._emptyMsgElement=document.createElement("div"),this._emptyMsgElement.className="storage-empty-view",this._emptyMsgElement.textContent=WebInspector.UIString("This request has no detailed timing info."),this.element.appendChild(this._emptyMsgElement)),void WebInspector.View.prototype.show.call(this,e);this._emptyMsgElement&&this._emptyMsgElement.parentElement.removeChild(this._emptyMsgElement),this._refresh(),WebInspector.View.prototype.show.call(this,e)},_refresh:function(){this._tableElement&&this._tableElement.parentElement.removeChild(this._tableElement),this._tableElement=WebInspector.ResourceTimingView.createTimingTable(this._resource),this.element.appendChild(this._tableElement)}},WebInspector.ResourceTimingView.createTimingTable=function(e){var t=document.createElement("table"),m=[];function n(e,t,n,i,s){var r={};r.title=e,r.className=t,r.start=n,r.end=i,m.push(r)}if(-1!==e.timing.proxyStart&&n(WebInspector.UIString("Proxy"),"proxy",e.timing.proxyStart,e.timing.proxyEnd),-1!==e.timing.dnsStart&&n(WebInspector.UIString("DNS Lookup"),"dns",e.timing.dnsStart,e.timing.dnsEnd),-1!==e.timing.connectStart)if(e.connectionReused)n(WebInspector.UIString("Blocking"),"connecting",e.timing.connectStart,e.timing.connectEnd);else{var i=e.timing.connectStart;
// Connection includes DNS, subtract it here.
-1!==e.timing.dnsStart&&(i+=e.timing.dnsEnd-e.timing.dnsStart),n(WebInspector.UIString("Connecting"),"connecting",i,e.timing.connectEnd)}-1!==e.timing.sslStart&&n(WebInspector.UIString("SSL"),"ssl",e.timing.sslStart,e.timing.sslEnd);e.timing.sendStart;-1!==e.timing.sslStart&&(e.timing.sslEnd,e.timing.sslStart),n(WebInspector.UIString("Sending"),"sending",e.timing.sendStart,e.timing.sendEnd),n(WebInspector.UIString("Waiting"),"waiting",e.timing.sendEnd,e.timing.receiveHeadersEnd),n(WebInspector.UIString("Receiving"),"receiving",1e3*(e.responseReceivedTime-e.timing.requestTime),1e3*(e.endTime-e.timing.requestTime));for(var s=1e3*(e.endTime-e.timing.requestTime),r=200/s,o=0;o<m.length;++o){var a=document.createElement("tr");t.appendChild(a);var c=document.createElement("td");c.textContent=m[o].title,a.appendChild(c),(c=document.createElement("td")).width="200px";var l=document.createElement("div");l.className="network-timing-row",c.appendChild(l);var g=document.createElement("span");g.className="network-timing-bar "+m[o].className,g.style.left=r*m[o].start+"px",g.style.right=r*(s-m[o].end)+"px",g.style.backgroundColor=m[o].color,g.textContent="​",// Important for 0-time items to have 0 width.
l.appendChild(g);var d=document.createElement("span");d.className="network-timing-bar-title",s-m[o].end<m[o].start?d.style.right=r*(s-m[o].end)+3+"px":d.style.left=r*m[o].start+3+"px",d.textContent=Number.millisToString(m[o].end-m[o].start),l.appendChild(d),a.appendChild(c)}return t},WebInspector.ResourceTimingView.prototype.__proto__=WebInspector.View.prototype;