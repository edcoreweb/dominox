<?php

$_SERVER['REQUEST_URI'] = str_replace('api/public/', '', $_SERVER['REQUEST_URI']);

$app = require __DIR__.'/../app/bootstrap.php';

$app->run();
