// ================================
// 🤖 ASSISTANT IA IGT - MODE AVANCÉ
// ================================

const IA = {

    // 📚 Base de connaissance simplifiée
    codeTravail: [
        "Article 1 : Protection du travailleur",
        "Article 2 : Contrat de travail obligatoire",
        "Article 3 : Salaire minimum garanti",
        "Article 4 : Sécurité au travail obligatoire",
        "Article 5 : Droit syndical garanti"
    ],

    // 🧠 Analyse automatique d'une fiche
    analyserFiche: function(data) {

        if (!data) return "Aucune donnée fournie.";

        let score = 100;
        let alertes = [];

        if (!data.raisonSociale) {
            score -= 20;
            alertes.push("Raison sociale manquante");
        }

        if (!data.cnss) {
            score -= 15;
            alertes.push("CNSS non renseigné");
        }

        if (!data.telephone) {
            score -= 10;
            alertes.push("Téléphone absent");
        }

        return {
            score: score,
            alertes: alertes,
            statut: score > 70 ? "Conforme" : "Non conforme"
        };
    },

    // 🔎 Recherche intelligente Code du Travail
    rechercherArticle: function(motCle) {

        return this.codeTravail.filter(article =>
            article.toLowerCase().includes(motCle.toLowerCase())
        );
    },

    // 📋 Génération de rapport automatique
    genererRapport: function(fiche) {

        return `
        RAPPORT D'INSPECTION IGT

        Entreprise : ${fiche.raisonSociale || "Non définie"}
        Province : ${fiche.province || "Non définie"}

        Analyse IA :
        - Statut : ${fiche.statut || "Inconnu"}
        - Observations : ${fiche.observations || "Aucune"}

        Conclusion :
        Inspection générée automatiquement par IA IGT.
        `;
    }
};

// ================================
// 🤖 INTERFACE IA (BOUTONS)
// ================================

function ouvrirIA() {
    alert("🤖 IA IGT activée - Mode Assistant avancé");
}

// 🔍 Recherche article
function rechercherCodeTravail() {

    let mot = prompt("Entrer un mot-clé du Code du Travail :");

    let resultats = IA.rechercherArticle(mot);

    if (resultats.length > 0) {
        alert("📚 Résultats :\n\n" + resultats.join("\n"));
    } else {
        alert("Aucun article trouvé.");
    }
}

// 📊 Analyse fiche rapide
function analyserFicheDemo() {

    let demo = {
        raisonSociale: "Entreprise Test",
        cnss: "",
        telephone: "+243"
    };

    let result = IA.analyserFiche(demo);

    alert(
        "📊 Analyse IA\n\n" +
        "Score : " + result.score + "%\n" +
        "Statut : " + result.statut + "\n" +
        "Alertes : " + result.alertes.join(", ")
    );
}
