'use client';

import PrintButton from '@/app/components/PrintButton';
import Questions from '@/app/components/Questions';
import { TestDocument } from '@/app/constants/types';
import { Button } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { customFont } from '../constants/etc';

export default function Test() {
    const [testDocument, setTestDocument] = useState<TestDocument | null>(null);
    useEffect(() => {
        const questionsRaw = localStorage.getItem('questions');
        if (!questionsRaw) {
            return notFound();
        }
        setTestDocument(JSON.parse(questionsRaw) as unknown as TestDocument);
    }, []);

    const [showSpaces, setShowSpaces] = useState(true);

    useEffect(() => {
        setShowSpaces(localStorage.getItem('showSpaces') !== 'false');
    }, []);

    if (testDocument) {
        document.title = testDocument?.title;
        return (
            <main className={`${customFont.className} my-8`}>
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-bold print:text-xl">
                        {testDocument.title}
                    </h1>
                    <div className="space-x-4 print:hidden">
                        <PrintButton />
                        {!testDocument.questions[0].answerChoices && (
                            <Button
                                variant="faded"
                                onPress={() => {
                                    localStorage.setItem(
                                        'showSpaces',
                                        !showSpaces ? 'true' : 'false',
                                    );
                                    window.location.reload();
                                }}
                            >
                                {showSpaces ? 'Remove Spaces' : 'Show Spaces'}
                            </Button>
                        )}
                    </div>
                </div>
                <Questions
                    questions={testDocument.questions}
                    showSpaces={showSpaces}
                />
            </main>
        );
    }
}
