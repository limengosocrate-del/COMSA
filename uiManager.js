/*==================================================
            INSPECTEURBOT IA
            uiManager.js
                Partie 1
==================================================*/

const UIManager = {

    version: "1.0.0",

    elements: {},

    initialise: false

};


/*==========================================
        INITIALISATION
==========================================*/

function initialiserUI(){

    UIManager.elements = {

        chatBox: document.getElementById("chatBox"),

        inputQuestion: document.getElementById("questionInput"),

        boutonEnvoyer: document.getElementById("sendButton"),

        boutonPDF: document.getElementById("uploadPDF"),

        resultatRecherche: document.getElementById("searchResult"),

        indicateurChargement: document.getElementById("loadingIndicator")

    };

    UIManager.initialise = true;

    console.log("UIManager initialisé.");

}


/*==========================================
        AJOUTER MESSAGE
==========================================*/

function ajouterMessage(role,message){

    if(!UIManager.elements.chatBox){

        return;

    }

    const div = document.createElement("div");

    div.className =


// ===============================
// Gestion de la zone de conversation
// ===============================

function addUserMessage(message) {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.className = "message user";

    div.innerHTML = `
        <div class="avatar">👤</div>
        <div class="content">${escapeHTML(message)}</div>
    `;

    chat.appendChild(div);
    scrollBottom();
}

function addAssistantMessage(message) {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.className = "message assistant";

    div.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content">${formatMarkdown(message)}</div>
    `;

    chat.appendChild(div);
    scrollBottom();
}

function addSystemMessage(message) {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.className = "message system";

    div.innerHTML = `
        <div class="content">${escapeHTML(message)}</div>
    `;

    chat.appendChild(div);
    scrollBottom();
}


// ===============================
// Scroll automatique
// ===============================

function scrollBottom() {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
}

// ===============================
// Nettoyage du chat
// ===============================

function clearChat() {
    document.getElementById("chat").innerHTML = "";
}

// ===============================
// Animation "IA réfléchit..."
// ===============================

let loadingElement = null;

function showLoading() {

    if (loadingElement) return;

    const chat = document.getElementById("chat");

    loadingElement = document.createElement("div");

    loadingElement.className = "message assistant loading";

    loadingElement.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;

    chat.appendChild(loadingElement);

    scrollBottom();

}

function hideLoading() {

    if (!loadingElement) return;

    loadingElement.remove();

    loadingElement = null;

}


// ===============================
// Formatage Markdown léger
// ===============================

function formatMarkdown(text) {

    if (!text) return "";

    let html = escapeHTML(text);

    // Titres
    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    // Gras
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italique
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Code inline
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bloc de code
    html = html.replace(
        /```([\s\S]*?)```/g,
        function(match, code){
            return `<pre><code>${code}</code></pre>`;
        }
    );

    // Citation
    html = html


      // Listes
    html = html.replace(/^- (.*)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    // Liens
    html = html.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank">$1</a>'
    );

    // Retour à la ligne
    html = html.replace(/\n/g, "<br>");

    return html;
}

// ===============================
// Affichage d'un message
// ===============================

function displayMessage(role, text) {

    const message = document.createElement("div");

    message.className = `message ${role}`;

    message.innerHTML = formatMarkdown(text);

    chatContainer.appendChild(message);

    scrollToBottom();

    return message;
}

// ===============================
// Mettre à jour un message
// ===============================

function updateMessage(element, text) {

    if (!element) return;

    element.innerHTML = formatMarkdown(text);

    scrollToBottom();
}

// ===============================
// Indicateur de chargement
// ===============================

function showTyping() {

    hideTyping();

    typingIndicator = document.createElement("div");

    typingIndicator.className = "typing";

    typingIndicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatContainer.appendChild(typingIndicator);

    scrollToBottom();
}

function hideTyping() {

    if (typingIndicator) {

        typingIndicator.remove();

        typingIndicator = null;
    }
}

// ===============================
// Défilement automatique
// ===============================

function scrollToBottom() {

    chatContainer.scrollTop = chatContainer.scrollHeight;
}


