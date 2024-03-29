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
	Farling
*/
import { UTILITIES } from './utilities.js';

const quantifier = '@';
let sorting_marker = `${quantifier}sorting`;

let skill_categories = new Map();
let ability_categories = new Map();

function addToMap(map,value,trkey,sortflag)
{
    map.set(value || game.i18n.localize(`CYPHERSYSTEM.${trkey}`), sortflag);
}

function getSkillCategories(data)
{
    let result = new Map();
    addToMap(result, data.labelCategory1, "Skills",             "Skill");
    addToMap(result, data.labelCategory2, "SkillCategoryTwo",   "SkillTwo");
    addToMap(result, data.labelCategory3, "SkillCategoryThree", "SkillThree");
    addToMap(result, data.labelCategory4, "SkillCategoryFour",  "SkillFour");
    return result;
}

function getAbilityCategories(data)
{
    let result = new Map();
    addToMap(result, data.labelCategory1, "Abilities",            "Ability");
    addToMap(result, data.labelCategory2, "AbilityCategoryTwo",   "AbilityTwo");
    addToMap(result, data.labelCategory3, "AbilityCategoryThree", "AbilityThree");
    addToMap(result, data.labelCategory4, "AbilityCategoryFour",  "AbilityFour");
    addToMap(result, data.nameSpells,     "Spells",               "Spell");
    return result;
}

/**
 * 
 * @param {*} description 
 * @returns Array.<string>  the values set by @sorting within the supplied description
 */
function findSorting(description)
{
    let result = [];
    let lines = UTILITIES.getLinesFromHtml(description);
    for (const line of lines)
    {
        if (!line.startsWith(sorting_marker)) continue;
        result.push(line.slice(sorting_marker.length+1).trim());
    }
    return result;
}

/**
 * @param {object} item The document being added (item.parent is the Actor)
 */
export function addItemToActor(item)
{
    /*
    console.log(`actor   = '${actor.name}'`)
    console.log(`name    = ${embeddedName}`);
    console.log(`result  = ${result}`);
    console.log(`options = ${options}`);
    console.log(`userId  = ${userId}`);
    */

    // Check each @sorting tag on each item.
    // If the value on the tag matches one of the defined skill or ability categories,
    // then set the sorting parameter to match that skill/ability category's number.
    let categories;
    if (item.type == 'skill')
        categories = getSkillCategories(item.parent.system.settings.skills);
    else if (item.type == 'ability')
        categories = getAbilityCategories(item.parent.system.settings.abilities);
    else
        return;

    console.log(`result has '${item.type}' going to look for any of ${categories}`);

    for (const sorting of findSorting(item.system.description))
    {
        // Convert from Localized string to default string
        let sort_flag = categories.get(sorting);
        if (sort_flag)
        {
            // This isn't sticking on an F5 reload !!!
            item.updateSource({'system.settings.general.sorting': sort_flag});
            console.log(`result has '${item.name}' moved to '${sort_flag}'`);
            break;
        }
    }
}