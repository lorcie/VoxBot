/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};

var searchnodestypes = {
    NUMERIC_CHILD: '_NUMERIC_CHILD', // select child based on end user numeric answer.
    TAG: '_TAG'                      // search first node with same tag
};

// Questions
var nodes = [{ "node": "0", "gotoNode":"_NUMERIC_CHILD", "message": "You have access to following search options : Say 1 to search by type, say 2 to search by name"},
             { "node": "0.1", "gotoNode":"_NUMERIC_CHILD", "message": "The Pokemon Go classification will start by type : Say","children":["Grass","Fire","water","Bug","Normal","Poison","Electric","Ground","Fairy","Fighting","Psychic","Flying","Ghost"] },
             { "node": "0.2", "gotoNode":"_TAG", "message": "Please answer with either Pokemon name either Pokédex unique number" },
             { "node": "0.1.1", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Grass type Pokemon in following list : Say ","children":["Bulbasaur", "Ivysaur","Venusaur","Oddish","Gloom","Vileplume","Bellsprout","Weepinbell","Victreebel","Exeggcute","Exeggutor","Tangela"] },
             { "node": "0.1.2", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Fire type Pokemon in following list : Say ","children":["Charmander","Charmeleon","Charizard","Vulpix","Ninetales","Growlithe","Arcanine","Ponyta","Rapidash","Magmar","Flareon"] },
             { "node": "0.1.3", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Water type Pokemon in following list : Say ","children":["Squirtle","Wartortle","Blastoise","Psyduck","Golduck","Poliwag","Poliwhirl","Poliwrath","Tentacool","Tentacruel","Seel","Dewgong","Shellder","Cloyster","Krabby","Kingler","Horsea","Seadra","Goldeen","Seaking","Staryu","Starmie","Magikarp","Lapras","Vaporeon","Omanyte","Omastar","Kabuto","Kabutops"] },
             { "node": "0.1.4", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Bug type Pokemon in following list : Say ","children":["Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Paras","Parasect","Venonat","Venomoth","Pinsir"] },
             { "node": "0.1.5", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Normal type Pokemon in following list : Say","children":["Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate","Spearow","Fearow","Meowth","Persian","Farfetch'd","Lickitung","Chansey","Kangaskhan","Tauros","Ditto","Eevee","Porygon","Snorlax"] },
             { "node": "0.1.6", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Poison type Pokemon in following list : Say","children":["Ekans","Arbok","Nidoran Female","Nidorina","Nidoqueen","Nidoran Male","Nidorino","Nidoking","Zubat","Golbat","Grimer","Muk","Koffing","Weezing"] },
             { "node": "0.1.7", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Electric type Pokemon in following list : Say","children":["Pikachu","Raichu","Magnemite","Magneton","Voltorb","Electrode","Electabuzz","Jolteon"] },
             { "node": "0.1.8", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Ground type Pokemon in following list : Say","children":["Sandshrew","Sandslash","Diglett","Dugtrio","Geodude","Graveler","Golem","Onix","Cubone","Marowak","Rhyhorn","Rhydon"] },
             { "node": "0.1.9", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Fairy type Pokemon in following list : Say","children":["Clefairy","Clefable","Jigglypuff","Wigglytuff"] },
             { "node": "0.1.10", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Fighting type Pokemon in following list : Say","children":["Mankey","Primeape","Machop","Machoke","Machamp","Hitmonlee","Hitmonchan"] },
             { "node": "0.1.11", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Psychic type Pokemon in following list : Say","children":["Abra","Kadabra","Alakazam","Slowpoke","Slowbro","Drowzee","Hypno","Mr. Mime","Jynx","Mewtwo","Mew"] },
             { "node": "0.1.12", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Flying type Pokemon in following list : Say","children":["Doduo","Dodrio","Scyther","Gyarados","Aerodactyl","Articuno","Zapdos","Moltres"] },
             { "node": "0.1.13", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Ghost type Pokemon in following list : Say","children":["Gastly","Haunter","Gengar"] },
             { "node": "0.1.14", "gotoNode":"_NUMERIC_CHILD", "message": "Please select the Dragon type Pokemon in following list : Say","children":["Dratini","Dragonair","Dragonite"] },

// Answers & descriptions
             { "node": "0.1.1.1", "gotoNode":"0", "message": "here is Bulbasaur, type : grass, poison. Using Bulbasaur Candy. it can evolve into a Ivysaur", "description": "Pokédex number 1 Bulbasaur can be seen napping in bright sunlight. There is a seed on it's back. By soaking up the sun's rays, the seed grows progressively larger.","tag":"1,Bulbasaur" },
             { "node": "0.1.1.2", "gotoNode":"0", "message": "here is Ivysaur, type : grass, poison. Using Bulbasaur Candy. It will evolve into a Venusaur.", "description": "Pokédex number 2 There is a bud on this Pokémon's back. To support its weight, Ivysaur's legs and trunk grow thick and strong. If it starts spending more time lying in the sunlight, it's a sign that the bud will bloom into a large flower soon","tag":"2,Ivysaur"},
             { "node": "0.1.1.3", "gotoNode":"0", "message": "here is Venusaur, type : grass, poison : highest evolution form", "description": "Pokédex number 3 There is a large flower on Venusaur's back. The flower is said to take on vivid colors if it gets plenty of nutrition and sunlight. The flower's aroma soothes the emotions of people","tag":"3,Venusaur"},
             { "node": "0.1.1.4", "gotoNode":"0", "message": "here is Oddish, type:grass,poison. using Oddish Candy. It will evolve into a Gloom", "description": "Pokédex number 43 During the daytime, Oddish buries itself in soil to absorb nutrients from the ground using its entire body. The more fertile the soil, the glossier its leaves become.","tag":"43,Oddish" },
             { "node": "0.1.1.5", "gotoNode":"0", "message": "here is Gloom, type:grass,poison. using Oddish Candy. It will evolve into a Vileplume", "description": "Pokédex number 44 Gloom releases a foul fragrance from the pistil of its flower. When faced with danger, the stench worsens. If this Pokémon is feeling calm and secure, it does not release its usual stinky aroma","tag":"44,Gloom"},
             { "node": "0.1.1.6", "gotoNode":"0", "message": "here is Vileplume, type:grass,poison:highest evolution form", "description": "Pokédex number 45 Vileplume's toxic pollen triggers atrocious allergy attacks. That's why it is advisable never to approach any attractive flowers in a jungle, however pretty they may be","tag":"45,Vileplume"},
             { "node": "0.1.1.7", "gotoNode":"0", "message": "here is Bellsprout, type:grass,poison, using Bellsprout Candy. It will evolve into a Weepinbel", "description": "Pokédex number 69 Bellsprout's thin and flexible body lets it bend and sway to avoid any attack, however strong it may be. From its mouth, this Pokémon spits a corrosive fluid that melts even iron","tag":"69,Bellsprout" },
             { "node": "0.1.1.8", "gotoNode":"0", "message": "here is Weepinbell, type:grass,poison. using 100 Bellsprout Candy. It will evolve into a Victreebel", "description": "Pokédex number 70 Weepinbell has a large hook on its rear end. At night, the Pokémon hooks on to a tree branch and goes to sleep. It it moves around in its sleep, it may wake up to find itself on the ground","tag":"70,Weepinbell"},
             { "node": "0.1.1.9", "gotoNode":"0", "message": "here is Victreebel,type:grass,poison : highest evolution form", "description": "Pokédex number 71 Victreebel has a long vine that extends from its head. This vine is waved and flicked about as if it were an animal to attract prey. When an unsuspecting prey draws near, this Pokémon swallows it whole","tag":"71,Victreebel"},
             { "node": "0.1.1.10", "gotoNode":"0", "message": "here is Exeggcute, type:grass,psychic. using Exeggcute Candy. It will evolve into a Exeggutor", "description": "Pokédex number 102 This pokémon consists of six eggs that form a closely knit cluster. The six eggs attract each other and spin around. When cracks increasingly appear on the eggs, Exeggcute is close to evolution","tag":"102,Exeggcute"},
             { "node": "0.1.1.11", "gotoNode":"0", "message": "here is Exeggutor, type:grass,psychic. highest evolution form", "description": "Pokédex number 103 Exeggutor originally came from the tropics. Its heads steadily grow larger from exposure to strong sunlight. It is said that when the heads fall off, they group together to form Exeggcute","tag":"103,Exeggutor"},
             { "node": "0.1.1.12", "gotoNode":"0", "message": "here is Tangela, type:grass", "description": "Pokédex number 114 Tangela's vines snap off easily if they are grabbed. This happens without pain, allowing it to make a quick getaway. The lost vines are replaced by newly grown vines the very next day","tag":"114,Tangela"},
             { "node": "0.1.2.1", "gotoNode":"0", "message": "here is Charmander, type : fire, using Charmander Candy. It will evolve into a Charmeleon", "description": "Pokédex number 4 The flame that burns at the tip of its tail is an indication of its emotions. The flame waves when Charmander is enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.","tag":"4,Charmander"},
             { "node": "0.1.2.2", "gotoNode":"0", "message": "here is Charmeleon, type : fire, using Charmander Candy. It will evolve into a Charizard", "description": "Pokédex number 5 Charmeleon mercilessly destroys its foes using its sharp claws. If it encounters a strong foe, it turns aggressive. In this excited state, the flame at the tip of its tail flares with a bluish white color","tag":"5,Charmeleon"},
             { "node": "0.1.2.3", "gotoNode":"0", "message": "here is Charizard, type : fire, flying : highest evolution form", "description": "Pokédex number 6 Charizard flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts anything. However, it never turns its fiery breath on any opponent weaker than itself.","tag":"6,Charizard"},
             { "node": "0.1.2.4", "gotoNode":"0", "message": "here is Vulpix, type:fire. using Vulpix Candy. It will evolve into a Ninetales", "description": "Pokédex number 37 At the time of its birth, Vulpix has one white tail. The tail separates into six if this Pokémon receives plenty of love from its Trainer. The six tails become magnificently curled","tag":"37,Vulpix"},
             { "node": "0.1.2.5", "gotoNode":"0", "message": "here is Ninetales, type:fire : highest evolution form", "description": "Pokédex number 38 Ninetales casts a sinister light from its bright red eyes to gain total control over its foe's mind. This Pokémon is said to live for a thousand years","tag":"38,Ninetales"},
             { "node": "0.1.2.6", "gotoNode":"0", "message": "here is Growlithe, type:fire. using Growlithe Candy. It will evolve into a Arcanine", "description": "Pokédex number 58 Growlithe has a superb sense of smell. Once it smells anything, this Pokémon won't forget the scent, no matter what. It uses its advance olfactory sense to determine the emotions of other living things","tag":"58,Growlithe"},
             { "node": "0.1.2.7", "gotoNode":"0", "message": "here is Arcanine, type:fire. highest evolution form", "description": "Pokédex number 59 Arcanine is known for its high speed. It is said to be capable of running over 6,200 miles in a single day and night. The fire that blazes wildly within this Pokémon's body is its source of power","tag":"59,Arcanine"},
             { "node": "0.1.2.8", "gotoNode":"0", "message": "here is Ponyta, type:fire. using Ponyta Candy. It will evolve into a Rapidash", "description": "Pokédex number 77 Ponyta is very weak at birth. It can barely stand up. This Pokémon becomes stronger by stumbling and falling to keep up with its parent","tag":"77,Ponyta"},
             { "node": "0.1.2.9", "gotoNode":"0", "message": "here is Rapidash, type:fire. highest evolution form", "description": "Pokédex number 78 Rapidash usually can be seen casually cantering in the fields and plains. However, when this Pokémon turns serious, its fiery manes flare and blaze as it gallops its way up to 150 mph","tag":"78,Rapidash"},
             { "node": "0.1.2.10", "gotoNode":"0", "message": "here is Magmar, type:fire", "description": "Pokédex number 126 In battle, Magmar blows out intensely hot flames from all over its body to intimidate its opponent. This Pokémon's fiery bursts create heat waves that ignite grass and trees in its surroundings","tag":"126,Magmar"},
             { "node": "0.1.2.11", "gotoNode":"0", "message": "here is Flareon, type:fire", "description": "Pokédex number 136 Flareon's fluffy fur has a functional purpose-it releases heat into the air so that its body does not get excessively hot. This Pokémon's body temperature can rise to a maximum of 1,650 degrees Fahrenheit","tag":"136,Flareon"},
             { "node": "0.1.3.1", "gotoNode":"0", "message": "here is Squirtle, type : water, using Squirtle Candy. It will evolve into a Wartortle", "description": "Pokédex number 7 Squirtle's shell is not merely used for protection. The shell's rounded shape and the grooves on its surface help minimize resistance in water, enabling this Pokémon to swim at high speeds","tag":"7,Squirtle"},
             { "node": "0.1.3.2", "gotoNode":"0", "message": "here is Wartortle, type : water, using Squirtle Candy. It will evolve into a Blastoise", "description": "Pokédex number 8 Its tail is large and covered with a rich, thick fur. The tail becomes increasingly deeper in color as Wartortle ages. The scratches on its shell are evidence of this Pokémon's toughness as a battler","tag":"8,Wartortle"},
             { "node": "0.1.3.3", "gotoNode":"0", "message": "here is Blastoise, type : water, highest evolution form", "description": "Pokédex number 9 Blastoise has water spouts that protrude from its shell. The water spouts are very accurate. They can shoot bullets of water with enough accuracy to strike empty cans from a distance of over 160 feet","tag":"9,Blastoise" },
             { "node": "0.1.3.4", "gotoNode":"0", "message": "here is Psyduck, type:water. using Psyduck Candy. It will evolve into a Golduck", "description": "Pokédex number 54 Psyduck uses a mysterious power. When it does so, this Pokèmon generates brainwaves that are supposedly only seen in sleepers. This discovery spurred a controversy amoung scholars","tag":"54,Psyduck"},
             { "node": "0.1.3.5", "gotoNode":"0", "message": "here is Golduck, type:water. highest evolution form", "description": "Pokédex number 55 The webbed flippers on its forelegs and hind legs and the streamlined body of Golduck give it frightening speed. This Pokémon is definitely much faster than even the most athletic swimmer","tag":"55,Golduck" },
             { "node": "0.1.3.6", "gotoNode":"0", "message": "here is Poliwag, type:water. using Poliwag Candy. It will evolve into a Poliwhirl", "description": "Pokédex number 60 Poliwag has very thin skin. It is possible to see the Pokèmon's spiral innards right through the skin. Despite its thinness, however, the skin is also very flexible. Even sharp fangs bounce right off it","tag":"60,Poliwag" },
             { "node": "0.1.3.7", "gotoNode":"0", "message": "here is Poliwhirl, type:water. using Poliwag Candy. It will evolve into a Poliwrath", "description": "Pokédex number 61 The surface of Poliwhirl's body is always wet and slick with a slimy fluid. Because of this slippery covering, it can easily slip and slide out of the clutches of any enemy in battle","tag":"61,Poliwhirl"},
             { "node": "0.1.3.8", "gotoNode":"0", "message": "here is Poliwrath, type:water,fighting. highest evolution form", "description": "Pokédex number 62 Poliwrath's highly developed, brawny muscles never grow fatigued, however much it exercises. It is so tirelessly strong, this Pokémon can swim back and forth across the ocean without effort","tag":"62,Poliwrath" },
             { "node": "0.1.3.9", "gotoNode":"0", "message": "here is Tentacool, type:water. using Tentacool Candy. It will evolve into a Tentacruel", "description": "Pokédex number 72 Tentacool's body is largely composed of water. If it is removed from the sea, it dries up like parchment. If this Pokémon happens to become dehydrated, put it back into the sea","tag":"72,Tentacool"},
             { "node": "0.1.3.10", "gotoNode":"0", "message": "here is Tentacruel, type:water:highest evolution form", "description": "Pokédex number 73 Tentacruel has large red orbs on its head. The orbs glow before lashing the vicinity with a harsh ultrasonic blast. This Pokémon's outburst creates rough waves around it","tag":"73,Tentacruel" },
             { "node": "0.1.3.11", "gotoNode":"0", "message": "here is Seel, type:water. using Seel Candy. It will evolve into a Dewgong", "description": "Pokédex number 86 Seel hunts for prey in the frigid sea underneath sheets of ice. When it needs to breathe, it punches a hole through the ice with the sharply protuding section of its head","tag":"86,Seel"},
             { "node": "0.1.3.12", "gotoNode":"0", "message": "here is Dewgong, type:water : highest evolution form", "description": "Pokédex number 87 Dewgong loves to snooze on bitterly cold ice. The sight of this Pokémon sleeping on a glacier was mistakenly thought to be a mermaid by a mariner long ago","tag":"87,Dewgong" },
             { "node": "0.1.3.13", "gotoNode":"0", "message": "here is Shellder, type:water. using Shellder Candy. It will evolve into a Cloyster", "description": "Pokédex number 90 At night, this Pokèmon uses its broad tongue to burrow a hole in the seafloor sand and the sleep in it. While it is sleeping, Shelldar closes its shell, but leaves its tongue hanging out","tag":"90,Shellder"},
             { "node": "0.1.3.14", "gotoNode":"0", "message": "here is Cloyste, type:water : highest evolution form", "description": "Pokédex number 91 Cloyster is capable of swimming in the sea. It does so by swallowing water, then jetting it out toward the rear. This Pokémon shoots spikes from its shell using the same system","tag":"91,Cloyster" },
             { "node": "0.1.3.15", "gotoNode":"0", "message": "here is Krabby, type:water. using Krabby Candy. It will evolve into a Kingler", "description": "Pokédex number 98 Krabby live on beaches, burrowed inside holes dug into the sand. On sandy beaches with little in the way of food, these Pokémon can be seen squabbling with each other over territory.","tag":"98,Krabby"},
             { "node": "0.1.3.16", "gotoNode":"0", "message": "here is Kingler, type:water: highest evolution form", "description": "Pokédex number 99 Kingler has an enormous, oversized claw. It waves this huge claw in the air to communicate with others. However, because the claw is so heavy, the Pokémon quickly tires","tag":"99,Kingler" },
             { "node": "0.1.3.17", "gotoNode":"0", "message": "here is Horsea, type:water. using Horsea Candy. It will evolve into a Seadra", "description": "Pokédex number 116 Horsea eats small insects and moss off of rocks. If the ocean current turns fast, this Pokémon anchors itself by wrapping its tail around rocks or coral to prevent being washed away","tag":"116,Horsea" },
             { "node": "0.1.3.18", "gotoNode":"0", "message": "here is Seadra, type:water : highest evolution form", "description": "Pokédex number 117 Seadra sleeps after wriggling itself between the branches of coral. Those trying to harvest coral are occasionally stung by this Pokémon's poison barbs if they fail to notice it","tag":"117,Seadra"},
             { "node": "0.1.3.19", "gotoNode":"0", "message": "here is Goldeen, type:water. using Goldeen Candy. It will evolve into a Seaking", "description": "Pokédex number 118 Goldeen is a very beautiful Pokèmon with fins that billow elegantly in water. However, don't let your guard down around this Pokèmon - it could ram you powerfully with its horn","tag":"118,Goldeen" },
             { "node": "0.1.3.20", "gotoNode":"0", "message": "here is Seaking, type:water: highest evolution form", "description": "Pokédex number 119 In the autumn, Seaking males can be seen performing courtship dances in riverbeds to woo females. During this season, this Pokémon's body coloration is at its most beautiful.","tag":"119,Seaking"},
             { "node": "0.1.3.21", "gotoNode":"0", "message": "here is Staryu, type:water. using Staryu Candy. It will evolve into a Starmie", "description": "Pokédex number 120 Staryu's center section has an organ called the core that shines bright red. If you go to a beach towards the end of summer, the glowing cores of these Pokèmon look like the stars in the sky","tag":"120,Staryu" },
             { "node": "0.1.3.22", "gotoNode":"0", "message": "here is Starmie, type:water,psychic highest evolution form", "description": "Pokédex number 121 Starmie's center section—the core—glows brightly in seven colors. Because of its luminous nature, this Pokémon has been given the nickname “the gem of the sea","tag":"121,Starmie" },
             { "node": "0.1.3.23", "gotoNode":"0", "message": "here is Magikarp, type:water. using Magikarp Candy. It will evolve into a Gyarados" , "description": "Pokédex number 129 Magikarp is a pathetic excuse for a Pokèmon that is only capable of flopping and splashing. This behavior prompted scientists to undertake research into it","tag":"129,Magikarp" },
             { "node": "0.1.3.24", "gotoNode":"0", "message": "here is Lapras, type:water,ice", "description": "Pokédex number 131 People have driven Lapras almost to the point of extinction. In the evenings, this Pokémon is said to sing plaintively as it seeks what few others of its kind still remain","tag":"131,Lapras" },
             { "node": "0.1.3.25", "gotoNode":"0", "message": "here is Vaporeon, type:water. highest evolution form", "description": "Pokédex number 134 Vaporeon underwent a spontaneous mutation and grew fins and gills that allow it to live underwater. This Pokémon has the ability to freely control water","tag":"134,Vaporeon" },
             { "node": "0.1.3.26", "gotoNode":"0", "message": "here is Omanyte, type:rock,water. using Omanyte Candy. It will evolve into a Omastar", "description": "Pokédex number 138 Omanyte is one of the ancient and long-since-extinct Pokémon that have been regenerated from fossils by people. If attacked by an enemy, it withdraws itself inside its hard shell","tag":"138,Omanyte" },
             { "node": "0.1.3.27", "gotoNode":"0", "message": "here is Omastar, type:rock,water. highest evolutionn form, type:rock,water", "description": "Pokédex number 139 Omastar uses its tentacles to capture its prey. It is believed to have become extinct because its shell grew too large and heavy, causing its movements to become too slow and ponderous","tag":"139,Omastar" },
             { "node": "0.1.3.28", "gotoNode":"0", "message": "here is Kabuto, type:rock;water. using Kabuto Candy. It will evolve into a Kabutops", "description": "Pokédex number 140 Kabuto is a Pokémon that has been regenerated from a fossil. However, in extremely rare cases, living examples have been discovered. The Pokémon has not changed at all for 300 million years","tag":"140,Kabuto" },
             { "node": "0.1.3.29", "gotoNode":"0", "message": "here is Kabutops, type:rock;water. highest evolution form", "description": "Pokédex number 141 Kabutops swam underwater to hunt for its prey in ancient times. The Pokémon was apparently evolving from being a water dweller to living on land as evident from the beginnings of change in its gills and legs","tag":"141,Kabutops" },
             { "node": "0.1.4.1", "gotoNode":"0", "message": "here is Caterpie, type : bug, using Caterpie Candy. It will evolve into a Metapod", "description": "Pokédex number 10 Caterpie has a voracious appetite. It can devour leaves bigger than its body right before your eyes. From its antenna, this Pokémon releases a terrifically strong odor","tag":"10,Caterpie"},
             { "node": "0.1.4.2", "gotoNode":"0", "message": "here is Metapod, type : bug, using Caterpie Candy. It will evolve into a Butterfree", "description": "Pokédex number 11 The shell covering this Pokémon's body is as hard as an iron slab. Metapod does not move very much. It stays still because it is preparing its soft innards for evolution inside the hard shell","tag":"11,Metapod"},
             { "node": "0.1.4.3", "gotoNode":"0", "message": "here is Butterfree, type : bug, flying : highest evolution form", "description": "Pokédex number 12 Butterfree has a superior ability to search for delicious honey from flowers. It can even search out, extract, and carry honey from flowers that are blooming over six miles from its nest","tag":"12,Butterfree"},
             { "node": "0.1.4.4", "gotoNode":"0", "message": "here is Weedle, type : bug,poison. using Weedle Candy. It will evolve into a Kakuna", "description": "Pokédex number 13 Weedle has an extremely acute sense of smell. It is capable of distinguishing its favorite kinds of leaves from those it dislikes just by sniffing with its big red proboscis (nose)","tag":"13,Weedle"},
             { "node": "0.1.4.5", "gotoNode":"0", "message": "here is Kakuna, type : bug,poison. using Weedle Candy. It will evolve into a Beedrill", "description": "Pokédex number 14 Kakuna remains virtually immobile as it clings to a tree. However, on the inside, it is extremely busy as it prepares for its coming evolution. This is evident from how hot the shell becomes to the touch","tag":"14,Kakuna"},
             { "node": "0.1.4.6", "gotoNode":"0", "message": "here is Beedrill, type : bug,poison : highest evolution form", "description": "Pokédex number 15 Beedrill is extremely territorial. No one should ever approach its nest-this is for their own safety. If angered, they will attack in a furious swarm","tag":"15,Beedrill"},
             { "node": "0.1.4.7", "gotoNode":"0", "message": "here is Paras, type: bug,grass. using Paras Candy. It will evolve into a Parasect", "description": "Pokédex number 46 Paras has parasitic mushrooms growing on its back called tochukaso. They grow large by drawing nutrients from this Bug Pokémon host. They are highly valued as a medicine for extending life","tag":"46,Paras"},
             { "node": "0.1.4.8", "gotoNode":"0", "message": "here is Parasect, type:bug,grass:highest evolution form", "description": "Pokédex number 47 Parasect is known to infest large trees en masse and drain nutrients from the lower trunk and roots. When an infested tree dies, they move onto another tree all at once","tag":"47,Parasect"},
             { "node": "0.1.4.9", "gotoNode":"0", "message": "here is Venonat, type:bug,poison. using Venonat Candy. It will evolve into a Venomoth", "description": "Pokédex number 48 Venonat is said to have evolved with a coat of thin, stiff hair that covers its entire body for protection. It possesses large eyes that never fail to spot even minuscule prey","tag":"48,Venonat"},
             { "node": "0.1.4.10", "gotoNode":"0", "message": "here is Venomoth, type:bug,poison:highest evolution form", "description": "Pokédex number 49 Venomoth is nocturnal - it is a Pokèmon that only becomes active at night. Its favorite prey are small insects that gather around streetlights, attracted by the light in the darkness","tag":"49,Venomoth"},
             { "node": "0.1.4.11", "gotoNode":"0", "message": "here is Pinsir, type:fire", "description": "Pokédex number 127 Pinsir is astoundingly strong. It can grip a foe weighing twice its weight in its horns and easily lift it. This Pokémon's movements turn sluggish in cold places","tag":"127,Pinsir"},
             { "node": "0.1.5.1", "gotoNode":"0", "message": "here is Pidgey, type : normal,flying. using Pidgey Candy. It will evolve into a Pidgeotto", "description": "Pokédex number 16 Pidgey has an extremely sharp sense of direction. it is capable of unerringly returning home to its nest, however far it may be removed from its familiar surroundings","tag":"16,Pidgey"},
             { "node": "0.1.5.2", "gotoNode":"0", "message": "here is Pidgeotto, type: normal,flying. using Pidgey Candy. It will evolve into a Pidgeot", "description": "Pokédex number 17 Pidgeotto claims a large area as its own territory. This Pokémon flies around, patrolling its living space. If its territory is violated, it shows no mercy in thoroughly punishing the foe with its sharp claws","tag":"17,Pidgeotto"},
             { "node": "0.1.5.3", "gotoNode":"0", "message": "here is Pidgeot, type : normal,flying : highest evolution form", "description": "Pokédex number 18 This Pokémon has a dazzling plumage of beautifully glossy feathers. Many Trainers are captivated by the striking beauty of the feathers on its head, compelling them to choose Pidgeot as their Pokémon","tag":"18,Pidgeot"},
             { "node": "0.1.5.4", "gotoNode":"0", "message": "here is Rattata, type : normal. using Rattata Candy. It will evolve into a Raticate", "description": "Pokédex number 19 Rattata is cautious to the extreme. Even while it is asleep, it constantly listens by moving its ears around. It is not picky about where it lives-it will make its nest anywhere","tag":"19,Rattata"},
             { "node": "0.1.5.5", "gotoNode":"0", "message": "here is Raticate, type : normal : highest evolution form", "description": "Pokédex number 20 Raticate's sturdy fangs grow steadily. To keep them ground down, it gnaws on rocks and logs. It may even chew on the walls of houses.","tag":"20,Raticate"},
             { "node": "0.1.5.6", "gotoNode":"0", "message": "here is Spearow, type: normal, flying. using Spearow Candy. It will evolve into a Fearow", "description": "Pokédex number 21 Spearow has a very loud cry that can be heard over half a mile away. If its high, keening cry is heard echoing all around, it is a sign that they are warning each other of danger.","tag":"21,Spearow"},
             { "node": "0.1.5.7", "gotoNode":"0", "message": "here is Fearow, type: normal,flying : highest evolution form", "description": "Pokédex number 22 Fearow is recognized by its long neck and elongated beak. They are conveniently shaped for catching prey in soil or water. It deftly moves its long and skinny beak to pluck prey","tag":"22,Fearow"},
             { "node": "0.1.5.8", "gotoNode":"0", "message": "here is Meowth, type:normal. using Meowth Candy. It will evolve into a Persian", "description": "Pokédex number 52 Meowth withdraws its sharp claws into its paws to slinkily sneak about without making any incriminating footsteps. For some reason, this pokémon loves shiny coins that glitter with light","tag":"52,Meowth"},
             { "node": "0.1.5.9", "gotoNode":"0", "message": "here is Persian, type:normal:highest evolution form", "description": "Pokédex number 53 Persian has six bold whiskers that give it a look of toughness. The whiskers sense air movements to determine what is in the Pokémon's surrounding vicinity. It becomes docile if grabbed by the whiskers","tag":"53,Persian"},
             { "node": "0.1.5.10", "gotoNode":"0", "message": "here is Farfetch'd, type:normal,flying", "description": "Pokédex number 83 Farfetch'd is always seen with a stalk from a plant of some sort. Apparently, there are good stalks and bad stalks. This Pokémon has been known to fight with others over stalks","tag":"83,Farfetch'd"},
             { "node": "0.1.5.11", "gotoNode":"0", "message": "here is Lickitung, type:normal", "description": "Pokédex number 108 Whenever Lickitung comes across something new, it will unfailingly give it a lick. It does so because it memorizes things by texture and by taste. It is somewhat put off by sour things","tag":"108,Lickitung"},
             { "node": "0.1.5.12", "gotoNode":"0", "message": "here is Chansey, type:normal", "description": "Pokédex number 113 Chansey lays nutritionally excellent eggs on an everyday basis. The eggs are so delicious, they are easily and eagerly devoured by even those people who have lost their apetite","tag":"113,Chansey"},
             { "node": "0.1.5.13", "gotoNode":"0", "message": "here is Kangaskhan, type:normal", "description": "Pokédex number 115 If you come across a young Kangaskhan playing by itself, you must never disturb it or attempt to catch it. The baby Pokémon's parent is sure to be in the area, and it will become violently enraged at you","tag":"115,Kangaskhan"},
             { "node": "0.1.5.14", "gotoNode":"0", "message": "here is Tauros, type:normal", "description": "Pokédex number 128 This Pokémon is not satisfied unless it is rampaging at all times. If there is no opponent for Tauros to battle it will charge at thick trees and knock them down to calm itself","tag":"128,Tauros"},
             { "node": "0.1.5.15", "gotoNode":"0", "message": "here is Ditto, type:normal", "description": "Pokédex number 132 Ditto rearranges its cell structure to transform itself into other shapes. However, if it tries to transform itself into something by relying on its memory, this Pokémon manages to get details wrong","tag":"132,Ditto"},
             { "node": "0.1.5.16", "gotoNode":"0", "message": "here is Eevee, type:normal. using Eevee Candy. It will evolve into a Vaporeon / Jolteon / Flareon", "description": "Pokédex number 133 Eevee has an unstable genetic makeup that suddenly mutates due to the environment in which it lives. Radiation from various stones causes this Pokémon to evolve","tag":"133,Eevee"},
             { "node": "0.1.5.17", "gotoNode":"0", "message": "here is Porygon, type:normal", "description": "Pokédex number 137 Porygon is capable of reverting itself entirely back to program data and entering cyberspace. This Pokémon is copy protected so it cannot be duplicated by copying","tag":"137,Porygon"},
             { "node": "0.1.5.18", "gotoNode":"0", "message": "here is Snorlax, type:normal", "description": "Pokédex number 143 Snorlax's typical day consists of nothing more than eating and sleeping. It is such a docile Pokémon that there are children who use its expansive belly as a place to play","tag":"143,Snorlax"},
             { "node": "0.1.6.1", "gotoNode":"0", "message": "here is Ekans, type:poison, using Ekans Candy. It will evolve into an Arbok", "description": "Pokédex number 23 Ekans curls itself up in a spiral while it rests. Assuming this position allows it to quickly respond to a threat from any direction with a glare from its upraised head","tag":"23,Ekans" },
             { "node": "0.1.6.2", "gotoNode":"0", "message": "here is Arbok, type:poison : highest evolution form", "description": "Pokédex number 24 This Pokémon is terrifically strong in order to constrict things with its body. It can even flatten steel oil drums. Once Arbok wraps its body around its foe, escaping its crushing embrace is impossible","tag":"24,Arbok"},
             { "node": "0.1.6.3", "gotoNode":"0", "message": "here is NidoranFemale, type: poison. using Nidoranfemale Candy. It will evolve into a Nidorina", "description": "Pokédex number 29 Nidoran female has barbs that secrete a powerful poison. They are thought to have developed as protection for this small-bodied Pokémon. When enraged, it releases a horrible toxin from it's horn","tag":"29,NidoranFemale"},
             { "node": "0.1.6.4", "gotoNode":"0", "message": "here is Nidorina, type:poison. using Nidoran female Candy. It will evolve into a Nidoqueen", "description": "Pokédex number 30 When Nidorina are with their friends or family, they keep their barbs tucked away to prevent hurting each other. This Pokémon appears to become nervous if separated from the others","tag":"30,Nidorina"},
             { "node": "0.1.6.5", "gotoNode":"0", "message": "here is Nidoqueen, type:poison,ground : highest evolution form", "description": "Pokédex number 31 Nidoqueen's body is encased in extremely hard scales. It is adept at sending foes flying with harsh tackles. This Pokemon is at its strongest when it is defending its young","tag":"31,Nidoqueen"},
             { "node": "0.1.6.6", "gotoNode":"0", "message": "here is NidoranMale, type:poison, using Nidoran male Candy. It will evolve into a Nidorino", "description": "Pokédex number 32 Nidoran male has developed muscles for moving its ears. Thanks to them, the ears can be freely moved in any direction. Even the slightest sound does not escape this Pokémon's notice","tag":"32,NidoranMale"},
             { "node": "0.1.6.7", "gotoNode":"0", "message": "here is Nidorino, type:poison, using Nidoran male Candy. It will evolve into a Nidoking", "description": "Pokédex number 33 Nidorino has a horn that is harder than a diamond. If it senses hostile presence, all the barbs on its back bristle up at once, and it challenges the foe with all its might","tag":"33,Nidorino"},
             { "node": "0.1.6.8", "gotoNode":"0", "message": "here is Nidoking, type:poison,ground : highest evolution form", "description": "Pokédex number 34 Nidoking's thick tail packs enormously destructive power. With one swing, it can topple a metal transmission tower. Once this Pokémon goes on a rampage,there is no stopping it","tag":"34,Nidoking"},
             { "node": "0.1.6.9", "gotoNode":"0", "message": "here is Zubat, type:poison,flying. using Zubat Candy. It will evolve into a Golbat", "description": "Pokédex number 41 Zubat remains quietly unmoving in a dark spot during the bright daylight hours. It does so because prolonged exposure to the sun causes its body to become slightly burned","tag":"41,Zubat"},
             { "node": "0.1.6.10", "gotoNode":"0", "message": "here is Golbat, type:poison,flying : highest evolution form", "description": "Pokédex number 42 Golbat loves to drink the blood of living things. It is particularly active in the pitch black of night. This Pokémon flits around in the night skies, seeking fresh blood","tag":"42,Golbat"},
             { "node": "0.1.6.11", "gotoNode":"0", "message": "here is Grimer, type:poison. using Grimer Candy. It will evolve into a Muk", "description": "Pokédex number 88 Grimer's sludgy and rubbery body can be forced through any opening, however small it may be. This Pokémon enters sewer pipes to drink filthy wastewater","tag":"88,Grimer"},
             { "node": "0.1.6.12", "gotoNode":"0", "message": "here is Muk, type:poison: highest evolution form", "description": "Pokédex number 89 From Muk's body seeps a foul fluid that gives off a nose-bendingly horrible stench. Just one drop of this Pokémon's body fluid can turn a pool stagnant and rancid","tag":"89,Muk"},
             { "node": "0.1.6.13", "gotoNode":"0", "message": "here is Koffing, type:poison. using Koffing Candy. It will evolve into a Weezing", "description": "Pokédex number 109 If Koffing becomes agitated, it raises the toxicity of its internal gases and jets them out from all over its body. This Pokémon may also overinflate its round body, then explode","tag":"109,Koffing"},
             { "node": "0.1.6.14", "gotoNode":"0", "message": "here is Weezing, type:poison : highest evolution form", "description": "Pokédex number 110 Weezing loves the gases given off by rotted kitchen garbage. This Pokémon will find a dirty, unkempt house and make it its home. At night, when the people in the house are asleep, it will go through the trash","tag":"110,Weezing"},
             { "node": "0.1.7.1", "gotoNode":"0", "message": "here is Pikachu, type:electric. using Pikachu Candy. It will evolve into a Raichu", "description": "Pokédex number 25 Whenever Pikachu comes across something new, it blasts it with a jolt of electricity. If you come across a blackened berry, it's evidence that this Pokémon mistook the intensity of its charge","tag":"25,Pikachu" },
             { "node": "0.1.7.2", "gotoNode":"0", "message": "here is Raichu, type:electric : highest evolution form", "description": "Pokédex number 26 If the electrical sacs become excessively charged, Raichu plants its tail in the ground and discharges. Scorched patches of ground will be found near this Pokémon's nest","tag":"26,Raichu"},
             { "node": "0.1.7.3", "gotoNode":"0", "message": "here is Magnemite, type:electric,steel. using Magnemite Candy. It will evolve into a Magneton", "description": "Pokédex number 81 Magnemite attaches itself to power lines to feed on electricity. If your house has a power outage, check your circuit breakers. You may find a large number of this Pokémon clinging to the breaker box","tag":"81,Magnemite" },
             { "node": "0.1.7.4", "gotoNode":"0", "message": "here is Magneton, type:electric,steel : highest evolution form", "description": "Pokédex number 82 Magneton emits a powerful magnetic force that is fatal to mechanical devices. As a result, large cities sound sirens to warn citizens of large-scale outbreaks of this Pokémon","tag":"82,Magneton"},
             { "node": "0.1.7.5", "gotoNode":"0", "message": "here is Voltorb, type:electric. using Voltorb Candy. It will evolve into a Electrode", "description": "Pokédex number 100 Voltorb was first sighted at a company that manufactures Poke Balls. The link between that sighting and the fact that this Pokemon looks very similar to a Poke Ball remains a mystery.","tag":"100,Voltorb" },
             { "node": "0.1.7.6", "gotoNode":"0", "message": "here is Electrode, type:electric : highest evolution form", "description": "Pokédex number 101 Electrode eats electricity in the atmosphere. On days when lightning strikes, you can see this Pokémon exploding all over the place from eating too much electricity","tag":"101,Electrode"},
             { "node": "0.1.7.7", "gotoNode":"0", "message": "here is Electabuzz, type:electric", "description": "Pokédex number 125 When a storm arrives, gangs of this Pokémon compete with each other to scale heights that are likely to be stricken by lightning bolts. Some towns use Electabuzz in place of lightning rods","tag":"125,Electabuzz"},
             { "node": "0.1.7.8", "gotoNode":"0", "message": "here is Jolteon", "description": "Pokédex number 135 Jolteon's cells generate a low level of electricity. This power is amplified by the static electricity of its fur, enabling the Pokémon to drop thunderbolts. The bristling fur is made of electrically charged needles","tag":"135,Jolteon"},
             { "node": "0.1.8.1", "gotoNode":"0", "message": "here is Sandshrew, type:ground. using Sandshrew Candy. It will evolve into a Sandslash", "description": "Pokédex number 27 Sandshrew's body is configured to absorb water without waste, enabling it to survive in an arid desert. This Pokémon curls up to protect itself from its enemies","tag":"27,Sandshrew" },
             { "node": "0.1.8.2", "gotoNode":"0", "message": "here is Sandslash, type:ground : highest evolution form", "description": "Pokédex number 28 Sandslash's body is covered by tough spikes, which are hardened sections of its hide. Once a year, the old spikes fall out, to be replaced with new spikes that grow out from beneath the old ones","tag":"28,Sandslash"},
             { "node": "0.1.8.3", "gotoNode":"0", "message": "here is Diglett, type:ground, using Diglett Candy. It will evolve into a Dugtrio", "description": "Pokédex number 50 Diglett are raised in most farms. The reason is simple-wherever this Pokémon burrows, the soil is left perfectly tilled for planting crops. This soil is made ideal for growing delicious vegetables","tag":"50,Diglett" },
             { "node": "0.1.8.4", "gotoNode":"0", "message": "here is Dugtrio, type:ground, highest evolution form", "description": "Pokédex number 51 Dugtrio are actually triplets that emerged from one body. As a result, each triplet thinks exactly like the other two triplets. They work cooperatively to burrow endlessly","tag":"51,Dugtrio"},
             { "node": "0.1.8.5", "gotoNode":"0", "message": "here is Geodude, type:rock,ground. using Geodude Candy. It will evolve into a Graveler", "description": "Pokédex number 74 The longer a Geodude lives, the more its edges are chipped an worn away., making it more rounded in appearance. However, this Pokémon's heart will remain hard, craggy and rough always","tag":"74,Geodude"},
             { "node": "0.1.8.6", "gotoNode":"0", "message": "here is Graveler, type:rock,ground. using Geodude Candy. It will evolve into a Golem", "description": "Pokédex number 75 Graveler grow by feeding on rocks. Apparently, it prefers to eat rocks that are covered in moss. This Pokémon eats its way through a ton of rocks on a dailt basis","tag":"75,Graveler" },
             { "node": "0.1.8.7", "gotoNode":"0", "message": "here is Golem, type:rock,ground :highest evolution form", "description": "Pokédex number 76 Golem live up on mountains. If there is a large earthquake, these Pokémon will come rolling down off the mountains en masse to the foothills below","tag":"76,Golem"},
             { "node": "0.1.8.8", "gotoNode":"0", "message": "here is Onix, type : rock,ground", "description": "Pokédex number 95 Onix has a magnet in its brain. It acts as a compass so that this Pokémon does not lose direction while it is tunneling. As it grows older, its body becomes increasingly rounder and smoother","tag":"95,Onix"},
             { "node": "0.1.8.9", "gotoNode":"0", "message": "here is Cubone, type:ground. using Cubone Candy. It will evolve into a Marowak", "description": "Pokédex number 104 Cubone pines for the mother it will never see again. Seeing a likeness of its mother in the full moon, it cries. The stains on the skull the Pokémon wears are made by the tears it sheds","tag":"104,Cubone"},
             { "node": "0.1.8.10", "gotoNode":"0", "message": "here is Marowak, type:ground. highest evolution form", "description": "Pokédex number 105 Marowak is the evolved form of a Cubone that has overcome its sadness at the loss of its mother and grown tough. This Pokémon's tempered and hardened spirit is not easily broken","tag":"105,Marowak"},
             { "node": "0.1.8.11", "gotoNode":"0", "message": "here is Rhyhorn, type:ground. using Rhyhorn Candy. It will evolve into a Rhydon", "description": "Pokédex number 111 Rhyhorn runs in a straight line, smashing everything in its path. It is not bothered even if it rushes headlong into a block of steel. This Pokémon may feel some pain from the collision the next day, however","tag":"111,Rhyhorn"},
             { "node": "0.1.8.12", "gotoNode":"0", "message": "here is Rhydon, type:ground : highest evolution form", "description": "Pokédex number 112 Rhydon's horn can crush even uncut diamonds. One sweeping blow of its tail can topple a building. This Pokémon's hide is extremely tough. Even direct cannon hits don't leave a scratch","tag":"112,Rhydon"},
             { "node": "0.1.9.1", "gotoNode":"0", "message": "here is Clefairy, type:fairy. using Clefairy Candy. It will evolve into a Clefable", "description": "Pokédex number 35 On every night of a full moon, groups of this Pokémon come out to play. When dawn arrives, the tired Clefairy return to their quiet mountain retreats and go to sleep nestled up next to each other","tag":"35,Clefairy" },
             { "node": "0.1.9.2", "gotoNode":"0", "message": "here is Clefable, type:fairy : highest evolution form", "description": "Pokédex number 36 Clefable moves by skipping lightly as if it were flying using its wings. Its bouncy step lets it even walk on water. It is known to take strolls on lakes on quiet, moonlit nights","tag":"36,Clefable"},
             { "node": "0.1.9.3", "gotoNode":"0", "message": "here is Jigglypuff, type:fairy,normal. using Jigglypuff Candy. It will evolve into a Wigglytuff", "description": "Pokédex number 39 Jigglypuff's vocal cords can freely adjust the wavelength of its voice. This Pokémon uses this ability to sing at precisely the right wavelength to make its foes most drowsy","tag":"39,Jigglypuff"},
             { "node": "0.1.9.4", "gotoNode":"0", "message": "here is Wigglytuff, type:failry,normal : highest evolution form", "description": "Pokédex number 40 Wigglytuff has large, saucerlike eyes. The surfaces of its eyes are always covered with a thin layer of tears. If any dust gets in this Pokémon's eyes, it is quickly washed away","tag":"40,Wigglytuff"},
             { "node": "0.1.10.1", "gotoNode":"0", "message": "here is Mankey, type:fighting. using Mankey Candy. It will evolve into a Primeape", "description": "Pokédex number 56 When Mankey starts shaking and its nasal breathing turns rough, it's a sure sign that it is becoming angry. However, because it goes into a towering rage almost instantly, it is impossible for anyone to flee its wrath","tag":"56,Mankey" },
             { "node": "0.1.10.2", "gotoNode":"0", "message": "here is Primeape, type:fighting highest evolution form", "description": "Pokédex number 57 When Primape becomes furious, its blood circulation is boosted. In turn, its muscles are made even stronger. However, it also becomes much less intelligent at the same time","tag":"57,Primeape"},
             { "node": "0.1.10.3", "gotoNode":"0", "message": "here is Machop, type:fighting. using Machop Candy. It will evolve into a Machoke", "description": "Pokédex number 66 Machop's muscles are special-they never get sore no matter how much they are used in exercise. This Pokémon has sufficient power to hurl a hundred adult humans","tag":"66,Machop" },
             { "node": "0.1.10.4", "gotoNode":"0", "message": "here is Machoke, type:fighting. using Machop Candy. It will evolve into a Machamp", "description": "Pokédex number 67 Machoke's thoroughly toned muscles pssess the hardness of steel. This Pokémon has so much strength, it can easily hold aloft a sumo wrestler on just one finger","tag":"67,Machoke"},
             { "node": "0.1.10.5", "gotoNode":"0", "message": "here is Machamp, type:fightinh  : highest evolution form", "description": "Pokédex number 68 Machamp has the power to hurl anything aside. However, trying to do any work requiring care and dexterity causes its arms to get tangled. This Pokémon tends to leap into action before it thinks","tag":"68,Machamp"},
             { "node": "0.1.10.6", "gotoNode":"0", "message": "here is Hitmonlee, type:fighting", "description": "Pokédex number 106 Hitmonlee's legs freely contract and stretch. Using these springlike legs, it bowls over foes with devastating kicks. After battle, it rubs down its legs and loosens the muscles to overcome fatigue","tag":"106,Hitmonlee"},
             { "node": "0.1.10.7", "gotoNode":"0", "message": "here is Hitmonchan, type:fighting", "description": "Pokédex number 107 Hitmonchan is said to possess the spirit of a boxer who had been working toward a world championship. This Pokémon has an indomitable spirit and will never give up in the face of adversity","tag":"107,Hitmonchan"},
             { "node": "0.1.11.1", "gotoNode":"0", "message": "here is Abra, type:psychic. using Abra Candy. It will evolve into a Kadabra", "description": "Pokédex number 63 Abra sleeps for eighteen hours a day. However, it can sense the presence of foes even while it is sleeping. In such a situation, this Pokémon immediately teleports to safety","tag":"63,Abra" },
             { "node": "0.1.11.2", "gotoNode":"0", "message": "here is Kadabra, type:psychic. using Abra Candy. It will evolve into a Alakazam", "description": "Pokédex number 64 Kadabra emits a peculiar alpha wave if it develops a headache. Only those people with a particularly strong psyche can hope to become a Trainer of this Pokémon","tag":"64,Kadabra"},
             { "node": "0.1.11.3", "gotoNode":"0", "message": "here is Alakazam, type:psychic : highest evolution form", "description": "Pokédex number 65 Alakazam's brain continually grows, making its head far too heavy to support with its neck. This Pokémon holds its head up using its psychokinetic power instead","tag":"65,Alakazam"},
             { "node": "0.1.11.4", "gotoNode":"0", "message": "here is Slowpoke, type:psychic,water. using Slowpoke Candy. It will evolve into a Slowbro", "description": "Pokédex number 79 Slowpoke uses its tail to catch prey by dipping it in water at the side of a river. However, this Pokèmon often forgets what it's doing and often spends entire days just loafing at water's edge","tag":"79,Slowpoke"},
             { "node": "0.1.11.5", "gotoNode":"0", "message": "here is Slowbro, type:psychic,water. highest evolution form", "description": "Pokédex number 80 Slowbro's tail has a Shellder firmly attached with a bite. As a result, the tail can't be used for fishing anymore. This causes Slowbro to grudgingly swim and catch prey instead.","tag":"80,Slowbro"},
             { "node": "0.1.11.6", "gotoNode":"0", "message": "here is Drowzee, type:psychic. using Drowzee Candy. It will evolve into a Hypno", "description": "Pokédex number 96 If your nose becomes itchy while you are sleeping, it's a sure sign that one of these Pokémon is standing above your pillow and trying to eat your dream through your nostrils","tag":"96,Drowzee"},
             { "node": "0.1.11.7", "gotoNode":"0", "message": "here is Hypno, type:psychic : highest evolution form", "description": "Pokédex number 97 Hypno holds a pendulum in its hand. The arching movement and glitter of the pendulum lull the foe into a deep state of hypnosis. While this Pokéon searches for prey, it polishes the pendulum","tag":"97,Hypno"},
             { "node": "0.1.11.8", "gotoNode":"0", "message": "here is Mr. Mime, type: psychic,fairy", "description": "Pokédex number 122 Mr. Mime is a master of pantomime. Its gestures and motions convince watchers that something unseeable actually exists. Once the watchers are convinced, the unseeable thing exists as if it were real","tag":"122,Mr. Mime"},
             { "node": "0.1.11.9", "gotoNode":"0", "message": "here is Jynx, type:ice,psychic", "description": "Pokédex number 124 Jynx walks rhythmically, swaying and shaking its hips as if it were dancing. Its motions are so bouncingly alluring, people seeing it are compelled to shake their hips without giving any thought to what they are doing","tag":"124,Jynx"},
             { "node": "0.1.11.10", "gotoNode":"0", "message": "here is Mewtwo, type:psychic", "description": "Pokédex number 150 Mewtwo is a Pokémon that was created by genetic manipulation. However, even though the scientific power of humans created this Pokémon's body, they failed to endow Mewtwo with a compassionate heart.","tag":"150,Mewtwo"},
             { "node": "0.1.11.11", "gotoNode":"0", "message": "here is Mew, type:psychic", "description": "Pokédex number 151 Mew is said to possess the genetic composition of all Pokémon. It is capable of making itself invisible at will, so it entirely avoids notice even if it approaches people","tag":"151,Mew"},
             { "node": "0.1.12.1", "gotoNode":"0", "message": "here is Doduo, type:normal,flying. using Doduo Candy. It will evolve into a Dodrio", "description": "Pokédex number 84 Doduo's two heads never sleep at the same time. Its two heads take turns sleeping, so one head can always keep watch for enemies while the other one sleeps","tag":"84,Doduo" },
             { "node": "0.1.12.2", "gotoNode":"0", "message": "here is Dodrio, type:normal,flying : highest evolution form", "description": "Pokédex number 85 Watch out if Dodrio's three heads are looking in three separate directions. It's a sure sign that it is on its guard. Don't go near this Pokémon if it's being wary-it may decide to peck you","tag":"85,Dodrio"},
             { "node": "0.1.12.3", "gotoNode":"0", "message": "here is Scyther, type:bug,flying", "description": "Pokédex number 123 Scyther is blindingly fast. Its blazing speed enhances the effectiveness of the twin scythes on its forearms. This Pokèmon's scythes are so effective, they can slice through thick logs in one wicked stroke","tag":"123,Scyther"},
             { "node": "0.1.12.4", "gotoNode":"0", "message": "here is Gyarados, type:water,flying : highest evolution form", "description": "Pokédex number 130 When Magikarp evolves into Gyarados, its brain cells undergo a structural transformation. It is said that this transformation is to blame for this Pokémon's wildly violent nature","tag":"130,Gyarados"},
             { "node": "0.1.12.5", "gotoNode":"0", "message": "here is Aerodactyl, type:rock,flying", "description": "Pokédex number 142 Aerodactyl is a Pokémon from the age of dinosaurs. It was regenerated from genetic material extracted from amber. It is imagined to have been the king of the skies in ancient times.","tag":"142,Aerodactyl"},
             { "node": "0.1.12.6", "gotoNode":"0", "message": "here is Articuno, type:ice,flying", "description": "Pokédex number 144 Articuno is a legendary bird Pokémon that can control ice. The flapping of its wings chills the air. As a result, it is said that when this Pokémon flies, snow will fall","tag":"144,Articuno"},
             { "node": "0.1.12.7", "gotoNode":"0", "message": "here is Zapdos, type:electric,flying", "description": "Pokédex number 145 Zapdos is a legendary bird Pokémon that has the ability to control electricity. It usually lives in thunderclouds. The Pokémon gains power if it is stricken by lightning bolts","tag":"145,Zapdos"},
             { "node": "0.1.12.8", "gotoNode":"0", "message": "here is Moltres, type:fire,flying", "description": "Pokédex number 146 Moltres is a legendary bird Pokémon that has the ability to control fire. If this Pokémon is injured, it is said to dip its body in the molten magma of a volcano to burn and heal itself","tag":"146,Moltres"},
             { "node": "0.1.13.1", "gotoNode":"0", "message": "here is Gastly, type:ghost,poison. using Gastly Candy. It will evolve into a Haunter", "description": "Pokédex number 92 Gastly is largely composed of gaseous matter. When exposed to a strong wind, the gaseous body quickly dwindles away. Groups of the Pokemon cluster under the eaves of houses to escape the ravages of wind","tag":"92,Gastly" },
             { "node": "0.1.13.2", "gotoNode":"0", "message": "here is Haunter, type:ghost,poison. using Gastly Candy. It will evolve into a Gengar", "description": "Pokédex number 93 Haunter is a dangerous Pokémon. If one beckons you while floating in darkness, you must never approach it. This Pokémon will try to lick you with its tongue and steal your life away","tag":"93,Haunter"},
             { "node": "0.1.13.3", "gotoNode":"0", "message": "here is Gengar, type:ghost,poison. highest evolution form", "description": "Pokédex number 94 Sometimes, on a dark night, your shadow thrown by a streetlight will suddenly and startlingly overtake you. It is actually a Gengar running past you, pretending to be your shadow","tag":"94,Gengar"},
             { "node": "0.1.14.1", "gotoNode":"0", "message": "here is Dratini, type:dragon. using Dratini Candy. It will evolve into a Dragonair", "description": "Pokédex number 147 Dratini continually molts and sloughs off its old skin. It does so because the life energy within its body steadily builds to reach uncontrollable levels","tag":"147,Dratini" },
             { "node": "0.1.14.2", "gotoNode":"0", "message": "here is Dragonair, type:dragon. using Dratini Candy. It will evolve into a Dragonite.", "description": "Pokédex number 148 Dragonair stores an enormous amount of energy inside its body. It is said to alter weather conditions in its vicinity by discharging energy from the crystals on its neck and tail","tag":"148,Dragonair"},
             { "node": "0.1.14.3", "gotoNode":"0", "message": "here is Dragonite, type:dragon. highest evolution form", "description": "Pokédex number 149 Dragonite is capable of circling the globe in just 16 hours. It is a kindhearted Pokémon that leads lost and foundering ships in a storm to the safety of land","tag":"149,Dragonite"}
			 
];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome to decision tree, are you ready to play?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say yes to start the game or no to quit.";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes to continue, or no to end the game.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToAnswer = "Please answer to the question. Either a number or maybe a potential tag like name";
var promptToSayNumber = "Please say a number to the question.";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
//var decisionMessage = "I think you would make a good";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "Say 'tell me more' to hear a short description for this item, or do you want to play again?";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will ask you some questions that will help identify what is the best item. Want to start now?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you next time!";

var speechNotFoundMessage = "Could not find speech for node";

var nodeNotFoundMessage = "In nodes array could not find node";

var descriptionNotFoundMessage = "Could not find description for node";

var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

var utteranceTellMeMore = "tell me more";

var utterancePlayAgain = "play again";

// the first node that we will use
var START_NODE = "0";

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
    'NewSession': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
		/* TODO
        var loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
             this.emit(':tell', loopsDetectedMessage);
        }
		*/
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // record the node we are on
        this.attributes.currentNode = START_NODE;
        this.attributes.searchNodeType = undefined;
		this.attributes.currentFirstChildNodeIndex = undefined;
		Object.assign(this.attributes, {
            "question": message
		});

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(this, START_NODE);

        // ask the first question
        this.emit(':ask', message, message);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToAnswer+". "+this.attributes.question, promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'NumberAnswerIntent': function() {
		// Be Careful : we keep current search node type (it may be TAG) stored in session otherwise set it to NUMERIC_CHILD
		if (this.attributes.searchNodeType == undefined)
			this.attributes.searchNodeType = searchnodestypes.NUMERIC_CHILD;
		helper.processAnswer(this, this.attributes.searchNodeType, this.event.request.intent.slots.number.value);
    },
    'TagAnswerIntent': function() {
		// clean special caracters like japanese ones : for instance Pikachū should be replaced into Pikachu
		helper.processAnswer(this, searchnodestypes.TAG, cleanUpSpecialChars(this.event.request.intent.slots.Tag.value));
    },
    'GoIntent': function() {
		// clean special caracters like japanese ones : for instance Pikachū should be replaced into Pikachu
		cconsole.log('go intent parameter'+this.event.request.intent.slots.Direction.value);
    },
    'AMAZON.HelpIntent': function () {
		// remind the current question at the end
        this.emit(':ask', promptToAnswer+". "+this.attributes.question, promptToAnswer);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToAnswer+". "+this.attributes.question, promptToAnswer);
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToAnswer, promptToAnswer);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'DescriptionIntent': function () {
        var reply = this.event.request.intent.slots.Description.value;
        console.log('HEARD:' + reply);

        if( reply === utteranceTellMeMore){
            helper.giveDescription(this);
        } else if( reply === utterancePlayAgain) {
            // reset the game state to start mode
            this.handler.state = states.STARTMODE;
            this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
        } else {
             this.emit(':ask', playAgainMessage, playAgainMessage);
        }
    },
    'Unhandled': function () {
        this.emit(':ask', promptToAnswer, promptToAnswer);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
        var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the end user answer to the main questions
    processAnswer: function (context, searchNodetype, data) {
        // this is a question node so we need to see appropriate child node based on end user answer
        var nextNodeId = helper.getNextNode(context.attributes.currentNode,searchNodetype,data);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(context, nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = message + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;
		Object.assign(context.attributes, {
            "question": message
		});
        context.emit(':ask', message, message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (context, nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
				// store potential search node type in session
				if (nodes[i].gotoNode == searchnodestypes.TAG)
					context.attributes.searchNodeType = nodes[i].gotoNode;
				if (context.attributes.currentFirstChildNodeIndex === undefined)
					context.attributes.currentFirstChildNodeIndex=1;
				var message = nodes[i].message;
				if (nodes[i].children !== undefined) {
					var len = nodes[i].children.length;
					for (var idx = 0; idx < len; idx++) {
						if (idx > 0)
							message += ',';
						message += ' '+(idx+context.attributes.currentFirstChildNodeIndex)+' for '+nodes[i].children[idx];
					}
					message += ' Please answer with number';
				}
                return message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].gotoNode === "0") {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the end user response
    getNextNode: function (nodeId, searchNodeType, answer) {
		console.log("user answer:"+answer+" searchnodeType:"+searchNodeType+" nodeId:"+nodeId);
        for (var i = 0; i < nodes.length; i++) {
           if (searchNodeType === searchnodestypes.NUMERIC_CHILD) {
		   // search based on numeric child based on end user answer (child number)
            if (nodes[i].node == nodeId) {
				    // init nextNode based on gotoNode field
				    var nextNode = nodes[i].gotoNode;
					// however if gotoNode is "nextNodeInput" then concatenate currentNode with child answer number
					if (nodes[i].gotoNode === searchnodestypes.NUMERIC_CHILD)
						nextNode = nodes[i].node + "."+ answer;
                    return nextNode;
                }
		   }
		   else // search based on tag field and end user answer
           if (searchNodeType === searchnodestypes.TAG) {
			   if (nodes[i].tag != undefined && (nodes[i].tag.indexOf(answer) >= 0))
				   return nodes[i].node;
		   }
           else { // basic standard search  based on given nodeId, so default to the gotoNode field
			   if (nodes[i].node == nodeId)
				   return nodes[i].gotoNode;
		   }		   
        }
        // error condition, didnt find a matching node id. Cause will be an incorrect/invalid entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing child path"); // TODO
        var childNode = helper.getNextNode(nodeId, "child"); // TOFIX
        var duplicatePathHit = helper.debugFunction_walkNode(childNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};

function cleanUpSpecialChars(str)
{
	console.log("input string:"+str);
    str = str.replace(/[ā]/g,"a");
    str = str.replace(/[ē]/g,"e");
	str = str.replace(/[ō]/g,"o");
	str = str.replace(/[ī]/g,"i");
	str = str.replace(/[ū]/g,"u");
    return str.replace(/[^a-z0-9]/gi,''); // final clean up
}
