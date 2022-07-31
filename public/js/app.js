
console.log("Soy frontend")
 document.addEventListener("click", (e)=>{
    const url =`${window.location.origin}/${e.target.dataset.short}`
    
    navigator.clipboard
    .writeText(url)
    .then(()=>{
        
        console.log("The text copied to clipboard")
    })
    .catch((error)=>{
        console.log("Something went wrong" + error)
    })
    }) 