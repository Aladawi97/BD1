import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const HeroSection = styled('section')({
  height: '700px',
  width: '90%',
  maxWidth: '1200px',
  position: 'relative',
  overflow: 'hidden',
  margin: '2rem auto',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  '@media (max-width: 768px)': {
    height: '500px',
    width: '95%',
    margin: '1rem auto',
  }
});

const HeroSlide = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&.active': {
    opacity: 1,
  }
});

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const HeroImageBackground = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  filter: 'blur(8px)',
  opacity: 0.3,
});

const NavigationArrow = styled('button')({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  '&.prev': {
    left: '20px',
  },
  '&.next': {
    right: '20px',
  }
});

const SliderNav = styled('div')({
  position: 'absolute',
  bottom: '15px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '10px',
  zIndex: 3,
  '@media (max-width: 768px)': {
    bottom: '10px',
  }
});

const SliderDot = styled('div')({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&.active': {
    backgroundColor: 'white',
    transform: 'scale(1.2)',
  }
});

const Hero = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hero-images');
        const data = await response.json();
        setHeroImages(data);
      } catch (error) {
        console.error('Error loading hero images:', error);
      }
    };

    loadHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(current => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  const handlePrevSlide = () => {
    setCurrentSlide(current => 
      current === 0 ? heroImages.length - 1 : current - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide(current => 
      (current + 1) % heroImages.length
    );
  };

  if (heroImages.length === 0) {
    return null;
  }

  return (
    <HeroSection>
      {heroImages.map((image, index) => (
        <HeroSlide
          key={image.id}
          className={index === currentSlide ? 'active' : ''}
        >
          <HeroImageBackground style={{ backgroundImage: `url(${image.image_url})` }} />
          <HeroImage src={image.image_url} alt="" />
        </HeroSlide>
      ))}
      <NavigationArrow className="prev" onClick={handlePrevSlide}>
        <ArrowBack />
      </NavigationArrow>
      <NavigationArrow className="next" onClick={handleNextSlide}>
        <ArrowForward />
      </NavigationArrow>
      <SliderNav>
        {heroImages.map((_, index) => (
          <SliderDot
            key={index}
            className={index === currentSlide ? 'active' : ''}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </SliderNav>
    </HeroSection>
  );
};

export default Hero; 