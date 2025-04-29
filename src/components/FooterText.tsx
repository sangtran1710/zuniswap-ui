import React from 'react';

const FooterText: React.FC = () => {
  return (
    <p className="text-gray-400 text-sm text-center">
      © {new Date().getFullYear()} ZuniSwap. All rights reserved.
    </p>
  );
};

export default FooterText; 