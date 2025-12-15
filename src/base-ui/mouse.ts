
export const gMouse = {
  down: false,
  downPos: {
    'x': 0,
    'y': 0,
  }
};
window.addEventListener('mousedown', (e) => {
  gMouse.down = true;
  gMouse.downPos.x = e.clientX;
  gMouse.downPos.y = e.clientY;
});
window.addEventListener('mouseup', (e) => {
  gMouse.down = false;
});
