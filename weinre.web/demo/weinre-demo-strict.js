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
"use strict";
//------------------------------------------------------------------------------
var buttonStartStuff,buttonClearOutput,outputElement,db,otherDB,interval,lastClickTime,started=!1,storageIndex=0,hash=location.href.split("#")[1];
//------------------------------------------------------------------------------
function onLoad(){buttonStartStuff||(buttonStartStuff=document.getElementById("button-start-stuff")),buttonClearOutput||(buttonClearOutput=document.getElementById("button-clear-output")),outputElement||(outputElement=document.getElementById("output")),buttonStartStuff.addEventListener("click",function(){lastClickTime=(new Date).toString(),db&&db.transaction(addClick),openTheOtherDatabase(),started?(buttonStartStuff.value="start stuff",stopStuff()):(buttonStartStuff.value="stop stuff",startStuff()),started=!started}),buttonClearOutput.addEventListener("click",function(){outputElement.innerHTML=""}),openTheDatabase()}
//------------------------------------------------------------------------------
function startStuff(){window.localStorage&&window.localStorage.clear(),window.sessionStorage&&window.sessionStorage.clear(),storageIndex=0,interval=setInterval(intervalStuff,1e3)}function stopStuff(){clearInterval(interval)}
//------------------------------------------------------------------------------
function intervalStuff(){var t="doing interval stuff at "+new Date;
// add a timeout
// write to local- and sessionStorage
if(setTimeout(function(){console.log(t)},333),
// add a timeline marker
console.markTimeline(t),window.localStorage){var e=t+" (local)";window.localStorage.setItem("item-"+storageIndex,e)}if(window.sessionStorage){e=t+" (session)";window.sessionStorage.setItem("item-"+storageIndex,e)}storageIndex++,
// write the message to the page
output(t);
// do an XHR
var a=new XMLHttpRequest;
// xhr.addEventListener("readystatechange", function() {logXhr(this)})
a.open("GET","../target/target-script.js",!0),a.send()}
//------------------------------------------------------------------------------
function sqlSuccess(t,e){console.log("SQL Success!")}
//------------------------------------------------------------------------------
function sqlError(t,e){console.log("SQL Error "+e.code+": "+e.message)}
//------------------------------------------------------------------------------
function addClick(t){t.executeSql("insert into clicks (date) values (?)",[lastClickTime],null,sqlError)}
//------------------------------------------------------------------------------
function clearDatabase(t,e){t.executeSql("delete from clicks",null,null,sqlError)}
//------------------------------------------------------------------------------
function createDatabase(t){t.executeSql("create table if not exists clicks (id integer primary key, date text)",null,clearDatabase,sqlError)}
//------------------------------------------------------------------------------
function createDatabase_other(t){t.executeSql("create table if not exists clicks_other (id integer primary key, other text)",null,null,sqlError)}
//------------------------------------------------------------------------------
function openTheDatabase(){window.openDatabase&&(db=window.openDatabase("clicks_db","1.0","clicks_db",8192)).transaction(createDatabase)}
//------------------------------------------------------------------------------
function openTheOtherDatabase(){otherDB||window.openDatabase&&(otherDB=window.openDatabase("clicks_other_db","1.0","clicks_other_db",8192)).transaction(createDatabase_other)}
//------------------------------------------------------------------------------
function output(t){var e=document.createElement("div");e.innerHTML=t,outputElement.appendChild(e)}
//------------------------------------------------------------------------------
function logXhr(t){console.log("xhr: readyState: "+t.readyState)}hash||(hash="anonymous"),window.WeinreServerId=hash;