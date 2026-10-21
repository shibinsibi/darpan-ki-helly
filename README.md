# Darpan & Helly – wedding website

Invitation site for Darpan & Helly's wedding, 18–19 January 2027 at Krishna Resort, Chikhli. #DarpanKiHelly

## Pages
- `index.html` – the bell invitation: ring the bell, the couple, the invitation, then a Celebrations screen (countdown, every event, links). Guests skip the bell on later visits in the same session; `index.html#invitation` or `#celebrations` jumps straight there. Art lives in `assets/img/invite/`.
- `celebrations.html` – photo home: hero, all event cards, notes
- `story.html` – the couple's story, families and gallery
- `events.html` – full schedule and wardrobe planner
- `event.html?e=<slug>` – one event, with "Up next" and the other events below
- `rsvp.html` – RSVP form that opens WhatsApp

Event details (times, venues, dress codes, images) live in `assets/events-data.js`.

## Run locally
```
python -m http.server 8080
```
then open http://localhost:8080
