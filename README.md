# Nice(TSY) Cypher System Add-ons
![](https://img.shields.io/badge/Foundry-v0.9-informational?style=flat-square)
![GitHub Latest Release](https://img.shields.io/github/release/NiceTSY/nice-cypher-add-ons?style=flat-square)
![Latest Release Download Count](https://img.shields.io/github/downloads/NiceTSY/nice-cypher-add-ons/latest/module.zip)
![](https://img.shields.io/badge/license-BSD--3--Clause-green?link=https://opensource.org/licenses/BSD-3-Clause&style=flat-square)

<p align="justify">
This is module contains some QOL improvements that I and my players have found interesting and/or useful for the <a href="https://github.com/mrkwnzl/cyphersystem-foundryvtt">Cypher System</a> made by <strong>mrkwnzl</strong>.
Those things could probably be implemented directly inside the system in the future. Nothing more, nothing less.
</p>

<p align="justify">
If you need to speak about this module or about the Cypher System you can join <strong>mrkwnzl's</strong> <a href="https://discord.gg/C5zGgtyhwa">Cypher FVTT Dev Discord</a>. We will be happy to help!
</p>

## Disclaimer

> <p align="justify"> All my scripts are under the <a href="https://opensource.org/licenses/BSD-3-Clause">BSD-3-Clause license</a>, so feel free do to whatever you want with them. A little credit is always appreciated. I just ask for you to try to keep the same scope as me.
> Also, feel free to make a pull request! I will be more than happy to see what are your QOL too! </p>

> <p align="justify"> This module follows the <a href="https://www.montecookgames.com/fan-use-policy/">Fan Use Policy</a> from Monte Cook Games, and therefore does not contains anything from the books. </p>

> <p align="justify"> This module includes the following official image 'Numenera Discovery 20 <a href="https://artiglio.artstation.com/">Mirco Paganessi</a>' (also known as <a href="https://www.montecookgames.com/numenera-on-twitch-now-with-more-squicky-creatures/">'Kaliss, a Clever Jack who Works the Back Alleys'</a>), which is included in accordance with the preceding <b>Fan Use Policy</b>. </p>

> <p align="justify"> This module includes some icons from Games-Icons, they are provided under the terms of the Creative Commons 3.0 BY license. Available on <a href="https://game-icons.net">https://game-icons.net</a>. </p>

## Installation

Either use the Foundry Install-Module dialogue and look for "**Nice(TSY) Cypher System Add-ons**" or copy the following Manifest URL into it (it can be found on the Setup menu of the Foundry VTT application):

https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/module.json

## Contributors

<a href="https://github.com/NiceTSY/nice-cypher-add-ons/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NiceTSY/nice-cypher-add-ons" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Scripts

<p align="justify">
All of them are well-commented/documented and normally kept as understandable as possible for anyone to pick and modify/patch them as they wish.
I have no business in keeping anything obfuscated and blind. My main thoughts are that everyone has to start somewhere and understanding other codes is one way to do so. 
With this, I aim to keep those different scripts as light as possible.
</p>

<p align="justify">
However, everyone has his/her/its/their own way to code and mine is mine, so if you were not able to understand something, please feel free to ask me on Discord.
</p>

## How to use

> All are optional and can be deactivated in the settings.

### Creation Tool

<p align="justify">
It makes now possible to drag a journal entry with specified tags on the character sheet, linking the journal to the corresponding Descriptor / Focus / Type (works with the additional sentence as well). This will also automatically add any tagged Abilities / Skills / Items from the journal on the actor.

To understand how it works please read the <a href="https://github.com/NiceTSY/nice-cypher-add-ons/blob/main/Creation_Tool.md">Creation Tool Documentation</a>.
</p>

![](https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/screenshots/creation_tool.png)

### GMi token HUD

<p align="justify">
This will create a new token HUD component that will send the GMi for the player's token.
</p>

![](https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/screenshots/gm_intrusion.png)

### Auto obfuscate and level roll an object

<p align="justify">
Those two options permit to automatically roll/obfuscate the level of a numenera object (Cypher and Artifact) when dropped on a character sheet.
</p>

![](https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/screenshots/autorollobject.png)

### Trade dialogue

<p align="justify">
This will show a new icon on your character sheet, making possible to trade items between player (need to have at least the **OBSERVER** permission).
</p>

![](https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/screenshots/tradebetweenplayer.png)

### Macros

This module also includes the following macro:

1. **Get-Random Item(s) from Compendium**: Return as a whisper to the GM, X random item(s) from a selected compendium.