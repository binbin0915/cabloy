const callback = require('./service/callback.js');
const contacts = require('./service/contacts.js');
const jssdk = require('./service/jssdk.js');
const auth = require('./service/auth.js');

module.exports = app => {
  const services = {
    callback,
    contacts,
    jssdk,
    auth,
  };
  return services;
};
