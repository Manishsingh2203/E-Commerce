document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', async () => {
            let itemId = button.getAttribute('data-id');
            let response = await fetch(`/cart/increase/${itemId}`, { method: 'POST' });
            let data = await response.json();
            document.getElementById(`qty-${itemId}`).innerText = data.cart[itemId].quantity;
        });
    });

    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', async () => {
            let itemId = button.getAttribute('data-id');
            let response = await fetch(`/cart/decrease/${itemId}`, { method: 'POST' });
            let data = await response.json();
            if (data.cart[itemId]) {
                document.getElementById(`qty-${itemId}`).innerText = data.cart[itemId].quantity;
            } else {
                document.getElementById(`qty-${itemId}`).parentElement.remove(); // Remove item from UI
            }
        });
    });
});
