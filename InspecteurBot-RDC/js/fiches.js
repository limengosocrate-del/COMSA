document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // DATE & HEURE AUTOMATIQUE
    // ==========================

    let date = new Date();

    let dateInput = document.getElementById("dateVisite");
    let heureInput = document.getElementById("heureVisite");

    if (dateInput) {
        dateInput.value = date.toISOString().split("T")[0];
    }

    if (heureInput) {
        heureInput.value = date.toTimeString().split(" ")[0].substring(0,5);
    }

    // ==========================
    // INSPECTEUR (SIMULATION LOGIN)
    // ==========================

    let inspecteur = document.getElementById("inspecteur");

    if (inspecteur) {
        // ici on simulera plus tard depuis login.js
        inspecteur.value = "Inspecteur Limengo (Pmiller)";
    }

    // ==========================
    // NUMÉRO DE FICHE AUTOMATIQUE
    // ==========================

    let numero = document.getElementById("numeroFiche");

    if (numero) {

        let annee = date.getFullYear();
        let province = "KIN";
        let random = Math.floor(100000 + Math.random() * 900000);

        numero.value = `F01-${annee}-${province}-${random}`;
    }

    // ==========================
    // CALCUL AUTOMATIQUE EFFECTIFS
    // ==========================

    calculEffectifs();

});

function calculEffectifs() {

    const lignes = [
        {h: "cadresH", f: "cadresF", t: "cadresT"},
        {h: "maitriseH", f: "maitriseF", t: "maitriseT"},
        {h: "employesH", f: "employesF", t: "employesT"},
        {h: "ouvriersH", f: "ouvriersF", t: "ouvriersT"},
        {h: "stagiairesH", f: "stagiairesF", t: "stagiairesT"}
    ];

    let totalH = 0;
    let totalF = 0;

    lignes.forEach(ligne => {

        let h = document.getElementById(ligne.h);
        let f = document.getElementById(ligne.f);
        let t = document.getElementById(ligne.t);

        let valH = parseInt(h?.value || 0);
        let valF = parseInt(f?.value || 0);

        let total = valH + valF;

        if (t) t.value = total;

        totalH += valH;
        totalF += valF;

    });

    let th = document.getElementById("totalHommes");
    let tf = document.getElementById("totalFemmes");
    let tg = document.getElementById("totalGeneral");

    if (th) th.value = totalH;
    if (tf) tf.value = totalF;
    if (tg) tg.value = totalH + totalF;
}

document.addEventListener("input", function (e) {

    if (
        e.target.id.includes("cadres") ||
        e.target.id.includes("maitrise") ||
        e.target.id.includes("employes") ||
        e.target.id.includes("ouvriers") ||
        e.target.id.includes("stagiaires")
    ) {
        calculEffectifs();
    }

});

/* =====================================================
   PARTIE 5 : Sauvegarde automatique (LocalStorage)
===================================================== */

function sauvegarderFiche() {

    const champs = document.querySelectorAll("input, textarea, select");

    champs.forEach(champ => {

        if (champ.id) {
            localStorage.setItem(champ.id, champ.value);
        }

    });

}

function chargerFiche() {

    const champs = document.querySelectorAll("input, textarea, select");

    champs.forEach(champ => {

        if (champ.id && localStorage.getItem(champ.id) !== null) {
            champ.value = localStorage.getItem(champ.id);
        }

    });

}

document.addEventListener("DOMContentLoaded", chargerFiche);

document.addEventListener("input", sauvegarderFiche);


/* =====================================================
   Bouton Nouvelle fiche
===================================================== */

function nouvelleFiche() {

    if (!confirm("Créer une nouvelle fiche ? Les données actuelles seront supprimées.")) {
        return;
    }

    localStorage.clear();

    location.reload();

}


/* =====================================================
   Bouton Imprimer
===================================================== */

function imprimerFiche() {

    window.print();

}


/* =====================================================
   Vérification des champs obligatoires
===================================================== */

function verifierFiche() {

    const obligatoires = [
        "numeroFiche",
        "dateVisite",
        "inspecteur"
    ];

    for (let id of obligatoires) {

        const champ = document.getElementById(id);

        if (champ && champ.value.trim() === "") {

            alert("Veuillez remplir le champ : " + id);

            champ.focus();

            return false;

        }

    }

    return true;

}

/* =====================================================
   PARTIE 6 : Enregistrement et Exportation
===================================================== */


/* ===============================
   Enregistrer
================================ */

function enregistrerFiche() {

    if (!verifierFiche()) {
        return;
    }

    sauvegarderFiche();

    alert("✅ Fiche enregistrée avec succès !");

}


/* ===============================
   Export PDF
================================ */

function exporterPDF() {

    if (!verifierFiche()) {
        return;
    }

    window.print();

}


/* ===============================
   Télécharger en JSON
================================ */

function telechargerJSON() {

    const donnees = {};

    document.querySelectorAll("input, textarea, select").forEach(champ => {

        if (champ.id) {
            donnees[champ.id] = champ.value;
        }

    });

    donnees.signature = "Créé par Inspecteur Limengo (Pmiller)";
    donnees.dateExport = new Date().toLocaleString();

    const fichier = new Blob(
        [JSON.stringify(donnees, null, 4)],
        { type: "application/json" }
    );

    const lien = document.createElement("a");

    lien.href = URL.createObjectURL(fichier);

    lien.download = "Fiche_Inspection.json";

    lien.click();

}


/* ===============================
   Notification
================================ */

function afficherMessage(message) {

    const notification = document.createElement("div");

    notification.innerHTML = message;

    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.background = "#198754";
    notification.style.color = "#fff";
    notification.style.padding = "12px 20px";
    notification.style.borderRadius = "8px";
    notification.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    notification.style.zIndex = "9999";

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.remove();

    }, 3000);

}


/* ===============================
   Signature automatique
================================ */

document.addEventListener("DOMContentLoaded", function () {

    const signature = document.getElementById("signature");

    if (signature) {

        signature.innerHTML =
        "Créé par <strong>Inspecteur Limengo (Pmiller)</strong>";

    }

});
