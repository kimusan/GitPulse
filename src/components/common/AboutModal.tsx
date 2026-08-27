import React from 'react';
import {
  X,
  Info,
  ExternalLink,
  Globe,
  User,
  ShieldCheck,
  Cpu,
  Layers,
  Code2,
} from 'lucide-react';
import { APP_METADATA } from '../../constants/version';
import { GithubIcon } from './GithubIcon';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="w-full max-w-lg bg-gh-surface border border-gh-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gh-border bg-gh-card/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gh-blue/15 border border-gh-blue/30 flex items-center justify-center text-gh-blue">
              <GithubIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gh-text">{APP_METADATA.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-gh-blue text-white text-[10px] font-bold">
                  v{APP_METADATA.version}
                </span>
              </div>
              <p className="text-xs text-gh-muted">GitHub Telemetry & Analytics Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gh-muted hover:text-gh-text hover:bg-gh-card transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Overview */}
          <p className="text-xs text-gh-text/90 leading-relaxed">
            {APP_METADATA.description}
          </p>

          {/* Author & Links Card */}
          <div className="p-4 rounded-2xl bg-gh-card/60 border border-gh-border space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gh-surface border border-gh-border flex items-center justify-center text-gh-purple">
                <User size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gh-text uppercase tracking-wider">Creator & Maintainer</h4>
                <p className="text-sm font-bold text-gh-text">{APP_METADATA.author}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <a
                href={APP_METADATA.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-gh-surface hover:bg-gh-surface/80 border border-gh-border/80 text-gh-text font-medium flex items-center justify-between gap-2 transition-colors hover:border-gh-blue/50"
              >
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gh-cyan" />
                  <span>schulz.dk</span>
                </div>
                <ExternalLink size={12} className="text-gh-muted" />
              </a>

              <a
                href={APP_METADATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-gh-surface hover:bg-gh-surface/80 border border-gh-border/80 text-gh-text font-medium flex items-center justify-between gap-2 transition-colors hover:border-gh-blue/50"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon size={14} className="text-gh-blue" />
                  <span>GitHub Repo</span>
                </div>
                <ExternalLink size={12} className="text-gh-muted" />
              </a>
            </div>
          </div>

          {/* Platform & Ergonomics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gh-muted uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-gh-green" />
              Multi-Platform Ergonomics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gh-surface border border-gh-border">
                <span className="font-semibold text-gh-text">Android</span>
                <p className="text-[11px] text-gh-muted mt-0.5">Phone, Foldables & Tablets (Developer Category)</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gh-surface border border-gh-border">
                <span className="font-semibold text-gh-text">Desktop</span>
                <p className="text-[11px] text-gh-muted mt-0.5">Native Linux (.AppImage/.deb) & Windows (.msi)</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gh-muted uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={13} className="text-gh-cyan" />
              Built With
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {APP_METADATA.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-gh-card border border-gh-border text-gh-text text-[11px] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* License Footer */}
          <div className="pt-2 border-t border-gh-border/60 flex items-center justify-between text-[11px] text-gh-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-gh-green" />
              {APP_METADATA.license}
            </span>
            <span>Version {APP_METADATA.version} ({APP_METADATA.buildDate})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
