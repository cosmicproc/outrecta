import {
    Accordion,
    AccordionItem,
    Input,
    Slider,
    Switch,
    Textarea,
    Tooltip,
} from '@nextui-org/react';
import { Apple, Candy, TriangleAlert, Zap } from 'lucide-react';
import {
    Control,
    Controller,
    FieldErrors,
    UseFormRegister,
} from 'react-hook-form';
import { z } from 'zod';
import { generationSchema } from '../constants/schemas';

export default function AdvancedOptionsFields({
    register,
    errors,
    control,
    watchTestType,
}: {
    register: UseFormRegister<z.infer<typeof generationSchema>>;
    errors: FieldErrors<z.infer<typeof generationSchema>>;
    control: Control<z.infer<typeof generationSchema>>;
    watchTestType: string;
}) {
    return (
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
                    <Switch {...register('explainAnswers')}>
                        Explain the answers
                    </Switch>
                    {watchTestType === 'multiple-choice' && (
                        <Input
                            label="Choice count per question"
                            isInvalid={!!errors.choiceCount}
                            errorMessage={errors.choiceCount?.message}
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
                        errorMessage={errors.customInstructions?.message}
                        {...register('customInstructions')}
                    />
                </div>
            </AccordionItem>
        </Accordion>
    );
}
