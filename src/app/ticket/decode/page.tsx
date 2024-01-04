'use client';

import { FunctionComponent, useState } from 'react';

const Decode = () => {
	const [file, setFile] = useState<File>();

	function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
		}
	}

	return (
		<div>
			<h1>Decode</h1>

			<form>
				<input type="file" onChange={onFileChange} />
			</form>

			{file && <Result file={file} />}
		</div>
	);
};

const Result: FunctionComponent<{ file: File }> = ({ file }) => {
	return <div>{file.name}</div>;
};

export default Decode;
