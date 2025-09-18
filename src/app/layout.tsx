import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Biļetnieks',
	description: 'Kino biļešu pārveidotājs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="lv">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
