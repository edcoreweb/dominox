process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir');

elixir.config.assetsPath = 'src';

elixir(function(mix) {
    mix.browserify('app.js');
    mix.less('app.less');
    mix.less('splash.less');
});
