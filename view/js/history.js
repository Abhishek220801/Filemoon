axios.defaults.baseURL = SERVER

window.onload = () => {
    showUserDetails();
    fetchHistory();
    fetchImage();
}

const fetchHistory = async () => {
    try {
        const {data} = await axios.get('/files/shared', getToken());
        let historyTable = document.getElementById('history-table');
        const notFoundUi = `
            <div class="p-3 text-center">
                <h1 class="text-gray-500 text-3xl">You have not shared any files yet.</h1>
            </div>
        `

        if(data.length === 0)
        {
            historyTable.innerHTML = notFoundUi;
            return;
        }

        for(let item of data)
        {
            console.log(item);
            const ui = `
            <tr class="text-gray-500  border-b border-gray-200">
                <td class="py-3 pl-6 capitalize">${item.file.filename}</td>
                <td>${item.receiverEmail}</td>
                <td>${moment(item.createdAt).format(`DD MMM YYYY, hh:mm A`)}</td>
            </tr>
            `
            historyTable.innerHTML += ui;
        }
    } catch (err) {
        toast.error(err.response ? err.response.data?.message : err.message);
    }
}