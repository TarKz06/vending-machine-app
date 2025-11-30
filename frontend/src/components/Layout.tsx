import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function Layout({ children, className }: LayoutProps) {
    return (
        <div className={cn("min-h-screen bg-gray-50 text-gray-900 font-sans", className)}>
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {children}
            </main>
        </div>
    );
}
