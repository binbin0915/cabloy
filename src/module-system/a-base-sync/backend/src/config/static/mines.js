const mineAtomDrafts = require('./mines/mineAtomDrafts.js');
const mineAtomStars = require('./mines/mineAtomStars.js');
const mineAtomArchives = require('./mines/mineAtomArchives.js');
const mineTaskClaimings = require('./mines/mineTaskClaimings.js');
const mineTaskHandlings = require('./mines/mineTaskHandlings.js');
const mineTaskCompleteds = require('./mines/mineTaskCompleteds.js');
const mineFlowInitiateds = require('./mines/mineFlowInitiateds.js');
const mineFlowParticipateds = require('./mines/mineFlowParticipateds.js');
const mineFlowEnds = require('./mines/mineFlowEnds.js');
const mineMineAttachments = require('./mines/mineMineAttachments.js');
const mineMineComments = require('./mines/mineMineComments.js');
const mineMineExports = require('./mines/mineMineExports.js');
const mineAppearanceLanguage = require('./mines/mineAppearanceLanguage.js');
const mineAppearanceTheme = require('./mines/mineAppearanceTheme.js');
const mineAppearanceView = require('./mines/mineAppearanceView.js');

module.exports = app => {
  const resources = [
    mineAtomDrafts(app),
    mineAtomStars(app),
    mineAtomArchives(app),
    mineTaskClaimings(app),
    mineTaskHandlings(app),
    mineTaskCompleteds(app),
    mineFlowInitiateds(app),
    mineFlowParticipateds(app),
    mineFlowEnds(app),
    mineMineAttachments(app),
    mineMineComments(app),
    mineMineExports(app),
    mineAppearanceLanguage(app),
    mineAppearanceTheme(app),
    mineAppearanceView(app),
  ];
  return resources;
};
