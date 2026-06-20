//
// ===============================
// INSPECTEURBOT RDC - DASHBOARD JS
// Créé par Inspecteur Limengo (Pmiller)
// ===============================
//

document.addEventListener("DOMContentLoaded", () => {

    // =====================
    // AFFICHER UTILISATEUR
    // =====================

    let user = localStorage.getItem("user");

    if(user){
        document.getElementById("user").innerText = user;
    }

    // =====================
    // HORLOGE LIVE
    // =====================

    function updateTime(){

let now = new Date();

let heure = now.toLocaleTimeString("fr-FR");

let date = now.toLocaleDateString("fr-FR");

const clock=document.getElementById("clock");

if(clock){

clock.innerHTML=heure+"<br><small>"+date+"</small>";

}

}

//
// ===============================
// MENU ACTIVE + NAVIGATION
// ===============================
//

let links = document.querySelectorAll(".sidebar ul li a");

links.forEach(link => {

    link.addEventListener("click", () => {

        links.forEach(l => l.classList.remove("active"));

        link.classList.add("active");

    });

});

//
// ===============================
// NOTIFICATIONS SIMPLES
// ===============================
//

function notification(message,type="info"){

const notif=document.createElement("div");

notif.className="notification-box";

notif.innerHTML=message;

document.body.appendChild(notif);

setTimeout(()=>{

notif.classList.add("show");

},100);

setTimeout(()=>{

notif.classList.remove("show");

setTimeout(()=>{

notif.remove();

},500);

},3500);

}

// test notification
notification("Bienvenue dans InspecteurBot RDC 🚀");

//==============================
// INSPECTEUR IA
//==============================

function repondreIA(){

let question=document.getElementById("questionIA").value.toLowerCase();

let reponse=document.getElementById("reponseIA");

if(question.includes("contrat")){

reponse.innerHTML=
"Le contrat de travail est un accord entre l'employeur et le travailleur conformément au Code du Travail.";

}

else if(question.includes("licenciement")){

reponse.innerHTML=
"Le licenciement doit respecter les dispositions prévues par le Code du Travail et les procédures applicables.";

}

else if(question.includes("salaire")){

reponse.innerHTML=
"Le salaire doit être payé conformément au contrat de travail et aux dispositions légales en vigueur.";

}

else if(question.includes("inspection")){

reponse.innerHTML=
"L'inspection du travail consiste à contrôler l'application de la législation sociale dans les entreprises.";

}

else{

reponse.innerHTML=
"Je n'ai pas encore cette réponse. Cette fonction sera enrichie progressivement avec l'ensemble du Code du Travail et les procédures de l'IGT.";

}

}

//==============================
// MESSAGE D'ACCUEIL
//==============================

window.onload = function(){

notification("Bienvenue dans InspecteurBot RDC 🚀");

notification("3 inspections sont programmées aujourd'hui.");

}

//==============================
// MENU MOBILE
//==============================

const menuBtn=document.querySelector(".menu-btn");

const sidebar=document.querySelector(".sidebar");

if(menuBtn){

menuBtn.onclick=function(){

sidebar.classList.toggle("open");

};

}

//==============================
// ANIMATION DES STATISTIQUES
//==============================

document.querySelectorAll(".stat p").forEach(function(item){

let cible=parseInt(item.innerText.replace(/ /g,""));

let valeur=0;

let interval=setInterval(function(){

valeur+=Math.ceil(cible/40);

if(valeur>=cible){

valeur=cible;

clearInterval(interval);

}

item.innerText=valeur.toLocaleString("fr-FR");

},30);

});   


                          
