export const DND_CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled',
  'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
];

export const DND_CONDITION_DEFINITIONS: { [key: string]: string[] } = {
  Blinded: [
    "A blinded creature can't see and automatically fails any ability check that requires sight.",
    "Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage."
  ],
  Charmed: [
    "A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects.",
    "The charmer has advantage on any ability check to interact socially with the creature."
  ],
  Deafened: [
    "A deafened creature can't hear and automatically fails any ability check that requires hearing."
  ],
  Exhaustion: [
    "Exhaustion is measured in six levels.",
    "Level 1: Disadvantage on ability checks.",
    "Level 2: Speed halved.",
    "Level 3: Disadvantage on attack rolls and saving throws.",
    "Level 4: Hit point maximum halved.",
    "Level 5: Speed reduced to 0.",
    "Level 6: Death."
  ],
  Frightened: [
    "A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.",
    "The creature can't willingly move closer to the source of its fear."
  ],
  Grappled: [
    "A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.",
    "The condition ends if the grappler is incapacitated.",
    "The condition also ends if an effect removes the grappled creature from the reach of the grappler."
  ],
  Incapacitated: [
    "An incapacitated creature can't take actions or reactions."
  ],
  Invisible: [
    "An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured.",
    "Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage."
  ],
  Paralyzed: [
    "A paralyzed creature is incapacitated and can't move or speak.",
    "The creature automatically fails Strength and Dexterity saving throws.",
    "Attack rolls against the creature have advantage.",
    "Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature."
  ],
  Petrified: [
    "A petrified creature is transformed into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.",
    "The creature is incapacitated, can't move or speak, and is unaware of its surroundings.",
    "Attack rolls against the creature have advantage.",
    "The creature automatically fails Strength and Dexterity saving throws.",
    "The creature has resistance to all damage.",
    "The creature is immune to poison and disease."
  ],
  Poisoned: [
    "A poisoned creature has disadvantage on attack rolls and ability checks."
  ],
  Prone: [
    "A prone creature's only movement option is to crawl, unless it stands up and thereby ends the condition.",
    "The creature has disadvantage on attack rolls.",
    "An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage."
  ],
  Restrained: [
    "A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed.",
    "Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
    "The creature has disadvantage on Dexterity saving throws."
  ],
  Stunned: [
    "A stunned creature is incapacitated, can't move, and can speak only falteringly.",
    "The creature automatically fails Strength and Dexterity saving throws.",
    "Attack rolls against the creature have advantage."
  ],
  Unconscious: [
    "An unconscious creature is incapacitated, can't move or speak, and is unaware of its surroundings.",
    "The creature drops whatever it's holding and falls prone.",
    "The creature automatically fails Strength and Dexterity saving throws.",
    "Attack rolls against the creature have advantage.",
    "Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature."
  ]
};
