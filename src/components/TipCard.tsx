import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** ヒスイ拾いワンポイントカード。 */
export function TipCard({ tip }: { tip: string }) {
  return (
    <Card className="border-primary/20 bg-accent/40">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Lightbulb className="h-5 w-5 text-primary" />
        <CardTitle>ヒスイ拾いワンポイント</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-foreground/90">{tip}</p>
      </CardContent>
    </Card>
  );
}
