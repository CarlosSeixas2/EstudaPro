import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Item = {
  id: string;
  title: string;
  content?: string;
  tag?: string;
  createdAt: string;
};

interface ItemListCardProps {
  title: string;
  items: Item[];
  icon: React.ElementType;
  emptyText: string;
  type: "kanbantask" | "note";
}

export const ItemListCard = ({
  title,
  items,
  icon: Icon,
  emptyText,
  type,
}: ItemListCardProps) => {
  const getIconText = (item: Item) => {
    if (type === "note") return item.title?.substring(0, 1) || "?";
    if (type === "kanbantask") return item.tag?.substring(0, 1) || "T";
    return "";
  };

  const getSecondaryText = (item: Item) => {
    if (type === "note") {
      return item.content
        ? `${item.content.substring(0, 40)}...`
        : "Nenhum conteúdo";
    }
    return `Criado em: ${new Date(item.createdAt).toLocaleDateString()}`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {items?.length > 0 ? (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-4 transition-colors hover:bg-muted/50 p-2 rounded-lg cursor-pointer"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-xs text-center ${
                    item.tag === "Bug"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {getIconText(item)}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {getSecondaryText(item)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
            <Icon className="h-8 w-8 mb-4" />
            <p className="text-sm">{emptyText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
