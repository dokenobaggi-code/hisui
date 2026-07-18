import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";

interface ScoreCardProps {
  score: number;
  reason: string;
}

/** 今日のおすすめ度と理由を大きく表示するメインカード。 */
export function ScoreCard({ score, reason }: ScoreCardProps) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="hisui-gradient">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            今日のヒスイ拾いおすすめ度
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <StarRating score={score} size={36} />
            <span className="text-4xl font-bold text-primary">
              {Math.round(score)}
              <span className="text-lg font-medium text-muted-foreground"> / 5</span>
            </span>
          </div>
          <p className="text-base leading-relaxed text-foreground/90">{reason}</p>
        </CardContent>
      </div>
    </Card>
  );
}
