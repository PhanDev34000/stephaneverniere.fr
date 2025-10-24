# stephaneverniere.fr – Site portfolio de photographe

## Description

Site personnel développé pour présenter l’activité professionnelle de Stéphane Verniere, photographe à Montpellier.
Il regroupe les différentes prestations de photographe (reportage, événementiel, mariage, portraits...) et la location de photobooth.

## Fonctionnalités

Page d’accueil avec animation d’introduction

Page Photographe avec présentation des prestations et galeries photos

Page Photobooth avec présentation des prestations et galerie photo

Formulaire de contact

Connexion possible => accés au téléchargement de la galerie privée du client

Référencement optimisé (SEO)

## Technologies utilisées

Front-end : Angular

Back-end : Node.js / Express

Base de données : MongoDB Atlas

Stockage photos : Cloudinary

Hébergement :

OVH (front)

Koyeb (back)

## Installation locale
## Cloner le projet
git clone https://github.com/PhanDev34000/stephaneverniere.fr.git

## Installer les dépendances front
cd frontend
npm install

## Lancer le front Angular
ng serve

## Installer les dépendances back
cd ../backend
npm install

## Lancer le serveur Node
npm start

## Déploiement

Front-end : déployé sur OVH

Back-end : déployé sur Koyeb (connecté à MongoDB Atlas)

## Exécution avec Docker

Le projet peut être lancé dans un environnement conteneurisé grâce à Docker Compose.
Cela permet de démarrer automatiquement l’API Node.js et la base de données MongoDB.

Lancer le projet : docker compose up -d --build

Arrêter les conteneurs : docker compose down

Accès : API : http://localhost:3000/health

Base Mongo : port 27017

Cette configuration permet de tester le projet sans installation locale de Node.js ni MongoDB.

## Auteur : 

👤 Stéphane Verniere – Développeur & Photographe sur Montpellier
