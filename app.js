// 🤖 InspecteurBot IA - Mode Intelligent

let pdfTexteComplet = "";

// 📄 Charger le PDF
async function chargerPDF() {

    const pdf = await pdfjsLib.getDocument("code_du_travail.pdf").promise;

    let texte = "";

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const strings = content.items.map(item => item.str);

        texte += strings.join(" ") + "\n";
    }

    pdfTexteComplet = texte.toLowerCase();

    console.log("✅ InspecteurBot IA prêt !");
}

chargerPDF();


// 🧠 IA SIMPLE (compréhension des questions)
function analyserQuestion(question) {

    question = question.toLowerCase();

    // 🎯 mots-clés juridiques
    if (question.includes("licenciement")) {
        return "licenciement";
    }

    if (question.includes("contrat")) {
        return "contrat de travail";
    }

    if (question.includes("smig") || question.includes("salaire")) {
        return "salaire";
    }

    if (question.includes("congé")) {
        return "congé";
    }

    if (question.includes("heures supplémentaires")) {
        return "heures supplémentaires";
    }

    if (question.includes("travail des enfants") || question.includes("mineur")) {
        return "travail des enfants";
    }

    return question;
}


// 🔍 RECHERCHE INTELLIGENTE
function rechercher() {

    const input = document.getElementById("searchInput").value;
    const resultDiv = document.getElementById("results");

    if (!input) {
        resultDiv.innerHTML = "⚠️ Veuillez entrer une question.";
        return;
    }

    // 🧠 analyse IA
    const motCle = analyserQuestion(input);

    if (pdfTexteComplet.includes(motCle)) {

        const index = pdfTexteComplet.indexOf(motCle);

        const extrait = pdfTexteComplet.substring(index, index + 1200);

        resultDiv.innerHTML = `
            <h2>🤖 InspecteurBot IA</h2>
            <p><b>Question :</b> ${input}</p>
            <hr>
            <h3>📖 Résultat juridique :</h3>
            <p>${extrait}</p>
            <hr>
            <p>⚖️ Analyse automatique du Code du travail</p>
        `;

    } else {

        resultDiv.innerHTML = `
            <h2>🤖 InspecteurBot IA</h2>
            <p>❌ Aucun article trouvé directement.</p>
            <p>Essayez des mots comme :</p>
            <ul>
                <li>licenciement</li>
                <li>contrat de travail</li>
                <li>SMIG</li>
                <li>congé</li>
                <li>heures supplémentaires</li>
            </ul>
        `;
    }
}

// 🎤 InspecteurBot - Mode vocal

function startVoice() {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("❌ Votre navigateur ne supporte pas la reconnaissance vocale");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const voiceBtn = document.getElementById("voiceBtn");

    voiceBtn.innerHTML = "🎙️...";

    recognition.start();

    recognition.onresult = function(event) {

        const texte = event.results[0][0].transcript;

        document.getElementById("searchInput").value = texte;

        // ⚡ lancer automatiquement la recherche
        rechercher();
    };

    recognition.onerror = function() {
        alert("❌ Erreur de reconnaissance vocale");
    };

    recognition.onend = function() {
        voiceBtn.innerHTML = "🎤";
    };
        }
