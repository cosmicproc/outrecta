import { Card, CardBody } from '@nextui-org/react';
import { CircleAlert, TriangleAlert } from 'lucide-react';

export default function Messages({
    watchCustomInstructions,
    failed,
    loader,
}: {
    watchCustomInstructions?: string;
    failed: boolean;
    loader: boolean;
}) {
    return (
        <>
            {loader && (
                <p className="text-sm contrast-50">This may take a while.</p>
            )}
            {failed && (
                <Card>
                    <CardBody>
                        <div className="flex">
                            <CircleAlert className="mr-2 text-red-600 dark:text-red-300" />
                            Generation Failed. Please try again. Changing
                            options may help.
                        </div>
                    </CardBody>
                </Card>
            )}
            {watchCustomInstructions?.trim() && (
                <Card>
                    <CardBody>
                        <div className="flex">
                            <TriangleAlert className="mr-2 text-yellow-600 dark:text-yellow-300" />
                            Custom instructions are being used in advanced
                            settings.
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
