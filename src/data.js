const TYPES = {
  "Textual conflict": "Passages make different claims about the same subject under a comparable reading. This label describes the text, not a verdict on historicity.",
  "Apparent contradiction": "Accounts differ, but a proposed reconciliation is possible. Its assumptions still need to be examined.",
  "Translation dependent": "The tension changes with a translation choice or the meaning of a word.",
  "Historical / chronological": "A claim concerns dates, sequences, or external historical evidence.",
  "Interpretive disagreement": "The disagreement depends on genre, metaphor, context, or a theological premise."
};
const ENTRIES = [
  {
    "id": "seen",
    "summary": "Exodus describes Moses speaking with God “face to face”; John says no one has seen God. The tension depends on whether “face to face” means literal sight.",
    "title": "Can God be seen?",
    "type": "Interpretive disagreement",
    "topic": "God & theology",
    "testament": "Both",
    "refs": [
      "Exodus 33:11",
      "John 1:18",
      "Exodus 33:20",
      "Exodus 33:23",
      "Exodus 24:9",
      "Exodus 24:10",
      "Exodus 24:11",
      "Numbers 12:8"
    ],
    "intro": "A face-to-face encounter in Exodus meets an absolute-sounding statement in John.",
    "passages": [
      [
        "Exodus 33:11",
        "And the LORD spake unto Moses face to face, as a man speaketh unto his friend.",
        "And Jehovah spake unto Moses face to face, as a man speaketh unto his friend."
      ],
      [
        "John 1:18",
        "No man hath seen God at any time; the only begotten Son, which is in the bosom of the Father, he hath declared him.",
        "No man hath seen God at any time; the only begotten Son, who is in the bosom of the Father, he hath declared him."
      ]
    ],
    "original": "Yes, many have seen him.",
    "sab": "https://skepticsannotatedbible.com/contra/seen.html",
    "claim": "SAB places accounts of seeing God beside passages denying that God can be seen.",
    "response": "GotQuestions reads “face to face” as an expression of close communion and distinguishes divine manifestations from seeing God in full glory.",
    "responseUrl": "https://www.gotquestions.org/seen-God.html",
    "assessment": "Exodus 24 describes a group seeing God without harm; Exodus 33 restricts seeing God’s face, and John 1 says no one has seen God. A distinction between a manifestation and full divine sight is a possible theological reading. The passages do not explicitly define one uniform distinction, so that reconciliation remains an interpretation.",
    "question": "Does “face to face” describe literal sight, an idiom, or a manifestation? Read Exodus 33:20–23 alongside verse 11.",
    "context": "Exodus 33 includes both personal communication and a restriction on seeing God’s face. John 1 introduces the Son’s role in revealing God. Exodus 24:9–11 explicitly says a group saw God and survived; this is stronger sight language than the possible idiom in Exodus 33:11. Numbers 12:8 distinguishes Moses’s direct communication and beholding the divine similitude from other prophets’ dreams and visions; that distinction does not explicitly equate similitude with seeing the unrestricted divine face.",
    "translation": "KJV and ASV preserve the central tension. “LORD” versus “Jehovah” reflects a rendering of the divine name.",
    "sources": [
      {
        "label": "Exodus 33 · primary text",
        "url": "https://ebible.org/eng-kjv/EXO33.htm"
      },
      {
        "label": "Exodus 24 · primary scripture",
        "url": "https://ebible.org/eng-kjv/EXO24.htm"
      },
      {"label": "Numbers 12 · primary text", "url": "https://ebible.org/eng-kjv/NUM12.htm"}
    ],
    "reasoning": "Verse 11 compares the conversation to friends speaking. Reading that expression as direct communication rather than literal sight resolves the apparent tension with verses 20–23."
  },
  {
    "id": "judas",
    "summary": "Matthew and Acts give different accounts of Judas's death and the field purchase.",
    "title": "Judas and the field of blood",
    "type": "Apparent contradiction",
    "topic": "Gospel accounts",
    "testament": "New Testament",
    "refs": [
      "Matthew 27:5",
      "Acts 1:18",
      "Matthew 27:3",
      "Matthew 27:4",
      "Matthew 27:6",
      "Matthew 27:7",
      "Matthew 27:8",
      "Acts 1:19"
    ],
    "intro": "Two accounts emphasize different events in the death of Judas.",
    "passages": [
      [
        "Matthew 27:5",
        "And he cast down the pieces of silver in the temple, and departed, and went and hanged himself.",
        "And he cast down the pieces of silver into the sanctuary, and departed; and he went away and hanged himself."
      ],
      [
        "Acts 1:18",
        "Now this man purchased a field with the reward of iniquity; and falling headlong, he burst asunder in the midst, and all his bowels gushed out.",
        "Now this man obtained a field with the reward of his iniquity; and falling headlong, he burst asunder in the midst, and all his bowels gushed out."
      ]
    ],
    "original": "He hanged himself.",
    "sab": "https://skepticsannotatedbible.com/contra/judas.html",
    "claim": "SAB contrasts hanging in Matthew with the fall and bodily rupture in Acts.",
    "response": "GotQuestions proposes a hanging followed by decomposition and a fall when a rope or branch broke.",
    "responseUrl": "https://www.gotquestions.org/Judas-die.html",
    "assessment": "This compares narrative statements, not medical evidence. A proposed harmonization is possible but is not supplied by either passage.",
    "question": "Which parts of the proposed sequence are stated in the texts, and which are supplied by the interpreter?",
    "context": "Matthew describes hanging and a purchase by the priests with returned money. Acts credits Judas with the purchase and describes a headlong fall and bodily rupture.",
    "translation": "Both translations retain hanging in Matthew and falling in Acts. A translation change does not supply the missing sequence.",
    "sources": [
      {
        "label": "Matthew 27 (primary text)",
        "url": "https://ebible.org/kjv/MAT27.htm"
      },
      {
        "label": "Acts 1 (primary text)",
        "url": "https://ebible.org/kjv/ACT01.htm"
      }
    ],
    "reasoning": "The narratives differ in agent and manner of death. Combining them requires an unstated sequence, such as a fall after hanging and purchase on Judas's behalf."
  },
  {
    "id": "animals",
    "summary": "Genesis 1 can sound like birds came from water, while Genesis 2 says ground. The apparent conflict depends on how Genesis 1:20 is translated.",
    "title": "Water or ground: the animals’ origin",
    "type": "Translation dependent",
    "topic": "Creation",
    "testament": "Old Testament",
    "refs": [
      "Genesis 1:20",
      "Genesis 2:19"
    ],
    "intro": "Compare the wording for birds in the two creation narratives.",
    "passages": [
      [
        "Genesis 1:20",
        "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.",
        "And God said, Let the waters swarm with swarms of living creatures, and let birds fly above the earth in the open firmament of heaven."
      ],
      [
        "Genesis 2:19",
        "And out of the ground the LORD God formed every beast of the field, and every fowl of the air; and brought them unto Adam to see what he would call them.",
        "And out of the ground Jehovah God formed every beast of the field, and every bird of the heavens; and brought them unto the man to see what he would call them."
      ]
    ],
    "original": "From water",
    "sab": "https://skepticsannotatedbible.com/contra/animals.html",
    "claim": "SAB contrasts the water language of Genesis 1:20 with the ground language of Genesis 2:19.",
    "response": "A possible reading separates the command for water creatures from the command for birds to fly. The ASV makes that separation more visible. This is an editorial reading, not an attributed scholarly consensus.",
    "responseUrl": null,
    "assessment": "The English syntax changes how strongly Genesis 1:20 appears to assign birds a watery origin. That makes translation relevant without proving that all tensions between the chapters disappear.",
    "question": "Does Genesis 1:20 describe where birds originate or where they fly? Compare the surrounding verses.",
    "context": "Genesis 1 presents creation in a sequence of days; Genesis 2 focuses on the garden and the human being.",
    "translation": "The ASV supplies “and let birds fly,” whereas the KJV has “and fowl that may fly.” Genesis 2:19 extracts shown here end before the naming clause."
  },
  {
    "id": "plants",
    "summary": "Genesis 1 places vegetation before people; Genesis 2 describes no field plants before a cultivator. Whether this conflicts depends on which plants are meant.",
    "title": "Plants before people—or after?",
    "type": "Apparent contradiction",
    "topic": "Creation",
    "testament": "Old Testament",
    "refs": [
      "Genesis 1:11",
      "Genesis 2:5"
    ],
    "intro": "The two creation narratives raise a question about the scope of “plants of the field.”",
    "passages": [
      [
        "Genesis 1:11",
        "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.",
        "And God said, Let the earth put forth grass, herbs yielding seed, and fruit-trees bearing fruit after their kind, wherein is the seed thereof, upon the earth: and it was so."
      ],
      [
        "Genesis 2:5",
        "And every plant of the field before it was in the earth, and every herb of the field before it grew: for the LORD God had not caused it to rain upon the earth, and there was not a man to till the ground.",
        "And no plant of the field was yet in the earth, and no herb of the field had yet sprung up; for Jehovah God had not caused it to rain upon the earth: and there was not a man to till the ground."
      ]
    ],
    "original": "In chapter 2 the order is reversed.",
    "sab": "https://skepticsannotatedbible.com/gen/2.html",
    "claim": "SAB identifies a different order of vegetation and human creation between Genesis 1 and Genesis 2.",
    "response": "A possible reconciliation distinguishes cultivated field plants from vegetation generally, using the reference to a person tilling the ground. This is a proposed editorial reading that requires lexical support.",
    "responseUrl": null,
    "assessment": "Whether the two accounts conflict depends partly on what the field-plant terms include. The text supplies an agricultural context but does not itself give a botanical classification.",
    "question": "Are the two passages referring to the same category of plants?",
    "context": "Genesis 1:11 is followed by the creation of humanity later in the chapter. Genesis 2:5–9 moves from the lack of a cultivator to the man and the garden.",
    "translation": "ASV makes the “not yet” construction explicit. Both translations mention field plants and the absence of a cultivator."
  },
  {
    "id": "soldiers",
    "summary": "The census totals differ: Israel is 800,000 versus 1.1 million; Judah is 500,000 versus 470,000. Different counting rules are proposed but not established here.",
    "title": "David’s census: two different totals",
    "type": "Textual conflict",
    "topic": "Numbers & records",
    "testament": "Old Testament",
    "refs": [
      "2 Samuel 24:9",
      "1 Chronicles 21:5",
      "1 Chronicles 21:6"
    ],
    "intro": "Parallel census accounts report different numbers for Israel and Judah.",
    "passages": [
      [
        "2 Samuel 24:9",
        "And Joab gave up the sum of the number of the people unto the king: and there were in Israel eight hundred thousand valiant men that drew the sword; and the men of Judah were five hundred thousand.",
        "And Joab gave up the sum of the numbering of the people unto the king: and there were in Israel eight hundred thousand valiant men that drew the sword; and the men of Judah were five hundred thousand."
      ],
      [
        "1 Chronicles 21:5",
        "And Joab gave the sum of the number of the people unto David. And all they of Israel were a thousand thousand and an hundred thousand men that drew sword: and Judah was four hundred threescore and ten thousand men that drew sword.",
        "And Joab gave up the sum of the numbering of the people unto David. And all they of Israel were a thousand thousand and a hundred thousand men that drew sword: and Judah was four hundred threescore and ten thousand men that drew sword."
      ]
    ],
    "original": null,
    "sab": "https://www.skepticsannotatedbible.com/1chr/21.html",
    "claim": "The reported Israel totals are 800,000 and 1,100,000; the Judah totals are 500,000 and 470,000.",
    "response": "Different counting scopes are a possible explanation to investigate. No source establishing that explanation is included in this starter collection.",
    "responseUrl": null,
    "assessment": "The numerical discrepancy is directly visible. Explaining it historically requires evidence beyond noticing that counting categories could differ.",
    "question": "What evidence, if any, establishes different counting rules for the two totals?",
    "context": "Read the surrounding census narratives and 1 Chronicles 21:6, which notes that Levi and Benjamin were not counted.",
    "translation": "KJV and ASV report the same numerical differences.",
    "sources": [
      {
        "label": "2 Samuel 24 · primary text",
        "url": "https://ebible.org/eng-kjv/2SA24.htm"
      },
      {
        "label": "1 Chronicles 21 · primary text",
        "url": "https://ebible.org/eng-kjv/1CH21.htm"
      }
    ],
    "reasoning": "These totals are unequal. Chronicles notes that Levi and Benjamin were not counted, but neither text gives a reconciliation of all the figures."
  },
  {
    "id": "birth",
    "summary": "Matthew places Jesus’s birth under Herod; Luke links it to Quirinius’s census. The historical chronology creates a tension if the same census is intended.",
    "title": "Herod, Quirinius, and the birth chronology",
    "type": "Historical / chronological",
    "topic": "Gospel accounts",
    "testament": "New Testament",
    "refs": [
      "Matthew 2:1",
      "Luke 2:2"
    ],
    "intro": "The birth narratives name rulers whose chronology needs external historical evidence.",
    "passages": [
      [
        "Matthew 2:1",
        "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, there came wise men from the east to Jerusalem.",
        "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, Wise-men from the east came to Jerusalem."
      ],
      [
        "Luke 2:2",
        "(And this taxing was first made when Cyrenius was governor of Syria.)",
        "This was the first enrolment made when Quirinius was governor of Syria."
      ]
    ],
    "original": null,
    "sab": "https://www.skepticsannotatedbible.com/lk/2.html",
    "claim": "SAB flags a chronological tension between the reign of Herod and the census under Quirinius.",
    "response": "An earlier census or a different translation is sometimes proposed. Neither proposal is established by a historical source in this collection.",
    "responseUrl": null,
    "assessment": "Scripture can establish that the rulers are named. It cannot independently establish their external dates. This entry remains an open historical research question here; no scholarly-consensus claim is supplied.",
    "question": "Which primary historical sources date the relevant census and Herod’s reign?",
    "context": "Compare Matthew 2 with Luke 1:5 and Luke 2:1–7. Distinguish a narrative reference from independent historical corroboration.",
    "translation": "Cyrenius and Quirinius render the same name. “Taxing” and “enrolment” reflect different English descriptions of the census."
  }
];
if(typeof module !== 'undefined') module.exports={ENTRIES,TYPES};
