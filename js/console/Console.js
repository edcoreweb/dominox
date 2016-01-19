'use strict';

let fs = require('fs');

let config = {
    stubs: 'js/console/stubs',
    templates: 'js/templates',
    components: 'js/components',
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
        let name = this.arg();
        let isGlobal = this.option('global');

        if (!name) {
            return this.write('Invalid component name.');
        }

        let path = name;
        name = name.substr(name.lastIndexOf('/') + 1, name.length);

        let template = config.templates +'/'+ path + '.html';
        fs.writeFileSync(template, '');

        let back = '';
        for (let i = 0; i < path.split('/').length; i++) {
            back = '../';
        }

        let stub = fs.readFileSync(config.stubs +'/component'+(isGlobal?'-global':'')+'.stub');
        stub = stub.toString().replace('{{template}}', './../' + back + 'templates/' + name + '.html')
                              .replace('{{component}}', name);

        let component = config.components +'/'+ path + '.js';
        fs.writeFileSync(component, stub);

        this.write('Component created!');
    }

    write(msg) {
        console.log(msg);
    }

    help() {
        this.write('make:component <name> [--global] \t Create a component with template.');
    }

    arg(_default) {
        return this.args.shift() || _default || null;
    }

    option(name, _default) {
        let pos = this.args.indexOf('--'+name);

        return pos >= -1 ? this.args[pos] : _default || null;
    }
}

module.exports = Console;
