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
var InjectedFakeWorker=function(r,e,t){function n(e,t){var n=this._expandURLAndCheckOrigin(document.baseURI,location.href,t);this._worker=e,this._id=r.nextWorkerId(),this.channel=new MessageChannel,this._listeners=[],this._buildWorker(n),r.didCreateWorker(this._id,n.url,!1)}function s(e){this.url=e,this.split()}function i(e,t){this.name=e,this.message=e+": DOM Exception "+t,this.code=t,this.toString=o(function(){return"Error: "+this.message},this)}function o(e,t){var n=Array.prototype.slice.call(arguments,2);return function(){return e.apply(t,n.concat(Array.prototype.slice.call(arguments,0)))}}Worker=function(e){var t=new n(this,e);if(null===t)return null;this.isFake=!0,this.postMessage=o(t.postMessage,t),this.terminate=o(t.terminate,t),this.__defineGetter__("onmessage",function(){return t.channel.port1.onmessage}),this.__defineSetter__("onmessage",function(e){t.channel.port1.onmessage=e}),this.addEventListener=o(t.channel.port1.addEventListener,t.channel.port1),this.removeEventListener=o(t.channel.port1.removeEventListener,t.channel.port1),this.dispatchEvent=o(t.channel.port1.dispatchEvent,t.channel.port1)},n.prototype={postMessage:function(e,t){null!=this._frame?this.channel.port1.postMessage.apply(this.channel.port1,arguments):this._pendingMessages?this._pendingMessages.push(arguments):this._pendingMessages=[arguments]},terminate:function(){r.didDestroyWorker(this._id),this.channel.port1.close(),this.channel.port2.close(),null!=this._frame&&this._frame.frameElement.parentNode.removeChild(this._frame.frameElement),this._frame=null,this._worker=null},_buildWorker:function(e){var t=this._loadScript(e.url),n=document.createElement("iframe");n.style.display="none",this._document=document,n.onload=o(this._onWorkerFrameLoaded,this,n,e,t),document.body?this._attachWorkerFrameToDocument(n,e,t):window.addEventListener("load",o(this._attachWorkerFrameToDocument,this,n),!1)},_attachWorkerFrameToDocument:function(e){document.body.appendChild(e)},_onWorkerFrameLoaded:function(e,t,n){var r=e.contentWindow;this._frame=r,this._setupWorkerContext(r,t);var s="(function() { var location = __devtools.location; var window; "+n+"})();\n//@ sourceURL="+t.url;if(r.eval(s),this._pendingMessages){for(var i=0;i<this._pendingMessages.length;++i)this.postMessage.apply(this,this._pendingMessages[i]);delete this._pendingMessages}},_setupWorkerContext:function(e,t){e.__devtools={handleException:o(this._handleException,this),location:t.mockLocation()};var n=this;e.__defineGetter__("onmessage",function(){return n.channel.port2.onmessage?n.channel.port2.onmessage.originalCallback:null}),e.__defineSetter__("onmessage",function(e){var t=o(n._callbackWrapper,n,e);t.originalCallback=e,n.channel.port2.onmessage=t}),e.addEventListener=o(this._addEventListener,this),e.removeEventListener=o(this._removeEventListener,this),e.dispatchEvent=o(this.channel.port2.dispatchEvent,this.channel.port2),e.postMessage=o(this.channel.port2.postMessage,this.channel.port2),e.importScripts=o(this._importScripts,this,e),e.close=o(this.terminate,this)},_addEventListener:function(e,t,n){var r=o(this._callbackWrapper,this,t);r.originalCallback=t,r.type=e,r.useCapture=Boolean(n),this.channel.port2.addEventListener(e,r,n),this._listeners.push(r)},_removeEventListener:function(e,t,n){for(var r=this._listeners,s=0;s<r.length;++s)if(r[s].originalCallback===t&&r[s].type===e&&r[s].useCapture===Boolean(n)){this.channel.port2.removeEventListener(e,r[s],n),r[s]=r[r.length-1],r.pop();break}},_callbackWrapper:function(e,t){
// Shortcut -- if no exception handlers installed, avoid try/catch so as not to obscure line number.
if(this._frame.onerror||this._worker.onerror)try{e(t)}catch(e){this._handleException(e,this._frame.onerror,this._worker.onerror)}else e(t)},_handleException:function(e){
// NB: it should be an ErrorEvent, but creating it from script is not
// currently supported, so emulate it on top of plain vanilla Event.
var t=this._document.createEvent("Event");t.initEvent("Event",!1,!1),t.message="Uncaught exception";for(var n=1;n<arguments.length;++n)if(arguments[n]&&arguments[n](t))return;throw e},_importScripts:function(e){for(var t=1;t<arguments.length;++t){var n=e.__devtools.location.href,r=this._expandURLAndCheckOrigin(n,n,arguments[t]);e.eval(this._loadScript(r.url)+"\n//@ sourceURL= "+r.url)}},_loadScript:function(e){var t=new XMLHttpRequest;t.open("GET",e,!1),t.send(null);var n=t.responseText;return 0!=t.status&&t.status/100!=2&&(// We're getting status === 0 when using file://.
console.error("Failed to load worker: "+e+"["+t.status+"]"),n=""),n},_expandURLAndCheckOrigin:function(e,t,n){var r=new s(e).completeWith(n);if(!r.sameOrigin(t))throw new i("SECURITY_ERR",18);return r}},s.prototype={urlRegEx:/^(http[s]?|file):\/\/([^\/:]*)(:[\d]+)?(?:(\/[^#?]*)(\?[^#]*)?(?:#(.*))?)?$/i,split:function(){function e(e){return null==e?"":e}var t=this.urlRegEx.exec(this.url);this.schema=t[1],this.host=t[2],this.port=e(t[3]),this.path=e(t[4]),this.query=e(t[5]),this.fragment=e(t[6])},mockLocation:function(){var e=this.host.replace(/^[^@]*@/,"");return{href:this.url,protocol:this.schema+":",host:e,hostname:e,port:this.port,pathname:this.path,search:this.query,hash:this.fragment}},completeWith:function(e){if(""===e||/^[^/]*:/.exec(e))// If given absolute url, return as is now.
return new s(e);var t=/^([^#?]*)(.*)$/.exec(e),n=("/"===t[1].slice(0,1)?"":this.path.replace(/[^/]*$/,""))+t[1];// => [ url, path, query-andor-fragment ]
return n=n.replace(/(\/\.)+(\/|$)/g,"/").replace(/[^/]*\/\.\.(\/|$)/g,""),new s(this.schema+"://"+this.host+this.port+n+t[2])},sameOrigin:function(e){function t(e,t){var n=t.slice(1);return"https"===e&&443==n||"http"===e&&80==n?"":t}var n=new s(e);return this.schema===n.schema&&this.host===n.host&&t(this.schema,this.port)===t(n.schema,n.port)}}};