axios.defaults.baseURL = SERVER

window.onload = () => {
  showUserDetails()
  fetchFiles()
  fetchImage()
}

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
  return options;
}

const toast = new Notyf({
  position: { x: "center", y: "top" },
})

const toggleDrawer = () => {
  const drawer = document.getElementById("drawer")
  const rightValue = drawer.style.right

  if (rightValue === "0px") {
    drawer.style.right = "-33.33%"
  } else {
    drawer.style.right = "0px"
  }
}

const showUserDetails = async () => {
  const { firstname, lastname, email } = await getSession()
  const fullname = document.getElementById("fullname")
  const emailId = document.getElementById("email")
  fullname.innerText = firstname + " " + lastname
  emailId.innerText = email
}

const uploadFile = async (e) => {
  e.preventDefault()
    const progress = document.getElementById("progress")
    const uploadBtn = document.getElementById("upload-btn")
  try {
    const form = e.target
    const formData = new FormData(form)

    // Validating file size
    const file = formData.get("file")
    const size = getSize(file.size)
    if (size > 200) {
      form.reset()
      return toast.error("File size too large, maximum size 200 MB allowed")
    }

    const options = {
      onUploadProgress: (e) => {
        const loaded = e.loaded
        const total = e.total
        const percentageVal = Math.floor((loaded * 100) / total)
        progress.style.width = percentageVal + "%"
        progress.innerHTML = percentageVal + "%"
      },
      ...getToken()
    }
    uploadBtn.disabled = true
    const { data } = await axios.post("/file", formData, options)
    fetchFiles()
    toast.success(`${data.filename} uploaded successfully`)
    progress.style.width = 0
    progress.innerHTML = ""
    form.reset()
    toggleDrawer();
  } catch (err) {
    toast.error(err.response ? err.response.data?.message : err.message)
  } finally {
    uploadBtn.disabled = false
  }
}

const getSize = (size) => {
    const kb = size / 1000;
    const mb = kb / 1000;
    const gb = mb / 1000;

    if (gb >= 1) return gb.toFixed(2) + ' GB';
    if (mb >= 1) return mb.toFixed(2) + ' MB';
    if (kb >= 1) return kb.toFixed(2) + ' KB';

    return size + ' B';
}

const fetchFiles = async () => {
  const { data } = await axios.get("/files", getToken());
  const table = document.getElementById("files-table")
  table.innerHTML = ""
  for (let file of data) {
    console.log(file);
    const ui = `
        <tr class="text-gray-500  border-b border-gray-200">
                <td class="py-3 pl-6 capitalize">${file.filename}</td>
                <td class="capitalize">${file.type.split("/")[0]}</td>
                <td>${getSize(file.size)}</td>
                <td>${moment(file.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
                <td>
                    <div class="space-x-2">
                      <button title="Delete" class="border border-2 text-white px-2 py-1 bg-rose-400 hover:bg-rose-500 rounded" onclick="deleteFile('${file._id}', this)">
                        <i class="ri-delete-bin-4-line"></i>
                        </button>
                        <button title="Download" class="border border-2 text-white px-2 py-1 bg-green-400 hover:bg-green-500 rounded" onclick="downloadFile('${file._id}', '${file.filename}', this)">
                            <i class="ri-download-line"></i>
                        </button>
                        <button title="Share" class="border border-2 text-white px-2 py-1 bg-amber-400 hover:bg-amber-500 rounded" onclick="openShareModal('${file._id}', '${file.filename}')">
                            <i class="ri-share-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
    table.innerHTML += ui
    console.log(file)
  }
}

const deleteFile = async (id, button) => {
  try {
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'
    button.disabled = true
    await axios.delete(`/file/${id}`, getToken());
    toast.success("File deleted!")
    fetchFiles()
  } catch (err) {
    toast.error(err.response ? err.response.data?.message : err.message)
  } finally {
    button.innerHTML = '<i class="ri-delete-bin-4-line"></i>'
    button.disabled = false
  }
}

const downloadFile = async (id, filename, button) => {
  try {
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'
    button.disabled = true
    const options = {
      responseType: "blob",
      ...getToken()
    }
    const { data } = await axios.get(`file/download/${id}`, options)
    const ext = data.type.split("/").pop()
    const url = URL.createObjectURL(data)
    const a = document.createElement("a")
    a.href = url
    a.download = filename + "." + ext
    a.click()
    a.remove()
  } catch (err) {
    if (!err.response) return toast.error(err.message)

    const error = await err.response.data.text()
    const { message } = JSON.parse(error)
    toast.error(message)
  } finally {
    button.innerHTML = '<i class="ri-download-line"></i>'
    button.disabled = false
  }
}

const openShareModal = (id, filename) => {
  try {
    new Swal({
      showConfirmButton: false,
      html: `
                <form 
  class="text-left flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
  onsubmit="shareFile('${id}', event)"
>

  <!-- Heading -->
  <div>
    <h1 class="text-2xl font-semibold text-gray-800">
      Share File via Email
    </h1>
    <p class="text-sm text-gray-500 mt-1">
      Enter recipient’s email address below
    </p>
  </div>

  <!-- Email Input -->
  <div class="flex flex-col gap-1">
    <label class="text-sm text-gray-600 font-medium">
      Recipient Email
    </label>

    <input
      class="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition w-full p-3 rounded-lg outline-none"
      placeholder="mail@gmail.com"
      name="email"
      required
      type="email"
    />
  </div>

  <!-- File info -->
  <div class="flex items-center gap-2 text-sm">
    <span class="text-gray-500">Sharing:</span>
    <span class="text-indigo-600 font-semibold truncate">
      ${filename}
    </span>
  </div>

  <!-- CTA Button -->
  <button
    class="bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] transition-all duration-150 text-white rounded-lg py-3 font-semibold shadow-sm"
    type="submit"
    id="send-file-btn"
  >
    Send Download Link
  </button>

</form>
            `,
    })
  } catch (err) {
    alert("Failure")
  }
}

const shareFile = async (id, e) => {
  const fileSendBtn = document.getElementById("send-file-btn")
  const form = e.target
  try {
    e.preventDefault()
    const email = form.elements.email.value.trim()
    const payload = {
      email,
      fileId: id,
    }
    fileSendBtn.disabled = true
    fileSendBtn.innerHTML = `
            <i class="fa fa-spinner fa-spin"></i> 
            sending
            `
    await axios.post("/file/share", payload, getToken());
    toast.success("File sent to the provided email")
  } catch (err) {
    toast.error(err.response ? err.response.data?.message : err.message)
  } finally {
    Swal.close();
  }
}

const uploadImage = () => {
    try {
      const input = document.createElement("input")
      const profilePic = document.getElementById("profile-pic")
      input.type = "file"
      input.accept = "image/*"
      input.click()
  
      input.onchange = async () => {
          const file = input.files[0];
          const formData = new FormData()
          formData.append('picture', file);
          await axios.post('/profile-pic', formData, getToken());
          const url = URL.createObjectURL(file);
          profilePic.src = url;
      }
    } catch (err) {
      toast.error(err.response ? err.response.data?.message : err.message);
    }
} 

const fetchImage = async () => {
  try {
    const options = {
      responseType: 'blob',
      ...getToken()
    }
    const {data} = await axios.get('/profile-pic', options);
    const url = URL.createObjectURL(data);
    const pic = document.getElementById("profile-pic");
    pic.src = url;
    
  } catch (err) {
    if(!err.response)
      return toast.error(err.message);
    
    const error = await (err.response.data).text();
    const {message} = JSON.parse(error);
    toast.error(message);
  }
}
