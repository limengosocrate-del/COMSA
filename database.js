/*==================================================
            INSPECTEURBOT IA
              database.js
               Partie 1
==================================================*/

/*
----------------------------------------------------
Gestion de la base documentaire
----------------------------------------------------
*/

const DatabaseManager = {

    documents: [],

    index: new Map(),

    version: "1.0.0"

};


/*==========================================
        AJOUTER UN DOCUMENT
==========================================*/

function ajouterDocument(document){

    DatabaseManager.documents.push(document);

}


/*==========================================
        OBTENIR TOUS LES DOCUMENTS
==========================================*/

function obtenirDocuments(){

    return DatabaseManager.documents;

}


/*==========================================
        SUPPRIMER UN DOCUMENT
==========================================*/

function supprimerDocument(id){

    DatabaseManager.documents =
        DatabaseManager.documents.filter(doc => doc.id !== id);

}


/*==========================================
        RECHERCHER UN DOCUMENT
==========================================*/

function documentParId(id){

    return DatabaseManager.documents.find(doc => doc.id === id);

}


/*==========================================
        COMPTER LES DOCUMENTS
==========================================*/

function nombreDocuments(){

    return DatabaseManager.documents.length;

}


/*==========================================
        VIDER LA BASE
==========================================*/

function viderBase(){

    DatabaseManager.documents = [];

    DatabaseManager.index.clear();

}


/*==================================================
              DATABASE.JS
                Partie 2
==================================================*/

/*==========================================
        INDEXER UN DOCUMENT
==========================================*/

function indexerDocument(document){

    if(!document || !document.texte){
        return;
    }

    const mots = document.texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^\w\s]/g," ")
        .split(/\s+/);

    mots.forEach(function(mot){

        if(mot.length < 3){
            return;
        }

        if(!DatabaseManager.index.has(mot)){
            DatabaseManager.index.set(mot, []);
        }

        DatabaseManager.index.get(mot).push(document);

    });

}


/*==========================================
        INDEXER TOUS LES DOCUMENTS
==========================================*/

function reconstruireIndex(){

    DatabaseManager.index.clear();

    DatabaseManager.documents.forEach(function(document){

        indexerDocument(document);

    });

}


/*==========================================
        RECHERCHE DANS L'INDEX
==========================================*/

function rechercherIndex(mot){

    mot = mot
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

    return DatabaseManager.index.get(mot) || [];

}


/*==========================================
        RECHERCHE MULTI-MOTS
==========================================*/

function rechercherDocuments(requete){

    const mots = requete
        .toLowerCase()
        .split(/\s+/);

    let resultat = [];

    mots.forEach(function(mot){

        resultat = resultat.concat(

            rechercherIndex(mot)

        );

    });

    return [...new Set(resultat)];

}


/*==================================================
              DATABASE.JS
                Partie 3
==================================================*/

/*==========================================
        SAUVEGARDE LOCALSTORAGE
==========================================*/

function sauvegarderBase(){

    const donnees = JSON.stringify(DatabaseManager.documents);

    localStorage.setItem(
        "inspecteurbot_database",
        donnees
    );

}


/*==========================================
        CHARGER LA BASE
==========================================*/

function chargerBase(){

    const donnees = localStorage.getItem(
        "inspecteurbot_database"
    );

    if(!donnees){
        return;
    }

    DatabaseManager.documents = JSON.parse(donnees);

    reconstruireIndex();

}


/*==========================================
        DOCUMENTS PAR CATÉGORIE
==========================================*/

function documentsCategorie(categorie){

    return DatabaseManager.documents.filter(function(doc){

        return doc.categorie === categorie;

    });

}


/*==========================================
        STATISTIQUES
==========================================*/

function statistiques(){

    return {

        documents: DatabaseManager.documents.length,

        motsIndexes: DatabaseManager.index.size,

        version: DatabaseManager.version

    };

}


/*==========================================
        IMPORTER UNE LISTE
==========================================*/

function importerDocuments(liste){

    liste.forEach(function(doc){

        ajouterDocument(doc);

    });

    reconstruireIndex();

}


/*==========================================
        EXPORTER LA BASE
==========================================*/

function exporterBase(){

    return JSON.stringify(

        DatabaseManager.documents,

        null,

        2

    );

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.DatabaseManager = {

    ajouterDocument,

    obtenirDocuments,

    supprimerDocument,

    documentParId,

    nombreDocuments,

    viderBase,

    indexerDocument,

    reconstruireIndex,

    rechercherDocuments,

    rechercherIndex,

    sauvegarderBase,

    chargerBase,

    documentsCategorie,

    statistiques,

    importerDocuments,

    exporterBase

};

console.log("DatabaseManager chargé.");
