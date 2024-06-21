function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.classList.add('opened');
    document.body.classList.add('modal-opened');
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.classList.remove('opened');
    document.body.classList.remove('modal-opened');
}
