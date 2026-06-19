/*==================================================
        INSPECTEURBOT IA
              PDF.JS
              Partie 1
==================================================*/


let pdfDocument=null;

let nombrePages=0;

let texteComplet="";

let pages=[];


/*==========================================
        CHARGEMENT DU PDF
==========================================*/

async function chargerPDF(){

const url="code_travail.pdf";

pdfDocument=await pdfjsLib.getDocument(url).promise;

nombrePages=pdfDocument.numPages;

console.log("PDF chargé.");

console.log("Nombre de pages :",nombrePages);

await lireToutesLesPages();

}


/*==========================================
        LECTURE DES PAGES
==========================================*/

async function lireToutesLesPages(){

texteComplet="";

pages=[];

for(let i=1;i<=nombrePages;i++){

const page=await pdfDocument.getPage(i);

const contenu=await page.getTextContent();

const texte=contenu.items.map(item=>item.str).join(" ");

pages.push({

page:i,

texte:texte

});

texteComplet+=texte+"\n";

}

console.log("Toutes les pages ont été analysées.");

console.log(texteComplet);

}


/*==========================================
        OBTENIR UNE PAGE
==========================================*/

function obtenirPage(numero){

return pages.find(function(page){

return page.page===numero;

});

}

/*==================================================
          DÉTECTION DES ARTICLES
==================================================*/

let articles=[];


/*==========================================
      EXTRAIRE LES ARTICLES
==========================================*/

function extraireArticles(){

articles=[];

const regex=/Article\s+([0-9A-Za-z.-]+)([\s\S]*?)(?=Article\s+[0-9A-Za-z.-]+|$)/gi;

let resultat;

while((resultat=regex.exec(texteComplet))!==null){

articles.push({

numero:resultat[1],

texte:resultat[2].trim()

});

}

console.log("Articles détectés :",articles.length);

}


/*==========================================
      RECHERCHE PAR ARTICLE
==========================================*/

function rechercherArticle(numero){

numero=numero.toString().toLowerCase();

return articles.find(function(article){

return article.numero.toLowerCase()==numero;

});

}


/*==========================================
      RECHERCHE PAR MOT-CLÉ
==========================================*/

function rechercherMotCle(mot){

mot=mot.toLowerCase();

return articles.filter(function(article){

return article.texte.toLowerCase().includes(mot);

});

}


/*==========================================
      RECHERCHE MULTI MOTS
==========================================*/

function rechercherPhrase(phrase){

const mots=phrase.toLowerCase().split(" ");

return articles.filter(function(article){

let texte=article.texte.toLowerCase();

return mots.every(function(m){

return texte.includes(m);

});

});

}


/*==========================================
      RECHERCHE DANS TOUT LE PDF
==========================================*/

function rechercherPDF(mot){

mot=mot.toLowerCase();

return pages.filter(function(page){

return page.texte.toLowerCase().includes(mot);

});

}


/*==========================================
      STATISTIQUES
==========================================*/

function statistiquesPDF(){

return{

pages:nombrePages,

articles:articles.length,

caracteres:texteComplet.length

};

}

/*==================================================
        INDEXATION ET CONTEXTE POUR L'IA
==================================================*/

let indexArticles = {};
let cacheRecherche = new Map();


/*==========================================
        CONSTRUIRE L'INDEX
==========================================*/

function construireIndex(){

    indexArticles = {};

    articles.forEach(function(article){

        const mots = article.texte
            .toLowerCase()
            .replace(/[.,;:!?()"]/g," ")
            .split(/\s+/);

        mots.forEach(function(mot){

            if(mot.length < 3) return;

            if(!indexArticles[mot]){
                indexArticles[mot] = [];
            }

            indexArticles[mot].push(article);

        });

    });

    console.log("Index créé :", Object.keys(indexArticles).length, "mots.");

}


/*==========================================
        RECHERCHE RAPIDE
==========================================*/

function rechercheRapide(mot){

    mot = mot.toLowerCase();

    if(cacheRecherche.has(mot)){
        return cacheRecherche.get(mot);
    }

    const resultat = indexArticles[mot] || [];

    cacheRecherche.set(mot, resultat);

    return resultat;

}


/*==========================================
        RECHERCHE MULTI-MOTS
==========================================*/

function rechercheIntelligente(question){

    const mots = question
        .toLowerCase()
        .split(/\s+/);

    let resultat = [];

    mots.forEach(function(mot){

        resultat = resultat.concat(
            rechercheRapide(mot)
        );

    });

    resultat = [...new Set(resultat)];

    return resultat;

}


/*==========================================
        CONTEXTE POUR L'IA
==========================================*/

function creerContexteIA(question){

    const resultat = rechercheIntelligente(question);

    let contexte = "";

    resultat.forEach(function(article){

        contexte +=
        "Article "
        + article.numero
        + "\n"
        + article.texte
        + "\n\n";

    });

    return contexte;

}


/*==========================================
        INITIALISATION
==========================================*/

async function initialiserPDF(){

    await chargerPDF();

    extraireArticles();

    construireIndex();

    console.log("PDF prêt.");

    console.log(statistiquesPDF());

}


/*==========================================
        EXPORT GLOBAL
==========================================*/

window.PDFManager = {

    chargerPDF,

    lireToutesLesPages,

    rechercherArticle,

    rechercherMotCle,

    rechercherPhrase,

    rechercherPDF,

    rechercheRapide,

    rechercheIntelligente,

    creerContexteIA,

    statistiquesPDF,

    obtenirPage,

    initialiserPDF

};




