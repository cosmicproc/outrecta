import { Link } from '@nextui-org/react';

export default function Footer() {
    return (
        <footer className="text-center py-8 mt-auto print:hidden">
            <div className="mb-1">
                Created by{' '}
                <Link isExternal href="https://github.com/cosmicproc">
                    cosmicproc
                </Link>
            </div>
            <span className="border-r-2 border-gray-500 pr-2">
                Source on{' '}
                <Link isExternal href="https://github.com/cosmicproc/outrecta/">
                    GitHub
                </Link>
            </span>
            <span className="pl-2">
                See the{' '}
                <Link
                    isExternal
                    href="https://github.com/cosmicproc/outrecta/tree/main/examples"
                >
                    examples
                </Link>
            </span>
        </footer>
    );
}
