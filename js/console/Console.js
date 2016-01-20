'use strict';

let fs = require('fs');
let path = require('path');

let config = {
    stubs: 'js/console/stubs',
    templates: 'js/templates',
    components: 'js/components',
    componentsImport: 'js/components.js'
};

class Console {
    constructor(args) {
        this.args = args.slice(2, args.length);
        this.switch();
    }

    switch() {
        switch (this.arg()) {
        case 'make:component':
            return this.makeComponent();

        case '--help':
            return this.help();

        default:
            this.write('Invalid command.');
            return this.help();
        }
    }

    makeComponent() {
        let path = this.arg();
        let isGlobal = this.option('global');
        let route = this.optionValue('route');
        let sImport = this.option('import');

        if (!path) {
            return this.write('Invalid component name.');
        }

        let component = path.substr(path.lastIndexOf('/') + 1, path.length);

        let stub = fs.readFileSync(config.stubs + '/template.stub');
        stub = stub.toString().replace('{{component}}', component);

        let template = config.templates +'/'+ path + '.html';
        this.writeFile(template, stub);

        let back = '';
        for (let i = 0; i < path.split('/').length; i++) {
            back = '../';
        }

        stub = fs.readFileSync(config.stubs +'/component'+(isGlobal?'-global':'')+'.stub');
        stub = stub.toString().replace('{{template}}', './../' + back + 'templates/' + path + '.html')
                              .replace('{{component}}', component);

        let componentPath = config.components +'/'+ path + '.js';
        this.writeFile(componentPath, stub);

        if (sImport) {
            fs.appendFileSync(config.componentsImport, 'import \'./components/'+path+'\';\n');
        }

        this.write('Component created!');

        if (route) {
            stub = fs.readFileSync(config.stubs + '/route.stub');
            stub = stub.toString().replace('{{route}}', route)
                            .replace('{{component}}', path);
            this.write(stub);
        }
    }

    writeFile(filePath, contents) {
        let dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(filePath, contents);
    }

    write(msg) {
        console.log(msg);
    }

    arg(_default) {
        return this.args.shift() || _default || null;
    }

    option(name, _default) {
        for (let i = 0; i < this.args.length; i++) {
            if (this.args[i].indexOf('--' + name) > -1) {
                return this.args[i];
            }
        }

        return _default || null;
    }

    optionValue(name, _default) {
        let option = this.option(name);

        if (!option) {
            return _default;
        }

        let eq = option.indexOf('=');

        return eq > -1 ? option.substr(eq + 1, option.length) : _default;
    }

    help() {
        this.write('\nAvailable commands:\n');

        this.write(
            'make:component <name> [options] \t Create a component with template.\n' +
            ' --global \t\t Register global.\n' +
            ' --route=<route> \t Generate route.\n' +
            ' --import \t\t Import component.'
        );
    }
}

module.exports = Console;
