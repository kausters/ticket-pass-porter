import { ChangeEventHandler, FormEventHandler, FunctionComponent } from 'react';

interface Props {
	onImport: (file: File) => void;
}

const TicketImport: FunctionComponent<Props> = ({ onImport }) => {
	const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const input = event.currentTarget;
		input.setCustomValidity('');
		input.form?.requestSubmit();
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const ticket = form.elements.namedItem('ticket') as HTMLInputElement;
		const result = validateInput(ticket.files);

		if (typeof result === 'string') {
			ticket.setCustomValidity(result);
			ticket.reportValidity();
			return;
		}

		onImport(result);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				name="ticket"
				type="file"
				accept="application/pdf"
				required={true}
				onChange={handleFileChange}
			/>
		</form>
	);
};

export default TicketImport;

function validateInput(files: FileList | null): string | File {
	const file = files?.[0];

	if (!file || files.length !== 1) {
		return 'Please select a file';
	}

	if (file.type !== 'application/pdf') {
		return 'Please select a PDF file';
	}

	return file;
}
