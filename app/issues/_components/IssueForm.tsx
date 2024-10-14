'use client';

import Spinner from '@/app/components/Spinner';
import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import { Issue } from '@prisma/client';


type IssueFormData = z.infer<typeof issueSchema>;

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
});

const NewIssuePage = ({ issue }: { issue?: Issue }) => {

    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
        resolver: zodResolver(issueSchema)
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    return (
        <div className="max-w-xl">
            {error && (
                <Callout.Root color="red" className='mb-5'>
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}
            <form
                className="space-y-3"
                onSubmit={handleSubmit(async (data) => {
                    try {
                        setIsSubmitting(true);

                        if (issue) await axios.patch('/api/issues/' + issue.id, data);
                        else await axios.post('/api/issues', data);

                        router.push('/issues');
                        router.refresh();
                    } catch (error) {
                        setIsSubmitting(false);
                        setError('An unexpected error occurred.');
                    }
                })}
            >
                <TextField.Root defaultValue={issue?.title} placeholder="Title" {...register('title')} />
                {errors.title && <Text color="red" as="p">{errors.title.message}</Text>}
                <Controller
                    name="description"
                    control={control}
                    defaultValue={issue?.description}
                    render={({ field }) => (
                        <SimpleMDE placeholder="Description" {...field} />
                    )}
                />
                {errors.description && <Text color="red" as="p">{errors.description.message}</Text>}
                <Button disabled={isSubmitting}>
                    {issue ? 'Update Issue' : 'Submit New Issue'}{' '}
                    {isSubmitting && <Spinner />} 
                </Button>
            </form>
        </div>
    )
}

export default NewIssuePage