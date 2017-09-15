module.exports = {
  QuickBookCalendar: '<quickBookCalendar-id>',
  whitelistedIps: [],
  google: {
    "client_id": "<client_id>",
    "project_id": "<project_id>",
    "appCode": "<application-code>",
    "client_secret": "<client_secret>",
    "redirect_uri": 'https://quickbook.localtunnel.me',
    "token": {
      "access_token": "<access_token>",
      "token_type": "Bearer",
      "expires_in": 3600,
      "refresh_token": "<refresh_token>"
    }
  },
  jigsaw: {
    authorizationCode : '<authorizationCode>'
  },
  db: {
    room: 'rooms',
    url: 'mongodb://localhost/quickbook'
  }
}
