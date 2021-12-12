const NAME_PLATE_RENDERER = {
  namePlateWidth: 30,
  renderNameplate: function (p, obj) {
    p.textAlign(p.CENTER);
    p.textSize(7);
    p.push();
    p.translate(obj.x, obj.y);
    p.scale(0.5, 0.5);
    p.text(obj.title, 0, -26);
    p.fill(0, 0, 0);
    p.rect(-16, -23, NAME_PLATE_RENDERER.namePlateWidth, 2);
    p.fill(0, 255, 0);
    p.rect(
      -16,
      -23,
      (obj.hp / obj.maxhp) * NAME_PLATE_RENDERER.namePlateWidth,
      2
    );
    p.pop();
  },
};
export default NAME_PLATE_RENDERER;
