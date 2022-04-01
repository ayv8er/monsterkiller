const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 15;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_PLAYER_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_ATTACK = "PLAYER_ATTACK";
const LOG_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_HEAL = "PLAYER_HEAL";
const LOG_GG = "GAME_OVER";

const battleLog = [];

const enteredValue = prompt(
  "Enter maximum health points for you and the monster.",
  "100"
);

let chosenMaxLife = +enteredValue;

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let logCount;
let hasBonusLife = true;
let playerStrongAttacks = 3;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  battleLog.push({
    event: event,
    value: value,
    monsterHealth: monsterHealth,
    playerHealth: playerHealth,
  });
}

function checkMonsterHealth() {
  if (currentMonsterHealth <= 0) {
    alert("You slayed the monster!");
    reset();
    return true;
  }
}

function checkPlayerHealth() {
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    setPlayerHealth(chosenMaxLife);
    currentPlayerHealth = chosenMaxLife;
    alert("You've been revived!");
  } else if (currentPlayerHealth <= 0) {
    alert("The monster will eat you now!");
    reset();
  }
}

function attackPlayer() {
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  logCount = null;
  checkPlayerHealth();
}

function attackMonster(attackMode) {
  let maxDamage;
  let logEvent;
  if (attackMode === MODE_ATTACK) {
    maxDamage = PLAYER_ATTACK_VALUE;
    logEvent = LOG_ATTACK;
  } else {
    if (playerStrongAttacks) {
      playerStrongAttacks -= 1;
      maxDamage = PLAYER_STRONG_ATTACK_VALUE;
      logEvent = LOG_STRONG_ATTACK;
    } else {
      maxDamage = PLAYER_ATTACK_VALUE;
      logEvent = LOG_ATTACK;
    }
  }
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;
  writeToLog(
    logEvent,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (checkMonsterHealth()) {
    return;
  }
  attackPlayer();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
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
  writeToLog(LOG_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
  attackPlayer();
}

function reset() {
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function printLogHandler() {
  if (battleLog.length < 0) {
    console.log("There is no log record");
  } else {
    switch (true) {
      case logCount < 0:
        console.log("This is the end of the log record");
        break;
      case !logCount:
        logCount = battleLog.length - 1;
      case logCount > 0:
        for (let i = logCount - 1; i <= logCount; i++) {
          for (const key in battleLog[i]) {
            console.log(`${key} ==> ${battleLog[i][key]}`);
          }
        }
        logCount -= 2;
    }
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
