#!/usr/bin/env node

'use strict';

var program = require('commander');
var helper = require('./helper');
var path = require('path');
var fs = require('fs');

var ROOT_DIR = path.resolve();
var CONFIG_FILE_NAME = 'artisan.json';
var config = {};

try {
    fs.statSync(path.resolve(CONFIG_FILE_NAME));
} catch(error) {
    helper.log('Please create a '+ CONFIG_FILE_NAME +' configuration file in root', 'yellow');
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
    .on('--help', function() {
        var available_commands = Object.keys(config.commands);

        helper.log('  Available Commands:', 'green');
        helper.log('  _____________________', 'green');
        helper.log('');
        
        Object.keys(config.commands).map(function(command) {
            var command_description = config.commands[command].description;

            if (command_description == undefined) {
                command_description = '';
            }

            helper.log('  '+ command + '       ' + command_description, 'green');
        });

        helper.log('');
    })
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

// check command
var g_command = config.commands[arg_command];

if (g_command == undefined) {
    helper.log("Not found '"+ arg_command +"' command!", 'red');
    process.exit(1);
}

var stub_path = g_command.stub;

// check target path and create recursive path if needed.
var target_path = path.resolve(arg_path);
var target_dirname = path.dirname(target_path);
helper.mkdirp(target_dirname);

if (config.stubs_path.substr(-1) != '/') {
    config.stubs_path += '/';
}

var real_stub_path = path.resolve(config.stubs_path + stub_path);

try {
    var original_stub_content = fs.readFileSync(real_stub_path, {
        encoding: 'utf8'
    });
} catch (error) {
    helper.log("Stub file not found for '" + arg_command + "' command.", 'red');
    helper.log("Stub file: " + real_stub_path, 'red');
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

helper.log('File was created: ' + target_path, 'green');