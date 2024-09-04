import { Link } from '@nextui-org/react';

export default function Footer() {
    return (
        <footer className="text-center my-8 mt-auto print:hidden">
            Created by{' '}
            <Link href="https://github.com/cosmicproc">cosmicproc</Link> |
            Source on{' '}
            <Link href="https://github.com/cosmicproc/outrecta/">GitHub</Link>
        </footer>
    );
}
