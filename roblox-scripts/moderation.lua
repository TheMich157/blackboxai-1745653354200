-- Roblox Lua script to report moderation actions to the portal API with enhanced real-time enforcement and error handling

local ApiModule = require(script.Parent.apiModule)
local Players = game:GetService("Players")

-- Example token, in practice this should be securely obtained and refreshed
local apiToken = "YOUR_API_TOKEN_HERE"

local Moderation = {}

-- Helper function to kick player locally with error handling
local function kickPlayer(player, reason)
    if player and player:IsDescendantOf(game) then
        local success, err = pcall(function()
            player:Kick(reason or "You have been kicked by staff.")
        end)
        if not success then
            warn("Failed to kick player:", err)
        end
    end
end

-- Helper function to ban player locally (simple example, extend as needed)
local bannedPlayers = {}

local function banPlayer(player, reason)
    if player then
        bannedPlayers[player.UserId] = true
        local success, err = pcall(function()
            player:Kick(reason or "You have been banned by staff.")
        end)
        if not success then
            warn("Failed to ban player:", err)
        end
    end
end

-- Listen for player joining to enforce bans
Players.PlayerAdded:Connect(function(player)
    if bannedPlayers[player.UserId] then
        local success, err = pcall(function()
            player:Kick("You are banned from this game.")
        end)
        if not success then
            warn("Failed to kick banned player:", err)
        end
    end
end)

-- Report a warning with retry logic
function Moderation:IssueWarning(targetPlayerId, reason)
    local retries = 3
    local result
    for i = 1, retries do
        result = ApiModule:ReportModerationAction("warn", targetPlayerId, reason, nil, apiToken)
        if result then break end
        wait(1)
    end
    return result
end

-- Report a kick and kick player locally with error handling
function Moderation:KickUser(targetPlayerId, reason)
    local retries = 3
    local result
    for i = 1, retries do
        result = ApiModule:ReportModerationAction("kick", targetPlayerId, reason, nil, apiToken)
        if result then break end
        wait(1)
    end
    local player = Players:GetPlayerByUserId(targetPlayerId)
    kickPlayer(player, reason)
    return result
end

-- Report a ban and ban player locally with error handling
function Moderation:BanUser(targetPlayerId, reason, duration)
    local retries = 3
    local result
    for i = 1, retries do
        result = ApiModule:ReportModerationAction("ban", targetPlayerId, reason, duration, apiToken)
        if result then break end
        wait(1)
    end
    local player = Players:GetPlayerByUserId(targetPlayerId)
    banPlayer(player, reason)
    return result
end

return Moderation
