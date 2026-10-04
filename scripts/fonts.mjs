import {writeFile,readdir,unlink} from 'node:fs/promises';
const dir=new URL('../public/fonts/',import.meta.url);
const css=await(await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=Manrope:wght@400..800&display=swap',{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'}})).text();
const blocks=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(x=>x[1]);if(blocks.length!==2)throw new Error('Expected two Latin variable fonts');
let output='';for(let i=0;i<blocks.length;i++){const url=blocks[i].match(/url\(([^)]+)\)/)[1];const name=i===0?'dm-sans-latin.woff2':'manrope-latin.woff2';const r=await fetch(url);if(!r.ok)throw new Error('Font download failed');await writeFile(new URL(name,dir),Buffer.from(await r.arrayBuffer()));output+=blocks[i].replace(url,`/fonts/${name}`)+'\n';}
await writeFile(new URL('fonts.css',dir),output);
for(const name of await readdir(dir))if(/^font-\d+\.ttf$/.test(name))await unlink(new URL(name,dir));
for(const [font,sub] of [['DM-Sans','dmsans'],['Manrope','manrope']]){const r=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${sub}/OFL.txt`);if(!r.ok)throw new Error('License download failed');await writeFile(new URL(`${font}-OFL.txt`,dir),await r.text());}console.log('Two local variable WOFF2 fonts and licenses saved.');

