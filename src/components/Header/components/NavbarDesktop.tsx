'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getGithubBranch } from '@/config/config';
import { usePathname } from 'next/navigation';

const branch = getGithubBranch();
const LANDING_CONFIG_URL = `https://raw.githubusercontent.com/CBIIT/ccdi-ods-content/${branch}/config/navigation.json`;

interface NavItem {
  name: string;
  link: string;
  external?: boolean;
  id: string;
  className: string;
  text?: string;
}

interface NavigationData {
  navList: NavItem[];
  navbarSublists: {
    [key: string]: NavItem[];
  };
}

const NavBar = () => {
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [clickedTitle, setClickedTitle] = useState<string>("");
  const dropdownSelection = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await fetch(
          LANDING_CONFIG_URL,
          {
             headers: {
        'Accept': 'application/json',
      }
      }
    );
        const data = await response.json();
        setNavigationData(data);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchNavigationData();
  }, []);

  const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        // Check if click is on a navbar item
        let el = event.target as HTMLElement | null;
        let clickedNavbarItem = false;
        while (el) {
          if (el.classList && el.classList.contains('navbar-item')) {
            clickedNavbarItem = true;
            break;
          }
          el = el.parentElement;
        }
        if (!clickedNavbarItem) {
          setClickedTitle("");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

  useOutsideAlerter(dropdownSelection);

  if (!navigationData) {
    return <div className="relative w-full bg-white shadow-md z-[1100]"><div className="mx-auto max-w-[1400px] text-left relative flex justify-between items-end">Loading...</div></div>;
  }

  const clickableObject = navigationData.navList.filter((item) => item.className === 'navMobileItem clickable');
  const clickableTitle = clickableObject.map((item) => item.name);

  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.innerText === clickedTitle || !clickableTitle.includes(target.innerText)) {
      setClickedTitle("");
    } else {
      setClickedTitle(target.innerText);
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleMenuClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  function shouldBeUnderlined(item: NavItem): boolean {
    const linkName = item.name;
    const correctPath = pathname || '';
    if (item.className === "navMobileItem") {
      return correctPath === item.link || correctPath === item.link + '/'
    }
    if (!(linkName in (navigationData as NavigationData).navbarSublists)) {
      return false;
    }
    const linkNames = navigationData!.navbarSublists[linkName].map(e => e.link);
    return linkNames.includes(correctPath) || linkNames.some(link => correctPath.startsWith(link));
  }

  const renderSubmenuRows = (items: NavItem[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 4) {
      const rowItems = items.slice(i, Math.min(i + 4, items.length));
      rows.push(rowItems);
    }
    return rows;
  };

  return (
    <div className="relative w-full bg-white shadow-md z-[1100]">
      <div className="mx-auto max-w-[1400px] text-left relative flex justify-between items-end">
        <ul className="list-none m-0 pt-[17px] pl-[11px]">
          {
            navigationData.navList.map((navMobileItem, idx) => {
              const navkey = `nav_${idx}`;
              return (
                navMobileItem.className === 'navMobileItem'
                  ? (
                    <li key={navkey} className="inline-block relative leading-[50px] tracking-[1px] text-center transition-all duration-300 ease-in-out">
                      <div className="block text-[#585C65] font-poppins text-[17px] font-bold leading-[40px] tracking-normal no-underline mx-[45px_0_0_5px] px-[15px] select-none border-t-4 border-l-4 border-r-4 border-transparent">
                        <Link href={navMobileItem.link} passHref>
                          <div
                            id={navMobileItem.id}
                            onKeyDown={onKeyPressHandler}
                            role="button"
                            tabIndex={0}
                            className={`navbar-item cursor-pointer text-[#585C65] border-b-4 hover:text-[#007bbd] hover:border-b-[#007bbd]
                              ${shouldBeUnderlined(navMobileItem) ? "border-b-[#007bbd]" : "border-b-[#FFFFFF]"}
                            `}
                            onClick={handleMenuClick}
                          >
                            {navMobileItem.name}
                          </div>
                        </Link>
                      </div>
                    </li>
                  )
                  : (
                    <li key={navkey} className="inline-block relative leading-[50px] tracking-[1px] text-center transition-all duration-300 ease-in-out">
                      <div className={clickedTitle === navMobileItem.name ? 'block text-white font-poppins text-[17px] font-bold leading-[40px] tracking-normal no-underline mx-[45px_0_0_5px] px-[15px] select-none bg-[#004971] border-t-4 border-l-4 border-r-4 border-[#5786FF]' : 'block text-[#585C65] font-poppins text-[17px] font-bold leading-[40px] tracking-normal no-underline mx-[45px_0_0_5px] px-[15px] select-none border-t-4 border-l-4 border-r-4 border-transparent'}>
                        <div
                          id={navMobileItem.id}
                          onKeyDown={onKeyPressHandler}
                          role="button"
                          tabIndex={0}
                          className={`navbar-item cursor-pointer ${clickedTitle === navMobileItem.name ? 
                            'text-white bg-[#004971] border-b-4 border-b-[#004971] after:content-[""] after:inline-block after:w-[6px] after:h-[6px] after:border-t after:border-r after:border-white after:border-b-0 after:border-l-0 after:ml-2 after:mb-0 after:-rotate-45' : 
                            'text-[#585C65] hover:text-[#007bbd] hover:border-b-4 hover:border-b-[#007bbd] after:content-[""] after:inline-block after:w-[6px] after:h-[6px] after:border-b after:border-l after:border-[#585C65] after:ml-2 after:mb-1 after:-rotate-45 hover:after:border-[#298085]'
                          } ${shouldBeUnderlined(navMobileItem) ? "border-b-4 border-b-[#007bbd]" : ""}`}
                          onClick={handleMenuClick}
                        >
                          {navMobileItem.name}
                        </div>
                      </div>
                    </li>
                  )
              );
            })
          }
        </ul>
      </div>
      <div ref={dropdownSelection} className={`absolute top-[64.5px] left-0 w-full bg-[#004971] z-[1100] ${clickedTitle === '' ? "invisible" : ""}`}>
        <div className="mx-auto text-left relative max-w-[1400px]">
          <div className="bg-[#004971] p-[32px_32px_0_32px]">
            {clickedTitle !== "" && renderSubmenuRows(navigationData.navbarSublists[clickedTitle]).map((row, rowIdx) => (
              <div key={`row_${rowIdx}`} className="grid grid-cols-4 gap-6 mb-8">
                {row.map((dropItem, idx) => (
                  dropItem.link && (
                    <Link
                      id={dropItem.id}
                      href={dropItem.link}
                      passHref
                      className="cursor-pointer text-left font-poppins font-semibold text-[20px] leading-[110%] text-white no-underline hover:underline"
                      key={`drop_${rowIdx}_${idx}`}
                      onClick={() => setClickedTitle("")}
                    >
                      {dropItem.name}
                      {dropItem.text && dropItem.text.trim() !== '' && (
                        <div className="mt-[5px] font-open-sans font-normal text-[16.16px] leading-[22px]">
                          {dropItem.text}
                        </div>
                      )}
                    </Link>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
