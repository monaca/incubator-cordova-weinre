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
// See http://groups.google.com/group/http-archive-specification/web/har-1-2-spec
// for HAR specification.
WebInspector.HAREntry=function(e){this._resource=e},WebInspector.HAREntry.prototype={build:function(){return{pageref:this._resource.documentURL,startedDateTime:new Date(1e3*this._resource.startTime),time:WebInspector.HAREntry._toMilliseconds(this._resource.duration),request:this._buildRequest(),response:this._buildResponse(),
// cache: {...}, -- Not supproted yet.
timings:this._buildTimings()}},_buildRequest:function(){var e={method:this._resource.requestMethod,url:this._resource.url,
// httpVersion: "HTTP/1.1" -- Not available.
headers:this._buildHeaders(this._resource.requestHeaders),headersSize:-1,// Not available.
bodySize:-1};return this._resource.queryParameters&&(e.queryString=this._buildParameters(this._resource.queryParameters)),this._resource.requestFormData&&(e.postData=this._buildPostData()),this._resource.requestCookies&&(e.cookies=this._buildCookies(this._resource.requestCookies)),e},_buildResponse:function(){var e={status:this._resource.statusCode,statusText:this._resource.statusText,
// "httpVersion": "HTTP/1.1" -- Not available.
headers:this._buildHeaders(this._resource.responseHeaders),content:this._buildContent(),redirectURL:this._resource.responseHeaderValue("Location")||"",headersSize:-1,// Not available.
bodySize:this._resource.resourceSize};return this._resource.responseCookies&&(e.cookies=this._buildCookies(this._resource.responseCookies)),e},_buildContent:function(){return{size:this._resource.resourceSize,
// compression: 0, -- Not available.
mimeType:this._resource.mimeType}},_buildTimings:function(){var e,t,r=this._interval("connectStart","connectEnd"),s=this._interval("dnsStart","dnsEnd"),i=this._interval("sendStart","sendEnd"),n=this._interval("sslStart","sslEnd");return-1!==n&&-1!==i&&(i-=n),this._resource.connectionReused?(t=-1,e=r):(e=0,t=r,-1!==s&&(t-=s)),{blocked:e,dns:s,connect:t,send:i,wait:this._interval("sendEnd","receiveHeadersEnd"),receive:WebInspector.HAREntry._toMilliseconds(this._resource.receiveDuration),ssl:n}},_buildHeaders:function(e){var t=[];for(var r in e)t.push({name:r,value:e[r]});return t},_buildPostData:function(){var e={mimeType:this._resource.requestHeaderValue("Content-Type"),text:this._resource.requestFormData};return this._resource.formParameters&&(e.params=this._buildParameters(this._resource.formParameters)),e},_buildParameters:function(e){return e.slice()},_buildCookies:function(e){return e.map(this._buildCookie.bind(this))},_buildCookie:function(e){return{name:e.name,value:e.value,path:e.path,domain:e.domain,expires:e.expires(new Date(1e3*this._resource.startTime)),httpOnly:e.httpOnly,secure:e.secure}},_interval:function(e,t){var r=this._resource.timing;if(!r)return-1;var s=r[e];return"number"!=typeof s||-1===s?-1:Math.round(r[t]-s)}},WebInspector.HAREntry._toMilliseconds=function(e){return-1===e?-1:Math.round(1e3*e)},WebInspector.HARLog=function(){this.includeResourceIds=!1},WebInspector.HARLog.prototype={build:function(){var e=/AppleWebKit\/([^ ]+)/.exec(window.navigator.userAgent);return{version:"1.2",creator:{name:"WebInspector",version:e?e[1]:"n/a"},pages:this._buildPages(),entries:WebInspector.networkResources.map(this._convertResource.bind(this))}},_buildPages:function(){return[{startedDateTime:new Date(1e3*WebInspector.mainResource.startTime),id:WebInspector.mainResource.documentURL,title:"",pageTimings:this.buildMainResourceTimings()}]},buildMainResourceTimings:function(){return{onContentLoad:this._pageEventTime(WebInspector.mainResourceDOMContentTime),onLoad:this._pageEventTime(WebInspector.mainResourceLoadTime)}},_convertResource:function(e){var t=new WebInspector.HAREntry(e).build();return this.includeResourceIds&&(t._resourceId=e.identifier),t},_pageEventTime:function(e){var t=WebInspector.mainResource.startTime;return-1===e||-1===t?-1:WebInspector.HAREntry._toMilliseconds(e-t)}};