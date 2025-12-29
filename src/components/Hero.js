import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

function Hero() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // 모바일 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 데스크톱에서만 지연 로딩
    if (!isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            // 약간의 지연을 두어 초기 로딩 부담 감소
            setTimeout(() => {
              setShouldLoad(true);
            }, 500);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (heroRef.current) {
        observer.observe(heroRef.current);
      }

      return () => {
        window.removeEventListener('resize', checkMobile);
        if (heroRef.current) {
          observer.disconnect();
        }
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero-container">
        {isMobile ? (
          <div className="hero-mobile">
            <h1 className="hero-title">포트폴리오</h1>
            <p className="hero-subtitle">웹 개발자</p>
          </div>
        ) : shouldLoad ? (
          <iframe src='https://my.spline.design/cutecomputerfollowcursor-WYHdkV50k4EeXmMfH0M5DeUB/' frameborder='0' width='100%' height='100%'></iframe>
        ) : (
          <div className="hero-loading">
            <p className="hero-title">로딩 중...</p>
          </div>
        )}
        <div className="spline-watermark-overlay"></div>
      </div>
    </section>
  );
}

export default Hero;

