#!/usr/bin/env node
/**
 * Portfolio Cross-Publisher CLI (Markdown + JSON)
 *
 * Usage:
 *   node scripts/crosspost.mjs --whoami                  # Verify which DEV.to & Hashnode accounts/blogs .env points to
 *   node scripts/crosspost.mjs --list                    # Show all posts & synced DEV.to/Hashnode state
 *   node scripts/crosspost.mjs posts/carrel.md           # Dry-run: prints formatted packs + validates limits
 *   node scripts/crosspost.mjs posts/carrel.md --draft   # Creates or updates draft on DEV.to & Hashnode
 *   node scripts/crosspost.mjs posts/carrel.md --live    # Publishes or updates live article on DEV.to & Hashnode
 *
 * Environment variables (in .env or shell):
 *   DEVTO_API_KEY      - From https://dev.to/settings/extensions
 *   HASHNODE_TOKEN     - From https://hashnode.com/settings/developer
 *   HASHNODE_PUB_ID    - Optional if your Hashnode account has only 1 publication; auto-detected otherwise
 */

import fs from "node:fs";
import path from "node:path";

const PEERLIST_CHAR_LIMIT = 480;
const X_CHAR_LIMIT = 280;
const STATE_PATH = path.resolve(".crosspost-state.json");

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const vars = {};
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && !(key in process.env)) vars[key] = val;
  }
  return vars;
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}

function parseMarkdownPost(raw, filePath) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    throw new Error(`Missing YAML frontmatter in ${filePath}`);
  }

  const meta = {};
  for (const line of fmMatch[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const k = trimmed.slice(0, colon).trim();
    let v = trimmed.slice(colon + 1).trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      meta[k] = v
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      meta[k] = v.replace(/^["']|["']$/g, "");
    }
  }

  const body = fmMatch[2];
  const sections = {};
  const markerRe = /^<!--\s*SECTION:\s*([A-Z0-9_-]+)\s*-->\r?$/gm;
  const matches = [...body.matchAll(markerRe)];

  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1].toLowerCase();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    sections[name] = body.slice(start, end).trim();
  }

  return {
    slug: meta.slug || path.basename(filePath, path.extname(filePath)),
    title: meta.title || "",
    canonicalUrl: meta.canonicalUrl || "",
    repoUrl: meta.repoUrl || "",
    coverImage: meta.coverImage || "",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    articleMarkdown: sections.article || "",
    peerlistScroll: sections.peerlist || "",
    xPost: sections.x || "",
    linkedinPost: sections.linkedin || "",
    fueler: {
      title: meta.fuelerTitle || meta.title || "",
      skills: Array.isArray(meta.fuelerSkills) ? meta.fuelerSkills : meta.tags || [],
      description: sections.fueler || "",
    },
  };
}

function loadPost(filePath) {
  const abs = path.resolve(filePath);
  const raw = fs.readFileSync(abs, "utf8");
  if (abs.endsWith(".json")) {
    const parsed = JSON.parse(raw);
    return { slug: path.basename(abs, ".json"), ...parsed };
  }
  return parseMarkdownPost(raw, abs);
}

async function syncDevTo(post, apiKey, live, existingId) {
  const isUpdate = Boolean(existingId);
  const url = isUpdate
    ? `https://dev.to/api/articles/${existingId}`
    : "https://dev.to/api/articles";
  const method = isUpdate ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      article: {
        title: post.title,
        body_markdown: post.articleMarkdown,
        published: live,
        canonical_url: post.canonicalUrl,
        tags: (post.tags || []).slice(0, 4),
        main_image: post.coverImage || undefined,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`DEV.to ${method} ${res.status}: ${JSON.stringify(data)}`);
  }
  return {
    action: isUpdate ? "updated" : live ? "published" : "drafted",
    id: data.id,
    url: data.url,
  };
}

const HASHNODE_GQL_URL = process.env.HASHNODE_GQL_URL || "https://gql-beta.hashnode.com";

async function hashnodeRequest(token, query, variables) {
  const res = await fetch(HASHNODE_GQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Hashnode HTTP ${res.status} returned non-JSON: ${text.slice(0, 160)}`);
  }

  if (!res.ok || data.errors?.length) {
    throw new Error(`Hashnode error: ${JSON.stringify(data.errors || data)}`);
  }
  return data;
}

async function syncHashnode(post, token, publicationId, live, existing) {
  let query;
  let input;

  if (existing?.hashnodePostId && live) {
    query = `mutation UpdatePost($input: UpdatePostInput!) {
      updatePost(input: $input) { post { id url slug } }
    }`;
    input = {
      id: existing.hashnodePostId,
      title: post.title,
      contentMarkdown: post.articleMarkdown,
      originalArticleURL: post.canonicalUrl,
      ...(post.coverImage ? { coverImageOptions: { coverImageURL: post.coverImage } } : {}),
    };
  } else if (live) {
    query = `mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) { post { id url slug } }
    }`;
    input = {
      publicationId,
      title: post.title,
      contentMarkdown: post.articleMarkdown,
      originalArticleURL: post.canonicalUrl,
      ...(post.coverImage ? { coverImageOptions: { coverImageURL: post.coverImage } } : {}),
    };
  } else {
    query = `mutation CreateDraft($input: CreateDraftInput!) {
      createDraft(input: $input) { draft { id slug } }
    }`;
    input = {
      publicationId,
      title: post.title,
      contentMarkdown: post.articleMarkdown,
      originalArticleURL: post.canonicalUrl,
      ...(post.coverImage ? { coverImageOptions: { coverImageURL: post.coverImage } } : {}),
    };
  }

  const data = await hashnodeRequest(token, query, { input });

  const postNode = data.data?.updatePost?.post || data.data?.publishPost?.post;
  if (postNode) {
    return {
      action: existing?.hashnodePostId ? "updated" : "published",
      postId: postNode.id,
      url: postNode.url,
    };
  }
  const draftId = data.data?.createDraft?.draft?.id;
  return {
    action: "drafted",
    draftId,
    url: draftId ? `https://hashnode.com/draft/${draftId}` : "created",
  };
}

function printSummary(post, mode, entryState) {
  const peerLen = (post.peerlistScroll || "").length;
  const xLen = (post.xPost || "").length;

  console.log(`\n=== Cross-Post Pack: ${post.title} [${mode.toUpperCase()}] ===`);
  console.log(`Slug          : ${post.slug}`);
  console.log(`Canonical URL : ${post.canonicalUrl}`);
  console.log(`GitHub Repo   : ${post.repoUrl}`);
  console.log(`DEV/Hashnode  : ${post.tags.join(", ")} (${post.articleMarkdown.length} chars)`);
  if (entryState?.devtoId || entryState?.hashnodePostId || entryState?.hashnodeDraftId) {
    console.log(
      `Saved State   : DEV=${entryState.devtoUrl || entryState.devtoId || "none"} | Hashnode=${entryState.hashnodeUrl || entryState.hashnodeDraftId || "none"}`,
    );
  }

  console.log(`\n--- PEERLIST SCROLL (${peerLen}/${PEERLIST_CHAR_LIMIT} chars) ---`);
  if (peerLen > PEERLIST_CHAR_LIMIT) {
    console.warn(`[WARN] Peerlist exceeds ${PEERLIST_CHAR_LIMIT} chars by ${peerLen - PEERLIST_CHAR_LIMIT}!`);
  }
  console.log(post.peerlistScroll);

  console.log("\n--- FUELER PROOF OF WORK ---");
  console.log(`Title      : ${post.fueler.title}`);
  console.log(`Project URL: ${post.canonicalUrl}`);
  console.log(`GitHub URL : ${post.repoUrl}`);
  console.log(`Skills     : ${post.fueler.skills.join(", ")}`);
  console.log(`Summary    :\n${post.fueler.description}`);

  console.log("\n--- CODERLEGION (coderlegion.com/publish-with-us) ---");
  console.log(`Title        : ${post.title}`);
  console.log(`Canonical URL: ${post.canonicalUrl}`);
  console.log(`Tags         : ${(post.tags || []).join(", ")}`);
  console.log(`Cover Image  : ${post.coverImage || "(none)"}`);
  console.log(`Body         : Same Markdown as DEV.to/Hashnode (${post.articleMarkdown.length} chars)`);

  console.log("\n--- DAILY.DEV & MEDIUM IMPORT ---");
  console.log("Daily.dev RSS : https://theayush.pages.dev/rss.xml");
  console.log("Medium Import : https://medium.com/p/import");
  console.log(`Import URL    : ${entryState?.devtoUrl || post.canonicalUrl}`);

  console.log(`\n--- X / TWITTER (${xLen}/${X_CHAR_LIMIT} chars) ---`);
  if (xLen > X_CHAR_LIMIT) {
    console.warn(`[WARN] X post exceeds ${X_CHAR_LIMIT} chars by ${xLen - X_CHAR_LIMIT}!`);
  }
  console.log(post.xPost);

  console.log("\n--- LINKEDIN ---");
  console.log(post.linkedinPost);
}

function listPosts() {
  const postsDir = path.resolve("posts");
  const state = loadState();
  const files = fs.existsSync(postsDir)
    ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".md") || f.endsWith(".json"))
    : [];

  if (files.length === 0) {
    console.log("No posts found in posts/.");
    return;
  }

  console.log("\n=== Portfolio Cross-Post Queue ===");
  for (const f of files) {
    const post = loadPost(path.join(postsDir, f));
    const s = state[post.slug] || {};
    const devStatus = s.devtoId ? `DEV:#${s.devtoId} (${s.devtoUrl || "saved"})` : "DEV:pending";
    const hnStatus = s.hashnodePostId
      ? `HN:${s.hashnodeUrl || s.hashnodePostId}`
      : s.hashnodeDraftId
        ? `HN:draft(${s.hashnodeDraftId})`
        : "HN:pending";
    console.log(`- posts/${f} -> ${post.slug} | ${devStatus} | ${hnStatus}`);
  }
}

async function fetchDevToIdentity(apiKey) {
  const res = await fetch("https://dev.to/api/users/me", {
    headers: { "api-key": apiKey },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`DEV.to auth check failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return {
    username: data.username,
    name: data.name,
    url: `https://dev.to/${data.username}`,
  };
}

async function fetchHashnodeIdentity(token) {
  const query = `query WhoAmI {
    me {
      username
      name
      publications(first: 10) {
        edges { node { id title url } }
      }
    }
  }`;
  const data = await hashnodeRequest(token, query);
  if (!data.data?.me) {
    throw new Error(`Hashnode auth check failed: ${JSON.stringify(data)}`);
  }
  const me = data.data.me;
  const publications = (me.publications?.edges || []).map((e) => e.node);
  return {
    username: me.username,
    name: me.name,
    publications,
  };
}

function resolveHashnodePublication(identity, configuredPubId) {
  const pubs = identity.publications || [];
  if (configuredPubId) {
    const matched = pubs.find((p) => p.id === configuredPubId);
    return matched || { id: configuredPubId, title: "(custom HASHNODE_PUB_ID)", url: "" };
  }
  if (pubs.length === 1) {
    return pubs[0];
  }
  if (pubs.length === 0) {
    throw new Error("Hashnode account has no publications yet. Create a blog on hashnode.com first.");
  }
  const choices = pubs.map((p) => `  - ${p.title} (${p.url}) -> HASHNODE_PUB_ID=${p.id}`).join("\n");
  throw new Error(`Multiple Hashnode publications found. Set HASHNODE_PUB_ID in .env to pick one:\n${choices}`);
}

async function printWhoAmI(env) {
  console.log("\n=== Cross-Post Target Accounts ===");
  if (env.DEVTO_API_KEY) {
    const dev = await fetchDevToIdentity(env.DEVTO_API_KEY);
    console.log(`DEV.to   : @${dev.username} (${dev.name}) -> ${dev.url}`);
  } else {
    console.log("DEV.to   : not configured (missing DEVTO_API_KEY in .env)");
  }

  if (env.HASHNODE_TOKEN) {
    const hn = await fetchHashnodeIdentity(env.HASHNODE_TOKEN);
    console.log(`Hashnode : @${hn.username} (${hn.name})`);
    if (hn.publications.length === 0) {
      console.log("  Publications: none found");
    } else {
      for (const pub of hn.publications) {
        const selected = env.HASHNODE_PUB_ID
          ? pub.id === env.HASHNODE_PUB_ID
          : hn.publications.length === 1;
        const marker = selected ? "[ACTIVE]" : "        ";
        console.log(`  ${marker} ${pub.title} (${pub.url}) | id=${pub.id}`);
      }
    }
  } else {
    console.log("Hashnode : not configured (missing HASHNODE_TOKEN in .env)");
  }

  console.log("\nBrowser-session platforms (uploads to whichever account is signed in):");
  console.log("  Medium      : https://medium.com/p/import");
  console.log("  Daily.dev   : RSS feed https://theayush.pages.dev/rss.xml");
  console.log("  Peerlist    : Scroll composer on peerlist.io");
  console.log("  Fueler      : Add Proof of Work on fueler.io");
  console.log("  CoderLegion : https://coderlegion.com/publish-with-us");
}

async function main() {
  const args = process.argv.slice(2);
  const env = { ...loadEnvFile(path.resolve(".env")), ...process.env };

  if (args.includes("--whoami")) {
    await printWhoAmI(env);
    return;
  }
  if (args.includes("--list")) {
    listPosts();
    return;
  }

  const fileArg = args.find((a) => !a.startsWith("--"));
  if (!fileArg) {
    console.error("Usage: node scripts/crosspost.mjs <posts/file.md | --list | --whoami> [--dry-run | --draft | --live]");
    process.exit(1);
  }

  const live = args.includes("--live");
  const draft = args.includes("--draft");
  const mode = live ? "live" : draft ? "draft" : "dry-run";

  const state = loadState();
  const post = loadPost(fileArg);
  const entryState = state[post.slug] || {};

  printSummary(post, mode, entryState);

  if (mode === "dry-run") {
    console.log("\n[Dry run complete] Pass --draft or --live to sync to DEV.to & Hashnode (or --whoami to verify accounts).");
    return;
  }

  if (env.DEVTO_API_KEY) {
    const devIdentity = await fetchDevToIdentity(env.DEVTO_API_KEY);
    console.log(`\n[DEV.to Account] @${devIdentity.username} (${devIdentity.url})`);
    const devRes = await syncDevTo(post, env.DEVTO_API_KEY, live, entryState.devtoId);
    entryState.devtoId = devRes.id;
    entryState.devtoUrl = devRes.url;
    entryState.devtoStatus = live ? "live" : "draft";
    entryState.updatedAt = new Date().toISOString();
    state[post.slug] = entryState;
    saveState(state);
    console.log(`[DEV.to] ${devRes.action}: ${devRes.url} (id=${devRes.id})`);
  } else {
    console.log("\n[DEV.to] Skipped (DEVTO_API_KEY not set in .env)");
  }

  if (env.HASHNODE_TOKEN) {
    try {
      const hnIdentity = await fetchHashnodeIdentity(env.HASHNODE_TOKEN);
      const pub = resolveHashnodePublication(hnIdentity, env.HASHNODE_PUB_ID);
      console.log(`\n[Hashnode Account] @${hnIdentity.username} -> ${pub.title}${pub.url ? ` (${pub.url})` : ""}`);
      if (!live && entryState.hashnodeDraftId && !entryState.hashnodePostId) {
        console.log(
          `[Hashnode] Draft already recorded (${entryState.hashnodeDraftId}) — skipping duplicate draft creation. Run --live to publish.`,
        );
      } else {
        const hnRes = await syncHashnode(post, env.HASHNODE_TOKEN, pub.id, live, entryState);
        if (hnRes.postId) entryState.hashnodePostId = hnRes.postId;
        if (hnRes.draftId) entryState.hashnodeDraftId = hnRes.draftId;
        entryState.hashnodeUrl = hnRes.url;
        console.log(`[Hashnode] ${hnRes.action}: ${hnRes.url}`);
      }
    } catch (err) {
      if (err.message.includes("Pro plan") || err.message.includes("FORBIDDEN")) {
        console.log(
          `[Hashnode] Skipped (API write mutations require Hashnode Pro). Publish manually from posts/${post.slug}.md (<!-- SECTION: ARTICLE -->) with Canonical URL: ${post.canonicalUrl}`,
        );
      } else {
        throw err;
      }
    }
  } else {
    console.log("[Hashnode] Skipped (HASHNODE_TOKEN not set in .env)");
  }

  entryState.updatedAt = new Date().toISOString();
  state[post.slug] = entryState;
  saveState(state);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
