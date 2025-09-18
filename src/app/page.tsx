import styles from './page.module.css';
import { Converter } from './ticket/converter';

export default function App() {
	return (
		<main className={styles.main}>
			<Converter />
		</main>
	);
}
