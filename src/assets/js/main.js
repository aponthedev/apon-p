(function ($) {
  'use strict';

  // Keep a single Lenis instance available to every scroll control.
  let lenisInstance = null;

  //============================ Scroll To Top Js Start ========================
  var btn = $('.scroll-top');

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });

  btn.on('click', function (e) {
    e.preventDefault();

    if (lenisInstance) {
      lenisInstance.scrollTo(0, {
        duration: 1.35,
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  });
  //============================ Scroll To Top Js End ========================

   // ============================ Smooth Scroll Start ============================
  $(document).ready(function () {
    initializeLenis();
    initializeCounterGsapAnimation();
    initializeSectionHeadingGsapAnimation();
    initializeGalleryMasonry();
    initializeGalleryGsapAnimation();
    initializeWhatIDoGsapAnimation();
    initializeProductGsapAnimation();
    initializeSocialMediaGsapAnimation();
    initializeCtaGsapAnimation();
    if (typeof initializeAboutGsapAnimation === 'function') {
      initializeAboutGsapAnimation();
    }
    if (typeof initializeHowWorkGsapAnimation === 'function') {
      initializeHowWorkGsapAnimation();
    }
  });

  function initializeLenis() {
    if (
      typeof Lenis === 'undefined' ||
      lenisInstance ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    lenisInstance = new Lenis({
      duration: 1.35,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.75,
      touchMultiplier: 0.9,
      autoRaf: true,
      overscroll: true,
      prevent: function (node) {
        if (!(node instanceof Element)) return false;

        return Boolean(
          node.closest(
            '[data-lenis-prevent], .select2-results__options, .modal, .offcanvas__area, .product-sidebar'
          )
        );
      },
    });

    // Keep scroll-dependent UI and animation libraries in sync with Lenis.
    lenisInstance.on('scroll', function () {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    function getHeaderOffset() {
      const header = document.querySelector('.header__area');
      return header ? -header.getBoundingClientRect().height : 0;
    }

    $(document).on(
      'click.lenisAnchors',
      'a[href*="#"]:not([href="#"]):not([data-bs-toggle]):not([data-sidebar-toggle])',
      function (e) {
        const linkUrl = new URL(this.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (
          linkUrl.origin !== currentUrl.origin ||
          linkUrl.pathname.replace(/\/$/, '') !== currentUrl.pathname.replace(/\/$/, '') ||
          !linkUrl.hash
        ) {
          return;
        }

        const targetId = decodeURIComponent(linkUrl.hash.slice(1));
        const target = document.getElementById(targetId);

        if (!target) return;

        e.preventDefault();

        $('.offcanvas__area, .overlay').removeClass('active');

        lenisInstance.scrollTo(target, {
          offset: getHeaderOffset(),
          duration: 1.35,
          onComplete: function () {
            if (window.location.hash !== linkUrl.hash) {
              window.history.pushState(null, '', linkUrl.hash);
            }
          },
        });
      }
    );

    if (window.location.hash) {
      window.requestAnimationFrame(function () {
        const targetId = decodeURIComponent(window.location.hash.slice(1));
        const target = document.getElementById(targetId);

        if (target) {
          lenisInstance.scrollTo(target, {
            offset: getHeaderOffset(),
            immediate: true,
          });
        }
      });
    }
  }
  // ============================= Smooth Scroll End =============================

  // banner animation start
  function initializeBannerGsapAnimation() {
    const bannerContent = document.querySelector('.banner__content');

    if (
      !bannerContent ||
      typeof gsap === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const textItems = Array.from(
      bannerContent.querySelectorAll(
        '.banner__title, .banner__name, .banner__deg, .banner__welcome, .banner__desc'
      )
    ).filter(function (item) {
      return item.getClientRects().length > 0;
    });
    const actionButton = bannerContent.querySelector('.btn');
    const socialLinks = bannerContent.querySelectorAll('.banner__socials__link');
    const bannerGutters = Array.from(document.querySelectorAll('.banner__guter')).filter(
      function (gutter) {
        return gutter.getClientRects().length > 0;
      }
    );
    const bannerImages = Array.from(document.querySelectorAll('.banner__image')).filter(
      function (image) {
        return image.getClientRects().length > 0;
      }
    );
    const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

    bannerGutters.forEach(function (bannerGutter) {
      gsap.fromTo(
        bannerGutter,
        {
          x: 120,
          y: 45,
          scale: 0.82,
          rotation: 14,
          autoAlpha: 0,
          transformOrigin: '50% 100%',
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 1,
          autoAlpha: 1,
          duration: 1.4,
          delay: 0.35,
          ease: 'back.out(1.2)',
          onComplete: function () {
            gsap.to(bannerGutter, {
              y: -12,
              rotation: -2,
              duration: 2.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              transformOrigin: '50% 100%',
            });
          },
        }
      );
    });

    if (bannerImages.length) {
      gsap.fromTo(
        bannerImages,
        {
          x: function (_, image) {
            return image.classList.contains('banner__image--mobile') ? 0 : 90;
          },
          y: 55,
          scale: 0.9,
          autoAlpha: 0,
          clipPath: 'inset(0 0 18% 0)',
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.35,
          delay: 0.2,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility,clipPath',
        }
      );
    }

    timeline.fromTo(
      textItems,
      {
        y: 80,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.18,
        clearProps: 'transform,opacity,visibility',
      }
    );

    if (actionButton) {
      timeline.fromTo(
        actionButton,
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          clearProps: 'transform,opacity,visibility',
        },
        '-=0.35'
      );
    }

    timeline.fromTo(
      socialLinks,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.55,
        stagger: 0.1,
        clearProps: 'transform,opacity,visibility',
      },
      '-=0.3'
    );
  }

  // banner animation end

  // ========================= Counter GSAP Animation Start ===================
  function initializeCounterGsapAnimation() {
    const counterSection = document.querySelector('.counter');

    if (
      !counterSection ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const counterItems = gsap.utils.toArray('.counter__item');

    if (!counterItems.length) return;

    gsap.fromTo(
      counterItems,
      {
        y: 70,
        scale: 0.9,
        autoAlpha: 0,
      },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.16,
        ease: 'back.out(1.25)',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: counterSection,
          start: 'top 82%',
          once: true,
        },
      }
    );
  }
  // ========================= Counter GSAP Animation End =====================

  // ======================= What I Do GSAP Animation Start =======================
  function initializeWhatIDoGsapAnimation() {
    const section = document.querySelector('.what-i-do');

    if (
      !section ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const cards = gsap.utils.toArray('.what-i-do__item');

    if (!cards.length) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      cards,
      {
        y: 80,
        scale: 0.92,
        rotateX: 12,
        autoAlpha: 0,
        filter: 'blur(7px)',
        transformOrigin: 'center bottom',
      },
      {
        y: 0,
        scale: 1,
        rotateX: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: {
          each: 0.13,
          from: 'start',
        },
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility,filter',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
      }
    );
  }
  // ======================== What I Do GSAP Animation End ========================

  // ======================== Product GSAP Animation Start ========================
  function initializeProductGsapAnimation() {
    const section = document.querySelector('.product');

    if (
      !section ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const cards = gsap.utils.toArray('.product__card');

    if (!cards.length) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      cards,
      {
        y: 80,
        scale: 0.92,
        rotateX: 12,
        autoAlpha: 0,
        filter: 'blur(7px)',
        transformOrigin: 'center bottom',
      },
      {
        y: 0,
        scale: 1,
        rotateX: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: {
          each: 0.13,
          from: 'start',
        },
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility,filter',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
      }
    );
  }
  // ========================= Product GSAP Animation End =========================

  // ===================== Social Media GSAP Animation Start =====================
  function initializeSocialMediaGsapAnimation() {
    const section = document.querySelector('.social-media');

    if (
      !section ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined'
    ) {
      return;
    }

    const items = gsap.utils.toArray(section.querySelectorAll('.social-media__item'));

    if (!items.length) return;

    const icons = section.querySelectorAll('.social-media__icon');
    const lines = section.querySelectorAll('.social-media__line');
    const names = section.querySelectorAll('.social-media__name');
    const meta = section.querySelectorAll('.social-media__meta');
    const heading = section.querySelector('.section-heading__title');
    const action = section.querySelector('.section-heading .btn');

    gsap.registerPlugin(ScrollTrigger);

    if (heading) {
      gsap.set(heading, { x: -70, autoAlpha: 0 });
    }

    if (action) {
      gsap.set(action, { x: 70, scale: 0.82, autoAlpha: 0 });
    }

    gsap.set(items, {
      x: function (index) {
        return index % 2 === 0 ? -70 : 70;
      },
      y: 24,
      scale: 0.97,
      autoAlpha: 0,
    });
    gsap.set(icons, {
      scale: 0.35,
      rotate: -100,
      autoAlpha: 0,
    });
    gsap.set(lines, { scaleX: 0, transformOrigin: 'center' });
    gsap.set(names, { x: 28, autoAlpha: 0 });
    gsap.set(meta, { x: 32, autoAlpha: 0 });

    const timeline = gsap.timeline({ paused: true });

    if (heading) {
      timeline.fromTo(
        heading,
        { x: -70, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
        0
      );
    }

    if (action) {
      timeline.fromTo(
        action,
        { x: 70, scale: 0.82, autoAlpha: 0 },
        {
          x: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
        0.05
      );
    }

    timeline
      .fromTo(
        items,
        {
          x: function (index) {
            return index % 2 === 0 ? -70 : 70;
          },
          y: 24,
          scale: 0.97,
          autoAlpha: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
        0.25
      )
      .fromTo(
        icons,
        {
          scale: 0.35,
          rotate: -100,
          autoAlpha: 0,
        },
        {
          scale: 1,
          rotate: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          clearProps: 'transform,opacity,visibility',
        },
        0.35
      )
      .fromTo(
        lines,
        { scaleX: 0, transformOrigin: 'center' },
        {
          scaleX: 1,
          duration: 0.65,
          stagger: 0.055,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        0.42
      )
      .fromTo(
        names,
        { x: 28, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
        0.48
      )
      .fromTo(
        meta,
        { x: 32, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
        0.52
      );

    let hasEntered = false;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 76%',
      onEnter: function () {
        if (hasEntered) return;
        hasEntered = true;
        timeline.play(0);
      },
      onEnterBack: function () {
        if (hasEntered) return;
        hasEntered = true;
        timeline.progress(1).pause();
      },
    });

    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  }

  // ====================== Social Media GSAP Animation End ======================

  // =========================== CTA GSAP Animation Start ===========================
  function initializeCtaGsapAnimation() {
    const section = document.querySelector('.cta');

    if (
      !section ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const contentItems = section.querySelectorAll(
      '.cta__subtitle, .cta__desc, .cta__actions'
    );
    const thumb = section.querySelector('.cta__thumb');

    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
        once: true,
      },
      defaults: {
        ease: 'power3.out',
      },
    });

    timeline.fromTo(
      contentItems,
      {
        x: -60,
        autoAlpha: 0,
        filter: 'blur(6px)',
      },
      {
        x: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.14,
        clearProps: 'transform,opacity,visibility,filter',
      }
    );

    if (thumb) {
      timeline.fromTo(
        thumb,
        {
          x: 100,
          y: 30,
          scale: 0.86,
          rotate: 5,
          autoAlpha: 0,
          filter: 'blur(8px)',
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.15,
          ease: 'back.out(1.15)',
          clearProps: 'transform,opacity,visibility,filter',
          onComplete: function () {
            gsap.to(thumb, {
              y: -10,
              duration: 2.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          },
        },
        '-=0.65'
      );
    }
  }
  // ============================ CTA GSAP Animation End ============================

  // ======================== Gallery Masonry Order Start ========================
  function initializeGalleryMasonry() {
    const grid = document.querySelector('.gallery__grid');

    if (!grid) return;

    let activeColumnCount = 0;
    let resizeTimer;

    Array.from(grid.querySelectorAll('.gallery__item')).forEach(function (item, index) {
      item.dataset.galleryIndex = index;
    });

    function getColumnCount() {
      if (window.innerWidth < 480) return 1;
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1200) return 3;
      return 4;
    }

    function buildColumns() {
      const columnCount = getColumnCount();

      if (columnCount === activeColumnCount) return;

      const items = Array.from(grid.querySelectorAll('.gallery__item')).sort(function (a, b) {
        return Number(a.dataset.galleryIndex) - Number(b.dataset.galleryIndex);
      });
      const fragment = document.createDocumentFragment();
      const columns = [];

      grid.replaceChildren();

      for (let index = 0; index < columnCount; index += 1) {
        const column = document.createElement('div');
        column.className = 'gallery__column';
        columns.push(column);
        fragment.appendChild(column);
      }

      items.forEach(function (item, index) {
        columns[index % columnCount].appendChild(item);
      });

      grid.appendChild(fragment);
      activeColumnCount = columnCount;
    }

    buildColumns();

    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildColumns, 150);
    });
  }
  // ========================= Gallery Masonry Order End =========================

  // ======================== Gallery GSAP Animation Start ========================
  function initializeGalleryGsapAnimation() {
    if (
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const items = gsap.utils.toArray('.gallery__item');

    if (!items.length) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(items, {
      y: 65,
      scale: 0.94,
      autoAlpha: 0,
      filter: 'blur(6px)',
    });

    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility,filter',
          overwrite: true,
        });
      },
    });
  }
  // ========================= Gallery GSAP Animation End =========================

  // ====================== Section Heading GSAP Animation Start ======================
  function initializeSectionHeadingGsapAnimation() {
    const headings = document.querySelectorAll('.section-heading__title');

    if (
      !headings.length ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    headings.forEach(function (heading) {
      const sectionHeading = heading.closest('.section-heading');

      if (sectionHeading && sectionHeading.classList.contains('section-heading--static')) {
        return;
      }

      const description = sectionHeading
        ? sectionHeading.querySelector('.section-heading__desc')
        : null;

      if (typeof SplitText === 'undefined') {
        gsap.fromTo(
          heading,
          { y: 65, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power4.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: sectionHeading || heading,
              start: 'top 84%',
              once: true,
            },
          }
        );
        return;
      }

      SplitText.create(heading, {
        type: 'lines,words',
        linesClass: 'section-heading__line',
        wordsClass: 'section-heading__word',
        mask: 'lines',
        autoSplit: true,
        onSplit: function (split) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionHeading || heading,
              start: 'top 84%',
              once: true,
            },
          });

          timeline.fromTo(
            split.words,
            {
              yPercent: 120,
              rotate: 5,
              autoAlpha: 0,
              filter: 'blur(8px)',
              transformOrigin: 'left bottom',
            },
            {
              yPercent: 0,
              rotate: 0,
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: 0.95,
              stagger: 0.075,
              ease: 'power4.out',
              clearProps: 'transform,opacity,visibility,filter',
            }
          );

          if (description && description.textContent.trim()) {
            timeline.fromTo(
              description,
              { y: 24, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.55,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility',
              },
              '-=0.45'
            );
          }

          return timeline;
        },
      });
    });
  }
  // ======================= Section Heading GSAP Animation End =======================


  // ========================= Header Sticky Js Start ==============
  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= 300) {
      $('.header__area').addClass('fixed-header');
    } else {
      $('.header__area').removeClass('fixed-header');
    }
  });
  // ========================= Header Sticky Js End===================


  //============================ Offcanvas Js Start ============================
  $(document).on('click', '.menu__open', function () {
    $('.offcanvas__area, .overlay').addClass('active');
  });

  $(document).on('click', '.menu__close, .overlay', function () {
    $('.offcanvas__area, .overlay').removeClass('active');
  });

  //============================ Offcanvas Js End ==============================


  // ========================== Add Attribute For Bg Image Js Start =====================
  $('.bg--img').css('background-image', function () {
    var bg = 'url(' + $(this).data('background-image') + ')';
    return bg;
  });
  // ========================== Add Attribute For Bg Image Js End =====================


  // ========================= Odometer Js Start ===================
  if ($('.odometer').length > 0) {
    $(window).on('scroll', function () {
      $('.odometer').each(function () {
        if ($(this).isInViewport()) {
          if (!$(this).data('odometer-started')) {
            $(this).data('odometer-started', true);
            this.innerHTML = $(this).data('odometer-final');
          }
        }
      });
    });
  }
  // isInViewport helper function
  $.fn.isInViewport = function () {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };
  // ========================= Odometer Js End ===================


  // ========================= Magnific Popup Js Start ===================
  $('.promo__video__play').magnificPopup({
    type: 'iframe',
  });

  if ($('.gallery__grid').length) {
    $('.gallery__grid').magnificPopup({
      delegate: '.gallery__item',
      type: 'image',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 2],
      },
      image: {
        titleSrc: function (item) {
          return item.el.find('img').attr('alt');
        },
      },
      removalDelay: 250,
      mainClass: 'mfp-fade',
    });
  }
  // ========================= Magnific Popup Js End ===================


  // ========================= Testimonial Swiper Js Start =====================
  const swiperTestimonials = new Swiper('.slider__class', {
    loop: true,
    speed: 1000,
    spaceBeteen: 32,
    grabCursor: true,
    effect: 'creative',
    creativeEffect: {
      prev: {
        scale: ['0.9'],
        opacity: 0,
      },
      next: {
        scale: ['0.9'],
        opacity: 0,
      },
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
  // ========================= Testimonial Swiper Js End =====================


  // ========================= Select2 Js Start =====================
  if ($('.select2').length) {
    $('.select2').select2();
  }
  // ========================= Select2 Js End =====================


  // ========================= Show Hide Password Js Start ===================
  if ($('.password-show-hide').length) {
    $('.password-show-hide').each(function () {
      $(this).on('click', function () {
        let inputField = $(this).closest('.password__field').find('input');
        let openEye = $(this).find('.open-eye-icon');
        let closeEye = $(this).find('.close-eye-icon');

        if (inputField.attr('type') === "password") {
          inputField.attr('type', 'text');
          openEye.show();
          closeEye.hide();
        } else {
          inputField.attr('type', 'password');
          openEye.hide();
          closeEye.show();
        }
      });
    });
  }
  // ========================= Show Hide Password Js End ===================


  // ========================= Scroll Reveal Js Start ===================
  const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1500,
    delay: 100,
    reset: false,
  })

  sr.reveal('.class__name', {
    delay: 100,
   
    origin: 'bottom',
  })
  sr.reveal('.hobbies__mockup', {
    delay: 100,  
    origin: 'bottom',
  })
  // ========================= Scroll Reveal Js End ===================


  // ========================== Table Data Label Js Start =====================
  Array.from(document.querySelectorAll('table')).forEach(table => {
    let heading = table.querySelectorAll('thead tr th');
    Array.from(table.querySelectorAll('tbody tr')).forEach((row) => {
      let columArray = Array.from(row.querySelectorAll('td'));
      if (columArray.length <= 1) return;
      columArray.forEach((colum, i) => {
        colum.setAttribute('data-label', heading[i].innerText)
      });
    });
  });
  // ========================== Table Data Label Js End =====================


  // ========================== Label Required Js Start =====================
  $.each($('input, select, textarea'), function (i, element) {
    if (element.hasAttribute('required')) {
      $(element).closest('.form-group').find('label').first().addClass('required');
    }
  });
  // ========================== Label Required Js End =====================

  // ========================= Preloader Js Start =====================
  $(window).on("load", function () {
    const preloader = $(".preloader");
    const minimumDisplayTime = 1800;
    const elapsedTime = performance.now();
    const remainingTime = Math.max(minimumDisplayTime - elapsedTime, 0);

    setTimeout(function () {
      preloader.addClass("is-loaded");

      if (typeof initializeBannerGsapAnimation === 'function') {
        initializeBannerGsapAnimation();
      }

      setTimeout(function () {
        preloader.remove();

        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 600);
    }, remainingTime);
  })
  // ========================= Preloader Js End=====================

})(jQuery);
