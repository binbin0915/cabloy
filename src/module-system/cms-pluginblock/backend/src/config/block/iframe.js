module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const block = {
    validator: {
      module: moduleInfo.relativeName,
      validator: 'blockIFrame',
    },
    render({ md, options, block, token, index, content }) {
      const url = md.utils.escapeHtml(content.url);
      const width = md.utils.escapeHtml(content.width || '100%');
      const height = md.utils.escapeHtml(content.height || '300px');
      return `<div class="block block-iframe" style="width:${width};height:${height};"><iframe width="100%" height="100%" scrolling="auto" frameborder="0" src="${url}"></iframe></div>\n`;
    },
  };
  return block;
};
