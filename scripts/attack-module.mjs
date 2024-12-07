// attack-module.mjs
console.log("shadowdark-melee-automation module code loading...");

Hooks.once('ready', () => {
  // Check if CONFIG.DiceSD.Roll exists
  if (typeof CONFIG.DiceSD?.Roll === 'function') {
    libWrapper.register(
      'shadowdark-melee-automation',
      'CONFIG.DiceSD.Roll',
      async function (wrapped, parts, data, $form, adv=0, options={}) {
        // Prevent the original roll method from posting a chat card.
        options.chatMessage = false;

        // Call the original Roll method to get the roll result, but no chat message is created.
        const rollResult = await wrapped(parts, data, $form, adv, options);
        //console.log("Roll Result:", rollResult);

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

        // Assign values to the variables that will be used
        const attackWeaponName = rollResult.item?.name;
        const damageOneHanded = rollResult.rolls?.primaryDamage?.roll?.total;
        const damageTwoHanded = rollResult.rolls?.secondaryDamage?.roll?.total || 0;
        const oneHandedDiceFormula = rollResult.rolls?.primaryDamage?.roll?.formula;
        const twoHandedDiceFormula = rollResult.rolls?.secondaryDamage?.roll?.formula || "n/a";
        const attackRollFormula = rollResult.rolls?.main?.roll?.formula;
        const attackRollTotal = rollResult.rolls?.main?.roll?.total;
        const criticalValue = rollResult.rolls?.main?.critical;
        const isCriticalHit = (criticalValue === "success");
        const isCriticalMiss = (criticalValue === "failure");
        //console.log(`Roll: ${attackRollTotal}, Target AC: ${targetAC}`);

        const isHit = attackRollTotal >= targetAC;
        //console.log(isHit ? "Hit!" : "Miss!");

        // Construct a custom chat card.
        let customContent = `
            <div style="font-family: 'Old Newspaper Font'; font-size: 20px; margin: 0;border: 1px solid black; border-radius: 8px; background-color: black; padding: 10px; color: white;">
                <span style="text-align: center;">Attack Result for ${attackWeaponName}</span>
                <hr>
                <p>Formula: ${attackRollFormula}</p>
                <p>Attack Roll: <span style="font-size: 30px; color: ${isHit ? 'green' : 'red'};">${attackRollTotal} ( ${isHit ? "Hit!" : "Miss!"} )</span></p>               
                ${isCriticalHit ? `<p style="font-size: 30px; color: green; margin: 0; text-align: center;"><strong>CRITICAL HIT</strong></p>` : ""}
                ${isCriticalMiss ? `<p style="font-size: 30px; color: red; margin: 0; text-align: center;"><strong>CRITICAL MISS</strong></p>` : ""}
            </div>
        `;
        if (isHit) {
            customContent += `
                <p><strong>One-Handed Damage</strong></p>
                <p><strong>Formula: ${oneHandedDiceFormula}</p>
                <p>Result: <span style="font-size: 30px; color: red;">${damageOneHanded}</span></p>
                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="apply-damage" data-damage="${damageOneHanded}">x1</button>
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="apply-half-damage" data-damage="${Math.floor(damageOneHanded / 2)}">1/2</button>
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="apply-double-damage" data-damage="${damageOneHanded * 2}">x2</button>
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="heal-damage">Heal</button>
                </div>
                `;
                if (damageTwoHanded > 0) {
                customContent += `
                <hr>
                <p><strong>Two-Handed Damage</strong></p>
                <p><strong>Formula: ${twoHandedDiceFormula}</p>
                <p>Result: <span style="font-size: 30px; color: red;">${damageTwoHanded}</span></p>
                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="apply-damage" data-damage="${damageTwoHanded}">x1</button>
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="apply-half-damage" data-damage="${Math.floor(damageTwoHanded / 2)}">1/2</button>
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="apply-double-damage" data-damage="${damageTwoHanded * 2}">x2</button>
                    <button style="font-size: .8em; border: 2px solid black; color: solid black; padding: 5px 8px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-action="heal-damage">Heal</button>
                </div>
                `;
            }
        }

        // Determine the speaker for the header of the chat card.
        let speaker = { alias: game.user.name };
        if (data?.actor) {
          speaker = ChatMessage.getSpeaker({ actor: data.actor });
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
      },
      'WRAPPER'
    );
  } else {
    console.warn("Shadowdark-Melee-Automation: CONFIG.DiceSD.Roll not found or not a function.");
  }
});

let lastAppliedDamage = 0;

// Add a hook to listen for rendering of chat messages, and attach event handlers
Hooks.on("renderChatMessage", (message, html, data) => {
    // Only add listeners if this message was created by our module
    const flags = message.flags["shadowdark-melee-automation"];
    if (!flags?.targetActorId) return;
  
    html.on('click', '[data-action]', async (event) => {
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
      if (action === "apply-damage" || action === "apply-half-damage" || action === "apply-double-damage") {
        await applyDamageToActor(targetActor, damage);
      } else if (action === "heal-damage") {
        await healActor(targetActor, damage);
      }
    });
  });
  
  
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