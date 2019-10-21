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
var Preferences={canEditScriptSource:!1,maxInlineTextChildLength:80,minConsoleHeight:75,minSidebarWidth:100,minElementsSidebarWidth:200,minScriptsSidebarWidth:200,styleRulesExpandedState:{},showMissingLocalizedStrings:!1,samplingCPUProfiler:!1,showColorNicknames:!0,debuggerAlwaysEnabled:!1,profilerAlwaysEnabled:!1,onlineDetectionEnabled:!0,nativeInstrumentationEnabled:!1,resourceExportEnabled:!1,useDataURLForResourceImageIcons:!0,showTimingTab:!1,showCookiesTab:!1,debugMode:!1,heapProfilerPresent:!1,detailedHeapProfiles:!1};WebInspector.Settings=function(){this.installApplicationSetting("colorFormat","hex"),this.installApplicationSetting("consoleHistory",[]),this.installApplicationSetting("debuggerEnabled",!1),this.installApplicationSetting("profilerEnabled",!1),this.installApplicationSetting("eventListenersFilter","all"),this.installApplicationSetting("lastActivePanel","elements"),this.installApplicationSetting("lastViewedScriptFile","application"),this.installApplicationSetting("monitoringXHREnabled",!1),this.installApplicationSetting("pauseOnExceptionState",WebInspector.ScriptsPanel.PauseOnExceptionsState.DontPauseOnExceptions),this.installApplicationSetting("resourcesLargeRows",!0),this.installApplicationSetting("resourcesSortOptions",{timeOption:"responseTime",sizeOption:"transferSize"}),this.installApplicationSetting("resourceViewTab","content"),this.installApplicationSetting("showInheritedComputedStyleProperties",!1),this.installApplicationSetting("showUserAgentStyles",!0),this.installApplicationSetting("watchExpressions",[]),this.installApplicationSetting("breakpoints",[]),this.installProjectSetting("nativeBreakpoints",[])},WebInspector.Settings.Events={ProjectChanged:"project-changed"},WebInspector.Settings.prototype={installApplicationSetting:function(t,e){t in this||(this.__defineGetter__(t,this._get.bind(this,t,e)),this.__defineSetter__(t,this._set.bind(this,t)))},installProjectSetting:function(t,e){this.__defineGetter__(t,this._getProjectSetting.bind(this,t,e)),this.__defineSetter__(t,this._setProjectSetting.bind(this,t))},inspectedURLChanged:function(t){var e=t.indexOf("#");-1!==e&&(t=t.substring(0,e)),this._projectId=t,this.dispatchEventToListeners(WebInspector.Settings.Events.ProjectChanged)},get projectId(){return this._projectId},findSettingForAllProjects:function(t){for(var e={},i="^"+t+":(.*)",n=0;n<window.localStorage.length;++n){var o=window.localStorage.key(n),s=o.match(i);if(s)try{e[s[1]]=JSON.parse(window.localStorage[o])}catch(t){window.localStorage.removeItem(o)}}return e},_get:function(e,t){if(e in window.localStorage)try{return JSON.parse(window.localStorage[e])}catch(t){window.localStorage.removeItem(e)}return t},_set:function(t,e){window.localStorage[t]=JSON.stringify(e)},_getProjectSetting:function(t,e){return this._get(this._formatProjectKey(t),e)},_setProjectSetting:function(t,e){return this._set(this._formatProjectKey(t),e)},_formatProjectKey:function(t){return t+":"+this._projectId}},WebInspector.Settings.prototype.__proto__=WebInspector.Object.prototype;