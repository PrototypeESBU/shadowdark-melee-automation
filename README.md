# Shadowdark Melee Automation README.md

This module is for the Shadowdark RPG system made for the Foundry Virtual Tabletop by Muttley.  [Foundry Package](https://foundryvtt.com/packages/shadowdark).  
It also requires the installation and use of the [Libwrapper](https://foundryvtt.com/packages/lib-wrapper) library.

## What This Module Does
This module adds some automation surrounding melee combat to the core system.  Specifically it will compare an attack roll with all appropriate bonuses applied, to the AC of the targeted token 
and tell you if the attack was a hit, miss, critical hit, or critical miss in a chat card.  If it was a hit or critical hit, it will also display the damage roll for both one-handed and two-handed 
attacks along with 4 buttons to apply the damage (x1), half the damage (x1/2), double the damage (x2), or to Heal the last damage button actually applied.  Clicking one of the damage or heal buttons applies the damage to the target directly.

In order to work as intended, a player must
1.  Have their token selected on the canvas.
2.  Have the token they are performing the attack against TARGETED.
3.  Perform the attack with a melee or ranged weapon as they normally would (eg., clicking in the character sheet or doing something like clicking the proper attack button if you're using the token action hud module).
4.  Apply Damage
- Any player or GM can apply damage to the targeted token.
- Any token can be SELECTED on the canvas
- Whatever token you want to apply the damage to must be TARGETED.
- Click the appropriate one-handed or two-handed damage button (x1, 1/2, x2) to apply the damage to the TARGETED token.
- Click the Heal button to remove whatever damage was last applied.

This was designed to be flexible without alot of extra clicks, and to be able to apply the damage to a different token if the wrong token was originally selected.

## Example Usage
For example, Amber (PC) is surrounded by 4 Orcs.  She double clicks her token to open her sheet and that SELECTS her token on the canvas. Then she hovers her mouse over the 
Orc to her left and hits "T" on her keyboard to target it.  

![image](https://github.com/user-attachments/assets/afd20b01-4e54-46e7-ab2f-6cdeb1edd2c3)

Next, she hovers over "Longsword" in the Melee Attacks section to attack the Orc with that weapon (just as she would attack without this module).  
The normal attack dialog pops up and she adjusts any modifiers if necessary and clicks the Advantage, Normal, or Disadvantage button to attack.

![image](https://github.com/user-attachments/assets/ece18f47-e0b8-49d8-85f9-98f02c6f4871)

The roll commences and the results are displayed on a chat card.  In this case, she HITS!

![image](https://github.com/user-attachments/assets/3ba1ee61-d5ee-4818-8b13-53349beef4dc)

### Attack Results Section of the Chat Card
The card shows the dice formula used for the roll...  in this case 1d20 + 1 + 1 + 1 (eg., 1d20, +1 item bonus, +1 ability bonus, +1 talent bonus).  If it had been with Advantage, it would have been 2d20kh +1+1+1 and Disadvantage 2d20kl +1+1+1.
The card tells you in green if it was a successful hit vs. the target AC or a miss, and will also indicate if it was a Critical Hit or Critical Miss.

### Damage Results Section of the Chat Card
If the attack was a hit, as it was above, a section for One-Handed Damage will be displayed (at a minimum).  This section will show the dice formula used to calculate the damage.  In the above case, the formula was 1d8 (base longsword damage), +4 magical damage, +1 damage for the Mighty talent.  Normally, she would just click the x1 button to apply the damage as shown 
on the chat card as the red number to the Orc she has targeted.  That has all the bonuses/penalties applied from the formula (note that critical hits will automatically double the number of base dice in the formula, 
eg., if this had been a critical hit, the formula would have showed 2d8 +4 +1).  The GM can also be the one that applies the damage, and clicking the other buttons will change the damage accordingly.

If she had made a successful attack with a weapon that can be weilded with two hands, such as a bastard sword, her damage section would have looked more like below;

![image](https://github.com/user-attachments/assets/5dc61e43-786d-4152-baa9-db857a9cf1a9)

The idea is the same as before, if weilded as a 2H for the attack, you would use the buttons in that section.

If she had missed, the damage section will not appear at all.

![image](https://github.com/user-attachments/assets/1a5096b3-dc5f-4372-b2aa-66450c2f11aa)


## What if the Wrong Token was Targeted?
- If you applied damage to that token already, then click the Heal button to remove it, then target the correct token and re-apply the damage.
- If you didn't apply the damage already, then just target the correct token and apply the damage.
- THIS ASSUMES THE SECOND TARGET HAS THE SAME AC AS THE FIRST HAD.  If not, just re-roll the whole attack after you target the correct token.

## What if I Didn't Target a Token or I Had More than 1 Target?
- The module will popup a red error notification in the UI telling you that you must target 1 token.
- If you have multiple targets, only one of them will be used to determine if a hit was made, and you won't know which one was used in the calculation.
- If you have multiple targets selected when you click an apply damage button, same story.  Only one will have the damage applied.

# Personal Note and Disclaimer
I am not a programmer by trade.  I used AI to help get me through some of the concepts I am not familiar with in javascript.  That being said, I have very little time outside of RL to work on this, so feature requests, UI changes, etc., will be as I can find time 
to do them.  I did this because I love the Foundry Virtual Tabletop platform and I really love the Shadowdark RPG system, but this bit of missing automation always irked me.  So, I decided to do something about it :)

# License
This is an independent product published under the Shadowdark RPG Third-Party License and is not affiliated with The Arcane Library, LLC. Shadowdark RPG © 2023 The Arcane Library, LLC. or the Shadowdark RPG for Foundry VTT by Muttley.

The software code that makes up the core of this system is published under the MIT license (see LICENSE.txt).
