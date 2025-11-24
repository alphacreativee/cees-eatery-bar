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
  });
  menuOverlay.addEventListener("click", function () {
    headerMenuMobile.classList.remove("active");
  });
  menuItems.forEach((item) => {
    const submenu = item.querySelector(".sub-menu");

    if (!item.classList.contains("active")) {
      submenu.style.height = "0px";
    }

    item.addEventListener("click", function (e) {
      e.preventDefault();

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
    slidesPerView: 3,
    spaceBetween: 30,
    navigation: {
      nextEl: ".offer-list .swiper-button-next",
      prevEl: ".offer-list .swiper-button-prev",
    },
  });
}
function getDate() {
  if (!document.querySelector("#date")) return;
  var picker = new Lightpick({ field: document.getElementById("date") });
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

        if (isSelectType) {
          // Logic cho dropdown-custom-select
          const optionText = item.textContent;
          displayText.textContent = optionText;
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
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  headerMobile();
  swiperOffer();
  getDate();
  customDropdown();
  fieldSuggestion();
  initStickyBar();
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
