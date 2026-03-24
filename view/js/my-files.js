axios.defaults.baseURL = SERVER

const checkSession = async () => {
    const session = await getSession();
    
    if(!session){
        location.href = '/login';
        localStorage.clear();
        return;
    }
}

checkSession();

const toast = new Notyf({
    position: {x: 'right', y: 'top'}
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
        const form = e.target;
        const formData = new FormData(form);
        const {data} = await axios.post('/file', formData);
        toast.success('File uploaded successfully');
        form.reset();
        console.log(data);
    } catch (err) {
        throw err;
    }
}