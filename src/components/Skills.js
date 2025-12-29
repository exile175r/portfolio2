import React, { memo, useEffect } from 'react';
import './Skills.css';

const Skills = memo(function Skills() {
  // 애니메이션 설정 변수
  const ANIMATION_DURATION = 1.5; // 각 카드의 애니메이션 지속 시간 (초)
  const CYCLE_DURATION = 8.0; // 전체 사이클 시간 (초)
  const DELAY_BETWEEN_CARDS = 2.0; // 카드 간 지연 시간 (초)

  const skills = [
    {
      name: 'HTML',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'
    },
    {
      name: 'CSS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg'
    },
    {
      name: 'Javascript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    },
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    },
    {
      name: 'MySQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'
    }
  ];

  useEffect(() => {
    // 각 카드마다 개별 애니메이션 생성
    // 전체 사이클 = 마지막 카드 시작 시간 + 애니메이션 지속 시간
    const cycleDuration = (skills.length - 1) * DELAY_BETWEEN_CARDS + ANIMATION_DURATION;

    skills.forEach((skill, index) => {
      const cardStartTime = index * DELAY_BETWEEN_CARDS;
      const animationDuration = ANIMATION_DURATION;

      // 퍼센트 계산 (애니메이션 시작/중간/끝 시점)
      const animStart = (cardStartTime / cycleDuration) * 100;
      const animMid = ((cardStartTime + animationDuration / 2) / cycleDuration) * 100;
      const animEnd = ((cardStartTime + animationDuration) / cycleDuration) * 100;

      // 카드 애니메이션 (처음부터 모두 노출)
      const cardKeyframes = `
        @keyframes skillCardSequence${index} {
          0% {
            opacity: 1;
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(255, 107, 53, 0);
            border-color: #e5e7eb;
          }
          ${animStart}% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(255, 107, 53, 0);
            border-color: #e5e7eb;
          }
          ${animMid}% {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(255, 107, 53, 0.15);
            border-color: #FF6B35;
          }
          ${animEnd}% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(255, 107, 53, 0);
            border-color: #e5e7eb;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(255, 107, 53, 0);
            border-color: #e5e7eb;
          }
        }
      `;

      // 아이콘 애니메이션 (카드 애니메이션과 동일한 타이밍으로 컬러 변경)
      const iconKeyframes = `
        @keyframes iconSequence${index} {
          0% {
            transform: scale(1) rotate(0deg);
            filter: grayscale(100%);
          }
          ${animStart}% {
            transform: scale(1) rotate(0deg);
            filter: grayscale(100%);
          }
          ${animMid}% {
            transform: scale(1.2) rotate(-5deg);
            filter: grayscale(0%);
          }
          ${animEnd}% {
            transform: scale(1) rotate(0deg);
            filter: grayscale(100%);
          }
          100% {
            transform: scale(1) rotate(0deg);
            filter: grayscale(100%);
          }
        }
      `;

      // 스타일 시트에 추가
      const style = document.createElement('style');
      style.textContent = cardKeyframes + iconKeyframes;
      document.head.appendChild(style);
    });

    return () => {
      // cleanup
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent.includes('skillCardSequence') ||
          style.textContent.includes('iconSequence')) {
          style.remove();
        }
      });
    };
  }, [skills.length, CYCLE_DURATION, ANIMATION_DURATION, DELAY_BETWEEN_CARDS]);

  return (
    <section className="skills" id="skills">
      <div className="skills-container">
        <h2 className="skills-title">Skills</h2>
        <p className="skills-subtitle">기술 스택과 전문성을 소개합니다</p>
        <div className="skills-grid">
          {skills.map((skill, index) => {
            // 전체 사이클 = 마지막 카드 시작 시간 + 애니메이션 지속 시간
            const cycleDuration = (skills.length - 1) * DELAY_BETWEEN_CARDS + ANIMATION_DURATION;

            return (
              <div
                key={index}
                className="skill-card"
                style={{
                  '--cycle-duration': `${cycleDuration}s`,
                  animationName: `skillCardSequence${index}`,
                }}
                data-index={index}
              >
                <div
                  className="skill-icon"
                  style={{
                    animationName: `iconSequence${index}`,
                    '--cycle-duration': `${cycleDuration}s`,
                  }}
                >
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <div className="skill-name">{skill.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default Skills;
