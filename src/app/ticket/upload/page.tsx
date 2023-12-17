'use client';

import { useRouter } from 'next/navigation';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { useTicketUpload } from '../ticket-upload-context';

export default function Upload() {
	const { setTicketFile } = useTicketUpload();
	const router = useRouter();

	const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const target = event.target;
		if (!target.files || target.files.length !== 1) return;

		// Take the selected file
		const uploadedFile = target.files[0];

		// Store the file data in context
		setTicketFile(uploadedFile);
	};

	const handleSubmit: FormEventHandler = (event) => {
		event.preventDefault();
		router.push('view');
	};

	return (
		<div>
			<h1>Upload</h1>

			<form onSubmit={handleSubmit}>
				<input type="file" onChange={handleFileChange} />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
