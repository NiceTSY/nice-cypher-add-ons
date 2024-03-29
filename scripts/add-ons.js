/*	
	Those scripts are aimed solely for the Cypher Systems on FoundryVTT made by Mrkwnzl and will
	probably (totally in fact) not work with any other systems.
	
	Those add-ons could be totally added directly inside the Cypher System at a later date
	All of them are well-commented/documented and normally kept as understandable as possible for 
	anyone to pick them and modify/patch them as they wish.
	I have no business in keeping anything obfuscated and blind. My main thoughts are that everyone
	has to start somewhere and understanding other code is one way to do so. With this, I aim to
	keep those different scripts as light as possible.
	
	Moreover, all of my scripts are totally free to use, modify, etc. as they are under the BSD-3-Clause
	license. I just ask for you to try to keep the same scope as me and if possible, a little credit is 
	always appreciated ;)
	Also, feel free to make a pull request! I will be more than happy to see what are your QOL too!
	
	However, everyone has his/her/its/their own way to code and mine is mine, so if you were not able
	to understand something, please feel free to ask me on Discord.
	
	This is my structure:
	- 'Globales' are var used everywhere in this js and do not need to be re-made each time
	- 'Classes' are either specific or custom classes used for scripts
	- 'Handlers' are scripts that handle (or hook) specific events
	- 'Functions' are functions either called by handlers or anywhere else, they hold most of my scripts
	- 'Utilities' are scripts to do small calculation across other functions
	
	Cheers,
	Nice to see you (NiceTSY)
*/

'use strict';
import { CYPHERADDONS } from "./settings.js";
import { UTILITIES } from "./utilities.js";
import { addTradeButton, receiveTrade, endTrade, denyTrade, alreadyTrade } from "./module_trade.js";
import { checkJournalType, checkIfLinkedData } from "./module_creation.js";
import { addItemToActor } from "./actor_add_items.js";

/*------------------------------------------------------------------------------------------------
------------------------------------------- Handler(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
// Called when the module is initialised
Hooks.once('init', () => {
	// Register settings
	CYPHERADDONS.init();
});

Hooks.on('preCreateItem', async (document, data, options, userId) => {
	// Handling to do automatic sorting when adding Items to Actors.
	CYPHERADDONS.getSettings();
	if (CYPHERADDONS.SETTINGS.SORTITEMS && document.parent instanceof Actor) addItemToActor(document);
})

// Called when the module is setup
Hooks.once('setup', async () => {
	game.socket.on(`module.${CYPHERADDONS.MODULE.NAME}`, packet => {
		let data = packet.data;
		data.receiver   = game.actors.get(packet.receiverId);
		data.trader     = game.actors.get(packet.traderId);
		data.traderUserId = packet.traderUserId;
		switch (packet.type) {
			case 'requestTrade':
				if (packet.traderUserId != game.user.id && data.receiver.isOwner && (!game.user.isGM || !data.receiver.hasPlayerOwner)) receiveTrade(data, packet.traderUserId);
				break;
			case 'acceptTrade': 
				if (packet.traderUserId == game.user.id) endTrade(data);
				break;
			case 'refuseTrade':
				if (packet.traderUserId == game.user.id) denyTrade(data);
				break;
			case 'possessItem':
				if (packet.traderUserId == game.user.id) alreadyTrade(data);
				break;
		}
	});
});

// Called when rendering the token HUD
Hooks.on('renderTokenHUD', async (hud, html, token) => {
	CYPHERADDONS.getSettings();
	if (CYPHERADDONS.SETTINGS.GMINTRUSION)
		if (game.user.isGM) showHUDGmIntrusion(html, token);
});

// Called before a new item is created on character sheet
Hooks.on('preCreateItem', async (data, item) => {
	const object = data._source;

	CYPHERADDONS.getSettings();
	if (CYPHERADDONS.NUMENERAITEMS.includes(item.type.toLowerCase())) {
		if (CYPHERADDONS.SETTINGS.AUTOROLL) object.system.basic.level = rollLevelOfObject(object).toString();
	};
});

// Called when dropping something on the character sheet
Hooks.on('dropActorSheetData', async (actor, html, item) => {
	CYPHERADDONS.getSettings();
	if ((item.type.toLowerCase() === 'journalentry' || item.type.toLowerCase() === 'journalentrypage') && actor.type === "pc")
		if (CYPHERADDONS.SETTINGS.SENTENCELINK) checkJournalType(actor, html, item);
});

// Called opening the character sheet
Hooks.on('renderCypherActorSheet', (sheet, html) => {
	CYPHERADDONS.getSettings();
	if (CYPHERADDONS.SETTINGS.SHOWTRADE) addTradeButton(html, sheet.actor);
	if (sheet.actor.type === "pc")
		if (CYPHERADDONS.SETTINGS.SENTENCELINK) checkIfLinkedData(html, sheet.actor);
});

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
/** 
 * @description Show a new entry on the token HUD for GM intrusion on PC.
 * @param { Object } html 	- The HTML of the HUD.
 * @param { Object } token 	- The token rendering the HUD.
 */
async function showHUDGmIntrusion(html, token) {
	// Check if the token is a PC
	let actor = game.actors.get(token.actorId);
	if (!actor || actor.type.toLowerCase() != 'pc') return;

	// Get the new HUD button template
	let gmiDisplay = await renderTemplate(`${CYPHERADDONS.MODULE.PATH}/templates/gmi_hud.html`);

	// Push the new HUD option and if clicked send the GMi chat card
	html.find('div.right').append(gmiDisplay).click((e) => {
		const gmiButton = e.target.parentElement.classList.contains('gmi-hud-icon');
		if (gmiButton) game.cyphersystem.proposeIntrusion(actor);
	});
};

/** 
 * @description Automatically roll if possible the level or return the default level value.
 * @param 	{ Object } obj - The object that contains a level to roll.
 * @return 	{ (String / Number) }
 */
function rollLevelOfObject(obj) {
	try {
		const roll = new Roll(obj.system.basic.level).evaluate({ async: false });
		if (roll) return roll._total;
	} catch (e) {
		return obj.level;
	};
};