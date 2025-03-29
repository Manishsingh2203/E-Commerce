(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  $(document).on("click", ".quick-view-btn", function () {
    let productId = $(this).data("id");

    $.get(`/products/${productId}/quickview`, function (data) {
        $("#quickViewModal .modal-title").text(data.product.name);
        $("#quickViewModal .modal-body").html(`
            <img src="${data.product.img}" class="img-fluid">
            <p>${data.product.desc}</p>
            <h4>Price: $${data.product.price}</h4>
            <h5>Similar Products:</h5>
            <div class="row">
                ${data.similarProducts.map(prod => `
                    <div class="col-md-3">
                        <div class="card">
                            <img src="${prod.img}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${prod.name}</h5>
                                <p class="card-text">Price: $${prod.price}</p>
                                <a href="/products/${prod._id}" class="btn btn-primary">View</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);
        $("#quickViewModal").modal("show");
    });
});


document.addEventListener("DOMContentLoaded", function() {
    var saleBannerCarousel = new bootstrap.Carousel(document.getElementById('saleBannerCarousel'), {
        interval: 3000, // Change slides every 3 seconds
        wrap: true
    });
});