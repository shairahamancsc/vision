"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScanBarcode, Bot, Loader2 } from 'lucide-react';
import { getDiagnostics } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import type { DiagnosisData } from '@/app/page';

const formSchema = z.object({
  brand: z.string().min(2, "Brand is required."),
  model: z.string().min(1, "Model is required."),
  customerName: z.string().min(2, "Customer name is required."),
  mobileNumber: z.string().min(10, "A valid mobile number is required."),
  address: z.string().min(5, "Address is required."),
  problemDescription: z.string().min(10, "Please provide a detailed problem description."),
});

type DeviceFormProps = {
  setDiagnosis: (data: DiagnosisData | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
};

export function DeviceForm({ setDiagnosis, setIsLoading, isLoading }: DeviceFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      customerName: "",
      mobileNumber: "",
      address: "",
      problemDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDiagnosis(null);
    try {
      const result = await getDiagnostics(values);
      if (result) {
        setDiagnosis(result);
        toast({
          title: "Diagnosis Complete",
          description: `Repair ticket ${result.ticketId} has been generated.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Diagnosis Failed",
          description: "Could not get a diagnosis. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong. Please check the console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Apple" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <div className="flex gap-2">
                            <FormControl>
                                <Input placeholder="e.g., iPhone 14 Pro" {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" size="icon" aria-label="Scan barcode">
                                <ScanBarcode />
                            </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="problemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the issue with the device..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                            <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                            <Input placeholder="123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Bot className="mr-2" />}
              {isLoading ? "Diagnosing..." : "Diagnose with AI"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
