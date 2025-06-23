"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

const formSchema = z.object({
  ticketId: z.string().regex(/^DRX-\d{6}$/, 'Invalid ticket format. Should be DRX-123456.'),
});

type TicketStatusFormProps = {
    onTrack: (ticketId: string) => void;
    isLoading: boolean;
};

export function TicketStatusForm({ onTrack, isLoading }: TicketStatusFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketId: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onTrack(values.ticketId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start">
        <FormField
          control={form.control}
          name="ticketId"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="Enter your ticket ID (e.g., DRX-123456)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-28">
          {isLoading ? <Loader2 className="animate-spin" /> : <><Search className="mr-2 h-4 w-4" />Track</>}
        </Button>
      </form>
    </Form>
  );
}
