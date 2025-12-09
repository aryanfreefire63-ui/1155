import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pages = [
  { page: "/Home", sessions: "36,642", clicks: "25,642", ctr: "13.23%" },
  { page: "/Shop", sessions: "33,244", clicks: "23,942", ctr: "12.99%" },
  { page: "/About", sessions: "30,935", clicks: "20,846", ctr: "12.08%" },
  { page: "/Blog", sessions: "28,441", clicks: "18,234", ctr: "11.54%" },
  { page: "/Contact", sessions: "22,156", clicks: "14,892", ctr: "10.87%" },
];

interface PagePerformanceTableProps {
  title?: string;
}

export function PagePerformanceTable({ title = "Page performance" }: PagePerformanceTableProps) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground font-medium">Page</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Sessions</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Clicks</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">CTR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.page} className="border-border">
              <TableCell className="text-foreground font-medium">{page.page}</TableCell>
              <TableCell className="text-right text-muted-foreground">{page.sessions}</TableCell>
              <TableCell className="text-right text-muted-foreground">{page.clicks}</TableCell>
              <TableCell className="text-right text-muted-foreground">{page.ctr}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
