/*
 * Copyright (C) IBM Corp. 2009  All rights reserved.
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
 *     * Neither the name of IBM Corp. nor the names of its
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
WebInspector.WatchExpressionsSidebarPane=function(){WebInspector.SidebarPane.call(this,WebInspector.UIString("Watch Expressions")),this.reset()},WebInspector.WatchExpressionsSidebarPane.prototype={reset:function(){this.bodyElement.removeChildren(),this.expanded=0<WebInspector.settings.watchExpressions.length,this.section=new WebInspector.WatchExpressionsSection,this.bodyElement.appendChild(this.section.element);var e=document.createElement("button");e.setAttribute("type","button"),e.textContent=WebInspector.UIString("Add"),e.addEventListener("click",this.section.addExpression.bind(this.section),!1);var t=document.createElement("button");t.setAttribute("type","button"),t.textContent=WebInspector.UIString("Refresh"),t.addEventListener("click",this.section.update.bind(this.section),!1);var s=document.createElement("div");s.addStyleClass("watch-expressions-buttons-container"),s.appendChild(e),s.appendChild(t),this.bodyElement.appendChild(s),this.onexpand=this.refreshExpressions.bind(this)},refreshExpressions:function(){this.section&&this.section.update()}},WebInspector.WatchExpressionsSidebarPane.prototype.__proto__=WebInspector.SidebarPane.prototype,WebInspector.WatchExpressionsSection=function(){this._watchObjectGroupId="watch-group",WebInspector.ObjectPropertiesSection.call(this),this.watchExpressions=WebInspector.settings.watchExpressions,this.headerElement.className="hidden",this.editable=!0,this.expanded=!0,this.propertiesElement.addStyleClass("watch-expressions")},WebInspector.WatchExpressionsSection.NewWatchExpression=" ",WebInspector.WatchExpressionsSection.prototype={update:function(){function e(e,t,s){var n=new WebInspector.RemoteObjectProperty(e,s);n.watchIndex=t,
// To clarify what's going on here: 
// In the outer function, we calculate the number of properties
// that we're going to be updating, and set that in the
// propertyCount variable.  
// In this function, we test to see when we are processing the 
// last property, and then call the superclass's updateProperties() 
// method to get all the properties refreshed at once.
i.push(n),i.length==r&&(this.updateProperties(i,WebInspector.WatchExpressionTreeElement,WebInspector.WatchExpressionsSection.CompareProperties),
// check to see if we just added a new watch expression,
// which will always be the last property
this._newExpressionAdded&&(delete this._newExpressionAdded,treeElement=this.findAddedTreeElement(),treeElement&&treeElement.startEditing()))}
// TODO: pass exact injected script id.
InspectorBackend.releaseWrapperObjectGroup(0,this._watchObjectGroupId);for(var i=[],r=0,t=0
// Count the properties, so we known when to call this.updateProperties()
// in appendResult()
;t<this.watchExpressions.length;++t)this.watchExpressions[t]&&++r;
// Now process all the expressions, since we have the actual count,
// which is checked in the appendResult inner function.
for(t=0;t<this.watchExpressions.length;++t){var s=this.watchExpressions[t];s&&WebInspector.console.evalInInspectedWindow("("+s+")",this._watchObjectGroupId,!1,e.bind(this,s,t))}
// note this is setting the expansion of the tree, not the section;
// with no expressions, and expanded tree, we get some extra vertical
// white space
// FIXME: should change to use header buttons instead of the buttons
// at the bottom of the section, then we can add a "No Watch Expressions
// element when there are no watch expressions, and this issue should
// go away.
this.expanded=0!=r},addExpression:function(){this._newExpressionAdded=!0,this.watchExpressions.push(WebInspector.WatchExpressionsSection.NewWatchExpression),this.update()},updateExpression:function(e,t){this.watchExpressions[e.property.watchIndex]=t,this.saveExpressions(),this.update()},findAddedTreeElement:function(){for(var e=this.propertiesTreeOutline.children,t=0;t<e.length;++t)if(e[t].property.name===WebInspector.WatchExpressionsSection.NewWatchExpression)return e[t]},saveExpressions:function(){for(var e=[],t=0;t<this.watchExpressions.length;t++)this.watchExpressions[t]&&e.push(this.watchExpressions[t]);return(WebInspector.settings.watchExpressions=e).length}},WebInspector.WatchExpressionsSection.prototype.__proto__=WebInspector.ObjectPropertiesSection.prototype,WebInspector.WatchExpressionsSection.CompareProperties=function(e,t){return e.watchIndex==t.watchIndex?0:e.watchIndex<t.watchIndex?-1:1},WebInspector.WatchExpressionTreeElement=function(e){WebInspector.ObjectPropertyTreeElement.call(this,e)},WebInspector.WatchExpressionTreeElement.prototype={update:function(){WebInspector.ObjectPropertyTreeElement.prototype.update.call(this),this.property.value.isError()&&this.valueElement.addStyleClass("watch-expressions-error-level");var e=document.createElement("input");e.type="button",e.title=WebInspector.UIString("Delete watch expression."),e.addStyleClass("enabled-button"),e.addStyleClass("delete-button"),e.addEventListener("click",this._deleteButtonClicked.bind(this),!1),this.listItemElement.insertBefore(e,this.listItemElement.firstChild)},_deleteButtonClicked:function(){this.treeOutline.section.updateExpression(this,null)},startEditing:function(){if(!WebInspector.isBeingEdited(this.nameElement)&&this.treeOutline.section.editable){this.nameElement.textContent=this.property.name.trim();var e={expanded:this.expanded};
// collapse temporarily, if required
this.hasChildren=!1,this.listItemElement.addStyleClass("editing-sub-part"),WebInspector.startEditing(this.nameElement,{context:e,commitHandler:this.editingCommitted.bind(this),cancelHandler:this.editingCancelled.bind(this)})}},editingCancelled:function(e,t){this.nameElement.textContent||this.treeOutline.section.updateExpression(this,null),this.update(),this.editingEnded(t)},applyExpression:function(e,t){(e=e.trim())||(e=null),this.property.name=e,this.treeOutline.section.updateExpression(this,e)}},WebInspector.WatchExpressionTreeElement.prototype.__proto__=WebInspector.ObjectPropertyTreeElement.prototype;