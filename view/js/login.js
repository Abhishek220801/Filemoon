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

checkSession();

const login = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const formElements = form.elements;
        const {email, password} = formElements;
        const payload = {
            email: email.value,
            password: password.value,
        }
        const {data} = await axios.post('/login', payload);
        toast.success('Logging in...')
        localStorage.setItem('token', data.token);
        setTimeout(() => {
            location.href = '/dashboard'
        }, 2000);
    } catch (err) {
        toast.error(err.response ? err.response.data?.message : err.message)
    }
}
