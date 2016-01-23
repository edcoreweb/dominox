<?php

namespace App\WS;

use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Validation\Validator;

trait ValidationTrait
{
    /**
     * Validate the given message request with the given rules.
     *
     * @param  \App\WS\Message $message
     * @param  array $rules
     * @param  array $messages
     * @param  array $customAttributes
     * @return void
     */
    public function validate($message, array $rules, array $messages = [], array $customAttributes = [])
    {
        $validator = $this->getValidationFactory()->make($message->all(), $rules, $messages, $customAttributes);

        if ($validator->fails()) {
            throw new ValidationException($validator, $this->formatValidationErrors($validator));
        }
    }

    /**
     * Format validation errors.
     *
     * @param  \Illuminate\Contracts\Validation\Validator $validator
     * @return \Illuminate\Support\MessageBag
     */
    protected function formatValidationErrors(Validator $validator)
    {
        return $validator->errors()->getMessages();
    }

    /**
     * Get a validation factory instance.
     *
     * @return \Illuminate\Contracts\Validation\Factory
     */
    protected function getValidationFactory()
    {
        return app('validator');
    }
}
