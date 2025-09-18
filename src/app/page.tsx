import { Converter } from './(converter)/converter';
import styles from './page.module.css';

export default function App() {
	return (
		<main className={styles.main}>
			<Converter />
		</main>
	);
}
