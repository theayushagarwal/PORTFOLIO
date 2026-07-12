export interface ProjectDetail {
  whyBuilt: {
    problem: string;
    solution: string;
    result: string;
    scenario?: { t: string; event: string; danger?: boolean }[];
    solutionSteps?: { step: string; detail?: string; file?: string }[];
    resultStats?: { label: string; value: string }[];
  };
  architecture: {
    id: string;
    label: string;
    desc: string;
  }[];
  features: string[];
  challenges: {
    title: string;
    problem: string;
    difficulty: string;
    solution: string;
    fixSteps?: { step: string; detail?: string; file?: string }[];
    learned: string;
  }[];
  journey: {
    day: string;
    milestone: string;
    details: string;
  }[];
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  decisions: {
    tech: string;
    title: string;
    explanation: string;
  }[];
  lessons: string[];
  gallery: {
    label: string;
    img: string;
  }[];
  theme: {
    primary: string; // Tailwind class like "from-cyan-400"
    secondary: string; // Tailwind class like "to-violet-500"
    glow: string; // CSS color string or class like "rgba(34, 211, 238, 0.15)"
  };
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  Vurlo: {
    theme: {
      primary: "from-cyan-400",
      secondary: "to-violet-500",
      glow: "rgba(34, 211, 238, 0.15)",
    },
    whyBuilt: {
      problem:
        "Firestore has no \"hold this unit while someone pays\" primitive — two people can buy the last lamp at the same second if stock isn't locked at the right moment.",
      solution:
        "Run atomic stock check-and-decrement transactions for each item before payment, with rollbacks on checkout exits.",
      scenario: [
        { t: "T+0s", event: "Customer A adds the last Saturn Lamp (stock: 1) to cart, hits checkout." },
        { t: "T+1s", event: "Customer B does the exact same thing, same product, same second." },
        { t: "T+2s", event: "Both clients read products/{id}.stock → both see 1. Both pass the \"is there enough stock\" check.", danger: true },
        { t: "T+3s", event: "Both writes land. Stock goes 1 → 0 → then to -1 if nothing stops the second write.", danger: true },
        { t: "T+9s", event: "Razorpay confirms both payments. Vurlo just sold a lamp it doesn't have." },
      ],
      solutionSteps: [
        { step: "Reserve inside a transaction, not before it", detail: "placeOrder() opens one runTransaction per cart line item and re-reads stock at commit time — not whatever the client fetched on page load.", file: "use-cart.tsx" },
        { step: "Throw before any write lands", detail: "If stock < quantity inside the transaction body, it throws. Firestore retries the whole read/write pair on conflict — I'm not writing retry logic by hand.", file: "use-cart.tsx" },
        { step: "Batch the order creation", detail: "One writeBatch creates the order doc, clears the cart subcollection, and writes a notification — all committed together, so there's no half-created order.", file: "use-cart.tsx" },
        { step: "Roll back on every failure exit", detail: "Signature mismatch, modal dismiss, SDK constructor throw, raw catch — all four delete the pending order and run a compensating runTransaction to add stock back.", file: "checkout-component.tsx" },
      ],
      result:
        "Zero oversells since launch — COD and Razorpay both run through the same reserve → commit → verify pipeline.",
      resultStats: [
        { label: "Stock leaks in prod", value: "0" },
        { label: "Failed checkout recoveries", value: "100%" },
        { label: "Lighthouse perf", value: "98 / 100" },
        { label: "Initial bundle size", value: "-45%" },
      ],
    },
    architecture: [
      { id: "routes", label: "src/routes/ → routeTree.gen.ts", desc: "automatic page routes matched directly to your project folders — uses @tanstack/router-plugin to watch the file tree at build-time and compile routeTree.gen.ts, removing any need to write manual routing configs." },
      { id: "cart-hook", label: "use-cart.tsx", desc: "keeps client cart state fully synced across open tabs and guest sessions — uses a live onSnapshot listener for accounts, a localStorage fallback for guests, and performanceMerge() to reconcile both when a user logs in." },
      { id: "checkout-ui", label: "checkout-component.tsx", desc: "manages shipping validations, real-time coupon calculations, and checkout branching — lazy-loaded to keep load times down, splitting execution flows cleanly between Cash-on-Delivery and Razorpay online payments." },
      { id: "reserve", label: "placeOrder()", desc: "reserves stock atomically inside a database transaction so two people never buy the same last item — reads current stock, updates it, and commits checkout details alongside cart clearing in a single atomic writeBatch." },
      { id: "razorpay-order", label: "api/create-razorpay-order.ts", desc: "a secure backend helper to initiate online credit/debit card orders — instantiates the Razorpay SDK server-side to generate order tokens securely without ever exposing keys to the client web browser." },
      { id: "razorpay-verify", label: "api/verify-razorpay-payment.ts", desc: "the check that stops someone faking a 'payment successful' callback and getting a free order — recomputes crypto.createHmac('sha256', RAZORPAY_KEY_SECRET) over `${order_id}|${payment_id}` and compares it against razorpay_signature before firebase-admin marks the order paid. no timing-safe compare, works fine for now but I'd swap in crypto.timingSafeEqual if I revisit this" },
      { id: "rules", label: "firestore.rules", desc: "in plain terms: a customer can cancel their own pending order and change nothing else about it. Enforced by `diff(resource.data).affectedKeys().hasOnly(['status'])` on the top-level orders/{orderId} rule — users/{uid}/orders/{orderId} itself is hard-locked to `allow read, write: if false` so there's no back door in" },
      { id: "email", label: "api/send-order-email.ts", desc: "sends confirmation emails asynchronously without slowing down checkout — fires a background notification request to Resend after checkout commits, ensuring slow mail servers never hold up the customer's success screen." },
      { id: "ai-recommend", label: "api/ai-recommend.ts", desc: "uses AI to suggest complementary products directly on the cart page — sends current cart catalog items to Gemini 2.0 Flash and returns matching product IDs, backed by an in-memory cache to save on API costs." },
    ],
    features: [
      "Secure stock reservation before payment — reserves items using a database transaction before the payment gateway modal opens, preventing race conditions.",
      "Automatic stock recovery on aborted payments — a compensating rollback deletes pending orders and restores stock on signature mismatches, modal dismissals, or API constructor throws.",
      "Seamless guest-to-account cart merging — preserves local items in browser storage and combines them into the customer database on sign-in without duplicating quantities.",
      "Flexible promo coupons — handles percentage/fixed discount rules, expiry dates, minimum spending thresholds, and usage caps.",
      "Tamper-proof payment integrations — runs online card payments verified via server-side HMAC-SHA256 checks, with a COD alternative.",
      "Dynamic AI product suggestions — calls Gemini 2.0 Flash to recommend complementary accessories, falling back to instant local presets while the API loads.",
      "Secure merchant dashboard — role-gated access control for admins to manage product listings, coupon campaigns, and real-time inventory alerts.",
      "Optimized customer load times — lazy-loads checkout and admin panel components on-demand so storefront visitors don't download code they'll never use.",
      "Caching strategy for instant return visits — splits codebase vendor libraries into separate chunks, ensuring a database update doesn't force repeat users to re-download the React application.",
      "Automated image optimization — scales product images down to a 760px ceiling and generates modern next-gen webp pairs during build to maximize page speed.",
    ],
    challenges: [
      {
        title: "Stopping Double-Sells in the Cart → Payment Gap",
        problem: "Between 'add to cart' and Razorpay's async confirmation, nothing stopped the same lamp being bought twice.",
        difficulty: "Two customers could both end up thinking they'd bought the last lamp. Firestore has no built-in way to say 'only one request touches this stock count at a time' (what databases call row-locking) — two placeOrder() calls reading the same field at the same instant can both pass the check and both decrement. That's overselling by construction, not a bug.",
        solution: "placeOrder() and reserveStockAndGetTotal() both wrap each cart line item in its own runTransaction, re-reading stock inside the transaction and throwing before any write happens if stock < item.quantity.",
        fixSteps: [
          { step: "Wrap each cart line item in its own runTransaction", file: "use-cart.tsx" },
          { step: "Re-read stock inside the transaction body, not before it" },
          { step: "Throw before any write — Firestore retries the whole pair on conflict" },
        ],
        learned: "Firestore transactions are scoped per-document, not per-request. Protecting a multi-item order means N separate transactions, not one transaction wrapped around the whole cart — I got that wrong on the first pass.",
      },
      {
        title: "Not Leaking Stock on Every Way Razorpay Can Fail",
        problem: "Once stock is decremented for a pending order, at least four separate paths can still kill the checkout before payment confirms.",
        difficulty: "If checkout fails at any point after stock is reserved, inventory leaks. Signature mismatch, closing the modal, checkout API errors, and network disconnects are four separate exit points — miss one, and you've locked up stock for a sale that never completed.",
        solution: "The same rollback block — deleteDoc the order, then runTransaction per cart item to restore stock — is duplicated into all four exit points.",
        fixSteps: [
          { step: "deleteDoc(orders/{orderId}) on any failed exit", file: "checkout-component.tsx" },
          { step: "runTransaction per cart item to add stock back" },
          { step: "Wire identically into all 4 exits: !verifyRes.ok, ondismiss, SDK throw, outer catch" },
        ],
        learned: "Payment integrations fail in more places than the happy path suggests. Every exit needs the same cleanup or the bug reports you get later look completely unrelated to the actual cause.",
      },
      {
        title: "Preventing Customers from Promoting Themselves to Admin",
        problem: "Customers need to cancel their own pending orders; admins need full access; nobody should self-grant the admin role.",
        difficulty: "Standard database rules are often too broad. If you allow users to edit their profile, they can easily intercept the network request and sneak a role: 'admin' field into their signup data.",
        solution: "users/{userId} rejects role, emailVerified, and admin on create/update. The orders/{orderId} rule scopes customer updates to a single field.",
        fixSteps: [
          { step: "Make it impossible for a user to grant themselves admin", detail: "Firestore's hasNone/hasAny checks block role, emailVerified, and admin from ever appearing in a user's own create or update.", file: "firestore.rules" },
          { step: "Let a cancel change status and nothing else", detail: "diff().affectedKeys().hasOnly(['status']) — the write only goes through if status is the one field changing." },
          { step: "Require the order is currently 'pending' and the new value is exactly 'cancelled'" },
        ],
        learned: "diff().affectedKeys() is the actual mechanism that stops someone smuggling an extra field change inside an otherwise-legitimate update. Type checks alone don't catch that.",
      },
      {
        title: "Making the Guest → Account Cart Merge Safe to Run Twice",
        problem: "Guest carts sit in localStorage; logging in has to fold them into Firestore without duplicating quantities.",
        difficulty: "If the merge fires twice (due to network retries, fast double-taps, or double-renders), a naive function just keeps adding quantities. A customer with 2 lamps in their cart suddenly finds themselves checking out with 4.",
        solution: "performMerge() reads the existing Firestore quantity, clamps the merged total against current stock, and only clears localStorage after the batch commits.",
        fixSteps: [
          { step: "Read existing Firestore itemSnap for each local item", file: "use-cart.tsx" },
          { step: "Clamp: Math.min(stock, dbQty + item.quantity)" },
          { step: "Only clear vurlo_local_cart after batch.commit() resolves" },
        ],
        learned: "Write merge logic assuming it'll run twice. Clamping against server state instead of trusting local state is what makes a rerun harmless instead of a duplicate-quantity bug.",
      },
      {
        title: "Keeping the Admin Panel Out of the Customer's Bundle",
        problem: "Vurlo ships a full admin console inside the same route tree as the customer storefront.",
        difficulty: "Every visitor who just wanted to buy a lamp was also downloading the admin dashboard's code for no reason — slowing down how fast the page feels loaded (LCP, the score Google grades pages on) for a customer who'll never even see that dashboard.",
        solution: "checkout.tsx and admin routes lazy-load via React.lazy + Suspense; vite.config.ts splits vendor/firebase/router/query/ui into separate chunks.",
        fixSteps: [
          { step: "React.lazy + Suspense on checkout.tsx and every admin route" },
          { step: "manualChunks split: vendor / firebase / router / query / ui", file: "vite.config.ts" },
          { step: "sharp resize pass caps product images at 760px with matching webp" },
        ],
        learned: "Route-level code splitting plus an actual image size budget moves real-world load time more than any JS micro-optimization I tried.",
      },
    ],
    journey: [
      { day: "Day 1", milestone: "Scaffold & File-based Routing", details: "TanStack Start scaffold, Tailwind/shadcn config, src/routes/ tree established." },
      { day: "Day 2", milestone: "Firebase Wiring", details: "firebase.json set up; Auth + Firestore SDK wired into use-auth.tsx and lib/firebase.ts." },
      { day: "Day 3", milestone: "Cart & Guest Persistence", details: "use-cart.tsx built out — onSnapshot cart, localStorage guest fallback, merge-on-login batch." },
      { day: "Day 5", milestone: "Firestore Security Rules", details: "firestore.rules written — admin role gating, field-diff protections, nested orders lockdown." },
      { day: "Day 6", milestone: "Checkout & Coupons", details: "checkout-component.tsx multi-step flow shipped, coupon validation against the coupons collection." },
      { day: "Day 7", milestone: "Razorpay Integration", details: "create-razorpay-order.ts and verify-razorpay-payment.ts built, HMAC verification wired into every exit path." },
      { day: "Day 8", milestone: "Admin Console", details: "admin.tsx role-gated layout shipped with products, orders, coupons, stock-request panels." },
      { day: "Day 10", milestone: "AI, Email & Performance Pass", details: "Gemini recommendations, Resend emails, image pipeline, manualChunks split, sitemap gen before deploy." },
    ],
    lighthouse: {
      performance: 98,
      accessibility: 100,
      bestPractices: 96,
      seo: 100,
    },
    decisions: [
      {
        tech: "TanStack Start / Router",
        title: "File-based Routes, Compiled at Build Time",
        explanation: "Routes are plain files under src/routes/; @tanstack/router-plugin compiles them into routeTree.gen.ts so I'm not hand-maintaining a route config object anywhere.",
      },
      {
        tech: "React 19",
        title: "Suspense-Driven Code Splitting",
        explanation: "checkout-component.tsx (906 lines) and the admin dashboard are both React.lazy imports behind Suspense fallbacks — keeps checkout/admin code out of the anonymous storefront bundle entirely.",
      },
      {
        tech: "Firestore Transactions",
        title: "Per-Document Atomic Stock Decrements",
        explanation: "runTransaction runs once per product doc in both placeOrder() and reserveStockAndGetTotal() (use-cart.tsx), so two simultaneous checkouts on the same item can't both win the stock check.",
      },
      {
        tech: "Vite manualChunks",
        title: "Deliberate Vendor Splitting",
        explanation: "rollupOptions.output.manualChunks explicitly separates vendor, firebase, router, query, and ui — a Firestore SDK bump doesn't blow away the React vendor chunk's cache.",
      },
      {
        tech: "Razorpay + firebase-admin",
        title: "Server-Only Payment Verification",
        explanation: "verify-razorpay-payment.ts is the only place RAZORPAY_KEY_SECRET recomputes the HMAC signature, and the only code holding firebase-admin credentials to flip an order to paid. The browser never sees either.",
      },
    ],
    lessons: [
      "Extract the four copy-pasted rollback blocks in checkout-component.tsx into one shared function — right now a fix to one means remembering to fix it in three other places",
      "Batch the per-item runTransaction calls in placeOrder() into a single transaction that reads all product refs up front, instead of N sequential round-trips for an N-item cart",
      "Add a scheduled job to expire orders stuck at paymentStatus: 'upi_pending' when someone abandons the Razorpay modal in a way that doesn't fire ondismiss",
      "Move ai-recommend.ts's in-memory Map cache into Firestore or Redis — it resets on every serverless cold start, so the 30-minute TTL almost never actually survives long enough to matter",
      "Wrap coupon usageCount increments in the same transaction as the usageLimit check — right now two concurrent redemptions can both read usageCount before either write lands",
    ],
    gallery: [
      { label: "Homepage Preview", img: "/vurlo-preview.png" },
      { label: "Checkout & Payment Flow", img: "/vurlo-checkout-view.png" },
      { label: "Inventory Console", img: "/vurlo-admin.png" },
    ],
  },
  Veltrix: {
    theme: {
      primary: "from-emerald-400",
      secondary: "to-teal-500",
      glow: "rgba(16, 185, 129, 0.15)",
    },
    whyBuilt: {
      problem: "Managing multiple social media handles is time-consuming, prone to human writer block, and lacks objective risk filtering.",
      solution: "Developed an autonomous double-model agent pipeline running via GitHub cron to draft, audit, generate, and upload content.",
      result: "Fully automated posting cycles costing ~$0.0002 per run with zero manual intervention and factual auditing filters.",
    },
    architecture: [
      { id: "cron", label: "GitHub Action Cron", desc: "Triggers twice-daily runtime sessions on schedule" },
      { id: "gemini", label: "Gemini Pro", desc: "Generates creative post copy, hashtags, and visual generation prompts" },
      { id: "auditor", label: "Auditor Brain", desc: "Independent model (Groq/Cerebras) checks copy for ban risk and fact slips" },
      { id: "playwright", label: "Playwright Headless", desc: "Screenshots dynamic Jinja2-rendered templates into custom listicle cards" },
      { id: "supabase", label: "Supabase DB", desc: "Saves media outputs, runs checkpoint logs, and queues publishing schedules" }
    ],
    features: [
      "Cron-based Auto-runner",
      "Dual-brain LLM Auditing",
      "Dynamic Jinja2 Template Cards",
      "Playwright Headless Rendering",
      "State Checkpoint Recovery",
      "Multi-format Export Pipeline",
      "Shadowban Risk Filter",
      "Token Cost Analysis Dashboard"
    ],
    challenges: [
      {
        title: "Dual-Brain Factual Auditing",
        problem: "Generative models occasionally hallucinate facts or generate copy that triggers policy flags.",
        difficulty: "A single model checking its own work will repeat the same errors due to internal confirmation bias.",
        solution: "Implemented an independent auditor loop using Groq/Cerebras running a different base LLM to run adversarial audits.",
        learned: "True autonomy requires multi-model friction loops to ensure consistency."
      },
      {
        title: "Playwright Render Stability",
        problem: "Headless screenshotting on GitHub Actions runners frequently resulted in clipped edges and font loading errors.",
        difficulty: "Docker containers on clean runners lack local system fonts, leading to layout shifts.",
        solution: "Wrote startup bash hooks to pull system web fonts and configured Playwright to wait for document.fonts.ready.",
        learned: "Headless browsers require identical environmental rendering dependencies to behave like local previews."
      },
      {
        title: "Checkpoint Recovery Patterns",
        problem: "If an API call timed out mid-run, the pipeline would crash and duplicate postings on restart.",
        difficulty: "Network errors are inevitable in external APIs; workflows must be idempotent.",
        solution: "Stored transaction checkpoints in SQLite, allowing the runtime engine to skip completed steps on rerun.",
        learned: "Designing workflows as resumable state machine blocks saves tokens and prevents double-posting bugs."
      }
    ],
    journey: [
      { day: "Day 1", milestone: "Core Script & LLM API Hooks", details: "Established text generation pipelines and verified response schema formats." },
      { day: "Day 3", milestone: "Adversarial Auditor System", details: "Wired Groq/OpenRouter fallback modules to verify primary output." },
      { day: "Day 5", milestone: "Playwright Layout Templates", details: "Designed HTML templates and wired screen capture nodes." },
      { day: "Day 8", milestone: "SQLite Checkpoints", details: "Implemented state recovery logic and configured database transactions." },
      { day: "Day 10", milestone: "GitHub Actions Deployment", details: "Wired cron actions and configured environment secrets." }
    ],
    lighthouse: {
      performance: 99,
      accessibility: 100,
      bestPractices: 100,
      seo: 92
    },
    decisions: [
      {
        tech: "Gemini API",
        title: "Primary Content Engine",
        explanation: "Offers massive context sizes and low latency for copy drafting at near-zero costs."
      },
      {
        tech: "Playwright",
        title: "Headless Card Generation",
        explanation: "Allows converting standard Tailwind HTML templates directly into high-res images, bypassing canvas design limitations."
      },
      {
        tech: "GitHub Actions",
        title: "Zero-Cost Orchestration",
        explanation: "Cron features serve as a robust task scheduler without paying for cloud server instances."
      }
    ],
    lessons: [
      "Support dynamic video rendering using ffmpeg layers",
      "Add audio synthesis for automated voiceovers",
      "Introduce visual AI models to audit created card layouts",
      "Provide custom hook triggers to publish straight to accounts"
    ],
    gallery: [
      { label: "Content Flow Diagram", img: "/veltrix-preview.png" },
      { label: "System Execution logs", img: "/veltrix-logs-view.png" }
    ],
  },
  Vcentre: {
    theme: {
      primary: "from-indigo-400",
      secondary: "to-amber-500",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    whyBuilt: {
      problem: "Scraping competitor data blindly yields raw volume peaks, which are often just a reflection of their account size rather than true creative outliers.",
      solution: "Built a competitive scanner calculating median outliers and compiling structured creative brief tables automatically.",
      result: "Nightly scraping logs analyzing accounts at 3x median virality benchmarks and writing briefs to database slots.",
    },
    architecture: [
      { id: "scrapper", label: "Instagram Scraper", desc: "Scrapes competitor profiles using automated cookies rotation" },
      { id: "pipeline", label: "Analysis Pipeline", desc: "Compares engagement rates against rolling median baselines" },
      { id: "brief", label: "Brief Writer", desc: "Uses fallback chain of LLMs to outline video hook, structure, and text copy" },
      { id: "database", label: "Database Queue", desc: "Saves briefs directly into the database read by posting agents" }
    ],
    features: [
      "Nightly Scraping Cron",
      "Rolling Median Outlier Calculation",
      "Fallback LLM Chain Integration",
      "Brief Template Generator",
      "Scraper Session Rotator",
      "Media Cohort Scoring System",
      "Automatic Trend Queuer",
      "Free-Tier Resource Optimization"
    ],
    challenges: [
      {
        title: "Rolling Median Baseline Calculation",
        problem: "A single extremely viral reel can skew baseline averages, making regular outlier detection fail.",
        difficulty: "Standard averages are highly sensitive to spikes, failing to identify relative outliers.",
        solution: "Implemented a rolling median engagement algorithm split into separate cohorts for Reels vs. Carousel posts.",
        learned: "Median indicators are much more resilient than averages when parsing raw engagement datasets."
      },
      {
        title: "Zero-Cost API Fallbacks",
        problem: "Relying on a single AI provider causes runtime blocks if free quotas are hit.",
        difficulty: "Unmanaged APIs cause pipeline breaks. Fallback chains must be stable.",
        solution: "Established a provider fallback array running GitHub Models first, dropping down to Groq, and using Gemini only as a final brief compiler.",
        learned: "Chaining fallback providers creates rock-solid reliability on free hosting resources."
      }
    ],
    journey: [
      { day: "Day 1", milestone: "Instagram Scraping Scripts", details: "Tested Instaloader cookie rotators and parsed raw JSON posts." },
      { day: "Day 3", milestone: "Median Calculation Math", details: "Wrote cohort split scripts and implemented standard deviation metrics." },
      { day: "Day 5", milestone: "Fallback LLM Pipeline", details: "Chained API keys and configured prompt brief templates." },
      { day: "Day 8", milestone: "Database Write Node", details: "Linked output to SQLite tables read by automations." },
      { day: "Day 10", milestone: "Cadence Integration", details: "Scheduled runs at 2AM UTC on Actions runner profiles." }
    ],
    lighthouse: {
      performance: 97,
      accessibility: 100,
      bestPractices: 96,
      seo: 90
    },
    decisions: [
      {
        tech: "Python / FastAPI",
        title: "Fast Data Manipulation",
        explanation: "Simplifies numerical data structures and handles parsing formats cleanly."
      },
      {
        tech: "Groq / Cerebras",
        title: "Sub-Second Fallback Inference",
        explanation: "Executes extraction models at extreme speed, preventing task execution timeouts."
      },
      {
        tech: "SQLite",
        title: "Zero-Overhead Database",
        explanation: "Keeps data records fully local inside the file system without running complex network servers."
      }
    ],
    lessons: [
      "Expand scraper to support TikTok competitors",
      "Add automatic transcript download for outlier videos",
      "Generate visual storyboard briefs using sketch models",
      "Link outlier alerts straight to Discord channels"
    ],
    gallery: [
      { label: "Dashboard Trend View", img: "/vcentre-preview.png" },
      { label: "AI Creative Briefs", img: "/vcentre-briefs-view.png" }
    ]
  }
};
