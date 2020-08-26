// For sample datasets seen in group generator
const store = {
  sampleData1: {
    groupSize: 3,
    groupingType: 'mixed',
    categoriesLength: 2,
    categoryTypes: ['qualitative', 'quantitative'],
    categoryNames: ['Hogwarts House', 'Assessment Grade'],
    categoryVals: [`Slytherin\nRavenclaw\nGryffindor\nGryffindor\nSlytherin\nGryffindor\nSlytherin\nHufflepuff\nGryffindor\nSlytherin\nHufflepuff\nGryffindor\nGryffindor\nHufflepuff\nGryffindor\nGryffindor\nRavenclaw\nRavenclaw\nGryffindor\nSlytherin\nRavenclaw\nGryffindor\nGryffindor\nGryffindor\nSlytherin\nHufflepuff\n`, `81\n89\n79\n81\n52\n75\n82\n83\n81\n55\n65\n78\n100\n77\n75\n84\n92\n68\n65\n84\n88\n90\n68\n74\n86\n95\n`],
    aliases: `Blaise\nCho\nColin\nCormac\nCrabbe\nDean\nDraco\nErnie\nGinny\nGoyle\nHannah\nHarry\nHermione\nJustin\nKatie\nLavender\nLuna\nMichael\nNeville\nPansy\nPadma\nParvati\nRon\nSeamus\nTheodore\nZacharias\n`,
  },
  sampleData2: {
    groupSize: 4,
    groupingType: 'similar',
    categoriesLength: 2,
    categoryTypes: ['qualitative', 'qualitative'],
    categoryNames: ["Book Study Preference", "Personality Type"],
    categoryVals: [`The Giver\nWatership Down\nTuck Everlasting\nThe Giver\nTuck Everlasting\nTuck Everlasting\nThe Giver\nWatership Down\nTuck Everlasting\nWatership Down\nThe Giver\nWatership Down\nTuck Everlasting\nWatership Down\nWatership Down\nThe Giver\nTuck Everlasting\nTuck Everlasting\nWatership Down\nThe Giver\nWatership Down\nTuck Everlasting\nWatership Down\nThe Giver\nWatership Down\nTuck Everlasting`, `Introvert\nExtrovert\nIntrovert\nExtrovert\nExtrovert\nExtrovert\nIntrovert\nExtrovert\nExtrovert\nIntrovert\nIntrovert\nExtrovert\nIntrovert\nExtrovert\nExtrovert\nIntrovert\nIntrovert\nExtrovert\nIntrovert\nIntrovert\nIntrovert\nExtrovert\nIntrovert\nIntrovert\nExtrovert\nIntrovert\n`],
    aliases: `Sven\nViolet\nEthan\nAidan\nSofia\nGabriel\nAstrid\nEmilia\nJasper\nCaleb\nOlivia\nEli\nKen\nAurora\nFelix\nWyatt\nIsabella\nJordan\nElla\nJewel\nOliver\nCharlotte\nFinn\nHudson\nLiam\nAva`,
  },
  sampleData3: {
    groupSize: 2,
    groupingType: 'mixed',
    categoriesLength: 3,
    categoryTypes: ['quantitative', 'quantitative', 'qualitative'],
    categoryNames: ["Reading Assessment Grade", "Vocabulary Assessment Grade", "Personality Type"],
    categoryVals: [`81\n88\n85\n73\n91\n100\n78\n76\n87\n62\n48\n77\n86\n69\n56\n79\n78\n85\n91\n98\n100\n86\n94\n75\n79\n90`, `85\n90\n87\n75\n90\n95\n80\n74\n83\n66\n61\n81\n89\n75\n48\n82\n76\n89\n93\n94\n98\n86\n91\n74\n73\n85`,
    `Introvert\nExtrovert\nIntrovert\nExtrovert\nExtrovert\nIntrovert\nExtrovert\nIntrovert\nIntrovert\nIntrovert\nExtrovert\nIntrovert\nExtrovert\nExtrovert\nIntrovert\nExtrovert\nIntrovert\nExtrovert\nIntrovert\nIntrovert\nIntrovert\nIntrovert\nExtrovert\nIntrovert\nExtrovert\nExtrovert`],
    aliases: `Sven\nViolet\nEthan\nAidan\nSofia\nGabriel\nAstrid\nEmilia\nJasper\nCaleb\nOlivia\nEli\nKen\nAurora\nFelix\nWyatt\nIsabella\nJordan\nElla\nJewel\nOliver\nCharlotte\nFinn\nHusdon\nLiam\nAva`,
  },
  sampleData4: {
    groupSize: 5,
    groupingType: 'mixed',
    categoriesLength: 4,
    categoryTypes: ["qualitative", "qualitative", "qualitative", "qualitative"],
    categoryNames: ["Energy", "Information", "Decisions", "Organization"],
    categoryVals: [`Introversion\nIntroversion\nExtroversion\nIntroversion\nExtroversion\nIntroversion\nExtroversion\nExtroversion\nExtroversion\nExtroversion\nIntroversion\nExtroversion\nIntroversion\nExtroversion\nIntroversion\nExtroversion\nIntroversion\nExtroversion\nIntroversion\nExtroversion\nExtroversion\nIntroversion\nExtroversion`, `Intuition\nSensing\nSensing\nIntuition\nIntuition\nIntuition\nSensing\nIntuition\nIntuition\nSensing\nSensing\nSensing\nIntuition\nSensing\nSensing\nIntuition\nSensing\nIntuition\nIntuition\nSensing\nIntuition\nSensing\nSensing`, `Thinking\nFeeling\nThinking\nThinking\nFeeling\nThinking\nThinking\nThinking\nFeeling\nFeeling\nThinking\nFeeling\nThinking\nThinking\nThinking\nFeeling\nFeeling\nFeeling\nThinking\nThinking\nThinking\nFeeling\nThinking`, `Perceiving\nPerceiving\nPerceiving\nPerceiving\nJudging\nJudging\nPerceiving\nJudging\nPerceiving\nJudging\nJudging\nPerceiving\nJudging\nJudging\nJudging\nPerceiving\nJudging\nPerceiving\nJudging\nJudging\nPerceiving\nJudging\nPerceiving`],
    aliases: `Rose\nEllie\nKiefer\nTomas\nPollyanna\nRoberto\nAllen\nGeorge\nCarol\nHenrietta\nMarie\nJohn\nJules\nJennifer\nGarrett\nJavier\nKayle\nDawn\nCat\nGreg\nAnneliese\nLillian\nMiles`,
  }
};

export default store;