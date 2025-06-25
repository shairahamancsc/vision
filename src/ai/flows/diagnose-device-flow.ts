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
  potentialSolutions: z.array(z.string()).describe('A list of potential solutions or diagnostic steps for the identified issues.'),
});

export type DiagnoseDeviceOutput = z.infer<typeof DiagnoseDeviceOutputSchema>;

export async function diagnoseDevice(input: DiagnoseDeviceInput): Promise<DiagnoseDeviceOutput> {
  return diagnoseDeviceFlow(input);
}

const diagnoseDevicePrompt = ai.definePrompt({
  name: 'diagnoseDevicePrompt',
  input: {schema: DiagnoseDeviceInputSchema},
  output: {schema: DiagnoseDeviceOutputSchema},
  prompt: `You are an expert technician AI specializing in diagnosing device issues.
A customer has submitted a repair request with the following details.

Device Information:
- Brand: {{{brand}}}
- Model: {{{model}}}
- Stated Problem: {{{problemDescription}}}

Based *only* on the information provided, analyze the potential problems with the device.
Provide a list of the most likely issues and a corresponding list of potential solutions or diagnostic steps a technician should take.
Be concise and clear in your suggestions.`,
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
