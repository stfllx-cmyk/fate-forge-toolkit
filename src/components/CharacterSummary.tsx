import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DiceRollPopup } from "./DiceRollPopup";
import { ReligionBlessingPopup } from "./ReligionBlessingPopup";

// Race stats data
const RACE_STATS = {
  Golem: { STR: 5, CON: 6, DEX: 9, INT: 8, WIS: 12, CHA: 10 },
  Lizardfolk: { STR: 7, CON: 7, DEX: 8, INT: 5, WIS: 5, CHA: 4 },
  Kobold: { STR: 4, CON: 5, DEX: 6, INT: 8, WIS: 6, CHA: 6 },
  Halfling: { STR: 5, CON: 6, DEX: 11, INT: 7, WIS: 9, CHA: 8 },
  Goblin: { STR: 4, CON: 5, DEX: 9, INT: 9, WIS: 7, CHA: 6 },
  Merfolk: { STR: 6, CON: 7, DEX: 10, INT: 8, WIS: 10, CHA: 7 },
  Centaur: { STR: 11, CON: 10, DEX: 8, INT: 6, WIS: 7, CHA: 6 },
  Human: { STR: 7, CON: 7, DEX: 7, INT: 7, WIS: 7, CHA: 7 },
  Orc: { STR: 10, CON: 10, DEX: 6, INT: 4, WIS: 6, CHA: 5 },
  Dwarf: { STR: 9, CON: 10, DEX: 6, INT: 7, WIS: 8, CHA: 5 },
  "High Elf": { STR: 6, CON: 6, DEX: 13, INT: 10, WIS: 9, CHA: 10 },
  "Dark Elf": { STR: 6, CON: 7, DEX: 13, INT: 9, WIS: 8, CHA: 9 },
  Troll: { STR: 11, CON: 12, DEX: 4, INT: 3, WIS: 4, CHA: 3 },
  Tiefling: { STR: 10, CON: 10, DEX: 10, INT: 10, WIS: 7, CHA: 7 },
  Netherborn: { STR: 9, CON: 9, DEX: 5, INT: 7, WIS: 10, CHA: 4 },
  Elemental: { STR: 11, CON: 11, DEX: 8, INT: 8, WIS: 7, CHA: 5 },
  ArchFey: { STR: 7, CON: 6, DEX: 12, INT: 10, WIS: 10, CHA: 10 },
  Dragonkin: { STR: 12, CON: 10, DEX: 8, INT: 7, WIS: 7, CHA: 6 },
  Celestial: { STR: 11, CON: 9, DEX: 10, INT: 12, WIS: 12, CHA: 12 },
  "Demi-God": { STR: 15, CON: 15, DEX: 15, INT: 15, WIS: 15, CHA: 15 },
};

const WEAPON_TYPES = {
  "Melee Weapons": ["Sword", "Axe", "Mace", "Dagger", "Spear", "Hammer"],
  "Ranged Weapons": ["Bow", "Crossbow", "Throwing Knives", "Sling"],
  "Magic Weapons": ["Staff", "Wand", "Orb", "Tome"],
  "Exotic Weapons": ["Whip", "Chain", "Claws", "Fangs"]
};

const PANTHEONS = {
  "Divine Pantheon": ["Aella", "Lumina", "Solaris", "Harmony"],
  "Nature Pantheon": ["Verdant", "Tsunami", "Ignitus", "Tempest"],
  "Dark Pantheon": ["Vexoth", "Shadowmere", "Necrosis", "Malice"],
  "Neutral Pantheon": ["Balance", "Fate", "Time", "Knowledge"]
};

export const CharacterSummary = () => {
  const [selectedRace, setSelectedRace] = useState<string>("");
  const [raceAbility, setRaceAbility] = useState("");
  const [stats, setStats] = useState({ STR: 0, CON: 0, DEX: 0, INT: 0, WIS: 0, CHA: 0 });
  const [hasWeapon, setHasWeapon] = useState(false);
  const [weaponType, setWeaponType] = useState("");
  const [weaponItem, setWeaponItem] = useState("");
  const [blessing, setBlessing] = useState("");
  const [pantheon, setPantheon] = useState("");
  const [god, setGod] = useState("");
  const [showDicePopup, setShowDicePopup] = useState(false);
  const [showReligionPopup, setShowReligionPopup] = useState(false);
  const [selectedBlessing, setSelectedBlessing] = useState<{
    religion: string;
    god: string;
    domain: string;
    blessing: string;
  } | null>(null);

  const handleRaceChange = (race: string) => {
    setSelectedRace(race);
    if (race && RACE_STATS[race as keyof typeof RACE_STATS]) {
      setStats(RACE_STATS[race as keyof typeof RACE_STATS]);
    }
  };

  const handleDiceResults = (results: number[]) => {
    // Allow manual distribution of the dice results
    console.log("Dice results to distribute:", results);
  };

  const handleBlessingSelected = (blessing: { religion: string; god: string; domain: string; blessing: string }) => {
    setSelectedBlessing(blessing);
    setPantheon(blessing.religion);
    setGod(blessing.god);
    setBlessing(blessing.blessing);
  };

  return (
    <div className="min-h-screen bg-background rune-bg p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-fantasy-gold/20 bg-card/95 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold text-fantasy-gold">
                Character Summary
              </CardTitle>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowReligionPopup(true)}
                  className="bg-chaos text-white hover:bg-chaos/80 chaos-glow"
                >
                  Religion and Blessing
                </Button>
                <Button
                  onClick={() => setShowDicePopup(true)}
                  className="bg-divine text-divine-secondary hover:bg-divine/80 divine-glow"
                >
                  Try your Luck
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Race Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-fantasy-gold">Race</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="race">Race</Label>
                  <Select value={selectedRace} onValueChange={handleRaceChange}>
                    <SelectTrigger className="bg-popover/50 backdrop-blur z-50">
                      <SelectValue placeholder="Select a race" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover backdrop-blur border-fantasy-gold/20 z-50">
                      {Object.keys(RACE_STATS).map((race) => (
                        <SelectItem key={race} value={race}>
                          {race}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="race-ability">Race Ability</Label>
                  <Input
                    id="race-ability"
                    value={raceAbility}
                    onChange={(e) => setRaceAbility(e.target.value)}
                    placeholder="Enter race ability"
                  />
                </div>
              </div>
            </div>

            {/* Character Stats */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-fantasy-gold">Character Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(stats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <Label className="text-xs font-medium">{stat}</Label>
                    <div className="mt-1 p-2 bg-secondary rounded border border-fantasy-gold/20">
                      <span className="text-lg font-bold text-fantasy-gold">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weapon Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-fantasy-gold">Weapon</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-weapon"
                  checked={hasWeapon}
                  onCheckedChange={(checked) => setHasWeapon(checked as boolean)}
                />
                <Label htmlFor="has-weapon">Has Weapon</Label>
              </div>
              
              {hasWeapon && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weapon-type">Weapon Type</Label>
                    <Select value={weaponType} onValueChange={setWeaponType}>
                      <SelectTrigger className="bg-popover/50 backdrop-blur z-50">
                        <SelectValue placeholder="Select weapon type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover backdrop-blur border-fantasy-gold/20 z-50">
                        {Object.keys(WEAPON_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {weaponType && (
                    <div>
                      <Label htmlFor="weapon-item">Weapon Item</Label>
                      <Select value={weaponItem} onValueChange={setWeaponItem}>
                        <SelectTrigger className="bg-popover/50 backdrop-blur z-50">
                          <SelectValue placeholder="Select weapon item" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover backdrop-blur border-fantasy-gold/20 z-50">
                          {WEAPON_TYPES[weaponType as keyof typeof WEAPON_TYPES]?.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Blessing Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-fantasy-gold">Blessing</h3>
              
              {selectedBlessing ? (
                <div className="bg-fantasy-gold/10 rounded-lg p-4 border border-fantasy-gold/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Religion</div>
                      <div className="font-semibold text-fantasy-gold">{selectedBlessing.religion}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">God/Goddess</div>
                      <div className="font-semibold text-divine">{selectedBlessing.god}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Domain</div>
                      <div className="font-medium">{selectedBlessing.domain}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-muted-foreground">Blessing</div>
                      <div className="font-medium text-sm leading-relaxed">{selectedBlessing.blessing}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pantheon">Pantheon you serve</Label>
                    <Select value={pantheon} onValueChange={setPantheon}>
                      <SelectTrigger className="bg-popover/50 backdrop-blur z-50">
                        <SelectValue placeholder="Select pantheon" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover backdrop-blur border-fantasy-gold/20 z-50">
                        {Object.keys(PANTHEONS).map((pantheonName) => (
                          <SelectItem key={pantheonName} value={pantheonName}>
                            {pantheonName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {pantheon && (
                    <div>
                      <Label htmlFor="god">God you serve</Label>
                      <Select value={god} onValueChange={setGod}>
                        <SelectTrigger className="bg-popover/50 backdrop-blur z-50">
                          <SelectValue placeholder="Select god" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover backdrop-blur border-fantasy-gold/20 z-50">
                          {PANTHEONS[pantheon as keyof typeof PANTHEONS]?.map((godName) => (
                            <SelectItem key={godName} value={godName}>
                              {godName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="blessing">Blessing</Label>
                    <Input
                      id="blessing"
                      value={blessing}
                      onChange={(e) => setBlessing(e.target.value)}
                      placeholder="Enter blessing"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DiceRollPopup
        isOpen={showDicePopup}
        onClose={() => setShowDicePopup(false)}
        onResults={handleDiceResults}
      />

      <ReligionBlessingPopup
        isOpen={showReligionPopup}
        onClose={() => setShowReligionPopup(false)}
        onBlessingSelected={handleBlessingSelected}
      />
    </div>
  );
};