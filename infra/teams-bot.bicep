param botName string = 'm365-fm-teams-bot'
param botAppId string
param workerEndpoint string = 'https://api-dub.m365.fm/api/teams/messages'

resource bot 'Microsoft.BotService/botServices@2022-09-15' = {
  name: botName
  location: 'global'
  kind: 'azurebot'
  sku: {
    name: 'F0'
  }
  properties: {
    displayName: 'M365.FM'
    endpoint: workerEndpoint
    msaAppId: botAppId
    msaAppType: 'MultiTenant'
    publicNetworkAccess: 'Enabled'
  }
}

resource teamsChannel 'Microsoft.BotService/botServices/channels@2022-09-15' = {
  parent: bot
  name: 'MsTeamsChannel'
  location: 'global'
  properties: {
    channelName: 'MsTeamsChannel'
  }
}

output botAppId string = bot.properties.msaAppId
