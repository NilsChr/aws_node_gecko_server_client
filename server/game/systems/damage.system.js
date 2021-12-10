export default function DAMAGE_SYSTEM(attacker, defender) {
  let dmg = attacker.stats.power;
  console.log(`${attacker.id} attacks ${defender.id} for ${dmg} dmg`);
  defender.stats.hp -= dmg;

  //defender.dead = defender.stats.hp <= 0;
  let defenderDied = defender.stats.hp <= 0;
  if (defenderDied) {
    defender.onDeath();
  }
  return defenderDied;
}
