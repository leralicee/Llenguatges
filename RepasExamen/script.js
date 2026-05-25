const boto = document.querySelector(".boto-afegir");
const input = document.querySelector("input");
const llista = document.querySelector("ul");

boto.addEventListener("click", function() {

    const text = input.value.trim();

    if (text === "") {
        alert("Has d'escriure alguna cosa");
        return;
    }

    const nouElement = document.createElement("li");
    nouElement.textContent = text;

    llista.appendChild(nouElement);

    input.value = "";
});
