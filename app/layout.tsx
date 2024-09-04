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
        <html lang="en">
            <body className="min-h-[100dvh] flex flex-col">
                <Providers>
                    <div className="justify-center flex grow">
                        <div className="w-1/2 print:w-3/4">{children}</div>
                    </div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
