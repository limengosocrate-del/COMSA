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


// ===============================
// Carte Source RAG
// ===============================

function createSourceCard(source) {

    const card = document.createElement("div");

    card.className = "source-card";

    card.innerHTML = `
        <div class="source-header">
            📄 <strong>${escapeHTML(source.title || "Document")}</strong>
        </div>

        <div class="source-body">
            ${escapeHTML(source.content || "")}
        </div>

        <div class="source-footer">
            Score : ${source.score ?? "-"}
        </div>
    `;

    return card;
}

// ===============================
// Affichage des sources
// ===============================

function displaySources(sources = []) {

    if (!sources.length)
        return;

    const container = document.createElement("div");

    container.className = "sources-container";

    const title = document.createElement("h3");

    title.textContent = "Sources utilisées";

    container.appendChild(title);

    sources.forEach(source => {

        container.appendChild(createSourceCard(source));

    });

    chatContainer.appendChild(container);

    scrollToBottom();
}

// ===============================
// Carte Document
// ===============================

function createDocumentCard(doc) {

    const card = document.createElement("div");

    card.className = "document-card";

    card.innerHTML = `
        <div class="document-title">
            📚 ${escapeHTML(doc.name)}
        </div>

        <div class="document-info">
            ${escapeHTML(doc.description || "")}
        </div>
    `;

    if (doc.url) {

        const button = document.createElement("a");

        button.href = doc.url;

        button.target = "_blank";

        button.className = "document-button";

        button.textContent = "Ouvrir";

        card.appendChild(button);
    }

    return card;
}

// ===============================
// Affichage des documents
// ===============================

function displayDocuments(documents = []) {

    if (!documents.length)
        return;

    const wrapper = document.createElement("div");

    wrapper.className = "documents-wrapper";

    documents.forEach(doc => {

        wrapper.appendChild(createDocumentCard(doc));

    });

    chatContainer.appendChild(wrapper);

    scrollToBottom();
}


// ===============================
// Boutons d'action
// ===============================

function createActionBar(messageElement, text) {

    const bar = document.createElement("div");

    bar.className = "message-actions";

    // Copier
    const copyBtn = document.createElement("button");
    copyBtn.className = "action-btn";
    copyBtn.textContent = "📋 Copier";

    copyBtn.onclick = async () => {

        try {
            await navigator.clipboard.writeText(text);

            copyBtn.textContent = "✅ Copié";

            setTimeout(() => {
                copyBtn.textContent = "📋 Copier";
            }, 1500);

        } catch (err) {
            console.error(err);
        }
    };

    // Régénérer
    const retryBtn = document.createElement("button");
    retryBtn.className = "action-btn";
    retryBtn.textContent = "🔄 Régénérer";

    retryBtn.onclick = () => {

        document.dispatchEvent(
            new CustomEvent("regenerateLastAnswer")
        );

    };

    // Vote positif
    const likeBtn = document.createElement("button");
    likeBtn.className = "action-btn";
    likeBtn.textContent = "👍";

    likeBtn.onclick = () => {

        likeBtn.classList.toggle("active");

        dislikeBtn.classList.remove("active");
    };

    // Vote négatif
    const dislikeBtn = document.createElement("button");
    dislikeBtn.className = "action-btn";
    dislikeBtn.textContent = "👎";

    dislikeBtn.onclick = () => {

        dislikeBtn.classList.toggle("active");

        likeBtn.classList.remove("active");
    };

    bar.append(
        copyBtn,
        retryBtn,
        likeBtn,
        dislikeBtn
    );

    messageElement.appendChild(bar);
}

// ===============================
// Galerie d'images
// ===============================

function displayImages(images = []) {

    if (!images.length)
        return;

    const gallery = document.createElement("div");

    gallery.className = "image-gallery";

    images.forEach(src => {

        const img = document.createElement("img");

        img.src = src;

        img.loading = "lazy";

        img.className = "chat-image";

        img.onclick = () => {

            window.open(src, "_blank");

        };

        gallery.appendChild(img);

    });

    chatContainer.appendChild(gallery);

    scrollToBottom();
}

// ===============================
// Tableau HTML
// ===============================

function displayTable(headers = [], rows = []) {

    const table = document.createElement("table");

    table.className = "chat-table";

    const thead = document.createElement("thead");

    const tr = document.createElement("tr");

    headers.forEach(h => {

        const th = document.createElement("th");

        th.textContent = h;

        tr.appendChild(th);

    });

    thead.appendChild(tr);

    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    rows.forEach(row => {

        const tr = document.createElement("tr");

        row.forEach(cell => {

            const td = document.createElement("td");

            td.textContent = cell;

            tr.appendChild(td);

        });

        tbody.appendChild(tr);

    });

    table.appendChild(tbody);

    chatContainer.appendChild(table);

    scrollToBottom();
}

// ===============================
// Citation
// ===============================

function displayCitation(text) {

    const block = document.createElement("blockquote");

    block.className = "chat-citation";

    block.textContent = text;

    chatContainer.appendChild(block);

    scrollToBottom();
}


 // ===============================
// Notifications (Toast)
// ===============================

function showToast(message, duration = 2500) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, duration);
}

// ===============================
// Barre de progression
// ===============================

function showProgress(percent = 0) {

    let bar = document.querySelector(".progress-bar");

    if (!bar) {

        bar = document.createElement("div");

        bar.className = "progress-bar";

        document.body.appendChild(bar);

    }

    bar.style.width = `${percent}%`;

    if (percent >= 100) {

        setTimeout(() => {

            bar.remove();

        }, 300);

    }
}

// ===============================
// Nettoyer le chat
// ===============================

function clearChat() {

    chatContainer.innerHTML = "";

    showToast("Conversation effacée");
}

// ===============================
// Animation d'apparition
// ===============================

function animateMessage(element) {

    element.classList.add("fade-in");

    setTimeout(() => {

        element.classList.remove("fade-in");

    }, 400);
}

// ===============================
// Défilement intelligent
// ===============================

function smartScroll() {

    const distance =
        chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight;

    if (distance < 200) {

        scrollToBottom();

    }
}

// ===============================
// Focus automatique
// ===============================

function focusInput() {

    if (messageInput) {

        messageInput.focus();

    }
}

// ===============================
// Initialisation UI
// ===============================

function initializeUI() {

    scrollToBottom();

    focusInput();

    document.addEventListener("click", e => {

        if (e.target.matches(".copy-code")) {

            const code =
                e.target.parentElement.querySelector("code").innerText;

            navigator.clipboard.writeText(code);

            showToast("Code copié");

        }

    });

}

// ===============================
// Export
// ===============================

export {

    initializeUI,

    appendMessage,

    appendStreamingMessage,

    updateStreamingMessage,

    finishStreamingMessage,

    displayMarkdown,

    displayCode,

    displayImages,

    displayTable,

    displayCitation,

    createActionBar,

    showTypingIndicator,

    hideTypingIndicator,

    showToast,

    showProgress,

    clearChat,

    smartScroll,

    scrollToBottom,

    focusInput,

    animateMessage

};          
