/*====================================================
    COMSA v1.0
    Login JavaScript
    Créé par Inspecteur Limengo (Pmiller)
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    // Éléments
    const loginForm = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    const assistantBtn = document.getElementById("assistantBtn");
    const assistantWindow = document.getElementById("assistantWindow");
    const closeAssistant = document.getElementById("closeAssistant");

    const themeToggle = document.getElementById("themeToggle");

    const clock = document.getElementById("clock");
    const todayDate = document.getElementById("todayDate");

    const dailyQuote = document.getElementById("dailyQuote");
    const dailyJoke = document.getElementById("dailyJoke");

    // ===============================
    // Afficher / Masquer le mot de passe
    // ===============================

    togglePassword.addEventListener("click", () => {

        const type =
            password.getAttribute("type") === "password"
            ? "text"
            : "password";

        password.setAttribute("type", type);

        togglePassword.innerHTML =
            type === "password"
            ? '<i class="fa fa-eye"></i>'
            : '<i class="fa fa-eye-slash"></i>';

    });

         // ===============================
    // Horloge en temps réel
    // ===============================

    function updateClock() {

        const now = new Date();

        const heure = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const seconde = String(now.getSeconds()).padStart(2, "0");

        clock.textContent = `${heure}:${minute}:${seconde}`;

        const jours = [
            "Dimanche","Lundi","Mardi",
            "Mercredi","Jeudi","Vendredi","Samedi"
        ];

        const mois = [
            "Janvier","Février","Mars","Avril",
            "Mai","Juin","Juillet","Août",
            "Septembre","Octobre","Novembre","Décembre"
        ];

        todayDate.textContent =
            `${jours[now.getDay()]} ${now.getDate()} ${mois[now.getMonth()]} ${now.getFullYear()}`;

    }

    updateClock();

    setInterval(updateClock,1000);

    // ===============================
    // Assistant COMSA
    // ===============================

    assistantBtn.addEventListener("click",()=>{

        assistantWindow.classList.toggle("show");

    });

    closeAssistant.addEventListener("click",()=>{

        assistantWindow.classList.remove("show");

    });

    // ===============================
    // Mode sombre
    // ===============================

    if(localStorage.getItem("theme") === "dark"){

        document.body.classList.add("dark-mode");

        themeToggle.innerHTML =
            '<i class="fas fa-sun"></i>';

    }

    themeToggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){

            localStorage.setItem("theme","dark");

            themeToggle.innerHTML =
                '<i class="fas fa-sun"></i>';

        }else{

            localStorage.setItem("theme","light");

            themeToggle.innerHTML =
                '<i class="fas fa-moon"></i>';

        }

    });

      // ===============================
    // Notifications
    // ===============================

    function showNotification(message, type = "success") {

        const container = document.getElementById("notificationContainer");

        const notification = document.createElement("div");

        notification.className = "notification";

        if(type === "error"){

            notification.style.background = "#dc3545";

        }

        if(type === "warning"){

            notification.style.background = "#ffc107";

            notification.style.color = "#212529";

        }

        notification.innerHTML = message;

        container.appendChild(notification);

        setTimeout(() => {

            notification.remove();

        }, 4000);

    }

    // ===============================
    // Citation du jour
    // ===============================

    if(typeof citations !== "undefined"){

        const index = Math.floor(Math.random() * citations.length);

        dailyQuote.textContent = citations[index];

    }

    // ===============================
    // Sourire du jour
    // ===============================

    if(typeof jokes !== "undefined"){

        const index = Math.floor(Math.random() * jokes.length);

        dailyJoke.textContent = jokes[index];

    }

    // ===============================
    // Connexion
    // ===============================

    loginForm.addEventListener("submit",(e)=>{

        e.preventDefault();

        const user = username.value.trim();

        const pass = password.value.trim();

        if(user === "" || pass === ""){

            showNotification(
                "Veuillez remplir tous les champs.",
                "warning"
            );

            return;

        }

        showNotification(
            "Vérification des informations..."
        );

        setTimeout(()=>{

            if(typeof login === "function"){

                login(user,pass);

            }else{

                showNotification(
                    "Le module d'authentification est introuvable.",
                    "error"
                );

            }

        },1000);

    });

      // ===============================
    // Se souvenir de moi
    // ===============================

    const rememberMe = document.getElementById("rememberMe");

    if (rememberMe) {

        const savedUsername = localStorage.getItem("rememberedUsername");

        if (savedUsername) {

            username.value = savedUsername;
            rememberMe.checked = true;

        }

    }

    // ===============================
    // Raccourcis clavier
    // ===============================

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            assistantWindow.classList.remove("show");

        }

        if (e.key === "Enter") {

            if (document.activeElement === username ||
                document.activeElement === password) {

                loginForm.requestSubmit();

            }

        }

    });

    // ===============================
    // Gestion du bouton Connexion
    // ===============================

    const loginButton = loginForm.querySelector("button[type='submit']");

    loginForm.addEventListener("submit", () => {

        loginButton.disabled = true;

        loginButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Connexion...
        `;

        if (rememberMe && rememberMe.checked) {

            localStorage.setItem(
                "rememberedUsername",
                username.value.trim()
            );

        } else {

            localStorage.removeItem("rememberedUsername");

        }

        setTimeout(() => {

            loginButton.disabled = false;

            loginButton.innerHTML = `
                <i class="fas fa-sign-in-alt me-2"></i>
                Se connecter
            `;

        }, 3000);

    });

    // ===============================
    // Message de bienvenue
    // ===============================

    setTimeout(() => {

        showNotification(
            "Bienvenue sur COMSA v1.0 👋"
        );

    }, 700);

      // ===============================
    // Vérification des éléments
    // ===============================

    console.log("COMSA v1.0 - Login chargé.");

    const statusMessage = document.getElementById("statusMessage");

    if (statusMessage) {

        statusMessage.textContent =
            "COMSA prêt - Système opérationnel.";

    }

    // ===============================
    // Fermeture automatique de
    // l'assistant lors d'un clic
    // à l'extérieur
    // ===============================

    document.addEventListener("click", (event) => {

        if (
            assistantWindow &&
            assistantWindow.classList.contains("show") &&
            !assistantWindow.contains(event.target) &&
            !assistantBtn.contains(event.target)
        ) {

            assistantWindow.classList.remove("show");

        }

    });

    // ===============================
    // Préchargement
    // ===============================

    window.addEventListener("load", () => {

        console.log("Tous les fichiers COMSA sont chargés.");

    });

}); // Fin de DOMContentLoaded

/*====================================================
    COMSA v1.0 2026
    Module : login.js

    Développé pour :
    Inspection Générale du Travail

    Créé par
    Inspecteur Limengo (Pmiller)
=====================================================*/

                        
