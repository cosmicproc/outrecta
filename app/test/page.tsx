'use client';

import { TestDocument } from '@/app/constants/types';
import PrintButton from '@/app/components/PrintButton';
import Questions from '@/app/components/Questions';
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

    if (testDocument) {
        document.title = testDocument?.title;
        return (
            <main className={`${customFont.className} my-8`}>
                <div className="text-center">
                    <h1 className="font-bold text-3xl mb-4 print:text-xl">
                        {testDocument.title}
                    </h1>
                    <PrintButton />
                </div>
                <Questions questions={testDocument.questions} />
            </main>
        );
    }
}
