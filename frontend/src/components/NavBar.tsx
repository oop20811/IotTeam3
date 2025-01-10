import React from 'react';
import Logo from '../assets/SIMPLAYLogo.svg';
import HomeIcon from '../assets/HomeIcon.svg';
import MenuIcon from '../assets/MenuIcon.svg';
import SignoutIcon from '../assets/SignoutIcon.svg';
function NavBar() {
  return (
    <>
      <div className="absolute left-0 top-0 flex items-center space-x-8 p-4">
        <button type="button">
          <img src={HomeIcon} alt="홈 아이콘" />
        </button>
        <button type="button" className="flex flex-row">
          <img src={MenuIcon} alt="메뉴 아이콘" />{' '}
          <p className="ml-4 rounded text-white">앨범 목록</p>
        </button>
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 transform p-4">
        <img src={Logo} alt="로고" />
      </div>
      <div className="absolute right-0 top-0 flex items-center p-4">
        <button type="button" className="flex flex-row">
          <img src={SignoutIcon} alt="메뉴 아이콘" />{' '}
          <p className="ml-4 rounded text-white">로그아웃</p>
        </button>
      </div>{' '}
    </>
  );
}

export default NavBar;
