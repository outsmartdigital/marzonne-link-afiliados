/**
 * DNA de Craque - Site Institucional
 * JavaScript - Animacoes e Interacoes Modernas
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation()
  initScrollAnimations()
  initParallax()
  initCounters()
  initSmoothScroll()
  initPhoneCarousel()
})

/**
 * Navigation
 */
function initNavigation() {
  const header = document.querySelector('.header')
  const navToggle = document.querySelector('.nav-toggle')
  const navMenu = document.querySelector('.nav-menu')

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active')
      navMenu.classList.toggle('active')
    })

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active')
        navMenu.classList.remove('active')
      })
    })
  }

  // Header scroll effect
  let lastScroll = 0
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset

    if (currentScroll > 50) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }

    lastScroll = currentScroll
  })
}

/**
 * Scroll Animations with Intersection Observer
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')

        // Stagger children animations
        const children = entry.target.querySelectorAll('[data-delay]')
        children.forEach(child => {
          const delay = child.dataset.delay || 0
          child.style.transitionDelay = `${delay}ms`
          child.classList.add('visible')
        })
      }
    })
  }, observerOptions)

  // Elements to animate
  const animatedElements = document.querySelectorAll(`
    .section-intro,
    .problem-grid,
    .problem-card,
    .problem-conclusion,
    .solution-content,
    .solution-visual,
    .feature-list,
    .feature-item,
    .step-item,
    .audience-card,
    .feature-card,
    .proof-stats,
    .proof-testimonial,
    .cta-content
  `)

  animatedElements.forEach(el => {
    el.classList.add('fade-up')
    observer.observe(el)
  })
}

/**
 * Parallax effects
 */
function initParallax() {
  const hero = document.querySelector('.hero')
  const floatingCards = document.querySelectorAll('.float-card')

  if (!hero) return

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * 0.3

    // Parallax for floating cards
    floatingCards.forEach((card, index) => {
      const direction = index % 2 === 0 ? 1 : -1
      const speed = 0.1 + (index * 0.05)
      card.style.transform = `translateY(${scrolled * speed * direction}px)`
    })
  })

  // Mouse parallax for hero
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    const xPos = (clientX / innerWidth - 0.5) * 20
    const yPos = (clientY / innerHeight - 0.5) * 20

    floatingCards.forEach((card, index) => {
      const factor = 1 + index * 0.3
      card.style.transform = `translate(${xPos * factor}px, ${yPos * factor}px)`
    })
  })
}

/**
 * Animated counters
 */
function initCounters() {
  const counters = document.querySelectorAll('.stat-value')

  const observerOptions = {
    threshold: 0.5
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = parseInt(counter.dataset.count)

        if (target) {
          animateCounter(counter, target)
          observer.unobserve(counter)
        }
      }
    })
  }, observerOptions)

  counters.forEach(counter => observer.observe(counter))
}

function animateCounter(element, target) {
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + '+'
  }, 16)
}

/**
 * Smooth scroll
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (href === '#') return

      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()

      const headerHeight = document.querySelector('.header').offsetHeight
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    })
  })
}

/**
 * Phone Carousel
 */
function initPhoneCarousel() {
  const track = document.querySelector('.carousel-track')
  const slides = document.querySelectorAll('.carousel-slide')
  const dots = document.querySelectorAll('.carousel-dots .dot')

  if (!track || slides.length === 0) return

  let currentIndex = 0
  const totalSlides = slides.length
  const autoPlayInterval = 3500 // 3.5 seconds

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1
    if (index >= totalSlides) index = 0

    currentIndex = index
    track.style.transform = `translateX(-${currentIndex * 100}%)`

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex)
    })
  }

  function nextSlide() {
    goToSlide(currentIndex + 1)
  }

  // Auto play
  let autoPlay = setInterval(nextSlide, autoPlayInterval)

  // Pause on hover
  const carousel = document.querySelector('.phone-carousel')
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoPlay)
    })

    carousel.addEventListener('mouseleave', () => {
      autoPlay = setInterval(nextSlide, autoPlayInterval)
    })
  }

  // Click on dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index)
      clearInterval(autoPlay)
      autoPlay = setInterval(nextSlide, autoPlayInterval)
    })
  })

  // Touch/swipe support
  let touchStartX = 0
  let touchEndX = 0

  if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX
    }, { passive: true })

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }, { passive: true })
  }

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToSlide(currentIndex + 1)
      } else {
        goToSlide(currentIndex - 1)
      }
      clearInterval(autoPlay)
      autoPlay = setInterval(nextSlide, autoPlayInterval)
    }
  }
}

/**
 * Intersection Observer for lazy loading (future use)
 */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]')

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute('data-src')
        imageObserver.unobserve(img)
      }
    })
  })

  lazyImages.forEach(img => imageObserver.observe(img))
}

/**
 * Add CSS for animations dynamically
 */
const style = document.createElement('style')
style.textContent = `
  .fade-up {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .problem-card,
  .feature-item,
  .step-item,
  .feature-card {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .problem-card.visible,
  .feature-item.visible,
  .step-item.visible,
  .feature-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
`
document.head.appendChild(style)
