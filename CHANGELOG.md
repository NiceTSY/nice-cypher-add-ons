# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2021-09-19
### Note
This is a big update, with a new big tool: The Creation Tool. This one can be tricky and reading the documentation is needed to understand it fully.

### Added
- Creation Tool, please read this documentation: https://github.com/NiceTSY/nice-cypher-add-ons/blob/main/Creation_Tool.md
- New utilities snippets code
- [Documentation](https://github.com/NiceTSY/nice-cypher-add-ons/blob/main/Creation_Tool.md) for the Creation Tool

### Changed
- Re-factored the settings to be in-line visually with the [Cypher Sheet Module](https://github.com/gonzaPaEst/cyphersheets) made by **gonzaPaEst** and keep a same visual styling around modules for the Cypher System
- Re-factored the utilities.js

### Fixed
- Fixed few bugs

## [0.2.1] - 2021-09-03
### Added
- Added a [CHANGELOG.md](https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/CHANGELOG.md)

### Changed
- Changed the place for the trade button from right to left of the other button

### Fixed
- Fixed some settings related disposition

## [0.2.0] - 2021-08-20
### Added
- Added a trade dialogue module on the character sheet for items

### Changed
- Changed the license from **MIT License** to [**BSD-3-Clause**](https://opensource.org/licenses/BSD-3-Clause)
- Changed the way the code worked, refactored some of the blocks and moved to "modules" based
- Changed compatibility for Foundry 0.8.9

### Fixed
- Fixed old and new EN and FR translation
- Fixed potential deprecated warning for Foundry 0.9.X

## [0.1.1] - 2021-06-17
### Changed
- Changed compatible Foundry version
- Changed the GMi to use the build-in "API" from the system

### Fixed
- Updated some functions in the macro due to a change of compatibility with Foundry 0.8.X

## [0.1.0] - 2021-06-05
**Note:** Initial release

### Added
- Auto roll of Cyphers and Artifacts level when dropped on a Character Sheet
- Auto obfuscate Cyphers and Artifacts when dropped on a Character Sheet
- Added a new option on the HUD Token to send GM intrusion in the chat
- Added the "Get Random Item(s) from Compendium" macro