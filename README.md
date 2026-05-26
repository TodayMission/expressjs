# ExpressJS API - TodayMission

API backend développée avec **Node.js**, **Express.js**

API qui gère :
- l’authentification utilisateur avec JWT ;
- les groupes ;
- les amis ;
- les challenges ;
- les messages de groupe ;
- l’upload de fichiers ;
- la communication temps réel avec Socket.IO.


---

## Dépendances

| Dépendance | Version |
| --- | --- |
| `express` | `^5.0.6` |
| `jest` | `^30.0.0` |
| `jsonwebtoken` | `^9.0.10` |
| `multer` | `^2.0.0` |
| `node` | `^25.6.0` |
| `pg-promise` | `^0.0.28` |
| `fs` | `^0.0.1-security` |
| `ts-jest` | `^29.4.6` |
| `ts-node` | `^10.9.2` |
| `ts-node-dev` | `^2.0.0` |
| `typescript` | `^5.9.3` |

---

## Crée .env

| Clé | Valeur |
| --- | --- |
| `PG_HOSTNAME` | `localhost` |
| `PG_PORT` | `3000` |
| `PG_DATABASE` | `database` |
| `PG_USER` | `user` |
| `PG_PASSWORD` | `password` |
| `JWT_SECRET` | `secret_key` |

## Installation

## Prérequis

* Node.js >= 18
* npm

## Clone du projet

```bash
git clone https://github.com/TodayMission/expressjs.git
cd expressjs

npm install
npm run dev
```

## Structure du projet

```text
expressjs/
├── example/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   │
│   ├── app.ts
│   ├── auth.ts
│   ├── data.ts
│   ├── database.ts
│   ├── jwt.ts
│   └── utils.ts
│
├── test/
├── uploads/
├── socket.ts
└── server.ts
```

### Description des dossiers et fichiers

| Élément | Description |
|---|---|
| `example/` | Contient des exemples ou fichiers utiles pour tester le projet. |
| `src/` | Contient le code source principal de l’application. |
| `src/controllers/` | Gère les requêtes HTTP reçues par l’API et les réponses envoyées au client. |
| `src/middlewares/` | Contient les middlewares, comme la vérification de l’authentification JWT. |
| `src/models/` | Contient la logique liée aux données et les interactions avec PostgreSQL. |
| `src/app.ts` | Configure l’application Express, les middlewares globaux et les routes de l’API. |
| `src/auth.ts` | Contient la logique d’authentification, comme la vérification des identifiants utilisateur. |
| `src/data.ts` | Fournit des fonctions génériques pour effectuer des opérations sur les données. |
| `src/database.ts` | Configure la connexion à la base de données PostgreSQL avec les variables d’environnement. |
| `src/jwt.ts` | Gère la génération et la vérification des tokens JWT. |
| `src/utils.ts` | Regroupe des fonctions utilitaires réutilisées dans plusieurs parties du projet. |
| `test/` | Contient les fichiers de tests du projet. |
| `uploads/` | Stocke les fichiers envoyés par les utilisateurs via l’API. |
| `server.ts` | Lance le serveur HTTP, initialise Express et Socket.IO. |
| `socket.ts` | Configure les événements Socket.IO pour la communication en temps réel. |


## Routes API


### Authentification

| Méthode | Route          | Auth | Description                                                                             |
| ------- | -------------- | ---- | --------------------------------------------------------------------------------------- |
| `POST`  | `/auth/login/` | Non  | Connecte un utilisateur avec son email et son mot de passe, puis retourne un token JWT. |

---

### Fichiers / Upload

| Méthode  | Route                 | Auth | Description                                          |
| -------- | --------------------- | ---- | ---------------------------------------------------- |
| `POST`   | `/upload`             | Oui  | Upload un fichier avec le champ `file`.              |
| `GET`    | `/upload?id=<fileId>` | Non  | Récupère les informations d’un fichier.              |
| `DELETE` | `/upload/delete`      | Non  | Supprime un fichier à partir de son `id`.            |
| `GET`    | `/image/:name`        | Non  | Affiche une image stockée dans le dossier `uploads`. |

---

### Challenges

| Méthode  | Route                      | Auth | Description                                                              |
| -------- | -------------------------- | ---- | ------------------------------------------------------------------------ |
| `POST`   | `/challenges/create/`      | Oui  | Crée un challenge dans un groupe.                                        |
| `GET`    | `/challenges/`             | Oui  | Récupère la liste des challenges. Peut être filtré avec `?groupId=<id>`. |
| `POST`   | `/challenges/join/`        | Oui  | Permet à l’utilisateur connecté de rejoindre un challenge.               |
| `DELETE` | `/challenges/leave/`       | Oui  | Permet à l’utilisateur connecté de quitter un challenge.                 |
| `DELETE` | `/challenges/cancel/`      | Non  | Annule un challenge.                                                     |
| `POST`   | `/challenges/complete`     | Oui  | Marque un challenge comme complété pour l’utilisateur connecté.          |
| `POST`   | `/challenges/:id/upload`   | Oui  | Upload une preuve pour un challenge.                                     |
| `GET`    | `/challenges/user/:userId` | Oui  | Récupère les challenges d’un utilisateur.                                |

---

### Groupes

| Méthode | Route                  | Auth | Description                                                      |
| ------- | ---------------------- | ---- | ---------------------------------------------------------------- |
| `POST`  | `/groups/create/`      | Oui  | Crée un nouveau groupe.                                          |
| `GET`   | `/me/groups`           | Oui  | Récupère les groupes de l’utilisateur connecté.                  |
| `POST`  | `/groups/send`         | Oui  | Envoie une invitation à un utilisateur pour rejoindre un groupe. |
| `POST`  | `/groups/accept`       | Oui  | Accepte une invitation de groupe.                                |
| `POST`  | `/groups/deny`         | Oui  | Refuse une invitation de groupe.                                 |
| `GET`   | `/me/groups_request`   | Oui  | Récupère les invitations de groupe en attente.                   |
| `GET`   | `/groups?id=<groupId>` | Oui  | Récupère les informations d’un groupe.                           |

---

### Messages de groupe

| Méthode | Route                       | Auth | Description                        |
| ------- | --------------------------- | ---- | ---------------------------------- |
| `GET`   | `/groups/:groupId/messages` | Oui  | Récupère les messages d’un groupe. |
| `POST`  | `/groups/:groupId/messages` | Oui  | Envoie un message dans un groupe.  |

---

### Amis

| Méthode  | Route                 | Auth | Description                                           |
| -------- | --------------------- | ---- | ----------------------------------------------------- |
| `POST`   | `/friends/send`       | Oui  | Envoie une demande d’ami à un utilisateur.            |
| `POST`   | `/friends/accept`     | Oui  | Accepte une demande d’ami.                            |
| `GET`    | `/me/friends`         | Oui  | Récupère la liste des amis de l’utilisateur connecté. |
| `GET`    | `/me/incoming_friend` | Oui  | Récupère les demandes d’amis reçues.                  |
| `GET`    | `/me/pending_friend`  | Oui  | Récupère les demandes d’amis envoyées en attente.     |
| `DELETE` | `/friends/delete`     | Oui  | Supprime un ami.                                      |
| `DELETE` | `/friends/deny`       | Oui  | Refuse une demande d’ami.                             |

---
# Git
## Regles
```text
-pas de suppressions de la branche main
-PR obligatoire pour merge sur main
-Pas de push sur main
-Pas possible de forcer 
```
