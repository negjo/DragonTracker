import {pogObject, formatPrice} from "./index.js"

register("chat", (name, event) => {
    ChatLib.say(pogObject.Since_Last_Pet + " dragons since last pet");
}).setCriteria("&r&9Party &8> ${name}: &r!since&r");

register("chat", (name, event) => {
    let epicCnt = pogObject.Epic_Ender_Dragon;
    let epicRates = ((epicCnt/pogObject.Dragons_Summoned)*100).toFixed(2)
    let legCnt = pogObject.Legendary_Ender_Dragon;
    let legRates = ((legCnt/pogObject.Dragons_Summoned)*100).toFixed(2)
    let totalCnt = epicCnt + legCnt;
    let totalRates = ((totalCnt/pogObject.Dragons_Summoned)*100).toFixed(2);
    ChatLib.say("epic: " + epicCnt + "(" + epicRates + "%)" + " leg: " + legCnt + "(" + legRates + "%)" + " total: " + totalCnt + "(" + totalRates + "%)");
}).setCriteria("&r&9Party &8> ${name}: &r!pets&r");

register("chat", (name, event) => {
    ChatLib.say("profit: " + formatPrice(pogObject.Profit) + " (" + formatPrice(pogObject.Profit/pogObject.Profit_Drag_Count) + "/dragon)");
}).setCriteria("&r&9Party &8> ${name}: &r!profit&r");




function fixOdds(oddsArray, placedArray){
    oddsArray = oddsArray.map((n, i) => placedArray[i] > 1 ? (n) : 0)
    
    let twoCnt = 0;
    for(let i = 0; i < oddsArray.length; i++){
        if(placedArray[i] == 2){
            twoCnt++;
        }
        if(twoCnt > 2){
            oddsArray[i] = 0;
        }
    }
    return oddsArray;
}



register("command", (placement, mf, pl) => {
    //ChatLib.chat(placement + " " + mf + " " + pl);
    if(!/^\d+$/.test(placement) || !/^\d+$/.test(mf) || !/^\d+$/.test(pl)){
        ChatLib.chat("&c[Dragon Tracker] &eInvalid command usage!");
        ChatLib.chat("&eUsage: /dtcalc <placed> <mf> <pl>");
        ChatLib.chat("&eExample: /dtcalc 233 300 200");
        return
    }


    placements = placement.split("").map(Number);
    placementSum = placements.reduce((a, b) => a + b, 0);

    if(placementSum != 8){
        ChatLib.chat("&c[Dragon Tracker] &eWonder how are you gonna summong a dragon with " + placementSum + " eyes");
        return
    }

    const baseClawOdds = placements.map(n => Math.min(n * 0.02 * (mf/100+1), 1))

    let realClawOdds = new Array(placements.length).fill(0)

    for(let i = 1; i < 2 ** placements.length; i++){
      let bin = i.toString(2).padStart(placements.length, "0")
      let binArray = bin.split("")
      let dropCnt = bin.split("1").length - 1
      let weightedArray = binArray.map(n => n/dropCnt)
      let chanceOfThisOutcome = binArray.reduce((acc, bit, j) => acc * (bit == "1" ? baseClawOdds[j] : 1 - baseClawOdds[j]), 1);
      for(let j = 0; j < weightedArray.length; j++){
        realClawOdds[j] += weightedArray[j] * chanceOfThisOutcome;
      }
    }

    realClawOdds = fixOdds(realClawOdds, placements)

    const baseAotdOdds =  placements.map((n, i) => Math.min(n * 0.03 * (mf/100+1) * (1 - realClawOdds[i]), 1))
    let realAotdOdds = new Array(placements.length).fill(0);

    for(let i = 1; i < 2 ** placements.length; i++){
      let bin = i.toString(2).padStart(placements.length, "0")
      let binArray = bin.split("")
      let dropCnt = bin.split("1").length - 1
      let weightedArray = binArray.map(n => n/dropCnt)
      let chanceOfThisOutcome = binArray.reduce((acc, bit, j) => acc * (bit == "1" ? baseAotdOdds[j] : 1 - baseAotdOdds[j]), 1);
      for(let j = 0; j < weightedArray.length; j++){
        realAotdOdds[j] += weightedArray[j] * chanceOfThisOutcome;
      }
    }

    realAotdOdds = fixOdds(realAotdOdds, placements);

    let epicPetOdds = placements.map((n, i) => n * 0.0005 * ((+mf + +pl)/100+1) * (1 - realAotdOdds[i]) * (1 - realClawOdds[i]));
    let legPetOdds = placements.map((n, i) => n * 0.0001 * ((+mf + +pl)/100+1) * (1 - realAotdOdds[i]) * (1 - realClawOdds[i]));

    epicPetOdds = fixOdds(epicPetOdds, placements);
    legPetOdds = fixOdds(legPetOdds, placements);

    ChatLib.chat("&e&lDragon Tracker calculator");
    ChatLib.chat("&ePlacing: &d" + placements.join("/") + " &emf: &d" + mf + " &epl: &d" + pl);
    for (let i = 0; i < placements.length; i++){
       ChatLib.chat("&c" + placements[i] + " placer:" + "&c".repeat(i));
       ChatLib.chat("&eClaw: &d" + (realClawOdds[i] * 100).toFixed(3) + "%" + " &eAotd: &d" + (realAotdOdds[i] * 100).toFixed(3) + "%" + "&c".repeat(i));
       ChatLib.chat("&eLeg pet: &d" + (legPetOdds[i] * 100).toFixed(3) + "%" + " &eEpic pet: &d" + (epicPetOdds[i] * 100).toFixed(3) + "%" + " &eTotal: &d" + ((legPetOdds[i] + epicPetOdds[i]) * 100).toFixed(3) + "%" + "&c".repeat(i));
    }
    ChatLib.chat("&cParty rates:")
    ChatLib.chat("&eClaw: &d" + (realClawOdds.reduce((a, b) => a + b, 0) * 100).toFixed(3) + "%" + " &eAotd: &d" + (realAotdOdds.reduce((a, b) => a + b, 0) * 100).toFixed(3) + "%");
    ChatLib.chat("&eLeg pet: &d" + (legPetOdds.reduce((a, b) => a + b, 0) * 100).toFixed(3) + "%" + " &eEpic pet: &d" + (epicPetOdds.reduce((a, b) => a + b, 0) * 100).toFixed(3) + "%" + " &eTotal: &d" + ((legPetOdds.reduce((a, b) => a + b, 0) + epicPetOdds.reduce((a, b) => a + b, 0)) * 100).toFixed(3) + "%");
}).setName("dtcalc", false)