"use client";
import { useEffect, useState } from "react";

// Behind-the-scenes photos. Web-sized copies live in public/BTSimages/web
// (originals in public/BTSimages are too large / HEIC, so they are not loaded directly).
export const btsImages = [
  "dsc00717",
  "dsc00718",
  "dsc00727",
  "dsc00729",
  "dsc00732",
  "dsc01221",
  "lizpaul-dsc06413",
  "lizpaul-dsc06414",
  "lizpaul-dsc06415",
  "lizpaul-dsc06416",
  "lizpaul-dsc06418",
  "lizpaul-dsc06444",
  "lizpaul-dsc06460",
  "lizpaul-dsc06461",
  "lizpaul-dsc06465",
  "nidhika-img_8197",
  "nidhika-img_8201",
  "nidhika-img_8208",
  "nidhika-img_8227",
  "nidhika-img_8246",
  "nidhika-img_8297",
  "nidhika-img_8316",
  "nidhika-img_8329",
  "nidhika-img_8330",
].map((name) => `/BTSimages/web/${name}.jpg`);

// Photos from the same shoot share a file-name prefix ("lizpaul-", "nidhika-"); the rest are one shoot.
const shootOf = (src) => {
  const name = src.split("/").pop();
  return name.includes("-") ? name.split("-")[0] : "studio";
};

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One random attempt: fills the grid row by row, picking for each spot a photo from a different
// shoot than the photo above it and the photo to its left. Returns the cells and how many
// spots had to break that rule.
function tryLayout(images, cols) {
  let remaining = shuffle(images);
  const cells = [];
  let clashes = 0;
  const countLeft = (shoot) => remaining.filter((s) => shootOf(s) === shoot).length;

  for (let i = 0; i < images.length; i++) {
    const left = i % cols > 0 ? shootOf(cells[i - 1]) : null;
    const above = i >= cols ? shootOf(cells[i - cols]) : null;
    let options = remaining.filter((s) => shootOf(s) !== left && shootOf(s) !== above);
    if (!options.length) {
      clashes++;
      options = remaining;
    }
    // Usually take the shoot with the most photos left (so none piles up at the end), sometimes a random one
    const pick =
      Math.random() < 0.7
        ? options.reduce((best, s) => (countLeft(shootOf(s)) > countLeft(shootOf(best)) ? s : best))
        : options[Math.floor(Math.random() * options.length)];
    cells.push(pick);
    remaining = remaining.filter((s) => s !== pick);
  }
  return { cells, clashes };
}

// Random layout where photos from the same shoot are never above/below or beside each other.
// Tries a few random attempts and keeps the first perfect one (or the best one found).
function randomColumns(images, cols) {
  let best = null;
  for (let attempt = 0; attempt < 300; attempt++) {
    const result = tryLayout(images, cols);
    if (!best || result.clashes < best.clashes) best = result;
    if (best.clashes === 0) break;
  }
  const columns = Array.from({ length: cols }, () => []);
  best.cells.forEach((src, i) => columns[i % cols].push(src));
  return columns;
}

// Matches the old CSS breakpoints: 2 columns on mobile, 3 from md, 4 from lg.
function useColumnCount() {
  const [cols, setCols] = useState(null);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCols(lg.matches ? 4 : md.matches ? 3 : 2);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return cols;
}

// Masonry-style grid with a new random order on every page load.
// Each photo keeps its own shape (no cropping, no stretching).
export default function BtsImages({ images = btsImages }) {
  const cols = useColumnCount();
  const [columns, setColumns] = useState(null);

  // Shuffle only in the browser (after mount) so server and client HTML match
  useEffect(() => {
    if (cols) setColumns(randomColumns(images, cols));
  }, [images, cols]);

  if (!columns) return null;

  return (
    <div className="flex gap-2 md:gap-3">
      {columns.map((column, c) => (
        <div key={c} className="flex-1 min-w-0 flex flex-col gap-2 md:gap-3">
          {column.map((src) => (
            <img
              key={src}
              src={src}
              alt="Behind the scenes"
              loading="lazy"
              decoding="async"
              // Same water effect the About page puts on its other images
              style={{ filter: "url(#waterFilter)" }}
              className="w-full h-auto block"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
