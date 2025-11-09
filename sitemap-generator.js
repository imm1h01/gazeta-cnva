const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://gazetacnva.ro';

const routes = ['/', '/despre-noi', '/texte', '/contact'];

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n') +
  '\n</urlset>';

const outputPath = path.join(__dirname, 'public', 'sitemap.xml');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log('Sitemap generat cu succes la:', outputPath);
