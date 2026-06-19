/*==================================================
            INSPECTEURBOT IA
                config.js
                 Partie 1
==================================================*/

/*
--------------------------------------------------
Configuration générale
--------------------------------------------------
*/

const AppConfig = {

    nomApplication: "InspecteurBot IA",

    version: "1.0.0",

    langue: "fr",

    theme: "clair"

};


/*
--------------------------------------------------
Configuration IA
--------------------------------------------------
*/

AppConfig.ai = {

    provider: "openai",

    model: "gpt-4.1-mini",

    apiKey: "",

    temperature: 0.2,

    maxTokens: 1000

};


/*
--------------------------------------------------
Configuration Recherche
--------------------------------------------------
*/

AppConfig.recherche = {

    maxResultats: 10,

    contexteIA: 5,

    activerSynonymes: true,

    activerCache: true

};


/*
--------------------------------------------------
Configuration PDF
--------------------------------------------------
*/

AppConfig.pdf = {

    tailleMaximum: 50,

    lectureAutomatique: true,

    indexationAutomatique: true

};


/*
--------------------------------------------------
Configuration Base documentaire
--------------------------------------------------
*/

AppConfig.database = {

    sauvegardeAutomatique: true,

    utiliserLocalStorage: true,

    indexationComplete: true

};


/*==================================================
                CONFIG.JS
                 Partie 2
==================================================*/

/*==========================================
        CONFIGURATION INTERFACE
==========================================*/

AppConfig.interface = {

    animation: true,

    notifications: true,

    confirmationSuppression: true,

    affichageArticles: 20,

    modeCompact: false

};


/*==========================================
        CONFIGURATION HISTORIQUE
==========================================*/

AppConfig.historique = {

    activer: true,

    maximumConversations: 100,

    sauvegardeAutomatique: true

};


/*==========================================
        CONFIGURATION SÉCURITÉ
==========================================*/

AppConfig.securite = {

    masquerCleAPI: true,

    verifierPDF: true,

    tailleMaximumUpload: 100,

    journalErreurs: true

};


/*==========================================
        CONFIGURATION JOURNAUX
==========================================*/

AppConfig.logs = {

    debug: false,

    afficherConsole: true,

    enregistrerErreurs: true

};


/*==========================================
        OBTENIR UNE CONFIGURATION
==========================================*/

function obtenirConfiguration(cle){

    return AppConfig[cle];

}


/*==========================================
        MODIFIER UNE CONFIGURATION
==========================================*/

function modifierConfiguration(cle, valeur){

    AppConfig[cle] = valeur;

}


/*==========================================
        SAUVEGARDER LA CONFIGURATION
==========================================*/

function sauvegarderConfiguration(){

    localStorage.setItem(

        "inspecteurbot_config",

        JSON.stringify(AppConfig)

    );

}


/*==========================================
        CHARGER LA CONFIGURATION
==========================================*/

function chargerConfiguration(){

    const config = localStorage.getItem(

        "inspecteurbot_config"

    );

    if(config){

        Object.assign(

            AppConfig,

            JSON.parse(config)

        );

    }

}


/*==================================================
                CONFIG.JS
                 Partie 3
==================================================*/

/*==========================================
        RÉINITIALISER LA CONFIGURATION
==========================================*/

function reinitialiserConfiguration(){

    localStorage.removeItem("inspecteurbot_config");

    location.reload();

}


/*==========================================
        VÉRIFIER LA CONFIGURATION
==========================================*/

function verifierConfiguration(){

    const erreurs = [];

    if(!AppConfig.ai.provider){
        erreurs.push("Fournisseur IA non défini.");
    }

    if(!AppConfig.ai.model){
        erreurs.push("Modèle IA non défini.");
    }

    if(AppConfig.ai.temperature < 0 ||
       AppConfig.ai.temperature > 2){

        erreurs.push("Température IA invalide.");

    }

    if(AppConfig.ai.maxTokens <= 0){

        erreurs.push("Nombre maximum de tokens invalide.");

    }

    if(AppConfig.pdf.tailleMaximum <= 0){

        erreurs.push("Taille maximale PDF invalide.");

    }

    return {

        valide: erreurs.length === 0,

        erreurs

    };

}


/*==========================================
        INFORMATIONS CONFIGURATION
==========================================*/

function informationsConfiguration(){

    return {

        application: AppConfig.nomApplication,

        version: AppConfig.version,

        langue: AppConfig.langue,

        theme: AppConfig.theme,

        providerIA: AppConfig.ai.provider,

        modeleIA: AppConfig.ai.model

    };

}


/*==========================================
        INITIALISATION
==========================================*/

chargerConfiguration();

const verification = verifierConfiguration();

if(!verification.valide){

    console.warn(
        "Configuration invalide :",
        verification.erreurs
    );

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.ConfigManager = {

    config: AppConfig,

    obtenirConfiguration,

    modifierConfiguration,

    sauvegarderConfiguration,

    chargerConfiguration,

    reinitialiserConfiguration,

    verifierConfiguration,

    informationsConfiguration

};

console.log(
    "ConfigManager chargé."
);
