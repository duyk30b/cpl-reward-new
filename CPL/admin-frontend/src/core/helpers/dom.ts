import { Modal } from 'bootstrap'

const hideModal = (modalEl: HTMLElement | null): void => {
  if (!modalEl) {
    return
  }

  const myModal = Modal.getInstance(modalEl)
  myModal.hide()
}

const showModal = (modalEl: HTMLElement | null): void => {
  if (!modalEl) {
    return
  }

  let myModal = Modal.getInstance(modalEl)
  if (!myModal) {
    myModal = new Modal(modalEl, {})
    myModal.show()
  } else {
    try {
      myModal.showModal()
    } catch (err) {
      myModal.show()
    }
  }
}

const removeModalBackdrop = (): void => {
  if (document.querySelectorAll('.modal-backdrop.fade.show').length) {
    document.querySelectorAll('.modal-backdrop.fade.show').forEach((item) => {
      item.remove()
    })
  }
}

export { removeModalBackdrop, hideModal, showModal }
