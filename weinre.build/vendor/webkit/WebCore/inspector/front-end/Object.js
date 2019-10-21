/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
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
WebInspector.Object=function(){},WebInspector.Object.prototype={addEventListener:function(e,t,s){"_listeners"in this||(this._listeners={}),e in this._listeners||(this._listeners[e]=[]),this._listeners[e].push({thisObject:s,listener:t})},removeEventListener:function(e,t,s){if("_listeners"in this&&e in this._listeners){for(var i=this._listeners[e],n=0;n<i.length;++n)t&&i[n].listener===t&&i[n].thisObject===s?i.splice(n,1):!t&&s&&i[n].thisObject===s&&i.splice(n,1);i.length||delete this._listeners[e]}},removeAllListeners:function(){delete this._listeners},dispatchEventToListeners:function(e,t){if("_listeners"in this&&e in this._listeners){for(var s=!1,i={target:this,type:e,data:t,defaultPrevented:!1,stopPropagation:function(){s=!0},preventDefault:function(){this.defaultPrevented=!0}},n=this._listeners[e].slice(0),r=0;r<n.length&&(n[r].listener.call(n[r].thisObject,i),!s);++r);return i.defaultPrevented}}};