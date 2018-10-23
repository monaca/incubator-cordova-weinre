/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.ObjectPropertiesSection=function(e,t,n,i,r,s,o){this.emptyPlaceholder=i||WebInspector.UIString("No Properties"),this.object=e,this.ignoreHasOwnProperty=r,this.extraProperties=s,this.treeElementConstructor=o||WebInspector.ObjectPropertyTreeElement,this.editable=!0,WebInspector.PropertiesSection.call(this,t,n)},WebInspector.ObjectPropertiesSection.prototype={onpopulate:function(){this.update()},update:function(){var t=this;this.object.getProperties(this.ignoreHasOwnProperty,!0,function(e){e&&t.updateProperties(e)})},updateProperties:function(e,t,n){if(t||(t=this.treeElementConstructor),n||(n=WebInspector.ObjectPropertiesSection.CompareProperties),this.extraProperties)for(var i=0;i<this.extraProperties.length;++i)e.push(this.extraProperties[i]);e.sort(n),this.propertiesTreeOutline.removeChildren();for(i=0;i<e.length;++i)e[i].parentObject=this.object,this.propertiesTreeOutline.appendChild(new t(e[i]));if(!this.propertiesTreeOutline.children.length){var r='<div class="info">'+this.emptyPlaceholder+"</div>",s=new TreeElement(null,null,!1);s.titleHTML=r,this.propertiesTreeOutline.appendChild(s)}this.propertiesForTest=e}},WebInspector.ObjectPropertiesSection.prototype.__proto__=WebInspector.PropertiesSection.prototype,WebInspector.ObjectPropertiesSection.CompareProperties=function(e,t){var n=e.name,i=t.name;if("__proto__"===n)return 1;if("__proto__"===i)return-1;
// if used elsewhere make sure to
//  - convert a and b to strings (not needed here, properties are all strings)
//  - check if a == b (not needed here, no two properties can be the same)
for(var r,s,o,p,l=0,a=/^\d+|^\D+/;0===l;){if(!n&&i)return-1;if(!i&&n)return 1;if(r=n.match(a)[0],s=i.match(a)[0],o=!isNaN(r),p=!isNaN(s),o&&!p)return-1;if(p&&!o)return 1;if(o&&p){if(0===(l=r-s)&&r.length!==s.length)return+r||+s?s.length-r.length:r.length-s.length}else if(r!==s)return r<s?-1:1;n=n.substring(r.length),i=i.substring(s.length)}return l},WebInspector.ObjectPropertyTreeElement=function(e){this.property=e,
// Pass an empty title, the title gets made later in onattach.
TreeElement.call(this,"",null,!1)},WebInspector.ObjectPropertyTreeElement.prototype={onpopulate:function(){if(!this.children.length||this.shouldRefreshChildren){this.property.value.getOwnProperties(!0,function(e){if(this.removeChildren(),e){e.sort(WebInspector.ObjectPropertiesSection.CompareProperties);for(var t=0;t<e.length;++t)this.appendChild(new this.treeOutline.section.treeElementConstructor(e[t]))}}.bind(this))}},ondblclick:function(e){this.startEditing()},onattach:function(){this.update()},update:function(){this.nameElement=document.createElement("span"),this.nameElement.className="name",this.nameElement.textContent=this.property.name;var e=document.createElement("span");e.className="separator",e.textContent=": ",this.valueElement=document.createElement("span"),this.valueElement.className="value";var t=this.property.value.description;
// Render \n as a nice unicode cr symbol.
"string"===this.property.value.type&&"string"==typeof t&&(t=t.replace(/\n/g,"↵")),this.valueElement.textContent=t,this.property.isGetter&&this.valueElement.addStyleClass("dimmed"),this.property.value.isError()&&this.valueElement.addStyleClass("error"),this.property.value.type&&this.valueElement.addStyleClass("console-formatted-"+this.property.value.type),"node"===this.property.value.type&&this.valueElement.addEventListener("contextmenu",this._contextMenuEventFired.bind(this),!1),this.listItemElement.removeChildren(),this.listItemElement.appendChild(this.nameElement),this.listItemElement.appendChild(e),this.listItemElement.appendChild(this.valueElement),this.hasChildren=this.property.value.hasChildren},_contextMenuEventFired:function(){function e(e){e&&WebInspector.panels.elements.switchToAndFocus(WebInspector.domAgent.nodeForId(e))}var t=new WebInspector.ContextMenu;t.appendItem(WebInspector.UIString("Reveal in Elements Panel"),function(){this.property.value.pushNodeToFrontend(e)}.bind(this)),t.show(event)},updateSiblings:function(){this.parent.root?this.treeOutline.section.update():this.parent.shouldRefreshChildren=!0},startEditing:function(){if(!WebInspector.isBeingEdited(this.valueElement)&&this.treeOutline.section.editable){var e={expanded:this.expanded};
// Lie about our children to prevent expanding on double click and to collapse subproperties.
this.hasChildren=!1,this.listItemElement.addStyleClass("editing-sub-part"),WebInspector.startEditing(this.valueElement,{context:e,commitHandler:this.editingCommitted.bind(this),cancelHandler:this.editingCancelled.bind(this)})}},editingEnded:function(e){this.listItemElement.scrollLeft=0,this.listItemElement.removeStyleClass("editing-sub-part"),e.expanded&&this.expand()},editingCancelled:function(e,t){this.update(),this.editingEnded(t)},editingCommitted:function(e,t,n,i){if(t===n)return this.editingCancelled(e,i);// nothing changed, so cancel
this.applyExpression(t,!0),this.editingEnded(i)},applyExpression:function(e,t){var n=(e=e.trim()).length,i=this;this.property.parentObject.setPropertyValue(this.property.name,e.trim(),function(e){t&&(e||i.update(),n?
// Call updateSiblings since their value might be based on the value that just changed.
i.updateSiblings():
// The property was deleted, so remove this tree element.
i.parent.removeChild(this))})}},WebInspector.ObjectPropertyTreeElement.prototype.__proto__=TreeElement.prototype;