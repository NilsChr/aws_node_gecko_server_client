export default function DAMAGE_SYSTEM(attacker, defender) {
  defender.stats.hp -= attacker.stats.power;

  defender.dead = defender.stats.hp <= 0;
  return defender.dead;
};
