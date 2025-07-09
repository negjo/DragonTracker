import request from "requestv2";
import Settings from "./config.js"


const LBIN = 0;
const AVERAGE = 1;
const BUYORDER = 0;
const INSTABUY = 2;
const SELLORDER = 0;
const INSTASELL = 2;
const MIDPRICE = 1;
const BZAVERAGE = 3;



ahPrices = {
    Epic_Ender_Dragon: { avg: 0, lbin: 0 },
    Legendary_Ender_Dragon: { avg: 0, lbin: 0 },
    Aspect_of_the_Dragon: { avg: 0, lbin: 0 },
    Superior_Dragon_Helmet: { avg: 0, lbin: 0 },
    Superior_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Superior_Dragon_Leggings: { avg: 0, lbin: 0 },
    Superior_Dragon_Boots: { avg: 0, lbin: 0 },
    Strong_Dragon_Helmet: { avg: 0, lbin: 0 },
    Strong_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Strong_Dragon_Leggings: { avg: 0, lbin: 0 },
    Strong_Dragon_Boots: { avg: 0, lbin: 0 },
    Wise_Dragon_Helmet: { avg: 0, lbin: 0 },
    Wise_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Wise_Dragon_Leggings: { avg: 0, lbin: 0 },
    Wise_Dragon_Boots: { avg: 0, lbin: 0 },
    Unstable_Dragon_Helmet: { avg: 0, lbin: 0 },
    Unstable_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Unstable_Dragon_Leggings: { avg: 0, lbin: 0 },
    Unstable_Dragon_Boots: { avg: 0, lbin: 0 },
    Old_Dragon_Helmet: { avg: 0, lbin: 0 },
    Old_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Old_Dragon_Leggings: { avg: 0, lbin: 0 },
    Old_Dragon_Boots: { avg: 0, lbin: 0 },
    Protector_Dragon_Helmet: { avg: 0, lbin: 0 },
    Protector_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Protector_Dragon_Leggings: { avg: 0, lbin: 0 },
    Protector_Dragon_Boots: { avg: 0, lbin: 0 },
    Young_Dragon_Helmet: { avg: 0, lbin: 0 },
    Young_Dragon_Chestplate: { avg: 0, lbin: 0 },
    Young_Dragon_Leggings: { avg: 0, lbin: 0 },
    Young_Dragon_Boots: { avg: 0, lbin: 0 },
};

bzPrices = {
    Summoning_Eye: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Dragon_Claw: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Dragon_Horn: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Dragon_Scale: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Superior_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Strong_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Wise_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Unstable_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Old_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Protector_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Young_Dragon_Fragment: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Dragon_Essence: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Ritual_Residue: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
    Shard_Draconic: { instaBuy: 0, instaSell: 0, midPrice: 0, avg: 0 },
};


function updatePrices(){
    for(item in ahPrices){
        updateAhAvgPrice(item, 0)
        updateAhLbinPrice(item, 0)
    }
    for(item in bzPrices){
        updateBzPrice(item, 0)
        updateBzAvgPrice(item, 0)
    }
}

function updateBzPrice(item, retryCnt){
    let itemApiName = item.toUpperCase()
    if(itemApiName.includes("FRAGMENT")){
        itemApiName = itemApiName.split("_")[0] + "_" + itemApiName.split("_")[2]
    }
    else if(itemApiName == "DRAGON_ESSENCE"){
        itemApiName = "ESSENCE_DRAGON"
    }
    let bzurl = "https://sky.coflnet.com/api/item/price/" + itemApiName + "/current"
    request({
        url: bzurl,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        json: true,
    })
        .then(function(response) {
            bzPrices[item].instaBuy = response.buy;
            bzPrices[item].instaSell = response.sell;
            bzPrices[item].midPrice = (response.buy + response.sell)/2
        })
        .catch(function(err) {
            if(retryCnt < 5){
                setTimeout(() => {
                    updateBzPrice(item, retryCnt + 1)
                }, 10000);
            }
            else{
                ChatLib.chat("&e[DT] &cFailed to update Bazaar prices for " + item + ". If this keeps happening repeatedly, please report it.")
            }
        }
    );
}

function updateBzAvgPrice(item, retryCnt){
    let avgUrl = "https://sky.coflnet.com/api/item/price/" + item.toUpperCase()
    request({
        url: avgUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        json: true,
    })
        .then(function(response) {
            bzPrices[item].avg = response.mean;
        })
        .catch(function(err) {
            if(retryCnt < 5){
                setTimeout(() => {
                    updateBzAvgPrice(item, retryCnt + 1)
                }, 10000);
            }
            else{
                ChatLib.chat("&e[DT] &cFailed to update Bazaar average price for " + item + ". If this keeps happening repeatedly, please report it.")
            }
        }
    );
}

function updateAhAvgPrice(item, retryCnt){
    let avgUrl = "";
    if(item == "Epic_Ender_Dragon"){
        avgUrl = "https://sky.coflnet.com/api/item/price/PET_ENDER_DRAGON?Rarity=EPIC&PetLevel=1&PetItem=NONE"
    }
    else if(item == "Legendary_Ender_Dragon"){
        avgUrl = "https://sky.coflnet.com/api/item/price/PET_ENDER_DRAGON?Rarity=LEGENDARY&PetLevel=1&PetItem=NONE"
    }
    else{
        avgUrl = "https://sky.coflnet.com/api/item/price/" + item.toUpperCase() + "?Clean=true"
    }
    request({
        url: avgUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        json: true,
    })
        .then(function(response) {
            ahPrices[item].avg = response.mean;
        })
        .catch(function(err) {
            if(retryCnt < 5){
                setTimeout(() => {
                    updateAhAvgPrice(item, retryCnt + 1)
                }, 10000);
            }
            else{
                ChatLib.chat("&e[DT] &cFailed to update AH average price for " + item + ". If this keeps happening repeatedly, please report it.")
            }
        }
    );
}

function updateAhLbinPrice(item, retryCnt){
    let lbinUrl = "";
    if(item == "Epic_Ender_Dragon"){
        lbinUrl = "https://sky.coflnet.com/api/item/price/PET_ENDER_DRAGON/bin?Rarity=EPIC&PetLevel=1&PetItem=NONE&Bin=true"
    }
    else if(item == "Legendary_Ender_Dragon"){
        lbinUrl = "https://sky.coflnet.com/api/item/price/PET_ENDER_DRAGON/bin?Rarity=LEGENDARY&PetLevel=1&PetItem=NONE&Bin=true"
    }
    else{
        lbinUrl = "https://sky.coflnet.com/api/item/price/" + item.toUpperCase() + "/bin?Clean=true&Bin=true"
    }
    request({
        url: lbinUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        json: true,
    })
        .then(function(response) {
            ahPrices[item].lbin = response.lowest
        })
        .catch(function(err) {
            if(retryCnt < 5){
                setTimeout(() => {
                    updateAhLbinPrice(item, retryCnt + 1)
                }, 10000);
            }
            else{
                ChatLib.chat("&e[DT] &cFailed to update AH LBIN price for " + item + ". If this keeps happening repeatedly, please report it.")
            }
        }
    );
}


function sacrificeCalc(item){
    let eyePrice = getPrice("Summoning_Eye");
    let essencePrice = getPrice("Dragon_Essence");
    let hornPrice = getPrice("Dragon_Horn");
    let clawPrice = getPrice("Dragon_Claw");
    let residuePrice = getPrice("Ritual_Residue");
    let supFragsPrice = getPrice("Superior_Dragon_Fragment");
    let strongFragsPrice = getPrice("Strong_Dragon_Fragment");
    let wiseFragsPrice = getPrice("Wise_Dragon_Fragment");
    let unstFragsPrice = getPrice("Unstable_Dragon_Fragment");
    let oldFragsPrice = getPrice("Old_Dragon_Fragment");
    let protFragsPrice = getPrice("Protector_Dragon_Fragment");
    let youngFragsPrice = getPrice("Young_Dragon_Fragment");

    if(item == "Aspect_of_the_Dragon"){
        return 60*essencePrice + 0.55 * (supFragsPrice*12.5*0.8 + residuePrice*0.1059 + clawPrice*0.0235 + eyePrice * 0.0471 + hornPrice*0.0235)
    }
    let essenceProfit = 0;
    if(item.includes("Helmet")){
        essenceProfit += 25*essencePrice
    }
    else if(item.includes("Chestplate")){
        essenceProfit += 40*essencePrice
    }
    else if(item.includes("Leggings")){
        essenceProfit += 35*essencePrice
    }
    else if(item.includes("Boots")){
        essenceProfit += 20*essencePrice
    }

    if(item.includes("Superior")){
        return 2*essenceProfit*1.2 + 0.55*(supFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
    else if(item.includes("Strong")){
        return essenceProfit*1.2 + 0.55*(strongFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
    else if(item.includes("Wise")){
        return essenceProfit*1.2 + 0.55*(wiseFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
    else if(item.includes("Unstable")){
        return essenceProfit*1.2 + 0.55*(unstFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
    else if(item.includes("Old")){
        return essenceProfit*1.2 + 0.55*(oldFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
    else if(item.includes("Protector")){
        return essenceProfit*1.2 + 0.55*(protFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
    else if(item.includes("Young")){
        return essenceProfit*1.2 + 0.55*(youngFragsPrice*17.5*0.8193 + residuePrice*0.1084 + hornPrice*0.0241 + eyePrice*0.0482)
    }
}


function getBzItemPrice(item, setting){
    if(item == "Summoning_Eye"){
        if(setting == INSTABUY){
            return parseInt(bzPrices[item].instaBuy)
        }
        else if(setting == BUYORDER){
            return parseInt(bzPrices[item].instaSell)
        }
        else if(setting == MIDPRICE){
            return parseInt(bzPrices[item].midPrice)
        }
        else if(setting == BZAVERAGE){
            return parseInt(bzPrices[item].avg)
        }
    }
    if(setting == INSTASELL){
        return parseInt(bzPrices[item].instaSell)
    }
    else if(setting == SELLORDER){
        return parseInt(bzPrices[item].instaBuy)
    }
    else if(setting == MIDPRICE){
        return parseInt(bzPrices[item].midPrice)
    }
    else if(setting == BZAVERAGE){
        return parseInt(bzPrices[item].avg)
    }
}

function getAhItemPrice(item, priceSetting, sacSetting){
    if(sacSetting == true){
        return parseInt(sacrificeCalc(item))
    }
    else if(priceSetting == LBIN){
        return parseInt(ahPrices[item].lbin)
    }
    else if(priceSetting == AVERAGE){
        return parseInt(ahPrices[item].avg)
    }
}


function getPrice(item){
    if (item == "Summoning_Eye") {
        return getBzItemPrice(item, Settings.eyePricing);
    } else if (item == "Dragon_Claw") {
        return getBzItemPrice(item, Settings.otherPricing);
    } else if (item == "Dragon_Horn") {
        return getBzItemPrice(item, Settings.hornPricing);
    } else if (item == "Dragon_Scale") {
        return getBzItemPrice(item, Settings.otherPricing);
    } else if (item.includes("Fragment")) {
        return getBzItemPrice(item, Settings.fragPricing);
    } else if (item == "Dragon_Essence") {
        return getBzItemPrice(item, Settings.essencePricing);
    } else if (item == "Ritual_Residue") {
        return getBzItemPrice(item, Settings.residuePricing);
    } else if (item == "Shard_Draconic") {
        return getBzItemPrice(item, Settings.draconicPricing);
    } else if (item == "Epic_Ender_Dragon") {
        return getAhItemPrice(item, Settings.ahPricing, false);
    } else if (item == "Legendary_Ender_Dragon") {
        return getAhItemPrice(item, Settings.ahPricing, false);
    } else if (item.includes("Aspect_of_the_Dragon")){
        return getAhItemPrice("Aspect_of_the_Dragon", Settings.ahPricing, Settings.sacAotds);
    } else if (item.includes("Superior_Dragon")) {
        return getAhItemPrice(item, Settings.ahPricing, Settings.sacSups);
    } else if( item.includes("Dragon")) {
        return getAhItemPrice(item, Settings.ahPricing, Settings.sacOthers);
    } else{
        return 0;
    }
}


module.exports = {
    getPrice: getPrice,
    ahPrices: ahPrices,
    bzPrices: bzPrices,
    getPrice: getPrice,
    updatePrices: updatePrices
}