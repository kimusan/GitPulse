import { GitHubUser, GitHubRepository } from '../types/github';
import { RepoDetailedStats, AggregateStats } from '../types/stats';

export const MOCK_USER: GitHubUser = {
  id: 4289102,
  login: 'octodev',
  name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  html_url: 'https://github.com/octodev',
  bio: 'Full-stack engineer, OSS maintainer & mobile tooling enthusiast 🚀',
  public_repos: 14,
  total_private_repos: 3,
  followers: 1840,
  following: 245,
  created_at: '2019-04-12T10:00:00Z',
};

export const MOCK_REPOSITORIES: GitHubRepository[] = [
  {
    id: 101,
    name: 'hyper-terminal',
    full_name: 'octodev/hyper-terminal',
    owner: {
      login: 'octodev',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      type: 'User'
    },
    private: false,
    html_url: 'https://github.com/octodev/hyper-terminal',
    description: 'Blazing fast cross-platform GPU-accelerated terminal emulator built in Rust and React',
    fork: false,
    stargazers_count: 8420,
    watchers_count: 312,
    forks_count: 640,
    open_issues_count: 18,
    language: 'Rust',
    topics: ['terminal', 'rust', 'react', 'cross-platform', 'gpu-accelerated', 'productivity'],
    default_branch: 'main',
    created_at: '2022-01-15T08:30:00Z',
    updated_at: '2026-08-24T14:22:00Z',
    pushed_at: '2026-08-24T16:00:00Z',
    size: 24800,
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT'
    },
    permissions: { admin: true, push: true, pull: true }
  },
  {
    id: 102,
    name: 'pulse-ui',
    full_name: 'octodev/pulse-ui',
    owner: {
      login: 'octodev',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      type: 'User'
    },
    private: false,
    html_url: 'https://github.com/octodev/pulse-ui',
    description: 'Ultra-modern, accessible Material 3 & Glassmorphic component library for React and React Native',
    fork: false,
    stargazers_count: 5310,
    watchers_count: 188,
    forks_count: 412,
    open_issues_count: 12,
    language: 'TypeScript',
    topics: ['ui-library', 'material-3', 'tailwind', 'design-system', 'accessibility', 'react'],
    default_branch: 'main',
    created_at: '2022-09-10T12:00:00Z',
    updated_at: '2026-08-23T11:15:00Z',
    pushed_at: '2026-08-23T12:45:00Z',
    size: 18900,
    license: {
      key: 'apache-2.0',
      name: 'Apache License 2.0',
      spdx_id: 'Apache-2.0'
    },
    permissions: { admin: true, push: true, pull: true }
  },
  {
    id: 103,
    name: 'droid-flow',
    full_name: 'octodev/droid-flow',
    owner: {
      login: 'octodev',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      type: 'User'
    },
    private: false,
    html_url: 'https://github.com/octodev/droid-flow',
    description: 'Lightweight reactive state management & offline sync framework for Android & Kotlin Multiplatform',
    fork: false,
    stargazers_count: 3190,
    watchers_count: 145,
    forks_count: 230,
    open_issues_count: 6,
    language: 'Kotlin',
    topics: ['android', 'kotlin-multiplatform', 'state-management', 'offline-first', 'coroutine'],
    default_branch: 'main',
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2026-08-21T18:30:00Z',
    pushed_at: '2026-08-21T19:00:00Z',
    size: 14200,
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT'
    },
    permissions: { admin: true, push: true, pull: true }
  },
  {
    id: 104,
    name: 'cloud-stat-cli',
    full_name: 'octodev/cloud-stat-cli',
    owner: {
      login: 'octodev',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      type: 'User'
    },
    private: false,
    html_url: 'https://github.com/octodev/cloud-stat-cli',
    description: 'DevOps CLI tool for real-time Kubernetes cluster telemetry and cost optimization diagnostics',
    fork: false,
    stargazers_count: 1980,
    watchers_count: 94,
    forks_count: 165,
    open_issues_count: 8,
    language: 'Go',
    topics: ['cli', 'kubernetes', 'golang', 'devops', 'observability', 'telemetry'],
    default_branch: 'main',
    created_at: '2023-11-04T15:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
    pushed_at: '2026-08-20T10:30:00Z',
    size: 9800,
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT'
    },
    permissions: { admin: true, push: true, pull: true }
  },
  {
    id: 105,
    name: 'ai-prompt-craft',
    full_name: 'octodev/ai-prompt-craft',
    owner: {
      login: 'octodev',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      type: 'User'
    },
    private: false,
    html_url: 'https://github.com/octodev/ai-prompt-craft',
    description: 'Structured Prompt Engineering & LLM agent orchestration workbench with live evaluations',
    fork: false,
    stargazers_count: 4210,
    watchers_count: 220,
    forks_count: 380,
    open_issues_count: 14,
    language: 'Python',
    topics: ['llm', 'prompt-engineering', 'agents', 'python', 'evals', 'rag'],
    default_branch: 'main',
    created_at: '2024-02-18T14:00:00Z',
    updated_at: '2026-08-24T08:12:00Z',
    pushed_at: '2026-08-24T09:40:00Z',
    size: 16400,
    license: {
      key: 'apache-2.0',
      name: 'Apache License 2.0',
      spdx_id: 'Apache-2.0'
    },
    permissions: { admin: true, push: true, pull: true }
  }
];

// Realistic commit trends for the past 24 weeks
function generateCommitWeeks(): { days: number[]; total: number; week: number }[] {
  const weeks = [];
  const now = Math.floor(Date.now() / 1000);
  for (let i = 23; i >= 0; i--) {
    const weekStart = now - (i * 7 * 86400);
    const days = [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 8 + 2),
      Math.floor(Math.random() * 10 + 3),
      Math.floor(Math.random() * 9 + 2),
      Math.floor(Math.random() * 11 + 4),
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 3),
    ];
    const total = days.reduce((a, b) => a + b, 0);
    weeks.push({ days, total, week: weekStart });
  }
  return weeks;
}

export const MOCK_DETAILED_STATS: Record<number, RepoDetailedStats> = {
  101: {
    repo: MOCK_REPOSITORIES[0],
    releases: [
      {
        id: 1,
        tag_name: 'v2.4.0',
        name: 'v2.4.0: Metal & Vulkan Shader Accelerators ⚡',
        body: '## What is Changed\n- Direct GPU compute shader pipelines for ultra-low latency\n- Tab restoration with full memory snapshots\n- Split pane layouts with adaptive resizing\n- Fixes memory leak in ANSI parser',
        draft: false,
        prerelease: false,
        created_at: '2026-08-10T14:00:00Z',
        published_at: '2026-08-10T15:00:00Z',
        html_url: 'https://github.com/octodev/hyper-terminal/releases/tag/v2.4.0',
        assets: [
          {
            id: 1001,
            name: 'hyper-terminal-linux-x86_64.AppImage',
            size: 48200100,
            download_count: 14820,
            created_at: '2026-08-10T14:30:00Z',
            updated_at: '2026-08-10T14:30:00Z',
            browser_download_url: 'https://github.com/octodev/hyper-terminal/releases/download/v2.4.0/hyper-terminal-linux-x86_64.AppImage',
            content_type: 'application/x-executable'
          },
          {
            id: 1002,
            name: 'hyper-terminal-linux-amd64.deb',
            size: 34100500,
            download_count: 19430,
            created_at: '2026-08-10T14:30:00Z',
            updated_at: '2026-08-10T14:30:00Z',
            browser_download_url: 'https://github.com/octodev/hyper-terminal/releases/download/v2.4.0/hyper-terminal-linux-amd64.deb',
            content_type: 'application/vnd.debian.binary-package'
          },
          {
            id: 1003,
            name: 'hyper-terminal-windows-setup.exe',
            size: 52100800,
            download_count: 32600,
            created_at: '2026-08-10T14:30:00Z',
            updated_at: '2026-08-10T14:30:00Z',
            browser_download_url: 'https://github.com/octodev/hyper-terminal/releases/download/v2.4.0/hyper-terminal-windows-setup.exe',
            content_type: 'application/x-msdos-program'
          },
          {
            id: 1004,
            name: 'hyper-terminal-macos-universal.dmg',
            size: 58900200,
            download_count: 24150,
            created_at: '2026-08-10T14:30:00Z',
            updated_at: '2026-08-10T14:30:00Z',
            browser_download_url: 'https://github.com/octodev/hyper-terminal/releases/download/v2.4.0/hyper-terminal-macos-universal.dmg',
            content_type: 'application/x-apple-diskimage'
          }
        ]
      },
      {
        id: 2,
        tag_name: 'v2.3.1',
        name: 'v2.3.1: Hotfix for Wayland fractional scaling',
        body: 'Fixes blurry fonts on 125% and 150% fractional scaling in GNOME / KDE Wayland sessions.',
        draft: false,
        prerelease: false,
        created_at: '2026-07-15T10:00:00Z',
        published_at: '2026-07-15T11:00:00Z',
        html_url: 'https://github.com/octodev/hyper-terminal/releases/tag/v2.3.1',
        assets: [
          {
            id: 1005,
            name: 'hyper-terminal-linux-x86_64.AppImage',
            size: 47900100,
            download_count: 8940,
            created_at: '2026-07-15T10:30:00Z',
            updated_at: '2026-07-15T10:30:00Z',
            browser_download_url: '#',
            content_type: 'application/x-executable'
          },
          {
            id: 1006,
            name: 'hyper-terminal-windows-setup.exe',
            size: 51800200,
            download_count: 18450,
            created_at: '2026-07-15T10:30:00Z',
            updated_at: '2026-07-15T10:30:00Z',
            browser_download_url: '#',
            content_type: 'application/x-msdos-program'
          }
        ]
      },
      {
        id: 3,
        tag_name: 'v2.2.0',
        name: 'v2.2.0: Dynamic Theme Support & GPU glyph cache',
        body: 'Introduces 20+ built-in themes and high performance GPU texture atlases.',
        draft: false,
        prerelease: false,
        created_at: '2026-06-01T08:00:00Z',
        published_at: '2026-06-01T09:00:00Z',
        html_url: '#',
        assets: [
          {
            id: 1007,
            name: 'hyper-terminal-linux-x86_64.AppImage',
            size: 46200000,
            download_count: 15200,
            created_at: '2026-06-01T08:30:00Z',
            updated_at: '2026-06-01T08:30:00Z',
            browser_download_url: '#',
            content_type: 'application/x-executable'
          }
        ]
      },
      {
        id: 4,
        tag_name: 'v2.1.0',
        name: 'v2.1.0: Cross-platform OpenGL fallback',
        body: 'Ensures support on legacy graphics chipsets without Vulkan.',
        draft: false,
        prerelease: false,
        created_at: '2026-04-12T12:00:00Z',
        published_at: '2026-04-12T13:00:00Z',
        html_url: '#',
        assets: [
          {
            id: 1008,
            name: 'hyper-terminal-all-platforms.tar.gz',
            size: 38000000,
            download_count: 9800,
            created_at: '2026-04-12T12:30:00Z',
            updated_at: '2026-04-12T12:30:00Z',
            browser_download_url: '#',
            content_type: 'application/gzip'
          }
        ]
      }
    ],
    totalDownloads: 143390,
    openPullRequestsCount: 7,
    closedPullRequestsCount: 24,
    mergedPullRequestsCount: 142,
    pullRequests: [
      {
        id: 201,
        number: 148,
        title: 'feat: add support for ligatures in Kitty keyboard protocol',
        body: 'Implements full extended unicode ligature decoding according to the Kitty graphic/keyboard protocol specifications. Benchmark tests show 0ms regression.',
        state: 'open',
        merged_at: null,
        created_at: '2026-08-22T12:00:00Z',
        closed_at: null,
        user: { login: 'rustacean99', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
        commentsCount: 2,
        commentsList: [
          {
            id: 2011,
            body: 'Tested locally across JetBrains Mono and Fira Code. Render performance is buttery smooth at 144Hz!',
            created_at: '2026-08-22T14:30:00Z',
            user: { login: 'pixelartist', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' }
          },
          {
            id: 2012,
            body: 'Left two minor suggestions on bounds checking in the glyph cache. Otherwise ready to merge.',
            created_at: '2026-08-22T16:00:00Z',
            user: { login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
          }
        ]
      },
      {
        id: 202,
        number: 147,
        title: 'fix(renderer): resolve flicker during rapid terminal resize',
        body: 'Debounces frame buffer recreation during window resize animations on Wayland and macOS compositors.',
        state: 'open',
        merged_at: null,
        created_at: '2026-08-20T16:20:00Z',
        closed_at: null,
        user: { login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        commentsCount: 1,
        commentsList: [
          {
            id: 2021,
            body: 'Verified that resize flicker is completely eliminated on GNOME 47.',
            created_at: '2026-08-20T18:00:00Z',
            user: { login: 'linuxguru', avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' }
          }
        ]
      },
      {
        id: 203,
        number: 146,
        title: 'chore: upgrade wgpu dependency to 22.0',
        body: 'Bumps wgpu from 21.3 to 22.0, enabling direct Vulkan descriptor set caching and Metal shader validation.',
        state: 'closed',
        merged_at: '2026-08-19T10:00:00Z',
        created_at: '2026-08-18T14:00:00Z',
        closed_at: '2026-08-19T10:00:00Z',
        user: { login: 'dependabot[bot]', avatar_url: 'https://avatars.githubusercontent.com/u/49699333?v=4' },
        commentsCount: 1,
        commentsList: [
          {
            id: 2031,
            body: 'Automated CI build and Vulkan test matrix passed on Linux, Windows and macOS.',
            created_at: '2026-08-19T09:45:00Z',
            user: { login: 'github-actions[bot]', avatar_url: 'https://avatars.githubusercontent.com/u/44036562?v=4' }
          }
        ]
      }
    ],
    openIssuesCount: 18,
    closedIssuesCount: 284,
    issues: [
      {
        id: 301,
        number: 152,
        title: 'Crash when pasting 100MB clipboard buffer on Wayland',
        body: 'When attempting to paste a large SQL dump (>100MB) from clipboard into the active session, the process panics with out-of-memory exception in the text segmenter.',
        state: 'open',
        comments: 6,
        created_at: '2026-08-21T09:12:00Z',
        closed_at: null,
        user: { login: 'linuxguru', avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
        labels: [{ id: 1, name: 'bug', color: 'd73a4a' }, { id: 2, name: 'linux', color: '0075ca' }],
        commentsList: [
          {
            id: 3011,
            body: 'Reproduced! The problem is that the paste stream reads the entire buffer into memory at once rather than chunking.',
            created_at: '2026-08-21T11:00:00Z',
            user: { login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
          },
          {
            id: 3012,
            body: 'Opening a PR with a streaming 64KB chunk ring buffer.',
            created_at: '2026-08-21T14:20:00Z',
            user: { login: 'rustacean99', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }
          }
        ]
      },
      {
        id: 302,
        number: 151,
        title: 'Feature request: custom shader background effects (CRT scanlines)',
        body: 'It would be amazing to support custom WGSL post-processing shaders for retro phosphor glow and scanline curvature.',
        state: 'open',
        comments: 14,
        created_at: '2026-08-18T17:45:00Z',
        closed_at: null,
        user: { login: 'pixelartist', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
        labels: [{ id: 3, name: 'enhancement', color: 'a2eeef' }],
        commentsList: [
          {
            id: 3021,
            body: 'Love this idea! We could expose a `shaders/` directory in user config where `.wgsl` files are auto-loaded.',
            created_at: '2026-08-18T19:00:00Z',
            user: { login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
          }
        ]
      }
    ],
    discussionsCount: 42,
    discussionCommentsCount: 388,
    discussions: [
      {
        id: 'D_1',
        title: 'How are you customizing your prompt themes with hyper-terminal?',
        body: 'Share your Starship / Oh My Posh configuration setups and color palettes! Here is my custom Dracula + Powerline font setup with dynamic Git status indicators.',
        number: 42,
        createdAt: '2026-08-14T08:00:00Z',
        commentsCount: 68,
        category: { name: 'Show and tell', emoji: ':raised_hands:' },
        author: { login: 'starrydev', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        upvoteCount: 94,
        commentsList: [
          {
            id: 'DC_1',
            body: 'Using Catppuccin Mocha with JetBrains Mono Nerd Font. The sub-millisecond render speed is incredible.',
            created_at: '2026-08-14T10:00:00Z',
            user: { login: 'pixelartist', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' }
          },
          {
            id: 'DC_2',
            body: 'Here is my fish prompt script that displays AWS cluster context and active Kubernetes namespace.',
            created_at: '2026-08-14T12:30:00Z',
            user: { login: 'linuxguru', avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' }
          }
        ]
      },
      {
        id: 'D_2',
        title: 'Roadmap discussion for v3.0: Native Plugin System via WebAssembly',
        body: 'We are planning to introduce a sandboxed Wasm runtime using Wasmtime for extensions. This will allow community plugins written in Rust, TypeScript, or Go to hook into terminal events without sacrificing speed or security.',
        number: 38,
        createdAt: '2026-08-01T12:00:00Z',
        commentsCount: 112,
        category: { name: 'Ideas', emoji: ':bulb:' },
        author: { login: 'octodev', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        upvoteCount: 156,
        commentsList: [
          {
            id: 'DC_3',
            body: 'Huge +1 for Wasm component model! Would make writing terminal overlays so much cleaner.',
            created_at: '2026-08-01T14:00:00Z',
            user: { login: 'rustacean99', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }
          }
        ]
      }
    ],
    commitActivity: generateCommitWeeks(),
    totalCommitsLastYear: 842,
    trafficViews: {
      count: 48200,
      uniques: 14100,
      views: [
        { timestamp: '2026-08-11T00:00:00Z', count: 3200, uniques: 920 },
        { timestamp: '2026-08-12T00:00:00Z', count: 3450, uniques: 1040 },
        { timestamp: '2026-08-13T00:00:00Z', count: 3890, uniques: 1180 },
        { timestamp: '2026-08-14T00:00:00Z', count: 4200, uniques: 1300 },
        { timestamp: '2026-08-15T00:00:00Z', count: 2800, uniques: 780 },
        { timestamp: '2026-08-16T00:00:00Z', count: 2400, uniques: 690 },
        { timestamp: '2026-08-17T00:00:00Z', count: 4100, uniques: 1250 },
        { timestamp: '2026-08-18T00:00:00Z', count: 4350, uniques: 1320 },
        { timestamp: '2026-08-19T00:00:00Z', count: 4600, uniques: 1410 },
        { timestamp: '2026-08-20T00:00:00Z', count: 4150, uniques: 1280 },
        { timestamp: '2026-08-21T00:00:00Z', count: 3980, uniques: 1190 },
        { timestamp: '2026-08-22T00:00:00Z', count: 2600, uniques: 740 },
        { timestamp: '2026-08-23T00:00:00Z', count: 2100, uniques: 620 },
        { timestamp: '2026-08-24T00:00:00Z', count: 4380, uniques: 1380 }
      ]
    },
    trafficClones: {
      count: 6420,
      uniques: 2150,
      clones: [
        { timestamp: '2026-08-18T00:00:00Z', count: 420, uniques: 160 },
        { timestamp: '2026-08-19T00:00:00Z', count: 510, uniques: 190 },
        { timestamp: '2026-08-20T00:00:00Z', count: 490, uniques: 180 },
        { timestamp: '2026-08-21T00:00:00Z', count: 460, uniques: 170 },
        { timestamp: '2026-08-22T00:00:00Z', count: 320, uniques: 120 },
        { timestamp: '2026-08-23T00:00:00Z', count: 280, uniques: 95 },
        { timestamp: '2026-08-24T00:00:00Z', count: 540, uniques: 210 }
      ]
    },
    languages: {
      Rust: 785000,
      TypeScript: 210000,
      C: 45000,
      GLSL: 32000,
      Shell: 12000
    },
    contributors: [
      { id: 1, login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', contributions: 512, html_url: 'https://github.com/octodev' },
      { id: 2, login: 'rustacean99', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', contributions: 148, html_url: 'https://github.com/rustacean99' },
      { id: 3, login: 'linuxguru', avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', contributions: 94, html_url: 'https://github.com/linuxguru' },
      { id: 4, login: 'pixelartist', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', contributions: 52, html_url: 'https://github.com/pixelartist' }
    ],
    lastFetched: Date.now()
  },
  102: {
    repo: MOCK_REPOSITORIES[1],
    releases: [
      {
        id: 11,
        tag_name: 'v1.8.0',
        name: 'v1.8.0: Material You Dynamic Theming & Glass Surface',
        body: 'Includes dynamic color extraction from wallpapers, responsive layout tokens, and 40+ new accessible primitives.',
        draft: false,
        prerelease: false,
        created_at: '2026-08-04T11:00:00Z',
        published_at: '2026-08-04T12:00:00Z',
        html_url: 'https://github.com/octodev/pulse-ui/releases/tag/v1.8.0',
        assets: [
          {
            id: 2001,
            name: 'pulse-ui-tokens-v1.8.0.tgz',
            size: 4200000,
            download_count: 48920,
            created_at: '2026-08-04T11:30:00Z',
            updated_at: '2026-08-04T11:30:00Z',
            browser_download_url: '#',
            content_type: 'application/gzip'
          }
        ]
      },
      {
        id: 12,
        tag_name: 'v1.7.0',
        name: 'v1.7.0: Glassmorphism and Backdrop Blur Engine',
        body: 'Hardware-accelerated blurred backgrounds and neon gradients.',
        draft: false,
        prerelease: false,
        created_at: '2026-06-20T10:00:00Z',
        published_at: '2026-06-20T11:00:00Z',
        html_url: '#',
        assets: [
          {
            id: 2002,
            name: 'pulse-ui-tokens-v1.7.0.tgz',
            size: 3900000,
            download_count: 35380,
            created_at: '2026-06-20T10:30:00Z',
            updated_at: '2026-06-20T10:30:00Z',
            browser_download_url: '#',
            content_type: 'application/gzip'
          }
        ]
      },
      {
        id: 13,
        tag_name: 'v1.6.0',
        name: 'v1.6.0: Responsive Breakpoint Primitives',
        body: 'Fluid typographic scaling and container query helpers.',
        draft: false,
        prerelease: false,
        created_at: '2026-05-10T09:00:00Z',
        published_at: '2026-05-10T10:00:00Z',
        html_url: '#',
        assets: [
          {
            id: 2003,
            name: 'pulse-ui-tokens-v1.6.0.tgz',
            size: 3600000,
            download_count: 24100,
            created_at: '2026-05-10T09:30:00Z',
            updated_at: '2026-05-10T09:30:00Z',
            browser_download_url: '#',
            content_type: 'application/gzip'
          }
        ]
      }
    ],
    totalDownloads: 108400,
    openPullRequestsCount: 4,
    closedPullRequestsCount: 18,
    mergedPullRequestsCount: 88,
    pullRequests: [],
    openIssuesCount: 12,
    closedIssuesCount: 164,
    issues: [],
    discussionsCount: 28,
    discussionCommentsCount: 210,
    discussions: [],
    commitActivity: generateCommitWeeks(),
    totalCommitsLastYear: 512,
    trafficViews: {
      count: 29400,
      uniques: 9800,
      views: [
        { timestamp: '2026-08-20T00:00:00Z', count: 2400, uniques: 850 },
        { timestamp: '2026-08-21T00:00:00Z', count: 2600, uniques: 910 },
        { timestamp: '2026-08-22T00:00:00Z', count: 1800, uniques: 620 },
        { timestamp: '2026-08-23T00:00:00Z', count: 1500, uniques: 510 },
        { timestamp: '2026-08-24T00:00:00Z', count: 2750, uniques: 980 }
      ]
    },
    languages: {
      TypeScript: 640000,
      CSS: 120000,
      HTML: 40000
    },
    contributors: [
      { id: 1, login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', contributions: 340, html_url: 'https://github.com/octodev' },
      { id: 5, login: 'designgeek', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', contributions: 86, html_url: '#' }
    ],
    lastFetched: Date.now()
  },
  103: {
    repo: MOCK_REPOSITORIES[2],
    releases: [
      {
        id: 21,
        tag_name: 'v1.2.0',
        name: 'v1.2.0: Kotlin 2.0 & Jetpack Compose 1.7 Ready',
        body: 'Full compatibility with K2 compiler, state flow extensions, and Room database migrations.',
        draft: false,
        prerelease: false,
        created_at: '2026-07-28T09:00:00Z',
        published_at: '2026-07-28T10:00:00Z',
        html_url: 'https://github.com/octodev/droid-flow/releases/tag/v1.2.0',
        assets: [
          {
            id: 3001,
            name: 'droid-flow-core-1.2.0.aar',
            size: 6100000,
            download_count: 28400,
            created_at: '2026-07-28T09:30:00Z',
            updated_at: '2026-07-28T09:30:00Z',
            browser_download_url: '#',
            content_type: 'application/zip'
          }
        ]
      }
    ],
    totalDownloads: 41200,
    openPullRequestsCount: 2,
    closedPullRequestsCount: 9,
    mergedPullRequestsCount: 46,
    pullRequests: [],
    openIssuesCount: 6,
    closedIssuesCount: 92,
    issues: [],
    discussionsCount: 16,
    discussionCommentsCount: 145,
    discussions: [],
    commitActivity: generateCommitWeeks(),
    totalCommitsLastYear: 320,
    languages: {
      Kotlin: 480000,
      Java: 30000
    },
    contributors: [
      { id: 1, login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', contributions: 240, html_url: '#' }
    ],
    lastFetched: Date.now()
  },
  104: {
    repo: MOCK_REPOSITORIES[3],
    releases: [
      {
        id: 31,
        tag_name: 'v0.9.4',
        name: 'v0.9.4: Multi-cluster cost telemetry',
        body: 'Export real-time Prometheus metrics directly to standard output or Grafana dashboards.',
        draft: false,
        prerelease: false,
        created_at: '2026-08-01T15:00:00Z',
        published_at: '2026-08-01T15:30:00Z',
        html_url: 'https://github.com/octodev/cloud-stat-cli/releases/tag/v0.9.4',
        assets: [
          {
            id: 4001,
            name: 'cloud-stat-linux-amd64.tar.gz',
            size: 14200000,
            download_count: 18200,
            created_at: '2026-08-01T15:15:00Z',
            updated_at: '2026-08-01T15:15:00Z',
            browser_download_url: '#',
            content_type: 'application/gzip'
          }
        ]
      }
    ],
    totalDownloads: 32100,
    openPullRequestsCount: 3,
    closedPullRequestsCount: 5,
    mergedPullRequestsCount: 32,
    pullRequests: [],
    openIssuesCount: 8,
    closedIssuesCount: 48,
    issues: [],
    discussionsCount: 9,
    discussionCommentsCount: 64,
    discussions: [],
    commitActivity: generateCommitWeeks(),
    totalCommitsLastYear: 210,
    languages: {
      Go: 340000,
      Shell: 15000
    },
    contributors: [
      { id: 1, login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', contributions: 180, html_url: '#' }
    ],
    lastFetched: Date.now()
  },
  105: {
    repo: MOCK_REPOSITORIES[4],
    releases: [
      {
        id: 41,
        tag_name: 'v1.1.0',
        name: 'v1.1.0: Multi-agent chain evaluations & RAG metrics',
        body: 'Automated evaluation pipelines for latency, factual hallucination checks, and token cost tracking.',
        draft: false,
        prerelease: false,
        created_at: '2026-08-16T17:00:00Z',
        published_at: '2026-08-16T18:00:00Z',
        html_url: 'https://github.com/octodev/ai-prompt-craft/releases/tag/v1.1.0',
        assets: [
          {
            id: 5001,
            name: 'ai_prompt_craft-1.1.0-py3-none-any.whl',
            size: 2800000,
            download_count: 24500,
            created_at: '2026-08-16T17:30:00Z',
            updated_at: '2026-08-16T17:30:00Z',
            browser_download_url: '#',
            content_type: 'application/x-wheel+zip'
          }
        ]
      }
    ],
    totalDownloads: 58900,
    openPullRequestsCount: 5,
    closedPullRequestsCount: 14,
    mergedPullRequestsCount: 62,
    pullRequests: [],
    openIssuesCount: 14,
    closedIssuesCount: 110,
    issues: [],
    discussionsCount: 22,
    discussionCommentsCount: 198,
    discussions: [],
    commitActivity: generateCommitWeeks(),
    totalCommitsLastYear: 410,
    languages: {
      Python: 520000,
      Jupyter: 80000
    },
    contributors: [
      { id: 1, login: 'octodev', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', contributions: 290, html_url: '#' }
    ],
    lastFetched: Date.now()
  }
};

export function computeMockAggregateStats(selectedIds: number[]): AggregateStats {
  const activeStats = selectedIds
    .map(id => MOCK_DETAILED_STATS[id])
    .filter(Boolean);

  if (activeStats.length === 0) {
    return {
      totalReposTracked: 0,
      totalStars: 0,
      totalForks: 0,
      totalDownloads: 0,
      totalOpenIssues: 0,
      totalClosedIssues: 0,
      totalOpenPRs: 0,
      totalMergedPRs: 0,
      totalClosedPRs: 0,
      totalDiscussions: 0,
      totalDiscussionComments: 0,
      totalCommitsYear: 0,
      totalWatchers: 0,
      totalUniqueContributors: 0,
      topLanguage: 'None',
      mostStarredRepo: null,
      mostDownloadedRepo: null
    };
  }

  let totalStars = 0;
  let totalForks = 0;
  let totalDownloads = 0;
  let totalOpenIssues = 0;
  let totalClosedIssues = 0;
  let totalOpenPRs = 0;
  let totalMergedPRs = 0;
  let totalClosedPRs = 0;
  let totalDiscussions = 0;
  let totalDiscussionComments = 0;
  let totalCommitsYear = 0;
  let totalWatchers = 0;
  const contributorLogins = new Set<string>();
  const languageBytes: Record<string, number> = {};

  let mostStarredRepo: GitHubRepository | null = null;
  let mostDownloadedRepo: { repo: GitHubRepository; downloads: number } | null = null;

  activeStats.forEach(st => {
    totalStars += st.repo.stargazers_count;
    totalForks += st.repo.forks_count;
    totalDownloads += st.totalDownloads;
    totalOpenIssues += st.openIssuesCount;
    totalClosedIssues += st.closedIssuesCount;
    totalOpenPRs += st.openPullRequestsCount;
    totalMergedPRs += st.mergedPullRequestsCount;
    totalClosedPRs += st.closedPullRequestsCount;
    totalDiscussions += st.discussionsCount;
    totalDiscussionComments += st.discussionCommentsCount;
    totalCommitsYear += st.totalCommitsLastYear;
    totalWatchers += st.repo.watchers_count;

    st.contributors.forEach(c => contributorLogins.add(c.login));

    Object.entries(st.languages).forEach(([lang, bytes]) => {
      languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
    });

    if (!mostStarredRepo || st.repo.stargazers_count > mostStarredRepo.stargazers_count) {
      mostStarredRepo = st.repo;
    }

    if (!mostDownloadedRepo || st.totalDownloads > mostDownloadedRepo.downloads) {
      mostDownloadedRepo = { repo: st.repo, downloads: st.totalDownloads };
    }
  });

  const sortedLanguages = Object.entries(languageBytes).sort((a, b) => b[1] - a[1]);
  const topLanguage = sortedLanguages.length > 0 ? sortedLanguages[0][0] : 'N/A';

  return {
    totalReposTracked: activeStats.length,
    totalStars,
    totalForks,
    totalDownloads,
    totalOpenIssues,
    totalClosedIssues,
    totalOpenPRs,
    totalMergedPRs,
    totalClosedPRs,
    totalDiscussions,
    totalDiscussionComments,
    totalCommitsYear,
    totalWatchers,
    totalUniqueContributors: contributorLogins.size,
    topLanguage,
    mostStarredRepo,
    mostDownloadedRepo
  };
}
