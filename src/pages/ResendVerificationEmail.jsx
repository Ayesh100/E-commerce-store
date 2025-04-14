const resendVerificationEmail = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://onlinestore.test/api/email/resend", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Failed to resend email", error);
    }
};
