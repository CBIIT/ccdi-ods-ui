'use client';

/**
 * Main Footer component
 * Handles responsive layout for different screen sizes.
 * 
 * @returns {JSX.Element} The rendered footer.
 */

import React from 'react';
import FooterDesktop from './FooterDesktop';
import FooterTablet from './FooterTablet';
import FooterMobile from './FooterMobile';

/**
 * Main Footer component that handles responsive layout for different screen sizes
 * Similar to the Header, it switches between Desktop, Tablet, and Mobile views
 * based on viewport width using Tailwind's responsive classes
 * 
 * The component uses utility classes to show/hide appropriate versions:
 * - Desktop: lg:block (>= 1024px)
 * - Tablet: md:block (>= 768px and < 1024px)
 * - Mobile: block (< 768px)
 */
const Footer = () => (
  <div className="lg:block lg:[&_.desktop]:block lg:[&_.tablet]:hidden lg:[&_.mobile]:hidden md:block md:[&_.desktop]:hidden md:[&_.tablet]:block md:[&_.mobile]:hidden [&_.desktop]:hidden [&_.tablet]:hidden [&_.mobile]:block">
    <div className="desktop">
      <FooterDesktop />
    </div>
    <div className="tablet">
      <FooterTablet />
    </div>
    <div className="mobile">
      <FooterMobile />
    </div>
  </div>
);

export default Footer;
