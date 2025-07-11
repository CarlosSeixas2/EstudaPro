import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings, Brain, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SessionType = "focus" | "break";

interface PomodoroTimerProps {
  onSessionComplete: () => void;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const [session, setSession] = useState<SessionType>("focus");
  const [time, setTime] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);

  const totalDuration =
    session === "focus" ? focusDuration * 60 : breakDuration * 60;
  const progress =
    totalDuration > 0 ? ((totalDuration - time) / totalDuration) * 100 : 0;

  // Atualiza o tempo do timer se a duração for alterada
  useEffect(() => {
    if (!isActive) {
      setTime(session === "focus" ? focusDuration * 60 : breakDuration * 60);
    }
  }, [focusDuration, breakDuration, session, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      if (session === "focus") {
        onSessionComplete(); // Notifica que um ciclo de foco terminou
        setSession("break");
        setTime(breakDuration * 60);
      } else {
        setSession("focus");
        setTime(focusDuration * 60);
      }
      // A notificação de som/visual pode ser adicionada aqui
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    time,
    session,
    onSessionComplete,
    breakDuration,
    focusDuration,
  ]);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSession("focus");
    setTime(focusDuration * 60);
  }, [focusDuration]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{session === "focus" ? "Hora de Focar!" : "Pausa Rápida"}</span>
          {session === "focus" ? (
            <Brain className="h-6 w-6 text-primary" />
          ) : (
            <Coffee className="h-6 w-6 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="text-7xl font-bold font-mono tracking-tighter">
          {formatTime(time)}
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={toggleTimer} className="w-32">
            {isActive ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> Pausar
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Iniciar
              </>
            )}
          </Button>
          <Button size="lg" variant="outline" onClick={resetTimer}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="lg" variant="outline">
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="focus-duration">
                    Tempo de Foco (minutos)
                  </Label>
                  <Input
                    id="focus-duration"
                    type="number"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-duration">
                    Tempo de Pausa (minutos)
                  </Label>
                  <Input
                    id="break-duration"
                    type="number"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
