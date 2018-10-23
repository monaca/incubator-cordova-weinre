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
!function(){window.addEventListener("load",
//-----------------------------------------------------------------------------
function(){t=document.getElementById("interface-list"),s=document.getElementById("interface-name"),r=document.getElementById("interface-body"),c=document.getElementById("show-Idl"),o=document.getElementById("show-JavaScript"),p=document.getElementById("show-Java"),n(c,"show-Idl"),n(o,"show-JavaScript"),n(p,"show-Java"),a=e.getIDLsMatching(/.*/),t.innerHTML="",fixedIntfs=[],a.forEach(function(a){fixedIntfs.push(a.name),(u[a.name]=a).methods||(a.methods=[]),a.attributes||(a.attributes=[])}),(a=fixedIntfs).sort(),a.forEach(function(a){var e=document.createElement("a");e.href="#",e.innerHTML=a,e.interfaceName=a,e.addEventListener("click",f,!1);var n=document.createElement("li");n.appendChild(e),t.appendChild(n)});
//-----------------------------------------------------------------------------
var a;
//-----------------------------------------------------------------------------
}
//-----------------------------------------------------------------------------
,!1);var t,s,r,c,o,p,u={},h="<span class='indent'>   </span>",m="<span class='indent'>      </span>",l="int any number boolean string void".split(" "),e=require("weinre/common/IDLTools");
//-----------------------------------------------------------------------------
function n(a,e){var n=localStorage.getItem(e);n=null==n||"true"==n,a.checked=n,a.storageKey=e,a.addEventListener("click",i,!1)}
//-----------------------------------------------------------------------------
function i(a){var e=a.target;localStorage.setItem(e.storageKey,e.checked),d("."+e.storageKey,e.checked)}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function d(a,e){e=e?"block":"none",[].slice.call(document.querySelectorAll(a)).forEach(function(a){a.style.display=e})}function f(a){a.preventDefault(),v(a.target.interfaceName)}
//-----------------------------------------------------------------------------
function v(a){var e=u[a];s.innerHTML=a;var l,i,n=[];!
//-----------------------------------------------------------------------------
function(a,o){o.push("<div class='show-Idl'><h3>IDL</h3><pre>"),o.push("interface {"),a.methods.forEach(function(a){
//-----------------------------------------------------------------------------
var e,n,t,s,r,c;
//-----------------------------------------------------------------------------
n=o,t="\n   ",s=(e=a).parameters.concat(e.callbackParameters),t+=g(e.returns),t+=" <span class='methodName'>"+e.name+"</span> ("+(c=[],0==(r=s).length?"":(c.push("<table>"),r.forEach(function(a,e,n){var t=e==n.length-1?"":",";c.push("<tr>"),c.push("<td>"+m+(a.out?"out":"in")),c.push("<td>"+g(a.type)),c.push("<td><span class='parameterName tdIndent'>"+a.name+t+"</span>")}),c.push("</table>"),c.join("\n")+h))+");",n.push(t)}),0<a.attributes.length&&o.push("<table>");a.attributes.forEach(function(a){
//-----------------------------------------------------------------------------
var e,n,t;
//-----------------------------------------------------------------------------
n=o,t="<tr><td>"+h+"attribute ",t+=g((e=a).type),t+="<td><span class='attributeName tdIndent'>"+e.name+"</span>;",n.push(t)}),0<a.attributes.length&&o.push("</table>");o.push("};"),o.push("</pre></div>")}(e,n),function(a,p){p.push("<div class='show-JavaScript'><h3>JavaScript</h3><pre>");var e="";e+="\n//-----------------------------------------------------------------------------",e+="\n<span class='interfaceName'>class "+a.name+"</span>",p.push(e),a.methods.forEach(function(a){
//-----------------------------------------------------------------------------
var e,n,t,s,r,c,o;
//-----------------------------------------------------------------------------
n=p,t="",t+="\n//-----------------------------------------------------------------------------",t+="\n<span class='methodName'>method "+(e=a).name+"</span>("+(c=e.parameters,e.returns,o=[],c.forEach(function(a){a.out||o.push("<span class='type'>/*"+g(a.type)+"*/ </span><span class='parameterName'>"+a.name+"</span>")}),o.push("<span class='parameterName'>callback</span>"),o.join(", "))+")",t+="\n    // callback: function("+(s=e.callbackParameters,r=[],s.forEach(function(a){a.out&&r.push("/*"+g(a.type)+"*/ "+a.name)}),r.join(", "))+")",t+="\n    Weinre.notImplemented(arguments.callee.signature)",t+="\n",n.push(t)}),p.push("</pre></div>")}(e,n),l=e,(i=n).push("<div class='show-Java'><h3>Java</h3><pre>"),l.methods.forEach(function(a){
//-----------------------------------------------------------------------------
var e,n,t,s,r,c,o,p;
//-----------------------------------------------------------------------------
t=l,r=i,c="",c+="\n    /**",c+="\n     * ",c+="\n     */",c+="\n    <span class='methodName'>public void "+(s=a).name+"</span>("+(o=s.parameters,s.returns,(p=[]).push("<span class='type'>Channel</span> <span class='parameterName'>channel</span>"),o.forEach(function(a){a.out||p.push("<span class='type'>"+I(a.type)+" </span><span class='parameterName'>"+a.name+"</span>")}),p.push("<span class='type'>String</span> <span class='parameterName'>callbackId</span>"),p.join(", "))+") throws IOException {",c+='\n        Main.warn(getClass().getName() + ".'+s.name+'() not implemented");',c+="\n",c+='\n        channel.sendCallback("'+t.name+'", callbackId'+(e=s.callbackParameters,n=[],e.forEach(function(a){a.out&&n.push("/*"+I(a.type)+" "+a.name+"*/ (Object) null")}),""!=(n=n.join(", "))&&(n=", "+n),n)+");",c+="\n    }",c+="\n",r.push(c)}),i.push("</pre></div>"),r.innerHTML=n.join("\n"),d(".show-Idl",c.checked),d(".show-JavaScript",o.checked),d(".show-Java",p.checked)}
//-----------------------------------------------------------------------------
function g(a){var e;e=-1==l.indexOf(a.name)?"<a href='javascript:showInterface(\""+a.name+"\"); void(0);'>"+a.name+"</a>":a.name;for(var n=0;n<a.rank;n++)e+="[]";return"<span class='type'>"+e+"</span>"}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function I(a){var e;-1==l.indexOf(a.name)?e="<a href='javascript:showInterface(\""+a.name+"\"); void(0);'>"+a.name+"</a>":(e=IDL2Java[a.name])||(e="?"+a.name+"?",console.log("Unable to translate IDL type to Java: "+a.name));for(var n=0;n<a.rank;n++)e+="[]";return"<span class='type'>"+e+"</span>"}window.localStorage||(window.localStorage={getItem:function(){},setItem:function(){}}),window.showInterface=v,IDL2Java={string:"String",any:"Object",int:"Long",boolean:"Boolean","":"?"},
//-----------------------------------------------------------------------------
ExBreak=new Error("breaks out of loops")}();