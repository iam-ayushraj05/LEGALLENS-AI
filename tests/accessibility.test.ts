import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Accessibility Audit & WCAG 2.1 AA Verification', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('should verify skip navigation link is present in root layout', () => {
    const layoutPath = path.join(rootDir, 'app', 'layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toContain('href="#main-content"');
    expect(content).toContain('Skip to main content');
    expect(content).toContain('sr-only');
    expect(content).toContain('focus:not-sr-only');
  });

  it('should verify main pages implement <main id="main-content"> landmark', () => {
    const pages = [
      path.join(rootDir, 'app', 'page.tsx'),
      path.join(rootDir, 'app', 'dashboard', 'page.tsx'),
      path.join(rootDir, 'app', 'login', 'page.tsx'),
      path.join(rootDir, 'app', 'signup', 'page.tsx'),
    ];

    pages.forEach(p => {
      const content = fs.readFileSync(p, 'utf-8');
      expect(content).toContain('id="main-content"');
      expect(content).toContain('tabIndex={-1}');
    });
  });

  it('should verify Navbar includes nav landmark, aria-labels, and modal dialog semantics', () => {
    const navbarPath = path.join(rootDir, 'components', 'layout', 'Navbar.tsx');
    const content = fs.readFileSync(navbarPath, 'utf-8');

    expect(content).toContain('aria-label="Main Navigation"');
    expect(content).toContain('role="dialog"');
    expect(content).toContain('aria-modal="true"');
    expect(content).toContain('aria-labelledby="jurisdiction-modal-title"');
    expect(content).toContain('aria-label="Log out of LegalLens AI"');
  });

  it('should verify UploadModal implements role="dialog" and aria-describedby', () => {
    const modalPath = path.join(rootDir, 'components', 'dashboard', 'UploadModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');

    expect(content).toContain('role="dialog"');
    expect(content).toContain('aria-modal="true"');
    expect(content).toContain('aria-labelledby="upload-modal-title"');
    expect(content).toContain('aria-describedby="upload-modal-desc"');
    expect(content).toContain('aria-label="Close document upload dialog"');
  });

  it('should verify DocumentWorkspace implements tablist, tab, tabpanel, and aria-live banner', () => {
    const wsPath = path.join(rootDir, 'components', 'viewer', 'DocumentWorkspace.tsx');
    const content = fs.readFileSync(wsPath, 'utf-8');

    expect(content).toContain('role="tablist"');
    expect(content).toContain('role="tab"');
    expect(content).toContain('aria-selected=');
    expect(content).toContain('role="tabpanel"');
    expect(content).toContain('aria-live="polite"');
  });

  it('should verify SourceCard is an accessible button control with explicit aria-label', () => {
    const scPath = path.join(rootDir, 'components', 'ui', 'SourceCard.tsx');
    const content = fs.readFileSync(scPath, 'utf-8');

    expect(content).toContain('<button');
    expect(content).toContain('type="button"');
    expect(content).toContain('aria-label=');
    expect(content).toContain('focus:ring-2');
  });

  it('should verify ChecklistTab items implement role="checkbox" and aria-checked', () => {
    const clPath = path.join(rootDir, 'components', 'insights', 'ChecklistTab.tsx');
    const content = fs.readFileSync(clPath, 'utf-8');

    expect(content).toContain('role="checkbox"');
    expect(content).toContain('aria-checked=');
    expect(content).toContain('role="progressbar"');
  });

  it('should verify AskTab AI Chat has accessible form label, status, and input id', () => {
    const askPath = path.join(rootDir, 'components', 'insights', 'AskTab.tsx');
    const content = fs.readFileSync(askPath, 'utf-8');

    expect(content).toContain('htmlFor="ask-doc-input"');
    expect(content).toContain('id="ask-doc-input"');
    expect(content).toContain('aria-label="Send question to document AI"');
    expect(content).toContain('aria-live="polite"');
  });
});
