/*==================================================
            INSPECTEURBOT IA
            chatManager.js
                Partie 1
==================================================*/

const ChatManager = {

    version: "1.0.0",

    historique: [],

    contexte: [],

    maxHistorique: 20,

    initialise: false

};


/*==========================================
        INITIALISATION
==========================================*/

async function initialiserChat(){

    ChatManager.historique = [];

    ChatManager.contexte = [];

    ChatManager.initialise = true;

    console.log("ChatManager initialisé.");

}


/*==========================================
        AJOUTER MESSAGE
==========================================*/

function ajouterMessage(role, contenu){

    ChatManager.historique.push({

        role,

        contenu,

        date: new Date().toISOString()

    });

    if(ChatManager.historique.length >

        ChatManager.maxHistorique){

        ChatManager.historique.shift();

    }

}


/*==========================================
        HISTORIQUE
==========================================*/

function obtenirHistorique(){

    return [

        ...ChatManager.historique

    ];

}


/*==========================================
        EFFACER HISTORIQUE
==========================================*/

function viderHistorique(){

    ChatManager.historique = [];

}


/*==========================================
        CONTEXTE RAG
==========================================*/

async function recupererContexte(question){

    const resultat = await RAGManager.rechercher(

        question

    );

    ChatManager.contexte = resultat;

    return resultat;

}


/*==================================================
            INSPECTEURBOT IA
            chatManager.js
                Partie 2
==================================================*/

/*==========================================
        ENVOYER UNE QUESTION À L'IA
==========================================*/

async function envoyerQuestionIA(question){

    if(!ChatManager.initialise){

        await initialiserChat();

    }

    ajouterMessage("user", question);

    const contexte = await recupererContexte(question);

    const prompt = construirePrompt(question, contexte);

    const reponse = await AIManager.genererReponseRAG(prompt);

    ajouterMessage("assistant", reponse.reponse || reponse);

    return reponse;

}


/*==========================================
        CONSTRUIRE LE PROMPT
==========================================*/

function construirePrompt(question, contexte){

    let texteContexte = "";

    contexte.forEach(function(doc, index){

        texteContexte += `

[Document ${index + 1}]
${doc.texte}

`;

    });

    return `

Tu es InspecteurBot IA, assistant juridique du ministère du travail.

Tu dois répondre uniquement à partir du contexte fourni.

Si l'information n'existe pas dans le contexte, dis-le clairement.

=====================
CONTEXTE
=====================

${texteContexte}

=====================
QUESTION
=====================

${question}

=====================
RÉPONSE
=====================

`;

}


/*==========================================
        RÉPONSE SIMPLE
==========================================*/

async function poserQuestion(question){

    try{

        const reponse = await envoyerQuestionIA(question);

        return {

            succes: true,

            question,

            reponse

        };

    }

    catch(erreur){

        return {

            succes: false,

            erreur: erreur.message

        };

    }

}


/*==================================================
            INSPECTEURBOT IA
            chatManager.js
                Partie 3
==================================================*/

/*==========================================
        SAUVEGARDE DE SESSION
==========================================*/

function sauvegarderSession(){

    localStorage.setItem(

        "inspecteurbot_historique",

        JSON.stringify(ChatManager.historique)

    );

}


/*==========================================
        RESTAURER SESSION
==========================================*/

function restaurerSession(){

    const historique = localStorage.getItem(

        "inspecteurbot_historique"

    );

    if(historique){

        ChatManager.historique = JSON.parse(

            historique

        );

    }

}


/*==========================================
        EXPORTER CONVERSATION
==========================================*/

function exporterConversation(){

    return JSON.stringify({

        version: ChatManager.version,

        date: new Date().toISOString(),

        historique: ChatManager.historique

    });

}


/*==========================================
        IMPORTER CONVERSATION
==========================================*/

function importerConversation(json){

    try{

        const conversation = JSON.parse(json);

        ChatManager.historique =

            conversation.historique || [];

        return true;

    }

    catch(erreur){

        console.error(

            "Erreur import conversation :",

            erreur

        );

        return false;

    }

}


/*==========================================
        STREAMING (SIMULATION)
==========================================*/

async function envoyerQuestionStreaming(

    question,

    callback

){

    const resultat = await envoyerQuestionIA(

        question

    );

    const texte =

        resultat.reponse || resultat;

    let buffer = "";

    for(const caractere of texte){

        buffer += caractere;

        callback(buffer);

        await new Promise(resolve=>setTimeout(resolve,10));

    }

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.ChatManager = {

    initialiserChat,

    ajouterMessage,

    obtenirHistorique,

    viderHistorique,

    recupererContexte,

    construirePrompt,

    envoyerQuestionIA,

    poserQuestion,

    sauvegarderSession,

    restaurerSession,

    exporterConversation,

    importerConversation,

    envoyerQuestionStreaming

};

console.log("ChatManager chargé.");
