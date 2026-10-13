import { initializeApp, getApps }
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getAuth, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

    /* FIREBASE CONFIG */

    const firebaseConfig = {

      apiKey: "AIzaSyB4srPzYoTzploFgfsnSt7rg6sKKAVK6xo",

      authDomain:
        "portfolio-signin-html.firebaseapp.com",

      projectId:
        "portfolio-signin-html",

      storageBucket:
        "portfolio-signin-html.firebasestorage.app",

      messagingSenderId:
        "435126326109",

      appId:
        "1:435126326109:web:9dee9abbc93c3c104b4eb4",

      measurementId:
        "G-7YK2HQL61F"

    };

const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    if (user) {
        await loadUnlockedPages();
        await loadMultiplierSettings(user);
    } else {
        renderUnlockedPages([]);
        await loadMultiplierSettings(null);
    }
});

async function saveUnlockedPage(page) {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);

    await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(userRef);
        const data = snapshot.exists() ? snapshot.data() : {};

        const counts = data.pageWinCounts || {};

        transaction.set(userRef, {
            unlockedPages: arrayUnion(page),
            unlockedMultipliers: arrayUnion(page),
            pageWinCounts: {
                ...counts,
                [page]: (counts[page] || 0) + 1
            }
        }, { merge: true });
    });

    await loadUnlockedPages();
    await loadMultiplierSettings(currentUser);
}

async function loadUnlockedPages() {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const snapshot = await getDoc(userRef);
    const data = snapshot.exists() ? snapshot.data() : {};

    renderUnlockedPages(data.unlockedPages || []);
}

function renderUnlockedPages(pages) {
    const container = document.getElementById("unlockedPages");
    const message = document.getElementById("collectionMessage");

if (!container || !message) return;

container.replaceChildren();

if (!currentUser) {
    message.replaceChildren();

    message.append(" ");

    const signInLink = document.createElement("a");
    signInLink.href = "dashboard.html";
    signInLink.textContent = "Sign in";
    signInLink.style.color = "#f9e13d";
    signInLink.style.textDecoration = "underline";

    message.append(
        signInLink,
        " to keep your collection!"
    );

    return;
}

message.textContent = pages.length
    ? `${pages.length} page${pages.length === 1 ? "" : "s"} unlocked`
    : "Win a prize to unlock your first page!";

pages.forEach((page) => {
    const card = document.createElement("a");
    card.className = "unlocked-card";
    card.href = page;

    const image = document.createElement("img");
    image.src = `images/previews/${page.replace(".html", ".png")}`;
    image.alt = page.replace(".html", "");

    image.onerror = () => {
        image.onerror = null;
        image.src = "images/preview-placeholder.png";
    };

    const label = document.createElement("span");
label.textContent = "";

    card.append(image, label);
    container.appendChild(card);
});

}

window.saveUnlockedPage = saveUnlockedPage;





const MULTIPLIER_OPTIONS = [
    { page: "apple.html", image: "apple" },
    { page: "apricot.html", image: "apricot" },
    { page: "banana.html", image: "banana" },
    { page: "big-win.html", image: "big_win" },
    { page: "cherry.html", image: "cherry" },
    { page: "grapes.html", image: "grapes" },
    { page: "lemon.html", image: "lemon" },
    { page: "lucky-seven.html", image: "lucky_seven" },
    { page: "orange.html", image: "orange" },
    { page: "pear.html", image: "pear" },
    { page: "strawberry.html", image: "strawberry" },
    { page: "watermelon.html", image: "watermelon" },

    {
        page: "multiple-fruits.html",
        image: "multiple-fruits",
        preview: true
    },
    {
        page: "four-across.html",
        image: "four-across",
        preview: true
    },
    {
        page: "five-across.html",
        image: "five-across",
        preview: true
    },
    {
        page: "full-screen.html",
        image: "full-screen",
        preview: true
    }
];

window.activeMultipliers = {};
window.unlockedMultipliers = [];

async function loadMultiplierSettings(user = currentUser) {
    if (!user) {
        window.activeMultipliers = {};
        window.unlockedMultipliers = [];
        renderMultiplierControls();
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        const data = snapshot.exists() ? snapshot.data() : {};

        // Existing unlocked prizes also unlock their multipliers.
window.unlockedMultipliers = [
    ...new Set([
        ...(data.unlockedPages || []),
        ...(data.unlockedMultipliers || [])
    ])
];

        window.activeMultipliers =
            data.activeMultipliers || {};

        renderMultiplierControls();
    } catch (error) {
        console.error("Could not load multipliers:", error);
    }
}

async function setMultiplierActive(page, active) {
    if (!currentUser) return;

    if (!window.unlockedMultipliers.includes(page)) {
        return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    try {
        await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(userRef);
            const data = snapshot.exists() ? snapshot.data() : {};

const unlocked = [
    ...new Set([
        ...(data.unlockedPages || []),
        ...(data.unlockedMultipliers || [])
    ])
];

            if (!unlocked.includes(page)) {
                throw new Error("This multiplier has not been unlocked.");
            }

            const activeSettings = {
                ...(data.activeMultipliers || {}),
                [page]: active
            };

            transaction.set(userRef, {
                activeMultipliers: activeSettings
            }, { merge: true });
        });

        window.activeMultipliers = {
            ...window.activeMultipliers,
            [page]: active
        };

        renderMultiplierControls();
    } catch (error) {
        console.error("Could not save multiplier setting:", error);
        await loadMultiplierSettings(currentUser);
    }
}

function renderMultiplierControls() {
    const container = document.getElementById("multiplierControls");

    if (!container) return;

    container.replaceChildren();

    MULTIPLIER_OPTIONS.forEach((option) => {
        const unlocked =
            window.unlockedMultipliers.includes(option.page);

        const active =
            window.activeMultipliers[option.page] === true;

        const label = document.createElement("label");
        label.className = "multiplier-option";

        if (active) label.classList.add("active");
        if (!unlocked) label.classList.add("locked");

        label.title = unlocked
            ? `${option.page.replace(".html", "")} multiplier`
            : "Win this prize to unlock its multiplier";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = active;
        checkbox.disabled = !unlocked;
        checkbox.setAttribute(
            "aria-label",
            `${option.page.replace(".html", "")} multiplier`
        );

        const image = document.createElement("img");

        image.src = option.preview
            ? `images/previews/${option.image}.png`
            : `items/${option.image}.png`;

        image.alt = "";

        image.onerror = () => {
            image.onerror = null;
            image.src = "items/big_win.png";
        };

        checkbox.addEventListener("change", () => {
            setMultiplierActive(option.page, checkbox.checked);
        });

        label.append(checkbox, image);
        container.appendChild(label);
    });
}



// Make these functions available to other scripts if needed.
window.loadMultiplierSettings = loadMultiplierSettings;
window.setMultiplierActive = setMultiplierActive;