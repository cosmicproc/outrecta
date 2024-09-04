'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import {
    Accordion,
    AccordionItem,
    Button,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    Slider,
    Textarea,
    Tooltip,
} from '@nextui-org/react';
import {
    Apple,
    Atom,
    Candy,
    Frown,
    Info,
    Smile,
    TriangleAlert,
    Zap,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { generationSchema, models } from './constants/schemas';
import { z } from 'zod';
import generate from './utils/generate';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Greeter from './components/Greeter';

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
            const localFormData = generationSchema.safeParse(
                JSON.parse(localFormDataRaw),
            );
            if (localFormData.success) {
                localFormData.data.topic = '';
                reset(localFormData.data);
                return;
            }
        }
        reset({
            questionCount: 5,
            testType: 'multiple-choice',
            difficulty: 5,
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

    const modelNames = {
        'openai-4o': 'GPT4o (OpenAI)',
        'openai-4o-mini': 'GPT4o-Mini (OpenAI)',
        'openai-4-turbo': 'GPT4-Turbo (OpenAI)',
        'anthropic-3.5-sonnet': 'Claude 3.5 Sonnet (Anthropic)',
        'anthropic-3-haiku': 'Claude 3 Haiku (Anthropic)',
        'anthropic-3-opus': 'Claude 3 Opus (Anthropic)',
        'azure-openai': 'Azure OpenAI',
    };

    const watchTestType = watch('testType');
    const watchModel = watch('model');

    return (
        <>
            <Greeter />
            <div className="text-center w-2/3 m-auto my-8">
                <h1 className="text-3xl mb-2 font-black">Outrecta</h1>
                <p>
                    Generate tests about any topic using to power of language
                    models!
                </p>
            </div>
            <main>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mb-4"
                >
                    <Input
                        label="Topic"
                        isRequired
                        isInvalid={!!errors.topic}
                        errorMessage={errors.topic?.message}
                        {...register('topic')}
                    />
                    <Input
                        label="Question Count"
                        isRequired
                        endContent={
                            <Tooltip
                                content={
                                    <span className="text-center">
                                        The more questions, the longer and more
                                        expensive it will be to generate
                                        <br /> (also chance of failure will
                                        increase).
                                    </span>
                                }
                            >
                                <Info size={18} className="cursor-default" />
                            </Tooltip>
                        }
                        isInvalid={!!errors.questionCount}
                        errorMessage={errors.questionCount?.message}
                        {...register('questionCount', {
                            valueAsNumber: true,
                        })}
                    />
                    <Select
                        label="Select the model provider"
                        isRequired
                        isInvalid={!!errors.model}
                        errorMessage={errors.model?.message}
                        {...register('model')}
                    >
                        {Object.entries(modelNames).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                                {value}
                            </SelectItem>
                        ))}
                    </Select>
                    {watchModel === 'azure-openai' && (
                        <>
                            <Input
                                label="Azure Resource Name"
                                isInvalid={!!errors.azureResourceName}
                                errorMessage={errors.azureResourceName?.message}
                                {...register('azureResourceName')}
                            />
                            <Input
                                label="Azure Deployment Name"
                                isInvalid={!!errors.azureDeploymentName}
                                errorMessage={
                                    errors.azureDeploymentName?.message
                                }
                                {...register('azureDeploymentName')}
                            />
                        </>
                    )}
                    <Input
                        label="API Key"
                        isRequired
                        type="password"
                        isInvalid={!!errors.apiKey}
                        errorMessage={errors.apiKey?.message}
                        {...register('apiKey')}
                    />
                    <Controller
                        name="testType"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                label="Select test type"
                                isRequired
                                isInvalid={!!errors.testType}
                                errorMessage={errors.testType?.message}
                                {...field}
                            >
                                <Radio value="multiple-choice">
                                    Multiple Choice Questions
                                </Radio>
                                <Radio value="open-ended">
                                    Open-ended Questions
                                </Radio>
                            </RadioGroup>
                        )}
                    />
                    <Controller
                        name="difficulty"
                        control={control}
                        render={({ field }) => (
                            <Slider
                                label="Difficulty"
                                color="danger"
                                step={1}
                                maxValue={10}
                                minValue={0}
                                defaultValue={5}
                                showSteps={true}
                                startContent={<Smile />}
                                endContent={<Frown />}
                                {...field}
                            />
                        )}
                    />

                    <Accordion>
                        <AccordionItem
                            key="1"
                            aria-label="Advanced Options"
                            title="Advanced Options"
                            startContent={<Zap size={22} />}
                        >
                            <div className="space-y-6">
                                <Controller
                                    name="creativity"
                                    control={control}
                                    render={({ field }) => (
                                        <Slider
                                            label="Creativity"
                                            color="primary"
                                            step={1}
                                            maxValue={100}
                                            minValue={0}
                                            defaultValue={50}
                                            startContent={<Apple />}
                                            endContent={<Candy />}
                                            {...field}
                                        />
                                    )}
                                />
                                {watchTestType === 'multiple-choice' && (
                                    <Input
                                        label="Choice count per question"
                                        isInvalid={!!errors.choiceCount}
                                        errorMessage={
                                            errors.choiceCount?.message
                                        }
                                        {...register('choiceCount')}
                                    />
                                )}
                                <Input
                                    label="Manual Test Title"
                                    isInvalid={!!errors.manualTitle}
                                    errorMessage={errors.manualTitle?.message}
                                    {...register('manualTitle')}
                                />
                                <Textarea
                                    label="Custom instructions"
                                    placeholder="Enter your instructions"
                                    minRows={2}
                                    endContent={
                                        <Tooltip content="Beware that custom instructions may break the generation.">
                                            <TriangleAlert
                                                size={18}
                                                className="cursor-default"
                                            />
                                        </Tooltip>
                                    }
                                    isInvalid={!!errors.customInstructions}
                                    errorMessage={
                                        errors.customInstructions?.message
                                    }
                                    {...register('customInstructions')}
                                />
                            </div>
                        </AccordionItem>
                    </Accordion>

                    {failed && (
                        <p className="mb-4 text-red-500">
                            Generation Failed. <br />
                            Please try again. Changing options may help.
                        </p>
                    )}
                    <Button
                        type="submit"
                        color="primary"
                        endContent={<Atom size={16} />}
                        isLoading={loader}
                    >
                        Generate
                    </Button>
                    {loader && (
                        <p className="text-sm contrast-50">
                            This may take a while.
                        </p>
                    )}
                </form>
            </main>
        </>
    );
}
