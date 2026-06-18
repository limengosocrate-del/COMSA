/*====================================================
    COMSA v1.0
    dashboard.js

    Créé par Inspecteur Limengo (Pmiller)
=====================================================*/

/* ==========================================
   Variables globales
========================================== */

let currentUser = null;

let assistantOpened = false;

/* ==========================================
   Initialisation
========================================== */

function initDashboard() {

    loadUser();

    loadStatistics();

    loadRecentFiles();

    loadRecentActivities();

    initAssistant();

    initDarkMode();

    initLogout();

}

/* ==========================================
   Chargement de l'utilisateur
========================================== */

function loadUser() {

    const userData = localStorage.getItem("comsa_user");

    if (!userData) {

        window.location.href = "login.html";

        return;

    }

    currentUser = JSON.parse(userData);

    const fullName = document.getElementById("profileFullName");

    const role = document.getElementById("profileRole");

    if (fullName) {

        fullName.textContent = currentUser.fullName || "Utilisateur";

    }

    if (role) {

        role.textContent = currentUser.role || "Inspecteur";

    }

          }
/* ==========================================
   Statistiques
========================================== */

function loadStatistics() {

    const stats = {

        dossiers: 128,

        entreprises: 56,

        inspections: 34,

        rapports: 18

    };

    updateElement("totalFiles", stats.dossiers);

    updateElement("totalCompanies", stats.entreprises);

    updateElement("totalInspections", stats.inspections);

    updateElement("totalReports", stats.rapports);

}

/* ==========================================
   Derniers dossiers
========================================== */

function loadRecentFiles() {

    const files = [

        "Inspection - Société Alpha",

        "Contrôle Chantier Delta",

        "Rapport Usine Beta",

        "Visite Entreprise Gamma"

    ];

    const list = document.getElementById("recentFiles");

    if (!list) return;

    list.innerHTML = "";

    files.forEach(file => {

        const item = document.createElement("li");

        item.className = "list-group-item";

        item.innerHTML = `<i class="fas fa-folder-open text-primary me-2"></i>${file}`;

        list.appendChild(item);

    });

}

/* ==========================================
   Activités récentes
========================================== */

function loadRecentActivities() {

    const container = document.getElementById("recentActivities");

    if (!container) return;

    container.innerHTML = `
        <div>✅ Nouveau dossier créé.</div>
        <div>🏢 Entreprise ajoutée.</div>
        <div>📋 Inspection programmée.</div>
        <div>📄 Rapport généré.</div>
    `;

}

/* ==========================================
   Utilitaire
========================================== */

function updateElement(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

                  }

/* ==========================================
   Assistant COMSA
========================================== */

function initAssistant() {

    const button = document.getElementById("assistantButton");

    const windowAssistant = document.getElementById("assistantWindow");

    if (!button || !windowAssistant) return;

    button.addEventListener("click", () => {

        assistantOpened = !assistantOpened;

        windowAssistant.style.display = assistantOpened ? "block" : "none";

    });

}

/* ==========================================
   Mode sombre
========================================== */

function initDarkMode() {

    const savedMode = localStorage.getItem("comsa_darkmode");

    if (savedMode === "true") {

        document.body.classList.add("dark-mode");

    }

    const darkModeButton = document.getElementById("darkModeToggle");

    if (darkModeButton) {

        darkModeButton.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "comsa_darkmode",
                document.body.classList.contains("dark-mode")
            );

        });

    }

}

/* ==========================================
   Messages rapides
========================================== */

function showNotification(message) {

    alert(message);

}

/* ==========================================
   Actions rapides
========================================== */

function openModule(moduleName) {

    console.log("Ouverture du module :", moduleName);

    showNotification("Module : " + moduleName);

}

/* ==========================================
   Déconnexion
========================================== */

function initLogout() {

    const logoutButton = document.getElementById("logoutBtn");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", logout);

}

function logout() {

    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {

        localStorage.removeItem("comsa_user");

        window.location.href = "login.html";

    }

}

/* ==========================================
   Date et heure
========================================== */

function startClock() {

    const clock = document.getElementById("currentDateTime");

    if (!clock) return;

    setInterval(() => {

        const now = new Date();

        clock.textContent = now.toLocaleString("fr-FR");

    }, 1000);

}

/* ==========================================
   Rafraîchissement automatique
========================================== */

function autoRefresh() {

    setInterval(() => {

        loadStatistics();

        loadRecentActivities();

    }, 60000);

}

/* ==========================================
   Démarrage automatique
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    startClock();

    autoRefresh();

});

/* ==========================================
   Notifications
========================================== */

function addNotification(message) {

    const list = document.getElementById("notificationList");

    if (!list) return;

    if (list.children.length === 1 &&
        list.children[0].textContent.includes("Aucune notification")) {

        list.innerHTML = "";

    }

    const item = document.createElement("li");

    item.className = "list-group-item";

    item.innerHTML = `
        <i class="fas fa-bell text-warning me-2"></i>
        ${message}
        <br>
        <small class="text-muted">
            ${new Date().toLocaleString("fr-FR")}
        </small>
    `;

    list.prepend(item);

}

/* ==========================================
   Vérification de session
========================================== */

function checkSession() {

    const user = localStorage.getItem("comsa_user");

    if (!user) {

        window.location.href = "login.html";

    }

}

/* ==========================================
   Initialisation finale
========================================== */

window.addEventListener("load", () => {

    checkSession();

    addNotification("Bienvenue sur COMSA.");

    console.log("COMSA Dashboard initialisé avec succès.");

});

/* ==========================================
   Fin du fichier
========================================== */

/*
=========================================================
COMSA v1.0

Fichier : dashboard.js

Inspection Générale du Travail

Créé par :
Inspecteur Limengo (Pmiller)

© 2026 - Tous droits réservés.
=========================================================
*/
