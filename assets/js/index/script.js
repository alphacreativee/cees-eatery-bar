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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  headerMobile();
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
