export function closeOnBackdrop(dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (
      event.clientX < left || event.clientX > right ||
      event.clientY < top || event.clientY > bottom
    ) dialog.close();
  });
}
