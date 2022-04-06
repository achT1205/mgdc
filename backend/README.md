# MGDC - Backend

## Requirements

Have this tools install on your local machine before starting

- python (verison >= 3)
- AWS CLI [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- AWS SAM CLI [Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Nodejs [Install nodejs](https://nodejs.org/en/download/)


pour utiliser le chat en local tu peux installer le client wscat (un package npm)
Initialisation de la connexion (dans 2 terminaux)
wscat -c wss://da42imq2q2.execute-api.eu-west-3.amazonaws.com/dev
wscat -c wss://da42imq2q2.execute-api.eu-west-3.amazonaws.com/dev

En suite mettre les utilisateurs en ligne (Associer leur connectionId à leur address)
{"action":"setOnline", "address":"@faboulaye"}
{"action":"setOnline", "address":"@achille"}

Avant d'envoyer les messages s'assurer de créer le chat room

curl --location --request POST 'https://dtd9glv2pc.execute-api.eu-west-3.amazonaws.com/dev/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "from": "@faboulaye",
  "fromTokenId": "xxx",
  "to": "@achille"
  "toTokenId":"xxx",
}'

A partir du chatId récupérer en réponse on peut now envoyer les messages (Remplacer la valeur du chatId)

{"action":"sendMessage", "chatId": "f2c57a84-9446-4654-b199-d65a09a9860d", "message":"ping", "from": "@faboulaye", "to": "@achille"}
{"action":"sendMessage", "chatId": "f2c57a84-9446-4654-b199-d65a09a9860d", "message":"pong", "from": "@achille", "to": "@faboulaye"}

Pour info dans le frontend le POST des messages se fera à partir cet endpoint <https://dtd9glv2pc.execute-api.eu-west-3.amazonaws.com/dev>
en combinaison avec la connectionId

Pour récupérer la list de ses discussions avec les autres
curl --location --request GET 'https://dtd9glv2pc.execute-api.eu-west-3.amazonaws.com/dev/my-mgdc/@faboulaye'

Pour récupérer l'historique d'une conversation avec un autre
curl --location --request GET 'https://dtd9glv2pc.execute-api.eu-west-3.amazonaws.com/dev/chats/f2c57a84-9446-4654-b199-d65a09a9860d'
