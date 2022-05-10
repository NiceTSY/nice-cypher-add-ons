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
import { CYPHERADDONS } from './settings.js';
import { UTILITIES } from './utilities.js';

/*------------------------------------------------------------------------------------------------
------------------------------------------ Global(es) -------------------------------------------
------------------------------------------------------------------------------------------------*/
const cypherObjectType = [
	'artifact',
	'cypher',
	'oddity'
];

/*------------------------------------------------------------------------------------------------
------------------------------------------ Function(s) -------------------------------------------
------------------------------------------------------------------------------------------------*/
/**
 * @description Create the trade button on the equipment tabs of the character sheet.
 * @export
 * @param { Object } html	- The character sheet.
 * @param { Object } actor	- The current actor.
 */
export function addTradeButton(html, actor) {
	const node = html.find('[title="Trade Item"]');
		
	if(node.length > 0) return;
		
	$(`
		<a class='item-control item-trade' title='Trade Item'>
			<i class='fas fa-exchange-alt'></i>
		</a>
	`).insertBefore(html.find('.tab.items .item-control.item-edit'));

	html.find('.item-control.item-trade').on('click', tradeItemHandler.bind(actor));
};

/**
 * @description Handle the item data
 * @param { Object } e
 */
function tradeItemHandler(e) {
	e.preventDefault();
	const itemId = e.currentTarget.closest('.item').dataset.itemId;

	tradeItem.bind(this)(itemId);
};

/**
 * @description Show the trade dialog to the actor in order to choose with whom to trade.
 * @param { Number } itemId - The ID of the item to trade.
 * @return {*} 
 */
async function tradeItem(itemId) {
	const tradeActor = this;
	const actors = UTILITIES.returnActorByPermission(CONST.ENTITY_PERMISSIONS.OBSERVER, false, tradeActor);
	const item = tradeActor.items.find(i => i.data._id === itemId);

	let maxQuantity = item.data.data.quantity;
	if (maxQuantity <= 0 && maxQuantity != null) return ui.notifications.warn(game.i18n.localize('CYPHERSYSTEM.CannotMoveNotOwnedItem'));

	const maxQuantityText = (maxQuantity != null) ? `${game.i18n.localize('CYPHERSYSTEM.Of')} ${maxQuantity}` : "";
	const data = { actorOptions: actors, maxQuantityText: maxQuantityText };

	new Dialog({
		title: game.i18n.format("CYPHERSYSTEM.MoveItem", { name: item.data.name }),
		content: await renderTemplate(`${CYPHERADDONS.MODULE.PATH}/templates/trade_dialogue.html`, data),
		buttons: buttons(),
		default: "move",
		close: () => { }
	}).render(true);

	// Taken from the Cypher System directly, all credit for this section goes to its original author Marko.
	function buttons() {
		if (maxQuantity != null) {
			return ({
				move: {
					icon: '<i class="fas fa-share-square"></i>',
					label: game.i18n.localize('CYPHERSYSTEM.Move'),
					callback: (html) => emitTrade(html, tradeActor, item, html.find('input#quantity').val())
				},
				moveAll: {
					icon: '<i class="fas fa-share-square"></i>',
					label: game.i18n.localize('CYPHERSYSTEM.MoveAll'),
					callback: (html) => emitTrade(html, tradeActor, item, maxQuantity)
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize('CYPHERSYSTEM.Cancel'),
					callback: () => { }
				}
			})
		} else {
			return ({
				move: {
					icon: '<i class="fas fa-share-square"></i>',
					label: game.i18n.localize('CYPHERSYSTEM.Move'),
					callback: (html) => emitTrade(html, tradeActor, item, html.find('input#quantity').val())
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize('CYPHERSYSTEM.Cancel'),
					callback: () => { }
				}
			});
		};
	};
	// #####################################################################################################
};

/**
 * @description Emit the trade through FoundryVTT socket.
 * @param { Object } html		- The previous dialog HTML.
 * @param { Object } tradeActor		- The actor who want to trade.
 * @param { Object } item		- The item to trade.
 * @param { Number } [quantity=1]	- The quantity to trade.
 * @return {*} 
 */
function emitTrade(html, tradeActor, item, quantity = 1) {
	const receiverId = html.find(`select#playerTrade`)[0].value;
	const traderId = tradeActor.id

	quantity = (item.data.data.quantity != null && quantity > item.data.data.quantity) ? item.data.data.quantity : quantity;
	if (quantity <= 0) {
		tradeItem(item.id);
		return ui.notifications.warn(game.i18n.localize('NICECYPHER.CannotTradeLessThanOneObject'));
	}

	game.socket.emit(`module.${CYPHERADDONS.MODULE.NAME}`, {
		data: { item, quantity },
		receiverId: receiverId,
		traderId: traderId,
		type: 'requestTrade'
	});
};

/**
 * @description Show the trade dialog for the receiver to either accept the request or deny it.
 * @export
 * @param { Object } data - Hold the trade data.
 */
export function receiveTrade(data) {
	const trader = data.trader;

	new Dialog({
		title: game.i18n.localize('NICECYPHER.TradeRequestTitle'),
		content: game.i18n.format('NICECYPHER.TradeRequestContent', { actorName: trader.name, tradeOffer: `<p><b>x${data.quantity}</b> ${data.item.name}</p>` }),
		buttons: {
			accept: {
				label: game.i18n.localize('CYPHERSYSTEM.Accept'),
				icon: '<i class="fas fa-exchange-alt"></i>',
				callback: () => tradeConfirmed(data)
			},
			refuse: {
				label: game.i18n.localize('CYPHERSYSTEM.Refuse'),
				icon: '<i class="fas fa-times"></i>',
				callback: () => tradeDenied(data)
			}
		}
	}).render(true);
};

/**
 * @description Check the receiver item and either increase the quantity or create the object.
 * @export
 * @param {*} {item, quantity, receiver} - Hold the trade data.
 * @return { Boolean }
 */
export async function receiveItem({ item, quantity, receiver }) {
	const duplicatedItem = duplicate(item);
	duplicatedItem.data.quantity = quantity;

	const existingItem = receiver.items.find(i => i.data.name === duplicatedItem.name);
	if (existingItem && UTILITIES.doesArrayContains(duplicatedItem.type, cypherObjectType))
		return true;

	if (existingItem) {
		let updatedQuantity, updateItem;

		updatedQuantity = parseInt(existingItem.data.data.quantity) + parseInt(quantity);
		updateItem = {
			"data.quantity": updatedQuantity
		};

		existingItem.update(updateItem);
	} else {
		item.data.quantity = quantity;
		await receiver.createEmbeddedDocuments("Item", [item]);
		// Item.create(duplicatedItem, {parent: receiver});
	}
	return false;
};

/**
 * @description Check the trader item and either decrease the quantity or delete it.
 * @param {*} {item, quantity, trader} - Hold the trade data.
 */
export async function giveItem({ item, quantity, trader }) {
	item = trader.items.getName(item.name);

	if ("quantity" in item.data.data) {
		let updatedQuantity, updateItem;

		updatedQuantity = parseInt(item.data.data.quantity) - parseInt(quantity);
		updateItem = {
			"data.quantity": updatedQuantity
		};

		item.update(updateItem).then(() => {
			if (parseInt(item.data.data.quantity) <= 0 || UTILITIES.doesArrayContains(item.data.type, cypherObjectType))
				item.delete();
		});
	} else {
		item.delete();
	};
};

/**
 * @description Send the info to confirm the trade.
 * @export
 * @param { Object } data - Hold the trade data.
 */
export function endTrade(data) {
	if (!!data.item)
		giveItem(data);

	ui.notifications.info(`${data.receiver.name} accepted your trade request.`);
};

/**
 * @description Send a warning as the trade did not happenned due to a deny.
 * @export
 * @param { Object } data - Hold the trade data.
 */
export function denyTrade(data) {
	ui.notifications.warn(`${data.receiver.name} rejected your trade request.`);
};

/**
 * @description Send a warning as the trade did not happenned due to already in possession of the item.
 * @export
 * @param { Object } data - Hold the trade data.
 */
export function alreadyTrade(data) {
	ui.notifications.warn(game.i18n.format("CYPHERSYSTEM.AlreadyHasThisItem", { actor: data.receiver.name }));
};

/**
 * @description Confirm a trade between two actors.
 * @param { Object } data - Hold the trade data.
 * @return {*} 
 */
function tradeConfirmed(data) {
	let item = data.item,
		quantity = data.quantity,
		duplicate = false;

	if (!!item)
		duplicate = receiveItem(data);
	else
		return;

	const emitType = duplicate ? "acceptTrade" : "possessItem";	
	game.socket.emit(`module.${CYPHERADDONS.MODULE.NAME}`, {
		data: { item, quantity },
		receiverId: data.receiver.id,
		traderId: data.trader.id,
		type: emitType
	});
};

/**
 * @description Deny a trade between two actors.
 * @param { Object } data - Hold the trade data.
 */
function tradeDenied(data) {
	let item = data.item,
		quantity = data.quantity;

	game.socket.emit(`module.${CYPHERADDONS.MODULE.NAME}`, {
		data: { item, quantity },
		receiverId: data.receiver.id,
		traderId: data.trader.id,
		type: "refuseTrade"
	});
};