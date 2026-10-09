(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Copy phone number
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { var old = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = old; }, 1600); };
      var fallback = function () {
        var target = document.getElementById(btn.getAttribute('data-copy-target'));
        if (target) { var r = document.createRange(); r.selectNodeContents(target); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  });

  // Contact form: posts to contact.php (works without JavaScript too).
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-note');
    var started = document.getElementById('form-started');
    var submit = document.getElementById('form-submit');
    if (started) started.value = String(Date.now());

    var show = function (ok, msg) {
      note.hidden = false;
      note.dataset.state = ok ? 'ok' : 'error';
      note.textContent = msg;
    };

    // Result after a no-JavaScript submit redirects back here.
    var q = location.search;
    if (q.indexOf('sent=1') > -1) show(true, 'Thanks. Your message has been sent. We will reply during business hours. For anything urgent, call +1 (407) 760-8000.');
    if (q.indexOf('error=1') > -1) show(false, 'Your message could not be sent. Please call +1 (407) 760-8000.');

    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
      if (!window.fetch || !window.FormData) return; // let the browser post normally
      e.preventDefault();
      submit.disabled = true;
      submit.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false, message: 'Your message could not be sent. Please call +1 (407) 760-8000.' }; }); })
        .then(function (res) {
          show(!!res.ok, res.message);
          if (res.ok) form.reset();
        })
        .catch(function () { show(false, 'Your message could not be sent. Please check your connection or call +1 (407) 760-8000.'); })
        .then(function () { submit.disabled = false; submit.textContent = 'Send message'; if (started) started.value = String(Date.now()); });
    });
  }
})();
