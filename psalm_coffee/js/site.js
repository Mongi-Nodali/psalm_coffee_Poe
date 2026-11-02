$(function () {
  // Search and sort services on services.html.
  const $search = $("#service-search");
  const $results = $("#service-results");

  if ($search.length && $results.length) {
    const services = [
      "Sit-down",
      "Takeaway coffee and food",
      "Free Wi-Fi",
      "Venue hire",
      "Small events",
      "Bible studies",
      "Business meetings",
      "Christian product launches",
      "Small celebrations"
    ];

    const $sort = $("#service-sort");
    const $count = $("#service-count");
    const $empty = $("#service-empty");

    function renderServices() {
      const query = $search.val().trim().toLowerCase();
      const matches = services
        .filter(service => service.toLowerCase().includes(query))
        .sort((a, b) => a.localeCompare(b));

      if ($sort.val() === "za") {
        matches.reverse();
      }

      $results.empty();

      $.each(matches, function (_, service) {
        $("<li>").text(service).appendTo($results);
      });

      $count.text(
        matches.length +
        (matches.length === 1 ? " service" : " services") +
        " shown"
      );

      $empty.prop("hidden", matches.length > 0);
    }

    $search.on("input", renderServices);
    $sort.on("change", renderServices);
    renderServices();
  }

  // Open coffee photos in a lightbox on index.html.
  const $photos = $(".coffee-card img");

  if ($photos.length) {
    const $dialog = $(
      '<dialog class="lightbox" aria-label="Coffee photo viewer">' +
        '<button class="lightbox-close" type="button" aria-label="Close image">&times;</button>' +
        '<img alt=""><p></p>' +
      "</dialog>"
    ).appendTo("body");

    const dialog = $dialog[0];
    const $largePhoto = $dialog.find("img");
    const $caption = $dialog.find("p");

    $dialog.on("click", ".lightbox-close", function () {
      dialog.close();
    });

    $dialog.on("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    $photos.each(function () {
      const photo = this;
      const $photo = $(photo);

      $photo.attr({
        tabindex: "0",
        role: "button",
        "aria-label": "View " + photo.alt + " photo larger"
      });

      function openLightbox() {
        $largePhoto.attr({
          src: photo.src,
          alt: photo.alt
        });

        $caption.text(photo.alt);
        dialog.showModal();
      }

      $photo.on("click", openLightbox);

      $photo.on("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox();
        }
      });
    });
  }

  // Accordion on about.html.
  $(".value-toggle").on("click", function () {
    const $button = $(this);
    const wasExpanded = $button.attr("aria-expanded") === "true";

    $(".value-toggle").each(function () {
      const $otherButton = $(this);
      const panelId = $otherButton.attr("aria-controls");
      const $panel = $("#" + panelId);

      $otherButton.attr("aria-expanded", "false");
      $otherButton.find(".toggle-icon").text("+");

      $panel.stop(true, true).slideUp(220, function () {
        $panel.prop("hidden", true);
      });
    });

    if (!wasExpanded) {
      const panelId = $button.attr("aria-controls");
      const $panel = $("#" + panelId);

      $button.attr("aria-expanded", "true");
      $button.find(".toggle-icon").text("−");

      $panel
        .prop("hidden", false)
        .hide()
        .stop(true, true)
        .slideDown(220);
    }
  });

  // Send the Contact and Enquiry forms by AJAX.
  function connectForm(formId, statusId, successMessage) {
    const $form = $("#" + formId);
    const $status = $("#" + statusId);

    if (!$form.length) {
      return;
    }

    $form.on("submit", function (event) {
      event.preventDefault();

      const form = this;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const $submitButton = $form.find(":submit");

      $submitButton.prop("disabled", true);
      $status.text("Sending...");

      $.ajax({
        url: "https://formsubmit.co/ajax/monginodali@gmail.com",
        method: "POST",
        data: $form.serialize(),
        dataType: "json",
        headers: {
          Accept: "application/json"
        }
      })
      .done(function () {
        if (formId === "enquiry-form") {
          const service = form.elements.service.value;
          $status.text(
            "Your " + service +
            " enquiry was sent. The team will contact you to confirm availability and pricing."
          );
        } else {
          $status.text(successMessage);
        }

        form.reset();
      })
      .fail(function () {
        $status.text(
          "Sorry, the form could not be sent. Please try again or contact us by phone or email."
        );
      })
      .always(function () {
        $submitButton.prop("disabled", false);
      });
    });
  }

  connectForm(
    "contact-form",
    "contact-status",
    "Your message was sent to Psalm Coffee. Thank you for contacting us."
  );

  connectForm(
    "enquiry-form",
    "enquiry-status",
    ""
  );
});