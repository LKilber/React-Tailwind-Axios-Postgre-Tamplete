import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-2 text-center text-xs">
      <div className="m-0 p-0">
        <p className="text-white">
          &copy; {new Date().getFullYear()} Preço&Risco. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
