import { Input, Select, SelectItem } from '@nextui-org/react';
import {
    Control,
    FieldError,
    FieldErrors,
    UseFormRegister,
    UseFormRegisterReturn,
} from 'react-hook-form';
import { modelNames } from '../constants/ai';
import { generationSchema } from '../constants/schemas';
import { z } from 'zod';

export default function ModelOptionsFields({
    register,
    errors,
    watchModel,
}: {
    register: UseFormRegister<z.infer<typeof generationSchema>>;
    errors: FieldErrors<z.infer<typeof generationSchema>>;
    watchModel: string;
}) {
    return (
        <>
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
                        isRequired
                        isInvalid={!!errors.azureResourceName}
                        errorMessage={errors.azureResourceName?.message}
                        {...register('azureResourceName')}
                    />
                    <Input
                        label="Azure Deployment Name"
                        isRequired
                        isInvalid={!!errors.azureDeploymentName}
                        errorMessage={errors.azureDeploymentName?.message}
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
        </>
    );
}
