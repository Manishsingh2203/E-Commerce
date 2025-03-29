document.getElementById("searchForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page refresh

    let searchQuery = document.getElementById("searchInput").value.trim();
    
    if (searchQuery) {
        try {
            let response = await fetch(`/search?query=${encodeURIComponent(searchQuery)}`);
            let products = await response.json();

            let productList = document.getElementById("productList");
            productList.innerHTML = ""; // Clear previous results

            if (products.length === 0) {
                productList.innerHTML = "<h4 class='text-center'>No products found</h4>";
                return;
            }

            products.forEach(product => {
                let productCard = `
                    <div class="col-md-3">
                        <div class="card">
                            <img src="${product.img}" class="card-img-top" alt="${product.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="text-danger">₹${product.price}</p>
                                <a href="/products/${product._id}" class="btn btn-primary">View</a>
                            </div>
                        </div>
                    </div>
                `;
                productList.innerHTML += productCard;
            });

        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }
});
