import '../styles/styles.css';
import MobileMenu from './modules/MobileMenu';
import StickyHeader from './modules/StickyHeader';
import RevealOnScroll from './modules/revealOnScroll';

let stickyHeader = new StickyHeader();

new RevealOnScroll(document.querySelectorAll('.feature-item'), 85);
new RevealOnScroll(document.querySelectorAll('.testimonial'), 70);

let mobileMenu = new MobileMenu();

if (module.hot) {
  module.hot.accept();
}
