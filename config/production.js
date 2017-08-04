module.exports = {
  rooms: require('./rooms.json'),
  offices: ['Chennai'],
  defaultOffice: 'Chennai',
  QuickBookCalendar: 'QuickBookCalendar',
  whitelistedIps: [],
  google: {
    client_secret: '<client_secret>',
    client_id: '<client_id>',
    redirect_uri: 'https://quickbook.localtunnel.me',
    appCode: '',
    token: {}
  }
}
