process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir');

elixir.config.assetsPath = '';

elixir(function(mix) {
    // Complie less.
    mix.less('app.less', 'dist/app.css');

    // Compile JavaScript.
    mix.browserify('app.js', 'dist/app.js', null, {debug: true});

    // Copy fonts.
    mix.copy('node_modules/bootstrap/dist/fonts', 'dist/fonts');
    mix.copy('node_modules/font-awesome/fonts', 'dist/fonts');
});
