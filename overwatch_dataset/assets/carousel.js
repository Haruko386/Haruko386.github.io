document.addEventListener("DOMContentLoaded", () => {
  bulmaCarousel.attach(".results-carousel", {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: false,
    pagination: true,
    navigation: true,
  });
});
