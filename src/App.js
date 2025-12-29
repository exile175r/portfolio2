import React, { lazy, Suspense } from 'react';
import './App.css';
import Navigation from './components/Navigation';

const Hero = lazy(() => import('./components/Hero'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));

function App() {
  return (
    <div className="App">
      <Navigation />
      <Suspense fallback={<div style={{height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>로딩 중...</div>}>
        <Hero />
        <Skills />
        <Projects />
      </Suspense>
    </div>
  );
}

export default App;
