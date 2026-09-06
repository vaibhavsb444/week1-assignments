const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 3005;
const ROOT = path.resolve(__dirname, '..');

// 1. Static file server
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`Local server listening on http://127.0.0.1:${PORT}`);
  await runScreenshots();
});

async function runScreenshots() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = path.join(ROOT, 'screenshots', 'temp_browser');

  const browser = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === 'page' && t.url === 'about:blank') || targets.find((t) => t.type === 'page');

    if (!pageTarget) {
      throw new Error('No page target found');
    }

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((r) => (ws.onopen = r));
    await sendCommand('Page.enable');
    await sendCommand('DOM.enable');

    console.log('Connected to CDP, capturing required screenshots...');

    // 1. Desktop Home Screen (home-desktop.png)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise((r) => setTimeout(r, 2000));
    const homeDesktop = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'home-desktop.png'), Buffer.from(homeDesktop.data, 'base64'));
    console.log('✓ Captured screenshots/home-desktop.png');

    // 1b. Desktop Home Scrolled to About Cards with 3D Parallax Hover
    await sendCommand('Runtime.evaluate', { expression: 'window.scrollTo(0, 1150)' });
    await new Promise((r) => setTimeout(r, 1000));
    await sendCommand('Runtime.evaluate', {
      expression: `
        const aboutCard = document.querySelectorAll('.about-card')[1] || document.querySelector('.about-card');
        if (aboutCard) {
          aboutCard.classList.add('is-tilting');
          const rect = aboutCard.getBoundingClientRect();
          aboutCard.style.setProperty('--mouse-x', (rect.width * 0.75).toFixed(1) + 'px');
          aboutCard.style.setProperty('--mouse-y', (rect.height * 0.35).toFixed(1) + 'px');
          const evt = new MouseEvent('mousemove', {
            clientX: rect.left + rect.width * 0.75,
            clientY: rect.top + rect.height * 0.35,
            bubbles: true
          });
          aboutCard.dispatchEvent(evt);
        }
      `
    });
    await new Promise((r) => setTimeout(r, 800));
    const homeAbout = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'home-about-parallax.png'), Buffer.from(homeAbout.data, 'base64'));
    console.log('✓ Captured screenshots/home-about-parallax.png');

    // 1c. Desktop Home Scrolled to Featured Projects with 3D Parallax & Colorful Aura Hover
    await sendCommand('Runtime.evaluate', { expression: 'window.scrollTo(0, 2600)' });
    await new Promise((r) => setTimeout(r, 1000));
    await sendCommand('Runtime.evaluate', {
      expression: `
        const projCard = document.querySelectorAll('.project-card')[1] || document.querySelector('.project-card');
        if (projCard) {
          projCard.classList.add('is-tilting');
          const rect = projCard.getBoundingClientRect();
          projCard.style.setProperty('--mouse-x', (rect.width * 0.72).toFixed(1) + 'px');
          projCard.style.setProperty('--mouse-y', (rect.height * 0.38).toFixed(1) + 'px');
          const evt = new MouseEvent('mousemove', {
            clientX: rect.left + rect.width * 0.72,
            clientY: rect.top + rect.height * 0.38,
            bubbles: true
          });
          projCard.dispatchEvent(evt);
        }
      `
    });
    await new Promise((r) => setTimeout(r, 800));
    const homeProjects = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'home-projects-parallax.png'), Buffer.from(homeProjects.data, 'base64'));
    console.log('✓ Captured screenshots/home-projects-parallax.png');

    // 2. Mobile View of Homepage (home-mobile.png)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise((r) => setTimeout(r, 2000));
    const homeMobile = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'home-mobile.png'), Buffer.from(homeMobile.data, 'base64'));
    console.log('✓ Captured screenshots/home-mobile.png');

    // 2b. Mobile Scrolled to Portrait Card (home-mobile-portrait.png)
    await sendCommand('Runtime.evaluate', { expression: 'window.scrollTo(0, 520)' });
    await new Promise((r) => setTimeout(r, 1500));
    const homeMobilePortrait = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'home-mobile-portrait.png'), Buffer.from(homeMobilePortrait.data, 'base64'));
    console.log('✓ Captured screenshots/home-mobile-portrait.png');

    // 3. Projects Page with Parallax Hover View (projects-section.png)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/projects.html` });
    await new Promise((r) => setTimeout(r, 2000));
    await sendCommand('Runtime.evaluate', { expression: 'window.scrollTo(0, 350)' });
    await new Promise((r) => setTimeout(r, 800));
    await sendCommand('Runtime.evaluate', {
      expression: `
        const pCard = document.querySelectorAll('.project-card')[1] || document.querySelector('.project-card');
        if (pCard) {
          const rect = pCard.getBoundingClientRect();
          const evt = new MouseEvent('mousemove', {
            clientX: rect.left + rect.width * 0.70,
            clientY: rect.top + rect.height * 0.32,
            bubbles: true
          });
          pCard.dispatchEvent(evt);
        }
      `
    });
    await new Promise((r) => setTimeout(r, 800));
    const projectsSection = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'projects-section.png'), Buffer.from(projectsSection.data, 'base64'));
    console.log('✓ Captured screenshots/projects-section.png');

    // 4. About View (about-desktop.png)
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/about.html` });
    await new Promise((r) => setTimeout(r, 2000));
    const aboutDesktop = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'about-desktop.png'), Buffer.from(aboutDesktop.data, 'base64'));
    console.log('✓ Captured screenshots/about-desktop.png');

    // 5. Tablet View (home-tablet.png)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 820,
      height: 1180,
      deviceScaleFactor: 1.5,
      mobile: true,
    });
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise((r) => setTimeout(r, 2000));
    const homeTablet = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'home-tablet.png'), Buffer.from(homeTablet.data, 'base64'));
    console.log('✓ Captured screenshots/home-tablet.png');

    // 6. Contact View (contact-view.png)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact.html` });
    await new Promise((r) => setTimeout(r, 2000));
    const contactView = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ROOT, 'screenshots', 'contact-view.png'), Buffer.from(contactView.data, 'base64'));
    console.log('✓ Captured screenshots/contact-view.png');

    const artifactDir = 'C:\\\\Users\\\\VaibhaVSB\\\\.gemini\\\\antigravity-ide\\\\brain\\\\2b0501c6-fd34-4296-8296-6531d1a4858a';
    if (fs.existsSync(artifactDir)) {
      const screenFiles = fs.readdirSync(path.join(ROOT, 'screenshots')).filter(f => f.endsWith('.png'));
      screenFiles.forEach(file => {
        fs.copyFileSync(path.join(ROOT, 'screenshots', file), path.join(artifactDir, file));
      });
      console.log('✓ Synced screenshots to brain artifact directory');
    }

    ws.close();
  } catch (err) {
    console.error('Screenshot error:', err);
  } finally {
    browser.kill();
    server.close();
    try {
      if (fs.existsSync(userDataDir)) {
        fs.rmSync(userDataDir, { recursive: true, force: true });
      }
      const testDir = path.join(ROOT, 'screenshots', 'temp_test');
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    } catch (e) {}
    console.log('Finished capturing all required portfolio screenshots.');
    process.exit(0);
  }
}
