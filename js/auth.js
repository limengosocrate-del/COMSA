/*====================================================
    COMSA v1.0
    Module d'authentification
    Créé par Inspecteur Limengo (Pmiller)
=====================================================*/

// ===============================
// Utilisateurs de démonstration
// ===============================

const users = [

    {
        username: "admin",
        password: "admin123",
        role: "Administrateur",
        fullname: "Administrateur COMSA"
    },

    {
        username: "inspecteur.general",
        password: "ig2026",
        role: "Inspecteur Général",
        fullname: "Inspecteur Général"
    },

    {
        username: "inspecteur",
        password: "inspect2026",
        role: "Inspecteur",
        fullname: "Inspecteur du Travail"
    },

    {
        username: "secretaire",
        password: "secret2026",
        role: "Secrétaire",
        fullname: "Secrétaire Administrative"
    }

];

// ===============================
// Connexion
// ===============================

function login(username, password) {

    const user = users.find(u =>
        u.username === username &&
        u.password === password
    );

    if (!user) {

        alert("Nom d'utilisateur ou mot de passe incorrect.");

        return false;

    }

    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    window.location.href = "dashboard.html";

  /*====================================================
    Gestion de la session
=====================================================*/

// ===============================
// Récupérer l'utilisateur connecté
// ===============================

function getCurrentUser() {

    const user = sessionStorage.getItem("currentUser");

    return user ? JSON.parse(user) : null;

}

// ===============================
// Vérifier si l'utilisateur
// est connecté
// ===============================

function isAuthenticated() {

    return getCurrentUser() !== null;

}

// ===============================
// Protéger une page
// ===============================

function requireAuth() {

    if (!isAuthenticated()) {

        alert("Votre session a expiré. Veuillez vous reconnecter.");

        window.location.href = "login.html";

    }

}

// ===============================
// Déconnexion
// ===============================

function logout() {

    sessionStorage.removeItem("currentUser");

    localStorage.removeItem("rememberedUsername");

    window.location.href = "login.html";

}

// ===============================
// Afficher les informations
// de l'utilisateur connecté
// ===============================

function displayCurrentUser() {

    const user = getCurrentUser();

    if (!user) return;

    const fullname = document.getElementById("currentUserName");
    const role = document.getElementById("currentUserRole");

    if (fullname) {

        fullname.textContent = user.fullname;

    }

    if (role) {

        role.textContent = user.role;

    }

}
  

}

/*====================================================
    Gestion des rôles et des autorisations
=====================================================*/

// ===============================
// Vérifier le rôle actuel
// ===============================

function hasRole(role) {

    const user = getCurrentUser();

    if (!user) {

        return false;

    }

    return user.role === role;

}

// ===============================
// Vérifier plusieurs rôles
// ===============================

function hasAnyRole(roles = []) {

    const user = getCurrentUser();

    if (!user) {

        return false;

    }

    return roles.includes(user.role);

}

// ===============================
// Protéger une page selon le rôle
// ===============================

function requireRole(role) {

    requireAuth();

    if (!hasRole(role)) {

        alert("Vous n'avez pas les droits nécessaires pour accéder à cette page.");

        window.location.href = "dashboard.html";

    }

}

// ===============================
// Protéger une page selon plusieurs rôles
// ===============================

function requireAnyRole(roles = []) {

    requireAuth();

    if (!hasAnyRole(roles)) {

        alert("Accès refusé.");

        window.location.href = "dashboard.html";

    }

}

// ===============================
// Vérifier si l'utilisateur est Administrateur
// ===============================

function isAdmin() {

    return hasRole("Administrateur");

}

// ===============================
// Vérifier si l'utilisateur est Inspecteur Général
// ===============================

function isInspecteurGeneral() {

    return hasRole("Inspecteur Général");

}

// ===============================
// Vérifier si l'utilisateur est Inspecteur
// ===============================

function isInspecteur() {

    return hasRole("Inspecteur");

}

// ===============================
// Vérifier si l'utilisateur est Secrétaire
// ===============================

function isSecretaire() {

    return hasRole("Secrétaire");

}

/*====================================================
    Tableau de bord et gestion de session
=====================================================*/

// ===============================
// Initialiser les informations
// du tableau de bord
// ===============================

function initDashboard() {

    requireAuth();

    displayCurrentUser();

    const user = getCurrentUser();

    if (!user) return;

    const welcome = document.getElementById("welcomeMessage");

    if (welcome) {

        welcome.textContent =
            `Bienvenue, ${user.fullname} (${user.role})`;

    }

    const lastLogin = document.getElementById("lastLogin");

    if (lastLogin) {

        const date = sessionStorage.getItem("lastLogin");

        if (date) {

            lastLogin.textContent = date;

        } else {

            const now = new Date().toLocaleString("fr-FR");

            sessionStorage.setItem("lastLogin", now);

            lastLogin.textContent = now;

        }

    }

}

// ===============================
// Expiration automatique
// de la session
// ===============================

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

let sessionTimer;

function resetSessionTimer() {

    clearTimeout(sessionTimer);

    sessionTimer = setTimeout(() => {

        alert("Votre session a expiré.");

        logout();

    }, SESSION_TIMEOUT);

}

// ===============================
// Réinitialiser le délai
// à chaque activité utilisateur
// ===============================

[
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart"
].forEach(event => {

    document.addEventListener(event, resetSessionTimer);

});

// Démarrage du minuteur
resetSessionTimer();

/*====================================================
    Fonctions utilitaires
=====================================================*/

// ===============================
// Retourner le rôle courant
// ===============================

function getCurrentRole() {

    const user = getCurrentUser();

    return user ? user.role : null;

}

// ===============================
// Retourner le nom complet
// ===============================

function getCurrentFullName() {

    const user = getCurrentUser();

    return user ? user.fullname : "";

}

// ===============================
// Vérifier si une session existe
// ===============================

window.addEventListener("load", () => {

    if (sessionStorage.getItem("currentUser")) {

        resetSessionTimer();

    }

});

// ===============================
// Export des fonctions
// ===============================

window.COMSAAuth = {

    login,
    logout,

    getCurrentUser,
    getCurrentRole,
    getCurrentFullName,

    isAuthenticated,

    hasRole,
    hasAnyRole,

    requireAuth,
    requireRole,
    requireAnyRole,

    isAdmin,
    isInspecteurGeneral,
    isInspecteur,
    isSecretaire,

    displayCurrentUser,
    initDashboard

};

console.log("COMSA Auth v1.0 chargé avec succès.");

/*====================================================
    COMSA v1.0 
    Module : auth.js

    Développé pour :
    Inspection Générale du Travail

    Créé par :
    Inspecteur Limengo (Pmiller)
    
    © 2026 - Tous droits réservés.
=====================================================*/
