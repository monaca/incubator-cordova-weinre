/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.

  This version is suitable for Node.js.  With minimal changes (the
  exports stuff) it should work on any JS platform.

  This file contains the tokenizer/parser.  It is a port to JavaScript
  of parse-js [1], a JavaScript parser library written in Common Lisp
  by Marijn Haverbeke.  Thank you Marijn!

  [1] http://marijn.haverbeke.nl/parse-js/

  Exported functions:

    - tokenizer(code) -- returns a function.  Call the returned
      function to fetch the next token.

    - parse(code) -- returns an AST of the given JavaScript code.

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>
    Based on parse-js (http://marijn.haverbeke.nl/parse-js/).

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/
/* -----[ Tokenizer (constants) ]----- */
var KEYWORDS=array_to_hash(["break","case","catch","const","continue","default","delete","do","else","finally","for","function","if","in","instanceof","new","return","switch","throw","try","typeof","var","void","while","with"]),RESERVED_WORDS=array_to_hash(["abstract","boolean","byte","char","class","debugger","double","enum","export","extends","final","float","goto","implements","import","int","interface","long","native","package","private","protected","public","short","static","super","synchronized","throws","transient","volatile"]),KEYWORDS_BEFORE_EXPRESSION=array_to_hash(["return","new","delete","throw","else","case"]),KEYWORDS_ATOM=array_to_hash(["false","null","true","undefined"]),OPERATOR_CHARS=array_to_hash(characters("+-*&%=<>!?|~^")),RE_HEX_NUMBER=/^0x[0-9a-f]+$/i,RE_OCT_NUMBER=/^0[0-7]+$/,RE_DEC_NUMBER=/^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i,OPERATORS=array_to_hash(["in","instanceof","typeof","new","void","delete","++","--","+","-","!","~","&","|","^","*","/","%",">>","<<",">>>","<",">","<=",">=","==","===","!=","!==","?","=","+=","-=","/=","*=","%=",">>=","<<=",">>>=","%=","|=","^=","&=","&&","||"]),WHITESPACE_CHARS=array_to_hash(characters(" \n\r\t")),PUNC_BEFORE_EXPRESSION=array_to_hash(characters("[{}(,.;:")),PUNC_CHARS=array_to_hash(characters("[]{}(),;:")),REGEXP_MODIFIERS=array_to_hash(characters("gmsiy"));
/* -----[ Tokenizer ]----- */
function is_alphanumeric_char(e){return 48<=(e=e.charCodeAt(0))&&e<=57||65<=e&&e<=90||97<=e&&e<=122}function is_identifier_char(e){return is_alphanumeric_char(e)||"$"==e||"_"==e}function is_digit(e){return 48<=(e=e.charCodeAt(0))&&e<=57}function parse_js_number(e){return RE_HEX_NUMBER.test(e)?parseInt(e.substr(2),16):RE_OCT_NUMBER.test(e)?parseInt(e.substr(1),8):RE_DEC_NUMBER.test(e)?parseFloat(e):void 0}function JS_Parse_Error(e,r,n,t){this.message=e,this.line=r,this.col=n,this.pos=t;try{({})()}catch(e){this.stack=e.stack}}function js_error(e,r,n,t){throw new JS_Parse_Error(e,r,n,t)}function is_token(e,r,n){return e.type==r&&(null==n||e.value==n)}JS_Parse_Error.prototype.toString=function(){return this.message+" (line: "+this.line+", col: "+this.col+", pos: "+this.pos+")\n\n"+this.stack};var EX_EOF={};function tokenizer(e){var o={text:e.replace(/\r\n?|[\n\u2028\u2029]/g,"\n").replace(/^\uFEFF/,""),pos:0,tokpos:0,line:0,tokline:0,col:0,tokcol:0,newline_before:!1,regex_allowed:!1,comments_before:[]};function u(){return o.text.charAt(o.pos)}function a(e){var r=o.text.charAt(o.pos++);if(e&&!r)throw EX_EOF;return"\n"==r?(o.newline_before=!0,++o.line,o.col=0):++o.col,r}function t(e,r){var n=o.text.indexOf(e,o.pos);if(r&&-1==n)throw EX_EOF;return n}function i(e,r,n){o.regex_allowed="operator"==e&&!HOP(UNARY_POSTFIX,r)||"keyword"==e&&HOP(KEYWORDS_BEFORE_EXPRESSION,r)||"punc"==e&&HOP(PUNC_BEFORE_EXPRESSION,r);var t={type:e,value:r,line:o.tokline,col:o.tokcol,pos:o.tokpos,nlb:o.newline_before};return n||(t.comments_before=o.comments_before,o.comments_before=[]),o.newline_before=!1,t}function c(e){for(var r="",n=u(),t=0;n&&e(n,t++);)r+=a(),n=u();return r}function s(e){js_error(e,o.tokline,o.tokcol,o.tokpos)}function l(n){var t=!1,o=!1,u=!1,a="."==n,e=c(function(e,r){return"x"==e||"X"==e?!u&&(u=!0):u||"E"!=e&&"e"!=e?"-"==e?!(!o&&(0!=r||n)):"+"==e?o:(o=!1,"."==e?!a&&(a=!0):is_alphanumeric_char(e)):!t&&(t=o=!0)});n&&(e=n+e);var r=parse_js_number(e);if(!isNaN(r))return i("num",r);s("Invalid syntax: "+e)}function f(){var e=a(!0);switch(e){case"n":return"\n";case"r":return"\r";case"t":return"\t";case"b":return"\b";case"v":return"\v";case"f":return"\f";case"0":return"\0";case"x":return String.fromCharCode(r(2));case"u":return String.fromCharCode(r(4));default:return e}}function r(e){for(var r=0;0<e;--e){var n=parseInt(a(!0),16);isNaN(n)&&s("Invalid hex-character pattern in string"),r=r<<4|n}return r}function p(){return E("Unterminated regular expression",function(){for(var e,r=!1,n="",t=!1;e=a(!0);)if(r)n+="\\"+e,r=!1;else if("["==e)t=!0,n+=e;else if("]"==e&&t)t=!1,n+=e;else{if("/"==e&&!t)break;"\\"==e?r=!0:n+=e}return i("regexp",[n,c(function(e){return HOP(REGEXP_MODIFIERS,e)})])})}function _(e){return i("operator",function e(r){if(!u())return r;var n=r+u();return HOP(OPERATORS,n)?(a(),e(n)):r}(e||a()))}function h(){a();var e=o.regex_allowed;switch(u()){case"/":return o.comments_before.push(function(){a();var e,r=t("\n");return o.pos=-1==r?(e=o.text.substr(o.pos),o.text.length):(e=o.text.substring(o.pos,r),r),i("comment1",e,!0)}()),o.regex_allowed=e,n();case"*":return o.comments_before.push((a(),E("Unterminated multiline comment",function(){var e=t("*/",!0),r=o.text.substring(o.pos,e),n=i("comment2",r,!0);return o.pos=e+2,o.line+=r.split("\n").length-1,o.newline_before=0<=r.indexOf("\n"),n}))),o.regex_allowed=e,n()}return o.regex_allowed?p():_("/")}function E(r,e){try{return e()}catch(e){if(e!==EX_EOF)throw e;s(r)}}function n(e){if(e)return p();!function(){for(;HOP(WHITESPACE_CHARS,u());)a()}(),o.tokline=o.line,o.tokcol=o.col,o.tokpos=o.pos;var r,n=u();return n?is_digit(n)?l():'"'==n||"'"==n?E("Unterminated string constant",function(){for(var e=a(),r="";;){var n=a(!0);if("\\"==n)n=f();else if(n==e)break;r+=n}return i("string",r)}):HOP(PUNC_CHARS,n)?i("punc",a()):"."==n?(a(),is_digit(u())?l("."):i("punc",".")):"/"==n?h():HOP(OPERATOR_CHARS,n)?_():is_identifier_char(n)?(r=c(is_identifier_char),HOP(KEYWORDS,r)?HOP(OPERATORS,r)?i("operator",r):HOP(KEYWORDS_ATOM,r)?i("atom",r):i("keyword",r):i("name",r)):void s("Unexpected character '"+n+"'"):i("eof")}return n.context=function(e){return e&&(o=e),o},n}
/* -----[ Parser (constants) ]----- */
var UNARY_PREFIX=array_to_hash(["typeof","void","delete","--","++","!","~","-","+"]),UNARY_POSTFIX=array_to_hash(["--","++"]),ASSIGNMENT=function(e,r,n){for(;n<e.length;)r[e[n]]=e[n].substr(0,e[n].length-1),n++;return r}(["+=","-=","/=","*=","%=",">>=","<<=",">>>=","|=","^=","&="],{"=":!0},0),PRECEDENCE=function(e,r){for(var n=0,t=1;n<e.length;++n,++t)for(var o=e[n],u=0;u<o.length;++u)r[o[u]]=t;return r}([["||"],["&&"],["|"],["^"],["&"],["==","===","!=","!=="],["<",">","<=",">=","in","instanceof"],[">>","<<",">>>"],["+","-"],["*","/","%"]],{}),STATEMENTS_WITH_LABELS=array_to_hash(["for","do","while","switch"]),ATOMIC_START_TOKEN=array_to_hash(["atom","num","string","regexp","name"]);
/* -----[ Parser ]----- */
function NodeWithToken(e,r,n){this.name=e,this.start=r,this.end=n}function parse(e,o,r){var a={input:"string"==typeof e?tokenizer(e,!0):e,token:null,prev:null,peeked:null,in_function:0,in_loop:0,labels:[]};function i(e,r){return is_token(a.token,e,r)}function c(){return a.peeked||(a.peeked=a.input())}function s(){return a.prev=a.token,a.peeked?(a.token=a.peeked,a.peeked=null):a.token=a.input(),a.token}function u(e,r,n,t){var o=a.input.context();js_error(e,null!=r?r:o.tokline,null!=n?n:o.tokcol,null!=t?t:o.tokpos)}function n(e,r){u(r,e.line,e.col)}function t(e){null==e&&(e=a.token),n(e,"Unexpected token: "+e.type+" ("+e.value+")")}function l(e,r){if(i(e,r))return s();n(a.token,"Unexpected token "+a.token.type+", expected "+e)}function f(e){return l("punc",e)}function p(){return!o&&(a.token.nlb||i("eof")||i("punc","}"))}function _(){i("punc",";")?s():p()||t()}function h(){return slice(arguments)}function E(){f("(");var e=D();return f(")"),e}a.token=s();var v=r?function(){var e,r,n,t=a.token,o=k();return o[0]=(e=o[0],r=t,n=a.prev,new NodeWithToken(e,r,n)),o}:k;function k(){switch(i("operator","/")&&(a.peeked=null,a.token=a.input(!0)),a.token.type){case"num":case"string":case"regexp":case"operator":case"atom":return d();case"name":return is_token(c(),"punc",":")?function(e){a.labels.push(e);var r=a.token,n=v();o&&!HOP(STATEMENTS_WITH_LABELS,n[0])&&t(r);return a.labels.pop(),h("label",e,n)}(prog1(a.token.value,s,s)):d();case"punc":switch(a.token.value){case"{":return h("block",y());case"[":case"(":return d();case";":return s(),h("block");default:t()}case"keyword":switch(prog1(a.token.value,s)){case"break":return O("break");case"continue":return O("continue");case"debugger":return _(),h("debugger");case"do":return e=M(v),l("keyword","while"),h("do",prog1(E,_),e);case"for":return function(){f("(");var e=i("keyword","var");e&&s();{if(i("name")&&is_token(c(),"operator","in")){
// for (i in foo)
var r=a.token.value;s(),s();var n=D();return f(")"),h("for-in",e,r,n,M(v))}
// classic for
var t=i("punc",";")?null:e?S():D();f(";");var o=i("punc",";")?null:D();f(";");var u=i("punc",")")?null:D();return f(")"),h("for",t,o,u,M(v))}}();case"function":return R(!0);case"if":return function(){var e,r=E(),n=v();i("keyword","else")&&(s(),e=v());return h("if",r,n,e)}();case"return":return 0==a.in_function&&u("'return' outside of function"),h("return",i("punc",";")?(s(),null):p()?null:prog1(D,_));case"switch":return h("switch",E(),g());case"throw":return h("throw",prog1(D,_));case"try":return function(){var e,r,n=y();if(i("keyword","catch")){s(),f("("),i("name")||u("Name expected");var t=a.token.value;s(),f(")"),e=[t,y()]}i("keyword","finally")&&(s(),r=y());e||r||u("Missing catch/finally blocks");return h("try",n,e,r)}();case"var":return prog1(S,_);case"const":return prog1(w,_);case"while":return h("while",E(),M(v));case"with":return h("with",E(),v());default:t()}}var e}function d(){return h("stat",prog1(D,_))}function O(e){var r=i("name")?a.token.value:null;return null!=r?(s(),member(r,a.labels)||u("Label "+r+" without matching loop or statement")):0==a.in_loop&&u(e+" not inside a loop or switch"),_(),h(e,r)}function R(e){var r=i("name")?prog1(a.token.value,s):null;return e&&!r&&t(),f("("),h(e?"defun":"function",r,
// arguments
function(e,r){for(;!i("punc",")");)e?e=!1:f(","),i("name")||t(),r.push(a.token.value),s();return s(),r}(!0,[]),
// body
function(){++a.in_function;var e=a.in_loop;a.in_loop=0;var r=y();return--a.in_function,a.in_loop=e,r}())}function y(){f("{");for(var e=[];!i("punc","}");)i("eof")&&t(),e.push(v());return s(),e}var g=curry(M,function(){f("{");for(var e=[],r=null;!i("punc","}");)i("eof")&&t(),i("keyword","case")?(s(),r=[],e.push([D(),r]),f(":")):i("keyword","default")?(s(),f(":"),r=[],e.push([null,r])):(r||t(),r.push(v()));return s(),e});function m(){for(var e=[];;){i("name")||t();var r=a.token.value;if(s(),i("operator","=")?(s(),e.push([r,D(!1)])):e.push([r]),!i("punc",","))break;s()}return e}function S(){return h("var",m())}function w(){return h("const",m())}function b(e){if(i("operator","new"))return s(),A(h("new",b(!1),i("punc","(")?(s(),x(")")):[]),!0);if(i("operator")&&HOP(UNARY_PREFIX,a.token.value))return N("unary-prefix",prog1(a.token.value,s),b(e));if(i("punc")){switch(a.token.value){case"(":return s(),A(prog1(D,curry(f,")")),e);case"[":return s(),A(h("array",x("]",!o,!0)),e);case"{":return s(),A(function(){var e=!0,r=[];for(;!i("punc","}")&&(e?e=!1:f(","),o||!i("punc","}"));){var n=a.token.type,t=P();"name"!=n||"get"!=t&&"set"!=t||i("punc",":")?(f(":"),r.push([t,D(!1)])):r.push([T(),R(!1),t])}return s(),h("object",r)}(),e)}t()}return i("keyword","function")?(s(),A(R(!1),e)):HOP(ATOMIC_START_TOKEN,a.token.type)?A(prog1("regexp"==a.token.type?h("regexp",a.token.value[0],a.token.value[1]):h(a.token.type,a.token.value),s),e):void t()}function x(e,r,n){for(var t=!0,o=[];!i("punc",e)&&(t?t=!1:f(","),!r||!i("punc",e));)i("punc",",")&&n?o.push(["atom","undefined"]):o.push(D(!1));return s(),o}function P(){switch(a.token.type){case"num":case"string":return prog1(a.token.value,s)}return T()}function T(){switch(a.token.type){case"name":case"operator":case"keyword":case"atom":return prog1(a.token.value,s);default:t()}}function A(e,r){return i("punc",".")?(s(),A(h("dot",e,T()),r)):i("punc","[")?(s(),A(h("sub",e,prog1(D,curry(f,"]"))),r)):r&&i("punc","(")?(s(),A(h("call",e,x(")")),!0)):r&&i("operator")&&HOP(UNARY_POSTFIX,a.token.value)?prog1(curry(N,"unary-postfix",a.token.value,e),s):e}function N(e,r,n){return"++"!=r&&"--"!=r||I(n)||u("Invalid use of "+r+" operator"),h(e,r,n)}function C(){return function e(r,n){var t=i("operator")?a.token.value:null,o=null!=t?PRECEDENCE[t]:null;return null!=o&&n<o?(s(),e(h("binary",t,r,e(b(!0),o)),n)):r}(b(!0),0)}function I(e){switch(e[0]){case"dot":case"sub":return!0;case"name":return"this"!=e[1]}}function H(){var e=function(){var e=C();if(i("operator","?")){s();var r=D(!1);return f(":"),h("conditional",e,r,D(!1))}return e}(),r=a.token.value;if(i("operator")&&HOP(ASSIGNMENT,r)){if(I(e))return s(),h("assign",ASSIGNMENT[r],e,H());u("Invalid assignment")}return e}function D(e){0==arguments.length&&(e=!0);var r=H();return e&&i("punc",",")?(s(),h("seq",r,D())):r}function M(e){try{return++a.in_loop,e()}finally{--a.in_loop}}return h("toplevel",function(e){for(;!i("eof");)e.push(v());return e}([]))}
/* -----[ Utilities ]----- */
function curry(e){var r=slice(arguments,1);return function(){return e.apply(this,r.concat(slice(arguments)))}}function prog1(e){e instanceof Function&&(e=e());for(var r=1,n=arguments.length;0<--n;++r)arguments[r]();return e}function array_to_hash(e){for(var r={},n=0;n<e.length;++n)r[e[n]]=!0;return r}function slice(e,r){return Array.prototype.slice.call(e,null==r?0:r)}function characters(e){return e.split("")}function member(e,r){for(var n=r.length;0<=--n;)if(r[n]===e)return!0;return!1}function HOP(e,r){return Object.prototype.hasOwnProperty.call(e,r)}NodeWithToken.prototype.toString=function(){return this.name},
/* -----[ Exports ]----- */
exports.tokenizer=tokenizer,exports.parse=parse,exports.slice=slice,exports.curry=curry,exports.member=member,exports.array_to_hash=array_to_hash,exports.PRECEDENCE=PRECEDENCE,exports.KEYWORDS_ATOM=KEYWORDS_ATOM,exports.RESERVED_WORDS=RESERVED_WORDS,exports.KEYWORDS=KEYWORDS,exports.ATOMIC_START_TOKEN=ATOMIC_START_TOKEN,exports.OPERATORS=OPERATORS,exports.is_alphanumeric_char=is_alphanumeric_char,exports.is_identifier_char=is_identifier_char;