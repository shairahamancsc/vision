// diagnose-device-flow.ts
'use server';

/**
 * @fileOverview An AI agent for diagnosing device issues based on device details and problem descriptions.
 *
 * - diagnoseDevice - A function that handles the device diagnosis process.
 * - DiagnoseDeviceInput - The input type for the diagnoseDevice function.
 * - DiagnoseDeviceOutput - The return type for the diagnoseDevice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseDeviceInputSchema = z.object({
  brand: z.string().describe('The brand of the device.'),
  model: z.string().describe('The model of the device.'),
  customerName: z.string().describe('The name of the customer.'),
  mobileNumber: z.string().describe('The mobile number of the customer.'),
  address: z.string().describe('The address of the customer.'),
  problemDescription: z.string().describe('A detailed description of the problem with the device.'),
});

export type DiagnoseDeviceInput = z.infer<typeof DiagnoseDeviceInputSchema>;

const DiagnoseDeviceOutputSchema = z.object({
  suggestedIssues: z.array(z.string()).describe('A list of suggested common issues based on the device details and problem description.'),
  potentialSolutions: z.array(z.string()).describe('A list of potential solutions for the identified issues.'),
});

export type DiagnoseDeviceOutput = z.infer<typeof DiagnoseDeviceOutputSchema>;

export async function diagnoseDevice(input: DiagnoseDeviceInput): Promise<DiagnoseDeviceOutput> {
  return diagnoseDeviceFlow(input);
}

const diagnoseDevicePrompt = ai.definePrompt({
  name: 'diagnoseDevicePrompt',
  input: {schema: DiagnoseDeviceInputSchema},
  output: {schema: DiagnoseDeviceOutputSchema},
  prompt: `You are an expert technician specializing in diagnosing device issues.

  Based on the provided device details and problem description, suggest common issues and potential solutions.
  Consider the model number when forming the response.

  Device Details:
  - Brand: {{{brand}}}
  - Model: {{{model}}}
  - Problem Description: {{{problemDescription}}}

  Customer Details:
  - Name: {{{customerName}}}
  - Mobile Number: {{{mobileNumber}}}
  - Address: {{{address}}}

  Suggested Issues:
  - Issue 1
  - Issue 2

  Potential Solutions:
  - Solution 1
  - Solution 2`,
});

const diagnoseDeviceFlow = ai.defineFlow(
  {
    name: 'diagnoseDeviceFlow',
    inputSchema: DiagnoseDeviceInputSchema,
    outputSchema: DiagnoseDeviceOutputSchema,
  },
  async input => {
    const {output} = await diagnoseDevicePrompt(input);
    return output!;
  }
);
