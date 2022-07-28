
console.log("Soy frontend")
 document.addEventListener("click", (e)=>{
    const url =`http://localhost:5000/${e.target.dataset.short}`
    
    navigator.clipboard
    .writeText(url)
    .then(()=>{
        
        console.log("The text copied to clipboard")
    })
    .catch((error)=>{
        console.log("Something went wrong" + error)
    })
    }) 