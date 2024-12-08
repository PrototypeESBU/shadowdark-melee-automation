// attack-module.mjs
console.log("shadowdark-melee-automation module code loading...");

const template_files = ["modules/shadowdark-melee-automation/templates/hitResultsCard.hbs"];
let lastAppliedDamage = 0;

Hooks.once('ready', () => {
  // Check if CONFIG.DiceSD.Roll exists
  if (typeof CONFIG.DiceSD?.Roll === 'function') {
    libWrapper.register(
      'shadowdark-melee-automation',
      'CONFIG.DiceSD.Roll',
      async function (wrapped, parts, data, $form, adv=0, options={}) {
        // only replace card if roll message is an attack
        if (data.damageParts) {
            // Prevent the original roll method from posting a chat card.
            options.chatMessage = false;
            // Call the original Roll method to get the roll result, but no chat message is created.
            const rollResult = await wrapped(parts, data, $form, adv, options);
            // display replacement chat card
            return displayAttackMessage(rollResult, data.actor);
        }
        else {
            // let the roll go as normal
            return await wrapped(parts, data, $form, adv, options);
        }
      },
      'WRAPPER'
    );
    loadTemplates(template_files);
  } else {
    console.warn("Shadowdark-Melee-Automation: CONFIG.DiceSD.Roll not found or not a function.");
  }
});

// Add a hook to listen for rendering of chat messages, and attach event handlers
Hooks.on("renderChatMessage", (message, html, data) => {
    // Only add listeners if this message was created by our module
    const flags = message.flags["shadowdark-melee-automation"];
    if (!flags?.targetActorId) return;
    html.on('click', '[data-action]', async (event) => {onButtonClick(event)});
    });

// Button Click Handler
async function onButtonClick(event) {    
    event.preventDefault();
    const button = event.currentTarget;
    const action = button.dataset.action;
    const damage = parseInt(button.dataset.damage, 10) || 0;

    // Retrieve the target actor
    const targetToken = [...game.user.targets][0];
    const targetActor = targetToken.actor;
    if (!targetActor) {
    console.warn("Shadowdark-Melee-Automation: Target actor not found.");
    return;
    }

    // Apply damage or healing based on the action
    switch (action) {
    case  "apply-damage":
        await applyDamageToActor(targetActor, damage);
        break;
    case "apply-half-damage":
        await applyDamageToActor(targetActor, Math.floor(damage/2));
        break;
    case "apply-double-damage":
        await applyDamageToActor(targetActor, damage * 2);
        break
    default:
        await healActor(targetActor, damage);
    }
}

// displays chat message
async function displayAttackMessage(rollResult, actor={}) {

    // Make sure there is a valid target
    const targets = [...game.user.targets];
    //console.log("Targets: ",targets);
    if (targets.length === 0) {
        ui.notifications.error("You must select 1 target.");;
        return rollResult;
    }

    // Get target and their AC
    const targetToken = [...game.user.targets][0];
    const targetActor = targetToken.actor;
    const targetAC = targetActor?.system?.attributes?.ac?.value;

    //calculate attack hit
    const attackRollTotal = rollResult.rolls?.main?.roll?.total;
    const isHit = attackRollTotal >= targetAC;
    const criticalValue = rollResult.rolls?.main?.critical;

    // Calculate attack values used by template 
    const attackData = {
        isHit: isHit,
        hitText: isHit ? "Hit!" : "Miss!",
        isCriticalHit: (criticalValue === "success"),
        isCriticalMiss: (criticalValue === "failure"),
        attackWeaponName: rollResult.item?.name,
        damageOneHanded: rollResult.rolls?.primaryDamage?.roll?.total,
        damageTwoHanded: rollResult.rolls?.secondaryDamage?.roll?.total || 0,
        oneHandedDiceFormula: rollResult.rolls?.primaryDamage?.roll?.formula,
        twoHandedDiceFormula: rollResult.rolls?.secondaryDamage?.roll?.formula || "n/a",
        attackRollFormula: rollResult.rolls?.main?.roll?.formula,
        attackRollTotal: attackRollTotal,
    }

    // Construct a custom chat card from tempate
    const templateFile = "modules/shadowdark-melee-automation/templates/hitResultsCard.hbs"
    let customContent = await renderTemplate(templateFile, attackData);

    // Determine the speaker for the header of the chat card.
    let speaker = { alias: game.user.name };
    if (actor) {
        speaker = ChatMessage.getSpeaker({ actor: actor });
    }

    // Call the custom chat card and flag the targetactor.id so it can be used on rendering.
    ChatMessage.create({
        user: game.user.id,
        speaker: speaker,
        content: customContent,
        flags: {
            "shadowdark-melee-automation": {
            targetActorId: targetActor.id
            }
        }
    });

    return rollResult;
  }

// Helper functions for applying damage and healing
  async function applyDamageToActor(actor, damage) {
    actor.applyDamage(damage,1);
    lastAppliedDamage = damage;
    ui.notifications.info(`${actor.name} takes ${damage} damage!`);
  }
  
  async function healActor(actor, amount) {
    if (lastAppliedDamage === 0) {
        ui.notifications.warn("No damage to heal.");
        return;
    }
    actor.applyDamage(-lastAppliedDamage, 1);
    ui.notifications.info(`${actor.name} heals ${lastAppliedDamage} HP!`);
    lastAppliedDamage = 0;
  }