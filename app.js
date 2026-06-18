// 🔥 InspecteurBot - Cerveau de recherche Code du travail

let pdfTexteComplet = "";

// 📄 Charger le PDF automatiquement
async function chargerPDF() {

    const loadingTask = pdfjsLib.getDocument("code_du_travail.pdf");

    const pdf = await loadingTask.promise;

    let texteFinal = "";

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        const strings = content.items.map(item => item.str);

        texteFinal += strings.join(" ") + "\n";

    }

    pdfTexteComplet = texteFinal.toLowerCase();

    console.log("✅ PDF chargé avec succès !");
}

// 🚀 lancer le chargement
chargerPDF();


// 🔍 Fonction de recherche intelligente
function rechercher() {

    const input = document.getElementById("searchInput").value.toLowerCase();

    const resultDiv = document.getElementById("results");

    if (!input) {
        resultDiv.innerHTML = "⚠️ Veuillez entrer une recherche.";
        return;
    }

    if (pdfTexteComplet.includes(input)) {

        // trouver position
        const index = pdfTexteComplet.indexOf(input);

        let extrait = pdfTexteComplet.substring(index, index + 800);

        resultDiv.innerHTML = `
            <h3>🔍 Résultat trouvé :</h3>
            <p>${extrait}</p>
        `;

    } else {

        resultDiv.innerHTML = `
            <h3>❌ Aucun résultat trouvé</h3>
            <p>Essayez avec un autre mot (ex: licenciement, SMIG, contrat...)</p>
        `;
    }
          }
