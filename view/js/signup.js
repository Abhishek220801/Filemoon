const toast = new Notyf({
    position: {x: 'right', y: 'top'}
});

const signup = async (e) => {
    try {
        e.preventDefault();
        const form = e.target;
        const elements = form.elements;
        const payload = {
            firstname: elements.firstname.value,
            lastname: elements.lastname.value,
            email: elements.email.value,
            password: elements.password.value,
        }
        const response = await axios.post('http://localhost:8080/signup', payload);
        toast.success(response?.data?.message);
    } catch (err) { 
        toast.error(err?.response?.data?.message);
    }
}