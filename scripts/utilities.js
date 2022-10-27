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

/*------------------------------------------------------------------------------------------------
------------------------------------------- Class(es) --------------------------------------------
------------------------------------------------------------------------------------------------*/

export class UTILITIES {
	/**
	 * @description Check if something is contained inside a specified array.
	 * @static
	 * @param 	{*}		a		- The thing to find.
	 * @param 	{ Object[] }	array		- The array to check.
	 * @return 	{ Boolean }
	 * @memberof UTILITIES
	 */
	static doesArrayContains(a, array) {
		return (array.indexOf(a) > -1);
	};

	/**
	 * @description Return actors according to specified permission.
	 * @static
	 * @param 	{ String }	permission	- The permission of which actors are needed.
	 * @param 	{ Boolean }	withOwned	- If you need the current actor too.
	 * @param 	{ Object }	actor		- The actor you do not want.
	 * @return 	{ Object[] }
	 * @memberof UTILITIES
	 */
	static returnActorByPermission(permission, withOwned = true, actor = null) {
		let actors = []

		if (withOwned) {
			game.actors.forEach((a) => {
				Object.entries(a.ownership).filter(e => {
					let [id, perm] = e;
					if (perm >= permission && id != game.user.id && id != "default" && a.type === 'PC' && !this.doesArrayContains(a.data, actors))
						actors.push(a.data);
				});
			});
		} else if (!withOwned && actor) {
			game.actors.forEach((a) => {
				Object.entries(a.ownership).filter(e => {
					let [id, perm] = e;
					if (perm >= permission && id != game.user.id && id != "default" && a.type === 'PC' && a.id != actor.id && !this.doesArrayContains(a.data, actors))
						actors.push(a.data);
				});
			});
		} else {
			console.log("It seems you missed to pass an argument for the returnActorByPermission function. Please check.");
		};

		return actors;
	};

	/**
	 * @description Get ride of HTML tag in a string
	 * @static
	 * @param 	{ String } html
	 * @return 	{ String } 
	 * @memberof UTILITIES
	 */
	static removeTags(html) {
		var oldHtml;

		const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
		const tagOrComment = new RegExp(
			'<(?:'
			// Comment body.
			+ '!--(?:(?:-*[^->])*--+|-?)'
			// Special "raw text" elements whose content should be elided.
			+ '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
			+ '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
			// Regular name
			+ '|/?[a-z]'
			+ tagBody
			+ ')>',
			'gi'
		);

		do {
			oldHtml = html;
			html = html.replace(tagOrComment, '');
		} while (html !== oldHtml);

		return html.replace(/</g, '&lt;');
	};

	/**
	 * @description Sanitize a string
	 * @static
	 * @param 	{ String } str
	 * @return 	{ String } 
	 * @memberof UTILITIES
	 */
	static sanitizeString(str) {
		str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
		return str.trim();
	};

	/**
	 * @description Capitalize first letter of a string (https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript/53930826#53930826)
	 * @static
	 * @param { * } [ first, ...rest ]
	 * @param { * } [locale=navigator.language]
	 * @memberof UTILITIES
	 */
	static capitalizeFirstLetter = (str, locale = navigator.language) =>
		str.replace(/^\p{CWU}/u, char => char.toLocaleUpperCase(locale));
};