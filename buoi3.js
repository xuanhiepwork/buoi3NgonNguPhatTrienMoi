const URL_API = 'https://api.escuelajs.co/api/v1/products';

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;
let sortDirection = 1;

// 1. Hàm lấy dữ liệu GetAll
async function GetAll() {
    try {
        const res = await fetch(URL_API);
        const data = await res.json();
        allProducts = data;
        filteredProducts = data;
        renderTable();
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
}

// 2. Hàm render bảng
function renderTable() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataToShow = filteredProducts.slice(startIndex, endIndex);

    tableBody.innerHTML = dataToShow.map(item => {
        let imgUrl = item.images[0];
        // Xử lý link ảnh lỗi nếu có định dạng ["url"]
        if (imgUrl && imgUrl.startsWith('["')) {
            imgUrl = imgUrl.replace('["', '').replace('"]', '');
        }

        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>$${item.price}</td>
                <td>
                    <img src="${imgUrl}" class="product-img" onerror="this.src='https://via.placeholder.com/80'">
                </td>
                <td class="desc-col">${item.description}</td>
            </tr>
        `;
    }).join('');

    renderPagination();
}

// 3. Tìm kiếm onChange
function handleSearch() {
    const keyword = document.getElementById('search_txt').value.toLowerCase();
    filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderTable();
}

// 4. Thay đổi số lượng trang
function handlePageSize() {
    pageSize = parseInt(document.getElementById('page_size').value);
    currentPage = 1;
    renderTable();
}

// 5. Sắp xếp
function sortData(key) {
    sortDirection *= -1;
    filteredProducts.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        return valA > valB ? (1 * sortDirection) : (-1 * sortDirection);
    });
    renderTable();
}

// 6. Phân trang
function renderPagination() {
    const paginationDiv = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    let html = `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Trước</button>`;
    html += `<span> Trang ${currentPage} / ${totalPages} </span>`;
    html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Sau</button>`;

    paginationDiv.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

// Gọi hàm chạy ban đầu
GetAll();