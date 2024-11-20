'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push} className="flex grow flex-col">
            <ThemeProvider attribute="class">{children}</ThemeProvider>
        </NextUIProvider>
    );
}
