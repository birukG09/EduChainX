import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    ipWhitelist: false,
  });

  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Development API', key: 'edx_dev_***', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Production API', key: 'edx_prod_***', created: '2024-01-10', lastUsed: '5 minutes ago' },
  ]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // This would normally update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const generateApiKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      // Mock API key generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Date.now().toString(),
        name,
        key: `edx_${Math.random().toString(36).slice(2, 15)}_***`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never'
      };
    },
    onSuccess: (newApiKey) => {
      setApiKeys(prev => [...prev, newApiKey]);
      toast({
        title: "API Key Generated",
        description: "New API key has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: "API key has been removed successfully",
    });
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account, security, and system preferences">
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700" data-testid="tab-profile">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700" data-testid="tab-security">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700" data-testid="tab-notifications">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-slate-700" data-testid="tab-api">
            API Keys
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-slate-700" data-testid="tab-system">
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profileImageUrl || ""} className="object-cover" />
                  <AvatarFallback className="bg-slate-600 text-white text-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-slate-400">{user?.email}</p>
                  <Badge className="mt-2 bg-blue-900/30 text-blue-400 border-blue-700">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
                  </Badge>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">First Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="bg-slate-700 border-slate-600 text-white" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="bg-teal-500 hover:bg-teal-600" 
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-slate-700">
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                  data-testid="switch-two-factor"
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-700">
                <div>
                  <h4 className="text-white font-medium">IP Whitelist</h4>
                  <p className="text-sm text-slate-400">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  checked={security.ipWhitelist}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, ipWhitelist: checked }))}
                  data-testid="switch-ip-whitelist"
                />
              </div>

              <div className="py-4">
                <Label htmlFor="session-timeout" className="text-white font-medium">Session Timeout (minutes)</Label>
                <p className="text-sm text-slate-400 mb-3">Automatically log out after period of inactivity</p>
                <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white" data-testid="select-session-timeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Button variant="destructive" data-testid="button-change-password">
                  <i className="fas fa-key mr-2"></i>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-slate-700">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-sm text-slate-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  data-testid="switch-email-notifications"
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-700">
                <div>
                  <h4 className="text-white font-medium">Push Notifications</h4>
                  <p className="text-sm text-slate-400">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                  data-testid="switch-push-notifications"
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-700">
                <div>
                  <h4 className="text-white font-medium">SMS Notifications</h4>
                  <p className="text-sm text-slate-400">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  data-testid="switch-sms-notifications"
                />
              </div>

              <div className="pt-4">
                <h4 className="text-white font-medium mb-3">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    'Transcript verifications',
                    'Anomaly detections',
                    'University registrations',
                    'System updates',
                    'Security alerts'
                  ].map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-slate-300">{type}</span>
                      <Switch defaultChecked data-testid={`switch-${type.toLowerCase().replace(/\s+/g, '-')}`} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">API Keys</CardTitle>
                <Button 
                  className="bg-teal-500 hover:bg-teal-600"
                  onClick={() => {
                    const name = prompt("Enter API key name:");
                    if (name) generateApiKeyMutation.mutate(name);
                  }}
                  disabled={generateApiKeyMutation.isPending}
                  data-testid="button-generate-api-key"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div 
                    key={apiKey.id} 
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                    data-testid={`api-key-${apiKey.id}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-white" data-testid={`text-key-name-${apiKey.id}`}>
                        {apiKey.name}
                      </h4>
                      <p className="text-sm font-mono text-slate-300" data-testid={`text-key-value-${apiKey.id}`}>
                        {apiKey.key}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" data-testid={`button-copy-${apiKey.id}`}>
                        <i className="fas fa-copy"></i>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteApiKey(apiKey.id)}
                        data-testid={`button-delete-${apiKey.id}`}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <div className="text-center py-8">
                    <i className="fas fa-key text-slate-600 text-3xl mb-2"></i>
                    <p className="text-slate-400">No API keys generated yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="blockchain-network" className="text-white font-medium">Blockchain Network</Label>
                    <Select defaultValue="polygon-testnet">
                      <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-2" data-testid="select-blockchain-network">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="polygon-testnet">Polygon Testnet</SelectItem>
                        <SelectItem value="polygon-mainnet">Polygon Mainnet</SelectItem>
                        <SelectItem value="ethereum-sepolia">Ethereum Sepolia</SelectItem>
                        <SelectItem value="base-testnet">Base Testnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ipfs-gateway" className="text-white font-medium">IPFS Gateway</Label>
                    <Input
                      id="ipfs-gateway"
                      defaultValue="https://gateway.pinata.cloud"
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                      data-testid="input-ipfs-gateway"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gas-limit" className="text-white font-medium">Default Gas Limit</Label>
                    <Input
                      id="gas-limit"
                      defaultValue="3000000"
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                      data-testid="input-gas-limit"
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-risk-score" className="text-white font-medium">Max Risk Score Threshold</Label>
                    <Input
                      id="max-risk-score"
                      defaultValue="8.5"
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                      data-testid="input-max-risk-score"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <h4 className="text-white font-medium mb-4">Data Management</h4>
                <div className="flex space-x-4">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-export-data">
                    <i className="fas fa-download mr-2"></i>
                    Export Data
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-backup-system">
                    <i className="fas fa-database mr-2"></i>
                    Backup System
                  </Button>
                  <Button variant="destructive" data-testid="button-clear-cache">
                    <i className="fas fa-trash mr-2"></i>
                    Clear Cache
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-slate-400">Temporarily disable the system for maintenance</p>
                  </div>
                  <Switch data-testid="switch-maintenance-mode" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
