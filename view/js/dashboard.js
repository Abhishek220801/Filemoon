window.onload = () => {
    showUserDetails();
}

const showUserDetails = async () => {
    const {firstname, lastname, email} = await getSession();
    const fullname = document.getElementById("fullname");
    const emailId = document.getElementById("email");
    fullname.innerText = firstname + ' ' + lastname;
    emailId.innerText = email;
}   