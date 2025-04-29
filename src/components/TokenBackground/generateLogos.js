// Helper script to generate placeholder token logos
// Run with Node.js: node generateLogos.js

const fs = require('fs');
const path = require('path');

// Tokens we need logos for
const tokens = [
  'ETH', 'BTC', 'SOL', 'ADA', 'BNB', 'DOT', 'LINK', 'XRP', 
  'AVAX', 'MATIC', 'UNI', 'TRX', 'ATOM', 'LTC', 'NEAR', 'ALGO', 'DOGE', 'ZUNI'
];

// Colors for each token
const colors = {
  ETH: '#627EEA',
  BTC: '#F7931A',
  SOL: '#14F195',
  ADA: '#0033AD',
  BNB: '#F3BA2F', 
  DOT: '#E6007A',
  LINK: '#2A5ADA',
  XRP: '#23292F',
  AVAX: '#E84142',
  MATIC: '#8247E5',
  UNI: '#FF007A',
  TRX: '#FF0013',
  ATOM: '#46509F',
  LTC: '#345D9D',
  NEAR: '#000000',
  ALGO: '#000000',
  DOGE: '#C2A633',
  ZUNI: '#4F46E5',
};

// Target directory
const logosDir = path.join(__dirname, '../../assets/tokens');

// Create directory if it doesn't exist
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Generate a simple HTML file that creates SVG logos
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Token Logo Generator</title>
  <style>
    body { font-family: sans-serif; background: #111; color: white; padding: 20px; }
    .container { display: flex; flex-wrap: wrap; gap: 20px; }
    .token { padding: 10px; text-align: center; }
    .token svg { width: 100px; height: 100px; }
    button { margin-top: 20px; padding: 10px 20px; }
  </style>
</head>
<body>
  <h1>Token Logo Generator</h1>
  <p>Right-click each logo and "Save Image As..." to save as PNG.</p>
  <div class="container">
    ${tokens.map(token => `
      <div class="token">
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="${colors[token]}" stroke="#fff" stroke-width="1" />
          <text x="50" y="55" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">${token}</text>
        </svg>
        <p>${token}</p>
      </div>
    `).join('')}
  </div>
  <button onclick="downloadAll()">Download All Logos</button>

  <script>
    function downloadAll() {
      const tokens = ${JSON.stringify(tokens)};
      tokens.forEach((token, i) => {
        setTimeout(() => {
          const svg = document.querySelector(\`.token:nth-child(\${i + 1}) svg\`);
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement('canvas');
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = function() {
            ctx.drawImage(img, 0, 0);
            const a = document.createElement('a');
            a.download = \`\${token}.png\`;
            a.href = canvas.toDataURL('image/png');
            a.click();
          };
          img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }, i * 300);
      });
    }
  </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, 'tokenLogos.html'), html);

console.log('Generated tokenLogos.html - open it in a browser and use the "Download All Logos" button to generate token logos.');
console.log(`Then move the downloaded logo files to: ${logosDir}`); 