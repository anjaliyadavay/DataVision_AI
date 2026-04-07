const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} <strong>DataVision AI</strong>. All rights reserved.
        </p>

        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
