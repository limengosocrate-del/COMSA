/*====================================================
            INSPECTEURBOT IA
                 APP.JS
                 Partie 1
====================================================*/


/*=====================================
      DISPARITION DU LOADER
=====================================*/

window.addEventListener("load", function(){

const loader = document.getElementById("loader");

if(loader){

setTimeout(function(){

loader.style.opacity="0";

loader.style.transition="0.8s";

setTimeout(function(){

loader.style.display="none";

},800);

},1800);

}

});


/*=====================================
      COMPTEURS ANIMÉS
=====================================*/

function animateCounter(id,endValue){

const element=document.getElementById(id);

if(!element) return;

let start=0;

let duration=2000;

let increment=endValue/100;

let timer=setInterval(function(){

start+=increment;

if(start>=endValue){

start=endValue;

clearInterval(timer);

}

element.innerHTML=Math.floor(start);

},duration/100);

}


window.addEventListener("load",function(){

animateCounter("inspectionCount",248);

animateCounter("pvCount",91);

animateCounter("companyCount",164);

animateCounter("infractionCount",56);

});


/*=====================================
      MESSAGES MOTIVATION
=====================================*/

const motivationMessages=[

"Bienvenue Inspecteur 👋",

"La loi protège le travailleur.",

"Chaque inspection améliore le monde du travail.",

"L'intégrité est la force de l'Inspecteur.",

"Votre mission contribue à une société plus juste.",

"Soyez rigoureux, juste et impartial.",

"Le respect du Code du Travail protège tous les citoyens.",

"Chaque contrôle est une opportunité d'amélioration.",

"La sécurité des travailleurs est une priorité.",

"Bonne mission Inspecteur."

];


function changeNotification(){

const notification=document.getElementById("notification-text");

if(!notification) return;

let index=Math.floor(Math.random()*motivationMessages.length);

notification.innerHTML=motivationMessages[index];

}

setInterval(changeNotification,7000);

window.onload=changeNotification;


/*=====================================
      DATE DU JOUR
=====================================*/

const today=new Date();

console.log(today.toLocaleDateString());



/*=====================================
      HEURE EN TEMPS RÉEL
=====================================*/

function updateClock(){

const clock=document.getElementById("clock");

if(!clock) return;

const now=new Date();

clock.innerHTML=now.toLocaleTimeString();

}

setInterval(updateClock,1000);

/*=====================================
            CHART.JS
=====================================*/

window.addEventListener("load",function(){

const inspectionCanvas=document.getElementById("inspectionChart");

if(inspectionCanvas){

new Chart(inspectionCanvas,{

type:"bar",

data:{

labels:["Jan","Fév","Mar","Avr","Mai","Juin"],

datasets:[{

label:"Inspections",

data:[21,34,27,48,39,52],

backgroundColor:"#005baa"

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}


const pvCanvas=document.getElementById("pvChart");

if(pvCanvas){

new Chart(pvCanvas,{

type:"doughnut",

data:{

labels:[

"PV établis",

"Dossiers ouverts",

"En attente"

],

datasets:[{

data:[91,38,17],

backgroundColor:[

"#005baa",

"#2e7d32",

"#ff9800"

]

}]

},

options:{

responsive:true

}

});

}

});


/*=====================================
      BOUTON IA FLOTTANT
=====================================*/

const floatingAI=document.getElementById("floatingAI");

if(floatingAI){

floatingAI.addEventListener("click",function(){

alert(

"🤖 InspecteurBot IA\n\nCette fonctionnalité sera reliée au Code du Travail PDF et à l'IA."

);

});

}


/*=====================================
      MESSAGE IA
=====================================*/

const smartMessages=[

"💡 Pensez à vérifier les contrats de travail.",

"📚 Consultez toujours les articles du Code du Travail.",

"⚖️ Une bonne inspection repose sur des preuves.",

"👷 La sécurité des travailleurs reste prioritaire.",

"📄 Vérifiez les registres obligatoires.",

"🛡️ Respectez la procédure avant toute sanction.",

"🤖 InspecteurBot IA est prêt à vous assister."

];


function rotateSmartMessage(){

const element=document.getElementById("smartMessage");

if(!element) return;

let random=Math.floor(Math.random()*smartMessages.length);

element.innerHTML=smartMessages[random];

}

rotateSmartMessage();

setInterval(rotateSmartMessage,6000);


/*=====================================
      ANIMATION DES CARTES
=====================================*/

const cards=document.querySelectorAll(

".card,.menu-card,.news-card,.inf-card"

);

cards.forEach(function(card){

card.addEventListener("mouseenter",function(){

card.style.transform="translateY(-8px)";

});

card.addEventListener("mouseleave",function(){

card.style.transform="translateY(0px)";

});

});


/*=====================================
      PRÉPARATION LECTURE PDF
=====================================*/

let codeTravail=[];

async function chargerCodeTravail(){

console.log("Chargement du Code du Travail...");

}

/*
Dans la prochaine version :

code_travail.pdf

↓

PDF.js

↓

Extraction de toutes les pages

↓

Indexation des articles

↓

Recherche intelligente

↓

Réponse IA
*/

/*=====================================
      RECHERCHE DANS LE CODE DU TRAVAIL
=====================================*/

/*
Cette variable contiendra les articles extraits
du PDF une fois PDF.js intégré.
*/

let articlesCode = [];


/*=====================================
      RECHERCHE PAR MOT-CLÉ
=====================================*/

function rechercherArticle(motCle){

if(!motCle) return [];

motCle = motCle.toLowerCase();

return articlesCode.filter(function(article){

return article.texte.toLowerCase().includes(motCle);

});

}


/*=====================================
      RECHERCHE PAR NUMÉRO D'ARTICLE
=====================================*/

function rechercherNumero(numero){

return articlesCode.find(function(article){

return article.numero == numero;

});

}


/*=====================================
      QUESTION À L'IA
=====================================*/

async function poserQuestionIA(question){

if(!question) return;

const resultat = rechercherArticle(question);

if(resultat.length>0){

console.log(resultat);

return resultat;

}

console.log("Aucun article trouvé.");

return [];

}


/*=====================================
      PRÉPARATION OPENAI / GEMINI
=====================================*/

/*

Exemple futur :

const reponse = await fetch(API_URL,{

method:"POST",

headers:{

Authorization:"Bearer VOTRE_CLE_API",

"Content-Type":"application/json"

},

body:JSON.stringify({

question:question,

contexte:resultat

})

});

L'IA répondra uniquement
à partir des articles trouvés.

*/


/*=====================================
      GESTION DES BOUTONS
=====================================*/

document.querySelectorAll("button").forEach(function(btn){

btn.addEventListener("click",function(){

console.log("Bouton :",btn.innerText);

});

});


/*=====================================
      MODE SOMBRE (préparation)
=====================================*/

function changerTheme(){

document.body.classList.toggle("dark");

}


/*=====================================
      INITIALISATION
=====================================*/

window.addEventListener("load",function(){

console.log("InspecteurBot IA démarré.");

console.log("Application prête.");

console.log("En attente du Code du Travail PDF.");

});
