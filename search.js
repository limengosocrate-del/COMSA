/*==================================================
            INSPECTEURBOT IA
               SEARCH.JS
                Partie 1
==================================================*/

/*
---------------------------------------------
Moteur de recherche intelligent
---------------------------------------------
*/

let moteurRecherche = {

    historique: [],

    dernieresRecherches: [],

    maxHistorique: 20

};


/*==========================================
      NORMALISER UN TEXTE
==========================================*/

function normaliserTexte(texte){

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[.,;:!?()"]/g," ")
        .replace(/\s+/g," ")
        .trim();

}


/*==========================================
      AJOUTER À L'HISTORIQUE
==========================================*/

function ajouterHistorique(recherche){

    moteurRecherche.historique.unshift(recherche);

    if(moteurRecherche.historique.length >
        moteurRecherche.maxHistorique){

        moteurRecherche.historique.pop();

    }

}


/*==========================================
      OBTENIR L'HISTORIQUE
==========================================*/

function obtenirHistorique(){

    return moteurRecherche.historique;

}


/*==================================================
            SEARCH.JS
              Partie 2
==================================================*/


/*==========================================
        DICTIONNAIRE DE SYNONYMES
==========================================*/

const synonymes = {

    salaire:["paie","rémunération","revenu","solde"],

    contrat:["embauche","cdi","cdd","convention"],

    licenciement:["renvoi","rupture","dismiss"],

    congé:["vacances","permission","repos"],

    sécurité:["protection","prévention","danger"],

    travail:["emploi","activité","poste"],

    employeur:["entreprise","patron","direction"],

    salarié:["travailleur","employé","agent"]

};


/*==========================================
        RECHERCHE PAR SYNONYMES
==========================================*/

function rechercherSynonymes(mot){

    mot = normaliserTexte(mot);

    let liste = [mot];

    if(synonymes[mot]){

        liste = liste.concat(synonymes[mot]);

    }

    let resultats = [];

    liste.forEach(function(element){

        resultats = resultats.concat(

            PDFManager.rechercheRapide(element)

        );

    });

    return [...new Set(resultats)];

}


/*==========================================
        CALCUL DE PERTINENCE
==========================================*/

function calculerPertinence(question,article){

    let score = 0;

    const texte = normaliserTexte(article.texte);

    const mots = normaliserTexte(question).split(" ");

    mots.forEach(function(mot){

        if(texte.includes(mot)){

            score++;

        }

    });

    return score;

}


/*==========================================
        CLASSER LES RÉSULTATS
==========================================*/

function classerResultats(question,resultats){

    return resultats.sort(function(a,b){

        return calculerPertinence(question,b)

             - calculerPertinence(question,a);

    });

}


/*==========================================
        RECHERCHE COMPLÈTE
==========================================*/

function rechercher(question){

    ajouterHistorique(question);

    let resultat = [];

    const mots = normaliserTexte(question).split(" ");

    mots.forEach(function(mot){

        resultat = resultat.concat(

            rechercherSynonymes(mot)

        );

    });

    resultat = [...new Set(resultat)];

    return classerResultats(question,resultat);

}


/*==================================================
            SEARCH.JS
              Partie 3
==================================================*/

/*==========================================
        CACHE DES RECHERCHES
==========================================*/

const cacheRecherche = new Map();


/*==========================================
        MISE EN ÉVIDENCE
==========================================*/

function surlignerTexte(texte, question){

    const mots = normaliserTexte(question).split(" ");

    let resultat = texte;

    mots.forEach(function(mot){

        if(mot.length < 3){
            return;
        }

        const regex = new RegExp("(" + mot + ")", "gi");

        resultat = resultat.replace(
            regex,
            "<mark>$1</mark>"
        );

    });

    return resultat;

}


/*==========================================
        RECHERCHE AVEC CACHE
==========================================*/

function rechercherAvecCache(question){

    question = normaliserTexte(question);

    if(cacheRecherche.has(question)){
        return cacheRecherche.get(question);
    }

    const resultat = rechercher(question);

    cacheRecherche.set(question, resultat);

    return resultat;

}


/*==========================================
        CONTEXTE POUR L'IA
==========================================*/

function creerContexte(question){

    const resultats = rechercherAvecCache(question);

    let contexte = "";

    resultats.slice(0,5).forEach(function(article){

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
        EXPORT
==========================================*/

window.SearchManager = {

    rechercher,

    rechercherAvecCache,

    rechercherSynonymes,

    creerContexte,

    obtenirHistorique,

    surlignerTexte

};
