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

/*------------------------------------------------------------------------------------------------
------------------------------------------ Global(es) -------------------------------------------
------------------------------------------------------------------------------------------------*/
const quantifier = '@';

const typeSentenceCheck = [
	`${quantifier}descriptor`,
	`${quantifier}focus`,
	`${quantifier}type`,
	`${quantifier}additional`
];

const typeStatCheck = [
	`${quantifier}might`,
	`${quantifier}speed`,
	`${quantifier}intellect`,
	`${quantifier}additional`,
	`${quantifier}effort`
]

const typeItemsCheck = [
	`${quantifier}skill`,
	`${quantifier}ability`,
	`${quantifier}item`
];

const skillLevels = [
	'Specialized',
	'Trained',
	'Practiced',
	'Inability'
]

/*------------------------------------------------------------------------------------------------
------------------------------------------- Class(es) --------------------------------------------
------------------------------------------------------------------------------------------------*/
class creationSentence {
	constructor(descriptor = '', focus = '', type = '', additionalSentence = '') {
		this.descriptor = descriptor;
		this.focus = focus;
		this.type = type;
		this.additionalSentence = additionalSentence;
	};
};

class creationStat {
	constructor(value = 10, edge = 0) {
		this.value = value;
		this.edge = edge;
	};
};

class creationStats {
	constructor(might = new creationStat(), speed = new creationStat(), intellect = new creationStat(), additional = new creationStat()) {
		this.might = might;
		this.speed = speed;
		this.intellect = intellect;
		this.additional = additional;
	};
};

class creationSkill {
	constructor(id = '', name = '', level = 2, skill = {}) {
		this.id = id;
		this.name = name;
		this.level = level;
		this.skill = skill;
	};
};

class creationAbility {
	constructor(id = '', name = '', tier = 0, ability = {}) {
		this.id = id;
		this.name = name;
		this.tier = tier;
		this.ability = ability;
	};
};

class creationItem {
	constructor(id = '', name = '', quantity = 1, item = {}) {
		this.id = id;
		this.name = name;
		this.quantity = quantity;
		this.item = item;
	};
};

class creationData {
	constructor() {
		this.sentence = new creationSentence();

		this.tier = 1;
		this.effort = 0;

		this.stats = new creationStats();

		this.skills = [];
		this.abilities = [];
		this.items = [];
	};

	changeSentence(type, sentence) {
		if (!type in this.sentence) return;
		this.sentence[type] = sentence;
	};

	setTier(tier) {
		if (!Number.isInteger(tier)) return;
		this.tier = tier;
	};

	setEffort(effort) {
		if (!Number.isInteger(effort)) return;
		this.effort = effort;
	};

	changeStat(type, stat) {
		stat = Object.assign(new creationStat(), stat);
		if (!type in this.stats) return;
		this.stats[type] = stat;
	};

	skillExists(idOrName) {
		for (const skill of this.skills)
			if (skill) if (skill.id == idOrName || skill.name === idOrName) return skill;

		return false;
	};

	setSkillLevel(idOrName, level) {
		if (!Number.isInteger(level)) return;
		for (const skill of this.skills) {
			if (!skill) continue;
			if (skill.id == idOrName || skill.name === idOrName) {
				level = parseInt(level);

				skill.skill.data.skillLevel = skillLevels[level];
				skill.skill.data.rollButton.skill = skillLevels[level];
				skill.level = level;
			};
		};
	};

	getSkillLevel(idOrName) {
		for (const skill of this.skills)
			if (skill) if (skill.id == idOrName || skill.name === idOrName) return skill.level;

		return false;
	};

	abilityExists(idOrName) {
		for (const ability of this.abilities)
			if (ability) if (ability.id == idOrName || ability.name === idOrName) return ability;

		return false;
	};

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

	getAbilityTier(idOrName) {
		for (const ability of this.abilities)
			if (ability) if (ability.id == idOrName || ability.name === idOrName) return ability.tier;

		return false;
	};

	itemExists(idOrName) {
		for (const item of this.items)
			if (item) if (item.id == idOrName || item.name === idOrName) return item;

		return false;
	};

	setItemQuantity(idOrName, quantity) {
		if (!Number.isInteger(quantity)) return;
		for (const item of this.items) {
			if (!item) continue;
			if (item.id == idOrName || item.name === idOrName) {
				quantity = parseInt(quantity);

				if ('quantity' in item.item.data) item.item.data.quantity = quantity;
				item.quantity = quantity;
			};
		};
	};

	getItemQuantity(idOrName) {
		for (const item of this.items)
			if (item) if (item.id == idOrName || item.name === idOrName) return item.quantity;

		return false;
	};
}

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
export async function checkJournalType(actor, html, journal) {
	const buttons = Array.from($('.linkedButton')).map(b => b.id);
	let journals = game.journal.filter(j => buttons.includes(j.id));
	journal = await game.journal.get(journal.id);

	const journalContent = journal.data.content.split('\n');
	let journalType = journalContent[0].replace(/ .*/, '').toLowerCase();

	for (const j of journals) {
		const jContent = j.data.content.split('\n'),
			jType = jContent[0].replace(/ .*/, '').toLowerCase()

		if (jType === journalType) {
			journalType = UTILITIES.sanitizeString(UTILITIES.removeTags(journalType))
			ui.notifications.warn(game.i18n.format('NICECYPHER.CreationAlreadySentence', { type: `${journalType} (${j.name})` }))
			return;
		}
	}

	journals.push(journal);
	getContent(journals, actor)
};

export function checkIfLinkedData(html, actor) {
	const nameCheck = [
		actor.data.data.basic.descriptor,
		actor.data.data.basic.focus,
		actor.data.data.basic.type,
		actor.data.data.basic.additionalSentence
	];

	for (const name of nameCheck) {
		const journal = game.journal.getName(name);

		if (journal) {
			const content = journal.data.content.split('\n');
			updateActorSheet(html, content[0].replace(/ .*/, '').toLowerCase(), journal)
		};
	}

	// updateActorSheet(html, type.substring(1), journal)
};

function updateActorSheet(html, toUpdate, data) {
	toUpdate = UTILITIES.removeTags(toUpdate).substring(1);
	const newNode = (`
		<button id="${data.id}" name="data.basic.${toUpdate}" class="linkedButton"><i class="fas fa-book-open"></i> ${data.name}</button>
	`);
	const oldNode = $(`input[name="data.basic.${toUpdate}"`);

	oldNode.replaceWith(newNode);
	$(`#${data.id}`).click(e => {
		if (!e.altKey) game.journal.get(e.target.id).sheet.render(true)
		else {
			const actorId = e.target.offsetParent.id,
				actor = game.actors.get(actorId.substring(6)),
				buttons = Array.from($('.linkedButton')).map(b => b.id);
			let journals = game.journal.filter(j => buttons.includes(j.id));

			journals.push(game.journal.get(e.target.id));
			getContent(journals, actor, true);
		};
	});
};

function isGoodJournalType(journal) {
	const lines = journal.data.content.split('\n');
	const checkFirstLine = UTILITIES.removeTags(lines[0].toLowerCase());

	if (!UTILITIES.doesArrayContains(checkFirstLine, typeSentenceCheck)) return false;
	return checkFirstLine;
}

async function getContent(journals, actor, remove = false) {
	let creationActor = new creationData(),
		allSkills = [],
		allAbilities = [],
		allItems = [],
		currentJournal = 0;
	const removeJournal = (remove) ? journals.length - 1 : -1;

	for (const journal of journals) {
		const del = (removeJournal == currentJournal) ? true : false,
			lines = journal.data.content.split('\n'),
			checkFirstLine = isGoodJournalType(journal);

		if (!checkFirstLine) continue;
		const s = (checkFirstLine === 'additional') ? 'additionalSentence' : UTILITIES.sanitizeString(checkFirstLine);

		creationActor.changeSentence(s, (!del) ? journal.name : '');

		for (const line of lines) {
			const l = UTILITIES.removeTags(line);

			if (l === checkFirstLine) continue;
			if (!l.startsWith(quantifier)) continue;

			let occurrences = [];
			for (var i = l.length; i--;) if (l[i] == quantifier) occurrences.push(i);

			const type = getObject(occurrences.pop(), l).toLowerCase(),
				object = (occurrences.length > 0) ? getObject(occurrences.pop(), l) : false,
				other = (occurrences.length > 0) ? occurrences.pop() : false;

			// Stats
			if (UTILITIES.doesArrayContains(type, typeStatCheck)) {
				const stat = type.substring(1),
					value = l.match(/\d+/g);

				if (stat === 'effort') creationActor.setEffort(value[0])
				else {
					const statValue = (!del) ? new creationStat(parseInt(value[0]), parseInt(value[1])) : new creationStat();
					creationActor.changeStat(stat, statValue);
				};
			}
			// Skills, Abilities and Equipment
			else if (UTILITIES.doesArrayContains(type, typeItemsCheck)) {
				const id = object.match(/\[(.*?)\]/)[1],
					compendium = id.split('.');

				let item;
				if (compendium.length > 1) {
					const pack = game.packs.find(p => p.metadata.name === compendium[1]),
						index = pack.index.get(compendium[2]),
						i = await pack.getDocument(index._id);
					item = game.items.fromCompendium(i);

				} else item = game.items.get(id).data;

				const duplicatedItem = duplicate(item),
					option = (other) ? l.substring(other + getObject(other, l).length + 1).replace(/ .*/, '') : false;

				// Check equipment
				if ('quantity' in duplicatedItem.data) {
					const quantity = (option) ? parseInt(option) : 1;

					let existingItem = creationActor.itemExists(duplicatedItem._id);
					if (existingItem) {
						const newQuantity = (!del)
							? parseInt(existingItem.quantity) + parseInt(quantity)
							: parseInt(existingItem.quantity) - parseInt(quantity);

						creationActor.setItemQuantity(existingItem.id, newQuantity);
					} else {
						const newItem = new creationItem(duplicatedItem._id, duplicatedItem.name, quantity, duplicatedItem)
						creationActor.items.push(newItem);
						creationActor.setItemQuantity(duplicatedItem._id, quantity);
					};
				}
				// Check skills
				else if (duplicatedItem.type === 'skill') {
					const o = (option) ? UTILITIES.capitalizeFirstLetter(option.toLowerCase()) : skillLevels[2],
						skillLevel = UTILITIES.doesArrayContains(o, skillLevels)
							? skillLevels.indexOf(o)
							: 2;

					let existingSkill = creationActor.skillExists(duplicatedItem._id);

					if (existingSkill) {
						if (!del) {
							const oldLevel = creationActor.getSkillLevel(existingSkill.id),
								newLevel = Math.floor((parseInt(oldLevel) + parseInt(skillLevel)) / 2);

							creationActor.setSkillLevel(existingSkill.id, newLevel);
							allSkills.push({ id: allSkills.length, journal: journal.name, skill: duplicatedItem.name, level: skillLevel });
						} else {
							const oldJournalSkill = allSkills.filter(s => s.skill === duplicatedItem.name);

							console.log(allSkills)

							if (oldJournalSkill.length > 1) {
								let newLevel = 0;
								for (const s of oldJournalSkill) if (s.journal != journal.name) newLevel += s.level;

								newLevel = Math.floor(newLevel / (oldJournalSkill.length - 1));
								creationActor.setSkillLevel(existingSkill.id, newLevel);
							} else delete creationActor.skills[oldJournalSkill[0].id];
						}
					} else if (!del) {
						const newSkill = new creationSkill(duplicatedItem._id, duplicatedItem.name, skillLevel, duplicatedItem);

						creationActor.skills.push(newSkill);
						creationActor.setSkillLevel(duplicatedItem._id, skillLevel);
						allSkills.push({ id: allSkills.length, journal: journal.name, skill: duplicatedItem.name, level: skillLevel });
					};
				}
				// Check abilities
				else if (duplicatedItem.type === 'ability') {
					const tierLevel = parseInt((option) ? option : 0),
						actorTier = actor.data.data.basic.tier;

					let existingAbility = creationActor.abilityExists(duplicatedItem._id);
					if (!existingAbility) {
						const newAbility = new creationAbility(duplicatedItem._id, duplicatedItem.name, tierLevel, duplicatedItem);

						creationActor.abilities.push(newAbility);
						allAbilities.push({ id: allAbilities.length, journal: journal.name, ability: duplicatedItem.name, tier: tierLevel });
					} else if (del) {
						const oldJournalAbility = allAbilities.filter(s => s.ability === duplicatedItem.name);

						if (oldJournalAbility.length == 1) delete creationActor.abilities[oldJournalAbility[0].id];
					};
				}
				// Other
				else {
					let existingItem = creationActor.itemExists(duplicatedItem._id);

					if (del) {
						const oldJournalItem = allItems.filter(i => i.item === duplicatedItem.name);
						console.log(duplicatedItem.name)

						if (oldJournalItem.length >= 1) {
							const oldItem = creationActor.items.find(i => i.name === duplicatedItem.name)
							delete creationActor.items[creationActor.items.indexOf(oldItem)];
							creationActor.items = creationActor.items.filter(i => i);
						};

					} else {
						allItems.push({ id: allItems.length, journal: journal.name, item: duplicatedItem.name })

						// Only artifacts cannot exist two times
						if (existingItem && duplicatedItem.type === 'artifact') continue;

						const newItem = new creationItem(duplicatedItem._id, duplicatedItem.name, 1, duplicatedItem);
						creationActor.items.push(newItem);
					};
				};
			};
		};

		currentJournal++;

		// TODO: delete this line
		console.log(creationActor);
	};

	updateActorDataV3(actor, creationActor)
};
/**
 * @description
 * @param {*} actor
 * @param { creationData } data
 */
async function updateActorDataV3(actor, data) {
	let itemsToCreate = [],
		itemsToDelete = [],
		updatedData = { [`data.basic.effort`]: data.effort };

	// Effort
	await actor.update(updatedData);

	// Sentence
	for (const s in data.sentence) {
		updatedData = { [`data.basic.${s}`]: data.sentence[s] };
		await actor.update(updatedData);
	};

	// Stats
	for (const s in data.stats) {
		updatedData = [
			{ [`data.pools.${s}.value`]: data.stats[s].value },
			{ [`data.pools.${s}.max`]: data.stats[s].value },
			{ [`data.pools.${s}Edge`]: data.stats[s].edge }
		];

		for (const d of updatedData) await actor.update(d)
	};

	// Skills
	const existingSkills = actor.items.filter(i => i.data.type === 'skill');
	for (const s of existingSkills) itemsToDelete.push(s.id);
	for (const s of data.skills) if (s) itemsToCreate.push(s.skill);

	// Abilities
	const existingAbilities = actor.items.filter(i => i.data.type === 'ability');
	for (const a of existingAbilities) itemsToDelete.push(a.id);
	for (const a of data.abilities) if (a) itemsToCreate.push(a.ability);

	// Artifacts
	const existingArtifacts = actor.items.filter(i => i.data.type === 'artifact');
	for (const a of existingArtifacts) itemsToDelete.push(a.id);
	for (const i of data.items) if (i) if (i.item.type === 'artifact') itemsToCreate.push(i.item);

	// Cyphers
	const existingCyphers = actor.items.filter(i => i.data.type === 'cypher');
	for (const c of existingCyphers) itemsToDelete.push(c.id);
	for (const i of data.items) if (i) if (i.item.type === 'cypher') itemsToCreate.push(i.item);

	// Items
	const existingItems = actor.items.filter(i => (i.data.type !== 'skill' && i.data.type !== 'ability' && i.data.type !== 'artifact' && i.data.type !== 'cypher'));
	for (const i of existingItems) itemsToDelete.push(i.id);
	for (const i of data.items) if (i)
		if (i.item.type !== 'skill' && i.item.type !== 'ability' && i.item.type !== 'artifact' && i.item.type !== 'cypher' && i.quantity > 0) itemsToCreate.push(i.item);

	// TODO: delete this line
	console.log(itemsToDelete)
	// TODO: delete this line
	console.log(itemsToCreate)

	if (itemsToDelete.length > 0) await actor.deleteEmbeddedDocuments('Item', itemsToDelete);
	if (itemsToCreate.length > 0) await actor.createEmbeddedDocuments('Item', itemsToCreate);
};

function getObject(start, str) {
	return str.substring(start).replace(/ .*/, '');
}