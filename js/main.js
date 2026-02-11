/* ============================================
   Chad T. Wilson - Personal Website
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Load profile data and render the site
  try {
    const response = await fetch('data/profile.json');
    const profile = await response.json();
    renderSite(profile);
    initInteractions();
  } catch (err) {
    console.error('Failed to load profile data:', err);
    initInteractions();
  }
});

/* --- Render site from JSON data --- */
function renderSite(data) {
  // Hero
  setText('#hero-name', data.name);
  setText('#hero-headline', data.hero.headline);
  setText('#hero-subheadline', data.hero.subheadline);

  // About
  const aboutContainer = document.getElementById('about-text');
  if (aboutContainer && data.about) {
    let html = `<p>${data.about.summary}</p>`;
    data.about.highlights.forEach(h => {
      html += `<p>${h}</p>`;
    });
    aboutContainer.innerHTML = html;
  }

  // Experience timeline
  const timelineContainer = document.getElementById('timeline');
  if (timelineContainer && data.experience) {
    timelineContainer.innerHTML = data.experience.map((job, i) => `
      <div class="timeline-item fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-header">
            <div class="timeline-role">
              <h3>${job.title}</h3>
              <span class="timeline-company">${job.company}</span>
            </div>
            <div class="timeline-meta">
              <div class="timeline-date">${job.startDate} — ${job.endDate}</div>
              <div class="timeline-location">${job.location}</div>
              <span class="timeline-badge">${job.workType}</span>
            </div>
          </div>
          <p class="timeline-desc">${job.description}</p>
        </div>
      </div>
    `).join('');
  }

  // Skills
  const skillsContainer = document.getElementById('skills-grid');
  if (skillsContainer && data.skills) {
    const icons = {
      infrastructure: '&#9881;',
      security: '&#128274;',
      management: '&#128200;',
      platforms: '&#9729;'
    };
    const labels = {
      infrastructure: 'Infrastructure & Cloud',
      security: 'Security & Compliance',
      management: 'Leadership & Strategy',
      platforms: 'Platforms & Tools'
    };
    skillsContainer.innerHTML = Object.entries(data.skills).map(([key, skills]) => `
      <div class="skill-category fade-in">
        <div class="skill-icon">${icons[key] || '&#9733;'}</div>
        <h3>${labels[key] || key}</h3>
        <div class="skill-tags">
          ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Contact info
  setText('#contact-email-text', data.email);
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) emailLink.href = `mailto:${data.email}`;
  const linkedinLink = document.getElementById('contact-linkedin-link');
  if (linkedinLink) linkedinLink.href = data.linkedin;

  // Footer
  setText('#footer-year', new Date().getFullYear());
  setText('#footer-name', data.name);
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value !== undefined) el.textContent = value;
}

/* --- Interactions --- */
function initInteractions() {
  // Navbar scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });

  // Scroll-triggered fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Contact form handling
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      const message = form.querySelector('[name="message"]').value;

      // Open mailto as a fallback (can be replaced with a form service)
      const subject = encodeURIComponent(`Website Contact from ${name}`);
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      window.location.href = `mailto:chad@chadtwilson.com?subject=${subject}&body=${body}`;

      form.reset();
    });
  }
}
