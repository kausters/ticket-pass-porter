import { FormEventHandler, FunctionComponent } from 'react';

interface Props {
	onTicket: (file: File) => void;
}

const TicketUpload: FunctionComponent<Props> = ({ onTicket }) => {
	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const fileInput = form.elements.namedItem('ticket') as HTMLInputElement;

		// Check that the input is valid
		if (!fileInput.files || fileInput.files.length !== 1) return;

		const uploadedFile = fileInput.files[0];
		onTicket(uploadedFile);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name="ticket" type="file" />
			<button type="submit">Submit</button>
		</form>
	);
};

export default TicketUpload;
