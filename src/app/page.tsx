import { Converter } from './(converter)/converter';
import Header from './(home)/header/header';
import styles from './page.module.css';

export default function App() {
	return (
		<>
			<Header />
			<main className={styles.main}>
				<Converter />
			</main>
		</>
	);
}
