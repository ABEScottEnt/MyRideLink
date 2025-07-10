import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <span className="footer-text">
      &copy; {new Date().getFullYear()} AbeScott Enterprises. All rights
      reserved.
    </span>
  </footer>
);

export default Footer;
