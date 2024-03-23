$(document).ready(function () {
    listing();
});

function listing() {
    $.ajax({
        type: 'GET',
        url: '/movie',
        data: {},
        success: function (response) {
            let rows = response['movies'];
            $('#cards-box').empty();

            if (rows.length === 0) {
                $('#empty').html('<h3>Data video masih kosong!!</h3>');
                return;
            }

            for (let i = 0; i < rows.length; i++) {
                let image = rows[i]['image'];
                let title = rows[i]['title'];
                let description = rows[i]['description'];
                let star = rows[i]['star'];
                let comment = rows[i]['comment'];

                let star_image = '⭐'.repeat(star);

                let temp_html = `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${image}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <p class="card-text">${description}</p>
                                <p>${star_image}</p>
                                <p class="mycomment">${comment}</p>
                            </div>
                        </div>
                    </div>
                `;
                $('#cards-box').append(temp_html);
            }
        }
    });
}


function posting() {
    let url = $('#url').val();
    let star = $('#star').val();
    let comment = $('#comment').val();

        // Memeriksa apakah data masih kosong satu per satu
        if (!url) {
            Swal.fire({
                title: 'Error',
                text: 'URL Movie Wajib diisi',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        let urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!url.match(urlRegex)) {
            Swal.fire({
                title: 'Error',
                text: 'Please enter a valid URL',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        if (!star) {
            Swal.fire({
                title: 'Error',
                text: 'Rating wajib diisi',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        if (!comment) {
            Swal.fire({
                title: 'Error',
                text: 'Komen wajib diisi',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

     // Menampilkan indikator loading
     let spinner = new Spinner().spin();
     $('#loading').append(spinner.el);
 
     // Jika semua input terisi, lanjutkan pengiriman AJAX
     $.ajax({
         type: 'POST',
         url: '/movie',
         data: {
             url_give: url,
             star_give: star,
             comment_give: comment,
         },
         success: function (response) {
             spinner.stop(); // Menghentikan indikator loading
             Swal.fire({
                 title: 'Success',
                 text: response['msg'],
                 icon: 'success',
                 confirmButtonText: 'OK'
             }).then((result) => {
                 if (result.isConfirmed) {
                     window.location.reload();
                 }
             });
         }
     });
}



function open_box() {
    $('#post-box').show()
}
function close_box() {
    $('#post-box').hide()
}