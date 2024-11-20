'use client';

import { Button, Card, CardBody, Link } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TestDocument } from '../constants/types';

export default function Document() {
    const [testDocument, setTestDocument] = useState<TestDocument | null>();

    useEffect(() => {
        const testDocumentRaw = localStorage.getItem('questions');
        const testDocument =
            testDocumentRaw && (JSON.parse(testDocumentRaw) as TestDocument);
        if (!testDocument) {
            return notFound();
        }
        setTestDocument(testDocument);
    }, []);

    return (
        <main>
            <div className="mt-8 text-center">
                <h1 className="mb-4 text-3xl font-black">Outrecta</h1>
                <h3 className="text-xl font-medium">Your test is ready!</h3>
                <div className="min-h-5 text-sm text-gray-600 dark:text-gray-400">
                    {testDocument?.inputTokens &&
                        testDocument?.outputTokens &&
                        `Used ${testDocument.inputTokens + testDocument.outputTokens} tokens (${testDocument.inputTokens} in, ${testDocument.outputTokens} out)`}
                </div>

                <div className="mt-2 space-x-4 space-y-4">
                    <Button
                        href="/test"
                        as={Link}
                        color="primary"
                        showAnchorIcon
                        variant="solid"
                    >
                        Go to test
                    </Button>
                    <Button
                        href="/answersheet"
                        as={Link}
                        color="primary"
                        showAnchorIcon
                        variant="ghost"
                    >
                        Go to answersheet
                    </Button>
                </div>

                <div className="my-6 flex justify-center">
                    <Card className="sm:w-2/3">
                        <CardBody>
                            <p className="mb-4">
                                <strong>TIP:</strong> You can print the test and
                                answersheet page into a PDF file to save it on
                                your device or share with others. You can also
                                print them physically.
                            </p>
                            <p>
                                <strong className="text-red-600">
                                    Warning:
                                </strong>{' '}
                                When you generate a new test, old test and
                                answersheet will be deleted.
                            </p>
                        </CardBody>
                    </Card>
                </div>
                <Button href="/" as={Link} variant="faded">
                    Generate New
                </Button>
            </div>
        </main>
    );
}
