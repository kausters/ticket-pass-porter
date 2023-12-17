import Image from 'next/image';
import styles from './header.module.css';
import logo from './logo.png';

export default function Header() {
	return (
		<header className={styles.container}>
			<Image src={logo} alt="Logo" className={styles.logo} priority={true} />
			<h1 className={styles.title}>Biļetnieks</h1>
		</header>
	);
}
