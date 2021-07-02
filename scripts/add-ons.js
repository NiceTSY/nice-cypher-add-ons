/*	
	Those scripts are aimed solely for the Cypher Systems on FoundryVTT made by Mrkwnzl and will
	probably (totally in fact) not work with any other systems.
	
	Those add-ons could be totally added directly inside the Cypher System at a later date
	All of them are well-commented/documented and normally kept as understandable as possible for 
	anyone to pick them and modify/patch them as they wish.
	I have no business in keeping anything obfuscated and blind. My main thoughts are that everyone
	has to start somewhere and understanding other code is one way to do so. With this, I aim to
	keep those different scripts as light as possible.
	
	Moreover, all of my scripts are totally free to use, modify, etc. as they are under the MIT license.
	I just ask for you to try to keep the same scope as me and if possible, a little credit is always
	appreciated ;)
	Also, feel free to make a pull request! I will be more than happy to see what are your QOL too!
	
	However, everyone has his/her/its/their own way to code and mine is mine, so if you were not able
	to understand something, please feel free to ask me on Discord.
	
	This is my structure:
	- 'Globales' are var used everywhere in this js and do not need to be re-made each time
	- 'Handlers' are scripts that handle (or hook) specific events
	- 'Functions' are functions either called by handlers or anywhere else, they hold most of my scripts
	- 'Utilities' are scripts to do small calculation across other functions
	
	Cheers,
	Nice to see you (NiceTSY)
*/

'use strict';

/*------------------------------------------------------------------------------------------------
------------------------------------------- Globale(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
// Hold module name
const 	MODULE_TITLE = 'Nice(TSY) Cypher System Add-ons',
	MODULE_NAME = 'nice-cypher-add-ons',
	MODULE_PATH = '/modules/nice-cypher-add-ons';
		
// Hold world name
var WORLD_NAME = '';

// Hold the settings value
var settings = {
	gmintrusion: true,
	autoobfuscate: true,
	autoroll: true,
	// changechatcard: true
};

// Hold the name of items which level will be rolled
const numeneraItems = [
	'cypher',
	'artifact'
];

/*------------------------------------------------------------------------------------------------
------------------------------------------- Handler(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
// Called when the module is initialised
Hooks.once('init', function () {	
	// CONFIG.debug.hooks = true;
	
	// Get World Name
	WORLD_NAME = game.world.name;
	
	// Register settings
	registerGameSettings();
		
	// Get settings value
	for (let s in settings) settings[s] = game.settings.get(MODULE_NAME, s);
});

// Called when rendering the token HUD
Hooks.on('renderTokenHUD', async (hud, html, token) => {
	if (settings.gmintrusion) {
		if (game.user.isGM) showHUDGmIntrusion(html, token);
	};
});

// Called before a new item is created on charactersheet
Hooks.on('preCreateItem', async (data, item) => {	
	if (doesArrayContains(item.type.toLowerCase(), numeneraItems)) {
		const object = data.data;
		
		if (settings.autoobfuscate) object._source.data.identified = false;
		if (settings.autoroll) object._source.data.level = rollLevelofObject(object.data).toString();
	};
});

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
/** Register the module settings
 */
function registerGameSettings() {
	// Settings for showing a GM intrusion dialog (default: true)
	game.settings.register(MODULE_NAME, 'gmintrusion', {
		name: game.i18n.localize('NICECYPHER.SettingsGMiTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsGMiHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
	
	// Settings for auto obfuscate object (default: true)
	game.settings.register(MODULE_NAME, 'autoobfuscate', {
		name: game.i18n.localize('NICECYPHER.SettingsObfuscateTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsObfuscateHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
	
	// Settings for auto level roll (default: true)
	game.settings.register(MODULE_NAME, 'autoroll', {
		name: game.i18n.localize('NICECYPHER.SettingsLevelRollTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsLevelRollHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
};

/** Show a new entry on the token HUD for GM intrusion on PC.
 * @param { Object } html 	- The HTML of the HUD.
 * @param { Object } token 	- The token rendering the HUD.
 */
async function showHUDGmIntrusion(html, token) {
	// Check if the token is a PC
	let actor = game.actors.get(token.actorId);
	if (!actor || actor.data.type.toLowerCase() != 'pc') return;
	
	/* Currently not needed but I have plan to potentially use it
	
	// Get Actor Owner
	let ownerId = Object.entries(actor.data.permission).filter(e => {
		let [id, perm] = e;
		return (perm >= CONST.ENTITY_PERMISSIONS.OWNER && id != game.user.id)
	}).map(usersPermissions => usersPermissions[0]);
	
	*/
	
	// Get the new HUD button template
	let gmiDisplay = await renderTemplate(`${MODULE_PATH}/templates/gmi_hud.html`);
	
	// Push the new HUD option and if clicked send the GMi chat card
	html.find('div.right').append(gmiDisplay).click((e) => {
		const gmiButton = e.target.parentElement.classList.contains('gmi-hud-icon');		
		if (gmiButton) game.cyphersystem.proposeIntrusion(actor);
	});
};

/** Automatically roll if possible the level or return the default level value.
 * @param 	{ Object } obj - The object that contains a level to roll.
 * @return 	{ (String / Number) }
 */
function rollLevelofObject(obj) {
	try {
		const roll = new Roll(obj.level).evaluate({async: false});
		if (roll) return roll._total;
	} catch (e) {
		return obj.level;
	};
};

/*------------------------------------------------------------------------------------------------
------------------------------------------ Utility(ies) ------------------------------------------
------------------------------------------------------------------------------------------------*/
/**
 * Check if a specific string is contained inside a specified array.
 * @param 	{ String }	s	- The string to find.
 * @param 	{ Object[] }	array	- The array to check.
 * @return 	{ Boolean }
 */
function doesArrayContains(s, array) {
	return (array.indexOf(s) > -1);
};