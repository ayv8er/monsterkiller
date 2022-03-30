const chosenMaxLife = 100;
const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 15;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_PLAYER_VALUE = 20;

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function checkMonsterHealth() {
  if (currentMonsterHealth <= 0) {
    alert("You slayed the monster!");
    return true;
  }
}

function checkPlayerHealth() {
  if (currentPlayerHealth <= 0) {
    alert("The monster will eat you now!");
  }
}

function attackPlayer() {
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  checkPlayerHealth();
}

function attackMonster(attackMode) {
  let maxDamage;
  if (attackMode === "ATTACK") {
    maxDamage = PLAYER_ATTACK_VALUE;
  } else {
    maxDamage = PLAYER_STRONG_ATTACK_VALUE;
  }
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;
  if (checkMonsterHealth()) {
    return;
  }
  attackPlayer();
}

function attackHandler() {
  attackMonster("ATTACK");
}

function strongAttackHandler() {
  attackMonster("STRONG_ATTACK");
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth > chosenMaxLife - HEAL_PLAYER_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_PLAYER_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  attackPlayer();
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
