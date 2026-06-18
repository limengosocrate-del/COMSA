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
