# MGDC - Backend

## Requirements

Have this tools install on your local machine before starting

- python (verison >= 3)
- AWS CLI [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- AWS SAM CLI [Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Nodejs [Install nodejs](https://nodejs.org/en/download/)


pour utiliser le chat en local, installer le client wscat (un package npm)
Initialisation de la connexion (dans 2 terminaux)

Dans le terminal 1

```bash
wscat -c wss://wsapi.metagolddiggerclub.com/dev
```

Dans le terminal 2

```bash
wscat -c wss://wsapi.metagolddiggerclub.com/dev
```

En suite mettre les utilisateurs en ligne (Associer leur connectionId à leur address)
Dans le terminal 1

```bash
{"action":"setOnline", "address":"<from Address>"}
```

Dans le terminal 2

```bash
{"action":"setOnline", "address":"<to Address>"}
```

Avant d'envoyer les messages s'assurer de créer le chat room en matchant un MGDC

```bash
curl --location --request POST 'https://api.metagolddiggerclub.com/dev/breed' \
--header 'Content-Type: application/json' \
--data-raw '{
        "from": "<from Address>",
        "to": "<to Address>",
        "mgdcId": 228,
        "mgdcName": "MGDC #228"
}'
```

A partir du chatId récupérer en réponse on peut now envoyer les messages (Remplacer la valeur du chatId)
Dans le terminal 1

```bash
{"action":"sendMessage", "chatId": "<chat ID>", "message":"ping", "from": "<from Address>", "to": "<to Address>"}
```

Dans le terminal 2

```bash
{"action":"sendMessage", "chatId": "<chat ID>", "message":"ping", "from": "<from Address>", "to": "<to Address>"}
```

Pour breeder avec un MGDC

```bash
curl --location --request PUT 'https://api.metagolddiggerclub.com/dev/breed/<owner Address>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mgdcId": 1009
}'
```

Pour récupérer la list de ses discussions avec les autres

```bash
curl --location --request GET 'https://api.metagolddiggerclub.com/dev/chats/rooms/<owner Address>'
```

Pour récupérer l'historique d'une conversation avec un autre

```bash
curl --location --request GET 'https://api.metagolddiggerclub.com/dev/chats/<chat ID>'
```

Pour récupérer la liste des matchs et des breeds

```bash
curl --location --request GET 'https://api.metagolddiggerclub.com/dev/breed/<owner Address>'
```

Pour récupérer la liste des MGDC

```bash
curl --location --request GET 'https://api.metagolddiggerclub.com/dev/mgdc'
```

Pour récupérer la liste des MGDC non breeder

```bash
curl --location --request GET 'https://api.metagolddiggerclub.com/dev/mgdc/free'
```

Pour récupérer un mgdc à partir de son ID

```bash
curl --location --request GET 'https://api.metagolddiggerclub.com/dev/mgdc/<mgdc ID>'
```