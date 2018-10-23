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
//----------------------------------------------------------------------------
// an implementation of the require() function as specified for use with
// CommonJS Modules - see http://commonjs.org/specs/modules/1.0.html
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// inspired from David Flanagan's require() function documented here:
// http://www.davidflanagan.com/2009/11/a-module-loader.html
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// only supports "preloaded" modules ala define() (AMD)
//    http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
// but the id parameter is required
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// function wrapper
//----------------------------------------------------------------------------
!function(){
//----------------------------------------------------------------------------
// some constants
//----------------------------------------------------------------------------
var a="modjewel",n="2.0.0",r=this;
//----------------------------------------------------------------------------
// if require() is already defined, leave
//----------------------------------------------------------------------------
if(!r.modjewel){
//----------------------------------------------------------------------------
// "globals" (local to this function scope though)
//----------------------------------------------------------------------------
var p,c,t;r.modjewel=null;var v=!1;
//----------------------------------------------------------------------------
// the require function
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// make the require function a global
//----------------------------------------------------------------------------
!
//----------------------------------------------------------------------------
// reset the stores
//----------------------------------------------------------------------------
function(){p={},c={};var e=g(t=w(null)),o=i;o("modjewel",m),r.modjewel=e("modjewel"),r.modjewel.require=e,r.modjewel.define=o,r.modjewel.define.amd={implementation:a,version:n}}
//----------------------------------------------------------------------------
// used by pre-built modules that can be included via <script src=>
// a simplification of
//    http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition
// where id is required
//----------------------------------------------------------------------------
();
//----------------------------------------------------------------------------
}function g(m){var e=function(e){if(e.match(/^\.{1,2}\//)&&(e=
//----------------------------------------------------------------------------
// normalize a 'file name' with . and .. with a 'directory name'
//----------------------------------------------------------------------------
function(e,o){for(var r=
//----------------------------------------------------------------------------
// get the path of a module
//----------------------------------------------------------------------------
function(e){if(!e||!e.id)return"";var o=e.id.split("/");return o.slice(0,o.length-1).join("/")}(e),n=""==r?[]:r.split("/"),t=o.split("/"),i=0;i<t.length;i++){var u=t[i];"."==u||(".."==u?0<n.length&&n.pop():n.push(u))}return n.join("/")}
//----------------------------------------------------------------------------
// throw an error
//----------------------------------------------------------------------------
(m,e)),h(p,e)){if((r=p[e]).__isLoading&&v){var o=m?m.id:"<root>";console.log("module '"+e+"' recursively require()d from '"+o+"', problem?")}return m.moduleIdsRequired.push(e),r.exports}h(c,e)||function(e){throw new Error(a+": "+e)}
//----------------------------------------------------------------------------
// get a list of loaded modules
//----------------------------------------------------------------------------
("module '"+e+"' not found from '"+(o=m?m.id:"<root>")+"', must be define()'d first");var r,n=c[e][0],t=c[e][1],i=g(r=w(e));(p[e]=r).__isLoading=!0;try{m.moduleIdsRequired.push(e);for(var u=[],l=0;l<t.length;l++){var d,s=t[l];d="require"==s?i:"exports"==s?r.exports:"module"==s?r:i(s),u.push(d)}if("function"==typeof n){var f=n.apply(null,u);f&&(r.exports=f)}else r.exports=n}finally{r.__isLoading=!1}return r.exports};return e.define=i,e.implementation=a,e.version=n,e}
//----------------------------------------------------------------------------
// shorter version of hasOwnProperty
//----------------------------------------------------------------------------
function h(e,o){return Object.prototype.hasOwnProperty.call(e,o)}
//----------------------------------------------------------------------------
// create a new module
//----------------------------------------------------------------------------
function w(e){return{id:e,uri:e,exports:{},prereqIds:[],moduleIdsRequired:[]}}function i(e,o,r){if("string"==typeof e){if(2==arguments.length&&(r=o,o=null),o&&0!=o.length||(o=["require","exports","module"]),"function"!=typeof r)return r?void(c[e]=[r,o]):void console.log("modjewel.define(): factory was falsy: "+r);e.match(/^\./)?console.log("modjewel.define(): moduleId must not start with '.': '"+moduleName+"'"):h(c,e)||(c[e]=[r,o])}else console.log("modjewel.define(): first parameter must be a string; was: "+e)}function u(){var e=[];for(moduleId in p)e.push(moduleId);return e}
//----------------------------------------------------------------------------
// get a list of the preloaded module ids
//----------------------------------------------------------------------------
function l(){var e=[];for(moduleId in c)e.push(moduleId);return e}
//----------------------------------------------------------------------------
// get a module by module id
//----------------------------------------------------------------------------
function d(e){return null==e?t:p[e]}
//----------------------------------------------------------------------------
// get a list of module ids which have been required by the specified module id
//----------------------------------------------------------------------------
function s(e){var o=d(e);return null==o?null:o.moduleIdsRequired.slice()}
//----------------------------------------------------------------------------
// set the WarnOnRecursiveRequireFlag
// - if you make use of "module.exports =" in your code, you will want this on
//----------------------------------------------------------------------------
function f(e){if(0==arguments.length)return v;v=!!e}
//----------------------------------------------------------------------------
// the modjewel module
//----------------------------------------------------------------------------
function m(e,o,r){o.VERSION=n,o.require=null,// filled in later
o.define=null,// filled in later
o.getLoadedModuleIds=u,o.getPreloadedModuleIds=l,o.getModule=d,o.getModuleIdsRequired=s,o.warnOnRecursiveRequire=f}
//----------------------------------------------------------------------------
// log a message
//----------------------------------------------------------------------------
}();