axios.defaults.baseURL = SERVER

window.onload = () => {
  fetchImage();
  showUserDetails()
  fetchFilesReport()
  fetchRecentUploads()
  fetchRecentShared()
}

const toast = new Notyf({
  position: { x: "center", y: "top" },
})

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
  return options
}

const getType = (type) => {
    const newType = type.split("/")[0];
    return newType;
}

const getSize = (size) => {
  const kb = size / 1000
  const mb = kb / 1000
  const gb = mb / 1000

  if (gb >= 1) return gb.toFixed(2) + " GB"
  if (mb >= 1) return mb.toFixed(2) + " MB"
  if (kb >= 1) return kb.toFixed(2) + " KB"

  return size + " B"
}

const showUserDetails = async () => {
  const { firstname, lastname, email } = await getSession()
  const fullname = document.getElementById("fullname")
  const emailId = document.getElementById("email")
  fullname.innerText = firstname + " " + lastname
  emailId.innerText = email
}

const fetchRecentUploads = async () => {
  try {
    const { data } = await axios.get("/files?limit=3", getToken())
    const recentUploads = document.getElementById("recent-uploads")
    for (let item of data) {
      const ui = `
                <div class="flex justify-between items-start">
                  <div>
                    <h1 class="font-medium text-zinc-500 capitalize">${item.filename}</h1>
                    <small>${getSize(item.size)}</small>
                  </div>
                  <p class="text-sm text-gray-600">${moment(item.createdAt).format("DD MMM YYYY hh:ss A")}</p>
                </div>
            `
      recentUploads.innerHTML += ui
    }
  } catch (err) {
    toast.error(err.response ? err.response.data?.message : err.message)
  }
}

const fetchRecentShared = async () => {
  try {
    const { data } = await axios.get("/files/shared?limit=3", getToken())
    const recentShared = document.getElementById("recent-shared")
    for (let item of data) {
      const ui = `
                <div class="flex justify-between items-start">
                    <div>
                    <h1 class="font-medium text-zinc-500">${item.file.filename}</h1>
                    <small>${item.receiverEmail}</small>
                    </div>
                    <p class="text-sm text-gray-600">${moment(item.createdAt).format("DD MMM YYYY, hh:mm A")}</p>
                    </div>
                    `
      recentShared.innerHTML += ui
    }
  } catch (err) {
    toast.error(err.response ? err.response.data?.message : err.message)
  }
}

const fetchFilesReport = async () => {
  try {
    const {data} = await axios.get('/dashboard', getToken());
    console.log(data);
    const reportCard = document.getElementById('report-card');
    for(let item of data)
    {
        const ui = `
        <div
              class="bg-white overflow-hidden rounded-lg relative shadow hover:shadow-lg h-40 flex flex-col items-center justify-center"
            >
              <h1 class="text-xl font-semibold text-gray-600 capitalize">${getType(item.type)}</h1>
              <p class="text-4xl font-bold">${item.total}</p>
              <div
                class="w-[100px] h-[100px] rounded-full absolute top-7 -left-4 flex justify-center items-center"
                style="
                  background-image: linear-gradient(
                    to right,
                    #b8cbb8 0%,
                    #b8cbb8 0%,
                    #b465da 0%,
                    #cf6cc9 33%,
                    #ee609c 66%,
                    #ee609c 100%
                  );
                "
              >
                <i class="ri-live-line text-4xl text-white"></i>
              </div>
            </div>
        `
        reportCard.innerHTML += ui
    }
  } catch (err) {
    toast.error(err.response ? err.response.data?.message : err.message)
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