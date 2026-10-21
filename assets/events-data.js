// One source for every event: used by the home cards, the event pages and "More events".
window.DKH_EVENTS = [
  {
    slug: 'baraat-swagat', name: 'Baraat Swagat', what: 'The Welcome',
    day: 'Monday', date: '18th January', iso: '2027-01-18', start: '08:00', time: '8:00 am',
    venue: 'Krishna Resort, Chikhli', photo: '3d/baraat-swagat.jpg', pos: '50% 35%',
    extra: ['Followed by Breakfast']
  },
  {
    slug: 'rango-ka-mela', name: 'Rango Ka Mela', what: 'Haldi Carnival',
    day: 'Monday', date: '18th January', iso: '2027-01-18', start: '10:00', time: '10:00 am',
    venue: 'Kalakunj Ground', photo: '3d/rango-ka-mela.jpg', pos: '50% 35%',
    theme: 'Pastel Colors', palette: ['#F4C7D0', '#FBE6A6', '#C7E3CF', '#C9DDF2', '#DCCDEF'],
    women: 'Indo Western', men: 'Kurta',
    extra: ['Followed by Lunch']
  },
  {
    slug: 'mamera-ri-mithas', name: 'Mamera Ri Mithaas', what: 'Mayra',
    day: 'Monday', date: '18th January', iso: '2027-01-18', start: '14:00', time: '2:00 pm',
    venue: 'Raj Mahal Hall', photo: '3d/mamera-ri-mithas.jpg', pos: '50% 35%',
    theme: 'Rajasthani', palette: ['#C1272D', '#F2A900', '#D4145A', '#E8692B', '#2E7D5B'],
    extra: ['Followed by High Tea']
  },
  {
    slug: 'aaja-nach-le', name: 'Aaja Nach Le', what: 'Sangeet',
    day: 'Monday', date: '18th January', iso: '2027-01-18', start: '19:00', time: '7:00 pm',
    venue: 'Vrindavan Ground', photo: '3d/aaja-nach-le.jpg', pos: '50% 35%',
    theme: 'Shimmer', palette: ['#1E2A57', '#5A3A8E', '#8A8C96', '#C9CCD3', '#6B7B3A'], shimmer: true,
    extra: ['Followed by Dinner with Chovihaar Facility available']
  },
  {
    slug: 'chakka-maar-chalang-maar', name: 'Chhakka Maar, Chalang Maar', what: 'Cricket Match & Pool Party',
    day: 'Tuesday', date: '19th January', iso: '2027-01-19', start: '08:00', time: '8:00 am',
    venue: 'Kalakunj Ground', photo: '3d/chakka-maar-chalang-maar.jpg', pos: '50% 35%',
    theme: 'Floral colours', palette: ['#F29AB8', '#FFD166', '#9FD8A6', '#F7A072', '#4D6FA3'],
    women: 'Sporty Yet Festive', men: 'Sporty Yet Festive',
    extra: ['Starts with Breakfast, Followed by Lunch']
  },
  {
    slug: 'shagna-de-sham', name: 'Shagna de Shaam', what: 'The wedding',
    day: 'Tuesday', date: '19th January', iso: '2027-01-19', start: '14:00', time: '2:00 pm',
    venue: 'Vrindavan Ground & Ampy Theatre', photo: '3d/shagna-de-sham.jpg', pos: '50% 35%',
    women: 'Lehenga', men: 'Traditional',
    extra: ['Followed by High Tea'],
    rituals: [
      { time: '2:00 pm', name: 'Bind Nakasi', note: 'Baraat' },
      { time: '4:00 pm', name: 'Varmala', note: 'Vrindavan Ground' },
      { time: '5:00 pm', name: 'Hastmilap', note: 'Ampy Theatre' }
    ]
  },
  {
    slug: 'raat-baaki', name: 'Raat Baaki', what: 'After-Party Reception',
    day: 'Tuesday', date: '19th January', iso: '2027-01-19', start: '19:30', time: '7:30 pm',
    venue: 'Vrindavan Ground', photo: '3d/raat-baaki.jpg', pos: '50% 35%',
    theme: 'Cocktail night', women: 'Gown', men: 'Suit or blazer',
    extra: ['Followed by Dinner with Chovihaar Facility available']
  },
  {
    slug: 'breakfast', name: 'Breakfast', what: 'A Meal of Togetherness before New Beginnings ❤️',
    day: 'Wednesday', date: '20th January', iso: '2027-01-20', start: '07:30', time: '7:30 am',
    venue: 'Krishna Resort, Chikhli', photo: '3d/breakfast.jpg', pos: '50% 35%'
  }
];

(function () {
  var list = window.DKH_EVENTS;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(ev, i) {
    return '<a class="card fade" data-delay="' + (i % 4) + '" href="event.html?e=' + ev.slug + '">' +
      '<div class="card__img tilt"><span class="tilt__glare" aria-hidden="true"></span><img src="assets/img/' + ev.photo + '" alt="" loading="lazy" style="object-position:' + ev.pos + '"></div>' +
      '<div class="card__meta"><span>' + esc(ev.name) + '</span><span>' + esc(ev.date) + '</span></div>' +
      '<p class="card__more">' + esc(ev.what) + ', ' + esc(ev.time) + '</p>' +
      '</a>';
  }
  window.DKH_card = card;

  // Home page: every event as a card
  var home = document.getElementById('eventCards');
  if (home) home.innerHTML = list.map(card).join('');

  // Event page
  var page = document.getElementById('eventPage');
  if (!page) return;
  var slug = new URLSearchParams(location.search).get('e');
  var idx = list.findIndex(function (ev) { return ev.slug === slug; });
  if (idx < 0) idx = 0;
  var ev = list[idx];

  document.title = ev.name + ' – Darpan & Helly';
  var heroImg = document.getElementById('evHeroImg');
  heroImg.src = 'assets/img/' + ev.photo;
  heroImg.style.objectPosition = ev.pos;
  heroImg.alt = '';
  document.getElementById('evTitle').textContent = ev.name;
  document.getElementById('evSub').textContent = ev.day + ', ' + ev.date + ', ' + ev.time;
  document.getElementById('evWhat').textContent = ev.what;

  var facts = [
    ['Date', ev.day + ', ' + ev.date + ' 2027'],
    ['Starts', ev.time],
    ['Venue', ev.venue]
  ];
  (ev.extra || []).forEach(function (x) { facts.push(['Note', x]); });
  document.getElementById('evFacts').innerHTML = facts.map(function (f) {
    return '<dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd>';
  }).join('');

  var rit = document.getElementById('evRituals');
  if (ev.rituals) {
    rit.innerHTML = '<h2 class="h-md">Through the day</h2><ol class="ev__rituals">' + ev.rituals.map(function (r) {
      return '<li><span>' + r.time + '</span><span><b>' + esc(r.name) + '</b><em>' + esc(r.note) + '</em></span></li>';
    }).join('') + '</ol>';
  } else rit.remove();

  var dress = document.getElementById('evDress');
  if (ev.theme || ev.women) {
    var h = '<h2 class="h-md">Dress code</h2>';
    if (ev.theme) h += '<p class="ev__dress-title">Theme: ' + esc(ev.theme) + '</p>';
    if (ev.palette) h += '<ul class="swatches swatches--lg' + (ev.shimmer ? ' shimmer' : '') + '" aria-label="Colour palette">' +
      ev.palette.map(function (c) { return '<li style="--c:' + c + '"></li>'; }).join('') + '</ul>';
    if (ev.women) h += '<dl><dt>Women</dt><dd>' + esc(ev.women) + '</dd><dt>Men</dt><dd>' + esc(ev.men) + '</dd></dl>';
    dress.innerHTML = h;
  } else {
    dress.innerHTML = '<h2 class="h-md">Dress code</h2><p class="ev__dress-title">No dress code. Come as you are.</p>';
  }

  // Add to calendar (.ics) — assumes 2 hours when no end time is given
  document.getElementById('evCal').addEventListener('click', function () {
    var d = ev.iso.replace(/-/g, '');
    var hm = ev.start.replace(':', '');
    var endH = String(Math.min(23, parseInt(ev.start, 10) + 2)).padStart(2, '0') + ev.start.slice(3);
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DarpanKiHelly//EN', 'BEGIN:VEVENT',
      'UID:' + ev.slug + '@darpankihelly',
      'DTSTART;TZID=Asia/Kolkata:' + d + 'T' + hm + '00',
      'DTEND;TZID=Asia/Kolkata:' + d + 'T' + endH.replace(':', '') + '00',
      'SUMMARY:' + ev.name + ' – Darpan & Helly',
      'LOCATION:' + (ev.venue.indexOf('Krishna') > -1 ? ev.venue : ev.venue + ', Krishna Resort, Chikhli'),
      'DESCRIPTION:' + ev.what + '. #DarpanKiHelly',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = ev.slug + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
  });

  // Up next + the rest, so guests never need to go back
  var next = list[(idx + 1) % list.length];
  var nextLink = document.getElementById('evNext');
  nextLink.href = 'event.html?e=' + next.slug;
  nextLink.querySelector('[data-next-name]').textContent = next.name;
  nextLink.querySelector('[data-next-date]').textContent = next.day + ', ' + next.date + ', ' + next.time;

  var others = list.slice(idx + 1).concat(list.slice(0, idx));
  document.getElementById('moreEvents').innerHTML = others.map(card).join('');
})();
