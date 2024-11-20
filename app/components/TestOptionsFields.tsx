import {
    Input,
    Radio,
    RadioGroup,
    Slider,
    Textarea,
    Tooltip,
} from '@nextui-org/react';
import { Frown, Info, Smile } from 'lucide-react';
import {
    Control,
    Controller,
    FieldErrors,
    UseFormRegister,
} from 'react-hook-form';
import { z } from 'zod';
import { generationSchema } from '../constants/schemas';

export default function TestOptionFields({
    register,
    errors,
    control,
}: {
    register: UseFormRegister<z.infer<typeof generationSchema>>;
    errors: FieldErrors<z.infer<typeof generationSchema>>;
    control: Control<z.infer<typeof generationSchema>>;
}) {
    return (
        <>
            <Textarea
                label="Topics"
                isRequired
                placeholder='Enter the test&apos;s topics, separated by commas. (e.g. "Algebra, Polynomials")'
                minRows={1}
                isInvalid={!!errors.topics}
                errorMessage={errors.topics?.message}
                {...register('topics')}
            />
            <Input
                label="Question count"
                isRequired
                endContent={
                    <Tooltip
                        content={
                            <span className="text-center">
                                The more questions, the longer and more
                                expensive it will be to generate.
                            </span>
                        }
                    >
                        <Info size={18} className="cursor-default" />
                    </Tooltip>
                }
                isInvalid={!!errors.questionCount}
                errorMessage={errors.questionCount?.message}
                {...register('questionCount')}
            />
            <Controller
                name="testType"
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        label="Test Type"
                        isRequired
                        isInvalid={!!errors.testType}
                        errorMessage={errors.testType?.message}
                        {...field}
                    >
                        <Radio value="multiple-choice">
                            Multiple Choice Questions
                        </Radio>
                        <Radio value="open-ended">Open-ended Questions</Radio>
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
                        maxValue={6}
                        minValue={0}
                        showSteps={true}
                        startContent={<Smile />}
                        endContent={<Frown />}
                        {...field}
                    />
                )}
            />
        </>
    );
}
