# Domino X

CLIW Project.

## Installation

#### hosts

```
127.0.0.1           dominox.app
127.0.0.1           api.dominox.app
```

#### Apache vhosts

```
<VirtualHost *:80>
    DocumentRoot "path/to/dominox"
    ServerName dominox.app
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "path/to/dominox/api/public"
    ServerName api.dominox.app
</VirtualHost>
```

#### Client

- `npm install`
- `gulp`
- [vue-devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) (optional) 

#### Api Server

- `cd api/`
- `cp .env.example .env`
- `composer install`
- `php artisan migrate`
- `php artisan db:seed`
