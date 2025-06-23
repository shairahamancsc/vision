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
import { ScanBarcode, Loader2, Camera, Ticket } from 'lucide-react';
import { getDiagnostics } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import type { DiagnosisData } from '@/app/page';
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (!isScannerOpen) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      return;
    }

    const getCameraPermission = async () => {
      if (typeof window === "undefined" || !navigator.mediaDevices) {
        setHasCameraPermission(false);
        return;
      }
      
      setHasCameraPermission(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use the scanner.",
        });
      }
    };

    getCameraPermission();
  }, [isScannerOpen, toast]);

  const handleSimulateScan = () => {
    // In a production app, a library like `react-qr-reader` would be used here.
    form.setValue("model", `Scanned-Model-${Math.floor(100 + Math.random() * 900)}`);
    setIsScannerOpen(false);
    toast({
      title: "Scan Successful",
      description: "Device model has been populated.",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDiagnosis(null);
    try {
      // This server action creates a ticket.
      // In a real app, this would also save the details to your Supabase database.
      const result = await getDiagnostics(values);
      if (result) {
        setDiagnosis(result);
        toast({
          title: "Ticket Created",
          description: `Repair ticket ${result.ticketId} has been generated.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Ticket Creation Failed",
          description: "Could not create a ticket. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong while creating the ticket.",
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
                             <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                              <DialogTrigger asChild>
                                  <Button type="button" variant="outline" size="icon" aria-label="Scan barcode">
                                      <ScanBarcode />
                                  </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Scan Device Barcode</DialogTitle>
                                  <DialogDescription>
                                    Position the device's barcode or QR code in front of the camera.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="p-4 bg-muted rounded-md relative overflow-hidden">
                                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
                                    {hasCameraPermission === false && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertTitle>Camera Access Required</AlertTitle>
                                            <AlertDescription>
                                            Please allow camera access to use this feature. You may need to refresh the page after granting permission.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    {hasCameraPermission === null && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                            <Loader2 className="animate-spin" />
                                            <span className="ml-2">Requesting camera...</span>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                  <Button type="button" onClick={handleSimulateScan} disabled={!hasCameraPermission}>
                                    <Camera className="mr-2" />
                                    Simulate Scan
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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
                            <Input placeholder="Rohan Kumar" {...field} />
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
                            <Input placeholder="9876543210" {...field} />
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
                        <Input placeholder="123, MG Road, Bangalore, 560001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Ticket className="mr-2" />}
              {isLoading ? "Generating..." : "Create Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
