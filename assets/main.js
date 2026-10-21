(function () {
  var body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero image settles in once the page has loaded
  requestAnimationFrame(function () { body.classList.add('is-loaded'); });

  // Header: solid after the hero, hides on scroll down, returns on scroll up
  var head = document.querySelector('.head');
  var hero = document.querySelector('.hero, .story-hero');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    var limit = hero ? hero.offsetHeight - 80 : 10;
    head.classList.toggle('is-solid', y > limit);
    head.classList.toggle('is-hidden', y > lastY && y > limit + 200);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Full-screen menu
  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.head__menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
    menuBtn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    if (open) menu.querySelector('a').focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });

  // Scroll reveals
  var targets = document.querySelectorAll('.fade, .reveal-img, [data-lines]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  // Feature photo: gentle zoom-out as it scrolls through the viewport
  var feat = document.querySelector('.feature__photo img');
  if (feat && !reduce) {
    var box = feat.parentElement;
    var tick = function () {
      var r = box.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2)));
      feat.style.transform = 'scale(' + (1.25 - p * 0.25).toFixed(3) + ')';
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(tick); }, { passive: true });
    tick();
  }

  // 3D tilt on event cards (mouse / pen only; touch keeps the scroll-in flip)
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card');
      var tilt = card && card.querySelector('.tilt');
      document.querySelectorAll('.tilt.is-tilting').forEach(function (t) {
        if (t !== tilt) { t.classList.remove('is-tilting'); t.style.transform = ''; }
      });
      if (!tilt) return;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tilt.classList.add('is-tilting');
      tilt.style.transform = 'rotateX(' + (-y * 14).toFixed(2) + 'deg) rotateY(' + (x * 18).toFixed(2) + 'deg) translateZ(24px)';
      tilt.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
      tilt.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
    });
  }

  // 3D parallax on the event page hero: follows the mouse, or the phone's tilt
  var hero3d = document.querySelector('.hero--3d');
  if (hero3d && !reduce) {
    var setTilt = function (x, y) {
      hero3d.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
      hero3d.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
      hero3d.style.setProperty('--tx', (x * -24).toFixed(1) + 'px');
      hero3d.style.setProperty('--ty', (y * -18).toFixed(1) + 'px');
    };
    hero3d.addEventListener('pointermove', function (e) {
      var r = hero3d.getBoundingClientRect();
      setTilt((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    });
    hero3d.addEventListener('pointerleave', function () { setTilt(0, 0); });
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma == null) return;
      setTilt(Math.max(-1, Math.min(1, e.gamma / 30)) / 2, Math.max(-1, Math.min(1, (e.beta - 45) / 30)) / 2);
    });
  }

  // Countdown to Baraat Swagat, 18 Jan 2027, 8:00 am IST
  var cd = document.getElementById('countdown');
  if (cd) {
    var target = new Date('2027-01-18T08:00:00+05:30').getTime();
    var cells = {};
    cd.querySelectorAll('b').forEach(function (b) { cells[b.dataset.u] = b; });
    var run = function () {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      cells.d.textContent = Math.floor(s / 86400);
      cells.h.textContent = String(Math.floor(s / 3600) % 24).padStart(2, '0');
      cells.m.textContent = String(Math.floor(s / 60) % 60).padStart(2, '0');
    };
    run();
    setInterval(run, 30000);
  }

  // Wardrobe planner, saved on this phone
  var list = document.getElementById('checklist');
  if (list) {
    var KEY = 'dkh-wardrobe';
    var boxes = list.querySelectorAll('input');
    var count = document.getElementById('plannerCount');
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
    var update = function () {
      var done = [];
      boxes.forEach(function (b) { if (b.checked) done.push(b.value); });
      count.textContent = done.length === boxes.length
        ? 'All packed. See you in Chikhli!'
        : done.length + ' of ' + boxes.length + ' looks packed';
      try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
    };
    boxes.forEach(function (b) {
      b.checked = saved.indexOf(b.value) > -1;
      b.addEventListener('change', update);
    });
    update();
  }

  // RSVP: saved as a row in the family's Google Sheet (Apps Script web app).
  // Until RSVP_SHEET_URL is set, it falls back to a WhatsApp message to Darpan.
  var RSVP_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyPinXDLM5bgnkw4xMgrc2_KDTtMZcI1NP-wRPcs2NePCNAGq9LS8pqj-4XndiC1lWr/exec';
  var form = document.getElementById('rsvpForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var guests = Math.max(1, parseInt(form.guests.value, 10) || 1);
      var phone = form.phone.value.trim();
      var days = Array.prototype.map.call(form.querySelectorAll('input[name="days"]:checked'), function (d) { return d.value; });
      var note = form.note.value.trim();
      var err = document.getElementById('formError');
      var btn = form.querySelector('button[type="submit"]');
      if (!name) { err.textContent = 'Add your name so we know who’s coming.'; form.name.focus(); return; }
      if (phone.replace(/\D/g, '').length < 10) { err.textContent = 'Add a contact number so we can reach you.'; form.phone.focus(); return; }
      if (!days.length) { err.textContent = 'Pick at least one day you’ll be there.'; return; }
      err.textContent = '';
      if (!RSVP_SHEET_URL) {
        var msg = 'Hi Darpan! RSVP for #DarpanKiHelly\n' +
          'Name: ' + name + '\nGuests: ' + guests + '\nContact: ' + phone + '\nAttending: ' + days.join(', ') +
          (note ? '\nNote: ' + note : '');
        window.open('https://wa.me/919824768648?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        return;
      }
      btn.disabled = true; btn.textContent = 'Sending…';
      // Form-encoded + no-cors: Apps Script accepts it without a CORS preflight; the response is opaque.
      fetch(RSVP_SHEET_URL, {
        method: 'POST', mode: 'no-cors',
        body: new URLSearchParams({ name: name, guests: guests, phone: phone, days: days.join(', '), note: note })
      }).then(function () {
        form.innerHTML = '<p class="h-md" role="status">Thank you, ' + name.replace(/[&<>"]/g, '') + '! Your RSVP is in. See you in Chikhli.</p>';
      }, function () {
        btn.disabled = false; btn.textContent = 'Send RSVP';
        err.textContent = 'Could not send. Check your internet and try again, or call our Event Team below.';
      });
    });
  }
})();
