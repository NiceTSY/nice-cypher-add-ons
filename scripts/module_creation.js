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
import { UTILITIES } from './utilities.js';
import { CYPHERADDONS } from './settings.js';

/*------------------------------------------------------------------------------------------------
------------------------------------------ Global(es) -------------------------------------------
------------------------------------------------------------------------------------------------*/
const quantifier = '@';

const typeSentenceCheck = [
	`${quantifier}descriptor`,
	`${quantifier}focus`,
	`${quantifier}type`,
	`${quantifier}additional`,
	`${quantifier}additionalsentence`
];

const typeStatCheck = [
	`${quantifier}might`,
	`${quantifier}speed`,
	`${quantifier}intellect`,
	`${quantifier}additional`,
	`${quantifier}additionalpool`,
	`${quantifier}effort`
];

const typeItemsCheck = [
	`${quantifier}item`,
	`${quantifier}skill`,
	`${quantifier}ability`,
	`${quantifier}cypher`,
	`${quantifier}artifact`,
	`${quantifier}oddity`,
	`${quantifier}weapon`,
	`${quantifier}armor`,
	`${quantifier}equipment`,
	`${quantifier}material`
];

let skillLevels = [
	'Specialized',
	'Trained',
	'Practiced',
	'Inability'
];

let optionsCreationsCheck = [];

/*------------------------------------------------------------------------------------------------
------------------------------------------- Class(es) --------------------------------------------
------------------------------------------------------------------------------------------------*/
/**
 * @description Class for the creation sentence
 * @class creationSentence
 */
class creationSentence {
	constructor(descriptor = '', focus = '', type = '', additionalSentence = '') {
		this.descriptor = descriptor;
		this.focus = focus;
		this.type = type;
		this.additionalSentence = additionalSentence;
	};
};

/**
 * @description Class for the statistics creation
 * @class creationStat
 */
class creationStat {
	constructor(value = 10, edge = 0, poolModificator = 0, edgeModificator = 0) {
		this.value = (Number.isInteger(value)) ? value : 10;
		this.edge = (Number.isInteger(edge)) ? edge : 0;
		this.poolModificator = poolModificator;
		this.edgeModificator = edgeModificator;
	};
};

/**
 * @description Class holding the stats
 * @class creationStats
 */
class creationStats {
	constructor(might = new creationStat(), speed = new creationStat(), intellect = new creationStat(), additional = new creationStat()) {
		this.might = might;
		this.speed = speed;
		this.intellect = intellect;
		this.additional = additional;
	};
};

/**
 * @description Class holding information about skills
 * @class creationSkill
 */
class creationSkill {
	constructor(id = '', name = '', level = 2, skill = {}) {
		this.id = id;
		this.name = name;
		this.level = level;
		this.skill = skill;
		this.skill.flags = { [CYPHERADDONS.MODULE.NAME] : { 
			[CYPHERADDONS.FLAGS.CREATIONITEM] : true,
			[CYPHERADDONS.FLAGS.ORIGINALSKILLLEVEL] : "None"
		}};
	};
};

/**
 * @description Class holding information about abilities
 * @class creationAbility
 */
class creationAbility {
	constructor(id = '', name = '', tier = 0, ability = {}) {
		this.id = id;
		this.name = name;
		this.tier = tier;
		this.ability = ability;
		this.ability.flags = { [CYPHERADDONS.MODULE.NAME] : { [CYPHERADDONS.FLAGS.CREATIONITEM] : true }};
	};
};

/**
 * @description Class holding information about items
 * @class creationItem
 */
class creationItem {
	constructor(id = '', name = '', quantity = 1, item = {}) {
		this.id = id;
		this.name = name;
		this.quantity = quantity;
		this.item = item;
		this.item.flags = { [CYPHERADDONS.MODULE.NAME] : { 
			[CYPHERADDONS.FLAGS.CREATIONITEM] : true,
			[CYPHERADDONS.FLAGS.ORIGINALQUANTITY] : 0
		}};
	};
};

/**
 * @description Class to hold the data needed for the creation of the character
 * @class creationData
 */
class creationData {
	constructor() {
		this.sentence = new creationSentence();

		this.tier = 1;
		this.effort = 0;
		this.effortModificator = 0;

		this.stats = new creationStats();

		this.skills = [];
		this.abilities = [];
		this.items = [];
	};

	/**
	 * @description Change the specified type of the sentence
	 * @param { String } type
	 * @param { String } sentence
	 * @return {*} 
	 * @memberof creationData
	 */
	changeSentence(type, sentence) {
		if (!type in this.sentence) return;
		this.sentence[type] = sentence;
	};

	/**
	 * @description Set the tier of the creation data
	 * @param { Number } tier
	 * @return {*} 
	 * @memberof creationData
	 */
	setTier(tier) {
		if (!Number.isInteger(tier)) return;
		this.tier = tier;
	};

	/**
	 * @description Change a stat value
	 * @param { String } stat
	 * @param { Number / creationStat } value
	 * @return {*} 
	 * @memberof creationData
	 */
	changeStat(stat, value) {
		if (stat === 'effort') {
			if (!Number.isInteger(value)) return;
			this.effort = value;
		} else {
			value = Object.assign(new creationStat(), value);
			if (!stat in this.stats) return;
			this.stats[stat] = value;
		};
	};

	/**
	 * @description Add a modificator (either for pool or edge) to a stat
	 * @param { String } stat
	 * @param { String } type - pool or edge
	 * @param { String } modificator
	 * @return {*} 
	 * @memberof creationData
	 */
	addStatModificator(stat, type, modificator) {
		if (stat === 'effort') {
			const current = this.effortModificator,
				mathExpression = current + modificator;

			this.effortModificator = mathExpression;
		} else if (!stat in this.stats) return;

		if (type === 'pool') {
			const current = this.stats[stat].poolModificator,
				mathExpression = current + modificator;

			this.stats[stat].poolModificator = mathExpression;
		} else if (type === 'edge') {
			const current = this.stats[stat].edgeModificator,
				mathExpression = current + modificator;

			this.stats[stat].edgeModificator = mathExpression;
		};
	};

	/**
	 * @description Check if a skill exists and return it
	 * @param { String } idOrName
	 * @return { Boolean / creationSkill } 
	 * @memberof creationData
	 */
	skillExists(idOrName) {
		for (const skill of this.skills)
			if (skill) if (skill.id == idOrName || skill.name === idOrName) return skill;

		return false;
	};

	/**
	 * @description Set the level (inability, practiced, trained, specialized) of a skill
	 * @param { String } idOrName
	 * @param { Number } level
	 * @return {*} 
	 * @memberof creationData
	 */
	setSkillLevel(idOrName, level) {
		if (!Number.isInteger(level)) return;
		for (const skill of this.skills) {
			if (!skill) continue;
			if (skill.id == idOrName || skill.name === idOrName) {
				level = parseInt(level);

				skill.skill.system.skillLevel = skillLevels[level];
				skill.skill.system.rollButton.skill = skillLevels[level];
				skill.level = level;
			};
		};
	};

	/**
	 * @description Get the level of a skill
	 * @param { String } idOrName
	 * @return { Boolean / Number } 
	 * @memberof creationData
	 */
	getSkillLevel(idOrName) {
		for (const skill of this.skills)
			if (skill) if (skill.id == idOrName || skill.name === idOrName) return skill.level;

		return false;
	};

	/**
	 * @description Check if an ability exists and return it
	 * @param { String } idOrName
	 * @return { Boolean / creationAbility } 
	 * @memberof creationData
	 */
	abilityExists(idOrName) {
		for (const ability of this.abilities)
			if (ability) if (ability.id == idOrName || ability.name === idOrName) return ability;

		return false;
	};

	/**
	 * @description Set the tier of an ability
	 * @param { String } idOrName
	 * @param { Number } tier
	 * @return {*} 
	 * @memberof creationData
	 */
	setAbilityTier(idOrName, tier) {
		if (!Number.isInteger(tier)) return;
		if (parseInt(tier) > 6) return;
		for (const ability of this.abilities) {
			if (!ability) continue;
			if (ability.id == idOrName || ability.name === idOrName) {
				ability.tier = parseInt(tier);
			};
		};
	};

	/**
	 * @description Get the tier of an ability
	 * @param { String } idOrName
	 * @return { Boolean / Number } 
	 * @memberof creationData
	 */
	getAbilityTier(idOrName) {
		for (const ability of this.abilities)
			if (ability) if (ability.id == idOrName || ability.name === idOrName) return ability.tier;

		return false;
	};

	/**
	 * @description Check if an item exists and return it
	 * @param { String } idOrName
	 * @return { Boolean / creationItem } 
	 * @memberof creationData
	 */
	itemExists(idOrName) {
		for (const item of this.items)
			if (item) if (item.id == idOrName || item.name === idOrName) return item;

		return false;
	};

	/**
	 * @description Set the quantity of an item 
	 * @param { String } idOrName
	 * @param { Number } quantity
	 * @return {*} 
	 * @memberof creationData
	 */
	setItemQuantity(idOrName, quantity) {
		if (!Number.isInteger(quantity)) return;
		for (const item of this.items) {
			if (!item) continue;
			if (item.id == idOrName || item.name === idOrName) {
				quantity = parseInt(quantity);

				if ('quantity' in item.item.system.basic) item.item.system.basic.quantity = quantity;
				item.quantity = quantity;
			};
		};
	};

	/**
	 * @description Get the quantity of an item 
	 * @param { String } idOrName
	 * @return { Boolean / Number } 
	 * @memberof creationData
	 */
	getItemQuantity(idOrName) {
		for (const item of this.items)
			if (item) if (item.id == idOrName || item.name === idOrName) return item.quantity;

		return false;
	};
}

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
/**
 * @description Check if the actor possess any linked data (aka journal) for its sentences
 * @export
 * @param { Object } html
 * @param { Object } actor
 */
export async function checkIfLinkedData(html, actor) {
	pushLocalisationSkillLevel();

	const nameCheck = [
		actor.system.basic.descriptor,
		actor.system.basic.focus,
		actor.system.basic.type,
		actor.system.basic.additionalSentence
	];

	for (const name of nameCheck) {
		if (!name || name === '') continue;

		const jpage = await fromUuid(getJournalIdInName(name));

		if (jpage) {
			const content = returnArrayOfHtmlContent(jpage);
			updateActorSheet(html, content[0].replace(/ .*/, '').toLowerCase(), jpage);
		};
	};
};

/**
 * @description Update the character sheet to show the linked buttons.
 * @param { Object } html
 * @param { String } toUpdate
 * @param { Object } journalpage
 */
function updateActorSheet(html, toUpdate, journalpage) {
	toUpdate = (toUpdate === `${quantifier}additional` || toUpdate === `${quantifier}additionalsentence`)
		? 'additionalSentence'
		: UTILITIES.sanitizeString(toUpdate);

	const id = journalpage.id,
		newNode = journalpage.toAnchor({classes: ["linkedButton"]}),
		oldNode = html.find(`input[name="system.basic.${toUpdate}"`);
	
	oldNode.replaceWith(newNode);
	html.find(`a.linkedButton[data-uuid='${journalpage.uuid}']`).click(async (e) => {
		const uuid = e.currentTarget.getAttribute('data-uuid');
		const page = await fromUuid(uuid);
		if (!e.altKey) {
			page.parent.sheet.render(true, {pageId: page.id});
		}
		else {
			const actorId = e.currentTarget.offsetParent.id,
			 	actor = game.actors.get(actorId.slice(actorId.indexOf('-Actor-')+7));
			journalsToArray(page, html, actor, true);
		};
	});
};

/**
 * @description Check if the journal can be used by the creation tool
 * @export
 * @param { Object } actor
 * @param { Object } html
 * @param { Object } droppedEntity
 * @return {*} 
 */
export async function checkJournalType(actor, html, droppedEntity) {
	pushLocalisationSkillLevel();

	if (droppedEntity.type.toLowerCase() === 'journalentry')
		droppedEntity = (await fromUuid(droppedEntity.uuid)).pages.contents[0];
	
	html = html._element;
	const buttons = Array.from(html.find('.linkedButton')),
		page = await fromUuid(droppedEntity.uuid);

	const journalContent = returnArrayOfHtmlContent(page),
		journalType = journalContent[0].replace(/ .*/, '').toLowerCase();
		
	if (!isGoodJournalType(journalType)) {
		ui.notifications.warn(game.i18n.format('NICECYPHER.CreationNotGoodTypeOfJournal', 
			{ name: `${page.name}` }));
		return;
	};
	
	if (buttons.length > 0) {
		for (const b of buttons) {
			if (b.name === `system.basic.${UTILITIES.sanitizeString(journalType)}`) {
				ui.notifications.warn(game.i18n.format('NICECYPHER.CreationAlreadySentence',
					{ type: `${journalType.substring(1)} (${page.name})` }));
				return;
			};
		};
	};
	
	journalsToArray(page, html, actor);
};

/**
 * @description Put linked journals inside an array for getting through them.
 * @param { Object }  page
 * @param { Object }  html
 * @param { Object }  actor
 * @param { Boolean } [remove=false]
 */
async function journalsToArray(page, html, actor, remove = false) {
	const buttons = Array.from(html.find('.linkedButton'));

	let pages = remove ? [] : [page];
	if (buttons.length > 0) {
		for (const b of buttons) {
			const bPage = await fromUuid(b.getAttribute('data-uuid'));
			if (bPage) pages.push(bPage);
		};
	};
	if (remove) pages.push(page);

	await journalsReading(pages, actor, remove);
};

/**
 * @description Read journals data to push them after to the Actor.
 * @param { Array<Object> } pages
 * @param { Object }  		actor
 * @param { Boolean } 		[remove=false]
 */
async function journalsReading(pages, actor, remove) {
	let creationActor = new creationData(),
		allSkills = [],
		allAbilities = [],
		allItems = [],
		currentJournal = 0;
	const removeJournal = (remove) ? pages.length - 1 : -1;

	for (const page of pages) {
		const del = (removeJournal == currentJournal) ? true : false,
			lines = returnArrayOfHtmlContent(page),
			checkFirstLine = isGoodJournalType(lines[0].toLowerCase());

		if (!checkFirstLine) continue;
		const s = (checkFirstLine === `${quantifier}additional` || checkFirstLine === `${quantifier}additionalsentence`)
			? 'additionalSentence'
			: UTILITIES.sanitizeString(checkFirstLine);
		creationActor.changeSentence(s, (!del)
			? `${page.name} {${page.uuid}}`
			: '');

		if (CYPHERADDONS.SETTINGS.CREATIONTOOL)
		for (const line of lines) {
			const l = line;

			// TODO: get a better way to handle for options
			/**
			const l = (line.startsWith(`${quantifier}option`))
				? await askForOptions(line, lines)
				: line;
			 */

			if (!l) continue;
			if (l === checkFirstLine) continue;
			if (!l.startsWith(quantifier)) continue;

			let occurrences = [];
			for (var i = l.length; i--;) if (l[i] == quantifier) occurrences.push(i);

			const type = getObject(occurrences.pop(), l).toLowerCase(),
				object = (occurrences.length > 0) ? getObject(occurrences.pop(), l) : false,
				other = (occurrences.length > 0) ? occurrences.pop() : false;

			// Stats
			if (typeStatCheck.includes(type)) {
				const stat = type.substring(1),
					value = l.match(/\d+/g),
					operation = l.match(/[+\-](\.\d+|\d+(\.\d+)?)/g);

				if (stat === 'effort' && !operation) creationActor.changeStat(stat, (!del) ? parseInt(value[0]) : 0);
				else if (operation) {
					let op = operation[0];

					if (stat === 'effort') {
						if (del) op = (op.includes('+')) ? op.replace('+', '-') : op.replace('-', '+');
						creationActor.addStatModificator(stat, 'effort', op)
					} else {
						if (del) op = (op.includes('+')) ? op.replace('+', '-') : op.replace('-', '+');
						creationActor.addStatModificator(stat, 'pool', op);

						op = operation[1];
						if (!op) continue
						if (del) op = (op.includes('+')) ? op.replace('+', '-') : op.replace('-', '+');
						creationActor.addStatModificator(stat, 'edge', op);
					};
				} else if (Number.isInteger(parseInt(value[0]))) {
					const s = (stat === 'additionalpool') ? 'additional' : stat,
						statValue = (!del)
							? new creationStat(parseInt(value[0]), parseInt(value[1]), creationActor.stats[s].poolModificator, creationActor.stats[s].edgeModificator)
							: new creationStat(10, 0, creationActor.stats[s].poolModificator, creationActor.stats[s].edgeModificator);

					creationActor.changeStat(s, statValue);
				};
			}
			// Abilities / Skills / Equipments
			else if (typeItemsCheck.includes(type)) {
				const id = object.match(/\[(.*?)\]/)[1],
					compendium = id.split('.');

				let item;
				if (object.startsWith('@UUID['))
					item = await fromUuid(id);
				else if (compendium.length > 1) {
					const pack = game.packs.find(p => p.metadata.name === compendium[1]),
						index = pack.index.get(compendium[2]),
						i = await pack.getDocument(index._id);
					item = await game.items.fromCompendium(i);

				} else item = await game.items.get(id);

				const duplicatedItem = duplicate(item),
					optionType = (other) ? getObject(other, l).toLowerCase() : false,
					option = (other) ? l.substring(other + getObject(other, l).length + 1).replace(/ .*/, '') : false;
				
				// Check equipment
				if ('quantity' in duplicatedItem.system.basic) {
					const quantity = (optionType === `${quantifier}quantity` && option) ? parseInt(option) : 1;

					let existingItem = creationActor.itemExists(duplicatedItem.name);
					if (existingItem) {
						const newQuantity = (!del)
							? parseInt(existingItem.quantity) + parseInt(quantity)
							: parseInt(existingItem.quantity) - parseInt(quantity);
						
						await creationActor.setItemQuantity(existingItem.name, newQuantity);
					} else {
						const newItem = new creationItem(duplicatedItem._id, duplicatedItem.name, quantity, duplicatedItem);
						creationActor.items.push(newItem);
					};
				}
				// Check skills
				else if (duplicatedItem.type === 'skill') {
					const o = (optionType === `${quantifier}level` && option) ? UTILITIES.capitalizeFirstLetter(option.toLowerCase()) : skillLevels[2];
					let skillLevel = 2;

					if (skillLevels.includes(o)) {
						skillLevel = skillLevels.indexOf(o) > 3
							? skillLevels.indexOf(o) - 4
							: skillLevels.indexOf(o);
					};

					let existingSkill = creationActor.skillExists(duplicatedItem.name);

					if (existingSkill) {
						if (!del) {
							const oldLevel = creationActor.getSkillLevel(existingSkill.id),
								newLevel = Math.floor((parseInt(oldLevel) + parseInt(skillLevel)) / 2);

							creationActor.setSkillLevel(existingSkill.id, newLevel);
							allSkills.push({ id: allSkills.length, journal: page.name, skill: duplicatedItem.name, level: skillLevel });
						} else {
							const oldJournalSkill = allSkills.filter(s => s.skill === duplicatedItem.name);

							if (oldJournalSkill.length > 1) {
								let newLevel = 0;
								for (const s of oldJournalSkill) if (s.journal != page.name) newLevel += s.level;

								newLevel = Math.floor(newLevel / (oldJournalSkill.length - 1));
								creationActor.setSkillLevel(existingSkill.id, newLevel);
							} else delete creationActor.skills[oldJournalSkill[0].id];
						}
					} else if (!del) {
						const newSkill = new creationSkill(duplicatedItem._id, duplicatedItem.name, skillLevel, duplicatedItem);

						creationActor.skills.push(newSkill);
						creationActor.setSkillLevel(duplicatedItem._id, skillLevel);
						allSkills.push({ id: allSkills.length, journal: page.name, skill: duplicatedItem.name, level: skillLevel });
					};
				}
				// Check abilities
				else if (duplicatedItem.type === 'ability') {
					const tierLevel = parseInt((optionType === `${quantifier}tier` && option) ? option : 0),
						actorTier = actor.system.basic.tier;

					let existingAbility = creationActor.abilityExists(duplicatedItem.name);
					if (!existingAbility && tierLevel <= actorTier && !del) {
						const newAbility = new creationAbility(duplicatedItem._id, duplicatedItem.name, tierLevel, duplicatedItem);

						creationActor.abilities.push(newAbility);
						allAbilities.push({ id: allAbilities.length, journal: page.name, ability: duplicatedItem.name, tier: tierLevel });
					} else if (tierLevel <= actorTier && del) {
						const oldJournalAbility = allAbilities.filter(s => s.ability === duplicatedItem.name);
						if (oldJournalAbility.length == 1) delete creationActor.abilities[oldJournalAbility[0].id];
					};
				}
				// Other
				else {
					let existingItem = creationActor.itemExists(duplicatedItem.name);

					if (del) {
						const oldJournalItem = allItems.filter(i => i.item === duplicatedItem.name);

						if (oldJournalItem.length >= 1) {
							const oldItem = creationActor.items.find(i => i.name === duplicatedItem.name)
							delete creationActor.items[creationActor.items.indexOf(oldItem)];
							creationActor.items = creationActor.items.filter(i => i);
						};

					} else {
						allItems.push({ id: allItems.length, journal: page.name, item: duplicatedItem.name })

						// Only artifacts cannot exist two times
						if (existingItem && duplicatedItem.type === 'artifact') continue;

						const newItem = new creationItem(duplicatedItem._id, duplicatedItem.name, 1, duplicatedItem);
						creationActor.items.push(newItem);
					};
				};
			};
		};

		currentJournal++;
	};

	updateActorData(actor, creationActor)
};

/**
 * @description Update the actor data according to the data sent. It will wip clean the character sheet before doing so.
 * @param { String } 		line
 * @param { Array<String> } lines
 */
async function askForOptions(line, lines) {
	if (optionsCreationsCheck.length > 0)
		if (optionsCreationsCheck.includes(line))
			return false;
	
	optionsCreationsCheck = [line];
	let check = true
		startIndex = line.indexOf(line),
		i = 1;

	while (check) {
		let l = lines[startIndex + i];
		if (!l.startsWith(`${quantifier}option`)) check = false;
		
		
	};

	return l;
};

/**
 * @description Update the actor data according to the data sent. It will wip clean the character sheet before doing so.
 * @param { Object } actor
 * @param { creationData } crdata
 */
 async function updateActorData(actor, crdata) {
	let itemsToCreate = [],
		itemsToDelete = [],
		itemsToUpdate = [],
		itemsToDeleteCheck = [],
		updatedData;

	// Sentence
	for (const crsent in crdata.sentence) {
		updatedData = { [`system.basic.${crsent}`]: crdata.sentence[crsent] };
		await actor.update(updatedData);
	};

	// Finish now if full creation tool not required
	if (!CYPHERADDONS.SETTINGS.CREATIONTOOL) return;

	// Effort
	const checkEffortModificator = eval(crdata.effortModificator);
	if (checkEffortModificator > 0) {
		const newEffortValue = eval(`${crdata.effort}+${checkEffortModificator}`);
		crdata.changeStat('effort', newEffortValue);
	};

	updatedData = { [`system.basic.effort`]: crdata.effort };
	await actor.update(updatedData);

	// Stats
	for (const crstat in crdata.stats) {
		const checkPoolModificator = eval(crdata.stats[crstat].poolModificator),
			checkEdgeModificator = eval(crdata.stats[crstat].edgeModificator);

		if (checkPoolModificator > 0 || checkEdgeModificator > 0) {
			const newPoolValue = eval(`${crdata.stats[crstat].value}+${checkPoolModificator}`),
				newEdgeValue = eval(`${crdata.stats[crstat].edge}+${checkEdgeModificator}`),
				statValue = new creationStat(parseInt(newPoolValue), parseInt(newEdgeValue));

			crdata.changeStat(crstat, statValue);
		};

		updatedData = [
			{ [`system.pools.${crstat}.value`]: crdata.stats[crstat].value },
			{ [`system.pools.${crstat}.max`]: crdata.stats[crstat].value },
			{ [`system.pools.${crstat}.edge`]: crdata.stats[crstat].edge }
		];

		for (const d of updatedData) await actor.update(d)
	};

	// Skills
	const actor_auto_skills = actor.items.filter(i => 
		(i.flags?.[CYPHERADDONS.MODULE.NAME]?.[CYPHERADDONS.FLAGS.CREATIONITEM] && i.type === 'skill')),
		existingSkills = actor.items.filter(i => i.type === 'skill');
	for (const s of actor_auto_skills) if (s.flags?.[CYPHERADDONS.MODULE.NAME]?.[CYPHERADDONS.FLAGS.ORIGINALSKILLLEVEL] !== "None") {
		let skill = existingSkills.find(sk => sk.name === s.name);

		skill = upSkillLevel(skill, skill.flags[CYPHERADDONS.MODULE.NAME][CYPHERADDONS.FLAGS.ORIGINALSKILLLEVEL], true);		
		itemsToUpdate.push({_id: skill._id, system: skill.system, flags: skill.flags});
	} else itemsToDelete.push(s.id);
	for (const crskill of crdata.skills) 
		if (crskill) 
			if (existingSkills.find(sk => sk.name === crskill.name)) {
				let skill = existingSkills.find(sk => sk.name === skill.name);

				skill = upSkillLevel(skill, skill.skill.system.skillLevel);
				itemsToUpdate.push({_id: skill._id, system: skill.system, flags: skill.flags});
			} else itemsToCreate.push(crskill.skill);

	// Abilities
	const actor_auto_abilities = actor.items.filter(i => 
		(i.flags?.[CYPHERADDONS.MODULE.NAME]?.[CYPHERADDONS.FLAGS.CREATIONITEM] && i.type === 'ability')),
		existingAbilities = actor.items.filter(i => i.type === 'ability');
	for (const a of actor_auto_abilities) itemsToDelete.push(a.id);
	for (const crability of crdata.abilities) if (crability) if (!existingAbilities.includes(crability)) itemsToCreate.push(crability.ability);

	// Other
	const actor_auto_items = actor.items.filter(i => 
		(i.flags?.[CYPHERADDONS.MODULE.NAME]?.[CYPHERADDONS.FLAGS.CREATIONITEM] && (i.type !== 'skill' && i.type !== 'ability'))),
		existingItems = actor.items.filter(i => (i.type !== 'skill' && i.type !== 'ability'));
	for (const i of actor_auto_items) {
		itemsToDelete.push(i.id);
		itemsToDeleteCheck.push(i.name);
	};
	for (const critem of crdata.items) 
			if (critem && critem.item.type !== 'skill' && critem.item.type !== 'ability') {
				let item = existingItems.find(it => it.name === critem.name);
				if (item && !itemsToDeleteCheck.includes(critem.name)) {
					let q  = +item.system.basic.quantity;
					let oq = +item.flags?.[CYPHERADDONS.MODULE.NAME]?.[CYPHERADDONS.FLAGS.ORIGINALQUANTITY] || 0;

					if (oq > 0) {
						setProperty(item, `flags.${CYPHERADDONS.MODULE.NAME}.${CYPHERADDONS.FLAGS.ORIGINALQUANTITY}`, 0);
						setProperty(item, 'system.basic.quantity', oq);
					} else {
						setProperty(item, `flags.${CYPHERADDONS.MODULE.NAME}.${CYPHERADDONS.FLAGS.ORIGINALQUANTITY}`, q);
						setProperty(item, 'system.basic.quantity', q + critem.quantity);
					};					
					itemsToUpdate.push({_id: item.id, system: item.system, flags: item.flags});
				} else if (critem.quantity > 0) {
					critem.item.system.basic.quantity = critem.quantity;
					itemsToCreate.push(critem.item);
				};
			};

	// Update the actor
	if (itemsToDelete.length > 0) await actor.deleteEmbeddedDocuments('Item', itemsToDelete);
	if (itemsToCreate.length > 0) await actor.createEmbeddedDocuments('Item', itemsToCreate);
	if (itemsToUpdate.length > 0) await actor.updateEmbeddedDocuments('Item', itemsToUpdate);
};

/**
 * @description Push the localisation string of the skill level to the check
 * @return {*} 
 */
function pushLocalisationSkillLevel() {
	if (skillLevels.includes(game.i18n.localize('CYPHERSYSTEM.Specialized'))) return;

	skillLevels.push(game.i18n.localize('CYPHERSYSTEM.Specialized'));
	skillLevels.push(game.i18n.localize('CYPHERSYSTEM.Trained'));
	skillLevels.push(game.i18n.localize('CYPHERSYSTEM.Practiced'));
	skillLevels.push(game.i18n.localize('CYPHERSYSTEM.Inability'));
};

/**
 * @description Return the content of an HTML in an array
 * @param { String } page
 * @return { Array<String> } 
 */
function returnArrayOfHtmlContent(page) {
	return UTILITIES.removeTags(page.text.content).split('\n').filter(n => n);
};

/**
 * @description Check if it is really a journal for the creation tool, return the type of the journal if so.
 * @param { String } type
 * @return { Boolean / String } 
 */
function isGoodJournalType(type) {
	if (!typeSentenceCheck.includes(type)) return false;
	return type;
};

/**
 * @description Return the journal ID from its saved name
 * @param { String } str
 * @return { String } 
 */
function getJournalIdInName(str) {
	return (str.includes('{')) ? str.substring(str.indexOf("{") + 1, str.lastIndexOf("}")) : str;
};

/**
 * @description Return an object for the tag
 * @param { Number } start
 * @param { String } str
 * @return { String } 
 */
function getObject(start, str) {
	return str.substring(start).replace(/ .*/, '');
};

/**
 * @description Get the right skill level to the actor
 * @param { Object } skill
 * @param { String } level
 * @param { Boolean } [rollBack=false]
 */
function upSkillLevel(skill, level, rollBack = false) {
	
	if (rollBack) {		
		setProperty(skill, `flags.${CYPHERADDONS.MODULE.NAME}.${CYPHERADDONS.FLAGS.CREATIONITEM}`, false);
		setProperty(skill, `flags.${CYPHERADDONS.MODULE.NAME}.${CYPHERADDONS.FLAGS.ORIGINALSKILLLEVEL}`, "");
	} else {		
		setProperty(skill, `flags.${CYPHERADDONS.MODULE.NAME}.${CYPHERADDONS.FLAGS.CREATIONITEM}`, true);
		setProperty(skill, `flags.${CYPHERADDONS.MODULE.NAME}.${CYPHERADDONS.FLAGS.ORIGINALSKILLLEVEL}`, skill.system.skillLevel);
	};
	
	setProperty(skill, 'data.skillLevel', level);
	setProperty(skill, 'data.rollButton.skill', level);

	return skill;
};