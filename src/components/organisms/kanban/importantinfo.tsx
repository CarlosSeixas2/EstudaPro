import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

export function ImportantInfo() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Informações Importantes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/10">
          <Info className="h-5 w-5 text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-foreground">
              Lembrete de Reunião
            </h4>
            <p className="text-sm text-muted-foreground">
              Reunião de alinhamento do projeto na sexta-feira às 10:00. Não se
              esqueça de preparar a apresentação.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-500/10">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
          <div>
            <h4 className="font-semibold text-foreground">
              Prazo se Aproximando
            </h4>
            <p className="text-sm text-muted-foreground">
              A entrega da versão beta para o cliente é na próxima
              segunda-feira. Focar nas tarefas de alta prioridade.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-lg bg-green-500/10">
          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-semibold text-foreground">Deploy Realizado</h4>
            <p className="text-sm text-muted-foreground">
              O último deploy foi concluído com sucesso e sem erros reportados
              nas últimas 24 horas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
