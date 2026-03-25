axios.defaults.baseURL = SERVER

window.onload = () => {
    fetchFiles();
}

const toast = new Notyf({
    position: {x: 'center', y: 'top'}
})

const toggleDrawer = () => {
    const drawer = document.getElementById('drawer');
    const rightValue = drawer.style.right;

    if(rightValue === '0px')
    {
        drawer.style.right = '-33.33%'
    } else {
        drawer.style.right = '0px'
    }
}

const uploadFile = async (e) => {
    try{
        e.preventDefault();
        const progress = document.getElementById('progress');
        const uploadBtn = document.getElementById('upload-btn')
        const form = e.target;
        const formData = new FormData(form);

        // Validating file size
        const file = formData.get('file');
        const size = getSize(file.size);
        if(size > 200){
            form.reset();
            return toast.error('File size too large, maximum size 200mb allowed')
        }

        const options = {
            onUploadProgress: (e) => {
                const loaded = e.loaded; 
                const total = e.total;
                const percentageVal = Math.floor((loaded*100)/total);
                progress.style.width = percentageVal+'%';
                progress.innerHTML = percentageVal+'%';
            }
        }
        uploadBtn.disabled = true;
        const {data} = await axios.post('/file', formData, options);
        fetchFiles();
        toast.success(`${data.filename} uploaded successfully`);
        uploadBtn.disabled = false;
        progress.style.width = 0;
        progress.innerHTML = '';
        form.reset();
    } catch (err) {
        toast.error(err.response ? err.response.data?.message : err.message);
    }
}

const getSize = (size) => {
    const mb = (size/1000)/1000;
    return mb.toFixed(1);
}

const fetchFiles = async () => {
    const {data} = await axios.get('/files');
    const table = document.getElementById('files-table');
    table.innerHTML = ''
    for(let file of data)
    {
        const ui = `
        <tr class="text-gray-500  border-b border-gray-200">
                <td class="py-3 pl-6 capitalize">${file.filename}</td>
                <td class="capitalize">${file.type}</td>
                <td>${getSize(file.size)} mb</td>
                <td>${moment(file.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                <td>
                    <div class="space-x-2">
                      <button title="Delete" class="border border-2 text-white px-2 py-1 bg-rose-400 hover:bg-rose-500 rounded" onclick="deleteFile('${file._id}')">
                        <i class="ri-delete-bin-4-line"></i>
                        </button>
                        <button title="Download" class="border border-2 text-white px-2 py-1 bg-green-400 hover:bg-green-500 rounded" onclick="downloadFile('${file._id}', '${file.filename}', this)">
                            <i class="ri-download-line"></i>
                        </button>
                        <button title="Share" class="border border-2 text-white px-2 py-1 bg-amber-400 hover:bg-amber-500 rounded">
                            <i class="ri-share-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
        table.innerHTML += ui;
        console.log(file);
    } 
}

const deleteFile = async (id) => {
    await axios.delete(`/file/${id}`);
    toast.success('File deleted!')
    fetchFiles();
}

const downloadFile = async (id, filename, button) => {
    try 
    {
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'
        button.disabled = true
        const options = {
            responseType: 'blob'
        };
        const {data} = await axios.get(`file/download/${id}`, options);
        console.log(data)
        const ext = data.type.split("/").pop();
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename+'.'+ext
        a.click();
        a.remove();
    } 
    catch (err)
    {
        if(!err.response)
            return toast.error(err.message);

        const error = await (err.response.data).text();
        const {message} = JSON.parse(error);
        toast.error(message);
    } 
    finally 
    {
        button.innerHTML = '<i class="ri-download-line"></i>'
        button.disabled = false
    }
}