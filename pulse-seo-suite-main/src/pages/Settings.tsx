import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Users, Plug, CreditCard, Check, Plus } from "lucide-react";

const teamMembers = [
  { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { name: "Jane Smith", email: "jane@example.com", role: "Analyst", status: "Active" },
  { name: "Bob Wilson", email: "bob@example.com", role: "Analyst", status: "Invited" },
];

const integrations = [
  { name: "Google Search Console", icon: "GSC", connected: true },
  { name: "Google Analytics", icon: "GA", connected: true },
  { name: "Ahrefs", icon: "AH", connected: false },
  { name: "SEMrush", icon: "SR", connected: false },
];

const Settings = () => {
  return (
    <DashboardLayout title="Settings">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card border border-border mb-6">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card rounded-xl p-6 card-shadow border border-border animate-fade-in max-w-2xl">
            <h3 className="font-semibold text-foreground mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">First Name</label>
                  <Input defaultValue="John" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Last Name</label>
                  <Input defaultValue="Doe" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                <Input type="email" defaultValue="john@example.com" />
              </div>
              <Button>Save Changes</Button>
            </div>

            <div className="border-t border-border mt-8 pt-6">
              <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Current Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">New Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Confirm New Password</label>
                  <Input type="password" />
                </div>
                <Button variant="outline">Update Password</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="bg-card rounded-xl card-shadow border border-border animate-fade-in">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Team Members</h3>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Invite User
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.email} className="border-border">
                    <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          member.status === "Active"
                            ? "bg-success text-success-foreground"
                            : "bg-warning text-warning-foreground"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-2 gap-4 max-w-3xl">
            {integrations.map((int) => (
              <div
                key={int.name}
                className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center justify-between animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{int.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{int.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {int.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button variant={int.connected ? "outline" : "default"} size="sm">
                  {int.connected ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="max-w-2xl space-y-6">
            <div className="bg-card rounded-xl p-6 card-shadow border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Current Plan</h3>
                <Badge className="bg-primary text-primary-foreground">Pro</Badge>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-foreground">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-4">
                10 websites, unlimited keywords, all features
              </p>
              <div className="flex gap-3">
                <Button>Upgrade Plan</Button>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 card-shadow border border-border animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">Billing Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next billing date</span>
                  <span className="text-foreground">January 1, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment method</span>
                  <span className="text-foreground">Visa ending in 4242</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
