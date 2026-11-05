/* Site script: language switch, menu, outbound links, videos, tabs, lightbox, contact form. No dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var body = document.body;
  var CONFIG = window.SITE_CONFIG || {};
  var LANG_KEY = 'newco-lang';
  doc.classList.add('js');

  /* ---------- Language ---------- */
  function initialLang() {
    var m = /[?&]lang=(fr|en)\b/.exec(location.search);
    if (m) return m[1];
    try { var s = localStorage.getItem(LANG_KEY); if (s === 'fr' || s === 'en') return s; } catch (e) {}
    return 'fr';
  }

  // Elements with data-i18n="alt src poster aria-label content" swap those attributes:
  // the French value is the attribute itself, the English one is data-<attr>-en.
  var i18nEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  i18nEls.forEach(function (el) {
    el.getAttribute('data-i18n').split(/\s+/).forEach(function (a) {
      if (!el.hasAttribute('data-' + a + '-fr') && el.hasAttribute(a)) {
        el.setAttribute('data-' + a + '-fr', el.getAttribute(a));
      }
    });
  });

  function applyLang(lang) {
    body.setAttribute('data-lang', lang);
    doc.lang = lang === 'en' ? 'en-CA' : 'fr-CA';
    var t = body.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    i18nEls.forEach(function (el) {
      el.getAttribute('data-i18n').split(/\s+/).forEach(function (a) {
        var v = el.getAttribute('data-' + a + '-' + lang);
        if (v !== null && el.getAttribute(a) !== v) el.setAttribute(a, v);
      });
    });
    var btn = document.getElementById('langBtn');
    if (btn) {
      btn.textContent = lang === 'fr' ? 'EN' : 'FR';
      btn.setAttribute('aria-label', lang === 'fr' ? 'English version' : 'Version française');
      btn.setAttribute('lang', lang === 'fr' ? 'en' : 'fr');
    }
    setExternalLinks(lang);
    videos.forEach(function (v) { v.setLang(lang); });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  /* ---------- Outbound links (the other site's URL comes from config.js only) ---------- */
  function setExternalLinks(lang) {
    document.querySelectorAll('[data-ext]').forEach(function (a) {
      var base = CONFIG[a.getAttribute('data-ext')];
      if (!base) return;
      var url = base + (a.getAttribute('data-ext-path') || '');
      var hash = a.getAttribute('data-ext-hash') || '';
      a.href = url + (url.indexOf('?') < 0 ? '?' : '&') + 'lang=' + lang + hash;
    });
  }

  /* ---------- Videos: poster + play button; a missing file shows "coming soon" instead of failing ---------- */
  var videos = [];
  function Video(fig) {
    var video = fig.querySelector('video');
    var btn = fig.querySelector('.vid-play');
    var lang = 'fr', missing = {};
    var srcFor = function (l) { return fig.getAttribute('data-video-' + l); };
    // Without JS the <video> keeps its controls and <source>; with JS the overlay button drives it.
    video.removeAttribute('controls');
    Array.prototype.slice.call(video.querySelectorAll('source')).forEach(function (s) { s.remove(); });

    function markSoon(isSoon) {
      fig.classList.toggle('soon', isSoon);
      btn.setAttribute('aria-disabled', isSoon ? 'true' : 'false');
    }
    this.setLang = function (l) {
      lang = l;
      if (!video.paused) video.pause();
      if (video.getAttribute('src')) { video.removeAttribute('src'); video.load(); }
      video.removeAttribute('controls');
      fig.classList.remove('playing');
      markSoon(!!missing[srcFor(lang)]);
    };
    btn.addEventListener('click', function () {
      if (fig.classList.contains('soon')) return;
      video.src = srcFor(lang);
      video.controls = true;
      fig.classList.add('playing');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      video.focus();
    });
    video.addEventListener('error', function () {
      if (!video.getAttribute('src')) return;
      missing[srcFor(lang)] = true;
      video.removeAttribute('src');
      video.removeAttribute('controls');
      fig.classList.remove('playing');
      markSoon(true);
      btn.focus();
    });
  }
  document.querySelectorAll('.vid[data-video-fr]').forEach(function (fig) { videos.push(new Video(fig)); });

  /* ---------- Menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    var setOpen = function (open) {
      navLinks.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () { setOpen(!navLinks.classList.contains('open')); });
    navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(body.getAttribute('data-lang') === 'fr' ? 'en' : 'fr');
    });
  }

  /* ---------- Contact form: opens the visitor's e-mail app ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var topic = /[?&]topic=([a-z-]+)/.exec(location.search);
    var sel = document.getElementById('cf-topic');
    if (topic && sel && sel.querySelector('option[value="' + topic[1] + '"]')) sel.value = topic[1];
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lang = body.getAttribute('data-lang') || 'fr';
      var err = document.getElementById('cf-error');
      if (!form.checkValidity()) {
        err.textContent = lang === 'fr' ? 'Indiquez votre nom, un courriel valide et votre message.' : 'Please enter your name, a valid email and your message.';
        var bad = form.querySelector(':invalid'); if (bad) bad.focus();
        return;
      }
      err.textContent = '';
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var topicText = sel.options[sel.selectedIndex].text;
      var subject = (lang === 'fr' ? 'Demande — ' : 'Inquiry — ') + topicText;
      var lines = lang === 'fr'
        ? ['Nom : ' + v('cf-name'), 'Organisation : ' + v('cf-org'), 'Courriel : ' + v('cf-email'), 'Sujet : ' + topicText, '', v('cf-msg')]
        : ['Name: ' + v('cf-name'), 'Organization: ' + v('cf-org'), 'Email: ' + v('cf-email'), 'Topic: ' + topicText, '', v('cf-msg')];
      location.href = 'mailto:info@newco-studio.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }

  /* ---------- Tabs (screenshot viewers) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (j === null) return;
        e.preventDefault();
        select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- Lightbox: buttons.zoom open their image full size ---------- */
  var dlg = document.getElementById('lightbox');
  if (dlg && typeof dlg.showModal === 'function') {
    var big = dlg.querySelector('img');
    var opener = null;
    document.addEventListener('click', function (e) {
      var z = e.target.closest('.zoom');
      if (!z) return;
      var img = z.querySelector('img');
      opener = z;
      big.src = img.getAttribute('data-full') || img.currentSrc || img.src;
      big.alt = img.alt;
      dlg.showModal();
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.lb-close')) dlg.close(); });
    dlg.addEventListener('close', function () { big.removeAttribute('src'); if (opener) opener.focus(); });
  } else {
    document.querySelectorAll('.zoom').forEach(function (z) { z.disabled = true; });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  applyLang(initialLang());
})();
