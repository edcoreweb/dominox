process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir');

elixir.config.assetsPath = '';
elixir.config.production = false;
elixir.config.sourcemaps = true;
elixir.config.publicPath = 'dist';
elixir.config.js.browserify.options.debug = true;

elixir(function(mix) {
    // Complie less.
    mix.less('app.less');

    // Compile JavaScript.
    mix.browserify('app.js');

    // Copy fonts.
    mix.copy('node_modules/bootstrap/dist/fonts', 'dist/fonts');
    mix.copy('node_modules/font-awesome/fonts', 'dist/fonts');
});
