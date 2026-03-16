import { cocktailDB } from './database.js';

const render = () => {
    const container = document.querySelector('.cocktails-container');
    if (!container) return;

    container.innerHTML = cocktailDB.map(drink => `
        <div class="cocktail card col-sm-10 col-md-4 col-lg-2 pt-2 mt-3 me-3 mb-3" data-name="${drink.name}">
            <img class="img-fluid img rounded" src="${drink.img}" alt="${drink.name}">
            <div class="cocktail-name">${drink.name}</div>
            <div class="d-flex justify-content-between">                    
                <div class="specify-method ${drink.method}">#${drink.method}</div>
                <img src="${drink.glassImg}" class="img img-service me-1" alt="glass">
            </div>
            <div class="contains">
                ${drink.ingr.map(ing => `
                    <div class="ingredient" data-name="${ing.name}">
                        <b>${ing.amount}</b> - ${ing.name}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
};

let selectedIngredients = new Set();

const filterCocktails = () => {
    const filterText = document.getElementById('search-input')?.value.toLowerCase() || "";
    const cards = document.querySelectorAll('.cocktail.card');

    cards.forEach(card => {
        const cardName = card.getAttribute('data-name').toLowerCase();
        const cocktailIngredients = [...card.querySelectorAll('.ingredient')]
            .map(ing => ing.getAttribute('data-name').toLowerCase());

        const matchesSearch = cardName.includes(filterText);
        
        const matchesIngredients = selectedIngredients.size === 0 || [...selectedIngredients].every(selected => cocktailIngredients.some(ci => ci === selected.toLowerCase()));
        card.style.display = (matchesSearch && matchesIngredients) ? '' : 'none';
    });
};

document.addEventListener('DOMContentLoaded', () => {
    render();

    document.getElementById('search-input')?.addEventListener('input', filterCocktails);

    const ingredientNodes = document.querySelectorAll('.ingredients');
    ingredientNodes.forEach(node => {
        node.addEventListener('click', function() {
            const ingredientName = this.getAttribute('data-name');

            if (selectedIngredients.has(ingredientName)) {
                selectedIngredients.delete(ingredientName);
                this.classList.remove('selected');
            } else {
                selectedIngredients.add(ingredientName);
                this.classList.add('selected');
            }
            
            filterCocktails();
        });
    });

    const cocktails_container = document.querySelector(".cocktails-container");
    const shots_container = document.querySelector(".shots-container");

    document.getElementById("cocktails")?.addEventListener("click", () => {
        cocktails_container.style.display = "flex";
        shots_container.style.display = "none";
    });

    document.getElementById("shots")?.addEventListener("click", () => {
        cocktails_container.style.display = "none";
        shots_container.style.display = "flex";
    });
});