const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-card/50 border-t border-border mt-16">
      <div className="container mx-auto text-center text-text/70">
        <p className="mb-2 font-display">
          3PWeb - Sculpting Digital Futures
        </p>
        <p className="text-sm">
          &copy; {currentYear} 3PWeb. All rights reserved. Pioneering AI & Web3 Marketing Solutions from Dubai to the Globe.
        </p>
        {/* Add newsletter signup and social media links here later as per wireframes */}
      </div>
    </footer>
  );
};

export default Footer;

