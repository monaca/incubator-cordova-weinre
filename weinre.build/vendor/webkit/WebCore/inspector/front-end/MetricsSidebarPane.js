/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.MetricsSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Metrics")),this._inlineStyleId=null},WebInspector.MetricsSidebarPane.prototype={update:function(e){if(e?this.node=e:e=this.node,e&&e.ownerDocument.defaultView&&e.nodeType===Node.ELEMENT_NODE){var t=this;WebInspector.cssModel.getComputedStyleAsync(e.id,function(e){e&&t._update(e)});WebInspector.cssModel.getInlineStyleAsync(e.id,function(e){e&&(t.inlineStyle=e)})}else this.bodyElement.removeChildren()},_update:function(e){
// Updating with computed style.
var t=document.createElement("div");function n(e,t,n,i){var r=("position"!==t?t+"-":"")+n+i,o=e.getPropertyValue(r);""===o||"position"!==t&&"0px"===o?o="‒":"position"===t&&"auto"===o&&(o="‒"),o=o.replace(/px$/,"");var a=document.createElement("div");return a.className=n,a.textContent=o,a.addEventListener("dblclick",this.startEditing.bind(this,a,t,r),!1),a}
// Display types for which margin is ignored.
t.className="metrics";for(var i,r={"table-cell":!0,"table-column":!0,"table-column-group":!0,"table-footer-group":!0,"table-header-group":!0,"table-row":!0,"table-row-group":!0},o={"table-column":!0,"table-column-group":!0,"table-footer-group":!0,"table-header-group":!0,"table-row":!0,"table-row-group":!0},a={static:!0},d=["content","padding","border","margin","position"],l=[WebInspector.UIString("content"),WebInspector.UIString("padding"),WebInspector.UIString("border"),WebInspector.UIString("margin"),WebInspector.UIString("position")],p=0
// Display types for which padding is ignored.
;p<d.length;++p){var s=d[p];if(("margin"!==s||!r[e.getPropertyValue("display")])&&!("padding"===s&&o[e.getPropertyValue("display")]||"position"===s&&a[e.getPropertyValue("position")])){var c=document.createElement("div");if("content"===(c.className=s)){var h=e.getPropertyValue("width").replace(/px$/,""),b=document.createElement("span");b.textContent=h,b.addEventListener("dblclick",this.startEditing.bind(this,b,"width","width"),!1);var u=e.getPropertyValue("height").replace(/px$/,""),g=document.createElement("span");g.textContent=u,g.addEventListener("dblclick",this.startEditing.bind(this,g,"height","height"),!1),c.appendChild(b),c.appendChild(document.createTextNode(" × ")),c.appendChild(g)}else{var m="border"===s?"-width":"",y=document.createElement("div");y.className="label",y.textContent=l[p],c.appendChild(y),c.appendChild(n.call(this,e,s,"top",m)),c.appendChild(document.createElement("br")),c.appendChild(n.call(this,e,s,"left",m)),i&&c.appendChild(i),c.appendChild(n.call(this,e,s,"right",m)),c.appendChild(document.createElement("br")),c.appendChild(n.call(this,e,s,"bottom",m))}i=c}}t.appendChild(i),this.bodyElement.removeChildren(),this.bodyElement.appendChild(t)},startEditing:function(e,t,n){if(!WebInspector.isBeingEdited(e)){var i={box:t,styleProperty:n};WebInspector.startEditing(e,{context:i,commitHandler:this.editingCommitted.bind(this),cancelHandler:this.editingCancelled.bind(this)})}},editingCancelled:function(e,t){this.update()},editingCommitted:function(e,i,t,n){if(!this.inlineStyle)
// Element has no renderer.
return this.editingCancelled(e,n);// nothing changed, so cancel
if(i===t)return this.editingCancelled(e,n);// nothing changed, so cancel
"position"===n.box||i&&"‒"!==i?"position"!==n.box||i&&"‒"!==i||(i="auto"):i="0px",
// Append a "px" unit if the user input was just a number.
/^\d+$/.test(i)&&(i+="px");var r=this,o=function(e){e&&(r.inlineStyle=e,r.dispatchEventToListeners("metrics edited"),r.update())};function a(e,t){var n=t.getLiveProperty(e.styleProperty);n?n.setValue(i,o):t.appendProperty(e.styleProperty,i,o)}for(var d=this.inlineStyle.allProperties,l=0;l<d.length;++l){var p=d[l];if(p.name===n.styleProperty&&!p.inactive)return void(p.disabled?p.setDisabled(!1,a.bind(null,n)):p.setValue(i,o))}this.inlineStyle.appendProperty(n.styleProperty,i,o)}},WebInspector.MetricsSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype;