import { @Vigilant, @SwitchProperty, @SliderProperty, @PercentSliderProperty, @ButtonProperty, @SelectorProperty, @ColorProperty, @TextProperty, Color } from "../Vigilance/index.js";

@Vigilant("DragonTracker", "§e§lDragon Tracker by negjo", {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General', 'Display', 'Chat', 'Tracker', "Profit", 'Misc'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
})
class Settings {
    //General
    @SwitchProperty({
        name: "Dragon tracker",
        description: "Main toggle to the entire module.",
        category: "General",
        placeholder: "Enable"
    })
    trackerEnabled = true;

    @SwitchProperty({
        name: "Only show in The End",
        description: "Only show the tracker when you are in The End.",
        category: "General",
        placeholder: "Enable"
    })
    onlyInEnd = true;

    @SwitchProperty({
        name: "Only track your dragons",
        description: "Only track dragons when you placed summoning eyes. This actually affects what data gets stored, and does not work retroactively.",
        category: "General",
        placeholder: "Enable"
    })
    onlyYourDrags = true;

    @SwitchProperty({
        name: "Show title",
        description: "Show title with the loot you got.",
        category: "General",
        placeholder: "Enable"
    })
    showTitle = true;

    @SwitchProperty({
        name: "Track without loot",
        description: "Track dragons even if the mod couldn't recognize the dropped item. This can be useful if you are too lazy to go near the dragon loot, but a lot of the statistics will become meaningless. NOT RECOMMENDED",
        category: "General",
        placeholder: "Disable"
    })
    trackWithoutloot = false;

    //Display

    @SwitchProperty({
        name: "Show tracker",
        description: "Whether to display the tracker. If this is off and the main toggle is on, it will still track dragons, but not show you.",
        category: "Display",
        placeholder: "Enable"
    })
    showTracker = true;

    @SliderProperty({
        name: "Tracker X position",
        description: "Where the tracker should be on the X axis. 0 is at the far left and the higher the number the further right it will be. Kinda scuffed, but idk how to make it better.",
        min: 0,
        max: 960,
        category: "Display",
        placeholder: 10
    })
    xPosition = 10;

    @SliderProperty({
        name: "Tracker Y position",
        description: "Where the tracker should be on the Y axis. 0 is at the very top and the higher the number the further down it will be. Kinda scuffed, but idk how to make it better.",
        min: 0,
        max: 540,
        category: "Display",
        placeholder: 10
    })
    yPosition = 10;

    @SliderProperty({
        name: "Tracker scale",
        description: "How big the tracker should be.",
        min: 0,
        max: 200,
        category: "Display",
    })
    trackerScale = 100;

    //Tracker - General
    @SwitchProperty({
        name: "Show summoned",
        description: "Show total amount of dragons summoned.",
        category: "Tracker",
        subcategory: "General",
        placeholder: "Enable"
    })
    showSummoned = true;

    @SwitchProperty({
        name: "Show eyes",
        description: "Show total amount of eyes placed and average per dragon.",
        category: "Tracker",
        subcategory: "General",
        placeholder: "Enable"
    })
    showEyes = true;

    @SwitchProperty({
        name: "Show profit",
        description: "Show estimated profit in the tracker.",
        category: "Tracker",
        subcategory: "General",
        placeholder: "Enable"
    })
    showProfit = true;

    @SwitchProperty({
        name: "Since last pet",
        description: "Show how many dragons you did since your last pet.",
        category: "Tracker",
        subcategory: "General",
        placeholder: "Enable"
    })
    showSincePet = true;

    @SwitchProperty({
        name: "Since last superior",
        description: "Show how many dragons you did since your last superior dragon.",
        category: "Tracker",
        subcategory: "General",
        placeholder: "Enable"
    })
    showSinceSup = true;

    //Tracker - Loot
    @SwitchProperty({
        name: "Show pets",
        description: "Show pets dropped in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showPets = true;

    @SwitchProperty({
        name: "Show superior pieces",
        description: "Show superior pieces in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showSuperior = true;

    @SwitchProperty({
        name: "Show other dragon pieces",
        description: "Show other dragon pieces in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Disable"
    })
    showOthers = false;

    @SwitchProperty({
        name: "Show Fragments",
        description: "Show fragments in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showFrags = true;

    @SwitchProperty({
        name: "Show Aotds",
        description: "Show aotds in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showAotds = true;

    @SwitchProperty({
        name: "Show Horns",
        description: "Show dragon horns in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showHorns = true;

    @SwitchProperty({
        name: "Show Claws",
        description: "Show dragon claws in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showClaws = true;

    @SwitchProperty({
        name: "Show Scales",
        description: "Show dragon scales in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showScales = true;

    @SwitchProperty({
        name: "Show Draconics",
        description: "Show draconic attribute shards in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showDraconics = true;

    @SwitchProperty({
        name: "Show runecrafting xp",
        description: "Show runecrafting xp in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showRunecrafting = true;

    @SwitchProperty({
        name: "Show dragon essence",
        description: "Show dragon essence in the tracker.",
        category: "Tracker",
        subcategory: "Loot",
        placeholder: "Enable"
    })
    showEssence = true;

    //Tracker - Extra
    @SwitchProperty({
        name: "Show history",
        description: "Show history of last 3 dragons.",
        category: "Tracker",
        subcategory: "Extra",
        placeholder: "Enable"
    })
    showHistory = true;

    @SwitchProperty({
        name: "Show types",
        description: "Show statistics about summoned dragon types.",
        category: "Tracker",
        subcategory: "Extra",
        placeholder: "Disable"
    })
    showTypes = false;

    //Chat
    @SwitchProperty({
        name: "Show info",
        description: "Show info about tracked dragons in chat. Includes dragon type, eyes placed, weight, and the loot.",
        category: "Chat",
        placeholder: "Enable"
    })
    showInChat = true;

    @SwitchProperty({
        name: "Announce pet",
        description: "Announce when you get a pet in party chat.",
        category: "Chat",
        placeholder: "Enable"
    })
    announcePet = true;
    
    @TextProperty({
        name: "Epic pet message",
        description: "Message to send on epic pet drop.",
        category: "Chat",
        placeholder: "Epic pet!"
    })
    epicPetMsg = "Epic pet!";

    @TextProperty({
        name: "Legendary pet message",
        description: "Message to send on legendary pet drop.",
        category: "Chat",
        placeholder: "Leg pet!"
    })
    legPetMsg = "Leg pet!";

    @SwitchProperty({
        name: "Announce superior drop",
        description: "Announce what drop you got from superior dragon in party chat",
        category: "Chat",
        placeholder: "Enable"
    })
    announceSuperior = true;

    @SwitchProperty({
        name: "Announce all drops",
        description: "Announce all the drops you get in party chat.",
        category: "Chat",
        placeholder: "Disable"
    })
    announceAllDrops = false;

    @SwitchProperty({
        name: "Black Cat warning",
        description: "Show warning if you summon a dragon without black cat pet equipped. You must have pet tab widget enabled for this to work. Doesn't really work with pet rules since the tablist takes forever to update.",
        category: "Misc",
        placeholder: "Disable"
    })
    blackCatWarning = false;

    @SwitchProperty({
        name: "Endermite warning",
        description: "Show warning if you sacrifice an item without endermite pet equipped. You must have pet tab widget enabled for this to work properly.",
        category: "Misc",
        placeholder: "Disable"
    })
    endermiteWarning = false;

    @TextProperty({
        name: "Message after loot",
        description: "Message to send after dragon loot is detected. Can be used for teleporting out of end.",
        category: "Misc",
        placeholder: ""
    })
    afterLootMsg = "";

    //Profit
    @SwitchProperty({
        name: "Track profit",
        description: "Track profit from drags .",
        category: "Profit",
        placeholder: "Enable"
    })
    trackProfit = true;

    @SwitchProperty({
        name: "Use EV to calculate profit",
        description: "Use current expected value to calculate profit instead of the prices recorded at the time of the dragon. This works retroactively, but is a lot less accurate.",
        category: "Profit",
        placeholder: "Disable"
    })
    useCurrentPrices = false; 

    @SwitchProperty({
        name: "Shorter values",
        description: "Shorten values by using k,m and b instead of writing the whole value.",
        category: "Profit",
        placeholder: "Enable"
    })
    shorterValues = true;

    @SelectorProperty({
        name: "Summoning Eye price",
        description: "Choose what kind of price to use for summoning eyes.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Buy Order", "Middle", "Insta Buy", "Average"]
    })
    eyePricing = 3;

    @SelectorProperty({
        name: "AH prices",
        description: "Choose what kind of price to use for items on the auction hause. \nAverage is the average sell price over the last 2 days.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Lowest BIN", "Average"]
    })
    ahPricing = 1;

    @SelectorProperty({
        name: "Dragon Horn pricing",
        description: "Choose what kind of price to use for dragon horns.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Sell Order", "Middle", "Insta Sell", "Average"]
    })
    hornPricing = 3;

    @SelectorProperty({
        name: "Dragon Fragment pricing",
        description: "Choose what kind of price to use for dragon fragments.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Sell Order", "Middle", "Insta Sell", "Average"]
    })
    fragPricing = 3;

    @SelectorProperty({
        name: "Dragon Essence pricing",
        description: "Choose what kind of price to use for dragon essence.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Sell Order", "Middle", "Insta Sell", "Average"]
    })
    essencePricing = 3;

    @SelectorProperty({
        name: "Ritual Residue pricing",
        description: "Choose what kind of price to use for ritual residue",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Sell Order", "Middle", "Insta Sell", "Average"]
    })
    residuePricing = 3;

    @SelectorProperty({
        name: "Draconic Shard pricing",
        description: "Choose what kind of price to use for draconic shards.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Sell Order", "Middle", "Insta Sell", "Average"]
    })
    draconicPricing = 3;

    @SelectorProperty({
        name: "Other Items pricing",
        description: "Choose what kind of price to use for other items.",
        category: "Profit",
        subcategory: "Pricing",
        options: ["Sell Order", "Middle", "Insta Sell", "Average"]
    })
    otherPricing = 3;

    @SwitchProperty({
        name: "Sacrifice AOTDs",
        description: "Whether the profit calculator should assume sacrificing AOTDs instead of selling them.",
        category: "Profit",
        subcategory: "Sacrifice",
        placeholder: "Disable"
    })
    sacAotds = false;

    @SwitchProperty({
        name: "Sacrifice Superior pieces",
        description: "Whether the profit calculator should assume sacrificing superior pieces instead of selling them.",
        category: "Profit",
        subcategory: "Sacrifice",
        placeholder: "Disable"
    })
    sacSups = false;

    @SwitchProperty({
        name: "Sacrifice Wise leggings",
        description: "Whether the profit calculator should assume sacrificing wise leggings instead of selling them.",
        category: "Profit",
        subcategory: "Sacrifice",
        placeholder: "Disable"
    })
    sacWiseLegs = false;

    @SwitchProperty({
        name: "Sacrifice Strong leggings",
        description: "Whether the profit calculator should assume sacrificing strong leggings instead of selling them.",
        category: "Profit",
        subcategory: "Sacrifice",
        placeholder: "Disable"
    })
    sacStrongLegs = false;

    @SwitchProperty({
        name: "Sacrifice other dragon pieces",
        description: "Whether the profit calculator should assume sacrificing other dragon pieces instead of selling them.",
        category: "Profit",
        subcategory: "Sacrifice",
        placeholder: "Enable"
    })
    sacOthers = true;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "General setting for dragon tracker.")
        this.setCategoryDescription("Display", "Display settings for the tracker.")
        this.setCategoryDescription("Chat", "Some nice chat features.")
        this.setCategoryDescription("Tracker", "What you want to display in the tracker. All the data still gets stored even if it's not shown in the tracker.")
        this.setCategoryDescription("Misc", "Other useful stuff for true dragoniers.")
        this.setCategoryDescription("Profit", "Settings for calculating estimated profit from dragons." +
                                    "\nAll the data is supplied from https://sky.coflnet.com/data and automatically updated every 15 minutes." +
                                    "\nYou can also manually update the data using /dtupdate." +
                                    "\nAverage prices are the average sell prices from the last 2 days. They can be a bit less accurate, but are immune to price manipulation.")
    }
}

export default new Settings();