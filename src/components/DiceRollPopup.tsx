import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import aellaBlessing from "@/assets/aella-blessing.jpg";
import vexothCurse from "@/assets/vexoth-curse.jpg";
import magicalD20 from "@/assets/magical-d20.jpg";

interface DiceRollPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onResults: (results: number[]) => void;
}

export const DiceRollPopup = ({ isOpen, onClose, onResults }: DiceRollPopupProps) => {
  const [rolls, setRolls] = useState<number[]>([]);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [finalResults, setFinalResults] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  const rollDice = () => Math.floor(Math.random() * 20) + 1;

  const startDiceRoll = async () => {
    setIsRolling(true);
    setRolls([]);
    setFinalResults([]);
    setShowFinal(false);
    setCurrentRoll(null);

    const newRolls: number[] = [];
    const curseSubtractions = [-10, -8, -6, -4, -2, 0];

    for (let i = 0; i < 6; i++) {
      // Animate the dice
      setCurrentRoll(null);
      
      // Add spinning animation delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const roll = rollDice();
      setCurrentRoll(roll);
      newRolls.push(roll);
      setRolls([...newRolls]);
      
      // Wait before next roll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Apply Vexoth's Curse
    const cursedResults = newRolls.map((roll, index) => roll + curseSubtractions[index]);
    setFinalResults(cursedResults);
    setShowFinal(true);
    setIsRolling(false);
    onResults(cursedResults);
  };

  const resetDice = () => {
    setRolls([]);
    setCurrentRoll(null);
    setFinalResults([]);
    setShowFinal(false);
    setIsRolling(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetDice();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur border-fantasy-gold/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-fantasy-gold">
            Divine vs Chaotic Dice Roll
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6">
          {/* Aella's Blessing - Left Side */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="w-32 h-32 rounded-full overflow-hidden divine-glow border-2 border-divine">
              <img
                src={aellaBlessing}
                alt="Aella's Blessing"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-divine">Aella's Blessing</h3>
            <p className="text-sm text-center text-divine/80">
              Divine fortune guides your rolls
            </p>
          </div>

          {/* Center - Dice */}
          <div className="flex flex-col items-center space-y-6 flex-2">
            <div className="relative">
              <div
                className={`w-24 h-24 cursor-pointer transition-all duration-300 ${
                  isRolling ? "dice-spin" : ""
                } ${!isRolling ? "hover:scale-110" : ""}`}
                onClick={!isRolling ? startDiceRoll : undefined}
              >
                <img
                  src={magicalD20}
                  alt="Magical D20"
                  className="w-full h-full object-cover rounded-lg divine-glow"
                />
                {currentRoll && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-fantasy-gold drop-shadow-lg">
                      {currentRoll}
                    </span>
                  </div>
                )}
              </div>
              {!isRolling && rolls.length === 0 && (
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  Click to roll!
                </p>
              )}
            </div>

            {/* Roll Results */}
            {rolls.length > 0 && (
              <div className="bg-secondary/50 rounded-lg p-4 border border-fantasy-gold/20">
                <h4 className="text-center font-semibold mb-2 text-fantasy-gold">Rolls:</h4>
                <div className="flex space-x-2 justify-center">
                  {rolls.map((roll, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold text-primary-foreground"
                    >
                      {roll}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Results after Vexoth's Curse */}
            {showFinal && (
              <div className="bg-chaos/10 rounded-lg p-4 border border-chaos/20">
                <h4 className="text-center font-semibold mb-2 text-chaos">After Vexoth's Curse:</h4>
                <div className="flex space-x-2 justify-center mb-4">
                  {finalResults.map((result, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm
                        ${result >= 0 ? "bg-divine text-divine-secondary" : "bg-chaos text-white"}
                      `}
                    >
                      {result >= 0 ? `+${result}` : result}
                    </div>
                  ))}
                </div>
                <div className="text-center p-3 bg-fantasy-gold/10 rounded border border-fantasy-gold/20">
                  <p className="font-semibold text-fantasy-gold">
                    Distribute these values freely to STR, CON, DEX, INT, WIS, CHA
                  </p>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex space-x-4">
              {!isRolling && rolls.length > 0 && (
                <Button
                  onClick={resetDice}
                  variant="secondary"
                  className="border-fantasy-silver/20"
                >
                  Roll Again
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="border-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold/10"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Vexoth's Curse - Right Side */}
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="w-32 h-32 rounded-full overflow-hidden chaos-glow border-2 border-chaos">
              <img
                src={vexothCurse}
                alt="Vexoth's Curse"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-chaos">Vexoth's Curse</h3>
            <p className="text-sm text-center text-chaos/80">
              Chaos diminishes your fortune<br />
              <span className="text-xs">(-10, -8, -6, -4, -2, 0)</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};