'use client';

import { Button, Card, CardBody, Link } from '@nextui-org/react';
import { notFound } from 'next/navigation';

export default function Document() {
    if (typeof window !== 'undefined' && !localStorage.getItem('questions')) {
        return notFound();
    }

    return (
        <main>
            <div className="text-center mt-8">
                <h1 className="text-3xl mb-4 font-black">Outrecta</h1>
                <h3 className="text-xl font-medium">Your test is ready!</h3>
                <div className="space-x-4 space-y-4 my-6">
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

                <div className="flex justify-center my-6">
                    <Card className="sm:w-2/3">
                        <CardBody>
                            <p className="mb-4">
                                <strong>TIP:</strong> You can print the test and
                                answersheet page to PDF to save it on your
                                device or share with others. You can also print
                                it directly.
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
