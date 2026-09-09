/* =========================================================
   SIBUSEC — DIGITAL DEFENSE NETWORK
   Built by Sibu Behera
========================================================= */

const canvas = document.getElementById("cyber-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

const mouse = {
    x: 0,
    y: 0,
    active: false
};

const particles = [];
const nodes = [];
const packets = [];

const PARTICLES = 95;
const NODES = 16;
const PACKETS = 12;

/* =========================================================
   RESIZE
========================================================= */

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    mouse.x = width / 2;
    mouse.y = height / 2;
}

window.addEventListener("resize", resize);

/* =========================================================
   MOUSE
========================================================= */

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
});

window.addEventListener("mouseleave", () => {
    mouse.active = false;
});

/* =========================================================
   RANDOM
========================================================= */

function random(min, max) {
    return Math.random() * (max - min) + min;
}

/* =========================================================
   3D PARTICLES
========================================================= */

function createParticles() {
    particles.length = 0;

    for (let i = 0; i < PARTICLES; i++) {

        particles.push({
            x: random(-900, 900),
            y: random(-500, 500),
            z: random(50, 1400),
            speed: random(0.25, 0.9),
            size: random(0.6, 2)
        });
    }
}

function project(p) {

    const depth = 650;

    const scale = depth / (depth + p.z);

    const mouseX = mouse.active
        ? (mouse.x - width / 2) * 0.025
        : 0;

    const mouseY = mouse.active
        ? (mouse.y - height / 2) * 0.015
        : 0;

    return {
        x: width / 2 + p.x * scale + mouseX,
        y: height / 2 + p.y * scale + mouseY,
        scale
    };
}

/* =========================================================
   NETWORK NODES
========================================================= */

function createNodes() {
    nodes.length = 0;

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < NODES; i++) {

        const angle =
            (Math.PI * 2 / NODES) * i;

        const radius =
            random(180, 330);

        nodes.push({
            angle,
            radius,
            speed: random(0.00025, 0.0007),
            pulse: random(0, Math.PI * 2),
            type: i % 4 === 0 ? "threat" : "defense"
        });
    }
}

/* =========================================================
   PACKETS
========================================================= */

function createPackets() {

    packets.length = 0;

    for (let i = 0; i < PACKETS; i++) {

        packets.push({
            angle: random(0, Math.PI * 2),
            radius: random(100, 330),
            speed: random(0.004, 0.012),
            direction: Math.random() > 0.5 ? 1 : -1,
            type: Math.random() > 0.7
                ? "threat"
                : "defense"
        });
    }
}

/* =========================================================
   BACKGROUND ATMOSPHERE
========================================================= */

function drawAtmosphere() {

    const centerX = width / 2;
    const centerY = height / 2;

    const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        Math.min(width, height) * 0.55
    );

    gradient.addColorStop(
        0,
        "rgba(0,255,195,0.07)"
    );

    gradient.addColorStop(
        0.35,
        "rgba(70,80,255,0.025)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );
}

/* =========================================================
   PARTICLES
========================================================= */

function drawParticles() {

    const projected = [];

    for (const particle of particles) {

        particle.z -= particle.speed;

        if (particle.z < -450) {
            particle.z = 1400;
            particle.x = random(-900, 900);
            particle.y = random(-500, 500);
        }

        const p = project(particle);

        projected.push({
            ...p,
            original: particle
        });
    }

    /* Connections */

    for (let i = 0; i < projected.length; i++) {

        for (let j = i + 1; j < projected.length; j++) {

            const a = projected[i];
            const b = projected[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 115) {

                const opacity =
                    (1 - distance / 115) *
                    0.13 *
                    Math.min(a.scale, b.scale);

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    `rgba(0,255,195,${opacity})`;

                ctx.lineWidth = 0.5;

                ctx.stroke();
            }
        }
    }

    /* Nodes */

    for (const point of projected) {

        const radius =
            point.original.size *
            point.scale *
            2;

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(0,255,195,${0.3 + point.scale * 0.7})`;

        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,255,195,.5)";

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

/* =========================================================
   DIGITAL DEFENSE CORE
========================================================= */

function drawCore(time) {

    const centerX =
        width / 2 +
        (mouse.active
            ? (mouse.x - width / 2) * 0.018
            : 0);

    const centerY =
        height / 2 +
        (mouse.active
            ? (mouse.y - height / 2) * 0.012
            : 0);

    /* Main aura */

    const aura = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        260
    );

    aura.addColorStop(
        0,
        "rgba(0,255,195,.16)"
    );

    aura.addColorStop(
        0.25,
        "rgba(0,255,195,.055)"
    );

    aura.addColorStop(
        1,
        "rgba(0,255,195,0)"
    );

    ctx.fillStyle = aura;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        260,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* Core rings */

    const rings = [
        { radius: 90, speed: 0.45 },
        { radius: 135, speed: -0.28 },
        { radius: 185, speed: 0.18 },
        { radius: 235, speed: -0.1 }
    ];

    for (const ring of rings) {

        const rotation =
            time * ring.speed;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            ring.radius,
            rotation,
            rotation + Math.PI * 1.55
        );

        ctx.strokeStyle =
            "rgba(0,255,195,.13)";

        ctx.lineWidth = 1;

        ctx.stroke();

        /* Ring endpoint */

        const px =
            centerX +
            Math.cos(rotation + Math.PI * 1.55)
            * ring.radius;

        const py =
            centerY +
            Math.sin(rotation + Math.PI * 1.55)
            * ring.radius;

        ctx.beginPath();

        ctx.arc(
            px,
            py,
            3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,255,195,.8)";

        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0,255,195,.8)";

        ctx.fill();

        ctx.shadowBlur = 0;
    }

    /* Inner hexagon */

    drawHexagon(
        centerX,
        centerY,
        58,
        time * 0.2
    );

    /* Core */

    const pulse =
        1 + Math.sin(time * 2.5) * 0.08;

    const core = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        65 * pulse
    );

    core.addColorStop(
        0,
        "rgba(255,255,255,.95)"
    );

    core.addColorStop(
        0.08,
        "rgba(0,255,195,.95)"
    );

    core.addColorStop(
        0.3,
        "rgba(0,255,195,.35)"
    );

    core.addColorStop(
        1,
        "rgba(0,255,195,0)"
    );

    ctx.fillStyle = core;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        65 * pulse,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

/* =========================================================
   HEXAGON
========================================================= */

function drawHexagon(x, y, radius, rotation) {

    ctx.beginPath();

    for (let i = 0; i <= 6; i++) {

        const angle =
            rotation +
            (Math.PI * 2 / 6) * i;

        const px =
            x + Math.cos(angle) * radius;

        const py =
            y + Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.strokeStyle =
        "rgba(0,255,195,.28)";

    ctx.lineWidth = 1.5;

    ctx.stroke();
}

/* =========================================================
   ORBIT NETWORK
========================================================= */

function drawNetwork(time) {

    const centerX = width / 2;
    const centerY = height / 2;

    const positions = [];

    for (const node of nodes) {

        node.angle += node.speed;

        const x =
            centerX +
            Math.cos(node.angle) *
            node.radius;

        const y =
            centerY +
            Math.sin(node.angle) *
            node.radius *
            0.58;

        positions.push({
            x,
            y,
            type: node.type,
            pulse: node.pulse
        });
    }

    /* Connections to core */

    for (const point of positions) {

        ctx.beginPath();

        ctx.moveTo(centerX, centerY);
        ctx.lineTo(point.x, point.y);

        if (point.type === "threat") {

            ctx.strokeStyle =
                "rgba(255,130,60,.10)";

        } else {

            ctx.strokeStyle =
                "rgba(0,255,195,.08)";
        }

        ctx.lineWidth = 1;

        ctx.stroke();
    }

    /* Node-to-node connections */

    for (let i = 0; i < positions.length; i++) {

        const a = positions[i];

        for (let j = i + 1; j < positions.length; j++) {

            const b = positions[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 170) {

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    "rgba(100,120,255,.07)";

                ctx.lineWidth = 0.7;

                ctx.stroke();
            }
        }
    }

    /* Nodes */

    for (const point of positions) {

        const pulse =
            2 +
            Math.sin(time * 2 + point.pulse) *
            0.8;

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            pulse + 1,
            0,
            Math.PI * 2
        );

        if (point.type === "threat") {

            ctx.fillStyle =
                "rgba(255,125,55,.85)";

            ctx.shadowColor =
                "rgba(255,100,40,.7)";

        } else {

            ctx.fillStyle =
                "rgba(0,255,195,.85)";

            ctx.shadowColor =
                "rgba(0,255,195,.7)";
        }

        ctx.shadowBlur = 12;

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

/* =========================================================
   MOVING DATA PACKETS
========================================================= */

function drawPackets(time) {

    const centerX = width / 2;
    const centerY = height / 2;

    for (const packet of packets) {

        packet.angle +=
            packet.speed *
            packet.direction;

        const x =
            centerX +
            Math.cos(packet.angle) *
            packet.radius;

        const y =
            centerY +
            Math.sin(packet.angle) *
            packet.radius *
            0.58;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            2.5,
            0,
            Math.PI * 2
        );

        if (packet.type === "threat") {

            ctx.fillStyle =
                "rgba(255,115,50,.95)";

            ctx.shadowColor =
                "rgba(255,100,30,.8)";

        } else {

            ctx.fillStyle =
                "rgba(0,255,195,.95)";

            ctx.shadowColor =
                "rgba(0,255,195,.8)";
        }

        ctx.shadowBlur = 14;

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

/* =========================================================
   ANIMATION
========================================================= */

function animate() {

    const time = performance.now() / 1000;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawAtmosphere();

    drawParticles();

    drawNetwork(time);

    drawPackets(time);

    drawCore(time);

    requestAnimationFrame(animate);
}

/* =========================================================
   START
========================================================= */

resize();

createParticles();

createNodes();

createPackets();

animate();

/* =========================================
   SIBUSEC - PASSWORD STRENGTH CHECKER
   ========================================= */

const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const checkPassword = document.getElementById("checkPassword");

const strengthText = document.getElementById("strengthText");
const strengthProgress = document.getElementById("strengthProgress");

const lengthCheck = document.getElementById("lengthCheck");
const upperCheck = document.getElementById("upperCheck");
const lowerCheck = document.getElementById("lowerCheck");
const numberCheck = document.getElementById("numberCheck");
const specialCheck = document.getElementById("specialCheck");


/* SHOW / HIDE PASSWORD */

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "👁";

        }

    });

}


/* CHECK PASSWORD */

if (checkPassword) {

    checkPassword.addEventListener("click", analyzePassword);

}


function analyzePassword() {

    const password = passwordInput.value;

    if (!password) {

        strengthText.textContent = "ENTER PASSWORD";
        strengthProgress.style.width = "0%";

        resetChecks();

        return;
    }


    /* PASSWORD CONDITIONS */

    const hasLength = password.length >= 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);


    /* SCORE */

    let score = 0;

    if (password.length >= 8) score++;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;


    /* UPDATE CHECKS */

    updateCheck(lengthCheck, hasLength, "12+ characters");
    updateCheck(upperCheck, hasUpper, "Uppercase letter");
    updateCheck(lowerCheck, hasLower, "Lowercase letter");
    updateCheck(numberCheck, hasNumber, "Number");
    updateCheck(specialCheck, hasSpecial, "Special character");


    /* STRENGTH */

    if (score <= 2) {

        strengthText.textContent = "WEAK";
        strengthProgress.style.width = "25%";

    } else if (score <= 4) {

        strengthText.textContent = "MEDIUM";
        strengthProgress.style.width = "60%";

    } else {

        strengthText.textContent = "STRONG";
        strengthProgress.style.width = "100%";

    }

}


/* UPDATE CHECK ITEM */

function updateCheck(element, passed, text) {

    if (!element) return;

    if (passed) {

        element.textContent = "✓ " + text;
        element.classList.add("check-pass");

    } else {

        element.textContent = "○ " + text;
        element.classList.remove("check-pass");

    }

}


/* RESET */

function resetChecks() {

    updateCheck(lengthCheck, false, "12+ characters");
    updateCheck(upperCheck, false, "Uppercase letter");
    updateCheck(lowerCheck, false, "Lowercase letter");
    updateCheck(numberCheck, false, "Number");
    updateCheck(specialCheck, false, "Special character");

}

/* =========================================
   SIBUSEC - URL ANALYZER
   ========================================= */

const urlInput = document.getElementById("urlInput");
const analyzeURL = document.getElementById("analyzeURL");
const urlResult = document.getElementById("urlResult");


if (analyzeURL) {

    analyzeURL.addEventListener("click", analyzeURLSecurity);

}


function analyzeURLSecurity() {

    const input = urlInput.value.trim();

    if (!input) {

        showURLResult("PLEASE ENTER A URL", "warning");

        return;
    }


    let url;

    try {

        url = new URL(input);

    } catch (error) {

        showURLResult("INVALID URL FORMAT", "danger");

        return;
    }


    let warnings = [];


    /* HTTPS CHECK */

    if (url.protocol !== "https:") {

        warnings.push("Connection is not using HTTPS");

    }


    /* IP ADDRESS CHECK */

    const ipPattern =
        /^(?:\d{1,3}\.){3}\d{1,3}$/;

    if (ipPattern.test(url.hostname)) {

        warnings.push("Direct IP address detected");

    }


    /* @ SYMBOL */

    if (input.includes("@")) {

        warnings.push("@ symbol detected");

    }


    /* URL LENGTH */

    if (input.length > 100) {

        warnings.push("Unusually long URL");

    }


    /* SUSPICIOUS KEYWORDS */

    const suspiciousKeywords = [
        "login",
        "verify",
        "account",
        "secure",
        "update",
        "password",
        "confirm"
    ];

    const lowerURL = input.toLowerCase();

    const foundKeywords =
        suspiciousKeywords.filter(
            keyword => lowerURL.includes(keyword)
        );


    if (foundKeywords.length >= 2) {

        warnings.push(
            "Multiple security-sensitive keywords detected"
        );

    }


    /* SUBDOMAIN CHECK */

    const hostnameParts =
        url.hostname.split(".");

    if (hostnameParts.length > 4) {

        warnings.push("Many subdomains detected");

    }


    /* FINAL RESULT */

    if (warnings.length === 0) {

        showURLResult(
            "LOW RISK — NO BASIC INDICATORS FOUND",
            "safe"
        );

    } else {

        showURLResult(
            warnings.length +
            " POTENTIAL INDICATOR(S) FOUND",
            "warning"
        );

    }

}


function showURLResult(message, type) {

    urlResult.innerHTML = `
        <span>ANALYSIS STATUS</span>
        <strong>${message}</strong>
    `;

    urlResult.classList.remove(
        "url-safe",
        "url-warning",
        "url-danger"
    );


    if (type === "safe") {

        urlResult.classList.add("url-safe");

    } else if (type === "warning") {

        urlResult.classList.add("url-warning");

    } else {

        urlResult.classList.add("url-danger");

    }

}

// ===============================
// PHISHING DETECTOR
// ===============================

const phishingInput = document.getElementById("phishingInput");
const detectPhishing = document.getElementById("detectPhishing");
const phishingResult = document.getElementById("phishingResult");

if (phishingInput && detectPhishing && phishingResult) {

    detectPhishing.addEventListener("click", detectPhishingURL);

    function detectPhishingURL() {

        const input = phishingInput.value.trim();

        if (!input) {
            phishingResult.innerHTML = `
                <span>THREAT ANALYSIS</span>
                <strong>ENTER A URL</strong>
            `;

            phishingResult.className = "phishing-result url-warning";
            return;
        }

        let url;

        try {
            url = new URL(input);
        } catch (error) {

            phishingResult.innerHTML = `
                <span>THREAT ANALYSIS</span>
                <strong>INVALID URL</strong>
            `;

            phishingResult.className = "phishing-result url-danger";
            return;
        }

        let indicators = [];

        const hostname = url.hostname.toLowerCase();
        const fullURL = input.toLowerCase();

        // 1. HTTPS check
        if (url.protocol !== "https:") {
            indicators.push("No HTTPS");
        }

        // 2. IP address instead of domain
        const ipPattern =
            /^(?:\d{1,3}\.){3}\d{1,3}$/;

        if (ipPattern.test(hostname)) {
            indicators.push("IP address used");
        }

        // 3. @ symbol
        if (input.includes("@")) {
            indicators.push("@ symbol detected");
        }

        // 4. Suspicious keywords
        const suspiciousKeywords = [
            "login",
            "verify",
            "verification",
            "account",
            "update",
            "password",
            "secure",
            "confirm",
            "signin",
            "bank",
            "payment",
            "wallet"
        ];

        const foundKeywords = suspiciousKeywords.filter(
            keyword => fullURL.includes(keyword)
        );

        if (foundKeywords.length >= 2) {
            indicators.push("Multiple suspicious keywords");
        }

        // 5. Very long URL
        if (input.length > 120) {
            indicators.push("Unusually long URL");
        }

        // 6. Too many subdomains
        const hostnameParts = hostname.split(".");

        if (hostnameParts.length > 4) {
            indicators.push("Excessive subdomains");
        }

        // 7. Hyphen-heavy domain
        const hyphenCount =
            (hostname.match(/-/g) || []).length;

        if (hyphenCount >= 3) {
            indicators.push("Suspicious domain structure");
        }

        // ===============================
        // RESULT
        // ===============================

        if (indicators.length === 0) {

            phishingResult.innerHTML = `
                <span>THREAT ANALYSIS</span>
                <strong>LOW RISK</strong>
            `;

            phishingResult.className =
                "phishing-result url-safe";

        } else if (indicators.length <= 2) {

            phishingResult.innerHTML = `
                <span>THREAT ANALYSIS</span>
                <strong>SUSPICIOUS</strong>
            `;

            phishingResult.className =
                "phishing-result url-warning";

        } else {

            phishingResult.innerHTML = `
                <span>THREAT ANALYSIS</span>
                <strong>HIGH RISK</strong>
            `;

            phishingResult.className =
                "phishing-result url-danger";
        }

        console.log("Phishing Indicators:", indicators);
    }
}

// ===============================
// HASH GENERATOR
// ===============================

const hashInput = document.getElementById("hashInput");
const generateHash = document.getElementById("generateHash");

const sha256Output = document.getElementById("sha256Output");
const sha1Output = document.getElementById("sha1Output");
const md5Output = document.getElementById("md5Output");


// SHA-256 / SHA-1 using Web Crypto API
async function generateWebHash(text, algorithm) {

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashBuffer = await crypto.subtle.digest(
        algorithm,
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// MD5 implementation
function md5(string) {

    function rotateLeft(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }

    function addUnsigned(x, y) {
        return (
            (x & 0xFFFFFFFF) +
            (y & 0xFFFFFFFF)
        ) >>> 0;
    }

    function cmn(q, a, b, x, s, t) {
        return addUnsigned(
            rotateLeft(
                addUnsigned(
                    addUnsigned(a, q),
                    addUnsigned(x, t)
                ),
                s
            ),
            b
        );
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn(
            (b & c) | ((~b) & d),
            a, b, x, s, t
        );
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn(
            (b & d) | (c & (~d)),
            a, b, x, s, t
        );
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(
            b ^ c ^ d,
            a, b, x, s, t
        );
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(
            c ^ (b | (~d)),
            a, b, x, s, t
        );
    }

    function toWordArray(str) {

        const bytes = new TextEncoder().encode(str);
        const bitLength = bytes.length * 8;

        const words = [];

        for (let i = 0; i < bytes.length; i++) {
            words[i >> 2] =
                (words[i >> 2] || 0) |
                (bytes[i] << ((i % 4) * 8));
        }

        words[bytes.length >> 2] =
            (words[bytes.length >> 2] || 0) |
            (0x80 << ((bytes.length % 4) * 8));

        const index =
            ((bytes.length + 8) >> 6) + 1;

        while (words.length < index * 16) {
            words.push(0);
        }

        words[index * 16 - 2] =
            bitLength & 0xFFFFFFFF;

        words[index * 16 - 1] =
            Math.floor(bitLength / 0x100000000);

        return words;
    }

    const words = toWordArray(string);

    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;

    for (let i = 0; i < words.length; i += 16) {

        const oldA = a;
        const oldB = b;
        const oldC = c;
        const oldD = d;

        a = ff(a,b,c,d,words[i],7,0xD76AA478);
        d = ff(d,a,b,c,words[i+1],12,0xE8C7B756);
        c = ff(c,d,a,b,words[i+2],17,0x242070DB);
        b = ff(b,a,d,c,words[i+3],22,0xC1BDCEEE);

        a = ff(a,b,c,d,words[i+4],7,0xF57C0FAF);
        d = ff(d,a,b,c,words[i+5],12,0x4787C62A);
        c = ff(c,d,a,b,words[i+6],17,0xA8304613);
        b = ff(b,a,d,c,words[i+7],22,0xFD469501);

        a = ff(a,b,c,d,words[i+8],7,0x698098D8);
        d = ff(d,a,b,c,words[i+9],12,0x8B44F7AF);
        c = ff(c,d,a,b,words[i+10],17,0xFFFF5BB1);
        b = ff(b,a,d,c,words[i+11],22,0x895CD7BE);

        a = ff(a,b,c,d,words[i+12],7,0x6B901122);
        d = ff(d,a,b,c,words[i+13],12,0xFD987193);
        c = ff(c,d,a,b,words[i+14],17,0xA679438E);
        b = ff(b,a,d,c,words[i+15],22,0x49B40821);

        a = gg(a,b,c,d,words[i+1],5,0xF61E2562);
        d = gg(d,a,b,c,words[i+6],9,0xC040B340);
        c = gg(c,d,a,b,words[i+11],14,0x265E5A51);
        b = gg(b,a,d,c,words[i],20,0xE9B6C7AA);

        a = gg(a,b,c,d,words[i+5],5,0xD62F105D);
        d = gg(d,a,b,c,words[i+10],9,0x02441453);
        c = gg(c,d,a,b,words[i+15],14,0xD8A1E681);
        b = gg(b,a,d,c,words[i+4],20,0xE7D3FBC8);

        a = gg(a,b,c,d,words[i+9],5,0x21E1CDE6);
        d = gg(d,a,b,c,words[i+14],9,0xC33707D6);
        c = gg(c,d,a,b,words[i+3],14,0xF4D50D87);
        b = gg(b,a,d,c,words[i+8],20,0x455A14ED);

        a = gg(a,b,c,d,words[i+13],5,0xA9E3E905);
        d = gg(d,a,b,c,words[i+2],9,0xFCEFA3F8);
        c = gg(c,d,a,b,words[i+7],14,0x676F02D9);
        b = gg(b,a,d,c,words[i+12],20,0x8D2A4C8A);

        a = hh(a,b,c,d,words[i+5],4,0xFFFA3942);
        d = hh(d,a,b,c,words[i+8],11,0x8771F681);
        c = hh(c,d,a,b,words[i+11],16,0x6D9D6122);
        b = hh(b,a,d,c,words[i+14],23,0xFDE5380C);

        a = hh(a,b,c,d,words[i+1],4,0xA4BEEA44);
        d = hh(d,a,b,c,words[i+4],11,0x4BDECFA9);
        c = hh(c,d,a,b,words[i+7],16,0xF6BB4B60);
        b = hh(b,a,d,c,words[i+10],23,0xBEBFBC70);

        a = hh(a,b,c,d,words[i+13],4,0x289B7EC6);
        d = hh(d,a,b,c,words[i],11,0xEAA127FA);
        c = hh(c,d,a,b,words[i+3],16,0xD4EF3085);
        b = hh(b,a,d,c,words[i+6],23,0x04881D05);

        a = hh(a,b,c,d,words[i+9],4,0xD9D4D039);
        d = hh(d,a,b,c,words[i+12],11,0xE6DB99E5);
        c = hh(c,d,a,b,words[i+15],16,0x1FA27CF8);
        b = hh(b,a,d,c,words[i+2],23,0xC4AC5665);

        a = ii(a,b,c,d,words[i],6,0xF4292244);
        d = ii(d,a,b,c,words[i+7],10,0x432AFF97);
        c = ii(c,d,a,b,words[i+14],15,0xAB9423A7);
        b = ii(b,a,d,c,words[i+5],21,0xFC93A039);

        a = ii(a,b,c,d,words[i+12],6,0x655B59C3);
        d = ii(d,a,b,c,words[i+3],10,0x8F0CCC92);
        c = ii(c,d,a,b,words[i+10],15,0xFFEFF47D);
        b = ii(b,a,d,c,words[i+1],21,0x85845DD1);

        a = ii(a,b,c,d,words[i+8],6,0x6FA87E4F);
        d = ii(d,a,b,c,words[i+15],10,0xFE2CE6E0);
        c = ii(c,d,a,b,words[i+6],15,0xA3014314);
        b = ii(b,a,d,c,words[i+13],21,0x4E0811A1);

        a = ii(a,b,c,d,words[i+4],6,0xF7537E82);
        d = ii(d,a,b,c,words[i+11],10,0xBD3AF235);
        c = ii(c,d,a,b,words[i+2],15,0x2AD7D2BB);
        b = ii(b,a,d,c,words[i+9],21,0xEB86D391);

        a = addUnsigned(a, oldA);
        b = addUnsigned(b, oldB);
        c = addUnsigned(c, oldC);
        d = addUnsigned(d, oldD);
    }

    function wordToHex(word) {

        let output = "";

        for (let i = 0; i < 4; i++) {
            output +=
                ((word >> (i * 8)) & 0xFF)
                    .toString(16)
                    .padStart(2, "0");
        }

        return output;
    }

    return (
        wordToHex(a) +
        wordToHex(b) +
        wordToHex(c) +
        wordToHex(d)
    );
}


// Generate hashes
if (hashInput && generateHash) {

    generateHash.addEventListener("click", async () => {

        const text = hashInput.value;

        if (!text) {

            sha256Output.textContent = "ENTER TEXT";
            sha1Output.textContent = "ENTER TEXT";
            md5Output.textContent = "ENTER TEXT";

            return;
        }

        sha256Output.textContent = "GENERATING...";
        sha1Output.textContent = "GENERATING...";
        md5Output.textContent = "GENERATING...";

        const sha256 = await generateWebHash(
            text,
            "SHA-256"
        );

        const sha1 = await generateWebHash(
            text,
            "SHA-1"
        );

        const md5Hash = md5(text);

        sha256Output.textContent = sha256;
        sha1Output.textContent = sha1;
        md5Output.textContent = md5Hash;
    });
}


// Copy buttons
document.querySelectorAll(".copy-hash").forEach(button => {

    button.addEventListener("click", async () => {

        const targetId = button.dataset.target;
        const output = document.getElementById(targetId);

        if (!output || output.textContent === "WAITING") {
            return;
        }

        await navigator.clipboard.writeText(
            output.textContent
        );

        const originalText = button.textContent;

        button.textContent = "COPIED";

        setTimeout(() => {
            button.textContent = originalText;
        }, 1200);

    });

});

// Set current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear();