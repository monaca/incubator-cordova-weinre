
#---------------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#---------------------------------------------------------------------------------

Binding       = require('../common/Binding')
Weinre        = require('../common/Weinre')

ConnectorList = require('./ConnectorList')
DT            = require('./DOMTemplates')

# fix WebInspector.Panel's prototype so our super call works
WebInspector.Panel.prototype.constructor = WebInspector.Panel

#-------------------------------------------------------------------------------
module.exports = class RemotePanel extends WebInspector.Panel

    RemotePanel::__defineGetter__("toolbarItemClass", -> "remote")
    RemotePanel::__defineGetter__("toolbarItemLabel", -> "Remote")
    RemotePanel::__defineGetter__("statusBarItems", -> [])
    RemotePanel::__defineGetter__("defaultFocusedElement", -> @contentElement)

    constructor: ->
        super "remote"
        @initialize()

    #---------------------------------------------------------------------------
    initialize: () ->
        div = DT.DIV()
        div.style.position = "absolute"
        div.style.top = "1em"
        div.style.right = "1em"
        div.style.left = "1em"
        div.style.bottom = "1em"
        div.style.overflow = "auto"
        icon = DT.IMG(src: "../images/weinre-icon-128x128.png")
        icon.style.float = "right"
        div.appendChild icon
        @targetList = new TargetList()
        @clientList = new ClientList()
#        div.appendChild @targetList.getElement()
#        div.appendChild @clientList.getElement()
#        @serverProperties = DT.DIV($className: "weinreServerProperties")
#        div.appendChild DT.H1("Server Properties")
#        div.appendChild @serverProperties
        @element.appendChild div

        listdiv = DT.DIV()
        listdiv.style.position = "absolute"
        listdiv.style.top = "10px"
        listdiv.style.right = "10px"

        toolbar = document.getElementById('toolbar')
        listdiv.appendChild @targetList.getElement()
        toolbar.appendChild listdiv

        @reset()

    #---------------------------------------------------------------------------
    addClient: (client) ->
        @clientList.add client

    addTarget: (target) ->
        @targetList.add target

    setTargetName: (device_id, device_name) ->
        @targetList.setName device_id, device_name

    getTarget: (channel) ->
        @targetList.get channel


    removeClient: (channel) ->
        @clientList.remove channel


    removeTarget: (channel) ->
        @targetList.remove channel


    setCurrentClient: (channel) ->
        @clientList.setCurrent channel


    setCurrentTarget: (channel) ->
        @targetList.setCurrent channel


    setClientState: (channel, state) ->
        @clientList.setState channel, state


    setTargetState: (channel, state) ->
        @targetList.setState channel, state

    #---------------------------------------------------------------------------
    getNewestTargetChannel: (ignoring) ->
        @targetList.getNewestConnectorChannel ignoring

    #---------------------------------------------------------------------------
    afterInitialConnection: ->
        @clientList.afterInitialConnection()

    #---------------------------------------------------------------------------
    reset: ->
        @clientList.removeAll()
        @targetList.removeAll()
        Weinre.WeinreClientCommands.getTargets Binding(this, "cb_getTargets")
        Weinre.WeinreClientCommands.getClients Binding(this, "cb_getClients")

    #---------------------------------------------------------------------------
    connectionClosed: ->
        @clientList.removeAll()
        @targetList.removeAll()

    #---------------------------------------------------------------------------
    cb_getTargets: (targets) ->
        for target in targets
            @addTarget target

        return unless Weinre.client.autoConnect()
        newestTargetChannel = @getNewestTargetChannel()
        return unless newestTargetChannel
        return unless Weinre.messageDispatcher
        Weinre.WeinreClientCommands.connectTarget Weinre.messageDispatcher.channel, newestTargetChannel

    #---------------------------------------------------------------------------
    cb_getClients: (clients) ->
        for client in clients
            @addClient client

    #---------------------------------------------------------------------------
    show: ->
        super()

    #---------------------------------------------------------------------------
    hide: () ->
        super()

    #---------------------------------------------------------------------------
    setServerProperties: (properties) ->
        table = "<table>"
        keys = []
        for key of properties
            keys.push key
        keys = keys.sort()
        for key in keys
            val = properties[key]
            if typeof val == "string"
                val = val.escapeHTML()
            else
                finalVal = ""
                for aVal in val
                    finalVal += "<li>" + aVal.escapeHTML()

                val = "<ul>#{finalVal}</ul>"
            table += "<tr class='weinre-normal-text-size'><td valign='top'>#{key.escapeHTML()}: <td>" + val

        table += "</table>"
        @serverProperties.innerHTML = table

#-------------------------------------------------------------------------------
class TargetList extends ConnectorList

    constructor: ->
        super "Targets"

        # Add event handler to ulConnectors
        @ulConnectors.addEventListener "change", ((e) =>
            channel = @ulConnectors.value
            @connectToTarget channel, e
        ), false

        @nameList = {}
        @optionElements = {}

    setName: (device_id, device_name) ->
        if !@nameList[device_id] || @nameList[device_id] != device_name
            @nameList[device_id] = device_name
            @refresh device_id

    #---------------------------------------------------------------------------
    getListItem: (target) ->
        self = this

        parser = document.createElement("a");
        parser.href = target.url;

        myUrl = parser.pathname
        index = myUrl.indexOf("/www")
        if index >= 0
            myUrl = myUrl.substr(index)
        
        name = @nameList[target.channel]
        name = "Unknown" unless name

        text = "#{name}: " + myUrl

        item = DT.OPTION($connectorChannel: target.channel, text)
        item.addStyleClass "weinre-connector-item"
        item.addStyleClass "target"
        item.value = target.channel
        target.element = item
        
        @optionElements[target.channel] = target.element

        item

    #---------------------------------------------------------------------------
    connectToTarget: (targetChannel, event) ->
        if event
            event.preventDefault()
            event.stopPropagation()
        target = @connectors[targetChannel]
        return false unless target
        return false if target.closed
        Weinre.WeinreClientCommands.connectTarget Weinre.messageDispatcher.channel, targetChannel
        false

#-------------------------------------------------------------------------------
class ClientList extends ConnectorList

    constructor: ->
        super "Clients"
        @noneItem.innerHTML = "Waiting for connection..."

    #---------------------------------------------------------------------------
    afterInitialConnection: () ->
        @noneItem.innerHTML = "Connection lost, reload this page to reconnect."
        @noneItem.addStyleClass "error"

    #---------------------------------------------------------------------------
    getListItem: (client) ->
        text = client.hostName + " [channel: #{client.channel} id: #{client.id}]"
        item = DT.LI($connectorChannel: client.channel, text)
        item.addStyleClass "weinre-connector-item"
        item.addStyleClass "client"

        if Weinre.messageDispatcher
            if client.channel == Weinre.messageDispatcher.channel
                item.addStyleClass "current"

        client.element = item
        item

#-------------------------------------------------------------------------------
require("../common/MethodNamer").setNamesForClass(module.exports)
