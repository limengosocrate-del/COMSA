/*==================================================
                INSPECTEURBOT IA
                    ai.js
                   Partie 1
==================================================*/

/*
---------------------------------------
Configuration IA
---------------------------------------
*/

const AIConfig = {

    provider: "openai",

    apiKey: "",

    model: "gpt-4.1-mini",

    temperature: 0.2,

    maxTokens: 1000

};


/*
---------------------------------------
Construire le prompt
---------------------------------------
*/

function construirePrompt(question, contexte){

    return `

Tu es InspecteurBot IA.

Tu réponds uniquement avec les informations
présentes dans le Code du Travail fourni.

Si la réponse n'existe pas dans le contexte,
réponds exactement :

"Je n'ai trouvé aucun article correspondant dans le Code du Travail."

Ne jamais inventer une réponse.

Toujours citer les articles.

====================================

Contexte :

${contexte}

====================================

Question :

${question}

====================================

Réponse :

`;

}


/*
---------------------------------------
Préparer une requête IA
---------------------------------------
*/

async function preparerQuestion(question){

    const contexte = SearchManager.creerContexte(question);

    return {

        question,

        contexte,

        prompt: construirePrompt(question, contexte)

    };

}


/*==================================================
                AI.JS
                 Partie 2
==================================================*/

/*==========================================
        APPEL À L'API OPENAI
==========================================*/

async function envoyerQuestion(question){

    const data = await preparerQuestion(question);

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + AIConfig.apiKey
            },
            body: JSON.stringify({

                model: AIConfig.model,

                temperature: AIConfig.temperature,

                max_tokens: AIConfig.maxTokens,

                messages: [

                    {
                        role: "system",
                        content:
                        "Tu es InspecteurBot IA. Réponds uniquement à partir du contexte fourni."
                    },

                    {
                        role: "user",
                        content: data.prompt
                    }

                ]

            })

        }
    );

    if(!response.ok){

        throw new Error(
            "Erreur API : " + response.status
        );

    }

    const json = await response.json();

    return json.choices[0].message.content;

}


/*==========================================
        POSER UNE QUESTION
==========================================*/

async function demanderIA(question){

    try{

        const reponse = await envoyerQuestion(question);

        return {

            succes:true,

            question,

            reponse

        };

    }

    catch(erreur){

        return{

            succes:false,

            erreur:erreur.message

        };

    }

}


/*==========================================
        TEST DE CONNEXION
==========================================*/

async function testerConnexion(){

    try{

        const resultat = await demanderIA("Bonjour");

        return resultat.succes;

    }

    catch(e){

        return false;

    }

  }


/*==================================================
                AI.JS
                 Partie 3
==================================================*/

/*==========================================
        HISTORIQUE DES CONVERSATIONS
==========================================*/

const conversations = [];


/*==========================================
        AJOUTER UNE CONVERSATION
==========================================*/

function ajouterConversation(question, reponse){

    conversations.push({

        date: new Date(),

        question,

        reponse

    });

}


/*==========================================
        OBTENIR L'HISTORIQUE
==========================================*/

function obtenirConversations(){

    return conversations;

}


/*==========================================
        CHANGER DE MODÈLE IA
==========================================*/

function definirModele(modele){

    AIConfig.model = modele;

}


/*==========================================
        CHANGER LE FOURNISSEUR IA
==========================================*/

function definirProvider(provider){

    AIConfig.provider = provider;

}


/*==========================================
        CHANGER LA CLÉ API
==========================================*/

function definirCleAPI(cle){

    AIConfig.apiKey = cle;

}


/*==========================================
        EXPORTER LES CONVERSATIONS
==========================================*/

function exporterConversations(){

    return JSON.stringify(conversations, null, 2);

}


/*==========================================
        QUESTION AVEC SAUVEGARDE
==========================================*/

async function discuter(question){

    const resultat = await demanderIA(question);

    if(resultat.succes){

        ajouterConversation(

            question,

            resultat.reponse

        );

    }

    return resultat;

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.AIManager = {

    discuter,

    demanderIA,

    testerConnexion,

    definirCleAPI,

    definirModele,

    definirProvider,

    obtenirConversations,

    exporterConversations,

    preparerQuestion

};

console.log("InspecteurBot IA chargé.");
