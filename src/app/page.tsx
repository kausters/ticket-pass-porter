import Link from 'next/link';

import styles from './page.module.css';

export default function Home() {
	return (
		<main className={styles.main}>
			<ul>
				<li>
					<Link href="/ticket/view/">View example</Link>
				</li>
				<li>
					<Link href="/ticket/upload/">Upload ticket</Link>
				</li>
			</ul>
		</main>
	);
}
