<?php

header('Access-Control-Allow-Origin: *');

$app = require __DIR__.'/../app/bootstrap.php';

$app->run();
