'use client';

/**
 * Main Header component
 * Handles responsive layout for different screen sizes.
 * 
 * @returns {JSX.Element} The rendered header.
 */

import React from 'react';
import HeaderDesktop from './HeaderDesktop';
import HeaderTablet from './HeaderTablet';
import HeaderMobile from './HeaderMobile';
import USABanner from './USABanner';

const Header = () => (
  <div>
    <USABanner />
    <div className="hidden header-xl:block">
      <HeaderDesktop />
    </div>
    <div className="hidden md:block header-xl:hidden">
      <HeaderTablet />
    </div>
    <div className="block md:hidden">
      <HeaderMobile />
    </div>
  </div>
);

export default Header;
