import React from 'react';
import image1 from '../images/image1.svg'
import image2 from '../images/image2.svg'

const Header = () => {
  return (
    <>
      <header className="header">
        <div className="header__logos"><div className="header__logo-container--left"><img src={image1} alt="UIDAI Logo" /></div><div className="header__logo-container--center">Unique Identification Authority of India</div><div className="header__logo-container--right"><img src={image2} alt="Aadhaar Logo" /></div></div>
      </header>
    </>
  );
};

export default Header;