'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { Atom } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdvancedOptionsFields from './components/AdvancedOptionsFields';
import Greeter from './components/Greeter';
import Heading from './components/Heading';
import Messages from './components/Messages';
import ModelOptionsFields from './components/ModelOptionsFields';
import TestOptionFields from './components/TestOptionsFields';
import { generationSchema } from './constants/schemas';
import generate from './utils/generate';

export default function Home() {
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [failed, setFailed] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof generationSchema>>({
        resolver: zodResolver(generationSchema),
    });

    useEffect(() => {
        const localFormDataRaw = localStorage.getItem('formData');
        if (localFormDataRaw) {
            try {
                const localFormData = JSON.parse(localFormDataRaw);
                reset(localFormData);
                return;
            } catch {}
        }
        reset({
            questionCount: 5,
            language: 'English',
            explainAnswers: true,
            testType: 'multiple-choice',
            difficulty: 3,
            creativity: 50,
            choiceCount: 4,
        });
    }, [reset]);

    async function onSubmit(data: z.infer<typeof generationSchema>) {
        setLoader(true);
        setFailed(false);
        const generation = await generate(data);
        if (!generation || generation.failed) {
            setFailed(true);
        } else if (generation.errors) {
            Object.entries(generation.errors).forEach(([field, error]) => {
                if (error) {
                    setError(field as keyof typeof errors, {
                        message: error[0],
                    });
                }
            });
        } else if (generation.document) {
            localStorage.setItem('formData', JSON.stringify(data));
            localStorage.setItem(
                'questions',
                JSON.stringify(generation.document),
            );
            router.push('/document');
        }
        setLoader(false);
    }

    return (
        <>
            <Greeter />
            <Heading />
            <main>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mb-4"
                >
                    <TestOptionFields
                        register={register}
                        errors={errors}
                        control={control}
                    />
                    <hr className="dark:border-gray-700" />
                    <ModelOptionsFields
                        register={register}
                        errors={errors}
                        watchModel={watch('modelName')}
                    />
                    <AdvancedOptionsFields
                        register={register}
                        errors={errors}
                        control={control}
                        watchTestType={watch('testType')}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        endContent={<Atom size={16} />}
                        isLoading={loader}
                    >
                        Generate
                    </Button>
                    <Messages
                        watchCustomInstructions={watch('customInstructions')}
                        failed={failed}
                        loader={loader}
                    />
                </form>
            </main>
        </>
    );
}
