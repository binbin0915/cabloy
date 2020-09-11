const versionManager = require('./bean/version.manager.js');
const beanSequence = require('./bean/bean.sequence.js');
const queueSequence = require('./bean/queue.sequence.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.sequence': {
      mode: 'app',
      bean: queueSequence,
    },
    // global
    sequence: {
      mode: 'ctx',
      bean: beanSequence,
      global: true,
    },
  };
  return beans;
};
