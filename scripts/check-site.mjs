import assert from 'node:assert/strict';
const origin=process.argv[2]||'http://127.0.0.1:4173';
const sitemap=await(await fetch(`${origin}/sitemap.xml`)).text();
const paths=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
assert.ok(paths.length>=48,'Complete sitemap');
const assets=new Set();
const links=new Set();
for(let start=0;start<paths.length;start+=6){await Promise.all(paths.slice(start,start+6).map(async path=>{const res=await fetch(origin+path);assert.equal(res.status,200,`${path} status`);const html=await res.text();assert.ok(/<h1[ >]/.test(html),`${path} pre-rendered heading`);assert.ok(/<title>[^<]*RealEstate.co<\/title>/.test(html),`${path} title`);assert.ok(/rel="canonical"/.test(html),`${path} canonical`);assert.ok(/property="og:image"/.test(html),`${path} social image`);assert.ok(!html.includes('lorem ipsum'));for(const m of html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)){if(m[1].startsWith('/images/')||m[1].startsWith('/assets/')||m[1].startsWith('/fonts/')||m[1].includes('favicon'))assets.add(m[1]);else links.add(m[1]);}if(path.includes('/properties/')){const og=html.match(/property="og:title"\s+content="([^"]+)/)?.[1];assert.ok(og&&!og.includes('clearer way'),`${path} property-specific OG title`);}}));}
for(const path of assets){const res=await fetch(origin+path,{method:'HEAD'});assert.equal(res.status,200,`Asset ${path}`);}
for(const path of links)assert.ok(paths.includes(path),`Known navigation route ${path}`);
assert.equal((await fetch(origin+'/this-page-does-not-exist')).status,404,'404 status');
assert.equal((await fetch(origin+'/api/enquiries')).status,405,'Read access disabled');
assert.equal((await fetch(origin+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({name:'No consent'})})).status,400,'Invalid input rejected');
assert.equal((await fetch(origin+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://invalid.example'},body:'{}'})).status,403,'Cross-origin request rejected');
console.log(JSON.stringify({origin,routes:paths.length,assets:assets.size,navigationTargets:links.size,checks:'All routes, metadata, image and code assets, links, 404, and API rejection checks passed.'},null,2));
