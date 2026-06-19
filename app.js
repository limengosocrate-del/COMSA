// 🤖 InspecteurBot IA - VERSION PRO

let pdfTexteComplet = "";

// ===============================
// 📄 CHARGEMENT DU CODE DU TRAVAIL (PDF)
// ===============================
async function chargerPDF() {

    try {

        const pdf = await pdfjsLib.getDocument("code_du_travail.pdf").promise;

        let texte = "";

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const strings = content.items.map(item => item.str);

            texte += strings.join(" ") + "\n";
        }

        pdfTexteComplet = texte.toLowerCase();

        console.log("✅ PDF Code du travail chargé");

    } catch (e) {
        console.log("❌ Erreur chargement PDF", e);
    }
}

chargerPDF();


// ===============================
// 🧠 IA SIMPLE (analyse question)
// ===============================
function analyserQuestion(question) {

    question = question.toLowerCase();

    if (question.includes("licenciement")) return "licenciement";
    if (question.includes("contrat")) return "contrat de travail";
    if (question.includes("smig") || question.includes("salaire")) return "salaire";
    if (question.includes("congé")) return "congé";
    if (question.includes("heures")) return "heures supplémentaires";
    if (question.includes("mineur") || question.includes("enfant")) return "travail des enfants";

    return question;
}


// ===============================
// 🔍 RECHERCHE + IA COMBINÉE
// ===============================
function rechercher() {

    const input = document.getElementById("searchInput").value;
    const resultDiv = document.getElementById("results");

    if (!input) {
        resultDiv.innerHTML = "⚠️ Veuillez entrer une question.";
        return;
    }

    const motCle = analyserQuestion(input);

    // 🔎 recherche dans PDF
    if (pdfTexteComplet.includes(motCle)) {

        const index = pdfTexteComplet.indexOf(motCle);
        const extrait = pdfTexteComplet.substring(index, index + 1000);

        resultDiv.innerHTML = `
            <div class="box">
                <h2>📖 Code du travail</h2>
                <p>${extrait}</p>
            </div>
        `;

    } else {

        resultDiv.innerHTML = `
            <div class="box">
                <h2>🤖 InspecteurBot IA</h2>
                <p>❌ Aucun article trouvé dans le PDF.</p>
                <p>Je consulte l'IA...</p>
            </div>
        `;
    }

    // 🤖 toujours appeler IA
    demanderIA(input);
}


// ===============================
// 🎤 VOIX (Speech to Text)
// ===============================
function startVoice() {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("❌ Navigateur non compatible");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.interimResults = false;

    const voiceBtn = document.getElementById("voiceBtn");

    voiceBtn.innerHTML = "🎙️...";

    recognition.start();

    recognition.onresult = function(event) {

        const texte = event.results[0][0].transcript;

        document.getElementById("searchInput").value = texte;

        // 🔥 recherche + IA
        rechercher();
        demanderIA(texte);
    };

    recognition.onend = function() {
        voiceBtn.innerHTML = "🎤";
    };
}


// ===============================
// 🤖 IA PRO (API EXTERNE)
// ===============================
async function demanderIA(question) {

    const resultDiv = document.getElementById("results");

    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer VOTRE_CLE_API_ICI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                model: "openai/gpt-4o-mini",

                messages: [
                    {
                        role: "system",
                        content: "Tu es InspecteurBot, assistant officiel du travail en RDC. Réponds uniquement en droit du travail."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]

            })
        });

        const data = await response.json();

        if (data.choices) {

            resultDiv.innerHTML += `
                <div class="ia-box">
                    <h2>🤖 IA InspecteurBot</h2>
                    <p>${data.choices[0].message.content}</p>
                </div>
            `;
        }

    } catch (error) {

        resultDiv.innerHTML += `
            <div class="ia-box error">
                ❌ IA indisponible
            </div>
        `;
    }
        }
