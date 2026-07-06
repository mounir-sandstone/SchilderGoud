(function () {
  'use strict';

  function pushDataLayerEvent(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  window.pushDataLayerEvent = window.pushDataLayerEvent || pushDataLayerEvent;

  function pageType() {
    var context = (window.dataLayer || []).find(function (item) { return item && item.event === 'page_context'; });
    return context && context.page_type ? context.page_type : 'unknown';
  }

  function cleanDestination(element) {
    var destination = element.getAttribute('data-cta-destination') || element.getAttribute('href') || '';
    if (destination.indexOf('tel:') === 0) return 'tel';
    if (destination.indexOf('mailto:') === 0) return 'mailto';
    if (destination.indexOf(window.location.origin) === 0) return destination.replace(window.location.origin, '');
    return destination;
  }

  document.addEventListener('click', function (event) {
    var tracked = event.target.closest('[data-track]');
    if (!tracked) return;
    var trackType = tracked.getAttribute('data-track');

    if (trackType === 'cta') {
      pushDataLayerEvent({
        event: 'cta_click',
        cta_name: tracked.getAttribute('data-cta-name') || tracked.textContent.trim(),
        cta_location: tracked.getAttribute('data-cta-location') || 'unknown',
        cta_destination: cleanDestination(tracked),
        page_type: pageType()
      });
    }

    if (trackType === 'phone') {
      pushDataLayerEvent({
        event: 'contact_click',
        contact_method: 'phone',
        contact_location: tracked.getAttribute('data-contact-location') || 'unknown',
        page_type: pageType()
      });
    }

    if (trackType === 'email') {
      pushDataLayerEvent({
        event: 'contact_click',
        contact_method: 'email',
        contact_location: tracked.getAttribute('data-contact-location') || 'unknown',
        page_type: pageType()
      });
    }

    if (trackType === 'service' || trackType === 'project') {
      pushDataLayerEvent({
        event: 'content_card_click',
        content_type: trackType,
        content_name: tracked.getAttribute('data-content-name') || tracked.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
        content_location: tracked.getAttribute('data-content-location') || 'unknown'
      });
    }

    if (trackType === 'review') {
      pushDataLayerEvent({
        event: 'review_link_click',
        review_source: 'google',
        page_type: pageType()
      });
    }
  });

  document.querySelectorAll('[data-track-form="quote"]').forEach(function (form) {
    var started = false;
    var submitting = false;
    var formLocation = form.getAttribute('data-form-location') || 'unknown';
    var photos = form.querySelector('input[type="file"]');

    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      pushDataLayerEvent({ event: 'quote_form_start', form_name: 'offerte_aanvraag', form_location: formLocation });
    }, { once: true });

    form.addEventListener('change', function () {
      if (started) return;
      started = true;
      pushDataLayerEvent({ event: 'quote_form_start', form_name: 'offerte_aanvraag', form_location: formLocation });
    }, { once: true });

    if (photos) {
      photos.addEventListener('change', function () {
        pushDataLayerEvent({
          event: 'quote_form_photo_selected',
          form_name: 'offerte_aanvraag',
          file_count: photos.files ? photos.files.length : 0,
          form_location: formLocation
        });
      });
    }

    form.addEventListener('submit', function () {
      if (submitting || !form.checkValidity()) return;
      submitting = true;
      pushDataLayerEvent({ event: 'quote_form_submit', form_name: 'offerte_aanvraag', form_location: formLocation });
      setTimeout(function () { submitting = false; }, 2000);
    }, true);
  });

  document.querySelectorAll('[data-track-before-after]').forEach(function (slider) {
    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      pushDataLayerEvent({
        event: 'before_after_interaction',
        project_name: slider.getAttribute('data-project-name') || 'Voor en na schilderwerk',
        page_type: pageType()
      });
    }
    slider.addEventListener('mousemove', fire, { once: true });
    slider.addEventListener('touchmove', fire, { once: true, passive: true });
    slider.addEventListener('keydown', fire, { once: true });
  });

  document.addEventListener('quote_form_success', function (event) {
    pushDataLayerEvent({
      event: 'generate_lead',
      lead_type: 'quote_request',
      form_name: 'offerte_aanvraag',
      form_location: event.detail && event.detail.form_location ? event.detail.form_location : 'unknown'
    });
  });

  document.addEventListener('quote_form_error', function (event) {
    pushDataLayerEvent({
      event: 'quote_form_error',
      form_name: 'offerte_aanvraag',
      form_location: event.detail && event.detail.form_location ? event.detail.form_location : 'unknown',
      error_type: 'submission_error'
    });
  });
})();
