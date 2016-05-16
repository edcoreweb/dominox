<?php

namespace App\NotificationHub;

use Exception;

class NotificationHub
{
    const API_VERSION = "?api-version=2015-01";

    public $endpoint;
    public $hubPath;
    public $sasKeyName;
    public $sasKeyValue;

    public function __construct($connectionString, $hubPath)
    {
        $this->hubPath = $hubPath;

        $this->parseConnectionString($connectionString);
    }

    protected function parseConnectionString($connectionString)
    {
        $parts = explode(';', $connectionString);

        if (sizeof($parts) != 3) {
            throw new Exception('Error parsing connection string: ' . $connectionString);
        }

        foreach ($parts as $part) {
            if (strpos($part, 'Endpoint') === 0) {
                $this->endpoint = 'https' . substr($part, 11);
            } else if (strpos($part, 'SharedAccessKeyName') === 0) {
                $this->sasKeyName = substr($part, 20);
            } else if (strpos($part, 'SharedAccessKey') === 0) {
                $this->sasKeyValue = substr($part, 16);
            }
        }
    }

    public function generateSasToken($uri)
    {
        $targetUri = strtolower(rawurlencode(strtolower($uri)));

        $expires = time();
        $expiresInMins = 60;
        $expires = $expires + $expiresInMins * 60;
        $toSign = $targetUri . "\n" . $expires;

        $signature = rawurlencode(base64_encode(hash_hmac('sha256', $toSign, $this->sasKeyValue, TRUE)));

        return "SharedAccessSignature sr={$targetUri}&sig={$signature}&se={$expires}&skn={$this->sasKeyName}";
    }

    public function broadcastNotification($notification)
    {
        $this->sendNotification($notification, '');
    }

    public function sendNotification($notification, $tagsOrTagExpression)
    {
        echo $tagsOrTagExpression.'<p>';

        if (is_array($tagsOrTagExpression)) {
            $tagExpression = implode(' || ', $tagsOrTagExpression);
        } else {
            $tagExpression = $tagsOrTagExpression;
        }

        // build uri
        $uri = $this->endpoint . $this->hubPath . '/messages' . NotificationHub::API_VERSION;

        echo $uri.'<p>';

        $ch = curl_init($uri);

        if (in_array($notification->format, ['template', 'apple', 'gcm'])) {
            $contentType = 'application/json';
        } else {
            $contentType = 'application/xml';
        }


        $token = $this->generateSasToken($uri);

        $headers = [
            'Authorization: '.$token,
            'Content-Type: '.$contentType,
            'ServiceBusNotification-Format: '.$notification->format
        ];

        if ($tagExpression != '') {
            $headers[] = 'ServiceBusNotification-Tags: '.$tagExpression;
        }

        // add headers for other platforms
        if (is_array($notification->headers)) {
            $headers = array_merge($headers, $notification->headers);
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $notification->payload
        ]);

        // Send the request
        $response = curl_exec($ch);

        // Check for errors
        if ($response === false){
            throw new c(curl_error($ch));
        }

        $info = curl_getinfo($ch);

        if ($info['http_code'] <> 201) {
            throw new Exception('Error sending notificaiton: '. $info['http_code'] . ' msg: ' . $response);
        }

        print_r($info);

        echo $response;
    }

    public function createRegistration($registrationId)
    {
        $registrationPayload = '<?xml version="1.0" encoding="utf-8"?>
        <entry xmlns="http://www.w3.org/2005/Atom">
            <content type="application/xml">
                <GcmRegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect">
                    <GcmRegistrationId>'.$registrationId.'</GcmRegistrationId>
                </GcmRegistrationDescription>
            </content>
        </entry>';

        $uri = $this->endpoint . $this->hubPath . '/registrations' . NotificationHub::API_VERSION;

        $ch = curl_init($uri);

        $token = $this->generateSasToken($uri);

        $headers = [
            'Authorization: '.$token,
            'Content-Type: application/atom+xml;type=entry;charset=utf-8',
            'x-ms-version: 2015-01',
        ];

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $registrationPayload
        ]);

        // Send the request
        $response = curl_exec($ch);

        // Check for errors
        if ($response === false){
            throw new c(curl_error($ch));
        }

        $info = curl_getinfo($ch);

        print_r($info);

        echo $response;
    }

    public function readRegistrations()
    {
        $uri = $this->endpoint . $this->hubPath . '/registrations' . NotificationHub::API_VERSION;

        $ch = curl_init($uri);

        $token = $this->generateSasToken($uri);

        $headers = [
            'Authorization: '.$token,
            'Content-Type: application/atom+xml;type=entry;charset=utf-8',
            'x-ms-version: 2015-01',
        ];

        var_dump($uri);

        var_dump($token);
        exit;

        curl_setopt_array($ch, [
            // CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => $headers,
            // CURLOPT_POSTFIELDS => $registrationPayload
        ]);

        // Send the request
        $response = curl_exec($ch);

        // Check for errors
        if ($response === false){
            throw new c(curl_error($ch));
        }

        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $header = substr($response, 0, $header_size);

        $info = curl_getinfo($ch);

        print_r($info);

        echo $response;
    }
}
