"use server";

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    // Apply zod validation to formData
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    // Convert to cents to avoid floating point errors
    const amountInCents = amount * 100;
    // Format the date as "YYYY-MM-DD" string
    const date = new Date().toISOString().split('T')[0];


    try {
        // Insert data into db
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
            `;
    } catch (error) {
        console.error('Database Error: Failed to Create Invoice.', error);
        throw new Error('Database Error: Failed to Create Invoice.');
    }

    // Invalidate the cache
    revalidatePath('/dashboard/invoices');
    // Only reachable if there are no errors
    // Send user back to invoices onSubmit
    redirect('/dashboard/invoices');
}



export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
    } catch (error) {
        console.error('Database Error: Failed to Update Invoice.', error);
        throw new Error('Database Error: Failed to Update Invoice.');
    }

    revalidatePath('/dashboard/invoices');
    // Only reachable if there are no errors
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to Delete Invoice.');
    }
}