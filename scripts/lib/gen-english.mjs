import { pick, shuffle, buildOptions, rint } from "./rng.mjs";

// ===================== CURATED, EXAM-VETTED CONTENT POOLS =====================
// Each entry is hand-checked at SSC CGL level. Expanded for far greater variety.

const SYNONYMS = [
  ["Abundant", "Plentiful", ["Scarce", "Empty", "Rare"]],
  ["Benevolent", "Kind", ["Cruel", "Selfish", "Harsh"]],
  ["Candid", "Frank", ["Secretive", "Dishonest", "Reserved"]],
  ["Diligent", "Hardworking", ["Lazy", "Careless", "Idle"]],
  ["Eloquent", "Expressive", ["Mute", "Dull", "Hesitant"]],
  ["Frugal", "Economical", ["Wasteful", "Lavish", "Generous"]],
  ["Gregarious", "Sociable", ["Shy", "Solitary", "Aloof"]],
  ["Hostile", "Unfriendly", ["Friendly", "Warm", "Kind"]],
  ["Intrepid", "Fearless", ["Cowardly", "Timid", "Weak"]],
  ["Lucid", "Clear", ["Vague", "Confusing", "Obscure"]],
  ["Meticulous", "Careful", ["Sloppy", "Hasty", "Negligent"]],
  ["Obsolete", "Outdated", ["Modern", "New", "Current"]],
  ["Pragmatic", "Practical", ["Idealistic", "Theoretical", "Impractical"]],
  ["Resilient", "Tough", ["Fragile", "Weak", "Brittle"]],
  ["Vivid", "Bright", ["Dull", "Faint", "Pale"]],
  ["Audacious", "Bold", ["Timid", "Fearful", "Meek"]],
  ["Brevity", "Conciseness", ["Lengthiness", "Wordiness", "Verbosity"]],
  ["Cordial", "Friendly", ["Hostile", "Rude", "Cold"]],
  ["Demolish", "Destroy", ["Build", "Repair", "Construct"]],
  ["Enormous", "Huge", ["Tiny", "Small", "Minute"]],
  ["Fertile", "Productive", ["Barren", "Sterile", "Infertile"]],
  ["Gallant", "Brave", ["Cowardly", "Fearful", "Weak"]],
  ["Hazardous", "Dangerous", ["Safe", "Secure", "Harmless"]],
  ["Immense", "Vast", ["Tiny", "Limited", "Narrow"]],
  ["Jovial", "Cheerful", ["Gloomy", "Sad", "Morose"]],
  ["Keen", "Eager", ["Indifferent", "Reluctant", "Dull"]],
  ["Lethal", "Deadly", ["Harmless", "Safe", "Mild"]],
  ["Mitigate", "Lessen", ["Worsen", "Aggravate", "Intensify"]],
  ["Novice", "Beginner", ["Expert", "Master", "Veteran"]],
  ["Opulent", "Wealthy", ["Poor", "Needy", "Destitute"]],
  ["Perilous", "Risky", ["Safe", "Secure", "Stable"]],
  ["Quaint", "Charming", ["Modern", "Ordinary", "Ugly"]],
  ["Rampant", "Widespread", ["Rare", "Limited", "Contained"]],
  ["Sagacious", "Wise", ["Foolish", "Ignorant", "Silly"]],
  ["Trivial", "Insignificant", ["Important", "Crucial", "Vital"]],
  ["Vigilant", "Watchful", ["Careless", "Negligent", "Inattentive"]],
  ["Wary", "Cautious", ["Reckless", "Careless", "Rash"]],
  ["Zealous", "Enthusiastic", ["Apathetic", "Indifferent", "Lazy"]],
  ["Adept", "Skilled", ["Clumsy", "Unskilled", "Inept"]],
  ["Cease", "Stop", ["Begin", "Start", "Continue"]],
];

const ANTONYMS = [
  ["Ascend", "Descend", ["Climb", "Rise", "Soar"]],
  ["Brave", "Cowardly", ["Bold", "Daring", "Heroic"]],
  ["Concise", "Verbose", ["Brief", "Short", "Terse"]],
  ["Expand", "Contract", ["Enlarge", "Grow", "Widen"]],
  ["Genuine", "Fake", ["Real", "Authentic", "True"]],
  ["Humble", "Arrogant", ["Modest", "Meek", "Shy"]],
  ["Optimist", "Pessimist", ["Dreamer", "Believer", "Idealist"]],
  ["Praise", "Criticize", ["Applaud", "Admire", "Commend"]],
  ["Transparent", "Opaque", ["Clear", "Glassy", "Lucid"]],
  ["Victory", "Defeat", ["Triumph", "Win", "Success"]],
  ["Abundant", "Scarce", ["Plentiful", "Ample", "Copious"]],
  ["Accept", "Reject", ["Receive", "Take", "Admit"]],
  ["Bold", "Timid", ["Brave", "Daring", "Fearless"]],
  ["Combine", "Separate", ["Merge", "Join", "Unite"]],
  ["Dawn", "Dusk", ["Morning", "Sunrise", "Daybreak"]],
  ["Enemy", "Friend", ["Foe", "Rival", "Opponent"]],
  ["Frequent", "Rare", ["Often", "Regular", "Common"]],
  ["Generous", "Stingy", ["Liberal", "Kind", "Giving"]],
  ["Harsh", "Gentle", ["Severe", "Rough", "Cruel"]],
  ["Innocent", "Guilty", ["Pure", "Blameless", "Naive"]],
  ["Joy", "Sorrow", ["Delight", "Pleasure", "Happiness"]],
  ["Knowledge", "Ignorance", ["Wisdom", "Learning", "Awareness"]],
  ["Liberty", "Bondage", ["Freedom", "Independence", "Liberation"]],
  ["Maximum", "Minimum", ["Highest", "Peak", "Top"]],
  ["Natural", "Artificial", ["Pure", "Innate", "Organic"]],
  ["Optional", "Compulsory", ["Voluntary", "Elective", "Discretionary"]],
  ["Permanent", "Temporary", ["Lasting", "Stable", "Enduring"]],
  ["Rigid", "Flexible", ["Stiff", "Firm", "Hard"]],
  ["Scatter", "Gather", ["Spread", "Disperse", "Strew"]],
  ["Wealth", "Poverty", ["Riches", "Affluence", "Fortune"]],
];

const IDIOMS = [
  ["A blessing in disguise", "A good thing that seemed bad at first", ["A hidden curse", "A clear warning", "An obvious gift"]],
  ["Bite the bullet", "To endure a painful situation bravely", ["To eat quickly", "To argue loudly", "To run away"]],
  ["Once in a blue moon", "Very rarely", ["Very often", "Every night", "At noon"]],
  ["Spill the beans", "To reveal a secret", ["To cook food", "To waste money", "To tell a lie"]],
  ["Hit the sack", "To go to bed", ["To start a fight", "To work hard", "To leave a job"]],
  ["Piece of cake", "Something very easy", ["A sweet dish", "A hard task", "A small portion"]],
  ["Under the weather", "Feeling unwell", ["Very happy", "Outdoors", "In trouble"]],
  ["Cost an arm and a leg", "Very expensive", ["Very cheap", "Free of cost", "Painful injury"]],
  ["Break the ice", "To initiate conversation in a tense situation", ["To destroy something", "To cool a drink", "To start a fight"]],
  ["Burn the midnight oil", "To work late into the night", ["To waste resources", "To start a fire", "To sleep early"]],
  ["Let the cat out of the bag", "To reveal a secret unintentionally", ["To free an animal", "To make a mistake", "To buy a pet"]],
  ["A piece of one's mind", "To scold or criticise someone frankly", ["To give a gift", "To share food", "To agree fully"]],
  ["Add fuel to the fire", "To make a bad situation worse", ["To solve a problem", "To cook food", "To calm someone"]],
  ["At the drop of a hat", "Without any hesitation; immediately", ["After long thought", "While wearing a hat", "Very slowly"]],
  ["Beat around the bush", "To avoid coming to the point", ["To garden carefully", "To win easily", "To speak clearly"]],
  ["Call it a day", "To stop working for the day", ["To name a holiday", "To begin work", "To celebrate"]],
  ["Cry over spilt milk", "To worry about something already lost", ["To clean a mess", "To waste food", "To be very sad"]],
  ["Get cold feet", "To become nervous before an event", ["To feel cold", "To fall ill", "To be confident"]],
  ["In hot water", "In trouble", ["In comfort", "Cooking", "Very busy"]],
  ["Kill two birds with one stone", "To achieve two aims with a single action", ["To be cruel", "To waste effort", "To fail twice"]],
  ["Pull someone's leg", "To tease or joke with someone", ["To injure someone", "To help someone walk", "To pull a rope"]],
  ["Throw in the towel", "To give up or admit defeat", ["To clean up", "To start fresh", "To win a match"]],
  ["Turn a blind eye", "To deliberately ignore something", ["To go blind", "To look closely", "To warn someone"]],
  ["The ball is in your court", "It is your turn to take action", ["You are playing a game", "You have lost", "You are confused"]],
];

const ONE_WORD = [
  ["One who studies the stars and planets", "Astronomer", ["Astrologer", "Geologist", "Biologist"]],
  ["A person who cannot read or write", "Illiterate", ["Literate", "Scholar", "Ignorant"]],
  ["A place where bees are kept", "Apiary", ["Aviary", "Nursery", "Sanctuary"]],
  ["One who eats everything", "Omnivore", ["Herbivore", "Carnivore", "Vegetarian"]],
  ["A government by the people", "Democracy", ["Monarchy", "Autocracy", "Oligarchy"]],
  ["A speech made without preparation", "Extempore", ["Lecture", "Sermon", "Debate"]],
  ["Words inscribed on a tomb", "Epitaph", ["Epitome", "Epilogue", "Epigram"]],
  ["One who loves mankind", "Philanthropist", ["Misanthrope", "Egoist", "Cynic"]],
  ["A person who walks on foot", "Pedestrian", ["Passenger", "Commuter", "Traveller"]],
  ["A medicine that kills germs", "Antiseptic", ["Antibiotic", "Vaccine", "Sedative"]],
  ["One who studies birds", "Ornithologist", ["Botanist", "Zoologist", "Entomologist"]],
  ["A place where money is coined", "Mint", ["Bank", "Treasury", "Vault"]],
  ["A person who is new to a job", "Novice", ["Veteran", "Expert", "Master"]],
  ["One who cannot be corrected", "Incorrigible", ["Incurable", "Invincible", "Indelible"]],
  ["A list of books and writings", "Bibliography", ["Biography", "Catalogue", "Index"]],
  ["The study of human society", "Sociology", ["Psychology", "Anthropology", "Philosophy"]],
  ["One who hates women", "Misogynist", ["Misanthrope", "Philanthropist", "Feminist"]],
  ["A word opposite in meaning to another", "Antonym", ["Synonym", "Homonym", "Acronym"]],
  ["One who collects coins", "Numismatist", ["Philatelist", "Archaeologist", "Cartographer"]],
  ["A person who draws maps", "Cartographer", ["Geographer", "Surveyor", "Navigator"]],
  ["The killing of a king", "Regicide", ["Genocide", "Homicide", "Suicide"]],
  ["One who can speak many languages", "Polyglot", ["Linguist", "Translator", "Interpreter"]],
  ["A handwriting that cannot be read", "Illegible", ["Eligible", "Legible", "Negligible"]],
  ["That which cannot be avoided", "Inevitable", ["Invisible", "Inviolable", "Inevitable"]],
  ["A place for keeping aeroplanes", "Hangar", ["Garage", "Dock", "Depot"]],
];

const SPELLING = [
  ["Accommodate", ["Accomodate", "Acommodate", "Accommadate"]],
  ["Definitely", ["Definately", "Definitly", "Definetely"]],
  ["Embarrass", ["Embarass", "Embarras", "Embaras"]],
  ["Maintenance", ["Maintainance", "Maintenence", "Maintainence"]],
  ["Occurrence", ["Occurence", "Ocurrence", "Occurrance"]],
  ["Privilege", ["Priviledge", "Privelege", "Privilage"]],
  ["Separate", ["Seperate", "Saparate", "Separete"]],
  ["Receive", ["Recieve", "Receeve", "Receve"]],
  ["Necessary", ["Neccessary", "Necesary", "Neccesary"]],
  ["Conscience", ["Concience", "Consience", "Conscence"]],
  ["Millennium", ["Millenium", "Milennium", "Millenniam"]],
  ["Rhythm", ["Rythm", "Rhythem", "Rhytm"]],
  ["Possession", ["Posession", "Possesion", "Posetion"]],
  ["Liaison", ["Liason", "Liaisson", "Liasion"]],
  ["Bureaucracy", ["Bureacracy", "Buroucracy", "Bureaucrasy"]],
  ["Exaggerate", ["Exagerate", "Exaggarate", "Exagrate"]],
  ["Harass", ["Harras", "Haras", "Harrass"]],
  ["Committee", ["Comittee", "Commitee", "Committe"]],
  ["Guarantee", ["Garantee", "Guarentee", "Guaranty"]],
  ["Hierarchy", ["Heirarchy", "Hierachy", "Hierarcy"]],
];

const FILL_BLANK = [
  ["She has been working here ____ 2015.", "since", ["for", "from", "by"], "'Since' is used with a point in time (2015)."],
  ["He is good ____ mathematics.", "at", ["in", "on", "with"], "'Good at' is the correct collocation for skills/subjects."],
  ["The book is ____ the table.", "on", ["in", "at", "under"], "'On' indicates a surface (the table)."],
  ["I have lived here ____ ten years.", "for", ["since", "from", "during"], "'For' is used with a duration of time."],
  ["She is married ____ a doctor.", "to", ["with", "by", "for"], "'Married to' is the standard usage."],
  ["He apologized ____ his mistake.", "for", ["of", "about", "on"], "We apologize 'for' something."],
  ["The thief was accused ____ stealing.", "of", ["for", "with", "on"], "'Accused of' is the correct form."],
  ["She is afraid ____ dogs.", "of", ["from", "with", "for"], "'Afraid of' is the standard usage."],
  ["He succeeded ____ his attempt.", "in", ["at", "on", "with"], "'Succeed in' is the correct collocation."],
  ["They congratulated him ____ his success.", "on", ["for", "about", "with"], "'Congratulate on' something is correct."],
  ["She insisted ____ paying the bill.", "on", ["in", "for", "to"], "'Insist on' is the standard form."],
  ["He is fond ____ music.", "of", ["with", "for", "in"], "'Fond of' is the correct collocation."],
  ["The teacher was angry ____ the students.", "with", ["on", "at", "for"], "We are 'angry with' a person."],
  ["He died ____ malaria.", "of", ["from", "by", "with"], "We say 'died of' a disease."],
  ["I prefer tea ____ coffee.", "to", ["than", "over", "from"], "'Prefer X to Y' is the correct structure."],
];

const VOICE = [
  ["He writes a letter.", "A letter is written by him.", ["A letter was written by him.", "A letter is being written by him.", "A letter has written by him."], "Simple present active → 'is/are + V3' in passive."],
  ["She is cooking food.", "Food is being cooked by her.", ["Food is cooked by her.", "Food was being cooked by her.", "Food has been cooked by her."], "Present continuous active → 'is/are being + V3'."],
  ["They built a house.", "A house was built by them.", ["A house is built by them.", "A house has been built by them.", "A house was being built by them."], "Simple past active → 'was/were + V3'."],
  ["The teacher will explain the lesson.", "The lesson will be explained by the teacher.", ["The lesson is explained by the teacher.", "The lesson was explained by the teacher.", "The lesson has been explained by the teacher."], "Simple future active → 'will be + V3'."],
  ["Someone has stolen my bag.", "My bag has been stolen.", ["My bag is stolen.", "My bag was stolen.", "My bag had been stolen."], "Present perfect active → 'has/have been + V3'."],
  ["Open the door.", "Let the door be opened.", ["The door is opened.", "The door was opened.", "Open the door by you."], "Imperative → 'Let + object + be + V3'."],
];

const ERROR = [
  ["The number of students (A)/ are increasing (B)/ every year. (C)", "B", ["A", "C", "No error"], "'The number of' takes a singular verb → 'is increasing'."],
  ["He is one of the (A)/ best player (B)/ in the team. (C)", "B", ["A", "C", "No error"], "'One of the best' must be followed by a plural noun → 'players'."],
  ["Each of the boys (A)/ have submitted (B)/ their homework. (C)", "B", ["A", "C", "No error"], "'Each of' takes a singular verb → 'has submitted'."],
  ["She is junior (A)/ than me (B)/ in the office. (C)", "B", ["A", "C", "No error"], "'Junior' is followed by 'to', not 'than' → 'junior to me'."],
  ["He did not (A)/ went to school (B)/ yesterday. (C)", "B", ["A", "C", "No error"], "After 'did not', use the base verb → 'go to school'."],
  ["The cattle (A)/ is grazing (B)/ in the field. (C)", "B", ["A", "C", "No error"], "'Cattle' is plural and takes a plural verb → 'are grazing'."],
  ["I have been (A)/ knowing him (B)/ for ten years. (C)", "B", ["A", "C", "No error"], "'Know' is a stative verb; use 'have known' → 'I have known him'."],
  ["He prefers (A)/ tea than coffee (B)/ in the morning. (C)", "B", ["A", "C", "No error"], "'Prefer' takes 'to', not 'than' → 'tea to coffee'."],
];

const IMPROVE = [
  ["He did not went to school.", "did not go", ["did not goes", "not went", "did went"], "After 'did', the base form of the verb (go) is used."],
  ["She is senior than me.", "senior to me", ["senior than I", "senior from me", "more senior than me"], "'Senior' is followed by 'to', not 'than'."],
  ["One of my friend is a doctor.", "of my friends", ["of my friend", "of mine friend", "of my friend's"], "'One of' is followed by a plural noun (friends)."],
  ["If I was you, I would accept it.", "If I were you", ["If I am you", "If I been you", "If I be you"], "In the subjunctive (hypothetical), use 'were' → 'If I were you'."],
  ["He is more cleverer than his brother.", "cleverer", ["more clever", "most clever", "cleverest"], "Avoid double comparatives; 'cleverer' alone is correct."],
  ["The scenery here are beautiful.", "scenery here is", ["sceneries are", "scenery are", "sceneries is"], "'Scenery' is uncountable and takes a singular verb → 'is'."],
  ["He told me that he will come.", "that he would come", ["that he will came", "that he comes", "that he come"], "After past reporting verb 'told', use 'would' (back-shift)."],
];

const ACTIVE_TOPIC = "Reading Comprehension";
const RC_PASSAGE = {
  text:
    "Reading is one of the most rewarding habits a student can build. It not only improves vocabulary and comprehension but also broadens one's perspective. Many successful people attribute their achievements to a lifelong love of books. However, in the age of digital distraction, sustained reading has become increasingly rare.",
  qs: [
    ["According to the passage, reading improves all EXCEPT:", "Physical strength", ["Vocabulary", "Comprehension", "Perspective"], "The passage mentions vocabulary, comprehension and perspective, not physical strength."],
    ["What has made sustained reading rare, per the passage?", "Digital distraction", ["Lack of books", "Poor eyesight", "Expensive books"], "The passage states 'in the age of digital distraction, sustained reading has become rare'."],
    ["Many successful people credit their success to:", "A love of books", ["Hard work alone", "Good luck", "Wealthy families"], "The passage says they attribute achievements to a lifelong love of books."],
  ],
};

function mcq(rng, prompt, correct, distractors, explanation, topic) {
  const { options, answerIndex } = buildOptions(rng, correct, distractors);
  return { question: prompt, options, answerIndex, explanation, topic };
}

const ENGLISH = {
  "Synonyms": (rng) => {
    const [w, syn, dist] = pick(rng, SYNONYMS);
    return mcq(rng, `Choose the word most similar in meaning to: ${w.toUpperCase()}`, syn, dist, `'${w}' means '${syn}'.`, "Synonyms");
  },
  "Antonyms": (rng) => {
    const [w, ant, dist] = pick(rng, ANTONYMS);
    return mcq(rng, `Choose the word opposite in meaning to: ${w.toUpperCase()}`, ant, dist, `The opposite of '${w}' is '${ant}'.`, "Antonyms");
  },
  "Idioms and Phrases": (rng) => {
    const [idi, mean, dist] = pick(rng, IDIOMS);
    return mcq(rng, `Choose the correct meaning of the idiom: "${idi}"`, mean, dist, `"${idi}" means: ${mean}.`, "Idioms and Phrases");
  },
  "One Word Substitution": (rng) => {
    const [def, word, dist] = pick(rng, ONE_WORD);
    return mcq(rng, `Choose the one word for: ${def}`, word, dist, `'${word}' = ${def}.`, "One Word Substitution");
  },
  "Spelling Correction": (rng) => {
    const [correct, wrong] = pick(rng, SPELLING);
    return mcq(rng, `Choose the correctly spelt word.`, correct, wrong, `The correct spelling is '${correct}'.`, "Spelling Correction");
  },
  "Fill in the Blanks": (rng) => {
    const [sent, ans, dist, exp] = pick(rng, FILL_BLANK);
    return mcq(rng, `Fill in the blank: ${sent}`, ans, dist, exp, "Fill in the Blanks");
  },
  "Sentence Improvement": (rng) => {
    const [sent, ans, dist, exp] = pick(rng, IMPROVE);
    return mcq(rng, `Improve the underlined part: "${sent}"`, ans, dist, exp, "Sentence Improvement");
  },
  "Active Passive Voice": (rng) => {
    const [sent, ans, dist, exp] = pick(rng, VOICE);
    return mcq(rng, `Change the voice: "${sent}"`, ans, dist, exp, "Active Passive Voice");
  },
  "Error Detection": (rng) => {
    const [sent, ans, dist, exp] = pick(rng, ERROR);
    return mcq(rng, `Find the part with the error: ${sent}`, ans, dist, exp, "Error Detection");
  },
  "Reading Comprehension": (rng) => {
    const [q, ans, dist, exp] = pick(rng, RC_PASSAGE.qs);
    return mcq(rng, `Read the passage and answer:\n\n"${RC_PASSAGE.text}"\n\n${q}`, ans, dist, exp, "Reading Comprehension");
  },
};

export const ENGLISH_TOPICS = Object.keys(ENGLISH);
export function genEnglish(topic, rng) {
  return ENGLISH[topic](rng);
}
