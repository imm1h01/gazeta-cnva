const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const BASE_URL = 'https://gazetacnva.ro';

const links = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/despre-noi', changefreq: 'monthly', priority: 0.8 },
  { url: '/texte', changefreq: 'weekly', priority: 0.9 },
  { url: '/contact', changefreq: 'yearly', priority: 0.6 },
];

const sitemap = new SitemapStream({ hostname: BASE_URL });

streamToPromise(sitemap)
  .then((data) => {
    require('fs').writeFileSync('./public/sitemap.xml', data.toString());
    console.log('Sitemap generat cu succes!');
  })
  .catch(console.error);

links.forEach((link) => sitemap.write(link));
sitemap.end();
