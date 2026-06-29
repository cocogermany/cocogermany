const firebaseConfig = {
  apiKey: "AIzaSyCAmxLSnUWMuhuuH8oFshZMTajeP2iXvpY",
  authDomain: "cocogermany-ba33f.firebaseapp.com",
  projectId: "cocogermany-ba33f",
  storageBucket: "cocogermany-ba33f.firebasestorage.app",
  messagingSenderId: "689122181603",
  appId: "1:689122181603:web:a8bd80e2c187695ac8a0d6",
};

const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const adminEmail = "cocogermany.ytd@gmail.com";
const fallbackProductImage = "public/images/hero-study.jpg";
let firebaseTools = null;
let currentUser = null;
let products = [];
let orders = [];

async function getFirebaseTools() {
  if (!firebaseReady) return null;
  if (firebaseTools) return firebaseTools;

  const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

  const app = appModule.initializeApp(firebaseConfig);
  firebaseTools = {
    auth: authModule.getAuth(app),
    db: firestoreModule.getFirestore(app),
    authModule,
    firestoreModule,
  };

  return firebaseTools;
}

const starterProducts = [
  {
    id: "a1-foundations",
    title: "A1 German Foundations",
    level: "A1",
    format: "Digital PDF",
    price: "₹1,599",
    image: "public/images/a1-foundations.png",
    summary: "A carefully sequenced workbook for learners beginning serious German study.",
    sku: "CG-A1-01",
    pages: "84 pages",
    audience: "New learners",
    includes: "Exercises, notes, revision pages",
    description:
      "A structured A1 foundation resource with concise grammar explanations, guided writing practice, and cultural notes for everyday communication.",
    benefits: [
      "Clear progression from sounds and sentence structure to everyday dialogue.",
      "Practice pages for independent study and classroom revision.",
      "Cultural notes that connect language patterns to real German life.",
    ],
    delivery: "PDF delivery by email after manual payment verification.",
    previewImages: ["public/images/a1-foundations.png", "public/images/hero-study.jpg"],
  },
  {
    id: "b1-exam-companion",
    title: "B1 Exam Companion",
    level: "B1",
    format: "Printed",
    price: "₹2,799",
    image: "public/images/b1-companion.png",
    summary: "A premium exam preparation guide with writing frames and speaking prompts.",
    sku: "CG-B1-01",
    pages: "116 pages",
    audience: "B1 exam learners",
    includes: "Writing frames, speaking prompts, revision plan",
    description:
      "A practical B1 companion for learners preparing for certification, with model structures, exam rhythms, and calm revision planning.",
    benefits: [
      "Writing and speaking templates for exam preparation.",
      "Realistic revision guidance without pressure tactics.",
      "Printed format for annotation, review, and classroom use.",
    ],
    delivery: "Printed orders are shipped by courier after manual payment verification.",
    previewImages: ["public/images/b1-companion.png", "public/images/hero-study.jpg"],
  },
];
products = [...starterProducts];

const articles = [
  {
    id: "study-german-with-structure",
    title: "How to Study German with Structure, Not Noise",
    category: "Learning Method",
    date: "2026-01-12",
    summary:
      "A calm framework for building vocabulary, grammar, and confidence without chasing every resource at once.",
    body: [
      "German rewards structure. A learner who studies fewer materials with better rhythm usually progresses more steadily than one who collects every new method.",
      "Begin with a weekly grammar focus, a small vocabulary field, one short listening habit, and a repeatable writing task. Keep the system simple enough to maintain.",
      "The goal is not to make learning effortless. The goal is to make effort legible, measurable, and sustainable.",
    ],
  },
  {
    id: "reading-culture-through-language",
    title: "Reading Culture Through Everyday German",
    category: "Culture",
    date: "2026-02-04",
    summary: "Politeness, precision, and small daily phrases can teach more than isolated vocabulary lists.",
    body: [
      "Language learning becomes more durable when phrases are attached to situations. German everyday speech carries signals about formality, clarity, and social distance.",
      "Notice how requests are softened, how appointments are confirmed, and how written communication differs from casual conversation.",
      "These details turn vocabulary into usable judgment, which is the real point of advanced learning.",
    ],
  },
  {
    id: "what-a-good-workbook-does",
    title: "What a Good Workbook Actually Does",
    category: "Publishing Notes",
    date: "2026-03-18",
    summary: "Good learning material should reduce confusion, expose patterns, and leave room for practice.",
    body: [
      "A workbook is not a pile of exercises. It is an editorial sequence. Each page should know what came before and what the learner is ready to do next.",
      "The best materials are quiet. They make progression visible, avoid clutter, and help learners test understanding without feeling rushed.",
      "That is the publishing standard Coco Germany is built around.",
    ],
  },
];

const app = document.querySelector("#app");
const levels = ["A1", "A2", "B1", "B2"];
const orderStatuses = ["Pending", "Payment Requested", "Paid", "Processing", "Shipped", "Completed", "Cancelled"];

const trustItems = [
  ["shield-check", "Manual verification", "Every order is reviewed before delivery."],
  ["book-open-check", "Editorial resources", "Materials are structured and carefully sequenced."],
  ["mail-check", "Clear fulfilment", "PDFs are emailed and printed items ship by courier."],
  ["badge-check", "No pressure tactics", "No false urgency, countdowns, or hidden fees."],
];

const statistics = [
  ["2", "Core resources", "Focused materials instead of a crowded catalogue."],
  ["3", "Editorial article series", "Practical reading for learning method, culture, and publishing."],
  ["5", "Order statuses", "Pending, Processing, Delivered, Shipped, and Completed."],
];

const testimonials = [
  [
    "The study sequence feels calm and serious. It helped me understand what to revise next.",
    "Independent German learner",
  ],
  [
    "The material has the tone I want in class: clear, adult, and not overloaded.",
    "Language tutor",
  ],
  [
    "The manual purchase process was simple and transparent from request to delivery.",
    "Printed resource customer",
  ],
];

const faqs = [
  [
    "How do purchase requests work?",
    "Submit the form, receive payment instructions, and Coco Germany verifies payment manually before delivery.",
  ],
  [
    "Are resources digital or printed?",
    "Both formats are supported. Each resource clearly shows whether it is a Digital PDF or a Printed item.",
  ],
  [
    "Do I need an account?",
    "No. Version 1 keeps ordering simple and does not require accounts or user profiles.",
  ],
  [
    "How are PDFs delivered?",
    "Approved PDF orders are delivered by email. Printed materials are prepared and sent by courier.",
  ],
];

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function html(strings, ...values) {
  return strings.reduce((result, string, index) => result + string + (values[index] ?? ""), "");
}

function isAdmin() {
  return currentUser && currentUser.email === adminEmail;
}

function friendlyError(error) {
  const code = error && error.code ? error.code : "";

  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
    return "The email or password is incorrect.";
  }
  if (code.includes("auth/user-not-found")) {
    return "No account was found with this email.";
  }
  if (code.includes("auth/email-already-in-use")) {
    return "An account already exists with this email. Please login instead.";
  }
  if (code.includes("auth/weak-password")) {
    return "Please use a stronger password with at least 6 characters.";
  }
  if (code.includes("auth/popup-closed-by-user")) {
    return "Google login was closed before it finished.";
  }
  if (code.includes("auth/too-many-requests")) {
    return "Too many attempts. Please wait a little and try again.";
  }
  if (code.includes("permission-denied")) {
    return "You do not have permission to do this. Please check Firebase rules or login with the admin account.";
  }
  if (code.includes("unavailable")) {
    return "Firebase is temporarily unavailable. Please try again shortly.";
  }

  return "Something went wrong. Please try again.";
}

function redirectAfterLogin() {
  const destination = localStorage.getItem("loginRedirect") || "#/account";
  localStorage.removeItem("loginRedirect");
  location.hash = destination.replace("#", "");
}

function cleanWhatsappNumber(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeCdnImageUrl(value) {
  const url = String(value || "").trim();

  if (url.startsWith("https://github.com/") && url.includes("/blob/")) {
    const withoutHost = url.replace("https://github.com/", "");
    const [owner, repo, ...rest] = withoutHost.split("/");
    const blobIndex = rest.indexOf("blob");

    if (owner && repo && blobIndex >= 0 && rest[blobIndex + 1]) {
      const branch = rest[blobIndex + 1];
      const filePath = rest.slice(blobIndex + 2).join("/");
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    }
  }

  return url;
}

function isProductImageLink(value) {
  return /^https:\/\/(raw\.githubusercontent\.com|github\.com|cdn\.jsdelivr\.net\/gh)\//i.test(String(value || ""));
}

function parseImageLinks(value) {
  const list = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[\n,]+/)
        .map((item) => item.trim());

  return [...new Set(list.map(normalizeCdnImageUrl).filter(Boolean))];
}

function productImages(resource) {
  const images = parseImageLinks(resource.previewImages || resource.imageLinks || resource.images);
  const cover = normalizeCdnImageUrl(resource.image || resource.imageUrl || "");
  const fullList = parseImageLinks([...images, cover]);
  return fullList.length ? fullList : [fallbackProductImage];
}

function formatPrice(value) {
  const price = String(value || "").trim();
  if (!price) return "₹0";
  if (/^₹/.test(price)) return price;
  if (/^inr\s*/i.test(price)) return price.replace(/^inr\s*/i, "₹");
  if (/^rs\.?\s*/i.test(price)) return price.replace(/^rs\.?\s*/i, "₹");
  if (/^\d/.test(price)) return `₹${price}`;
  return price;
}

function normalizeProduct(id, data) {
  const previewImages = parseImageLinks(data.previewImages || data.imageLinks || data.images || data.image || data.imageUrl);
  const image = previewImages[0] || normalizeCdnImageUrl(data.image || data.imageUrl || fallbackProductImage);

  return {
    id,
    title: data.title || data.name || "Untitled resource",
    level: data.level || data.category || "A1",
    category: data.category || data.level || "A1",
    format: data.format || "Digital PDF",
    price: formatPrice(data.price || "₹1,599"),
    image,
    summary: data.summary || data.description || "Coco Germany learning resource.",
    sku: data.sku || "CG-ITEM",
    pages: data.pages || "Pages TBC",
    audience: data.audience || `${data.category || data.level || "A1"} learners`,
    includes: data.includes || data.deliveryType || "Study material",
    description: data.description || data.summary || "A Coco Germany resource for structured German learning.",
    benefits: data.benefits || [
      "Structured learning support.",
      "Clear editorial sequence.",
      "Practical study material.",
    ],
    delivery: data.delivery || data.deliveryType || "Delivery after manual payment verification.",
    deliveryType: data.deliveryType || data.delivery || "Email or courier",
    previewImages: previewImages.length ? previewImages : [image],
  };
}

async function loadProducts() {
  const tools = await getFirebaseTools();
  if (!tools) return;

  try {
    const snapshot = await tools.firestoreModule.getDocs(tools.firestoreModule.collection(tools.db, "products"));
    const firestoreProducts = snapshot.docs
      .map((doc) => ({ id: doc.id, data: doc.data() }))
      .filter((item) => !item.data.deleted)
      .map((item) => normalizeProduct(item.id, item.data));
    products = snapshot.docs.length ? firestoreProducts : [...starterProducts];
  } catch (error) {
    console.error(error);
    products = [...starterProducts];
  }
}

async function loadOrders() {
  const tools = await getFirebaseTools();
  if (!tools || !currentUser) {
    orders = [];
    return;
  }

  try {
    const snapshot = await tools.firestoreModule.getDocs(tools.firestoreModule.collection(tools.db, "orders"));
    orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) => isAdmin() || order.userId === currentUser.uid || order.email === currentUser.email);
  } catch (error) {
    console.error(error);
    orders = [];
  }
}

function pageHeader(eyebrow, title, intro) {
  return html`
    <div>
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="intro">${intro}</p>
    </div>
  `;
}

function resourceCard(resource) {
  const images = productImages(resource);

  return html`
    <article class="card resource-card">
      <img class="resource-image" src="${images[0]}" alt="${resource.title} cover preview" />
      <div class="card-body">
        <div class="badges">
          <span class="badge badge-gold">${icon("graduation-cap")}${resource.level}</span>
          <span class="badge">${icon(resource.format.includes("PDF") ? "file-text" : "package")}${resource.format}</span>
          <span class="badge">${icon("eye")}${resource.pages}</span>
        </div>
        <h3>${resource.title}</h3>
        <p>${resource.summary}</p>
        <div class="metadata">
          <span>${icon("users")} ${resource.audience}</span>
          <span>${icon("list-checks")} ${resource.includes}</span>
          <span>${icon("barcode")} ${resource.sku}</span>
        </div>
        <p class="price">${formatPrice(resource.price)}</p>
        <div class="actions">
          <a class="button" href="#/resources/${resource.id}">${icon("book-open")}View resource</a>
          <a class="button-light" href="#/checkout/${resource.id}">${icon("shopping-bag")}Buy / Request</a>
        </div>
      </div>
    </article>
  `;
}

function renderProductGallery(resource, options = {}) {
  const images = productImages(resource);
  const label = options.label || `${resource.title} product images`;
  const className = options.className || "";

  return html`
    <div class="product-gallery ${className}" data-product-gallery aria-label="${label}">
      <button class="gallery-nav gallery-prev" type="button" data-gallery-prev aria-label="Previous product image">
        ${icon("chevron-left")}
      </button>
      <div class="gallery-track" data-gallery-track>
        ${images
          .map(
            (image, index) => html`
              <img src="${image}" alt="${resource.title} product image ${index + 1}" loading="${index ? "lazy" : "eager"}" />
            `,
          )
          .join("")}
      </div>
      <button class="gallery-nav gallery-next" type="button" data-gallery-next aria-label="Next product image">
        ${icon("chevron-right")}
      </button>
      <div class="gallery-dots" aria-hidden="true">
        ${images.map((_, index) => `<span class="${index === 0 ? "active" : ""}"></span>`).join("")}
      </div>
    </div>
  `;
}

function attachProductGalleries() {
  document.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
    const track = gallery.querySelector("[data-gallery-track]");
    const slides = [...track.querySelectorAll("img")];
    const dots = [...gallery.querySelectorAll(".gallery-dots span")];
    const updateDots = () => {
      const activeIndex = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      dots.forEach((dot, index) => dot.classList.toggle("active", index === activeIndex));
    };
    const scrollBySlide = (direction) => {
      track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
    };

    gallery.querySelector("[data-gallery-prev]").addEventListener("click", () => scrollBySlide(-1));
    gallery.querySelector("[data-gallery-next]").addEventListener("click", () => scrollBySlide(1));
    track.addEventListener("scroll", updateDots, { passive: true });
    gallery.classList.toggle("single-image", slides.length < 2);
  });
}

function comingSoonCard(level) {
  return html`
    <article class="card coming-soon-card">
      <div class="card-body">
        <div class="badges">
          <span class="badge badge-blue">${icon("graduation-cap")}${level}</span>
          <span class="badge">${icon("clock")}Coming Soon</span>
        </div>
        <h3>${level} resources</h3>
        <p>
          This category is being prepared. Coco Germany will add carefully edited ${level} materials when they are ready.
        </p>
        <a class="button-light" href="#/contact">${icon("mail")}Ask about this level</a>
      </div>
    </article>
  `;
}

function renderResourcesForLevel(level) {
  const items = products.filter((resource) => resource.level === level || resource.category === level);
  return items.length ? items.map(resourceCard).join("") : comingSoonCard(level);
}

function renderLevelTabs(activeLevel) {
  return html`
    <div class="category-tabs" role="tablist" aria-label="German level categories">
      ${levels
        .map(
          (level) => html`
            <button
              type="button"
              class="${level === activeLevel ? "active" : ""}"
              data-level-tab="${level}"
              aria-selected="${level === activeLevel}"
            >
              <span>${level}</span>
              <small>${products.filter((resource) => resource.level === level || resource.category === level).length || "Soon"}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCategoryBrowser(activeLevel = "A1") {
  return html`
    <div class="category-browser" data-category-browser>
      ${renderLevelTabs(activeLevel)}
      <div class="grid two category-results" data-category-results>${renderResourcesForLevel(activeLevel)}</div>
    </div>
  `;
}

function attachCategoryTabs() {
  document.querySelectorAll("[data-category-browser]").forEach((browser) => {
    const results = browser.querySelector("[data-category-results]");

    browser.querySelectorAll("[data-level-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const level = button.dataset.levelTab;
        browser.querySelectorAll("[data-level-tab]").forEach((tab) => {
          const isActive = tab.dataset.levelTab === level;
          tab.classList.toggle("active", isActive);
          tab.setAttribute("aria-selected", String(isActive));
        });
        results.innerHTML = renderResourcesForLevel(level);
        renderIcons();
      });
    });
  });
}

function renderTrustStrip() {
  return html`
    <section class="trust-strip" aria-label="Trust signals">
      ${trustItems
        .map(
          (item) => html`
            <div>
              ${icon(item[0])}
              <strong>${item[1]}</strong>
              <span>${item[2]}</span>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderStatistics() {
  return html`
    <section class="section stats-section">
      <p class="eyebrow">At a glance</p>
      <h2>Small catalogue, clear purpose.</h2>
      <div class="stats-grid">
        ${statistics
          .map(
            (item) => html`
              <div class="stat-card">
                <strong>${item[0]}</strong>
                <h3>${item[1]}</h3>
                <p>${item[2]}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderDeliveryTimeline() {
  const steps = [
    ["send", "Request", "Send the form with your chosen resource and contact details."],
    ["message-square", "Reply", "Coco Germany replies with payment instructions and any delivery questions."],
    ["shield-check", "Verify", "Payment is checked manually before fulfilment begins."],
    ["package-check", "Deliver", "PDFs are emailed. Printed materials are packed and shipped by courier."],
  ];

  return html`
    <section class="section">
      <p class="eyebrow">Delivery timeline</p>
      <h2>Simple manual fulfilment.</h2>
      <div class="timeline">
        ${steps
          .map(
            (step, index) => html`
              <div class="timeline-step">
                <span class="step-number">0${index + 1}</span>
                ${icon(step[0])}
                <h3>${step[1]}</h3>
                <p>${step[2]}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTestimonials() {
  return html`
    <section class="section">
      <p class="eyebrow">Learner confidence</p>
      <h2>Clear material, calm experience.</h2>
      <div class="grid three">
        ${testimonials
          .map(
            (item) => html`
              <blockquote class="testimonial">
                ${icon("quote")}
                <p>${item[0]}</p>
                <footer>${item[1]}</footer>
              </blockquote>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderFounderStory() {
  return html`
    <section class="section founder">
      <div>
        <p class="eyebrow">Founder story</p>
        <h2>Built like a study desk, not a sales funnel.</h2>
        <p class="lead">
          Coco Germany was shaped around a simple belief: learners do better when material is clear, honest, and
          carefully edited. The brand keeps its catalogue focused, explains delivery plainly, and treats every resource
          as part of a serious study routine.
        </p>
      </div>
      <div class="founder-note">
        ${icon("pen-line")}
        <h3>Editorial promise</h3>
        <p>
          Each resource should help a learner know what to study, why it matters, and how to continue without noise.
        </p>
      </div>
    </section>
  `;
}

function renderFaq() {
  return html`
    <section class="section">
      <p class="eyebrow">Questions</p>
      <h2>FAQ</h2>
      <div class="faq">
        ${faqs
          .map(
            (item) => html`
              <details>
                <summary>${item[0]} ${icon("chevron-down")}</summary>
                <p>${item[1]}</p>
              </details>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderHome() {
  app.innerHTML = html`
    <section class="section hero">
      <div>
        <p class="eyebrow">Independent German education & publishing</p>
        <h1>Coco Germany</h1>
        <p class="lead">
          Premium German learning resources, thoughtful articles, and practical study material for learners who value
          clarity, structure, and editorial care.
        </p>
        <div class="actions">
          <a class="button" href="#/resources">${icon("book-open")}Explore resources</a>
          <a class="button-light" href="#/articles">${icon("newspaper")}Read articles</a>
        </div>
      </div>
      <img src="public/images/hero-study.jpg" alt="German study desk with learning materials" />
    </section>

    ${renderTrustStrip()}
    ${renderStatistics()}

    <section class="section category-section">
      <p class="eyebrow">Shop by level</p>
      <h2>Browse German resources by category.</h2>
      <p class="intro">A simple bookstore-style catalogue organized by A1, A2, B1, and B2 learning levels.</p>
      ${renderCategoryBrowser("A1")}
    </section>

    ${renderFounderStory()}
    ${renderDeliveryTimeline()}
    ${renderTestimonials()}
    ${renderFaq()}
  `;
}

function renderResources() {
  app.innerHTML = html`
    <section class="section">
      ${pageHeader(
        "Catalogue",
        "Resources",
        "Browse Coco Germany resources by language level, format, preview, price, and delivery expectations.",
      )}
      ${renderCategoryBrowser("A1")}
    </section>
  `;
}

function renderResourceDetail(id) {
  const resource = products.find((item) => item.id === id) || products[0];

  app.innerHTML = html`
    <section class="section split">
      ${renderProductGallery(resource, { className: "detail-gallery" })}
      <div>
        <p class="eyebrow">${resource.level} resource</p>
        <h1>${resource.title}</h1>
        <p class="lead">${resource.description}</p>
        <p class="price">${formatPrice(resource.price)}</p>
        <div class="badges">
          <span class="badge badge-gold">${icon("graduation-cap")}${resource.level}</span>
          <span class="badge">${icon(resource.format.includes("PDF") ? "file-text" : "package")}${resource.format}</span>
          <span class="badge">${icon("eye")}${resource.pages}</span>
        </div>
        <div class="metadata detail-meta">
          <span>${icon("users")} ${resource.audience}</span>
          <span>${icon("list-checks")} ${resource.includes}</span>
          <span>${icon("barcode")} ${resource.sku}</span>
          <span>${icon("truck")} ${resource.delivery}</span>
        </div>
        <div class="actions">
          <a class="button" href="#/checkout/${resource.id}">${icon("shopping-bag")}Purchase</a>
          <a class="button-light" href="#/resources">Back to resources</a>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">Benefits</p>
      <h2>What this resource supports</h2>
      <div class="grid three">
        ${resource.benefits
          .map(
            (benefit) => html`
              <div class="card card-body icon-card">${icon("check-circle-2")}<p>${benefit}</p></div>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">Preview</p>
      <h2>Swipe through product images</h2>
      <div class="preview-grid product-preview">
        ${renderProductGallery(resource, { className: "preview-gallery", label: `${resource.title} preview images` })}
        <div class="notice">${resource.delivery}</div>
      </div>
    </section>

    ${renderDeliveryTimeline()}
    ${renderFaq()}
    <div class="mobile-purchase-cta">
      <a class="button" href="#/checkout/${resource.id}">${icon("shopping-bag")}Purchase - ${formatPrice(resource.price)}</a>
    </div>
  `;

  attachProductGalleries();
}

function renderArticles() {
  app.innerHTML = html`
    <section class="section">
      ${pageHeader(
        "Magazine",
        "Articles",
        "Editorial notes on German language learning, culture, and publishing practice.",
      )}
      <div class="article-list">
        ${articles
          .map(
            (article) => html`
              <a class="article-row" href="#/articles/${article.id}">
                <p class="eyebrow">${article.category} - ${article.date}</p>
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
              </a>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderArticleDetail(id) {
  const article = articles.find((item) => item.id === id) || articles[0];

  app.innerHTML = html`
    <article class="section">
      <p class="eyebrow">${article.category} - ${article.date}</p>
      <h1>${article.title}</h1>
      <p class="lead">${article.summary}</p>
      <div class="article-list">
        ${article.body.map((paragraph) => `<div class="article-row"><p>${paragraph}</p></div>`).join("")}
      </div>
    </article>
  `;
}

function renderAbout() {
  app.innerHTML = html`
    <section class="section split">
      <div>
        ${pageHeader(
          "About",
          "A small independent German educational publisher.",
          "Coco Germany combines structured language education, editorial publishing standards, and practical cultural context.",
        )}
        <p class="lead">
          The brand is built for learners who prefer well-made materials over noisy study trends. Resources are simple,
          carefully sequenced, and designed for calm progress.
        </p>
      </div>
      <img class="detail-cover" src="public/images/hero-study.jpg" alt="Coco Germany editorial desk" />
    </section>
    ${renderFounderStory()}
    ${renderTrustStrip()}
  `;
}

function renderContact() {
  app.innerHTML = html`
    <section class="section split">
      <div>
        ${pageHeader(
          "Contact",
          "Reach Coco Germany",
          "For resource questions, teaching use, institutional orders, or publishing enquiries.",
        )}
        <div class="notice">
          Choose the quickest way to contact Coco Germany.
        </div>
        <div class="contact-actions">
          <a class="button" href="mailto:cocogermany.ytd@gmail.com">${icon("mail")}Email Coco Germany</a>
          <a class="button whatsapp-button" href="https://wa.me/917907211108" target="_blank" rel="noopener">${icon("message-circle")}WhatsApp</a>
        </div>
      </div>
      <div class="card card-body contact-card">
        ${icon("mail-check")}
        <h3>Direct contact</h3>
        <p>Email: <a href="mailto:cocogermany.ytd@gmail.com">cocogermany.ytd@gmail.com</a></p>
        <p>WhatsApp: <a href="https://wa.me/917907211108" target="_blank" rel="noopener">+91 79072 11108</a></p>
      </div>
    </section>
  `;
}

function renderLogin(mode = "login") {
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  app.innerHTML = html`
    <section class="section auth-wrap">
      <div class="auth-card">
        <img class="auth-logo" src="public/images/cocoLogo.jpg" alt="Coco Germany logo" />
        <p class="eyebrow">Account</p>
        <h1>${isForgot ? "Reset password" : isRegister ? "Create account" : "Login"}</h1>
        <p class="intro">
          ${isForgot
            ? "Enter your email and Coco Germany will send a password reset link."
            : "Access orders, purchased resources, and account settings."}
        </p>

        ${isForgot
          ? ""
          : `<button class="button-light google-button" type="button" id="google-login">
              ${icon("chrome")} Continue with Google
            </button>
            <div class="auth-divider"><span>Email login</span></div>`}

        <form class="form auth-form" id="auth-form">
          <label class="field">Email <input name="email" type="email" autocomplete="email" required /></label>
          ${isForgot ? "" : `<label class="field">Password <input name="password" type="password" autocomplete="${isRegister ? "new-password" : "current-password"}" required /></label>`}
          ${isForgot
            ? ""
            : `<label class="remember-row"><input name="remember" type="checkbox" checked /> Remember me</label>`}
          <button class="button" type="submit">
            ${icon(isForgot ? "mail" : isRegister ? "user-plus" : "log-in")}
            ${isForgot ? "Send reset link" : isRegister ? "Register" : "Login"}
          </button>
          <p id="auth-message" aria-live="polite"></p>
        </form>

        <div class="auth-links">
          <a href="#/login">Login</a>
          <a href="#/register">Register</a>
          <a href="#/forgot-password">Forgot Password</a>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#auth-form").addEventListener("submit", (event) => handleAuth(event, mode));
  const googleButton = document.querySelector("#google-login");
  if (googleButton) googleButton.addEventListener("click", handleGoogleLogin);
}

async function handleAuth(event, mode) {
  event.preventDefault();
  const message = document.querySelector("#auth-message");
  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email"));
  const password = String(formData.get("password") || "");
  const remember = Boolean(formData.get("remember"));
  const tools = await getFirebaseTools();

  try {
    if (mode !== "forgot") {
      await tools.authModule.setPersistence(
        tools.auth,
        remember ? tools.authModule.browserLocalPersistence : tools.authModule.browserSessionPersistence,
      );
    }

    if (mode === "register") {
      await tools.authModule.createUserWithEmailAndPassword(tools.auth, email, password);
      redirectAfterLogin();
    } else if (mode === "forgot") {
      await tools.authModule.sendPasswordResetEmail(tools.auth, email);
      message.textContent = "Password reset email sent.";
    } else {
      await tools.authModule.signInWithEmailAndPassword(tools.auth, email, password);
      redirectAfterLogin();
    }
  } catch (error) {
    message.className = "error";
    message.textContent = friendlyError(error);
  }
}

async function handleGoogleLogin() {
  const message = document.querySelector("#auth-message");
  const tools = await getFirebaseTools();

  try {
    const provider = new tools.authModule.GoogleAuthProvider();
    await tools.authModule.signInWithPopup(tools.auth, provider);
    redirectAfterLogin();
  } catch (error) {
    message.className = "error";
    message.textContent = friendlyError(error);
  }
}

async function logout() {
  const tools = await getFirebaseTools();
  await tools.authModule.signOut(tools.auth);
  location.hash = "#/";
}

function renderAccount() {
  if (!currentUser) {
    renderLogin("login");
    return;
  }

  const completedOrders = orders.filter((order) => order.status === "Completed");

  app.innerHTML = html`
    <section class="section">
      <div class="account-header">
        <div>
          <p class="eyebrow">Customer dashboard</p>
          <h1>My Account</h1>
          <p class="intro">${currentUser.email}</p>
        </div>
        <div class="actions">
          ${isAdmin() ? `<a class="button" href="#/admin">${icon("settings")}Admin Panel</a>` : ""}
          <button class="button-light" type="button" data-logout>${icon("log-out")}Logout</button>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card card-body">
          <h3>My Orders</h3>
          <div class="order-list">
            ${orders.length
              ? orders.map(renderOrderRow).join("")
              : `<p class="muted">No orders yet. Browse resources and submit a checkout request.</p>`}
          </div>
        </div>
        <div class="card card-body">
          <h3>Purchased Resources</h3>
          <p class="muted">${completedOrders.length ? `${completedOrders.length} completed order(s).` : "Completed resources will appear here after fulfilment."}</p>
        </div>
        <div class="card card-body">
          <h3>Account Settings</h3>
          <p class="muted">Email: ${currentUser.email}</p>
          <p class="muted">Orders are linked to this Firebase account.</p>
        </div>
      </div>
    </section>
  `;

  document.querySelector("[data-logout]").addEventListener("click", logout);
}

function renderOrderRow(order) {
  return html`
    <div class="order-row">
      <div>
        <strong>${order.resourceTitle || order.productName}</strong>
        <span>${order.id} - ${order.status || "Pending"}</span>
      </div>
      <span class="status-pill">${order.status || "Pending"}</span>
    </div>
  `;
}

function renderAdmin() {
  if (!isAdmin()) {
    app.innerHTML = html`
      <section class="section">
        <p class="eyebrow">Admin</p>
        <h1>Admin access required</h1>
        <p class="lead">Please login with ${adminEmail} to manage Coco Germany.</p>
        <div class="actions"><a class="button" href="#/login">Login</a></div>
      </section>
    `;
    return;
  }

  const pendingCount = orders.filter((order) => (order.status || "Pending") === "Pending").length;
  const completedCount = orders.filter((order) => order.status === "Completed").length;

  app.innerHTML = html`
    <section class="section admin-panel">
      <div class="account-header">
        <div>
          <p class="eyebrow">Admin Panel</p>
          <h1>Coco Germany Admin</h1>
          <p class="intro">Simple order and product management for the educational bookstore.</p>
        </div>
        <button class="button-light" type="button" data-logout>${icon("log-out")}Logout</button>
      </div>

      <div class="admin-stats">
        <div class="stat-card"><strong>${products.length}</strong><h3>Total products</h3></div>
        <div class="stat-card"><strong>${orders.length}</strong><h3>Total orders</h3></div>
        <div class="stat-card"><strong>${pendingCount}</strong><h3>Pending orders</h3></div>
        <div class="stat-card"><strong>${completedCount}</strong><h3>Completed orders</h3></div>
      </div>

      <section class="admin-section">
        <h2>Orders</h2>
        <div class="admin-table">
          ${orders.length ? orders.map(renderAdminOrder).join("") : `<p class="muted">No orders yet.</p>`}
        </div>
      </section>

      <section class="admin-section">
        <h2>Product Management</h2>
        ${renderProductForm()}
        <div class="admin-products">
          ${products.map(renderAdminProduct).join("")}
        </div>
      </section>
    </section>
  `;

  document.querySelector("[data-logout]").addEventListener("click", logout);
  document.querySelector("#product-form").addEventListener("submit", saveProduct);
  document.querySelectorAll("[data-order-status]").forEach((select) => select.addEventListener("change", updateOrderStatus));
  document.querySelectorAll("[data-edit-product]").forEach((button) => button.addEventListener("click", fillProductForm));
  document.querySelectorAll("[data-delete-product]").forEach((button) => button.addEventListener("click", deleteProduct));
}

function renderAdminOrder(order) {
  return html`
    <div class="admin-row">
      <div>
        <strong>${order.resourceTitle || order.productName}</strong>
        <span>${order.name || "Customer"} - ${order.email || ""}</span>
      </div>
      <div class="admin-actions">
        <a class="button-light" href="#/admin/orders/${order.id}">${icon("eye")}View order</a>
        <select data-order-status="${order.id}">
          ${orderStatuses
            .map((status) => `<option value="${status}" ${status === (order.status || "Pending") ? "selected" : ""}>${status}</option>`)
            .join("")}
        </select>
      </div>
    </div>
  `;
}

function renderAdminOrderDetail(orderId) {
  if (!isAdmin()) {
    renderAdmin();
    return;
  }

  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    app.innerHTML = html`
      <section class="section">
        <p class="eyebrow">Admin order</p>
        <h1>Order not found</h1>
        <div class="actions"><a class="button" href="#/admin">Back to admin</a></div>
      </section>
    `;
    return;
  }

  const product = products.find((item) => item.id === order.resourceId);
  const whatsappNumber = cleanWhatsappNumber(order.whatsapp || order.phone);
  const whatsappText = encodeURIComponent(
    `Hello ${order.name || ""}, this is Coco Germany about your order for ${order.resourceTitle || "your resource"}.`,
  );

  app.innerHTML = html`
    <section class="section admin-order-detail">
      <div class="account-header">
        <div>
          <p class="eyebrow">Admin order</p>
          <h1>${order.resourceTitle || "Order detail"}</h1>
          <p class="intro">Customer request and fulfilment details.</p>
        </div>
        <a class="button-light" href="#/admin">Back to admin</a>
      </div>

      <div class="split">
        <div class="card card-body">
          <h2>Requested product</h2>
          ${product ? renderProductGallery(product, { className: "order-product-gallery" }) : ""}
          <h3>${order.resourceTitle || product?.title || "Product"}</h3>
          <p class="muted">${order.format || product?.format || ""} - ${formatPrice(order.price || product?.price || "")}</p>
          <p class="muted">SKU: ${product?.sku || "Not available"}</p>
        </div>

        <div class="card card-body">
          <h2>Customer</h2>
          <p><strong>Name:</strong> ${order.name || "Not provided"}</p>
          <p><strong>Email:</strong> ${order.email || "Not provided"}</p>
          <p><strong>WhatsApp:</strong> ${order.whatsapp || order.phone || "Not provided"}</p>
          <p><strong>Address:</strong><br />${order.address || "Not provided"}</p>
          <p><strong>Country:</strong> ${order.country || "Not provided"}</p>
          <p><strong>Notes:</strong> ${order.notes || "None"}</p>

          <label class="field">
            Order status
            <select data-order-status="${order.id}">
              ${orderStatuses
                .map((status) => `<option value="${status}" ${status === (order.status || "Pending") ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
          </label>

          <div class="actions">
            ${whatsappNumber
              ? `<a class="button whatsapp-button" href="https://wa.me/${whatsappNumber}?text=${whatsappText}" target="_blank" rel="noopener">${icon("message-circle")}Chat on WhatsApp</a>`
              : `<span class="error">No WhatsApp number provided.</span>`}
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-order-status]").forEach((select) => select.addEventListener("change", updateOrderStatus));
  attachProductGalleries();
}

function renderProductForm() {
  return html`
    <form class="form product-form" id="product-form">
      <input type="hidden" name="id" />
      <label class="field">Product name <input name="title" required /></label>
      <label class="field">
        Category
        <select name="category">${levels.map((level) => `<option value="${level}">${level}</option>`).join("")}</select>
      </label>
      <label class="field">Price <input name="price" placeholder="₹1,599" required /></label>
      <label class="field">Description <textarea name="description" required></textarea></label>
      <label class="field image-links-field">
        Product image CDN links
        <textarea name="imageLinks" placeholder="Paste one GitHub raw/CDN image URL per line" required></textarea>
      </label>
      <label class="field">Format <input name="format" placeholder="Digital PDF or Printed" required /></label>
      <label class="field">Pages <input name="pages" placeholder="84 pages" /></label>
      <label class="field">SKU <input name="sku" placeholder="CG-A1-02" /></label>
      <label class="field">Delivery type <input name="deliveryType" placeholder="Email delivery or courier" /></label>
      <button class="button" type="submit">${icon("save")}Save product</button>
      <p id="product-message" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminProduct(product) {
  const images = productImages(product);

  return html`
    <div class="admin-row">
      <div class="admin-product-summary">
        <img src="${images[0]}" alt="${product.title} cover" />
        <div>
        <strong>${product.title}</strong>
          <span>${product.level} - ${formatPrice(product.price)} - ${product.format}</span>
          <span>${images.length} image link${images.length === 1 ? "" : "s"}</span>
        </div>
      </div>
      <div class="admin-actions">
        <button class="button-light" type="button" data-edit-product="${product.id}">${icon("pencil")}Edit</button>
        <button class="button-light danger-button" type="button" data-delete-product="${product.id}">${icon("trash-2")}Delete</button>
      </div>
    </div>
  `;
}

async function updateOrderStatus(event) {
  const tools = await getFirebaseTools();
  const orderId = event.currentTarget.dataset.orderStatus;

  try {
    await tools.firestoreModule.updateDoc(tools.firestoreModule.doc(tools.db, "orders", orderId), {
      status: event.currentTarget.value,
      updatedAt: tools.firestoreModule.serverTimestamp(),
    });
    await loadOrders();
    if (location.hash.includes("#/admin/orders/")) {
      renderAdminOrderDetail(orderId);
    } else {
      renderAdmin();
    }
  } catch (error) {
    alert(friendlyError(error));
  }
}

function fillProductForm(event) {
  const product = products.find((item) => item.id === event.currentTarget.dataset.editProduct);
  const form = document.querySelector("#product-form");
  form.elements.id.value = product.id;
  form.elements.title.value = product.title;
  form.elements.category.value = product.level;
  form.elements.price.value = product.price;
  form.elements.description.value = product.description;
  form.elements.imageLinks.value = productImages(product).filter((image) => image !== fallbackProductImage).join("\n");
  form.elements.format.value = product.format;
  form.elements.pages.value = product.pages;
  form.elements.sku.value = product.sku;
  form.elements.deliveryType.value = product.deliveryType || product.delivery;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function saveProduct(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector("#product-message");
  const data = new FormData(form);
  const tools = await getFirebaseTools();
  const id = String(data.get("id") || "").trim();
  const imageLinks = parseImageLinks(data.get("imageLinks"));

  try {
    if (!imageLinks.length) {
      message.className = "error";
      message.textContent = "Add at least one product image CDN link.";
      return;
    }

    if (imageLinks.some((link) => !isProductImageLink(link))) {
      message.className = "error";
      message.textContent = "Use GitHub raw, GitHub blob, or jsDelivr GitHub CDN image links only.";
      return;
    }

    const productData = {
      title: String(data.get("title")),
      category: String(data.get("category")),
      level: String(data.get("category")),
      price: formatPrice(data.get("price")),
      image: imageLinks[0],
      previewImages: imageLinks,
      description: String(data.get("description")),
      summary: String(data.get("description")),
      format: String(data.get("format")),
      pages: String(data.get("pages")),
      sku: String(data.get("sku")),
      deliveryType: String(data.get("deliveryType")),
      delivery: String(data.get("deliveryType")),
      updatedAt: tools.firestoreModule.serverTimestamp(),
    };

    if (id) {
      await tools.firestoreModule.setDoc(tools.firestoreModule.doc(tools.db, "products", id), productData, { merge: true });
    } else {
      await tools.firestoreModule.addDoc(tools.firestoreModule.collection(tools.db, "products"), {
        ...productData,
        createdAt: tools.firestoreModule.serverTimestamp(),
      });
    }

    message.textContent = "Product saved.";
    form.reset();
    await loadProducts();
    renderAdmin();
  } catch (error) {
    message.className = "error";
    message.textContent = friendlyError(error);
  }
}

async function deleteProduct(event) {
  const id = event.currentTarget.dataset.deleteProduct;
  if (!confirm("Delete this product?")) return;

  try {
    const tools = await getFirebaseTools();
    await tools.firestoreModule.setDoc(
      tools.firestoreModule.doc(tools.db, "products", id),
      { deleted: true, updatedAt: tools.firestoreModule.serverTimestamp() },
      { merge: true },
    );
    await loadProducts();
    renderAdmin();
  } catch (error) {
    alert(friendlyError(error));
  }
}

function renderPurchase(resourceId) {
  const resource = products.find((item) => item.id === resourceId) || products[0];
  const images = productImages(resource);

  if (!currentUser) {
    localStorage.setItem("loginRedirect", `#/checkout/${resource.id}`);
    renderLogin("login");
    return;
  }

  app.innerHTML = html`
    <section class="section split">
      <div>
        <p class="eyebrow">Checkout</p>
        <h1>${resource.title}</h1>
        <p class="lead">
          Add address details and confirm your order. Payment instructions are sent manually after review.
        </p>
        <p class="price">${formatPrice(resource.price)}</p>
        <div class="notice">
          ${icon("shield-check")}
          Your order is stored as Pending. Coco Germany will update the status after manual payment and fulfilment.
        </div>
      </div>

      <form class="form" id="purchase-form">
        <div class="checkout-summary">
          <img src="${images[0]}" alt="${resource.title} cover" />
          <div>
            <strong>${resource.title}</strong>
            <span>${resource.level} - ${resource.format} - ${formatPrice(resource.price)}</span>
          </div>
        </div>
        ${renderProductGallery(resource, { className: "checkout-gallery" })}
        <input type="hidden" name="resourceId" value="${resource.id}" />
        <label class="field">Full name <input name="name" required /></label>
        <label class="field">Email <input name="email" type="email" value="${currentUser ? currentUser.email : ""}" required /></label>
        <label class="field">WhatsApp number <input name="phone" placeholder="+91 79072 11108" required /></label>
        <label class="field">Address <textarea name="address" placeholder="House, street, city, postal code" required></textarea></label>
        <label class="field">Country <input name="country" required /></label>
        <label class="field">Notes <textarea name="notes" placeholder="Optional delivery notes"></textarea></label>
        <button class="button" type="submit">${icon("send")}Confirm order</button>
        <p id="form-message" aria-live="polite"></p>
      </form>
    </section>
  `;

  document.querySelector("#purchase-form").addEventListener("submit", submitPurchaseRequest);
  attachProductGalleries();
}

async function submitPurchaseRequest(event) {
  event.preventDefault();

  const message = document.querySelector("#form-message");
  const form = event.currentTarget;
  const formData = new FormData(form);
  const selectedResource = products.find((item) => item.id === formData.get("resourceId"));

  if (!currentUser) {
    localStorage.setItem("loginRedirect", `#/checkout/${formData.get("resourceId")}`);
    location.hash = "#/login";
    return;
  }

  const order = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("phone"),
    address: formData.get("address"),
    country: formData.get("country"),
    notes: formData.get("notes"),
    resourceId: selectedResource.id,
    resourceTitle: selectedResource.title,
    format: selectedResource.format,
    price: formatPrice(selectedResource.price),
    userId: currentUser ? currentUser.uid : "",
    status: "Pending",
  };

  const tools = await getFirebaseTools();

  if (!tools) {
    message.className = "error";
    message.textContent = "Ordering is not available right now. Please contact Coco Germany by email or WhatsApp.";
    return;
  }

  message.textContent = "Submitting...";

  try {
    await tools.firestoreModule.addDoc(tools.firestoreModule.collection(tools.db, "orders"), {
      ...order,
      createdAt: tools.firestoreModule.serverTimestamp(),
    });
    await loadOrders();
    location.hash = "#/success";
  } catch (error) {
    message.className = "error";
    message.textContent = friendlyError(error);
    console.error(error);
  }
}

function renderSuccess() {
  app.innerHTML = html`
    <section class="section">
      <p class="eyebrow">Success</p>
      <h1>Purchase request received.</h1>
      <p class="lead">
        Your request has been recorded as Pending. Coco Germany will verify payment externally and then email the PDF or
        arrange courier shipment for printed material.
      </p>
      <div class="actions">
        <a class="button" href="#/account">${icon("user")}View my orders</a>
        <a class="button-light" href="#/resources">Back to resources</a>
        <a class="button-light" href="#/">Home</a>
      </div>
    </section>
  `;
}

function renderNotFound() {
  app.innerHTML = html`
    <section class="section">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <div class="actions"><a class="button" href="#/">Return home</a></div>
    </section>
  `;
}

function setActiveNavigation(path) {
  document.querySelectorAll(".bottom-nav a, .desktop-nav a").forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", href === path || (href !== "/" && path.startsWith(href)));
  });
}

function updateAuthNavigation() {
  document.querySelectorAll("[data-admin-link]").forEach((link) => {
    link.hidden = !isAdmin();
  });

  document.querySelectorAll("[data-account-link]").forEach((link) => {
    link.textContent = currentUser ? "My Account" : "Login";
  });
}

function router() {
  const path = location.hash.replace("#", "") || "/";
  const parts = path.split("/").filter(Boolean);

  if (path === "/") renderHome();
  else if (path === "/resources") renderResources();
  else if (parts[0] === "resources" && parts[1]) renderResourceDetail(parts[1]);
  else if (path === "/articles") renderArticles();
  else if (parts[0] === "articles" && parts[1]) renderArticleDetail(parts[1]);
  else if (path === "/about") renderAbout();
  else if (path === "/contact") renderContact();
  else if (path === "/login") renderLogin("login");
  else if (path === "/register") renderLogin("register");
  else if (path === "/forgot-password") renderLogin("forgot");
  else if (path === "/account") renderAccount();
  else if (parts[0] === "admin" && parts[1] === "orders" && parts[2]) renderAdminOrderDetail(parts[2]);
  else if (path === "/admin") renderAdmin();
  else if (parts[0] === "checkout" && parts[1]) renderPurchase(parts[1]);
  else if (path === "/purchase") renderPurchase(products[0].id);
  else if (parts[0] === "purchase" && parts[1]) renderPurchase(parts[1]);
  else if (path === "/success") renderSuccess();
  else renderNotFound();

  setActiveNavigation(path);
  updateAuthNavigation();
  attachCategoryTabs();
  renderIcons();
  window.scrollTo(0, 0);
  app.focus();
}

async function startSite() {
  await loadProducts();
  const tools = await getFirebaseTools();

  if (tools) {
    tools.authModule.onAuthStateChanged(tools.auth, async (user) => {
      currentUser = user;
      await loadOrders();
      router();
    });
  } else {
    router();
  }
}

window.addEventListener("hashchange", router);
startSite();
