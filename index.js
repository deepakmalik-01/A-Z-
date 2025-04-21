// JavaScript for A TO Z Car service Website

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");

      // Animate hamburger to X
      const spans = mobileMenuToggle.querySelectorAll("span");
      spans.forEach((span) => {
        span.classList.toggle("active");
      });
    });
  }

  // Hero Slider Functionality
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");

  let currentSlide = 0;
  const slideCount = slides.length;

  // Only setup slider if there are slides
  if (slideCount > 0) {
    // Initially only the first slide is visible due to HTML structure

    // Function to go to a specific slide
    const goToSlide = (index) => {
      // Remove active class from all slides and dots
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });

      dots.forEach((dot) => {
        dot.classList.remove("active");
      });

      // Add active class to current slide and dot
      slides[index].classList.add("active");
      if (dots[index]) {
        dots[index].classList.add("active");
      }

      currentSlide = index;
    };

    // Next slide function
    const nextSlide = () => {
      const next = (currentSlide + 1) % slideCount;
      goToSlide(next);
    };

    // Previous slide function
    const prevSlide = () => {
      const prev = (currentSlide - 1 + slideCount) % slideCount;
      goToSlide(prev);
    };

    // Event listeners for arrows
    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide);
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlide(index);
      });
    });

    // Auto slide every 5 seconds
    setInterval(() => {
      nextSlide();
    }, 5000);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active");
        }
      }
    });
  });

  // Scroll event for header
  const header = document.querySelector(".header");

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Add active class to nav links based on current section
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", () => {
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }
});
