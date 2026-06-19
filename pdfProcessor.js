/*==================================================
            INSPECTEURBOT IA
            pdfProcessor.js
                Partie 1
==================================================*/

const PDFProcessor = {

    version: "1.0.0",

    chunkSize: 500,

    overlap: 100,

    documents: [],

    pages: []

};


/*==========================================
        INITIALISATION
==========================================*/

function initialiserPDFProcessor(config = {}){

    if(config.chunkSize){

        PDFProcessor.chunkSize = config.chunkSize;

    }

    if(config.overlap){

        PDFProcessor.overlap = config.overlap;

    }

}


/*==========================================
        EXTRAIRE TEXTE PDF
==========================================*/

async function extraireTextePDF(pdf){

    const pages = [];

    const nombrePages = pdf.numPages;

    for(let pageNumero = 1; pageNumero <= nombrePages; pageNumero++){

        const page = await pdf.getPage(pageNumero);

        const contenu = await page.getTextContent();

        const texte = contenu.items

            .map(item => item.str)

            .join(" ");

        pages.push({

            numero: pageNumero,

            texte

        });

    }

    PDFProcessor.pages = pages;

    return pages;

}


/*==========================================
        NETTOYER LE TEXTE
==========================================*/

function nettoyerTextePDF(texte){

    return texte

        .replace(/\r/g," ")

        .replace(/\n/g," ")

        .replace(/\s+/g," ")

        .trim();

}


/*==========================================
        DÉCOUPER EN CHUNKS
==========================================*/

function decouperTexte(texte, taille = PDFProcessor.chunkSize){

    texte = nettoyerTextePDF(texte);

    const morceaux = [];

    let position = 0;

    while(position < texte.length){

        morceaux.push(

            texte.substring(

                position,

                position + taille

            )

        );

        position += taille - PDFProcessor.overlap;

    }

    return morceaux;

}


/*==========================================
        DÉCOUPER UNE PAGE
==========================================*/

function decouperPage(page){

    const morceaux = decouperTexte(

        page.texte

    );

    return morceaux.map(function(texte,index){

        return {

            id: page.numero + "_" + index,

            page: page.numero,

            texte

        };

    });

}


/*==================================================
            INSPECTEURBOT IA
            pdfProcessor.js
                Partie 2
==================================================*/

/*==========================================
        TRAITER TOUTES LES PAGES
==========================================*/

async function traiterPages(pages){

    const chunks = [];

    for(const page of pages){

        const morceaux = decouperPage(page);

        chunks.push(...morceaux);

    }

    return chunks;

}


/*==========================================
        GÉNÉRER LES EMBEDDINGS
==========================================*/

async function genererEmbeddingsChunks(chunks){

    const resultat = [];

    for(const chunk of chunks){

        const embedding = await EmbeddingManager.creerEmbedding(

            chunk.texte

        );

        resultat.push({

            ...chunk,

            embedding

        });

    }

    return resultat;

}


/*==========================================
        ENREGISTRER DANS LA BASE
==========================================*/

async function enregistrerChunks(chunks){

    for(const chunk of chunks){

        await DatabaseManager.ajouterDocument({

            id: chunk.id,

            page: chunk.page,

            texte: chunk.texte,

            embedding: chunk.embedding

        });

    }

}


/*==========================================
        INDEXATION COMPLÈTE
==========================================*/

async function indexerPDF(pdf){

    const pages = await extraireTextePDF(pdf);

    const chunks = await traiterPages(pages);

    const index = await genererEmbeddingsChunks(

        chunks

    );

    await enregistrerChunks(index);

    PDFProcessor.documents = index;

    return index;

}


/*==========================================
        CHARGER UN PDF
==========================================*/

async function chargerPDF(pdf){

    return await indexerPDF(

        pdf

    );

}


/*==================================================
            INSPECTEURBOT IA
            pdfProcessor.js
                Partie 3
==================================================*/

/*==========================================
        SUPPRIMER L'INDEX
==========================================*/

async function supprimerIndexPDF(){

    PDFProcessor.documents = [];

    PDFProcessor.pages = [];

    if(typeof DatabaseManager !== "undefined" &&
       typeof DatabaseManager.viderDocuments === "function"){

        await DatabaseManager.viderDocuments();

    }

}


/*==========================================
        RECONSTRUIRE L'INDEX
==========================================*/

async function reconstruireIndexPDF(pdf){

    await supprimerIndexPDF();

    return await indexerPDF(pdf);

}


/*==========================================
        STATISTIQUES
==========================================*/

function obtenirStatistiquesPDF(){

    const caracteres = PDFProcessor.pages.reduce(function(total,page){

        return total + page.texte.length;

    },0);

    return {

        version: PDFProcessor.version,

        pages: PDFProcessor.pages.length,

        chunks: PDFProcessor.documents.length,

        caracteres,

        chunkSize: PDFProcessor.chunkSize,

        overlap: PDFProcessor.overlap

    };

}


/*==========================================
        EXPORTER L'INDEX
==========================================*/

function exporterIndexPDF(){

    return JSON.stringify(

        PDFProcessor.documents

    );

}


/*==========================================
        IMPORTER L'INDEX
==========================================*/

function importerIndexPDF(json){

    try{

        PDFProcessor.documents = JSON.parse(json);

        return PDFProcessor.documents;

    }

    catch(erreur){

        console.error(

            "Erreur import index PDF :",

            erreur

        );

        return [];

    }

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.PDFProcessor = {

    initialiserPDFProcessor,

    extraireTextePDF,

    nettoyerTextePDF,

    decouperTexte,

    decouperPage,

    traiterPages,

    genererEmbeddingsChunks,

    enregistrerChunks,

    indexerPDF,

    chargerPDF,

    supprimerIndexPDF,

    reconstruireIndexPDF,

    obtenirStatistiquesPDF,

    exporterIndexPDF,

    importerIndexPDF

};

console.log("PDFProcessor chargé.");
