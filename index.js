import PogObject from "PogData";
import Settings from "./config.js"
import request from "requestv2";

const LBIN = 0;
const AVERAGE = 1;
const BUYORDER = 0;
const INSTABUY = 2;
const SELLORDER = 0;
const INSTASELL = 2;
const MIDPRICE = 1;

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
  });

pogObject.save()


ahPrices = {
    Epic_Ender_Dragon: {},
    Legendary_Ender_Dragon: {},
    Aspect_of_the_Dragon: {},
    Superior_Dragon_Helmet: {},
    Superior_Dragon_Chestplate: {},
    Superior_Dragon_Leggings: {},
    Superior_Dragon_Boots: {},
    Strong_Dragon_Helmet: {},
    Strong_Dragon_Chestplate: {},
    Strong_Dragon_Leggings: {},
    Strong_Dragon_Boots: {},
    Wise_Dragon_Helmet: {},
    Wise_Dragon_Chestplate: {},
    Wise_Dragon_Leggings: {},
    Wise_Dragon_Boots: {},
    Unstable_Dragon_Helmet: {},
    Unstable_Dragon_Chestplate: {},
    Unstable_Dragon_Leggings: {},
    Unstable_Dragon_Boots: {},
    Old_Dragon_Helmet: {},
    Old_Dragon_Chestplate: {},
    Old_Dragon_Leggings: {},
    Old_Dragon_Boots: {},
    Protector_Dragon_Helmet: {},
    Protector_Dragon_Chestplate: {},
    Protector_Dragon_Leggings: {},
    Protector_Dragon_Boots: {},
    Young_Dragon_Helmet: {},
    Young_Dragon_Chestplate: {},
    Young_Dragon_Leggings: {},
    Young_Dragon_Boots: {},
}

bzPrices = {
    Summoning_Eye: {},
    Dragon_Claw: {},
    Dragon_Horn: {},
    Dragon_Scale: {},
    Superior_Dragon_Fragment: {},
    Strong_Dragon_Fragment: {},
    Wise_Dragon_Fragment: {},
    Unstable_Dragon_Fragment: {},
    Old_Dragon_Fragment: {},
    Protector_Dragon_Fragment: {},
    Young_Dragon_Fragment: {},
    Dragon_Essence: {},
    Ritual_Residue: {},
}

placed = 0;
dragonDied = false;
topDamage = 0;
lastDragon = "none"
totalWeight = 0;
runecraftingExp = 0;
dropsDetected = [];
profit = 0;

function removeCommas(value){
    return value.replace(/,/g, '');
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
}).setCriteria("SACRIFICE! You turned ${item} into ${essence} Dragon Essence!").setContains();

register("chat", (count, event) => {
    if(!Settings.trackerEnabled){
        return
    }
    placed += 1
}).setCriteria("☬ You placed a Summoning Eye!").setContains();

register("chat", (message, event) => {
    if(!Settings.trackerEnabled){
        return
    }
    placed -= 1
}).setCriteria("You recovered a Summoning Eye!").setContains();

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
}).setCriteria("The ${dragon} Dragon has spawned!").setContains();

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

register("chat", (damage, position) =>  {
    if(!Settings.trackerEnabled){
        return
    }
    if(!dragonDied){
        return
    }
    let myDamage = removeCommas(damage)

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
    totalWeight = damageWeight + positionWeight + eyesWeight
}).setCriteria("Your Damage: ${damage} (Position #${position})").setContains()

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
                ChatLib.chat("&eSince last pet: &d" + pogObject.Since_Last_Pet);
                pogObject.Since_Last_Pet = 0;
                if(Settings.announcePet){
                    ChatLib.command("pc " + Settings.epicPetMsg)
                }
                itemFound = entity.getName()
                break;
            case "§7[Lvl 1] §6Ender Dragon":
                weightLeft = totalWeight - 450
                pogObject.Legendary_Ender_Dragon = pogObject.Legendary_Ender_Dragon + 1;
                ChatLib.chat("&eSince last pet: &d" + pogObject.Since_Last_Pet);
                pogObject.Since_Last_Pet = 0;
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
        if(Settings.showInChat){
            ChatLib.chat("&e---------------------------------")
            ChatLib.chat("&eTracked &c" + lastDragon.toLowerCase() + " &edragon")
            ChatLib.chat("&eEyes placed: &d" + placed)
            ChatLib.chat("&eWeight: &d" + totalWeight)
            ChatLib.chat("&eLoot: &d" + itemFound + " &e+ &d" + frags + " " + lastDragon.toLowerCase() + " &efragments")
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

        pogObject.Runecrafting_exp = pogObject.Runecrafting_exp + runecraftingExp
        pogObject.Dragons_Summoned = pogObject.Dragons_Summoned + 1;
        pogObject.Eyes_Placed = pogObject.Eyes_Placed + placed;
        pogObject.Eyes_Placed_history.push(placed)
        pogObject.Weight_history.push(totalWeight)
        pogObject.Loot_History.push(itemFound)
        pogObject.Dragon_History.push(lastDragon)
        pogObject.save()
        placed = 0;
        dragonDied = false
        ChatLib.command("warp top")
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
        lootTrackerArray.push("&eDragons Summoned: &d" + pogObject.Dragons_Summoned)
    }
    if(Settings.showEyes){
        lootTrackerArray.push("&eTotal eyes: &d" + pogObject.Eyes_Placed + " &eAverage: &d" + (pogObject.Eyes_Placed/pogObject.Dragons_Summoned).toFixed(2))
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
        calculateProfit()
        lootTrackerArray.push("")
        lootTrackerArray.push("&eEstimated profit: &d" + addCommas(Math.floor(profit)))
        lootTrackerArray.push("&ePer Dragon: &d" + addCommas(Math.floor(profit/pogObject.Dragons_Summoned)) + " &ePer Eye: &d" + addCommas(Math.floor(profit/pogObject.Eyes_Placed)))
    }
    if(Settings.showPets){
        lootTrackerArray.push("")
        lootTrackerArray.push("&5Epic Ender Dragon: &e" + pogObject.Epic_Ender_Dragon + " &d- &e" + ((pogObject.Epic_Ender_Dragon/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Legendary Ender Dragon: &e" + pogObject.Legendary_Ender_Dragon + " &d- &e" + ((pogObject.Legendary_Ender_Dragon/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    lootTrackerArray.push("")
    if(Settings.showAotds){
        lootTrackerArray.push("&6Aspect of the Dragons: &e" + pogObject.Aspect_of_the_Dragon + " &d- &e" + ((pogObject.Aspect_of_the_Dragon/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    if(Settings.showHorns){
        lootTrackerArray.push("&5Dragon Horn: &e" + pogObject.Dragon_Horn + " &d- &e" + ((pogObject.Dragon_Horn/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    if(Settings.showClaws){
        lootTrackerArray.push("&9Dragon Claw: &e" + pogObject.Dragon_Claw + " &d- &e" + ((pogObject.Dragon_Claw/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    if(Settings.showScales){
        lootTrackerArray.push("&9Dragon Scale: &e" + pogObject.Dragon_Scale + " &d- &e" + ((pogObject.Dragon_Scale/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    if(Settings.showSuperior){
        lootTrackerArray.push("&6Superior Dragon Helmet: &e" + pogObject.Superior_Dragon_Helmet + " &d- &e" + ((pogObject.Superior_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Superior Dragon Chestplate: &e" + pogObject.Superior_Dragon_Chestplate + " &d- &e" + ((pogObject.Superior_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Superior Dragon Leggings: &e" + pogObject.Superior_Dragon_Leggings + " &d- &e" + ((pogObject.Superior_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Superior Dragon Boots: &e" + pogObject.Superior_Dragon_Boots + " &d- &e" + ((pogObject.Superior_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    if(Settings.showOthers){
        lootTrackerArray.push("&6Strong Dragon Helmet: &e" + pogObject.Strong_Dragon_Helmet + " &d- &e" + ((pogObject.Strong_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Strong Dragon Chestplate: &e" + pogObject.Strong_Dragon_Chestplate + " &d- &e" + ((pogObject.Strong_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Strong Dragon Leggings: &e" + pogObject.Strong_Dragon_Leggings + " &d- &e" + ((pogObject.Strong_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Strong Dragon Boots: &e" + pogObject.Strong_Dragon_Boots + " &d- &e" + ((pogObject.Strong_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Wise Dragon Helmet: &e" + pogObject.Wise_Dragon_Helmet + " &d- &e" + ((pogObject.Wise_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Wise Dragon Chestplate: &e" + pogObject.Wise_Dragon_Chestplate + " &d- &e" + ((pogObject.Wise_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Wise Dragon Leggings: &e" + pogObject.Wise_Dragon_Leggings + " &d- &e" + ((pogObject.Wise_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Wise Dragon Boots: &e" + pogObject.Wise_Dragon_Boots + " &d- &e" + ((pogObject.Wise_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Unstable Dragon Helmet: &e" + pogObject.Unstable_Dragon_Helmet + " &d- &e" + ((pogObject.Unstable_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Unstable Dragon Chestplate: &e" + pogObject.Unstable_Dragon_Chestplate + " &d- &e" + ((pogObject.Unstable_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Unstable Dragon Leggings: &e" + pogObject.Unstable_Dragon_Leggings + " &d- &e" + ((pogObject.Unstable_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Unstable Dragon Boots: &e" + pogObject.Unstable_Dragon_Boots + " &d- &e" + ((pogObject.Unstable_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Old Dragon Helmet: &e" + pogObject.Old_Dragon_Helmet + " &d- &e" + ((pogObject.Old_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Old Dragon Chestplate: &e" + pogObject.Old_Dragon_Chestplate + " &d- &e" + ((pogObject.Old_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Old Dragon Leggings: &e" + pogObject.Old_Dragon_Leggings + " &d- &e" + ((pogObject.Old_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Old Dragon Boots: &e" + pogObject.Old_Dragon_Boots + " &d- &e" + ((pogObject.Old_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Protector Dragon Helmet: &e" + pogObject.Protector_Dragon_Helmet + " &d- &e" + ((pogObject.Protector_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Protector Dragon Chestplate: &e" + pogObject.Protector_Dragon_Chestplate + " &d- &e" + ((pogObject.Protector_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Protector Dragon Leggings: &e" + pogObject.Protector_Dragon_Leggings + " &d- &e" + ((pogObject.Protector_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Protector Dragon Boots: &e" + pogObject.Protector_Dragon_Boots + " &d- &e" + ((pogObject.Protector_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Young Dragon Helmet: &e" + pogObject.Young_Dragon_Helmet + " &d- &e" + ((pogObject.Young_Dragon_Helmet/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Young Dragon Chestplate: &e" + pogObject.Young_Dragon_Chestplate + " &d- &e" + ((pogObject.Young_Dragon_Chestplate/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Young Dragon Leggings: &e" + pogObject.Young_Dragon_Leggings + " &d- &e" + ((pogObject.Young_Dragon_Leggings/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
        lootTrackerArray.push("&6Young Dragon Boots: &e" + pogObject.Young_Dragon_Boots + " &d- &e" + ((pogObject.Young_Dragon_Boots/pogObject.Dragons_Summoned)*100).toFixed(2) + "%")
    }
    if(Settings.showFrags){
        lootTrackerArray.push("&5Superior Dragon Fragments: &e" + pogObject.Superior_Dragon_Fragment)
        lootTrackerArray.push("&5Strong Dragon Fragments: &e" + pogObject.Strong_Dragon_Fragment)
        lootTrackerArray.push("&5Wise Dragon Fragments: &e" + pogObject.Wise_Dragon_Fragment)
        lootTrackerArray.push("&5Unstable Dragon Fragments: &e" + pogObject.Unstable_Dragon_Fragment)
        lootTrackerArray.push("&5Old Dragon Fragments: &e" + pogObject.Old_Dragon_Fragment)
        lootTrackerArray.push("&5Protector Dragon Fragments: &e" + pogObject.Protector_Dragon_Fragment)
        lootTrackerArray.push("&5Young Dragon Fragments: &e" + pogObject.Young_Dragon_Fragment)
    }
    if(Settings.showEssence){
        lootTrackerArray.push("&dDragon Essence: &e" + pogObject.Dragon_Essence)
    }
    if(Settings.showRunecrafting){
        lootTrackerArray.push("&5Runecrafting exp: &e" + pogObject.Runecrafting_exp)
    }
    if(Settings.showHistory && pogObject.Dragons_Summoned >= 3){
        lootTrackerArray.push("")
        lootTrackerArray.push("&6" + pogObject.Dragon_History[pogObject.Dragon_History.length - 1].toLowerCase() + "  &e" + pogObject.Eyes_Placed_history[pogObject.Eyes_Placed_history.length - 1] + " eyes  &e" + pogObject.Loot_History[pogObject.Loot_History.length - 1])
        lootTrackerArray.push("&6" + pogObject.Dragon_History[pogObject.Dragon_History.length - 2].toLowerCase() + "  &e" + pogObject.Eyes_Placed_history[pogObject.Eyes_Placed_history.length - 2] + " eyes  &e" + pogObject.Loot_History[pogObject.Loot_History.length - 2])
        lootTrackerArray.push("&6" + pogObject.Dragon_History[pogObject.Dragon_History.length - 3].toLowerCase() + "  &e" + pogObject.Eyes_Placed_history[pogObject.Eyes_Placed_history.length - 3] + " eyes  &e" + pogObject.Loot_History[pogObject.Loot_History.length - 3])    
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

function updatePrices(){
    print("Updating")    
    for(item in ahPrices){
        updateAhAvgPrice(item, 0)
        updateAhLbinPrice(item, 0)
    }
    for(item in bzPrices){
        updateBzPrice(item, 0)
    }
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
        avgUrl = "https://sky.coflnet.com/api/item/price/" + item.toUpperCase() + "?NoOtherValuableEnchants=true"
    }
    request({
        url: avgUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        json: true,
    })
        .then(function(response) {
            print("Success " + item)
            ahPrices[item].avg = response.mean;
        })
        .catch(function(err) {
            print("retrying " + item)
            if(retryCnt < 5){
                setTimeout(() => {
                    updateAhAvgPrice(item, retryCnt + 1)
                }, 10000);
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
        lbinUrl = "https://sky.coflnet.com/api/item/price/" + item.toUpperCase() + "/bin?NoOtherValuableEnchants=true&Bin=true"
    }
    request({
        url: lbinUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        json: true,
    })
        .then(function(response) {
            print("Success " + item)
            ahPrices[item].lbin = response.lowest
        })
        .catch(function(err) {
            print("retrying " + item)
            if(retryCnt < 5){
                setTimeout(() => {
                    updateAhLbinPrice(item, retryCnt + 1)
                }, 10000);
            }
        }
    );
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
            print("Success " + item)
            bzPrices[item].instaBuy = response.buy;
            bzPrices[item].instaSell = response.sell;
            bzPrices[item].midPrice = (response.buy + response.sell)/2
        })
        .catch(function(err) {
            print("retrying " + item)
            if(retryCnt < 5){
                setTimeout(() => {
                    updateBzPrice(item, retryCnt + 1)
                }, 10000);
            }
        }
    );
}


function calculateProfit(){
    profit = 0;
    for(item in bzPrices){
        if(item == "Summoning_Eye"){
            if(Settings.eyePricing == INSTABUY){
                profit -= pogObject.Eyes_Placed * bzPrices[item].instaBuy
            }
            else if(Settings.eyePricing == MIDPRICE){
                profit -= pogObject.Eyes_Placed * bzPrices[item].midPrice
            }
            else if(Settings.eyePricing == BUYORDER){
                profit -= pogObject.Eyes_Placed * bzPrices[item].instaSell
            }
        }
        else if(item == "Dragon_Horn"){
            calculateBzItemProfit(item, Settings.hornPricing)
        }
        else if(item == "Dragon_Essence"){
            calculateBzItemProfit(item, Settings.essencePricing)
        }
        else if(item == "Ritual_Residue"){
        }
        else if(item.includes("Fragment")){
            calculateBzItemProfit(item, Settings.fragPricing)
        }
        else{
            calculateBzItemProfit(item, Settings.otherPricing)
        }
    }
    for(item in ahPrices){
        if(item == "Aspect_of_the_Dragon"){
            calculateAhItemProfit(item, Settings.ahPricing, Settings.sacAotds)
        }
        else if(item.includes("Ender_Dragon")){
            calculateAhItemProfit(item, Settings.ahPricing, false)
        }
        else if(item.includes("Superior")){
            calculateAhItemProfit(item, Settings.ahPricing, Settings.sacSups)
        }
        else{
            calculateAhItemProfit(item, Settings.ahPricing, Settings.sacOthers)
        }
    }
}

function calculateAhItemProfit(item, priceSetting, sacSetting){
    if(sacSetting == true){
        let a = sacrificeCalc(item)

        //print(item + ": " + a)
        profit += pogObject[item] * a
    }
    else if(priceSetting == LBIN){
        profit += pogObject[item] * ahPrices[item].lbin
    }
    else if(priceSetting == AVERAGE){
        profit += pogObject[item] * ahPrices[item].avg
    }
}

function calculateBzItemProfit(item, setting){
    if(setting == INSTASELL){
        profit += pogObject[item] * bzPrices[item].instaSell;
    }
    else if(setting == MIDPRICE){
        profit += pogObject[item] * bzPrices[item].midPrice;
    }
    else if(setting == SELLORDER){
        profit += pogObject[item] * bzPrices[item].instaBuy;
    }
}

register("gameLoad", () => {
    updatePrices()
})

register("step", () => {
    updatePrices()
}).setDelay(900)

register("command", (...args) => {
	updatePrices()
}).setName("dtupdate", false)


function sacrificeCalc(item){
    let eyePrice = 0;
    if(Settings.eyePricing == INSTABUY){
        eyePrice = bzPrices.Summoning_Eye.instaBuy
    }
    else if(Settings.eyePricing == BUYORDER){
        eyePrice = bzPrices.Summoning_Eye.instaSell
    }
    else if(Settings.eyePricing == MIDPRICE){
        eyePrice = bzPrices.Summoning_Eye.instaSell
    }
    let essencePrice = getBzItemPrice(bzPrices.Dragon_Essence, Settings.essencePricing)
    let hornPrice = getBzItemPrice(bzPrices.Dragon_Horn, Settings.hornPricing)
    let clawPrice = getBzItemPrice(bzPrices.Dragon_Claw, Settings.otherPricing)
    let residuePrice = getBzItemPrice(bzPrices.Ritual_Residue, Settings.residuePricing)
    let supFragsPrice = getBzItemPrice(bzPrices.Superior_Dragon_Fragment, Settings.fragPricing)
    let strongFragsPrice = getBzItemPrice(bzPrices.Strong_Dragon_Fragment, Settings.fragPricing)
    let wiseFragsPrice = getBzItemPrice(bzPrices.Wise_Dragon_Fragment, Settings.fragPricing)
    let unstFragsPrice = getBzItemPrice(bzPrices.Unstable_Dragon_Fragment, Settings.fragPricing)
    let oldFragsPrice = getBzItemPrice(bzPrices.Old_Dragon_Fragment, Settings.fragPricing)
    let protFragsPrice = getBzItemPrice(bzPrices.Protector_Dragon_Fragment, Settings.fragPricing)
    let youngFragsPrice = getBzItemPrice(bzPrices.Young_Dragon_Fragment, Settings.fragPricing)

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


function getBzItemPrice(itemObject, setting){
    if(setting == INSTASELL){
        return itemObject.instaSell
    }
    else if(setting == SELLORDER){
        return itemObject.instaBuy
    }
    else if(setting == MIDPRICE){
        return itemObject.midPrice
    }
}