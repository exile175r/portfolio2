import React, { useState, memo } from 'react';
import './Projects.css';

const Projects = memo(function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Idea Funding',
      description: 'Idea Funding은 창의적인 아이디어를 가진 창작자와 후원자를 연결하는 크라우드펀딩 플랫폼입니다. 사용자들은 다양한 프로젝트를 탐색하고, 관심 있는 프로젝트에 후원할 수 있으며, 커뮤니티를 통해 아이디어를 공유하고 소통할 수 있습니다.',
      link: 'https://exile175r.github.io/idea-funding',
      image: '/image/ideaFunding.png'
    },
    // {
    //   id: 2,
    //   title: 'Project 2',
    //   description: '프로젝트 설명을 여기에 작성하세요.',
    //   link: 'https://example.com',
    //   image: null
    // },
    // {
    //   id: 3,
    //   title: 'Project 3',
    //   description: '프로젝트 설명을 여기에 작성하세요.',
    //   link: 'https://example.com',
    //   image: null
    // }
  ];

  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(() => {
    // 초기 로딩 상태: 이미지가 있는 프로젝트는 로딩 중으로 설정
    const initialLoading = {};
    projects.forEach(project => {
      if (project.image) {
        initialLoading[project.id] = true;
      }
    });
    return initialLoading;
  });

  const handleImageError = (projectId) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
    setImageLoading(prev => ({ ...prev, [projectId]: false }));
  };

  const handleImageLoad = (projectId) => {
    setImageLoading(prev => ({ ...prev, [projectId]: false }));
  };

  const shouldShowImage = (project) => {
    // 이미지 경로가 있고, 에러가 없을 때
    return project.image && !imageErrors[project.id];
  };

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <h2 className="projects-title">Projects</h2>
        <p className="projects-subtitle">제작한 프로젝트들을 소개합니다</p>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                {shouldShowImage(project) ? (
                  <>
                    {imageLoading[project.id] && (
                      <div className="project-placeholder">
                        <div className="placeholder-text">로딩 중...</div>
                      </div>
                    )}
                    <img
                      src={project.image}
                      alt={project.title}
                      onError={() => handleImageError(project.id)}
                      onLoad={() => handleImageLoad(project.id)}
                      style={{ display: imageLoading[project.id] ? 'none' : 'block' }}
                    />
                  </>
                ) : (
                  <div className="project-placeholder">
                    <div className="placeholder-icon">📁</div>
                    <div className="placeholder-text">이미지 준비 중</div>
                  </div>
                )}
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Projects;

