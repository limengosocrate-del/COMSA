// ============================================
// chatController.js
// Contrôleur principal des conversations
// ============================================

import {
    appendMessage,
    appendStreamingMessage,
    updateStreamingMessage,
    finishStreamingMessage,
    showTypingIndicator,
    hideTypingIndicator,
    showToast,
    showProgress,
    clearChat
} from "./uiManager.js";

import {
    sendMessage,
    stopGeneration
} from "./apiService.js";

import {
    saveConversation,
    loadConversation,
    clearConversation
} from "./storageManager.js";

// ============================================
// Etat global
// ============================================

let conversation = [];

let isGenerating = false;

let currentStreamingElement = null;

let abortController = null;

// ============================================
// Eléments HTML
// ============================================

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const stopButton =
    document.getElementById("stopButton");

const newChatButton =
    document.getElementById("newChatButton");

// ============================================
// Initialisation
// ============================================

function initializeChat() {

    restoreConversation();

    bindEvents();

    updateButtons();

}

// ============================================
// Association des événements
// ============================================

function bindEvents() {

    sendButton.addEventListener(
        "click",
        handleSendMessage
    );

    stopButton.addEventListener(
        "click",
        handleStopGeneration
    );

    newChatButton.addEventListener(
        "click",
        handleNewConversation
    );

    messageInput.addEventListener(
        "keydown",
        handleKeyDown
    );

    document.addEventListener(
        "regenerateLastAnswer",
        regenerateLastAnswer
    );

  }


// ============================================
// Envoi d'un message
// ============================================

async function handleSendMessage() {

    if (isGenerating) return;

    const prompt = messageInput.value.trim();

    if (!prompt) return;

    messageInput.value = "";

    appendMessage("user", prompt);

    conversation.push({
        role: "user",
        content: prompt
    });

    saveConversation(conversation);

    await generateAssistantResponse(prompt);

}

// ============================================
// Génération de la réponse IA
// ============================================

async function generateAssistantResponse(prompt) {

    isGenerating = true;

    updateButtons();

    showTypingIndicator();

    currentStreamingElement =
        appendStreamingMessage();

    abortController = new AbortController();

    let fullResponse = "";

    try {

        await sendMessage({

            message: prompt,

            history: conversation,

            signal: abortController.signal,

            onStart() {

                hideTypingIndicator();

            },

            onToken(token) {

                fullResponse += token;

                updateStreamingMessage(
                    currentStreamingElement,
                    fullResponse
                );

            },

            onProgress(percent) {

                showProgress(percent);

            },

            onComplete() {

                finishStreamingMessage(
                    currentStreamingElement
                );

            }

        });

        conversation.push({

            role: "assistant",

            content: fullResponse

        });

        saveConversation(conversation);

    }

    catch (error) {

        hideTypingIndicator();

        finishStreamingMessage(
            currentStreamingElement
        );

        if (error.name === "AbortError") {

            showToast("Réponse interrompue");

        }

        else {

            console.error(error);

            showToast(
                "Erreur lors de la génération"
            );

        }

    }

    finally {

        isGenerating = false;

        updateButtons();

    }

  }


// ============================================
// Arrêt de la génération
// ============================================

function handleStopGeneration() {

    if (!isGenerating) return;

    if (abortController) {

        abortController.abort();

    }

}

// ============================================
// Nouvelle conversation
// ============================================

function handleNewConversation() {

    if (isGenerating) return;

    conversation = [];

    clearConversation();

    clearChat();

    messageInput.value = "";

    showToast("Nouvelle conversation");

    updateButtons();

}

// ============================================
// Régénérer la dernière réponse
// ============================================

async function regenerateLastAnswer() {

    if (isGenerating) return;

    const lastUserMessage = [...conversation]
        .reverse()
        .find(message => message.role === "user");

    if (!lastUserMessage) return;

    // Supprime la dernière réponse IA
    if (
        conversation.length &&
        conversation[conversation.length - 1].role === "assistant"
    ) {

        conversation.pop();

        saveConversation(conversation);

    }

    await generateAssistantResponse(
        lastUserMessage.content
    );

}

// ============================================
// Gestion de la touche Entrée
// ============================================

function handleKeyDown(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        handleSendMessage();

    }

}


// ============================================
// Restaurer une conversation sauvegardée
// ============================================

function restoreConversation() {

    const history = loadConversation();

    if (!history || !Array.isArray(history)) {

        conversation = [];

        return;

    }

    conversation = history;

    for (const message of conversation) {

        appendMessage(
            message.role,
            message.content
        );

    }

}

// ============================================
// Mise à jour des boutons
// ============================================

function updateButtons() {

    sendButton.disabled = isGenerating;

    stopButton.disabled = !isGenerating;

    messageInput.disabled = false;

    if (isGenerating) {

        sendButton.classList.add("disabled");

        stopButton.classList.remove("disabled");

    } else {

        sendButton.classList.remove("disabled");

        stopButton.classList.add("disabled");

    }

}

// ============================================
// Accès à l'état courant
// ============================================

function getConversation() {

    return [...conversation];

}

function isBusy() {

    return isGenerating;

}

// ============================================
// Nettoyage complet
// ============================================

function destroyChatController() {

    if (abortController) {

        abortController.abort();

    }

    conversation = [];

    currentStreamingElement = null;

    isGenerating = false;

}

// ============================================
// Initialisation automatique
// ============================================

initializeChat();

// ============================================
// Exports
// ============================================

export {

    initializeChat,

    handleSendMessage,

    handleStopGeneration,

    handleNewConversation,

    regenerateLastAnswer,

    restoreConversation,

    getConversation,

    isBusy,

    destroyChatController

};
