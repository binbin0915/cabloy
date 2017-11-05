/*
* @Author: zhennann
* @Date:   2017-09-18 19:03:33
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-15 21:19:22
*/

const chalk = require('chalk');
const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const messageCheckReady = 'eb:module:a-version:check-ready';

// eslint-disable-next-line
module.exports = app => {

  app.messenger.once('egg-ready', () => {
    versionCheck(app);
  });

  return {
    routes,
    services,
    config,
    locales,
    errors,
  };

};

function versionCheck(app) {

  if (app.config.env === 'prod') {
    // just send message
    return app.messenger.sendToApp(messageCheckReady);
  }

  if (app.config.env === 'unittest') {
    return app.httpRequest().post('/api/a/version/version/check').then(result => {
      if (result.data && result.data.code === 0) {
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } else {
        console.log(chalk.cyan('  Modules are checked failed!'));
      }

      // send message
      app.emit(messageCheckReady);
    });

  }

  if (app.config.env === 'local') {
    const listen = app.config.cluster.listen;
    return app.curl(`http://${listen.hostname}:${listen.port}/api/a/version/version/check`, {
      method: 'POST',
      ontentType: 'json',
      dataType: 'json',
    }).then(result => {
      if (result.data && result.data.code === 0) {
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } else {
        console.log(chalk.cyan('  Modules are checked failed!'));
      }
      console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));

      // send message
      app.messenger.sendToApp(messageCheckReady);
    });

  }

}