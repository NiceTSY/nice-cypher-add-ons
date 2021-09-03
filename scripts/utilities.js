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
------------------------------------------ Utility(ies) ------------------------------------------
------------------------------------------------------------------------------------------------*/
/**
 * @description Check if something is contained inside a specified array.
 * @export
 * @param 	{*}		a		- The thing to find.
 * @param 	{ Object[] }	array		- The array to check.
 * @return 	{ Boolean }
 */
 export function doesArrayContains(a, array) {
	return (array.indexOf(a) > -1);
};

/**
 * @description Return actors according to specified permission.
 * @export
 * @param 	{ String }	permission	- The permission of which actors are needed.
 * @param 	{ Boolean }	withOwned	- If you need the current actor too.
 * @param 	{ Object }	actor		- The actor you do not want.
 * @return 	{ Object[] }
 */
 export function returnActorByPermission(permission, withOwned = true, actor = null) {
	let actors = []
	
	if (withOwned) {
		game.actors.forEach((a) => {			
			Object.entries(a.data.permission).filter(e => {
				let [id, perm] = e;
				if (perm >= permission && id != game.user.id && id != "default" && a.data.type === 'PC' && !doesArrayContains(a.data, actors)) 
					actors.push(a.data);
			});
		});
	} else if (!withOwned && actor) {
		game.actors.forEach((a) => {			
			Object.entries(a.data.permission).filter(e => {
				let [id, perm] = e;
				if (perm >= permission && id != game.user.id && id != "default" && a.data.type === 'PC' && a.id != actor.id && !doesArrayContains(a.data, actors)) 
					actors.push(a.data);
			});
		});
	} else {
		console.log("It seems you missed to pass an argument for the returnActorByPermission function. Please check.");
	};
	
	return actors;
}