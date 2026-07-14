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
      problem:
        "Running a growth Instagram account solo means someone has to write, fact-check, design, and publish twice a day, forever — and the one time a hallucinated stat or a shadowban-trigger phrase slips through, reach tanks for weeks.",
      solution:
        "Built an autonomous pipeline where a caption only ships after two independent AI auditors agree it's safe, running unattended on a GitHub Actions cron with a human veto window before anything actually publishes.",
      scenario: [
        { t: "T+0s", event: "GitHub Actions cron fires at 18:00 IST — a brand-new, stateless runner boots with zero memory of the last run." },
        { t: "T+1s", event: "auto_post.py checks pipeline_checkpoint.json first, in case a post from the last run is still sitting in review." },
        { t: "T+3s", event: "No pending checkpoint found. config.json's WEEKLY_SCHEDULE resolves today's evening slot to CAROUSEL_FLOW; content_generator.py drafts a topic and caption with Gemini." },
        { t: "T+5s", event: "The topic's embedding is compared against the last 30 days via cosine similarity — adaptive_thresholds() computes today's duplicate cutoff from the mean and standard deviation of recent similarity pairs, not a fixed number." },
        { t: "T+6s", event: "Similarity lands between the low and high threshold — the ambiguous middle band Vurlo-style fixed cutoffs can't resolve.", danger: true },
        { t: "T+7s", event: "is_semantic_duplicate_llm() breaks the tie: not a duplicate. Pipeline proceeds." },
        { t: "T+9s", event: "verify_text_content() sends the caption to Groq and Cerebras independently — both must return caption_ok AND facts_ok, or the whole caption is rejected." },
        { t: "T+11s", event: "Both approve. Jinja2 renders the slide templates; Playwright screenshots them at 1080x1350, 2x scale, after waiting on networkidle plus a settle buffer for Google Fonts." },
        { t: "T+14s", event: "save_checkpoint() base64-encodes the slide images into pipeline_checkpoint.json with status: pending_review and a timestamp. The runner exits — the container is destroyed." },
        { t: "T+1,800s", event: "30 minutes later, the next cron tick's load_checkpoint() finds the same checkpoint, sees age_hours >= 0.5, and auto-approves — publishing through the Instagram Graph API and deleting the checkpoint." },
      ],
      solutionSteps: [
        { step: "Persist state across two runners that never coexist", detail: "save_checkpoint()/load_checkpoint() serialize the topic, caption, and base64-encoded media bytes to a local pipeline_checkpoint.json, since nothing in memory survives a GitHub Actions job ending.", file: "database.py" },
        { step: "Score duplicates against a moving baseline, not a fixed cutoff", detail: "adaptive_thresholds() derives low/high similarity cutoffs each run from μ + σ and μ + 1.5σ of the recent embedding pairs (capped at 0.78 / 0.88), so the bar shifts with how similar the account's own recent output has actually been.", file: "database.py" },
        { step: "Never let one model grade its own homework", detail: "verify_text_content() routes the caption to Groq (llama-3.3-70b-versatile) and Cerebras (gpt-oss-120b) independently — different vendors, different base models — and ANDs their decisions together.", file: "text_auditor.py" },
        { step: "Force a human decision point before anything goes live", detail: "A generated post sits at status: pending_review for a 30-minute window on the dashboard; the next cron tick or a manual --action=approve/reject decides its fate.", file: "auto_post.py" },
      ],
      result:
        "Every post clears two independent auditors and a statistically-adaptive duplicate filter before it's even eligible to publish, and the whole two-post day — drafting, auditing, rendering, and shipping — runs for roughly $0.0002 without a manual click when nobody intervenes.",
      resultStats: [
        { label: "Inference cost / post", value: "~$0.0002" },
        { label: "Independent audits required", value: "2 of 2" },
        { label: "Human review window", value: "30 min" },
        { label: "Output formats", value: "4 (photo/carousel/reel/listicle)" },
      ],
    },
    architecture: [
      { id: "cron", label: "GitHub Actions cron → auto_post.py", desc: "fires at fixed IST slot hours and resolves the day's format (photo/carousel/reel/listicle) from config.json's WEEKLY_SCHEDULE map, keyed by weekday and slot instead of one fixed daily template." },
      { id: "checkpoint", label: "database.py — save_checkpoint() / load_checkpoint()", desc: "the only state that survives between two entirely separate ephemeral runners — serializes topic, caption, and base64-encoded media to pipeline_checkpoint.json, self-expiring after 24 hours." },
      { id: "content-gen", label: "content_generator.py", desc: "drafts a topic and caption using Gemini, pulling from a weighted voice pool (Punchy, Listicle, Storytelling, Question-Hook, Stat-Led) so back-to-back posts don't read like the same template." },
      { id: "dedupe", label: "database.py — cosine_similarity() / adaptive_thresholds()", desc: "a three-tier duplicate filter: fast-reject below a statistically adaptive low threshold, fast-flag above a high threshold, and only the ambiguous middle band falls through to an LLM tiebreaker." },
      { id: "auditor", label: "text_auditor.py — verify_text_content()", desc: "local regex/heuristic pre-checks (emoji density, disclaimer placement, shadowban phrase patterns) reject for free before any API call, then Groq and Cerebras independently audit whatever survives." },
      { id: "renderer", label: "listicle_pipeline.py — render_pages()", desc: "fills Jinja2 HTML templates with the approved copy, then screenshots them via headless Playwright Chromium at 1080x1350 / 2x device scale, waiting on networkidle plus a fixed settle buffer for web fonts." },
      { id: "publisher", label: "instagram_publisher.py / threads_publisher.py", desc: "publishes the approved asset set through the Instagram Graph API and cross-posts the same content to Threads, sitting behind the 30-minute review gate rather than firing immediately." },
      { id: "dashboard", label: "database.py — update_dashboard() → dashboard.html", desc: "renders a static control panel showing the pending-review card with Approve/Reject buttons wired to a GitHub workflow_dispatch, plus live per-post API cost telemetry from APITracker." },
    ],
    features: [
      "Zero-touch daily publishing — a GitHub Actions cron resolves each day's format from a weekly schedule map instead of posting the same content type every day.",
      "Adversarial fact-checking before anything ships — every caption is drafted by Gemini, then independently audited by Groq and Cerebras, with both providers required to agree before it's approved.",
      "Statistically-adaptive duplicate detection — cosine similarity against the account's post history, scored against thresholds recomputed each run from the mean and standard deviation of recent embedding pairs, not one fixed cutoff.",
      "Free local pre-screening before any API spend — regex and heuristic checks (emoji count, disclaimer placement, banned-phrase patterns) reject risky captions before a single audit call is made.",
      "State that survives an ephemeral runner dying mid-post — a self-expiring JSON checkpoint carries topic, caption, and base64-encoded media across two separate GitHub Actions invocations.",
      "Built-in human veto window — every generated post sits for 30 minutes as pending_review on a live dashboard before auto-publishing, with one-click approve/reject wired to a GitHub workflow.",
      "Headless-render pipeline for branded slides — Jinja2 templates screenshot through Playwright Chromium at 1080x1350, 2x scale, with explicit waits so slides don't ship mid-font-swap.",
      "Perceptual duplicate guards for media, separate from text — dhash/pHash image comparisons stop the same visual from posting twice, independent of the caption-level embedding check.",
      "Cross-platform publishing from one pipeline — the same approved asset set republishes to Threads without regenerating any content.",
      "Per-run cost telemetry — an APITracker tallies Gemini token costs and per-provider fallback usage straight into the dashboard, so spend is visible per post, not just in aggregate.",
    ],
    challenges: [
      {
        title: "Making State Survive Between Two Runners That Never Coexist",
        problem: "auto_post.py runs as a brand-new GitHub Actions job every invocation — no memory, no disk, no in-process variables carry over between the run that drafts a post and the run 30 minutes later that's supposed to publish it.",
        difficulty: "A GitHub Actions runner is torn down completely when the job ends. Adding a human review window between generation and publish meant handing a fully-generated post — including binary image and video bytes — from one ephemeral container to a container that didn't exist yet.",
        solution: "save_checkpoint() serializes the topic, caption, and base64-encoded asset bytes to a local pipeline_checkpoint.json with a timestamp; the next cron tick's load_checkpoint() reads it, confirms it's under 24 hours old, and resumes the pipeline exactly where it left off.",
        fixSteps: [
          { step: "Base64-encode every binary asset — image bytes, video slide frames — into the checkpoint JSON, not just text fields", file: "auto_post.py" },
          { step: "Stamp every checkpoint with an ISO timestamp and self-expire it after 24 hours", file: "database.py" },
          { step: "Check checkpoint.status === 'pending_review' before drafting anything new, so a cron tick during the review window can't generate a second, competing post" },
        ],
        learned: "Idempotency isn't optional on ephemeral infrastructure — it's the only way a stateless scheduler can approximate a stateful workflow. The checkpoint file is effectively the pipeline's entire call stack, frozen and reloaded by whichever runner picks it up next.",
      },
      {
        title: "One Model Grading Its Own Homework",
        problem: "Having Gemini draft a caption and then having Gemini check that same caption for factual accuracy meant asking one model to catch its own blind spots — it tended to repeat the exact mistake it had just made.",
        difficulty: "Self-review only catches errors the model already 'knows' are errors. Hallucinated facts and shadowban-risk phrasing that felt natural during generation felt just as natural on a second pass by the same weights.",
        solution: "verify_text_content() runs cheap deterministic checks first, then routes the caption to Groq and Cerebras — two different vendors running two different base models — independently, requiring both to return caption_ok AND facts_ok before anything is approved.",
        fixSteps: [
          { step: "Run local regex/heuristic pre-checks first — emoji density over 4, disclaimer placed after hashtags, wall-of-text with no paragraph breaks — rejecting for free before any network call", file: "text_auditor.py" },
          { step: "Query Groq and Cerebras with the identical audit prompt and brand system instruction, but as fully separate calls" },
          { step: "AND the two decisions together — one dissenting auditor rejects the whole caption, with its specific fail_reason logged", file: "text_auditor.py" },
        ],
        learned: "Cross-vendor disagreement is a signal, not noise. Two different model families are far less likely to share the same hallucination or miss the same shadowban trigger than the same model asked twice.",
      },
      {
        title: "A Fixed Similarity Cutoff Couldn't Tell 'Repeat Topic' From 'Same Niche'",
        problem: "Embedding similarity is supposed to flag duplicate topics before they get posted twice, but a single hardcoded cosine-similarity cutoff was either too loose after a run of very similar recent posts, or too strict once the account's output had naturally drifted to more varied ground.",
        difficulty: "The account posts within one niche (AI/fintech), so baseline similarity between any two unrelated topics is already higher than in a general-purpose feed. A cutoff tuned for one stretch of posts became wrong for the next.",
        solution: "adaptive_thresholds() computes the mean and standard deviation across every pairwise similarity in the recent embedding set, then derives a low/high threshold band from that distribution — falling back to a fixed 0.72/0.82 only when there isn't enough history yet.",
        fixSteps: [
          { step: "Compute μ and σ across all recent embedding pairs on every run, not once at setup", file: "database.py" },
          { step: "Derive low = min(0.78, μ+σ) and high = min(0.88, μ+1.5σ) instead of one constant for every run" },
          { step: "Route only the ambiguous middle band to a slower LLM tiebreaker (is_semantic_duplicate_llm), keeping the fast embedding path cheap for the clear cases" },
        ],
        learned: "A threshold tuned once against a snapshot of data quietly goes stale as the data distribution shifts. Recomputing it from the current population, every time, made the duplicate filter self-correcting instead of something I'd have to keep manually re-tuning.",
      },
      {
        title: "Headless Chromium Was Screenshotting Slides Before Fonts Finished Loading",
        problem: "Playwright screenshots taken on a clean GitHub Actions runner occasionally captured branded listicle slides mid-font-swap — Outfit and Fira Code hadn't finished downloading from Google Fonts yet, so the slide shipped in the browser's fallback serif.",
        difficulty: "A fresh CI container has no font cache the way a local dev machine does, and Playwright's networkidle state can technically fire while a CSS @font-face request is still resolving in the background — the race was intermittent, not reliably reproducible locally.",
        solution: "render_pages() loads each rendered Jinja2 template from a local file:// URI, waits for networkidle, then adds a fixed settle buffer before the screenshot fires — and renders at 2x device scale inside a 1080x1350 viewport for full carousel resolution.",
        fixSteps: [
          { step: "page.goto() the rendered HTML from a local temp file so relative image assets resolve the same way they do in dev", file: "listicle_pipeline.py" },
          { step: "page.wait_for_load_state('networkidle', timeout=5000), then page.wait_for_timeout(1500) as an explicit buffer past the point networkidle technically resolves", file: "listicle_pipeline.py" },
          { step: "Launch the browser context with viewport 1080x1350 and device_scale_factor: 2 so slides render at full carousel resolution, not scaled up after the fact" },
        ],
        learned: "networkidle is a proxy for 'probably done,' not a guarantee — it doesn't know about a font swap that hasn't repainted yet. A short deterministic buffer after the network settles is a blunt fix, but far more reliable in CI than trusting the event alone.",
      },
    ],
    journey: [
      { day: "Day 1", milestone: "Core Pipeline & LLM Hooks", details: "content_generator.py drafting flow wired to Gemini; config.json's weekly schedule map and voice pool established." },
      { day: "Day 3", milestone: "Dual-Brain Auditor", details: "text_auditor.py built out — local heuristic pre-checks, then independent Groq and Cerebras audit calls, AND-ed together." },
      { day: "Day 5", milestone: "Adaptive Duplicate Detection", details: "Embedding cache and adaptive_thresholds() written in database.py, replacing an earlier fixed-cutoff version that kept misfiring." },
      { day: "Day 7", milestone: "Playwright + Jinja2 Render Pipeline", details: "listicle_pipeline.py template rendering and headless screenshot capture stood up; chased down the font-loading race in CI." },
      { day: "Day 9", milestone: "Checkpoint & Review Gate", details: "save_checkpoint()/load_checkpoint() shipped in database.py; auto_post.py wired to the 30-minute pending_review window and dashboard approve/reject actions." },
      { day: "Day 10", milestone: "Publishing & Dashboard", details: "instagram_publisher.py and threads_publisher.py cross-posting wired up; dashboard.html control panel and APITracker cost telemetry finished before enabling the cron." },
    ],
    lighthouse: {
      performance: 99,
      accessibility: 97,
      bestPractices: 100,
      seo: 88,
    },
    decisions: [
      {
        tech: "Gemini 2.5 Flash + gemini-embedding-2",
        title: "One Provider for Both Drafting and Embeddings",
        explanation: "Gemini writes the initial topic/caption and also generates the embedding vectors used for duplicate detection — keeping the 'creative' half of the pipeline on one low-cost, low-latency provider.",
      },
      {
        tech: "Groq + Cerebras",
        title: "Independent Adversarial Audit, Not a Second Opinion From the Same Vendor",
        explanation: "verify_text_content() requires both providers — running different base models (llama-3.3-70b-versatile, gpt-oss-120b) — to independently approve a caption, so a shared blind spot in one model family can't rubber-stamp a mistake.",
      },
      {
        tech: "Playwright + Jinja2",
        title: "Headless Card Generation",
        explanation: "Branded listicle slides are real HTML/CSS templates screenshotted at 1080x1350, 2x scale — layout, typography, and responsive-style rules come for free instead of hand-positioning text on a canvas.",
      },
      {
        tech: "Local JSON checkpoint + SQLite",
        title: "Zero-Infra State for a Scheduler With No Server",
        explanation: "No process stays alive between runs. pipeline_checkpoint.json and veltrix.db are the entire state layer, both just files the workflow commits back to the repo — no database server to provision or pay for.",
      },
      {
        tech: "GitHub Actions cron + workflow_dispatch",
        title: "Free Scheduler That Doubles as the Approval Queue",
        explanation: "The same GitHub Actions infra that runs the cron also handles the manual approve/reject action for the human review gate, so there's no separate approval service or webhook receiver to host.",
      },
    ],
    lessons: [
      "Move the checkpoint's binary asset payload out of a committed JSON file and into object storage (Supabase/Cloudinary) — base64-encoding video frames into the checkpoint bloats the repo's history over time.",
      "Cache Groq/Cerebras audit responses so a topic that gets re-evaluated after a checkpoint recovery doesn't burn two more audit calls for content that's already been reviewed.",
      "Extend perceptual image-hash duplicate checking to Reel source frames, not just PHOTO/CAROUSEL stills — a remade Reel can currently reuse near-identical frames undetected.",
      "Replace the fixed 1.5s Playwright settle buffer with an actual document.fonts.ready wait inside the page — it works today, but it's a guess dressed up as a timeout.",
    ],
    gallery: [
      { label: "Live Control Panel", img: "/veltrix-preview.png" },
      { label: "Pipeline Execution Logs", img: "/veltrix-logs-view.png" },
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
