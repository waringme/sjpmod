export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const textRow = rows[1];

  // Find the image (could be in <picture> or <p><img>)
  const img = imageRow.querySelector('img');
  if (!img) {
    block.classList.add('no-image');
    return;
  }

  // Create image container for background
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('hero-wealth-image');
  img.loading = 'eager';
  imageContainer.append(img);

  // Create text overlay
  const textOverlay = document.createElement('div');
  textOverlay.classList.add('hero-wealth-overlay');

  // Move text content into overlay
  [...textRow.children].forEach((col) => {
    textOverlay.append(...col.children);
  });

  // Style the last word of h1 as cursive accent
  const h1 = textOverlay.querySelector('h1');
  if (h1) {
    const text = h1.textContent.trim();
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      const mainText = text.substring(0, lastSpace);
      const accentWord = text.substring(lastSpace + 1);
      h1.innerHTML = `${mainText} <span class="hero-wealth-accent">${accentWord}</span>`;
    }
  }

  // Replace block contents
  block.textContent = '';
  block.append(imageContainer, textOverlay);
}
