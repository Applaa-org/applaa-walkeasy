import { useState, useEffect } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Index = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkTime, setWalkTime] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('walkeasy-data');
    if (savedData) {
      const { date, completed } = JSON.parse(savedData);
      const today = new Date().toDateString();
      
      if (date === today) {
        setCompletedToday(completed);
      }
    }
  }, []);

  // Save state to localStorage when walk is completed
  useEffect(() => {
    if (completedToday) {
      const today = new Date().toDateString();
      localStorage.setItem('walkeasy-data', JSON.stringify({
        date: today,
        completed: true
      }));
    }
  }, [completedToday]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;
    
    if (isWalking) {
      interval = setInterval(() => {
        setWalkTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWalking]);

  const startWalk = () => {
    setIsWalking(true);
    setCompletedToday(false);
    setShowCelebration(false);
  };

  const finishWalk = () => {
    setIsWalking(false);
    setCompletedToday(true);
    setShowCelebration(true);
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const resetWalk = () => {
    setWalkTime(0);
    setIsWalking(false);
    setShowCelebration(false);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">WalkEasy</h1>
          <p className="text-lg text-indigo-600">Simple daily walking made easy</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          {/* Walk Status Indicator */}
          <div className="mb-10 w-full max-w-md">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {completedToday ? 'Walk Completed Today!' : 'Ready for a Walk?'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {/* Visual indicator */}
                  <div className="relative w-48 h-48 mb-6">
                    <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-500 ${
                      completedToday 
                        ? 'bg-green-100 border-8 border-green-400' 
                        : 'bg-indigo-100 border-8 border-indigo-300'
                    }`}>
                      {completedToday ? (
                        <div className="text-5xl text-green-600">✓</div>
                      ) : (
                        <div className="text-5xl text-indigo-500">👣</div>
                      )}
                    </div>
                    
                    {/* Celebration effect */}
                    {showCelebration && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center">
                        <div className="text-6xl animate-bounce">🎉</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Walk time display */}
                  {isWalking && (
                    <div className="text-3xl font-mono font-bold text-indigo-700 mb-4">
                      {formatTime(walkTime)}
                    </div>
                  )}
                  
                  {/* Encouraging message */}
                  <p className="text-center text-lg text-gray-600 mb-6">
                    {completedToday 
                      ? "Great job! You're taking care of yourself." 
                      : isWalking 
                        ? "Enjoy your walk! Take your time." 
                        : "Just a few minutes can make a difference."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            {!isWalking ? (
              <Button
                size="lg"
                className="flex-1 h-16 text-lg bg-green-500 hover:bg-green-600"
                onClick={startWalk}
                disabled={completedToday}
              >
                <Play className="mr-2 h-6 w-6" />
                Start Walk
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1 h-16 text-lg bg-red-500 hover:bg-red-600"
                onClick={finishWalk}
              >
                <Square className="mr-2 h-6 w-6" />
                Finish Walk
              </Button>
            )}
            
            {(isWalking || walkTime > 0) && (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-16 text-lg"
                onClick={resetWalk}
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Reset
              </Button>
            )}
          </div>
        </main>

        <footer className="mt-12 text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Educational only. Not fitness advice.
            </p>
          </div>
          <MadeWithApplaa />
        </footer>
      </div>
    </div>
  );
};

export default Index;