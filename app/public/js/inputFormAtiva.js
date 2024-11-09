const formsAuto = document.querySelectorAll("[data-formAuto]")

formsAuto.forEach(form =>{
    const input = form.querySelector("[data-inputAtiva]")
    input.addEventListener("change", ()=>{
        form.submit()
    })
})