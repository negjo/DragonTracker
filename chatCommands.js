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




