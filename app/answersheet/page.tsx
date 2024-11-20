'use client';

import Answers from '@/app/components/Answers';
import PrintButton from '@/app/components/PrintButton';
import { TestDocument } from '@/app/constants/types';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { customFont } from '../constants/etc';

export default function Answersheet() {
    const [testDocument, setTestDocument] = useState<TestDocument | null>(null);
    useEffect(() => {
        const questionsRaw = localStorage.getItem('questions');
        if (!questionsRaw) {
            return notFound();
        }
        setTestDocument(JSON.parse(questionsRaw) as unknown as TestDocument);
    }, []);

    if (testDocument) {
        document.title = `Answersheet-${testDocument?.title}`;
        return (
            <main className={`${customFont.className} my-8`}>
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-bold print:text-xl">
                        Answersheet: <br />
                        {testDocument.title}
                    </h1>
                    <div className="print:hidden">
                        <PrintButton />
                    </div>
                </div>
                <Answers questions={testDocument.questions} />
            </main>
        );
    }
}
