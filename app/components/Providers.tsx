'use client';

import { NextUIProvider } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const NextThemesProvider = dynamic(
    () => import('next-themes').then((e) => e.ThemeProvider),
    {
        ssr: false,
    },
);

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push} className="flex flex-col grow">
            <NextThemesProvider attribute="class">
                {children}
            </NextThemesProvider>
        </NextUIProvider>
    );
}
