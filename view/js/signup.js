axios.defaults.baseURL = SERVER

const toast = new Notyf({
    position: {x: 'right', y: 'top'}
});

const checkSession = async () => {
    const session = await getSession()

    if(session){
        location.href = '/dashboard'
    }
}

const signup = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const {firstname, lastname, email, mobile, password} = form.elements;
        const payload = {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            mobile: mobile.value,
            password: password.value,
        }
        const {data} = await axios.post('/signup', payload);
        form.reset();
        toast.success(data.message);
        setTimeout(() => {
            location.href = "/"
        }, 2000);

    } catch (err) { 
        toast.error(err.response ? err.response.data?.message : err.message);
    }
}