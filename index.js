import PogObject from "PogData";
import Settings from "./config.js"
import "./profit.js"
import { bzPrices, ahPrices, updatePrices, getPrice} from "./profit.js";

const pogObject = new PogObject("DragonTracker", {
    Epic_Ender_Dragon: 0,
    Legendary_Ender_Dragon: 0,
    Dragon_Claw: 0,
    Dragon_Horn: 0,
    Dragon_Scale: 0,
    Aspect_of_the_Dragon: 0,
    Superior_Dragon_Helmet: 0,
    Superior_Dragon_Chestplate: 0,
    Superior_Dragon_Leggings: 0,
    Superior_Dragon_Boots: 0,
    Strong_Dragon_Helmet: 0,
    Strong_Dragon_Chestplate: 0,
    Strong_Dragon_Leggings: 0,
    Strong_Dragon_Boots: 0,
    Wise_Dragon_Helmet: 0,
    Wise_Dragon_Chestplate: 0,
    Wise_Dragon_Leggings: 0,
    Wise_Dragon_Boots: 0,
    Unstable_Dragon_Helmet: 0,
    Unstable_Dragon_Chestplate: 0,
    Unstable_Dragon_Leggings: 0,
    Unstable_Dragon_Boots: 0,
    Old_Dragon_Helmet: 0,
    Old_Dragon_Chestplate: 0,
    Old_Dragon_Leggings: 0,
    Old_Dragon_Boots: 0,
    Protector_Dragon_Helmet: 0,
    Protector_Dragon_Chestplate: 0,
    Protector_Dragon_Leggings: 0,
    Protector_Dragon_Boots: 0,
    Young_Dragon_Helmet: 0,
    Young_Dragon_Chestplate: 0,
    Young_Dragon_Leggings: 0,
    Young_Dragon_Boots: 0,
    Superior_Dragon_Fragment: 0,
    Strong_Dragon_Fragment: 0,
    Wise_Dragon_Fragment: 0,
    Unstable_Dragon_Fragment: 0,
    Old_Dragon_Fragment: 0,
    Protector_Dragon_Fragment: 0,
    Young_Dragon_Fragment: 0,
    Dragon_Essence: 0,
    Runecrafting_exp: 0,
    Shard_Draconic: 0,
    Ritual_Residue: 0,

    Dragons_Summoned: 0,
    Eyes_Placed: 0,
    
    Superior_Dragons: 0,
    Strong_Dragons: 0,
    Wise_Dragons: 0,
    Unstable_Dragons: 0,
    Old_Dragons: 0,
    Protector_Dragons: 0,
    Young_Dragons: 0,

    Since_Last_Pet: 0,
    Since_Last_Sup: 0,
    Longest_Dry_Streak: 0,
    Longest_Sup_Dry_Streak: 0,

    Eyes_Placed_history: [],
    Weight_history: [],
    Loot_History: [],
    Dragon_History: [],

    Profit: 0,
    Profit_Drag_Count: 0,
    Profit_Eyes_Count: 0,

    Last_Version: "1.0.0",
  });

pogObject.save()

placed = 0;
dragonDied = false;
topDamage = 0;
lastDamage = 0;
lastDragon = "none"
totalWeight = 0;
runecraftingExp = 0;
dropsDetected = [];

function removeCommas(value){
    return value.replace(/,/g, '');
}

function cleanDamageString(damageString){
    return damageString.replace(/,/g, '').replace(/\(NEW RECORD!\)/g, '');
}

function addCommas(nStr)
{
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function formatPrice(price){
    price = parseInt(price);
    if(Settings.shorterValues){
        if(Math.abs(price) > 10_000_000_000){
            return (price/1_000_000_000).toFixed(1) + "b"
        }
        if(Math.abs(price) > 1_000_000_000){
            return (price/1_000_000_000).toFixed(2) + "b"
        }
        if(Math.abs(price) > 100_000_000){
            return (price/1_000_000).toFixed(0) + "m"
        }
        if(Math.abs(price) > 10_000_000){
            return (price/1_000_000).toFixed(1) + "m"
        }
        if(Math.abs(price) > 1_000_000){
            return (price/1_000_000).toFixed(2) + "m"
        }
        if(Math.abs(price) > 100_000){
            return (price/1_000).toFixed(0) + "k"
        }
        if(Math.abs(price) > 1_000){
            return (price/1_000).toFixed(1) + "k"
        }
    }
    price = addCommas(price);
    return price

}

function checkEnd(){
    if (TabList.getNames()[41] != undefined) {
        if (TabList.getNames()[41].removeFormatting() == "Area: The End") {
            return true;
        }
    }
    if (TabList.getNames()[21] != undefined) {
        if (TabList.getNames()[21].removeFormatting() == "Area: The End") {
            return true;
        }
    }
    return false;
}

function checkPet(pet){
    let found = false
    TabList.getNames().forEach(line => {
        if(line.removeFormatting().includes("] " + pet)){
            found = true
        }
    });
    return found;
}

register("chat", (item, essence, event) => {
    if(!Settings.trackerEnabled){
        return
    }
    if(Settings.endermiteWarning){
        if(!checkPet("Endermite")){
            Client.showTitle("&4&lNo Endermite!", "&4Wrong pet detected", 0, 40, 10)
            Client.showTitle("&4&lNo Endermite!", "&4Wrong pet detected", 0, 40, 10)
            ChatLib.chat("&4&lNo Endermite pet detected!")
        }
    }
}).setCriteria("SACRIFICE! You turned ${item} into ${essence} Dragon Essence!");

register("chat", (count, suffix, event) => {
    if(!Settings.trackerEnabled){
        return
    }
    placed += 1
}).setCriteria("☬ You placed a Summoning Eye! ${suffix}");

register("chat", (message, event) => {
    if(!Settings.trackerEnabled){
        return
    }
    placed -= 1
}).setCriteria("You recovered a Summoning Eye!");

register("chat", (dragon) => {
    if(!Settings.trackerEnabled){
        return
    }
    if(Settings.blackCatWarning && placed != 0){
        if(!checkPet("Black Cat")){
            Client.showTitle("&4&lNo Black Cat!", "&4Wrong pet detected", 0, 40, 10)
            Client.showTitle("&4&lNo Black Cat!", "&4Wrong pet detected", 0, 40, 10)
            ChatLib.chat("&4&lNo Black Cat detected!")
        }
    }
}).setCriteria("The ${dragon} Dragon has spawned!");

register("chat", (xp) => {
    if(!Settings.trackerEnabled){
        return
    }
    runecraftingExp = parseInt(xp)
}).setCriteria("Runecrafting: +${xp} XP").setContains();

register("chat", (dragon) =>{
    if(!Settings.trackerEnabled){
        return
    }
    lastDragon = dragon.replace(/ /g, '')
    dragonDied = true;
}).setCriteria("${dragon} DRAGON DOWN!").setContains();

register("chat", (name, damage) =>  {
    if(!Settings.trackerEnabled){
        return
    }
    topDamage = removeCommas(damage);
}).setCriteria("1st Damager - ${name} - ${damage}").setContains()

register("chat", (prefix, damage, position) =>  {
    if(!Settings.trackerEnabled){
        return
    }
    if(!dragonDied){
        return
    }
    if(prefix.trim().length > 0){
        return
    }
    let myDamage = cleanDamageString(damage)
    lastDamage = myDamage

    let damageWeight = parseInt(myDamage/topDamage*100)
    let positionWeight = 10;
    if(myDamage == 0){
        positionWeight = 10;
    }
    else if(position == 1){
        positionWeight = 200
    }
    else if(position == 2){
        positionWeight = 175
    }
    else if(position == 3){
        positionWeight = 150
    }
    else if(position == 4){
        positionWeight = 125
    }
    else if(position == 5){
        positionWeight = 110
    }
    else if(position <= 8){
        positionWeight = 100
    }
    else if(position <= 10){
        positionWeight = 90
    }
    else if(position <= 12){
        positionWeight = 80
    }
    else if(position <= 18){
        positionWeight = 70
    }
    else if(position <= 25){
        positionWeight = 70
    }
    else if(myDamage > 1){
        positionWeight = 70
    }

    let eyesWeight = placed*100
    totalWeight = parseInt(damageWeight + positionWeight + eyesWeight)
}).setCriteria("${prefix} Your Damage: ${damage} (Position #${position})")

EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');

function scanForLoot(){
    if(!Settings.trackerEnabled){
        return
    }
    if(!dragonDied){
        return
    }
    if(placed == 0 && Settings.onlyYourDrags){
        return
    }

    let itemFound = null;
    let weightLeft = totalWeight;
    World.getAllEntitiesOfType(EntityArmorStand).forEach(entity => {
        if(dropsDetected.includes(entity.getUUID())){
            return;
        }
        switch(entity.getName()){
            case "§7[Lvl 1] §5Ender Dragon":
                weightLeft = totalWeight - 450
                pogObject.Epic_Ender_Dragon = pogObject.Epic_Ender_Dragon + 1;
                if(Settings.announcePet){
                    ChatLib.command("pc " + Settings.epicPetMsg)
                }
                itemFound = entity.getName()
                break;
            case "§7[Lvl 1] §6Ender Dragon":
                weightLeft = totalWeight - 450
                pogObject.Legendary_Ender_Dragon = pogObject.Legendary_Ender_Dragon + 1;
                if(Settings.announcePet){
                    ChatLib.command("pc " + Settings.legPetMsg)
                }
                itemFound = entity.getName()
                break;
            case "§9Dragon Claw":
                weightLeft = totalWeight - 451
                pogObject.Dragon_Claw = pogObject.Dragon_Claw + 1;
                itemFound = entity.getName()
                break;
            case "§6Aspect of the Dragons":
                weightLeft = totalWeight - 450
                pogObject.Aspect_of_the_Dragon = pogObject.Aspect_of_the_Dragon + 1;
                itemFound = entity.getName()
                break;
            case "§5Dragon Horn":
                weightLeft = totalWeight - 452
                pogObject.Dragon_Horn = pogObject.Dragon_Horn + 1;
                itemFound = entity.getName()
                break;
            case "§6Superior Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Superior_Dragon_Helmet = pogObject.Superior_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Superior Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Superior_Dragon_Chestplate = pogObject.Superior_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Superior Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Superior_Dragon_Leggings = pogObject.Superior_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Superior Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Superior_Dragon_Boots = pogObject.Superior_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§6Strong Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Strong_Dragon_Helmet = pogObject.Strong_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Strong Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Strong_Dragon_Chestplate = pogObject.Strong_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Strong Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Strong_Dragon_Leggings = pogObject.Strong_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Strong Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Strong_Dragon_Boots = pogObject.Strong_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§6Wise Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Wise_Dragon_Helmet = pogObject.Wise_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Wise Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Wise_Dragon_Chestplate = pogObject.Wise_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Wise Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Wise_Dragon_Leggings = pogObject.Wise_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Wise Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Wise_Dragon_Boots = pogObject.Wise_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§6Unstable Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Unstable_Dragon_Helmet = pogObject.Unstable_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Unstable Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Unstable_Dragon_Chestplate = pogObject.Unstable_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Unstable Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Unstable_Dragon_Leggings = pogObject.Unstable_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Unstable Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Unstable_Dragon_Boots = pogObject.Unstable_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§6Old Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Old_Dragon_Helmet = pogObject.Old_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Old Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Old_Dragon_Chestplate = pogObject.Old_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Old Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Old_Dragon_Leggings = pogObject.Old_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Old Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Old_Dragon_Boots = pogObject.Old_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§6Protector Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Protector_Dragon_Helmet = pogObject.Protector_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Protector Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Protector_Dragon_Chestplate = pogObject.Protector_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Protector Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Protector_Dragon_Leggings = pogObject.Protector_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Protector Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Protector_Dragon_Boots = pogObject.Protector_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§6Young Dragon Helmet":
                weightLeft = totalWeight - 295
                pogObject.Young_Dragon_Helmet = pogObject.Young_Dragon_Helmet + 1;
                itemFound = entity.getName()
                break;
            case "§6Young Dragon Chestplate":
                weightLeft = totalWeight - 410
                pogObject.Young_Dragon_Chestplate = pogObject.Young_Dragon_Chestplate + 1;
                itemFound = entity.getName()
                break;
            case "§6Young Dragon Leggings":
                weightLeft = totalWeight - 360
                pogObject.Young_Dragon_Leggings = pogObject.Young_Dragon_Leggings + 1;
                itemFound = entity.getName()
                break;
            case "§6Young Dragon Boots":
                weightLeft = totalWeight - 290
                pogObject.Young_Dragon_Boots = pogObject.Young_Dragon_Boots + 1;
                itemFound = entity.getName()
                break;
            case "§9Dragon Scale":
                weightLeft = totalWeight - 295
                pogObject.Dragon_Scale = pogObject.Dragon_Scale + 1;
                itemFound = entity.getName()
                break;
        }
        if(itemFound != null){
            dropsDetected.push(entity.getUUID())
        }
    })
    if(itemFound != null){
        if(itemFound != "§7[Lvl 1] §5Ender Dragon" && itemFound != "§7[Lvl 1] §6Ender Dragon"){
            pogObject.Since_Last_Pet += 1;
        }
        if(Settings.showTitle){
            Client.showTitle(itemFound, " ", 0, 40, 10)
            Client.showTitle(itemFound, " ", 0, 40, 10)
        }
        let frags = parseInt(weightLeft/22)
        let gotDraconic = (placed > 0 && lastDamage > 0);
        let profit = 0;
        profit -= placed * getPrice("Summoning_Eye")
        if(itemFound == "§7[Lvl 1] §5Ender Dragon" ){
            profit += getPrice("Epic_Ender_Dragon")
        }
        else if(itemFound == "§7[Lvl 1] §6Ender Dragon"){
            profit += getPrice("Legendary_Ender_Dragon")
        }
        else{
            profit += getPrice(itemFound.slice(2).replace(/ /g, "_"));
        }
        if(gotDraconic){
            profit += getPrice("Shard_Draconic")
        }
        profit += frags * getPrice(lastDragon.charAt(0).toUpperCase() + lastDragon.slice(1).toLowerCase() + "_Dragon_Fragment")
        if(Settings.showInChat){
            ChatLib.chat("&e---------------------------------")
            ChatLib.chat("&eTracked &c" + lastDragon.toLowerCase() + " &edragon")
            ChatLib.chat("&eEyes placed: &d" + placed)
            ChatLib.chat("&eWeight: &d" + totalWeight)
            ChatLib.chat("&eLoot: &d" + itemFound + " &e+ &d" + frags + " " + lastDragon.toLowerCase() + " &efrags" + (gotDraconic ? " &e+ &6Draconic" : ""))
            ChatLib.chat("&eProfit: " + (profit > 0 ? "&d+" + formatPrice(profit) : "&c-" + formatPrice(-profit)))
            if(itemFound == "§7[Lvl 1] §5Ender Dragon" || itemFound == "§7[Lvl 1] §6Ender Dragon"){
                ChatLib.chat("&eSince last pet: &d" + pogObject.Since_Last_Pet);
                pogObject.Since_Last_Pet = 0;
            }
            ChatLib.chat("&e---------------------------------")
        }
        if(Settings.announceAllDrops){
            ChatLib.command("pc " + itemFound.removeFormatting());
        }
        if(pogObject.Longest_Dry_Streak < pogObject.Since_Last_Pet){
            pogObject.Longest_Dry_Streak = pogObject.Since_Last_Pet
        }
        switch(lastDragon){
            case "SUPERIOR":
                pogObject.Superior_Dragon_Fragment = pogObject.Superior_Dragon_Fragment + frags;
                pogObject.Dragon_Essence = pogObject.Dragon_Essence + 10;
                if(Settings.announceSuperior && !Settings.announceAllDrops){
                    ChatLib.command("pc " + itemFound.removeFormatting());
                }
                pogObject.Since_Last_Sup = 0;
                pogObject.Superior_Dragons = pogObject.Superior_Dragons + 1;
                break;
            case "STRONG":
                pogObject.Strong_Dragon_Fragment = pogObject.Strong_Dragon_Fragment + frags;
                pogObject.Strong_Dragons = pogObject.Strong_Dragons +1;
                break;
            case "WISE":
                pogObject.Wise_Dragon_Fragment = pogObject.Wise_Dragon_Fragment + frags;
                pogObject.Wise_Dragons = pogObject.Wise_Dragons +1;
                break;
            case "UNSTABLE":
                pogObject.Unstable_Dragon_Fragment = pogObject.Unstable_Dragon_Fragment + frags;
                pogObject.Unstable_Dragons = pogObject.Unstable_Dragons +1;
                break;
            case "OLD":
                pogObject.Old_Dragon_Fragment = pogObject.Old_Dragon_Fragment + frags;
                pogObject.Old_Dragons = pogObject.Old_Dragons +1;
                break;
            case "PROTECTOR":
                pogObject.Protector_Dragon_Fragment = pogObject.Protector_Dragon_Fragment + frags;
                pogObject.Protector_Dragons = pogObject.Protector_Dragons +1;
                break;
            case "YOUNG":
                pogObject.Young_Dragon_Fragment = pogObject.Young_Dragon_Fragment + frags;
                pogObject.Young_Dragons = pogObject.Young_Dragons +1;
                break;
        }
    
        if(lastDragon != "SUPERIOR"){
            pogObject.Dragon_Essence = pogObject.Dragon_Essence + 5;
            pogObject.Since_Last_Sup = pogObject.Since_Last_Sup + 1;
            if(pogObject.Longest_Sup_Dry_Streak < pogObject.Since_Last_Sup){
                pogObject.Longest_Sup_Dry_Streak = pogObject.Since_Last_Sup
            }
        }

        if(placed > 0 && lastDamage > 0){
            pogObject.Shard_Draconic = pogObject.Shard_Draconic + 1;
        }
        pogObject.Runecrafting_exp = pogObject.Runecrafting_exp + runecraftingExp
        pogObject.Dragons_Summoned = pogObject.Dragons_Summoned + 1;
        pogObject.Eyes_Placed = pogObject.Eyes_Placed + placed;
        pogObject.Eyes_Placed_history.push(placed)
        pogObject.Weight_history.push(totalWeight)
        pogObject.Loot_History.push(itemFound)
        pogObject.Dragon_History.push(lastDragon)
        pogObject.Profit = pogObject.Profit + profit;
        pogObject.Profit_Drag_Count = pogObject.Profit_Drag_Count + 1;
        pogObject.Profit_Eyes_Count = pogObject.Profit_Eyes_Count + placed;
        pogObject.save()
        placed = 0;
        dragonDied = false
        ChatLib.say(Settings.afterLootMsg)
    }
}

register("worldLoad", () => {
    if(Settings.trackWithoutloot && dragonDied){
        if(Settings.showInChat){
            ChatLib.chat("&e---------------------------------")
            ChatLib.chat("&eTracked &c" + lastDragon.toLowerCase() + " &edragon")
            ChatLib.chat("&eEyes placed: &d" + placed)
            ChatLib.chat("&eWeight: &d" + totalWeight)
            ChatLib.chat("&eLoot: &4Not detected")
            ChatLib.chat("&e---------------------------------")
        }
        pogObject.Dragons_Summoned = pogObject.Dragons_Summoned + 1;
        pogObject.Eyes_Placed_history.push(placed)
        pogObject.Weight_history.push(totalWeight)
        pogObject.Loot_History.push("&4Not detected")
        pogObject.Dragon_History.push(lastDragon)
        pogObject.save()
    }

    placed = 0;
    dragonDied = false;
    topDamage = 0;
    lastDragon = "none"
    totalWeight = 0;
    dropsDetected = [];
})

lootTrackerObject = new Text(`&e&lDragon Tracker\nLoading...`, 50, 50)
function trackerDrawFunction() {
    if(!Settings.trackerEnabled || !Settings.showTracker){
        return
    }
    if(Settings.onlyInEnd && !checkEnd()){
        return
    }
    let scale = parseFloat(Settings.trackerScale) / 100
	lootTrackerObject
        .setX(Settings.xPosition)
		.setY(Settings.yPosition)
        .setScale(scale)
        .setShadow(true)
        .draw()
}

function updateLootTracker(){
    lootTrackerArray = []
    lootTrackerArray.push("&e&lDragon Tracker &cby negjo")
    if(Settings.showSummoned){
        lootTrackerArray.push("&eDragons Summoned: &d" + pogObject.Dragons_Summoned + "&e(&d" + pogObject.Profit_Drag_Count + "&e)")
    }
    if(Settings.showEyes){
        lootTrackerArray.push("&eTotal eyes: &d" + pogObject.Eyes_Placed + "&e(&d" + pogObject.Profit_Eyes_Count + "&e)" + " &eAverage: &d" + (pogObject.Eyes_Placed/pogObject.Dragons_Summoned).toFixed(2) + "&e(&d" + (pogObject.Profit_Eyes_Count/pogObject.Profit_Drag_Count).toFixed(2) + "&e)")
    }
    if(Settings.showSincePet){
        if(pogObject.Epic_Ender_Dragon == 0 && pogObject.Legendary_Ender_Dragon == 0){
            lootTrackerArray.push("&eSince last pet: &cnever")
        }
        else{
            lootTrackerArray.push("&eSince last pet: &d" + pogObject.Since_Last_Pet + " &eLongest: &d" + pogObject.Longest_Dry_Streak)
        }
    }
    if(Settings.showSinceSup){
        lootTrackerArray.push("&eSince last sup: &d" + pogObject.Since_Last_Sup + " &eLongest: &d" + pogObject.Longest_Sup_Dry_Streak)
    }
    if(Settings.showProfit){
        let profit = Settings.useCurrentPrices ? calculateProfit() : pogObject.Profit;
        lootTrackerArray.push("")
        lootTrackerArray.push("&eEstimated profit: &d" + formatPrice(profit))
        lootTrackerArray.push("&ePer Dragon: &d" + formatPrice(pogObject.Profit/pogObject.Profit_Drag_Count) + " &ePer Eye: &d" + formatPrice(pogObject.Profit/pogObject.Profit_Eyes_Count))
        lootTrackerArray.push("&eEV Per Dragon: &d" + formatPrice(calculateProfit()/pogObject.Dragons_Summoned) + " &ePer Eye: &d" + formatPrice(calculateProfit()/pogObject.Eyes_Placed))
        lootTrackerArray.push("&eSummoning Eyes: &d" + formatPrice(getPrice("Summoning_Eye")))
    }
    if(Settings.showPets){
        lootTrackerArray.push("")
        lootTrackerArray.push("&5Epic Ender Dragon: &e" + pogObject.Epic_Ender_Dragon + " &d- &e" + ((pogObject.Epic_Ender_Dragon/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d - &e" + formatPrice(getPrice("Epic_Ender_Dragon")))
        lootTrackerArray.push("&6Legendary Ender Dragon: &e" + pogObject.Legendary_Ender_Dragon + " &d- &e" + ((pogObject.Legendary_Ender_Dragon/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d - &e" + formatPrice(getPrice("Legendary_Ender_Dragon")))
    }
    lootTrackerArray.push("")
    if(Settings.showAotds){
        lootTrackerArray.push("&6Aspect of the Dragons: &e" + pogObject.Aspect_of_the_Dragon + " &d- &e" + ((pogObject.Aspect_of_the_Dragon/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Aspect_of_the_Dragon")))
    }
    if(Settings.showHorns){
        lootTrackerArray.push("&5Dragon Horn: &e" + pogObject.Dragon_Horn + " &d- &e" + ((pogObject.Dragon_Horn/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Dragon_Horn")))
    }
    if(Settings.showClaws){
        lootTrackerArray.push("&9Dragon Claw: &e" + pogObject.Dragon_Claw + " &d- &e" + ((pogObject.Dragon_Claw/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Dragon_Claw")))
    }
    if(Settings.showScales){
        lootTrackerArray.push("&9Dragon Scale: &e" + pogObject.Dragon_Scale + " &d- &e" + ((pogObject.Dragon_Scale/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Dragon_Scale")))
    }
    if(Settings.showSuperior){
        lootTrackerArray.push("&6Superior Dragon Helmet: &e" + pogObject.Superior_Dragon_Helmet + " &d- &e" + ((pogObject.Superior_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Superior_Dragon_Helmet")))
        lootTrackerArray.push("&6Superior Dragon Chestplate: &e" + pogObject.Superior_Dragon_Chestplate + " &d- &e" + ((pogObject.Superior_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Superior_Dragon_Chestplate")))
        lootTrackerArray.push("&6Superior Dragon Leggings: &e" + pogObject.Superior_Dragon_Leggings + " &d- &e" + ((pogObject.Superior_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Superior_Dragon_Leggings")))
        lootTrackerArray.push("&6Superior Dragon Boots: &e" + pogObject.Superior_Dragon_Boots + " &d- &e" + ((pogObject.Superior_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Superior_Dragon_Boots")))
    }
    if(Settings.showOthers){
        lootTrackerArray.push("&6Strong Dragon Helmet: &e" + pogObject.Strong_Dragon_Helmet + " &d- &e" + ((pogObject.Strong_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Strong_Dragon_Helmet")))
        lootTrackerArray.push("&6Strong Dragon Chestplate: &e" + pogObject.Strong_Dragon_Chestplate + " &d- &e" + ((pogObject.Strong_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Strong_Dragon_Chestplate")))
        lootTrackerArray.push("&6Strong Dragon Leggings: &e" + pogObject.Strong_Dragon_Leggings + " &d- &e" + ((pogObject.Strong_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Strong_Dragon_Leggings")))
        lootTrackerArray.push("&6Strong Dragon Boots: &e" + pogObject.Strong_Dragon_Boots + " &d- &e" + ((pogObject.Strong_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Strong_Dragon_Boots")))
        lootTrackerArray.push("&6Wise Dragon Helmet: &e" + pogObject.Wise_Dragon_Helmet + " &d- &e" + ((pogObject.Wise_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Wise_Dragon_Helmet")))
        lootTrackerArray.push("&6Wise Dragon Chestplate: &e" + pogObject.Wise_Dragon_Chestplate + " &d- &e" + ((pogObject.Wise_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Wise_Dragon_Chestplate")))
        lootTrackerArray.push("&6Wise Dragon Leggings: &e" + pogObject.Wise_Dragon_Leggings + " &d- &e" + ((pogObject.Wise_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Wise_Dragon_Leggings")))
        lootTrackerArray.push("&6Wise Dragon Boots: &e" + pogObject.Wise_Dragon_Boots + " &d- &e" + ((pogObject.Wise_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Wise_Dragon_Boots")))
        lootTrackerArray.push("&6Unstable Dragon Helmet: &e" + pogObject.Unstable_Dragon_Helmet + " &d- &e" + ((pogObject.Unstable_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Unstable_Dragon_Helmet")))
        lootTrackerArray.push("&6Unstable Dragon Chestplate: &e" + pogObject.Unstable_Dragon_Chestplate + " &d- &e" + ((pogObject.Unstable_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Unstable_Dragon_Chestplate")))
        lootTrackerArray.push("&6Unstable Dragon Leggings: &e" + pogObject.Unstable_Dragon_Leggings + " &d- &e" + ((pogObject.Unstable_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Unstable_Dragon_Leggings")))
        lootTrackerArray.push("&6Unstable Dragon Boots: &e" + pogObject.Unstable_Dragon_Boots + " &d- &e" + ((pogObject.Unstable_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Unstable_Dragon_Boots")))
        lootTrackerArray.push("&6Old Dragon Helmet: &e" + pogObject.Old_Dragon_Helmet + " &d- &e" + ((pogObject.Old_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Old_Dragon_Helmet")))
        lootTrackerArray.push("&6Old Dragon Chestplate: &e" + pogObject.Old_Dragon_Chestplate + " &d- &e" + ((pogObject.Old_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Old_Dragon_Chestplate")))
        lootTrackerArray.push("&6Old Dragon Leggings: &e" + pogObject.Old_Dragon_Leggings + " &d- &e" + ((pogObject.Old_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Old_Dragon_Leggings")))
        lootTrackerArray.push("&6Old Dragon Boots: &e" + pogObject.Old_Dragon_Boots + " &d- &e" + ((pogObject.Old_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Old_Dragon_Boots")))
        lootTrackerArray.push("&6Protector Dragon Helmet: &e" + pogObject.Protector_Dragon_Helmet + " &d- &e" + ((pogObject.Protector_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Protector_Dragon_Helmet")))
        lootTrackerArray.push("&6Protector Dragon Chestplate: &e" + pogObject.Protector_Dragon_Chestplate + " &d- &e" + ((pogObject.Protector_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Protector_Dragon_Chestplate")))
        lootTrackerArray.push("&6Protector Dragon Leggings: &e" + pogObject.Protector_Dragon_Leggings + " &d- &e" + ((pogObject.Protector_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Protector_Dragon_Leggings")))
        lootTrackerArray.push("&6Protector Dragon Boots: &e" + pogObject.Protector_Dragon_Boots + " &d- &e" + ((pogObject.Protector_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Protector_Dragon_Boots")))
        lootTrackerArray.push("&6Young Dragon Helmet: &e" + pogObject.Young_Dragon_Helmet + " &d- &e" + ((pogObject.Young_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Young_Dragon_Helmet")))
        lootTrackerArray.push("&6Young Dragon Chestplate: &e" + pogObject.Young_Dragon_Chestplate + " &d- &e" + ((pogObject.Young_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Young_Dragon_Chestplate")))
        lootTrackerArray.push("&6Young Dragon Leggings: &e" + pogObject.Young_Dragon_Leggings + " &d- &e" + ((pogObject.Young_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Young_Dragon_Leggings")))
        lootTrackerArray.push("&6Young Dragon Boots: &e" + pogObject.Young_Dragon_Boots + " &d- &e" + ((pogObject.Young_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%" + " &d- &e" + formatPrice(getPrice("Young_Dragon_Boots")))
    }
    if(Settings.showFrags){
        lootTrackerArray.push("&5Superior Dragon Fragments: &e" + pogObject.Superior_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Superior_Dragon_Fragment")))
        lootTrackerArray.push("&5Strong Dragon Fragments: &e" + pogObject.Strong_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Strong_Dragon_Fragment")))
        lootTrackerArray.push("&5Wise Dragon Fragments: &e" + pogObject.Wise_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Wise_Dragon_Fragment")))
        lootTrackerArray.push("&5Unstable Dragon Fragments: &e" + pogObject.Unstable_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Unstable_Dragon_Fragment")))
        lootTrackerArray.push("&5Old Dragon Fragments: &e" + pogObject.Old_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Old_Dragon_Fragment")))
        lootTrackerArray.push("&5Protector Dragon Fragments: &e" + pogObject.Protector_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Protector_Dragon_Fragment")))
        lootTrackerArray.push("&5Young Dragon Fragments: &e" + pogObject.Young_Dragon_Fragment + " &d- &e" + formatPrice(getPrice("Young_Dragon_Fragment")))
    }
    if(Settings.showDraconics){
        lootTrackerArray.push("&6Draconic Shard: &e" + pogObject.Shard_Draconic + " &d- &e" + formatPrice(getPrice("Shard_Draconic")))
    }
    if(Settings.showEssence){
        lootTrackerArray.push("&dDragon Essence: &e" + pogObject.Dragon_Essence + " &d- &e" + formatPrice(getPrice("Dragon_Essence")))
    }
    if(Settings.showRunecrafting){
        lootTrackerArray.push("&5Runecrafting exp: &e" + pogObject.Runecrafting_exp)
    }
    if(Settings.showHistory && pogObject.Dragons_Summoned >= 3){
        lootTrackerArray.push("")
        for(let i = 1; i <= 3; i++){
            let drag = pogObject.Dragon_History[pogObject.Dragon_History.length - i].toLowerCase()
            let eyes = pogObject.Eyes_Placed_history[pogObject.Eyes_Placed_history.length - i]
            let loot = pogObject.Loot_History[pogObject.Loot_History.length - i];
            let lootString = loot.slice(2).replace(/ /g, "_");
            let profit = getPrice(lootString) - eyes * getPrice("Summoning_Eye")
            if (profit < 0) {
                lootTrackerArray.push("&6" + drag + " &e" + eyes + " eyes &e" + loot + " &c-" + formatPrice(-profit))
            }
            else {
                lootTrackerArray.push("&6" + drag + " &e" + eyes + " eyes &e" + loot + " &d+" + formatPrice(profit))
            }
        }
    }
    if(Settings.showTypes){
        lootTrackerArray.push("")
        lootTrackerArray.push("&e" + pogObject.Superior_Dragons + "(" + ((pogObject.Superior_Dragons/pogObject.Dragons_Summoned)*100).toFixed(2)+"%)")
        lootTrackerArray.push("&c" + pogObject.Strong_Dragons + "(" + ((pogObject.Strong_Dragons/pogObject.Dragons_Summoned)*100).toFixed(1) + "%) &b" + 
            pogObject.Wise_Dragons + "(" + ((pogObject.Wise_Dragons/pogObject.Dragons_Summoned)*100).toFixed(1) + "%) &5" + 
            pogObject.Unstable_Dragons + "(" + ((pogObject.Unstable_Dragons/pogObject.Dragons_Summoned)*100).toFixed(1) + "%)")
        lootTrackerArray.push("&6" + pogObject.Old_Dragons + "(" + ((pogObject.Old_Dragons/pogObject.Dragons_Summoned)*100).toFixed(1) + "%) &7" + 
            pogObject.Protector_Dragons + "(" + ((pogObject.Protector_Dragons/pogObject.Dragons_Summoned)*100).toFixed(1) + "%) &f" + 
            pogObject.Young_Dragons + "(" + ((pogObject.Young_Dragons/pogObject.Dragons_Summoned)*100).toFixed(1) + "%)")
    }

    lootTrackerObject.setString(lootTrackerArray.join("\n"));
}

function calculateProfit(){
    let profit = 0;
    for(item in bzPrices){
        if(item == "Summoning_Eye"){
            profit -= pogObject.Eyes_Placed * getPrice(item)
        }
        else{
            profit += pogObject[item] * getPrice(item)
        }
    }
    for(item in ahPrices){
        profit += getPrice(item) * pogObject[item];
    }
    return profit
}

register("step", () => {
	scanForLoot()
    updateLootTracker()
}).setFps(20)

register("renderOverlay", () => {
	trackerDrawFunction()
})

register("command", (...args) => {
	Settings.openGUI()
}).setName("dragontracker", true)

register("command", (...args) => {
	Settings.openGUI()
}).setName("dt", false)

register("gameLoad", () => {
    updatePrices()
})

register("step", () => {
    updatePrices()
}).setDelay(900)

register("command", (...args) => {
    ChatLib.chat("&c[Dragon Tracker] &eUpdating prices...")
	updatePrices()
}).setName("dtupdate", false)

register("gameLoad", () => {
    if(pogObject.Last_Version != "1.1.0"){
        ChatLib.chat("&c[Dragon Tracker] &eThe dragon tracker has been updated to version 1.1.0!")
        ChatLib.chat("&eChange log:")
        ChatLib.chat("&e - Added support for Draconic shards")
        ChatLib.chat("&e - Added profit calculations")
        ChatLib.chat("&e - Fixed crashes when searching in the config")
        ChatLib.chat("&e - A bunch of other small fixes")
        ChatLib.chat("&e Check out github or ct website for complete change log")
        ChatLib.chat("&e Check out &c/dt &eto set the prices that should be used for profit calculations and some other new settings")
        ChatLib.chat("&e Check out &c/dthelp &eto see all commands")
        pogObject.Last_Version = "1.1.0"
        pogObject.save()
    }
})

register("command", (...args) => {
    print("test")
    pogObject.Profit = pogObject.Profit + getPrice("Dragon_Horn")
    pogObject.save()
}).setName("dttest", false)

backup = pogObject

register("command", (...args) => {
    print("test")
    backup = pogObject
}).setName("dtbackup", false)

register("command", (...args) => {
    print("test")
    pogObject = backup
    pogObject.save()
}).setName("dtrollback", false)