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

        let time = now.toLocaleTimeString();

        let date = now.toLocaleDateString();

        console.log("Heure :", time, "Date :", date);
    }

    setInterval(updateTime, 1000);

});

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

function notification(msg){

    let box = document.createElement("div");

    box.innerText = msg;

    box.style.position = "fixed";

    box.style.bottom = "20px";

    box.style.right = "20px";

    box.style.background = "#0056b3";

    box.style.color = "white";

    box.style.padding = "15px";

    box.style.borderRadius = "10px";

    box.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";

    document.body.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 3000);
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
