function nextScene() {
  const scenes = ['scene1.html', 'scene2.html', 'scene3.html', 'scene4.html', 'scene5.html'];
  const current = window.location.pathname.split('/').pop();
  const index = scenes.indexOf(current);
  if (index < scenes.length - 1) {
    window.location.href = scenes[index + 1];
  }
}