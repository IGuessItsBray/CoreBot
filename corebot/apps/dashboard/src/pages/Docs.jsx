import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // swap this for light theme if needed

import corebotHowTo from '../docs/corebot-how-to.md?raw';
import apiHowTo from '../docs/api-how-to.md?raw';
import apiRoutes from '../docs/api-routes.md?raw';
import apiExamples from '../docs/api-examples.md?raw';
import selfhostQuickstart from '../docs/selfhost-quickstart.md?raw';
import selfHostConfig from '../docs/selfhost-config.md?raw';

const docsMap = {
  'corebot/how': corebotHowTo,
  'api/how': apiHowTo,
  'api/routes': apiRoutes,
  'api/examples': apiExamples,
  'selfhost/quickstart': selfhostQuickstart,
  'selfhost/config': selfHostConfig,
};

const sections = [
  {
    label: 'CoreBot',
    items: [{ id: 'corebot/how', label: 'How to Use' }],
  },
  {
    label: 'API',
    items: [
      { id: 'api/how', label: 'How to Use' },
      { id: 'api/routes', label: 'Routes' },
      { id: 'api/examples', label: 'Examples' },
    ],
  },
  {
    label: 'Self-Hosting',
    items: [
      { id: 'selfhost/quickstart', label: 'Quick Start' },
      { id: 'selfhost/config', label: 'Config Files' },
    ],
  },
];

export default function Docs() {
  const [selected, setSelected] = useState('corebot/how');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: '100vh' }}>
        <aside
          style={{
            width: '240px',
            borderRight: darkMode ? '1px solid #444' : '1px solid #ddd',
            padding: '1rem',
            background: darkMode ? '#111' : '#fafafa',
            color: darkMode ? '#eee' : '#000',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Docs 📘</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              marginBottom: '1rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              borderRadius: '4px',
              border: 'none',
              background: darkMode ? '#333' : '#ddd',
              color: darkMode ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          {sections.map((section) => (
            <div key={section.label} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{section.label}</h3>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    background: selected === item.id ? (darkMode ? '#333' : '#e0e0e0') : 'transparent',
                    fontWeight: selected === item.id ? 'bold' : 'normal',
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </aside>

        <main
          style={{
            padding: '2rem',
            flex: 1,
            overflowY: 'auto',
            background: darkMode ? '#1e1e1e' : '#fff',
            color: darkMode ? '#e0e0e0' : '#000',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                if (inline) {
                  return (
                    <code
                      style={{
                        background: darkMode ? '#333' : '#f4f4f4',
                        padding: '0.2em 0.4em',
                        borderRadius: '4px',
                        fontSize: '0.95em',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <pre
                    style={{
                      background: darkMode ? '#2d2d2d' : '#f4f4f4',
                      padding: '1em',
                      borderRadius: '6px',
                      overflowX: 'auto',
                    }}
                  >
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              a({ node, ...props }) {
                return <a {...props} style={{ color: darkMode ? '#90caf9' : '#1976d2' }} />;
              },
              h1: ({ node, ...props }) => <h1 style={{ fontSize: '2rem', marginTop: '1.5rem' }} {...props} />,
              h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.5rem', marginTop: '1.25rem' }} {...props} />,
              h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.2rem', marginTop: '1rem' }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }} {...props} />,
            }}
          >
            {docsMap[selected] || '# No content'}
          </ReactMarkdown>
        </main>
      </div>
    </>
  );
}