import React from 'react';
import { personalInfo, educationInfo, skillsData, servicesData, experienceTimeline } from '../../data/portfolioData';
import { projectsData } from '../../data/projectsData';

export const WebGLFallback = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12 max-w-5xl mx-auto space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 pt-12">
        <img
          src="/assets/mahmoud.png"
          alt="Mahmoud Jihad"
          className="w-36 h-36 rounded-full mx-auto border-4 border-cyan-500 shadow-2xl object-cover"
        />
        <h1 className="text-4xl sm:text-5xl font-display font-black text-white">{personalInfo.name}</h1>
        <p className="text-lg font-mono text-cyan-400">{personalInfo.role}</p>
        <p className="text-slate-400 max-w-2xl mx-auto">{personalInfo.bio}</p>
      </section>

      {/* Achievements */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white border-b border-slate-800 pb-2">
          Academic Honors & Education
        </h2>
        <div className="p-6 bg-slate-900 rounded-2xl border border-cyan-500/30 space-y-2">
          <h3 className="text-xl font-bold text-cyan-300">{educationInfo.institution}</h3>
          <p className="text-slate-300">{educationInfo.department} • {educationInfo.degree}</p>
          <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs rounded-full">
            ★ {educationInfo.standing}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white border-b border-slate-800 pb-2">
          Featured Engineering Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projectsData.map((project) => (
            <div key={project.id} className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-xs font-mono text-cyan-400">{project.subtitle}</p>
              <p className="text-sm text-slate-300">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-slate-800 text-xs font-mono rounded text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white border-b border-slate-800 pb-2">
          Core Technologies
        </h2>
        <div className="flex flex-wrap gap-2">
          {skillsData.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-cyan-300"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
