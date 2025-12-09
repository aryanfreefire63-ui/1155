import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const keywords = [
  { keyword: "seo tools", volume: "12,100", kd: 45, cpc: "$4.50", intent: "Commercial" },
  { keyword: "keyword research", volume: "8,100", kd: 52, cpc: "$3.80", intent: "Informational" },
  { keyword: "seo analysis", volume: "6,600", kd: 38, cpc: "$5.20", intent: "Commercial" },
  { keyword: "backlink checker", volume: "5,400", kd: 41, cpc: "$4.10", intent: "Transactional" },
  { keyword: "rank tracker", volume: "4,400", kd: 35, cpc: "$3.50", intent: "Commercial" },
  { keyword: "site audit tool", volume: "3,600", kd: 48, cpc: "$6.00", intent: "Transactional" },
  { keyword: "on page seo", volume: "2,900", kd: 32, cpc: "$2.80", intent: "Informational" },
];

const getIntentColor = (intent: string) => {
  switch (intent) {
    case "Commercial":
      return "bg-primary/10 text-primary";
    case "Informational":
      return "bg-success/10 text-success";
    case "Transactional":
      return "bg-warning/10 text-warning";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getKDColor = (kd: number) => {
  if (kd < 30) return "text-success";
  if (kd < 50) return "text-warning";
  return "text-destructive";
};

const KeywordResearch = () => {
  return (
    <DashboardLayout title="Keyword Research">
      {/* Search Section */}
      <div className="bg-card rounded-xl p-5 card-shadow border border-border mb-6 animate-fade-in">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter seed keyword or URL..."
              className="h-11"
            />
          </div>
          <Select defaultValue="us">
            <SelectTrigger className="w-40 h-11">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-11 gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-card rounded-xl card-shadow border border-border animate-fade-in">
        <Tabs defaultValue="ideas" className="w-full">
          <div className="border-b border-border px-5 pt-4">
            <TabsList className="bg-transparent border-0 p-0 gap-6">
              <TabsTrigger
                value="ideas"
                className="border-0 bg-transparent px-0 pb-3 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Keyword Ideas
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="border-0 bg-transparent px-0 pb-3 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Questions
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="border-0 bg-transparent px-0 pb-3 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Related
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ideas" className="mt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="text-muted-foreground font-medium">Keyword</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Volume</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">KD</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">CPC</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Intent</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw) => (
                  <TableRow key={kw.keyword} className="border-border">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{kw.keyword}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{kw.volume}</TableCell>
                    <TableCell className={`text-right font-medium ${getKDColor(kw.kd)}`}>
                      {kw.kd}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{kw.cpc}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getIntentColor(kw.intent)}>
                        {kw.intent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="questions" className="p-5">
            <p className="text-muted-foreground">Question-based keywords will appear here.</p>
          </TabsContent>

          <TabsContent value="related" className="p-5">
            <p className="text-muted-foreground">Related keywords will appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default KeywordResearch;
