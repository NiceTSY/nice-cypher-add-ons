# Creation Tool

<p align="justify">
It now makes possible to drag a journal entry with the specified tag on the character sheet, linking the journal to the corresponding Descriptor/Focus/Type (works with the additional sentence as well). This will also automatically add any tagged Abilities/Skills/Items from the journal on the actor.

The tool does support journal renaming (you will still need to close and open again the sheet as it needs to be re-rendered). However, currently, it does not support journals from compendiums, they should always come from your world.

<i>Be careful as the tool will always revert to default the sheet before adding linked journals content.</i>
</p>

## How To

Along the documentation, the following terms will be used:

- **Flag**: corresponds to **@** and mean the tool shall read the line in the journal if it is at the start
- **Linked Journal**: means a journal that should be used by the tool
- **Tags**: corresponds to a word with a flag, the tool will use it to understand what to do

### Type of journal

<p align="justify">
In order for the module to understand the journal you want to drop on your actor is a Linked Journal, it needs to understand the current journal type. Meaning what part of the sentence it needs to be linked to. For example, the journal <b>Glaive</b> shall be linked as a <b>Type</b>.

<b> IMPORTANT:</b> the journal type shall always be the first line of the journal, otherwise it will not be recognised.
</p>

**Supported Tags:**

- @descriptor
- @focus
- @type
- @additional or @additionalSentence

### Stats

<p align="justify">
Stats are the Pools of your character, corresponding Edges, and its Effort. Each stat shall be preceded by the Flag and followed by its value. An Edge for the Might, Speed and Intellect Pools can be specified on the same line with another number. If the value of the Edge is not specified it will be 0 by default.

The tool also supports modifiers for all of the stats, those modifiers shall be wrote with either <b>+</b> sign or a <b>-</b> sign. Otherwise, it will be understood as a full value and could erase the one from another journal.
</p>

**Supported Tags:**

- @might
- @speed
- @intellect
- @additional or @additionalPool
- @effort

**Examples:**

- `@might 11 1`
- `@speed 10 Edge: 1`
- `@intellect 7`
- `@effort 1`
- `@might +3`
- `@speed +0 +1` => This will be understood as having one more Edge but no Speed value (it will keep the current value of the Speed Pool).

### Items

<p align="justify">
Items are everything that should be added to the character, either it is skills, abilities, cypher, equipment, etc. The item entity link needs to follow the Tag (something looking like <code>@Item[aTPZaWq1DtjxKaz2]{Torche}</code>) either it is coming from the current world or from a compendium. If the same item is shown across multiple Linked Journals and is quantifiable, the tool will automatically increase the quantity by one. It will also give multiple times the item if it is not quantifiable but for Skills, Abilities, and Artifacts.

Items support different optional informative Tags but will all works with the main one.

The tool also supports options for quantifiable items, skills level (by default they will be shown as Practiced) and abilities tier.
</p>

**Supported Tags:**

- @item
- (optional) @skill
- (optional) @ability
- (optional) @cypher
- (optional) @artifact
- (optional) @oddity
- (optional) @weapon
- (optional) @armor
- (optional) @equipment
- (optional) @material

**Examples:**

- `@item @Item[aTPZaWq1DtjxKaz2]{Torche}`
- `@item @Compendium[fancymoduleorsystem.fancycompendium.aTPZaWq1DtjxKaz2]{Torche}`
- `@equipment @Item[aTPZaWq1DtjxKaz2]{Torche}`
- `@skill @Item[XXW7fJr1zCAESIlA]{Jumping}`
- `@cypher @Item[nWh8oXaNM0x1oDav]{Density Nodule}`

#### Option for quantifiable items

<p align="justify">
Quantifiable items can be followed by the <code>@quantity</code> option. This one will add as many as the desired item.
</p>

**Example:** `@item @Item[aTPZaWq1DtjxKaz2]{Torche} @quantity 4` will add 4 Torches

#### Option for skills

<p align="justify">
Skills can be followed by the <code>@level</code> option. This one will add the skill to the specified level. It supports the following options (as well as their equivalent in the language of your system - this will only work with language supported by the Cypher System and is not dependant on this module):
</p>

- Inability
- Practiced
- Trained
- Specialized

**Example:** `@item @Item[BLIPYnvITSF9LtPn]{Climbing} @level Trained` will give the climbing skill as trained

<p align="justify">
If more than one journal add the same skills, but from different level, the tool will try to calculate the corresponding level. For example, if the Type journal has <code>@skill @Item[BLIPYnvITSF9LtPn]{Climbing} @level inability</code> and the Descriptor journal has <code>@skill @Item[BLIPYnvITSF9LtPn]{Climbing} @level specialized</code>, the tool will calculate the skill as trained.
</p>

#### Option for abilities

<p align="justify">
Abilities can be followed by the <code>@tier</code> option. This one will add the ability to the actor only if he is in the same tier as specified.
</p>

**Example:** `@item @Item[sPKU1KJBMTwaSujl]{[Enabler] Trained in Armor} @tier 2` will only give the ability if the actor is tier 2

<p align="justify">
This currently, will not auto-update when the character change tier.
</p>

## Journal Example

![](https://raw.githubusercontent.com/NiceTSY/nice-cypher-add-ons/master/screenshots/creation_tool_example.png)