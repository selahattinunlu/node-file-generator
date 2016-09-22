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
    console.log('Please create a '+ CONFIG_FILE_NAME +' configuration file in root');
    process.exit(1);
}

config = JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME)));

var arg_command;
var arg_path;

program
    .version('1.0')
    .description('File Generator By Reading Stubs')
    .arguments('<command> <path>')
    .action(function(command, path) {
        arg_command = command;
        arg_path = path;
    })
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

// check command
var stub_path = config.commands[arg_command];

if (stub_path == undefined) {
    console.log('Not found command!');
    process.exit(1);
}


// check target path and create recursive path if needed.
var target_path = path.resolve(arg_path);


if (config.stubs_path.substr(-1) != '/') {
    config.stubs_path += '/';
}

var real_stub_path = path.resolve(config.stubs_path + stub_path);

try {
    var original_stub_content = fs.readFileSync(real_stub_path, {
        encoding: 'utf8'
    });
} catch (error) {
    console.log("Stub file not found for '" + arg_command + "' command.");
    console.log("Stub file: " + real_stub_path);
    process.exit(1);
}

// transform module path
var new_stub_content = original_stub_content.replace(/\[\[(.*)\]\]/gm, function(match, text) {
    return path.relative(path.dirname(target_path), text);
});

if (path.extname(target_path) == '' && config.default_extension) {
    if (config.default_extension[0] != '.') {
        config.default_extension = '.' + config.default_extension;
    }

    target_path += config.default_extension;
}

fs.writeFileSync(target_path, new_stub_content, {
    encoding: 'utf8'
});

console.log('File was created!');