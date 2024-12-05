import { Modal, Button } from "flowbite-react";

interface props {
  id: number;
  open: boolean;
  onClose: Function;
  onSave: Function;
}

export default function DeleteModal({ id, open, onClose, onSave }: props) {
  const handleClose = () => onClose(false);
  const handleDelete = () => {
    handleClose();
    onSave(id);
  };
  return (
    <Modal show={open} onClose={handleClose}>
      <Modal.Header>Edit Data</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p>Delete data n° {id + 1}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="failure" onClick={() => handleDelete()}>
          Delete
        </Button>
        <Button color="gray" onClick={() => handleClose()}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
