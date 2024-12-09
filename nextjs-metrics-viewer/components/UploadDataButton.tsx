import { Button, Modal, FileInput, Label, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UploadDataButton({
  loadOptions,
}: {
  loadOptions: (data: string) => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const [error, setError] = useState(false);

  if (!session?.user.isAdmin) return;

  const readFile = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    if (file.type !== "text/csv") {
      setError(true);
    } else {
      setError(false);
    }

    setFile(file);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      loadOptions(reader.result as string);
    };
  };

  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>Upload data</Button>

      <Modal
        dismissible
        show={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        {error && (
          <Alert
            className="absolute -top-20 left-1/2 -translate-x-1/2"
            color="failure"
            icon={HiInformationCircle}
          >
            <span className="font-medium">Info alert!</span> Change a few things
            up and try submitting again.
          </Alert>
        )}

        <div className="rounded-md bg-gray-800">
          <Modal.Header className="border-gray-700">
            <span className="text-white">Upload your CSV file</span>
          </Modal.Header>
          <Modal.Body>
            <div className="flex w-full flex-col items-center justify-center ">
              <Label
                htmlFor="dropzone-file"
                className="mb-4 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 size-8 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">.CSV</p>
                </div>
                <FileInput
                  id="dropzone-file"
                  className="hidden"
                  onChange={readFile}
                  accept="text/csv"
                />
              </Label>

              {file && <span className="text-green-400">{file.name}</span>}
            </div>
          </Modal.Body>
          <Modal.Footer className="flex w-full justify-center border-gray-700">
            <Button
              onClick={() => {
                setOpenModal(false);
                setFile(null);
              }}
              disabled={error}
            >
              Done
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}
