let zoneHandlers = {
    909: e12S_handler,
    966: nier3_handler,
    1122: omegaUltimate_handler
    //641: debug_handler
};

// https://github.com/OverlayPlugin/cactbot/blob/main/docs/LogGuide.md#overlayplugin-log-lines
let logTable = {
    ffxiv: {
        game: "00",
        changeZone: "01",
        changePrimaryPlayer: "02",
        addCombatant: "03",
        removeCombatant: "04",
        partyList: "11",
        playerStats: "12",
        networkStartsCasting: "20",
        networkAbility: "21",
        networkAOEAbility: "22",
        networkCancelAbility: "23",
        networkDoT: "24",
        networkDeath: "25",
        networkBuff: "26",
        networkTargetIcon: "27",
        networkRaidMarker: "28",
        networkTargetMarker: "29",
        networkBuffRemove: "30",
        networkGauge: "31",
        networkWorld: "32",
        networkActorControl: "33",
        networkNameToggle: "34",
        networkTether: "35",
        limitBreak: "36",
        networkActionSync: "37",
        networkStatusEffects: "38",
        networkUpdateHP: "39",
        map: "40",
        systemLogMessage: "41",
        statusList3: "42",
        debug: "251",
        packetDump: "252",
        version: "253",
        error: "254"
    },
    overlayPlugin: {
        lineRegistration: "256",
        mapEffect: "257",
        fateDirector: "258",
        CEDirector: "259",
        inCombat: "260",
        combatantMemory: "261",
        RSVData: "262",
        startsUsingExtra: "263",
        abilityExtra: "264",
        contentFinderSettings: "265",
        npcYell: "266",
        battleTalk2: "267",
        countdown: "268",
        countdownCancel: "269",
        actorMove: "270",
        actorSetPos: "271",
        spawnNpcExtra: "272",
        actorControlExtra: "273",
        actorControlSelfExtra: "274",
    }
}

const typeRegex = /^(\d+)|/;

const logRegexTable = {
    ffxiv: {
        game: /^(?<type>00)\|(?<timestamp>[^|]*)\|(?<code>[^|]*)\|(?<name>[^|]*)\|(?<line>[^|]*)\|/,
        changeZone: /^(?<type>01)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|/,
        changePrimaryPlayer: /^(?<type>02)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|/,
        addCombatant: /^(?<type>03)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<job>[^|]*)\|(?<level>[^|]*)\|(?<ownerId>[^|]*)\|(?<worldId>[^|]*)\|(?<world>[^|]*)\|(?<npcNameId>[^|]*)\|(?<npcBaseId>[^|]*)\|(?<currentHp>[^|]*)\|(?<hp>[^|]*)\|(?<currentMp>[^|]*)\|(?<mp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|/,
        removeCombatant: /^(?<type>04)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<job>[^|]*)\|(?<level>[^|]*)\|(?<owner>[^|]*)\|(?:[^|]*\|)(?<world>[^|]*)\|(?<npcNameId>[^|]*)\|(?<npcBaseId>[^|]*)\|(?:[^|]*\|)(?<hp>[^|]*)\|(?:[^|]*\|){4}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|/,
        partyList: /^(?<type>11)\|(?<timestamp>[^|]*)\|(?<partyCount>[^|]*)\|/,
        playerStats: /^(?<type>12)\|(?<timestamp>[^|]*)\|(?<job>[^|]*)\|(?<strength>[^|]*)\|(?<dexterity>[^|]*)\|(?<vitality>[^|]*)\|(?<intelligence>[^|]*)\|(?<mind>[^|]*)\|(?<piety>[^|]*)\|(?<attackPower>[^|]*)\|(?<directHit>[^|]*)\|(?<criticalHit>[^|]*)\|(?<attackMagicPotency>[^|]*)\|(?<healMagicPotency>[^|]*)\|(?<determination>[^|]*)\|(?<skillSpeed>[^|]*)\|(?<spellSpeed>[^|]*)\|(?:[^|]*\|)(?<tenacity>[^|]*)\|(?<localContentId>[^|]*)\|/,
        networkStartsCasting: /^(?<type>20)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<ability>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<castTime>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|/,
        networkAbility: /^(?<type>2[12])\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<ability>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<flags>[^|]*)\|(?<damage>[^|]*)\|(?:[^|]*\|){14}(?<targetCurrentHp>[^|]*)\|(?<targetMaxHp>[^|]*)\|(?<targetCurrentMp>[^|]*)\|(?<targetMaxMp>[^|]*)\|(?:[^|]*\|){2}(?<targetX>[^|]*)\|(?<targetY>[^|]*)\|(?<targetZ>[^|]*)\|(?<targetHeading>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<sequence>[^|]*)\|(?<targetIndex>[^|]*)\|(?<targetCount>[^|]*)\|/,
        networkAOEAbility: /^(?<type>2[12])\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<ability>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<flags>[^|]*)\|(?<damage>[^|]*)\|(?:[^|]*\|){14}(?<targetCurrentHp>[^|]*)\|(?<targetMaxHp>[^|]*)\|(?<targetCurrentMp>[^|]*)\|(?<targetMaxMp>[^|]*)\|(?:[^|]*\|){2}(?<targetX>[^|]*)\|(?<targetY>[^|]*)\|(?<targetZ>[^|]*)\|(?<targetHeading>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<sequence>[^|]*)\|(?<targetIndex>[^|]*)\|(?<targetCount>[^|]*)\|/,
        networkCancelAbility: /^(?<type>23)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<reason>[^|]*)\|/,
        networkDoT: /^(?<type>24)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<which>[^|]*)\|(?<effectId>[^|]*)\|(?<damage>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<damageType>[^|]*)\|(?<sourceCurrentHp>[^|]*)\|(?<sourceMaxHp>[^|]*)\|(?<sourceCurrentMp>[^|]*)\|(?<sourceMaxMp>[^|]*)\|(?:[^|]*\|){2}(?<sourceX>[^|]*)\|(?<sourceY>[^|]*)\|(?<sourceZ>[^|]*)\|(?<sourceHeading>[^|]*)\|/,
        networkDeath: /^(?<type>25)\|(?<timestamp>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|/,
        networkBuff: /^(?<type>26)\|(?<timestamp>[^|]*)\|(?<effectId>[^|]*)\|(?<effect>[^|]*)\|(?<duration>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<count>[^|]*)\|(?<targetMaxHp>[^|]*)\|(?<sourceMaxHp>[^|]*)\|/,
        networkTargetIcon: /^(?<type>27)\|(?<timestamp>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?:[^|]*\|){2}(?<id>[^|]*)\|/,
        networkRaidMarker: /^(?<type>28)\|(?<timestamp>[^|]*)\|(?<operation>[^|]*)\|(?<waymark>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|/,
        networkTargetMarker: /^(?<type>29)\|(?<timestamp>[^|]*)\|(?<operation>[^|]*)\|(?<waymark>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<targetId>[^|]*)\|(?<targetName>[^|]*)\|/,
        networkBuffRemove: /^(?<type>30)\|(?<timestamp>[^|]*)\|(?<effectId>[^|]*)\|(?<effect>[^|]*)\|(?:[^|]*\|)(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<count>[^|]*)\|/,
        networkGauge: /^(?<type>31)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|(?<data2>[^|]*)\|(?<data3>[^|]*)\|/,
        networkActorControl: /^(?<type>33)\|(?<timestamp>[^|]*)\|(?<instance>[^|]*)\|(?<command>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|(?<data2>[^|]*)\|(?<data3>[^|]*)\|/,
        networkNameToggle: /^(?<type>34)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<targetId>[^|]*)\|(?<targetName>[^|]*)\|(?<toggle>[^|]*)\|/,
        networkTether: /^(?<type>35)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<source>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?:[^|]*\|){2}(?<id>[^|]*)\|/,
        limitBreak: /^(?<type>36)\|(?<timestamp>[^|]*)\|(?<valueHex>[^|]*)\|(?<bars>[^|]*)\|/,
        networkActionSync: /^(?<type>37)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<sequenceId>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?<currentShield>[^|]*)\|(?:[^|]*\|)(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|/,
        networkStatusEffects: /^(?<type>38)\|(?<timestamp>[^|]*)\|(?<targetId>[^|]*)\|(?<target>[^|]*)\|(?<jobLevelData>[^|]*)\|(?<hp>[^|]*)\|(?<maxHp>[^|]*)\|(?<mp>[^|]*)\|(?<maxMp>[^|]*)\|(?<currentShield>[^|]*)\|(?:[^|]*\|)(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|(?<data2>[^|]*)\|/,
        networkUpdateHP: /^(?<type>39)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|(?<currentHp>[^|]*)\|(?<maxHp>[^|]*)\|(?<currentMp>[^|]*)\|(?<maxMp>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|(?<heading>[^|]*)\|/,
        map: /^(?<type>40)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<regionName>[^|]*)\|(?<placeName>[^|]*)\|(?<placeNameSub>[^|]*)\|/,
        systemLogMessage: /^(?<type>41)\|(?<timestamp>[^|]*)\|(?<instance>[^|]*)\|(?<id>[^|]*)\|(?<param0>[^|]*)\|(?<param1>[^|]*)\|(?<param2>[^|]*)\|/,
        statusList3: /^(?<type>42)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<name>[^|]*)\|/,
    },
    overlayPlugin: {
        lineRegistration: /^(?<type>256)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<source>[^|]*)\|(?<version>[^|]*)\|/,
        mapEffect: /^(?<type>257)\|(?<timestamp>[^|]*)\|(?<instance>[^|]*)\|(?<flags>[^|]*)\|(?<location>[^|]*)\|(?<data0>[^|]*)\|(?<data1>[^|]*)\|/,
        fateDirector: /^(?<type>258)\|(?<timestamp>[^|]*)\|(?<category>[^|]*)\|(?:[^|]*\|)(?<fateId>[^|]*)\|(?<progress>[^|]*)\|/,
        CEDirector: /^(?<type>259)\|(?<timestamp>[^|]*)\|(?<popTime>[^|]*)\|(?<timeRemaining>[^|]*)\|(?:[^|]*\|)(?<ceKey>[^|]*)\|(?<numPlayers>[^|]*)\|(?<status>[^|]*)\|(?:[^|]*\|)(?<progress>[^|]*)\|/,
        inCombat: /^(?<type>260)\|(?<timestamp>[^|]*)\|(?<inACTCombat>[^|]*)\|(?<inGameCombat>[^|]*)\|(?<isACTChanged>[^|]*)\|(?<isGameChanged>[^|]*)\|/,
        combatantMemory: /^(?<type>261)\|(?<timestamp>[^|]*)\|(?<change>[^|]*)\|(?<id>[^|]*)\|(?:AggressionStatus\|(?<pairAggressionStatus>[^|]*)\|)?(?:BNpcID\|(?<pairBNpcID>[^|]*)\|)?(?:BNpcNameID\|(?<pairBNpcNameID>[^|]*)\|)?(?:CastBuffID\|(?<pairCastBuffID>[^|]*)\|)?(?:CastDurationCurrent\|(?<pairCastDurationCurrent>[^|]*)\|)?(?:CastDurationMax\|(?<pairCastDurationMax>[^|]*)\|)?(?:CastGroundTargetX\|(?<pairCastGroundTargetX>[^|]*)\|)?(?:CastGroundTargetY\|(?<pairCastGroundTargetY>[^|]*)\|)?(?:CastGroundTargetZ\|(?<pairCastGroundTargetZ>[^|]*)\|)?(?:CastTargetID\|(?<pairCastTargetID>[^|]*)\|)?(?:CurrentCP\|(?<pairCurrentCP>[^|]*)\|)?(?:CurrentGP\|(?<pairCurrentGP>[^|]*)\|)?(?:CurrentHP\|(?<pairCurrentHP>[^|]*)\|)?(?:CurrentMP\|(?<pairCurrentMP>[^|]*)\|)?(?:CurrentWorldID\|(?<pairCurrentWorldID>[^|]*)\|)?(?:Distance\|(?<pairDistance>[^|]*)\|)?(?:EffectiveDistance\|(?<pairEffectiveDistance>[^|]*)\|)?(?:Heading\|(?<pairHeading>[^|]*)\|)?(?:ID\|(?<pairID>[^|]*)\|)?(?:IsCasting1\|(?<pairIsCasting1>[^|]*)\|)?(?:IsCasting2\|(?<pairIsCasting2>[^|]*)\|)?(?:IsTargetable\|(?<pairIsTargetable>[^|]*)\|)?(?:Job\|(?<pairJob>[^|]*)\|)?(?:Level\|(?<pairLevel>[^|]*)\|)?(?:MaxCP\|(?<pairMaxCP>[^|]*)\|)?(?:MaxGP\|(?<pairMaxGP>[^|]*)\|)?(?:MaxHP\|(?<pairMaxHP>[^|]*)\|)?(?:MaxMP\|(?<pairMaxMP>[^|]*)\|)?(?:ModelStatus\|(?<pairModelStatus>[^|]*)\|)?(?:MonsterType\|(?<pairMonsterType>[^|]*)\|)?(?:Name\|(?<pairName>[^|]*)\|)?(?:NPCTargetID\|(?<pairNPCTargetID>[^|]*)\|)?(?:OwnerID\|(?<pairOwnerID>[^|]*)\|)?(?:PartyType\|(?<pairPartyType>[^|]*)\|)?(?:PCTargetID\|(?<pairPCTargetID>[^|]*)\|)?(?:PosX\|(?<pairPosX>[^|]*)\|)?(?:PosY\|(?<pairPosY>[^|]*)\|)?(?:PosZ\|(?<pairPosZ>[^|]*)\|)?(?:Radius\|(?<pairRadius>[^|]*)\|)?(?:Status\|(?<pairStatus>[^|]*)\|)?(?:TargetID\|(?<pairTargetID>[^|]*)\|)?(?:TransformationId\|(?<pairTransformationId>[^|]*)\|)?(?:Type\|(?<pairType>[^|]*)\|)?(?:WeaponId\|(?<pairWeaponId>[^|]*)\|)?(?:WorldID\|(?<pairWorldID>[^|]*)\|)?(?:WorldName\|(?<pairWorldName>[^|]*)\|)?/,
        RSVData: /^(?<type>262)\|(?<timestamp>[^|]*)\|(?<locale>[^|]*)\|(?:[^|]*\|)(?<key>[^|]*)\|(?<value>[^|]*)\|/,
        startsUsingExtra: /^(?<type>263)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<id>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|/,
        abilityExtra: /^(?<type>264)\|(?<timestamp>[^|]*)\|(?<sourceId>[^|]*)\|(?<id>[^|]*)\|(?<globalEffectCounter>[^|]*)\|(?<dataFlag>[^|]*)\|(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|/,
        contentFinderSettings: /^(?<type>265)\|(?<timestamp>[^|]*)\|(?<zoneId>[^|]*)\|(?<zoneName>[^|]*)\|(?<inContentFinderContent>[^|]*)\|(?<unrestrictedParty>[^|]*)\|(?<minimalItemLevel>[^|]*)\|(?<silenceEcho>[^|]*)\|(?<explorerMode>[^|]*)\|(?<levelSync>[^|]*)\|/,
        npcYell: /^(?<type>266)\|(?<timestamp>[^|]*)\|(?<npcId>[^|]*)\|(?<npcNameId>[^|]*)\|(?<npcYellId>[^|]*)\|/,
        battleTalk2: /^(?<type>267)\|(?<timestamp>[^|]*)\|(?<npcId>[^|]*)\|(?<instance>[^|]*)\|(?<npcNameId>[^|]*)\|(?<instanceContentTextId>[^|]*)\|(?<displayMs>[^|]*)\|/,
        countdown: /^(?<type>268)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<worldId>[^|]*)\|(?<countdownTime>[^|]*)\|(?<result>[^|]*)\|(?<name>[^|]*)\|/,
        countdownCancel: /^(?<type>269)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<worldId>[^|]*)\|(?<name>[^|]*)\|/,
        actorMove: /^(?<type>270)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<heading>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|/,
        actorSetPos: /^(?<type>271)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<heading>[^|]*)\|(?:[^|]*\|){2}(?<x>[^|]*)\|(?<y>[^|]*)\|(?<z>[^|]*)\|/,
        spawnNpcExtra: /^(?<type>272)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<parentId>[^|]*)\|(?<tetherId>[^|]*)\|(?<animationState>[^|]*)\|/,
        actorControlExtra: /^(?<type>273)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<category>[^|]*)\|(?<param1>[^|]*)\|(?<param2>[^|]*)\|(?<param3>[^|]*)\|(?<param4>[^|]*)\|/,
        actorControlSelfExtra: /^(?<type>274)\|(?<timestamp>[^|]*)\|(?<id>[^|]*)\|(?<category>[^|]*)\|(?<param1>[^|]*)\|(?<param2>[^|]*)\|(?<param3>[^|]*)\|(?<param4>[^|]*)\|(?<param5>[^|]*)\|(?<param6>[^|]*)\|/,
    }

}

/**
 * parse raw log data
 * @param logLine
 * @returns ?Object
 */
function parseLogLine(logLine) {
    const typeMatch = logLine.match(typeRegex);
    const logType = typeMatch[0];
    let type;
    let parseRegex;

    // Search for type
    if(parseInt(logType) > 255) {
        type = Object.keys(logTable.overlayPlugin)[Object.values(logTable.overlayPlugin).indexOf(logType)];
        if(!logRegexTable.overlayPlugin.hasOwnProperty(type)) {
            console.error('Error: Could not determine log type. Did you copy the line correctly?')
            return null;
        }
        parseRegex = logRegexTable.overlayPlugin[type];
    } else {
        type = Object.keys(logTable.ffxiv)[Object.values(logTable.ffxiv).indexOf(logType)];
        if(!logRegexTable.ffxiv.hasOwnProperty(type)) {
            console.error('Error: Could not determine log type. Did you copy the line correctly?')
            return null;
        }
        parseRegex = logRegexTable.ffxiv[type];
    }

    const logMatch = logLine.match(parseRegex);

    if(!logMatch.hasOwnProperty('groups')) {
        console.error('Error: Failed to parse log line.')
    }

    let logData = logMatch.groups;

    logData.type = type;
    logData.typeId = logType;

    return logData;
}

/**
 * @todo: debug this lol
 * @param lineObj Array
 * @param onlyTypes String
 * @returns ?object
 */
function getLine(lineObj, onlyTypes = null) {
    if(!lineObj.hasOwnProperty('line') && !Array.isArray(lineObj.line)) {
        return null;
    }
    let lineArray = lineObj.line;

    let log = {
        type: lineArray[0]
    }

    // If we only want one type of log, bail out when we handle another type
    if(onlyTypes !== null) {
        if(!onlyTypes.find((f) => f === log.type)) {
            return null;
        }
    }

    return parseLogLine(lineObj.rawLine);
}

function debug_handler(e) {
    // Loads in Shirogane only
    let line = getLine(e);

    // Show me everything
    console.log(line);
}


/**
 * @todo Refactor to make use of logTable structs so we aren't doing string parsing of the entire logLine object
 */
function e12S_handler(e) {
    if(Array.isArray(e.line)) {
        e.line.forEach((line) => {
            if(line.includes('Added new combatant Beastly Sculpture.')) {
                effect_screenDarkener(30);
            }
        });
    }
}

function nier3_handler(e) {
    let spellTable = {
        RedGirl_Cruelty: "6013",
        RedGirl_SublimeTranscendence: "620A",
        HerInflorescence_Distortion: "5BE9",
        FalseIdol_Eminence: "5DD5"
    }

    let line = getLine(e, [logTable.ffxiv.networkStartsCasting]);
    if(!line) {
        return;
    }

    switch(line.id) {
        case spellTable.RedGirl_Cruelty:
            effect_fadeOutIn(9, 0.7);
            break;
        case spellTable.RedGirl_SublimeTranscendence:
            effect_fadeOutIn(10, 1);
            break;
        case spellTable.HerInflorescence_Distortion:
            effect_fadeOutIn(9, 0.7);
            break;
        case spellTable.FalseIdol_Eminence:
            effect_fadeOutIn(12, 0.7);
            break;
    }
}

function omegaUltimate_handler(e) {
    let line = getLine(e, [logTable.overlayPlugin.mapEffect]);

    if(!line) {
        return;
    }

    // Bright arena effect prior to Atomic Ray enrage
    if(line.typeId == logTable.overlayPlugin.mapEffect && line.flags == '00080004' && line.location == '09') {
        console.log('firing real');
        effect_fadeOutIn(2, 0.7);
    }

}
