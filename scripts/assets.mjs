import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
if(process.argv[2]) await sharp(process.argv[2])
  .trim()
  .resize({ height: 1100 })
  .webp({ quality: 88 })
  .toFile("public/images/tower.webp");
const assets = {
  residential: "photo-1600607687920-4e2a09cf159d",
  towers: "photo-1460317442991-0ec209397118",
  interior: "photo-1600210492486-724fe5c67fb0",
  living: "photo-1600566753086-00f18fb6b3ea",
  luxury: "photo-1600607687939-ce8a6c25118c",
  villa: "photo-1613490493576-7fde63acd811",
  land: "photo-1500382017468-9049fed747ef",
  office: "photo-1497366754035-f200968a6e72",
  retail: "photo-1441986300917-64674bd600d8",
  project: "photo-1600585154340-be6161a56a0c",
};
for (const [name, id] of Object.entries(assets)) {
  const res = await fetch(
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`,
  );
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(1100, 760, { fit: "cover" })
    .webp({ quality: 83 })
    .toFile(`public/images/${name}.webp`);
  console.log(name);
}

