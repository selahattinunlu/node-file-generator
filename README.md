# node-file-generator

You can easily create files by copying stubs.

`npm run generator <command_name> <target_path>`

You can change above "generator" name. It depends to your package.json file definitions

### Installation

`npm i --save node-file-generator`

## Usage

### Configuration

* Add following line into package.json file

```json
"scripts": {
  "generator": "file-generator"
},
```

Then, You can use this package like this `npm run generator`.


### Config File

If you did not add a config file yet, an error occurs.
You can create a "generator.json" file like this.

```json
{
    "default_extension": "js",
    "stubs_path": "resources/stubs",
    "commands": {
        "make:action": "stub_file_name.extension"
    }
}
```

**default_extension**

If you do not tell an extension in "target_path", it will use default_extension.

For example: `npm run generator make:reducer app/reducers/sample-reducer` command will create `sample-reducer.js` file into the "app/reducers" folder.

**stubs_path**

It tell that where is the stub files.

**commands**

You can add commands into the "commands".
