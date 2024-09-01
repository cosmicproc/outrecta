'use client';

import { Button } from '@nextui-org/react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
    return (
        <Button
            variant="bordered"
            onPress={() => window.print()}
            className="print:hidden"
        >
            Print
            <Printer size={18} />
        </Button>
    );
}
