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
var MODULE = {
	TITLE	: 'Nice(TSY) Cypher System Add-ons',
	NAME 	: 'nice-cypher-add-ons',
	PATH 	: '/modules/nice-cypher-add-ons'
};

export {MODULE};

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
/** 
 * @description Register the module settings
 * @export
 */
export function registerGameSettings() {
	// Settings for showing a GM intrusion dialog (default: true)
	game.settings.register(MODULE.NAME, 'gmintrusion', {
		name: game.i18n.localize('NICECYPHER.SettingsGMiTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsGMiHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
	
	// Settings for auto obfuscate object (default: true)
	game.settings.register(MODULE.NAME, 'autoobfuscate', {
		name: game.i18n.localize('NICECYPHER.SettingsObfuscateTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsObfuscateHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
	
	// Settings for auto level roll (default: true)
	game.settings.register(MODULE.NAME, 'autoroll', {
		name: game.i18n.localize('NICECYPHER.SettingsLevelRollTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsLevelRollHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
	
	// Settings for showing a trade button on actor sheet (default: true)
	game.settings.register(MODULE.NAME, 'showtradeonsheet', {
		name: game.i18n.localize('NICECYPHER.SettingsTradeButtonTitle'),
		hint: game.i18n.localize('NICECYPHER.SettingsTradeButtonHint'),
		scope: 'world',
		config: true,
		default: true,
		type: Boolean,
		onChange: () => location.reload(),
	});
};