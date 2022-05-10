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

/*============================================ DISCLAIMER ============================================

	A big part of this script was made by gonzaPaEst (https://github.com/gonzaPaEst/) and I used it
	as a template. I rewritten part of it and some of the HTML, But the felling	and the original
	belong to him. If you use it please include him in your credential as well:
	
							MIT License - Copyright (c) 2021 gonzaPaEst

====================================================================================================*/

'use strict';

/*------------------------------------------------------------------------------------------------
------------------------------------------- Class(es) --------------------------------------------
------------------------------------------------------------------------------------------------*/
/**
 * @description Hold important data for the module
 * @export
 * @class CYPHERADDONS
 */
export class CYPHERADDONS {
	// Module info
	static MODULE = {
		TITLE: 'Nice(TSY) Cypher System Add-ons',
		NAME: 'nice-cypher-add-ons',
		PATH: '/modules/nice-cypher-add-ons',
		WORLD: ''
	};

	// Module settings
	static SETTINGS = {
		GMINTRUSION: true,
		AUTOOBFUSCATE: true,
		AUTOROLL: true,
		TRADEBUTTON: true,
		CREATIONTOOL: true
		// lightweaponeased: true,	// TODO: Potentially in a new version
		// changechatcard: true		// TODO: Potentially in a new version
	};

	// Name of items which level will be rolled
	static NUMENERAITEMS = [
		'cypher',
		'artifact'
	];

	// Flags used by some modules
	static FLAGS = {
		CREATIONITEM: 'creation-item',
		ORIGINALSKILLLEVEL: 'original-skill-level',
		ORIGINALQUANTITY: 'original-quantity'
	};

	// Init the settings
	static init() {
		registerModuleSettings();

		CYPHERADDONS.MODULE.WORLD = game.world.name;
		for (let s in CYPHERADDONS.SETTINGS) CYPHERADDONS.SETTINGS[s] = game.settings.get(CYPHERADDONS.MODULE.NAME, s);
	};
};

/**
 * @description The dialog used to show all the configurable options
 * @class cypherAddOnsConfigDialog
 * @extends {FormApplication}
 */
class cypherAddOnsConfigDialog extends FormApplication {
	static get defaultOptions() {
		const defaults = super.defaultOptions,
			overrides = {
				width: 600,
				height: "auto",
				id: "cypher-add-ons-config",
				template: `${CYPHERADDONS.MODULE.PATH}/templates/add_ons_config.html`,
				title: CYPHERADDONS.MODULE.TITLE,
				userId: game.userId,
				closeOnSubmit: true
			};

		return foundry.utils.mergeObject(defaults, overrides);
	};

	getData(options) {
		return this.reset ?
			{
				useGmIntrusion: true,
				useAutoObfuscate: true,
				useAutoRoll: true,
				useTradeButton: true,
				useCreationTool: true
			} :
			{
				useGmIntrusion: SettingsForm.getUseGmIntrusion(),
				useAutoObfuscate: SettingsForm.getUseAutoObfuscate(),
				useAutoRoll: SettingsForm.getUseAutoRoll(),
				useTradeButton: SettingsForm.getUseTradeButton(),
				useCreationTool: SettingsForm.getUseCreationTool()
			};
	};

	// resets values for custom sheet settings
	activateListeners(html) {
        super.activateListeners(html);
        html.find('button[name="reset"]').click(this.onReset.bind(this));
        this.reset = false;
        
        html.find('#mcg-accordion-card').click(function() {
            let mcgStatement = $('#mcg-accordion-card .card-body');
            $('#mcg-accordion-card .card-title .fas').toggleClass("arrow-down");

            if(mcgStatement.css('display') == 'block') {
                mcgStatement.slideUp();
            } else {
                $('.card-body').slideUp();
                mcgStatement.slideDown();
            }
        });
    };

	onReset() {
		this.reset = true;
		this.render();
	};

	// gets data from HTML form
	async _updateObject(e, formData) {
		SettingsForm.setUseGmIntrusion(formData.useGmIntrusion);
		SettingsForm.setUseAutoObfuscate(formData.useAutoObfuscate);
		SettingsForm.setUseAutoRoll(formData.useAutoRoll);
		SettingsForm.setUseTradeButton(formData.useTradeButton);
		SettingsForm.setUseCreationTool(formData.useCreationTool);
	};
};

class SettingsForm {
	static getUseGmIntrusion() {
		return game.settings.get(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[0]);
	};
	static setUseGmIntrusion(value) {
		game.settings.set(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[0], value);
	}

	static getUseAutoObfuscate() {
		return game.settings.get(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[1]);
	};
	static setUseAutoObfuscate(value) {
		game.settings.set(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[1], value);
	}

	static getUseAutoRoll() {
		return game.settings.get(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[2]);
	};
	static setUseAutoRoll(value) {
		game.settings.set(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[2], value);
	}

	static getUseTradeButton() {
		return game.settings.get(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[3]);
	};
	static setUseTradeButton(value) {
		game.settings.set(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[3], value);
	}

	static getUseCreationTool() {
		return game.settings.get(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[4]);
	};
	static setUseCreationTool(value) {
		game.settings.set(CYPHERADDONS.MODULE.NAME, Object.keys(CYPHERADDONS.SETTINGS)[4], value);
	}
};

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
/** 
 * @description Register the module settings
 */
function registerModuleSettings() {
	// Settings menu
	game.settings.registerMenu(CYPHERADDONS.MODULE.NAME, CYPHERADDONS.MODULE.NAME, {
		name: game.i18n.localize('NICECYPHER.SettingsMenuTitle'),
		label: game.i18n.localize('NICECYPHER.SettingsMenuLabel'),
		hint: game.i18n.localize('NICECYPHER.SettingsMenuHint'),
		icon: "fas fa-user-cog",
		type: cypherAddOnsConfigDialog,
		restricted: true
	});

	// Register all settings
	Object.keys(CYPHERADDONS.SETTINGS).forEach(k => {
		game.settings.register(CYPHERADDONS.MODULE.NAME, k, {
			name: game.i18n.localize(`NICECYPHER.Settings${k}Title`),
			hint: game.i18n.localize(`NICECYPHER.Settings${k}Hint`),
			scope: 'world',
			config: false,
			default: true,
			type: Boolean,
			onChange: () => setTimeout(() => {
				location.reload();
			}, 1000)
		});
	});
};