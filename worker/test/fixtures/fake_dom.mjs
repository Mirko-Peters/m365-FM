// Schein-DOM fuer assets/admin.js (node:vm, ohne HTML-Parser; innerHTML wirft). Gleicher Aufbau wie in admin_sponsor.test.mjs, hier als eigene Datei fuer weitere Verwaltungs-Tests.
export function fakeDom() {
  class Text { constructor(t) { this.nodeType = 3; this.data = String(t); this.parentNode = null; } get textContent() { return this.data; } }
  const one = (el, s) => {
    const m = s.match(/^([a-z0-9]*)((?:\.[\w-]+)*)((?:\[[\w-]+(?:=["']?[^\]"']*["']?)?\])*)$/i); if (!m) throw new Error("Selektor nicht unterstuetzt: " + s);
    if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
    for (const c of m[2].match(/\.[\w-]+/g) || []) if (!el.className.split(/\s+/).includes(c.slice(1))) return false;
    for (const a of m[3].match(/\[[^\]]+\]/g) || []) { const [, k, v] = a.match(/^\[([\w-]+)(?:=["']?([^"']*)["']?)?\]$/); const got = el.getAttribute(k); if (got == null || (v !== undefined && got !== v)) return false; }
    return true;
  };
  class El {
    constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.parentNode = null; this.listeners = {}; this.className = ""; this.selected = false; this.disabled = false; }
    setAttribute(k, v) { if (k === "class") this.className = String(v); else this.attrs[k] = String(v); }
    getAttribute(k) { return k === "class" ? this.className : Object.hasOwn(this.attrs, k) ? this.attrs[k] : null; }
    get hidden() { return Object.hasOwn(this.attrs, "hidden"); }
    set hidden(v) { if (v) this.attrs.hidden = ""; else delete this.attrs.hidden; }
    appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; this.childNodes.push(c); return c; }
    append(...cs) { for (const c of cs) this.appendChild(typeof c === "string" ? new Text(c) : c); }
    removeChild(c) { const i = this.childNodes.indexOf(c); if (i >= 0) this.childNodes.splice(i, 1); c.parentNode = null; return c; }
    remove() { if (this.parentNode) this.parentNode.removeChild(this); }
    get firstChild() { return this.childNodes[0] || null; }
    get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
    get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
    set textContent(t) { for (const n of this.childNodes) n.parentNode = null; this.childNodes = []; if (t != null && t !== "") this.appendChild(new Text(t)); }
    get innerHTML() { throw new Error("innerHTML in admin.js"); }
    set innerHTML(_) { throw new Error("innerHTML in admin.js"); }
    insertAdjacentHTML() { throw new Error("insertAdjacentHTML in admin.js"); }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    fire(type) { const ev = { type, target: this, currentTarget: this, preventDefault() {} }; for (const fn of this.listeners[type] || []) fn(ev); if (typeof this["on" + type] === "function") this["on" + type](ev); }
    get value() {
      if (this.tagName === "SELECT") { const o = this.all("option"); const s = o.find((x) => x.selected) || o[0]; return s ? s.value : ""; }
      if (this.tagName === "OPTION") return this.getAttribute("value") ?? this.textContent;
      return this._value ?? "";
    }
    set value(v) { if (this.tagName === "SELECT") for (const o of this.all("option")) o.selected = o.value === String(v); else this._value = String(v); }
    matches(sel) {
      const parts = sel.trim().split(/\s+/); if (!one(this, parts.at(-1))) return false;
      let i = parts.length - 2; for (let n = this.parentNode; i >= 0 && n; n = n.parentNode) if (n.nodeType === 1 && one(n, parts[i])) i--;
      return i < 0;
    }
    all(sel) { const out = []; const walk = (n) => { for (const c of n.children) { if (c.matches(sel)) out.push(c); walk(c); } }; walk(this); return out; }
    querySelectorAll(sel) { return this.all(sel); }
    querySelector(sel) { return this.all(sel)[0] || null; }
    scrollIntoView() {}
  }
  const root = new El("div"); root.attrs.id = "adm";
  return { root, document: { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => (id === "adm" ? root : null), head: new El("head") } };
}
