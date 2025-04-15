import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert as AlertType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editAlert, setEditAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    // Load alerts from localStorage on initial render
    const savedAlerts = localStorage.getItem('helper-alerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  useEffect(() => {
    // Save alerts to localStorage whenever the alerts state changes
    localStorage.setItem('helper-alerts', JSON.stringify(alerts));
  }, [alerts]);

  const alertSchema = z.object({
    type: z.string().min(2, {
      message: "Alert type must be at least 2 characters.",
    }),
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    location: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
    severity: z.enum(['critical', 'high', 'medium', 'low']),
    instructions: z.string().min(10, {
      message: "Instructions must be at least 10 characters.",
    }),
  })
  
  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
      location: "",
      severity: "low",
      instructions: "",
    },
  })

  const handleCreateAlert = (data: any) => {
    const newAlert: AlertType = {
      id: Date.now().toString(),
      type: data.type,
      title: data.title,
      description: data.description,
      location: data.location,
      time: new Date().toISOString(),
      severity: data.severity as "critical" | "high" | "medium" | "low",
      instructions: data.instructions.split('\n').filter(Boolean)
    };
    setAlerts(prev => [...prev, newAlert]);
    toast({
      title: "Alert created",
      description: "Your alert has been created.",
    });
    setOpen(false);
    form.reset();
  };

  const handleUpdateAlert = (data: any) => {
    if (!editAlert) return;
    
    const updatedAlert: AlertType = {
      id: editAlert.id,
      type: data.type,
      title: data.title,
      description: data.description,
      location: data.location,
      time: new Date().toISOString(),
      severity: data.severity as "critical" | "high" | "medium" | "low",
      instructions: data.instructions.split('\n').filter(Boolean)
    };
    
    setAlerts(prev => prev.map(alert => alert.id === editAlert.id ? updatedAlert : alert));
    toast({
      title: "Alert updated",
      description: "Your alert has been updated.",
    });
    setEditAlert(null);
    setOpen(false);
    form.reset();
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert deleted",
      description: "Your alert has been deleted.",
    });
  };

  const handleEdit = (alert: AlertType) => {
    setEditAlert(alert);
    form.setValue("type", alert.type);
    form.setValue("title", alert.title);
    form.setValue("description", alert.description);
    form.setValue("location", alert.location);
    form.setValue("severity", alert.severity);
    form.setValue("instructions", alert.instructions.join('\n'));
    setOpen(true);
  };

  return (
    <Layout title="Alerts">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Alerts</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create Alert</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-helper-darkgray border-helper-darkgray">
              <DialogHeader>
                <DialogTitle>{editAlert ? "Edit Alert" : "Create Alert"}</DialogTitle>
                <DialogDescription>
                  {editAlert ? "Edit the alert details." : "Create a new alert."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(editAlert ? handleUpdateAlert : handleCreateAlert)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alert type" className="bg-helper-black border-helper-darkgray" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alert title" className="bg-helper-black border-helper-darkgray" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter alert description"
                            className="bg-helper-black border-helper-darkgray resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alert location" className="bg-helper-black border-helper-darkgray" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-helper-black border-helper-darkgray">
                              <SelectValue placeholder="Select a severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-helper-black border-helper-darkgray">
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter alert instructions (one per line)"
                            className="bg-helper-black border-helper-darkgray resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {editAlert ? "Update Alert" : "Create Alert"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-helper-darkgray border-helper-darkgray">
          <CardContent className="p-0">
            <Table>
              <TableCaption>A list of your alerts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.type}</TableCell>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>{alert.severity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="icon" onClick={() => handleEdit(alert)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteAlert(alert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {alerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No alerts created yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Alerts;
