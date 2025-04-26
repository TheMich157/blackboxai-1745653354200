const fetch = require('node-fetch');

const ROBLOX_API_BASE = 'https://groups.roblox.com/v1';

// Function to get user groups from Roblox API
async function getUserGroups(robloxUserId) {
  const url = ROBLOX_API_BASE + '/users/' + robloxUserId + '/groups';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Roblox groups');
  }
  const data = await response.json();
  return data.data || [];
}

// Function to check if user is in a specific group with a minimum rank
async function isUserInGroup(robloxUserId, groupId, minRank) {
  const groups = await getUserGroups(robloxUserId);
  for (const group of groups) {
    if (group.id === groupId && group.rank >= minRank) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getUserGroups,
  isUserInGroup
};
