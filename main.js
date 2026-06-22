/* ============================================
   FUELIVERY — MAIN JAVASCRIPT (FINAL)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor (desktop only) ── */
  const cur = document.getElementById('cur');
  const cur2 = document.getElementById('cur2');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !('ontouchstart' in window);

  if (cur && cur2 && hasFinePointer) {
    let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
    let moved = false;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      if (!moved) { moved = true; document.body.classList.add('mouse-active'); }
    });
    (function animCur(){
      rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
      cur2.style.left = rx + 'px'; cur2.style.top = ry + 'px';
      requestAnimationFrame(animCur);
    })();
    document.querySelectorAll('a,button,.pillar,.fq,.sc,.mc,.hcard,.vm,.si').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });

    /* ── Spotlight ── */
    const sl = document.getElementById('spotlight');
    if (sl) {
      document.addEventListener('mousemove', e => {
        sl.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(232,160,32,.07) 0%, transparent 70%)`;
      });
    }
  } else {
    if (cur) cur.style.display = 'none';
    if (cur2) cur2.style.display = 'none';
  }

  /* ── Particle Field (hero canvas) ── */
  const cvs = document.getElementById('canvas');
  if (cvs) {
    const ctx = cvs.getContext('2d');
    let W, H, pts = [];
    function resizeCvs(){
      W = cvs.width = cvs.offsetWidth;
      H = cvs.height = cvs.offsetHeight;
      const count = W < 700 ? 30 : 60;
      pts = Array.from({length: count}, () => ({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
        r: Math.random()*1.4+0.5, a: Math.random()
      }));
    }
    resizeCvs();
    window.addEventListener('resize', resizeCvs);
    function animPts(){
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>W) p.vx*=-1;
        if (p.y<0||p.y>H) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(232,160,32,${p.a*0.3})`; ctx.fill();
      });
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
        const d = Math.hypot(a.x-b.x,a.y-b.y);
        if (d<110){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(232,160,32,${(1-d/110)*0.06})`; ctx.stroke(); }
      }));
      requestAnimationFrame(animPts);
    }
    animPts();
  }

  /* ── Load Animation ── */
  setTimeout(() => document.body.classList.add('ld'), 150);

  /* ── Scroll Progress ── */
  const prog = document.getElementById('prog');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (prog) prog.style.width = pct + '%';
  });

  /* ── Nav scroll state ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('s', window.scrollY > 60));

  /* ── Hamburger / Mobile Menu ── */
  const hbg = document.getElementById('hbg');
  const mm = document.getElementById('mmenu');
  if (hbg && mm) {
    hbg.addEventListener('click', () => {
      hbg.classList.toggle('o');
      mm.classList.toggle('o');
      document.body.style.overflow = mm.classList.contains('o') ? 'hidden' : '';
    });
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hbg.classList.remove('o'); mm.classList.remove('o'); document.body.style.overflow = '';
    }));
  }

  /* ── Reveal Observer ── */
  const ro = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('iv'); ro.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.rv, .si').forEach(el => ro.observe(el));

  /* ── Counter Animation ── */
  function counter(el, t, suf, dec){
    const dur = 1800, start = performance.now();
    (function upd(now){
      const p = Math.min((now-start)/dur, 1);
      const e = 1 - Math.pow(1-p, 3);
      const v = dec ? (e*t).toFixed(dec) : Math.floor(e*t);
      el.textContent = v + suf;
      if (p<1) requestAnimationFrame(upd);
    })(start);
  }
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target, c = parseFloat(el.dataset.c), s = el.dataset.s || '', d = parseInt(el.dataset.dec) || 0;
      counter(el, c, s, d); co.unobserve(el);
    }
  }), { threshold: 0.5 });
  document.querySelectorAll('.sn[data-c]').forEach(el => co.observe(el));

  /* ── Zoom Scroll Strip ── */
  const zstrip = document.getElementById('zoom-strip');
  const zt = document.getElementById('zoom-text');
  if (zstrip && zt) {
    window.addEventListener('scroll', () => {
      const r = zstrip.getBoundingClientRect(), h = window.innerHeight;
      const total = zstrip.offsetHeight - h;
      if (r.top <= 0 && r.bottom >= h) {
        const p = Math.min(Math.max(-r.top/total, 0), 1);
        const sc = 0.6 + p*0.52;
        const op = p<0.1 ? p*10 : p>0.9 ? (1-p)*10 : 1;
        zt.style.transform = `scale(${sc})`;
        zt.style.opacity = op;
      }
    });
  }

  /* ── Horizontal Scroll (Revenue Model) ── */
  const hst = document.getElementById('hs-track');
  const hsc = document.getElementById('hscroll');
  const isMob = () => window.innerWidth <= 1024;
  if (hsc && hst) {
    window.addEventListener('scroll', () => {
      if (isMob()) return;
      const r = hsc.getBoundingClientRect();
      const maxScroll = hsc.offsetHeight - window.innerHeight;
      if (r.top <= 0 && r.bottom >= window.innerHeight) {
        const p = Math.min(Math.max(-r.top/maxScroll, 0), 1);
        const maxX = hst.scrollWidth - window.innerWidth;
        hst.style.transform = `translateX(${-p*maxX}px)`;
      }
    });
  }

  /* ── Marquee duplicate ── */
  const mqt = document.getElementById('mqt');
  if (mqt) mqt.innerHTML += mqt.innerHTML;

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.fq').forEach(q => {
    q.addEventListener('click', () => {
      const fi = q.closest('.fi'), fa = fi.querySelector('.fa'), open = fi.classList.contains('o');
      document.querySelectorAll('.fi.o').forEach(x => { x.classList.remove('o'); x.querySelector('.fa').style.maxHeight = '0'; });
      if (!open) { fi.classList.add('o'); fa.style.maxHeight = fa.scrollHeight + 'px'; }
    });
  });

  /* ── Thesis Tabs ── */
  document.querySelectorAll('.pillar').forEach((p, i) => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.pillar').forEach(x => x.classList.remove('a'));
      document.querySelectorAll('.td-panel').forEach(x => x.classList.remove('a'));
      p.classList.add('a');
      const panel = document.getElementById('tp'+i);
      if (panel) panel.classList.add('a');
    });
  });

  /* ── Magnetic Buttons (desktop only) ── */
  if (hasFinePointer) {
    document.querySelectorAll('.mag-wrap').forEach(wrap => {
      const btn = wrap.querySelector('a');
      wrap.addEventListener('mousemove', e => {
        const r = wrap.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width/2) * 0.35;
        const dy = (e.clientY - r.top - r.height/2) * 0.35;
        btn.style.transform = `translate(${dx}px,${dy}px)`;
      });
      wrap.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ── Smooth Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});
