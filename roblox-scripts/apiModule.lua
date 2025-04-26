-- Roblox Lua module for communicating with the external portal API

local HttpService = game:GetService("HttpService")

local ApiModule = {}

-- Base URL of the portal API
local BASE_URL = "http://localhost:3000/api"

-- Helper function to send HTTP requests
local function sendRequest(endpoint, method, data, token)
    local url = BASE_URL .. endpoint
    local headers = {
        ["Content-Type"] = "application/json"
    }
    if token then
        headers["Authorization"] = "Bearer " .. token
    end

    local body = nil
    if data then
        body = HttpService:JSONEncode(data)
    end

    local success, response = pcall(function()
        return HttpService:RequestAsync({
            Url = url,
            Method = method,
            Headers = headers,
            Body = body
        })
    end)

    if success and response.Success then
        return HttpService:JSONDecode(response.Body)
    else
        warn("API request failed:", response and response.StatusCode, response and response.Body)
        return nil
    end
end

-- Public API functions

-- Report player stats (deaths, playtime)
function ApiModule:ReportPlayerStats(playerId, deaths, playtime, token)
    local data = {
        deaths = deaths,
        playtime = playtime
    }
    return sendRequest("/game/stats", "PUT", data, token)
end

-- Report moderation action (warning, kick, ban)
function ApiModule:ReportModerationAction(actionType, targetPlayerId, reason, duration, token)
    local data = {
        type = actionType,
        userId = targetPlayerId,
        reason = reason,
        duration = duration
    }
    return sendRequest("/moderation/" .. actionType, "POST", data, token)
end

-- Fetch current server info
function ApiModule:GetServerInfo(token)
    return sendRequest("/game/servers", "GET", nil, token)
end

-- Developer commands: shutdown server
function ApiModule:ShutdownServer(serverId, token)
    return sendRequest("/game/servers/" .. serverId .. "/shutdown", "POST", nil, token)
end

-- Developer commands: migrate server
function ApiModule:MigrateServer(serverId, targetRegion, token)
    local data = {
        targetRegion = targetRegion
    }
    return sendRequest("/game/servers/" .. serverId .. "/migrate", "POST", data, token)
end

return ApiModule
