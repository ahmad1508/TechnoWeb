# Messecure

<img src="./front-end/src/icons/logo-cropped.svg">

## Authors
- [ahmad1508](https://github.com/ahmad1508) aka Ahmad Sonji
- [MrStaf](https://github.com/MrStaf) aka Benoît Fage

# Stack
- Front-end
  - ReactJS
- Back-end
  - ExpressJS
  - LevelDB
- Oauth
  - Dex
# Installation
There is two modes of installations in your computer.   
## New school
### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/install/) >= v3.9
### Commands
run 
```bash
docker-compose up -d
```
And voilà, your front-end is available on port `3000`.
## Old school
### Prerequisites
- [NodeJS](https://nodejs.org/en/) >= v12
- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/install/) >= v3.9
### Commands
run (for `dex`)
```bash
docker-compose up -d
```
then
```bash
cd front-end && npm run start
```
open a `new terminal` and run
```bash
cd ../back-end && npm run start
```
And voilà, your front-end is available on port `3000`.
# Features
You can
- Users
  - Invite, remove, accept, decline friends/friend invitations
  - Change your avatar with fancy home made avatars ![avatar example](../assets/pp/Profilpic_mexican.png)
  - Use gravatar avatars
  - Change your username
  - Have private chatroom with a friend
- Channels
  - Create channels
  - Invite/remove people in your channel
  - Delete channel
  - View channel participants
- Messages
  - Send messages in channels
  - Send images (up to 70ko), gif and emoji ![gif example](https://media3.giphy.com/media/ue1GO5swPdORq/giphy.gif?cid=e1bb72ffyem6dfhan0yp6hb90aneavx4mv09wiwqwm82svml&rid=giphy.gif&ct=g)
  - Use markdown and html in your messages.
  - Write multi-line messages using `shift + enter` and send your messages using `enter`
  - Delete / Update your messages (using `right click` on a message)
- Settings (Click on your `username`)
  - Change primary theme color
  - Switch to light and dark mode
  - Log out