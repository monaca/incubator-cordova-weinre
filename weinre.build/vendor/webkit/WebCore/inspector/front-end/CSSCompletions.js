/*
 * Copyright (C) 2010 Nikita Vasilyev. All rights reserved.
 * Copyright (C) 2010 Joseph Pecoraro. All rights reserved.
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
WebInspector.CSSCompletions=function(t,e){this._values=t.slice(),this._values.sort(),this._acceptEmptyPrefix=e},WebInspector.CSSCompletions.prototype={startsWith:function(t){var e=this._firstIndexOfPrefix(t);if(-1===e)return[];for(var i=[];e<this._values.length&&0===this._values[e].indexOf(t);)i.push(this._values[e++]);return i},firstStartsWith:function(t){var e=this._firstIndexOfPrefix(t);return-1===e?"":this._values[e]},_firstIndexOfPrefix:function(t){if(!this._values.length)return-1;if(!t)return this._acceptEmptyPrefix?0:-1;var e,i=this._values.length-1,s=0;do{var r=i+s>>1;if(0===this._values[r].indexOf(t)){e=r;break}this._values[r]<t?s=r+1:i=r-1}while(s<=i);if(void 0===e)return-1;for(;e&&0===this._values[e-1].indexOf(t);)e--;return e},keySet:function(){return this._values.keySet()},next:function(t,e){return this._closest(t,e,1)},previous:function(t,e){return this._closest(t,e,-1)},_closest:function(t,e,i){if(!t)return"";var s=this._values.indexOf(t);if(-1===s)return"";if(!e)return s=(s+this._values.length+i)%this._values.length,this._values[s];var r=this.startsWith(e),n=r.indexOf(t);return r[n=(n+r.length+i)%r.length]}};