/*==================================================
            INSPECTEURBOT IA
                rag.js
                Partie 1
==================================================*/

/*
--------------------------------------------------
Gestionnaire RAG
--------------------------------------------------
*/

const RAGManager = {

    contexte: [],

    documents: [],

    scoreMinimum: 0.35,

    maxDocuments: 5,

    version: "1.0.0"

};


/*==========================================
        AJOUTER UN CONTEXTE
==========================================*/

function ajouterContexte(document){

    if(!document){

        return;

    }

    RAGManager.contexte.push(document);

}


/*==========================================
        VIDER LE CONTEXTE
==========================================*/

function viderContexte(){

    RAGManager.contexte = [];

}


/*==========================================
        OBTENIR LE CONTEXTE
==========================================*/

function obtenirContexte(){

    return RAGManager.contexte;

}


/*==========================================
        AJOUTER UN DOCUMENT
==========================================*/

function ajouterDocumentRAG(document){

    if(!document){

        return;

    }

    RAGManager.documents.push(document);

}


/*==========================================
        OBTENIR LES DOCUMENTS
==========================================*/

function obtenirDocumentsRAG(){

    return RAGManager.documents;

}


/*==========================================
        VIDER LES DOCUMENTS
==========================================*/

function viderDocumentsRAG(){

    RAGManager.documents = [];

}


/*==========================================
        INITIALISER LE RAG
==========================================*/

function initialiserRAG(){

    viderContexte();

    viderDocumentsRAG();

    console.log("RAG initialisé.");

}


/*==================================================
                RAG.JS
                Partie 2
==================================================*/

/*==========================================
        RECHERCHE PAR MOTS-CLÉS
==========================================*/

async function rechercherParMotsCles(question){

    if(typeof SearchManager === "undefined"){

        return [];

    }

    return SearchManager.rechercher(question);

}


/*==========================================
        RECHERCHE VECTORIELLE
==========================================*/

async function rechercherParVecteurs(question){

    if(typeof VectorSearchManager === "undefined"){

        return [];

    }

    return await VectorSearchManager.rechercherContexte(

        question

    );

}


/*==========================================
        SUPPRIMER LES DOUBLONS
==========================================*/

function supprimerDoublons(documents){

    const uniques = [];

    const ids = new Set();

    documents.forEach(function(document){

        if(!document){

            return;

        }

        if(ids.has(document.id)){

            return;

        }

        ids.add(document.id);

        uniques.push(document);

    });

    return uniques;

}


/*==========================================
        FUSIONNER LES RÉSULTATS
==========================================*/

async function fusionnerResultats(question){

    const classiques = await rechercherParMotsCles(

        question

    );

    const vectoriels = await rechercherParVecteurs(

        question

    );

    const resultat = [

        ...classiques,

        ...vectoriels

    ];

    return supprimerDoublons(resultat);

}


/*==========================================
        CLASSER PAR SCORE
==========================================*/

function classerResultats(resultats){

    resultats.sort(function(a,b){

        return (b.score || 0) - (a.score || 0);

    });

    return resultats;

}


/*==========================================
        LIMITER LES DOCUMENTS
==========================================*/

function limiterDocuments(resultats){

    return resultats.slice(

        0,

        RAGManager.maxDocuments

    );

}


/*==========================================
        RECHERCHE RAG
==========================================*/

async function rechercherDocuments(question){

    let documents = await fusionnerResultats(

        question

    );

    documents = classerResultats(documents);

    documents = limiterDocuments(documents);

    RAGManager.documents = documents;

    return documents;

}


/*==================================================
                RAG.JS
                Partie 3
==================================================*/

/*==========================================
        CONSTRUIRE LE CONTEXTE
==========================================*/

function construireContexte(documents){

    let contexte = "";

    documents.forEach(function(document, index){

        contexte +=
`Document ${index + 1}
Titre : ${document.titre || "Sans titre"}
Page : ${document.page || "-"}
----------------------------------------
${document.texte}

`;

    });

    return contexte;

}


/*==========================================
        CONSTRUIRE LE PROMPT
==========================================*/

function construirePrompt(question, contexte){

    return `Tu es InspecteurBot IA.

Tu réponds uniquement à partir des documents fournis.

Si une information n'est pas présente dans le contexte, indique-le clairement.

Réponds en français.

=========================
CONTEXTE
=========================

${contexte}

=========================
QUESTION
=========================

${question}

=========================
RÉPONSE
=========================
`;

}


/*==========================================
        GÉNÉRER UNE RÉPONSE
==========================================*/

async function genererReponseRAG(question){

    viderContexte();

    const documents = await rechercherDocuments(question);

    const contexte = construireContexte(documents);

    RAGManager.contexte = documents;

    const prompt = construirePrompt(

        question,

        contexte

    );

    const reponse = await AIManager.genererReponse(

        prompt

    );

    return {

        question,

        reponse,

        contexte: documents

    };

}


/*==========================================
        INFORMATIONS
==========================================*/

function informationsRAG(){

    return {

        documents: RAGManager.documents.length,

        contexte: RAGManager.contexte.length,

        scoreMinimum: RAGManager.scoreMinimum,

        maxDocuments: RAGManager.maxDocuments,

        version: RAGManager.version

    };

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.RAGManager = {

    initialiserRAG,

    ajouterContexte,

    viderContexte,

    obtenirContexte,

    ajouterDocumentRAG,

    obtenirDocumentsRAG,

    viderDocumentsRAG,

    rechercherDocuments,

    construireContexte,

    construirePrompt,

    genererReponseRAG,

    informationsRAG

};

console.log("RAGManager chargé.");
