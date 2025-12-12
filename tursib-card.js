const z = globalThis, K = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), et = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = et.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && et.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const xt = (i) => new ut(typeof i == "string" ? i : i + "", void 0, Z), Pt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce(((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1]), i[0]);
  return new ut(e, i, Z);
}, Ot = (i, t) => {
  if (K) i.adoptedStyleSheets = t.map(((e) => e instanceof CSSStyleSheet ? e : e.styleSheet));
  else for (const e of t) {
    const s = document.createElement("style"), r = z.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, st = K ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return xt(e);
})(i) : i;
const { is: Ut, defineProperty: Mt, getOwnPropertyDescriptor: Tt, getOwnPropertyNames: Ht, getOwnPropertySymbols: Nt, getPrototypeOf: Rt } = Object, D = globalThis, it = D.trustedTypes, kt = it ? it.emptyScript : "", zt = D.reactiveElementPolyfillSupport, O = (i, t) => i, j = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? kt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Y = (i, t) => !Ut(i, t), rt = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ??= Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && Mt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = Tt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const h = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = Rt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, s = [...Ht(e), ...Nt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(st(r));
    } else t !== void 0 && e.push(st(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise(((t) => this.enableUpdating = t)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((t) => t(this)));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ot(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(((t) => t.hostConnected?.()));
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach(((t) => t.hostDisconnected?.()));
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : j).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : j;
      this._$Em = r;
      const h = o.fromAttribute(e, n.type);
      this[r] = h ?? this._$Ej?.get(r) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    if (t !== void 0) {
      const r = this.constructor, n = this[t];
      if (s ??= r.getPropertyOptions(t), !((s.hasChanged ?? Y)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, h = this[r];
        o !== !0 || this._$AL.has(r) || h === void 0 || this.C(r, void 0, n, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach(((s) => s.hostUpdate?.())), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach(((e) => e.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach(((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[O("elementProperties")] = /* @__PURE__ */ new Map(), E[O("finalized")] = /* @__PURE__ */ new Map(), zt?.({ ReactiveElement: E }), (D.reactiveElementVersions ??= []).push("2.1.1");
const G = globalThis, I = G.trustedTypes, nt = I ? I.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, pt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, _t = "?" + g, jt = `<${_t}>`, b = document, U = () => b.createComment(""), M = (i) => i === null || typeof i != "object" && typeof i != "function", Q = Array.isArray, It = (i) => Q(i) || typeof i?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, at = />/g, y = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ct = /"/g, $t = /^(?:script|style|textarea|title)$/i, Dt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), S = Dt(1), C = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), A = b.createTreeWalker(b, 129);
function ft(i, t) {
  if (!Q(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const Lt = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let h = 0; h < e; h++) {
    const a = i[h];
    let l, d, c = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, d = o.exec(a), d !== null); ) _ = o.lastIndex, o === P ? d[1] === "!--" ? o = ot : d[1] !== void 0 ? o = at : d[2] !== void 0 ? ($t.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = y) : d[3] !== void 0 && (o = y) : o === y ? d[0] === ">" ? (o = r ?? P, c = -1) : d[1] === void 0 ? c = -2 : (c = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? y : d[3] === '"' ? ct : ht) : o === ct || o === ht ? o = y : o === ot || o === at ? o = P : (o = y, r = void 0);
    const p = o === y && i[h + 1].startsWith("/>") ? " " : "";
    n += o === P ? a + jt : c >= 0 ? (s.push(l), a.slice(0, c) + pt + a.slice(c) + g + p) : a + g + (c === -2 ? h : p);
  }
  return [ft(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const h = t.length - 1, a = this.parts, [l, d] = Lt(t, e);
    if (this.el = T.createElement(l, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = A.nextNode()) !== null && a.length < h; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(pt)) {
          const _ = d[o++], p = r.getAttribute(c).split(g), f = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: f[2], strings: p, ctor: f[1] === "." ? qt : f[1] === "?" ? Vt : f[1] === "@" ? Wt : L }), r.removeAttribute(c);
        } else c.startsWith(g) && (a.push({ type: 6, index: n }), r.removeAttribute(c));
        if ($t.test(r.tagName)) {
          const c = r.textContent.split(g), _ = c.length - 1;
          if (_ > 0) {
            r.textContent = I ? I.emptyScript : "";
            for (let p = 0; p < _; p++) r.append(c[p], U()), A.nextNode(), a.push({ type: 2, index: ++n });
            r.append(c[_], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === _t) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(g, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(i, t, e = i, s) {
  if (t === C) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = M(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = x(i, r._$AS(i, t.values), r, s)), t;
}
class Bt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? b).importNode(e, !0);
    A.currentNode = r;
    let n = A.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new N(n, n.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (l = new Ft(n, this, t)), this._$AV.push(l), a = s[++h];
      }
      o !== a?.index && (n = A.nextNode(), o++);
    }
    return A.currentNode = b, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), M(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Bt(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new N(this.O(U()), this.O(U()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = t.nextSibling;
      t.remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = x(this, t, e, 0), o = !M(t) || t !== this._$AH && t !== C, o && (this._$AH = t);
    else {
      const h = t;
      let a, l;
      for (t = n[0], a = 0; a < n.length - 1; a++) l = x(this, h[s + a], e, a), l === C && (l = this._$AH[a]), o ||= !M(l) || l !== this._$AH[a], l === u ? t = u : t !== u && (t += (l ?? "") + n[a + 1]), this._$AH[a] = l;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class qt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Vt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Wt extends L {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? u) === C) return;
    const s = this._$AH, r = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ft {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const Jt = G.litHtmlPolyfillSupport;
Jt?.(T, N), (G.litHtmlVersions ??= []).push("3.3.1");
const Kt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new N(t.insertBefore(U(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
const X = globalThis;
class w extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Kt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return C;
  }
}
w._$litElement$ = !0, w.finalized = !0, X.litElementHydrateSupport?.({ LitElement: w });
const Zt = X.litElementPolyfillSupport;
Zt?.({ LitElement: w });
(X.litElementVersions ??= []).push("4.2.1");
const Yt = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Y }, Gt = (i = Yt, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, i);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, i, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, i);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function W(i) {
  return (t, e) => typeof e == "object" ? Gt(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
var Qt = Object.create, Xt = Object.defineProperty, gt = (i, t) => (t = Symbol[i]) ? t : Symbol.for("Symbol." + i), vt = (i) => {
  throw TypeError(i);
}, te = (i, t, e) => t in i ? Xt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, ee = (i) => [, , , Qt(i?.[gt("metadata")] ?? null)], se = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], mt = (i) => i !== void 0 && typeof i != "function" ? vt("Function expected") : i, ie = (i, t, e, s, r) => ({ kind: se[i], name: t, metadata: s, addInitializer: (n) => e._ ? vt("Already initialized") : r.push(mt(n || null)) }), re = (i, t) => te(t, gt("metadata"), i[3]), dt = (i, t, e, s) => {
  for (var r = 0, n = i[t >> 1], o = n && n.length; r < o; r++) t & 1 ? n[r].call(e) : s = n[r].call(e, s);
  return s;
}, ne = (i, t, e, s, r, n) => {
  var o, h, a, l, d = t & 7, c = !1, _ = !1, p = i.length + 1, f = i[p - 1] = [], B = i[p] || (i[p] = []);
  r = r.prototype, d < 5;
  for (var m = s.length - 1; m >= 0; m--)
    a = ie(d, e, h = {}, i[3], B), a.static = c, a.private = _, l = a.access = { has: ($) => e in $ }, l.get = ($) => $[e], l.set = ($, q) => $[e] = q, o = (0, s[m])(void 0, a), h._ = 1, mt(o) && f.unshift(o);
  return r;
}, yt, F, H;
class tt extends (F = w, yt = [W({ attribute: !1 })], F) {
  constructor() {
    super(...arguments), this._config = dt(H, 8, this), dt(H, 11, this);
  }
  setConfig(t) {
    this._config = { ...t };
  }
  get config() {
    return this._config;
  }
  render() {
    return this._config ? S`
      <div>
        <label>Station selector</label>
        <select @change=${this._stationSelectorChanged}>
          <option value="dropdown" ?selected=${this._config.station_selector === "dropdown"}>Dropdown</option>
          <option value="buttons" ?selected=${this._config.station_selector === "buttons"}>Buttons</option>
        </select>
      </div>
      <div>
        <label>Layout mode</label>
        <select @change=${this._layoutModeChanged}>
          <option value="fixed" ?selected=${this._config.layout_mode === "fixed"}>Fixed</option>
          <option value="fluid" ?selected=${this._config.layout_mode === "fluid"}>Fluid</option>
        </select>
      </div>
    ` : S``;
  }
  _stationSelectorChanged(t) {
    const e = t.target.value;
    this._config = { ...this._config, station_selector: e }, this._updateConfig();
  }
  _layoutModeChanged(t) {
    const e = t.target.value;
    this._config = { ...this._config, layout_mode: e }, this._updateConfig();
  }
  _updateConfig() {
    const t = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(t);
  }
}
H = ee(F);
ne(H, 5, "_config", yt, tt);
re(H, tt);
customElements.define("tursib-card-editor", tt);
var oe = Object.create, ae = Object.defineProperty, At = (i, t) => (t = Symbol[i]) ? t : Symbol.for("Symbol." + i), bt = (i) => {
  throw TypeError(i);
}, he = (i, t, e) => t in i ? ae(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, ce = (i) => [, , , oe(i?.[At("metadata")] ?? null)], le = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], Et = (i) => i !== void 0 && typeof i != "function" ? bt("Function expected") : i, de = (i, t, e, s, r) => ({ kind: le[i], name: t, metadata: s, addInitializer: (n) => e._ ? bt("Already initialized") : r.push(Et(n || null)) }), ue = (i, t) => he(t, At("metadata"), i[3]), k = (i, t, e, s) => {
  for (var r = 0, n = i[t >> 1], o = n && n.length; r < o; r++) t & 1 ? n[r].call(e) : s = n[r].call(e, s);
  return s;
}, St = (i, t, e, s, r, n) => {
  var o, h, a, l, d = t & 7, c = !1, _ = !1, p = i.length + 1, f = i[p - 1] = [], B = i[p] || (i[p] = []);
  r = r.prototype, d < 5;
  for (var m = s.length - 1; m >= 0; m--)
    a = de(d, e, h = {}, i[3], B), a.static = c, a.private = _, l = a.access = { has: ($) => e in $ }, l.get = ($) => $[e], l.set = ($, q) => $[e] = q, o = (0, s[m])(void 0, a), h._ = 1, Et(o) && f.unshift(o);
  return r;
}, wt, Ct, J, v;
class R extends (J = w, Ct = [W({ attribute: !1 })], wt = [W({ attribute: !1 })], J) {
  constructor() {
    super(...arguments), this.hass = k(v, 8, this), k(v, 11, this), this._config = k(v, 12, this), k(v, 15, this), this._selectedStation = "";
  }
  setConfig(t) {
    if (!t.entity_map)
      throw new Error("You need to define entity_map");
    this._config = t, this._selectedStation = t.default_station || Object.keys(t.entity_map)[0];
  }
  static getStubConfig() {
    return {
      type: "custom:tursib-card",
      entity_map: { Default: "sensor.test" },
      station_selector: "dropdown",
      layout_mode: "fixed",
      card_background: "#f9f9f9",
      card_radius: "12px"
    };
  }
  static async getConfigElement() {
    return document.createElement("tursib-card-editor");
  }
  getCardSize() {
    return 3;
  }
  render() {
    if (!this._config || !this.hass) return S``;
    const t = this._config.entity_map || {}, e = this._selectedStation, s = t[e], r = this.hass.states[s];
    if (!r) return S``;
    const n = r.attributes.departures || [];
    return S`
      <div class="tursib-card">
        <div class="header">${e}</div>
        ${n.map((o) => S`
          <div class="row">
            <span>${o.line}</span>
            <span>${o.destination}</span>
            <span>${o.minutes} min</span>
            <span>${o.departure}</span>
          </div>
        `)}
      </div>
    `;
  }
}
v = ce(J);
St(v, 5, "hass", Ct, R);
St(v, 5, "_config", wt, R);
ue(v, R);
R.styles = Pt`
    .tursib-card {
      font-family: sans-serif;
      padding: 0.8em;
      background: var(--card-background-color, #f9f9f9);
      border-radius: var(--card-radius, 12px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
  `;
customElements.define("tursib-card", R);
export {
  R as TursibCard
};
