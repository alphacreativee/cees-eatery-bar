import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;
// setup lenis
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
// end lenis
function headerMobile() {
  if (window.innerWidth > 991) return;
  const btnHambuger = document.getElementById("btn-hambuger");
  const headerMenuMobile = document.querySelector(".header-menu-mobile");
  const menuItems = document.querySelectorAll(".menu-item-has-children");
  const menuOverlay = document.querySelector(".menu-mobile-overlay");
  btnHambuger.addEventListener("click", function () {
    headerMenuMobile.classList.toggle("active");
    btnHambuger.classList.toggle("active");
  });
  menuOverlay.addEventListener("click", function () {
    headerMenuMobile.classList.remove("active");
    btnHambuger.classList.remove("active");
  });
  menuItems.forEach((item) => {
    const submenu = item.querySelector(".sub-menu");

    if (!item.classList.contains("active")) {
      submenu.style.height = "0px";
    }

    item.addEventListener("click", function (e) {
      // e.preventDefault();

      const isActive = this.classList.contains("active");

      // Đóng tất cả menu khác trước
      menuItems.forEach((otherItem) => {
        if (otherItem !== this) {
          otherItem.classList.remove("active");
          const otherSubmenu = otherItem.querySelector(".sub-menu");
          otherSubmenu.style.height = otherSubmenu.scrollHeight + "px";
          otherSubmenu.offsetHeight;
          otherSubmenu.style.height = "0px";
        }
      });

      this.classList.toggle("active");

      if (!isActive) {
        // Mở menu hiện tại
        submenu.style.height = submenu.scrollHeight + "px";

        submenu.addEventListener("transitionend", function handler() {
          if (item.classList.contains("active")) {
            submenu.style.height = "auto";
          }
          submenu.removeEventListener("transitionend", handler);
        });
      } else {
        // Đóng menu hiện tại
        submenu.style.height = submenu.scrollHeight + "px";
        submenu.offsetHeight;
        submenu.style.height = "0px";
      }
    });
  });
}
function swiperOffer() {
  if (!document.querySelector(".swiper-offer")) return;
  var swiper = new Swiper(".swiper-offer", {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".offer-list .swiper-button-next",
      prevEl: ".offer-list .swiper-button-prev",
    },
    breakpoints: {
      991: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
}
function getDate() {
  if (!document.querySelector("#date")) return;

  const tomorrow = moment().add(1, "day");

  var picker = new Lightpick({
    field: document.getElementById("date"),
    singleDate: true,
    minDate: tomorrow,

    onSelect: function (date) {
      if (!date) return;

      const formatted = date.format("DD-MM-YYYY");
      document.querySelector('input[name="form_date"]').value = formatted;
    },
  });
}
function customDropdown() {
  const dropdowns = document.querySelectorAll(
    ".dropdown-custom, .dropdown-custom-select"
  );

  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");
    const displayText = dropdown.querySelector(".dropdown-custom-text");

    // Kiểm tra loại dropdown
    const isSelectType = dropdown.classList.contains("dropdown-custom-select");

    // Toggle dropdown on button click
    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    // Handle item selection
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        const thisItem = $(this);

        if (isSelectType) {
          // Logic cho dropdown-custom-select
          const optionText = item.textContent;
          displayText.textContent = optionText;

          if (thisItem.attr("data-value")) {
            displayText.textContent = optionText;

            // Sửa: gắn data-value vào dropdown, không gắn vào span
            dropdown.setAttribute("data-value", thisItem.attr("data-value"));
          }

          dropdown.classList.add("selected");
        } else {
          // Logic cho dropdown-custom
          const currentImgEl = valueSelect.querySelector("img");
          const currentImg = currentImgEl ? currentImgEl.src : "";
          const currentText = valueSelect.querySelector("span").textContent;
          const clickedHtml = item.innerHTML;

          valueSelect.innerHTML = clickedHtml;

          const isSelectTime = currentText.trim() === "Time";

          if (!isSelectTime) {
            if (currentImg) {
              item.innerHTML = `<span>${currentText}</span><img src="${currentImg}" alt="" />`;
            } else {
              item.innerHTML = `<span>${currentText}</span>`;
            }
          }
        }

        closeAllDropdowns();
      });
    });

    // Close dropdown on scroll
    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}
function fieldSuggestion() {
  // Normalize string: remove Vietnamese accents
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  // When input is focused
  $(".field-suggestion input").on("focus", function () {
    const $list = $(this).siblings(".field-suggestion__list");

    $(".field-suggestion__list").addClass("hidden");

    $list.removeClass("hidden");
    filterList($list, ""); // show all items
  });

  $(".field-suggestion input").on("input", function () {
    const value = removeVietnameseTones($(this).val().toLowerCase());
    const $list = $(this).siblings(".field-suggestion__list");
    filterList($list, value);
    $list.removeClass("hidden");
  });

  $(".field-suggestion").on("click", "li", function () {
    const text = $(this).text();
    const $input = $(this).closest(".field-suggestion").find("input");
    $input.val(text);
    $(this).parent().addClass("hidden");
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".field-suggestion").length) {
      $(".field-suggestion__list").addClass("hidden");
    }
  });

  function filterList($list, value) {
    $list.find("li").each(function () {
      const text = $(this).text().toLowerCase();
      const normalizedText = removeVietnameseTones(text);
      $(this).toggle(normalizedText.includes(value));
    });
  }
}
function initStickyBar() {
  const formSearch = document.querySelector(".form-search-bar");
  if (!formSearch) return;

  gsap.to(formSearch, {
    scrollTrigger: {
      trigger: formSearch,
      start: "top center",
      end: "+=500",
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const newTop = gsap.utils.interpolate(
          window.innerHeight / 2 - formSearch.offsetHeight / 2,
          106,
          progress
        );
        formSearch.style.top = newTop + "px";
      },
    },
  });
}
function CTAMobile() {
  if (window.innerWidth > 992) return;

  const ctaMobile = document.getElementById("cta-mobile");
  const footer = document.querySelector("footer");

  if (!ctaMobile || !footer) return;

  let isInFooter = false;

  ScrollTrigger.create({
    trigger: footer,
    start: "top bottom",
    end: "bottom bottom",
    // markers: true,
    onEnter: () => {
      isInFooter = true;
      ctaMobile.classList.add("hidden");
    },
    onLeaveBack: () => {
      isInFooter = false;
      ctaMobile.classList.remove("hidden");
    },
  });

  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      // Chỉ xử lý khi KHÔNG ở trong footer
      if (!isInFooter) {
        if (self.direction === 1) {
          ctaMobile.classList.add("hidden");
        } else if (self.direction === -1) {
          ctaMobile.classList.remove("hidden");
        }
      }
    },
  });
}
function handlePageVisibilityAndFavicon() {
  const originalTitle = document.title;
  let faviconInterval;
  let isBlinking = false;

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      document.title = "Cee's Restaurant & Bar";
      startFaviconBlinking();
    } else {
      document.title = originalTitle;
      stopFaviconBlinking();
    }
  });

  function changeFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml"; // Thêm MIME type cho SVG
      document.head.appendChild(link);
    }
    link.href = `${src}?v=${new Date().getTime()}`;
  }

  function startFaviconBlinking() {
    if (isBlinking) return; // Tránh chạy nhiều interval

    isBlinking = true;
    const hostname = window.location.origin;

    const favicons = [
      `${hostname}/wp-content/themes/cees/assets/images/icon/favicon-black.svg`,
      `${hostname}/wp-content/themes/cees/assets/images/icon/favicon-gray.svg`,
    ];
    // const favicons = [
    //   "./assets/images/icon/favicon-black.svg",
    //   "./assets/images/icon/favicon-gray.svg",
    // ];
    let faviconIndex = 0;

    faviconInterval = setInterval(() => {
      changeFavicon(favicons[faviconIndex]);
      faviconIndex = (faviconIndex + 1) % favicons.length;
    }, 500);
  }

  function stopFaviconBlinking(assestUrl) {
    clearInterval(faviconInterval);
    isBlinking = false;
    const hostname = window.location.origin;
    changeFavicon(
      `${hostname}/wp-content/themes/cees/assets/images/icon/favicon-black.svg`
    );
    // changeFavicon("./assets/images/icon/favicon-black.svg");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  handlePageVisibilityAndFavicon();
});

function formReservation() {
  const $form = $(".reservation-form form");
  if ($form.length < 1) return;

  $form.on("submit", function (e) {
    e.preventDefault();

    // --- Inputs ---
    const $inputName = $form.find("input[name='fullname']");
    const $inputPhone = $form.find("input[name='phone']");
    const $inputEmail = $form.find("input[name='email']");
    const $inputGuest = $form.find("input[name='guest']");
    const $buttonSubmit = $form.find("button[type='submit']");
    const emailRecipient = $buttonSubmit.attr("email-recipient");

    // --- Remove old errors/messages ---
    $form.find(".input-wrapper").removeClass("error");
    $form.find(".contact-message").remove();

    let isValid = true;

    // --- Validate text inputs ---
    if ($inputName.val().trim() === "") {
      $inputName.closest(".input-wrapper").addClass("error");
      isValid = false;
    }
    if ($inputPhone.val().trim() === "") {
      $inputPhone.closest(".input-wrapper").addClass("error");
      isValid = false;
    }
    if ($inputEmail.val().trim() === "") {
      $inputEmail.closest(".input-wrapper").addClass("error");
      isValid = false;
    }
    if (!$inputGuest.val() || $inputGuest.val().trim() === "") {
      $inputGuest.closest(".input-wrapper").addClass("error");
      isValid = false;
    }

    // --- Validate dropdowns ---
    function validateSelect(wrapperSelector) {
      const $wrapper = $form.find(wrapperSelector);
      const $selected = $wrapper.find(".dropdown-custom-select.selected");

      if ($selected.length < 1) {
        $wrapper.addClass("error");
        return false;
      }

      return true;
    }

    if (!validateSelect(".input-wrapper.time")) isValid = false;
    if (!validateSelect(".input-wrapper.select-event")) isValid = false;

    if (!isValid) return;

    // --- Prepare FormData ---
    const formData = new FormData();
    formData.append("action", "submit_reservation_form");
    formData.append("name", $inputName.val().trim());
    formData.append("phone", $inputPhone.val().trim());
    formData.append("email", $inputEmail.val().trim());
    formData.append("guest", $inputGuest.val().trim());

    formData.append(
      "time",
      $form
        .find(
          ".input-wrapper.time .dropdown-custom-select.selected .dropdown-custom-text"
        )
        .text()
        .trim()
    );

    formData.append(
      "event",
      $form
        .find(
          ".input-wrapper.select-event .dropdown-custom-select.selected .dropdown-custom-text"
        )
        .text()
        .trim()
    );

    formData.append(
      "email_recipient",
      emailRecipient ? emailRecipient.trim() : ""
    );

    // --- Ajax submit ---
    $.ajax({
      url: ajaxUrl,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,

      beforeSend: function () {
        $buttonSubmit.addClass("aloading");
      },

      success: function (res) {
        $form[0].reset();
        $buttonSubmit.removeClass("aloading");
        $("#modalSuccess").modal("show");
      },

      error: function () {
        $form.append(
          '<span class="contact-message body-sm-regular d-block" style="color:#F00;margin-top: 10px;">Something went wrong. Please try again later.</span>'
        );
        $buttonSubmit.removeClass("aloading");
      },
    });
  });
}

function uploadPdf() {
  const $uploadNote = $("form").find(".pdf-note");
  const originalNoteText = $uploadNote.text();

  $("input[name='upload']").on("change", function () {
    const file = this.files[0];
    const $input = $(this);
    const $labelSpan = $input.siblings(".text-file");
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const maxSize = 5 * 1024 * 1024;

    function truncateText(text, maxLength) {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    function formatFileName(name) {
      const lower = name.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    $input.removeClass("error");
    $labelSpan.text("Upload file under 5MB");

    if ($uploadNote) {
      $uploadNote.text(originalNoteText);
    }

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      $input.addClass("error");
      $input.val("");

      if ($uploadNote) {
        $uploadNote.text("Only PDF/DOC/DOCX/JPG/PNG files allowed");
      }

      return;
    }

    if (file.size > maxSize) {
      $input.addClass("error");
      $input.val("");

      if ($uploadNote) {
        $uploadNote.text("File too large (max 5MB)");
      }

      return;
    }

    const formattedName = formatFileName(truncateText(file.name, 35));
    $labelSpan.text(formattedName);
    $labelSpan.addClass("has-file");
  });
}

function formReruitment() {
  const $form = $("#formReruitment");
  if ($form.length < 1) return;

  $form.on("submit", function (e) {
    e.preventDefault();

    const $inputName = $form.find("input[name='fullname']");
    const $inputPhone = $form.find("input[name='phone']");
    const $inputEmail = $form.find("input[name='email']");
    const $inputFile = $form.find("input[type='file']");
    const $message = $form.find("textarea[name='note']");
    const $buttonSubmit = $form.find("button[type='submit']");
    const jobId = $buttonSubmit.attr("job-id");
    const emailRecipient = $buttonSubmit.attr("email-recipient");

    // Remove old errors + old message
    $form.find(".field-item").removeClass("error");
    $form.find(".contact-message").remove();

    let isValid = true;

    // Validate
    if ($inputName.val().trim() === "") {
      $inputName.closest(".form-row").addClass("error");
      isValid = false;
    }

    if ($inputPhone.val().trim() === "") {
      $inputPhone.closest(".form-row").addClass("error");
      isValid = false;
    }

    if ($inputEmail.val().trim() === "") {
      $inputEmail.closest(".form-row").addClass("error");
      isValid = false;
    }

    // if ($inputFile.get(0).files.length === 0) {
    //   $inputFile.closest(".field-item").addClass("error");
    //   isValid = false;
    // }

    if (!isValid) return;

    // Prepare data
    const formData = new FormData();
    formData.append("action", "submit_recruitment_form");
    formData.append("name", $inputName.val().trim());
    formData.append("phone", $inputPhone.val().trim());
    formData.append("email", $inputEmail.val().trim());
    formData.append("file", $inputFile.get(0).files[0]);
    formData.append("message", $message.val().trim());
    formData.append("job_id", jobId);
    formData.append("email_recipient", emailRecipient.trim());

    $.ajax({
      url: ajaxUrl,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,

      beforeSend: function () {
        $buttonSubmit.addClass("aloading");
      },

      success: function (res) {
        $form[0].reset();

        // Reset label upload
        const $labelSpan = $form.find(".up-file .text-file").text("");

        $buttonSubmit.removeClass("aloading");

        $("#modalSuccess").modal("show");
      },

      error: function () {
        $form.append(
          '<span class="contact-message body-sm-regular" style="color:#F00;">Có lỗi xảy ra, vui lòng thử lại sau.</span>'
        );
        $buttonSubmit.removeClass("aloading");
      },
    });
  });
}

function searchReruitment() {
  function loadCareerResults(paged = 1) {
    let $form = $("#formSearchCareer");
    let $button = $form.find('button[type="submit"]');

    let data = {
      action: "filter_career",
      career_title: $form.find('input[name="career_title"]').val(),
      job_type:
        $form
          .find(".form-item.time .dropdown-custom-select")
          .attr("data-value") || "",
      service:
        $form
          .find(".form-item.service .dropdown-custom-select")
          .attr("data-value") || "",
      paged: paged,
    };

    console.log($form.find(".form-item.service .dropdown-custom-select"));

    $.ajax({
      url: ajaxUrl,
      type: "POST",
      data: data,
      beforeSend: function () {
        $button.addClass("aloading");
      },
      success: function (res) {
        if (res.success) {
          $(".result-form-wrapper").html(res.data.html);
          $(".pagination").html(res.data.pagination);
        }
        $button.removeClass("aloading");
      },
      error: function () {
        alert("Có lỗi xảy ra, vui lòng thử lại.");
        $button.removeClass("aloading");
      },
    });
  }

  $("#formSearchCareer").on("submit", function (e) {
    e.preventDefault();
    loadCareerResults(1);
  });

  $(document).on("click", ".pagination a.page-number", function (e) {
    e.preventDefault();
    let page = $(this).data("page");
    loadCareerResults(page);
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  headerMobile();
  swiperOffer();
  getDate();
  customDropdown();
  fieldSuggestion();
  initStickyBar();
  CTAMobile();
  formReservation();
  uploadPdf();
  formReruitment();
  searchReruitment();
};
preloadImages("img").then(() => {
  init();
});

// loadpage
let isLinkClicked = false;
$("a").on("click", function (e) {
  // Nếu liên kết dẫn đến trang khác (không phải hash link hoặc javascript void)
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
    console.log("1");
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
