'use client';

import React, { JSX, useEffect, useMemo, useState } from 'react';
import { OverlayText } from '@/config/OverlayText';

/**
 * Provides the Government Usage Warning banner and related logic.
 * 
 * @returns The Government Usage banner component, which is conditionally rendered based on session storage.
 */
const OverlayWindow: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      window.sessionStorage.setItem('overlayLoad', 'true');
    }
  };

  const content = useMemo<JSX.Element[]>(() => 
    OverlayText.content.map((item) => (
      <p key={item.substring(0, 30)} className="text-[14px] text-black mb-[10px] last:mb-0">
        {item}
      </p>
    )
  ), []);

  const list = useMemo<JSX.Element[]>(() => 
    OverlayText.list.map((item) => (
      <li
        key={item.substring(0, 30)}
        className="text-[14px] pt-[3px] pl-[26px] flex items-start mt-[7px] first:-mt-[8px]"
        >
        <span className="mt-[7px] mr-[11px] inline-block h-[5.5px] w-[5.5px] min-w-[5.5px] rounded-full bg-black flex-shrink-0" />
        <span>{item}</span>
      </li>
    )
  ), []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.sessionStorage?.getItem('overlayLoad') !== 'true') {
      setOpen(true);
    }
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center font-['Roboto']"
      role="dialog"
      aria-labelledby="government-usage-dialog-title"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-[#00000047] pointer-events-none" />
      <div className="relative ml-[15px]">
        <div className="w-[770px] h-[620px] rounded-[5px] bg-white px-[20px] flex flex-col">
          <div className="py-[15px] pr-[15px] pl-0">
            <h2 id="government-usage-dialog-title" className="text-[22px] text-black font-medium leading-[1.6] tracking-[0.0075em]">
              Warning
            </h2>
          </div>
          <div className="h-px w-full bg-[#e0e0e0]" />
          <div className="pt-[20px] text-black text-[14px] flex-1 overflow-auto tracking-[0.00938em]">
            {content}
            <p className="text-[14px] text-[#000045] mb-[10px] -mt-[0.5px] tracking-[0.14994px]">
              {'By using this system, you understand and consent to the following: '}
            </p>
            <ul className="mt-0 pt-0 text-[14px] pr-[6px]">
              {list}
            </ul>
          </div>
          <div className="h-px w-full bg-[#e0e0e0]" />
          <div className="h-[75px] flex justify-end items-center pr-[10px] pt-[30px] pb-[25px]">
            <button
              type="button"
              onClick={handleClose}
              className="w-[133px] h-[35px] bg-[#337ab7] text-white normal-case hover:bg-[#2e6da4] rounded-[4px] font-medium font-['Roboto'] text-[0.875rem] leading-[1.6] tracking-[0.02857em]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlayWindow;
