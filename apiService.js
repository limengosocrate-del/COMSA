// ============================================
// apiService.js
// Gestion centralisée des fournisseurs IA
// ============================================

import {
    getCurrentProvider,
    getApiKey,
    getModel
} from "../config/providerConfig.js";

import {
    streamOpenAI
} from "./providers/openaiProvider.js";

import {
    streamGemini
} from "./providers/geminiProvider.js";

import {
    streamClaude
} from "./providers/claudeProvider.js";

import {
    streamOpenRouter
} from "./providers/openrouterProvider.js";

import {
    streamOllama
} from "./providers/ollamaProvider.js";

// ============================================
// Timeout par défaut
// ============================================

const DEFAULT_TIMEOUT = 60000;

// ============================================
// Nombre maximal de tentatives
// ============================================

const MAX_RETRIES = 3;

// ============================================
// Envoi principal
// ============================================

export async function sendMessage(options) {

    const {

        provider = getCurrentProvider(),

        message,

        history = [],

        signal,

        onStart,

        onToken,

        onProgress,

        onComplete

    } = options;

    switch (provider) {

        case "openai":

            return executeProvider(
                streamOpenAI,
                options
            );

        case "gemini":

            return executeProvider(
                streamGemini,
                options
            );

        case "claude":

            return executeProvider(
                streamClaude,
                options
            );

        case "openrouter":

            return executeProvider(
                streamOpenRouter,
                options
            );

        case "ollama":

            return executeProvider(
                streamOllama,
                options
            );

        default:

            throw new Error(
                `Provider inconnu : ${provider}`
            );

    }

}


// ============================================
// Exécution sécurisée d'un provider
// ============================================

async function executeProvider(providerFunction, options) {

    let attempt = 0;

    let lastError = null;

    while (attempt < MAX_RETRIES) {

        attempt++;

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, DEFAULT_TIMEOUT);

        try {

            const mergedSignal = options.signal || controller.signal;

            const response = await providerFunction({

                ...options,

                apiKey: getApiKey(),

                model: getModel(),

                signal: mergedSignal

            });

            clearTimeout(timeout);

            return response;

        } catch (error) {

            clearTimeout(timeout);

            lastError = error;

            if (error.name === "AbortError") {

                throw error;

            }

            if (attempt >= MAX_RETRIES) {

                throw normalizeError(error);

            }

            await delay(attempt * 1000);

        }

    }

    throw normalizeError(lastError);

}

// ============================================
// Attente avant nouvelle tentative
// ============================================

function delay(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });

}


// ============================================
// Uniformiser les erreurs
// ============================================

function normalizeError(error) {

    if (!error) {

        return new Error("Erreur inconnue.");

    }

    if (error.name === "AbortError") {

        return error;

    }

    if (error.status === 401) {

        return new Error(

            "Clé API invalide."

        );

    }

    if (error.status === 403) {

        return new Error(

            "Accès refusé."

        );

    }

    if (error.status === 404) {

        return new Error(

            "Modèle introuvable."

        );

    }

    if (error.status === 408) {

        return new Error(

            "Temps de réponse dépassé."

        );

    }

    if (error.status === 429) {

        return new Error(

            "Limite d'utilisation atteinte."

        );

    }

    if (error.status >= 500) {

        return new Error(

            "Erreur du serveur IA."

        );

    }

    return new Error(

        error.message || "Une erreur est survenue."

    );

}


// ============================================
// Vérifier qu'un provider est configuré
// ============================================

export function isProviderReady() {

    const key = getApiKey();

    const provider = getCurrentProvider();

    if (provider === "ollama") {

        return true;

    }

    return Boolean(key);

}


// ============================================
// Streaming universel
// ============================================

export async function streamMessage(options) {

    const {

        provider = getCurrentProvider(),

        onStart,

        onToken,

        onProgress,

        onComplete,

        onError

    } = options;

    try {

        if (typeof onStart === "function") {

            await onStart();

        }

        const result = await sendMessage({

            ...options,

            onToken(token) {

                if (typeof onToken === "function") {

                    onToken(token);

                }

            },

            onProgress(progress) {

                if (typeof onProgress === "function") {

                    onProgress(progress);

                }

            }

        });

        if (typeof onComplete === "function") {

            await onComplete(result);

        }

        return result;

    } catch (error) {

        if (typeof onError === "function") {

            onError(error);

        }

        throw error;

    }

}


// ============================================
// Construire une réponse complète
// ============================================

export async function collectStream(options) {

    let text = "";

    const result = await streamMessage({

        ...options,

        onToken(token) {

            text += token;

            options.onToken?.(token);

        }

    });

    return {

        ...result,

        text

    };

}


// ============================================
// Vérification complète
// ============================================

export async function checkProviderHealth() {

    try {

        if (!isProviderReady()) {

            return {

                online: false,

                reason: "missing_api_key"

            };

        }

        return {

            online: true,

            provider: getCurrentProvider(),

            model: getModel()

        };

    } catch (error) {

        return {

            online: false,

            reason: error.message

        };

    }

}


// ============================================
// Informations du provider
// ============================================

export function getProviderInfo() {

    return {

        provider: getCurrentProvider(),

        model: getModel(),

        ready: isProviderReady(),

        timeout: DEFAULT_TIMEOUT,

        retries: MAX_RETRIES

    };

}


// ============================================
// Contrôleur global
// ============================================

let currentAbortController = null;

export function createAbortController() {

    currentAbortController = new AbortController();

    return currentAbortController;

}

export function abortCurrentRequest() {

    if (currentAbortController) {

        currentAbortController.abort();

        currentAbortController = null;

    }

}


export default {

    sendMessage,

    streamMessage,

    collectStream,

    checkProviderHealth,

    getProviderInfo,

    isProviderReady,

    createAbortController,

    abortCurrentRequest

};


// ============================================
// Queue des requêtes
// ============================================

const requestQueue = [];

let processingQueue = false;

export async function enqueueRequest(task) {

    return new Promise((resolve, reject) => {

        requestQueue.push({

            task,

            resolve,

            reject

        });

        processQueue();

    });

}

async function processQueue() {

    if (processingQueue) {

        return;

    }

    processingQueue = true;

    while (requestQueue.length > 0) {

        const item = requestQueue.shift();

        try {

            const result = await item.task();

            item.resolve(result);

        } catch (error) {

            item.reject(error);

        }

    }

    processingQueue = false;

}


// ============================================
// Cache mémoire
// ============================================

const responseCache = new Map();

const CACHE_DURATION = 1000 * 60 * 10;

export function getCachedResponse(key) {

    const cached = responseCache.get(key);

    if (!cached) {

        return null;

    }

    if (Date.now() > cached.expireAt) {

        responseCache.delete(key);

        return null;

    }

    return cached.value;

}

export function saveCachedResponse(key, value) {

    responseCache.set(key, {

        value,

        expireAt: Date.now() + CACHE_DURATION

    });

}

export function clearCache() {

    responseCache.clear();

}


// ============================================
// Rate Limiter
// ============================================

const rateLimiter = new Map();

const LIMIT = 30;

const WINDOW = 60000;

export function canSendRequest(userId) {

    const now = Date.now();

    if (!rateLimiter.has(userId)) {

        rateLimiter.set(userId, []);

    }

    const history = rateLimiter.get(userId);

    while (

        history.length &&

        now - history[0] > WINDOW

    ) {

        history.shift();

    }

    if (history.length >= LIMIT) {

        return false;

    }

    history.push(now);

    return true;

}


// ============================================
// Logs API
// ============================================

const apiLogs = [];

export function addLog(entry) {

    apiLogs.push({

        time: new Date(),

        ...entry

    });

    if (apiLogs.length > 1000) {

        apiLogs.shift();

    }

}

export function getLogs() {

    return [...apiLogs];

}

export function clearLogs() {

    apiLogs.length = 0;

}


// ============================================
// Statistiques
// ============================================

const statistics = {

    totalRequests: 0,

    totalErrors: 0,

    totalTokens: 0,

    averageLatency: 0

};

export function updateStatistics({

    latency,

    tokens,

    error = false

}) {

    statistics.totalRequests++;

    if (error) {

        statistics.totalErrors++;

    }

    statistics.totalTokens += tokens || 0;

    statistics.averageLatency =

        (

            statistics.averageLatency *

            (statistics.totalRequests - 1)

            +

            latency

        ) /

        statistics.totalRequests;

}

export function getStatistics() {

    return {

        ...statistics

    };

}


// ============================================
// Reset complet
// ============================================

export function resetApiService() {

    clearCache();

    clearLogs();

    statistics.totalRequests = 0;

    statistics.totalErrors = 0;

    statistics.totalTokens = 0;

    statistics.averageLatency = 0;

}


export default {

    sendMessage,

    streamMessage,

    collectStream,

    enqueueRequest,

    getCachedResponse,

    saveCachedResponse,

    clearCache,

    canSendRequest,

    checkProviderHealth,

    getProviderInfo,

    getStatistics,

    updateStatistics,

    getLogs,

    clearLogs,

    resetApiService,

    createAbortController,

    abortCurrentRequest,

    isProviderReady

};
