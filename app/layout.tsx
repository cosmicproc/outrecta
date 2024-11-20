import type { Metadata } from 'next';
import './globals.css';
import Providers from './components/Providers';
import Footer from './components/Footer';

export const metadata: Metadata = {
    title: 'Outrecta',
    description: 'Generate tests about any topic.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="flex min-h-[100dvh] flex-col">
                <Providers>
                    <div className="flex grow justify-center">
                        <div className="w-5/6 sm:w-1/2 print:w-5/6">
                            {children}
                        </div>
                    </div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
