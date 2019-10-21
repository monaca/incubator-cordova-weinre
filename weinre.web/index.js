/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var weinre_protocol=location.protocol,weinre_host=location.hostname,weinre_port=location.port,weinre_pathname=location.pathname,weinre_id="anonymous",hash=location.href.split("#")[1];
//---------------------------------------------------------------------
function buildHttpURL(e){var t=weinre_port,r=weinre_pathname;return"/index.html"==r&&(r="/"),"file:"==weinre_protocol?e:"http:"==weinre_protocol?(""!=t&&(t=":"+t),weinre_protocol+"//"+weinre_host+t+r+e):"https:"==weinre_protocol?(""!=t&&(t=":"+t),weinre_protocol+"//"+weinre_host+t+r+e):void 0}
//-----------------------------------------------------------------------------
function targetBookmarkletFunction(e){e.setAttribute("src","???"),document.getElementsByTagName("body")[0].appendChild(e)}
//-----------------------------------------------------------------------------
function getTargetBookmarklet(){var e=targetBookmarkletFunction.toString();return"javascript:"+(e="("+(e=(e=(e=(e=e.replace(/\n/g,"")).replace("targetBookmarkletFunction","")).replace(/\s*/g,"")).replace("???",buildHttpURL("target/target-script-min.js#"+weinre_id)))+')(document.createElement("script"));void(0);')}
//---------------------------------------------------------------------
function replaceURL(e,t,r){r||(r=t),replaceText(e,"<a href='"+t+"'>"+r+"</a>")}
//---------------------------------------------------------------------
function replaceText(e,t){var r=document.getElementById(e);null!=r&&(r.innerHTML=t)}hash&&(weinre_id=hash),replaceURL("url-client-ui",buildHttpURL("client/#"+weinre_id)),replaceURL("url-interfaces",buildHttpURL("interfaces/interfaces.html")),replaceURL("url-target-demo",buildHttpURL("demo/weinre-demo.html#"+weinre_id)),replaceURL("url-target-demo-min",buildHttpURL("demo/weinre-demo-min.html#"+weinre_id)),replaceURL("url-target-script",buildHttpURL("target/target-script-min.js#"+weinre_id)),replaceURL("url-target-bookmarklet",getTargetBookmarklet(),"weinre target debug"),replaceURL("url-target-documentation",buildHttpURL("doc/")),replaceText("version-weinre",Weinre.Versions.weinre),replaceText("version-build",Weinre.Versions.build),replaceText("target-bookmarklet-src-pre",getTargetBookmarklet()),replaceText("target-bookmarklet-src-text-area",getTargetBookmarklet()),replaceText("url-target-script-raw",buildHttpURL("target/target-script-min.js#"+weinre_id));