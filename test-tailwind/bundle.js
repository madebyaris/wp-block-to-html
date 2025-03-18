var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/frameworks/tailwind.mjs
var tailwind_exports = {};
__export(tailwind_exports, {
  convertBlocks: () => y,
  createElement: () => B,
  getBlockClasses: () => T,
  registerBlockHandler: () => S,
  tailwindMapping: () => e
});

// dist/chunk-TT7GIMNF.mjs
var e = { "core/paragraph": { block: "my-4 px-0", align: { left: "text-left", center: "text-center", right: "text-right" }, dropCap: "first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:mt-1" }, "core/heading": { block: "mt-6 mb-4", level: { 1: "text-4xl font-bold", 2: "text-3xl font-bold", 3: "text-2xl font-bold", 4: "text-xl font-bold", 5: "text-lg font-bold", 6: "text-base font-bold" }, align: { left: "text-left", center: "text-center", right: "text-right" } }, "core/list": { block: "my-4 px-0", ordered: "list-decimal pl-8 space-y-2", unordered: "list-disc pl-8 space-y-2" }, "core/image": { block: "max-w-full h-auto my-6", align: { left: "float-left mr-6 mb-4", center: "mx-auto", right: "float-right ml-6 mb-4" }, sizeSlug: { thumbnail: "max-w-xs", medium: "max-w-md", large: "max-w-lg", full: "w-full" } }, "core/group": { block: "p-6 my-6 rounded" }, "core/columns": { block: "flex flex-wrap gap-4 my-6" }, "core/column": { block: "flex-1 p-4", width: { 25: "w-1/4", "33.33": "w-1/3", 50: "w-1/2", "66.66": "w-2/3", 75: "w-3/4", 100: "w-full" } }, "core/button": { block: "inline-block px-6 py-3 font-medium rounded transition-colors duration-200 my-4", style: { fill: "bg-blue-600 text-white hover:bg-blue-700", outline: "border border-blue-600 text-blue-600 hover:bg-blue-100" }, size: { small: "text-sm px-4 py-2", medium: "text-base px-6 py-3", large: "text-lg px-8 py-4" } }, "core/separator": { block: "border-t my-8", style: { default: "border-gray-200", wide: "border-gray-200 w-full", dots: "border-dotted border-gray-400" } }, "core/spacer": { block: "", height: { small: "h-4 my-4", medium: "h-8 my-6", large: "h-16 my-8" } } };

// dist/chunk-DUEGPDMF.mjs
var k = { outputFormat: "html", cssFramework: "none", contentHandling: "raw" };
var $ = {};
function S(e2, c) {
  $[e2] = c;
}
function x(e2) {
  return $[e2];
}
function C(e2, c) {
  return { ...e2, ...c };
}
function T(e2, c, l) {
  let { cssFramework: n = "none", customClassMap: g = {} } = l, r = [];
  if (console.log(`Applying classes for block: ${e2.blockName}, framework: ${n}`), n === "none") {
    if (e2.blockName) {
      let t = `wp-block-${e2.blockName.replace("core/", "")}`;
      r.push(t);
    }
    e2.attrs?.align && r.push(`has-text-align-${e2.attrs.align}`);
  } else {
    let t;
    if (g[e2.blockName] ? (t = g[e2.blockName], console.log("Using custom mapping:", t)) : c.cssMapping?.[n] && (t = c.cssMapping[n], console.log("Using built-in mapping:", t)), t) {
      if (t.block && (r.push(t.block), console.log(`Added base class: ${t.block}`)), e2.attrs) {
        console.log("Block attributes:", e2.attrs);
        for (let [a, s] of Object.entries(e2.attrs)) {
          let i = t[a];
          if (typeof i == "string") r.push(i), console.log(`Added attribute class for ${a}: ${i}`);
          else if (typeof i == "object" && i !== null) {
            let p = i[s];
            p && (r.push(p), console.log(`Added mapped class for ${a}=${s}: ${p}`));
          }
        }
      }
    } else console.log(`No CSS mapping found for ${e2.blockName} with framework ${n}`);
  }
  let o = r.join(" ");
  return console.log(`Final classes for ${e2.blockName}: "${o}"`), o;
}
function B(e2, c = {}, l = "") {
  "class" in c && typeof c.class == "string" && (c.class = c.class.trim(), c.class === "" && delete c.class);
  let n = Object.entries(c).map(([o, t]) => typeof t == "boolean" ? t ? o : "" : `${o}="${String(t).replace(/"/g, "&quot;")}"`).filter(Boolean).join(" "), g = n ? `<${e2} ${n}>` : `<${e2}>`;
  return ["img", "br", "hr", "input", "meta", "link"].includes(e2) && !l ? g.replace(/>$/, " />") : `${g}${l}</${e2}>`;
}
function w(e2, c) {
  let { cssFramework: l = "none" } = c;
  if (l === "none") return e2;
  try {
    let n = e2, r = { tailwind: { headings: { h1: "text-4xl mb-6 mt-10 font-extrabold", h2: "text-3xl mb-5 mt-8 font-bold", h3: "text-2xl mb-4 mt-6 font-bold", h4: "text-xl mb-4 mt-4 font-semibold", h5: "text-lg mb-3 mt-4 font-semibold", h6: "text-base mb-3 mt-2 font-medium" }, paragraph: { p: "mb-4" }, list: { ul: "list-disc pl-6 mb-4", ol: "list-decimal pl-6 mb-4", li: "mb-1" }, image: { img: "rounded-lg my-8 w-full h-auto max-w-full object-cover", figure: "my-8", figcaption: "text-sm text-gray-600 mt-2" }, blockquote: { blockquote: "pl-4 border-l-4 border-gray-300 italic my-6" }, table: { table: "min-w-full border-collapse mb-6", th: "border border-gray-300 px-4 py-2 bg-gray-100", td: "border border-gray-300 px-4 py-2" }, code: { pre: "bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6", code: "font-mono text-sm" }, alignments: { alignleft: "float-left mr-6 mb-4 max-w-[50%]", alignright: "float-right ml-6 mb-4 max-w-[50%]", aligncenter: "mx-auto block", alignnone: "block" } }, bootstrap: { headings: { h1: "display-4 mb-4 mt-5", h2: "display-5 mb-3 mt-4", h3: "h3 mb-3 mt-4", h4: "h4 mb-3 mt-3", h5: "h5 mb-2 mt-3", h6: "h6 mb-2 mt-2" }, paragraph: { p: "mb-3" }, list: { ul: "list-unstyled ps-4 mb-3", ol: "ps-4 mb-3", li: "mb-2" }, image: { img: "img-fluid my-4", figure: "figure my-4", figcaption: "figure-caption text-center" }, blockquote: { blockquote: "blockquote border-start border-secondary border-3 ps-3 my-4" }, table: { table: "table table-bordered mb-4", th: "table-light", td: "" }, code: { pre: "bg-light p-3 rounded mb-4", code: "font-monospace" }, alignments: { alignleft: "float-start me-3 mb-3", alignright: "float-end ms-3 mb-3", aligncenter: "mx-auto d-block", alignnone: "d-block" } } }[l] || {};
    for (let [o, t] of Object.entries(r.headings || {})) n = n.replace(new RegExp(`<${o}([^>]*)>([\\s\\S]*?)<\\/${o}>`, "g"), (a, s, i) => {
      let p = s.match(/id=["']([^"']*)["']/), m = p ? ` id="${p[1]}"` : "", d = s.match(/class=["']([^"']*)["']/), u = d ? d[1] + " " : "", f = s.replace(/id=["'][^"']*["']/g, "").replace(/class=["'][^"']*["']/g, "");
      return `<${o}${m}${f} class="${u}${t}">${i}</${o}>`;
    });
    if (r.paragraph?.p && (n = n.replace(/<p([^>]*)>([\s\S]*?)<\/p>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "";
      return `<p${t.replace(/class=["'][^"']*["']/g, "")} class="${i}${r.paragraph.p}">${a}</p>`;
    })), r.list) for (let [o, t] of Object.entries(r.list)) n = n.replace(new RegExp(`<${o}([^>]*)>([\\s\\S]*?)<\\/${o}>`, "g"), (a, s, i) => {
      let p = s.match(/class=["']([^"']*)["']/), m = p ? p[1] + " " : "", d = s.replace(/class=["'][^"']*["']/g, "");
      return `<${o}${d} class="${m}${t}">${i}</${o}>`;
    });
    if (r.image?.img && (n = n.replace(/<img([^>]*)>/g, (o, t) => {
      let a = t.match(/class=["']([^"']*)["']/), s = a ? a[1] + " " : "";
      return `<img${t.replace(/class=["'][^"']*["']/g, "")} class="${s}${r.image.img}" loading="lazy">`;
    })), r.image?.figure && (n = n.replace(/<figure([^>]*)>([\s\S]*?)<\/figure>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "";
      return `<figure${t.replace(/class=["'][^"']*["']/g, "")} class="${i}${r.image.figure}">${a}</figure>`;
    })), r.image?.figcaption && (n = n.replace(/<figcaption([^>]*)>([\s\S]*?)<\/figcaption>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "";
      return `<figcaption${t.replace(/class=["'][^"']*["']/g, "")} class="${i}${r.image.figcaption}">${a}</figcaption>`;
    })), r.blockquote?.blockquote && (n = n.replace(/<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "";
      return `<blockquote${t.replace(/class=["'][^"']*["']/g, "")} class="${i}${r.blockquote.blockquote}">${a}</blockquote>`;
    })), r.table?.table && (n = n.replace(/<table([^>]*)>([\s\S]*?)<\/table>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "", p = t.replace(/class=["'][^"']*["']/g, ""), m = a;
      return r.table.th && (m = m.replace(/<th([^>]*)>([\s\S]*?)<\/th>/g, (d, u, f) => {
        let b = u.match(/class=["']([^"']*)["']/), h = b ? b[1] + " " : "";
        return `<th${u.replace(/class=["'][^"']*["']/g, "")} class="${h}${r.table.th}">${f}</th>`;
      })), r.table.td && (m = m.replace(/<td([^>]*)>([\s\S]*?)<\/td>/g, (d, u, f) => {
        let b = u.match(/class=["']([^"']*)["']/), h = b ? b[1] + " " : "";
        return `<td${u.replace(/class=["'][^"']*["']/g, "")} class="${h}${r.table.td}">${f}</td>`;
      })), `<table${p} class="${i}${r.table.table}">${m}</table>`;
    })), r.code?.pre && (n = n.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "";
      return `<pre${t.replace(/class=["'][^"']*["']/g, "")} class="${i}${r.code.pre}">${a}</pre>`;
    })), r.code?.code && (n = n.replace(/<code([^>]*)>([\s\S]*?)<\/code>/g, (o, t, a) => {
      let s = t.match(/class=["']([^"']*)["']/), i = s ? s[1] + " " : "";
      return `<code${t.replace(/class=["'][^"']*["']/g, "")} class="${i}${r.code.code}">${a}</code>`;
    })), r.alignments) for (let [o, t] of Object.entries(r.alignments)) n = n.replace(new RegExp(`class=["']([^"']*\\b${o}\\b[^"']*)["']`, "g"), (a, s) => `class="${s.replace(o, t)}"`);
    return n;
  } catch (n) {
    return console.error("Error enhancing rendered HTML:", n), e2;
  }
}
function y(e2, c = {}) {
  let l = C(k, c), n;
  return Array.isArray(e2) ? n = e2 : "blocks" in e2 ? n = e2.blocks : n = [e2], l.contentHandling === "rendered" && "rendered" in e2 && typeof e2.rendered == "string" ? e2.rendered : l.contentHandling === "hybrid" && "rendered" in e2 && typeof e2.rendered == "string" ? w(e2.rendered, l) : l.outputFormat === "html" || l.outputFormat === void 0 ? n.map((g) => O(g, l)).join("") : n.map((g) => O(g, l));
}
function A(e2) {
  if (e2.contentHandling) switch (e2.contentHandling) {
    case "rendered":
      return "respect";
    case "hybrid":
      return "preserve-attrs";
    case "raw":
    default:
      return "rebuild";
  }
  return e2.renderedContentHandling || "rebuild";
}
function O(e2, c) {
  if (!e2.blockName) return e2.innerContent.join("") || "";
  let l = { ...c, renderedContentHandling: A(c) }, n = l.blockTransformers?.[e2.blockName];
  if (n) return n.transform(e2, l);
  let g = x(e2.blockName);
  return g ? g.transform(e2, l) : e2.innerContent.join("") || "";
}

// test-tailwind/test.js
console.log("Tailwind module imported:", tailwind_exports);
