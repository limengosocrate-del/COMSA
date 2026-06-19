/*==================================================
            INSPECTEURBOT IA
              embedding.js
                Partie 1
==================================================*/

/*
--------------------------------------------------
Gestionnaire des Embeddings
--------------------------------------------------
*/

const EmbeddingManager = {

    provider: "openai",

    model: "text-embedding-3-small",

    dimension: 1536,

    cache: new Map(),

    version: "1.0.0"

};


/*==========================================
        INITIALISATION
==========================================*/

function initialiserEmbedding(config = {}){

    if(config.provider){

        EmbeddingManager.provider = config.provider;

    }

    if(config.model){

        EmbeddingManager.model = config.model;

    }

    if(config.dimension){

        EmbeddingManager.dimension = config.dimension;

    }

}


/*==========================================
        NETTOYAGE TEXTE
==========================================*/

function nettoyerTexte(texte){

    return texte

        .replace(/\s+/g," ")

        .replace(/\n/g," ")

        .trim();

}


/*==========================================
        HASH SIMPLE
==========================================*/

function hashTexte(texte){

    let hash = 0;

    for(let i = 0; i < texte.length; i++){

        hash = ((hash << 5) - hash) + texte.charCodeAt(i);

        hash |= 0;

    }

    return hash.toString();

}


/*==========================================
        CACHE
==========================================*/

function obtenirDepuisCache(texte){

    return EmbeddingManager.cache.get(

        hashTexte(texte)

    );

}


function ajouterAuCache(texte, embedding){

    EmbeddingManager.cache.set(

        hashTexte(texte),

        embedding

    );

}


/*==========================================
        VIDER CACHE
==========================================*/

function viderCacheEmbeddings(){

    EmbeddingManager.cache.clear();

}


/*==================================================
            INSPECTEURBOT IA
              embedding.js
                Partie 2
==================================================*/

/*==========================================
        GÉNÉRER UN EMBEDDING
==========================================*/

async function creerEmbedding(texte){

    texte = nettoyerTexte(texte);

    const cache = obtenirDepuisCache(texte);

    if(cache){

        return cache;

    }

    try{

        const embedding = await AIManager.creerEmbedding(

            texte

        );

        ajouterAuCache(

            texte,

            embedding

        );

        return embedding;

    }

    catch(erreur){

        console.error(

            "Erreur embedding :",

            erreur

        );

        return [];

    }

}


/*==========================================
        EMBEDDINGS PAR LOT
==========================================*/

async function creerEmbeddingsBatch(textes){

    const embeddings = [];

    for(const texte of textes){

        const embedding = await creerEmbedding(

            texte

        );

        embeddings.push(embedding);

    }

    return embeddings;

}


/*==========================================
        INDEXATION DOCUMENT
==========================================*/

async function indexerDocument(document){

    if(!document){

        return [];

    }

    const morceaux = decouperTexte(

        nettoyerTexte(document.texte),

        500

    );

    const embeddings = await creerEmbeddingsBatch(

        morceaux

    );

    return morceaux.map(function(texte,index){

        return {

            id: document.id + "_" + index,

            titre: document.titre,

            page: document.page || 1,

            texte,

            embedding: embeddings[index]

        };

    });

}


/*==========================================
        INDEXATION MULTIPLE
==========================================*/

async function indexerDocuments(documents){

    const resultat = [];

    for(const document of documents){

        const index = await indexerDocument(

            document

        );

        resultat.push(...index);

    }

    return resultat;

}


/*==========================================
        REINDEXATION
==========================================*/

async function reconstruireIndex(documents){

    viderCacheEmbeddings();

    return await indexerDocuments(

        documents

    );

}


/*==================================================
            INSPECTEURBOT IA
              embedding.js
                Partie 3
==================================================*/

/*==========================================
        EXPORTER LES EMBEDDINGS
==========================================*/

function exporterEmbeddings(index){

    return JSON.stringify(index);

}


/*==========================================
        IMPORTER LES EMBEDDINGS
==========================================*/

function importerEmbeddings(json){

    try{

        return JSON.parse(json);

    }

    catch(erreur){

        console.error(

            "Erreur import embeddings :",

            erreur

        );

        return [];

    }

}


/*==========================================
        STATISTIQUES
==========================================*/

function statistiquesEmbeddings(){

    return {

        fournisseur: EmbeddingManager.provider,

        modele: EmbeddingManager.model,

        dimension: EmbeddingManager.dimension,

        cache: EmbeddingManager.cache.size,

        version: EmbeddingManager.version

    };

}


/*==========================================
        SAUVEGARDE INDEX
==========================================*/

function sauvegarderIndex(index){

    localStorage.setItem(

        "inspecteurbot_embeddings",

        exporterEmbeddings(index)

    );

}


/*==========================================
        CHARGER INDEX
==========================================*/

function chargerIndex(){

    const donnees = localStorage.getItem(

        "inspecteurbot_embeddings"

    );

    if(!donnees){

        return [];

    }

    return importerEmbeddings(donnees);

}


/*==========================================
        SUPPRIMER INDEX
==========================================*/

function supprimerIndex(){

    localStorage.removeItem(

        "inspecteurbot_embeddings"

    );

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.EmbeddingManager = {

    initialiserEmbedding,

    creerEmbedding,

    creerEmbeddingsBatch,

    indexerDocument,

    indexerDocuments,

    reconstruireIndex,

    exporterEmbeddings,

    importerEmbeddings,

    sauvegarderIndex,

    chargerIndex,

    supprimerIndex,

    statistiquesEmbeddings,

    viderCacheEmbeddings

};

console.log("EmbeddingManager chargé.");
