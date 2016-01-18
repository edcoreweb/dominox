<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Http\ResponseFactory;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Return a new response from the application.
     *
     * @param  string $content
     * @param  int    $status
     * @param  array  $headers
     * @return \Symfony\Component\HttpFoundation\Response|\Laravel\Lumen\Http\ResponseFactory
     */
    public function response($content = '', $status = 200, array $headers = [])
    {
        $factory = new ResponseFactory;

        if (func_num_args() === 0) {
            return $factory;
        }

        return $factory->make($content, $status, $headers);
    }

    /**
     * Return a new JSON response from the application.
     *
     * @param  string $content
     * @param  int    $status
     * @param  array  $headers
     * @param  int    $options
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function json($content = '', $status = 200, array $headers = [], $options = 0)
    {
        return $this->response()->json($content, $status, $headers, $options);
    }
}
