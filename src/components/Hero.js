import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

// 상수 정의
const SPLINE_URL = 'https://my.spline.design/cutecomputerfollowcursor-WYHdkV50k4EeXmMfH0M5DeUB/';
const MOBILE_BREAKPOINT = 768;
const FPS_THRESHOLDS = {
  LOW: 20,
  MEDIUM: 30,
  HIGH: 50,
  EXCELLENT: 60
};

function Hero() {
  // State
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [renderQuality, setRenderQuality] = useState('high');

  // Refs
  const heroRef = useRef(null);
  const iframeRef = useRef(null);
  const iframeKeyRef = useRef(0);
  const wasVisibleRef = useRef(true);

  // Page Visibility API - 탭이 비활성화되면 iframe 숨김
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isPageVisible = !document.hidden;
      setIsPageVisible(isPageVisible);

      if (iframeRef.current) {
        iframeRef.current.style.display = isPageVisible ? 'block' : 'none';
      }
    };

    setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 성능 모니터링 및 적응형 품질 조정
  useEffect(() => {
    if (!shouldLoad || !isVisible || !isPageVisible || isMobile) return;

    let rafId;
    let frameCount = 0;
    let lastTime = performance.now();

    const adjustQualityByFPS = (fps) => {
      if (fps < FPS_THRESHOLDS.LOW && renderQuality === 'medium') {
        setRenderQuality('low');
      } else if (fps < FPS_THRESHOLDS.MEDIUM && renderQuality === 'high') {
        setRenderQuality('medium');
      } else if (fps > FPS_THRESHOLDS.HIGH && renderQuality === 'low') {
        setRenderQuality('medium');
      } else if (fps > FPS_THRESHOLDS.EXCELLENT && renderQuality === 'medium') {
        setRenderQuality('high');
      }
    };

    const monitorPerformance = (currentTime) => {
      frameCount++;

      // 1초마다 FPS 계산 및 품질 조정
      if (currentTime - lastTime >= 1000) {
        adjustQualityByFPS(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(monitorPerformance);
    };

    rafId = requestAnimationFrame(monitorPerformance);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldLoad, isVisible, isPageVisible, renderQuality, isMobile]);

  // 모바일 감지 및 IntersectionObserver 설정
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    // 초기 로딩 Observer
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        const loadIframe = () => {
          setTimeout(() => setShouldLoad(true), 500);
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadIframe, { timeout: 2000 });
        } else {
          setTimeout(loadIframe, 500);
        }

        loadObserver.disconnect();
      },
      { threshold: 0.1 }
    );

    // 가시성 Observer
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;

        // 완전히 벗어났다가 다시 돌아올 때만 key 변경하여 재생성
        if (!isIntersecting && wasVisibleRef.current) {
          iframeKeyRef.current += 1;
          wasVisibleRef.current = false;
        } else if (isIntersecting && !wasVisibleRef.current) {
          wasVisibleRef.current = true;
        }

        setIsVisible(isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    if (heroRef.current) {
      loadObserver.observe(heroRef.current);
      visibilityObserver.observe(heroRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      loadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [isMobile]);

  // 품질에 따른 스타일 계산
  const getQualityStyle = () => {
    const baseStyle = {
      pointerEvents: 'auto',
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, filter 0.3s ease-in-out'
    };

    const qualityStyles = {
      low: {
        ...baseStyle,
        transform: 'scale(0.95)',
        filter: 'blur(0.5px) brightness(0.9)'
      },
      medium: {
        ...baseStyle,
        transform: 'scale(0.98)',
        filter: 'brightness(0.95)'
      },
      high: baseStyle
    };

    return qualityStyles[renderQuality] || baseStyle;
  };

  const shouldShowIframe = shouldLoad && isVisible && isPageVisible;

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero-container">
        {isMobile ? (
          <div className="hero-mobile">
            <h1 className="hero-title">포트폴리오</h1>
            <p className="hero-subtitle">웹 개발자</p>
          </div>
        ) : shouldShowIframe ? (
          <iframe
            ref={iframeRef}
            key={`spline-${iframeKeyRef.current}`}
            src={SPLINE_URL}
            frameBorder="0"
            width="100%"
            height="100%"
            loading="lazy"
            allow="autoplay; fullscreen"
            style={getQualityStyle()}
          />
        ) : (
          <div className="hero-loading">
            <p className="hero-title">포트폴리오</p>
            <p className="hero-subtitle">웹 개발자</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;

