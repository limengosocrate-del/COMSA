/*==================================================
            INSPECTEURBOT IA
            vectorSearch.js
                Partie 1
==================================================*/

/*
--------------------------------------------------
Base de données vectorielle
--------------------------------------------------
*/

const VectorSearch = {

    documents: [],

    embeddings: [],

    version: "1.0.0"

};


/*==========================================
        AJOUTER UN DOCUMENT
==========================================*/

function ajouterDocumentVectoriel(document){

    if(!document){

        return;

    }

    VectorSearch.documents.push(document);

}


/*==========================================
        AJOUTER UN EMBEDDING
==========================================*/

function ajouterEmbedding(id, vecteur){

    VectorSearch.embeddings.push({

        id,

        vecteur

    });

}


/*==========================================
        OBTENIR LES EMBEDDINGS
==========================================*/

function obtenirEmbeddings(){

    return VectorSearch.embeddings;

}


/*==========================================
        VIDER LA BASE VECTORIELLE
==========================================*/

function viderVecteurs(){

    VectorSearch.documents = [];

    VectorSearch.embeddings = [];

}


/*==========================================
        NORMALISATION
==========================================*/

function normaliserTexte(texte){

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^\w\s]/g," ")
        .replace(/\s+/g," ")
        .trim();

}


/*==========================================
        DÉCOUPAGE EN SEGMENTS
==========================================*/

function decouperTexte(texte, taille = 500){

    const morceaux = [];

    for(let i = 0; i < texte.length; i += taille){

        morceaux.push(

            texte.substring(i, i + taille)

        );

    }

    return morceaux;

}


/*==================================================
            VECTORSEARCH.JS
                Partie 2
==================================================*/

/*==========================================
        PRODUIT SCALAIRE
==========================================*/

function produitScalaire(v1, v2){

    let resultat = 0;

    const longueur = Math.min(v1.length, v2.length);

    for(let i = 0; i < longueur; i++){

        resultat += v1[i] * v2[i];

    }

    return resultat;

}


/*==========================================
        NORME D'UN VECTEUR
==========================================*/

function normeVecteur(vecteur){

    let somme = 0;

    vecteur.forEach(function(valeur){

        somme += valeur * valeur;

    });

    return Math.sqrt(somme);

}


/*==========================================
        SIMILARITÉ COSINUS
==========================================*/

function calculerSimilarite(v1, v2){

    const norme1 = normeVecteur(v1);
    const norme2 = normeVecteur(v2);

    if(norme1 === 0 || norme2 === 0){

        return 0;

    }

    return produitScalaire(v1, v2) / (norme1 * norme2);

}


/*==========================================
        RECHERCHE VECTORIELLE
==========================================*/

function rechercheVectorielle(vecteurQuestion, limite = 5){

    const resultats = [];

    VectorSearch.embeddings.forEach(function(item){

        resultats.push({

            id: item.id,

            score: calculerSimilarite(

                vecteurQuestion,

                item.vecteur

            )

        });

    });

    resultats.sort(function(a,b){

        return b.score - a.score;

    });

    return resultats.slice(0, limite);

}


/*==========================================
        DOCUMENTS LES PLUS PROCHES
==========================================*/

function documentsSimilaires(vecteurQuestion){

    const proches = rechercheVectorielle(vecteurQuestion);

    return proches.map(function(resultat){

        return VectorSearch.documents.find(function(doc){

            return doc.id === resultat.id;

        });

    }).filter(Boolean);

}


/*==========================================
        STATISTIQUES
==========================================*/

function statistiquesVecteurs(){

    return {

        documents: VectorSearch.documents.length,

        embeddings: VectorSearch.embeddings.length,

        version: VectorSearch.version

    };

}


/*==================================================
            VECTORSEARCH.JS
                Partie 3
==================================================*/

/*==========================================
        SAUVEGARDE
==========================================*/

function sauvegarderVecteurs(){

    localStorage.setItem(

        "inspecteurbot_vectors",

        JSON.stringify({

            documents: VectorSearch.documents,

            embeddings: VectorSearch.embeddings

        })

    );

}


/*==========================================
        CHARGEMENT
==========================================*/

function chargerVecteurs(){

    const donnees = localStorage.getItem(

        "inspecteurbot_vectors"

    );

    if(!donnees){

        return;

    }

    const base = JSON.parse(donnees);

    VectorSearch.documents = base.documents || [];

    VectorSearch.embeddings = base.embeddings || [];

}


/*==========================================
        INDEXER UN DOCUMENT
==========================================*/

async function indexerDocumentVectoriel(document){

    if(!document || !document.texte){

        return;

    }

    const morceaux = decouperTexte(

        normaliserTexte(document.texte),

        500

    );

    for(let i = 0; i < morceaux.length; i++){

        const embedding = await AIManager.creerEmbedding(

            morceaux[i]

        );

        ajouterEmbedding(

            document.id + "_" + i,

            embedding

        );

        ajouterDocumentVectoriel({

            id: document.id + "_" + i,

            titre: document.titre,

            page: document.page || 1,

            texte: morceaux[i]

        });

    }

}


/*==========================================
        INDEXATION COMPLETE
==========================================*/

async function indexerTousDocuments(documents){

    viderVecteurs();

    for(const document of documents){

        await indexerDocumentVectoriel(document);

    }

    sauvegarderVecteurs();

}


/*==========================================
        RECHERCHE IA
==========================================*/

async function rechercherContexte(question){

    const embeddingQuestion = await AIManager.creerEmbedding(

        question

    );

    return documentsSimilaires(

        embeddingQuestion

    );

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.VectorSearchManager = {

    ajouterDocumentVectoriel,

    ajouterEmbedding,

    obtenirEmbeddings,

    viderVecteurs,

    normaliserTexte,

    decouperTexte,

    calculerSimilarite,

    rechercheVectorielle,

    documentsSimilaires,

    statistiquesVecteurs,

    sauvegarderVecteurs,

    chargerVecteurs,

    indexerDocumentVectoriel,

    indexerTousDocuments,

    rechercherContexte

};

console.log("VectorSearchManager chargé.");
