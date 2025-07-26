import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlessingData {
  religion: string;
  god: string;
  domain: string;
  blessing: string;
}

interface ReligionBlessingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onBlessingSelected: (blessing: BlessingData) => void;
}

interface God {
  domain: string;
  blessing: string;
}

interface Religion {
  name: string;
  subtitle: string;
  symbol: string;
  description: string;
  gods: Record<string, God>;
}

const RELIGIONS: Record<string, Religion> = {
  Mercury: {
    name: "Mercury",
    subtitle: "Trickery & Chaos Pantheon",
    symbol: "🃏",
    description: "Jester Mask",
    gods: {
      Vexoth: { domain: "Trickery & Luck", blessing: "+1 reroll per session (any D20 roll)" },
      Lyrix: { domain: "Masks & Illusions", blessing: "Grants a disguise kit + 1/day illusion spell" },
      Jhjin: { domain: "Innovation & Mischief", blessing: "Hidden profession path unlocked: \"Tinkerer\"" },
      Xyqutit: { domain: "Transfiguration", blessing: "Can change race once via hidden side quest" },
      Ketrix: { domain: "Chaos & Darkness", blessing: "Start with 3 random consumable magical items" },
      Vynxara: { domain: "Dreams", blessing: "Once per long rest, receive a prophetic dream (DM hint)" },
      Lybranis: { domain: "Wealth & Greed", blessing: "Start with +200 gold and \"Greedy Glint\" (discount from shady vendors)" }
    }
  },
  Venus: {
    name: "Venus",
    subtitle: "Love & Chivalry Pantheon",
    symbol: "💖",
    description: "Heart with Sword",
    gods: {
      Aesthera: { domain: "Love & Diplomacy", blessing: "+1 CHA and persuasion advantage 1/day" },
      Alcyrene: { domain: "Beauty & Art", blessing: "Gain \"Artist's Inspiration\" – create beauty that charms minor NPCs" },
      Veltharys: { domain: "Passion & Fire", blessing: "Start with a fire-based weapon or spell" },
      Caelora: { domain: "Peace & Reconciliation", blessing: "Gain +1 WIS and \"Calm Emotions\" spell 1/day" },
      Thrydanis: { domain: "Union & Commitment", blessing: "Bonded Ally: Choose a player, gain +1 AC when near" },
      Lysaris: { domain: "Desire & Influence", blessing: "Gain \"Subtle Whispers\" – minor mind-influence cantrip" }
    }
  },
  Earth: {
    name: "Earth",
    subtitle: "The Silent Pantheon",
    symbol: "🌱",
    description: "Sprouting Seed",
    gods: {
      Gaia: { domain: "Creation & Earth", blessing: "None at first. Hidden Quest: \"Connection with Earth\" (+2 all stats permanently when completed)." }
    }
  },
  Mars: {
    name: "Mars",
    subtitle: "Nebula of Dominion",
    symbol: "⚔️",
    description: "Cracked Helm",
    gods: {
      Kael: { domain: "War & Strategy", blessing: "+1 STR or INT (player choice)" },
      Arcanthis: { domain: "Tactics & Planning", blessing: "Reveal 1 enemy weakness before battle (1/day)" },
      Barythra: { domain: "Valor & Heroism", blessing: "+1 CON and resistance to fear" },
      Thargrin: { domain: "Fury & Bloodshed", blessing: "When under 50% HP, deal +1 damage per hit" },
      Cindralis: { domain: "Weapons & Forging", blessing: "Start with a unique named weapon (basic stats, grows over time)" },
      Kaeltris: { domain: "Ambition & Dominion", blessing: "+1 CHA and access to \"Dominion\" career tree" },
      Morrathis: { domain: "Death in Battle", blessing: "Upon death, a 50% chance to resurrect once with 1 HP" }
    }
  },
  Jupiter: {
    name: "Jupiter",
    subtitle: "Pantheon of Light",
    symbol: "🌞",
    description: "Radiant Sunburst",
    gods: {
      Avalon: { domain: "Sun & Light", blessing: "Gain \"Radiant Touch\" (cantrip that reveals illusions and undead)" },
      Lumenar: { domain: "Knowledge & Wisdom", blessing: "+1 INT and free lore hint 1/session" },
      Soltrion: { domain: "Courage & Sacrifice", blessing: "You can shield an ally from death once (1 HP survive trigger)" },
      Seraphina: { domain: "Inspiration & Art", blessing: "Gain a \"Muse Token\" – once used, grants advantage on any artistic or social task" },
      Astravar: { domain: "Order & Leadership", blessing: "Gain \"Command Voice\" – minor fear or inspire effect 1/day" }
    }
  },
  Saturn: {
    name: "Saturn",
    subtitle: "Primordial Power Pantheon",
    symbol: "🜍",
    description: "Ancient Rune Circle",
    gods: {
      Dragorath: { domain: "Dragons", blessing: "Hidden profession \"Dragonbound\" becomes available" },
      Ekhlyss: { domain: "Cycles & Time", blessing: "Can delay aging effects and resist status changes once/day" },
      Vaelthyr: { domain: "Arcane Flames", blessing: "Start with rare fire spell or item" },
      Rathorax: { domain: "Strength & Dominion", blessing: "+2 STR cap increase (stat max is now 22 for STR)" },
      Aurelix: { domain: "Wealth & Hoards", blessing: "Gain rare gemstone worth 300g" },
      Drakvyr: { domain: "Secrets", blessing: "\"Whisper of Drakvyr\" – minor forbidden spell cast 1/day" },
      Zyraxil: { domain: "Balance & Destruction", blessing: "\"Equilibrium\" – negate one buff/debuff (self or target) 1/session" }
    }
  },
  Uranus: {
    name: "Uranus",
    subtitle: "Thunder & Fury Pantheon",
    symbol: "⚡",
    description: "Shattered Bolt",
    gods: {
      Skorvyn: { domain: "Titan Wrath", blessing: "Start with Titan heritage: +1 CON, +1 STR" },
      Bjolnir: { domain: "Forge", blessing: "Gain a forge blueprint and resistance to fire" },
      Yrngael: { domain: "Winds", blessing: "Once/day cast Wind Step – move 15ft without provoking attacks" },
      Fjorvak: { domain: "Ice", blessing: "Resistance to cold and gain Ice Shard item" },
      Valdris: { domain: "Sky Hunt", blessing: "Gain a hawk familiar with scouting ability" },
      Korgath: { domain: "Earthquake", blessing: "\"Tremor Stomp\" (cantrip, 5ft knockdown chance)" },
      Helvyrn: { domain: "Sea Tempest", blessing: "Swim speed + underwater breathing and a vial of sea poison" }
    }
  },
  Pluto: {
    name: "Pluto",
    subtitle: "Watchers of the Veil",
    symbol: "☠️",
    description: "Veiled Skull",
    gods: {
      Ravel: { domain: "Death", blessing: "Start with a soulstone that prevents death once (must be recharged)" },
      Valtherion: { domain: "Judgment", blessing: "Sense undead and evil in a 30ft radius once/day" },
      Liriel: { domain: "Passing", blessing: "Can calm dying NPCs to hear last words (may reveal hidden quests)" },
      Eryndor: { domain: "Underworld", blessing: "Access to Shadowpath network (underground shortcuts)" },
      Seraphael: { domain: "Life Spark", blessing: "Heal 1d4 HP on self or ally once per day" },
      Azariel: { domain: "Time", blessing: "\"Recall\" – undo your last movement or action once/session" },
      Valtheron: { domain: "Warrior of Souls", blessing: "\"Ghoststep\" – pass through thin walls once/day" },
      Iryssia: { domain: "Secrets", blessing: "Learn 1 random hidden fact per game session (DM granted)" },
      Caeryth: { domain: "Mourning", blessing: "Once per session, can inspire with grief – allies gain morale boost" }
    }
  }
};

export const ReligionBlessingPopup = ({ isOpen, onClose, onBlessingSelected }: ReligionBlessingPopupProps) => {
  const [step, setStep] = useState<'religion' | 'pantheon'>('religion');
  const [selectedReligion, setSelectedReligion] = useState<string>('');
  const [selectedGod, setSelectedGod] = useState<string>('');

  const handleReligionSelect = (religionKey: string) => {
    setSelectedReligion(religionKey);
  };

  const handleProceed = () => {
    if (selectedReligion) {
      setStep('pantheon');
    }
  };

  const handleGodSelect = (godKey: string) => {
    if (!selectedReligion) return;
    
    const religion = RELIGIONS[selectedReligion as keyof typeof RELIGIONS];
    const god = religion.gods[godKey as keyof typeof religion.gods];
    
    if (!god) return;
    
    const blessingData: BlessingData = {
      religion: selectedReligion,
      god: godKey,
      domain: god.domain,
      blessing: god.blessing
    };

    onBlessingSelected(blessingData);
    handleClose();
  };

  const handleClose = () => {
    setStep('religion');
    setSelectedReligion('');
    setSelectedGod('');
    onClose();
  };

  const handleBack = () => {
    setStep('religion');
    setSelectedGod('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur border-fantasy-gold/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-fantasy-gold">
            🌟 RELIGIONS & BLESSINGS 🌟
          </DialogTitle>
        </DialogHeader>

        {step === 'religion' && (
          <div className="space-y-6">
            <p className="text-center text-lg text-muted-foreground">
              Choose your divine path from the eight great religions
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(RELIGIONS).map(([key, religion]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    selectedReligion === key 
                      ? 'border-fantasy-gold bg-fantasy-gold/10 shadow-lg' 
                      : 'border-fantasy-gold/20 hover:border-fantasy-gold/40'
                  }`}
                  onClick={() => handleReligionSelect(key)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{religion.symbol}</div>
                    <h3 className="text-xl font-bold text-fantasy-gold mb-1">{religion.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{religion.subtitle}</p>
                    <Badge variant="outline" className="text-xs border-fantasy-gold/20">
                      {religion.description}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedReligion && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleProceed}
                  className="bg-fantasy-gold text-background hover:bg-fantasy-gold/80 px-8 py-2"
                  size="lg"
                >
                  Proceed to Pantheon
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'pantheon' && selectedReligion && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-fantasy-gold mb-2">
                {RELIGIONS[selectedReligion as keyof typeof RELIGIONS].name} Pantheon
              </h3>
              <p className="text-lg text-muted-foreground">
                {RELIGIONS[selectedReligion as keyof typeof RELIGIONS].subtitle}
              </p>
            </div>

            <div className="grid gap-4">
              {Object.entries(RELIGIONS[selectedReligion as keyof typeof RELIGIONS].gods).map(([godKey, god]) => (
                <Card
                  key={godKey}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-fantasy-gold/20 hover:border-fantasy-gold/40 hover:bg-fantasy-gold/5"
                  onClick={() => handleGodSelect(godKey)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-fantasy-gold">{godKey}</h4>
                        <p className="text-divine text-sm font-medium mb-2">{god.domain}</p>
                        <p className="text-sm text-foreground leading-relaxed">{god.blessing}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="ml-4 bg-fantasy-gold text-background hover:bg-fantasy-gold/80"
                      >
                        Choose
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold/10"
              >
                Back to Religions
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};