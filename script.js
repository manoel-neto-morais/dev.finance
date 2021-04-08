var btnNew = document.querySelector(".button.new")
var btnCancel = document.querySelector(".button.cancel")

const Modal = {
    open(){
        document.querySelector(".modal-overlay").classList.add('active')
    },
    close(){
        document.querySelector(".modal-overlay").classList.remove('active')
        
    }
}

btnNew.onclick = Modal.open
btnCancel.onclick = Modal.close
