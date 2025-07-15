import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MotivationalPhraseProps {
  phrase: string;
}

export const MotivationalPhrase = ({ phrase }: MotivationalPhraseProps) => (
  <Card className="relative overflow-hidden rounded-2xl p-6 shadow-soft">
    <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Sparkles className="h-5 w-5" />
    </div>
    <h4 className="font-semibold text-card-foreground">Pílula de Motivação</h4>
    <p className="mt-2 text-sm text-muted-foreground italic">"{phrase}"</p>
  </Card>
);
