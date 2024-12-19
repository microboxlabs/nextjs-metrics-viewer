const Footer = () => {
  return (
    <footer className="bg-primary py-6 text-center text-white shadow-inner">
      <p className="text-sm">
        © {new Date().getFullYear()} Metrics Dashboard. All rights reserved.
      </p>
      <p className="mt-2 text-xs text-tertiary">
        Crafted with ❤️ by MicroboxLabs Team.
      </p>
    </footer>
  );
};

export default Footer;
