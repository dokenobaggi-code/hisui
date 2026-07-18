import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarRating } from "@/components/StarRating";
import { formatJaDate } from "@/lib/utils";
import type { HistoryRow } from "@/types";

/** 履歴一覧テーブル（レスポンシブ）。 */
export function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">日付</TableHead>
          <TableHead className="whitespace-nowrap">おすすめ度</TableHead>
          <TableHead className="whitespace-nowrap text-right">波高</TableHead>
          <TableHead className="whitespace-nowrap text-right">風速</TableHead>
          <TableHead className="whitespace-nowrap">天気</TableHead>
          <TableHead className="min-w-[16rem]">理由</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="whitespace-nowrap font-medium">
              {formatJaDate(row.date)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <StarRating score={row.score} size={16} />
                <span className="text-xs text-muted-foreground">{row.score}/5</span>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap text-right">
              {row.waveHeight != null ? `${row.waveHeight.toFixed(1)} m` : "—"}
            </TableCell>
            <TableCell className="whitespace-nowrap text-right">
              {row.windSpeed != null ? `${row.windSpeed.toFixed(1)} m/s` : "—"}
            </TableCell>
            <TableCell className="whitespace-nowrap">{row.weather || "—"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{row.reason || "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
