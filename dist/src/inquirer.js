"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Configstore = require('configstore');
let inquirer = require('inquirer');
let isEmail = require('is-email');
exports.default = async (name, cli) => {
    let store = new Configstore(name);
    let c = await inquirer.prompt([
        {
            message: 'URL:',
            type: 'input',
            name: 'url',
            default: cli.flags.url || store.get('url'),
            when: () => typeof cli.flags.url === 'undefined',
            validate: (input) => input.length > 0,
        },
        {
            message: 'Directory to create/download files into:',
            type: 'input',
            name: 'dest',
            default: cli.flags.dest || store.get('dest') || '~/Desktop/masterclass-downloads',
            when: () => typeof cli.flags.dest === 'undefined',
            validate: (input) => input.length > 0,
        },
        {
            message: 'Quality (344,580,1040,1850,2702,4823):',
            type: 'number',
            name: 'quality',
            default: cli.flags.quality || store.get('quality') || 2702,
            when: () => typeof cli.flags.url === 'undefined',
            validate: (input) => [344, 580, 1040, 1850, 2702, 4823].includes(parseInt(input)),
        },
        {
            message: 'Master Class Account Email:',
            type: 'input',
            name: 'email',
            default: cli.input[0] || store.get('email'),
            when: () => typeof cli.input[0] === 'undefined',
            validate: isEmail,
        },
        {
            message: 'Master Class Account Password:',
            type: 'input',
            name: 'password',
            default: cli.input[1] || store.get('password'),
            when: () => typeof cli.input[1] === 'undefined',
            validate: (input) => input.length > 0,
        },
        {
            message: 'Headless:',
            type: 'confirm',
            name: 'headless',
            default: cli.input[1] || store.get('headless') || false,
            when: () => typeof cli.input[1] === 'undefined',
            validate: (input) => input.length > 0,
        },
    ]);
    c = { ...store.all, ...c };
    store.set('email', c.email);
    store.set('dest', c.dest);
    store.set('quality', c.quality);
    store.set('url', c.url);
    store.set('password', c.password);
    store.set('headless', c.headless);
    return c;
};
//# sourceMappingURL=inquirer.js.map