#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');

var ROOT_DIR = path.resolve();
var CONFIG_FILE_NAME = 'artisan.json';
var config = {};

try {
    fs.statSync(path.resolve(CONFIG_FILE_NAME));
} catch(error) {
    console.log('Please create a '+ CONFIG_FILE_NAME +' configuration file.');
    process.exit(1);
}

config = JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME)));

var arg_command;
var arg_path;

program
    .version('0.1')
    .arguments('<command> <path>')
    .action(function(command, path) {
        arg_command = command;
        arg_path = path;
    });

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

var stub_path = config.commands[arg_command];
var target_path = path.resolve(arg_path);

if (stub_path == undefined) {
    console.log('Not found command!');
    process.exit(1);
}

var real_stub_path = path.resolve(config.stubs_path + '/' + stub_path);

var original_stub_content = fs.readFileSync(real_stub_path, {
    encoding: 'utf8'
});

var new_stub_content = original_stub_content.replace(/\{\{(.*)\}\}/gm, function(match, text) {
    return path.relative(path.dirname(target_path), text);
});

fs.writeFileSync(target_path + '.js', new_stub_content, {
    encoding: 'utf8'
});