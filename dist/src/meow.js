"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let meow = require('meow');
exports.default = meow({
    help: `
    Usage
      $ commandName "<email>" "<password>"
    Options
      --dest, -d <filepath>  Folder to download into
      --url <url>            Download From URL
      --concurrency          Number of Chromium tabs to run at the same time
      --quality              Quality
    Examples
      Download all liked posts:
      $ commandName "you@example.com" "hunter42"
      Download all blogged posts:
      $ commandName "you@example.com" "hunter42" --url "https://www.xyz.com/classes/jxxx-appreciation"
      Download into specific folder:
      $ commandName "you@example.com" "hunter42" --dest ~/path/to/folder
      Limit concurrency: (useful on low-powered machines)
      $ commandName "you@example.com" "hunter42" --concurrency 4
  `,
    flags: {
        dest: {
            type: 'string',
            alias: 'd',
        },
        url: {
            type: 'string',
        },
        quality: {
            type: 'integer',
        },
        concurrency: {
            type: 'number',
            default: 5,
        },
    },
});
//# sourceMappingURL=meow.js.map