const markdown_it = require('markdown-it');
const markdown_it_abbr = require('markdown-it-abbr');
const markdown_it_container = require('markdown-it-container');
const markdown_it_deflist = require('markdown-it-deflist');
const markdown_it_emoji = require('markdown-it-emoji');
const markdown_it_footnote = require('markdown-it-footnote');
const markdown_it_highlightjs = require('markdown-it-highlightjs');
const markdown_it_ins = require('markdown-it-ins');
const markdown_it_katex = require('markdown-it-katex');
const markdown_it_mark = require('markdown-it-mark');
const markdown_it_sub = require('markdown-it-sub');
const markdown_it_sup = require('markdown-it-sup');
const markdown_it_task_lists = require('markdown-it-task-lists');
const markdown_it_toc = require('markdown-it-toc');

const defaults = {
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks
  linkify: true, // autoconvert URL-like texts to links
  typographer: true, // Enable smartypants and other sweet transforms
};

const audio_opts = {
  validate(params) {
    return params.trim().match(/^audio$/);
  },
  render(tokens, idx) {
    if (tokens[idx].nesting === 1) {
      const tokenContent = tokens[idx + 2];
      if (tokenContent && tokenContent.type === 'inline') {
        // content
        const content = tokenContent.content;
        tokenContent.content = '';
        tokenContent.children = [];
        // element
        const id = `skPlayer-${(new Date()).getTime()}`;
        // opening tag
        return `<div id="${id}" class="skPlayer">
                <script type="text/javascript">
                function loadScript(src, callback) {
                    if (!(typeof callback === 'function')) {
                        callback = function() {};
                    }
                    var check = document.querySelectorAll("script[src='" + src + "']");
                    if (check.length > 0) {
                        check[0].addEventListener('load', function() {
                            callback();
                        });
                        callback();
                        return;
                    }
                    var script = document.createElement('script');
                    var head = document.getElementsByTagName('head')[0];
                    script.type = 'text/javascript';
                    script.charset = 'UTF-8';
                    script.src = src;
                    if (script.addEventListener) {
                        script.addEventListener('load', function() {
                            callback();
                        }, false);
                    } else if (script.attachEvent) {
                        script.attachEvent('onreadystatechange', function() {
                            var target = window.event.srcElement;
                            if (target.readyState === 'loaded') {
                                callback();
                            }
                        });
                    }
                    head.appendChild(script);
                }
                loadScript('https://cdn.cabloy.org/audio/skPlayer.min.js', function() {
                    var options = ${content};
                    options.element = document.getElementById('${id}');
                    var player = new skPlayer(options);
                })
                </script>
        `;
      }
      return '<div>\n';
    }
    // closing tag
    return '</div>\n';
  },
};

module.exports = {
  create(ops) {
    return markdown_it((ops && ops.defaults) || defaults)
      .use(markdown_it_abbr)
      .use(markdown_it_container)
      .use(markdown_it_container, 'warning')
      .use(markdown_it_container, 'hljs-left')
      .use(markdown_it_container, 'hljs-center')
      .use(markdown_it_container, 'hljs-right')
      .use(markdown_it_container, 'audio', audio_opts)
      .use(markdown_it_deflist)
      .use(markdown_it_emoji)
      .use(markdown_it_footnote)
      .use(markdown_it_highlightjs)
      .use(markdown_it_ins)
      .use(markdown_it_katex)
      .use(markdown_it_mark)
      .use(markdown_it_sub)
      .use(markdown_it_sup)
      .use(markdown_it_task_lists)
      .use(markdown_it_toc);
  },
};