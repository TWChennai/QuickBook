module.exports = {
  QuickBookCalendar: process.env.calendarId,
  whitelistedIps: JSON.parse(process.env.whitelistedIps),
  google: {
    "client_id": process.env.client_id,
    "project_id": process.env.project_id,
    "appCode": process.env.application_code,
    "client_secret": process.env.client_secret,
    "redirect_uri": process.env.redirect_uri,
    "token": {
      "access_token": process.env.access_token,
      "token_type": "Bearer",
      "expires_in": 3600,
      "refresh_token": process.env.refresh_token
    }
  },
  jigsaw: {
    authorizationCode : process.env.authorizationCode
  },
  db: {
    room: 'rooms',
    url: process.env.db_url
  }
}
